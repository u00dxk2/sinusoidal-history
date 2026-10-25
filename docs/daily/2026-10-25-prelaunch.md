# sinusoidal-cycles — 2026-10-25 (Sunday, MT) — day round 1

## BLUF

[P1 — Evidence and choice]

Today's one user problem is I-066: on a phone the zoom strip sits 2,152px below the chart it zooms (measured on production at 390x664), so a reader who drags it never sees the chart change. The planned change moves the Range block (presets, strip, status line) to directly under the ten-row overview figure. A reader can then see every row and the strip on one 390x664 screen. Proof is a measured distance on production and one pre-registered cold walker.

## Recommendation

### P1 selection packet

**Section 0**
- Primer: no `docs/cold-starts/2026-10-25.md`; read `docs/cold-starts/2026-10-24.md` (newest). Its first action, run after this morning's zod ship: `check-deployed-sha-drift --service sinusoidal-history` → "sinusoidal-history in-sync live 5b9b9161 → head 5b9b9161 live commit IS the branch head" (exit 0). 5b9b916 descends from 98e9b55.
- Listener: 🟢 SSE alive (pid 41980, hello 16:15:02Z; `read-listener-strand` SLUG MATCH) + loop armed by `ScheduleWakeup` (the Stop hook owns the cadence); waker ladder ranks 1-3 running (rank 1 fired once, loop-death, relaunched).
- Codex: GREEN per the kickoff's `[codex-probe: …]` line (machine-level exec+write, 16:09:27Z). 0 calls at P1.
- CI: `check-ci-status --repo-dir C:/dev/skylark/sinusoidal-cycles --workflow ci.yml` → GREEN on 5b9b91619f (1 success, 0 failures, 0 pending).
- Harness: running 2.1.310 · fleet UNIFORM (27 of 27 panes) · installed 2.1.310 (SAME).
- Recs yesterday: `docs/daily/2026-10-24-prelaunch.md` has a `## Recommendation` block that holds only the 10-24 P1 packet (I-064, executed: CLOSED at P3, bf359ead). Its walk residuals were minted at the close: I-066 → **today's choice** (orchestrator pulled it forward from 10-27); I-067, I-068 → carrying to 10-27; the "floor not stated before a drag" residual was dismissed with a reason.
- North Star: retention + word-of-mouth. The bar reads UNMEASURED (`docs/evangelism-bar.md` `metricReady: false`; no client analytics by standing choice, W-003). This ship will be reported as unmeasured.
- Product-love rotation: `check-cycle-rotation --lane sinusoidal-cycles` → exit 0, "no product-love cycle picks this lane today". Normal P3.
- David's word: `answered-cards --project sinusoidal-cycles` → no waiting/answered/pending-verify cards.
- Due gates: `check-due-gates-dispositioned --snapshot` → "0 gate(s) due on/before 2026-10-25" (74 ledger rows swept).
- Earlier today, outside the rail: fleet zod advisory GHSA-mrhx-c7xc-m3w5 fixed in-range, zod 4.3.6 → 4.6.7, 5b9b916 (bus 9efabc52; CI green, live).

**Outcome:** I-066, the zoom strip sits next to the chart it zooms.

**The user problem, in the user's words** (cold walkers on production, 390x664, touch): "never saw the chart itself, because it is about 2,400px above the strip"; "You can't see the effect of a drag. You have to trust the readout … or scroll up about four screens." (`docs/walks/2026-10-24-i064.md`, `docs/walks/2026-10-22-i062.md:38`).

