# Journey-walk + design-detectors — 2026-08-24

**Scope.** First cold walk of the reader's journey since Phases 13–15 tripled the
surface. Primary flow: land on `/` cold → understand what this is → focus a
cycle → reach `/cycles/<slug>` → cite/reuse or download. Walked twice on live
production (desktop 1280×800 and mobile 390×844 touch-emulated, both by cold
readers with zero project context), plus `/design-detectors` (8 mechanical
floors, both viewports) against `/`, `/cycles`, `/cycles/schlesinger-jr`,
`/cycles/modelski`, `/state/2026`, `/methods`. Screenshot evidence in the
session scratchpad (`walk-desktop/`, `walk-mobile/`, 100+ frames); this doc
carries the findings.

## BLUF

The substance is excellent and the delivery order hides it. Both cold readers
understood the premise within seconds, rated the focused facet and the cycle
pages as the best-executed screens on the site, and found every reuse path
(CSV, provenance, figure SVG/PNG, copy-attribution, DOI) working. What broke
the journey was one structural habit — **"the answer is one screen down"** —
whose worst case is the site's central promised interaction: *"Tap/Click a row
to focus one cycle"* produces its entire result ~800–1,200 px below the fold
with zero in-viewport acknowledgement, so on both form factors the site's one
imperative instruction reads as a **broken control**. Mobile adds real
mechanical breakage on the edges of the journey: `/poster` renders a frozen
1200 px centre-crop that scrolls in neither direction, `/embed/docs` lays out
at ~750 px in a 390 px viewport, and the shared time axis misprints its end
labels everywhere.

A second, independent find: **this Next version's JSX compiler eats the leading
space of any text node that spans multiple source lines**, even when the space
sits on the same line as the preceding inline element or `{expression}`.
Live-verified: "the 2026readings stays", "estimationconventionally",
"gate- none", "dtfp_utilcolumn". This is a content-trust bug on the site's
most careful prose surfaces, now swept site-wide (see AGENTS.md note).

Console: **zero JS errors on every page, both viewports** (one benign duplicate-
header warning from the host). No layout shift. Mobile horizontal overflow:
clean everywhere except `/poster` and `/embed/docs` (both fixed below) — the
8/14 mobile-mechanics fixes held.

## The gauntlet (the pattern, not the nits)

**"The answer is one screen down."** At six different scales, the thing that
makes the current screen intelligible exists, is well written, and sits just
past the point of need: the year axis below all ten facet panels; the focus
result ~1,200 px below the click; the plain-English spectral gloss below the
hardest figure on the site; the phase-bar key only on `/poster`; the
confidence taxonomy defined nowhere; the site's headline result ("0 of the 9
paired constructions reach the gate") at ~4,900 px into `/methods` and absent
from the primary journey. Reinforced by unsignposted interactivity: primary
targets report `cursor: default`, `/cycles` entries have no hover state, and
the tap-to-focus hint is `hidden sm:block` — invisible on the form factor
that most needs it (the mobile dek does carry "Tap a row…", but the panel
itself never says so).

## Ranked findings

Severity × effort; D=desktop walk, M=mobile walk, DET=detector. Canon rules
cited where a mechanical floor applies.

