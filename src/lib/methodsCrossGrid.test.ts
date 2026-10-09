// 2026-10-09 (W-004 cold walk, step 5): /methods said "A secondary cross-grid panel re-pairs
// each period with every series long enough to clear the gate (19 cells, …)" and stopped. No
// page renders that panel, so a cold reader could not find it and read the sentence as hinting
// at a result it never gave. The passage must say what the panel found and where to read it,
// with every number derived from the frozen verdicts.json, never typed.
//
// Codex r1 (2026-10-09): the first version checked fragments anywhere in the document, so a
// swapped pair of rows, a duplicate row, an edited lead and a broken link all passed. Every
// check below compares a WHOLE block, in order, against what the JSON says it must be.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Methods from "@/app/(app)/methods/page";
import {
  CROSS_GRID_LEAD,
  CROSS_GRID_ROWS,
  CROSS_GRID_SUMMARY,
} from "@/components/CrossGridList";
import verdicts from "../../public/data/spectral/verdicts.json";

const grid = verdicts.cross_grid;
const significant = grid.filter((r) => r.holm_significant || r.holm_significant_ar2).length;
const lowestP = Math.min(...grid.flatMap((r) => [r.p as number, r.p_ar2 as number])).toFixed(3);

// The sentence as a reader gets it, links included only as their text.
const SENTENCE = `A secondary cross-grid panel re-pairs each period with every series long enough to clear the gate: ${grid.length} re-pairings, not the site's claims. Under either null, none reaches p < 0.05 even before any correction (lowest unadjusted p ${lowestP}), so none survives Holm correction. They are listed below, and in the full table (machine-readable). A 54- and a 55-year period`;

function decode(s: string): string {
  return s
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// Tags removed with NO space, so a stray space or a missing one in the real output shows.
function visible(html: string): string {
  return decode(html.replace(/<!-- -->/g, "").replace(/<[^>]+>/g, "")).replace(/\s+/g, " ");
}

const html = renderToStaticMarkup(Methods() as Parameters<typeof renderToStaticMarkup>[0]);
const md = readFileSync(join(process.cwd(), "public", "methods.md"), "utf8").replace(/\r\n/g, "\n");

describe("/methods says what the cross-grid re-pairings found", () => {
  it("the frozen data still supports the sentence", () => {
    expect(grid.length).toBe(19);
    expect(grid.every((r) => r.eligible)).toBe(true);
    // Manager review 6103ce43: p is the raw bootstrap p; Holm only sets the flags. "None
    // reaches 0.05 before correction, so none survives Holm" holds only while all of these do.
    expect(significant).toBe(0);
    expect(Number(lowestP)).toBeGreaterThanOrEqual(0.05);
    expect(CROSS_GRID_ROWS.length).toBe(grid.length);
  });

  it("/methods renders the sentence exactly", () => {
    expect(visible(html)).toContain(SENTENCE);
  });

  it("/methods links the full table to verdicts.json, with no space before the period", () => {
    expect(html).toMatch(
      /href="\/data\/spectral\/verdicts\.json"[^>]*>the full table \(machine-readable\)<\/a>\. A 54-/,
    );
  });

  it("/methods renders the list's summary, lead and every row, in order, once", () => {
    const block = html.match(/<details[^>]*>([\s\S]*?)<\/details>/);
    expect(block).not.toBeNull();
    const summary = visible(block![1].match(/<summary[^>]*>([\s\S]*?)<\/summary>/)![1]).trim();
    const lead = visible(block![1].match(/<\/summary>\s*<p[^>]*>([\s\S]*?)<\/p>/)![1]).trim();
    const rows = [...block![1].matchAll(/<li[^>]*>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/li>/g)].map(
      (m) => [visible(m[1]).trim(), visible(m[2]).trim()],
    );
    expect(summary).toBe(CROSS_GRID_SUMMARY);
    expect(lead).toBe(CROSS_GRID_LEAD);
    expect(rows).toEqual(CROSS_GRID_ROWS.map((r) => [r.pair, r.detail]));
  });

  it("public/methods.md carries the same sentence, link included", () => {
    expect(md.replace(/\s+/g, " ")).toContain(
      SENTENCE.replace(
        "the full table (machine-readable).",
        "[the full table (machine-readable)](https://sinusoidalhistory.com/data/spectral/verdicts.json).",
      ),
    );
  });

  it("public/methods.md carries the same list, in order, and no other row", () => {
    const expected =
      `**${CROSS_GRID_SUMMARY}.** ${CROSS_GRID_LEAD}\n\n` +
      CROSS_GRID_ROWS.map((r) => `- ${r.pair} — ${r.detail}`).join("\n");
    expect(md).toContain(expected);
    const rowLines = md.split("\n").filter((l) => / × .+ — \d+y record · /.test(l));
    expect(rowLines.length).toBe(CROSS_GRID_ROWS.length);
  });

  it("no surface still points at a label no page shows", () => {
    expect(visible(html)).not.toContain("labelled as re-pairings");
    expect(md).not.toContain("labelled as re-pairings");
  });
});
