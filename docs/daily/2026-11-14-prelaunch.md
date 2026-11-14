# sinusoidal-cycles — 2026-11-14 (Saturday, MT)

## BLUF

**P3 shipped I-081, live 7dbfbb9f (CI ci.yml green on 7dbfbb9f34, deploy in sync).** On the desktop chart, a Data chip whose series has no point in the zoomed years now says "none drawn in these years →". At `?range=1801-1951` that is Policy Mood. A screen reader hears it as part of the chip's name: "US Policy Mood (Stimson) none drawn in these years →". The same change made the facet cards' data word claim less. They said "theory and data: none drawn" over a visible edge dot at `?range=1802-1952`, and now they say "theory: none drawn". On production, `check-outside-window-word` passes 12 of 12; before the deploy it was red on 3 legs. I-081's closeWhen is met, and the close applies it to the row. Encounter blind; outcome open.

**P1 picked I-081.** When a reader zooms the desktop chart to years where a data series has no data, its chip in the Data legend should say so. Today it stays lit and says nothing. At `?range=1801-1951`, Policy Mood (which starts in 1952) draws no line, and its chip looks the same as a series that is drawn. This is the one change today that a user would see. It sits away from the phone home first screen on purpose: the I-075 re-walk on 11-17 must see the same screen the 11-13 walker saw. Round 0 (a Sonnet fact-listing helper) went out at P1 prep, before any wording exists. Section 0 is clean: CI green on 4dc094f, deploy in sync (live 4dc094f0 = head), 0 gates due. Nothing is ready to ship yet, and no commit touches the change until the review.

## What changed

**P3: I-081 shipped (927a088, then 7dbfbb9; live 7dbfbb9f; CI ci.yml green on 7dbfbb9f34).** Manager review 2a518093: APPROVE, with the one-point case to check before choosing words.

- **Code:**
  - `SeriesLegendItem` in `src/components/CycleOverlay.tsx` reads its own loaded points and judges them for the window. It does this only for a series that is on and loaded without error. It shows `outsideWindowWords(side)` in a `data-series-empty` span inside the button.
  - `pointsSideOutside` (`src/lib/cycleMath.ts`) now returns a side only when no point is in `[start, end]`. The findings below say why.
- **Tests, red-armed:** `src/lib/outsideWindow.test.ts` gained the narrowed rule, a DW-NOMINATE one-interior-point case off the real CSV, and a source pin for the chip. With the two source files stashed, 2 of 24 failed. With them restored, 24 of 24 passed. Typecheck and lint are clean on the changed files.
- **Checker** (`scripts/check-outside-window-word.mjs`): it now judges the overlay's Data chips, matching them one-to-one to the series by name. Its oracle is independent: no point inside means a word, and a lone `Mx,yZ` counts as a mark. It has three new cases (overlay 1730-1880, overlay 1802-1952, and the facet 1802-1952 open), 12 in all. The selftest passes 33 of 33.
  - Red on production before the deploy (live 4dc094f0): "blank-without-word data "US Policy Mood (Stimson)"" at 1801-1951, TFP and Policy Mood at 1730-1880, and "wrong-word schlesinger_jr (got "theory and data: none drawn in these years →", expected "theory: none drawn in these years →")" at 1802-1952.
- **Codex r1 on 927a088** (gpt-6-astra, read-only foreground pipe, banner workdir `C:\dev\skylark\sinusoidal-cycles` matched, exit 0):
  - Job 1, the claims pass: every outward word HOLDS. The "←" form holds but is unreachable today.
  - Job 2, MED, CONFIRMED: the chip word's contrast read `fill`, but HTML text paints with `color`. Fixed in 7dbfbb9.
  - Job 2, LOW, CONFIRMED: chip identity was a count, not a set. Fixed in 7dbfbb9 (one-to-one by name).
  - PLAUSIBLE, and older than this change: the chip and the line fetch the CSV separately, so one can fail while the other loads. Declared as a blind spot in the checker header.
  - Declared ceiling: the source pin cannot see an appended `&& null`. The production checker covers that case.
