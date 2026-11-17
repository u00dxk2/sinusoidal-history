# sinusoidal-cycles — 2026-11-17 (Tuesday, MT)

## BLUF

**Round 2 (afternoon), the design and copy pass: P1 is done and nothing a visitor sees has changed.** Eight before frames from production are committed (`docs/design-pass-2026-11-17/before/`), with `docs/PRODUCT.md` and `docs/DESIGN.md`. The direction is the ten-channel chart-recorder strip, set in IBM Plex Sans Condensed and IBM Plex Serif. Every product fact in the proposed copy comes from a 120-line fact list that Codex judged before any words were written (97 held, 22 were narrowed, 1 could not be proved). Two findings for the review: the strongest headline states the 0-of-9 result and needs its own claims pass, and the live error screen names a cause ("Most likely a CSV failed to load") that source shows is false. P3 builds three variants behind a flag that stays off, and this lane's variant stays off until I-077 and I-078 are read on 11-19 even after David's pick. The round-2 packet is under Recommendation.

**P3 shipped it, live 379e33b6 (CI ci.yml green on 379e33b60d, deploy in sync).** On production /cycles, the Kondratiev and Turchin entries now say in the verdict line itself why the record judged differs from the series drawn. That was 2 of 9 entries with no reason before, and 0 of 9 after. The words came from a round-0 fact list, and a Codex claims pass on the uncommitted diff found all 11 clauses HOLD. The new source-pinned test is red on the prior tree (3 of 27 failed). Home, /cycles/kondratiev, /cycles/turchin and the share card are unchanged: identical text, and an identical share-card PNG hash. `check-entry-folds` 320x568 reads 13 of 13 with /cycles at 7px spare. Encounter blind; outcome open (I-083).

**P1 picked one change. On /cycles, the Kondratiev and Turchin entries will say, in the entry itself, why the record a verdict is judged on differs from the series the chart draws (I-083).** On production today, each entry names one series on its "Paired data" line and a different one on the verdict line under it, with no reason given. The reason sits about 4,000px lower. Kondratiev reads "US TFP growth (5-yr rolling)" and then "the record it is judged on, US TFP growth (annual, unsmoothed), is 85 years too short". /cycles is the site's most-shown page (22 of 46 impressions, 10-31..11-14). Round 0 is dispatched. No words exist yet, and nothing is built until the review.

**The I-075 re-walk ran and came back AMBIGUOUS again.** A fresh walker at 390x664 on production (f5eb87d6) said "I can't tell for sure, but I lean towards 'this website'", citing "SITE'S PEAKS · NO CYCLE CONFIRMED". This is the same shape as 11-13. Per the row's own note, I-075 takes its recorded-decision path at the close, with both walks as the reason. Section 0 is clean: CI green on f5eb87d65a, deploy in sync.

## What changed

**P3: the Kondratiev and Turchin /cycles entries say why the judged record differs (I-083).** Manager review db248f7a: APPROVE. It added one acceptance check, that the home first screen and the share card read the same after the deploy, and a HYPOTHESIS that the reason, if placed in `holdsUp.ts`, would reach the layout and /og.

- **Code:** bb90e23 (the change) and 379e33b (the r2 test narrowing). A new field, `TestedSeriesNote.entryWhy` (`src/lib/testedSeries.ts`), is appended by `entryVerdict` (`src/app/(app)/cycles/page.tsx`) inside the existing verdict `<p>`, after the pinned "… is N years too short." sentence. The live words:
  - Kondratiev (`/cycles` snap :43): "The site's interactive chart draws the 5-year average named above; the verdict counts the yearly figures, because an average makes neighbouring years move together and would distort the background-noise model a test compares against."
  - Turchin (:127): "The site's interactive chart draws the whole series named above, from 1820; the verdict counts only the yearly record, which starts in 1913. The five points before it are rougher estimates from earlier historical sources."
