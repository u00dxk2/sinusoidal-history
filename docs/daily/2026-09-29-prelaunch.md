# sinusoidal-cycles — 2026-09-29

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** each `/cycles/<slug>` page says, in words, where its curve puts this year. Item: **I-009** (new, minted at P3).
**The problem, as a reader has it:** "I searched 'Ray Dalio big cycle theory' and landed on this page. Where are we in the cycle *now*? The page gives me the period, the 1950 peak and a chart, but it never says it."

### Section 0

- Primer: `docs/cold-starts/2026-09-29.md` read. First action run: `check-calibrate-tab.mjs` on production **30/30 PASS** (13:2xZ).
- Listener: 🟢 SSE alive (SessionStart relaunch, hello 12:56:41Z, replay 0) + loop armed by `ScheduleWakeup`; waker ladder ranks 1-3 running.
- Codex: GREEN (the `[codex-probe:]` line on this kickoff, 13:03Z).
- CI: `check-ci-status --workflow ci.yml` → **GREEN** on c33a249 (full sha, local HEAD).
- Deployed drift: `check-deployed-sha-drift --service sinusoidal-history` → NOT-APPLICABLE-BY-REGISTRY (a commit-trigger service). Read directly from the Render deploys API instead: **c33a249 live** (finished 2026-09-28 18:52:11Z) = HEAD. No drift.
- Harness: running 2.1.284 · fleet UNIFORM (26/26) · installed 2.1.284 (SAME).
- Recs yesterday: both 2026-09-28 closes carried W-003, I-006 and I-008 to 2026-10-03, and W-001 to 2026-10-07. All four are still dated and none is due. Nothing was instructed that is missing from the tree.
- North star: product-love. This change gives the arriving searcher the answer to the question they came with. Nothing on this site can measure its effect on a reader (no client analytics, by standing choice), so it will be reported as unmeasured.

### Evidence

