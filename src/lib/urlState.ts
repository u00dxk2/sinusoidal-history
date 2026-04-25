"use client";

import { useMemo } from "react";
import {
  parseAsStringEnum,
  parseAsString,
  parseAsInteger,
  useQueryState,
  useQueryStates,
  type ParserBuilder,
} from "nuqs";
import type { Cycle } from "@/data/types";
import type { CycleOverride } from "@/components/CycleOverlay";

export type TabName = "facets" | "overlay" | "calibrate";

const TAB_VALUES = ["facets", "overlay", "calibrate"] as const;

export const PRESET_RANGES: Record<
  string,
  { start: number; end: number }
> = {
  all: { start: 1600, end: 2050 },
  industrial: { start: 1750, end: 2050 },
  modern: { start: 1900, end: 2050 },
  living: { start: 1950, end: 2050 },
  now: { start: 2000, end: 2050 },
};

export function parseRange(
  value: string | null,
  fallback: { start: number; end: number }
): { start: number; end: number; preset: string | null } {
  if (!value) return { ...fallback, preset: null };
  if (value in PRESET_RANGES) {
    return { ...PRESET_RANGES[value], preset: value };
  }
  const match = value.match(/^(\d{3,4})-(\d{3,4})$/);
  if (match) {
    const start = Number(match[1]);
    const end = Number(match[2]);
    if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
      return { start, end, preset: null };
    }
  }
  return { ...fallback, preset: null };
}

export function formatRange(
  start: number,
  end: number,
  fullStart: number,
  fullEnd: number
): string | null {
  if (start === fullStart && end === fullEnd) return null;
  for (const [name, preset] of Object.entries(PRESET_RANGES)) {
    if (preset.start === start && preset.end === end) return name;
  }
  return `${start}-${end}`;
}

/**
 * Hooks for URL-state scalars.
 */
export function useTabState() {
  return useQueryState(
    "tab",
    parseAsStringEnum<TabName>([...TAB_VALUES]).withDefault("facets")
  );
}

export function useFocusState() {
  return useQueryState("focus", parseAsString);
}

export function useRangeState() {
  return useQueryState("range", parseAsString);
}

/**
 * Returns [overrides, setOverride] where overrides is a plain JS dict keyed
 * by cycle id, and setOverride(id, partial) merges into the URL.
 */
export function useOverridesState(cycles: Cycle[]): [
  Record<string, CycleOverride>,
  (id: string, ov: CycleOverride) => void,
  (id: string) => void,
  (next: Record<string, CycleOverride>) => void,
] {
  const schema = useMemo(() => {
    const s: Record<string, ParserBuilder<number>> = {};
    for (const c of cycles) {
      s[`peak.${c.id}`] = parseAsInteger;
      s[`period.${c.id}`] = parseAsInteger;
    }
    return s;
    // NOTE: cycles.map(c => c.id).join() is the stable identity; cycles is
    // constant across the app lifetime so this runs once.
  }, [cycles]);

  const [params, setParams] = useQueryStates(schema);

  const overrides = useMemo(() => {
    const out: Record<string, CycleOverride> = {};
    for (const c of cycles) {
      const peak = params[`peak.${c.id}`];
      const period = params[`period.${c.id}`];
      if (peak != null || period != null) {
        out[c.id] = {
          reference_peak_year: peak ?? undefined,
          period_years: period ?? undefined,
        };
      }
    }
    return out;
  }, [params, cycles]);

  const setOverride = (id: string, ov: CycleOverride) => {
    const patch: Record<string, number | null> = {};
    patch[`peak.${id}`] = ov.reference_peak_year ?? null;
    patch[`period.${id}`] = ov.period_years ?? null;
    setParams(patch);
  };

  const resetOverride = (id: string) => {
    const patch: Record<string, number | null> = {
      [`peak.${id}`]: null,
      [`period.${id}`]: null,
    };
    setParams(patch);
  };

  const setAllOverrides = (next: Record<string, CycleOverride>) => {
    const patch: Record<string, number | null> = {};
    for (const c of cycles) {
      patch[`peak.${c.id}`] = next[c.id]?.reference_peak_year ?? null;
      patch[`period.${c.id}`] = next[c.id]?.period_years ?? null;
    }
    setParams(patch);
  };

  return [overrides, setOverride, resetOverride, setAllOverrides];
}
