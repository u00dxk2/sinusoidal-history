# sinusoidal-cycles — 2026-10-24 (Saturday, MT) — day round 1

## BLUF

[P1 — Evidence and choice]

Today's one user problem is I-064, the zoom strip on the home chart. A reader who drags inside the grey box moves it without being told, and every short drag near the present lands on the same window as the Modern button. The planned change: one status line UNDER the strip (where the caption already sits) that says what the last gesture did, so the strip itself stops jumping down ~28px when the note appears. Proof is one pre-registered cold walker at 390x664 on production.

## Recommendation

### P1 selection packet

**Section 0**
- Primer: no `docs/cold-starts/2026-10-24.md`; read `docs/cold-starts/2026-10-23.md` (newest). Its first action, run: `check-deployed-sha-drift --service sinusoidal-history` → "sinusoidal-history in-sync live 26cd28dc → head 26cd28dc live commit IS the branch head [srv-d7mcat7lk1mc73bidim0]" (exit 0). 26cd28dc descends from 92fa188.
- Listener: 🟢 SSE alive (pid 40712, hello 14:57:17Z, replay 0) + loop armed by `ScheduleWakeup` (the Stop hook owns the cadence); waker ladder ranks 1-3 running (rank 1 fired once on this kickoff row, wake-shorten, and was relaunched).
- Codex: GREEN per the kickoff's `[codex-probe: …]` line (machine-level exec+write, 15:00:18Z). 0 calls at P1.
- CI: `check-ci-status --repo-dir C:/dev/skylark/sinusoidal-cycles --workflow ci.yml` → GREEN on 26cd28dca8 (1 success, 0 failures, 0 pending).
- Harness: running 2.1.310 · fleet UNIFORM (27 of 27 panes) · installed 2.1.310 (SAME).
- Recs yesterday: no Recommendations block in `docs/daily/2026-10-23-prelaunch.md` (its H2s are P1, P3, Close). The close's offer of I-064 as the next cycle (bus 1e98dcc0) is **executed → today's choice** (the orchestrator pulled it forward from 10-27).
- North Star: retention + word-of-mouth. The bar reads UNMEASURED (`docs/evangelism-bar.md` `metricReady: false`; no client analytics by standing choice, W-003). This ship will be reported as unmeasured.
- Product-love rotation: `check-cycle-rotation --lane sinusoidal-cycles` → exit 0, "no product-love cycle picks this lane today". Normal P3.
- David's word: `answered-cards --project sinusoidal-cycles` → no waiting/answered/pending-verify cards.
- Due gates: `check-due-gates-dispositioned --snapshot` → "0 gate(s) due on/before 2026-10-24" (71 ledger rows swept).

**Outcome:** I-064, the zoom strip says what each gesture did.

**The user problem, in the user's words** (cold walkers on production, `docs/walks/2026-10-22-i062.md`, 390x664, touch): "every short drag gives the same picture … the same as tapping Modern … the strip feels like a slow Modern button"; and the I-061 walker W2: "drags … did nothing". Plus the pan: a second drag that starts inside the box moves the box, and nothing says so.

