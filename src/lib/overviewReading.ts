import type { Cycle } from "@/data/types";
import { phasePositionLabel } from "./cycleMath";

/**
 * The phone overview's drawn reading and its spoken reading must move
 * together.
 *
 * The row draws a now-line and a dot only when the current year falls inside
 * the brushed range; shipped 2026-09-22, its screen-reader text asserted a
 * phase at the current year unconditionally, so brushing away from today left
 * the two readings of the same row disagreeing — the sighted one silent, the
 * spoken one still claiming "peaking in 2026". Both now come from the same
 * predicate here rather than from two copies of the same comparison.
 */
export function isYearInRange(
  year: number,
  startYear: number,
  endYear: number
): boolean {
  return year >= startYear && year <= endYear;
}

export interface OverviewReadingRange {
  currentYear: number;
  startYear: number;
  endYear: number;
}

/**
 * The sr-only sentence that follows a row's visible name. Leads with a space:
 * it is appended to that name, not read alone.
 */
export function overviewRowReading(
  cycle: Cycle,
  { currentYear, startYear, endYear }: OverviewReadingRange
): string {
  const period = `${cycle.period_years}-year cycle`;
  return isYearInRange(currentYear, startYear, endYear)
    ? ` (${period}): ${phasePositionLabel(cycle, currentYear)} in ${currentYear}.`
    : ` (${period}): drawn ${startYear}–${endYear}; ${currentYear} is outside the years shown.`;
}
