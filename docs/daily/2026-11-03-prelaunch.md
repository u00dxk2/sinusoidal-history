# sinusoidal-cycles — 2026-11-03 (Tuesday, MT) — full day

## BLUF

Full day (the orchestrator's kickoff: "FULL day across the portfolio"). **I-063 shipped and CLOSED, live d592db70, CI green.** The phone home figure's caption now reads "Peaks chosen · no cycle confirmed" on the first screen at 320, 360 and 390. The fold is unchanged (13 of 13), and the pre-registered first-screen walk HELD narrowly (synthetic N=1). Encounter blind. The P1 selection follows. An evangelism pass is DUE (`check-cycle-rotation --lane sinusoidal-cycles` exit 3: "P3 IS the pass"), so today's P3 is that pass. **P1 selected I-063:** on a phone, the home glance figure's nine humps between 1945 and 2020 read as "the cycles agree" until the reader reaches a line that is not on the first screen. The decision owed today is the lane's own (A: say it on the first screen, or B: record that second-screen placement meets the row). P1 picks A, and tries it first at zero layout cost by using the figure's one-line caption, the one line every phone width already shows. B is the fallback if no honest wording fits that line. Section 0 is clean: CI GREEN on 10eb344b, deploy in sync, Codex probe GREEN, harness UNIFORM on 2.1.317. Nothing waits on David. The W-006 Search Console read ran for the first time and meets its close condition (/about 3 impressions dated after 10-31).

## What changed

[P3 — Product-work loop]

**I-063 shipped and CLOSED (evangelism pass).** Kind: improve. Manager review: APPROVE (9172429e).

- **Commits:** 0009f81 (`glanceCaption` in `src/lib/overviewReading.ts`, wired into `CycleOverview.tsx`, test legs), d592db7 (Codex r1: "no cycle", not "none"; the test's path resolved from its own file). CI ci.yml green on d592db7.
- **Before → after:** the phone glance figure's caption, its one line on every phone's first screen, read "Theory shapes · none confirmed". It now reads **"Peaks chosen · no cycle confirmed"**. The clarifying sentence under the strip was below the fold (top 897px at 390x664, measured on production this morning), so before this change a reader at scroll 0 saw the bunched humps with nothing saying why.
- **Budget, measured not estimated (production, Playwright):** the caption box is 288px at 320, 328px at 360 and 358px at 390, and the font sets 8.58px per character, so the budget is 33 characters. The shipped caption is 33 characters and 283.1px. That confirms the manager review's hypothesis of "30-33 characters".
- **Not gated on `glanceClusterLine` (the review's suggestion, checked and declined):** "chosen" holds at every range and calibration, since a stored peak is a theorist's date or this site's choice and a calibrated one is the reader's. Gating it would make the caption flip on a zoom for no gain in truth. Codex r1's claims pass agreed: "Keeping the caption when `glanceClusterLine` becomes null is logically sound."
- **Instrument:** `src/lib/overviewReading.test.ts` → `glanceCaption`, 4 legs (the wording, the fallback, the 33-character budget in both states, and the source wiring). Red-armed: lengthening the fallback to 35 characters gave "2 failed", including "expected 35 to be less than or equal to 33"; restored, 16/16. Ceiling, stated in its header: a character count, not a rendered width, so a font or tracking change voids the budget.
- **Codex, read-only, foreground pipe, banner `workdir: C:\dev\skylark\sinusoidal-cycles` checked both rounds:**
  - r1 on 0009f81, REJECT: MED, STATIC, CONFIRMED: beside "Peaks chosen", "none confirmed" reads as "none of the peaks", while the verdict is about cycles. Fixed in d592db7. LOW, REPRODUCED, CONFIRMED: the cwd-relative test path; fixed in d592db7.
  - r2 on d592db7, REJECT: both fixes confirmed (the test also passes run from `src`). MED, STATIC: "no cycle confirmed" claims more than "this site has not tested them". **DELIBERATE:** the scope is the one live since I-048 (the old caption's "none confirmed", and the visible verdict line "None of these ten is confirmed: …"), and this diff does not widen it. Its suggested "cycles not tested" would erase the site's deliberate split between "Not testable" (nine) and "Not tested". The calibrated-state half of that finding (the verdict shows over reader-moved curves that were never assessed) is **PLAUSIBLE and pre-existing**, so it is carried to the close as a candidate row, not reworded under review (portable rule 2).
- **Delivery:** `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live d592db70 = head. Production reads after the deploy: the caption is one line at 320, 360 and 390 (283.1px; top 292, 292 and 328px). `check-entry-folds`: 13 of 13 at 320x568 (home 12px spare) and 360x560 (home 4px), both unchanged from this morning's baseline. `check-strip-near-chart`: TOGETHER, 131px spare.
- **Walk:** `docs/walks/2026-11-03-i063.md`, pre-registered before the push, first screen only, at 390x664 on production d592db70. Synthetic N=1. **HELD, narrowly.** (3) "Partly": "the picture suggests clustering, but the text says it should not be trusted as evidence". (4) "someone picked where each peak goes, so the positions are choices, not measurements".
- **Not done:** the cos-math audit was not run, because no year-position claim was added. No mirror sweep was needed: grep "none confirmed" over the repo (excluding docs/continuity) hits only `CycleOverview.tsx`.
- **Encounter:** blind. The caption renders client-side and the site has no client analytics (standing choice). A `/` impression in Search Console is exposure to the page, not a read of the caption.

USER-VISIBLE: A phone reader of the home page now sees, on the first screen above the ten bunched curves, "Peaks chosen · no cycle confirmed" instead of "Theory shapes · none confirmed", so the bunching is labeled as chosen anchors before any scroll — d592db7 [proof: production caption read at 320/360/390 went from "Theory shapes · none confirmed" (this morning, 10eb344b) to "Peaks chosen · no cycle confirmed", one line, top 292-328px, live d592db70 in-sync per check-deployed-sha-drift; pre-registered first-screen walk HELD] [coverage: Search Console page impressions (gsc-read.mjs) · last good read 2026-11-03 · founder+test excluded no] [exposure: blind — the caption renders client-side and the site has no client analytics by standing choice, so no instrument sees a reader of it · bug row I-063]

<!-- findings:begin -->
- The 10-30 note on I-063 said "rows + line share one 390x664 window (599 of 664px)". At scroll 0 that is not a first screen: the line's top is at 897px. The 10-30 walker was right that the line was on the second screen.
- The walk's residuals: "Peaks chosen: chosen by whom?" (I-072's answer sits on the second screen); "one has no record on this site: which one?"; the hump heights have no label. These are candidates for the close, not fixed today.
- Codex r2's calibrated-state point: after a reader moves a peak in Calibrate, the caption and the verdict line still say "no cycle confirmed" over curves no verdict assessed. This is pre-existing, from I-048. It is a candidate row for the close.
<!-- findings:end -->

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** I-063, the home glance figure says on its first screen that its peak years are chosen anchors, not agreement. Kind: improve. Run as today's evangelism pass.
- **User problem, in a reader's words:** "Nine of the ten humps bunch between 1945 and 2020, which looks like convergence until you read the note." (W2, `docs/walks/2026-10-22-i061-production.md`). And on 10-30, after the current line shipped: "a reader who stops at screen 0 gets the bunched picture with no reason for it" (`docs/walks/2026-10-30-i063.md`). The bar names overclaiming as what breaks the would-tell-a-friend moment (`docs/evangelism-bar.md`), and a picture that looks like agreement makes that overclaim with no sentence at all.
- **Evidence:**
  - OBSERVED · Search Console, page-grouped (`gsc-read.mjs --start 2026-10-04`, read today) · all search visitors · 10-04..11-03, lags ~3 days: 88 impressions, **1 click, and that click landed on `/`** (13 impressions, position 3.8). /cycles was shown most (33, position 7.3, 0 clicks). The home page is the only page a real search visitor reached in 30 days. Limit: page totals only, and the list is truncated (TOTAL is whole).
  - OBSERVED · synthetic cold walkers, not real readers · N=3 · 2026-10-22 (W1, W2, production 5274fce7, 390x664) and 2026-10-30 (production fdcef477): all three read the bunching as convergence on the figure's own screen. The 10-30 walker said the clarifying line ("…anchors, set by the theorists or by this site, not evidence that the cycles agree") was right but sat on the second screen.
  - OBSERVED · source: the clarifying line renders phone-only under the range strip (`Viz.tsx:108`, `glanceClusterLine`). The figure's caption (`CycleOverview.tsx:112`, "Theory shapes · none confirmed") is one line and is the only first-screen text the figure carries at 320x568 (12px spare there per `check-entry-folds`; 9px at 360x560 per `check-strip-near-chart`).
  - HYPOTHESIS · that one honest caption line can carry "the peaks are chosen" without growing past one line at 320px (11px mono uppercase, 0.18em tracking). If it can't, option B is recorded instead.
  - MISSING · real-user evidence of how anyone reads the figure. The bar reads UNMEASURED (no client analytics, by standing choice).
- **Prior-retro finding that bears on this:** 10-31 retro Q0, recurred 11-01, still on discipline: "prose that describes an interaction needs its own source check". Any caption word is checked against `glanceClusterLine`'s own null rules (moved peak, brushed range, no bunching) before it ships, and Codex gets the claims pass (portable rule 6).
- **Permission:** I-063 is `monitoring`, P3, owner sinusoidal-cycles. The 10-30 manager review (29e8d250) recorded the 11-03 decision as "the lane's, a layout trade on its own page, not David's". No board card is open on it (`answered-cards`: none). Decision class: lane copy and layout on its own page, inside I-061's "no present position" ruling (the caption names no year and no position).
- **Next action:** kind = improve. First command, re-measure the phone first screens on production before touching the caption (baseline for the fold budget):

  ```
  node C:/dev/skylark/sinusoidal-cycles/scripts/check-entry-folds.mjs https://sinusoidalhistory.com --width 320 --height 568
  ```

- **Acceptance condition:** at 390x664 on production, the first screen (scroll 0) shows a sentence saying the peaks are chosen anchors and not evidence of agreement. `check-entry-folds` stays 13 of 13 at 320x568, 360x560 and 390x664, the caption stays one line at 320, and one pre-registered cold walker at 390x664 on production does not read the figure as convergence from the first screen alone (I-063's closeWhen, as written). Or, if no honest wording fits: option B recorded on the row with the measured reason.
- **Delivery and encounter checks:** delivery is `check-deployed-sha-drift --service sinusoidal-history` in sync on the fix sha, plus a production Playwright read of the caption text and its line count at 320/360/390. Encounter: `/` impressions in Search Console dated after the deploy are exposure to the page, not a read of the caption. At ~13 impressions a month, the first is expected within days, and a click on `/` is the event that would mean someone saw it. The figure renders client-side, so a reading of the caption itself stays blind.
- **USER-FACING: yes.** Paths: `src/components/CycleOverview.tsx` (caption), possibly `src/lib/overviewReading.ts` (a caption helper beside `glanceVerdictLine`, so its null rules match the line's). Internal: a test beside `src/lib/overviewReading.test.ts`, `continuity/items.json`, `docs/walks/`.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice, 5 of 6 due (`check-due-gates-dispositioned --snapshot`, "6 gate(s) due on/before 2026-11-03"): I-027, I-043, I-049, I-068, W-006. W-006's read ran today (stamped): /about 3 impressions in 11-01..11-03, which meets its close condition. Its I-070 leg (`/` impressions dated 11-02+) has 0 so far, so that leg re-checks 11-05 per its notes.
  - (b) owed child rows: none. Read: the kickoff's skylark-site ledger read, "0 of 786 considered".
  - (c) state reads marked CROSSED: none carry a CROSSED marker. Read: every kickoff state read. The non-zero ones: dated gates 6 due (of 81 swept); prior-day retro 7 still-on-discipline of 7 tagged; report artifact PENDING (this file); key metrics "no list yet" (not measured, not 0).

## State Appendix

- **Section 0:** primer `docs/cold-starts/2026-11-02.md` read (no 11-03 primer; 11-02 is the newest). Listener: 🟢 SSE alive (pid 48700, hello 14:43:42Z, replay 1) + loop armed by `ScheduleWakeup` (`/loop-tick 2m`); waker ranks 1-3 running. Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, 14:27:52Z). CI: `check-ci-status --workflow ci.yml` → GREEN on 10eb344b. Drift: `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live 10eb344b = head. Harness: running 2.1.317 · fleet UNIFORM (27 of 27) · installed 2.1.317 (SAME).
- **North Star:** the binding constraint is retention and word of mouth (product-love). This ship reports unmeasured on that axis. Its proof is the first-screen read and a cold walk.
- **Recs yesterday:** the 11-02 Recommendation block was the I-069 packet, executed (I-069 closed, 55d246d live).
- **Rotation:** `check-cycle-rotation --lane sinusoidal-cycles` exit 3: "evangelism-pass DUE — P3 IS the pass (run /evangelism-pass); fleet cycle 44d since 2026-09-20".
- **Prep (no commit), baseline:** `check-entry-folds.mjs https://sinusoidalhistory.com --width 320 --height 568` → "OK: 13 of 13 entry-page legs answer on the first screen", home 12px spare (tightest: /cycles/perez 5px).
- **Bus:** P1 task-complete 7a02fe5c; listener-confirm status 25bf6386.
- **Due-gates snapshot:** `check-due-gates-dispositioned.mjs --snapshot` → "snapshot written — 6 gate(s) due on/before 2026-11-03" (I-027, I-043, I-049, I-063, I-068, W-006).

## Close

[P5 — Delta-only close]

ACTION: COMPLETED · item I-063 · P3 455a5323

- **Acceptance:** met, per manager review b17b6181 ("COMPLETED"). It took its own 320x568 production read: the caption sits at top 292, one line, visible. "no cycle confirmed" is accepted as the equivalent of "none confirmed".
- **Since P3:** the walk doc's time was wrong ("~09:50 MT"); the walk ran ~08:40 MT, now corrected. Status c206deaf ("P5 not queued +30m") gave the P3 time as 14:43Z; the correct time is 15:43Z (08:43 MT), and 1e9edcc3 corrects that claim. Nothing user-facing changed after P3.
- **Walk ceiling (review):** walked at 390x664 only; 320x568 was measured, not walked. At 390 the full verdict sentence was also on screen (y≈620). At 320x568 it sits just below the fold (top 584), so the smallest phone gets the caption alone. This is written into I-063's notes.
- **Hygiene draft:** 5 lines, 4 accepted · 1 amended · 0 rejected.
  - I-027 ACCEPTED, closed (npm audit: 0 high, 0 critical). The 16 moderate are a different advisory (minimatch, dev-only, no non-breaking fix); no new row.
  - I-043 UNDECIDED → AMENDED to (a), re-dated 11-05. This is the fourth re-date, so the next full day selects it or records a decision.
  - I-049 ACCEPTED → 11-06.
  - I-068 ACCEPTED → 11-06.
  - W-006 ACCEPTED → 11-05. The I-072 leg is met (/about 3 impressions); only the I-070 `/` leg remains.
  - READ-MUTATED ×3 on I-027 (`src/components/CycleOverview.tsx`, `src/lib/overviewReading.ts`, `src/lib/overviewReading.test.ts`): all three are this lane's own 0009f81, committed during the read window. `npm audit` writes no source; status af3670d6.
  - check-wait-justification: "RESULT: PASS — 32 of 81 row(s) carry `waitJustification`; 0 warn / 0 info". check-engineering-zero: "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable".
- **Ledger delta:**
  - Closed: I-063, I-027.
  - Re-dated: I-043 and W-006 → 11-05; I-049 and I-068 → 11-06, each with a notes line.
  - Minted as candidate rows on the review's instruction: I-075 (who chose the peaks, 11-10), I-076 (which cycle has no record, 11-10), I-077 (unlabeled hump heights, 11-12), I-078 (calibrated-state verdict scope from Codex r2, P4, 11-12).
- **Due-gate verification:** `check-due-gates-dispositioned.mjs` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned." · "snapshot: tmp\due-gates-snapshot.json — CURRENT (taken 2026-11-03)".
- **Receipt:** P3's receipt stands unchanged (exposure blind · bug row I-063; no outcome read exists beyond the synthetic walk).
- **Pending reads:** 11-04 I-032, I-071, W-005 · 11-05 I-043, W-006 (`/` leg) · 11-06 I-034, I-049, I-068 · 11-09 I-074 · 11-10 I-075, I-076 · 11-12 I-077, I-078 · 11-16 I-051 · 12-01 I-025, I-042, I-073.
- **UNRESOLVED:** none.
- **codexCalls:** 2 (both at P3; none at the close).
