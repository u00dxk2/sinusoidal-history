import { cycles } from "@/data/cycles";
import type { Cycle } from "@/data/types";
import {
  PEAK_BAND,
  TROUGH_BAND,
  normalizedPhase,
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

/** A cos value as the /state tables print it: signed, two decimals, true minus. */
export function formatCos(v: number): string {
  if (v > 0) return `+${v.toFixed(2)}`;
  if (v < 0) return `−${Math.abs(v).toFixed(2)}`;
  return "0.00";
}

/** The peak (offset 0) or trough (offset period/2) nearest `year`, integer grid. */
function nearestExtremumYear(cycle: Cycle, year: number, offset: number): number {
  const anchor = cycle.reference_peak_year + offset;
  const k = Math.round((year - anchor) / cycle.period_years);
  return Math.round(anchor + k * cycle.period_years);
}

/**
 * Where a cycle's curve puts `year`, in words, for the top of its /cycles/<slug>
 * page: the question a searcher who lands there on the theorist's name arrives
 * with ("where are we now?"), which until 2026-09-29 the page left to be read
 * off the extrema row. Derived from cycleStateAtYear, so it says what
 * /state/<year> and /api/v1/state say and cannot drift from the math (KP-001).
 *
 * `where` is the clause after "<year> sits"; `note` (peak/low only) names the
 * extremum's own year; `next` is a whole sentence. yearPositionSentence joins
 * them the way the page prints them.
 */
export function yearPosition(
  cycle: Cycle,
  year: number
): { where: string; note?: string; cos: string; next: string } {
  const entry = cycleStateAtYear(cycle, year);
  const cos = formatCos(entry.cos);
  const peak = entry.next_peak_year;
  const trough = entry.next_trough_year;
  const peakFirst = peak < trough;
  const both = peakFirst
    ? `The next high falls around ${peak}, and the next low around ${trough}.`
    : `The next low falls around ${trough}, and the next high around ${peak}.`;

  switch (entry.phase) {
    case "peaking":
      return {
        where: "at a peak",
        note: `the curve tops out in ${nearestExtremumYear(cycle, year, 0)}`,
        cos,
        next: `The next low falls around ${trough}.`,
      };
    case "troughing":
      return {
        where: "at a low",
        note: `the curve bottoms out in ${nearestExtremumYear(cycle, year, cycle.period_years / 2)}`,
        cos,
        next: `The next high falls around ${peak}.`,
      };
    case "rising":
      return { where: "on the rising arm", cos, next: both };
    case "falling":
      return { where: "on the falling arm", cos, next: both };
    case "crossing":
      return {
        where: `at the midline, on the way ${peakFirst ? "up" : "down"}`,
        cos,
        next: both,
      };
  }
}

/** yearPosition as the /cycles/<slug> page prints it, one bracket per sentence. */
export function yearPositionSentence(cycle: Cycle, year: number): string {
  const { where, note, cos, next } = yearPosition(cycle, year);
  const bracket = note ? `${note}; cos ${cos}` : `cos ${cos}`;
  return `By this page's curve, ${year} sits ${where} (${bracket}). ${next}`;
}

/** |cos| from which a rising/falling row looks like a turning point and gets a reason. */
export const PHASE_REASON_COS = 0.9;

/** A year count as the reason line prints it: at most two decimals, no trailing zeros. */
function formatYears(v: number): string {
  return String(Math.round(v * 100) / 100);
}

/**
 * Why a row near a turning point carries the word it does, for the /state
 * reading. The bands are a share of the period, so in years they differ by
 * cycle: in 2026 Huntington, 2 years before its peak, reads "rising" while
 * Khaldun, 3 years before its own, reads "peaking" (cold walk 2026-10-03,
 * I-013). David's ruling (2026-10-03): keep the band, make the line say why.
 * Returns null away from a peak or trough, where the word is not in doubt.
 */
export function phaseReason(cycle: Cycle, year: number): string | null {
  const frac = normalizedPhase(cycle, year);
  const label = phasePositionLabel(cycle, year);
  const nearPeak = frac < 0.25 || frac > 0.75;
  const turning = label === "peaking" || label === "troughing";
  if (!turning && Math.abs(Math.cos(2 * Math.PI * frac)) < PHASE_REASON_COS) return null;

  const period = cycle.period_years;
  const offset = nearPeak ? (frac > 0.5 ? frac - 1 : frac) : frac - 0.5;
  const dist = Math.abs(offset) * period;
  const side = offset < 0 ? "before" : "after";
  const kind = nearPeak ? "peak" : "trough";
  const word = nearPeak ? "peaking" : "troughing";
  const band = formatYears((nearPeak ? PEAK_BAND : TROUGH_BAND) * period);
  const d = formatYears(dist);
  // A turning point between whole years: the table rounds it ("next trough
  // 2028") while the distance does not (1.5 years), so say both (Codex r1-2).
  // "Shown as" is the row's own next-turn year, from the same function the
  // row prints, never a second rounding of a float.
  const exact = formatYears(year - offset * period);
  const shown = nearPeak ? nextPeakYear(cycle, year) : nextTroughYear(cycle, year);
  const when = !exact.includes(".")
    ? ""
    : side === "before"
      ? ` at ${exact} (shown as ${shown})`
      : ` at ${exact}`;
  // Inside/outside comes from the label itself, never from the rounded
  // numbers, so the sentence cannot disagree with the word (Codex r1-1, r1-5).
  // The rule is named once per line — the share of the period — so the six
  // different year widths read as one rule (manager review, 2026-10-03).
  const share = formatYears((nearPeak ? PEAK_BAND : TROUGH_BAND) * 100);
  const at = d === "0" ? `At its ${kind}` : `${d} ${d === "1" ? "year" : "years"} ${side} its ${kind}${when}`;
  // "either side", not "±": the share is the half-width, and "3%" alone was
  // read as the whole band ("the last 3% of the cycle") — Codex r3-3.
  return `${at}, ${turning ? "inside" : "outside"} the ${word} band: ${band} ${band === "1" ? "year" : "years"} either side, ${share}% of a ${period}-year cycle.`;
}

/** phaseReason for every cycle, by id. Kept off CycleStateEntry so /api/v1/state is unchanged. */
export function phaseReasons(year: number): Record<string, string | null> {
  return Object.fromEntries(cycles.map((c) => [c.id, phaseReason(c, year)]));
}

/** All cycles' state at a year, ascending period (the /cycles ordering). */
export function stateOfCycles(year: number): CycleStateEntry[] {
  return [...cycles]
    .sort((a, b) => a.period_years - b.period_years)
    .map((cycle) => cycleStateAtYear(cycle, year));
}