- OBSERVED: `node scripts/gsc-read.mjs --start 2026-09-01` (Search Console, page grouping, whole totals), 2026-09-01..09-29 with the usual ~3-day lag. **70 impressions, 0 clicks.** `/cycles/dalio` is the most-impressed page (12, avg position 43.7), then `/cycles/khaldun` (9, 7.1) and `/about` (8, 5.8). Per-cycle pages hold 34 of the 70 impressions listed (the page list is truncated at the route's row limit; the total is whole).
- OBSERVED: `gsc-demand-worklist --days 28` (2026-08-31..09-27). All 5 non-brand queries with impressions are Dalio queries except one: "ray dalio big cycle", "ray dalio big cycle theory", "ray dalio big cycles", "ray dalio the big cycle" (positions 49.5-60), plus "cycle of ten" (8.0). Query grouping drops anonymized rows, so these are a floor, not the whole set.
- OBSERVED: the rendered text of production `/cycles/dalio` (`check-rendered-text snap`, 87 lines, 2026-09-29). It gives the period, the 1950 reference peak, "Does it hold up?", the calibration rationale, and the extrema across 1600-2050. **No line states where the curve puts 2026.** A reader has to find 2025 in the peaks row and infer it. The same derivation is already published as `/state/2026` (`cycleStateAtYear`: cos, phase label, next peak, next trough), but no cycle page links to it or shows it.
- OBSERVED, a second defect on the same page: the paired-series description renders a literal backslash, "2011 PPP \$". Source: `src/data/series.json:54` and `:119` hold `\\$`, which decodes to `\$`. It affects `/cycles/dalio` and the Modelski page's series.
- HYPOTHESIS: a searcher arriving on a theory's name wants "where are we now" first. That is the question the site's title promises ("where the cycles stand"), and the one the page leaves to inference.
- MISSING: any real-user evidence. There are no client analytics. `check-cycle-rotation` → exit 0, "no product-love cycle picks this lane today". `docs/evangelism-bar.md` and `docs/evangelism-evidence.md` do not exist in this repo. Search Console measures who was *shown* the page, not what they did on it.

### Permission

This is this lane's own page template and data text, and its own call. No board card is open on it. The line is **derived, not authored**: it uses the same `cycleStateAtYear` as `/state/<year>`, so it cannot drift from the math (KP-001). The W-001 freeze (until 2026-10-07) covers titles, meta, H1 text and URLs. A body line is outside it, and so is the `series.json` description text. The spectral manifest pins CSV hashes and pairing periods, not description strings; I will re-verify that with `--selftest` before commit.

### Next action: improve

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-entry-folds.mjs --width 320 --height 568
```

That is the fold baseline for the 13 entry legs, 10 of which are cycle pages. Then add to `src/app/(app)/cycles/[id]/page.tsx` one derived line in the page's metadata list (beside Period / Reference peak / Paired data), for example "In 2026 · peaking (cos +1.00) · next trough 2063, next peak 2100". It comes from `cycleStateAtYear(cycle, year)`, is labelled as this construction's position (the page already says its extrema are "positions of this construction, not dates claimed by the theorist"), and links to `/state/<year>`. Fix `\\$` → `$` in `series.json` (2 rows) and in any mirror that carries the same text.

### Acceptance

On the local build (`next build` + `next start`) and again on production after deploy:
1. All 10 `/cycles/<slug>` pages show the year line, and its values equal `/api/v1/state?year=<year>` for that cycle (cos, phase, next peak, next trough), checked by a script over all 10.
2. `check-entry-folds` reads 13 of 13 at 320x568, 360x560 and 390x664, with every cycle leg at **8px spare or more**. If the line costs a leg its fold, it moves below the answer block instead of shipping above it.
3. No page renders `\$`: a rendered-text search over all 10 cycle pages finds 0.
4. `npm test` passes, `python scripts/audit_cycle_rationales.py` runs clean, and the rendered-text multiset of the other cycle-page lines is unchanged apart from the added line and the `$` fix.

### Delivery and encounter checks

- Delivery: Render deploy row for the new sha = live, then acceptance 1-3 on production.
- Encounter: blind at the reader level (no analytics). The nearest real read is Search Console. This is a body change on pages that are already indexed, so re-crawl is the precondition. The W-001 read on 2026-10-07 will show whether `/cycles/dalio`'s position on the Dalio queries moved (N is tiny: 6 impressions in 28 days). A reader-level encounter comes from W-003's cold walk on 2026-10-03, if it lands on a cycle page.

### USER-FACING: yes

Paths: `src/app/(app)/cycles/[id]/page.tsx`, `src/data/series.json`, possibly `public/data/<slug>.source.md` or `public/llms.txt` if they carry the `\$` text, plus `continuity/items.json` and this report, which are internal. No prose page changes, so the prose-mirror rule does not trigger unless the `\$` sweep finds text in `public/*.md`.

<!-- findings:begin -->
**P3 findings, 2026-09-29.** (1) The manager's redirect replaced the packet's form: a body-type sentence right after "Does it hold up?", not a mono metadata cell. (2) Its HYPOTHESIS held. The route was a plain prerender (`dynamicParams = false`, no `revalidate`), so a build-time year would have frozen. The fix does both things the review offered: `revalidate = 86400` (production `cache-control: s-maxage=86400`), and a sentence that names its own year. (3) **Placement cost, measured.** The sentence starts 780-874px down at 390x664 on 9 of 10 pages (549px on fathers-and-sons), so it is NOT on a phone's first screen. Putting it above the verdict would break `/cycles/turchin`'s 12px fold at 320x568. So the encounter question "answered without scrolling?" should expect *after one scroll*, and W-003's new fifth question asks for the scroll distance rather than a yes/no. (4) Codex's first review found a real hole in my own check: it passed a flipped crossing direction, a peak "in 1900" and a trough "in 9999". The check now rebuilds the whole sentence from the API's raw fields, with 7 red arms. Codex's second finding (one stale ISR response at a year boundary) was rejected: that response still names the year it computed.
<!-- findings:end -->

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none**. Read from `dated gates due today` (0) and this morning's `check-due-gates-dispositioned --snapshot` ("0 gate(s) due on/before 2026-09-29").
- (b) Owed child rows in the orchestrator's ledger: **none**. Read from `rows owed to you` (0 of 729).
- (c) State reads marked CROSSED: **none**. Of the kickoff's reads, none printed a crossed threshold. `missingLinkedCommits` read NOTHING SWEPT (0 of 0), `stale-actionable` read 0 of 4, and HEAD CI (UNKNOWN at compose on a gh timeout) re-read GREEN live.
- Noted for the helper, not a ledger row: `docs/key-user-flows.md:81` still lists "Calibrate tab has no chart in view (D8/M12) — carried". `cdc1e4c` fixed that on 2026-09-28. (Struck in `07c96d3` at P3.)

## P3 — Product-work loop

[P3 — Product-work loop]

**Action (improve):** every `/cycles/<slug>` page now says, in one body-type sentence right after "Does it hold up?", where its curve puts this year, and links to `/state/<year>`. Shipped as `07c96d3` (I-009, now monitoring). Also in `07c96d3`: the literal "2011 PPP \$" on the Dalio and Modelski pages is gone.

On `/cycles/dalio` the sentence reads: *"By this page's curve, 2026 sits at a peak (the curve tops out in 2025; cos +1.00). The next low falls around 2063. That is a position of this construction, not the theorist's forecast. Every cycle in 2026 →"*

**The four states**

1. **Implementation.** `07c96d3` on `main`. `verify-with-receipt -- npm test`: 16 files, 124 tests pass (receipt tree = the committed tree). `npm run typecheck` and eslint on the touched files are clean. CI `ci.yml` is **GREEN** on 07c96d3 (`check-ci-status --wait`, 52s). `audit_cycle_rationales.py` ran; no rationale prose changed. Codex adversarial review ran twice, both with `Target: working tree diff`. Run 1 returned needs-attention with 2 findings. Checker false-pass: fixed before the commit (exact-sentence match, `--selftest` 7/7). ISR stale-at-rollover: rejected (the sentence names its year). Run 2: **approve**, no material findings.
2. **Delivery.** Render deploy `07c96d3` **live** at 2026-09-29 14:09:17Z (Render deploys API; `check-deployed-sha-drift` is NOT-APPLICABLE-BY-REGISTRY for this commit-trigger service). The surface on production after the deploy:
   - `scripts/check-year-position.mjs`: **31/31**. All 10 sentences equal `/api/v1/state` word for word, all link `/state/2026`, and no page shows `\$`. The same check read **0/10** on production before the deploy (the red arm).
   - `check-entry-folds`: 13 of 13 at 320x568, 360x560 and 390x664. Every cycle leg has 12px spare or more, identical to this morning's baseline.
   - `/cycles/dalio` returns `cache-control: s-maxage=86400`, so the daily revalidate is live.
   - Line multiset of the 10 cycle pages, `/state/2026` and `/`, local build against pre-deploy production: +1 line per cycle page, the `\$` line swapped on 2 pages, and nothing else moved.
3. **Encounter:** blind. The site has no client analytics, by standing choice, so a reader who lands on a cycle page leaves no trace. The encounter read is W-003's cold walk on 2026-10-03, which now carries a fifth question: open `/cycles/dalio` at 390 wide as a Dalio searcher, say where the cycle is now, and how far you scrolled. Search Console's W-001 read on 2026-10-07 is the ranking read, with N tiny (6 Dalio impressions in 28 days).
4. **Outcome:** open. There is no read yet.

USER-VISIBLE: each /cycles/<slug> page now says in one sentence where its curve puts this year (e.g. Dalio: "2026 sits at a peak (the curve tops out in 2025; cos +1.00). The next low falls around 2063"), linked to /state/2026; and the Dalio and Modelski pages no longer show "2011 PPP \$" — 07c96d3 [proof: check-year-position 0/10 → 31/31 on production after Render deploy live 2026-09-29 14:09:17Z, each sentence equal to /api/v1/state; check-entry-folds 13/13 at 320x568, 360x560, 390x664 with spare unchanged] [coverage: none — no client analytics by standing choice · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader who lands on a cycle page leaves no trace · bug row W-003]

mechanism-verified: `node scripts/check-year-position.mjs` (production, after the deploy) → `31/31 PASS`; `Invoke-WebRequest -Method Head https://sinusoidalhistory.com/cycles/dalio` → `cache-control: s-maxage=86400, stale-while-revalidate=31449600`

codexCalls: 2 (adversarial reviews; probe GREEN 13:03Z)
adversarialReviews: 2 — EXECUTED (Target: working tree diff, both runs)
hygiene helper: DISPATCHED 13:4xZ · draft PRESENT (the lane's gitignored hygiene-draft file for 2026-09-29; its content is summarised here). inputs none; wait-justification PASS (4 of 12); engineering-zero PASS (0 findings); READ-MUTATED none.
[standing-rules-hash: 88cc2dc9]

**What remains:** W-003's walk (2026-10-03) is I-009's encounter read, and W-001's Search Console read (2026-10-07) is its ranking read. Nothing else is owed on this outcome today.

## Close

ACTION: COMPLETED · item I-009 · P3 0e05a1fb

**What shipped, in plain words:** every cycle page says in one sentence where its curve puts 2026, linked to the year's reading. On a phone the sentence is one scroll down, not on the first screen.

**Changed since the P3 post:**
- The manager review (b83128a5) read the action as COMPLETED against the redirect's acceptance. It re-read `/cycles/dalio` on production itself (sentence word for word, `s-maxage=86400`, 0 `\$`) and found no defects.
- Freeze scope, as the review suggested: W-001's freeze covers titles, meta, H1s and URLs, and `series.json` descriptions are outside it (`cycleMetaDescription` never reads `short_description`).

**Ledger delta (all through `continuity-edit`):**
- I-009's notes gained the dated pending read and the expected result. On 2026-10-03, W-003's walk opens `/cycles/dalio` at 390 wide and records whether "where are we now" is found and how far the reader scrolled. The sentence was measured below the first screen (780-874px at 390x664), so "found after one scroll" is the expected result, not a regression. The freeze-scope clause went in too.
- I-009 gained a `waitJustification` (until 2026-10-03, owner this lane). It cleared the one INFO line that minting the row had raised: `check-wait-justification` → `RESULT: PASS — 5 of 13 row(s) carry waitJustification; 0 warn / 0 info`.

**Hygiene draft:** 1 draft line (`none — no inputs`), accepted. READ-MUTATED: `none — 0 reads guarded`. Engineering-zero (helper): `RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable`. Wait-justification was re-run at close, above. Due gates: `check-due-gates-dispositioned` → `verdict: CLEAR`, snapshot CURRENT (taken 2026-09-29), 0 due.

**Pending reads:**
- 2026-10-03: W-003 cold phone walk. It is the encounter read for I-009 (the Dalio question, fifth), I-008 (the Calibrate drag) and I-007, and also I-006's date.
- 2026-10-07: W-001 Search Console read. It is I-009's ranking read (`/cycles/dalio` on the Dalio queries, from position 49.5-60; N = 6 impressions in 28 days). Titles, meta, H1s and URLs stay frozen until then.

**Receipt:** P3's receipt is still true; nothing new.

# Round 2

## P1 — Evidence and choice (round 2)

[P1 — Evidence and choice]

**Round 2, 2026-09-29.** Round 1 (I-009, `07c96d3`) is done and still holds on production: `check-year-position.mjs` read **31/31** at ~16:5xZ. I am not redoing it.

**Outcome:** each cycle page's curve marks where this year falls on it, so the picture gives the same answer as the round-1 sentence. Item: **I-009 follow-up** (the new row will be minted at P3, as I-009 was).
**The problem, as a reader has it:** "The sentence says 2026 is at a peak. But the one dot on the curve is at 1950. Is 1950 the peak it means? Where is now on this wave?"

### Evidence

- OBSERVED: the source of `CurveFigure` (`src/app/(app)/cycles/[id]/page.tsx:637-731`). It draws the sinusoid, century ticks and ONE marked point: a dashed line and dot at `reference_peak_year`. Nothing marks the current year. That holds on all 10 pages.
- OBSERVED: on `/cycles/dalio` the only marked point is **1950**, the reference peak (`cycles.json:81`). The round-1 sentence directly above it says 2026 "sits at a peak (the curve tops out in 2025)". So the text and the figure point at two different years, 75 years apart, and nothing on the figure is labelled "now". Dalio gets the most impressions of any page on the site (12 in 2026-09-01..09-29, the Search Console read from round 1 today, under 24h old). 5 of the 6 non-brand queries it gets impressions on are Dalio queries.
- OBSERVED: at 390x664 the sentence starts 780-874px down (549px on fathers-and-sons; `check-year-position`, today). The figure sits directly below it. So a reader who scrolls once for "where are we now" arrives at the sentence and the curve together.
- OBSERVED: fold baseline on production at 320x568 (`check-entry-folds`, today): 13 of 13; `/cycles/turchin` and `/` have the least room, 12px spare each. The figure is below the verdict, so a mark on it cannot cost a fold. Acceptance re-reads this anyway.
- HYPOTHESIS: a reader looks at the picture before the prose. A marked "2026" on the wave answers "where are we" faster than the sentence does, and it stops the 1950 dot from reading as "the peak".
- MISSING: any real-user evidence. The site has no client analytics (standing choice). `check-cycle-rotation` → exit 0 ("no product-love cycle picks this lane today"). `docs/evangelism-bar.md` and `docs/evangelism-evidence.md` do not exist here. W-003's cold walk on 2026-10-03 is the first reader-level read.

### Permission

The figure is this lane's own page template and derived data, so the call is the lane's. No board card is open on it (`answered-cards`: none). The W-001 freeze (until 2026-10-07) covers titles, meta, H1s and URLs, not the figure. The mark is derived from the same `sineAtYear` / `cycleStateAtYear` as the sentence (KP-001), so the figure cannot drift from the math. No spectral surface is touched.

### Next action: improve

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-year-position.mjs --selftest
```

Then extend that check with a failing arm: every cycle page's figure carries a current-year mark whose x is `year` and whose y equals the API's cos for that year. Then add the mark to `CurveFigure`: a point at `(x(year), y(sineAtYear(cycle, year)))` and a thin vertical rule. The "2026" label goes in HTML (the figcaption row or an overlay), because SVG text in a 900-wide viewBox shrinks to ~5px on a phone. The reference-peak dot stays but is told apart from it, for example by labelling the caption "Reference peak 1950 · 2026 marked". The aria-label gains a "this year" clause. The page already re-renders daily (`revalidate = 86400`), so the year stays current.

### Acceptance

On the local build, then on production after the deploy:
1. All 10 `/cycles/<slug>` figures carry the current-year mark. Its year equals `new Date().getUTCFullYear()`, and its plotted value equals `/api/v1/state` cos to 2dp. That is checked by the extended `check-year-position.mjs`, with a red arm that fails on production before the deploy.
2. The label is readable on a phone: it renders at 11px or larger at 390 wide (measured, not assumed), and it does not collide with the reference-peak marker where they are close (Strauss-Howe: ref 2020 vs 2026).
3. `check-entry-folds` reads 13 of 13 at 320x568, 360x560 and 390x664, with spare no lower than today's baseline.
4. `npm test` and `npm run typecheck` pass. Rendered-text multiset of the cycle pages: at most the caption and aria text change.

### Delivery and encounter checks

- Delivery: the Render deploy row for the new sha shows live, then acceptance 1-3 on production.
- Encounter: blind at the reader level (no analytics). W-003's walk on 2026-10-03 already opens `/cycles/dalio` at 390 wide and asks "where are we now, and how far did you scroll?". P3 adds "what did the marks on the curve tell you?" to it. N = 1 walker; the answer is readable at N = 1.

### USER-FACING: yes

Paths: `src/app/(app)/cycles/[id]/page.tsx` (`CurveFigure`), `scripts/check-year-position.mjs` (internal), possibly `src/lib/stateOfCycles.ts`, plus `continuity/items.json` and the daily report (internal). No prose page and no `public/*.md` mirror changes.

### HYGIENE INPUTS

Copied from this morning's kickoff reads (round 1). This round's kickoff carries no separate state block.
- (a) Due rows not bearing on the choice: **none**. Read from `check-due-gates-dispositioned` against the morning snapshot → "0 gate(s) were due at Phase 0", verdict CLEAR (re-read ~16:5xZ, no new snapshot taken).
- (b) Owed child rows: **none**. Read from the round-1 kickoff's `rows owed to you` (0 of 729).
- (c) CROSSED state reads: **none**. Read from the round-1 kickoff's reads; none crossed.

codexCalls: 0 (probe GREEN 13:03Z per this prompt; P1 needed no delegate)

## P3 — Product-work loop (round 2)

[P3 — Product-work loop]

**Round 2, 2026-09-29.** Action (improve): every `/cycles/<slug>` curve now marks this year, so the picture gives the same answer as the round-1 sentence. Shipped as `57cb111` (I-010, minted monitoring). The manager review (09c07da1) APPROVED it and its acceptance stood.

What a reader sees now: a thin ink rule at 2026, a filled dot on the wave in the cycle's colour, and **"now · 2026"** under it. This is the home chart's now-line look, as the review suggested. The reference peak is a hollow ring, and the caption carries a matching ring as its key. On `/cycles/dalio` the dot sits on the 2025 crest, and the 1950 ring no longer reads as "the peak".

On the review's two suggestions:
- (a) Reuse the home chart's now look: **done**.
- (b) A faint tick at the next turning point: **measured, and it does not fit**. Dalio's next low (2063) falls outside the figure's 1600-2050 window, so the mark cannot be drawn where the review pictured it.

**The four states**

1. **Implementation.**
   - `57cb111` on `main`. Paths: `src/app/(app)/cycles/[id]/page.tsx` (CurveFigure) and `scripts/check-year-position.mjs`.
   - `verify-with-receipt -- npm test`: 16 files, 124 tests pass (receipt names 57cb1110; the only later path is doc-shaped).
   - `npm run typecheck` and eslint on both files: clean.
   - CI `ci.yml` **GREEN** on 57cb111 (`check-ci-status --wait`, 54s).
   - Codex adversarial review ran twice, both with `Target: working tree diff`.
     - Run 1: needs-attention, 1 medium finding. On `/cycles/turchin` (peak 2020, now 2026) the now-dot covered the reference dot whole at phone width. The old SVG dot drew at a ~1.2px radius on a phone, so it was barely visible before this change either.
     - FIXED before commit, in 57cb111: the reference peak became a hollow HTML ring painted above the now-dot, and a hit-test leg was added. Its red arm (the now-dot repainted on top) reads `now` instead of `ref-peak`.
     - Run 2: **approve**, no material findings. Its one next step was to look at Turchin at 320 and 390 in both themes. Done, and both marks are distinct in all four frames.
   - Sibling sweep (SVG dots inside a scaled viewBox): 3 `<circle>` roots in `src`. CycleOverlay and CycleOverview draw at pixel size, and `og` is a fixed 1200x630 image, so there are **0** other hits.

2. **Delivery.** Render deploy `57cb111` is **live** at 2026-09-29 17:46:02Z (Render deploys API; `check-deployed-sha-drift` is NOT-APPLICABLE-BY-REGISTRY for this commit-trigger service, per daily-config). Production reads after the deploy:
   - `check-year-position.mjs`: **81/81**. On all 10 pages the dot, read back from pixels at 1280 wide, lands on `/api/v1/state`'s year (2026.0) and cos. The "now · 2026" label is 11px and on screen at 390 and 320. The reference ring is hit-tested visible beside the now-dot at 390 and 320, including Turchin at 4-5px apart.
   - The same check read **31/61** on production before the deploy: 0 now-marks on all 10 pages.
   - `check-entry-folds`: 13 of 13 at 320x568 on production, spare identical to this morning's baseline. On the local build it was also 13 of 13 at 360x560 and 390x664, spare unchanged.
   - Rendered-text line multiset, local build against pre-deploy production: **+1 line per cycle page ("now · 2026"), nothing else moved**, on all 10.
   - Figure caption height is unchanged at 320, 360 and 390 on all 10 pages. The caption's wrap at 320 is on production already.

3. **Encounter:** blind. The site has no client analytics, by standing choice, so a reader leaves no trace. The encounter read is W-003's cold walk on 2026-10-03, which now carries a **sixth question** (I-010): at 390 wide on `/cycles/dalio`, what do the curve's two marks show?

4. **Outcome:** open. No read yet.

USER-VISIBLE: every /cycles/<slug> curve now marks this year — a filled dot on the wave labelled "now · 2026" (on Dalio, sitting on the 2025 crest instead of the one 1950 dot being the only mark), with the reference peak as a keyed hollow ring — 57cb111 [proof: check-year-position 31/61 → 81/81 on production after Render deploy live 2026-09-29 17:46:02Z; the dot read back from pixels equals /api/v1/state year and cos on all 10 pages; check-entry-folds 13/13 at 320x568 with spare unchanged] [coverage: none — no client analytics by standing choice · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader who views a cycle page leaves no trace · bug row W-003]

mechanism-verified: `node scripts/check-year-position.mjs` (production, after the deploy) → `81/81 PASS`

codexCalls: 2 (adversarial reviews; probe GREEN 13:03Z)
adversarialReviews: 2 — EXECUTED (Target: working tree diff, both runs; run 1's finding FIXED in 57cb111; run 2 approve)
hygiene helper: DISPATCHED ~17:04Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-09-29-r2.md PRESENT. Inputs: none. wait-justification PASS (5 of 13; I-010, minted after it ran, carries its own waitJustification). engineering-zero PASS (0 findings). READ-MUTATED: none.
Ledger (all through `continuity-edit`):
- I-010 minted as monitoring, with a waitJustification until 2026-10-03.
- W-003: onTrigger gained its sixth question, and notes record that 57cb111 changed a surface it reads.
[standing-rules-hash: 88cc2dc9]

**What remains:** W-003's walk on 2026-10-03 is I-010's encounter read (and I-009's, I-008's, I-007's). Nothing else is owed on this outcome today.

<!-- findings:begin -->
**Round-2 P3 findings, 2026-09-29.** (1) The review's next-turning-point tick was measured against the figure and does not fit: Dalio's next low (2063) falls outside the 1600-2050 window, so it was not built. (2) The review was right that the period/peak list sits between the sentence and the figure, not the figure directly under the sentence; the plan was unchanged. (3) The P1 packet named Strauss-Howe as the collision case. The real one is **Turchin** (reference peak 2020): 9px apart at 1280 wide, 4-5px on a phone. Codex found it, and the fix is in 57cb111. (4) Before this change, the reference-peak dot drew at ~1.2px radius on a phone, so the page's only curve mark was barely visible there. Making it an HTML ring fixed that too.
<!-- findings:end -->

## Close (round 2)

ACTION: COMPLETED · item I-010 · P3 b2ab77da

**What shipped, in plain words:** each cycle page's curve marks this year ("now · 2026", a filled dot on the wave). The reference peak is a keyed hollow ring. On the Dalio page the picture and the sentence now point at the same year.

**Changed since the P3 post:**
- The manager review (63affe9b) read the action as COMPLETED, with 0 defects.
- Acceptance 3 is now read on PRODUCTION at all three sizes. `check-entry-folds` read 13/13 at 360x560 (/ 4px, /cycles/turchin 12px) and at 390x664 (/ 72px); P3 had already read 13/13 at 320x568. Spare is identical to the local build.
- CORRECTION: the P1 packet named Strauss-Howe (reference peak 2020) as the collision case. Strauss-Howe's peak is 1955 (cycles.json:93). The 2020 case is **Turchin** (cycles.json:69), and that is the case that was tested and fixed in 57cb111.

**Ledger delta (all through `continuity-edit`):**
- I-010 notes gained the dated pending read. On 2026-10-03, W-003's walk answers its sixth question at 390 wide on /cycles/dalio: "what do the curve's two marks show?". The correction and the production fold reads went in too. The row stays **monitoring**.
- I-010 was minted at P3, after the helper had run, so `check-wait-justification` was re-run: `RESULT: PASS — 6 of 14 row(s) carry waitJustification; 0 warn / 0 info`.

hygiene draft: 1 line — 1 accepted · 0 amended · 0 rejected (`none — no inputs`). READ-MUTATED: `none — 0 reads guarded (no --run executed)`. The helper's checks: wait-justification `RESULT: PASS — 5 of 13` (re-run above after the mint: 6 of 14), and engineering-zero `RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable`.
Due gates: `check-due-gates-dispositioned` → `verdict: CLEAR — every gate due at Phase 0 was dispositioned.`, snapshot CURRENT (taken 2026-09-29), 0 due.

**Receipt:** P3's receipt is still true; nothing new.

**Pending reads:**
- 2026-10-03: W-003 cold phone walk. It is the encounter read for I-010 (sixth question), I-009 (fifth), I-008 and I-007, and also I-006's date.
- 2026-10-07: W-001 Search Console read (I-009's ranking read). Titles, meta, H1s and URLs stay frozen until then.

UNRESOLVED: none.
Primer: `docs/cold-starts/2026-09-30.md`. Its banner already carries round 2 (65b7cb6, 1,405 chars), and three non-obvious notes were added below it at close.
Today panel: updated (`update-daily-brief --phase P5 --date 2026-09-29`, ok).

codexCalls: 0 (P5 needed none; the round's 2 adversarial reviews are counted at P3, b2ab77da)
[standing-rules-hash: 88cc2dc9]
