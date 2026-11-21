import type { Cycle } from "@/data/types";
import { drawnPeriod, sineAtYear } from "@/lib/cycleMath";
import type { NormalizedPoint } from "@/lib/seriesMath";

/**
 * The cycle page's "Worked example" (2026-11-21, the search day): the page's own arithmetic,
 * with this cycle's own numbers, so a reader can redo it.
 *
 * Everything here is derived from the stored cycle and the points the page figure already
 * draws (`chartLinePoints`, the same pipeline); nothing is typed by hand. Two rules bind it:
 *  - Only years INSIDE the drawn period are worked (I-061: one period, cut at today; no
 *    present position). On a cut cycle the closing quarter point or trough can lie past
 *    today, so they are dropped, never worked. `curveRows` filters on `drawnPeriod().to`.
 *  - The curve formula is the code's: `amplitude_normalized * cos(...)` (cycleMath.ts:5).
 *    The page shows the amplitude only when it is not 1.
 */

/** One quarter-period step of the drawn curve: −0.5, −0.25, 0, +0.25, +0.5 of a period. */
export interface CurveRow {
  /** Exact year: peak + fraction × period. May carry .5 or .25. */
  year: number;
  /** (year − peak) ÷ period. */
  fraction: number;
  /** The code's own value at that year (`sineAtYear`). */
  height: number;
}

const QUARTERS = [-0.5, -0.25, 0, 0.25, 0.5] as const;

export function curveRows(cycle: Cycle, currentYear: number): CurveRow[] {
  const { from, to } = drawnPeriod(cycle, currentYear);
  return QUARTERS.map((fraction) => {
    const year = cycle.reference_peak_year + fraction * cycle.period_years;
    return { year, fraction, height: sineAtYear(cycle, year) };
  }).filter((r) => r.year >= from && r.year <= to);
}

/** The record's lowest and highest working values, and the rows the page works through. */
export interface RecordWorking {
  first: number;
  last: number;
  /** last − first, the span the verdict counts (verdicts.json `span_years`). */
  span: number;
  low: { year: number; raw: number; working: number };
  high: { year: number; raw: number; working: number };
  /** First year, lowest, highest: de-duplicated, in year order. */
  rows: { year: number; raw: number; working: number; plotted: number }[];
}

/**
 * The working value the min-max runs on: the source value, or ln(1 + value) for a log1p series
 * (csvSeries.ts transformSeriesValue: `Math.log1p(Math.max(0, v))`).
 */
export function workingValue(raw: number, transform: string | undefined): number {
  return transform === "log1p" ? Math.log1p(Math.max(0, raw)) : raw;
}

/**
 * Null when there are fewer than two points or the record is flat (nothing to scale).
 * Ties for lowest or highest take the EARLIEST year, which is the one the page names.
 */
export function recordWorking(
  points: readonly NormalizedPoint[],
  transform: string | undefined,
): RecordWorking | null {
  if (points.length < 2) return null;
  const withWorking = points.map((p) => ({
    year: p.year,
    raw: p.raw,
    working: workingValue(p.raw, transform),
    plotted: p.value,
  }));
  let low = withWorking[0];
  let high = withWorking[0];
  for (const p of withWorking) {
    if (p.working < low.working) low = p;
    if (p.working > high.working) high = p;
  }
  if (low.working === high.working) return null;
  const first = withWorking[0];
  const last = withWorking[withWorking.length - 1];
  const rows = [first, low, high]
    .filter((r, i, all) => all.findIndex((o) => o.year === r.year) === i)
    .sort((a, b) => a.year - b.year);
  return {
    first: first.year,
    last: last.year,
    span: last.year - first.year,
    low: { year: low.year, raw: low.raw, working: low.working },
    high: { year: high.year, raw: high.raw, working: high.working },
    rows,
  };
}

/** The page's formula for the plotted height, applied by hand: it must equal the pipeline's. */
export function plottedHeight(working: number, low: number, high: number): number {
  return (2 * (working - low)) / (high - low) - 1;
}

/** A signed number for the page: a true minus sign, no "−0". */
export function signed(n: number, digits: number): string {
  const s = n.toFixed(digits);
  if (Number(s) === 0) return (0).toFixed(digits);
  return n < 0 ? `−${s.slice(1)}` : n > 0 && digits > 0 ? `+${s}` : s;
}

/** A source value as the CSV gives it, with a true minus sign. */
export function plain(n: number): string {
  const s = String(n);
  return s.startsWith("-") ? `−${s.slice(1)}` : s;
}

/**
 * The scaling formula as the page prints it, readable at any sign of the low: a low of 0 drops
 * its terms, a negative low reads "+ 2.4902" rather than "− −2.4902" (same-family review,
 * finding 2). `approx` prints "≈" where the endpoints are rounded (the log1p series).
 */
export function scaleFormula(term: string, low: number, high: number, approx: boolean): string {
  const minusLow = low === 0 ? "" : low < 0 ? ` + ${plain(-low)}` : ` − ${plain(low)}`;
  const num = low === 0 ? term : `(${term}${minusLow})`;
  const den = low === 0 ? plain(high) : `(${plain(high)}${minusLow})`;
  return `plotted height ${approx ? "≈" : "="} 2 × ${num} ÷ ${den} − 1`;
}

/** A year that may be fractional (1912.5, 1986.25), printed exactly. */
export function exactYear(y: number): string {
  return String(y);
}
