// I-064 (2026-10-24): the zoom strip says what each gesture did. These legs pin the outcome of a
// brush gesture (resolveBrushEnd) and the sentence the strip shows for it (brushStatus). The
// interaction proof is check-brush-widened.mjs on production and a cold walk; this is the logic.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  brushStatus,
  drawnEndNote,
  drawnEndNoteNarrow,
  nextStatus,
  resolveBrushEnd,
} from "./brushStatus";
import { DEFAULT_YEAR_RANGE, RANGE_PRESET_OPTIONS } from "./siteConfig";
import { parseCsvSeries } from "./csvSeries";
import seriesJson from "@/data/series.json";
import annotationsJson from "@/data/annotations.json";

const FULL = { fullStart: 1600, fullEnd: 2050 };
const MODERN = { visibleStart: 1900, visibleEnd: 2050 };

describe("resolveBrushEnd: what a gesture did to the chart's window", () => {
  it("a short new drag near the present widens to the floor, about its centre", () => {
    const r = resolveBrushEnd({ mode: "selection", lo: 2000, hi: 2030, visibleStart: 1600, visibleEnd: 2050, ...FULL });
    expect(r).toEqual({ outcome: "widened", start: 1900, end: 2050 });
  });

  it("a long new drag is taken as drawn", () => {
    const r = resolveBrushEnd({ mode: "selection", lo: 1700, hi: 1900, visibleStart: 1600, visibleEnd: 2050, ...FULL });
    expect(r).toEqual({ outcome: "chosen", start: 1700, end: 1900 });
  });

  it("a cleared selection or a near-click shows every year", () => {
    expect(resolveBrushEnd({ mode: "selection", lo: null, hi: null, ...MODERN, ...FULL })).toEqual({ outcome: "reset", start: 1600, end: 2050 });
    expect(resolveBrushEnd({ mode: "selection", lo: 1950, hi: 1953, ...MODERN, ...FULL })).toEqual({ outcome: "reset", start: 1600, end: 2050 });
  });

  // Manager review 704be81e: each edge is rounded on its own, so a pan of a 150-year box can read
  // as 149 years. Classified by the start event's mode, a pan keeps the span exactly.
  it("a pan at the floor span reads as moved, keeps 150 years, and never as widened", () => {
    for (const [lo, hi] of [[1800, 1949], [1800, 1951], [1801, 1950]]) {
      const r = resolveBrushEnd({ mode: "drag", lo, hi, ...MODERN, ...FULL });
      expect(r.outcome).toBe("moved");
      expect(r.end - r.start).toBe(150);
      expect(r.start).toBe(lo);
    }
  });

  it("a pan is kept inside the chart", () => {
    const r = resolveBrushEnd({ mode: "drag", lo: 1590, hi: 1739, visibleStart: 1700, visibleEnd: 1850, ...FULL });
    expect(r).toEqual({ outcome: "moved", start: 1600, end: 1750 });
  });
});

describe("nextStatus: a press that changes nothing keeps the sentence shown", () => {
  const widened = { outcome: "widened", start: 1900, end: 2050 } as const;

  it("a still press on a handle keeps the widening sentence (Codex r1)", () => {
    const still = resolveBrushEnd({ mode: "handle", lo: 1900, hi: 2050, ...MODERN, ...FULL });
    expect(still.outcome).toBe("chosen");
    expect(nextStatus(widened, still, 1900, 2050)).toBe(widened);
  });

  it("a still press inside the box keeps it too", () => {
    const still = resolveBrushEnd({ mode: "drag", lo: 1900, hi: 2050, ...MODERN, ...FULL });
    expect(nextStatus(widened, still, 1900, 2050)).toBe(widened);
  });

  it("a short drag at Modern still says it widened, onto the window already shown", () => {
    const short = resolveBrushEnd({ mode: "selection", lo: 2000, hi: 2030, ...MODERN, ...FULL });
    expect(nextStatus(null, short, 1900, 2050)).toEqual(widened);
    const chosen = { outcome: "chosen", start: 1900, end: 2050 } as const;
    expect(nextStatus(chosen, short, 1900, 2050)).toEqual(widened);
  });

  // Codex r2: at a preset (nothing shown), a still press inside the box said "Moved the selection".
  it("an unchanged gesture with nothing shown for this window says nothing", () => {
    const stillInBox = resolveBrushEnd({ mode: "drag", lo: 1900, hi: 2050, ...MODERN, ...FULL });
    const stillOnHandle = resolveBrushEnd({ mode: "handle", lo: 1900, hi: 2050, ...MODERN, ...FULL });
    const stale = { outcome: "moved", start: 1800, end: 1950 } as const;
    for (const still of [stillInBox, stillOnHandle]) {
      expect(nextStatus(null, still, 1900, 2050)).toBeNull();
      expect(nextStatus(stale, still, 1900, 2050)).toBeNull();
    }
  });

  it("a changed window always replaces the sentence", () => {
    const pan = resolveBrushEnd({ mode: "drag", lo: 1850, hi: 2000, ...MODERN, ...FULL });
    expect(nextStatus(widened, pan, 1900, 2050)).toBe(pan);
  });
});

