import type { Cycle } from "@/data/types";
import { countWord, countWordLower } from "./countWords";
import { holdsUpCard, NO_SERIES_HEADLINE, NOT_TESTABLE_HEADLINE } from "./holdsUp";

/**
 * The glance figure's VISIBLE verdict (I-048): the 10-15 walk read a dot on Dalio's crest at the
 * 2026 line as "the picture alone agrees with my friend", with no verdict visible on that screen
 * (the per-row verdict was screen-reader text only, and the caption did not outweigh the dot).
 * Counted from holdsUpCard's headlines, so it cannot drift from the cards. Null as soon as any
 * cycle's headline is anything else (a verdict that was tested, or no card): "none is confirmed"
 * would then be a claim this rule cannot state.
 */
export function glanceVerdictLine(cycles: Cycle[]): string | null {
  return glanceVerdictFromHeadlines(cycles.map((c) => holdsUpCard(c)?.headline));
}

/**
 * Why the glance figure's humps bunch, said on the figure's own screen (I-063). Both production
 * walkers on 2026-10-22 read nine humps between 1945 and 2020 as convergence "until you read the
 * note", which sits about four screens down (ConvergenceNote). Same reason as the note, counted
 * from the data so it cannot go stale. It speaks for the STORED peaks only: null once a reader's
 * calibration moves any peak (the drawing is then theirs, not the theorists'), and null when the
 * peaks do not bunch, because the sentence would then explain a picture that is not there.
 * No position: it names where the peaks are, never where the present sits on a curve (I-061).
 */
export const CLUSTER_FROM = 1945;
export const CLUSTER_TO = 2020;

export function glanceClusterLine(stored: Cycle[], drawn: Cycle[]): string | null {
  if (stored.length === 0 || drawn.length !== stored.length) return null;
  const moved = drawn.some((c, i) => c.reference_peak_year !== stored[i].reference_peak_year);
  if (moved) return null;
  const inside = stored.filter(
    (c) => c.reference_peak_year >= CLUSTER_FROM && c.reference_peak_year <= CLUSTER_TO,
  ).length;
  if (inside * 2 <= stored.length) return null;
  return `${countWord(inside)} of the ${countWordLower(stored.length)} peaks fall between ${CLUSTER_FROM} and ${CLUSTER_TO} because we read the theorists whose climaxes land in our era: a selection effect, not agreement.`;
}

/** glanceVerdictLine's rule over the headlines alone (undefined = a cycle with no card). */
export function glanceVerdictFromHeadlines(heads: (string | undefined)[]): string | null {
  const untestable = heads.filter((h) => h === NOT_TESTABLE_HEADLINE).length;
  const noRecord = heads.filter((h) => h === NO_SERIES_HEADLINE).length;
  if (heads.length === 0 || untestable + noRecord !== heads.length) return null;
  const parts = [
    untestable && `${countWordLower(untestable)} cannot be tested on the record that exists`,
    noRecord && `${countWordLower(noRecord)} ${noRecord === 1 ? "has" : "have"} no record on this site`,
  ].filter(Boolean);
  return `None of these ${countWordLower(heads.length)} is confirmed: ${parts.join(", and ")}.`;
}

/**
 * The sr-only sentence that follows a row's visible name. Leads with a space:
 * it is appended to that name, not read alone.
 *
 * It speaks no position, because the row draws none (I-048, 2026-10-16 evening):
 * walk B read the ring on Dalio's crest at the bold 2026 line as "peaking now"
 * beside two visible verdicts, so the figure lost every mark at the current
 * year and the spoken row loses its "curve <phase> in <year>" with it. The
 * sentence is the same at every brush range. The headline is holdsUpCard's, so
 * it cannot drift from the card and the cycle page.
 */
export function overviewRowReading(cycle: Cycle): string {
  const card = holdsUpCard(cycle);
  const verdict = card ? ` ${card.headline}.` : "";
  return ` (${cycle.period_years}-year cycle).${verdict}`;
}
