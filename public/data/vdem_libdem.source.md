# US Liberal Democracy Index (V-Dem)

**Retrieved:** 2026-04-24
**Source URL:** https://ourworldindata.org/grapher/liberal-democracy-index.csv
**Primary citation:** Coppedge, Michael, John Gerring, Carl Henrik Knutsen, et al. (2026). *V-Dem Country-Year Dataset v16.* Varieties of Democracy Project, https://v-dem.net. (v16 was released March 2026 and was the current dataset at retrieval; an earlier version of this file labeled v15.)
**Coverage:** 1789–2025 (US), 237 rows.
**License:** CC BY-SA 4.0 (Creative Commons Attribution-ShareAlike 4.0), per V-Dem's own R-package release notes (github.com/vdeminstitute/vdemdata/releases). An earlier version of this file mistakenly described it as CC BY 4.0.

## Columns in our CSV

- `year` — calendar year
- `liberal_democracy_index` — V-Dem liberal democracy index (`v2x_libdem`), best-estimate, scale 0–1

## What was filtered

Source CSV has all countries × 1789–2025. We kept only `entity == "United States"` rows and the `libdem_vdem__estimate_best` column. Empty values dropped.

## Why this series pairs with Strauss-Howe

The Phase 2 spec called for V-Dem to be a secondary pairing for Huntington. We instead paired it with Strauss-Howe so every cycle has exactly one data series — that lines up better with the new small-multiples layout (one cycle, one paired series per facet).

The Strauss-Howe pairing is defensible: their saeculum predicts a "Fourth Turning" of crisis and institutional rupture roughly every 80–90 years — an era Howe dates from 2008 onward. Note that the Crisis is a qualitative era in their framework, not this site's sinusoid trough: with period 84 and peak 1955 the construction's trough is 1997, and 2008 sits on the rising arm (cos ≈ −0.68). V-Dem's recent US drop captures the kind of liberal-democratic stress the framework predicts during a Crisis era. It is *not* a measurement of generational psychology — that, the framework's main causal mechanism, isn't directly observable.

## Caveats

- V-Dem aggregates roughly 200 expert-coded indicators; it is interpretive, not a direct measurement.
- Pre-1900 US coding leans heavily on documentary inference. Standard errors are wider for early years.
- The 2024–2025 drop reflects V-Dem's recent re-coding of US institutional quality; this is contested in real time. Treat the very latest values with caution.
- Spec named "v14"; v16 (released March 2026) was the current dataset at retrieval and is what we used.
