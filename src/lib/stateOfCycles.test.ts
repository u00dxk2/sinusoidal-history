import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import { sineAtYear } from "@/lib/cycleMath";
import { peakYearsInRange, troughYearsInRange } from "@/lib/cycleRoutes";
import {
  STATE_FIRST_YEAR,
  nextPeakYear,
  nextTroughYear,
  stateOfCycles,
  stateYears,
} from "./stateOfCycles";

describe("nextPeakYear / nextTroughYear", () => {
  it("is strictly after the asked year and at most one period away", () => {
    for (const cycle of cycles) {
      for (const year of [1600, 1900, 2026, cycle.reference_peak_year]) {
        const peak = nextPeakYear(cycle, year);
        const trough = nextTroughYear(cycle, year);
        expect(peak).toBeGreaterThan(year);
        expect(trough).toBeGreaterThan(year);
        // +1 tolerance for the integer-year rounding of fractional extrema.
        expect(peak - year).toBeLessThanOrEqual(cycle.period_years + 1);
        expect(trough - year).toBeLessThanOrEqual(cycle.period_years + 1);
      }
    }
  });

  it("lands on cosine extrema (within the integer-year grid)", () => {
    // Rounding an extremum to a whole year moves it at most 0.5y off-phase;
    // the worst case across the roster (period 30) is cos ≈ ±0.9945.
    for (const cycle of cycles) {
      expect(sineAtYear(cycle, nextPeakYear(cycle, 2026))).toBeGreaterThan(0.99);
      expect(sineAtYear(cycle, nextTroughYear(cycle, 2026))).toBeLessThan(-0.99);
    }
  });

  it("agrees with the extrema the cycle pages already derive", () => {
    for (const cycle of cycles) {
      const year = 2026;
      const horizon = year + cycle.period_years + 1;
      expect(peakYearsInRange(cycle, year + 1, horizon)).toContain(
        nextPeakYear(cycle, year)
      );
      expect(troughYearsInRange(cycle, year + 1, horizon)).toContain(
        nextTroughYear(cycle, year)
      );
    }
  });
});

describe("stateOfCycles", () => {
  it("returns every cycle, ascending by period, cos matching sineAtYear", () => {
    const state = stateOfCycles(2026);
    expect(state).toHaveLength(cycles.length);
    for (let i = 1; i < state.length; i += 1) {
      expect(state[i].period_years).toBeGreaterThanOrEqual(
        state[i - 1].period_years
      );
    }
    for (const entry of state) {
      const cycle = cycles.find((c) => c.id === entry.id)!;
      expect(entry.cos).toBeCloseTo(sineAtYear(cycle, 2026), 2);
      expect(entry.cos).toBeGreaterThanOrEqual(-1);
      expect(entry.cos).toBeLessThanOrEqual(1);
    }
  });
});

describe("stateYears", () => {
  it("runs from the first year through the given current year", () => {
    expect(stateYears(2026)).toEqual([2026]);
    expect(stateYears(2028)).toEqual([2026, 2027, 2028]);
    // A clock earlier than first publication still yields the first year.
    expect(stateYears(2020)).toEqual([STATE_FIRST_YEAR]);
  });
});
