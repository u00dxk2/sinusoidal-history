// The design pass's words (docs/PRODUCT.md "Copy"). Every product fact here is on PRODUCT.md's
// known list, which was written from a source fact list judged line by line before any of
// these sentences existed. Shown only when the design-pass flag is set (src/lib/designPass.ts).
//
// Counts are derived, never typed: the first screen once said "Eight" for a whole Search
// Console window while the site shipped ten (I-006).

import type { Cycle, DataSeries } from "@/data/types";
import { countWord } from "@/lib/countWords";

/**
 * "Ten long-wave theories of history on one time axis." It does not say "each drawn once"
 * (claims pass r2): the page draws each cycle in more than one figure, and two of the ten
 * are cut at today, so "once" claimed more than the drawing rule. The one-period rule is the
 * subhead's first sentence.
 */
export function dpHeadline(cycleCount: number): string {
  return `${countWord(cycleCount)} long-wave theories of history on one time axis.`;
}

/** How many cycles have a paired series: counted by cycle, not by series row. */
export function pairedCycleCount(cycles: Cycle[], series: DataSeries[]): number {
  const paired = new Set(series.map((s) => s.associated_cycle_id));
  return cycles.filter((c) => paired.has(c.id)).length;
}

/** The subhead's first sentence: how a curve is drawn. */
export const DP_HOW_DRAWN =
  "Each curve is at most one period of a plain wave around a peak year this site documents, and no curve is drawn past today.";

/**
 * The subhead's second sentence: what the records are for. Scoped to the paired cycles' pages
 * (the unpaired cycle's page has no record to speak of) and to "the record its verdict uses"
 * (two verdicts are judged on a different cut from the series the chart draws). Claims pass r2.
 */
export function dpHowChecked(pairedCount: number, cycleCount: number): string {
  const paired = countWord(pairedCount);
  return `${paired} of the ${countWord(cycleCount).toLowerCase()} have paired data, and each of those ${paired.toLowerCase()} pages says whether the record its verdict uses is long enough for this site to test the cycle.`;
}

/** The one accent-coloured action on the first screen; goes to /cycles. */
export const DP_CTA = "Check a cycle against its record";

/** The plain second link; goes to the Calibrate view. */
export const DP_SECONDARY = "Move a peak yourself";

// The error screen (src/app/error.tsx). It names no cause: a failed data file is handled inside
// the chart and never reaches this screen, so the old "Most likely a CSV failed to load" was
// false, and no other single cause can be stated from here.
export const DP_ERROR_HEADING = "This view hit an unexpected error.";
export const DP_ERROR_BODY = "This view could not be displayed. Try it again, or go back to the chart.";
export const DP_ERROR_RETRY = "Try again";
export const DP_ERROR_HOME = "Back to the chart";

// The 404 (src/app/not-found.tsx): what happened, then the next step. No joke.
export const DP_NOT_FOUND_HEADING = "There is no page at this address.";
export const DP_NOT_FOUND_BODY = "It may have moved, or the address may be mistyped.";

// The empty state: a cycle with no paired series (today, Turchin's fathers-and-sons cycle).
// "No data series of its own", not "no record": /methods sets this cycle's period against
// other cycles' records. The reason is the cycle's own caveat in cycles.json, narrowed to what
// it states.
// I-078 (2026-11-19): the headline now says "No paired data series", so the reason no longer
// repeats it and opens on why.
export const DP_NO_SERIES_REASON =
  "Turchin posts the underlying database, but it carries no explicit reuse licence, so this site does not redistribute it.";
export const DP_NO_SERIES_NEXT = "Open this curve in the chart";