**Evidence:**
- OBSERVED (production 5b9b9161, ~16:25Z, headless Chromium, isMobile+hasTouch, DSF 2, scratchpad `measure-i066b.mjs`, absolute page y): at 390x664 the overview figure is 328–682 (rows 352–592), the Range block 2989–3196, the strip 3095–3173. **The gap from the figure to the strip is 2,413px, and 2,152px from the first facet curve (883–943).** 360x560: figure 292–664, strip 3120–3198. 320x568: figure 292–664, strip 3295–3373. Limits: one load per size, no scroll or interaction, and Chromium only (iOS Safari not measured).
- OBSERVED (same read, 1440x900): the strip is at 2815–2893, 2,165px below the first facet curve (566–650). So the distance is not only a phone problem. Desktop is outside I-066's closeWhen, but the move must not break it.
- OBSERVED (source, `src/components/Viz.tsx:150-252` at 5b9b916): DOM order is CycleOverview (phone only) → Tabs (ten facet rows) → ConvergenceNote → TimeRangeBrush → NowSummaryPanel. The strip comes after all ten facets by construction. Both the overview and the facets follow the brush range (`startYear`/`endYear` props).
- OBSERVED (arithmetic on the boxes above, a HYPOTHESIS until built): moving the Range block (207px at 390, 256px at 320, where the presets wrap) to sit 20px under the figure puts the strip at ~808–886 at 390. First row top to strip bottom is then 352→886 = 534px, which fits 664. 360x560: 316→868 = 552px, fits 560 with 8px spare. **320x568: 316→916 = 600px, which does NOT fit 568**: about rows 2-10 plus the strip fit, and row 1 sits above the screen. Declared ceiling, to be measured, not assumed.
- OBSERVED (source, `src/components/ConvergenceNote.tsx:24-25`): the editor's note says "Drag the time-range below". After the move the strip is above it, so the sentence goes false, and it must change in the same commit. The same paragraph carries one of I-065's lines ("draws each cycle as one period"), which also gets fixed when that sentence is edited.
- OBSERVED (`scripts/check-entry-folds.mjs:36-37`): the home entry-fold leg needs `[data-overview-id="turchin_fathers_sons"] svg` (the overview's last row) on the first screen. Moving the block BELOW the figure leaves that leg untouched. Facets move down ~227px, and no entry leg reads them.
- HYPOTHESIS: a reader who drags the strip while the figure is on the same screen can say what changed in the chart without scrolling. Not walked.
- MISSING: any real-user read of the strip (W-003, no tracking will be added); iOS Safari layout.
- Prior-day retro finding that bears on this (10-24 Q2, still on discipline): I ran the local build → `next start` → checker → stop-by-PID loop five times myself. Today the measurement is one script per state (before on production, after on a local build, after on production). The cold walk is a helper, one at a time.

**Permission:** I-066 status open, owner sinusoidal-cycles, P3, no park, freeze or card. This is a layout move of an existing control plus one sentence of the editor's note. The note's correction-first shape (I-055) and the strip's sentences (I-062/I-064) do not change. No board card needed.

**Next action — improve.** P3 sequence:
1. Red first: extend `scripts/check-brush-widened.mjs` (or a sibling `check-strip-near-chart.mjs`) with a leg that measures, at each phone size, the first overview row's top and the strip's bottom (absolute y), and passes when the span fits the viewport height. It fails on production today (534px will be the target; today's span is 352→3173 = 2,821px). A 320x568 ceiling is declared in the leg, not hidden: rows 2-10 + strip, or whatever the build measures.
2. Build: in `Viz.tsx` render `<TimeRangeBrush>` right after the phone `CycleOverview` block (before `<Tabs>`), at every width. On desktop that puts the strip above the tab list and chart, a control directly over the curves it frames. Rewrite the editor's note sentence to name no direction ("Drag the time range or select any cycle …") and drop its "as one period" wording (I-065). Update the stale comments (`TimeRangeBrush.tsx:16-17` "~2,800px up"; `Viz.tsx:137-145`, "the brush it points at"). The pins in `convergenceShape.test.ts` move with the note.
3. Regression: `check-brush-widened --preset-return` PASS at 390x664 and 320x568; `check-entry-folds` 13 of 13; `measure-fold` desktop 1440x900, first curve still on screen; the rendered `main` innerText line MULTISET identical apart from the one note sentence (a re-order is RED on the line-index gate by design, AGENTS.md).
4. Codex read-only review (foreground pipe, `--sandbox read-only`, banner workdir checked) + a claims pass on the new note sentence.
5. After deploy: drift in-sync, the new leg + regression checkers on production, then one fresh cold walker at 390x664 on production, with prompt and bar written to `docs/walks/2026-10-25-i066.md` BEFORE the walk.

First command:

```
node C:/Users/david/AppData/Local/Temp/claude/C--dev-skylark-sinusoidal-cycles/71995389-5fa1-4149-9301-5d2f0b66a4ff/scratchpad/measure-i066b.mjs https://sinusoidalhistory.com
```

(the scratchpad read above; P3's first committed step promotes it into the checker leg in step 1)

**Acceptance (observable):** on production at 390x664, the first overview row's top and the strip's bottom fit inside 664px (measured, expected ~534px; today 2,821px), and the same at 360x560. 320x568 is reported as measured against its declared ceiling. `check-brush-widened` and `check-entry-folds` still PASS. Desktop 1440x900's first curve is still on the first screen. The editor's note no longer says "below". One pre-registered cold walker at 390x664 drags the strip without scrolling and can say what the chart's rows did. If the walker cannot, I-066 stays open with the walk's words.

**Delivery and encounter checks:** delivery = drift in-sync on the ship's sha + the leg and walk on production. Encounter: blind for real users (no client analytics, W-003; an on-page drag reaches no instrument). The readable event is the synthetic cold walk, N=1.

**USER-FACING: yes.** Paths: `src/components/Viz.tsx`, `src/components/ConvergenceNote.tsx`, `src/components/TimeRangeBrush.tsx` (comment only), `src/components/convergenceShape.test.ts`, `scripts/check-brush-widened.mjs` (or a new sibling checker), `continuity/items.json`, today's report, `docs/walks/2026-10-25-i066.md`.

**Second leg if time remains:** the rest of I-065 (about + `public/about.md` mirror, cycle pages, claim pages, api/v1/state, llms.txt 30/31/33). Its readCommand prints 17 lines in 11 files today; the editor's-note line is fixed inside the I-066 change. I-067 (handles over tick labels) does not fall out of the move and stays on 10-27.

**HYGIENE INPUTS:**
- (a) due rows not bearing on the choice: none — read `check-due-gates-dispositioned --snapshot` ("0 gate(s) due on/before 2026-10-25", 74 rows).
- (b) owed child rows: none — read "rows owed to you in skylark-site's ledger: 0 of 769".
- (c) CROSSED state reads: 1 — key numbers "no list yet" (`docs/key-metrics.json` absent). Not crossed: dated gates 0 of 74, stale-actionable 0 of 17, queued rows 0, missingLinkedCommits nothing swept (0 of 0), HEAD CI GREEN (UNKNOWN at compose, in progress; GREEN on re-read), report PENDING as expected, board cards 0.

## What changed

[P3 — Product-work loop]

**Action (kind: improve the product):** I-066, the zoom strip sits under the chart it zooms, per manager review 9c7f2697 (APPROVE). Its packet defect is corrected here: the 10-22/10-24 "user's words" in the P1 packet are the walk author's summaries, not walker quotations. Its suggestion was taken: Overlay and Calibrate were read at 1440x900 (below).

**1. Implementation — 646e89a, 6bfcac8, 963782f on main.**
- `Viz.tsx`: `<TimeRangeBrush>` now follows the phone `CycleOverview`, before `<Tabs>`, at every width. `TimeRangeBrush.tsx`: on phones the "showing …" readout shares the "Range" label's line (`sm:order-last` keeps desktop as it was). Without that, 360x560 missed by one row (12px over).
- `ConvergenceNote.tsx`: "Drag the time-range below" (false after the move) → "Drag the range strip"; "draws each cycle as one period" → "as at most one period around its peak, cut at today" (I-065).
- New gate `scripts/check-strip-near-chart.mjs` (selftest 12 arms, spawned by `src/lib/check-strip-near-chart.test.ts`); `convergenceShape.test.ts` pins the strip's source order, the note's lack of a direction word, and no common Tailwind order utility in Viz.
- Red first: the three new vitest legs failed on the old source ("expected 9812 to be less than 6373"; the note matched `below` and the one-period phrase), then passed. Components + lib suite: 378/378 locally. Lint and typecheck clean.
- Red arms: the checker on production 5b9b9161 → RED "APART — 0 of 10 rows share a screen with the strip; 2503px between the rows and the strip". The row-count rule removed → selftest "FAIL one row near the strip, of ten expected, is MISSING, not TOGETHER". `[&>*:nth-child(2)]:order-last` added to Viz → 1 failed. Each was restored and re-run green.
- Codex read-only, foreground pipe, banner workdir `C:\dev\skylark\sinusoidal-cycles` both rounds. r1 on 646e89a: MED checker accepted any row count, CONFIRMED, fixed 6bfcac8; LOW a CSS order utility bypasses the source pin, CONFIRMED, pinned 6bfcac8 + ceiling declared (CI does not run the rendered checker); LOW Viz comment false on desktop, CONFIRMED, reworded. Claims pass on the note sentence: every factual clause HOLDS; "to see how much the peak-year choice is doing" UNVERIFIABLE-HERE (a walk question). r2 on 6bfcac8: LOW the order regex misses `order-(--x)` and `[order:…]`, CONFIRMED; second gap in the same matcher, so the test claims less (963782f) rather than growing. r2 confirmed the row-count fix, no Range-header overlap at <640 or ≥640px, `max-sm:` valid (Tailwind 4.2.4), no script reading the header's child order.
- Sibling sweep for copy that places the strip ("time-range below|drag the time|brush below|strip below|chart above" over src, public, scripts): 3 hits before. Fixed: the note. Still true: the desktop header "drag the brush below" (the strip is below the header). Comment: Viz, reworded.
- CI ci.yml green on 963782f4.

**2. Delivery — on for users.** `check-deployed-sha-drift --service sinusoidal-history`: "sinusoidal-history in-sync live 963782f4 → head 963782f4 live commit IS the branch head". On production: `check-strip-near-chart` TOGETHER at 390x664 (131px spare) and 360x560 (9px spare), 320x568 PARTIAL 8 of 10 = declared ceiling (PASS with `--expect-rows 8`); `check-brush-widened --preset-return` PASS at 390x664 and 320x568; `check-entry-folds` 13 of 13 at 360x560 (local build: 13 of 13 at 390, 360 and 320). Rendered `main` innerText multiset, local build vs production before deploy: identical at 390x664 (158 lines, 90 distinct) and 1440x900 (153, 103) except the one note sentence.
- Desktop 1440x900 (declared trade): Facets' first curve at 745–829, still on the first screen (was 566–650). Overlay's chart starts at 815 (was 636), Calibrate's at 902 (was 724, now just below the first screen). On both, the strip (453–531) and the chart now share one screen.

**3. Encounter — blind.** No client analytics by standing choice (W-003); an on-page drag reaches no instrument. Synthetic proxy (not an encounter): one fresh cold walker on production at 390x664, prompt and bar pre-registered in `docs/walks/2026-10-25-i066.md` before the push: **HELD**. "I didn't have to scroll to see the change, because the chart was right above the strip"; the axis "became '1850 1900 1950'"; verdict "Working". Residuals (for the close): rows that go empty in a zoomed window carry no word; cut-off crests read as "something is climbing"; the phone header still says 1600–2050; a drag aimed at 1800–1950 reads 1801–1951; no left-edge axis label after a zoom.

**4. Outcome — open.** No real reader has been seen using the strip.

**I-066: CLOSED** (`continuity-edit --close I-066`, receipt in the row's notes).

**Second leg, I-065 — PARTIAL, stays open.** The editor's-note line fixed inside 646e89a. readCommand: 16 lines in 9 files (was 17 in 11). The rest is the 10-27 copy batch (about + mirror, claim pages, api/v1/state, llms.txt, a source.md) with the claim-page whole-text checkers. The new test's regex was written so it stays out of that grep.

**Hygiene helper:** DISPATCHED ~16:37Z · draft `tmp/hygiene-draft-sinusoidal-cycles-2026-10-25.md` PRESENT (0 drafts; wait-justification PASS 32 of 74; engineering-zero lane 0 findings, 0 unreadable).

USER-VISIBLE: On a phone the zoom strip now sits directly under the ten-row chart it zooms, so a reader drags it and watches the chart change on the same screen — 646e89a [proof: production 5b9b9161 before → check-strip-near-chart RED "APART — 0 of 10 rows share a screen with the strip; 2503px between"; live 963782f4 after → TOGETHER at 390x664 (131px spare) and 360x560 (9px), drift in-sync, pre-registered cold walker on production HELD] [coverage: none can see an on-page gesture; gsc-read.mjs sees search impressions and clicks only · last good read 2026-10-22 · founder+test excluded no] [exposure: blind — no client analytics by standing choice (W-003), an on-page drag reaches no instrument · bug row I-066]

## State Appendix

- At P1: lane HEAD 5b9b916 = origin main; live 5b9b9161 (drift in-sync); CI ci.yml GREEN on 5b9b91619f.
- At P3: code head 963782f = live 963782f4 (drift in-sync), CI ci.yml green on 963782f4.

<!-- findings:begin -->
- The P1 arithmetic for 360x560 (552px, "fits with 8px spare") was wrong in practice: the built layout ran 12px over, because the Range header is three lines on a phone. Moving the "showing" readout onto the label's line brought it to 9px spare.
- The P1 prediction for 320x568 ("rows 2-10 fit") was optimistic by one: 8 of 10 fit after the header change, 7 before it.
<!-- findings:end -->
