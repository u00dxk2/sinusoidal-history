export type ConfidenceLevel =
  | "narrative"
  | "empirical-contested"
  | "empirical"
  | "quantitative";

export interface Cycle {
  id: string;
  name: string;
  short_description: string;
  period_years: number;
  reference_peak_year: number;
  reference_peak_rationale: string;
  amplitude_normalized: number;
  source: string;
  confidence_level: ConfidenceLevel;
  color: string;
  caveat?: string;
}

export type PhasePosition = "rising" | "peaking" | "falling" | "troughing";

export interface Annotation {
  id: string;
  year: number;
  label: string;
  type: string;
  description: string;
  cycles_referenced: string[];
}

export type SeriesTransform = "none" | "log1p";

export interface DataSeries {
  id: string;
  name: string;
  /**
   * Short label used in space-constrained inline legends (cycle facets,
   * OG cards). Falls back to `name` if absent.
   */
  legend_short?: string;
  short_description: string;
  source: string;
  source_url: string;
  license: string;
  data_file: string;
  year_column: string;
  value_column: string;
  value_units: string;
  color: string;
  associated_cycle_id: string;
  association_note: string;
  /**
   * Optional transform applied to raw values after load and before
   * normalization. "log1p" = natural log of (1 + x); useful for heavy-tailed
   * series dominated by rare extreme events. Default is "none".
   */
  transform?: SeriesTransform;
}
