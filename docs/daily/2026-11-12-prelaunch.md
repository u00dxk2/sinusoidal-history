# sinusoidal-cycles — 2026-11-12 (Thursday, MT)

## BLUF

**P3 shipped I-077, live 626ce16d (CI ci.yml green on 626ce16dfc, deploy in sync).** The home figure now says "height: shape, not size" beside its year ticks. It spends no first-screen height (`/` still has 12px spare at 320x568), and it reads OK at 4 of 4 phone widths on production. Encounter blind, outcome open until a cold walk. The P1 reasoning follows.

P1 picks **I-077**. The home figure draws ten humps and labels neither their height nor any y-axis. The 11-03 cold walker wrote: "I assume height means strength, but that is a guess." Each row is one period of a unit sinusoid (I-061), so every hump has the same height. That height is the curve's shape, not a measured size. A reader who reads it as strength compares cycles on a quantity the site does not claim. P3 adds a short label saying so, in the empty space under the name column beside the year ticks. The first screen's 12px spare at 320x568 is the budget, and the label must spend none of it. Section 0 is clean: CI green on 53e74d71bc, deploy UNPROVABLE on a doc-only commit (not a stop, see the appendix), harness uniform. The second due row, I-078, goes to hygiene.

## What changed

**P3 shipped I-077 (live 626ce16d; CI ci.yml green on 626ce16dfc; deploy in sync).** The home figure now shows "height: shape, not size" under the cycle names, beside the year ticks. Screen readers get: "A full wave reaches the same height on every row: the height is the curve's shape, not a measured size." The manager review (b330dc12) approved the packet with three fixes. All three are done: the amplitude pin, screen-reader words, and the quote cited as the row's words.

- Commits:
  - cdb4bda: the label (`src/lib/overviewReading.ts`, `src/components/CycleOverview.tsx`) and its tests.
  - 77e8cb8: corrects the label's comment, which still said "the same on every row" after round 0 refuted that.
  - 70e1205: Codex r1 test fixes.
  - 626ce16: Codex r2, which declares the source pin's limit.
- **Placement, measured before choosing.** On production (live 63cffac6, before the change), the name column under the rows was empty beside the tick row. The first year label starts 107px into the figure. In 11px display italic, "height: shape, not size" sets 91.1px, and the same words in 11px mono set 151.8px. The label sits in the tick row's own 16px band, so the figure is no taller. At 320x568 that band starts at y=560, so on the smallest phones the label is half below the fold. At 390x664 (the walker's screen) it is whole, at y=596. The figure is phone-only (`sm:hidden`), so 1440px has nothing to read.
- **Round 0 ran after the words were drafted and before the first commit.** The retro finding "round 0 before the first commit for reader-facing text" recurred in part: the draft came first. A Sonnet helper listed 19 facts. It found the visible label HOLDS. It found the first screen-reader sentence, "Each hump's height is the curve's shape, the same on every row, not a measured size", REFUTED-AS-WRITTEN: a wave cut by the window or by today is not the same height, and a row can have no wave at all. The sentence was narrowed to "a full wave" before cdb4bda. It also confirmed that calibration moves only the period and the peak year, never the amplitude.
- **Tests, red-armed.** Three of the four new legs go red on the old source. The amplitude leg goes red with khaldun at 0.5. After r1, the whole-sentence pin went red on "Every visible hump…", and the wrapper pin went red on an `aria-hidden` wrapper. Every file was restored. 24 of 24 pass, and the 48 tests that read CycleOverview or its checkers pass.
- **Codex, 2 read-only rounds (gpt-6-astra).** The banner `workdir` matched both times, and both exited 0.
  - r1 on 77e8cb8 found two LOW, STATIC findings, both CONFIRMED and fixed in 70e1205. First, the render pin checked only the label's own tag, not its ancestors. Second, the sentence pin did not hold the "full wave" qualifier. r1 also read the layout change as keeping the tick positions and the row height.
  - r2 on 70e1205 closed the sentence finding and partly closed the ancestor finding. It named three more bypasses of the same class: an outer `aria-hidden` wrapper, `display:none`, and a per-row y scale. That is the second appearance of one class, so the matcher was not patched again. The test now states it is a source pin (626ce16), and the rendered DOM read below is the proof of visibility.
