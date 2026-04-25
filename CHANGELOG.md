# Changelog

## Phase 4 — ship (April 2026)

Polish-and-deploy pass: turning the working artifact into a public site.

- Mobile-responsive at 375px: compact header nav, single-column State panel
  on small viewports, shorter facets, hidden annotation labels under 640px,
  reduced hero copy.
- Soft-styled the publication-bias callout (gray border, no yellow fill).
- `now · 2026` line in facet charts is now a 1px dashed muted-foreground
  marker; the labelled "now" tick lives only on the bottom shared axis.
- Annotation lanes increased from 2 to 3 with type-priority placement (war
  > geopolitical > economic > cultural > event), drops crowded labels rather
  than overlapping.
- State-of-the-cycles rows show inline filled-bar phase gauges (matching the
  poster) and a settings-icon hint that the row opens focus + calibration.
- Removed the click-outside-to-exit on focus mode (was misfiring on slider
  tracks); ESC and the focused-cycle header still dismiss.
- Dynamic `/og` route generating 1200×630 OpenGraph cards via `next/og`,
  reading the same URL params as the app so a shared link's preview shows
  the linked-to configuration.
- Branded 404 (`Off the time axis`) and route error boundary that points
  back to the overlay instead of crashing the page.
- `sitemap.xml` and `robots.txt` for the five canonical routes.
- `next.config.ts`, root metadata, OG metadata wired to
  `https://sinusoidalhistory.skylarkcreations.com`.
- `DEPLOY.md` documenting Render service creation, Squarespace CNAME, and
  smoke-testing the production deploy.
- Deleted unused create-next-app demo SVGs from `public/`.

## Phase 3 — shareability + polish (April 2026)

- `/poster` route — 1200×800 design canvas, filled-bar phase gauges,
  Download-as-PNG via `html-to-image`. Reads URL params.
- URL state via `nuqs`: `tab`, `focus`, `range`, `peak.<id>`, `period.<id>`
  all round-trip. Send a link, recipient sees what you see.
- `/embed` and `/embed/docs` — iframe-safe routes with
  `Content-Security-Policy: frame-ancestors *`. Three views (facets, overlay,
  state-only) plus per-cycle filtering.
- Annotations layer — 14 curated historical events tagged with
  `cycles_referenced`. Toggleable in the facets tab.
- Khaldun pairing fixed via `transform: log1p` on the conflict-deaths series
  so WWI/WWII no longer flatten the secular trend.
- Phase-label bands tightened to ±3% (peak/trough) and ±1.5% (crossing); the
  test suite asserts no more than 3 cycles read `peaking` simultaneously
  in 2026.
- Visibly draggable time-range brush with bracket handles, bordered
  selection rectangle, and a one-shot "drag to zoom" hint.
- Layout restructure: route group `(app)/` owns site chrome; `/poster` and
  `/embed` are chromeless.

## Phase 2 — legibility + 3 new cycles (April 2026)

- Small-multiples layout (`<FacetView />` + `<CycleFacet />`) replacing the
  single dense overlay. Three facet modes: collapsed sparkline, normal,
  expanded with inline calibration.
- shadcn/ui (Tabs, Slider, Toggle, Tooltip, ScrollArea) on Radix primitives.
  `d3-brush` for the time-range selector.
- Three new cycles: Turchin (period 150, peak 2020), Dalio (85, 1945),
  Strauss-Howe (84, 2008) with surfaced caveat.
- Three new data series: WID top-1% wealth (1820+), Maddison US/world GDP
  share (1870+), V-Dem liberal democracy (1789+) — paired with Turchin,
  Dalio, Strauss-Howe respectively.
- "State of the cycles" summary panel above the chart.
- Time-range brush with five preset views (All / Industrial / Modern /
  Living memory / Now).

## Phase 1 — data overlays + calibration (April 2026)

- Three real data series with provenance: DW-NOMINATE polarization
  (Voteview), US TFP growth (FRBSF Fernald), global conflict deaths
  (OWID Project Mars). Each with sibling `.source.md`.
- `<CalibrationPanel />` for Huntington with reference-peak and period
  sliders, live Pearson readout in an `aria-live` region.
- Perez cycle added.
- Convergence note callout naming the publication-bias problem.
- `/methods` page documenting normalization, why Pearson is the wrong tool
  for cyclic data, and missing-data policy.
- Render `render.yaml` blueprint.

## Phase 0 — prototype (April 2026)

- Next.js 16 + TypeScript strict + Tailwind v4 + D3 (`d3-scale`, `d3-shape`).
- Three cycles: Khaldun (period 120, peak 1789), Kondratiev (54, 1973),
  Huntington (60, 1965).
- `<CycleOverlay />` with legend toggles, hover-to-highlight, click-any-year
  pinned info panel, 1600–2050 axis with current-year line.
- Math helpers `sineAtYear`, `phasePosition` covered by 16 vitest tests.
- `/about` page with cycle sources and intellectual-honesty disclaimer.