// The year these legs treat as the present. The component passes the UTC year (Viz.tsx).
const YEAR = 2026;

describe("brushStatus: the sentence under the strip", () => {
  it("names the floor, then the chart's window, and says when that window is a preset", () => {
    const s = brushStatus({ outcome: "widened", start: 1900, end: 2050 }, YEAR);
    expect(s.widened).toBe("Widened to 150 years, the shortest view this chart draws.");
    expect(s.rest).toBe("Chart now shows 1900–2050, the same as Modern. Nothing is drawn after 2026.");
  });

  it("says a pan moved the selection, and how to pick new years", () => {
    const s = brushStatus({ outcome: "moved", start: 1800, end: 1950 }, YEAR);
    expect(s.widened).toBeNull();
    expect(s.rest).toBe("Moved the selection; drag outside it to pick new years. Chart now shows 1800–1950.");
  });

  it("states the window for a chosen drag and for a reset", () => {
    expect(brushStatus({ outcome: "chosen", start: 1700, end: 1900 }, YEAR).rest).toBe("Chart now shows 1700–1900.");
    expect(brushStatus({ outcome: "chosen", start: 1750, end: 2050 }, YEAR).rest).toBe(
      "Chart now shows 1750–2050, the same as Industrial. Nothing is drawn after 2026.",
    );
    expect(brushStatus({ outcome: "reset", start: 1600, end: 2050 }, YEAR).rest).toBe(
      "Chart now shows every year, 1600–2050. Nothing is drawn after 2026.",
    );
  });

  it("points nowhere off screen and claims nothing about the cycles", () => {
    for (const outcome of ["widened", "moved", "chosen", "reset"] as const) {
      const s = brushStatus({ outcome, start: 1900, end: 2050 }, YEAR);
      const text = `${s.widened ?? ""} ${s.rest}`;
      expect(text).not.toMatch(/\babove\b|\bbelow\b|scroll/i);
      expect(text).not.toMatch(/peak|crest|wave|cycle|\bnow\b(?! shows)|today/i);
    }
  });
});

// I-068 (2026-11-11): the axis runs to 2050, but nothing after the current year is drawn (I-061).
// The 10-24 cold walker asked "what is being drawn for 2026–2050". Every window that runs past
// the current year says so: in the readout on every load, and in the status line after a gesture.
describe("drawnEndNote: a window past the current year says nothing is drawn after it", () => {
  it("names the current year, derived, never a hard-coded one", () => {
    expect(drawnEndNote(2050, 2026)).toBe("nothing drawn after 2026");
    expect(drawnEndNote(2050, 2031)).toBe("nothing drawn after 2031");
    expect(drawnEndNoteNarrow(2050, 2026)).toBe("none drawn after 2026");
  });

  it("is said on the default window and on every preset", () => {
    for (const p of RANGE_PRESET_OPTIONS) {
      expect(drawnEndNote(p.end, YEAR), p.label).toBe("nothing drawn after 2026");
      expect(drawnEndNoteNarrow(p.end, YEAR), p.label).toBe("none drawn after 2026");
    }
    expect(drawnEndNote(DEFAULT_YEAR_RANGE.end, YEAR)).not.toBeNull();
  });

  it("adds no words to a window that ends by the current year", () => {
    expect(drawnEndNote(2026, 2026)).toBeNull();
    expect(drawnEndNote(1900, 2026)).toBeNull();
    expect(drawnEndNoteNarrow(1950, 2026)).toBeNull();
    expect(brushStatus({ outcome: "chosen", start: 1700, end: 1900 }, YEAR).rest).not.toMatch(/drawn after/);
  });

  it("the status line and the readout say the same year", () => {
    const s = brushStatus({ outcome: "chosen", start: 1750, end: 2050 }, 2031);
    expect(s.rest).toMatch(/Nothing is drawn after 2031\.$/);
    expect(drawnEndNote(2050, 2031)).toMatch(/after 2031$/);
  });
});