- **Production after deploy** (`check-deployed-sha-drift --service sinusoidal-history --wait`: live 626ce16d = head):
  - Label read (`tmp/read-glance-height-label.mjs`): OK at 4 of 4 widths (320x568, 360x560, 390x664, 414x896). At each width the text is 91.1px and ends at x=107.1, the first tick "1600" is at 122.8, the row is 16px tall at an unchanged top (560 or 596), there is no aria-hidden ancestor, and the screen-reader sentence is exact. Before the deploy it read "ABSENT: 4 of 4".
  - `check-entry-folds` at 320x568: 13 of 13, with `/` at 12px spare. That is the same as this morning.
  - `check-glance-now-mark`: 2 of 2 viewports clean.
  - `check-holds-up-line`: 46/46 PASS, 0 UNREAD.
- **Encounter:** blind. The site has no client analytics, by standing choice (card 1e069bb4). Outcome open: I-077's closeWhen needs a cold walker who can say what height means.

<!-- findings:begin -->
- **A source-text pin cannot prove a label is seen.** Two Codex rounds found bypasses of one class: a wrapper, a style, a per-row scale. The proof of visibility is a DOM read on the served page, and the source test now says so.
- **"The same height on every row" is false for a clipped wave.** Round 0 caught it in the screen-reader sentence, and the same claim survived in the JSDoc until 77e8cb8. Sameness holds for a FULL wave only.
- **The label is half below the fold at 320x568.** The tick row starts at y=560, so the label is whole only from about 390x664 up. Placing it higher would spend the 12px spare.
<!-- findings:end -->

### Morning reads

- Both rows due today were read this morning through the gate, and both are stamped:
  - I-077: `check-entry-folds` at 320x568 read 13 of 13 OK, with `/` at 12px spare. That matches 11-10 and 11-11. I-075 was stamped from the same run, because its readCommand is byte-identical.
  - I-078: its first read ever. The grep returned `src/components/CycleOverview.tsx:114: {glanceCaption(verdictLine)}`, so the caption still reads the stored-cycle verdict.

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** I-077. Say on the home figure what a hump's height means. Kind: improve.
- **The user problem, in a reader's words:** "There are no y-axis numbers. I assume height means strength, but that is a guess." Also: "The humps' heights have no label, so I did not know what they mean." That is the 2026-11-03 cold walker on production d592db70 at 390x664 (`docs/walks/2026-11-03-i063.md`, synthetic N=1, quoted on I-077's description). Behind it is the bar's problem: "I can't tell whether any of it holds up or is just a good story" (`docs/evangelism-bar.md:14`, HYPOTHESIS). Reading height as strength means reading a magnitude the site never measured.
- **Evidence:**
  - OBSERVED · source, read today. `CycleOverview.tsx:182-185` fixes every row's y domain at [-1, 1], and `useCycleValues(cycle, startYear, endYear, 1)` draws amplitude 1. So every full hump is the same height on every row, calibrated or not. Nothing on the figure says this. The tick row (`CycleOverview.tsx:129`) sits at `marginLeft: NAME_COL` (104px), so the strip under the names beside the year ticks is empty.
  - OBSERVED · I-077's readCommand, run today through `check-due-gates-dispositioned --run I-077` (exit 0, 38.6s): `/` has 12px spare at 320x568, and 13 of 13 entry pages are OK. Any new first-screen line must fit inside the existing rows or below the fold.
  - OBSERVED · the caption is at its 33-character ceiling (`GLANCE_CAPTION_MAX_CHARS`, `overviewReading.ts:78`). The verdict line has a measured budget of 118 characters (`GLANCE_VERDICT_MAX_CHARS`, `:27`), and at 320x568 it starts below the fold. Neither is the place for a label that a first-screen reader needs.
  - HYPOTHESIS · that one walker's guess is what a cold reader does. It is synthetic, N=1, first screen only.
  - OBSERVED · `check-cycle-rotation --lane sinusoidal-cycles` exited 2 (REVIEW, not "nothing due"): "UNDETERMINED — no real-user-evidence artifact on record for sinusoidal-cycles; the registry does not declare which lanes owe one". The rotation could not decide either way. It does not show a pass as due.
  - MISSING · `docs/evangelism-evidence.md` does not exist. The bar's metric reads UNMEASURED (`docs/evangelism-bar.md:30`). There are no client analytics, by standing choice.
  - MISSING · any real reader on the home figure.
