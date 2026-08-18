import { describe, expect, it } from "vitest";
import { parseCsvSeries, transformSeriesValue } from "./csvSeries";

describe("transformSeriesValue", () => {
  it("returns raw values when no transform is requested", () => {
    expect(transformSeriesValue(12.5, undefined)).toBe(12.5);
    expect(transformSeriesValue(12.5, "none")).toBe(12.5);
  });

  it("applies log1p and clamps tiny negative inputs to zero", () => {
    expect(transformSeriesValue(99, "log1p")).toBeCloseTo(Math.log1p(99), 10);
    expect(transformSeriesValue(-0.0000001, "log1p")).toBe(0);
  });
});

describe("parseCsvSeries", () => {
  it("parses configured columns into sorted numeric points", () => {
    const csv = [
      "year,value,ignored",
      "2002,3,x",
      "2000,1,y",
      "2001,2,z",
    ].join("\n");

    expect(parseCsvSeries(csv, "year", "value")).toEqual([
      { year: 2000, value: 1, sourceValue: 1 },
      { year: 2001, value: 2, sourceValue: 2 },
      { year: 2002, value: 3, sourceValue: 3 },
    ]);
  });

  it("skips rows with non-finite years or values", () => {
    const csv = [
      "year,value",
      "2000,1",
      "not-a-year,2",
      "2002,not-a-value",
      "2003,4",
    ].join("\n");

    expect(parseCsvSeries(csv, "year", "value")).toEqual([
      { year: 2000, value: 1, sourceValue: 1 },
      { year: 2003, value: 4, sourceValue: 4 },
    ]);
  });

  it("applies transforms to value while keeping the raw sourceValue", () => {
    const csv = ["year,deaths", "2000,0", "2001,99"].join("\n");

    expect(parseCsvSeries(csv, "year", "deaths", "log1p")).toEqual([
      { year: 2000, value: 0, sourceValue: 0 },
      { year: 2001, value: Math.log1p(99), sourceValue: 99 },
    ]);
  });
});
