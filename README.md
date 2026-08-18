# Sinusoidal History

An interactive editorial chart-room overlaying ten named long-wave cycles
of history — Khaldun, Kondratiev, Huntington, Schlesinger Jr., Perez, Turchin
(secular and fathers-and-sons), Dalio, Strauss-Howe, Modelski — on a shared
1600–2050 time axis. Each cycle is a
unit-amplitude sinusoid pinned to a single explicitly documented reference
peak, and nine of the ten are paired with a real long-run empirical data
series for stress-testing.

**Live:** https://sinusoidal-history.skylarkcreations.com

**Built by** David Kooi at Skylark Creations, April 2026, after a phone-call
conversation with Mark R about whether you could plot Khaldun's five stages,
Huntington's 60-year cycles, and the rest as actual sine waves on one axis
and see where they net out. The full build journal — what was AI, what was
human, where it got hard — lives at
[`docs/how-this-was-made.md`](docs/how-this-was-made.md).

## What it is (and isn't)

It **is** a side-by-side comparison tool for seeing where different long-wave
theorists agree or disagree, and for stress-testing each theory against a
single empirical proxy. Currently shows ten cycles; the eighth (Schlesinger
Jr.'s ~30-year liberal/conservative cycle) was added after initial release.

It **is not** a forecasting tool. Every cycle here is contested in different
ways. The "reference peak" for each cycle is itself a judgment call; pick a
different anchor and the curve shifts. The calibration drawer exists to make
that visible. See `/methods` for the data-side caveats and `/about` for the
intellectual-honesty disclaimer.

The headline editorial point: nearly every cycle peaks near the present, but
that is a **selection effect**, not convergence — theorists writing today
anchor their forecasts to the world they live in, and we read them precisely
because their climaxes land in our era. The site says this on the home page,
on `/about`, and on `/colophon`.

## Status

Phase 14 shipped (August 2026): the roster grew from eight to ten cycles.
Modelski's long cycle of world leadership (plotted at 110y, the midpoint of
his stated 100–120 range, anchor 1945) paired with a new leading-economy
share-of-world-GDP series (Maddison, CC BY); Turchin's fathers-and-sons
~50-year cycle (peaks 1870/1920/1970 in his own words, unpaired this round);
and Perez finally gained a paired series — a HATCH technology-diffusion
composite (Zenodo, CC BY 4.0) whose honest result is that it shows no local
peak at 2000. `/cycles` now also publishes a "considered and excluded" list
(Goldstein, Arrighi, Sornette, Namenwirth/Weber, and others, with verified
citations for why each fails the inclusion bar) and a queued note for
Klingberg. Same phase: a four-lens adversarial review fix wave (see
CHANGELOG), Zenodo archival with a DOI, and a Kondratiev periodicity caveat.

Phase 13 shipped (August 2026): the annual reading at `/state/<year>`
(starting with `/state/2026`) — a dated, citable permalink recording where
each cycle sits that year and the next peak/trough each construction implies
— plus a v1 JSON API: `/api/v1/cycles` and `/api/v1/series` serve the
canonical definition files live, and `/api/v1/state?year=` returns the
computed reading for any year. All CORS-open. Everything on these surfaces
is derived from `period_years` + `reference_peak_year` via the chart's own
cosine; no year-phase prose is authored by hand.

Phase 12 shipped (August 2026): eight static per-cycle routes at
`/cycles/<slug>` plus a `/cycles` index. Until then the cycles existed only as
query-param states of `/`, so the `reference_peak_rationale` prose — the most
substantive per-cycle text in the project — was invisible to search and answer
engines. Each page carries period, reference peak, the full calibration
rationale, caveat, sourcing, and the paired series with provenance; plus a
per-cycle OG card, JSON-LD (WebPage / BreadcrumbList / DefinedTerm / Dataset),
and sitemap + `llms.txt` coverage. No new prose was authored — all text is
reused from `cycles.json`, and the peak/trough years shown are derived from
period + reference peak rather than asserted.

