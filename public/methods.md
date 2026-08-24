# Methods · Provenance & caveats

> Plain-markdown mirror of https://sinusoidalhistory.com/methods. The canonical rendered version is the React page at `/methods`; this file shadows the prose for LLM and agent consumption. CORS-enabled.

# How the numbers were chosen

*Where each data series comes from, what gets transformed, and why the correlation number on the calibration panel is a diagnostic and not a test statistic.*

## Data sources

### US House Polarization (DW-NOMINATE)

**Paired with:** Huntington — creedal passion.

Distance between Democratic and Republican House means on the first DW-NOMINATE dimension; 46th–118th Congress (1879–2023).

Huntington's construct is recurring surges of creedal moralism - not interparty roll-call distance. This project pairs it with DW-NOMINATE polarization as an imperfect proxy chosen by us, not a measure Huntington proposed; it is the cleanest century-scale roll-call series available.

- Source: Voteview / Lewis, Poole, Rosenthal, Boche, Rudkin, Sonnet (2026), https://voteview.com/articles/party_polarization
- License: freely available; project code MIT-licensed; no explicit data license.
- Provenance: [/data/dw_nominate.source.md](https://sinusoidalhistory.com/data/dw_nominate.source.md)

### US TFP growth (5-yr rolling)

**Paired with:** Kondratiev wave.

5-year centered rolling average of Fernald's utilization-adjusted US TFP growth, derived by this project from the annual `dtfp_util` column. Annual data begins 1948; the build script keeps clipped (asymmetric) windows at the boundaries rather than dropping rows, so the 1948 and 1949 endpoints are edge artifacts (see caveats below).

Kondratiev waves predict 50–60 year cycles of technological paradigm expansion and exhaustion. TFP growth is the most direct measurable output.

- Source: Fernald (2014), FRBSF Working Paper 2012-19, https://www.frbsf.org/research-and-insights/data-and-indicators/total-factor-productivity-tfp/
- License: freely available; © FRBSF, no explicit reuse license.
- Provenance: [/data/us_tfp_growth.source.md](https://sinusoidalhistory.com/data/us_tfp_growth.source.md)

### US Top 1% Wealth Share

**Paired with:** Peter Turchin — secular cycles.

Share of total household wealth held by the top 1% of US adults. The modern Saez–Zucman series begins 1913; pre-1913 points (1820, 1850, 1880, 1900, 1910) are spliced from earlier historical sources via OWID/WID and have wider standard errors.

Direct proxy for Turchin's elite-overproduction driver - when wealth concentrates, elite competition intensifies and instability follows.

- Source: WID · World Inequality Database, retrieved via Our World in Data. 1913–present from Saez & Zucman (2016) / DINA; pre-1913 decadal points (1820, 1850, 1880, 1900, 1910) are WID interpolations from earlier US wealth-distribution literature, not from Saez–Zucman directly. https://wid.world/country/usa/
- License: CC BY 4.0.
- Provenance: [/data/wid_top1_wealth.source.md](https://sinusoidalhistory.com/data/wid_top1_wealth.source.md)

### US Share of World GDP

**Paired with:** Ray Dalio — Big Cycle.

US GDP as share of all-countries GDP in the Maddison Project Database (2011 PPP $); trimmed to 1870+ (earlier years have too-sparse country coverage, and the covered-country denominator keeps growing after 1870 - see caveats below). Upstream country estimates reach back to year 1; this project uses 1870–2022.

Imperial-arc proxy. The data peaks at 1945 at ~32% of world GDP (war-production driven); Dalio's composite empire-score peaks ~1950 by his own statement, so the cycle and the data deliberately differ by ~5 years.

- Source: Maddison Project Database 2023 (Bolt & van Zanden, 2024, J. Econ. Surveys, DOI 10.1111/joes.12618), https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023
- License: CC BY 4.0.
- Provenance: [/data/us_world_gdp_share.source.md](https://sinusoidalhistory.com/data/us_world_gdp_share.source.md)

### US Liberal Democracy Index (V-Dem)

**Paired with:** Strauss-Howe — saeculum.

V-Dem liberal-democracy index for the US, 1789–2025, scale 0–1.

Generational-cycle theory predicts crisis lows that line up with stress on liberal-democratic institutions. V-Dem's recent US drop is the clearest empirical analogue to Strauss-Howe's "Fourth Turning."

- Source: V-Dem Institute, Country-Year Dataset v16, March 2026 (retrieved via Our World in Data), https://v-dem.net/data/the-v-dem-dataset/
- License: CC BY-SA 4.0.
- Provenance: [/data/vdem_libdem.source.md](https://sinusoidalhistory.com/data/vdem_libdem.source.md)

### Deaths in conventional wars (Project Mars, log)

**Paired with:** Ibn Khaldun — dynastic cycle.

Natural log of (1 + deaths per 100,000) from Project Mars - log-transformed to keep WWI/WWII from flattening the rest of the series. Coverage 1800–2011; Project Mars covers conventional interstate and civil wars between states with differentiated militaries causing ≥500 deaths.

Rough proxy for Khaldun-style state-breakdown intensity. Log-transformed because WWI/WWII spikes otherwise dominate; the transform reveals secular trend and lets the cycle pairing breathe.

- Source: Our World in Data · Project Mars v1.1 (Lyall 2020), https://ourworldindata.org/grapher/deaths-in-wars-by-region-project-mars
- License: OWID chart CC BY 4.0; underlying Project Mars data Public Domain (Harvard Dataverse).
- Provenance: [/data/conflict_deaths.source.md](https://sinusoidalhistory.com/data/conflict_deaths.source.md)

### US Policy Mood (Stimson)

**Paired with:** Schlesinger Jr. — liberal/conservative cycle.

Stimson's Policy Mood index - composite measure of US public preference for liberal vs. conservative domestic policy, estimated from ~150 repeated survey items via the dyad-ratios algorithm; annual, 1952–2024

The closest thing on this site to a direct measurement: an independently constructed index of mass preferences over the scope of domestic government, which is one component of Schlesinger Jr.'s public-purpose vs. private-interest rhythm, not the whole of it. Stimson's own reading of the series stresses shorter, thermostatic swings rather than a fixed ~30-year cycle; the pairing tests his data against Schlesinger's period, it does not report his endorsement of it. Coverage starts 1952.

- Source: James A. Stimson, Policy Mood data series (UNC), via *Public Opinion in America* (Westview, 2nd ed., 1999) and ongoing updates, https://stimson.web.unc.edu/data/
- License: freely shared by author; no explicit reuse license.
- Provenance: [/data/stimson_policy_mood.source.md](https://sinusoidalhistory.com/data/stimson_policy_mood.source.md)

### Leading Economy's Share of World GDP

**Paired with:** Modelski — long cycle of world leadership.

The largest single economy's share of the summed GDP of the countries Maddison covers that year, with the leader named per year (Maddison Project Database 2023, 2011 PPP $); trimmed to 1870+, and the covered-country denominator grows over time - see provenance. The rule - largest economy - is mechanical, fixed without reference to Modelski's leadership succession

Economic size as a deliberately imperfect correlate of world leadership - a proxy for a correlate of Modelski's naval/global-reach construct, not the construct itself. Mechanical by design (the largest economy per year, never hand-picking his hegemons), so its divergences show: under Maddison PPP the 1870–1881 leader is Qing China (not Britain, Modelski's naval leader) and China leads again from 2014. The series' all-time maximum, 31.6% in 1945, falls on the reference peak - a descriptive coincidence under a denominator whose coverage is thinnest early, not independent validation of the theory.

- Source: Maddison Project Database 2023 (Bolt & van Zanden, 2024, J. Econ. Surveys, DOI 10.1111/joes.12618), https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023
- License: CC BY 4.0.
- Provenance: [/data/leading_power_gdp_share.source.md](https://sinusoidalhistory.com/data/leading_power_gdp_share.source.md)

### US Technology-Diffusion Intensity (HATCH)

**Paired with:** Carlota Perez — techno-economic paradigm.

Experimental, site-derived composite from HATCH 2.0 national adoption series - not a measure published by the HATCH authors: the median, across ~105 US technology series, of within-technology z-scored 5-year log-changes in adoption; annual 1865–2023, with the contributing-technology count published per year

Perez's construct is economy-wide diffusion and deployment of a techno-economic paradigm - not asset prices - so a diffusion composite is the nearest measurable analogue public long-run data allows. Read it with its construction in view: each technology is standardized against its own full history, so S-curve maturity is built into the score, and the persistent negativity after the 1970s is substantially an artifact of that normalization and of an aging panel, not evidence that real diffusion slowed. The transform contains no Perez dates, period, or phase parameters (the build script is committed for audit), and the result is visible on the chart: no local peak at 2000.

- Source: HATCH - Extended Historical Adoption of Technology Dataset 2.0 (Greene & Nemet, U. Wisconsin–Madison), Zenodo, DOI 10.5281/zenodo.19579793, https://zenodo.org/records/19579793
- License: CC BY 4.0.
- Provenance: [/data/perez_tech_diffusion.source.md](https://sinusoidalhistory.com/data/perez_tech_diffusion.source.md)

## Normalization

Every overlaid data series is rescaled to the interval [-1, 1] using its own minimum and maximum over the visible window. The cycle curves are sinusoids of unit amplitude (the `amplitude_normalized` field on every cycle is 1.0). The vertical axis is therefore dimensionless: visual peak heights do not represent real-world magnitudes, only relative shape over time. That is convenient for eyeballing shape against a normalized sinusoid, and it is lossy: it hides absolute magnitude and makes level differences invisible. Two points stand out:

- A series with one enormous spike (e.g. global conflict deaths in WWII) compresses every other variation toward a thin band. The visible *shape* near the peaks is real; the visible shape away from them is attenuated.
- Because normalization is per-series, you cannot compare amplitudes across series. Only across time within a single series.
- Because the min/max is taken over the *visible window*, brushing the time range re-normalizes the series: normalized heights are comparable only within the current window, and a narrow window forces even trivial local variation to span the full −1 to +1 height.

## Why Pearson is the wrong tool

The calibration panel reports a Pearson correlation between the data series and the cycle curve. Pearson assumes two things this context violates:

- **Phase sensitivity.** For two sinusoids of the same period, Pearson r reduces to `cos(Δφ)`, where Δφ is the phase offset between them (exactly so for continuous integration or evenly spaced samples over whole periods; approximately for the finite, partial-period records actually correlated here). A perfect cosine evaluated over one full period has r = 1 with itself, r = 0 with a quarter-period shift, and r = −1 with a half-period shift - even though all three are the same cycle in any structural sense. Pearson therefore measures phase alignment, not cyclic similarity, and the calibration slider primarily moves r by changing Δφ.
- **Independence of observations.** Time series are autocorrelated, so classical Pearson significance tests are anti-conservative on data like ours: the effective sample size is smaller than the row count, and naive p-values overstate significance. The calibration drawer therefore reports the r value but not a p-value.

The panel exposes Pearson anyway because the single most important question - "how much is the peak-year choice doing?" - is visible just from watching the correlation change as you move the slider. That diagnostic use is valid. Treating the number as a test statistic is not. Three further honesty notes: the readout is always computed over the series' *full* record, not the brushed window shown in the chart (equal weight per row, so densely sampled modern years dominate an irregular series); it is computed on the transformed values where a transform applies (log1p for Project Mars), so it is the correlation of the logged series; and because the sliders let you tune both phase and period against the same observations, a slider-maximized r is an in-sample search result, not evidence - do not hunt for the peak.

Better tools for cyclic data include cross-correlation at varying lags, the Fourier periodogram, Lomb-Scargle for unevenly sampled records (which one of the present series is: the WID wealth series' pre-1913 points arrive at 30-, 20-, 10-, and 3-year gaps before annual coverage begins), and wavelet decomposition for non-stationary signals. The periodogram leg is now implemented - see the spectral-testing section below. Cross-correlation remains future work, and wavelets are deliberately excluded (pointwise wavelet significance is a known false-positive trap).

## Spectral testing

Since August 2026 every cycle–series pairing carries a pre-registered spectral verdict, computed by a committed script (`scripts/spectral_verdict.py`) from a frozen analysis manifest and published at [/data/spectral/verdicts.json](https://sinusoidalhistory.com/data/spectral/verdicts.json) with one figure per pairing. The question is narrow: does the paired series contain significant power at the theory's exact stated period, above an autocorrelated (red-noise) null? In plain terms: does the data actually repeat at the rhythm the theory names, more strongly than slow-drifting noise would produce by chance? Frequencies are never fitted or scanned - the test is a harmonic regression at exactly 1/P (cosine + sine + linear trend) compared by likelihood ratio against the same model without the sinusoid, with the p-value calibrated by parametric bootstrap (99,999 draws) from a fitted AR(1) null and re-checked against an AR(2) null. Multiple tests are Holm-corrected within pre-registered families. The multitaper spectrum on each figure (NW = 2, K = 3) is the descriptive picture only; it is never the verdict. Inference always runs on unsmoothed, uninterpolated records: TFP on Fernald's raw annual `dtfp_util` (never the 5-year-averaged display series) and the wealth series only from its annual 1913+ span.

Before any spectrum, an eligibility gate: a pairing is testable only if its record spans at least 3.0 full target periods - a deliberately conservative site rule, not a theorem (period *estimation* conventionally wants ~5). Below the gate the verdict is INSUFFICIENT_DATA and no code path emits a p-value; the test suite enforces that, not just convention. There are exactly four verdict states: INSUFFICIENT_DATA, NO_SIGNIFICANT_TARGET_POWER, MODEL_SENSITIVE (the AR(1) and AR(2) nulls disagree at the Holm-adjusted threshold, so no verdict is claimed), and SIGNIFICANT_TARGET_POWER. The 2026 run's headline: **0 of the 9 paired constructions reach the gate** - none of these records is long enough to clear it, which is itself the finding. INSUFFICIENT_DATA is an eligibility outcome - the site declines to run its test below three periods - not evidence that the data contain no information about the cycle. A secondary cross-grid panel re-pairs each period with every series long enough to clear the gate (19 cells, labelled as re-pairings, not the site's claims). A 54- and a 55-year period differ by 0.000337 cycles per year - separating them would take a ~3,000-year record under the Rayleigh resolution criterion, a spectral-resolution heuristic rather than a bound on every parametric method - so no verdict text distinguishes Kondratiev from Perez; every result in that band is one ~54–55-year statement.

The failed-detection precedents that shaped this design: Korotayev & Tsirel (2010) report a significant Kondratiev wave only after replacing the World War years with geometric means, on a record of at most three cycles - contested, never retracted. Kuznets's ~20-year swings were killed as a moving-average artifact (Adelman 1965; Howrey 1968), the direct ancestor of this site's unsmoothed-TFP rule. Turchin himself reports the ~150-year cycle as one realized oscillation and offers no formal spectral test - candor this page treats as the standard. Method references: Mann & Lees (1996); Torrence & Compo (1998); Hamilton (2018); Meyers (2012).

## Missing and sparse data

The curves cover 1600–2050. Every data series has shorter coverage. DW-NOMINATE: 46th–118th Congress (1879–2023); Fernald TFP annual series 1948–present, displayed 1948–present (the 1948 and 1949 values use a clipped, asymmetric window because a true 5-year centered window only becomes available at 1950 - treat the first two displayed points as edge artifacts); Project Mars conflict data 1800–2011; WID top-1% wealth modern coverage 1913–most-recent (with five earlier decadal points spliced from secondary sources, see below); Maddison US/world GDP share trimmed to 1870+ (earlier years have unstable country coverage); V-Dem 1789–present; Stimson Policy Mood 1952–2024. Gaps are simply absent from the chart - nothing is interpolated. If a series fails to load, its legend entry shows "data unavailable" and the rest of the viz keeps working.

Three finer caveats. The modern WID/Saez–Zucman US top-1% wealth series begins in 1913; the five pre-1913 points (1820, 1850, 1880, 1900, 1910) come from earlier historical sources spliced via OWID/WID and have wider standard errors. The TFP 5-year centered rolling average is this project's derivation from Fernald's annual `dtfp_util` column (utilization-adjusted TFP growth), not Fernald's own published series; the build script keeps clipped (asymmetric) windows at the boundaries rather than dropping rows, so 1948 = mean of {1948, 1949, 1950} and 1949 = mean of {1948, 1949, 1950, 1951} - read those endpoints with appropriate skepticism. The Maddison rebuild forward-fills each country's GDP between sparse benchmark observations but does not back-fill before each country's first observation. Many non-Western countries enter Maddison only at 1950, so the world denominator is systematically smaller pre-1950 than post-1950 - biasing US share of world GDP upward for early years. The 1870 value (~10.6%) and the magnitude of the 1870→1945 climb should both be read as "US share of countries Maddison covers in that year," not "US share of world GDP" literally.

## Notes on individual pairings

**V-Dem with Strauss-Howe, not Huntington.** An earlier draft of this project paired V-Dem with Huntington as a secondary signal alongside DW-NOMINATE. We moved it to Strauss-Howe so no cycle would carry two series - nine of the ten cycles have exactly one paired series; Turchin's fathers-and-sons cycle has none. Both are arguments. The Strauss-Howe pairing reads V-Dem's recent decline as a Fourth-Turning institutional-stress signal; the Huntington pairing would have read it as the trough side of a creedal-passion cycle. The data is the same; the framing differs.

**Project Mars covers conventional wars only.** The conflict-deaths series registers years like 2010 as zero because no qualifying conventional war (interstate or civil war between states with differentiated militaries causing ≥500 deaths) was active that year - even though other conflict datasets (UCDP, COW, PRIO) record substantial casualties in 2010 (Afghanistan, Iraq, Mexican drug war). The series therefore measures conventional-war intensity, not all conflict deaths; read drops to zero accordingly.

**Perez pairs with technology diffusion, not asset prices.** Through Phase 13 Perez had no paired series; the HATCH diffusion-intensity composite closed that gap in Phase 14. Shiller's CAPE was the runner-up candidate - Perez's frenzy/turning-point mechanism is financial, and the CAPE valuation extreme came at the turn of 1999–2000, right at the anchor - but CAPE carries no explicit reuse license and measures paper values, not the economy-wide diffusion that is Perez's actual object. We cite CAPE here as anchor validation without redistributing it.

**No paired series for Turchin's fathers-and-sons cycle.** The natural series - Turchin's US Political Violence Database - is posted on his site (USPVD2010.xlsx) but carries no explicit reuse license, so we do not redistribute it. The cycle ships unpaired rather than paired to a construct-mismatched proxy.

**Stimson Policy Mood with Schlesinger Jr.** Of the ten cycles, Schlesinger's pairing is the closest the site gets to a direct measurement: Stimson's index is, by construction, an estimate of US public preference for liberal vs. conservative domestic policy - one component of what Schlesinger's cycle claims to track (mass preferences over the scope of government, not the whole political-historical rhythm), and Stimson's own reading stresses shorter, thermostatic swings rather than a fixed 30-year cycle. The catch is coverage: the series only starts in 1952. Inside the empirical window this construction (period 30, peak 1970) plots troughs at 1955, 1985, and 2015 and peaks at 1970 and 2000 - two complete trough-to-trough swings inside a record spanning 2.4 periods. The pre-1952 shape of the Schlesinger curve cannot be stress-tested against the paired data; treat the calibration drawer's Pearson r accordingly.

See each series' per-source provenance file for full retrieval and processing notes.

---

*Last updated: 2026-08-24*
