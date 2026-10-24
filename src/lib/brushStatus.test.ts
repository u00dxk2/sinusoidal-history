// I-064 (2026-10-24): the zoom strip says what each gesture did. These legs pin the outcome of a
// brush gesture (resolveBrushEnd) and the sentence the strip shows for it (brushStatus). The
// interaction proof is check-brush-widened.mjs on production and a cold walk; this is the logic.
import { describe, expect, it } from "vitest";
import { brushStatus, nextStatus, resolveBrushEnd } from "./brushStatus";

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

describe("brushStatus: the sentence under the strip", () => {
  it("names the floor, then the chart's window, and says when that window is a preset", () => {
    const s = brushStatus({ outcome: "widened", start: 1900, end: 2050 });
    expect(s.widened).toBe("Widened to 150 years, the shortest view this chart draws.");
    expect(s.rest).toBe("Chart now shows 1900–2050, the same as Modern.");
  });

  it("says a pan moved the selection, and how to pick new years", () => {
    const s = brushStatus({ outcome: "moved", start: 1800, end: 1950 });
    expect(s.widened).toBeNull();
    expect(s.rest).toBe("Moved the selection; drag outside it to pick new years. Chart now shows 1800–1950.");
  });

  it("states the window for a chosen drag and for a reset", () => {
    expect(brushStatus({ outcome: "chosen", start: 1700, end: 1900 }).rest).toBe("Chart now shows 1700–1900.");
    expect(brushStatus({ outcome: "chosen", start: 1750, end: 2050 }).rest).toBe("Chart now shows 1750–2050, the same as Industrial.");
    expect(brushStatus({ outcome: "reset", start: 1600, end: 2050 }).rest).toBe("Chart now shows every year, 1600–2050.");
  });

  it("points nowhere off screen and claims nothing about the cycles", () => {
    for (const outcome of ["widened", "moved", "chosen", "reset"] as const) {
      const s = brushStatus({ outcome, start: 1900, end: 2050 });
      const text = `${s.widened ?? ""} ${s.rest}`;
      expect(text).not.toMatch(/\babove\b|\bbelow\b|scroll/i);
      expect(text).not.toMatch(/peak|crest|wave|cycle|\bnow\b(?! shows)|today/i);
    }
  });
});
