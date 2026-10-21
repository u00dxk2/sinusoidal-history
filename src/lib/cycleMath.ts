import type { Cycle } from "@/data/types";

export function sineAtYear(cycle: Cycle, year: number): number {
  const phase = (2 * Math.PI * (year - cycle.reference_peak_year)) / cycle.period_years;
  return cycle.amplitude_normalized * Math.cos(phase);
}

/**
 * The only years a cycle is drawn over (I-061 shape d', David 2026-10-21:
 * "one wave per cycle, stop at today"). One period centred on the reference
 * peak this site stores, cut at the current year, so the site never draws a
 * repeat of the wave and never draws a year after the present. Every surface
 * that draws a cycle samples through `sampleDrawnPeriod`, so no two can
 * disagree about which years are drawn.
 */
export function drawnPeriod(
  cycle: Cycle,
  currentYear: number
): { from: number; to: number } {
  const half = cycle.period_years / 2;
  return {
    from: cycle.reference_peak_year - half,
    to: Math.min(cycle.reference_peak_year + half, currentYear),
  };
}

/** The part of [start, end] inside the cycle's drawn period, or null. */
export function drawnSpan(
  cycle: Cycle,
  start: number,
  end: number,
  currentYear: number
): { from: number; to: number } | null {
  const p = drawnPeriod(cycle, currentYear);
  const from = Math.max(start, p.from);
  const to = Math.min(end, p.to);
  return from < to ? { from, to } : null;
}

/**
 * Points of the drawn period inside [start, end], every `step` years, with
 * both ends of the span included exactly. Empty when the window holds none
 * of it.
 */
export function sampleDrawnPeriod(
  cycle: Cycle,
  start: number,
  end: number,
  currentYear: number,
  step: number
): { year: number; value: number }[] {
  const span = drawnSpan(cycle, start, end, currentYear);
  if (!span) return [];
  const out: { year: number; value: number }[] = [];
  for (let y = span.from; y < span.to; y += step) {
    out.push({ year: y, value: sineAtYear(cycle, y) });
  }
  out.push({ year: span.to, value: sineAtYear(cycle, span.to) });
  return out;
}

// The phase classifier (phasePositionLabel: rising / peaking / falling /
// troughing / crossing at a year), its gauge helpers and its bands were deleted
// on 2026-10-21 with I-061: no surface says where a year sits on a cycle any
// more, so nothing reads them.
