# US Technology-Diffusion Composite (site-derived from HATCH 2.0) — experimental

**Status:** experimental, site-derived. This is not a diffusion measure published by the HATCH authors (their companion paper fits logistic curves per technology and compares steepness); it is a composite this project built from their national adoption series, and its construction bakes in S-curve maturity (see caveats). Treat it as a sensitivity series, not a test of Perez.

**Retrieved:** 2026-08-18
**Source URL:** https://zenodo.org/records/19579793 (file `HATCH_national_1.5.csv`, MD5 `3f16f6cb1c947369fbbe2a2b48a986c5`, verified at download)
**DOI:** 10.5281/zenodo.19579793 (published 2026-04-14; concept DOI 10.5281/zenodo.19579792). Record-metadata note: the deposit is titled "Extended Historical Adoption of Technology Dataset 2.0", its Zenodo version field reads `v1`, and the national file is named `HATCH_national_1.5.csv` — all three refer to this one deposit.
**Primary citation:** Greene, Jenna and Gregory Nemet (University of Wisconsin–Madison). *Extended Historical Adoption of Technology Dataset 2.0.* Zenodo. Companion dataset to Greene, Gidden, Brutschin & Nemet, "Drivers of technology diffusion speed in countries," *Nature Communications* 17, 7591 (2026), DOI: 10.1038/s41467-026-73563-6. HATCH extends the NBER CHAT tradition (Comin & Hobijn); many of its rows cite CHAT as their source.
**Coverage:** 1865–2023 (every year, no gaps; but see the N_t caveat — 1865–1903 runs on only 3–8 technologies).
**License:** CC BY 4.0 (Zenodo record rights field; re-verified live 2026-08-24).

## Columns in our CSV

- `year` — calendar year
- `tech_diffusion_intensity` — median, across US technology series, of each technology's z-scored 5-year log-change in adoption. Positive = the median technology is diffusing faster than its own historical norm; negative = slower. Unitless index.
- `n_technologies` — N_t, the number of technology series contributing to that year's median. Read the composite with this column open: thin years (small N_t) are noisy years.

## What was filtered and transformed

The build pipeline lives in `scripts/build_perez_tech_diffusion.py` (run from repo root). It:

