# US Top 1% Wealth Share (WID)

**Retrieved:** 2026-04-24
**Source URL:** https://ourworldindata.org/grapher/wealth-share-richest-1-percent.csv
**Primary citation:** World Inequality Database (WID), https://wid.world. Data assembled by Piketty, Saez, Zucman and the WID team.
**Coverage:** 1820–2024 (US), 117 rows.
**License:** CC BY (via Our World in Data).

## Columns in our CSV

- `year` — calendar year
- `top1_wealth_share_pct` — share of total household wealth held by the top 1% of US adults (in percent), `extrapolated_no` variant from the WID extract

## What was filtered

Source CSV from OWID has all countries × all years × multiple variants. We kept only `entity == "United States"` rows and the `share_top_1__welfare_type_wealth__extrapolated_no` column.

## Why this series pairs with Turchin

Turchin's secular-cycle theory predicts that elite overproduction — too many people competing for too few elite slots — drives state breakdown. Wealth concentration in the top 1% is a direct, well-measured proxy for elite overproduction: more wealth at the top means more elites to support, more positional competition, and more downstream instability.

The series shows the famous U-shape: high inequality in the antebellum period (~50% in 1850), a long mid-20th-century compression, and a return to high concentration since the 1980s.

## Caveats

- Pre-1900 estimates rely on tax records and probate samples; standard errors widen further back.
- The `extrapolated_no` variant excludes WID's later-year extrapolations beyond the latest available data.
- "Top 1% wealth" is operationalised slightly differently across countries; cross-country comparisons require care, but a single-country time series is robust.
