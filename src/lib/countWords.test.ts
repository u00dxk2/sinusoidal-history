// I-006 (2026-10-11): the main share card's count derives from the data, the way
// siteConfig.test.ts pins SITE_DESCRIPTION. The route file itself is read too, so a literal
// count typed back into it fails here.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import { dataSeries } from "@/data/series";
import {
  brushCaption,
  countWord,
  countWordLower,
  cyclesIndexDescription,
  cyclesIndexTitle,
  homeDek,
  homeGateLine,
  ogMainStandfirst,
  posterStandfirst,
} from "@/lib/countWords";
import { spectralHeadline, spectralPrimary } from "@/lib/spectral";

const src = (...p: string[]) => readFileSync(join(process.cwd(), "src", ...p), "utf8");
const COUNT_WORD = "(Eight|Nine|Ten|Eleven|Twelve|eight|nine|ten|eleven|twelve)";

describe("countWord", () => {
  it("spells twelve and under, and falls back to digits", () => {
    expect(countWord(10)).toBe("Ten");
    expect(countWord(11)).toBe("Eleven");
    expect(countWord(12)).toBe("Twelve");
    expect(countWord(13)).toBe("13");
    expect(countWord(2.5)).toBe("2.5");
  });
});

describe("the main og card's standfirst", () => {
  it("counts the cycles the site ships", () => {
    expect(cycles.length).toBe(10);
    expect(ogMainStandfirst(cycles.length)).toBe("Ten long-wave cycles of history, on one shared axis.");
    expect(ogMainStandfirst(cycles.length + 1).startsWith("Eleven ")).toBe(true);
  });

  it("the og route draws it from the data, not a typed count", () => {
    const source = readFileSync(join(process.cwd(), "src", "app", "og", "route.tsx"), "utf8");
    expect(source).toContain("ogMainStandfirst(cycles.length)");
    expect(source).not.toMatch(/\b(Eight|Nine|Ten|Eleven|Twelve) long-wave cycles/);
  });
});

// The rest of I-006 (2026-10-11 day session). Each surface's text TODAY is pinned exactly, so the
// derivation changed no word a reader sees; each also moves with the count; and each source file
// is read for a count typed back in. Ceiling (declared, as on the og part): the source read sees
// literals in these files only, not the rendered page; the rendered-text multiset is the proof.
describe("the count surfaces derive from the data", () => {
  it("today's text is exactly what the pages served before the change", () => {
    expect(cycles.length).toBe(10);
    expect(dataSeries.length).toBe(9);
    expect(posterStandfirst(cycles.length)).toBe(
      "Ten long-wave cycles of history, each calibrated to a single documented peak. Drawn together to ask whose curve fits whose century — and where every cycle's reach exceeds its grasp.",
    );
    expect(brushCaption(cycles.length)).toBe(
      "The grey curve is the mean of all ten cycle sinusoids — drag across it to zoom the chart above.",
    );
    expect(homeDek(cycles.length, dataSeries.length)).toContain(
      "nine of the ten carry a paired empirical series for stress-testing.",
    );
    expect(cyclesIndexTitle(cycles.length)).toBe("The ten cycles");
    expect(cyclesIndexDescription(cycles.length).startsWith("Ten long-wave cycles of history - ")).toBe(true);
  });

  it("each moves with the count", () => {
    expect(countWordLower(11)).toBe("eleven");
    expect(posterStandfirst(11).startsWith("Eleven ")).toBe(true);
    expect(brushCaption(11)).toContain("all eleven cycle");
    expect(homeDek(11, 10)).toContain("ten of the eleven carry");
    expect(cyclesIndexTitle(11)).toBe("The eleven cycles");
    expect(cyclesIndexDescription(11).startsWith("Eleven ")).toBe(true);
  });

  it("no source file types a count back in", () => {
    const poster = src("components", "Poster.tsx");
    const brush = src("components", "TimeRangeBrush.tsx");
    const home = src("app", "(app)", "page.tsx");
    const index = src("app", "(app)", "cycles", "page.tsx");
    expect(poster).toContain("posterStandfirst(cycles.length)");
    expect(poster).not.toMatch(new RegExp(`${COUNT_WORD} long-wave cycles`));
    expect(brush).toContain("brushCaption(cycles.length)");
    expect(brush).not.toMatch(new RegExp(`all ${COUNT_WORD} cycle`));
    expect(home).toContain("{countWord(cycles.length)} cycles,");
    expect(home).toContain("homeDek(cycles.length, dataSeries.length)");
    expect(home).toContain("homeGateLine(");
    expect(home).not.toMatch(new RegExp(`${COUNT_WORD} cycles,|${COUNT_WORD} of the ${COUNT_WORD}|\\d+ of the \\d+`));
    expect(index).toContain("cyclesIndexTitle(cycles.length)");
    expect(index).toContain("cyclesIndexDescription(cycles.length)");
    expect(index).not.toMatch(new RegExp(`"The ${COUNT_WORD} cycles"|"${COUNT_WORD} long-wave cycles`));
  });
});

