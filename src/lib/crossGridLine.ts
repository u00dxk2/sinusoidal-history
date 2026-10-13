import { cycles } from "@/data/cycles";
import { dataSeries } from "@/data/series";
import { cycleTheorist } from "@/lib/cycleRoutes";
import { spectralCrossGrid, spectralVerdictForCycle, type SpectralVerdictRow } from "@/lib/spectral";
import { testedSeriesNote } from "@/lib/testedSeries";

// I-041 (2026-10-13). A cycle page says "No test was run and no p-value exists" for its own
// pairing, while /methods lists cross-grid re-pairings that borrow the same theory's period or
// its record (cold walk 2026-10-12, docs/walks/2026-10-12-w004.md:182). This says, on the page,
// what the panel did with each part, in both directions (manager review d854b486):
//   - period: cells whose borrowed period is this cycle's (period_source_cycle_id);
//   - record: cells that set this page's judged record (the verdict's series_id) against
//     another theory's period.
// A direction with no cells is not mentioned. Every value comes from the frozen verdicts.json.
// The wording stays outside the no-test-ran guard (testedSeries.test.ts TEST_RAN) on purpose:
// it never says this theory's own pairing was tested, because it was not.

function seriesName(id: string): string {
  return dataSeries.find((s) => s.id === id)?.name ?? testedSeriesNote(id)!.name;
}

function theoristOf(cycleId: string): string {
  const cycle = cycles.find((c) => c.id === cycleId)!;
  // "Turchin (50y)" would read "Turchin (50y)'s 50 years"; the period follows anyway.
  return cycleTheorist(cycle).replace(/\s*\(.*\)$/, "");
}

function andList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

// Smallest p across both nulls, unadjusted, as /methods states its panel-wide lowest.
function lowestP(cells: SpectralVerdictRow[]): string {
  return Math.min(...cells.flatMap((c) => [c.p!, c.p_ar2!])).toFixed(3);
}

export type CrossGridDirections = {
  period: SpectralVerdictRow[];
  record: SpectralVerdictRow[];
};

export function crossGridDirections(cycleId: string): CrossGridDirections | null {
  const verdict = spectralVerdictForCycle(cycleId);
  if (!verdict) return null;
  return {
    period: spectralCrossGrid.filter((c) => c.period_source_cycle_id === cycleId),
    record: spectralCrossGrid.filter((c) => c.series_id === verdict.series_id),
  };
}

/** The paragraph's sentence, or null when the panel touched neither part of this theory. */
export function crossGridSentence(cycleId: string): string | null {
  const dirs = crossGridDirections(cycleId);
  if (!dirs || (dirs.period.length === 0 && dirs.record.length === 0)) return null;
  const verdict = spectralVerdictForCycle(cycleId)!;
  const parts = ["This site's secondary cross-grid panel re-pairs parts of this theory with other pages."];
  const { period, record } = dirs;
  if (period.length > 0) {
    const n = period.length;
    parts.push(
      `Its ${verdict.period_years}-year period was set against ${n} other ${n === 1 ? "record" : "records"} long enough for the 3.0-period rule: ${andList(period.map((c) => seriesName(c.series_id)))} (lowest p ${lowestP(period)}).`,
    );
  }
  if (record.length > 0) {
    const n = record.length;
    parts.push(
      `This page's record, ${seriesName(verdict.series_id)}, was set against ${n} other ${n === 1 ? "theory's period" : "theories' periods"}: ${andList(record.map((c) => `${theoristOf(c.period_source_cycle_id!)}'s ${c.period_years} years`))} (lowest p ${lowestP(record)}).`,
    );
  }
  const total = period.length + record.length;
  parts.push(
    `${total === 1 ? "That re-pairing did not reach" : `None of these ${total} re-pairings reached`} p < 0.05 under either noise model, and ${total === 1 ? "it is not" : "none is"} this theory's own claim.`,
  );
  return parts.join(" ");
}

export const CROSS_GRID_ANCHOR = "cross-grid";
