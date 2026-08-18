# Leading Power's Share of World GDP (Maddison Project Database 2023)

**Retrieved:** 2026-08-18
**Source URL:** https://ourworldindata.org/grapher/gdp-maddison-project-database.csv
**Primary citation:** Bolt, Jutta and Jan Luiten van Zanden (2024). *Maddison-style estimates of the evolution of the world economy: A new 2023 update.* Journal of Economic Surveys, 1–41. DOI: 10.1111/joes.12618.
**Coverage:** 1870–2022 (trimmed; upstream country estimates reach back to year 1, with coverage thinning rapidly before the 19th century).
**License:** CC BY 4.0.

## Columns in our CSV

- `year` — calendar year
- `leading_power_gdp_share_pct` — the largest single economy's GDP / sum of all countries' GDP × 100, in percent
- `leading_power` — which country was the largest economy that year

## What was filtered and transformed

The build pipeline lives in `scripts/build_leading_power_gdp_share.py` (run from repo root). It is identical to `scripts/build_us_world_gdp_share.py` except for the final step:

1. Downloads the OWID Maddison Project mirror. (As of 2026-08-18 OWID rejects the default Python urllib User-Agent with HTTP 403; the script sends an explicit User-Agent header.)
2. **Excludes regional aggregates and the World rollup** — the `(Maddison)`-suffixed regional entities plus `World`, exactly as in the US-share pipeline (see `us_world_gdp_share.source.md` for the aggregate-name bug history).
3. **Resolves historical-state vs successor-state overlap** (USSR vs Russia et al., Czechoslovakia vs Czechia/Slovakia, Yugoslavia vs successors, Sudan-former vs Sudan/South Sudan): where the historical entity and any successor coexist in a year, use the successors only.
4. **Forward-fills each entity's GDP** between Maddison's sparse benchmark observations, so countries observed only at decade boundaries stay in the world denominator in intervening years.
5. Computes `leading_power_gdp_share_pct = max(country GDP) / sum(filled country GDPs) × 100` and records which country held the max. **The "leading power" is defined mechanically as the largest single economy — it is NOT Modelski's hand-picked hegemon succession.** This anti-overfit rule is deliberate: the data rule is fixed without reference to the theory's dates, so the series cannot be quietly tuned to the cycle it is plotted against.
6. **Trims to 1870 onward.** Pre-1870 country coverage is too patchy even with forward-fill.

## Why this series pairs with Modelski

Modelski's long cycle of world leadership (period stated as 100–120 years; we plot 110) is about the rise and decline of a single world power's preponderance — Portugal, the Netherlands, Britain (twice), then the United States, with the US cycle's ascent consolidated in 1945. Relative economic size of the leading state is the most data-tractable proxy for that preponderance: Modelski and Thompson's own seapower concentration indices are not available as a maintained public dataset, while Maddison GDP is. The series' all-time maximum is **31.577% in 1945** — the same year as the cycle's reference peak — and both structural minima sit at leadership crossovers (15.941% in 1881, at the China→US handoff; 16.092% in 2013, just before the US→China handoff), which is consistent with the theory's claim that transitions happen when preponderance is lowest.

Leading-power timeline the data actually shows: **China 1870–1881, United States 1882–2013, China 2014–2022.**

## Caveats

- **Largest economy ≠ world leader in Modelski's sense — and the mismatch is not hypothetical, it is in this CSV.** Modelski's leadership is naval/global-reach capacity, not GDP. For **1870–1881** the series' leading power is **China** (Qing dynasty, a large agrarian economy in Maddison's PPP terms), while Modelski's world leader in those years was **Britain** — which, strikingly, never appears in the `leading_power` column at all: under Maddison PPP estimates the 19th-century hegemon was never the largest single economy in our covered window. Symmetrically, for **2014–2022** the leading power is **China**, while the US retains the naval/global-reach preponderance Modelski's theory is actually about. Read the series as "relative economic preponderance of the largest state," a correlate of world leadership, not an identification of the leader.
- **The pre-1950 denominator bias documented in `us_world_gdp_share.source.md` applies here in full.** The pipeline forward-fills between observations but does not back-fill before a country's first observation; many non-Western countries enter Maddison only at 1950. The denominator is therefore too small before ~1950, overstating the leading power's share in early years, and part of the post-1945 "decline" is an artifact of more countries entering the denominator.
- **PPP-basis effects drive the modern crossover.** Maddison uses 2011 PPP international dollars. On that basis **China passes the US as the largest economy in 2014** in this series (US leads through 2013). At market exchange rates the US economy remains larger than China's through 2022; a market-rate version of this series would show no crossover yet. The choice of PPP is inherited from the source, not an editorial claim about when leadership changed.
- Maddison GDP estimates pre-1900 are reconstructions, not measurements; standard errors widen going back, and the China estimates that put it first in the 1870s are among the most uncertain in the dataset.
- "Country" boundaries are present-day borders projected back (a strong simplifying assumption), and the historical/successor resolution rules above are judgment calls inherited from the US-share pipeline.
- The 1882 China→US crossover year is an artifact of Maddison's sparse benchmark years plus forward-fill (China is interpolated flat between benchmarks), so the exact handoff year should not be quoted as a historical finding.
