# sinusoidal-cycles — 2026-11-13 (Friday, MT)

## BLUF

**P3 shipped I-075, live bd23f36c (CI ci.yml green on bd23f36ccb, deploy in sync).** The phone home caption now reads "Site's peaks · no cycle confirmed". While a reader has moved any peak, it reads "Peaks chosen · no cycle confirmed". On production both forms are one line at 4 of 4 phone widths, and `/` still has 12px spare at 320x568. The pre-registered cold walk (synthetic N=1, 390x664) came back AMBIGUOUS. The reader now names this website as the one that placed the peaks, citing the caption, where the 11-03 reader could not tell. But it hedged ("Can't tell for certain, but I lean towards the website"), and it half-understood the possessive. I-075 stays open, and the close decides between a re-walk and the recorded-decision path. Encounter blind; outcome open.

**P1 picked I-075: the home first screen should say who chose the peaks.** The phone glance caption reads "Peaks chosen · no cycle confirmed". The 11-03 cold walker read it as meant, then asked "Peaks chosen: chosen by whom?" The answer is that some peak years are the theorists' own dates and others are this site's choices. It sits on the second screen only. The caption is at its 33-character ceiling at 320px, and `/` has 12px spare at 320x568 (read today). A second caption line costs 16px, so the words must fit in the existing line or somewhere that spends no first-screen height. Round 0 (a Sonnet fact-listing helper) was dispatched at P1 prep, before any wording exists. Section 0 is clean: CI green on c1a0296, deploy in sync (live c1a02967 = head). Nothing is ready to ship yet; no commit touches the change until the review.

## What changed

**P3: I-075 shipped (badd80e, then bd23f36; live bd23f36c; CI ci.yml green on bd23f36ccb).** Manager review 69ed4392: APPROVE, plus one condition, that the words stay true after a reader calibrates a peak.

- **Words, written from round 0's list (36 lines):** "Site's peaks · no cycle confirmed" while every drawn peak is the stored one. "Peaks chosen · no cycle confirmed" while any drawn peak differs from its stored year (a reader's calibration). "Theory shapes, not findings" when no verdict line holds, unchanged. Both peak words are 12 characters, so each caption is 33. Codex measured every glyph in Geist Mono at 600/1000 em: 283.14px at 11px with 0.18em tracking. The live read puts each caption on one line (17px box, line-height 16.5) at 320, 360, 390 and 414px.
- **Code:** `peaksMoved(stored, drawn)` in `src/lib/overviewReading.ts`. It compares current peak years by id, so a peak moved back to its stored year reads unmoved, a period-only change reads unmoved, and a misaligned list reads moved. `Viz.tsx` passes it to `CycleOverview`, and `glanceCaption(verdictLine, moved)` picks the words.
- **Option 2 (a per-row mark) was not built.** Round 0 puts a site step on all ten peaks, so the mark would sit on every row and say less than one caption word. That confirms the review's suggestion.
- **Tests, red-armed:** on the old tree 5 of 28 failed (the caption string, the render and Viz wiring pin, and the three `peaksMoved` legs). After the change 28 of 28 pass, and with the two neighbouring test files 69 of 69. Codex reproduced that a constant `peaksMoved={false}` turns the wiring pin red. Typecheck and lint are clean.
- **Codex r1 on badd80e** (gpt-6-astra, read-only foreground pipe, banner workdir matched, exit 0). Job 1, the claims pass: PASS. "Site's peaks" HOLDS, read as "the reference peaks this site uses", not that the site invented every date; whether readers take it that way was UNVERIFIABLE-HERE. "Peaks chosen" HOLDS, "no cycle confirmed" HOLDS (REPRODUCED), and I-061 HOLDS. Job 2, the code: PASS, no defect. One LOW was CONFIRMED: the comments said the caption flips "once" a reader calibrates, but the code checks current state. Fixed in bd23f36 ("while"), with a move-back test added. Two process-history comments were narrowed: one now cites the walk file, the other says what the rationales show.
- **Live reads on bd23f36c:**
  - `tmp/read-glance-caption.mjs`: "Site's peaks · no cycle confirmed" OK at 4 of 4 widths. With `?peak.khaldun=1800`, "Peaks chosen · no cycle confirmed" OK at 4 of 4. The same script, run before the deploy, FAILED at 320 and 360 on the old caption; the 390 load then timed out during the switchover.
  - `check-entry-folds` at 320x568: 13 of 13, with `/` at 12px spare.
  - `check-holds-up-line`: 46/46 PASS, 0 UNREAD.
  - `check-glance-now-mark`: 2 of 2 clean.
  - I-077's label read: OK at 4 of 4.
