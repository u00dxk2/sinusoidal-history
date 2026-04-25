# US Share of World GDP (Maddison Project Database 2023)

**Retrieved:** 2026-04-24
**Source URL:** https://ourworldindata.org/grapher/gdp-maddison-project-database.csv
**Primary citation:** Bolt, Jutta and Jan Luiten van Zanden (2024). *Maddison style estimates of the evolution of the world economy. A new 2023 update.* Journal of Economic Surveys.
**Coverage:** 1870–2022 (trimmed; full source 1820–2022).
**License:** CC BY 4.0.

## Columns in our CSV

- `year` — calendar year
- `us_share_world_gdp_pct` — US GDP / sum of all countries' GDP × 100, in percent

## What was filtered and transformed

Source CSV has GDP for ~169 countries plus aggregate region rows. We:
1. Excluded aggregate entities (`World`, `Western Europe`, `Eastern Europe`, `Latin America`, `East Asia`, `South and Southeast Asia`, `Sub-Saharan Africa`, `Middle East and North Africa`, `Western Offshoots`) so the world sum reflects countries only.
2. For each year, computed `world_sum = sum(country GDPs)`.
3. Computed `us_share = US GDP / world_sum × 100`.
4. **Trimmed to 1870 onward.** Pre-1870 country coverage in Maddison is patchy — many countries are added at later benchmarks — so early "world" totals are partial and the resulting US share is artificially inflated/deflated. 1870 onward is much more stable.

## Why this series pairs with Dalio

Dalio's Big Cycle is centrally about imperial rise and fall, with the relative GDP share of the dominant power (Britain in the 1800s, US in the 1900s, China today) as the headline indicator. The series shows the US arc clearly: rising through the late 19th century, peak in 1945 at ~42% (when most other industrial economies were rubble), gradual decline to ~7% by 2022.

The peak in 1945 is exactly Dalio's reference peak year for the US Big Cycle — a happy alignment that lets you see how well a pure sinusoid tracks the actual arc.

## Caveats

- Maddison GDP estimates pre-1900 are reconstructions, not measurements. Standard errors widen as you go back.
- "Country" boundaries change (Soviet Union, Yugoslavia, decolonisation) — Maddison uses present-day borders projected back, which is a strong simplifying assumption.
- The trim to 1870 is judgment; viewing pre-1870 in this dataset is misleading without explicit coverage adjustment.
