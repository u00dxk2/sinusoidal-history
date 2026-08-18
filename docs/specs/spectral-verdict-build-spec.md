# Spectral Verdict — build spec (pre-registered)

**Written:** 2026-08-18, same-day as the research ingest, by the session that ran it —
this document is the warm-context handoff for the session that builds it.
**Research basis:** `skylark-site/docs/research-library/2026-08-18-sinusoidal-cycles-spectral-methods.md`
(the merged synthesis; two raws beside it). Read the synthesis before building; this
spec is the operational reduction of it plus current-repo specifics.
**Status when built:** this file doubles as the pre-registration. The build must not
deviate from the frozen choices below without recording the deviation here first.

## What this ships

A per-pairing **spectral verdict**: for each of the site's cycle–series pairings, an
honest, referee-proof answer to "does this series contain significant power near the
theory's claimed period?" — precomputed by a committed Python script, rendered as one
static figure + a one-line verdict on each cycle page, with a machine-readable JSON.

The expected headline (verify, don't assume): **0 of the 9 paired constructions reach
the eligibility gate** — the honest verdict for most pairings is "the record is too
short to test the claim at all," which is itself the publishable finding and a
candidate second number for the /state annual verdict.

## Why the pipeline looks like this (adjudications already made — do not relitigate)

Two research engines converged on: AR(1) red-noise null (never white noise; astropy
`false_alarm_probability`/Baluev analytic formulas are banned as the verdict),
Monte-Carlo–calibrated significance, a pre-registered ≥3-target-periods coverage gate
applied BEFORE any spectrum, no HP/band-pass/LOESS/differencing preprocessing
(Slutsky–Yule), multitaper at NW=2 K=3 for the descriptive picture.

Disagreements were adjudicated (2026-08-18) as follows:
1. **Inference engine = pre-registered harmonic regression**, not MTM peak
   significance. Our frequencies are pre-specified, so no peak-hunting machinery;
   regression is phase-invariant and auditable, and sidesteps Mann–Lees false-positive
   inflation (Meyers 2012). MTM is the picture only.
2. **Gate scope = the site's actual pairings** (primary), full cross-grid as a
   secondary "testable anywhere?" panel.
3. **Hard gate, no "weak/suggestive" tier** below 3.0 periods — the weak tier is
   referee bait. Below gate: `INSUFFICIENT_DATA`, no p-value, no significance line.
4. **Surrogates: parametric AR bootstrap only.** IAAFT/phase-randomized surrogates
   preserve the spectrum being tested — circular for a power test.
5. **Multiplicity: Holm over the pre-registered pairing tests** (valid under
   dependence, simple). The 54-vs-55 band collapse is COPY, not statistics: Kondratiev
   and Perez differ by 0.000337 cyc/yr; separating them needs a ~3,000-year record;
   no verdict text may discriminate them.
6. **Draws: 10,000 during development, 99,999 for the committed final run**
   (Holm's smallest threshold at m=9, α=0.05 is ~0.0056 — needs resolution).

## The statistical protocol (exact)

Model, per pairing, on the inference series (annual, post data-fixes below):

```
y_t = β0 + β1·t + A·cos(2π·t/P) + B·sin(2π·t/P) + ε_t,   ε_t ~ AR(1)
```

- **Null:** same without the cos/sin pair (linear trend + AR(1) noise).
- **Statistic:** likelihood-ratio (full vs null), both fit by exact/conditional MLE
  (OLS + AR(1) via iterated Cochrane–Orcutt or direct MLE — pick one, record it).
- **p-value: parametric bootstrap.** Fit the null (β0, β1, φ, σ²); simulate N series
  from it (simulate AR(1) with a burn-in ≥ 500 steps or draw the stationary initial
  state); recompute the LRT on each; `p = (1 + #{LRT* ≥ LRT_obs}) / (N + 1)`.
- **Sensitivity:** repeat everything with an AR(2) null. If the AR(1) and AR(2)
  verdicts disagree at the Holm-adjusted threshold → verdict `MODEL_SENSITIVE`.
- **Multiplicity:** Holm across all pairings that pass the gate (m = count of
  eligible tests; if zero pass — the expected case — no tests run at all).
- **Frequency:** exact 1/P, P from `cycles.json` `period_years`. Never fitted,
  never scanned. `frequency_mode: exact` in the manifest.

**Eligibility gate (before anything):** `span / P ≥ 3.0`, where span =
max(year) − min(year) of the *observed, post-truncation* inference series. A
deliberately conservative site rule, not a theorem (period *estimation* needs ~5;
our easier pre-specified-frequency question gets 3.0). Below gate: output
`INSUFFICIENT_DATA — X.X of 3.0 required periods`, and **no code path may emit a
p-value** below the gate. That's a test, not just a convention (see test suite).

**Verdict states (exactly four):** `INSUFFICIENT_DATA` / `NO_SIGNIFICANT_TARGET_POWER`
/ `MODEL_SENSITIVE` / `SIGNIFICANT_TARGET_POWER`. Plus a two-sentence lay text per
pairing, generated from the state + numbers (never hand-authored phase claims —
KP-001 applies).

## Data prerequisites (do these first)

1. **TFP — inference must use the UNSMOOTHED annual `dtfp_util`.** The committed
   display series is a 5-yr centered rolling mean; it barely attenuates the 54–55y
   band (|H| ≈ 0.99) but reddens the spectrum and corrupts the AR(1) fit; do NOT try
   to divide out the filter (that path is the Kuznets/Adelman–Howrey graveyard).
   Build step: extend `scripts/build_us_tfp_growth.py` to ALSO write
   `public/data/us_tfp_growth_annual.csv` (year, dtfp_util, unsmoothed) with a
   source.md note; display keeps the rolled CSV. Remember: OWID/FRBSF downloads may
   need the explicit User-Agent (see the 2026-08-18 fix in both Maddison scripts;
   check whether the FRBSF fetch needs it too).
2. **WID wealth — truncate inference to 1913+.** The five pre-1913 decadal points
   are interpolations = low-pass filtering that fabricates power exactly in the
   120–150y band. They never count toward N, span, or cycles. No new file needed:
   the script drops year < 1913 and the manifest records it.
3. **Project Mars** — log1p is safe; use the committed CSV as-is.
4. **HATCH (Perez)** — the composite is built from 5-year log-changes: a difference
   filter with transfer function |H(f)|² = 4·sin²(5πf), ≈ 0.32 at f = 1/55. It fails
   the gate anyway (≈2.87 periods), so no test runs this round; when future HATCH
   releases push span past 3.0·55 = 165y, the transfer function must be disclosed
   alongside any verdict and the AR null fit on the same filtered object. Record
   this in the manifest as a standing caveat now.
5. All other pairings use their committed CSVs unmodified.

## Expected gate table (script must compute; these are the check values)

`span = max_year − min_year` of the inference series. Pairings as of Phase 14:

| Cycle (P) | Series (inference span) | span/P | Gate |
|---|---|---|---|
| Schlesinger 30 | Stimson 1952–2024 (72) | 2.40 | FAIL |
| Turchin fathers-and-sons 50 | — unpaired | — | N/A (no test) |
| Kondratiev 54 | TFP annual unsmoothed 1948–2025 (77) | 1.43 | FAIL |
| Perez 55 | HATCH 1865–2023 (158) | 2.87 | FAIL |
| Huntington 60 | DW-NOMINATE 1879–2023 (144) | 2.40 | FAIL |
| Dalio 75 | US GDP share 1870–2022 (152) | 2.03 | FAIL |
| Strauss-Howe 84 | V-Dem 1789–2025 (236) | 2.81 | FAIL |
| Modelski 110 | Leading-economy share 1870–2022 (152) | 1.38 | FAIL |
| Khaldun 120 | Project Mars 1800–2011 (211) | 1.76 | FAIL |
| Turchin secular 150 | WID 1913–2024 (111) | 0.74 | FAIL |

If the script's numbers differ from these, find out why before shipping (CSV drift
or a span-definition bug — both matter).

**Secondary cross-grid panel:** all (P, series) cells with span/P ≥ 3.0 — expect
roughly: P=30 clears on 7 series (DW, V-Dem, Mars, Maddison, leading-power,
WID-1913+, HATCH), P=50 on ~5 (V-Dem, Mars, HATCH, Maddison, leading-power),
P=54/55/60 on V-Dem + Mars, P=75 on V-Dem only, P≥84 nowhere. These cells DO get
tested (they're pre-registered here as the cross-grid family, Holm-corrected within
that family separately from the primary family, and labeled clearly as
"re-pairings, not the site's claims"). This is where actual p-values will exist —
and where Kondratiev-band results on V-Dem/Mars must carry the band-collapse copy.

## Deliverables

1. `analysis-manifest.yaml` (repo root or `scripts/spectral/`): per test — cycle id,
   P, series id, csv path + sha256, truncation rule, transform note, trend model,
   `frequency_mode: exact`; global — α = 0.05, gate = 3.0, seed, draws, AR orders
   {1, 2}, Holm families {primary, cross-grid}. Committed BEFORE results.
2. `scripts/spectral_verdict.py` — stdlib + numpy/scipy only (DPSS via
   `scipy.signal.windows.dpss`; hand-rolled MTM average of eigenspectra at NW=2,
   K=3; AR fit hand-rolled or statsmodels if already available — check, don't add
   deps casually). Reads manifest, writes outputs. Deterministic given seed.
3. Outputs, committed: `public/data/spectral/verdicts.json` (machine-readable: per
   pairing — state, span, cycles_covered, p (null if gated), p_ar2, holm_family,
   manifest sha, versions) + one SVG figure per pairing
   `public/data/spectral/<cycle_id>.svg`: the series, the display cosine, the MTM
   spectrum with a vertical marker at 1/P, and the "INSUFFICIENT SPAN — X.X of 3.0
   required periods" banner when gated (no significance line on gated figures — ever).
4. `public/data/spectral/spectral.source.md` — provenance: what ran, when, manifest
   hash, and the two-sentence method summary with citations (Mann & Lees 1996;
   Torrence & Compo 1998; Hamilton 2018; Meyers 2012).
5. **Page integration:** a "Spectral verdict" section on each `/cycles/<slug>` page
   reading `verdicts.json` at build/request time (figure + lay text + a link to
   methods). Cycle pages are SSG — import the JSON directly.
6. **Methods page + mirror:** replace the "flagged for future work" sentence in the
   Pearson section with a new "Spectral testing" section: the protocol in ~2
   paragraphs, the gate, the four states, the failed-detection precedents
   (Korotayev & Tsirel 2010 — significant only after replacing WWI/WWII years with
   geometric means, ≤3 cycles of record, contested not retracted; Kuznets ~20y
   swings killed as a moving-average artifact, Adelman 1965/Howrey 1968; Turchin
   himself reports the 150y signal as ONE realized oscillation with no formal
   spectral test — cite his candor as the standard). BOTH the React page and
   `public/methods.md` (mirror rule), same commit.
7. **llms.txt:** one bullet for `/data/spectral/verdicts.json` + a sentence in the
   /cycles or methods bullet. **AGENTS.md:** add the invariant that adding a cycle
   or changing a pairing requires a manifest update + re-run.
8. **/state integration (optional, second edition candidate):** the eligibility
   count as a second headline number. Do NOT retro-edit the frozen 2026 CSV.

## Test suite (vitest is TS; these are Python — pytest or a `--selftest` mode)

- **Null calibration:** simulate AR(1) nulls at φ ∈ {0.3, 0.6, 0.9}, run the full
  pipeline; p-values must be ~Uniform(0,1) (KS test at α=0.01, N≥500 sims).
- **Signal injection:** AR(1) + a true sinusoid at 1/P with amplitude giving
  theoretical power ~0.8; pipeline must reject the null at ≥ the expected rate.
- **Off-target rejection:** inject at 1/P′ ≠ 1/P (well-separated); test at 1/P must
  NOT fire above α.
- **Filter-regression trap:** run the pipeline on the SMOOTHED TFP series and the
  unsmoothed one; assert the smoothed one is never used by the manifest (path
  check), and document the spectra difference in the source.md as the worked example
  of why.
- **Interpolation gate:** WID inference series must start ≥1913 (assert in script).
- **Gate enforcement:** any pairing with span/P < 3.0 must produce p = null in the
  JSON — assert no numeric p exists for gated rows.
- **Holm cross-check:** recompute Holm by hand on the emitted p-values in the test.
- **Determinism:** two runs with the same seed produce byte-identical JSON.

## Referee-attack acceptance criteria (ship only when all hold)

"You p-valued 0.75 cycles" → impossible by construction. "White-noise null" → AR(1)
primary + AR(2) sensitivity, disagreement prints MODEL_SENSITIVE. "Smoothing
artifact" → inference only on unsmoothed sources. "Interpolation fabricated your
low frequencies" → synthetic points excluded from N/span. "You cherry-picked the
peak/detrend" → exact pre-registered frequency, manifest committed before results,
linear trend only. "Eight tests one α" → Holm per family. "Perez vs Kondratiev" →
copy never discriminates 54 vs 55. "Wavelet patch as evidence" → no wavelets at all
this round (display-only was allowed; we ship none).

## Explicitly out of scope

Wavelets. Lomb–Scargle (all inference series are evenly sampled post-truncation).
Any UI beyond the per-cycle section + methods. Bayesian model comparison. Testing
calibration-drawer override values (published parameters only).

## Session-start checklist for the builder

1. Read this file top to bottom, then the research synthesis in skylark-site.
2. `python scripts/audit_cycle_rationales.py` still passes (baseline).
3. Build data prerequisite #1 (unsmoothed TFP companion CSV) first — it touches an
   existing build script and needs the provenance note.
4. Manifest → script → tests → outputs → pages/mirrors → llms.txt/AGENTS.md →
   README/CHANGELOG (this is a "Phase 15" entry) → commit, deploy-verify, bus
   task-complete. Mirrors in the same commit as their pages.
5. The cos-math audit isn't triggered (no rationale prose changes) unless you touch
   cycles.json — don't.
