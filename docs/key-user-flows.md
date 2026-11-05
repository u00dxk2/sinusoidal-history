# Key user flows

The map for `/journey-walk` and flow critiques. Every screen and interstitial
a reader can hit in these flows belongs here; a screen that exists in the
product but not in this map is itself a finding. Created 2026-08-24 (first
journey-walk); update when a surface is added or a flow's steps change.

## 1. Primary — cold reader to cited/reused cycle (the flow this site exists for)

0. **The search result.** The title tag and meta description, on a results
   page, next to fifteen other answers. This is the only step of the flow that
   happens off our own domain, and until 2026-09-09 it was missing from this
   map — which is a finding by this document's own rule. It is also the step
   with the best evidence behind it: the first GSC window recorded 59
   impressions and 0 clicks at average position 16 (orchestrator read of
   David's screenshots, card ef5842ec). Everything below step 1 is currently
   downstream of a step that converts at zero. Owned by the root layout's
   title template, each route's `metadata`, and `cycleMetaDescription()`;
   guarded by `src/lib/siteConfig.test.ts`.
1. Land on `/` cold (organic / LLM-crawler referral / skylarkcreations.com link).
   **Or land on `/methods` from search.** It was the highest-impression page in
   the first Search Console window (14 of 73 impressions, 2026-08-19..09-09), so
   for a searcher it is an ENTRY page, not only the exit in step 6. This map
   listed it only as an exit until 2026-09-16. First viewport since then: H1 and
   dek, then an "In brief" block (what the site is + See the chart →, and the
   spectral headline count, derived from `verdicts.json`) and an "On this page"
   jump list over the six sections.
2. First viewport. **Phone (<640px):** masthead, H1, a one-line dek, then
   the glance figure — ten 24px rows, one curve per cycle on the facets'
   shared axis, each drawn as one period around its reference peak and cut at
   today, with no mark on the current year (I-048, I-061), year labels, and a
   one-line caption that carries the verdict and says the peaks were chosen
   (`glanceCaption`, `CycleOverview.tsx`; it read "Every cycle, at a glance"
   until I-048). All ten curves clear a 390x664
   screen (since 2026-09-22; 1 of 10 before, 6 of 10 at 360x560). The rows are
   a figure, not controls — a 24px row cannot meet the 44px tap floor — which
   is why the dek no longer says "tap a row". **Desktop (≥640px):** masthead,
   H1, dek, tabs (Facets default; Overlay; Calibrate), and the first facet
   charts. Until 2026-09-21 the summary panel (then "State of the cycles", now
   the verdict panel) and the editor's note came first, and the first curve sat at 1381px on a 390x664 phone and
   1113px on a 1440x900 desktop — below the fold at both.
3. Scroll: (phone: glance figure →) range strip, directly under the chart it
   zooms since I-066 → tabs → ten facet charts → shared time axis → editor's
   note → verdict panel (`NowSummaryPanel`; "State of the cycles" until I-061,
   with no reading of the present since) → closing note (methods link +
   spectral-headline sentence).
4. Focus a cycle: summary-row select (scrolls to the facet since 2026-08-24)
   or facet-title click. Focused facet = expanded chart + axis + rationale +
   caveat + **Full page →** + CALIBRATE: two sliders (reference peak year,
   period) with their min/max, "published <value>" beside a moved value, a
   "reset to published" link, and a live Pearson r labelled "Diagnostic, not
   a test statistic". No card shows a phase word or a now-line (I-061,
   2026-10-21); before that, moving the peak re-labelled the phase live. The slider
   track was invisible on production until 2026-09-26 (undefined shadcn
   colour tokens; journey-walk 2026-09-26 F1).
5. `/cycles/<slug>`: header (confidence tier + gloss) → "Does it hold up?"
   (on the three claim pages, Turchin, Dalio and Strauss-Howe, the H1 is the
   cycle's `question` and the verdict box sits above the curve) → period/peak/
   paired list → curve figure (one period, cut at today) → peak calibration →
   the extrema of the one drawn period ("Where this curve plots its
   extrema") → paired series (CSV ↓ / upstream /
   provenance) → spectral verdict (verdict line → plain-English → figure →
   downloads → protocol links) → Reuse this (copy attribution) → open-in-chart
   CTA → footer. Until I-061 (2026-10-21) a sentence here said where the
   curve puts the current year and linked to `/state/<year>`; both are gone.
6. Exit paths: `/methods`, `/cycles` index, `/about`.

## 2. Cite/reuse — arriving scholar or writer

1. Arrive on a `/cycles/<slug>` page directly, often via a citation. An old
   `/state/<year>` link redirects permanently (308) to `/cycles` since
   2026-10-21; the frozen 2026 edition stays at `/data/state-2026.csv`.
2. `/cycles/<slug>`: CSV + provenance + figure SVG/PNG + copy-attribution.
3. `/poster`: PNG download (pannable on mobile since 2026-08-24).

## 3. Embed — a writer placing the chart in their own page

1. Footer "Embed" → `/embed/docs` (query params, copy-paste snippets,
   cross-origin notes).
2. `/embed?view=…` variants (state-only / facets / overlay / single-cycle).
   NowSummaryPanel renders non-interactive in embeds by design, and so do the
   facet headers (labels, not buttons; since 2026-10-11). A single-cycle
   facets embed (`cycles=<one id>`) is the chart alone: a 200px curve with its
   year axis, no summary panel. Any `peak.`/`period.` override prints a line
   above the chart naming it beside the site's published value.
3. The writer's own page. Each snippet's `height` holds the whole embed,
   attribution included, in a 358px and a 680px column; the full facet stack
   scrolls inside its frame by design, and the overlay is for columns wider
   than 640px (the docs say so). Walked 2026-10-11 (round 4); guarded by
   `scripts/check-embed-snippets.mjs`, which pastes the served snippets into
   a page on another origin. Before that the frames cut off half the panel,
   the whole Huntington curve and the overlay chart (I-037).

## Known flow gaps (carried)

- ~~Mobile has no Overlay tab, while the H1 promises "one axis"~~ — answered
  2026-09-22 by the phone "All ten, at a glance" figure rather than by
  un-hiding the Overlay (ten overlaid curves at 358px is a tangle). The
  Overlay tab stays desktop-only (journey-walk 2026-08-24, J-deferred #2).
- ~~Calibrate tab has no chart in view (D8/M12)~~ — fixed 2026-09-28
  (`cdc1e4c`): the tab renders the selected cycle's expanded facet, sliders
  first on a phone. Its encounter read is W-003's walk (2026-10-03).
