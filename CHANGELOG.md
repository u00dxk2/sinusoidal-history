# Changelog

## All ten cycles reach a phone's first screen (2026-09-22)

- **A phone reader now meets every cycle at once, not one at a time.** Yesterday's
  ship put the first curve on the first screen; the other nine still began about a
  screen and a half down, and the Overlay tab that draws all ten together is
  desktop-only (`hidden sm:inline-flex`), so a phone never reached it. `/` now opens
  with **"Every cycle, at a glance"**: ten 24px rows, one curve each, on the same
  time axis as the facets below, with a dashed line and a dot at 2026 and year
  labels under it. Curves fully inside a 390x664 first screen went **1 → 10**, each
  measured on its own selector (`node scripts/measure-fold.mjs
  https://sinusoidalhistory.com/ 390 664 '[data-overview-id="<id>"] svg'`), the last
  row clearing the fold with 72px to spare. Frames:
  `docs/frames/2026-09-22-home-390-before.png` (production before),
  `-390-after.png`, `-360x560-after.png`, `-1440-after.png`.
- **The honest extremes.** 6 of 10 rows at 360x560 and 5 of 10 at 320x568 — better
  than the 0 both showed before, and stated rather than gated. Desktop is untouched:
  the figure is `sm:hidden`, and at 640px and 1440x900 the page renders exactly what
  production renders.
- **The rows are a figure, not controls, and the copy now says so.** A 24px row
  cannot meet the 44px tap floor (canon R28), so the rows take no taps and the phone
  dek dropped "Tap a row to focus and calibrate." — it sat directly above ten rows
  that do nothing. The instruction moved to the caption under the figure, next to the
  facet cards that do take the tap, and it renders only on the Facets tab, since on
  Calibrate there is nothing "below".
- **What the words proof showed.** The rendered `main` innerText multiset against
  production, 390x664: 123 → 150 lines, the only differences being the shortened dek
  and the figure's own 28 lines. Nothing else on the page moved.
- **Adversarial review found four defects, all fixed before the commit.** Axis labels
  collided at ≤340px (including the default 320px view, which read "16001700") because
  the tick filter compared raw positions while the renderer clamped edge labels inward
  — the filter now runs greedily on placed positions; the caption claimed "each in
  detail below" on the Calibrate tab, where no facet renders; "All ten" was hard-coded
  against a derived row count; and every visible part of a row was `aria-hidden`, so
  explore-by-touch would have read nothing. The review also confirmed, by measurement,
  that each dot sits within 0.5px of its curve and each row's phase label matches the
  facet header's for the same cycle and year.

## The home page opens on the chart (2026-09-21)

- **A phone reader now meets a cycle curve on the first screen.** `/` opened with
  the hero, the whole "State of the cycles" panel and the editor's convergence
  note; the first curve began at 1381px on a 390x664 phone — 2.1 screens down —
  and at 1113px on a 1440x900 desktop, below the fold on both, on a page whose H1
  is "Ten cycles, one axis." The order inside `Viz` is now the tabs and facet
  charts, then the editor's note, then the time-range brush, then the panel.
  Curves fully inside the first screen went 0 → 1 at 390x664 and 0 → 2 at
  1440x900 (`node scripts/measure-fold.mjs https://sinusoidalhistory.com/ 390 664
  '[data-facet-id] svg[role="img"]'`: RED, cut 777px, before the deploy; OK, 500-560px,
  104px of room, after it). Frames: `docs/frames/2026-09-21-home-390.png` before,
  `-390-after.png`, `-1440-after.png`, `-360-after.png` built, `-390-after-prod.png`
  production. At 360x560 the first facet's header clears the fold and its curve
  does not — the honest extreme, stated rather than gated.

- **The note moved with the chart, not with the panel, and that is why no words
  changed.** Its text points at the brush ("Drag the time-range below"), so it sits
  between the curves it comments on and that brush. An earlier cut of this ship put
  it after the panel and changed "below" to "above"; the orchestrator's review named
  the premise error before the build, and the word change was reverted.

- **The proof that can see a client-rendered chart is not the one we reach for.**
  `check-rendered-text.mjs diff` reads GREEN on this change and is **blind** to it:
  the chart renders in the browser, so the static HTML it reads holds none of it —
  the reverted word change did not register in it either. What was verified is the
  line multiset of the page's rendered `main` innerText: 123 lines, 82 distinct,
  identical against production.

- **Moving the panel below the chart broke keyboard focus, and the ship fixes it.**
  Activating a summary row scrolled to the facet but left focus in the panel below
  it; focus now moves to that facet's header. Two adversarial-review passes found
  it — the second caught focus landing off-screen when re-picking the already-open
  cycle — and a three-case browser test (Facets tab, Calibrate tab, re-pick) reads
  RED on the pre-ship build and OK on production.

