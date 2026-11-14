import type { Cycle } from "@/data/types";
import { countWord, countWordLower } from "./countWords";
import { cycleTheorist } from "./cycleRoutes";
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
  return glanceVerdictFromHeadlines(
    cycles.map((c) => holdsUpCard(c)?.headline),
    cycles.map(cycleTheorist),
  );
}

/**
 * The verdict line's measured budget (I-076, 2026-11-10). It sits on the first screen at 390x664
 * (top y=620; at 320x568 and 360x560 it starts below the fold). Setting candidate wordings in
 * place on production: 118 characters held two lines with 33px spare, 125 broke to a third line
 * ending at y=674, past the fold. A character count, not a rendered width: a font change voids it.
 */
export const GLANCE_VERDICT_MAX_CHARS = 118;

/**
 * Why the glance figure's humps bunch, said on the figure's own screen (I-063). Both production
 * walkers on 2026-10-22 read nine humps between 1945 and 2020 as convergence "until you read the
 * note", which sits about four screens down (ConvergenceNote). Same reason as the note, counted
 * from the data so it cannot go stale. It speaks for the STORED peaks only: null once a reader's
 * calibration moves any peak (the drawing is then theirs, not the theorists'), null when the
 * peaks do not bunch, and null when the brushed range does not draw the whole window, because
 * the sentence would then explain a picture that is not there (Codex r1).
 * It claims provenance, never a cause. Two Codex rounds refuted a causal clause in turn: r1
 * "the theorists whose climaxes land in our era" (several anchors are this project's own
 * constructions: Huntington's and Schlesinger Jr.'s midpoints, Perez's turning point), r2
 * "because … a selection effect" (the rationales say where each anchor came from, not why the
 * set clusters). So the line states what the anchors are and denies only that they are
 * evidence of agreement; the editor's note carries the selection-effect argument.
 * No position: it names where the peaks are, never where the present sits on a curve (I-061).
 */
export const CLUSTER_FROM = 1945;
export const CLUSTER_TO = 2020;

export function glanceClusterLine(
  stored: Cycle[],
  drawn: Cycle[],
  range: { start: number; end: number },
): string | null {
  if (stored.length === 0 || drawn.length !== stored.length) return null;
  if (range.start > CLUSTER_FROM || range.end < CLUSTER_TO) return null;
  const moved = drawn.some(
    (c, i) => c.id !== stored[i].id || c.reference_peak_year !== stored[i].reference_peak_year,
  );
  if (moved) return null;
  const inside = stored.filter(
    (c) => c.reference_peak_year >= CLUSTER_FROM && c.reference_peak_year <= CLUSTER_TO,
  ).length;
  if (inside * 2 <= stored.length) return null;
  return `${countWord(inside)} of the ${countWordLower(stored.length)} peak years fall between ${CLUSTER_FROM} and ${CLUSTER_TO}. They are anchors, set by the theorists or by this site, not evidence that the cycles agree.`;
}

/**
 * The glance figure's caption, its one line on every phone's first screen (I-063, 2026-11-03).
 * Walkers read the nine humps bunched between 1945 and 2020 as the cycles agreeing; the line
 * saying the peak years are anchors (glanceClusterLine) sits under the strip, on the second
 * screen. So the caption itself says the peaks were chosen, beside I-048's verdict.
 * Since I-075 (2026-11-13) it says whose the stored peaks are ("Site's peaks"), and says
 * "Peaks chosen" while any drawn peak differs from its stored year, since that peak is then the
 * reader's (see glanceCaption). Neither form depends on the range, so the caption does not flip when a reader
 * zooms, and it does not follow glanceClusterLine's null rules.
 * Budget, measured on production 2026-11-03: the caption box is 288px at 320px wide and the
 * font sets 8.58px per character, so it holds 33 characters on one line. A second line costs
 * 16px and the home first screen has 12px spare at 320x568 (check-entry-folds).
 */
export const GLANCE_CAPTION_MAX_CHARS = 33;

