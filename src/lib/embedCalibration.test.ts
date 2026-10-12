import { describe, expect, it } from "vitest";
import { cycles } from "@/data/cycles";
import { calibrationClauses } from "./embedCalibration";

const huntington = cycles.find((c) => c.id === "huntington")!;

describe("calibrationClauses (I-037)", () => {
  it("names a moved peak beside the site's reference peak", () => {
    expect(calibrationClauses(huntington, { reference_peak_year: 1972 })).toEqual([
      "peak 1972 (the site's reference peak is 1968)",
    ]);
  });

  it("still names the site's reference peak when only the period moved", () => {
    const got = calibrationClauses(huntington, { period_years: 58 });
    expect(got).toEqual([
      "period 58y (the site's is 60y)",
      "the site's reference peak 1968",
    ]);
  });

  it("names both when both moved", () => {
    expect(
      calibrationClauses(huntington, { reference_peak_year: 1972, period_years: 58 })
    ).toEqual([
      "peak 1972 (the site's reference peak is 1968)",
      "period 58y (the site's is 60y)",
    ]);
  });

  it("prints nothing for no override, or one equal to the published values", () => {
    expect(calibrationClauses(huntington, undefined)).toEqual([]);
    expect(
      calibrationClauses(huntington, { reference_peak_year: 1968, period_years: 60 })
    ).toEqual([]);
  });
});