- **Sibling sweep:** I searched `src/`, `scripts/` and `public/` for the old two-point rule ("fewer than two|inside >= 2|needs two points|two of its points"). The only hit is historical, in `docs/daily/2026-11-09-prelaunch.md:54`. The only other caller of `pointsSideOutside` is `CycleFacet.tsx:484`, and it is covered above. No prose mirror describes these words: "none drawn|Data series|data chip|toggle" returned 0 hits in `public/*.md|txt` and `src/app/**`.
- **Live reads on 7dbfbb9f:**
  - `check-deployed-sha-drift --wait --sha 7dbfbb9f…`: OBSERVED in-sync after 68s.
  - `check-outside-window-word`: PASS 12 of 12. "overlay 1801-1951 @1280: OK — judged 11 · words 3", where the 3 are the two theory words plus the Policy Mood chip.
  - `check-embed-snippets`: 42/42 PASS. The legend change did not outgrow any snippet; the 1440 overlay is 1070px in 1070px.
  - `check-entry-folds --width 320 --height 568`: 13 of 13, with `/` at 12px spare (unchanged).
  - The accessible names in the aria snapshot at 1801-1951: `button "US Policy Mood (Stimson) none drawn in these years →" [pressed]`, and no word on the other 8 chips.
  - The legend at 768 and 1280 (`tmp/data-legend-768.png`, not committed per card dd410b2a): the word sits inline in the chip, and the legend wraps.
- **Encounter:** blind. There are no client analytics, by standing choice (card 1e069bb4), and a zoom leaves no trace in Search Console.

P1 (selection and prep) is recorded below.

