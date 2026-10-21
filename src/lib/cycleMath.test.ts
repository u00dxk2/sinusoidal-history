import { describe, it, expect } from "vitest";
import { sineAtYear } from "./cycleMath";
import type { Cycle } from "@/data/types";

// sineAtYear is the formula. Which years are DRAWN is drawnPeriod's job
// (drawnPeriod.test.ts, I-061); the phase-label tests went with the phase
// classifier on 2026-10-21.

const cycle: Cycle = {
  id: "test",
  name: "Test cycle",
  short_description: "test",
  period_years: 60,
  reference_peak_year: 2000,
  reference_peak_rationale: "test",
  amplitude_normalized: 1.0,
  source: "test",
  confidence_level: "narrative",
  color: "#000000",
};

describe("sineAtYear", () => {
  it("returns amplitude at reference peak year", () => {
    expect(sineAtYear(cycle, 2000)).toBeCloseTo(1.0, 10);
  });

  it("returns amplitude at one full period after peak", () => {
    expect(sineAtYear(cycle, 2060)).toBeCloseTo(1.0, 10);
  });

  it("returns negative amplitude at half period (trough)", () => {
    expect(sineAtYear(cycle, 2030)).toBeCloseTo(-1.0, 10);
  });

  it("returns 0 at quarter period after peak (zero crossing)", () => {
    expect(sineAtYear(cycle, 2015)).toBeCloseTo(0.0, 10);
  });

  it("returns 0 at three-quarter period after peak", () => {
    expect(sineAtYear(cycle, 2045)).toBeCloseTo(0.0, 10);
  });

  it("scales by amplitude_normalized", () => {
    const half: Cycle = { ...cycle, amplitude_normalized: 0.5 };
    expect(sineAtYear(half, 2000)).toBeCloseTo(0.5, 10);
  });

  it("handles years before the reference peak symmetrically", () => {
    expect(sineAtYear(cycle, 1940)).toBeCloseTo(1.0, 10);
    expect(sineAtYear(cycle, 1970)).toBeCloseTo(-1.0, 10);
  });
});
