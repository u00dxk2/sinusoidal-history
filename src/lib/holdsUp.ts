// The "Does it hold up?" answer, in the words both of its surfaces use: the box at the top of
// each /cycles/<slug> page and that page's share card (/og?cycle=<id>). Until I-032
// (2026-10-10) the share card said nothing about checking: a friend sent the page met a curve,
// a period and a series name, and no sign that anyone had looked. The card's sentences are
// built here from the same frozen verdict row, so the card and the page cannot drift.
//
// No primary verdict is eligible today, so no sentence here may say a test ran (I-028's guard
// reads the card text and its alt; src/lib/testedSeries.test.ts).

import { cycles as storedCycles } from "@/data/cycles";
import type { Cycle } from "@/data/types";
import { ogMainStandfirst } from "@/lib/countWords";
import { seriesForCycle } from "@/lib/cycleRoutes";
import {
  SPECTRAL_STATE_LABELS,
  spectralVerdictForCycle,
  type SpectralVerdictRow,
} from "@/lib/spectral";
import { testedSeriesNote } from "@/lib/testedSeries";

/**
 * The page box's headline for an ineligible verdict, without its trailing clause.
 * I-078 (2026-11-19): was "Not testable on the record that exists". Codex (r1 on 237aaba, and the
 * round 0 claims pass) refuted that as broader than the data: five of these nine cycles' periods
 * cleared the gate on OTHER cycles' records (the 19 cross-grid re-pairings). So the headline names
 * the record it speaks for: the one this site pairs with the cycle.
 */
export const NOT_TESTABLE_HEADLINE = "Not testable on its paired record";

/**
 * The headline and reason for a cycle with no paired series, so no verdict row.
 * I-078 (2026-11-19): was "Not tested" and "… so there is no record to test it against". Its
 * period WAS set against five other cycles' records (cross-grid), so neither held. What sets this
 * cycle apart is that no series is paired with it, so it has no verdict of its own.
 */
export const NO_SERIES_HEADLINE = "No paired data series";
export const NO_SERIES_REASON =
  "this site pairs no data series with this cycle, so it gives the cycle no verdict.";

/**
 * I-078 (2026-11-19). The stored period of the cycle a surface draws, or null for an id this site
 * does not carry. The verdicts are frozen at these periods.
 */
export function storedPeriod(cycle: Cycle): number | null {
  return storedCycles.find((c) => c.id === cycle.id)?.period_years ?? null;
}

/** True while a drawn cycle's period differs from its stored one (a reader's calibration). */
export function periodChanged(cycle: Cycle): boolean {
  const stored = storedPeriod(cycle);
  return stored !== null && stored !== cycle.period_years;
}

/**
 * The headline as a surface that DRAWS `cycle` shows it. Every verdict is frozen at the stored
 * period, and eligibility turns on the period (span / period >= 3.0): Codex (r2 on 885435a)
 * reproduced Perez at 52 years, where HATCH covers 3.04 periods, beside "Not testable on its
 * paired record". So a drawn period that differs from the stored one names the period the verdict
 * is for. A moved peak changes nothing: the test fits sine and cosine at 1/P with no peak year
 * (scripts/spectral_verdict.py). The no-series headline holds at any period, so it is unchanged.
 * One rule for every drawing surface (facets, summary rows, embeds, spoken overview rows), compared
 * by id, instead of a calibration flag threaded through each (Codex found the sibling surfaces in
 * round 2, which is the second appearance of this defect class).
 */
export function shownHeadline(cycle: Cycle): string | null {
  const card = holdsUpCard(cycle);
  if (!card) return null;
  if (card.headline === NO_SERIES_HEADLINE || !periodChanged(cycle)) return card.headline;
  return `${card.headline} at this site's ${storedPeriod(cycle)}-year period`;
}

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
  // "this site requires": the 3.0 floor is the site's deliberately conservative rule, not a
  // general requirement for testing a cycle (/methods; Codex r1 2026-10-10, MED).
  const covered = `${periodsCovered(verdict)} this site requires before testing.`;
  if (series && series.id === verdict.series_id) {
    return { headline, detail: `Its paired record covers ${covered}` };
  }
  const tested = testedSeriesNote(verdict.series_id);
  return {
    headline,
    detail: tested
      ? `Judged on ${tested.name}: ${covered}`
      : `The record used for this verdict covers ${covered}`,
  };
}

