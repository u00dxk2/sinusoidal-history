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
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import About from "@/app/(app)/about/page";
import { cycles } from "@/data/cycles";
import { CROSS_GRID_LEAD, CROSS_GRID_NOTE } from "@/components/CrossGridList";

const read = (...p: string[]) => readFileSync(join(process.cwd(), ...p), "utf8");

describe("I-080 Kondratiev caveat says only what the held source says", () => {
  const caveat = cycles.find((c) => c.id === "kondratiev")?.caveat ?? "";

  it("drops the withdrawal and the unsourced Solomou clause", () => {
    expect(caveat.length).toBeGreaterThan(0);
    expect(caveat).not.toMatch(/withdr|renunciation|Solomou/i);
    // Codex r2: "the most-cited long-wave theory" is a ranking no held source makes.
    expect(caveat).not.toMatch(/most[- ]cited/i);
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

// Codex r1 on ffb87e8 (LOW, CONFIRMED, pre-existing): about.md carried every cycle's caveat while
// the /about page rendered none, and both said "Four cycles … carry an inline caveat" when
// cycles.json gives five (Kondratiev was missing). The page now renders the caveats and both
// mirrors name all five.
describe("I-080 /about renders the caveats about.md carries, and counts them right", () => {
  const withCaveat = cycles.filter((c) => c.caveat);
  const named = "Five cycles (Kondratiev, Schlesinger Jr., Strauss-Howe, Modelski, and Turchin fathers-and-sons) carry an inline caveat";

  it("the named list is exactly the cycles that carry a caveat", () => {
    expect(withCaveat.map((c) => c.id).sort()).toEqual(
      ["kondratiev", "modelski", "schlesinger_jr", "strauss_howe", "turchin_fathers_sons"],
    );
    expect(named.startsWith("Five")).toBe(withCaveat.length === 5);
  });

  it("the /about page renders each caveat and the corrected count", () => {
    const html = renderToStaticMarkup(About())
      .replace(/<!-- -->/g, "")
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"').replace(/&amp;/g, "&")
      .replace(/\s+/g, " ");
    for (const c of withCaveat) expect(html).toContain(`Caveat: ${c.caveat}`);
    expect(html).toContain(named);
    expect(html).not.toContain("Four cycles");
  });

  // Codex r2: presence is not placement. Each caveat sits inside its own cycle's entry (after
  // that cycle's source, before the next cycle's name), exactly once, and above the disclaimer.
  it("each caveat renders once, in its own cycle's entry, above the disclaimer", () => {
    const html = renderToStaticMarkup(About())
      .replace(/<!-- -->/g, "")
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"').replace(/&amp;/g, "&")
      .replace(/\s+/g, " ");
    const disclaimer = html.indexOf("Intellectual-honesty disclaimer");
    expect(disclaimer).toBeGreaterThan(0);
    cycles.forEach((c, i) => {
      const start = html.indexOf(`>${c.name}</a>`);
      const next = i + 1 < cycles.length ? html.indexOf(`>${cycles[i + 1].name}</a>`, start + 1) : disclaimer;
      expect(start).toBeGreaterThan(0);
      expect(next).toBeGreaterThan(start);
      const entry = html.slice(start, next);
      if (c.caveat) {
        expect(html.split(`Caveat: ${c.caveat}`).length - 1).toBe(1);
        expect(entry.indexOf(c.source)).toBeGreaterThan(0);
        expect(entry.indexOf(`Caveat: ${c.caveat}`)).toBeGreaterThan(entry.indexOf(c.source));
      } else {
        expect(entry).not.toContain("Caveat: ");
      }
    });
  });

  it("about.md says the same", () => {
    const md = read("public", "about.md");
    for (const c of withCaveat) expect(md).toContain(`*Caveat:* ${c.caveat}`);
    expect(md).toContain(named);
    expect(md).not.toContain("Four cycles");
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
