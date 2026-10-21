import { describe, it, expect } from "vitest";
import { drawnPeriod, drawnSpan, sampleDrawnPeriod, sineAtYear } from "./cycleMath";
import { cycles } from "@/data/cycles";
import type { Cycle } from "@/data/types";

// I-061 shape d' (David, 2026-10-21: "one wave per cycle, stop at today").
const byId = (id: string): Cycle => {
  const c = cycles.find((x) => x.id === id);
  if (!c) throw new Error(`no cycle ${id}`);
  return c;
};

describe("drawnPeriod", () => {
  it("is one period centred on the reference peak when it ends before today", () => {
    expect(drawnPeriod(byId("dalio"), 2026)).toEqual({ from: 1912.5, to: 1987.5 });
  });

  it("is cut at the current year when the period would run past it", () => {
    expect(drawnPeriod(byId("turchin"), 2026)).toEqual({ from: 1945, to: 2026 });
    expect(drawnPeriod(byId("perez"), 2026)).toEqual({ from: 1972.5, to: 2026 });
  });

  it("never draws a year after the present, for any cycle", () => {
    for (const c of cycles) expect(drawnPeriod(c, 2026).to).toBeLessThanOrEqual(2026);
  });

  it("follows a calibrated anchor and period (one rule for any peak that is set)", () => {
    const moved = { ...byId("dalio"), reference_peak_year: 1960, period_years: 60 };
    expect(drawnPeriod(moved, 2026)).toEqual({ from: 1930, to: 1990 });
  });
});

describe("sampleDrawnPeriod", () => {
  it("draws no second Dalio crest: nothing at 2025", () => {
    const pts = sampleDrawnPeriod(byId("dalio"), 1600, 2050, 2026, 0.5);
    expect(pts.length).toBeGreaterThan(0);
    expect(Math.max(...pts.map((p) => p.year))).toBe(1987.5);
    expect(pts.some((p) => p.year > 1990)).toBe(false);
  });

  it("holds exactly one crest for every cycle whose period ends before today", () => {
    for (const c of cycles) {
      const pts = sampleDrawnPeriod(c, 1600, 2050, 2026, 0.5);
      const crests = pts.filter((p) => p.value > 0.999).map((p) => p.year);
      expect(crests.length).toBeGreaterThan(0);
      // Within the peak band (3% of a period) of the reference peak: no other crest is drawn.
      expect(crests.every((y) => Math.abs(y - c.reference_peak_year) <= 0.03 * c.period_years)).toBe(true);
    }
  });

  it("includes both ends of the span exactly", () => {
    const pts = sampleDrawnPeriod(byId("perez"), 1600, 2050, 2026, 1);
    expect(pts[0].year).toBe(1972.5);
    expect(pts[pts.length - 1].year).toBe(2026);
    expect(pts[pts.length - 1].value).toBeCloseTo(sineAtYear(byId("perez"), 2026));
  });

  it("is empty when the window holds none of the period", () => {
    expect(sampleDrawnPeriod(byId("khaldun"), 1900, 2050, 2026, 1)).toEqual([]);
    expect(drawnSpan(byId("khaldun"), 1900, 2050, 2026)).toBeNull();
  });

  it("clips to the window when the window holds part of the period", () => {
    expect(drawnSpan(byId("modelski"), 1900, 2050, 2026)).toEqual({ from: 1900, to: 2000 });
  });
});
