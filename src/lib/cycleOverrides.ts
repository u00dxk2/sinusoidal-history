import type { Cycle } from "@/data/types";

/**
 * `peak.<id>` / `period.<id>` URL params are a trust boundary: clamp them to
 * the bounds the calibration sliders enforce. Unclamped, `period.<id>=0`
 * divides by zero and NaNs the curve, correlation, and phase label.
 * Shared by the page (urlState.ts) and the /og share card so one URL draws
 * one picture on both (SIN-S1, 2026-10-05).
 */
export function clampOverrideValue(
  value: number | null,
  min: number,
  max: number
): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  return Math.min(max, Math.max(min, value));
}

export function clampCycleOverride(
  cycle: Cycle,
  peak: number | null,
  period: number | null
): { reference_peak_year?: number; period_years?: number } | null {
  const p = clampOverrideValue(
    peak,
    cycle.reference_peak_year - 30,
    cycle.reference_peak_year + 30
  );
  const q = clampOverrideValue(
    period,
    Math.round(cycle.period_years * 0.75),
    Math.round(cycle.period_years * 1.25)
  );
  if (p == null && q == null) return null;
  return { reference_peak_year: p ?? undefined, period_years: q ?? undefined };
}
