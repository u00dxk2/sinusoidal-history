# sinusoidal-cycles — 2026-11-19 (Thursday, MT)

## BLUF

**P3 shipped it, live at 44cb739 (CI ci.yml green on 44cb7395d1, deploy in sync), and the cold walk held both rows. I-077 and I-078 are closed.** What changed for visitors:
- **Home phone verdict line:** "None is confirmed: nine pairings fall short of this site's three-period rule, and Turchin (50y) has no paired series."
- **The nine paired cycles:** "Not testable on its paired record".
- **Turchin's fathers-and-sons cycle:** "No paired data series", plus a paragraph on the five cross-grid checks of its 50-year period.
- **A reader-set period:** the line and every drawn verdict say the verdicts are for this site's own periods.

The order held: round 0, then a Codex claims pass on the fact list, then the words. Four Codex rounds followed, and r4 found every claim in scope HOLDS. On the live site, all four checkers were RED before the deploy and GREEN after. The phone folds pass at three sizes, and the verdict line wraps exactly as the old one did. SCREENS.md: DONE 8 · NEXT 6 · HOLD 0 · N/A 7.

**P1: today's change is the wording on the home chart's verdict line and on every "Not tested" answer, so that each says only what the record supports (I-078), with I-077's hump-height question read in the same cold walk.** Nothing a visitor sees has changed yet. In an earlier round Codex refuted two live sentences: the glance line "nine cannot be tested on the record that exists", and the bare "Not tested" on /cycles/turchin-fathers-sons. Today's read adds a finding. The same "Not tested" claim is also served on the /cycles index, the /methods verdict table and `public/methods.md`, so that is five surfaces, not one. The order is binding: round 0 (a fact list), then a Codex claims pass on the fact list, then the words. Section 0 is clean: CI is green on a4d2a4aba5, the deploy is in sync, and the morning snapshot shows 2 due (I-077, I-078). The packet is under Recommendation and is waiting for the manager review.

## What changed