- **Round 0 → words:** the helper's 46 fact lines. Its four open items were settled from source before any word was written:
  - the wealth CSV ends in 2024, so 1913-2024 is 111 years;
  - the manifest records `truncate_min_year: 1913` and no reason, so the Turchin sentence claims no cause for the cut;
  - Kondratiev's reason is the manifest's own TFP note (`analysis-manifest.yaml:134`);
  - the fold leg measures the first entry, which is unaffected.

  One self-caught narrowing: "The chart draws" became "The site's interactive chart draws". No /cycles entry draws a chart, and /cycles/turchin's own figure draws from 1913, so the bare form was false of that figure.
- **Manager HYPOTHESIS (holdsUp reaches the layout and /og): moot as built.** `holdsUp.ts:66-70` reads only `tested.name`, and `entryWhy` is read only at `cycles/page.tsx:71` (Codex r1 confirmed this statically). Live after the deploy: `/` "GREEN: identical visible text (24 lines)"; /og PNG sha256 `93392d8c…` before and after (100,686 bytes).
- **Codex r1** (claims pass, uncommitted diff on 752e15c; read-only foreground pipe; banner `workdir` `C:\dev\skylark\sinusoidal-cycles` matched; gpt-6-astra): 11 of 11 clauses HOLD. Findings, and what happened to each:
  - #1 Kondratiev "because" clause unpinned: CONFIRMED, fixed in bb90e23.
  - #2 wording pins, not source pins: CONFIRMED, fixed in bb90e23. The test now reads the build script's `WINDOW`, the manifest's pairing, transform, cut and TFP note, and the CSV's years.
  - Layout not seen by the test: DELIBERATE, owned by `check-entry-folds`.
  - Prior-tree red "not reproduced": REFUTED; I ran it at 10:24.
  - LOW: no share-card absence test: PLAUSIBLE, covered by the live /og hash read.
- **Codex r2** (commit bb90e23, same recipe, banner matched): three P2 findings, all the same class as r1 #2 (source pins incomplete). Per the stop-on-second-appearance rule, the test claims less instead of a third patch round (379e33b):
  - an `NA` point no longer counts: CONFIRMED and fixed;
  - the display TFP values' relation to the annual file: DELIBERATE, the build script writes both in one run;
  - the provenance prose: DELIBERATE, checked by round 0 and r1.

  The test comment now names both as not seen.
- **Red-armed:**
  - Prior product code (`git stash` of the two product files): 3 failed, 24 passed of 27.
  - `WINDOW = 5 → 7` in `build_us_tfp_growth.py`: "Expected: The site's interactive chart draws the 7-year average named above" (red).
  - `1850,NA` in the wealth CSV: "Expected: The four points before it are rougher estimates" (red).
  - Every mutation was restored with `git checkout`, and the tree was clean after.
- **Gates:** 149 of 149 in the four touched test files; eslint clean on the three files; `npm run typecheck` clean. CI ci.yml green on 379e33b60d.
- **Delivery:** `check-deployed-sha-drift --wait --service sinusoidal-history --sha 379e33b6…` → "OBSERVED after 1 poll(s) … live 379e33b6". The live `/cycles` snap (323 lines) carries both sentences. `/cycles/kondratiev` and `/cycles/turchin`: "GREEN: identical visible text" (103 and 102 lines).
- **Fold:** `check-entry-folds --width 320 --height 568` → "OK: 13 of 13". `/` is at 12px spare, `/cycles` at 7px (the closeWhen floor is ≥7), `/methods` at 1px.
- **Extremes, read by eye** (`docs/evidence/2026-11-17-i083/`): at 320 wide, Kondratiev's verdict paragraph is 173px tall (9 lines) and Turchin's 154px. At 1280, they are 77px and 58px. None overflows horizontally. The 320 paragraph is long but sits inside its own entry.
- **Encounter:** blind. There are no client analytics, by standing choice. Search Console sees /cycles impressions, never a read of one line. Bug row: I-083.
- **Sibling sweep:** the pattern is an entry naming two series without the reason. `judgedCut(` callers in `src/`: /cycles (fixed here), the cycle pages (they carry "Why two labels" and the "Judged on · why? ↓" link), `seriesOverlay.ts` (the key names the judged record) and `cycleRoutes.ts` (meta description). 0 other surfaces print both names with no reason.