- **`scripts/measure-fold.mjs` takes an optional selector.** The no-argument call is
  unchanged in behaviour and output (`/cycles/dalio`: "OK: the verdict is fully
  visible, 44px of room to spare", identical to 2026-09-20). The fold question is now
  answerable on any surface, which is what this week's three fold defects on three
  different surfaces asked for.

## The index shows the ten cycles on a phone's first screen (2026-09-20)

- **`/cycles` now leads with the verdict sentence and then the entries themselves.**
  A cold arrival at 390x664 — the index a reader reaches when they do not already
  know which theory they want — showed the header, a nine-line paragraph on how the
  curves are drawn, and six lines of confidence-tag glossary, and **not one of the
  ten cycles**. An index whose index was entirely below the fold. The order under
  the H1 is now: the spectral verdict sentence with "How the test works →", the ten
  entries, then "Does any of them hold up?" with its table, then the how-they-are-drawn
  paragraph and the tag glossary. A 390x664 frame now shows the verdict sentence,
  the first entry's name and full description, and the second entry's name
  (`docs/frames/2026-09-20-cycles-390.png` before, `-390-after.png` after, both
  viewport-clipped so the fold is where a reader's screen ends; `-1440-after.png`
  and `-360-after.png` are the desktop and small-phone extremes).
  **No reader-facing words changed, and note how that was checked:**
  `check-rendered-text.mjs` compares visible text line-index by line-index, so on a
  re-order it reports RED and is right to — it is an order gate, not a content gate.
  What was verified is the line MULTISET: 216 lines and 166 distinct on both sides,
  identical, confirmed independently by the adversarial review.

- **This supersedes one sentence in the 2026-09-18 entry below.** That entry says the
  index "now opens with 'Does any of them hold up?'" — true when written, false now.
  The table did not leave the page; it moved below the roster, because its Verdict
  column sits off-screen at 390 (min-width 36rem), so leading with it would have
  refilled the fold with a horizontally-clipped table rather than with cycles.

- **Known cost, recorded rather than discovered later:** the confidence-tag glossary
  now sits below the entries, so a reader meets a tag up to ten times before its
  definition. That partially reverses journey-walk 2026-08-24 J8, whose finding was
  that the tags were defined nowhere. The fold defect is the worse of the two and the
  glossary section now carries `id="confidence-tags"` so an affordance can point at
  it; if a cold walk reports the tags reading as unexplained, that is the fix, not
  moving the glossary back above the roster. That question is now a dated row (`W-002`,
  read 2026-09-27) rather than a promise with no reader.

- **W-001's question changed, and its date did not** (`f4a72ba`). The waits gate asks
  whether a data-wait's denominator can fill by its own read date; at the measured ~2.7
  impressions/day it projects to ~68 by 2026-10-07 against a floor of 100, so it cannot.
  The remedy is re-point or convert, never re-date. Click-through stops being the row's
  question; the 10-07 read now asks whether the query set grew beyond the five
  Dalio-dominated rows and whether average position moved off ~21. CTR reopens as a
  fresh row only if position moves under 20. Yesterday pre-registered this for the day
  itself; today it is applied, because a wait already known to land short is not a wait.

## The verdict reaches a phone reader (2026-09-19)

- **On a phone, every cycle page now shows its "Does it hold up?" answer without
  scrolling** (`b6d23b9`, CI green, live and verified serving). A cold search
  arrival met the title, a three-item metadata list and a 280-character
  description before reaching the one answer that separates this site from a blog
  post about cycles. Measured at 390x664 — what an iPhone 14 in Safari actually
  shows — the answer sentence ended **17px below the fold**; it now ends **44px
  above** it. The 844px CSS viewport cleared it either way, which is exactly how
  this stayed invisible: the page looked fine on every desktop and in every
  full-page screenshot. The fix moves the Period / Reference peak / Paired data
  list out of the header and down against the curve that plots those values, where
  a reader wants it anyway. One component, so it applies to all ten cycle pages.
  **No reader-facing words changed, and that is measured:**
  `check-rendered-text.mjs` reports 86 lines before and 86 after, and a sorted
  comparison finds no differences — the same line set in a different order.

- **The check that found it is committed, with its red arm** (`d26a43f`).
  `scripts/measure-fold.mjs <url> [width] [height]` answers one question and can
  fail: exit 1 when the verdict is cut, 0 when it is whole. Red arm, against the
  live page: `360 560` → `RED: the verdict is cut — 177px below the fold`, exit 1.
  Green arm: `390 664` → `OK: the verdict is fully visible, 44px of room to
  spare`. Two frames are committed beside it
  (`docs/frames/2026-09-19-dalio-390-before.png` and `-after.png`), captured at
  390x664 and **clipped to the viewport rather than full-page**, so the fold is
  where a reader's screen ends — the before frame slices "— and that is the
  finding, not a dodge" in half. The 360x560 case is left red on purpose: a 560px
  visible viewport is shorter than this page's title plus description can clear,
  and shrinking either is a different decision from moving a metadata list.

- **W-001's clock moved to 2026-10-07, and its next disposition is pre-registered**
  (`000e2f3`, `90b39fe`). The 09-19 Search Console read returned `clicks=0
  impressions=19 position=21.0` — far under the row's own floor of 100, so Branch 0
  holds and the read is a sample-size check rather than a verdict. The arithmetic
  then contradicted the row's own assumption: 19 impressions over the seven days
  Search Console actually holds is **~2.7/day, not the ~4/day** recorded on 09-16,
  which projects the 10-07 read to ~68 impressions. Rather than discover that on
  the day and be tempted into a third extension, the row now says what happens
  instead: convert to the questions answerable at that sample size, and reopen
  click-through only if average position moves under 20.

## The verdicts reach the index, and the gate that proved it is committed (2026-09-18)

- **The `/cycles` index now shows every spectral verdict before the roster**
  (`ae830b5`, CI green, live on Render 16:15:12Z). The index listed ten theories
  with no sign that none of them clears the site's own evidence bar, so a reader
  who landed there instead of `/methods` chose what to read before seeing the
  verdict on any of it. It now opens with "Does any of them hold up?", carrying a
  count derived from the frozen `verdicts.json` — 0 of the 9 paired theories have
  a record long enough to check at their stated period — and the same nine-row
  table `/methods` has carried since `44557c1`, each row landing on that cycle
  page's `#does-it-hold-up` block. The table is now one component,
  `src/components/VerdictTable.tsx`, lifted out of `methods/page.tsx`, so the two
  pages cannot drift apart.
  **`/methods` did not change, and that is measured rather than assumed:** its
  production visible text, read before the change and again after the deploy, is
  identical at 223 lines, and the comparison is red-armed — changing one verdict
  cell in a copy (`+73` to `+74`) makes it name the differing line and exit 3.
  Six production frames are committed under `docs/frames/2026-09-18-*`: `/cycles`
  and `/methods` at 390 and 1440, plus a 390 frame scrolled to the verdict
  column. Each is cropped to the element whose rows the capture script counted —
  10 rows on every page at every width, 0 px of horizontal page scroll, every
  theory-name link pointing at `#does-it-hold-up`. At 390 the theory-name column
  stays pinned while the verdict columns scroll (`3e862db`).

- **The rendered-text gate is in the repo** (`e5c53c4`, CI green). Twice in two
  days a ship was proved safe by a visible-text diff that was rebuilt from
  scratch in a session scratchpad and lost at session end. It is now
  `scripts/check-rendered-text.mjs`:

  ```bash
  node scripts/check-rendered-text.mjs snap .next/server/app before.txt
  node scripts/check-rendered-text.mjs diff before.txt .next/server/app
  ```

  Exit 0 identical, exit 3 changed. A source is a URL, an `.html` file, a
  directory of them (`.next/server/app` after a build), or a snapshot written by
  `snap`. Visible text only: whitespace runs collapse as HTML's do, and CSS is
  out of scope because a framework bump rewrites the emitted bytes without
  changing a style (the per-build `@font-face` `url()` tokens of KP-004); layout
  belongs to frames. Its success signal is the red arm, per the orchestrator's
  ruling — `--selftest` reads `6 passed`, and with the comparison broken in a
  copy so it can never report a difference it reads `selftest: 2 FAILED`, exit 1.
  `src/lib/check-rendered-text.test.ts` spawns the selftest in CI, and
  `AGENTS.md` documents both commands.

Supporting work:

- `2205904` — today's report opener. FIRST ACTION names the day's build, with the
  guard it had to keep green run before starting (`npx vitest run
  src/lib/spectral.test.ts`, 2 passed at 15:31Z); W-001's Search Console read
  moves to a "Due, not today" line.
- `777ecef` — W-001's `waitingFor` corrected. The 2026-09-19 read has been an
  agent read since 2026-09-16 (`scripts/gsc-read.mjs`), but the row still
  labelled it as needing David. The optional Bing Webmaster Tools check is
  recorded as not-a-wait, with the condition that would re-raise it: a crawl read
  showing Bing sending referrals rather than only crawling.

## Nine verdicts on one table, and a dependency sweep to zero (2026-09-17)

- **`/methods` now shows every spectral verdict in one table** (`44557c1`,
  refined by `832f4d8`). The site's most arguable claim — that 0 of 9
  cycle-and-data pairings have a record long enough to test — was one number,
  with the nine verdicts behind it one per cycle page, so checking it meant
  opening nine pages. The Spectral testing section now opens with a row per
  pairing: cycle, stated period, the span of the record the verdict actually
  tests, periods covered of the required 3.0, years short, and the verdict.
  Seeing them together is the point — **Perez is 7 years short of testable,
  Dalio 73, Turchin 339.** Each row links to that cycle page's "Does it hold
  up?" block, which gained the `#does-it-hold-up` anchor it lands on; the
  tenth cycle, which has no paired series, is listed and marked rather than
  omitted. Every value is read from the frozen `verdicts.json`.
  `public/methods.md` mirrors the table with its rows generated from the data
  files, and `src/lib/spectral.test.ts` fails if the mirror drifts.
  The 390px frame read is what caught the one defect: the unpaired row's long
  italic sentence clipped at the table edge, shortened in `832f4d8`.
- **Every known dependency vulnerability closed, 46 → 0** (`a400821`,
  `7dadae1`). GitHub's alerts were switched on for this public repo the day
  before — new coverage, not new breakage. The same-range sweep (`npm audit
  fix` without `--force`, plus vitest to `^4.1.11`) took 46 to 30; the rest
  were one bump, Next.js 16.2.4 → 16.3.5, ruled on an exposure read rather
  than on severity labels. Both pins stay exact.
  **The gate that made it safe:** the visible text of all 20 prerendered pages
  plus the emitted CSS, diffed across builds on identical source, red-armed by
  mutating a hash and watching it fail. It read dirty on the framework bump
  until the per-build font-asset URL tokens were normalized away — 14
  `@font-face` URLs, same 743 rules, same 60,063 bytes, font content hashes
  unchanged. The production frames re-taken after the bump came out
  byte-identical to the ones taken before it.
  Also re-measured: the JSX whitespace hazard in `AGENTS.md` did not reproduce
  on 16.3.5 in the two cases probed. The note is kept, version-scoped, and the
  `{" "}` rule stands.

## Two front doors, and the site's first CI (2026-09-16)

First day on the daily rail. Two user-visible ships, both aimed at the same
gap: **the page a stranger lands on did not tell them what this is or whether
it holds up.**

- **`/methods` opens as a front door** (`6e41ff6`). It is the site's
  highest-impression page in search — 14 of 73 impressions in the
  2026-08-19→09-09 window — and its first screen went from the H1 straight
  into data-source entries. It now carries an "In brief" block (ten theories
  as sinusoids, a real series on nine of them, a link to the chart, and the
  spectral headline) plus an "On this page" list. Every count is derived from
  `cycles.json` / `series.json` / `verdicts.json`, so it cannot drift the way
  `SITE_DESCRIPTION`'s "Eight" did against ten.
- **Every cycle page answers "does it hold up?" above the curve** (`e7d8936`).
  The verdict used to sit four sections down, after the calibration and the
  extrema table. The new block states it in one line, gives the record against
  the 3.0-period floor, says how many more years of that measurement would
  reach it (73 for Dalio, 339 for Turchin), and — the line that keeps it
  honest — that **0 of the 9 pairings clear the floor**, so no single theorist
  is being marked down. Two defects caught by adversarial review before the
  commit: the shortfall was computed from a rounded field and overstated four
  pages by a year, and the chart's series name was attached to verdicts that
  run on different cuts (Kondratiev's unsmoothed annual TFP, Turchin's 1913+
  wealth).

Supporting work, all new to this repo:

- **CI** (`49a7658`) — `.github/workflows/ci.yml` runs lint, typecheck, test
  and build on every push and PR. Note: Render still deploys on every push
  **without waiting for CI**, so a red run can sit behind a live build.
- **A pre-commit secret scanner** (`f9f2d47`, `831d100`, `114fe20`) — the
  fleet scanner vendored byte-exact, armed by `npm install`, proven to block a
  staged AWS-shaped key. GitHub secret scanning and push protection were
  enabled on the repo the same day (`e3c97e7`).
- **The Search Console read became an agent command** (`7f1267d`, `07273cf`) —
  `scripts/gsc-read.mjs`, page-grouped so click totals are whole. It recorded
  this project's first non-brand queries: four of the five Search Console will
  disclose are Ray Dalio "big cycle" searches, all at positions 49–60.

## The search snippet, rewritten against the first Search Console read (2026-09-09)

The first GSC window on sinusoidalhistory.com came back **59 impressions,
0 clicks, average position 16, Queries tab "No data"** (orchestrator read of
David's screenshots, card ef5842ec). Indexing works; nobody clicks. At
position ~16 the only user-visible surface is the SERP snippet — the title
tag and the meta description — so that surface got the day.

Three defects, none of them visible from inside the app, which is how they
survived four fact-check rounds and a journey walk:

- **Six pages emitted the site name twice in the title.** The root layout sets
  `template: "%s · Sinusoidal History"`, and `/methods`, `/about`, `/colophon`,
  `/poster`, `/embed/docs` and `/embed` each spelled the suffix themselves —
  shipping `Methods · Sinusoidal History · Sinusoidal History`, live-verified.
  Now bare segments (`/embed` uses `title: { absolute }`, being an iframe doc).
- **The home page undercounted its own content.** `SITE_DESCRIPTION` opened
  "Eight historical cycle theories" while `cycles.json` has held ten since
  Phase 14 — and that string is the home snippet body *and* the OG description
  on every card.
- **Every per-cycle description wasted its first ~45 characters** repeating the
  cycle name already in the title, leaked a chart-legend qualifier (`Paired
  with Tech diffusion · site-derived`), and overran Google's ~155-character
  fold at 195. Descriptions now lead with the period, the reference peak and
  the paired series in prose form, and close on the frozen spectral state —
  "The paired record is too short to test the period" — because an honest
  negative is the one thing no competing result for these queries will say.

Two regression guards in `src/lib/siteConfig.test.ts`: the description's
leading number word must match `cycles.length`, and no `page.tsx` title may
contain the site name. The second one is what found three of the six
stuttering pages. Per-cycle *titles* were left alone deliberately — they
truncate at ~60 characters, but they truncate from the brand suffix inward,
which is the correct thing to lose.

## Turchin fathers-and-sons cycle renamed to carry its period (2026-08-29)

`Turchin — fathers-and-sons cycle` is now `Turchin (50y) — fathers-and-sons
cycle`. The text before the em dash is the byline that the State table,
the home summary panel, the OG card, and the cycle-page fallback all render
on its own, so the two Turchin cycles read as "Peter Turchin" and
"Turchin" — distinct, but not telling a reader which was the 150-year
secular cycle and which the 50-year one (journey-walk 2026-08-24 J15 had
already patched this on mobile with a period chip). The byline now says so
itself. `id` and URL (`/cycles/turchin-fathers-sons`) are unchanged; the
frozen `state-2026.csv` keeps the name as published, per its freeze
contract.

## First journey-walk: 19 reader-experience fixes (2026-08-24)

First cold walk of the whole reader journey since Phases 13–15 tripled
the surface — two zero-context cold readers (desktop 1280×800 + mobile
390×844 touch) over the primary flow, plus the 8 mechanical design
detectors over six pages. Findings and severity ranking:
`docs/journey-walk-2026-08-24.md`. Nineteen fixes shipped, all
below-the-fold copy/UX — no titles, metas, H1s, URLs, data, or spectral
outputs touched.

The headline: the site's one imperative instruction ("tap/click a row to
focus") rendered its entire result ~800–1,200px below the fold with no
viewport change, so both cold readers concluded the control was broken.
The focused facet now scrolls into view (reduced-motion aware) and the
year axis moves up to sit under it. Also fixed: `/poster` was a frozen
centre-crop on phones (scrolled in neither axis); `/embed/docs` laid out
at ~750px on a 390px phone (flex-item fit-content trap); axis end labels
clipped ("1600"→"600"); the "2000"/"now · 2026" label collision;
event-label pile-ups at 1280px (width-aware collision); the dead
"Overlay" nav label (now "Chart"); spectral verdicts now lead with the
plain-English paragraph before the multitaper figure; the confidence
tiers (narrative / quantitative / empirical · contested) are defined at
last; `/state` reading rows show their links; sub-44px tap targets on
cycle pages; the phase-bar key; mobile period chips; the brush caption;
the poster issue number.

Separately: this Next version's JSX compiler **eats the leading/trailing
space of multi-line text nodes** even beside inline elements — live
pages showed "the 2026reading", "estimationconventionally", "gate- none",
"dtfp_utilcolumn", "theamplitude_normalized". Site-wide sweep (31
junctions, 9 files) now renders every space explicitly; hazard
documented in AGENTS.md.

Deliberately not fixed (see the walk doc): duplicated `<title>` suffixes
on five pages (titles frozen through the 9/03 GSC window), the mobile
"one axis" promise (H1 frozen + design decision), the chartless
Calibrate tab, the all-on Overlay default, and the spectral figures'
micro-labels (frozen artifacts; ride the next re-freeze).

## Round-5 fact-check folded (2026-08-24)

Two external deep-research passes (Claude + OpenAI, same prompt) over
everything shipped since round 4. Verdict record:
`docs/fact-check-2026-08-24-round-5.md`. Copy-only fold; no period, CSV,
or spectral output changed, so the frozen manifest stands.

What was wrong: the Stimson provenance said the observed trough was
"shallower and later" than the model's 1985 trough — the CSV minimum is
1980, earlier and deeper; "Stimson built the index to test this kind of
long-wave claim" had no support and inverts his thermostatic reading;
"50 is the neutral reference point" was unsupported; Turchin's violence
database **is** posted (USPVD2010.xlsx) — the barrier is a missing
license, not a missing file; the 2012 paper itself projects the 50-year
sequence to ~2020 (as "a simple projection"); `/about` said two cycles
carry caveats when four do; the Goldstein label welded his 50-year
war/price wave onto his separate 150-year hegemony cycle; the excluded
list's own entry bar was one the roster doesn't pass; Berry is ~55y;
Schlesinger's midpoints and the 1962–1978 dating are project
constructions, not his statements, and his father's figure is 16.55
years; the reuse-packet "MIT … reuse freely" line implied data
relicensing. HATCH is now labelled an experimental, site-derived
composite with an ex-post (look-ahead) caveat and a blunter statement
that its post-1970 negativity is substantially construction; the
leading-economy series says "summed covered-country GDP" and no longer
implies its 1945 maximum validates Modelski. Modelski's rationale drops
two clauses neither engine could verify in the 1987 book and gains the
back-cast mismatch figures (+20/+11/+6/−11 years). INSUFFICIENT_DATA is
glossed as an eligibility outcome on cycle pages and /methods.

Declined: renaming the two series (names live in the frozen spectral
lay text). Deferred: a lifecycle-adjusted HATCH series and a World-
aggregate denominator (both change CSVs → manifest re-freeze).

## "Full page →" link in the focused facet (2026-08-24)

Clicking a cycle row on the overlay expands its facet with the rationale
and caveat — but that facet had no way through to `/cycles/<slug>`, the
page with the extrema, paired-series provenance, spectral verdict, and
reuse packet. The only in-chart route was a small link inside the
calibration drawer; otherwise it was nav → Cycles → find the row again.
One link, after the source line. Summary-panel rows stay as tap-to-focus
buttons on purpose.

Also: `docs/fact-check-prompt-round-5.md` — the self-contained external
fact-check prompt for everything shipped since round 4 (Schlesinger Jr.,
Modelski, Turchin fathers-and-sons, the Perez re-anchor + HATCH pairing,
the Stimson and leading-economy series, the excluded list). Verdicts
fold in on return.

## Reuse packets on cycle pages (2026-08-20)

Each `/cycles/<slug>` page now hands a reader everything needed to reuse
what it shows, without leaving the page: the paired CSV downloads instead
of rendering in-tab, the spectral figure downloads as **SVG or PNG** (the
PNG is rasterised client-side from the committed SVG at 2x), and a
**Copy attribution** block emits one credit line carrying the concept DOI,
the page URL, and the upstream series with its own license. Licensing is
stated plainly: figures and code MIT, data series under their upstream
terms. Verified end-to-end in a real browser — both downloads fire, no
page errors.

## Domain cutover — sinusoidalhistory.com (2026-08-20)

The site moved to its own domain: **sinusoidalhistory.com** (canonical;
`.org` and the legacy `sinusoidal-history.skylarkcreations.com` 301 to it
permanently — the crawler channel follows redirects, so old citations keep
resolving). Swept every hand-written absolute URL: `siteConfig.ts`,
`llms.txt`, the three markdown mirrors, README, `CITATION.cff`,
`scripts/inspect.mjs`. Deliberately untouched: `state-2026.source.md`
(frozen edition — frozen means frozen; its old URL redirects) and
historical changelog entries. Zenodo metadata picks up the new URL on the
next release, not retroactively.

## Prose pass — voice, clarity, and the longer stories (2026-08-19)

A once-over on /about, /methods, and /cycles in the project's own voice
(per the uncaged-minds style guide and AI-tells catalog): spaced short
dashes replace em dashes in prose, jargon glossed inline (asabiyyah,
immiseration, saeculum), stiff constructions rewritten. No factual claim
changed; cos-math audit re-run clean.

- **/cycles grew a disclosure block per cycle** ("The longer story"): ~100
  words on what each theory actually claims, who said it, and what our
  treatment does to it — plus a "Defined in" link to the primary text,
  every URL verified live 2026-08-19 (publisher pages, DOIs, archive.org
  for the out-of-print Schlesinger).
- `cycles.json` short descriptions sharpened (mechanisms named, jargon
  glossed); mirrored into about.md. Cycle `name` fields untouched — the
  em dash there is a load-bearing separator (six components split on it).
- /methods spectral section gained a plain-terms gloss of the test
  question for the glancing reader.

## Phase 15 — the spectral verdict (2026-08-19)

A pre-registered spectral test for every pairing, answering "does this
series contain significant power at the theory's exact stated period?" —
and, below the eligibility gate, refusing to answer. Built to the frozen
spec in `docs/specs/spectral-verdict-build-spec.md` (committed 2026-08-18,
before any results), from a two-engine research synthesis.

- **The headline is the finding: 0 of the 9 paired constructions reach the
  3.0-full-periods eligibility gate.** Best is Strauss-Howe/V-Dem at 2.81
  periods; worst is Turchin-secular/WID at 0.74. No pairing gets a p-value,
  by construction — the records are too short to test the claims at all.
- Protocol: harmonic regression at exactly 1/P (cos + sin + linear trend)
  vs the same model without the sinusoid, LRT, parametric-bootstrap p
  (99,999 draws) from a fitted AR(1) red-noise null, AR(2) sensitivity,
  Holm correction within pre-registered families, exact frequencies never
  scanned. Multitaper spectra (NW=2, K=3) are descriptive only.
- Everything frozen in `scripts/spectral/analysis-manifest.yaml` (alpha,
  gate, seed, draws, input-CSV sha256s, the 9 pairings, the 19-cell
  cross-grid family) and committed before results; the run aborts if the
  manifest, the CSVs, or `cycles.json` periods drift.
- A secondary cross-grid panel re-pairs each period with every series long
  enough to clear the gate (19 cells, labelled re-pairings, not the site's
  claims). Kondratiev-band results never distinguish 54y from 55y.
- Data prerequisites: `us_tfp_growth_annual.csv` (unsmoothed `dtfp_util`)
  is now the TFP inference series — the 5-yr rolled display CSV is banned
  from inference (the Kuznets/Adelman–Howrey moving-average trap); WID
  inference truncates to 1913+ (pre-1913 interpolations would fabricate
  power exactly in the 120–150y band).
- Selftest suite in the script: null-calibration KS at three phis, AR(2)
  leg calibration, signal-injection power, off-target rejection,
  smoothed-TFP ban, WID-1913 gate, no-p-below-gate enforcement, Holm hand
  recompute, byte-identical determinism.
- Surfaces: a "Spectral verdict" section (figure + lay verdict) on each
  paired cycle page; a "Spectral testing" section on /methods (+ mirror);
  `/data/spectral/verdicts.json` + per-cycle SVGs + provenance source.md;
  llms.txt and AGENTS.md updated. `/state` second-edition integration
  deliberately deferred — the frozen 2026 CSV is never retro-edited.

## Phase 14 — ten cycles, the excluded list, and the DOI (2026-08-18)

The roster's first expansion since Schlesinger (Phase 10), driven by a
two-engine research census (docs in skylark-site's research library) with
every printable claim re-verified against primary texts before shipping.

- **Modelski — long cycle of world leadership** (plotted 110y = midpoint of
  his stated 100–120 range; anchor 1945, his Table 2.1 US world-power phase
  start; Table 2.2 dates US oceanic supremacy from 1944). Paired with a new
  series: the **leading economy's share of world GDP** (Maddison 2023,
  CC BY), built by a deliberately mechanical largest-economy rule whose
  divergences are printed (Qing China leads 1870–1881, not Britain).
- **Turchin — fathers-and-sons cycle** (50y; "peaks around 1870, 1920, and
  1970" in his own JPR 2012 words; next model peak 2020, deliberately
  coinciding with his secular cycle's). Unpaired: the natural series has no
  redistributable file, and we don't pair construct-mismatched proxies.
- **Perez finally has a paired series**: a HATCH 2.0 technology-diffusion
  composite (Zenodo, CC BY 4.0; median z-scored 5-yr log-changes across
  ~105 US technologies, 1865–2023, per-year N published). Transform fixed
  a priori; the honest result — no local peak at 2000 — is stated on the
  methods page and in the association note. Her 2000 anchor is relabeled
  the financial-frenzy peak / end of Installation everywhere.
- **"Considered and excluded" published on /cycles**: Goldstein (his own
  "self-proclaimed dead-end" verdict on fixed periodicity, pp. 99/111),
  Arrighi, Sornette, Toynbee/Spengler et al., Namenwirth/Weber (Mohler 1987
  failed replication + Thome & Rahlf 1996 filtering critique), Forrester,
  Berry — plus a queued note for Klingberg (theory passes, data licensing
  doesn't yet).
- **Kondratiev gains a periodicity caveat** (Metz's withdrawal, Solomou,
  contested spectral detections).
- v1.1.0 released and archived on Zenodo: concept DOI 10.5281/zenodo.21998618,
  folded into CITATION.cff, README, and /state.
- OWID now 403s the default Python user-agent; both Maddison build scripts
  send an explicit UA.

Counts everywhere: ten cycles, nine paired series (fathers-and-sons is the
one unpaired). Cos-math audit re-run over the new rationales; both new
data series have committed build scripts and provenance files.

## Phase 13 — the annual reading + the v1 API (2026-08-18)

Two citability surfaces, both pure derivation — no new historical claims, no
new prose that could drift from the math.

- **`/state/<year>`** — the annual reading, starting at `/state/2026`: for
  each cycle, where the cosine sits that year (signed cos value + the chart's
  own phase label) and the next peak and trough the construction implies,
  with a suggested-citation block. A dated permalink meant for journalists
  and bloggers; the falsifiability angle is that each "next peak" is on the
  record and checkable when the year arrives. Years derive themselves as the
  clock advances (`dynamicParams` + a request-time year bound), so there is
  no annual editorial chore; the home masthead links to it as "annual
  permalink," the footer as "State 2026."
- **`/api/v1/cycles`, `/api/v1/series`, `/api/v1/state?year=`** — the
  canonical JSONs served live (previously repo-only; llms.txt pointed at
  GitHub) plus the one computed endpoint: every cycle's cos value, phase
  label, and next implied extrema at any year. All CORS-open, cached an
  hour. `src/lib/stateOfCycles.ts` holds the derivation, unit-tested against
  `sineAtYear` and the extrema the cycle pages already derive.
- Swept the hand-written surfaces per AGENTS.md: `llms.txt` gained the state
  page, an API section, and live-endpoint pointers on the two JSON bullets;
  sitemap gained `/state/2026`.

Context: this ships the no-research-dependency half of the 2026-08-18
next-level plan while three deep-research prompts (spectral methods, cycle
census, citability playbook) run externally. The spectral verdict, new
cycles, and any MCP server wait on those reports.

## Accessibility & mobile mechanics (2026-08-14)

A `/design-detectors` + `/usability-audit` pass over `/`, `/cycles`,
`/cycles/kondratiev` and `/methods` at 1440 and 390. The editorial design was
left alone; what it was sitting on was not.

- **The page scrolled sideways on a phone.** The nav forced `scrollWidth` 399
  against a 375 viewport, pushing "About" off the right edge. Header and nav
  now wrap.
- **`/methods` had been unreachable from the nav at every width.** The link
  carried `hidden xs:inline`, but `xs` is not a configured breakpoint in this
  project, so the variant never applied and only the `hidden` took effect.
- **Tap targets**: 32 controls under the 44px floor → 1 (an inline prose link).
- **Type floor**: 43 uses of `text-[10px]` and 6 of `text-[9px]` raised to
  11px, closing all 75 `undersized-ui-text` findings.
- **Focus was invisible** — no `:focus-visible` rules at all, and two
  components replaced the outline with a 30%-opacity ring. One global rule now.
- **Chart annotations** measured 4.48:1 against paper, under AA by a rounding
  margin; now 5.84:1 at 11px without competing with the curves.
- **Reading measure** on cycle/methods prose was ~94 chars (~128 for the mono
  citations); paragraphs are constrained, article widths untouched.

Detector findings 161 → 64. The 19 surviving `low-contrast` hits are a
confirmed false positive — the pixel sampler reads the chart curves behind the
SVG text. Full write-up, including the note for the detector's allowlist owner:
[`docs/design-canon-review-2026-08-14.md`](docs/design-canon-review-2026-08-14.md).

## Crawl read (2026-08-14)

`scripts/crawl-read.mjs` — the site's entire analytics stack, and it adds
nothing to the site. Render's HTTP request logs already record path and
user-agent for every hit, so "who is crawling us, and what are they
fetching?" was answerable server-side all along: no client script, no cookie,
no consent surface, no third party. Run it with `RENDER_API_KEY` set;
`--selfcheck` exercises the UA-classification and log-parsing logic offline.

First read (7 days, 2026-08-07 → 08-14): **zero Google hits of any kind**,
while GPTBot and OAI-SearchBot poll `/robots.txt` and `/sitemap.xml` daily
and GPTBot content-crawled the prose pages on 08-12 — the day before the
Phase 12 routes shipped, so it has not yet seen them. This is the first
evidence the project has had about who actually wants it, and it says the
working discovery channel is LLM crawlers, not search. It does not replace
Search Console: impressions, queries, and ranking remain unmeasurable.

## Phase 12 — static per-cycle routes (August 2026)

The eight cycles existed only as query-param states of `/` (`?focus=<id>`).
That meant the `reference_peak_rationale` prose — the most substantive
per-cycle text in the project, and the part that survived four fact-check
rounds — had no indexable home, and high-intent queries ("Kondratiev wave
chart," "Turchin secular cycle data") had nothing to rank.

- **`/cycles/<slug>` — eight prerendered routes.** Generated from
  `cycles.json` + `series.json` via `generateStaticParams`, with
  `dynamicParams = false` so unknown slugs 404 rather than render. Each page
  carries the cycle's period, reference peak, full calibration rationale,
  caveat where one exists, confidence classification, source citation, a
  static SVG of the curve, and the paired data series with source, license,
  CSV, and provenance links — plus a deep link back into the chart.
- **`/cycles` index.** All eight by ascending period; also the parent for the
  per-page breadcrumbs and the `DefinedTermSet` in the structured data.
- **Hyphenated slugs.** Cycle ids use underscores (`strauss_howe`) but search
  engines don't treat underscores as word separators, so URLs are hyphenated
  (`/cycles/strauss-howe`). `findCycleBySlug` resolves either form.
- **Per-cycle OG cards** via `/og?cycle=<id>`, reusing the existing route. The
  sinusoid is embedded as a data-URI SVG, which Satori renders reliably;
  inline SVG children are not dependable there.
- **JSON-LD per page:** WebPage + BreadcrumbList + DefinedTerm, plus a Dataset
  node (license, creator, CSV `DataDownload`, `variableMeasured`) for the
  paired series, so the underlying data is discoverable as data.
- **Crawl surfaces swept:** sitemap covers the index + all eight; `llms.txt`
  gains a per-cycle section; `Cycles` added to the primary nav and the cycle
  names on `/about` now link through (with `public/about.md` updated in the
  same commit, per the mirror rule in AGENTS.md).

No new historical claims were authored. All prose is reused verbatim from
`cycles.json`. The peak/trough years each page lists are *derived* from
`reference_peak_year` + `period_years` by the same cosine the chart draws —
`peakYearsInRange` / `troughYearsInRange` are unit-tested against
`sineAtYear`, and spot-agree with `scripts/audit_cycle_rationales.py`
(Strauss-Howe: peaks 1955 and 2039, trough 1997). This is deliberate: the
round-4 finding was that hand-written year-phase claims drift from the math,
so these pages compute rather than assert.

Also deduped `confidenceTag` out of `Poster.tsx` into a shared
`confidenceLabel`.

## Phase 11 — round-4 fact-check verdicts (April 2026)

External round-4 fact-check (`docs/fact-check-2026-04-26-round-4.md`) found
seven items. All folded in:

- **Strauss-Howe "2020 = trough" was mathematically false.** With period 84
  and peak 1955 the trough is at 1997 (1955 + 42), not 2020; at year 2020
  the cosine evaluates to ≈ +0.15 (rising arm). The /about prose, the
  about.md mirror, and `cycles.json[strauss_howe].reference_peak_rationale`
  all stated 2020 was a trough — a claim the chart itself contradicted.
  Rewritten to say 2020 sits on the rising arm, neither at a trough nor a
  peak; trough at 1997, next peak at 2039. This was the highest-risk
  embarrassment: any reader doing arithmetic catches it in under a minute.
- **Pearson "linearity" reasoning was wrong.** The /methods Linearity bullet
  conflated linearity-of-variable-in-time with Pearson's actual assumption
  (linearity of the relationship between paired variables). Replaced with a
  Phase-sensitivity bullet: for two sinusoids of the same period, Pearson
  r reduces to cos(Δφ) — r = 1 with itself, r = 0 at a quarter-period shift,
  r = −1 at a half-period shift. The calibration slider primarily moves r
  by changing Δφ.
- **TFP display range disagreed between methods prose and CSV.** `/methods`
  said the displayed series starts ~1950, but `us_tfp_growth.csv` actually
  starts at 1948. The build script keeps clipped (asymmetric) windows at
  the boundaries: 1948 = mean of {1948, 1949, 1950}, 1949 = mean of
  {1948, 1949, 1950, 1951}. Methods now admits this and labels the first
  two displayed points as edge artifacts; series.json `short_description`
  also corrected.
- **Maddison forward-fill bias surfaced explicitly.** The build script
  forward-fills each country's GDP between sparse benchmark observations
  but does not back-fill; many non-Western countries enter Maddison only at
  1950, biasing US share of world GDP upward for 1870–1949. New caveat in
  /methods, in methods.md, and in `us_world_gdp_share.source.md`.
- **Dalio cycle-and-anchor mismatch acknowledged.** The 1950 anchor comes
  from Bridgewater's ~250-year empire-score chart while the 75-year period
  is Dalio's long-term debt cycle — different constructs. Forces a second
  peak at ~2025 that Dalio does not assert. Sharpened in
  `cycles.json[dalio]` and the about.md mirror.
- **WID source field stopped conflating Saez–Zucman with pre-1913 splice.**
  `series.json[wid_top1_wealth].source` now distinguishes "1913–present
  from Saez & Zucman (2016) / DINA" from the pre-1913 decadal points,
  which are WID interpolations sourced from earlier US wealth-distribution
  literature. Methods page mirrored.
- **Project Mars 2010 = 0 explained.** Year 2010 registers zero because no
  qualifying conventional war was active; UCDP/COW/PRIO show substantial
  conflict deaths that year. New one-paragraph note in /methods, methods.md,
  and `conflict_deaths.source.md`.
- **Turchin parenthetical "(≈1780 → 1930 → 2080)" was misleading.** Caught
  by an internal cos-math sweep run on every cycle's rationale after Finding
  1, before commit. With peak 2020 + period 150, our sinusoid's prior peak
  is at 1870, not 1930; the years 1780/1930/2080 all evaluate to cos ≈
  −0.81 (near trough), not peaks. The Civil War (1860) is the climax our
  sinusoid roughly matches at cos ≈ +0.91. Replaced the parenthetical with
  the actual sinusoid-vs-Turchin alignment, including the explicit note
  that Turchin's stated climaxes (1780s, 1860s, 2020s) have non-uniform
  gaps (~80y and ~160y) — so a strict 150-year sinusoid is a forced
  reduction. Same kind of error as Finding 1 (prose claiming a chart
  position the chart doesn't actually plot), one tier lower in stakes.
- Last-updated footers on /about, /methods, /colophon and their markdown
  mirrors all current at 2026-04-26 (no bump needed; same day as Phase 10).
- Audit archive: `docs/fact-check-2026-04-26-round-4.md` added.

The round-4 agent verified the bibliographic, license, and upstream-citation
layers as clean against upstream sources; no new findings there.

## Phase 10 — Schlesinger Jr. cycle added (April 2026)

After the original release, Mark suggested adding Arthur Schlesinger Jr.'s
~30-year liberal/conservative cycle. Added as an eighth cycle, with paired
data series.

- `src/data/cycles.json` — new `schlesinger_jr` entry. Period 30y, reference
  peak 1970 (midpoint of Schlesinger's most recently completed liberal era,
  1962–1978). Source: *The Cycles of American History* (1986). Color
  `#6B4423` (warm sienna). Confidence tier `narrative`. Caveat surfaces the
  selection-effect problem inline: Schlesinger's own 1990 forecast does not
  match a strict 30-year-from-1970 sinusoid.
- Pairing: Stimson Policy Mood index (1952–2024, annual). Direct empirical
  analogue to Schlesinger's public-purpose vs. private-interest claim;
  Stimson built the series in part to test exactly this kind of long-wave
  mood claim. New: `public/data/stimson_policy_mood.csv`,
  `public/data/stimson_policy_mood.source.md`,
  `scripts/build_stimson_policy_mood.py` (reproducible Stimson rebuild,
  pulls `Mood5224.xlsx` from his UNC site and extracts the annual columns).
  License caveat: freely shared by the author, no explicit reuse license.
- `src/data/series.json` — new `stimson_policy_mood` entry, color `#9C6B3D`.
- `src/data/annotations.json` — `schlesinger_jr` added to four events:
  `1929_crash` (conservative→liberal turn at Hoover→FDR), `wwii_end`
  (liberal→conservative turn into Eisenhower era), `1968` (midpoint of his
  most recent liberal era), `nixon_shock` (inside the late-liberal window).
- Prose sweep: every "seven" → "eight" reference across home, /about,
  /methods, /colophon, the markdown mirrors, llms.txt, OG card standfirst,
  poster standfirst and footer roll-call, README, CITATION.cff, LICENSE,
  DEPLOY.md OG-card smoke check. Author roll-call lists insert Schlesinger
  Jr. between Huntington and Perez (chronological by publication).
- Dropped the "No additional cycles — seven is the cap" non-goal in README.
- New methods.md note explaining the Stimson pairing's 1952 coverage limit
  and why the Schlesinger curve's pre-1952 shape cannot be stress-tested.
- New about.md sentence in "Why every cycle peaks near now" explicitly
  flagging that Schlesinger's own 1990 forecast does not match the
  30-year-from-1970 sinusoid — calling this out as a textbook selection
  effect rather than hiding it.
- Cycle order in `cycles.json`: inserted between `huntington` and `perez`,
  i.e. roughly chronological-by-publication (Khaldun 1377, Kondratiev 1925,
  Huntington 1981, Schlesinger Jr. 1986, Perez 2002, Turchin 2009/2016,
  Dalio 2021, Strauss-Howe 1997).
- Cleanup: `llms.txt` "post-fact-check Phase 7" → reflects current state.
- Citation: `CITATION.cff` version bumped to 1.1.0, date 2026-04-26.
- "Last updated" footers on /about, /methods, /colophon and their markdown
  mirrors all bumped to 2026-04-26.

## Phase 9 — public-release prep (April 2026)

- Added `LICENSE` (MIT for code; data files retain their upstream licenses
  per `src/data/series.json`).
- Added `CITATION.cff` for clean academic citation via GitHub's "Cite this
  repository" widget.
- Rewrote `README.md` to reflect the post-fact-check state and the audit
  trail.
- Added per-page "Last updated" footers to `/about`, `/methods`, and
  `/colophon`.

## Phase 8 — machine-readability (April 2026)

- **Caught and fixed a domain-name typo** in `metadataBase`, `robots.ts`,
  `sitemap.ts`, and `embed/docs`: `sinusoidalhistory.skylarkcreations.com`
  (no hyphen) → `sinusoidal-history.skylarkcreations.com` (with hyphen).
  Without this fix, `sitemap.xml` and the OG canonical URL pointed at a
  domain that didn't resolve, breaking SEO and embed-snippet samples.
- `/llms.txt` index of all content for LLM crawlers (emerging convention).
- `/about.md`, `/methods.md`, `/colophon.md` plain-markdown mirrors of the
  prose pages, served with `text/markdown` content type and CORS open.
- Sitemap extended to include `/colophon` (was missing) plus the four new
  markdown surfaces.
- CORS headers on `/data/*` (CSVs and `.source.md` provenance) for
  cross-origin fetches by external agents and notebooks.

## Phase 7.2 — residual cleanup + self-contained round-3 prompt (April 2026)

- Round-3 fact-check agent stopped per the prompt's hard-halt instruction:
  its fetcher refused our subdomain and the GitHub repo as un-indexed.
- Caught three residual prose inconsistencies while building a paste-anywhere
  round-3 prompt:
  - `/about` and `/colophon` still said "publication bias" — the round-2
    fix had only landed in `ConvergenceNote`. Both now say "selection
    effect."
  - `/methods` and `series.json` still cited the `dtfp` column for the TFP
    series; the actual rebuild used `dtfp_util`. Both now correct.
- `docs/fact-check-prompt-round-3-self-contained.md` inlines all prose,
  JSON, CSV samples, and key code so a deep-research agent can run round 3
  without fetching our domain or repo.

## Phase 7.1 — TFP rebuild (April 2026)

- The local `us_tfp_growth.csv` was a 5-year centered rolling mean of the
  *raw* `dtfp` column; both `source.md` and `series.json` described it as
  "utilization-adjusted," which corresponds to a different column,
  `dtfp_util`. Rebuilt from `dtfp_util` to match documented intent.
- `scripts/build_us_tfp_growth.py` (reproducible Maddison-pattern build).
- `scripts/verify_tfp.py` (diagnostic that compares the local CSV against
  four candidate derivations and reports which one matches).

## Phase 7 — round-2 fact-check verdicts (April 2026)

Folded the round-2 deep-research report into the data and prose:

- WID license CC BY-NC-SA 4.0 → CC BY 4.0. Round 1 misread a stale badge;
  round 2 caught it. Verified against OWID's authoritative indicator
  metadata. Matters legally — CC BY-NC-SA forbids commercial reuse.
- Convergence note "publication bias" → "selection effect." Single most
  quotable error on the site; "publication bias" is a meta-analysis term
  of art. The phenomenon is presentism / survivorship.
- Dalio period 85y → 75y (Dalio's actual stated number). Reference peak
  rationale now includes the verbatim Ch. 5 quote.
- Turchin period 150y now explicitly qualified as the US-compressed cycle
  from *Ages of Discord*; pre-industrial agrarian cycles run 200–300y.
- Khaldun stage 2 "tyranny" → "concentration of power" (Rosenthal's actual
  translation; "tyranny" is a popular-summary label).
- Voteview citation 2025 → 2026. Maddison citation expanded to the JoES
  2024 published form with DOI.
- Methods page: "Pearson tests don't apply" → "are anti-conservative";
  Pearson-cosine identity now qualified "over a full period";
  Lomb-Scargle scoped to unevenly sampled records; `amplitude_normalized
  = 1.0` disclosure added.
- conflict_deaths.source.md now discloses OWID's even-distribution
  methodology for multi-year wars.

## Phase 6 — round-1 fact-check verdicts + Maddison rebuild (April 2026)

- Strauss-Howe re-anchor from 2008 (Crisis onset) to 1955 (post-WWII High
  peak). The Fourth Turning is a crisis trough, not a peak; treating 2008
  as a peak inverted the model.
- Dalio peak 1945 → 1950 to match Dalio's own statement in Ch. 5 that US
  power peaked "in the 1950s." Note added that the paired GDP-share data
  peaks at 1945 (war-production driven), so cycle and data deliberately
  differ by ~5 years.
- Perez confidence "quantitative" → "empirical-contested" — her work is
  qualitative Schumpeterian periodization.
- Huntington peak 1965 → 1968 (interval midpoint of his "S&S Years
  1960–1975"). Period range "60 years" softened to "~60–70 years."
- Khaldun anchor rationale rewritten to make the project's editorial
  choice explicit: he died in 1406; he didn't anchor European events.
- Kondratiev citation expanded to include the Russian original (1925) and
  the 1935 English abridgment in *Review of Economic Statistics*.
- **Maddison data-pipeline rebuild.** Two compounding bugs fixed:
  - Regional-aggregate filter mismatch: filter list used names like
    "Western Europe" but OWID's export uses "Western Europe (Maddison)"
    with the suffix. The aggregates were never excluded; on benchmark
    years where Maddison publishes the rollups, world sum was roughly
    doubled, halving US share. (Cause of the obvious decade-boundary
    holes at 1900, 1950, 1980, etc.)
  - Sparse-coverage benchmark years: many countries (China, USSR, much of
    Africa) appear in Maddison only at decade boundaries. Forward-fill
    added so each entity's most-recent observed GDP carries forward
    through subsequent years.
  - Net effect: 1945 peak revised from buggy 41.959% to 31.577% (closer
    to literature-cited PPP shares); 2022 share revised from 7.297% to
    14.937%. No remaining year-over-year deltas above 3pp.
  - Reproducible: `scripts/build_us_world_gdp_share.py`.
- WID and V-Dem source attributions updated to reflect retrieval-via-OWID;
  TFP citation tightened to Fernald (2014) WP 2012-19.
- About-page motivation clauses rewritten to remove unsourced
  psychologizing and attribute anchor choices to the project rather than
  the theorists. The Khaldun "anchored a European Enlightenment collapse"
  sentence in particular was logically impossible (he died in 1406).
- Archived round-1 fact-check report at
  `docs/fact-check-2026-04-25.md`.

## Phase 5 — editorial design pass (April 2026)

- Added Fraunces variable serif (opsz / SOFT / WONK axes) alongside
  Geist; introduced `.font-display`, `.font-display-italic`, and
  paper/ink/rule editorial tokens.
- Redrew the cycle palette to manuscript-illumination jewel tones
  (oxblood, ink-blue, moss, aubergine, terracotta, antique gold,
  graphite); shifted data-series colors to avoid clashes.
- Site chrome: editorial nameplate with Skylark eyebrow + Fraunces
  wordmark.
- Hero: 12-col magazine layout, sine-wave glyph, "Seven cycles, one
  axis."
- State panel: broadsheet masthead, numbered byline rows, color rail,
  byline name truncation at em-dash.
- Brush: visible default selection rectangle, bracket handles, decade
  ticks, endpoint year labels.
- Poster: editorial broadside with two-line title, italic standfirst,
  numbered rows, italic colophon.
- OG card: matching masthead + standfirst structure (Georgia fallback;
  Fraunces bundling deferred).
- Convergence note: pull-quote with ink rule (`"publication bias"`
  call-out — later renamed to "selection effect" in Phase 7).
- Calibration drawer: tracked uppercase labels, Fraunces tabular slider
  values, Pearson r as colored display numeral, italic methodology
  footnote.
- Added `/colophon` page — a note from the maker, with the build-journal
  link and the AI-collaboration framing.

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