**P3 (I-078 with I-077's question; manager review APPROVE 2b897a28).**
- **Commits:** 885435a (the words), 811be28 (Codex r2: one rule scopes every drawn verdict to the stored period, by id), ac8d40b (r3: facets hand their verdict lines the drawn cycle; llms.txt inventory narrowed), 44cb739 (r4 test bounds). The shape changed at r2 because the calibrated-scope defect appeared a second time. The prop threading was reverted, and one helper, `shownHeadline`/`shownDetail` in `holdsUp.ts`, compares each drawn cycle with its stored one.
- **Codex (read-only, banner workdir `C:\dev\skylark\sinusoidal-cycles` checked on every run):**
  - claims r1 on the round 0 fact list: 51 facts, 44 HOLDS, 6 REFUTED-AS-WRITTEN.
  - r2 on 885435a: 8 findings (1 HIGH).
  - r3 on 811be28: 5 findings (1 HIGH).
  - r4 on ac8d40b: the condition is met and every claim in scope HOLDS; 1 LOW in a test.
  - Outputs are in `docs/claims/`, and each finding's fate is in its commit message.
- **Tests:** 293 in the 14 touched files pass locally. Red-armed three times: the calibrated line forced off gave 1 failure, `shownHeadline` forced stored gave 3, and HoldsUpLine back on the stored cycle gave 2. Each was restored to green. New: `calibratedVerdict.test.ts`, which renders CycleFacet at Perez 52y, where HATCH covers 3.04 periods.
- **One runner, one admit each:** `docs/claims/run-i078.mjs`.
  - Before the deploy, the four checkers were RED on production: holds-up-line exit 3 (0/46), verdict-phone 3, verdict-landing 3, open-card-position 1.
  - On a flag-on local build of 44cb739 all four were GREEN, holds-up-line 46/46.
  - `--live` after the deploy: all four GREEN.
- **Layout (manager condition):** the caption is 1 line at 390x664, 360x560 and 320x568. The verdict line is 2 lines at 390x664 (y 579-615, first screen), and 3 lines at 360x560 and 320x568 (y 547-601). That matches production's pre-change line, read before the deploy: 2/3/3 at the same y. The runner first asserted "at most 2" at every size, which was the runner's error, and the bar there is now "no more lines than before".
- **Delivery:** `check-deployed-sha-drift --service sinusoidal-history --wait --sha 44cb7395…` printed "in-sync live 44cb7395 → head 44cb7395". A signed-out GET of /cycles/turchin-fathers-sons returned 200, with "No paired data series." and "none is a test of this cycle" in the HTML. "Not tested." no longer appears on that page.
- **Walk** (`docs/walks/2026-11-19-i077-i078.md`, pre-registered, synthetic N=1): I-077 HELD ("The height means nothing measurable", quoting "height: shape, not size"). I-078 HELD (home: "nine … fall short of a 'three-period rule'"; fathers-and-sons: names no paired series and the five period checks, and quotes "none is a test of this cycle").
- **Carried (LOW, today's roster unaffected):**
  - a significant or null p would drop the unpaired paragraph;
  - /cycles and VerdictTable infer "no pairing" from a missing verdict row;
  - check-open-card-position's oracle is a substring match;
  - the walker's "failed or couldn't be tried?" and its unexplained terms ("three-period rule", "paired record", "cross-grid", "noise model").
- **Receipt:** USER-VISIBLE: the home verdict line, the nine paired headlines and the unpaired Turchin page now say only what the record supports ("nine pairings fall short of this site's three-period rule", "Not testable on its paired record", "No paired data series" with its five period checks), and a reader-set period names the stored one — 44cb739 [proof: production said "nine cannot be tested on the record that exists" / "Not tested" before → after the deploy, drift in-sync live 44cb7395, a signed-out GET shows "No paired data series." and "none is a test of this cycle", and run-i078.mjs --live has all four checkers GREEN] [coverage: Search Console page-only (gsc-read.mjs) · last good read 2026-11-18 · founder+test excluded no] [exposure: blind — no client analytics or visitor instrument by standing choice; Search Console shows impressions, never a read · bug row I-087]

## Recommendation

### P1 selection packet
[P1 — Evidence and choice]

- **Outcome:** the home chart's verdict line and the "Not tested" answers say only what the record supports, and the home chart's HOLD row (I-077/I-078) closes with a cold walk. Items **I-078** (words; selected) and **I-077** (hump height; read in the same walk). Kind: improve.
- **The user problem, in a reader's words:** the bar's own (HYPOTHESIS, `docs/evangelism-bar.md:14`): "I can't tell whether any of it holds up or is just a good story." What breaks the moment is "any sentence that overclaims" (`:24`). Two live sentences overclaim in the "nothing was checked" direction, refuted by Codex on 237aaba (I-078 notes): a reader told "nine cannot be tested" and "Not tested" is told less was checked than was.
- **David's direction** (chat, 11-18, quoted in the kickoff): "We'll continue with the design / copy updates tomorrow please make sure we stay on track with that tomorrow."
- **Evidence:**
  - OBSERVED · I-078 readCommand, run 15:4xZ today, exit 0: `overviewReading.ts:156` still builds "… cannot be tested on the record that exists", rendered visibly at `CycleOverview.tsx:165-171` (`data-glance-verdict`); `holdsUp.ts:24` `NO_SERIES_HEADLINE = "Not tested"`; the caption call is `CycleOverview.tsx:121` `glanceCaption(verdictLine, peaksMoved)`. Both refuted sentences are in source at HEAD a4d2a4a, which is what production serves: `check-deployed-sha-drift --service sinusoidal-history` → "in-sync live a4d2a4ab → head a4d2a4ab".
  - SUPPLIED (Codex r1 on 237aaba, not re-run today) · (a) the glance line is broader than the data: a re-paired record was eligible and tested (Dalio × V-Dem, 3.15 periods, `public/data/spectral/verdicts.json:627`) [linter-report]. (b) "Not tested" on /cycles/turchin-fathers-sons: five secondary tests ran at that period. Round 0 re-reads both against source before any word.
  - OBSERVED (new today) · the "Not tested" claim is on more surfaces than I-078 names: `src/app/(app)/cycles/page.tsx:67` ("Not tested: there is no paired record to test it against."), `src/components/VerdictTable.tsx:78,156` and its mirror `public/methods.md:157` ("Not tested — no paired series"), plus the card/box via `holdsUp.ts:24`. If (b) holds, it holds on all of them. Checkers that pin the old string: `check-holds-up-line.mjs:84`, `check-open-card-position.mjs:56`, `check-verdict-phone.mjs:95`; tests `holdsUp.test.ts:54`, `overviewReading.test.ts:146-208`, `cyclesIndexVerdict.test.ts:126`, `spectral.test.ts:29`.
  - OBSERVED · coupling: `glanceVerdictFromHeadlines` parses headlines by string equality with `NO_SERIES_HEADLINE` (`overviewReading.ts:152`), so changing that constant changes the home verdict line's logic; the two must move in one commit.
  - OPEN (round 0 question) · whether refutation (a) also reaches the per-page `NOT_TESTABLE_HEADLINE` "Not testable on the record that exists" (`holdsUp.ts:21`) on the nine paired pages. Not assumed either way.
  - OBSERVED · I-077: the label "height: shape, not size" was added in cdb4bda (range cdb4bda..626ce16) and is rendered at `CycleOverview.tsx:140-147` on HEAD. The 11-13 walker (synthetic N=1, `docs/walks/2026-11-13-i075.md`) read it correctly ("Every hump has the same height, which the note says means nothing") and also wrote that the equal heights "read as 'equally strong'". No walker has been asked I-077's question directly (n=0 since 11-12).
  - OBSERVED · budgets: phone caption 33/33 chars at 320; the verdict line has a two-line budget (`overviewReading.ts:137-146`). I-077's fold read (`check-entry-folds … --width 320 --height 568`) re-run today through heavy-gate: 13 of 13 (heavy-gate admitted after 8m25s): / 49px, /cycles 30px, /methods 1px, /cycles/turchin-fathers-sons 44px, /cycles/perez 0px spare.
  - OBSERVED · rotation: `check-cycle-rotation --lane sinusoidal-cycles` exit 0, "no product-love cycle picks this lane today … run the normal P3".
  - MISSING · `docs/evangelism-evidence.md`, `docs/key-metrics.json`; the bar reads UNMEASURED (`evangelism-bar.md:30`). No client analytics or visitor error instrument, by standing choice: an encounter read is blind.
  - HYPOTHESIS · that any reader has misread either sentence. No reader is on record; this is the bar's overclaim rule applied to Codex's refutation, not an observed failure.
- **Why not the others:** the SCREENS.md NEXT batch (/methods, embed, poster, share card, cycle-page type sizes) is dated 11-24 on I-087; /methods needs words, so it would carry its own round 0. The home chart is the most-seen surface and is HOLD on exactly these two rows.
- **Prior-retro finding that bears on this** (11-18 Q0, still on discipline): "a check that passed for the wrong reason." Here: three checkers pin the old "Not tested" string, so they will go RED on the new words for the right reason and must be changed with the words, each red-armed against production before the deploy and green after.
- **Permission:** lane-owned copy; no sign-in, payment, account or data screen. No open card names it (`answered-cards --project sinusoidal-cycles`: 0 lane cards, 6 portfolio riders, all skylark-site, 0 new). The order is binding on the row: round 0 → Codex claims pass on the fact list → words.
- **Next action:** kind = improve. Prep now (no commit): round 0 — a fact list with file:line for every surface and every count the new words would state (secondary tests at 50y, the re-paired eligible rows, per-surface wording), then the Codex claims pass ON THE FACT LIST (read-only, banner workdir checked). First command:

  ```
  git -C C:/dev/skylark/sinusoidal-cycles grep -n -e "Not tested" -e "cannot be tested on the record" -e "NO_SERIES_HEADLINE" -e "NOT_TESTABLE_HEADLINE" -- src public scripts
  ```

  At P3: the words from the held facts, in one commit with every pinned test and checker; one flag-on local build + Playwright runner in ONE heavy-gate admit (`--mem 3`); Codex read-only diff review; CI green; deploy; signed-out GETs; then ONE cold walk, glance-first, asked both what the verdict line says was checked and what a hump's height means (I-077's closeWhen copied verbatim into the bar), written to `docs/walks/2026-11-19-i077-i078.md`.
- **Acceptance condition:**
  1. On production, the home glance verdict line and every "Not tested" surface listed above carry the claims-pass-held sentences; `git grep` for the two refuted phrases in `src` and `public` returns only test/history lines.
  2. `check-entry-folds --width 320 --height 568` reads 13 of 13 with the home leg keeping ≥ its measured spare; the verdict line stays within two lines at 320.
  3. `check-holds-up-line`, `check-verdict-phone`, `check-open-card-position` red on production before the deploy, green after.
  4. `public/methods.md` changes with `VerdictTable.tsx` in the same commit; `public/llms.txt` swept.
  5. I-078's calibrated-state question gets a test or a recorded decision (closeWhen).
  6. I-077: the walk answers the height question, or a recorded decision on the drawing with the reason.
  7. CI green on HEAD; drift in sync; SCREENS.md home-chart row leaves HOLD.
- **Delivery and encounter checks:** delivery = `check-deployed-sha-drift --wait --service sinusoidal-history --sha <full sha>` in sync, then signed-out GETs of `/`, `/cycles`, `/cycles/turchin-fathers-sons`, `/methods`. Encounter: Search Console page-only on `/` and `/cycles/*` (`gsc-read.mjs --start 2026-11-19`, readable ~11-24); it shows only that a page was shown. A reader's reaction is not readable at any N this month.
- **Key number:** live sentences that Codex refuted and that are still served: 2 named on I-078, on 5 surfaces (home line; box/card; /cycles index; /methods table; methods.md). Target 0.
- **USER-FACING: yes.** Paths: `src/lib/holdsUp.ts`, `src/lib/overviewReading.ts`, `src/app/(app)/cycles/page.tsx`, `src/components/VerdictTable.tsx`, `public/methods.md`, possibly `public/llms.txt`; tests and checkers above. Internal: `continuity/items.json`, `docs/SCREENS.md`, `docs/walks/`, this report.
- **Section 0:**
  - Listener 🟢: SSE hello 15:30:44Z, replay 0; loop armed by ScheduleWakeup; waker rungs 1-3 running.
  - CI: `check-ci-status --workflow ci.yml` → GREEN on a4d2a4aba5.
  - Drift: `--service sinusoidal-history` → in-sync, live a4d2a4ab = head.
  - Codex: GREEN, from the kickoff probe (machine-level exec and write, 15:27Z).
  - Harness: running 2.1.328 · fleet UNIFORM (28 of 28) · installed 2.1.328 (SAME).
  - Morning snapshot: "2 gate(s) due on/before 2026-11-19" (I-077, I-078).
  - Free memory 16.4 GB (17,235,496 KB).
- **Recs yesterday** (11-18 report and close):
  - I-077 / I-078 in their order: carrying today → this packet.
  - `holdsUp.test.ts:54` with I-078's words: carrying → P3.
  - /methods kicker and lede re-budget, I-087 NEXT batch, dark-mode cycle colours: carrying → 11-24, not today.
- **HYGIENE INPUTS:**
  - (a) Due rows not bearing on the choice: none — read `check-due-gates-dispositioned --snapshot` (2 due, both selected).
  - (b) Owed child rows: none — read the kickoff's "rows owed to you in skylark-site's ledger: 0 of 850 considered".
  - (c) State reads marked CROSSED: 2. (1) "dated gates due today: 2" — I-077, I-078, both selected. (2) "board cards carrying David's word: 7" — ba1578df, 3ef4f9e4, 4a0c2c7e, 5d126063, d1748b4e, 9b5b8076, 4f38a7b7; all skylark-site, "governs: unlinked"; 9b5b8076 names this site only for its label on skylarkcreations.com. Disposition: read.

## State Appendix

- Kickoff body: verified (sha256 60feab65…, 43844 bytes).
- Due-gates snapshot: `tmp/due-gates-snapshot.json`, 2 due (I-077, I-078).