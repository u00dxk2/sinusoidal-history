"use client";

import { useEffect, useState } from "react";
import type { SeriesPoint } from "./seriesMath";
import type { SeriesTransform } from "@/data/types";
import { parseCsvSeries } from "./csvSeries";

export interface CsvSeriesState {
  points: SeriesPoint[];
  loading: boolean;
  error: string | null;
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
        setState({
          points: parseCsvSeries(text, yearColumn, valueColumn, transform),
          loading: false,
          error: null,
        });
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
