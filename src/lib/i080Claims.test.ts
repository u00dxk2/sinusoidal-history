// I-080 (2026-11-05): two public sentences the 11-04 claims pass could not back.
// 1. The Kondratiev caveat said "Metz, who once reported K-wave evidence, later withdrew it" and
//    cited Solomou. The only held source (docs/fact-check-2026-04-25.md:249) says Metz 1992 reports
//    some periodicity and Metz (2011) is "skeptical"; no held source names Solomou. David's ruling,
//    card ddbe0735: "soften Metz". The caveat now says only what that line holds, and this test
//    reads that line off disk so the page cannot drift from it.
// 2. llms.txt said "Headline: 0 of 9 pairings are testable — every record is too short", false
//    while verdicts.json holds 19 eligible cross-grid rows. The headline is now rebuilt here from
//    verdicts.json and compared exactly.
// Rider (I-043): the /methods lead and note said "brackets" while the rows print parentheses.
// Ceiling: the caveat legs are a word ban plus required phrases, so a new unsupported claim in
// other words still passes; the exact llms headline and the source-line read are the other half.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import { CROSS_GRID_LEAD, CROSS_GRID_NOTE } from "@/components/CrossGridList";

const read = (...p: string[]) => readFileSync(join(process.cwd(), ...p), "utf8");

describe("I-080 Kondratiev caveat says only what the held source says", () => {
  const caveat = cycles.find((c) => c.id === "kondratiev")?.caveat ?? "";

  it("drops the withdrawal and the unsourced Solomou clause", () => {
    expect(caveat.length).toBeGreaterThan(0);
    expect(caveat).not.toMatch(/withdr|renunciation|Solomou/i);
  });

  it("names Metz 1992 as reporting weak periodicity and Metz (2011) as skeptical, as the source does", () => {
    const source = read("docs", "fact-check-2026-04-25.md");
    expect(source).toContain("Metz 1992) report some periodicity at weak significance");
    expect(source).toContain("Metz (2011) and Diebolt & Doliger are skeptical");
    expect(caveat).toContain("some periodicity at weak significance (Metz 1992; Korotayev & Tsirel 2010)");
    expect(caveat).toContain("Metz (2011) and Diebolt & Doliger, are skeptical");
  });

  it("is mirrored word for word in about.md", () => {
    expect(read("public", "about.md")).toContain(`*Caveat:* ${caveat}`);
  });
});

describe("I-080 llms.txt verdict headline matches verdicts.json", () => {
  type Row = { eligible: boolean; state: string; holm_significant: boolean | null; holm_significant_ar2: boolean | null };
  const v = JSON.parse(read("public", "data", "spectral", "verdicts.json")) as {
    gate_min_periods: number;
    headline: { eligible_primary: number; total_primary: number };
    primary: Row[];
    cross_grid: Row[];
  };
  const llms = read("public", "llms.txt");

  it("states the primary and cross-grid results exactly", () => {
    // The sentence below is only true in this state; a verdict change must rewrite it.
    expect(v.headline.eligible_primary).toBe(0);
    expect(v.primary.every((r) => !r.eligible)).toBe(true);
    expect(v.cross_grid.length).toBeGreaterThan(0);
    expect(v.cross_grid.every((r) => r.eligible && r.state === "NO_SIGNIFICANT_TARGET_POWER")).toBe(true);
    const headline =
      `Headline: ${v.headline.eligible_primary} of the ${v.headline.total_primary} paired constructions reach the ` +
      `${v.gate_min_periods.toFixed(1)}-period eligibility gate; ` +
      `all ${v.cross_grid.length} cross-grid re-pairings clear the gate, and none finds significant power at the borrowed period.`;
    expect(llms).toContain(headline);
  });

  it("no longer says every record is too short", () => {
    expect(llms).not.toContain("every record is too short");
  });
});

describe("I-043 rider: the /methods lead and note name the marks the rows print", () => {
  it("says parentheses, not brackets", () => {
    for (const text of [CROSS_GRID_LEAD, CROSS_GRID_NOTE, read("public", "methods.md")]) {
      expect(text).not.toMatch(/bracket/i);
    }
    expect(CROSS_GRID_LEAD).toContain("The number in parentheses repeats");
    expect(read("public", "methods.md")).toContain("(second drift model:");
  });
});
