# sinusoidal-cycles — 2026-11-17 (Tuesday, MT)

## BLUF

**P1 picked one change. On /cycles, the Kondratiev and Turchin entries will say, in the entry itself, why the record a verdict is judged on differs from the series the chart draws (I-083).** On production today, each entry names one series on its "Paired data" line and a different one on the verdict line under it, with no reason given. The reason sits about 4,000px lower. Kondratiev reads "US TFP growth (5-yr rolling)" and then "the record it is judged on, US TFP growth (annual, unsmoothed), is 85 years too short". /cycles is the site's most-shown page (22 of 46 impressions, 10-31..11-14). Round 0 is dispatched. No words exist yet, and nothing is built until the review.

**The I-075 re-walk ran and came back AMBIGUOUS again.** A fresh walker at 390x664 on production (f5eb87d6) said "I can't tell for sure, but I lean towards 'this website'", citing "SITE'S PEAKS · NO CYCLE CONFIRMED". This is the same shape as 11-13. Per the row's own note, I-075 takes its recorded-decision path at the close, with both walks as the reason. Section 0 is clean: CI green on f5eb87d65a, deploy in sync.

## What changed

P1 only. Nothing user-facing is built.

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

## State Appendix

**/cycles, production f5eb87d6, the two split entries** (`tmp/i083-cycles.txt`):

```
42: Paired data - US TFP growth (5-yr rolling)
43: Can't be tested yet: the record it is judged on, US TFP growth (annual, unsmoothed), is 85 years too short.
126: Paired data - US Top 1% Wealth Share
127: Can't be tested yet: the record it is judged on, US top 1% wealth share (1913 onward), is 339 years too short.
285: Record is the span of the series each verdict is judged on — for some pairings a different cut from the one drawn on the chart, named on that cycle's page. …
```
