import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import type { Cycle } from "@/data/types";
import { clampCycleOverride } from "@/lib/cycleOverrides";

// Characterization tests (refactor session 2026-11-13). `clampCycleOverride` is the trust
// boundary for the `peak.<id>` / `period.<id>` URL params, shared by the page (urlState.ts) and
// the /og share card. It had no test. These pin today's behaviour; they do not change it.
//
// Red proof: with the clamp in `clampOverrideValue` removed (return `value` unclamped), the
// bounds and period-zero tests fail.

const cycle = { reference_peak_year: 2000, period_years: 50 } as Cycle;

describe("clampCycleOverride", () => {
  it("returns null when neither override is given", () => {
    expect(clampCycleOverride(cycle, null, null)).toBeNull();
  });

  it("treats non-finite values as absent", () => {
    expect(clampCycleOverride(cycle, Number.NaN, Number.POSITIVE_INFINITY)).toBeNull();
    expect(clampCycleOverride(cycle, Number.NEGATIVE_INFINITY, 40)).toEqual({
      reference_peak_year: undefined,
      period_years: 40,
    });
  });

  it("passes in-bounds values through unchanged", () => {
    expect(clampCycleOverride(cycle, 2010, 55)).toEqual({ reference_peak_year: 2010, period_years: 55 });
  });

  it("clamps the peak to the reference peak plus or minus 30 years", () => {
    expect(clampCycleOverride(cycle, 1900, null)).toEqual({ reference_peak_year: 1970, period_years: undefined });
    expect(clampCycleOverride(cycle, 2100, null)).toEqual({ reference_peak_year: 2030, period_years: undefined });
    expect(clampCycleOverride(cycle, 1970, null)?.reference_peak_year).toBe(1970);
    expect(clampCycleOverride(cycle, 2030, null)?.reference_peak_year).toBe(2030);
  });

  it("clamps the period to rounded 0.75x and 1.25x of the stored period", () => {
    expect(clampCycleOverride(cycle, null, 10)).toEqual({ reference_peak_year: undefined, period_years: 38 });
    expect(clampCycleOverride(cycle, null, 500)).toEqual({ reference_peak_year: undefined, period_years: 63 });
  });

  it("never lets period=0 through, for any real cycle (the divide-by-zero the clamp exists for)", () => {
    expect(cycles.length).toBeGreaterThan(0);
    for (const c of cycles) {
      const out = clampCycleOverride(c, null, 0);
      expect(out?.period_years).toBe(Math.round(c.period_years * 0.75));
      expect(out!.period_years!).toBeGreaterThan(0);
    }
  });

  it("does not round an in-bounds fractional value", () => {
    expect(clampCycleOverride(cycle, 2000.5, 50.5)).toEqual({ reference_peak_year: 2000.5, period_years: 50.5 });
  });
});
