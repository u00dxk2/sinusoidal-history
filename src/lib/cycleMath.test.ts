import { describe, it, expect } from "vitest";
import {
  sineAtYear,
  phasePosition,
  normalizedPhase,
  phasePositionLabel,
  phaseFraction,
  phaseProgressPercent,
} from "./cycleMath";
import { cycles as allCycles } from "@/data/cycles";
import type { Cycle } from "@/data/types";

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

describe("normalizedPhase", () => {
  it("returns 0 at peak year", () => {
    expect(normalizedPhase(cycle, 2000)).toBeCloseTo(0.0, 10);
  });

  it("wraps into [0,1) for negative offsets", () => {
    const p = normalizedPhase(cycle, 1990);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThan(1);
  });

  it("is periodic with period_years", () => {
    expect(normalizedPhase(cycle, 2030)).toBeCloseTo(normalizedPhase(cycle, 1970), 10);
  });
});

describe("phasePosition", () => {
  it("peaking at reference peak year", () => {
    expect(phasePosition(cycle, 2000)).toBe("peaking");
  });

  it("peaking at period multiples", () => {
    expect(phasePosition(cycle, 2060)).toBe("peaking");
    expect(phasePosition(cycle, 1940)).toBe("peaking");
  });

  it("troughing at half period", () => {
    expect(phasePosition(cycle, 2030)).toBe("troughing");
  });

  it("falling between peak and trough", () => {
    expect(phasePosition(cycle, 2010)).toBe("falling");
    expect(phasePosition(cycle, 2020)).toBe("falling");
  });

  it("rising between trough and next peak", () => {
    expect(phasePosition(cycle, 2040)).toBe("rising");
    expect(phasePosition(cycle, 2055)).toBe("rising");
  });

  it("handles years before reference peak", () => {
    expect(phasePosition(cycle, 1970)).toBe("troughing");
    expect(phasePosition(cycle, 1980)).toBe("rising");
    expect(phasePosition(cycle, 1950)).toBe("falling");
  });
});

describe("phasePositionLabel (narrow bands)", () => {
  it("peaking at peak year", () => {
    expect(phasePositionLabel(cycle, 2000)).toBe("peaking");
  });

  it("peaking just inside the 3% band (within ~2 years for a 60y cycle)", () => {
    // 60y cycle × 0.03 = 1.8y. 2002 = 2y past peak = phase 2/60 = 0.0333 → edge, falling
    expect(phasePositionLabel(cycle, 2001)).toBe("peaking");
    expect(phasePositionLabel(cycle, 2002)).toBe("falling");
  });

  it("troughing within 3% of half period", () => {
    expect(phasePositionLabel(cycle, 2030)).toBe("troughing");
    expect(phasePositionLabel(cycle, 2031)).toBe("troughing");
    expect(phasePositionLabel(cycle, 2032)).toBe("rising"); // past trough, now rising
  });

  it("crossing within 1.5% of zero crossings", () => {
    expect(phasePositionLabel(cycle, 2015)).toBe("crossing");
    expect(phasePositionLabel(cycle, 2045)).toBe("crossing");
    expect(phasePositionLabel(cycle, 2013)).toBe("falling"); // outside 1.5% band
  });

  it("falling between peak and trough, outside bands", () => {
    expect(phasePositionLabel(cycle, 2005)).toBe("falling");
    expect(phasePositionLabel(cycle, 2020)).toBe("falling");
  });

  it("rising between trough and next peak, outside bands", () => {
    expect(phasePositionLabel(cycle, 2040)).toBe("rising");
    expect(phasePositionLabel(cycle, 2055)).toBe("rising");
  });

  it("no more than 3 of the 7 canonical cycles report peaking in 2026", () => {
    // Sanity guard against the bands being widened back out.
    const peaking = allCycles.filter(
      (c) => phasePositionLabel(c, 2026) === "peaking"
    );
    expect(peaking.length).toBeLessThanOrEqual(3);
  });
});

describe("phaseProgressPercent (0 at trough, 50 at peak, 100 next trough)", () => {
  it("50% at peak year", () => {
    expect(phaseProgressPercent(cycle, 2000)).toBeCloseTo(50, 5);
  });

  it("0% at trough year", () => {
    expect(phaseProgressPercent(cycle, 2030)).toBeCloseTo(0, 5);
    expect(phaseProgressPercent(cycle, 1970)).toBeCloseTo(0, 5);
  });

  it("stays in [0, 100)", () => {
    for (let y = 1900; y < 2100; y += 7) {
      const p = phaseProgressPercent(cycle, y);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThan(100);
    }
  });
});

describe("phaseFraction", () => {
  it("is 0 at peak", () => {
    expect(phaseFraction(cycle, 2000)).toBeCloseTo(0, 10);
  });

  it("is 0.5 at half period (trough)", () => {
    expect(phaseFraction(cycle, 2030)).toBeCloseTo(0.5, 10);
  });

  it("stays in [0, 1)", () => {
    for (let y = 1900; y < 2100; y += 7) {
      const f = phaseFraction(cycle, y);
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThan(1);
    }
  });
});
