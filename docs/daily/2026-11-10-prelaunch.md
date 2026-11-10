# sinusoidal-cycles — 2026-11-10 (Tuesday, MT)

## BLUF

P1 picks **I-076**: the home verdict line says "one has no record on this site" and does not say which cycle. The 11-03 cold walker asked "which one?". It is Turchin (50y), the one cycle with no paired series. P3 names it in the line, drawing the name from the data. Measured on production this morning: at 390x664 the line is two lines with 24px free on the second, so a name of about the same length as the words it replaces fits without a third line. At 320x568 and 360x560 the line already starts below the first screen (top y=584). Section 0 is clean: CI green on b23f2e6, deploy in sync, harness uniform.

## What changed

**P3 shipped I-076 (live eeab357d, CI ci.yml green on eeab357d50).** The home verdict line under the glance figure changed from "None of these ten is confirmed: nine cannot be tested on the record that exists, and one has no record on this site." to **"None is confirmed: nine cannot be tested on the record that exists, and Turchin (50y) has no data series on this site."**

- Commits: 91fa65e (the line, `src/lib/overviewReading.ts`, and its test) and eeab357 (Codex r1 fix: a source pin that the figure renders the line).
- Wording, measured before writing. Candidates were set in place on production at 320x568, 360x560, 390x664 and 414x896. Naming the cycle with the old opening broke to a third line at 390x664 (bottom y=674, past the fold), which confirmed the manager review's hypothesis. "None is confirmed" makes room for the name. `GLANCE_VERDICT_MAX_CHARS = 118` pins the budget as a character proxy.
- Round 0 (a Sonnet helper, 26 lines): "no record on this site" is true only of a paired series. /methods tests this cycle's 50-year period against five other records, so the line says "no data series", which matches `NO_SERIES_REASON`. The name is the row's own ("Turchin (50y)", not "Peter Turchin").
- Tests are red-armed. The new wording legs went 6 of 19 red on the old code and 19 of 19 green after. The render pin went red when the paragraph rendered a literal string, and green when restored; the tree was restored clean, which `git status` confirms.
- Production after deploy (`check-deployed-sha-drift --service sinusoidal-history --wait`: in-sync, live eeab357d), in-page read with a cache-busting query:
  - At 390x664 the line is 2 lines, y=620–656, with its second line ending at x=341 of 374.
  - At 320x568 and 360x560 it is 3 lines from y=584, below the fold, as before.
- Regressions on production: `check-entry-folds` 13 of 13 at 320x568 (`/` 12px spare) and at 360x560 (`/` 4px spare), unchanged; `check-holds-up-line` 46/46 PASS, 0 UNREAD; `check-embed-snippets` 42/42 PASS.
- Encounter: blind. The site has no client analytics, by standing choice (card 1e069bb4). The outcome stays open on I-076.

