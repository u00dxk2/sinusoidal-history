import type { Cycle } from "@/data/types";
import type { CycleOverride } from "@/components/CycleOverlay";

/**
 * The clauses an embed prints when its URL calibrates a cycle (I-037).
 *
 * The manager review's contract: a calibrated embed names the override AND
 * the site's reference peak. So the reference peak is always named, even when
 * only the period moved (Codex r1 on f5a2e8e: a period-only override used to
 * print the period alone). An override equal to the published value changes
 * nothing on the curve and prints nothing.
 *
 * scripts/check-embed-snippets.mjs rebuilds the expected clause from
 * /api/v1/cycles on its own, so a wording change here has to move there too.
 */
export function calibrationClauses(
  cycle: Cycle,
  override: CycleOverride | undefined
): string[] {
  if (!override) return [];
  const peakMoved =
    override.reference_peak_year !== undefined &&
    override.reference_peak_year !== cycle.reference_peak_year;
  const periodMoved =
    override.period_years !== undefined &&
    override.period_years !== cycle.period_years;
  if (!peakMoved && !periodMoved) return [];
  const out: string[] = [];
  if (peakMoved) {
    out.push(
      `peak ${override.reference_peak_year} (the site's reference peak is ${cycle.reference_peak_year})`
    );
  }
  if (periodMoved) {
    out.push(
      `period ${override.period_years}y (the site's is ${cycle.period_years}y)`
    );
  }
  if (!peakMoved) {
    out.push(`the site's reference peak ${cycle.reference_peak_year}`);
  }
  return out;
}
