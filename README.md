# Sinusoidal History

An interactive editorial chart-room overlaying seven named long-wave theories
of history — Khaldun, Kondratiev, Huntington, Perez, Turchin, Dalio,
Strauss-Howe — on a shared 1600–2050 time axis. Each cycle is a unit-amplitude
sinusoid pinned to a single explicitly documented reference peak, and six of
the seven are paired with a real long-run empirical data series for
stress-testing.

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
single empirical proxy.

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

Phase 8 shipped (April 2026). The project went through three rounds of
external fact-checking after the initial release and the data and prose were
materially revised — see the audit archive in [`docs/`](docs/) for the
prompts and reports. Notable corrections during the audit:

- Strauss-Howe peak re-anchored from 2008 (Crisis onset) to 1955 (post-WWII
  High peak), since the Crisis is a trough in this construction, not a peak.
- Dalio peak moved from 1945 to 1950 to match his own stated peak year for
  US power; period revised from 85y to 75y to match Dalio's stated number.
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

The site is now post-fact-check and treats Phase 8 as the reference state.
Older snapshots are superseded.

## Stack

- Next.js 16 (app router) + TypeScript strict mode
- Tailwind CSS v4 + shadcn/ui (Tabs, Slider, Toggle, Tooltip, ScrollArea) on
  Radix UI primitives
- D3 for the viz (`d3-scale`, `d3-shape`, `d3-brush`, `d3-selection`)
- Fraunces variable serif for editorial typography
- `papaparse` for CSV ingestion
- `nuqs` for URL-state
- `html-to-image` for poster PNG export
- Vitest for unit tests (45 cases passing)
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
python scripts/build_us_world_gdp_share.py  # Maddison rebuild
python scripts/build_us_tfp_growth.py       # Fernald TFP rebuild
python scripts/verify_tfp.py                # diagnostic — verify TFP CSV
```

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
      about/page.tsx          The argument and disclaimer
      methods/page.tsx        Data provenance and methodology
      colophon/page.tsx       Note from the maker
    embed/                    Chromeless iframe-safe routes
    poster/                   Print broadside with PNG download
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
    cycles.json               7 cycle definitions
    cycles.ts                 (cross-ref validation)
    series.json               6 data-series definitions
    series.ts                 (cross-ref validation)
    series.test.ts
    types.ts
  lib/
    cycleMath.ts              sineAtYear, phasePosition, phasePositionLabel
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

Every meaningful UI state is in the URL.
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
`/data/` with CORS open for cross-origin fetches.

## Deploying

See [`DEPLOY.md`](DEPLOY.md) for the full Render + Squarespace DNS
walkthrough. Short version: Render Blueprint reads `render.yaml`, you add
a `sinusoidal-history` CNAME at Squarespace pointing at the Render
hostname, done. Cert is automatic.

## Citing

If you reference this project in writing, please cite:

> Kooi, D. (2026). *Sinusoidal History*. Skylark Creations.
> https://sinusoidal-history.skylarkcreations.com

A `CITATION.cff` is included for tools that read it (Zenodo, GitHub's "Cite
this repository" widget, etc.).

For citing the underlying data, see each series' source URL in
`src/data/series.json` or the per-source `.source.md` files in
`public/data/`. Cycle theories cite their named original authors as listed
in `src/data/cycles.json`.

## Non-goals (still deferred)

- No spectral analysis (FFT, wavelets, Lomb-Scargle) — flagged on `/methods`
  as future work; the simple sinusoid is part of the editorial honesty.
- No additional cycles — seven is the cap.
- No backend or saved server-side configurations — URL state is the share
  mechanism.
- No real-time data updates — annual snapshots are fine; the rebuild
  scripts are explicit and reproducible.
- No user annotations — the curated 14-event historical layer is it.
- No internationalization.

## Contact

Bugs, corrections, or fits you can't defend: open an issue on GitHub or
reach out via Skylark Creations.
