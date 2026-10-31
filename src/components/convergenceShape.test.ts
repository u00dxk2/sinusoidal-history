// I-055 + I-059 (2026-10-20): the editor's note and the range strip changed SHAPE after two
// reworded versions failed cold walks. These legs pin the shape, read from source, so a later
// edit cannot quietly put the display line or the mean curve back. Ceiling (declared): the
// source read sees these two files only, not the rendered page; the production size/path read
// and the rendered `main` innerText multiset are the proof, and a cold walk is the bar.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BRUSH_CAPTION, widenedNote } from "./TimeRangeBrush";

const src = (name: string) => readFileSync(join(process.cwd(), "src", "components", name), "utf8");

// I-072: the over-attribution, in every wording it has been published in on this site: the
// theorists anchored the peaks, we read them because their peaks land now, and the cluster is
// a selection effect. Each alternative is a phrase that was live on 2026-10-30.
const SITE_OVERCLAIM =
  /each theorist|anchored (the|their) cycle|anchor their forecasts|we read (them|these)|their (climaxes|forecasts) (happen to )?land|selection effect|don't get republished/i;

// Every surface that explains the cluster: the pages, their markdown mirrors, the crawler
// summary and the README's editorial paragraph. A new surface joins this list. README.md is read
// only between its two markers, because its changelog lines quote the old wording as history.
const CLUSTER_SURFACES: { path: string; from?: string; to?: string }[] = [
  { path: "src/components/ConvergenceNote.tsx" },
  { path: "src/app/(app)/about/page.tsx" },
  { path: "public/about.md" },
  { path: "src/app/(app)/colophon/page.tsx" },
  { path: "public/colophon.md" },
  { path: "public/llms.txt" },
  { path: "README.md", from: "The headline editorial point", to: "## Status" },
];

// Visible prose of a surface. Source files: whole-line `//` comments and block comments are
// dropped (they quote the old wording), never a `//` inside a line, which is a URL (Codex r1 on
// 34f2e56). Tags become spaces, so a phrase split by markup still reads as one.
function prose(path: string, raw: string): string {
  let text = raw;
  if (/\.tsx?$/.test(path)) {
    text = text.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
    text = text.replace(/\{" "\}/g, " ").replace(/<[^>]*>/g, " ");
  }
  return text.replace(/&apos;/g, "'").replace(/\s+/g, " ");
}

describe("no surface says the theorists anchored the peaks (I-072)", () => {
  for (const { path, from, to } of CLUSTER_SURFACES) {
    it(path, () => {
      let raw = readFileSync(join(process.cwd(), path), "utf8");
      if (from && to) {
        const start = raw.indexOf(from);
        const end = raw.indexOf(to, start);
        expect(start, `${path}: "${from}" marker`).toBeGreaterThan(-1);
        expect(end, `${path}: "${to}" marker`).toBeGreaterThan(start);
        raw = raw.slice(start, end);
      }
      expect(prose(path, raw)).not.toMatch(SITE_OVERCLAIM);
    });
  }

  it("reads a phrase split by markup and one after a URL on the same line", () => {
    expect(prose("x.tsx", "a selection <em>effect</em> b")).toMatch(SITE_OVERCLAIM);
    expect(prose("x.tsx", 'href="https://x.org" each theorist')).toMatch(SITE_OVERCLAIM);
    expect(prose("x.tsx", "// a selection effect, quoted in a comment")).not.toMatch(SITE_OVERCLAIM);
  });
});

