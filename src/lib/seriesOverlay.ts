// The record a cycle page draws on its curve, for a SERVER-rendered figure.
//
// I-033 (2026-10-10) drew each page's paired series, as the home chart draws it. I-035
// (2026-10-11) narrowed that to the record the verdict is JUDGED on: on Kondratiev and Turchin
// the two differ (the annual TFP figures, not the 5-year average; the wealth share from 1913,
// not from 1820), and a figure drawing one record above a verdict about another tells the
// reader the wrong thing. Seven pages draw their series unchanged; the two cuts come from
// testedSeries.ts, whose judgedLine a test checks against the frozen analysis manifest.
//
// The pipeline is the chart's (CycleFacet.tsx), in its order: the transform, then the year
// window (and the judged record's own start year), then min-max to [-1, 1].
//
// Server only (node:fs). The CSVs under public/data are read, never written.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Cycle, DataSeries } from "@/data/types";
import { parseCsvSeries } from "@/lib/csvSeries";
import { seriesForCycle } from "@/lib/cycleRoutes";
import { normalizeSeries, type NormalizedPoint } from "@/lib/seriesMath";
import { spectralVerdictForCycle } from "@/lib/spectral";
import { testedSeriesNote } from "@/lib/testedSeries";

export type JudgedRecord = Pick<
  DataSeries,
  "data_file" | "year_column" | "value_column" | "transform" | "color"
> & {
  /** First year the verdict counts; absent when it counts the whole series. */
  min_year?: number;
  /** The key's short name: the page's "Paired data" label, or the judged cut's name. */
  keyName: string;
  /** The full name, for the figure's accessible label. */
  fullName: string;
};

/**
 * The record this cycle's verdict is judged on, or null when there is nothing to draw: no
 * paired series, no verdict row, or a judged cut this site cannot name.
 */
export function judgedRecord(cycle: Cycle): JudgedRecord | null {
  const series = seriesForCycle(cycle);
  const verdict = spectralVerdictForCycle(cycle.id);
  if (!series || !verdict) return null;
  if (series.id === verdict.series_id) {
    return {
      data_file: series.data_file,
      year_column: series.year_column,
      value_column: series.value_column,
      transform: series.transform,
      color: series.color,
      keyName: series.legend_short ?? series.name,
      fullName: series.name,
    };
  }
  const note = testedSeriesNote(verdict.series_id);
  if (!note) return null;
  return {
    data_file: note.judgedLine.data_file,
    year_column: series.year_column,
    value_column: note.judgedLine.value_column,
    transform: undefined,
    color: series.color,
    min_year: note.judgedLine.min_year,
    keyName: note.name,
    fullName: note.name,
  };
}

/** The judged record's points inside [start, end], normalised as the chart normalises. */
export function chartLinePoints(
  record: JudgedRecord,
  start: number,
  end: number,
): NormalizedPoint[] {
  const text = readFileSync(join(process.cwd(), "public", record.data_file), "utf8");
  return chartLineFromCsv(text, record, Math.max(start, record.min_year ?? start), end);
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
