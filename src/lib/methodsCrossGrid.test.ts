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
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Methods from "@/app/(app)/methods/page";
import CrossGridList, {
  CROSS_GRID_LEAD,
  CROSS_GRID_ROWS,
  CROSS_GRID_SUMMARY,
} from "@/components/CrossGridList";
import verdicts from "../../public/data/spectral/verdicts.json";
import cyclesJson from "../data/cycles.json";
import seriesJson from "../data/series.json";

// CEILING (Codex r3, 2026-10-09, after three rounds found matcher gaps): this test proves the
// cross-grid sentence and list equal what the frozen JSON says, inside the stretch of page
// and mirror they occupy. It does NOT prove the rest of /methods is true: a new false
// sentence elsewhere, a `hidden` attribute on the rows, or an edited number in the next
// sentence all pass it. Those belong to review and to the live rendered-text diff.
//
// The expected rows are built HERE from the three JSON files, sharing no code with
// CrossGridList (Codex r3: taking them from CROSS_GRID_ROWS let the same wrong value on both
// surfaces pass).
const ORACLE_SERIES_NAMES: Record<string, string> = {
  // The verdict's own lay_name for the 1913-onward cut (verdicts.json lay_text).
  wid_top1_wealth_1913: "US top 1% wealth share (1913 onward)",
};
const ORACLE_ROWS = verdicts.cross_grid.map((r) => {
  const cycle = (cyclesJson as { id: string; name: string }[]).find((c) => c.id === r.period_source_cycle_id)!;
  const who = cycle.name.split("—")[0].trim().replace(/\s*\(.*\)$/, "");
  const series =
    (seriesJson as { id: string; name: string }[]).find((s) => s.id === r.series_id)?.name ??
    ORACLE_SERIES_NAMES[r.series_id];
  return {
    pair: `${who}'s ${r.period_years}-year period × ${series}`,
    detail: `${r.span_years}y record · ${r.cycles_covered.toFixed(1)} periods · p ${(r.p as number).toFixed(3)} (AR(2) null: ${(r.p_ar2 as number).toFixed(3)})`,
  };
});

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
    expect(CROSS_GRID_SUMMARY).toBe(`The ${grid.length} re-pairings, cell by cell`);
    // Every oracle name resolved: a series id with no name would render "undefined".
    expect(ORACLE_ROWS.every((r) => !r.pair.includes("undefined"))).toBe(true);
  });

  it("/methods renders the sentence exactly", () => {
    expect(visible(html)).toContain(SENTENCE);
  });

  it("/methods links the full table to verdicts.json, with no space before the period", () => {
    expect(html).toMatch(
      /href="\/data\/spectral\/verdicts\.json"[^>]*>the full table \(machine-readable\)<\/a>\. A 54-/,
    );
  });

  // Codex r2: extracting the first <details>, the first lead and the rows that matched one
  // shape let a 20th plain <li>, an extra paragraph and a second disclosure through. So the
  // claim is now about the WHOLE stretch of page between the two paragraphs that bound it:
  // it is exactly the component, and the component's text is exactly summary + lead + rows.
  it("/methods renders exactly the list between its bounding paragraphs, once", () => {
    const list = renderToStaticMarkup(createElement(CrossGridList));
    const start = html.indexOf("one ~54–55-year statement.</p>");
    const end = html.indexOf("<p>The failed-detection precedents");
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    expect(html.slice(start + "one ~54–55-year statement.</p>".length, end)).toBe(list);
    expect(html.split("<details").length - 1).toBe(1);
  });

  it("the list's text is the summary, the lead and every row in order, and nothing else", () => {
    const list = renderToStaticMarkup(createElement(CrossGridList));
    expect(visible(list)).toBe(
      `The ${grid.length} re-pairings, cell by cell` +
        CROSS_GRID_LEAD +
        ORACLE_ROWS.map((r) => r.pair + r.detail).join(""),
    );
    expect(list.split("<li").length - 1).toBe(grid.length);
    expect(list.split("<p").length - 1).toBe(1 + 2 * grid.length);
  });

  it("public/methods.md carries the same sentence, link included", () => {
    expect(md.replace(/\s+/g, " ")).toContain(
      SENTENCE.replace(
        "the full table (machine-readable).",
        "[the full table (machine-readable)](https://sinusoidalhistory.com/data/spectral/verdicts.json).",
      ),
    );
  });

  // Codex r2: a row counter keyed to one number format missed an extra row written "144
  // years record". The whole bounded section must equal what the JSON says, byte for byte.
  it("public/methods.md carries exactly the same list, between its bounding paragraphs, once", () => {
    // Bounded at the same two places as the page (Codex r3: a summary-anchored start let an
    // invented row ABOVE the list pass).
    const expected =
      `\n\n**The ${grid.length} re-pairings, cell by cell.** ${CROSS_GRID_LEAD}\n\n` +
      ORACLE_ROWS.map((r) => `- ${r.pair} — ${r.detail}`).join("\n");
    const anchor = "one ~54–55-year statement.";
    const start = md.indexOf(anchor);
    const end = md.indexOf("\n\nThe failed-detection precedents");
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    expect(md.slice(start + anchor.length, end)).toBe(expected);
    expect(md.split(CROSS_GRID_SUMMARY).length - 1).toBe(1);
  });

  it("no surface still points at a label no page shows", () => {
    expect(visible(html)).not.toContain("labelled as re-pairings");
    expect(md).not.toContain("labelled as re-pairings");
  });
});
