import type { DataSeries } from "@/data/types";

// The publisher clause each cycle page's "Copy attribution" puts after "Paired data series:".
// It used to be derived as `source.split(". ")[0]`, which cut 4 of the 9 credits mid-name at
// an abbreviation: "(Bolt & van Zanden, 2024, J" twice, "James A" and "(Greene & Nemet, U"
// (journey-walk 2026-10-14, finding 2). Guessing where a sentence ends is a matcher; this is a
// list. A series with no entry here throws at build, and seriesCredit.test.ts checks every
// entry against its series' own source text.
export const SERIES_CREDIT: Record<string, string> = {
  dw_nominate_polarization: "Voteview / Lewis, Poole, Rosenthal, Boche, Rudkin, Sonnet (2026)",
  us_tfp_growth: "Fernald (2014), FRBSF Working Paper 2012-19",
  wid_top1_wealth: "WID · World Inequality Database, retrieved via Our World in Data",
  us_world_gdp_share: "Maddison Project Database 2023 (Bolt & van Zanden, 2024, J. Econ. Surveys)",
  vdem_libdem:
    "V-Dem Institute, Country-Year Dataset v16, March 2026 (retrieved via Our World in Data)",
  conflict_deaths: "Our World in Data · Project Mars v1.1 (Lyall 2020)",
  stimson_policy_mood: "James A. Stimson, Policy Mood data series (UNC)",
  leading_power_gdp_share:
    "Maddison Project Database 2023 (Bolt & van Zanden, 2024, J. Econ. Surveys)",
  perez_tech_diffusion:
    "HATCH - Extended Historical Adoption of Technology Dataset 2.0 (Greene & Nemet, U. Wisconsin–Madison)",
};

export function seriesCredit(series: DataSeries): string {
  const credit = SERIES_CREDIT[series.id];
  if (!credit) throw new Error(`seriesCredit: no credit line for series "${series.id}"`);
  return credit;
}
