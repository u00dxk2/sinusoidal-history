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
    expect(first).toMatch(/selection effect/i);
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
    expect(BRUSH_CAPTION).toBe("Drag across the strip to zoom the chart above.");
    expect(BRUSH_CAPTION).not.toMatch(/curve|mean|average/i);
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
  it("source: a polite live region, set by a widened drag, cleared by a preset or a changed window", () => {
    expect(source).toMatch(/aria-live="polite"/);
    expect(source).toMatch(/setWidened\(\{ start: wide\.start, end: wide\.end \}\)/);
    expect(source).toMatch(/onClick=\{\(\) => \{\s*\/\/[^\n]*\n\s*setWidened\(null\);/);
    expect(source).toMatch(/if \(start !== visibleStartYear \|\| end !== visibleEndYear\) setWidened\(null\);/);
    // A pointer event alone never clears it (r2: a press that changed nothing erased the note).
    expect(source).not.toMatch(/\.on\("start"[^)]*\)[\s\S]{0,120}setWidened/);
  });
});