/**
 * What a hump's height means, said on the figure (I-077, 2026-11-12). The 11-03 cold walker, as
 * quoted on I-077 (the walk file records only "hump heights unlabeled"): "There are no y-axis
 * numbers. I assume height means strength, but that is a guess." Every row
 * draws amplitude_normalized * cos(...) on a fixed [-1, 1] scale, and amplitude_normalized is 1.0
 * on every cycle (overviewReading.test.ts pins it; a calibration moves only the period and the
 * peak year), so the height is the curve's shape, and a full wave reaches the same height on every
 * row (a wave cut by the window or by today shows less of it). /methods says the
 * same thing: "visual peak heights do not represent real-world magnitudes, only relative shape
 * over time". Not a position on any cycle (I-061).
 * It sits under the name column, beside the year ticks, so it spends no first-screen height.
 * Budget, measured on production 2026-11-12: the column is 104px with 8px right padding, the
 * first year label starts 107px in, and this line in 11px display italic sets 91.1px. A
 * character count, not a rendered width: a font change voids it (re-measure).
 */
export const GLANCE_HEIGHT_LABEL = "height: shape, not size";
export const GLANCE_HEIGHT_LABEL_MAX_CHARS = 23;

/**
 * The label's words for a screen reader: the visible label is terse, and the tick row is hidden.
 * Round 0 (2026-11-12): "each hump … the same on every row" was false for a wave cut by the window
 * or by today, and for a row with no wave, so the sameness is said of a FULL wave only.
 */
export const GLANCE_HEIGHT_READING =
  "A full wave reaches the same height on every row: the height is the curve's shape, not a measured size.";

/**
 * Whether any drawn peak year currently differs from its stored one (a calibration; a peak moved
 * back to its stored year counts as unmoved). A changed period
 * alone moves no peak. A drawn list that does not line up with the stored one, by length or by
 * id, counts as moved, so the caption falls back to the words that hold for any peak.
 */
export function peaksMoved(stored: Cycle[], drawn: Cycle[]): boolean {
  if (stored.length !== drawn.length) return true;
  return stored.some(
    (c, i) => drawn[i].id !== c.id || drawn[i].reference_peak_year !== c.reference_peak_year,
  );
}

/**
 * I-075 (2026-11-13): the 11-03 walker asked "Peaks chosen: chosen by whom?"
 * (docs/walks/2026-11-03-i063.md). The stored rationales in cycles.json (reference_peak_rationale)
 * each describe how this site adopted the peak it draws: a midpoint, one year picked from a window,
 * a theorist's date or turning point mapped to the drawn crest, or a peak the theorist states (Turchin's
 * 1970 for fathers-and-sons, adopted as given). So "Site's peaks" means the peaks this site uses, not
 * that it invented every date. While any drawn peak differs from its stored year, that peak is the
 * reader's, so the caption says only "chosen", which holds for any peak.
 */
export function glanceCaption(verdictLine: string | null, moved: boolean): string {
  // "no cycle", not "none" (Codex r1): beside "Peaks chosen", "none confirmed" read as "none of
  // the peaks", and the verdict is about cycles. Both peak words are 12 characters, so each
  // caption is 33: 283.1px of the 288px box at 320 in this monospace face.
  if (!verdictLine) return "Theory shapes, not findings";
  return moved ? "Peaks chosen · no cycle confirmed" : "Site's peaks · no cycle confirmed";
}

/**
 * glanceVerdictLine's rule over the headlines (undefined = a cycle with no card). `names` runs
 * parallel to `heads`, each the name the cycle's row shows (cycleTheorist).
 * I-076: the 11-03 walker asked "one has no record on this site: which one?", so a single
 * no-series cycle is named; two or more are counted, which keeps the line inside its two-line
 * budget. "No data series", not "no record" (round 0): /methods tests that cycle's period against
 * other cycles' records, so what it lacks is a series of its own (NO_SERIES_REASON). "None is
 * confirmed", not "None of these ten": the two counts already add up to the rows, and the
 * shorter opening is what lets the name fit.
 */
export function glanceVerdictFromHeadlines(
  heads: (string | undefined)[],
  names: string[] = [],
): string | null {
  const untestable = heads.filter((h) => h === NOT_TESTABLE_HEADLINE).length;
  const noSeries = heads.flatMap((h, i) => (h === NO_SERIES_HEADLINE ? [names[i]] : []));
  if (heads.length === 0 || untestable + noSeries.length !== heads.length) return null;
  const named = noSeries.length === 1 && noSeries[0] ? noSeries[0] : null;
  const parts = [
    untestable && `${countWordLower(untestable)} cannot be tested on the record that exists`,
    noSeries.length &&
      `${named ?? countWordLower(noSeries.length)} ${noSeries.length === 1 ? "has" : "have"} no data series on this site`,
  ].filter(Boolean);
  return `None is confirmed: ${parts.join(", and ")}.`;
}