- **Walk** (`docs/walks/2026-11-13-i075.md`, pre-registered before the push): AMBIGUOUS. In (4) the reader said "Can't tell for certain, but I lean towards the website … I take 'Site's peaks' to mean the peaks drawn are the website's own placements". In (3) it said PARTLY, crediting both verdict lines: "I would not tell my friend they agree".
- **Encounter:** blind. There are no client analytics, by standing choice (card 1e069bb4).

P1 (selection and prep) is recorded below.

- **Morning snapshot** (`check-due-gates-dispositioned --snapshot`): "1 gate(s) due on/before 2026-11-13". The row is I-075, and it is the selected item.
- **I-075 read** (`check-due-gates-dispositioned --run I-075`, exit 0, 21.2s): `/` at 12px spare at 320x568, 13 of 13 entry pages OK. That matches 11-10 and 11-12. I-077 was stamped from the same run (byte-identical readCommand).
- **Round 0 dispatched** at P1 prep (memory `feedback_round0_at_p1`; retro d3b05a4f Q0/Q5). It lists, per cycle, whether each `reference_peak_year` is the theorist's date or this site's choice, with `file:line`. P3 writes from that list.

<!-- findings:begin -->
- **The packet's acceptance 1 framing ("the theorists or this site") was too even.** Round 0 put a site step on every one of the ten stored peaks. Only Turchin's fathers-and-sons 1970 (and Modelski's 1945, if a phase start counts) is a year the theorist states. The shipped words name the site, as the review advised.
- **"Site's peaks" lands, but with doubt.** The walker read it the intended way, then asked whether it means "peaks the site picked" or "peaks as the site shows them". It also over-read the caption to mean that none of the dates are the theorists'. A fuller answer will not fit a 33-character line. The close weighs a re-walk against the recorded-decision path.
- **I-077's label was read correctly in passing.** In (2) the walker wrote "Every hump has the same height, which the note says means nothing". In (5) it added that "a hump drawn the same height for all rows reads as 'equally strong'". This was not I-077's walk, since its question was not asked. It is input for the 11-19 re-check, carried to the close.
<!-- findings:end -->

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** I-075. Say on the home first screen who chose the peaks. Kind: improve.
- **The user problem, in a reader's words:** "Peaks chosen: chosen by whom?" and "I could not tell from this screen whether the peaks come from the theorists or from the site." That is the 2026-11-03 cold walker on production d592db70 at 390x664 (`docs/walks/2026-11-03-i063.md:39-40`, synthetic N=1). Behind it is the bar's problem: "I can't tell whether any of it holds up or is just a good story" (`docs/evangelism-bar.md:14`, HYPOTHESIS). A reader who cannot tell a theorist's date from the site's anchor cannot weigh the bunched humps.
- **Evidence:**
  - OBSERVED · source, read today. `glanceCaption` returns "Peaks chosen · no cycle confirmed" (`src/lib/overviewReading.ts:109`). Its comment records the budget: 33 characters, 283.1px of the 288px box at 320 (`:107-108`), with 8.58px per character (`:74-76`). It renders as the figure's `figcaption` (`src/components/CycleOverview.tsx:104-117`). The test pins the exact string (`src/lib/overviewReading.test.ts:28`).
  - OBSERVED · source. The answer exists on screen 2: `glanceClusterLine` says the peak years "are anchors, set by the theorists or by this site, not evidence that the cycles agree" (`overviewReading.test.ts:178`). The test names a constructed set that includes kondratiev, huntington, schlesinger_jr and perez (`:203-205`).
  - OBSERVED · I-075's readCommand, run today: `/` has 12px spare at 320x568, and 13 of 13 OK. A second caption line costs 16px (`overviewReading.ts:75-76`), so it would break `/` at 320x568.
  - OBSERVED · I-075's 11-10 note: at 320x568 the verdict line starts at y=584, below the fold. So on the smallest phone the caption's "no cycle confirmed" is the only verdict on the first screen. At 390x664 the verdict line is on screen too. Any trade of the verdict half must keep a verdict on the 320x568 first screen.
  - HYPOTHESIS · that one walker's question is what a cold reader asks. It is synthetic, N=1, first screen only. The row says so itself: "A candidate, not a confirmed reader failure".
  - OBSERVED · `check-cycle-rotation --lane sinusoidal-cycles` exited 0: "no product-love cycle picks this lane today … run the normal P3".
  - MISSING · `docs/evangelism-evidence.md` does not exist. The bar's metric reads UNMEASURED (`docs/evangelism-bar.md:30`). There are no client analytics, by standing choice.
  - MISSING · any real reader on the home figure.
  - OBSERVED · round 0 (36 lines, 4 UNVERIFIABLE-HERE; saved at `tmp/round0-i075-2026-11-13.md`), returned after the P1 post. Every one of the ten peaks involves a site step. Only `turchin_fathers_sons` (and `modelski`, if a phase start counts) carries a year the theorist states as a peak. Five are the site's own choice or construction, and three are site anchors read off the theorist's dating (`src/data/cycles.json` rationales). So a wording that credits "the theorists" alone is refuted. Two further constraints: a calibrated peak is the reader's choice, and the caption does not change on calibration (`overviewReading.ts:71-73`), so a "this site" caption would be false after calibration unless it changes too. The words must also not imply that the peaks come from the paired data (Dalio, `cycles.json:83`).
- **Prior-retro finding that bears on this** (11-12 Q0, still on discipline, "RECURRED, third day running"): "round 0 before the sentence exists". This outcome adds reader-facing words, so round 0 went out at P1 prep, before any wording. No wording is proposed in this packet.
- **Approaches P3 will choose between, from round 0's list, measured in place at 320px before choosing:**
  1. The caption itself names who set the peaks, inside 33 characters, keeping a verdict on the 320x568 first screen.
  2. The rows carry the provenance (a mark on the rows whose peak is the site's choice), which spends no height if it fits the existing row.
  3. If neither holds a true sentence at the measured width: a recorded decision that the second-screen answer is enough, with the reason. That is the row's own second close path.
- **Permission:** I-075 is `open`, P3, owner sinusoidal-cycles. Lane copy in lane-owned files, inside the row's own closeWhen. No open card names it (`answered-cards --project sinusoidal-cycles`: 0 lane cards). I-061 binds the words: they may say who set the anchors, but may not give a position or phase on any cycle.
- **Next action:** kind = improve. When round 0 is back, set the candidates in place on a local build at 320, 360 and 390 and measure them before choosing. The first command is the fold baseline, re-read this morning; P3 re-runs it after the deploy:

  ```
  node C:/dev/skylark/sinusoidal-cycles/scripts/check-entry-folds.mjs https://sinusoidalhistory.com --width 320 --height 568
  ```

- **Acceptance condition:**
  1. The home first screen at 320x568 and 390x664 carries words saying who set the peak years (the theorists or this site), and every word matches round 0's per-cycle list. A test pins them, red on today's tree and green after.
  2. `check-entry-folds https://sinusoidalhistory.com --width 320 --height 568` still reads 13 of 13 OK on production after the deploy, with `/` still at 12px spare.
  3. A verdict still sits on the 320x568 first screen.
  4. The claims hold: round 0 has run, and the claims pass runs on the words before the first commit. The words name no position on any cycle (I-061).
  5. No regression: `check-holds-up-line`, `check-glance-now-mark`, and the I-077 label read (`tmp/read-glance-height-label.mjs`) pass on production after the deploy.
  6. I-075 closes only on its closeWhen: a cold walker who stops at the 390x664 first screen can say who chose the peaks. P3 pre-registers that walk and runs it after the deploy. If option 3 is taken instead, the recorded decision closes the row.
- **Delivery and encounter checks:** delivery means `check-deployed-sha-drift --service sinusoidal-history --wait --sha <full sha>` reads in sync, then an in-page read of the caption on production. The figure renders client-side, so `check-rendered-text` cannot see it (`docs/rendered-text-gate.md`). Encounter: blind. There are no client analytics, so no event would appear at any N. The outcome check is the pre-registered cold walk (synthetic, N=1).
- **Key number:** the `/` first-screen spare at 320x568. It measures whether any first-screen word wraps or a line is added. It was measured this round: 12px (I-075's stamp, `continuity/read-outputs/I-075.txt`).
- **USER-FACING: yes.** Paths: `src/lib/overviewReading.ts`, and `src/components/CycleOverview.tsx` if the rows carry the mark. Internal: `src/lib/overviewReading.test.ts`, `continuity/items.json`, `docs/walks/`, `docs/daily/`. If the caption changes, check the prose mirrors (`public/about.md`, `public/methods.md`, `public/llms.txt`) for a quote of the old caption.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: none. Read: `check-due-gates-dispositioned --snapshot` → "1 gate(s) due on/before 2026-11-13", which is I-075, the selected row.
  - (b) owed child rows: none. Read: kickoff "rows owed to you in skylark-site's ledger: 0 of 822".
  - (c) state reads marked CROSSED: 1. "board cards carrying David's word: 1": 210b0834, a skylark-site card on the heavy-job queue, "governs: unlinked". It names no work for this lane, so the disposition is "read, not this lane's".
  - Also for the close: two working-tree changes that predate this session (`continuity/continuity-disposition-events.jsonl` modified, `continuity/read-outputs/I-027.partial.txt` untracked) were already in the session-start git status. Owner unknown; the close decides whether to commit or drop them.

## State Appendix

- **Section 0:**
  - Step 0, primer: `docs/cold-starts/2026-11-12.md` read whole. There is no 11-13 primer, as expected.
  - Step 0.5, listener: the SessionStart hook relaunched it (pid 29956). Hello at 16:32:54Z, replay 0. Waker ranks 1-3 are armed.
  - Step 0.6, Codex: the kickoff's `[codex-probe: GREEN …]` line is the probe (16:33:15Z).
  - Step 0.7, CI and deploy: CI GREEN at c1a0296 (kickoff read, run 43264411433). `check-deployed-sha-drift --service sinusoidal-history`: in-sync, live c1a02967 = head. Not a stop.
  - Step 0.10, yesterday's recommendations: I-077 re-check is 11-19, I-078 is 11-19. Neither is due today.
- **Codex calls this phase:** 0 (`--codex-reason probed-declined`: the probe is green, and P1 has no words for Codex to review yet)

### Close

ACTION: COMPLETED · item I-075 · P3 48026406. Build acceptance 1-5 is met (manager review 3cdbe1f8). Acceptance 6 (the walk) came back AMBIGUOUS, so the outcome stays open on the row.

- **No state change since the P3 post.** Production is still live bd23f36c (10807d3 is docs only).
- **Hygiene draft:** 0 lines (0 accepted · 0 amended · 0 rejected). READ-MUTATED: none. check-wait-justification: PASS (32 of 88 carry a wait, 0 warn). check-engineering-zero: PASS, 0 findings and 0 unreadable for this lane.
- **Ledger delta (`continuity-edit`):**
  - I-075: note appended (build, live reads, walk verdict).
  - I-075: re-dated 11-13 → **11-17**, for a re-walk with a FRESH walker on the same prompt and the same bar (`docs/walks/2026-11-13-i075.md`). HELD closes the row. NOT HELD or AMBIGUOUS again takes the recorded-decision path, with both walks as the reason. Any new wording goes through round 0 first.
  - I-075: linkedCommits set to badd80e and bd23f36.
  - I-077: note appended with the walker's height remark ("reads as 'equally strong'"), as input for its 11-19 re-check.
- **Pre-session working-tree files:**
  - `continuity/continuity-disposition-events.jsonl` is committed. Its 4 lines are 11-12's close edits (the I-077 and I-078 re-dates and notes), which were never committed.
  - `continuity/read-outputs/I-027.partial.txt` is deleted. It was an 11-03 `--run` killed at its cap, 0 bytes, self-labelled "NOT a reading".
- **Due-gate verification: UNRESOLVED.** The no-flag `check-due-gates-dispositioned` (the snapshot comparison) was refused by the Claude Code permission classifier at the close, and it was not retried. The read-only `--print` gave "0 gate(s) due on/before 2026-11-13 … RESULT: PASS". The morning snapshot held I-075 alone, and I-075 is now re-dated to 11-17.
- **Pending reads:** 11-15 I-049 · 11-16 I-051 · 11-17 I-075 (re-walk), I-081 · 11-18 I-071 · 11-19 I-077, I-078.
- **Receipt:** P3's line stands unchanged. Exposure is blind (bug row I-075), and no outcome read exists.. Round 0 is same-family by rule (`codex-review.md` § 2); Codex reviews the words at P3.