/** One sentence for the card's alt text: "Does it hold up? <headline>. <detail>" */
export function holdsUpAlt(cycle: Cycle): string {
  const card = holdsUpCard(cycle);
  return card ? `Does it hold up? ${card.headline}. ${card.detail}` : "";
}

// The main share card (/og) once answered its headline here, from I-056 (2026-10-23):
// "Not yet: none of the ten is testable on the record that exists" over "No record covers the
// 3.0 full periods this site requires before testing." Both overclaimed (I-079, 2026-11-04):
// the first counts the unpaired fathers-and-sons cycle, which has no verdict at all, and the
// second is false for cross-grid records that clear the gate (Dalio x V-Dem, 3.15 periods).
// The same class refuted three /cycles snippet drafts that day, so the card now makes NO
// testability claim (portable rule 2; the orchestrator's call on consult b29504de). Under "Do the
// cycles hold up?" it says what it draws; the eyebrow's "None confirmed" stays, because every
// eligible verdict on file (19 cross-grid rows) reads NO_SIGNIFICANT_TARGET_POWER. Each cycle's
// own page carries its scoped verdict.

/** The main card's eyebrow: no verdict on file confirms a cycle (all eligible rows found no power). */
export const MAIN_CARD_EYEBROW = "None confirmed";

// W-005 (2026-11-04): the /cycles search result. /cycles was the page Search Console showed most
// (44 of 123 impressions since 09-20, position 7.2, 0 clicks), and its result read "The ten cycles"
// over a list of ten names: nothing said the page answers whether they hold up. The title asks
// the question; the description keeps three names a searcher types (the only non-brand queries
// on record were Dalio's) and says what the page gives each cycle (see CYCLES_INDEX_DESCRIPTION).
// Budgets, Google's truncation points: the RENDERED title (the layout appends " · Sinusoidal
// History") <= 60 characters, the description <= 160. holdsUp.test.ts pins both.

/** The /cycles index title, before the layout's " · Sinusoidal History" suffix. */
export const CYCLES_INDEX_TITLE = "Do history's cycles hold up?";

/**
 * The /cycles index meta description (the search snippet; also og:, twitter: and JSON-LD).
 *
 * It states NO verdict count, on purpose. Two Codex rounds refuted a counted answer in a row:
 * "none of the ten is testable on the record that exists" (false for the unpaired tenth cycle,
 * r1) and "no record on this site is long enough to test them" (false: cross-grid records such as
 * Dalio x V-Dem clear the gate, r2), and so was a "whether this site's data is long enough"
 * clause (the page judges only each cycle's primary pairing, r3). The day before, the same
 * tested/testable split was argued on the glance caption. Portable rule 2, and the orchestrator's
 * call on consult b29504de: the snippet makes NO testability claim. It asks the question and names
 * what the page shows for each of the ten. The scoped answer lives on the page, with its caveats.
 */
export const CYCLES_INDEX_DESCRIPTION =
  "Dalio, Strauss-Howe, Turchin: do the cycles hold up? Each one's period, peak and source.";

/** The detail line on a main card drawn with a changed period or peak (`/og?period.<id>=`). */
export const CALIBRATED_CARD_NOTE =
  "This card draws changed periods or peaks; the verdicts are for the stored ones.";

/**
 * The main card's og:image alt: what the image shows, in its order (eyebrow, question, the line
 * under it, the rows). No testability claim, as on the card (I-079).
 */
export function holdsUpOverallAlt(all: Cycle[]): string {
  return `${MAIN_CARD_EYEBROW}. Do the cycles hold up? ${ogMainStandfirst(all.length)} Each cycle drawn as at most one period around its reference peak, cut at today`;
}
