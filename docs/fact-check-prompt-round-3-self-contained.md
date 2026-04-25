# Round-3 fact-check, self-contained version

The previous round-3 prompt expected a deep-research agent with fetch access to the live subdomain and the GitHub repo. Both were refused by the agent's URL-permissioning. This version inlines everything the agent needs: the prose pages verbatim, the canonical data files, CSV samples, the math code, and a short context summary.

Paste the section below into a deep-research agent. It does not need fetch access to the project's domain or repo. It does still benefit from being able to fetch upstream data sources (Voteview, FRBSF Fernald, OWID, WID, Maddison/Groningen, V-Dem, Project Mars/Harvard Dataverse) for cross-checking.

---

## Begin prompt

You are a fact-checker for **Sinusoidal History**, a public-facing data visualization that overlays seven historical cycle theories on one shared time axis, each paired with a real long-run empirical data series. The audience includes historians, economists, and writers (Tomas Pueyo's audience among them). The project's credibility depends on getting facts and methodology right.

Three prior fact-check rounds caught roughly twenty issues — bibliographic, license, methodological, and data-pipeline. Most have been corrected. This round is the final pass before the artifact is shared widely. **Your job: read the inline content adversarially and find what we missed.**

You don't need to verify every prior correction; you can take the corrections at face value and focus on what's still wrong, what's newly wrong, and what's not-yet-thought-of. The "discoveries-not-listed" section is the most valuable output. Round 1 missed two compounding pipeline bugs in the Maddison series; round 2 inverted the WID license verdict; round 3 (the empirical pass) found a `dtfp` vs `dtfp_util` column mismatch in the Fernald derivation. Each of those required reading carefully past the prose layer. Continue that style.

You may use any upstream sources you can reach for cross-checking — Voteview's polarization article, FRBSF's `quarterly_tfp.xlsx`, OWID indicator metadata pages, WID's API or country pages, Maddison Project Database 2023 at Groningen, V-Dem's GitHub release notes, Project Mars on Harvard Dataverse, and any cited theorist's primary text. If your fetcher refuses our domain or repo, that's expected; everything you need from the project is inline below.

---

# THE PROJECT'S CONTENT, VERBATIM

## Home page (`/`)

Eyebrow: **VOL. I · An editorial chart-room**

Headline: **Seven cycles, one axis.**

Standfirst (desktop): *"Khaldun, Kondratiev, Huntington, Perez, Turchin, Dalio, Strauss-Howe — drawn over 1600–2050. Each a pure sinusoid pinned to one documented peak, with a paired empirical series for stress-testing."*

Standfirst (mobile): *"Seven theories of long-wave history on one axis. Tap a row to focus and calibrate."*

UI hint: *"Click a row to focus one cycle; drag the brush below to zoom in time."*

Below the chart, an editorial-rule and:

> *"The cycle curves are pure sinusoids from each theory's declared period and a single calibration date. The overlaid data series are the rawest available proxies we could source. See [methods](/methods) for provenance and caveats."*

## ConvergenceNote component (rendered above the chart)

Pull-quote: **"Notice how the cycles tend to peak near the present."**

Sub-paragraph: *"That is not convergence - it is a selection effect. Theorists writing today anchor their forecasts to the world they live in, and we read them precisely because their climaxes happen to land in our era. Drag the time-range below or click any cycle to see how much the peak-year choice is doing."*

Signoff: **EDITOR'S NOTE**

## `/about` page

Eyebrow: **About · The argument**

H1: **What this is**

### Section: Intent

> Sinusoidal History overlays seven named long-wave theories on a shared time axis so a reader can see *where their predictions line up and where they disagree*. Each cycle is paired with a real long-run data series, and a calibration panel lets you stress-test the fit instead of just admiring the curves side by side.

> Each cycle curve is a pure sinusoid built from the theory's own period and a single explicitly documented reference peak. That is a naïve choice on purpose: it strips the viz down to exactly one knob per cycle (calibration), so disagreement between theories - not parameter fiddling - is what you see.

### Section: Why every cycle peaks near now

> Open the chart and notice that nearly every cycle peaks somewhere near the present. That is not convergence evidence - it is a selection effect. Each theorist wrote in a period that felt consequential, and the "reference peak" they anchored to is, consciously or not, a recent moment. We read these theorists today precisely because their forecasts land in our era.

> A few specifics, since the choices matter. Huntington dated his fourth creedal-passion period as 1960–1975 ("the S&S years"); we anchor at the interval midpoint (~1968) — that is the project's choice, not his. K-wave revivalists in the late 1970s and early 1980s variously dated the post-WWII wave's turning point between 1968 and 1974; we use 1973 as the conventional anchor. Khaldun (d. 1406) made no claim about European history; we anchor at 1789 so the framework can be tested against the modern European record our other data series cover, and that is explicitly the project's editorial choice. Perez identifies 2000–2001 as the "Turning Point" between Installation and Deployment phases of the ICT surge; we map her Turning Point to our sinusoid's peak — that conflates her concept with our mathematical convention.

> The implication is not that the theories are worthless - it is that the calibration is the single most consequential parameter, and it is doing a lot of the work of "predicting" the present. The calibration panel on the main page lets you move the peak and watch the correlation with real data change.

### Section: Cycles in this version

The page renders one entry per cycle in `cycles.json` (full content below), each formatted as: name, period and reference peak, short description, peak-calibration rationale, and source citation.

### Section: Intellectual-honesty disclaimer

> All seven theories are contested in different ways. Kondratiev waves have never been cleanly confirmed in empirical long-run data; spectral analyses report some weak periodicity, but period, phase dating, and existence are not agreed across studies. Khaldun wrote in the 14th century about dynastic politics in a Maghrebi context; applying his framework to a modern European-and-American axis is this project's choice. Huntington's creedal-passion cycle is an interpretive lens over American politics, not a measurement. Perez's techno-economic paradigm framework is rich and influential but methodologically qualitative — Schumpeterian historical pattern recognition, not statistical fitting. (An earlier draft of this site mistakenly labeled it "quantitative.")

> Turchin's secular cycles have the most developed quantitative literature of the seven, but the 150-year period for the modern American cycle is a fitted parameter. Dalio's Big Cycle is a popularised composite, not a peer-reviewed measurement, and his own stated peak year for US power is the 1950s, not 1945 (we use 1950). Strauss-Howe is generational theory - influential in popular discourse, contested in academic history; reducing their four-turnings saeculum to a single sinusoid forces the choice of which peak to anchor (we use the post-WWII High at ~1955), and their predicted Crisis climax around 2020 is a trough in this construction, not a peak. Each cycle comes with a caveat surfaced inline in the focused-facet view; for Strauss-Howe in particular, treat skeptically.

> Treat this tool as a way of making those judgments visible and comparable, not as evidence that any one cycle is real. See [methods](/methods) for the data-side caveats and [colophon](/colophon) for how the site was built.

## `/methods` page

Eyebrow: **Methods · Provenance & caveats**

H1: **How the numbers were chosen**

Standfirst: *"Where each data series comes from, what gets transformed, and why the correlation number on the calibration panel is a diagnostic and not a test statistic."*

### Section: Data sources

Renders one entry per data series from `series.json` (full content below). Each entry: series name, paired cycle, short description, association note, and a Source line with a link to the upstream source URL, the license string, and a link to the in-repo provenance file (`/data/{slug}.source.md`).

### Section: Normalization

> Every overlaid data series is rescaled to the interval [-1, 1] using its own minimum and maximum over the visible window. The seven cycle curves are sinusoids of unit amplitude (the `amplitude_normalized` field on every cycle is 1.0). The vertical axis is therefore dimensionless: visual peak heights do not represent real-world magnitudes, only relative shape over time. That is convenient for eyeballing shape against a normalized sinusoid, and it is lossy: it hides absolute magnitude and makes level differences invisible. Two points stand out:

> - A series with one enormous spike (e.g. global conflict deaths in WWII) compresses every other variation toward a thin band. The visible *shape* near the peaks is real; the visible shape away from them is attenuated.
> - Because normalization is per-series, you cannot compare amplitudes across series. Only across time within a single series.

### Section: Why Pearson is the wrong tool

> The calibration panel reports a Pearson correlation between the data series and the cycle curve. Pearson assumes two things this context violates:

> - **Linearity.** Sinusoids are not linear in year. Pearson will say a perfect cosine, evaluated over a full period, has zero correlation with the same cosine shifted by a quarter period — which is correct numerically but misses that one is just the derivative of the other.
> - **Independence of observations.** Time series are autocorrelated, so classical Pearson significance tests are anti-conservative on data like ours: the effective sample size is smaller than the row count, and naive p-values overstate significance. The calibration drawer therefore reports the r value but not a p-value.

> The panel exposes Pearson anyway because the single most important question - "how much is the peak-year choice doing?" - is visible just from watching the correlation change as you move the slider. That diagnostic use is valid. Treating the number as a test statistic is not.

> Better tools for cyclic data include cross-correlation at varying lags, the Fourier periodogram (or Lomb-Scargle for unevenly sampled records, which the present series are not), and wavelet decomposition for non-stationary signals. These are flagged for future work.

### Section: Missing and sparse data

> The curves cover 1600–2050. Every data series has shorter coverage. DW-NOMINATE: 46th Congress–present (1879–current); Fernald TFP underlying series 1947Q2–present, displayed ~1950–present after the 5-year centered window; Project Mars conflict data 1800–2011; WID top-1% wealth modern coverage 1913–most-recent (with five earlier decadal points spliced from secondary sources, see below); Maddison US/world GDP share trimmed to 1870+ (earlier years have unstable country coverage); V-Dem 1789–present. Gaps are simply absent from the chart - nothing is interpolated. If a series fails to load, its legend entry shows "data unavailable" and the rest of the viz keeps working.

> Two finer caveats. The modern WID/Saez–Zucman US top-1% wealth series begins in 1913; the five pre-1913 points (1820, 1850, 1880, 1900, 1910) come from earlier historical sources spliced via OWID/WID and have wider standard errors. The TFP 5-year centered rolling average is this project's derivation from Fernald's annual `dtfp_util` column (utilization-adjusted TFP growth), not Fernald's own published series; the windows at the extreme ends are clipped, which is why the displayed series effectively starts ~1950 rather than 1948.

### Section: Notes on individual pairings

> **V-Dem with Strauss-Howe, not Huntington.** An earlier draft of this project paired V-Dem with Huntington as a secondary signal alongside DW-NOMINATE. We moved it to Strauss-Howe so each cycle would have exactly one paired series. Both are arguments. The Strauss-Howe pairing reads V-Dem's recent decline as a Fourth-Turning institutional-stress signal; the Huntington pairing would have read it as the trough side of a creedal-passion cycle. The data is the same; the framing differs.

> **No paired series for Perez.** The techno-economic paradigm story is harder to reduce to a single century-long series. TFP growth is paired with Kondratiev because the Kondratiev framing is more directly about productivity surges; Perez tells a richer story about installation and deployment phases that no single time series captures cleanly.

> See each series' per-source provenance file for full retrieval and processing notes.

## `/colophon` page

Eyebrow: **Colophon · A note from the maker**

H1: **From the maker**

### Italic lede

> Mark R and I were on a phone call Friday - both of us walking, both on our own loops. He pitched what he called "the sinusoidal pattern of history": could you plot Khaldun's 5 stages, Huntington's 60-year cycles, and the rest as actual sine waves on one axis, and see where they net out? (He also raised counterfactuals and alternate-history maps as related territory.) I told him I'd take a swing.

### Body

> The spec emerged across the next few Claude Code sessions. What I wanted: seven theorists drawing seven curves on one shared canvas, each paired with a real long-run data series, with a calibration panel that lets you stress-test the fit instead of nodding politely.

> A few notes, since people ask.

#### On the AI part

> I built this with Claude Code (Opus 4.7) over five rough phases across a few days. The model writes D3 plumbing fast and doesn't typo. It is reliably worse than me at noticing when a chart is dishonest. Every commit went through me. Every cycle's reference peak is a choice I made and can defend. The footer line - *cycles are contested, this is a comparison tool, not prophecy* - is what I actually believe. The model is fast scaffolding, not authorship.

#### On the math

> Each cycle is a single sinusoid built from the theory's own period and one explicitly documented peak. That's deliberately naïve. The cycles aren't real with more fidelity than that, and the simple math keeps the calibration drawer doing the most consequential work - move the peak year, watch the correlation move.

#### On the data

> Six of the seven cycles are paired with a real long-run series: DW-NOMINATE polarization, WID top-1% wealth share, conflict deaths (log-transformed so the World Wars don't flatten everything else), total factor productivity, the V-Dem liberal-democracy index, U.S. share of world GDP. The pairings are defensible but not the only choices. I read each series myself before wiring it in. See [methods](/methods) for provenance.

#### On the convergence problem

> Every cycle on this page peaks near the present. That isn't convergence - it is a selection effect. Each theorist wrote in a moment that felt consequential and anchored their cycle there; we read them precisely because their climaxes land in our era. The site says it on the home page, on [/about](/about), and here. Carry the caveat with you or the rest of the project doesn't work.

### Closing

> Thanks Mark. Send the next idea.

> Source: u00dxk2/sinusoidal-history. The build journal lives in docs/how-this-was-made.md. Bug or a fit you can't defend? Tell me.

> David Kooi · Skylark Creations · April 2026

---

# CANONICAL DATA FILES

## `cycles.json`

```json
[
  {
    "id": "khaldun",
    "name": "Ibn Khaldun — dynastic cycle",
    "short_description": "~120-year asabiyyah cycle of dynastic rise and fall (Khaldun's five stages, paraphrased from Rosenthal: consolidation → concentration of power → leisure → contentment → waste)",
    "period_years": 120,
    "reference_peak_year": 1789,
    "reference_peak_rationale": "Project's editorial choice. Anchoring at the French Revolution places the curve at a documented Western inflection point so it can be visually compared against data series that cover the modern European record. Khaldun (d. 1406) made no claim about European history; this is the framework being applied here, not extended by him.",
    "amplitude_normalized": 1.0,
    "source": "Ibn Khaldun, Muqaddimah (1377)",
    "confidence_level": "narrative"
  },
  {
    "id": "kondratiev",
    "name": "Kondratiev wave",
    "short_description": "~50–60 year long economic wave: technological expansion → plateau → stagnation → trough",
    "period_years": 54,
    "reference_peak_year": 1973,
    "reference_peak_rationale": "Conventional anchor inside the post-WWII K-wave's 1968–1974 turning-point window (oil shock + Bretton Woods end). Other revivalists prefer 1968 (Mandel) or 1971; we use 1973 as the most cited single year.",
    "amplitude_normalized": 1.0,
    "source": "Kondratiev, 'Bol'shie tsikly kon'yunktury' (1925); abridged English: 'The Long Waves in Economic Life,' Review of Economic Statistics 17(6) (1935)",
    "confidence_level": "empirical-contested"
  },
  {
    "id": "huntington",
    "name": "Huntington — creedal passion",
    "short_description": "~60–70 year cycle of American political moralism: reform surges followed by cynical intervals",
    "period_years": 60,
    "reference_peak_year": 1968,
    "reference_peak_rationale": "Midpoint of Huntington's 'S&S Years, 1960–1975' (American Politics, Ch. 7), the period he identified as the fourth American creedal-passion era. Huntington didn't designate a single peak year; 1968 is the interval midpoint.",
    "amplitude_normalized": 1.0,
    "source": "Samuel P. Huntington, American Politics: The Promise of Disharmony (Belknap/Harvard, 1981)",
    "confidence_level": "narrative"
  },
  {
    "id": "perez",
    "name": "Carlota Perez — techno-economic paradigm",
    "short_description": "~50–60 year wave: installation phase (frenzy + bubble) → turning point → deployment phase (synergy + maturity)",
    "period_years": 55,
    "reference_peak_year": 2000,
    "reference_peak_rationale": "Anchored to Perez's 'Turning Point' (2000–2001), the dot-com crash she identifies as the inflection between Installation and Deployment phases of the ICT surge. Her own term is 'turning point,' not peak; we map it to the sinusoid's peak as a mathematical convenience.",
    "amplitude_normalized": 1.0,
    "source": "Carlota Perez, Technological Revolutions and Financial Capital (Edward Elgar, 2002)",
    "confidence_level": "empirical-contested"
  },
  {
    "id": "turchin",
    "name": "Peter Turchin — secular cycles",
    "short_description": "~150-year compressed US-specific secular cycle (Ages of Discord, 2016) of elite overproduction → immiseration → state breakdown → reconsolidation. Turchin's pre-industrial agrarian secular cycles in Secular Cycles run ~200–300 years; a separate ~50-year bigenerational cycle stacks on top",
    "period_years": 150,
    "reference_peak_year": 2020,
    "reference_peak_rationale": "Center of Turchin's published forecast window for US instability peaking in the 2020s (Nature 2010, Ages of Discord 2016). The 150-year period is specific to his US-compressed grand cycle in Ages of Discord (≈1780 → 1930 → 2080); his pre-industrial secular cycles run 200–300 years and his bigenerational cycle is ~50 years.",
    "amplitude_normalized": 1.0,
    "source": "Peter Turchin, Secular Cycles (Princeton, 2009, with Nefedov); Ages of Discord (Beresta, 2016); End Times (Penguin, 2023)",
    "confidence_level": "quantitative"
  },
  {
    "id": "dalio",
    "name": "Ray Dalio — Big Cycle",
    "short_description": "~75-year long-term debt / Big Cycle of imperial rise/fall: rising → top → declining → reset, tracking debt, currency reserve status, and internal order. Dalio also describes a longer ~250-year empire arc; this curve uses the 75-year figure",
    "period_years": 75,
    "reference_peak_year": 1950,
    "reference_peak_rationale": "Per Dalio Ch. 5: 'these measures of the United States' powers relative to its own history reached their peaks in the 1950s immediately after the Allies won World War II.' Bridgewater's empire-score chart visually peaks ~1950. Note: our paired data (US share of world GDP) peaks at 1945 because of war-production effects; the cycle and the data deliberately differ by ~5 years, reflecting the difference between Dalio's composite empire score and a single GDP-share series.",
    "amplitude_normalized": 1.0,
    "source": "Ray Dalio, Principles for Dealing with the Changing World Order (Avid Reader Press, 2021)",
    "confidence_level": "narrative"
  },
  {
    "id": "strauss_howe",
    "name": "Strauss-Howe — saeculum",
    "short_description": "~80–90 year saeculum, four ~21-year turnings: high → awakening → unraveling → crisis (4th turning), driven by generational replacement",
    "period_years": 84,
    "reference_peak_year": 1955,
    "reference_peak_rationale": "Anchored to the post-WWII American High (~1955), the most recent completed First Turning peak in Strauss-Howe's saeculum. The framework actually has two cultural highs per saeculum (the 1T High and the 2T Awakening), so reducing it to a single sinusoid is a forced choice; we use the structural High. Their predicted Fourth-Turning Crisis climax (~2020) is a trough in this construction, not a peak — anchoring at 2008 (Crisis onset) as a peak would invert the model.",
    "amplitude_normalized": 1.0,
    "source": "William Strauss & Neil Howe, The Fourth Turning (Broadway Books, 1997)",
    "confidence_level": "narrative",
    "caveat": "Generational theory is contested in academic history. The single-sinusoid representation is a forced reduction of a four-turnings model. Treat skeptically."
  }
]
```

## `series.json`

For each series: name, source citation, source URL, license, coverage description.

| id | name | source | source_url | license |
|---|---|---|---|---|
| dw_nominate_polarization | US House Polarization (DW-NOMINATE) | Voteview / Lewis, Poole, Rosenthal, Boche, Rudkin, Sonnet (2026) | voteview.com/articles/party_polarization | freely available; project code MIT-licensed; no explicit data license |
| us_tfp_growth | US TFP growth (5-yr rolling) | Fernald (2014), FRBSF Working Paper 2012-19 | frbsf.org/.../total-factor-productivity-tfp/ | freely available; © FRBSF, no explicit reuse license |
| wid_top1_wealth | US Top 1% Wealth Share | WID (Saez–Zucman 2016 / DINA, retrieved via OWID) | wid.world/country/usa/ | CC BY 4.0 |
| us_world_gdp_share | US Share of World GDP | Maddison Project Database 2023 (Bolt & van Zanden, 2024, J. Econ. Surveys, DOI 10.1111/joes.12618) | rug.nl/.../maddison-project-database-2023 | CC BY 4.0 |
| vdem_libdem | US Liberal Democracy Index (V-Dem) | V-Dem Institute, Country-Year Dataset v16, March 2026 (retrieved via OWID) | v-dem.net/data/the-v-dem-dataset/ | CC BY-SA 4.0 |
| conflict_deaths | Deaths in conventional wars (Project Mars, log) | OWID · Project Mars v1.1 (Lyall 2020) | ourworldindata.org/grapher/deaths-in-wars-by-region-project-mars | OWID chart CC BY 4.0; underlying Project Mars data Public Domain (Harvard Dataverse) |

Pairings:
- DW-NOMINATE → Huntington
- TFP → Kondratiev
- WID top-1% wealth → Turchin
- US share of world GDP → Dalio
- V-Dem libdem → Strauss-Howe
- Conflict deaths (log) → Khaldun
- Perez has no paired series.

## CSV samples

### `dw_nominate.csv` (74 rows: header + 73 data rows, every odd year 1879–2023)

```
year,house_party_distance
1879,0.7859
1881,0.7827
1883,0.7244
...
1965,0.5982
1967,0.6230
1969,0.6286
...
2019,0.8722
2021,0.8834
2023,0.8981
```

### `us_tfp_growth.csv` (79 rows: header + 78 data rows, annual 1948–2025; 5-yr centered rolling average of dtfp_util)

```
year,tfp_growth_5yr_avg_pct
1948,3.3576
1949,2.6020
1950,2.2588
...
1973,1.5963
1974,1.0203
1975,1.0599
...
2023,0.7261
2024,0.6369
2025,0.8962
```

### `wid_top1_wealth.csv` (118 rows: header + 117 data rows; sparse pre-1913, annual 1913+)

```
year,top1_wealth_share_pct
1820,44.6000
1850,49.7900
1880,40.1100
1900,42.4500
1910,46.6500
1913,46.6300
1914,46.1100
...
2018,35.2000
2019,34.8500
...
2022,34.8900
2023,34.7800
2024,34.7800
```

### `us_world_gdp_share.csv` (154 rows: header + 153 data rows, annual 1870–2022; rebuilt via scripts/build_us_world_gdp_share.py with regional-aggregate filter and per-country forward-fill)

```
year,us_share_world_gdp_pct
1870,10.557
1871,10.967
1872,11.217
...
1900,19.336
...
1929,25.298
...
1944,30.534
1945,31.577     ← peak
1946,30.894
1947,29.954
1948,29.658
1949,28.290
1950,29.154
...
1973,22.208
...
2000,21.579
...
2020,15.158
2021,15.113
2022,14.937
```

### `vdem_libdem.csv` (238 rows: header + 237 data rows, annual 1789–2025, US only)

```
year,liberal_democracy_index
1789,0.2840
1790,0.2830
...
1865,0.3000
...
1900,0.3670
...
1920,0.4290
...
2022,0.7690
2023,0.7890
2024,0.7510
2025,0.5710     ← V-Dem v16 contested re-coding
```

### `conflict_deaths.csv` (213 rows: header + 212 data rows, annual 1800–2011; OWID even-distribution methodology applied upstream; log1p transform applied at load time, not in CSV)

```
year,deaths_per_100k
1800,0.2097
1801,0.4014
1802,0.0080
...
1939,3.1xxx (WWII active)
...
1945,3.xxx
1946,small
...
2009,0.0503
2010,0.0000
2011,0.1335
```

---

# RELEVANT CODE

## `src/lib/cycleMath.ts` (sinusoid + phase-band labels)

```ts
import type { Cycle, PhasePosition } from "@/data/types";

export function sineAtYear(cycle: Cycle, year: number): number {
  const phase = (2 * Math.PI * (year - cycle.reference_peak_year)) / cycle.period_years;
  return cycle.amplitude_normalized * Math.cos(phase);
}

export function normalizedPhase(cycle: Cycle, year: number): number {
  const raw = (year - cycle.reference_peak_year) / cycle.period_years;
  const frac = raw - Math.floor(raw);
  return frac;
}

// Phase-label band widths (phase fraction; 1 = one full period).
export const PEAK_BAND = 0.03;
export const TROUGH_BAND = 0.03;
export const CROSSING_BAND = 0.015;

export function phasePositionLabel(cycle: Cycle, year: number) {
  const frac = normalizedPhase(cycle, year);
  if (frac < PEAK_BAND || frac > 1 - PEAK_BAND) return "peaking";
  if (Math.abs(frac - 0.5) < TROUGH_BAND) return "troughing";
  if (Math.abs(frac - 0.25) < CROSSING_BAND) return "crossing";
  if (Math.abs(frac - 0.75) < CROSSING_BAND) return "crossing";
  if (frac < 0.5) return "falling";
  return "rising";
}
```

## `src/lib/seriesMath.ts` (Pearson r for the calibration drawer)

```ts
export function pearsonCorrelation(a: number[], b: number[]): number | null {
  if (a.length !== b.length || a.length < 2) return null;
  const n = a.length;
  let sumA = 0, sumB = 0;
  for (let i = 0; i < n; i++) { sumA += a[i]; sumB += b[i]; }
  const meanA = sumA / n, meanB = sumB / n;
  let num = 0, denA = 0, denB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA, db = b[i] - meanB;
    num += da * db; denA += da * da; denB += db * db;
  }
  if (denA === 0 || denB === 0) return null;
  return num / Math.sqrt(denA * denB);
}

export function pairedValuesForCorrelation(
  seriesPoints: SeriesPoint[],
  cycleAt: (year: number) => number
): { series: number[]; cycle: number[] } {
  const seriesValues: number[] = [];
  const cycleValues: number[] = [];
  for (const p of seriesPoints) {
    seriesValues.push(p.value);
    cycleValues.push(cycleAt(p.year));
  }
  return { series: seriesValues, cycle: cycleValues };
}

export function normalizeSeries(points: SeriesPoint[]): NormalizedPoint[] {
  // Per-series min/max normalization to [-1, 1] over the visible window.
  // ...
}
```

The calibration drawer joins on the data series' year grid (one row per data point), evaluates the cycle cosine at each of those years, and computes Pearson r over the paired arrays. No p-value is displayed.

## `scripts/build_us_world_gdp_share.py` (Maddison rebuild — summary)

The script downloads the OWID Maddison 2023 mirror, then:

1. Excludes regional aggregate entities (`World`, `Western Europe (Maddison)`, `Eastern Europe (Maddison)`, `Latin America (Maddison)`, `East Asia (Maddison)`, `South and South East Asia (Maddison)`, `Sub Saharan Africa (Maddison)`, `Middle East and North Africa (Maddison)`, `Western offshoots (Maddison)`).
2. Resolves historical-state vs successor-state overlap: for `USSR` (vs Russia/Ukraine/etc.), `Czechoslovakia` (vs Czechia/Slovakia), `Yugoslavia` (vs successors), `Sudan (former)` (vs Sudan/South Sudan) — drop the historical row whenever any successor is present.
3. Forward-fills each entity's GDP across years to handle Maddison's sparse-benchmark coverage (countries that only appear at decade boundaries).
4. Computes `us_share = US_GDP / sum(filled_country_GDPs) × 100`.
5. Trims to 1870+.

## `scripts/build_us_tfp_growth.py` (TFP rebuild — summary)

The script downloads `quarterly_tfp.xlsx` from FRBSF, reads the `annual` sheet, takes the `dtfp_util` column (utilization-adjusted TFP growth in percent), and computes a centered 5-year rolling mean with edge clipping. Output: 78 rows, 1948–2025. A companion `scripts/verify_tfp.py` cross-checks the local CSV against four candidate derivations (`dtfp` / `dtfp_util` × centered / trailing) and reports which one matches.

---

# WHAT I AM ASKING YOU TO DO

Read everything above adversarially. Then return a report with:

1. **Discoveries-not-listed** — most important. Anything wrong, imprecise, or methodologically suspect that no prior round flagged. Look especially for:
   - Internal inconsistencies between cycles.json/series.json and the prose pages.
   - Mathematical or methodological errors in the prose (e.g., the Pearson-cosine identity, the autocorrelation reasoning, the cycle-math formula in `sineAtYear`, the phase-band widths).
   - Bibliographic errors not yet caught (publisher imprints, edition years, page references, journal names).
   - Ambiguous attribution where a theorist's claim is conflated with the project's mapping.
   - Any cycle-or-data-series claim that contradicts the underlying canonical record.

2. **Items still imprecise after the corrections inlined above.** Round 2 found a number of "correct-with-caveat" items; some of those may still be slightly off in the inlined version.

3. **Anything you can verify against upstream that flatly contradicts what's inline.** For example, if you can fetch Voteview's polarization page and the citation string we use is one cycle behind, flag it.

For each finding:
- **Verdict**: `correct` / `correct-with-caveat` / `imprecise` / `incorrect` / `unverifiable-from-public-sources`.
- **Evidence**: at least one primary source with URL.
- **Proposed replacement**: exact replacement string for the relevant field or paragraph.

Bias toward strict reading. If a careful historian or economist could quote a sentence as wrong, mark it.

If you find nothing new after a thorough adversarial read, say so explicitly. That itself is information.

## End prompt

---

## Notes for Dave

This is a self-contained version of round 3. The deep-research agent does not need to fetch the project's domain or repo — everything it needs from us is inline. It can still fetch upstream sources for cross-checking, and that's the highest-value move it can make.

One ancillary thing to know going in: the prior round-3 agent flagged "Claude Opus 4.7" as unverifiable. It is a real model — I'm running on it right now per the runtime metadata, and the announcement was 2026-04-16 (only 9 days before that agent's index). This is a reminder that some agents have lagged search indexes; absence-of-evidence at the agent isn't evidence-of-absence. If a round-4 agent flags Opus 4.7 again, point it at anthropic.com/news for confirmation.

When this round comes back, paste the report and I'll fold any verdicts into a Phase 8 commit — or close out the audit if nothing new surfaces.
