// I-070 (2026-11-01): the phone line under the home H1 read "Long-wave history, 1600–2050."
// It named 2027–2050 as history though no curve is drawn past today (I-061), and it kept naming
// 1600–2050 after a zoom showed a narrower window. It now names no year, so it names no window
// to disagree with the chart's.
//
// CEILING (declared; Codex r1 on e064df6): this is an exact-source regression check, not a
// renderer. It finds every `<span className="sm:hidden">…</span>` in the home page source,
// written in exactly that shape with literal text, requires there to be one, and refuses a
// four-digit number in it. It does NOT see: a span written with other classes or class order,
// text supplied by an expression (`{PHONE_DEK}`) or split digits (`{20}{50}`), or anything the
// browser renders. It does not claim the site no longer says 2050: the zoom readout's
// "every year, 1600–2050" is I-068, and the desktop dek names the axis on purpose ("on one
// 1600–2050 axis … cut at today"). That the line stays one row on a phone was measured once,
// on production, at the change (I-070's notes); no automated check here holds it.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const PAGE = join(process.cwd(), "src", "app", "(app)", "page.tsx");

/** The literal text of every `<span className="sm:hidden">…</span>` in a source string. */
function phoneOnlySpans(source: string): string[] {
  return [...source.matchAll(/<span className="sm:hidden">([^<]*)<\/span>/g)].map((m) =>
    m[1].trim()
  );
}

const FOUR_DIGITS = /\d{4}/;

describe("home phone-only span, source check (I-070)", () => {
  const spans = phoneOnlySpans(readFileSync(PAGE, "utf8"));

  it("finds exactly one phone-only span written in the checked shape", () => {
    expect(spans).toHaveLength(1);
    expect(spans[0].length).toBeGreaterThan(0);
  });

  it("its literal text carries no four-digit number", () => {
    expect(spans[0]).not.toMatch(FOUR_DIGITS);
  });

  it("the matcher catches the line that shipped before I-070 (positive control)", () => {
    const before = '<span className="sm:hidden">Long-wave history, 1600–2050.</span>';
    expect(phoneOnlySpans(before)).toEqual(["Long-wave history, 1600–2050."]);
    expect(phoneOnlySpans(before)[0]).toMatch(FOUR_DIGITS);
  });
});