// The note is true of the data only because of what the data files hold: neither the series
// parser nor the event layer caps at the current year (Codex r1 on 0042ee4). These legs make a
// row or an event dated after it fail here, before the readout can say something false.
describe("nothing the chart loads is dated after the current year", () => {
  const year = new Date().getUTCFullYear();

  it("every series the chart loads ends by the current year", () => {
    expect(seriesJson.length).toBeGreaterThan(0);
    for (const s of seriesJson) {
      const text = readFileSync(join(process.cwd(), "public", s.data_file), "utf8");
      const points = parseCsvSeries(text, s.year_column, s.value_column);
      expect(points.length, s.data_file).toBeGreaterThan(0);
      expect(points[points.length - 1].year, s.data_file).toBeLessThanOrEqual(year);
    }
  });

  it("every event marker is dated by the current year", () => {
    expect(annotationsJson.length).toBeGreaterThan(0);
    for (const a of annotationsJson) expect(a.year, a.id).toBeLessThanOrEqual(year);
  });
});

// The readout renders the note: a source pin, because the strip renders client-side and
// check-rendered-text cannot see it (docs/rendered-text-gate.md). The live proof is the in-page read.
describe("TimeRangeBrush renders the drawn-end note in its readout", () => {
  const src = readFileSync(join(process.cwd(), "src", "components", "TimeRangeBrush.tsx"), "utf8");
  const viz = readFileSync(join(process.cwd(), "src", "components", "Viz.tsx"), "utf8");

  it("computes both forms from the visible end and the current year", () => {
    expect(src).toMatch(/drawnEndNote\(visibleEndYear, currentYear\)/);
    expect(src).toMatch(/drawnEndNoteNarrow\(visibleEndYear, currentYear\)/);
    expect(src).toMatch(/brushStatus\(status, currentYear\)/);
  });

  it("puts each form in the readout, one per width", () => {
    const readout = src.slice(src.indexOf("data-range-readout"), src.indexOf("RANGE_PRESET_OPTIONS.map"));
    expect(readout).toMatch(/data-range-drawn-end\b[^>]*max-\[345px\]:hidden[^>]*>\s*\{endNote\}/);
    expect(readout).toMatch(/data-range-drawn-end-narrow[^>]*hidden max-\[345px\]:inline[^>]*>\s*\{endNoteNarrow\}/);
  });

  // Codex r2: one boundary for the component and the production checker, or a width between
  // them reads a false RED.
  it("the production checker switches forms at the component's width", () => {
    const checker = readFileSync(join(process.cwd(), "scripts", "check-brush-widened.mjs"), "utf8");
    const bp = Number(/max-\[(\d+)px\]:hidden/.exec(src)?.[1]);
    expect(bp).toBe(345);
    expect(checker).toContain(`vw < ${bp} ? "none" : "nothing"`);
  });

  it("is handed Viz's UTC year", () => {
    // [^>]: stay inside this one element (a lazy [\s\S] ran on to a later prop and passed on the old code).
    expect(viz).toMatch(/<TimeRangeBrush\b[^>]*\bcurrentYear=\{currentYear\}[^>]*\/>/);
  });
});