- **Section 0:**
  - Primer `docs/cold-starts/2026-11-14.md` read first. It expected Monday 11-16, and today runs anyway on the orchestrator's kickoff.
  - Listener: 🟢 SSE alive (hello 17:14:20Z) + loop armed by tool call. All three waker rungs are running.
  - Codex: GREEN (kickoff probe 17:15:47Z: execute and write both proved).
  - CI: `check-ci-status --workflow ci.yml` → GREEN on 4dc094f0ca (1 success, 0 failures).
  - Drift: `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live 4dc094f0 = head.
  - Harness: running 2.1.325 · fleet UNIFORM (27 of 27) · installed 2.1.325 (SAME).
  - Recs yesterday: the 11-13 Recommendation block was that day's P1 packet (I-075), executed (badd80e + bd23f36, live bd23f36c). The re-walk is carried to 11-17 on the row.
- **Morning snapshot** (`check-due-gates-dispositioned --snapshot`): "0 gate(s) due on/before 2026-11-14". I-049 is dated 11-15 and is read on the next session at or after its date, as the primer says.
- **I-081 read** (`check-due-gates-dispositioned --run I-081`, exit 0, 38.0s): `check-outside-window-word` PASS at 9 of 9 legs, including "overlay 1801-1951 @1280: OK — judged 2 · words 2". It judges only the THEORY curves. The data chips are declared out of its scope, so this PASS says nothing about the defect.
- **Round 0 dispatched** at P1 prep (memory `feedback_round0_at_p1`). It lists, for every data series, its first and last year, any gaps, and the edge rules, with `file:line`. P3 writes from that list.
- **Round 0: helper 83 lines, 5 UNVERIFIABLE-HERE**, returned after the P1 post (`tmp/round0-i081-2026-11-14.md`). It confirms that at `?range=1801-1951` only Policy Mood (1952-2024) has zero points; tfp (from 1948) has 4 and draws. Three facts for P3:
  - A window with exactly one point strictly inside draws no segment, yet `pointsSideOutside` returns null. It is reachable: DW-NOMINATE at an end year of 1880, WID at an end year of 1821-1849. The chip rule must decide on "draws a segment", not on the side alone.
  - The chip has no `points` (it fetches the CSV separately, `CycleOverlay.tsx:512`), so the state needs lifting.
  - The checker's overlay branch would flag a data word as "word-on-drawn" (`check-outside-window-word.mjs:225`). It changes together with the fix.
  - "before" is unreachable for every current series, so only the "after" word can appear today.

<!-- findings:begin -->
- **One point in the window is drawn, as a dot.** The manager review asked for this check. A lone point is written `Mx,yZ` and painted as a dot under the round line cap. That was read on production (4x clips, `tmp/read-one-point-dot.mjs`) at `?range=1730-1880`, where DW-NOMINATE holds only 1879. So the old data rule (a side with fewer than two points inside) would have made a chip say "none drawn" over a dot.
- **The same rule was already false on the facet cards, at an exact edge.** At `?range=1802-1952`, Policy Mood's 1952 sits on the right edge and paints a dot. The Schlesinger Jr. card said "theory and data: none drawn in these years →" over it (production read, `tmp/read-facet-edge-dot.mjs`). Per the second-appearance rule, the fix changes the shape instead of adding a case: a series counts as outside only when NO point is in the window. Data and theory now have different edge rules, on purpose. A theory period touching an edge writes an empty path; a data point on the edge is drawn.
- **I-077, weighed rather than assumed (the review asked).** The label shipped 11-12 and was read correctly on 11-13 ("Every hump has the same height, which the note says means nothing"). What is left is the drawing ("reads as 'equally strong'"), and fixing that is a design change to the first-screen figure. The 11-17 I-075 re-walk uses that same screen with a fresh walker on the same prompt, so changing it now changes what the walk tests. I-077 stays on its 11-19 date. The reason is the confound, not the date.
<!-- findings:end -->

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** I-081. On the desktop overlay, a data series that draws nothing in the zoomed years says so on its chip. Kind: improve.
- **The user problem, in a reader's words:** no reader has said it. The nearest reader words are the bar's own: "I can't tell whether any of it holds up or is just a good story" (`docs/evangelism-bar.md:14`, HYPOTHESIS). A chip that stays lit over a series with no line reads as "this data is on the chart". A reader comparing a curve to its data can then think the data is flat, hidden or agrees, when it simply has no years there. I-069 and I-074 fixed the same missing-data reading for the facet cards and the theory curves.
- **Evidence:**
  - OBSERVED · source, read today. `DataSeriesPath` returns null when no points fall in the window (`src/components/CycleOverlay.tsx:344-347` filters by `startYear..endYear`, `:362` returns null on `normalized.length === 0`). `SeriesLegendItem` (`:499-553`) shows only "loading…" and "data unavailable". It has no state for "nothing in these years", so the chip keeps its active style (`:531-533`).
  - OBSERVED · the row (I-081 description): Policy Mood starts in 1952, so at `?range=1801-1951` it draws no line. To be confirmed against the CSV by round 0.
  - OBSERVED · the helpers exist: `pointsSideOutside` (`src/lib/cycleMath.ts:83`), `outsideWindowWords` (`src/lib/overviewReading.ts:200`), used by the facets (`src/components/CycleFacet.tsx:484`) and pinned in `src/lib/outsideWindow.test.ts:116-131` (including the edge touches 1951/1952).
  - OBSERVED · I-081's readCommand, run today: PASS, but blind to the data chips (above). The P3 checker leg must go red on today's production before the change.
  - OBSERVED · Search Console, page-only grouping, `gsc-read.mjs --start 2026-10-15` (window 2026-10-15..2026-11-14, read 2026-11-14): 89 impressions, 2 clicks, both to `/`. `/cycles` 35 impressions, 0 clicks. The desktop overlay is on `/` (`src/components/Viz.tsx:247`) and in the embed (`src/components/EmbedView.tsx:161`). The device of the 2 clicks is not in this read.
  - HYPOTHESIS · that a reader zooms to a window where a series is empty. The defect is a source read. It was not walked, and no reader has been observed hitting it (the row says "Source read only; not walked").
  - OBSERVED · `check-cycle-rotation --lane sinusoidal-cycles` exited 0: "no product-love cycle picks this lane today … run the normal P3".
  - MISSING · `docs/evangelism-evidence.md` does not exist. The bar reads UNMEASURED (`docs/evangelism-bar.md:30`), and there are no client analytics, by standing choice (card 1e069bb4).
  - MISSING · `docs/key-metrics.json` does not exist (kickoff: "no list yet").
- **Why not the rows with reader words:** I-077 (the walker reads equal hump heights as "equally strong") and I-078 (the caption after calibration) both change the phone home first screen. The I-075 re-walk on 11-17 uses the same prompt and bar on that screen (`docs/walks/2026-11-13-i075.md`), so changing the figure now would change what that walk tests. Both stay dated 11-19, after the walk.
- **Prior-retro finding that bears on this** (11-13 Q2/Q5, still on discipline): reading Codex's whole transcript (4,069 lines) to find its report. For P3's Codex round, I read only the final report section and record the length.
- **Permission:** I-081 is `open`, P4, owner sinusoidal-cycles. This is lane copy and code in lane-owned files, inside the row's own closeWhen. No open card names it (`answered-cards --project sinusoidal-cycles`: 0 lane cards, 3 portfolio riders, 0 new). I-061 binds the words: no year, no present position. The I-069 rule binds too: the words must be true at an exact edge touch.
- **Next action:** kind = improve. When round 0 is back, add the checker leg (data chips at `?range=1801-1951`, 1280x800) and the source-pinned test. Prove both red on today's tree, then build the chip word from `pointsSideOutside` + `outsideWindowWords`. The first command is the regression baseline, re-read this morning. P3 re-runs it after the deploy:

  ```
  node C:/dev/skylark/sinusoidal-cycles/scripts/check-outside-window-word.mjs https://sinusoidalhistory.com
  ```

- **Acceptance condition:**
  1. At `?range=1801-1951` on production at 1280x800, the Policy Mood chip carries a word saying it draws none in these years. Every series round 0 lists as empty in that window does the same, and every series with points there carries none. Screen readers hear it.
  2. The words come from the existing `outsideWindowWords` family and pass the I-069 claims rule: no year, no present position, true at an exact edge touch. The claims pass runs on them before the first commit.
  3. A source-pinned test and a new checker leg are each red on today's tree and green after.
  4. No regression: `check-outside-window-word` on production stays PASS on every existing leg, and `check-entry-folds --width 320 --height 568` still reads 13 of 13.
  5. I-081 closes on its closeWhen (a production read plus the test and checker leg). The outcome stays open: there is no reader read.
- **Delivery and encounter checks:** delivery means `check-deployed-sha-drift --service sinusoidal-history --wait --sha <full sha>` reads in sync, then the new checker leg passes on production. The overlay renders client-side, so `check-rendered-text` cannot see it (`docs/rendered-text-gate.md`). Encounter: blind. No event would appear at any N, because there are no client analytics.
- **Key number:** active data chips at `?range=1801-1951` @1280 that draw no line yet carry no word. It is 1 or more by the source read (Policy Mood) and 0 after. It is NOT measured live yet: the new checker leg measures it at P3, on today's production first.
- **USER-FACING: yes.** Paths: `src/components/CycleOverlay.tsx` (the chip and its announcement; the embed renders the same component), and `src/lib/overviewReading.ts` / `src/lib/cycleMath.ts` only if a helper needs a new export. Internal: `src/lib/outsideWindow.test.ts`, `scripts/check-outside-window-word.mjs`, `continuity/items.json`, `docs/daily/`. There is no prose mirror for this chart; P3 checks `public/llms.txt` and `public/methods.md` for a description of the Data legend.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: none. Read: `check-due-gates-dispositioned --snapshot` → "0 gate(s) due on/before 2026-11-14".
  - (b) owed child rows: none. Read: kickoff "rows owed to you in skylark-site's ledger: 0 of 823".
  - (c) state reads marked CROSSED: 1. "board cards carrying David's word: 3": dd410b2a (screenshot piles), 2516f28c (refactor-night permission rules), 210b0834 (heavy-job queue). All are skylark-site cards, "governs: unlinked". dd410b2a binds this lane's captures: commit only the pictures a report points at as proof. The other two name no work for this lane. Disposition: read; dd410b2a is followed at P3.

## State Appendix

- Kickoff: orchestrator 09fabc4a (2026-11-14T17:24:08Z), body file sha256 1d92682d…, VERIFIED.
- Composer state reads (17:23:41Z): HEAD CI GREEN (run 43572410103), queued rows 0, stale-actionable 0 of 12, report artifact PENDING (this file).

### Close

ACTION: COMPLETED · item I-081 · P3 22d68292

- **Since the P3 post:** nothing user-facing changed. Manager review 672db4ef read COMPLETED with no defects. The receipt posted at P3 still holds, so no new receipt line.
- **Hygiene draft:** 0 lines — 0 accepted · 0 amended · 0 rejected (`tmp/hygiene-draft-sinusoidal-cycles-2026-11-14.md`).
  - READ-MUTATED: none.
  - check-wait-justification: "RESULT: PASS — 33 of 89 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)".
  - check-engineering-zero: "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable, WAIVED by a live waiver (exit 0)" (W-007, #62 until 11-28).
- **Ledger delta** (`continuity-edit`):
  - I-081 closed on its closeWhen. The receipt names the three reads: production at 1801-1951 1280x800, the source-pinned test, and the checker leg.
  - I-077 got a note giving the reason for 11-19 and its trigger: the 11-17 I-075 walk result is in.
  - I-049 is unchanged: already dated 11-15, with its onTrigger.
- **Verify:** `check-due-gates-dispositioned` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-11-14), 0 due.
- **Pending reads:** I-049 on 11-15 (`--run I-049`, Search Console, page-only). I-051 on 11-16. The I-075 re-walk on 11-17. I-071 on 11-18. I-077 and I-078 on 11-19. W-007 on 11-28.
- **Did the overnight refactor help, hinder or change nothing?** It changed nothing in today's work. Today's change touched neither the moved `CycleCurveFigure` nor the d3 subpackages, and the new `listedImports.test.ts` guard stayed green in CI on 7dbfbb9 with no new import.
- **Primer:** `docs/cold-starts/2026-11-14.md`, banner rewritten for this day (1,123 chars).