describe("the home spectral sentence", () => {
  it("reads the frozen verdict, whose total is the primary pairings", () => {
    expect(spectralHeadline.total_primary).toBe(spectralPrimary.length);
    expect(spectralHeadline.eligible_primary).toBe(spectralPrimary.filter((v) => v.eligible).length);
  });

  it("states today's finding while no pairing reaches the gate", () => {
    expect(homeGateLine(0, 9)).toBe(
      "Each pairing also faces a pre-registered spectral test: 0 of the 9 reach its 3.0-period evidence gate — none of these records is long enough to test, which is itself the finding.",
    );
  });

  it("drops the 'none … is long enough' clause the moment one does", () => {
    for (const eligible of [1, 2, 9]) {
      const line = homeGateLine(eligible, 9);
      expect(line).toContain(`${eligible} of the 9 reach`);
      expect(line).not.toMatch(/none of these records|itself the finding/);
    }
  });
});

// The two hand-written name lists. An id-to-name map per list, so "Turchin (twice)" and the
// long-form index names both work; an id with no entry fails, which is the point: a new cycle
// cannot ship while either list leaves it out.
const HOME_DEK_NAME: Record<string, string> = {
  khaldun: "Khaldun",
  kondratiev: "Kondratiev",
  huntington: "Huntington",
  schlesinger_jr: "Schlesinger Jr.",
  perez: "Perez",
  turchin: "Turchin (twice)",
  turchin_fathers_sons: "Turchin (twice)",
  dalio: "Dalio",
  strauss_howe: "Strauss-Howe",
  modelski: "Modelski",
};
const INDEX_NAME: Record<string, string> = {
  khaldun: "Khaldun",
  kondratiev: "Kondratiev",
  huntington: "Huntington",
  schlesinger_jr: "Schlesinger Jr.",
  perez: "Perez",
  turchin: "Turchin's secular cycle",
  turchin_fathers_sons: "Turchin's fathers-and-sons",
  dalio: "Dalio",
  strauss_howe: "Strauss-Howe",
  modelski: "Modelski",
};

describe("the hand-written name lists cover every cycle", () => {
  for (const [label, map, text] of [
    ["home dek", HOME_DEK_NAME, homeDek(cycles.length, dataSeries.length)],
    ["/cycles description", INDEX_NAME, cyclesIndexDescription(cycles.length)],
  ] as const) {
    it(`${label} names each cycle id`, () => {
      for (const c of cycles) {
        const name = (map as Record<string, string>)[c.id];
        expect(name, `${label}: no name mapped for cycle id "${c.id}"`).toBeDefined();
        expect(text, `${label}: "${name}" (${c.id}) is missing`).toContain(name);
      }
    });
  }
});
