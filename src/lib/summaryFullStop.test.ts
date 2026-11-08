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
const paragraphs = (md: string) => md.split(/\n{2,}/).map((p) => p.trim());
// One "### " section per cycle or series. Each summary is looked up in ITS OWN section (the one
// carrying its page or provenance link), so a stale copy elsewhere in the file cannot satisfy it.
const sections = (md: string) => md.replace(/\r\n/g, "\n").split(/\n(?=### )/);
const sectionWith = (md: string, marker: string) => {
  const hits = sections(md).filter((s) => s.startsWith("### ") && s.includes(marker));
  expect(hits, `exactly one section carries ${marker}`).toHaveLength(1);
  return paragraphs(hits[0]);
};
// Exactly one terminal full stop, nothing after it: rejects "..", a missing stop and trailing space.
const ENDS_IN_ONE_STOP = /[^.\s]\.$/;

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
      expect(d).toMatch(ENDS_IN_ONE_STOP);
    },
  );

  it.each(dataSeries.map((s) => [s.id, s.short_description]))(
    "series %s summary ends in '.'",
    (_id, d) => {
      expect(d).toMatch(ENDS_IN_ONE_STOP);
    },
  );
});

describe("I-049 each summary appears verbatim in its mirror", () => {
  const about = read("public", "about.md");
  const methods = read("public", "methods.md");

  it.each(cycles.map((c) => [c.id, c.short_description]))(
    "about.md carries cycle %s's summary in its own section",
    (id, d) => {
      const own = sectionWith(about, `/cycles/${id.replace(/_/g, "-")}\n`);
      // about.md italicises book titles the data writes plain (Turchin's two books).
      const plain = own.map((p) => p.replace(/\*([^*]+)\*/g, "$1"));
      expect(plain).toContain(d);
    },
  );

  it.each(dataSeries.map((s) => [s.id, s.short_description, s.data_file]))(
    "methods.md carries series %s's summary in its own section",
    (id, d, dataFile) => {
      const own = sectionWith(methods, dataFile.replace(/\.csv$/, ".source.md"));
      const swap = METHODS_MIRROR_WORDING[id];
      if (swap) expect(d.split(swap[0])).toHaveLength(2);
      const expected = swap ? d.replace(swap[0], swap[1]) : d;
      expect(own).toContain(expected);
    },
  );
});
