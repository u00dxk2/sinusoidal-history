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
   "Every cycle, at a glance" — ten 24px rows, one curve per cycle on the
   facets' shared axis with today's dot, year labels, and (on the Facets tab
   only) the caption "Each in detail below — tap one to focus and
   calibrate." All ten curves clear a 390x664
   screen (since 2026-09-22; 1 of 10 before, 6 of 10 at 360x560). The rows are
   a figure, not controls — a 24px row cannot meet the 44px tap floor — which
   is why the dek no longer says "tap a row". **Desktop (≥640px):** masthead,
   H1, dek, tabs (Facets default; Overlay; Calibrate), and the first facet
   charts. Until 2026-09-21 the "State of the cycles" panel and the editor's
   note came first, and the first curve sat at 1381px on a 390x664 phone and
   1113px on a 1440x900 desktop — below the fold at both.
3. Scroll: (phone: tabs →) ten facet charts → shared time axis → editor's
   note → range brush → "State of the cycles" summary panel → closing note
   (methods link + spectral-headline sentence).
4. Focus a cycle: summary-row select (scrolls to the facet since 2026-08-24)
   or facet-title click. Focused facet = expanded chart + axis + rationale +
   caveat + calibration sliders + live Pearson r + **Full page →**.
5. `/cycles/<slug>`: header (confidence tier + gloss) → curve figure → peak
   calibration → extrema table → paired series (CSV ↓ / upstream /
   provenance) → spectral verdict (verdict line → plain-English → figure →
   downloads → protocol links) → Reuse this (copy attribution) → open-in-chart
   CTA → footer.
6. Exit paths: `/state/<year>` (annual permalink), `/methods`, `/cycles`
   index, `/about`.

## 2. Cite/reuse — arriving scholar or writer

1. Arrive on `/state/<year>` (dated permalink, often via citation) or a
   `/cycles/<slug>` page directly.
2. `/state/<year>`: reading table (rows link to cycle pages) → "Citing this
   page" (suggested citation, DOI, frozen edition CSV) → API links.
3. `/cycles/<slug>`: CSV + provenance + figure SVG/PNG + copy-attribution.
4. `/poster`: PNG download (pannable on mobile since 2026-08-24).

## 3. Embed — a writer placing the chart in their own page

1. Footer "Embed" → `/embed/docs` (query params, copy-paste snippets,
   cross-origin notes).
2. `/embed?view=…` variants (state-only / facets / overlay / single-cycle).
   NowSummaryPanel renders non-interactive in embeds by design.

## Known flow gaps (carried)

- ~~Mobile has no Overlay tab, while the H1 promises "one axis"~~ — answered
  2026-09-22 by the phone "All ten, at a glance" figure rather than by
  un-hiding the Overlay (ten overlaid curves at 358px is a tangle). The
  Overlay tab stays desktop-only (journey-walk 2026-08-24, J-deferred #2).
- Calibrate tab has no chart in view (D8/M12) — carried.
