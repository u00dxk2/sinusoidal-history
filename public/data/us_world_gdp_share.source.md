# US Share of World GDP (Maddison Project Database 2023)

**Retrieved:** 2026-04-24
**Source URL:** https://ourworldindata.org/grapher/gdp-maddison-project-database.csv
**Primary citation:** Bolt, Jutta and Jan Luiten van Zanden (2024). *Maddison-style estimates of the evolution of the world economy: A new 2023 update.* Journal of Economic Surveys, 1–41. DOI: 10.1111/joes.12618.
**Coverage:** 1870–2022 (trimmed; full source 1820–2022).
**License:** CC BY 4.0.

## Columns in our CSV

- `year` — calendar year
- `us_share_world_gdp_pct` — US GDP / sum of all countries' GDP × 100, in percent

## What was filtered and transformed

The build pipeline lives in `scripts/build_us_world_gdp_share.py` (run from repo root). It:

1. Downloads the OWID Maddison Project mirror.
2. **Excludes regional aggregates and the World rollup.** OWID's export names them `Western Europe (Maddison)`, `Eastern Europe (Maddison)`, `Latin America (Maddison)`, `East Asia (Maddison)`, `South and South East Asia (Maddison)`, `Sub Saharan Africa (Maddison)`, `Middle East and North Africa (Maddison)`, `Western offshoots (Maddison)`, plus `World`. An earlier version of this filter used the names without the `(Maddison)` suffix and so silently included all of these in the world sum, doubling it on benchmark years.
3. **Resolves historical-state vs successor-state overlap.** USSR and Russia/Ukraine/Kazakhstan/etc., Czechoslovakia and Czechia/Slovakia, Yugoslavia and its successors, Sudan-former and Sudan/South Sudan: where the historical entity and any successor coexist in a year, drop the historical entity (use successors only); otherwise keep the historical entity.
4. **Forward-fills each entity's GDP.** Maddison adds many countries only at decade-benchmark years (China, USSR, much of Africa). Without forward-fill, those countries appear in the world sum at 1900 / 1950 / 1980 and disappear at 1901 / 1951 / 1981, creating spurious dips in US share. The pipeline carries each country's most-recent observed GDP forward to subsequent years until the next observation overrides it.
5. Computes `us_share = US GDP / sum(filled country GDPs) × 100`.
6. **Trims to 1870 onward.** Pre-1870 country coverage is too patchy even with forward-fill.

## Why this series pairs with Dalio

Dalio's Big Cycle is centrally about imperial rise and fall, with the relative GDP share of the dominant power (Britain in the 1800s, US in the 1900s, China today) as the headline indicator. The series shows the US arc clearly: rising through the late 19th century (~11% at 1870 → ~19% at 1900), peak in 1945 at ~32% (when most other industrial economies were at war or rubble), then gradual decline through ~22% in 1973 to ~15% by 2022.

Dalio's own composite empire-score peaks ~1950 by his statement, not 1945; the cycle and the data deliberately differ by ~5 years. The 1945 GDP-share peak is war-production driven; Dalio's empire score combines GDP share with military, currency-reserve, education, and other inputs.

## Caveats

- Maddison GDP estimates pre-1900 are reconstructions, not measurements. Standard errors widen as you go back.
- "Country" boundaries change (Soviet Union, Yugoslavia, decolonisation) — Maddison uses present-day borders projected back, which is a strong simplifying assumption.
- The trim to 1870 is judgment; viewing pre-1870 in this dataset is misleading without explicit coverage adjustment.
