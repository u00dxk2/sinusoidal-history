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
import { PRESET_RANGES, type RangePresetName } from "@/lib/siteConfig";

export type TabName = "facets" | "overlay" | "calibrate";

const TAB_VALUES = ["facets", "overlay", "calibrate"] as const;

export function parseRange(
  value: string | null,
  fallback: { start: number; end: number }
): { start: number; end: number; preset: string | null } {
  if (!value) return { ...fallback, preset: null };
  if (value in PRESET_RANGES) {
    const preset = PRESET_RANGES[value as RangePresetName];
    return { start: preset.start, end: preset.end, preset: value };
  }
  const match = value.match(/^(\d{3,4})-(\d{3,4})$/);
  if (match) {
    // Clamp to the chart's real extent: an unclamped range like 100-9999
    // renders axes the brush (fixed to 1600-2050) cannot describe.
    const start = Math.max(fallback.start, Number(match[1]));
    const end = Math.min(fallback.end, Number(match[2]));
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

function clampOverrideValue(
  value: number | null,
  min: number,
  max: number
): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  return Math.min(max, Math.max(min, value));
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
      // URL params are a trust boundary: clamp to the same bounds the
      // calibration sliders enforce. Unclamped, ?period.<id>=0 divides by
      // zero and NaNs the curve, correlation, and phase label.
      const peak = clampOverrideValue(
        params[`peak.${c.id}`],
        c.reference_peak_year - 30,
        c.reference_peak_year + 30
      );
      const period = clampOverrideValue(
        params[`period.${c.id}`],
        Math.round(c.period_years * 0.75),
        Math.round(c.period_years * 1.25)
      );
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
