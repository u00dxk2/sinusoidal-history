import { describe, it, expect } from "vitest";
import { cycles } from "@/data/cycles";
import { phasePositionLabel, type PhasePositionLabel } from "@/lib/cycleMath";
import { isYearInRange, overviewRowReading } from "@/lib/overviewReading";

const PHASE_WORDS: PhasePositionLabel[] = [
  "rising",
  "peaking",
  "falling",
  "troughing",
  "crossing",
];

const FULL = { startYear: 1600, endYear: 2050 };

describe("isYearInRange", () => {
  it("includes both endpoints, because the row draws a dot at the edge", () => {
    expect(isYearInRange(1600, 1600, 2050)).toBe(true);
    expect(isYearInRange(2050, 1600, 2050)).toBe(true);
    expect(isYearInRange(1599, 1600, 2050)).toBe(false);
    expect(isYearInRange(2051, 1600, 2050)).toBe(false);
  });
});

describe("overviewRowReading", () => {
  it("speaks the same phase the facet header shows, for every cycle", () => {
    for (const cycle of cycles) {
      const reading = overviewRowReading(cycle, { currentYear: 2026, ...FULL });
      expect(reading).toContain(phasePositionLabel(cycle, 2026));
      expect(reading).toContain(`${cycle.period_years}-year cycle`);
      expect(reading).toContain("in 2026.");
    }
  });

  // The defect this module exists for: the drawn reading (now-line + dot)
  // disappears outside the range, so the spoken one must not assert a phase.
  it("asserts no phase when the current year is outside the brushed range", () => {
    for (const cycle of cycles) {
      const reading = overviewRowReading(cycle, {
        currentYear: 2026,
        startYear: 2027,
        endYear: 2050,
      });
      for (const word of PHASE_WORDS) expect(reading).not.toContain(word);
      expect(reading).toContain("2026 is outside the years shown");
      expect(reading).toContain("drawn 2027–2050");
    }
  });

  it("agrees with the range predicate the row draws from, across ranges", () => {
    const cycle = cycles[0];
    const ranges = [
      { startYear: 1600, endYear: 2050 },
      { startYear: 2000, endYear: 2050 },
      { startYear: 2026, endYear: 2050 },
      { startYear: 1600, endYear: 2026 },
      { startYear: 1600, endYear: 1700 },
      { startYear: 2027, endYear: 2050 },
    ];
    for (const range of ranges) {
      const drawn = isYearInRange(2026, range.startYear, range.endYear);
      const spoken = PHASE_WORDS.some((w) =>
        overviewRowReading(cycle, { currentYear: 2026, ...range }).includes(w)
      );
      expect(spoken).toBe(drawn);
    }
  });
});
