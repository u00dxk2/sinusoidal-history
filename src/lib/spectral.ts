import verdictsJson from "../../public/data/spectral/verdicts.json";

/**
 * The pre-registered spectral verdict, read at build time from the committed
 * output of scripts/spectral_verdict.py. Never computed here: the JSON is the
 * frozen result of the manifested analysis (see scripts/spectral/
 * analysis-manifest.yaml), and every number on the site quotes it verbatim.
 */

export type SpectralState =
  | "INSUFFICIENT_DATA"
  | "NO_SIGNIFICANT_TARGET_POWER"
  | "MODEL_SENSITIVE"
  | "SIGNIFICANT_TARGET_POWER";

export type SpectralVerdictRow = {
  cycle_id?: string;
  period_source_cycle_id?: string;
  period_years: number;
  series_id: string;
  span_years: number;
  cycles_covered: number;
  eligible: boolean;
  state: SpectralState;
  p: number | null;
  p_ar2: number | null;
  holm_family: "primary" | "cross_grid";
  holm_significant: boolean | null;
  holm_significant_ar2: boolean | null;
  lay_text: string;
};

type SpectralVerdicts = {
  generated: string;
  manifest_sha256: string;
  draws: number;
  headline: { eligible_primary: number; total_primary: number; text: string };
  primary: SpectralVerdictRow[];
  cross_grid: SpectralVerdictRow[];
};

const verdicts = verdictsJson as unknown as SpectralVerdicts;

export const SPECTRAL_STATE_LABELS: Record<SpectralState, string> = {
  INSUFFICIENT_DATA: "Insufficient data — no test possible",
  NO_SIGNIFICANT_TARGET_POWER: "No significant target power",
  MODEL_SENSITIVE: "Model-sensitive — no verdict",
  SIGNIFICANT_TARGET_POWER: "Significant target power",
};

export function spectralVerdictForCycle(
  cycleId: string,
): SpectralVerdictRow | null {
  return verdicts.primary.find((r) => r.cycle_id === cycleId) ?? null;
}

export const spectralHeadline = verdicts.headline;
export const spectralGenerated = verdicts.generated;
export const spectralDraws = verdicts.draws;
