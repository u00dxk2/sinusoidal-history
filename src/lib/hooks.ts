"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { scaleLinear, type ScaleLinear } from "d3-scale";
import type { Cycle } from "@/data/types";
import { sineAtYear } from "./cycleMath";
import type { SeriesPoint } from "./seriesMath";

export type LinearScale = ScaleLinear<number, number>;

export function useTimeScale(
  startYear: number,
  endYear: number,
  width: number
): LinearScale {
  return useMemo(
    () => scaleLinear().domain([startYear, endYear]).range([0, width]),
    [startYear, endYear, width]
  );
}

export function useVisibleData(
  points: SeriesPoint[],
  startYear: number,
  endYear: number
): SeriesPoint[] {
  return useMemo(
    () => points.filter((p) => p.year >= startYear && p.year <= endYear),
    [points, startYear, endYear]
  );
}

export function useCycleValues(
  cycle: Cycle,
  startYear: number,
  endYear: number,
  step: number = 0.5
): { year: number; value: number }[] {
  return useMemo(() => {
    const out: { year: number; value: number }[] = [];
    for (let y = startYear; y <= endYear; y += step) {
      out.push({ year: y, value: sineAtYear(cycle, y) });
    }
    return out;
  }, [cycle, startYear, endYear, step]);
}

export function useContainerWidth(
  ref: React.RefObject<HTMLElement | null>,
  initial: number = 960
): number {
  const [width, setWidth] = useState(initial);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) setWidth(w);
      }
    });
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width || initial);
    return () => ro.disconnect();
  }, [ref, initial]);
  return width;
}

export function useEscapeKey(handler: () => void, enabled: boolean = true) {
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  });
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handlerRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
}