P1 (selection and prep) is recorded below.

- **Section 0:**
  - Primer: `docs/cold-starts/2026-11-16.md` was read first. No `2026-11-17.md` exists.
  - Listener: 🟢 SSE alive (relaunched by the SessionStart hook, hello 16:29:18Z, replay 0) + loop armed by tool call. All three waker rungs are running. Rank 1 was relaunched after its wake-shorten exit that delivered this kickoff.
  - Codex: GREEN (kickoff probe 16:38:00Z: execute and write both proved). Not used at P1.
  - CI: `check-ci-status --workflow ci.yml` → "GREEN — 1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending" on f5eb87d65a.
  - Drift: `check-deployed-sha-drift --service sinusoidal-history` → "in-sync live f5eb87d6 → head f5eb87d6".
  - Harness: running 2.1.326 · fleet UNIFORM (28 of 28) · installed 2.1.326 (SAME). The tracked record still says 2.1.277, so the script prints CHANGED. That is a READ, not a stop.
  - Recs yesterday: 11-16 had two Recommendation blocks, both P1 packets. Round 1 (I-084): executed, live 293ecf51, closed. Round 2 (Dependabot #63/#64): executed, e3a9aa2, alerts fixed.
  - Engineering zero: `check-engineering-zero --project sinusoidal-cycles` → "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable, WAIVED by a live waiver" (#62 until 2026-11-28, W-007). The kickoff's glob/minimatch note adds no new alert here.
- **Morning snapshot** (`check-due-gates-dispositioned --snapshot`): "2 gate(s) due on/before 2026-11-17", I-075 and I-083.
- **I-075 re-walk** (`docs/walks/2026-11-17-i075.md`, frame `docs/evidence/2026-11-17-i075/first.png`). One fresh Sonnet walker, with the 11-13 prompt, instrument and bar unchanged. (4): "I can't tell for sure, but I lean towards 'this website'" … "the screen suggests the site chose or computed the peak positions, but it doesn't say how. I can't rule out the theorists having stated them." Judged **AMBIGUOUS**: the HELD clause is met, and the opening hedge is a NOT HELD clause. (3) PARTLY, citing the caption, so no regression on I-063. Unlike 11-13, this walker did not read the caption as "not ones the theorists named".
- **I-083 read** (`check-due-gates-dispositioned --run I-083`, exit 0, 3.6s, stamped): `/cycles` snap, 323 lines, `tmp/i083-cycles.txt`. Two entries have the split: Kondratiev `:42-43` and Turchin `:126-127` ("the record it is judged on, US top 1% wealth share (1913 onward), is 339 years too short" under "Paired data - US Top 1% Wealth Share"). The other seven read "its record is N years too short". The page footnote at `:285` says the cut is "named on that cycle's page".

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** on /cycles, the Kondratiev and Turchin entries each say why the record their verdict is judged on differs from the series drawn. Item **I-083**. Kind: improve.
- **The user problem, in a reader's words:** the 11-15 night walker (`docs/journey-walk-2026-11-15.md:13`, synthetic N=1) saw two different series named one line apart. No real reader has said it. In the bar's terms it is the moment-breaker: a sentence a reader cannot square with the one above it, on the page meant to resolve the argument (`docs/evangelism-bar.md:24`).
- **Evidence:**
  - OBSERVED · production `/cycles` text today (`check-rendered-text snap`, 323 lines): Kondratiev `:42` "Paired data - US TFP growth (5-yr rolling)", `:43` "…the record it is judged on, US TFP growth (annual, unsmoothed), is 85 years too short." Turchin `:126` "Paired data - US Top 1% Wealth Share", `:127` "…the record it is judged on, US top 1% wealth share (1913 onward), is 339 years too short." Population: all 9 paired entries. 2 of 9 have the split.
  - OBSERVED · source (11-16 P1, re-cited by the row): `Paired data - ${series.name}` at `src/app/(app)/cycles/page.tsx:328`; the verdict line from `entryVerdict` at `:63-69` via `judgedCut` (`src/lib/testedSeries.ts`).
  - OBSERVED · Search Console, page-only grouping, I-051's window 10-31..11-14: /cycles had 22 of 46 impressions, the most of any page. Shown, not read.
  - OBSERVED · `check-cycle-rotation --lane sinusoidal-cycles` exited 0: "no product-love cycle picks this lane today … run the normal P3".
  - HYPOTHESIS · that a reader who meets the two names reads it as an error and trusts the verdict less. Nobody real has been seen doing it.
  - MISSING · `docs/evangelism-evidence.md` does not exist. The bar reads UNMEASURED (`docs/evangelism-bar.md:30`). There are no client analytics, by standing choice.
  - MISSING · `docs/key-metrics.json` does not exist.
- **Why not the others:** I-075's walk is done and goes to its recorded-decision path at the close. It needs no build. I-077 and I-078 (11-19) change the phone home first screen and wait for that decision. I-071 and I-085 are dated 11-18. The SliderRow wrap at 320 wide is a layout nit that stays on screen (342 of 568). It goes on the hygiene list to be rowed, not built today.
- **Prior-retro finding that bears on this** (11-15 "round 0 before the sentence exists", still on discipline): round 0 was dispatched at P1, before any wording. The helper lists facts with file:line, never sentences.
- **Permission:** a wording change in a lane-owned page. The 11-15 pairing stays as it is; only the entry's words change. No open card names it (`answered-cards --project sinusoidal-cycles`: 0 lane cards, 3 portfolio riders, 0 new). Binding rules (memory `project_copy_rulings`): never say a test ran (the `TEST_RAN` guard covers /cycles); "Anything that names 'the record' routes through `judgedCut()`"; series `name` fields are not renamed. The change does not touch the home first screen.
- **Next action:** kind = improve. Round 0 (Sonnet, read-only, in flight) lists what each entry may truthfully say: the relation between drawn and judged series, the rule that picks the judged cut, and every other surface printing the pair. At P3: write the words from that list; put a source-pinned test red on the prior tree; run a cross-family claims pass (Codex) before the first commit; then build, deploy and re-read. The first command re-reads the row's own instrument after the deploy:

  ```
  node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles C:/dev/skylark/sinusoidal-cycles/tmp/i083-cycles-after.txt
  ```

- **Acceptance condition** (the row's closeWhen):
  1. On production /cycles, the Kondratiev and Turchin entries each say in the entry why the judged record differs from the series drawn.
  2. The words come from the round-0 list and pass a cross-family claims pass before the first commit.
  3. A source-pinned test is red on the prior tree.
  4. `check-entry-folds --width 320 --height 568` still reads 13 of 13, with /cycles spare at or above 7px.
  5. `/cycles`, `/methods` and `/about` keep their prose mirrors in step if any of them changes.
- **Delivery and encounter checks:** delivery means `check-deployed-sha-drift --wait --service sinusoidal-history --sha <full sha>` reads in sync, then the snap above shows the new words on both entries. Encounter: Search Console page-only impressions for /cycles over the next 14 days (22 in the last 14). That shows readers were shown the page, never that they read the line. At this traffic, a real reader is not readable.
- **Key number:** /cycles entries whose verdict line names a different series than its "Paired data" line with no reason in the entry. Today 2 of 9 (measured this round, production snap). Target 0 of 9.
- **USER-FACING: yes.** Paths: `src/app/(app)/cycles/page.tsx` (and possibly `src/lib/testedSeries.ts` or `src/lib/holdsUp.ts` if the reason is a shared string). Internal: a test under `src/lib/`, `continuity/items.json`, `docs/daily/`. To check at P3: `public/llms.txt` and the cycle pages' wording for consistency. /cycles has no .md mirror.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: 1. **I-075** (due 11-17): read today. The re-walk came back AMBIGUOUS, the second time, so the recorded-decision path applies (`docs/walks/2026-11-17-i075.md`). Read: `check-due-gates-dispositioned --snapshot` → "2 gate(s) due on/before 2026-11-17". Also one un-rowed carry: the SliderRow "Reference peak year" label wraps at 320 wide (11-16 close). The orchestrator's lead says to row it or fix it, so the close rows it.
  - (b) owed child rows: none. Read: kickoff "rows owed to you in skylark-site's ledger: 0 of 850 considered".
  - (c) state reads marked CROSSED: 2. (1) "dated gates due today: 2": I-075 above, and I-083, which is today's choice. (2) "board cards carrying David's word: 3": 21ece8d9 (deploy guard), 2cf09a9d (/draw), 3784317b (skylark-site leftovers). All three are skylark-site cards marked "governs: unlinked", and none names work for this lane. Disposition: read.

### P1 selection packet (round 2, design and copy pass)

[P1 — Evidence and choice]

Round 2, the design and copy pass (kickoff 988c345c). This P1 is the brief's steps 1 to 6. No CSS exists, no product file changed, and nothing a visitor sees changed.

- **Outcome:** a first-screen and one-flow redesign brief for Sinusoidal History, ready for three variants at P3 behind a flag that stays off. No ledger item: the round's lead names none. Kind: improve.
- **Scope:** the home first screen, and one flow state: the claim page `/cycles/dalio`, with its empty state (`/cycles/turchin-fathers-sons`, no paired record) and the error state (the 404 and `error.tsx`).
- **Before frames (step 1), committed:** `docs/design-pass-2026-11-17/before/`, eight PNGs from production (live f478ebd9), first viewport, 1440x900 and 390x844, one heavy-gate admit (35m57s in queue, "RESULT: PASS — 8 of 8 frames"). The four the brief requires: `home-1440.png`, `home-390.png`, `flow-cycle-dalio-1440.png`, `flow-cycle-dalio-390.png`. Also `empty-cycle-no-record-*.png` and `error-not-found-*.png` (HTTP 404). Script: `docs/design-pass-2026-11-17/capture-frames.mjs`; P3 uses the same script for the after frames.
- **PRODUCT.md (step 2):** `docs/PRODUCT.md`. Who and job are marked HYPOTHESIS (no real reader on record). Three voice traits, a tone rule each for error, empty and success, three anti-references, and the known and unknown lists.
- **How the known list was made:** round 0: helper 139 lines (120 facts, 19 unverifiable), each with file and line. Then a Codex claims pass ON THE FACT LIST, before any words (model gpt-6.2-sol, read-only foreground pipe, banner workdir `C:\dev\skylark\sinusoidal-cycles` matched): 97 HOLDS, 22 REFUTED-AS-WRITTEN each with a narrower sentence, 1 UNVERIFIABLE-HERE, 4 missing facts added. I took every narrowing as given and did not re-read its cited lines myself: each narrowed sentence claims less than the line it replaces, so using it is the safe direction. All 22 stay PLAUSIBLE until P3 re-reads the ones a shipped sentence rests on. The known list holds only HOLDS lines or the narrowed sentence.
- **Art direction (step 3):** world = the ten-channel chart-recorder strip. Five worlds listed in `docs/DESIGN.md` with why the tide table and the almanac were rejected (both are forecasts; this site states no present position, I-061).
- **Registry row:** posted d453461e (22:4xZ). My first draft picked Archivo and Literata from a checkout with no registry file; the orchestrator's notice 52dceef8 showed both claimed, so both were re-picked from the live registry before any CSS: display IBM Plex Sans Condensed 600, text IBM Plex Serif 400/600. Neighbour flagged for the orchestrator: sound-shapes' phonautograph (one stylus line on soot black). Mine differs on ground, grammar and motion; I re-pick the world if told it reads too close.
- **DESIGN.md (step 4):** `docs/DESIGN.md`. Amber #e9b942 as the one accent, on one action per view (today it is used only for text selection). Warm neutrals; the ten cycle colours are data ink only. Two families, three weights, self-hosted. Spacing 4 to 96 with steps of at least 33%. Radius 2px. No elevation shadow. Motion "ruling first, ink second", with no travelling pen because a moving tip reads as "now".
- **The tells (step 5):** today's home page carries five of the 2026 set (Fraunces on cream, the italic "one axis.", the "Vol. I" kicker, tracked micro-labels, monospace furniture). Four go. Tracked labels stay in one place with a stated reason (the label half of a header block).
- **Copy (step 6), in PRODUCT.md, not live:** five headlines, three kept. The plain one: "Ten long-wave theories of history, each drawn once on one time axis." Subhead of two sentences, call to action "Check a cycle against its record" (to /cycles), one error rewrite and one empty-state rewrite.
- **Two things for the reviewer to weigh:**
  1. Kept headline 3 states the 0-of-9 result ("By this site's rule, none of those records is long enough to test its cycle"). It is the home page's existing sentence moved up, but short testability claims were refuted three times on the /cycles snippet (I-079). It gets its own claims pass at P3 or is dropped.
  2. The error screen today says "Most likely a CSV failed to load." Round 0 and Codex both found that false: CSV failures are caught inside the chart. The rewrite states no cause. This is a live wrong sentence, small, and outside the flag question; say if you want it fixed on its own.
- **Evidence:**
  - OBSERVED · the eight before frames, production, today.
  - OBSERVED · source, f478ebd: the round-0 list and its Codex verdict (`tmp/design-pass-round0-facts.md`, `tmp/sinusoidal-cycles-dp-codex-r1-verdict.md`; tmp is not committed, the result is folded into PRODUCT.md).
  - HYPOTHESIS · who the reader is and what they use today (`docs/evangelism-bar.md`).
  - MISSING · any real reader's words; `docs/evangelism-evidence.md` and `docs/key-metrics.json` do not exist.
- **Permission:** lane-owned pages. The round's rule binds: nothing a visitor sees changes without David's pick. This lane adds: the variant stays OFF until I-077 and I-078 are read (due 2026-11-19: round 0, a Codex claims pass on the fact list, then the words), even after his pick. I-075's second-screen line does not move.
- **Next action (P3, after the review):** re-read the live registry, then build three first-screen variants from different composition families behind the build-time flag `DESIGN_PASS_VARIANT` (unset = today's site; rollback = leave it unset). First command:

  ```
  git -C C:/dev/skylark/skylark-site fetch origin
  ```

- **Acceptance (the brief's P1 bar):** before frames committed at the four sizes (met); every product fact in PRODUCT.md and the copy on its known list (met, by the method above); world and display face not in the registry (met at the 15:45 MT read; row posted); scope is the first screen and one flow (met); nothing touches sign-in, payment or data (the site has none).
- **Delivery and encounter checks:** none at P1; nothing shipped. At P3 the flag is off, so delivery is the frame set and the review page.
- **USER-FACING: no** for this P1. Paths: `docs/PRODUCT.md`, `docs/DESIGN.md`, `docs/design-pass-2026-11-17/` (script and frames), `docs/daily/2026-11-17-prelaunch.md`. P3 will be yes, behind the flag: `src/app/(app)/page.tsx`, `src/app/(app)/cycles/[id]/page.tsx`, `src/app/error.tsx`, `src/app/not-found.tsx`, `src/app/globals.css`, `src/app/layout.tsx`, font files.
- **Section 0:** listener 🟢 (posted cde5eaf1). CI `check-ci-status --workflow ci.yml` → "GREEN — 1 completed non-scheduled success(es) for HEAD" on f478ebd926. Drift `--service sinusoidal-history` → "in-sync live f478ebd9 → head f478ebd9". Harness: running 2.1.326 · fleet UNIFORM (25 of 25) · installed 2.1.326 (SAME). Codex: GREEN (kickoff probe), used once. No `--snapshot` taken: the morning snapshot from round 1 stands; `--print` read "0 gate(s) due on/before 2026-11-17".
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: none — read `check-due-gates-dispositioned --print` (0 due) and the kickoff's "dated gates due today: 0".
  - (b) owed child rows: none — read the kickoff's "rows owed to you in skylark-site's ledger: 0 of 850 considered".
  - (c) state reads marked CROSSED: 1. "board cards carrying David's word: 3" (21ece8d9, 2cf09a9d, 3784317b): all skylark-site cards, unchanged since first surfaced, none names this lane (`answered-cards`: 0 lane cards, 0 new). Disposition: read.

## State Appendix

**/cycles, production f5eb87d6, the two split entries** (`tmp/i083-cycles.txt`):

```
42: Paired data - US TFP growth (5-yr rolling)
43: Can't be tested yet: the record it is judged on, US TFP growth (annual, unsmoothed), is 85 years too short.
126: Paired data - US Top 1% Wealth Share
127: Can't be tested yet: the record it is judged on, US top 1% wealth share (1913 onward), is 339 years too short.
285: Record is the span of the series each verdict is judged on — for some pairings a different cut from the one drawn on the chart, named on that cycle's page. …
```

### Close

ACTION: COMPLETED · item I-083 · P3 63f6ef47. The acceptance in force was the packet's (the row's closeWhen) plus the P1 review's added check that home and the share card read the same. Both are met (P3 above). Manager review 96d05dab: COMPLETED, no defects. It fetched /cycles itself and matched both sentences byte for byte to the ones Codex r1 judged.

- **State since the P3 post:** live 81fa58e1 = head. It carries 379e33b, which the manager review read with `check-deployed-sha-drift`. The receipt in 63f6ef47 still holds, with one label corrected per the review: its `[exposure: blind … bug row I-083]` names the change's own row. The blindness is owned by the standing no-client-analytics choice, not by a bug row.
- **I-075, read at the close:** the home page's second screen on production 379e33b6 (390x664 isMobile, scroll 664, no taps), line at y=233: "Nine of the ten peak years fall between 1945 and 2020. They are anchors, set by the theorists or by this site, not evidence that the cycles agree." That is the true mixed answer, and it is the split both walkers' hedge pointed at.
- **Hygiene draft:** 1 line, 0 accepted · 1 amended · 0 rejected.
  - I-075 close, AMENDED. The draft's note claimed "the second screen answers it" without a read, and the close note now quotes the second-screen sentence read above.
  - The un-rowed carry (SliderRow label wrap) is not a draft line. It was minted as I-086.
  - READ-MUTATED, quoted: "READ-MUTATED I-075 src/lib/cyclesIndexVerdict.test.ts — NOT named in the readCommand: may be the lane's own concurrent P3 edit". Confirmed: it was this lane's P3 test edit, made while the fold read ran, and that read writes no source.
  - Checks: wait-justification "PASS — 33 of 93 row(s) carry `waitJustification`; 0 warn / 0 info". Engineering-zero "PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable, WAIVED by a live waiver" (#62 until 2026-11-28, W-007).
- **Ledger delta:**
  - I-075 closed by its closeWhen's recorded-decision path (two AMBIGUOUS walks; the second screen answers it, quoted above; the caption budget is full).
  - I-083 closed (closeWhen met; encounter blind, outcome open with no schedulable read).
  - I-086 minted (open, P3, nextEvaluation 2026-11-24): the 320px "Reference peak year" label wrap.
- **Due gates:** `check-due-gates-dispositioned` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", with the snapshot CURRENT (taken 2026-11-17).
- **Pending reads:** 11-18 I-071, I-085 (JSX probe on 16.4.5, needs a local build) · 11-19 I-077, I-078 (phone home first screen; round 0 first) · 11-24 I-086 · 11-28 W-007 (Dependabot #62: fix or re-date).
