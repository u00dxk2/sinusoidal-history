// 2026-10-09 (W-004 cold walk, step 5): /methods said "A secondary cross-grid panel re-pairs
// each period with every series long enough to clear the gate (19 cells, …)" and stopped. No
// page renders that panel, so a cold reader could not find it and read the sentence as hinting
// at a result it never gave. The passage must say what the panel found and where to read it,
// with every number derived from the frozen verdicts.json, never typed.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Methods from "@/app/(app)/methods/page";
import { CROSS_GRID_ROWS } from "@/components/CrossGridList";
import verdicts from "../../public/data/spectral/verdicts.json";

const grid = verdicts.cross_grid;
const significant = grid.filter((r) => r.holm_significant || r.holm_significant_ar2).length;
const lowestP = Math.min(...grid.flatMap((r) => [r.p as number, r.p_ar2 as number])).toFixed(3);

// The cross-grid passage: from "cross-grid" to the Kondratiev/Perez resolution sentence that
// follows it on both surfaces.
function passage(text: string): string {
  const flat = text.replace(/\s+/g, " ");
  const start = flat.indexOf("A secondary cross-grid");
  const end = flat.indexOf("A 54- and a 55-year period", start);
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return flat.slice(start, end);
}

function methodsText(): string {
  return renderToStaticMarkup(Methods() as Parameters<typeof renderToStaticMarkup>[0])
    .replace(/<!-- -->/g, "")
    // Keep a link's target in the text, so the passage check sees where it points.
    .replace(/<a [^>]*href="([^"]+)"[^>]*>/g, " [$1] ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&");
}

const surfaces: [string, () => string][] = [
  ["/methods", methodsText],
  ["public/methods.md", () => readFileSync(join(process.cwd(), "public", "methods.md"), "utf8")],
];

describe("/methods says what the cross-grid re-pairings found", () => {
  it("the frozen data this reads is what the sentence will describe", () => {
    expect(grid.length).toBe(19);
    expect(grid.every((r) => r.eligible)).toBe(true);
  });

  it.each(surfaces)("%s states the count, the outcome and where to read the cells", (_, read) => {
    const p = passage(read());
    expect(p).toContain(`${grid.length} re-pairings, not the site's claims`);
    // Manager review 6103ce43: p is the raw bootstrap p; Holm only sets the flags. So the
    // sentence says no cell reaches 0.05 before correction, hence none survives Holm. That
    // is only true while every p under both nulls is at or above 0.05.
    expect(significant).toBe(0);
    expect(Number(lowestP)).toBeGreaterThanOrEqual(0.05);
    expect(p).toMatch(/none reaches p < 0\.05 even before any correction/);
    expect(p).toContain("none survives Holm correction");
    expect(p).toContain(`lowest unadjusted p ${lowestP}`);
    expect(p).toContain("verdicts.json");
    // "labelled as re-pairings" pointed at a label no page showed.
    expect(p).not.toContain("labelled as");
  });

  it.each(surfaces)("%s lists every cell with its p under both nulls", (_, read) => {
    const text = read().replace(/\s+/g, " ");
    for (const r of CROSS_GRID_ROWS) {
      expect(text).toContain(r.pair);
      expect(text).toContain(r.detail);
    }
  });
});
