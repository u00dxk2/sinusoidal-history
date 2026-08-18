import Papa from "papaparse";
import type { SeriesTransform } from "@/data/types";
import type { SeriesPoint } from "./seriesMath";

export function transformSeriesValue(
  value: number,
  transform: SeriesTransform | undefined
): number {
  switch (transform) {
    case "log1p":
      // log1p is defined for x >= -1. Clamp at 0 to handle tiny negative
      // floating-point noise from upstream pipelines.
      return Math.log1p(Math.max(0, value));
    case "none":
    case undefined:
    default:
      return value;
  }
}

export function parseCsvSeries(
  text: string,
  yearColumn: string,
  valueColumn: string,
  transform?: SeriesTransform
): SeriesPoint[] {
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });
  const points: SeriesPoint[] = [];
  for (const row of parsed.data) {
    const y = Number(row[yearColumn]);
    const v = Number(row[valueColumn]);
    if (Number.isFinite(y) && Number.isFinite(v)) {
      // value carries the transform (plot/normalize/correlate on it);
      // sourceValue keeps the real-unit number for tooltips.
      points.push({
        year: y,
        value: transformSeriesValue(v, transform),
        sourceValue: v,
      });
    }
  }
  points.sort((a, b) => a.year - b.year);
  return points;
}
