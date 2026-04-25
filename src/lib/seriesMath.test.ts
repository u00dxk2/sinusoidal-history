import { describe, it, expect } from "vitest";
import {
  normalizeSeries,
  alignSeriesToYears,
  pearsonCorrelation,
  pairedValuesForCorrelation,
  type SeriesPoint,
} from "./seriesMath";

describe("normalizeSeries", () => {
  it("returns empty array for empty input", () => {
    expect(normalizeSeries([])).toEqual([]);
  });

  it("maps min to -1, max to +1", () => {
    const out = normalizeSeries([
      { year: 2000, value: 0 },
      { year: 2001, value: 5 },
      { year: 2002, value: 10 },
    ]);
    expect(out[0].value).toBeCloseTo(-1, 10);
    expect(out[2].value).toBeCloseTo(1, 10);
    expect(out[1].value).toBeCloseTo(0, 10);
  });

  it("preserves raw value on each point", () => {
    const out = normalizeSeries([
      { year: 2000, value: 3 },
      { year: 2001, value: 7 },
    ]);
    expect(out[0].raw).toBe(3);
    expect(out[1].raw).toBe(7);
  });

  it("handles constant series by emitting zeros", () => {
    const out = normalizeSeries([
      { year: 2000, value: 4 },
      { year: 2001, value: 4 },
    ]);
    expect(out.every((p) => p.value === 0)).toBe(true);
  });
});

describe("alignSeriesToYears", () => {
  it("returns null for years missing from the series", () => {
    const aligned = alignSeriesToYears(
      [
        { year: 2000, value: 1 },
        { year: 2002, value: 3 },
      ],
      [2000, 2001, 2002]
    );
    expect(aligned[0]).toEqual({ year: 2000, value: 1 });
    expect(aligned[1]).toBeNull();
    expect(aligned[2]).toEqual({ year: 2002, value: 3 });
  });

  it("returns empty for empty years", () => {
    expect(alignSeriesToYears([{ year: 2000, value: 1 }], [])).toEqual([]);
  });
});

describe("pearsonCorrelation", () => {
  it("returns 1 for perfectly correlated sequences", () => {
    expect(pearsonCorrelation([1, 2, 3, 4], [2, 4, 6, 8])).toBeCloseTo(1, 10);
  });

  it("returns -1 for perfectly anti-correlated sequences", () => {
    expect(pearsonCorrelation([1, 2, 3, 4], [8, 6, 4, 2])).toBeCloseTo(-1, 10);
  });

  it("returns null for mismatched lengths", () => {
    expect(pearsonCorrelation([1, 2, 3], [1, 2])).toBeNull();
  });

  it("returns null for length < 2", () => {
    expect(pearsonCorrelation([1], [1])).toBeNull();
    expect(pearsonCorrelation([], [])).toBeNull();
  });

  it("returns null for constant series (zero variance)", () => {
    expect(pearsonCorrelation([1, 1, 1, 1], [1, 2, 3, 4])).toBeNull();
  });

  it("returns 0 for uncorrelated sequences", () => {
    const r = pearsonCorrelation([-2, -1, 0, 1, 2], [4, 1, 0, 1, 4]);
    expect(r).not.toBeNull();
    expect(Math.abs(r!)).toBeLessThan(0.001);
  });
});

describe("pairedValuesForCorrelation", () => {
  it("pairs series values with cycle values evaluated at each point's year", () => {
    const series: SeriesPoint[] = [
      { year: 2000, value: 0.5 },
      { year: 2010, value: -0.3 },
    ];
    const cycleAt = (y: number) => y * 0.01;
    const { series: s, cycle: c } = pairedValuesForCorrelation(series, cycleAt);
    expect(s).toEqual([0.5, -0.3]);
    expect(c).toEqual([20, 20.1]);
  });
});
