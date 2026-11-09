import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cycles } from "@/data/cycles";
import type { Cycle } from "@/data/types";
import { dataSeries } from "@/data/series";
import { drawnPeriod, periodSideOutside, pointsSideOutside } from "./cycleMath";
import {
  facetOutsideWords,
  namedOutsideWords,
  outsideWindowWords,
  overviewRowReading,
} from "./overviewReading";
import { holdsUpCard } from "./holdsUp";
import { parseCsvSeries } from "./csvSeries";

// I-069 (2026-11-02). The 10-25 cold walk zoomed the glance figure to
// 1801–1951 and read the blank Schlesinger Jr. and Perez rows as missing data.
// Each row draws one period (I-061), so a window can hold none of it; the row
// now says which side of the window its wave is drawn on.
//
// CEILING: the side logic and the words are unit-tested; the last leg is a
// SOURCE check that CycleOverview wires them into the row. It cannot see the
// rendered row (the figure renders client-side); that was read on production
// with Playwright at 390x664, `?range=1801-1951`.

const YEAR = 2026;
const byId = (id: string): Cycle => {
  const c = cycles.find((x) => x.id === id);
  if (!c) throw new Error(`no cycle ${id}`);
  return c;
};
const outsideIn = (start: number, end: number) =>
  Object.fromEntries(
    cycles
      .map((c) => [c.id, periodSideOutside(c, start, end, YEAR)] as const)
      .filter(([, side]) => side !== null),
  );

describe("periodSideOutside", () => {
  it("puts exactly Schlesinger Jr. and Perez after the walker's 1801–1951 window", () => {
    expect(outsideIn(1801, 1951)).toEqual({ schlesinger_jr: "after", perez: "after" });
  });

  it("leaves no row outside the default 1600–2050 axis", () => {
    expect(outsideIn(1600, 2050)).toEqual({});
  });

  it("puts Ibn Khaldun before a 1900–2050 window", () => {
    expect(periodSideOutside(byId("khaldun"), 1900, 2050, YEAR)).toBe("before");
  });

  it("is null while the window draws any of the period, even a sliver", () => {
    // Kondratiev is drawn from 1946, so 1801–1951 holds five years of it.
    expect(periodSideOutside(byId("kondratiev"), 1801, 1951, YEAR)).toBeNull();
  });

  it("counts a period that only touches an edge as outside, on that side", () => {
    const dalio = byId("dalio");
    const p = drawnPeriod(dalio, YEAR); // 1912.5–1987.5
    expect(periodSideOutside(dalio, p.to, p.to + 150, YEAR)).toBe("before");
    expect(periodSideOutside(dalio, p.from - 150, p.from, YEAR)).toBe("after");
  });
});

describe("outsideWindowWords", () => {
  // Codex r1 (dfaea61): "drawn after these years" was false when the period
  // only touches the window's edge, so the words claim only that nothing is
  // drawn here, and the arrow gives the side.
  it("says nothing is drawn here and points to the side: no year, no position", () => {
    expect(outsideWindowWords("before")).toBe("← none drawn in these years");
    expect(outsideWindowWords("after")).toBe("none drawn in these years →");
    for (const side of ["before", "after"] as const) {
      const words = outsideWindowWords(side);
      expect(words).not.toMatch(/\d/);
      for (const w of ["now", "today", "present", "rising", "peaking", "falling", "troughing"])
        expect(words).not.toContain(w);
    }
  });
});

describe("overviewRowReading with a side", () => {
  it("adds the side sentence only when the row is outside the window", () => {
    const perez = byId("perez");
    const head = holdsUpCard(perez)!.headline;
    expect(overviewRowReading(perez)).toBe(` (55-year cycle). ${head}.`);
    expect(overviewRowReading(perez, "after")).toBe(
      ` (55-year cycle). ${head}. None of its wave is drawn in these years; it starts at or after their end.`,
    );
    const khaldun = byId("khaldun");
    expect(overviewRowReading(khaldun, "before")).toBe(
      ` (120-year cycle). ${holdsUpCard(khaldun)!.headline}. None of its wave is drawn in these years; it ends at or before their start.`,
    );
  });

  it("stays true at an exact edge touch (Codex r1's 1805–1955 case)", () => {
    // Schlesinger Jr. is drawn from 1955: a window ending at 1955 draws nothing.
    const s = byId("schlesinger_jr");
    expect(drawnPeriod(s, YEAR).from).toBe(1955);
    expect(periodSideOutside(s, 1805, 1955, YEAR)).toBe("after");
    expect(overviewRowReading(s, "after")).toContain("starts at or after their end");
  });
});

// I-074 (2026-11-09): the facet cards and the desktop overlay, the glance rows'
// siblings. Production at ?range=1801-1951 drew Schlesinger Jr.'s and Perez's
// theory curves empty with no word (live 66962f4a); Schlesinger Jr.'s paired
// Policy Mood starts in 1952, so its data line was missing too.
const seriesYears = (cycleId: string): number[] => {
  const s = dataSeries.find((x) => x.associated_cycle_id === cycleId);
  if (!s) throw new Error(`no series for ${cycleId}`);
  const text = readFileSync(resolve(__dirname, "../../public", `.${s.data_file}`), "utf8");
  return parseCsvSeries(text, s.year_column, s.value_column, s.transform).map((p) => p.year);
};