- **Why I-077 over I-078 (both due today):** I-077 is on every phone's first screen and comes with a reader's words. I-078 affects only a reader who has calibrated a peak. It is STATIC (Codex r2 on d592db7, PLAUSIBLE, pre-existing), and no reader has been seen misreading it. I-075 (due 11-13) is a caption wording decision at a fixed 33-character width. P3 must not take a character from the caption for this label.
- **Prior-retro finding that bears on this** (11-11 Q0, still on discipline, "RECURRED IN PART"): "round 0 before the first commit for reader-facing text". This change adds reader-facing words, so P3 runs round 0 (the claims pass) on them before the first commit.
- **Permission:** I-077 is `open`, P3, owner sinusoidal-cycles. Lane copy in a lane-owned component, inside the row's own closeWhen. No open card names it (`answered-cards --project sinusoidal-cycles`: none). I-061 binds the words: they may say what the drawing is, but may not give a position on any cycle.
- **Next action:** kind = improve. Measure the empty strip under the name column on production first, then write the label to fit it. The first command is the fold baseline, which was re-read this morning. P3 re-runs it after the deploy:

  ```
  node C:/dev/skylark/sinusoidal-cycles/scripts/check-entry-folds.mjs https://sinusoidalhistory.com --width 320 --height 568
  ```

  Candidate wordings, to be set in place at 320px and measured before choosing. The strip is about 104px of 11px mono, roughly 15 characters: "shape, not size", or "height: shape only". If the strip cannot hold a true sentence, the fallback is the "Each in detail below" line (`CycleOverview.tsx:153-156`), which sits below the fold at 320x568.
- **Acceptance condition:**
  1. The home figure shows words saying that a hump's height is the curve's shape, the same for every cycle, and not a measured size. A source test pins them, red on today's tree and green after.
  2. `check-entry-folds https://sinusoidalhistory.com --width 320 --height 568` still reads 13 of 13 OK on production after the deploy, with `/` still at 12px spare. The label spends no first-screen height.
  3. The label does not collide with the year ticks at 320, 360, 390 and 1440px. That is an in-page read of the label's box against the leftmost placed tick.
  4. The claims hold: the words name no position on any cycle (I-061), and round 0 has run on them before the commit.
  5. No regression: `check-holds-up-line` and `check-glance-now-mark` pass on production after the deploy.
  6. I-077 stays open until a cold walker can say what height means, as its closeWhen requires. A pinned label is the build, not the close. P3 re-dates the row to the next walk.
