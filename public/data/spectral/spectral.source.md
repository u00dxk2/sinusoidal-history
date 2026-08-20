# Spectral verdict — provenance

**Run:** 2026-08-19, `scripts/spectral_verdict.py --run` (99,999 bootstrap
draws, seed 20260819), from the frozen plan in
`scripts/spectral/analysis-manifest.yaml` (sha256
`1765eca3cacd12fbf44d8645a24bb9e57970aa70fb3a8dc33a477898e9df4572`,
committed before any results were computed). Outputs in this directory —
`verdicts.json` plus one SVG per pairing — are written only by that script;
they are never hand-edited. Full pre-registration:
`docs/specs/spectral-verdict-build-spec.md`.

## Method, in two sentences

For each pairing the verdict is a harmonic regression at the theory's exact
stated period (cosine + sine + linear trend) tested by likelihood ratio
against the same model without the sinusoid, with significance calibrated by
parametric bootstrap from a fitted AR(1) red-noise null, re-checked against
an AR(2) null, and Holm-corrected within pre-registered families — run only
when the record spans at least 3.0 full target periods. Below that gate the
verdict is INSUFFICIENT_DATA and no p-value exists anywhere; the multitaper
spectrum on each figure (NW = 2, K = 3) is descriptive, never the verdict.

## Headline result

0 of the 9 paired constructions reach the eligibility gate (best:
Strauss-Howe / V-Dem at 2.81 periods; worst: Turchin secular / WID at
0.74). The 19-cell cross-grid panel of re-pairings — every (period, series)
cell that does clear the gate — returns NO_SIGNIFICANT_TARGET_POWER in all
19 cells under both AR(1) and AR(2) nulls after Holm correction.

## Worked example: why inference never runs on the smoothed TFP series

The display TFP series is a 5-year centered rolling mean; the inference
series (`us_tfp_growth_annual.csv`) is Fernald's raw annual `dtfp_util`.
On the current data, the detrended lag-1 autocorrelation of the annual
series is **0.07** (nearly white); the rolled series reads **0.83** —
redness manufactured entirely by the filter. The share of detrended
variance below f = 1/30 cyc/yr is 8% in the annual series and 33% in the
rolled one. An AR(1) null fitted to the rolled series would model the
filter, not the noise — the same moving-average artifact that produced
Kuznets's spurious ~20-year swings (Adelman 1965; Howrey 1968).

## Standing caveat: HATCH is itself a filtered object

The Perez-paired HATCH composite is built from 5-year log-changes — a
difference filter with |H(f)|² = 4·sin²(5πf) ≈ 0.32 at f = 1/55. It fails
the gate this round (2.87 of 3.0 periods), so no test ran; if future HATCH
releases push the span past 165 years, any verdict must disclose this
transfer function, with the AR null fitted on the same filtered object.

## Citations

Mann & Lees (1996), *Climatic Change* 33 — robust red-noise background for
multitaper spectra. Torrence & Compo (1998), *BAMS* 79 — AR(1) null for
geophysical series. Hamilton (2018), *REStat* 100 — why never HP-filter.
Meyers (2012), *Paleoceanography* 27 — false-positive inflation in
peak-hunting significance tests, the reason the verdict here is a
pre-registered regression rather than spectrum peak significance.