**Evidence:**
- OBSERVED: the walk record above (synthetic cold walkers, N=2 across 10-21 and 10-22, production, 390x664). Limits: synthetic; not real users.
- OBSERVED (source read, `src/components/TimeRangeBrush.tsx` at 26cd28d): the only visible text tied to a gesture is the widened note (`widenedNote`, line 26), shown ABOVE the strip in a `<p>` that is `sr-only` until a widened drag, so the strip moves down when it appears (the 10-23 walker measured ~28px). A pan inside the box (d3-brush `mode: "drag"`) produces no text at all. "Click outside the selection to reset" exists only in the svg's `aria-label` (line 261), so a sighted reader never sees it.
- OBSERVED (source, `src/lib/siteConfig.ts:41-46` + `urlState.widenToMinSpan`): Modern is 1900–2050 and the floor is 150 years, so any drag shorter than 150 years whose centre is after ~1975 widens to exactly 1900–2050 and lights Modern (`aria-pressed`, line 224). That is the code doing what I-060 decided, not a bug; the defect is that the strip does not say it.
- OBSERVED (production, 26cd28dc, ~15:20Z): the first command below → "RESULT: PASS — 2 of 2 drags show a visible widening reason; 0 stale note(s) after a preset return; 0 note(s) erased by a no-op press". Both the mouse and the touch drag ended on "showing 1900–2050", the Modern window, which is the second half of the problem reproduced by the checker itself.
- HYPOTHESIS: a reader told "Moved the window" after a pan, and "the same window as Modern" after a short drag near the present, can say what the strip did. Not walked.
- MISSING: any real-user read of the strip (W-003, no tracking will be added).
- Prior-day retro finding that bears on this (carried from 10-23's packet, 10-21 Q2, still on discipline): building and screenshotting myself. The proof here is a cold walker, run as a helper, one at a time; my own red/green is a vitest on a pure helper, not a browser loop.

**Permission:** I-064 status open, owner sinusoidal-cycles, P3, no park, freeze or card. Copy and interaction on an existing control; the 150-year floor (I-060) and the years-free note rule (I-062: state the rule, never the reader's years) both stay. No board card needed.

**Next action — improve.** P3 sequence:
1. Red first: a pure helper (e.g. `brushStatus(kind, window, presets)` beside `widenedNote`) with tests: idle → the caption naming all three gestures (drag across to choose years · drag the box to move it · tap outside it to show all years); widened → the I-062 sentence, plus "Same window as Modern." when the result equals a preset; pan → a sentence saying the window moved, naming no years. Fails today (helper absent).
2. Build: the line under the strip shows the helper's sentence (`aria-live="polite"`), replacing the separate note above the strip, so nothing above the strip changes height. Pan detected from d3-brush's start-event `mode === "drag"` with an unchanged span. The outcome rule from I-062 (a press that changes nothing leaves the note standing) is kept.
3. Regression: `check-brush-widened.mjs` reads `[data-brush-widened]`; keep that attribute on the new line so the checker still judges the note (or move the checker with it, same commit).
4. Codex read-only review (portable rule 3: published text) + a claims pass on the new sentences.
5. After deploy: drift in-sync, the regression checker on production, then one fresh cold walker at 390x664 on production with the prompt and bar written to `docs/walks/2026-10-24-i064.md` BEFORE the walk.

First command:

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-brush-widened.mjs https://sinusoidalhistory.com 390x664 --preset-return
```

**Acceptance (observable):** on production, after a drag inside the box the line under the strip says the window moved; after a short drag near the present it says it widened to 150 years and that this is the Modern window; the strip's top edge does not move when either appears (measured y before/after, 0px); `check-brush-widened` still PASSES; one pre-registered cold walker at 390x664 can say what the strip did after each of the two gestures. If the walker cannot, I-064 stays open with the walk's words.

**Delivery and encounter:** delivery = drift in-sync on the ship's sha + the checker and walk on production. Encounter: blind for real users (no client analytics, W-003); the readable event is the synthetic cold walk, N=1.

**USER-FACING: yes.** Paths: `src/components/TimeRangeBrush.tsx`, a test beside it (`src/components/convergenceShape.test.ts` pins the current note text and will move with it, or a new `TimeRangeBrush` helper test), possibly `scripts/check-brush-widened.mjs`, `continuity/items.json`, today's report, `docs/walks/2026-10-24-i064.md`.

**Second leg if time remains:** I-065, "drawn as one period" on `public/llms.txt`, `src/app/poster/page.tsx`, `src/lib/countWords.ts` (+ `countWords.test.ts`).

**HYGIENE INPUTS:**
- (a) due rows not bearing on the choice: none — read `check-due-gates-dispositioned --snapshot` ("0 gate(s) due on/before 2026-10-24", 71 rows).
- (b) owed child rows: none — read "rows owed to you in skylark-site's ledger: 0 of 764".
- (c) CROSSED state reads: 1 — key numbers "no list yet" (`docs/key-metrics.json` absent). Not crossed: dated gates 0 of 71, stale-actionable 0 of 15, queued rows 0, missingLinkedCommits nothing swept (0 of 0), HEAD CI GREEN, report PENDING as expected, board cards 0.

## What changed

[P3 — Product-work loop]

**Action (kind: improve the product):** I-064, the zoom strip says what each gesture did, per manager review 704be81e (APPROVE, with two folds: state the chart's window in words instead of pointing up the page; classify a pan from d3-brush's start-event mode, with a vitest case at the floor span).

**1. Implementation — d4cd016, da472e7, 98e9b55 on main** (+ 998fdc1, I-065 partial).
- One line UNDER the strip (`aria-live="polite"`) replaces the note above it: "Widened to 150 years, the shortest view this chart draws. Chart now shows 1900–2050, the same as Modern." after a short drag; "Moved the selection; drag outside it to pick new years. Chart now shows 1850–2000." after a pan; "Chart now shows every year, 1600–2050." after a reset. Idle caption: "Drag across the strip to choose the years the chart shows." (no "above").
- Logic in `src/lib/brushStatus.ts`: `resolveBrushEnd` (a pan keeps its span exactly; the reviewer's rounding HYPOTHESIS held: without the mode check, a pan read back as 149 years re-widened, red-armed), `nextStatus` (only a changed or widened window speaks; anything else leaves the line as it was, including empty), `brushStatus`.
- Tests: red first (module absent) → 9/9; touched files 33/33. Red arms, each restored: pan mode check disabled → 2 failed ("expected 'widened' to be 'moved'"); r1 keep-branch disabled → 2 failed; r2 rule reverted → 1 failed ("expected { outcome: 'moved' … } to be null").
- `scripts/check-brush-widened.mjs --preset-return` gained I-064 legs: the status names the Modern window, the strip's page top moves 0px, a still left-handle press keeps the note (hit must be `handle handle--w`), a still press at a preset says nothing, a pan says it moved. Red arms: production 26cd28dc before deploy → RED "2 moved the strip, 0 of 1 pans say they moved"; a local build with the r1 rule → RED "1 note(s) erased by a no-op press"; with the r2 rule reverted → RED "1 still press(es) at a preset that said something".
- CI ci.yml green on 98e9b557d9 (1 success, 0 failures).
- Codex read-only, foreground pipe, banner workdir `C:\dev\skylark\sinusoidal-cycles` all three rounds. r1 on d4cd016: MED still handle press erased the widening sentence, CONFIRMED, fixed da472e7 (its suggested one-liner was not taken: it would silence a short drag at Modern); LOW wiring not pinned in vitest, CONFIRMED as a declared ceiling (the Playwright checker is the wiring proof). r2 on da472e7: MED false "Moved" at a preset, CONFIRMED, fixed 98e9b55 (second round on the line's lifecycle, so the rule claims less); MED I-065 sweep incomplete, CONFIRMED, llms.txt:16 fixed and the rest carried (below); LOW handle leg could pass off-target, fixed. Claims: r2 REFUTED my llms.txt:16 sentence and 998fdc1's commit-body sentence ("each cycle is drawn as one period centred on its reference peak") — both corrected (the latter in 98e9b55's body). r3 on 98e9b55: no material findings.
- Sibling sweep for the caption class ("chart above|zoom the chart|Drag across the strip" over the repo minus node_modules/.next/tmp): 0 user-facing hits outside the strip (dated docs only).

**2. Delivery — on for users.** `check-deployed-sha-drift --service sinusoidal-history`: "sinusoidal-history in-sync live 98e9b557 → head 98e9b557 live commit IS the branch head". `check-brush-widened.mjs https://sinusoidalhistory.com --preset-return` → PASS at 390x664 and 320x568, every leg ("I-064: 2 of 2 name the Modern window, 0 moved the strip, 1 of 1 pans say they moved, 0 still press(es) at a preset that said something").

**3. Encounter — blind.** No client analytics by standing choice (W-003); an on-page gesture is invisible to Search Console and to the request logs. Synthetic proxy (not an encounter): one fresh cold walker on production at 390x664, prompt and bar pre-registered in `docs/walks/2026-10-24-i064.md` before the push: **HELD**. After the pan: "Yes, without doubt. … It even tells you how to do the other thing." Verdict "limited" ("every gesture got a clear, accurate sentence … It just says no"). Residuals: handles cover tick labels; a recent window reads "…–2050" past today; the floor is not stated before a drag; the strip is ~2,800px below the chart.

**4. Outcome — open.** No real reader has been seen using the strip.

**I-064: CLOSED** (`continuity-edit --close I-064`, receipt in the row's notes).

**Second leg, I-065 — PARTIAL, stays open.** 998fdc1 + 98e9b55: home summary, poster description and llms.txt lines 3/9/16 say "at most one period …, cut at today". The row's original readCommand now exits 1, but it was too narrow (Codex r2): readCommand widened, and its positive control finds 17 hits in 11 files (about page + mirror, every cycle page, the three claim pages, api/v1/state, llms.txt 30/31/33, a source.md). Ceiling: the home editor's note (ConvergenceNote.tsx:23-24) wraps the phrase across a line, so the line-based grep cannot see it; named in the row. A copy batch with the claim-page whole-text checkers and the about mirror, dated 10-27 with the others.

**Hygiene helper:** DISPATCHED ~15:23Z · draft `tmp/hygiene-draft-sinusoidal-cycles-2026-10-24.md` PRESENT (0 drafts; wait-justification PASS 32 of 71; engineering-zero 0 findings, 0 unreadable).

USER-VISIBLE: The zoom strip on the home chart now says, right under it, what each drag did and which years the chart shows ("Chart now shows 1900–2050, the same as Modern."; "Moved the selection; drag outside it to pick new years."), and no longer jumps down when it does — d4cd016 [proof: production 26cd28dc before → check-brush-widened RED "2 moved the strip, 0 of 1 pans say they moved"; live 98e9b557 after → PASS at 390x664 and 320x568, drift in-sync, pre-registered cold walker on production HELD] [coverage: none can see an on-page gesture; gsc-read.mjs sees search impressions and clicks only · last good read 2026-10-22 · founder+test excluded no] [exposure: blind — no client analytics by standing choice (W-003), an on-page drag reaches no instrument · bug row I-064]

## State Appendix

- At P1: lane HEAD 26cd28d = origin main; live 26cd28dc (drift in-sync).
- At P3: code head 98e9b55 = live 98e9b557 (drift in-sync), CI ci.yml green on 98e9b557d9.

<!-- findings:begin -->
- The reviewer's rounding HYPOTHESIS held: without classifying a pan by d3-brush's start mode, a pan of the 150-year box read back as 149 years and re-widened (red arm in brushStatus.test.ts).
- The packet's I-065 scope (three surfaces) was too narrow: Codex r2 found the "each cycle is one period" claim on ~10 more surfaces; the widened readCommand counts 17 lines in 11 files. I-065 stays open.
<!-- findings:end -->