- **Delivery and encounter checks:** delivery means `check-deployed-sha-drift --service sinusoidal-history --wait` reads in sync on the fix sha, followed by an in-page read of `[data-overview-id]` on production. The figure renders client-side, so `check-rendered-text` cannot see it (`docs/rendered-text-gate.md`). Encounter: blind. The site has no client analytics, so no event would appear at any N. The outcome check is the next cold walk, which runs the closeWhen question.
- **Key number:** the `/` first-screen spare at 320x568. It measures whether any first-screen word wraps. It was measured this morning: 12px (I-077's stamp, `continuity/read-outputs/I-077.txt`).
- **USER-FACING: yes.** Paths: `src/components/CycleOverview.tsx`, and possibly `src/lib/overviewReading.ts` if the words live beside the other glance strings. Internal: a test file beside them, `continuity/items.json`, `docs/daily/`.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice, 1: **I-078** (on a calibrated chart the caption and verdict still state the stored verdicts). Its first read ran today: exit 0, one line, `CycleOverview.tsx:114: {glanceCaption(verdictLine)}`. The state is unchanged since 11-03. Source: `check-due-gates-dispositioned --snapshot` → "2 gate(s) due on/before 2026-11-12" (88 rows swept).
  - (b) owed child rows: none. Read: the kickoff's skylark-site ledger read, "0 of 813 considered".
  - (c) state reads marked CROSSED: none. Read: every kickoff state read. The non-zero ones: dated gates 2 of 2 unread at compose (both now read, above); answered cards 0; prior-day retro 1 Q0 and 7 still-on-discipline; report artifact PENDING (this file); key metrics "no list yet" (not measured, not 0); queued rows 0; stale-actionable 1 of 11 (no threshold printed); listener 0 no-loop warnings since today's session start.

## State Appendix

### Section 0 (2026-11-12, ~09:00 MT)

- **Primer:** `docs/cold-starts/2026-11-11.md` (there is no 11-12 file). Its first action, the snapshot, is done: 2 gates due (I-077, I-078).
- **Listener:** 🟢 SSE alive (hello 15:37:55Z, pid 23788, slug sinusoidal-cycles). The loop is armed by `ScheduleWakeup`. Waker ranks 1–3 are running; rank 1 fired a wake-shorten at about 15:50Z and was relaunched.
- **Codex:** GREEN per the kickoff's `[codex-probe:]` line (15:41Z, execute and write). No dispatch at P1.
- **CI / drift (P0 hard stop):** `check-ci-status --workflow ci.yml` → GREEN on 53e74d71bc. `check-deployed-sha-drift --service sinusoidal-history` → UNPROVABLE, not RED. Live is 63cffac6 and head is 53e74d71. The one changed file is the doc-only primer commit, so the served code is the same as head. Passed.
- **Harness:** running 2.1.322 · fleet UNIFORM (28 of 28) · installed 2.1.322 (SAME).
- **Recs yesterday:** one, the I-068 selection. Executed: I-068 closed, live 854c8825 (11-11 report, Close).
- **North star:** retention and word of mouth. Today's ship moves no measured metric, so it will be reported as unmeasured.

### Close

ACTION: COMPLETED · item I-077 · P3 b016ce1f

- **Since the P3 post:** the manager review (af0ec75a) read COMPLETED and found no defects. Production is unchanged, live 626ce16d, so the P3 receipt still holds and no new receipt is written.
- **Hygiene draft:** 1 line, 1 accepted, 0 amended, 0 rejected. I-078 was re-dated 11-12 → 11-19 (`continuity-edit --extend I-078 --new-target 2026-11-19`), with its reason appended. I-077's edit did not touch the caption or the verdict line. READ-MUTATED: none. Wait-justification: PASS, 32 of 88 rows, 0 warn. Engineering-zero: PASS, 0 findings, 0 unreadable.
- **Ledger delta:** I-077 stays open. It was re-dated 11-12 → 11-19, and today's build note was appended: the label, the production read, the 320x568 limit, and the pending cold walk. I-078 was re-dated to 11-19. No closes and no new rows.
- **Due-gate verification:** `check-due-gates-dispositioned` reported "verdict: CLEAR — every gate due at Phase 0 was dispositioned", with snapshot CURRENT (taken 2026-11-12) and I-077 and I-078 both [ok].
- **Pending reads:** 11-13 I-075 · 11-15 I-049 · 11-16 I-051 · 11-17 I-081 · 11-18 I-071 · 11-19 I-077 (a cold walk asked what hump height means) and I-078 · 12-01 I-025, I-042, I-073 · 2027-01-04 W-005.
- **Today panel:** written for 2026-11-12 (`update-daily-brief --date 2026-11-12`, row updated).