| # | Sev | Eff | Sources | Finding | Status |
|---|---|---|---|---|---|
| J1 | **HIGH** | S | D2, M1, M6 | **Focus click/tap reads as broken.** Result renders ~786 px (mobile) / ~1,200 px (desktop) below the fold; no scroll, no selected state; discovery took the desktop reader 4 attempts, and the mobile reader concluded "this list isn't interactive." | **fixed** — instant scroll to the focused facet, asserted twice (layout keeps settling after the commit — a single scroll, smooth or instant, landed ~700 px short; live-verified at facetTop=12 on mobile tap, mobile deep-link, and desktop click) |
| J2 | **HIGH** | S | M3 | **`/poster` unusable on phones**: 1200 px fixed-width poster centre-cropped in a 390 px body, scrolls in *neither* axis (flex-centering makes left overflow unreachable). Only DOWNLOAD PNG worked. | **fixed** — horizontal pan restored via scroll wrapper |
| J3 | **HIGH** | S–M | D3, D10, M4 | **The one shared time axis is below all ten facets and misprints**: "1600" clips to "600" (centre-anchored at x=0), "2050" clips; on mobile "2000" and "now · 2026" collide into "2000·202". A focused cycle's expanded chart has no axis at all. | **fixed** — end-tick anchors clamped, now-label collision dropped, and the shared axis now renders directly beneath the focused facet |
| J4 | **HIGH** | S | D1, M2 | **Nav's first item "OVERLAY" is a dead link** (`href="/"`, home defaults to Facets — clicking it from home does literally nothing), and it names a tab that is `display:none` on mobile. | **fixed** — renamed "Chart"; full mobile-overlay question deferred (below) |
| J5 | **HIGH** | S | D15 + sweep | **Compiler-eaten spaces in fact-checked prose** ("2026reading", "estimationconventionally", "gate- none", "dtfp_utilcolumn"): this Next's JSX strips the leading space of multi-line text nodes. | **fixed** — site-wide sweep (Codex), explicit `{" "}` at every affected junction; hazard documented in AGENTS.md |
| J6 | MED | S | D5, M9 | **Jargon before gloss on the spectral verdict**: "INSUFFICIENT DATA — NO TEST POSSIBLE · 1.4 OF 3.0 REQUIRED PERIODS" and the multitaper figure land before the excellent plain-English paragraph. | **fixed** — plain-English verdict + eligibility gloss now precede the figure |
| J7 | MED | S | D4 | **The site's headline finding is invisible in the journey** — home never mentions the spectral test; the reframing sentence sits at p.5 of `/methods`. | **fixed** — one sentence + anchor link added to the home closing note |
| J8 | MED | S | D6 | **Confidence taxonomy (Narrative / Quantitative / Empirical · contested) used as a masthead on every cycle page and never defined anywhere.** | **fixed** — one-line gloss on `/cycles` and per-tier sentence on cycle pages |
| J9 | MED | S | M7 | **`/embed/docs` lays out at ~750 px on a 390 px phone** — prose clipped mid-sentence, copy-paste snippets uncopyable. Root cause: page div is a direct flex item of `<body class="flex flex-col">`; `mx-auto` suppresses stretch → fit-content width. | **fixed** — `w-full` on the container |
| J10 | MED | S | D13, M8 | **`/state/2026` (the citable permalink) has a 10-row table where no row links anywhere**, and on mobile the phase column chops mid-word ("PHA/RIS/FAI") with the name column scrolling away. | **fixed** — names link to `/cycles/<slug>`; name column sticky in the mobile scroller |
| J11 | MED | S | D11, M11 | **`/cycles` entries are full-block links with no visible link affordance** (no hover state, no underline; the non-navigating "Longer story" disclosure IS styled as interactive). | **fixed** — hover/focus underline on entry titles |
| J12 | MED | S | M5 | **"show historical events" is armed by default on mobile where event labels never render** (annotation labels are desktop-only) — a control that does nothing. | **fixed** — checkbox hidden on mobile |
| J13 | MED | S | M10, DET R28 | **14 sub-44 px tap targets on cycle pages** (CSV ↓ 46×16, breadcrumbs 62×14, footer links) — the 8/14 min-h-11 pass missed this page. | **fixed** — same `min-h-11` pattern applied |
| J14 | MED | S | D9 | **Historical-event labels collide into gibberish at 1280 px** ("1848Civil War", "WWII endNixon…GFC") — collision check used a fixed 38 px gap against ~60 px labels. | **fixed** — width-aware gap; crowded labels now drop (the component's documented intent) |
| J15 | LOW-MED | S | M13 | **Mobile home never shows any period/peak numbers**, and "06 Peter Turchin" vs "10 Turchin" are indistinguishable four rows apart. | **fixed** — mobile-only period chip ("150y") on summary rows |
| J16 | LOW | S | D7 | The phase mini-bar in every summary row is **unlabelled on `/`** (its trough·peak·trough key exists only on `/poster`). | **fixed** — microcopy key added beside the desktop hint |
| J17 | LOW | S | D17 | The brush strip's grey composite curve is **unlabelled** — nothing says what it is. | **fixed** — one-line caption (mean of all ten curves) |
| J18 | LOW | S | M14 | Desktop verbs on touch: row aria-labels say "click to focus", the editor's note says "click any cycle". | **fixed** — device-neutral "select" |
| J19 | LOW | S | D14 | Issue-number contradiction: home masthead derives "No. 10" from the cycle count; `/poster` hardcodes "No. 01". | **fixed** — poster derives from `cycles.length` (OG card left alone, see below) |

### Detector results (rule-cited)

112 findings across 12 runs, **no new class** on the three new surfaces:

- `low-contrast` ×19, `/` only — the **confirmed false positive** documented
  2026-08-14 (pixel-sampling through chart strokes behind SVG text; real
  composited ratio 5.84:1). No action; still flagged for the allowlist owner.
- `line-length` ×88 (88–96 chars vs 80 target) — the class the 8/14 review
  deliberately accepted on non-`<p>` elements; the new surfaces show the same
  container widths. A few 101–109-char outliers on `/cycles` and cycle pages
  are the long mono source-citation lines; accepted with the class. Canon R5.
- `tiny-text` ×5 ("11px body text") — at the 11 px floor the 8/14 review set;
  accepted survivors. Canon R30.
- Mobile viewport: **zero** detector findings — the 8/14 F1–F3 fixes held.

## Deliberately not fixed (and why)

1. **Duplicated `<title>` suffix on 5 pages** ("Poster · Sinusoidal History ·
   Sinusoidal History" — page titles repeat the root template suffix; M15).
   Titles are **frozen through the GSC indexing window** (read lands 9/03) per
   this session's hard guardrail. Queue for after the window: drop the manual
   suffix from `/poster`, `/methods`, `/embed/docs`, `/about`, `/colophon`
   page metadata and let the root template do it.
2. **The mobile "one axis" promise (M2's full scope).** The H1 says "Ten
   cycles, one axis"; the Overlay tab is desktop-only. H1s are frozen this
   window, and whether to ship a mobile-usable overlay (or reword the promise)
   is a design decision for David — 19 overlapping lines at 390 px was
   presumably why it was hidden. The nav rename (J4) removes the worst
   signpost to the missing tab.
3. **Calibrate tab shows no chart** (D8, M12) — you calibrate blind, and its
   caption differs from the focused facet's. Real, but a layout/design
   decision (embedding a live curve in that tab), not a copy fix. Carried.
4. **Overlay tab defaults to all 10 cycles + 9 series on** (D12) — ~19 lines,
   visually unreadable until manually thinned. Needs a curated default-on
   subset; that's an editorial choice, carried for David.
5. **Spectral figure micro-labels unreadable on mobile** (M9's figure half) —
   the SVGs are frozen committed artifacts of the manifested spectral run;
   regenerating with larger fonts means re-freezing the verdict. Queued to
   ride along with the already-deferred lifecycle-adjusted HATCH re-freeze.
6. **OG card still says "No. 01"** — OG images are cached by scrapers and
   sit adjacent to frozen metadata; not worth churn mid-indexing-window.
   Fix with item 1 after 9/03.
7. **`/poster` has no site nav** (D16) — deliberate print-artifact framing;
   the "← back to interactive" exit is the design.
8. **"The longer story" collapsed by default on `/cycles`** (D18) — editorial
   restraint; the walker himself called the prose excellent once opened.
   Leaving the reveal as a choice.
9. **line-length / tiny-text detector survivors** — accepted classes per the
   8/14 review; chasing them means restructuring layout containers for a few
   characters.

## Map = territory

`docs/key-user-flows.md` did not exist (the walked flow was invisible to any
critique rotation). Created this session with the primary flow + the two
secondary flows (cite/reuse, embed). Keep it honest when surfaces change.

## Verification

Shipped as `e0b8422` + `48d494f` + `75e5212`; every push gated on
`npx tsc --noEmit` + `npm run lint` + 79/79 `npm test`, plus
`python scripts/audit_cycle_rationales.py` (no year+position prose claims
added — the home spectral sentence mirrors the /methods count claim
verbatim) and a local `npm run build`. Prose mirrors untouched: no
`/about`/`/methods`/`/colophon` prose *content* changed — only whitespace
rendering and non-mirrored UI copy.

Live post-deploy checks (production, Playwright + curl):

- Focus scroll lands at facetTop=12 on mobile tap, mobile `?focus=` deep
  link, and desktop click; the year axis renders directly under the
  expanded facet. (The first attempt — `scrollIntoView`, then instant —
  landed ~700 px short because layout above the facet settles after the
  effect; instrumented live, fixed with a manual scroll asserted twice.)
- `/poster` pans horizontally on a phone and shows "No. 10 · A reckoning".
- `/embed/docs` scrollWidth = clientWidth = 390.
- "the 2026 reading", "estimation conventionally", "gate - none",
  "dtfp_util column" all render with their spaces.
- Axis end labels anchored (`1600` start / `2050` end), zero overlapping
  annotation-label pairs at 1280 px (was a 5-label pile-up).
- Nav "Chart", home spectral sentence, `/cycles` taxonomy line, cycle-page
  gloss + verdict reorder, state-table underlines + sticky column, gauge
  key, brush caption: all present in production HTML/DOM.
- Detector re-run on `/` + `/cycles/kondratiev`: no new true class. The
  low-contrast FP class now also samples the mobile axis tick labels
  (previously clipped, now rendered and pixel-sampled at the same ~5.8:1
  real ratio) — same opacity-stack FP shape, noted for the allowlist
  owner. The new gauge-key/brush-caption microcopy sits at the accepted
  11 px floor and the two new home paragraphs join the accepted
  line-length class.