1. **Downloads `HATCH_national_1.5.csv`** from the versioned Zenodo record and verifies its MD5 against the checksum in the record metadata (versioned Zenodo deposits are immutable; a mismatch means a corrupt download).
2. **Keeps US rows only** (`Country Code == "USA"`): 121 technology series in the raw national file (the companion paper reports 120 US technologies after its own study filters), from canals (1794) and railroads (1830) through solar PV and social media. Every other paired series on this site is US or global, and the US is HATCH's best-covered country (121 series vs 70 for the runner-up, China). A duplicate-technology guard keeps the longest row if a technology ever appears twice (none currently do).
3. **Drops non-positive values.** Zeros in HATCH are pre-commercialization padding (a railroad series reading 0 km before the first track); log-changes need a positive domain.
4. **Computes rolling 5-year log-changes** per technology: Δ_t = ln(x_t) − ln(x_{t−5}), only where both endpoints are actually observed — no interpolation.
5. **Z-scores the log-changes within each technology** (sample mean/std over that technology's full Δ history). This puts a 19th-century railroad boom and a 21st-century solar boom on the same scale: each is measured against its *own* series' typical growth, so units, magnitudes, and metric types never mix. Technologies with fewer than 10 usable Δs, or zero variance, are excluded (16 of 121 excluded; 105 contribute).
6. **Aggregates per year by MEDIAN** across technologies (robust to any single series' outliers), records N_t, and keeps years with N_t ≥ 3 (a median over one or two series is not a composite).

**Audit provision:** the transform contains no Perez dates, target period, or phase parameters, and the complete build script is committed so the construction can be checked line by line rather than taken on trust. It is an *ex-post* composite: each technology is standardized against its full available history, so earlier scores use information from later observations and can change when HATCH histories are extended.

## Why this series pairs with Perez

Perez's *Technological Revolutions and Financial Capital* (2002) is about successive techno-economic paradigms — steam & railways, steel & electricity, oil & mass production, ICT — each diffusing through the whole economy in a decades-long surge (installation → turning point → deployment). Her core construct is **economy-wide diffusion intensity**: how fast the economy's technology base is being transformed. It is *not* asset prices — financial bubbles are, in her account, a symptom at the installation/deployment turning point, not the cycle itself. A composite of how fast a broad basket of US technologies is diffusing relative to each technology's own historical norm is as direct a measurement of her construct as public long-run data allows. The site's cycle parameters for Perez (period 55y, peak 2000) were set from her writing, not from this series.

What the series actually shows, for the record: strongly positive in the railroad/telegraph decades (1860s–1880s, decade means +0.6 to +1.2), moderately positive through electrification (1900s–1910s, ≈ +0.35), near zero mid-century, and persistently *negative* from the 1970s onward (≈ −0.25 to −0.45), with no local peak at 2000. The data was not adjusted to change this.

## Caveats

- **Thin early years.** 1865–1903 runs on N_t = 3–8 technologies (railroads, telegraph, zinc, crude oil, beer, sugar, telephones…). N_t ≥ 20 only from 1905, ≥ 50 from 1966. A median over 3–8 series is a statement about a handful of technologies, not about the economy; the 1860s–1890s decade means should not be compared with the 60–70-series modern values. Read them with the `n_technologies` column open.
- **Thin final years.** Most upstream sources stop between 2017 and 2021, so N_t collapses at the end (2022: 11; 2023: 3). Treat 2022–2023 as provisional.
- **Panel-aging / maturity drift.** Technologies grow fastest early in their S-curve. Within-series z-scoring means a mature technology sits below its own historical mean for most of its later life, and HATCH's panel skews toward long-lived series that are deep into saturation by the late 20th century. The secular downward drift after ~1970 is therefore **substantially an artifact** of the normalizer plus an aging basket (fewer newly-entering fast growers carrying long-enough histories), and should not be read as a slowdown in US technological dynamism. Put bluntly: standardizing S-curve growth against its own lifetime mean makes lifecycle position part of the signal by construction, so the composite is closer to "average S-curve maturity of the measured panel" than to Perez's "diffusion of a techno-economic paradigm." The queued upgrade is a lifecycle-adjusted version (growth residual against technology age, equal weight per technology, uncertainty bootstrapped by technology); until it exists this series is a sensitivity check, not a primary pairing. Digital-era diffusion (software, internet services) is also under-represented relative to physical infrastructure and materials.
- **Technology selection bias.** HATCH contains technologies that diffused successfully enough to be measured; failed or niche technologies are absent. The composite measures the diffusion tempo of *winners*.
- **Metric heterogeneity.** Series mix stocks (railroad km, telephones in service, installed MW), flows (annual production of steel, cement, crude oil), and bounded shares (% of households with a flush toilet, vaccine coverage). Log-changes of a stock, a flow, and a bounded share are related but not identical growth concepts. Within-series z-scoring absorbs the level/unit differences but not the conceptual ones. Bounded shares mechanically compress toward zero growth near saturation — which is also exactly what an S-curve should do.
- **Overlapping windows.** Rolling 5-year changes computed annually share 4 of 5 years with their neighbors, so the series is strongly autocorrelated by construction. Fine for reading multi-decade swings (its purpose here); do not treat adjacent years as independent observations.
- **Z-scoring assumes within-series stationarity.** Each technology's growth distribution is summarized by one mean and one std over its whole history. For series with a single dominant growth episode (most of them), the z-scores are well-behaved; for series whose variance regime shifts (war interruptions, source splices), the z-scores inherit that.
- **Coverage discontinuities from source rotation.** HATCH splices sources with different start/end years (CHAT/Mitchell historical series; USGS minerals from 1900; BP energy from 1965; IRENASTAT renewables from 2000; OWID household shares at irregular years). Steps in N_t (1905, 1966) mark cohorts of series entering, which can shift the composition of the median across those boundaries.
