// I-070 (2026-11-01): the phone line under the home H1 read "Long-wave history, 1600–2050."
// It called 24 years past today "history" though every curve stops at today (I-061), and it kept
// naming 1600–2050 after a zoom showed a narrower window. It now carries no year at all, so it
// cannot contradict the chart below it, whatever window the reader picks.
//
// CEILING (declared): this reads the source of ONE line, the home page's phone-only
// (`sm:hidden`) span inside the dek paragraph. It does not claim the site no longer says 2050:
// the zoom readout's "every year, 1600–2050" is I-068, and the desktop dek names the axis on
// purpose ("on one 1600–2050 axis … cut at today"). Whether the line fits one row at 320px is
// check-entry-folds' question, not this test's.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const PAGE = join(process.cwd(), "src", "app", "(app)", "page.tsx");

/** The text of every `<span className="sm:hidden">…</span>` in the home page source. */
function phoneOnlySpans(source: string): string[] {
  return [...source.matchAll(/<span className="sm:hidden">([^<]*)<\/span>/g)].map((m) =>
    m[1].trim()
  );
}

const YEAR = /\b(1[0-9]{3}|20[0-9]{2})\b/;

describe("home phone dek (I-070)", () => {
  const spans = phoneOnlySpans(readFileSync(PAGE, "utf8"));

  it("finds exactly one phone-only line in the dek", () => {
    expect(spans).toHaveLength(1);
    expect(spans[0].length).toBeGreaterThan(0);
  });

  it("names no year, so a zoomed chart cannot contradict it", () => {
    expect(spans[0]).not.toMatch(YEAR);
  });

  it("the matcher catches the line that shipped before I-070 (positive control)", () => {
    const before = '<span className="sm:hidden">Long-wave history, 1600–2050.</span>';
    expect(phoneOnlySpans(before)).toEqual(["Long-wave history, 1600–2050."]);
    expect(phoneOnlySpans(before)[0]).toMatch(YEAR);
  });
});
