# Sinusoidal History

An interactive visualization that overlays seven named historical cycle theories —
Khaldun, Kondratiev, Huntington, Perez, Turchin, Dalio, Strauss-Howe — on a
shared 1600–2050 time axis, each paired with a real historical data series
for stress-testing.

**Production:** [https://sinusoidal-history.skylarkcreations.com](https://sinusoidal-history.skylarkcreations.com)
(once Render + DNS are wired — see [DEPLOY.md](./DEPLOY.md)).

**Current status:** Phase 4 shipped. On top of Phase 3's poster + URL-state
+ embed + annotations, Phase 4 added the polish-and-deploy work:

- **Mobile-responsive at 375px** — compact header, single-column State
  panel, shorter facets, hidden annotation labels under 640px.
- **`/og` route** — dynamic 1200×630 OpenGraph card via `next/og`, reads
  the same URL params as the app so a shared link's social preview reflects
  the linked configuration.
- **Branded 404 + route error boundary.**
- **`sitemap.xml` and `robots.txt`.**
- **Soft-styled** the publication-bias callout. Phase 3's "now · 2026"
  red line softened to a subtle dashed muted-foreground marker.
- **Annotation lanes** increased to 3 with type-priority placement (war >
  geopolitical > economic > cultural).
- **Click-outside-to-exit** focus mode removed (was misfiring on slider
  tracks); ESC and the focused-cycle header are the explicit dismiss paths.
- **State row → focus + calibrate**: rows now show inline filled-bar
  gauges and a settings-icon hint that the row opens calibration.

See [CHANGELOG.md](./CHANGELOG.md) for the full phase-by-phase history.

## What it is (and isn't)

It **is** a side-by-side comparison tool for seeing where different long-wave
theorists agree or disagree — and for stress-testing each theory against a
single empirical proxy.

It **is not** a forecasting tool. Every cycle here is contested. The
"reference peak" for each cycle is itself a judgment call; pick a different
anchor and the curve shifts. The calibration panel exists to make that
visible. See `/methods` in the app for data caveats and `/about` for the
intellectual-honesty disclaimer.

## Stack

- Next.js 16 (app router) + TypeScript strict mode
- Tailwind CSS v4
- shadcn/ui (Tabs, Slider, Toggle, Tooltip, ScrollArea) on Radix UI primitives
- D3 (`d3-scale`, `d3-shape`, `d3-brush`, `d3-selection`) for the viz
- `papaparse` for CSV ingestion
- `nuqs` for URL-state
- `html-to-image` for poster PNG export
- Vitest for unit tests
- No database, no auth

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

## Data model

### Cycles — `src/data/cycles.json`

Each cycle is a JSON object:

| field                       | meaning                                                        |
| --------------------------- | -------------------------------------------------------------- |
| `id`                        | Short stable slug.                                             |
| `name`                      | Display name shown in the legend and tooltips.                 |
| `short_description`         | One-sentence summary of the cycle's claim.                     |
| `period_years`              | Full wavelength, in years.                                     |
| `reference_peak_year`       | Year where the cycle is at its maximum (a documented peak).    |
| `reference_peak_rationale`  | Why you picked that year as the peak. The calibration.         |
| `amplitude_normalized`      | Relative amplitude, 1.0 by convention.                         |
| `source`                    | Primary-source citation.                                       |
| `confidence_level`          | `"narrative"`, `"empirical-contested"`, `"empirical"`, or `"quantitative"`. |
| `color`                     | Hex color for the curve and legend swatch.                     |

**Be opinionated about `reference_peak_rationale`.** It is the single lever
calibrating the whole curve.

### Data series — `src/data/series.json` + `public/data/*.csv`

Each empirical series is a JSON object in `series.json`:

| field                   | meaning                                                             |
| ----------------------- | ------------------------------------------------------------------- |
| `id`                    | Short stable slug.                                                  |
| `name`                  | Display name.                                                       |
| `short_description`     | What the series measures.                                           |
| `source`                | Short citation.                                                     |
| `source_url`            | Link back to the original source page.                              |
| `license`               | License string (`public`, `CC BY`, etc.).                           |
| `data_file`             | Path to the CSV, relative to `public/` (e.g. `/data/dw_nominate.csv`). |
| `year_column`           | Column in the CSV containing the year.                              |
| `value_column`          | Column in the CSV containing the value.                             |
| `value_units`           | Human-readable unit string, shown in tooltips.                      |
| `color`                 | Hex color for the data line and legend swatch.                      |
| `associated_cycle_id`   | Which cycle this series is meant to stress-test.                    |
| `association_note`      | One-sentence rationale for the pairing.                             |

The CSV files live in `public/data/`. Each must have a sibling
`.source.md` documenting: source URL, retrieval date, any filtering or
transformation, and honest caveats. Provenance files are served statically
and linked from `/methods`.

**Never auto-fetch CSVs at runtime.** Data changes rarely; provenance matters
more than freshness.

### How to add a data series

1. Download the raw CSV from the source, save to `public/data/<slug>.csv`.
2. Trim to only the columns you need (year + value).
3. Write `public/data/<slug>.source.md` documenting source URL, retrieval
   date, any transformation, and caveats.
4. Add an object to `src/data/series.json` pointing at the file.
5. Add an `associated_cycle_id` matching an existing cycle.
6. Reload; the series appears in the Data legend.

## Math

Cycle value at year `y`:

```
value(y) = amplitude * cos(2π * (y - reference_peak_year) / period)
```

Data series are rescaled to [-1, 1] using their own min/max over the visible
window. See `/methods` in the app for the full story on normalization,
Pearson, and why spectral analysis is deferred.

## Project structure

```
public/data/              CSV files + .source.md provenance
src/
  app/
    layout.tsx            Shell, nav, footer
    page.tsx              Main viz container
    about/page.tsx        Intent, disclaimer, "why peaks cluster now"
    methods/page.tsx      Data provenance and methodological caveats
  components/
    Viz.tsx               Top-level wrapper: tabs, range, focus state
    NowSummaryPanel.tsx   Shareable "state of the cycles" strip with phase dots
    FacetView.tsx         Stack of CycleFacet rows, focus management
    CycleFacet.tsx        One cycle's row: header + chart, with normal/expanded/collapsed modes
    FacetTimeAxis.tsx     Shared bottom axis under the facet stack
    CycleOverlay.tsx      Phase 1 single-SVG overlay (Overlay tab)
    CalibrationPanel.tsx  Sliders + Pearson readout (Calibrate tab + reused inline)
    TimeRangeBrush.tsx    D3 brush + preset buttons
    ConvergenceNote.tsx   "publication bias" call-out
    ui/                   shadcn primitives (tabs, slider, toggle, tooltip, scroll-area)
  data/
    cycles.json           Cycle definitions
    cycles.ts
    series.json           Data series definitions
    series.ts             (validates cross-refs at import)
    series.test.ts
    types.ts
  lib/
    cycleMath.ts          sineAtYear, phasePosition, phasePositionLabel, phaseFraction
    cycleMath.test.ts
    seriesMath.ts         normalizeSeries, pearsonCorrelation, alignSeriesToYears
    seriesMath.test.ts
    hooks.ts              useTimeScale, useVisibleData, useCycleValues, useContainerWidth, useEscapeKey
    useCsvSeries.ts       React hook to fetch + parse a CSV
    utils.ts              cn() — tailwind classname merger for shadcn
render.yaml               Render blueprint
components.json           shadcn config
```

## Deploying

See [DEPLOY.md](./DEPLOY.md) for the full Render + Squarespace DNS walkthrough.
Short version: Render Blueprint reads `render.yaml`, you add a
`sinusoidal-history` CNAME at Squarespace pointing at the Render hostname,
done. Cert is automatic.

`/embed/*` routes are cross-origin iframeable via `Content-Security-Policy:
frame-ancestors *` (configured in `next.config.ts`). All other routes inherit
default frame policy.

## Phase 3 non-goals (still deferred)

- No spectral analysis (FFT, wavelets) — Phase 4+ if ever.
- No additional cycles — seven is the cap.
- No backend / saved server-side configurations — URL state is the share
  mechanism.
- No real-time data updates — annual snapshots are fine.
- No user annotations — the curated 14-event list is it.
- No internationalization.

## Sharing

Every meaningful UI state is in the URL. `?tab=facets&focus=huntington&range=1900-2050&peak.huntington=1968` opens the app with Huntington focused at 1968 peak, zoomed to 1900+. Send that link and the recipient sees what you see.

For a poster: `/poster` reads the same calibration overrides from the URL,
renders them as a 1200×800 design canvas, and offers a PNG download.

For embeds: `/embed/docs` has copy-paste iframe snippets.