P1 reads, earlier: the due-gates snapshot (4 rows due), `--run I-075` and `--run I-076` (both stamped, and I-077 was stamped through I-075's identical command), and a Playwright measurement of the verdict line and caption at three phone sizes.

<!-- findings:begin -->
- **I-076's readCommand measures the wrong budget.** Its 4px spare at 360x560 belongs to the strip and rows. The verdict line starts at y=584, below the fold at 360x560 and 320x568, so its length spends none of that 4px. The first-screen size where the line's length costs space is 390x664. The close should re-point the row's proof to the in-page read at 390x664, or record that the test pin carries it.
- **Manager review point 1 confirmed:** `EmbedView.tsx:129` is a different prop. `glanceVerdictLine` is called only at `CycleOverview.tsx:98`, so acceptance 5's embed leg was dropped.
<!-- findings:end -->

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** I-076: the home verdict line names the cycle that has no record. Kind: improve.
- **User problem, in a reader's words:** "one has no record on this site: which one?" That is the 11-03 cold walker at 390x664 (`docs/walks/2026-11-03-i063.md:40`, synthetic N=1), quoted on I-076. Behind it is the bar's problem: "I can't tell whether any of it holds up or is just a good story." (`docs/evangelism-bar.md:14`, HYPOTHESIS.) A verdict that won't say which cycle reads as hedging, on the one line that carries the site's verdict on the first screen.
- **Evidence:**
  - OBSERVED · production home, Playwright in-page read today at 320x568, 360x560 and 390x664 (isMobile, DPR 2), live b23f2e65. The line reads verbatim: "None of these ten is confirmed: nine cannot be tested on the record that exists, and one has no record on this site." At 390x664 it takes 2 lines, spans y=620–656, and its second line ends at x=350 of a 374px right edge, leaving about 24px. At 360x560 and 320x568 it takes 3 lines starting at y=584, below the first screen at both sizes.
  - OBSERVED · source: the line is built by `glanceVerdictFromHeadlines` (`src/lib/overviewReading.ts:75-84`) from `holdsUpCard` headlines. The one `NO_SERIES_HEADLINE` ("Not tested") cycle is `turchin_fathers_sons`: `src/data/series.json` pairs 9 series with the other 9 cycles. The row's visible name comes from `cycleTheorist(cycle)` (`CycleOverview.tsx:195`), and production shows it as "Turchin (50y)". The same line also renders in `EmbedView.tsx:129`.
  - OBSERVED · I-076's readCommand (`--run I-076`, stamped): `/` 4px spare at 360x560, 13 of 13 legs OK. **Finding:** this measures the strip and rows. The verdict line starts below the fold at 360x560 (above), so a longer line spends nothing of that 4px. The size where the line's length costs first-screen space is 390x664: about 8px below the line, and 24px on its second line before it wraps.
  - OBSERVED · I-075's readCommand (`--run I-075`, stamped): `/` 12px spare at 320x568, the same as 11-03.
  - OBSERVED · `check-cycle-rotation --lane sinusoidal-cycles`: "no product-love cycle picks this lane today", exit 0.
  - MISSING · `docs/evangelism-evidence.md` does not exist. The bar's metric reads UNMEASURED (`docs/evangelism-bar.md:30`). There are no client analytics, by standing choice.
  - MISSING · any real reader on this line. The only source is one synthetic walker.
- **Why this over the other due rows:** I-076 answers a concrete reader question with a fact the data already holds, and production measurements show it fits. I-075 ("chosen by whom") lives in a caption already at its 33-character ceiling (`GLANCE_CAPTION_MAX_CHARS`), and the answer ("set by the theorists or by this site") is already on screen 2 (`glanceClusterLine`). Fixing it means a wording decision at a fixed width, not a fact to state, so it goes to hygiene for a disposition. I-068 is user-visible but its row asks for a decision or a walk, and the decision is about the axis end. I-034 is not user-facing.
- **Prior-retro finding that bears on this** (11-09 retro, still on discipline): "make round 0 a pre-commit step for any change that adds reader-facing text." This change adds reader-facing text, so P3 runs round 0 (the claims pass) on the new words before the first commit.
- **Permission:** I-076 is `open`, owner sinusoidal-cycles. It is lane copy in a lane-owned lib, inside the row's own proof ("a test, a walk or a recorded decision"). No open card names it. The I-061 ruling binds the words: no present position. Cards 0a00d394 and 9174731b (answered) are skylark-site riders; 9174731b was read whole on 11-09 and concerns other lanes. 0a00d394 is the /agent-maps page, also not this lane.
- **Next action:** kind = improve. First command, the existing wording test as the baseline before new legs:

  ```
  npm --prefix C:/dev/skylark/sinusoidal-cycles test -- src/lib/overviewReading.test.ts
  ```

- **Acceptance condition:**
  1. With today's data, the line names the cycle with no record, using the name the row shows (`cycleTheorist`, "Turchin (50y)"), counted from the headlines so it cannot go stale. If 2 or more cycles have no record, P3 decides between naming them all and falling back to the count, and pins that in a test.
  2. On production at 390x664 the line stays 2 lines and its bottom stays at or above y=664. Measured by the same in-page read as this morning, before and after.
  3. At 320x568 and 360x560, `check-entry-folds` still reads 13 of 13 OK, and `/` keeps at least its 12px and 4px.
  4. The claims hold: "no record on this site" remains true (no paired series), the line names no year and no present position (I-061), and round 0 has run on the words before commit.
  5. The test is red-armed: it fails on today's wording, passes on the new one, and pins the embed's copy of the line.
  6. No regression: `check-embed-snippets` and `check-holds-up-line` pass on production after the deploy.
- **Delivery and encounter checks:** delivery means `check-deployed-sha-drift --service sinusoidal-history --wait` reads in sync on the fix sha, followed by the in-page read on production. Encounter: blind. The site has no client analytics, so no event would appear at any N. The readable proxy is Search Console page impressions on `/` (who was shown it), not who read the line. Outcome stays open.
- **USER-FACING: yes.** Paths: `src/lib/overviewReading.ts` (the line), and through it `src/components/CycleOverview.tsx` and `src/components/EmbedView.tsx` (render only, no edit expected). Internal: `src/lib/overviewReading.test.ts`, `continuity/items.json`, `docs/daily/`. The line renders client-side, so `check-rendered-text` cannot see it (`docs/rendered-text-gate.md`). The in-page read is the proof.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice, 3: **I-034** (spawned-selftest timeouts; readCommand never run), **I-068** (zoom window "…–2050"; last read 11-06), **I-075** ("chosen by whom"; read today, 12px at 320x568, caption at its 33-character ceiling). Source: `check-due-gates-dispositioned --snapshot` → "4 gate(s) due on/before 2026-11-10" (88 rows swept), minus I-076, which is selected.
  - (b) owed child rows: none. Read: the kickoff's skylark-site ledger read, "0 of 810 considered".
  - (c) state reads marked CROSSED: none. Read: every kickoff state read. The non-zero ones: dated gates 4 of 4 unread at compose (above); answered cards 2 (portfolio riders, not this lane); prior-day retro 2 still-on-discipline of 2 tagged; report artifact PENDING (this file); key metrics "no list yet" (not measured, not 0); listener 0 no-loop warnings since today's session start.

## State Appendix

### Section 0 (2026-11-10, ~08:25 MT)

- **Primer:** `docs/cold-starts/2026-11-09.md` (no 11-10 file). Its first action, the snapshot, is done.
- **Listener:** SSE alive (hello 15:02:57Z, pid 31288), loop armed by `ScheduleWakeup`, waker ladder ranks 1–3 running.
- **Codex:** GREEN per the kickoff's `[codex-probe:]` line (15:08Z, execute and write). No dispatch at P1.
- **CI / drift (P0 hard stop):** `check-ci-status --workflow ci.yml` → GREEN on b23f2e6590. `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live b23f2e65 = head. Passed.
- **Harness:** running 2.1.322 · fleet UNIFORM (28 of 28) · installed 2.1.322 (SAME).
- **Recs yesterday:** one, the I-074 selection. Executed: I-074 closed, live a56378d7 (11-09 primer).
- **North star:** retention and word of mouth. Today's ship moves no measured metric; it will be reported as unmeasured.

### Close

ACTION: COMPLETED · item I-076 · P3 eb2d84c3

- **Since the P3 post:** the manager review read COMPLETED (afb6cbc4), with no defects. Production state is unchanged: live eeab357d. The P3 receipt (eb2d84c3) still holds, so no new receipt is written.
- **Ledger delta** (`continuity/items.json`, via `continuity-edit`):
  - **I-076 closed.** Its readCommand was re-pointed from the 360x560 entry-folds read, which measured the strip, to the `overviewReading.test.ts` pin (the name plus the 118-character two-line cap at 390x664, measured live at y=620–656). The encounter is blind and there is no read to wait on, so it is closed on the acceptance, as I-074 was.
  - **I-034 closed.** Hygiene draft ACCEPTED: `--run I-034` exit 0, 1 of 1 passed, tests 37.85s against its 180s timeout.
  - **I-068 re-dated 11-10 → 11-13.** ACCEPTED: `siteConfig.ts:15 end: 2050`, unchanged. This is the fifth re-date with nothing moved, so the next look records a keep-or-change decision.
  - **I-075 re-dated 11-10 → 11-13.** AMENDED with a note: after the deploy, `/` still has 12px spare at 320x568, so the new line spends none of the caption's budget. The caption question is a wording decision.
- **Hygiene draft:** 3 lines — 2 accepted · 1 amended · 0 rejected. READ-MUTATED I-034 `src/lib/overviewReading.test.ts` was this lane's own build (status bff33c7b). wait-justification PASS (32 of 88 rows carry one, 0 warn). engineering-zero PASS (0 findings, 0 unreadable).
- **Verify:** `check-due-gates-dispositioned` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-11-10), 4 of 4.
- **Pending reads:** 11-11 I-080 (crawl-read for fetches of the reworded text files after 11-07 18:17Z). 11-12 I-077, I-078. 11-13 I-068, I-075.
- **Today panel:** written (`update-daily-brief --phase P5 --date 2026-11-10`, skylark-site commit aef60505).
