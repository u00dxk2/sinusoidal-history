import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cycles } from "@/data/cycles";
import type { Cycle } from "@/data/types";
import { drawnPeriod, periodSideOutside } from "./cycleMath";
import { outsideWindowWords, overviewRowReading } from "./overviewReading";
import { holdsUpCard } from "./holdsUp";

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

describe("CycleOverview wires the word into the row (source check)", () => {
  const src = readFileSync(resolve(__dirname, "../components/CycleOverview.tsx"), "utf8");
  it("derives the side with periodSideOutside and speaks and shows it", () => {
    expect(src).toMatch(/periodSideOutside\(\s*cycle,\s*startYear,\s*endYear/);
    expect(src).toContain("overviewRowReading(cycle, outside)");
    expect(src).toContain("outsideWindowWords(outside)");
    expect(src).toContain("data-outside-window");
  });
});