describe("pointsSideOutside", () => {
  it("puts Policy Mood after 1801–1951 and leaves HATCH drawn there (the real CSVs)", () => {
    expect(pointsSideOutside(seriesYears("schlesinger_jr"), 1801, 1951)).toBe("after");
    expect(pointsSideOutside(seriesYears("perez"), 1801, 1951)).toBeNull();
  });

  it("needs two points inside to draw, and counts an edge touch as outside", () => {
    expect(pointsSideOutside([1952, 1953], 1801, 1951)).toBe("after");
    expect(pointsSideOutside([1951, 1952], 1801, 1951)).toBe("after");
    expect(pointsSideOutside([1950, 1951], 1801, 1951)).toBeNull();
    expect(pointsSideOutside([1700, 1801], 1801, 1951)).toBe("before");
  });

  it("says nothing for no points (loading) or points straddling the window", () => {
    expect(pointsSideOutside([], 1801, 1951)).toBeNull();
    expect(pointsSideOutside([1700, 2000], 1801, 1951)).toBeNull();
  });
});

describe("facetOutsideWords", () => {
  it("names the missing line on a paired card, so it is never false beside a drawn one", () => {
    expect(facetOutsideWords("after", null, true)).toEqual({
      words: "theory: none drawn in these years →",
      side: "after",
    });
    expect(facetOutsideWords("after", "after", true)).toEqual({
      words: "theory and data: none drawn in these years →",
      side: "after",
    });
    expect(facetOutsideWords(null, "before", true)).toEqual({
      words: "← data: none drawn in these years",
      side: "before",
    });
  });

  it("gives no arrow when theory and data are missing on different sides", () => {
    expect(facetOutsideWords("after", "before", true)).toEqual({
      words: "theory and data: none drawn in these years",
      side: null,
    });
  });

  it("uses the glance rows' own words on an unpaired card, and none when all is drawn", () => {
    expect(facetOutsideWords("after", null, false)?.words).toBe(outsideWindowWords("after"));
    expect(facetOutsideWords("before", null, false)?.words).toBe(outsideWindowWords("before"));
    expect(facetOutsideWords(null, null, true)).toBeNull();
    expect(facetOutsideWords(null, null, false)).toBeNull();
  });

  it("reads the two production cards right at 1801–1951", () => {
    const s = facetOutsideWords(
      periodSideOutside(byId("schlesinger_jr"), 1801, 1951, YEAR),
      pointsSideOutside(seriesYears("schlesinger_jr"), 1801, 1951),
      true,
    );
    expect(s?.words).toBe("theory and data: none drawn in these years →");
    const p = facetOutsideWords(
      periodSideOutside(byId("perez"), 1801, 1951, YEAR),
      pointsSideOutside(seriesYears("perez"), 1801, 1951),
      true,
    );
    expect(p?.words).toBe("theory: none drawn in these years →");
  });

  it("follows a calibrated cycle, not the stored one", () => {
    // Schlesinger Jr. calibrated to peak 1940 is drawn 1925–1955: inside 1801–1951.
    const calibrated = { ...byId("schlesinger_jr"), reference_peak_year: 1940 };
    expect(periodSideOutside(calibrated, 1801, 1951, YEAR)).toBeNull();
  });

  it("puts Ibn Khaldun before the Modern preset the embed snippets use", () => {
    expect(periodSideOutside(byId("khaldun"), 1900, 2050, YEAR)).toBe("before");
    expect(pointsSideOutside(seriesYears("khaldun"), 1900, 2050)).toBeNull();
  });

  it("keeps the claims rule: no year, no present position, in every form", () => {
    const sides = ["before", "after", null] as const;
    const all = sides.flatMap((t) =>
      sides.flatMap((d) =>
        [true, false].map((paired) => facetOutsideWords(t, d, paired)?.words ?? ""),
      ),
    );
    all.push(namedOutsideWords("Schlesinger Jr.", "after"), namedOutsideWords("Ibn Khaldun", "before"));
    for (const words of all) {
      expect(words).not.toMatch(/\d/);
      for (const w of ["now", "today", "present", "rising", "peaking", "falling", "troughing"])
        expect(words).not.toContain(w);
    }
  });
});

describe("the facet card and the overlay wire the word in (source check)", () => {
  const facet = readFileSync(resolve(__dirname, "../components/CycleFacet.tsx"), "utf8");
  const overlay = readFileSync(resolve(__dirname, "../components/CycleOverlay.tsx"), "utf8");

  it("FacetChart judges the theory and the loaded data, and draws the word", () => {
    expect(facet).toMatch(/periodSideOutside\(cycle,\s*startYear,\s*endYear,\s*currentYear\)/);
    expect(facet).toMatch(/!csv\.loading && csv\.error === null/);
    expect(facet).toContain("facetOutsideWords(theorySide, dataSide, series !== undefined)");
    expect(facet).toContain("data-outside-word");
  });

  it("the collapsed sparkline carries the glance word and says so to a screen reader", () => {
    expect(facet).toContain("outsideWindowWords(outside)");
    expect(facet).toContain("sparkline: none of its wave is drawn in these years");
  });

  it("the overlay derives from the effective cycles and names each missing one", () => {
    expect(overlay).toMatch(/effectiveCycles\s*\.filter\(\(c\) => activeCycleIds\.has\(c\.id\)\)/);
    expect(overlay).toContain("periodSideOutside(c, startYear, endYear, currentYear)");
    expect(overlay).toContain("namedOutsideWords(cycleTheorist(r.cycle), side)");
  });
});

describe("CycleOverview wires the word into the row (source check)", () => {
  const src = readFileSync(resolve(__dirname, "../components/CycleOverview.tsx"), "utf8");
  it("derives the side with periodSideOutside and speaks and shows it", () => {
    expect(src).toMatch(/periodSideOutside\(\s*cycle,\s*startYear,\s*endYear/);
    expect(src).toContain("overviewRowReading(cycle, outside)");
    expect(src).toContain("outsideWindowWords(outside)");
    expect(src).toContain("data-outside-window");
  });
});