/**
 * The sr-only sentence that follows a row's visible name. Leads with a space:
 * it is appended to that name, not read alone.
 *
 * It speaks no position, because the row draws none (I-048, 2026-10-16 evening):
 * walk B read the ring on Dalio's crest at the bold 2026 line as "peaking now"
 * beside two visible verdicts, so the figure lost every mark at the current
 * year and the spoken row loses its "curve <phase> in <year>" with it. The
 * period and verdict are the same at every brush range; only when the window
 * holds none of the drawn wave does it add the outside-window sentence (I-069).
 * The headline is holdsUpCard's, so it cannot drift from the card and the cycle
 * page.
 */
export function overviewRowReading(
  cycle: Cycle,
  outside: "before" | "after" | null = null,
): string {
  const card = holdsUpCard(cycle);
  const verdict = card ? ` ${card.headline}.` : "";
  const where = outside
    ? ` None of its wave is drawn in these years; it ${
        outside === "after" ? "starts at or after their end" : "ends at or before their start"
      }.`
    : "";
  return ` (${cycle.period_years}-year cycle).${verdict}${where}`;
}

/**
 * What a glance row SHOWS when the brushed window holds none of its drawn wave
 * (I-069). The 10-25 cold walk zoomed to 1801–1951 and read the blank Schlesinger
 * Jr. and Perez rows as missing data. Each row draws one period (I-061), so a
 * narrow window can hold none of it; the row then says nothing is drawn here and
 * the arrow points to the side the wave is on. "These years" are the axis under
 * the rows. Not "drawn after these years": a period can TOUCH the window's edge
 * (drawn from exactly its last year) and still draw nothing, so "after" would be
 * false there (Codex r1). It names no year and never where the present sits.
 */
export function outsideWindowWords(side: "before" | "after"): string {
  return withArrow(NONE_DRAWN, side);
}

const NONE_DRAWN = "none drawn in these years";

function withArrow(words: string, side: "before" | "after"): string {
  return side === "after" ? `${words} →` : `← ${words}`;
}

/**
 * The word a facet card's chart carries when the window draws none of its
 * theory curve, none of its paired data line, or neither (I-074, the glance
 * rows' sibling). A card with a paired series draws two lines under a legend
 * naming both, so a bare "none drawn" beside a drawn data line would be false
 * as read: the word names which line is missing. An unpaired card has one
 * line, so it carries the glance rows' own words. The arrow points to the side
 * the missing line is on; when theory and data are missing on different sides
 * there is no single side, so there is no arrow. Same claims rule as the glance
 * rows (I-069): no year, no present position, true at an exact edge touch.
 * `data` is null while the series is loading, failed, or draws a line.
 */
export function facetOutsideWords(
  theory: "before" | "after" | null,
  data: "before" | "after" | null,
  paired: boolean,
): { words: string; side: "before" | "after" | null } | null {
  const arrowed = (words: string, side: "before" | "after") => ({
    words: withArrow(words, side),
    side,
  });
  if (!paired) return theory ? arrowed(NONE_DRAWN, theory) : null;
  if (theory && data) {
    const both = `theory and data: ${NONE_DRAWN}`;
    return theory === data ? arrowed(both, theory) : { words: both, side: null };
  }
  if (theory) return arrowed(`theory: ${NONE_DRAWN}`, theory);
  if (data) return arrowed(`data: ${NONE_DRAWN}`, data);
  return null;
}

/**
 * One line of the desktop overlay's I-074 list: the overlay draws every cycle
 * on one plot, so the word has to name which one is missing, and that it is
 * the theory curve: the cycle's paired data line can be drawn beside it
 * (Perez's HATCH at 1801–1951; Codex r1 and round 0). The overlay's data lines
 * are toggled separately: their word sits on each one's Data chip (I-081),
 * where the chip already names the series, so it is the glance rows' own
 * `outsideWindowWords`.
 */
export function namedOutsideWords(name: string, side: "before" | "after"): string {
  return withArrow(`${name} theory: ${NONE_DRAWN}`, side);
}
