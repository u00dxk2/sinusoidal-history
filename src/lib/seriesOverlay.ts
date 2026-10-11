// The paired series as the home chart draws it, for a SERVER-rendered figure.
//
// Until I-033 (2026-10-10) no /cycles/<slug> page drew its measured series at all: the page's
// figure was the sinusoid alone, and the series was a name on the "Paired data" line. This is
// the chart's own pipeline (CycleFacet.tsx: useCsvSeries → useVisibleData → normalizeSeries),
// in that order: the series' transform, then the year window, then min-max to [-1, 1]. The
// order matters: normalising before the window would rescale to points the figure never shows.
//
// Server only (node:fs). The CSVs under public/data are read, never written.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { DataSeries } from "@/data/types";
import { parseCsvSeries } from "@/lib/csvSeries";
import { normalizeSeries, type NormalizedPoint } from "@/lib/seriesMath";

/** The series' points inside [start, end], normalised as the chart normalises them. */
export function chartLinePoints(
  series: DataSeries,
  start: number,
  end: number,
): NormalizedPoint[] {
  const text = readFileSync(join(process.cwd(), "public", series.data_file), "utf8");
  return chartLineFromCsv(text, series, start, end);
}

/** The pipeline itself, on CSV text: transform, then the window, then normalise. */
export function chartLineFromCsv(
  text: string,
  series: Pick<DataSeries, "year_column" | "value_column" | "transform">,
  start: number,
  end: number,
): NormalizedPoint[] {
  const points = parseCsvSeries(
    text,
    series.year_column,
    series.value_column,
    series.transform,
  );
  return normalizeSeries(points.filter((p) => p.year >= start && p.year <= end));
}

/** The label the page already gives this series on its "Paired data" line. */
export function seriesKeyName(series: DataSeries): string {
  return series.legend_short ?? series.name;
}
