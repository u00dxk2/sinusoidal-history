# Key user flows

The map for `/journey-walk` and flow critiques. Every screen and interstitial
a reader can hit in these flows belongs here; a screen that exists in the
product but not in this map is itself a finding. Created 2026-08-24 (first
journey-walk); update when a surface is added or a flow's steps change.

## 1. Primary — cold reader to cited/reused cycle (the flow this site exists for)

1. Land on `/` cold (organic / LLM-crawler referral / skylarkcreations.com link).
2. First viewport: masthead, H1, dek, "State of the cycles" summary panel.
3. Scroll: editor's note → tabs (Facets default; Overlay desktop-only;
   Calibrate) → ten facet charts → shared time axis → range brush →
   closing note (methods link + spectral-headline sentence).
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

- Mobile has no Overlay tab, while the H1 promises "one axis" — design
  decision pending (journey-walk 2026-08-24, J-deferred #2).
- Calibrate tab has no chart in view (D8/M12) — carried.
