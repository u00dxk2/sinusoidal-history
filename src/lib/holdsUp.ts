// The "Does it hold up?" answer, in the words both of its surfaces use: the box at the top of
// each /cycles/<slug> page and that page's share card (/og?cycle=<id>). Until I-032
// (2026-10-10) the share card said nothing about checking: a friend sent the page met a curve,
// a period and a series name, and no sign that anyone had looked. The card's sentences are
// built here from the same frozen verdict row, so the card and the page cannot drift.
//
// No primary verdict is eligible today, so no sentence here may say a test ran (I-028's guard
// reads the card text and its alt; src/lib/testedSeries.test.ts).

import type { Cycle } from "@/data/types";
import { seriesForCycle } from "@/lib/cycleRoutes";
import {
  SPECTRAL_STATE_LABELS,
  spectralVerdictForCycle,
  type SpectralVerdictRow,
} from "@/lib/spectral";
import { testedSeriesNote } from "@/lib/testedSeries";

/** The page box's headline for an ineligible verdict, without its trailing clause. */
export const NOT_TESTABLE_HEADLINE = "Not testable on the record that exists";

/** The headline and reason for a cycle with no paired series, so no verdict row. */
export const NO_SERIES_HEADLINE = "Not tested";
export const NO_SERIES_REASON =
  "this cycle has no paired data series on this site, so there is no record to test it against.";

/** "Tested — <state label>" for an eligible verdict. */
export function testedHeadline(verdict: SpectralVerdictRow): string {
  return `Tested — ${SPECTRAL_STATE_LABELS[verdict.state]}`;
}

/**
 * "0.7 of the 3.0 full periods". One decimal, as the page prints it: the card must carry the
 * page's number, never the raw cycles_covered (manager review 2026-10-10, correction 1).
 */
export function periodsCovered(verdict: SpectralVerdictRow): string {
  return `${verdict.cycles_covered.toFixed(1)} of the 3.0 full periods`;
}

export type HoldsUpCard = { headline: string; detail: string };

/**
 * The share card's two lines. Where the verdict is judged on a different cut from the series the
 * card names under "Paired data" (Kondratiev, Turchin), the detail names the judged record, so the
 * number is never credited to the drawn one (manager review 2026-10-10, correction 4). Null for a
 * cycle with a paired series but no verdict row (none today).
 */
export function holdsUpCard(cycle: Cycle): HoldsUpCard | null {
  const series = seriesForCycle(cycle);
  const verdict = spectralVerdictForCycle(cycle.id);
  if (!verdict) {
    if (series) return null;
    return {
      headline: NO_SERIES_HEADLINE,
      detail: NO_SERIES_REASON.charAt(0).toUpperCase() + NO_SERIES_REASON.slice(1),
    };
  }
  const headline = verdict.eligible ? testedHeadline(verdict) : NOT_TESTABLE_HEADLINE;
  const covered = `${periodsCovered(verdict)} a test requires.`;
  if (series && series.id === verdict.series_id) {
    return { headline, detail: `Its paired record covers ${covered}` };
  }
  const tested = testedSeriesNote(verdict.series_id);
  return {
    headline,
    detail: tested
      ? `Judged on ${tested.name}: ${covered}`
      : `Judged on a different cut of the paired series: ${covered}`,
  };
}

/** One sentence for the card's alt text: "Does it hold up? <headline>. <detail>" */
export function holdsUpAlt(cycle: Cycle): string {
  const card = holdsUpCard(cycle);
  return card ? `Does it hold up? ${card.headline}. ${card.detail}` : "";
}
