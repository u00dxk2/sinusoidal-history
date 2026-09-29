import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import { dataSeries as series } from "@/data/series";
import { sineAtYear } from "@/lib/cycleMath";
import { peakYearsInRange, troughYearsInRange } from "@/lib/cycleRoutes";
import {
  STATE_FIRST_YEAR,
  cycleStateAtYear,
  formatCos,
  nextPeakYear,
  nextTroughYear,
  stateOfCycles,
  stateYears,
  yearPosition,
  yearPositionSentence,
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

describe("yearPosition", () => {
  it("says what /state and /api/v1/state say, for every cycle", () => {
    for (const cycle of cycles) {
      for (const year of [2026, 2031, 2050]) {
        const entry = cycleStateAtYear(cycle, year);
        const pos = yearPosition(cycle, year);
        expect(pos.cos).toBe(formatCos(entry.cos));
        // The sentence names the next extremum the state entry names.
        const nextFirst =
          entry.phase === "peaking"
            ? entry.next_trough_year
            : entry.phase === "troughing"
              ? entry.next_peak_year
              : Math.min(entry.next_peak_year, entry.next_trough_year);
        expect(pos.next).toContain(String(nextFirst));
      }
    }
  });

  it("reads Dalio 2026 as the page's worked example", () => {
    const dalio = cycles.find((c) => c.id === "dalio")!;
    expect(yearPositionSentence(dalio, 2026)).toBe(
      "By this page's curve, 2026 sits at a peak (the curve tops out in 2025; cos +1.00). The next low falls around 2063."
    );
  });

  it("prints exactly one bracket per sentence, for every cycle and year", () => {
    for (const cycle of cycles) {
      for (let year = 2000; year < 2100; year += 1) {
        const s = yearPositionSentence(cycle, year);
        expect(s.match(/\(/g)).toHaveLength(1);
        expect(s).toMatch(/cos [+−]?\d\.\d\d\)/);
      }
    }
  });

  it("reaches every phase wording somewhere in a century", () => {
    const seen = new Set<string>();
    for (const cycle of cycles) {
      for (let year = 2000; year < 2100; year += 1) {
        seen.add(yearPosition(cycle, year).where.split(",")[0]!);
      }
    }
    expect([...seen].sort()).toEqual(
      ["at a low", "at a peak", "at the midline", "on the falling arm", "on the rising arm"]
    );
  });
});

describe("formatCos", () => {
  it("signs with a true minus and prints zero unsigned", () => {
    expect(formatCos(0.5)).toBe("+0.50");
    expect(formatCos(-0.09)).toBe("−0.09");
    expect(formatCos(0)).toBe("0.00");
  });
});

describe("series.json reader-facing text", () => {
  it("carries no backslash (a JSON `\\\\$` renders as a literal `\\$`)", () => {
    for (const s of series) {
      expect(s.short_description).not.toContain("\\");
      expect(s.name).not.toContain("\\");
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
