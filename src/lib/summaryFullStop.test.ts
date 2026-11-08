// I-049 (2026-11-08): every cycle and data-series summary ends with a full stop.
// Four cold walkers read the unstopped Dalio summary as "cut off" (I-047 GREEN walk, the 10-14
// journey-walk finding 9, both 10-21 walkers). Before this fix cycles.json stopped 0 of 10 and
// series.json 0 of 9, while the hand mirrors stopped some and not others (about.md 6 of 10,
// methods.md 6 of 9). The convention is one rule: a terminal "." on every summary, in the data
// and in its mirror alike.
// The mirror leg reads each summary off the mirror, paragraph for paragraph. Two methods.md
// summaries differ from series.json ON PURPOSE: the mirror is the methods page itself, so it says
// "see caveats below" where the data (also shown on cycle pages) says "see methods". Those two
// differences are listed exactly below, and any other difference fails.
// Ceiling: this checks the terminal character and verbatim mirroring, not whether a sentence
// inside a summary is complete.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import { dataSeries } from "@/data/series";

const read = (...p: string[]) => readFileSync(join(process.cwd(), ...p), "utf8");
const paragraphs = (md: string) => md.replace(/\r\n/g, "\n").split(/\n{2,}/).map((p) => p.trim());

// series id -> [what series.json says, what methods.md says instead]
const METHODS_MIRROR_WORDING: Record<string, [string, string]> = {
  us_tfp_growth: ["are edge artifacts.", "are edge artifacts (see caveats below)."],
  us_world_gdp_share: ["after 1870 - see methods)", "after 1870 - see caveats below)"],
};

describe("I-049 every summary ends with a full stop", () => {
  it("covers the whole population: 10 cycles and 9 series", () => {
    expect(cycles).toHaveLength(10);
    expect(dataSeries).toHaveLength(9);
  });

  it.each(cycles.map((c) => [c.id, c.short_description]))(
    "cycle %s summary ends in '.'",
    (_id, d) => {
      expect(d.trimEnd().endsWith(".")).toBe(true);
    },
  );

  it.each(dataSeries.map((s) => [s.id, s.short_description]))(
    "series %s summary ends in '.'",
    (_id, d) => {
      expect(d.trimEnd().endsWith(".")).toBe(true);
    },
  );
});

describe("I-049 each summary appears verbatim in its mirror", () => {
  const about = paragraphs(read("public", "about.md"));
  const methods = paragraphs(read("public", "methods.md"));

  it.each(cycles.map((c) => [c.id, c.short_description]))(
    "about.md carries cycle %s's summary as a paragraph",
    (_id, d) => {
      // about.md italicises book titles the data writes plain (Turchin's two books).
      const plain = about.map((p) => p.replace(/\*([^*]+)\*/g, "$1"));
      expect(plain).toContain(d);
    },
  );

  it.each(dataSeries.map((s) => [s.id, s.short_description]))(
    "methods.md carries series %s's summary as a paragraph",
    (id, d) => {
      const swap = METHODS_MIRROR_WORDING[id];
      if (swap) expect(d).toContain(swap[0]);
      const expected = swap ? d.replace(swap[0], swap[1]) : d;
      expect(methods).toContain(expected);
    },
  );
});
