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

/**
 * Whether the drawn period stops at today because the period has not ended yet
 * (Perez and Turchin in 2026). Prose that says a cycle "is drawn as one period"
 * is false for these, so it branches on this (I-065).
 */
export function periodCutAtToday(cycle: Cycle, currentYear: number): boolean {
  return (
    drawnPeriod(cycle, currentYear).to <
    cycle.reference_peak_year + cycle.period_years / 2
  );
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
 * Which side of [start, end] the cycle's drawn period lies on, when the window
 * holds none of it (I-069): the cases where `drawnSpan` is null. Null while the
 * window draws any of the period. A period that only TOUCHES the window at one
 * edge (period.to === start, or period.from === end) draws nothing there, so it
 * counts as outside, on that side. It names a side of the window, never where
 * the present sits (I-061).
 */
export function periodSideOutside(
  cycle: Cycle,
  start: number,
  end: number,
  currentYear: number
): "before" | "after" | null {
  if (drawnSpan(cycle, start, end, currentYear)) return null;
  const p = drawnPeriod(cycle, currentYear);
  if (p.to <= start) return "before";
  if (p.from >= end) return "after";
  return null;
}

/**
 * Which side of [start, end] a paired data series lies on, when the window
 * draws none of its line (I-074): fewer than two of its points fall inside
 * [start, end] (inclusive, as `useVisibleData` filters), so no segment is drawn.
 * "after" when every point is at or after `end`, "before" when every point is
 * at or before `start`: the same edge-touch rule as `periodSideOutside`. Null
 * while a line is drawn, for no points (a series not yet loaded must not
 * read as outside), or when the points straddle the window without a segment
 * in it.
 */
export function pointsSideOutside(
  years: readonly number[],
  start: number,
  end: number
): "before" | "after" | null {
  if (years.length === 0) return null;
  const inside = years.filter((y) => y >= start && y <= end).length;
  if (inside >= 2) return null;
  if (years.every((y) => y >= end)) return "after";
  if (years.every((y) => y <= start)) return "before";
  return null;
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
