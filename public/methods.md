# Methods · Provenance & caveats

> Plain-markdown mirror of https://sinusoidal-history.skylarkcreations.com/methods. The canonical rendered version is the React page at `/methods`; this file shadows the prose for LLM and agent consumption. CORS-enabled.

# How the numbers were chosen

*Where each data series comes from, what gets transformed, and why the correlation number on the calibration panel is a diagnostic and not a test statistic.*

## Data sources

### US House Polarization (DW-NOMINATE)

**Paired with:** Huntington — creedal passion.

Distance between Democratic and Republican House means on the first DW-NOMINATE dimension; 46th Congress–present (1879–current).

Huntington's creedal-passion cycle predicts ~60–70 year polarization peaks. DW-NOMINATE is the cleanest long-run roll-call proxy available.

- Source: Voteview / Lewis, Poole, Rosenthal, Boche, Rudkin, Sonnet (2026), https://voteview.com/articles/party_polarization
- License: freely available; project code MIT-licensed; no explicit data license.
- Provenance: [/data/dw_nominate.source.md](https://sinusoidal-history.skylarkcreations.com/data/dw_nominate.source.md)

### US TFP growth (5-yr rolling)

**Paired with:** Kondratiev wave.

5-year centered rolling average of Fernald's utilization-adjusted US TFP growth, derived by this project from the annual `dtfp_util` column. Underlying quarterly series begins 1947Q2; the centered window pushes the earliest displayable point to ~1950 and edge-clips the latest year.

Kondratiev waves predict 50–60 year cycles of technological paradigm expansion and exhaustion. TFP growth is the most direct measurable output.

- Source: Fernald (2014), FRBSF Working Paper 2012-19, https://www.frbsf.org/research-and-insights/data-and-indicators/total-factor-productivity-tfp/
- License: freely available; © FRBSF, no explicit reuse license.
- Provenance: [/data/us_tfp_growth.source.md](https://sinusoidal-history.skylarkcreations.com/data/us_tfp_growth.source.md)

### US Top 1% Wealth Share

**Paired with:** Peter Turchin — secular cycles.

Share of total household wealth held by the top 1% of US adults. The modern Saez–Zucman series begins 1913; pre-1913 points (1820, 1850, 1880, 1900, 1910) are spliced from earlier historical sources via OWID/WID and have wider standard errors.

Direct proxy for Turchin's elite-overproduction driver — when wealth concentrates, elite competition intensifies and instability follows.

- Source: WID · World Inequality Database (Saez–Zucman 2016 / DINA, retrieved via Our World in Data), https://wid.world/country/usa/
- License: CC BY 4.0.
- Provenance: [/data/wid_top1_wealth.source.md](https://sinusoidal-history.skylarkcreations.com/data/wid_top1_wealth.source.md)

### US Share of World GDP

**Paired with:** Ray Dalio — Big Cycle.

US GDP as share of all-countries GDP in the Maddison Project Database (2011 PPP $); trimmed to 1870+ for stable country coverage. Full source 1820–2022.

Imperial-arc proxy. The data peaks at 1945 at ~32% of world GDP (war-production driven); Dalio's composite empire-score peaks ~1950 by his own statement, so the cycle and the data deliberately differ by ~5 years.

- Source: Maddison Project Database 2023 (Bolt & van Zanden, 2024, J. Econ. Surveys, DOI 10.1111/joes.12618), https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023
- License: CC BY 4.0.
- Provenance: [/data/us_world_gdp_share.source.md](https://sinusoidal-history.skylarkcreations.com/data/us_world_gdp_share.source.md)

### US Liberal Democracy Index (V-Dem)

**Paired with:** Strauss-Howe — saeculum.

V-Dem liberal-democracy index for the US, 1789–2025, scale 0–1.

Generational-cycle theory predicts crisis lows that line up with stress on liberal-democratic institutions. V-Dem's recent US drop is the clearest empirical analogue to Strauss-Howe's "Fourth Turning."

- Source: V-Dem Institute, Country-Year Dataset v16, March 2026 (retrieved via Our World in Data), https://v-dem.net/data/the-v-dem-dataset/
- License: CC BY-SA 4.0.
- Provenance: [/data/vdem_libdem.source.md](https://sinusoidal-history.skylarkcreations.com/data/vdem_libdem.source.md)

### Deaths in conventional wars (Project Mars, log)

**Paired with:** Ibn Khaldun — dynastic cycle.

Natural log of (1 + deaths per 100,000) from Project Mars — log-transformed to keep WWI/WWII from flattening the rest of the series. Coverage 1800–2011; Project Mars covers conventional interstate and civil wars between states with differentiated militaries causing ≥500 deaths.

Rough proxy for Khaldun-style state-breakdown intensity. Log-transformed because WWI/WWII spikes otherwise dominate; the transform reveals secular trend and lets the cycle pairing breathe.

- Source: Our World in Data · Project Mars v1.1 (Lyall 2020), https://ourworldindata.org/grapher/deaths-in-wars-by-region-project-mars
- License: OWID chart CC BY 4.0; underlying Project Mars data Public Domain (Harvard Dataverse).
- Provenance: [/data/conflict_deaths.source.md](https://sinusoidal-history.skylarkcreations.com/data/conflict_deaths.source.md)

## Normalization

Every overlaid data series is rescaled to the interval [-1, 1] using its own minimum and maximum over the visible window. The seven cycle curves are sinusoids of unit amplitude (the `amplitude_normalized` field on every cycle is 1.0). The vertical axis is therefore dimensionless: visual peak heights do not represent real-world magnitudes, only relative shape over time. That is convenient for eyeballing shape against a normalized sinusoid, and it is lossy: it hides absolute magnitude and makes level differences invisible. Two points stand out:

- A series with one enormous spike (e.g. global conflict deaths in WWII) compresses every other variation toward a thin band. The visible *shape* near the peaks is real; the visible shape away from them is attenuated.
- Because normalization is per-series, you cannot compare amplitudes across series. Only across time within a single series.

## Why Pearson is the wrong tool

The calibration panel reports a Pearson correlation between the data series and the cycle curve. Pearson assumes two things this context violates:

- **Linearity.** Sinusoids are not linear in year. Pearson will say a perfect cosine, evaluated over a full period, has zero correlation with the same cosine shifted by a quarter period — which is correct numerically but misses that one is just the derivative of the other.
- **Independence of observations.** Time series are autocorrelated, so classical Pearson significance tests are anti-conservative on data like ours: the effective sample size is smaller than the row count, and naive p-values overstate significance. The calibration drawer therefore reports the r value but not a p-value.

The panel exposes Pearson anyway because the single most important question - "how much is the peak-year choice doing?" - is visible just from watching the correlation change as you move the slider. That diagnostic use is valid. Treating the number as a test statistic is not.

Better tools for cyclic data include cross-correlation at varying lags, the Fourier periodogram (or Lomb-Scargle for unevenly sampled records, which the present series are not), and wavelet decomposition for non-stationary signals. These are flagged for future work.

## Missing and sparse data

The curves cover 1600–2050. Every data series has shorter coverage. DW-NOMINATE: 46th Congress–present (1879–current); Fernald TFP underlying series 1947Q2–present, displayed ~1950–present after the 5-year centered window; Project Mars conflict data 1800–2011; WID top-1% wealth modern coverage 1913–most-recent (with five earlier decadal points spliced from secondary sources, see below); Maddison US/world GDP share trimmed to 1870+ (earlier years have unstable country coverage); V-Dem 1789–present. Gaps are simply absent from the chart - nothing is interpolated. If a series fails to load, its legend entry shows "data unavailable" and the rest of the viz keeps working.

Two finer caveats. The modern WID/Saez–Zucman US top-1% wealth series begins in 1913; the five pre-1913 points (1820, 1850, 1880, 1900, 1910) come from earlier historical sources spliced via OWID/WID and have wider standard errors. The TFP 5-year centered rolling average is this project's derivation from Fernald's annual `dtfp_util` column (utilization-adjusted TFP growth), not Fernald's own published series; the windows at the extreme ends are clipped, which is why the displayed series effectively starts ~1950 rather than 1948.

## Notes on individual pairings

**V-Dem with Strauss-Howe, not Huntington.** An earlier draft of this project paired V-Dem with Huntington as a secondary signal alongside DW-NOMINATE. We moved it to Strauss-Howe so each cycle would have exactly one paired series. Both are arguments. The Strauss-Howe pairing reads V-Dem's recent decline as a Fourth-Turning institutional-stress signal; the Huntington pairing would have read it as the trough side of a creedal-passion cycle. The data is the same; the framing differs.

**No paired series for Perez.** The techno-economic paradigm story is harder to reduce to a single century-long series. TFP growth is paired with Kondratiev because the Kondratiev framing is more directly about productivity surges; Perez tells a richer story about installation and deployment phases that no single time series captures cleanly.

See each series' per-source provenance file for full retrieval and processing notes.
