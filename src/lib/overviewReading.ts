import type { Cycle } from "@/data/types";
import { phasePositionLabel } from "./cycleMath";
import { holdsUpCard } from "./holdsUp";

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
 *
 * The phase is the drawn CURVE's position, and the verdict follows it (I-048):
 * "Ray Dalio (75-year cycle): peaking in 2026." read as the site agreeing that
 * the cycle is peaking (cold walks 2026-10-14 and 10-15). The headline is
 * holdsUpCard's, so it cannot drift from the card and the cycle page.
 */
export function overviewRowReading(
  cycle: Cycle,
  { currentYear, startYear, endYear }: OverviewReadingRange
): string {
  const period = `${cycle.period_years}-year cycle`;
  const card = holdsUpCard(cycle);
  const verdict = card ? ` ${card.headline}.` : "";
  return isYearInRange(currentYear, startYear, endYear)
    ? ` (${period}): curve ${phasePositionLabel(cycle, currentYear)} in ${currentYear}.${verdict}`
    : ` (${period}): drawn ${startYear}–${endYear}; ${currentYear} is outside the years shown.${verdict}`;
}
