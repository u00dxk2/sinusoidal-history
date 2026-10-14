import { cycles } from "@/data/cycles";
import { dataSeries } from "@/data/series";
import { cycleTheorist } from "@/lib/cycleRoutes";
import OpenOnHash from "@/components/OpenOnHash";
import { CROSS_GRID_ANCHOR } from "@/lib/crossGridLine";
import { spectralCrossGrid } from "@/lib/spectral";
import { testedSeriesNote } from "@/lib/testedSeries";

// The 19 cross-grid re-pairings, in verdicts.json order (by borrowed period). /methods named
// this panel and never showed it, so a cold reader could not find it (W-004 walk,
// 2026-10-09). Every value is read from the frozen verdicts.json. public/methods.md mirrors
// these rows and src/lib/methodsCrossGrid.test.ts fails if the mirror drifts.
export const CROSS_GRID_ROWS = spectralCrossGrid.map((v) => {
  const cycle = cycles.find((c) => c.id === v.period_source_cycle_id)!;
  const series =
    dataSeries.find((s) => s.id === v.series_id)?.name ?? testedSeriesNote(v.series_id)!.name;
  return {
    key: `${v.period_source_cycle_id}-${v.series_id}`,
    // "Turchin (50y)" would read "Turchin (50y)'s 50-year period": drop the parenthetical,
    // the period follows it anyway.
    pair: `${cycleTheorist(cycle).replace(/\s*\(.*\)$/, "")}'s ${v.period_years}-year period × ${series}`,
    // "AR(2) null" stopped a cold reader on every row (I-043, walk 2026-10-13 evening); the
    // bracket uses the lead's own words for the same second null.
    detail: `${v.span_years}y record · ${v.cycles_covered.toFixed(1)} periods · p ${v.p!.toFixed(3)} (second drift model: ${v.p_ar2!.toFixed(3)})`,
  };
});

// The smallest p across both nulls, unadjusted. /methods states it so "none survives Holm"
// rests on a number a reader can check against the rows.
export const CROSS_GRID_LOWEST_P = Math.min(
  ...spectralCrossGrid.flatMap((v) => [v.p!, v.p_ar2!]),
).toFixed(3);

export const CROSS_GRID_SUMMARY = `The ${CROSS_GRID_ROWS.length} re-pairings, cell by cell`;

// One string each, so public/methods.md can be checked against them word for word (Codex r1:
// a fragment check passed with this lead edited). The lead is what a reader arriving from a
// cycle page's link reads before the first row, so it carries no statistical term; the note
// after the rows keeps the technical statement (I-043, walk C 2026-10-13).
export const CROSS_GRID_LEAD =
  "Each row borrows one theory's period and sets it against a series that theory is not paired with. Each p says how often random drift alone would fit that period at least this well; only a p below 0.05 could count, and none here is. The number in brackets repeats the check against a second model of drift, explained below the list.";

// The note opens in plain words because the lead promises the second model is "explained
// below the list", and a technical-only note left the walker without it (I-043).
export const CROSS_GRID_NOTE =
  "In plain words: drift is the slow wandering a long record shows even when nothing repeats. The first p models it with each year leaning on the year before; the bracketed one lets each year lean on the two years before. In technical terms: the first p is the bootstrap p against the AR(1) red-noise null, before any correction; the bracketed p is the same test against the AR(2) null. Below 0.05 would cross the unadjusted threshold; Holm correction still decides significance.";

export default function CrossGridList() {
  return (
    // The id is where each cycle page's cross-grid sentence links (I-041); OpenOnHash opens the
    // box on that arrival.
    <details id={CROSS_GRID_ANCHOR} className="scroll-mt-4 border-t border-b border-rule/30 py-2">
      {/* No display:flex here: it replaces summary's list-item display and drops the native
          disclosure triangle, the only cue on a phone that this opens (Codex r1). py-3 keeps
          the tap target at 44px. */}
      <summary className="cursor-pointer py-3 font-mono text-[12px] uppercase tracking-[0.16em] text-ink-soft hover:text-ink">
        {CROSS_GRID_SUMMARY}
      </summary>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{CROSS_GRID_LEAD}</p>
      {/* role="list": Safari drops list semantics once list-style is none (Tailwind Preflight). */}
      <ol role="list" className="mt-2">
        {CROSS_GRID_ROWS.map((r) => (
          <li key={r.key} className="border-t border-rule/20 py-2">
            <p className="text-[15px] leading-snug text-ink">{r.pair}</p>
            <p className="mt-0.5 font-mono text-[12px] leading-relaxed text-ink-soft tabular-nums">
              {r.detail}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-2 border-t border-rule/20 pt-2 text-[13px] leading-relaxed text-ink-soft">
        {CROSS_GRID_NOTE}
      </p>
      <OpenOnHash id={CROSS_GRID_ANCHOR} />
    </details>
  );
}
