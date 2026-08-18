import { cycles } from "@/data/cycles";
import type { Cycle } from "@/data/types";
import {
  phasePositionLabel,
  sineAtYear,
  type PhasePositionLabel,
} from "@/lib/cycleMath";
import { cycleRoutePath } from "@/lib/cycleRoutes";
import { SITE_URL } from "@/lib/siteConfig";

/**
 * The annual "state of the cycles" reading — /state/<year> and
 * /api/v1/state — as pure derivation.
 *
 * Everything here is computed from `reference_peak_year` + `period_years`
 * via the same cosine the chart draws. No year-phase claim is authored by
 * hand (see AGENTS.md / KP-001: hand-written phase prose drifts from the
 * math; derived values cannot).
 */

/** First year an annual state reading exists. Earlier years 404. */
export const STATE_FIRST_YEAR = 2026;

/**
 * Years with a published state reading: STATE_FIRST_YEAR through the
 * current year. Pages for later years derive themselves as the clock
 * advances — there is no annual editorial chore.
 */
export function stateYears(
  currentYear: number = new Date().getUTCFullYear()
): number[] {
  const last = Math.max(STATE_FIRST_YEAR, currentYear);
  const out: number[] = [];
  for (let year = STATE_FIRST_YEAR; year <= last; year += 1) out.push(year);
  return out;
}

export function statePath(year: number): string {
  return `/state/${year}`;
}

/** Next peak year strictly after `year`, rounded to the integer-year grid. */
export function nextPeakYear(cycle: Cycle, year: number): number {
  return nextExtremumYear(cycle, year, 0);
}

/** Next trough year strictly after `year` (peaks offset by half a period). */
export function nextTroughYear(cycle: Cycle, year: number): number {
  return nextExtremumYear(cycle, year, cycle.period_years / 2);
}

function nextExtremumYear(cycle: Cycle, year: number, offset: number): number {
  const anchor = cycle.reference_peak_year + offset;
  const k = Math.floor((year - anchor) / cycle.period_years) + 1;
  // Same integer-year rounding as extremaInRange in cycleRoutes.ts.
  return Math.round(anchor + k * cycle.period_years);
}

export interface CycleStateEntry {
  id: string;
  name: string;
  period_years: number;
  reference_peak_year: number;
  /** cos(2π · (year − reference_peak_year) / period_years), 2 decimals. */
  cos: number;
  phase: PhasePositionLabel;
  next_peak_year: number;
  next_trough_year: number;
  page: string;
}

export function cycleStateAtYear(cycle: Cycle, year: number): CycleStateEntry {
  return {
    id: cycle.id,
    name: cycle.name,
    period_years: cycle.period_years,
    reference_peak_year: cycle.reference_peak_year,
    cos: Math.round(sineAtYear(cycle, year) * 100) / 100,
    phase: phasePositionLabel(cycle, year),
    next_peak_year: nextPeakYear(cycle, year),
    next_trough_year: nextTroughYear(cycle, year),
    page: `${SITE_URL}${cycleRoutePath(cycle)}`,
  };
}

/** All cycles' state at a year, ascending period (the /cycles ordering). */
export function stateOfCycles(year: number): CycleStateEntry[] {
  return [...cycles]
    .sort((a, b) => a.period_years - b.period_years)
    .map((cycle) => cycleStateAtYear(cycle, year));
}
