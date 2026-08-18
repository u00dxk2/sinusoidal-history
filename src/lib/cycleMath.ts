import type { Cycle } from "@/data/types";

export function sineAtYear(cycle: Cycle, year: number): number {
  const phase = (2 * Math.PI * (year - cycle.reference_peak_year)) / cycle.period_years;
  return cycle.amplitude_normalized * Math.cos(phase);
}

export function normalizedPhase(cycle: Cycle, year: number): number {
  const raw = (year - cycle.reference_peak_year) / cycle.period_years;
  const frac = raw - Math.floor(raw);
  return frac;
}

// phasePosition (wide 5% bands, no "crossing") was deleted 2026-08-18: the
// site briefly ran two incompatible phase classifiers, so the overlay tab
// could disagree with the masthead about whether a cycle was "peaking".
// phasePositionLabel below is the single taxonomy every surface uses.

export type PhasePositionLabel =
  | "rising"
  | "peaking"
  | "falling"
  | "troughing"
  | "crossing";

// Phase-label band widths, defined a priori in phase fraction (1 = one full
// cycle period): "peaking"/"troughing" within ±3% of the extremum,
// "crossing" within ±1.5% of a zero crossing. In years that is
// period-dependent — ±0.9y for a 30-year cycle, ±4.5y for a 150-year one.
// These are editorial cutoffs for the labels; the underlying cos values are
// exact. The /state pages disclose the cutoffs next to the labels.
export const PEAK_BAND = 0.03;
export const TROUGH_BAND = 0.03;
export const CROSSING_BAND = 0.015;

/**
 * Like phasePosition, but with narrow bands around peak, trough, and zero
 * crossings so "peaking" actually means peaking.
 */
export function phasePositionLabel(
  cycle: Cycle,
  year: number
): PhasePositionLabel {
  const frac = normalizedPhase(cycle, year);

  if (frac < PEAK_BAND || frac > 1 - PEAK_BAND) return "peaking";
  if (Math.abs(frac - 0.5) < TROUGH_BAND) return "troughing";
  if (Math.abs(frac - 0.25) < CROSSING_BAND) return "crossing";
  if (Math.abs(frac - 0.75) < CROSSING_BAND) return "crossing";
  if (frac < 0.5) return "falling";
  return "rising";
}

/**
 * Percentage through the cycle from its most recent trough (0) to the next
 * trough (100), with 50 at peak. Useful for filled-bar gauges in poster mode.
 *
 * We anchor at trough rather than peak so the bar fills intuitively:
 * empty = bottom of cycle, full = next bottom. Peak sits at the middle.
 */
export function phaseProgressPercent(cycle: Cycle, year: number): number {
  const frac = normalizedPhase(cycle, year); // 0=peak, 0.5=trough, 1=peak
  // Shift so 0 = trough. If frac >= 0.5 we're past the trough heading back up;
  // if frac < 0.5 we're past the peak heading down toward the trough.
  const shifted = frac < 0.5 ? frac + 0.5 : frac - 0.5;
  return shifted * 100;
}

/**
 * Phase as a 0..1 fraction of the cycle starting from peak (0=peak, 0.5=trough,
 * 1=next peak). Useful for filling gauge dots.
 */
export function phaseFraction(cycle: Cycle, year: number): number {
  return normalizedPhase(cycle, year);
}
