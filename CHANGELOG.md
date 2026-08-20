# Changelog

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
