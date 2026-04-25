"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import type { SeriesPoint } from "./seriesMath";
import type { SeriesTransform } from "@/data/types";

export interface CsvSeriesState {
  points: SeriesPoint[];
  loading: boolean;
  error: string | null;
}

function applyTransform(
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

export function useCsvSeries(
  path: string,
  yearColumn: string,
  valueColumn: string,
  transform?: SeriesTransform
): CsvSeriesState {
  const [state, setState] = useState<CsvSeriesState>({
    points: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (cancelled) return;
        const parsed = Papa.parse<Record<string, string>>(text, {
          header: true,
          skipEmptyLines: true,
        });
        const points: SeriesPoint[] = [];
        for (const row of parsed.data) {
          const y = Number(row[yearColumn]);
          const v = Number(row[valueColumn]);
          if (Number.isFinite(y) && Number.isFinite(v)) {
            points.push({ year: y, value: applyTransform(v, transform) });
          }
        }
        points.sort((a, b) => a.year - b.year);
        setState({ points, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "unknown error";
        setState({ points: [], loading: false, error: msg });
      });

    return () => {
      cancelled = true;
    };
  }, [path, yearColumn, valueColumn, transform]);

  return state;
}
