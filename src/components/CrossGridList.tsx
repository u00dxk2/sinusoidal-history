import { cycles } from "@/data/cycles";
import { dataSeries } from "@/data/series";
import { cycleTheorist } from "@/lib/cycleRoutes";
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
    detail: `${v.span_years}y record · ${v.cycles_covered.toFixed(1)} periods · p ${v.p!.toFixed(3)} (AR(2) null: ${v.p_ar2!.toFixed(3)})`,
  };
});

// The smallest p across both nulls, unadjusted. /methods states it so "none survives Holm"
// rests on a number a reader can check against the rows.
export const CROSS_GRID_LOWEST_P = Math.min(
  ...spectralCrossGrid.flatMap((v) => [v.p!, v.p_ar2!]),
).toFixed(3);

export const CROSS_GRID_SUMMARY = `The ${CROSS_GRID_ROWS.length} re-pairings, cell by cell`;

// One string, so public/methods.md can be checked against it word for word (Codex r1:
// a fragment check passed with this lead edited).
export const CROSS_GRID_LEAD =
  "Each row borrows one theory's period and sets it against a series that theory is not paired with. The p is the bootstrap p against the AR(1) red-noise null, before any correction; the AR(2) null's p follows it. Below 0.05 would cross the unadjusted threshold; Holm correction still decides significance.";

export default function CrossGridList() {
  return (
    <details className="border-t border-b border-rule/30 py-2">
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
    </details>
  );
}