Phase 11 shipped (April 2026): round-4 fact-check verdicts folded in.
Highest-risk fix was the Strauss-Howe rationale prose, which incorrectly
stated 2020 was a trough — at period 84 and peak 1955, the trough is at 1997
and 2020 sits on the rising arm of the sinusoid at cos ≈ +0.15. Five other
items also corrected; see [`docs/fact-check-2026-04-26-round-4.md`](docs/fact-check-2026-04-26-round-4.md).

Phase 10 shipped earlier (April 2026): Schlesinger Jr.'s ~30-year
liberal/conservative cycle was added as an eighth cycle, paired with Stimson's
Policy Mood index (1952–2024). Mark suggested it after seeing the original
seven.

Phase 8 shipped earlier in April 2026. The project went through four rounds
of external fact-checking after the initial release and the data and prose
were materially revised — see the audit archive in [`docs/`](docs/) for the
prompts and reports. Notable corrections during the audit:

- Strauss-Howe peak re-anchored from 2008 (Crisis onset) to 1955 (post-WWII
  High peak), since the Crisis is a trough in this construction, not a peak.
- Dalio peak moved from 1945 to 1950 to match his own stated peak year for
  US power; period revised from 85y to 75y (Dalio states long-term debt
  cycles run about 50–75 years; 75 is the upper end of his range, this
  project's selection rather than a number he asserts).
- Perez confidence tier downgraded from "quantitative" to "empirical-contested"
  (her work is qualitative Schumpeterian periodization, not statistical fit).
- Maddison US/world GDP series rebuilt: regional-aggregate filter was missing
  the `(Maddison)` suffix in OWID's export, doubling the world sum on
  benchmark years; per-country forward-fill added for sparse-coverage years.
  Verifier: `scripts/build_us_world_gdp_share.py`.
- Fernald TFP series rebuilt from `dtfp_util` (utilization-adjusted) instead
  of `dtfp` (raw) to match the documented description. Verifier:
  `scripts/verify_tfp.py`.
- WID license corrected from CC BY-NC-SA 4.0 (round-1 misread) back to CC BY
  4.0 (verified against OWID's authoritative indicator metadata).
- Convergence note: "publication bias" → "selection effect."
- Strauss-Howe rationale rewrite (round 4): the chart-vs-prose contradiction
  about 2020 being a "trough" was caught and rewritten — 2020 sits on the
  rising arm at cos ≈ +0.15 (trough at 1997, next peak at 2039).
- Pearson "linearity" → "phase sensitivity" (round 4): the methods-page
  bullet now correctly explains that for two same-period sinusoids,
  Pearson r = cos(Δφ).
- TFP display range corrected to 1948–present (round 4); the 1948 and 1949
  endpoints are clipped-window edge artifacts and methods now says so.
- Maddison forward-fill bias surfaced (round 4): the rebuild forward-fills
  but does not back-fill, which biases US share upward pre-1950.
- Dalio anchor-and-period mismatch acknowledged (round 4): the 1950 anchor
  is from the 250-year empire-score chart while the 75-year period is the
  long-term debt cycle.
- WID source field disentangled (round 4): pre-1913 decadal points are WID
  interpolations, not Saez–Zucman 2016.
- Project Mars 2010 = 0 explained (round 4) as a definitional artifact.
- Turchin parenthetical "(≈1780 → 1930 → 2080)" replaced (internal sweep)
  — those years all evaluate to cos ≈ −0.81 (near trough) in the actual
  sinusoid, not peaks; rationale rewritten to show the real alignment
  (sinusoid prior peak 1870 ≈ Civil War, but ~90y off from the Revolution).

The site is post-fact-check and treats Phase 11 as the reference state. Older
snapshots are superseded.

## Stack

- Next.js 16 (app router) + TypeScript strict mode
- Tailwind CSS v4 + shadcn/ui (Tabs, Slider, Toggle, Tooltip, ScrollArea) on
  Radix UI primitives
- D3 for the viz (`d3-scale`, `d3-shape`, `d3-brush`, `d3-selection`)
- Fraunces variable serif for editorial typography
- `papaparse` for CSV ingestion
- `nuqs` for URL-state
- `html-to-image` for poster PNG export
- Vitest for unit tests
- No database, no auth, no user input — read-only public site

## Local run

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

### Other scripts

```bash
npm run test        # vitest — run math + cross-ref tests once
npm run test:watch  # vitest in watch mode
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run build       # next build (production)
npm start           # run the built app
```

### Data-rebuild scripts

```bash
python scripts/build_us_world_gdp_share.py     # Maddison rebuild
python scripts/build_leading_power_gdp_share.py # Maddison leading-economy rebuild
python scripts/build_perez_tech_diffusion.py   # HATCH tech-diffusion rebuild
python scripts/build_us_tfp_growth.py          # Fernald TFP rebuild
python scripts/build_stimson_policy_mood.py    # Stimson Policy Mood rebuild
python scripts/verify_tfp.py                   # diagnostic — verify TFP CSV
python scripts/audit_cycle_rationales.py       # cos-math audit on every cycle's rationale
```

`audit_cycle_rationales.py` is the cosine-math sanity check that should be
re-run after any change to a cycle's `reference_peak_rationale` or before
adding a new cycle. It prints, for every year mentioned in any rationale,
whether the sinusoid is at a peak, trough, or in between — so you can read
the prose alongside the numbers and catch the kind of contradiction Round 4
caught for Strauss-Howe (prose said 2020 was a trough; cos says +0.15
rising arm).

These are reproducible and self-documenting; each downloads from the upstream
source, applies the documented transforms, and writes to `public/data/`. They
do not run automatically — the CSVs are committed for stability and
provenance.

## Data model

### Cycles — `src/data/cycles.json`

| field                       | meaning                                                        |
| --------------------------- | -------------------------------------------------------------- |
| `id`                        | Short stable slug.                                             |
| `name`                      | Display name shown in the legend and tooltips.                 |
| `short_description`         | One-sentence summary of the cycle's claim.                     |
| `period_years`              | Full wavelength, in years.                                     |
| `reference_peak_year`       | Year where the curve is at its maximum.                        |
| `reference_peak_rationale`  | Why this year was chosen — should explicitly own editorial choices. |
| `amplitude_normalized`      | Relative amplitude, 1.0 by convention.                         |
| `source`                    | Primary-source citation.                                       |
| `confidence_level`          | `"narrative"`, `"empirical-contested"`, `"empirical"`, or `"quantitative"`. |
| `color`                     | Hex color for the curve and legend swatch.                     |
| `caveat`                    | Optional inline caveat surfaced in the focused-facet view.     |

### Data series — `src/data/series.json` + `public/data/*.csv`

Each empirical series is a JSON object in `series.json`:

| field                   | meaning                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| `id`                    | Short stable slug.                                                  |
| `name`                  | Display name.                                                       |
| `legend_short`          | Compact label used in inline facet legends and the OG card.         |
| `short_description`     | What the series measures.                                           |
| `source`                | Short citation.                                                     |
| `source_url`            | Link back to the original source page.                              |
| `license`               | License string — one of: `CC BY 4.0`, `CC BY-SA 4.0`, freely-available variants. |
| `data_file`             | Path to the CSV, relative to `public/`.                             |
| `year_column`           | Column in the CSV containing the year.                              |
| `value_column`          | Column in the CSV containing the value.                             |
| `value_units`           | Human-readable unit string, shown in tooltips.                      |
| `color`                 | Hex color for the data line and legend swatch.                      |
| `associated_cycle_id`   | Which cycle this series is meant to stress-test.                    |
| `association_note`      | One-sentence rationale for the pairing.                             |
| `transform`             | Optional value transform. Currently only `log1p`.                   |

The CSV files live in `public/data/`. Each has a sibling `.source.md`
documenting source URL, retrieval date, filtering or transformation, and
honest caveats. Provenance files are served statically and linked from
`/methods`. Crossover `.csv` and `.source.md` are CORS-enabled so external
agents can fetch them directly.

### How to add a data series

1. Download the raw CSV from the source, save to `public/data/<slug>.csv`.
2. Trim to only the columns you need (year + value).
3. Write `public/data/<slug>.source.md` documenting source URL, retrieval
   date, any transformation, and caveats.
4. Add an object to `src/data/series.json` pointing at the file.
5. Add an `associated_cycle_id` matching an existing cycle.
6. Reload; the series appears in the Data legend.

If the transform is non-trivial (rolling average, aggregation, log1p, etc.),
write a Python rebuild script in `scripts/build_<slug>.py` so the derivation
is reproducible. The Maddison and Fernald scripts are working examples.

## Math

Cycle value at year `y`:

```
value(y) = amplitude * cos(2π * (y - reference_peak_year) / period)
```

Phase-band labels (peaking, rising, falling, troughing, crossing) use narrow
fractional-phase windows defined in `src/lib/cycleMath.ts`. Data series are
rescaled to [-1, 1] using their own min/max over the visible window. The
calibration drawer reports a Pearson correlation and explicitly does not
report a p-value (Pearson significance tests are anti-conservative on
autocorrelated time series). See `/methods` for the full story on
normalization, Pearson, and why spectral analysis is deferred.

## Project structure

```
public/
  data/                       CSV files + .source.md provenance (CORS-enabled)
  llms.txt                    LLM-discoverable index of all content
  about.md, methods.md,       Plain-markdown mirrors of the prose pages
    colophon.md               (CORS-enabled, text/markdown)
src/
  app/
    (app)/                    Chromed routes (header + footer):
      layout.tsx              Site shell, nav, footer
      page.tsx                Home (interactive overlay)
      cycles/page.tsx         Index of the ten cycles, by ascending period
      cycles/[id]/page.tsx    One static page per cycle (10 prerendered)
      state/[year]/page.tsx   The annual reading (2026+), a citable permalink
      about/page.tsx          The argument and disclaimer
      methods/page.tsx        Data provenance and methodology
      colophon/page.tsx       Note from the maker
    embed/                    Chromeless iframe-safe routes
    poster/                   Print broadside with PNG download
    api/v1/                   JSON API: cycles, series, state?year= (CORS *)
    og/                       Dynamic 1200×630 OpenGraph card
    sitemap.ts, robots.ts     SEO/crawler endpoints
  components/
    Viz.tsx                   Tabs, range, focus state
    NowSummaryPanel.tsx       "State of the cycles" masthead
    FacetView.tsx             Stack of CycleFacet rows
    CycleFacet.tsx            One cycle's row + chart + legend
    FacetTimeAxis.tsx         Shared bottom axis
    CycleOverlay.tsx          Single-SVG overlay (Overlay tab)
    CalibrationPanel.tsx      Period + peak sliders, Pearson r readout
    TimeRangeBrush.tsx        D3 brush + preset buttons
    ConvergenceNote.tsx       "Selection effect" call-out
    Poster.tsx                Print broadside
    ui/                       shadcn primitives
  data/
    cycles.json               10 cycle definitions
    cycles.ts                 (cross-ref validation)
    series.json               9 data-series definitions
    series.ts                 (cross-ref validation)
    series.test.ts
    types.ts
  lib/
    cycleMath.ts              sineAtYear, phasePosition, phasePositionLabel
    stateOfCycles.ts          The annual reading + next-extrema derivation
    cycleMath.test.ts
    seriesMath.ts             normalizeSeries, pearsonCorrelation
    seriesMath.test.ts
    hooks.ts                  useTimeScale, useVisibleData, etc.
    useCsvSeries.ts           React hook to fetch + parse a CSV
    utils.ts                  cn() — tailwind classname merger
docs/
  how-this-was-made.md        Build journal — paired with /colophon
  fact-check-prompt.md        Round-1 audit prompt
  fact-check-2026-04-25.md    Round-1 audit report
  fact-check-prompt-round-2.md
  fact-check-2026-04-25-round-2.md
  fact-check-prompt-round-3-self-contained.md
  fact-check-2026-04-25-round-3-blocked.md
scripts/
  build_us_world_gdp_share.py Reproducible Maddison rebuild
  build_us_tfp_growth.py      Reproducible Fernald TFP rebuild
  verify_tfp.py               TFP derivation verifier
  inspect.mjs                 Playwright capture script (dev only)
render.yaml                   Render Web Service blueprint
components.json               shadcn config
LICENSE                       MIT (code) — data licenses per series.json
CITATION.cff                  Citation metadata
```

## Sharing

The load-bearing UI state is in the URL — tab, focused cycle, time range,
and per-cycle calibration overrides. (A few ephemeral toggles — overlay
series visibility, the pinned year, event-marker visibility — are local
state and reset on reload.)
`?tab=facets&focus=huntington&range=1900-2050&peak.huntington=1968` opens
the app with Huntington focused at peak 1968, zoomed to 1900+. Send that
link and the recipient sees what you see.

For a poster: `/poster` reads the same calibration overrides from the URL,
renders them as a 1200×800 design canvas, and offers a PNG download.

For embeds: `/embed/docs` has copy-paste iframe snippets. All `/embed/*`
routes are cross-origin iframeable via `Content-Security-Policy:
frame-ancestors *` (configured in `next.config.ts`).

For agents and notebooks: `/llms.txt` indexes everything. Prose pages are
mirrored as plain markdown at `/about.md`, `/methods.md`, `/colophon.md`
with permissive CORS. Data CSVs and provenance markdown are served from
`/data/` with CORS open for cross-origin fetches. Three JSON endpoints
(no auth, CORS `*`): `/api/v1/cycles` and `/api/v1/series` are the canonical
definition files served live; `/api/v1/state?year=2026` returns every
cycle's cos value, phase label, and next implied peak/trough at that year.

For citing a moment in time: `/state/<year>` (from 2026) is the dated annual
reading — where each construction sits that year and the turning points it
implies next, frozen at a permalink with a suggested citation.

For a single theory: `/cycles/<slug>` is the static, indexable page for one
cycle — period, reference peak, calibration rationale, caveat, sourcing, the
paired series with provenance links, and a deep link back into the chart at
`/?focus=<id>`. Slugs are hyphenated (`/cycles/strauss-howe`) even though
cycle ids use underscores.

## Deploying

See [`DEPLOY.md`](DEPLOY.md) for the full Render + Squarespace DNS
walkthrough. Short version: Render Blueprint reads `render.yaml`, you add
a `sinusoidal-history` CNAME at Squarespace pointing at the Render
hostname, done. Cert is automatic.

## Citing

If you reference this project in writing, please cite:

> Kooi, D. (2026). *Sinusoidal History*. Skylark Creations.
> https://sinusoidal-history.skylarkcreations.com
> DOI: [10.5281/zenodo.21998618](https://doi.org/10.5281/zenodo.21998618)

Tagged releases are archived on Zenodo; the DOI above resolves to the
latest archived version (v1.1.0 is the first archived release).

A `CITATION.cff` is included for tools that read it (Zenodo, GitHub's "Cite
this repository" widget, etc.).

For citing the underlying data, see each series' source URL in
`src/data/series.json` or the per-source `.source.md` files in
`public/data/`. Cycle theories cite their named original authors as listed
in `src/data/cycles.json`.

## Non-goals (still deferred)

- No spectral analysis (FFT, wavelets, Lomb-Scargle) — flagged on `/methods`
  as future work; the simple sinusoid is part of the editorial honesty.
- No backend or saved server-side configurations — URL state is the share
  mechanism.
- No real-time data updates — annual snapshots are fine; the rebuild
  scripts are explicit and reproducible.
- No user annotations — the curated 14-event historical layer is it.
- No internationalization.

## Contact

Bugs, corrections, or fits you can't defend: open an issue on GitHub or
reach out via Skylark Creations.
