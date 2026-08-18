# US Total Factor Productivity Growth (5-year rolling average)

**Retrieved:** 2026-04-24
**Source URL:** https://www.frbsf.org/wp-content/uploads/quarterly_tfp.xlsx
**Primary citation:** Fernald, John G. (2014). *A Quarterly, Utilization-Adjusted Series on Total Factor Productivity.* FRBSF Working Paper 2012-19 (updated 2026-03-24).
**Producer:** Federal Reserve Bank of San Francisco, John Fernald and Shane Boyle
**License:** Freely available; © FRBSF, no explicit reuse license. (An earlier version of this file said "Public.")

## Columns in our CSV

- `year` — calendar year
- `tfp_growth_5yr_avg_pct` — 5-year centered rolling average of the `dtfp_util` column (utilization-adjusted TFP growth, annualised, percent)

## What was filtered and transformed

Source file is `quarterly_tfp.xlsx`, sheet `annual`. We took the `dtfp_util` column (annual utilization-adjusted TFP growth in percent), then computed a centered 5-year rolling average (window of 5, clipping at the edges so the boundary years average a smaller window rather than dropping out). Coverage: 1948–2025. Reproducible: `scripts/build_us_tfp_growth.py`. Verification: `scripts/verify_tfp.py` confirms the local CSV is a perfect match (78/78 rows within 0.0001) against `dtfp_util` centered-5.

An earlier version of this CSV was silently derived from the `dtfp` column (raw TFP growth, no utilization adjustment), which contradicted the documentation calling the series "utilization-adjusted." The current CSV is rebuilt from `dtfp_util` to match the documented intent.

## Why this series pairs with Kondratiev

Kondratiev's long-wave framework predicts 50–60 year cycles of technological paradigm expansion and exhaustion. TFP growth is the most direct measurable output of a technological paradigm: high during diffusion of a general-purpose technology, low during maturity and exhaustion. The high-TFP post-WWII period is exactly Kondratiev's expansion phase; the slowdown starting in the early 1970s matches the top of the post-war K-wave.

## Caveats

- Coverage starts 1948. For Kondratiev's earlier waves (pre-1948) you'd need Bergeaud–Cette–Lecat or similar long-run TFP estimates.
- 5-year centered window dampens the most recent year and the earliest year by clipping. A one-sided rolling window would differ.
- TFP measurement itself is contested — utilisation adjustment is the Fernald approach, not a universal standard.