// The note's visible text in source order: JSX tags, `{" "}` and the entity unescaped.
function noteText(source: string): string {
  const body = source.slice(source.indexOf("<aside"), source.indexOf("</aside>"));
  return body
    .replace(/\{" "\}/g, " ")
    .replace(/&apos;/g, "'")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

describe("the editor's note has no display line (I-055)", () => {
  const source = src("ConvergenceNote.tsx");

  it("sets nothing above body size and nothing in the display face", () => {
    const sizes = [...source.matchAll(/text-\[(\d+)px\]/g)].map((m) => Number(m[1]));
    expect(sizes.length).toBeGreaterThan(0);
    expect(Math.max(...sizes)).toBeLessThanOrEqual(15);
    expect(source).not.toMatch(/font-display/);
  });

  it("leads with its label, then a first sentence that states the correction, not the pattern", () => {
    const text = noteText(source);
    expect(text.startsWith("Editor's note ")).toBe(true);
    const first = text.slice("Editor's note ".length).split(/(?<=\.)\s/)[0];
    expect(first).not.toMatch(/\bpeak|\bcrest|near the present|\bconverge(?!nce)/i);
    // "convergence" may appear only as the thing denied.
    for (const m of first.matchAll(/convergence/gi)) {
      expect(first.slice(Math.max(0, m.index! - 4), m.index)).toBe("not ");
    }
    // I-072 (2026-10-31): this pin required "selection effect", a CAUSE the cycles.json
    // rationales cannot carry (Codex r2 on I-063: UNVERIFIABLE). The first sentence now states
    // the correction the site can stand behind: the clustered years are not evidence.
    expect(first).toMatch(/not evidence/i);
  });

  // I-072: several reference peaks are this site's own constructions (Huntington's interval
  // midpoint, Schlesinger Jr.'s "this project's construction", Khaldun's editorial choice), so the
  // note says where the years come from and never that the theorists anchored them.
  it("names both sources of the peak years and claims no cause for the cluster", () => {
    const text = noteText(source);
    expect(text).toMatch(/dates the theorists themselves gave/);
    expect(text).toMatch(/this site's choices/);
    expect(text).not.toMatch(SITE_OVERCLAIM);
  });

  // I-066: the strip moved from under this note to above the tabs, so a direction word goes stale.
  it("points at the strip without saying where it is", () => {
    expect(noteText(source)).not.toMatch(/\b(below|above|beneath|underneath)\b/i);
  });

  // I-065: a period that would run past today is cut there, so it is "at most" one period.
  it("never says each cycle IS one period", () => {
    // `\s+` keeps this line out of I-065's own readCommand grep, which scans src/.
    expect(noteText(source)).not.toMatch(/draws each cycle as one\s+period/i);
  });
});

// I-066 (2026-10-25): on a phone the strip sat after all ten facet rows, ~2,500px below the
// overview it zooms. It now follows the overview, before the tabs. Source order pin; the
// measured proof is scripts/check-strip-near-chart.mjs on the rendered page.
describe("the range strip sits next to the chart it zooms (I-066)", () => {
  const viz = src("Viz.tsx");
  const at = (needle: RegExp) => {
    const i = viz.search(needle);
    expect(i, String(needle)).toBeGreaterThan(-1);
    return i;
  };

  it("renders the strip after the phone overview and before the tabs", () => {
    expect(viz.match(/<TimeRangeBrush\b/g)).toHaveLength(1);
    expect(at(/<TimeRangeBrush\b/)).toBeGreaterThan(at(/<CycleOverview\b/));
    expect(at(/<TimeRangeBrush\b/)).toBeLessThan(at(/<Tabs\s/));
  });

  // Codex r1: a CSS `order-*` utility could move the strip back below the facets while the
  // source order above stays green. Viz orders its blocks in the DOM only. This catches the common
  // Tailwind forms (`order-1`, `sm:order-first`, `order-[…]`) and nothing more. Ceiling (declared
  // after Codex r2 found a second gap, `order-(--x)` and `[order:…]`; the matcher is not grown
  // again): CI does not run the rendered checker, scripts/check-strip-near-chart.mjs, which is the
  // proof of where the strip is.
  it("uses none of the common Tailwind order utilities", () => {
    expect(viz).not.toMatch(/\border-(?:first|last|none|\d+|\[)/);
  });
});

describe("the range strip draws time only (I-059)", () => {
  const source = src("TimeRangeBrush.tsx");

  it("draws no data path and computes no cycle values", () => {
    expect(source).not.toMatch(/<path\b/);
    expect(source).not.toMatch(/sineAtYear|d3-shape/);
    expect(source).not.toMatch(/\bcycles\s*:/);
  });

  it("captions the strip as a control, not as a curve", () => {
    expect(BRUSH_CAPTION).toBe("Drag across the strip to choose the years the chart shows.");
    expect(BRUSH_CAPTION).not.toMatch(/curve|mean|average/i);
    // I-064: on a phone the chart is far up the page; the caption does not send the reader there.
    expect(BRUSH_CAPTION).not.toMatch(/\babove\b|scroll/i);
  });

  // I-062: a widened drag says so, in place, and claims nothing about any cycle.
  it("states the floor, and nothing about the cycles or the reader's drag", () => {
    const note = widenedNote(150);
    expect(note).toBe("Widened to 150 years, the shortest view this chart draws.");
    expect(note).not.toMatch(/peak|crest|wave|cycle|now|today/i);
    // No years: a quoted drag went stale when a later pan left the window unchanged (10-22 walk).
    expect(note).not.toMatch(/\b1[6-9]\d\d\b|\b20\d\d\b/);
  });

  // Source pins only. The interaction proof is the Playwright drag read (tmp/i062-drag.mjs).
  it("source: one polite live region UNDER the strip, set by a gesture's outcome, cleared by a preset", () => {
    expect(source).toMatch(/aria-live="polite"/);
    expect(source.match(/aria-live=/g)).toHaveLength(1);
    // I-064: the status sits after the strip's svg, so its height never moves the strip.
    expect(source.indexOf("aria-live=")).toBeGreaterThan(source.indexOf("</svg>"));
    expect(source).toMatch(/setStatus\(\(prev\) => nextStatus\(prev, r, visibleStartYear, visibleEndYear\)\);/);
    expect(source).toMatch(/onClick=\{\(\) => \{\s*\/\/[^\n]*\n\s*setStatus\(null\);/);
    // A pointer event alone never sets or clears it (r2: a press that changed nothing erased the note).
    expect(source).not.toMatch(/\.on\("start"[\s\S]{0,160}setStatus/);
  });
});
