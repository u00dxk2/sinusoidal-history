# sinusoidal-cycles — 2026-11-09 (Monday, MT) — full day

## BLUF

**P3 shipped I-074, live a56378d7, CI green.** A zoomed facet card or the desktop overlay now says which line falls outside the chosen years, inside the chart, instead of drawing an empty plot. On production `check-outside-window-word` went from FAIL to 9 of 9 cases OK, and the strip, embed and verdict checks all pass. Codex ran 3 read-only rounds and found 4 defects, all fixed, with no defect in round 3. Encounter: blind (no client analytics). The P1 selection follows.

**P1 selects I-074: a zoomed facet card or desktop overlay that draws none of a cycle's wave should say so.** This morning's production read (live 66962f4a, `?range=1801-1951`) turned the row from a hypothesis into an observed defect. Schlesinger Jr. and Perez have an empty theory curve on the facet cards at 390x664 and on the overlay at 1280x800, and neither surface carries a word. The open Schlesinger Jr. card shows an empty chart area under a legend naming both of its lines. The other 8 of 10 cycles draw, and an independent computation from `cycles.json` agrees on which 2 do not. Kind: improve. No real reader has been observed zooming.

Full day (the orchestrator's kickoff: "Day: 11-09 Monday, full v2 day"). Section 0 is clean: CI GREEN on 66962f4a, deploy in sync, Codex probe GREEN, harness UNIFORM on 2.1.319. 1 dated gate is due today (I-074, selected), and no product-love cycle picks this lane.

## What changed

[P3 — Product-work loop]

**I-074 shipped, live a56378d7, CI green.** Kind: improve. The manager review (979c4377) APPROVED it with three additions, and all three are in: the card accounts for Schlesinger Jr.'s missing data line, the glance strings stay pinned beside a new sibling, and the checker covers both modern-range embeds while the overlay frame holds at 1070px.

- **Commits:** 821076b (the words, test and checker) → a40f732 (Codex r1 fixes) → 8cc351f (Codex r2 fix) → a56378d (`next dev`'s own AGENTS.md heading, separate). `check-ci-status --workflow ci.yml --sha a56378d70a… --wait` → GREEN after 104 s.
- **What a reader sees now at `?range=1801-1951`:**
  - A facet card says which line is missing, inside its chart: "theory and data: none drawn in these years →" on Schlesinger Jr. (Policy Mood starts in 1952), and "theory: none drawn in these years →" on Perez, whose HATCH line is drawn.
  - A collapsed card and the unpaired Turchin (50y) card use the glance rows' own words.
  - The overlay lists "Schlesinger Jr. theory: none drawn in these years →" and "Carlota Perez theory: …" in the corner.
  - At `range=modern` Ibn Khaldun reads "← theory: …" on the card and "← Ibn Khaldun theory: …" on the overlay.
  - Every form is derived from the calibrated cycle and the loaded CSV. No form names a year or a position.
- **Review measurements:**
  - Policy Mood from 1952: OBSERVED, `public/data/stimson_policy_mood.csv`, first row 1952.
  - Collapsed contrast: the review's hypothesis held by arithmetic. Ink-soft at 65% opacity is about 3.4:1, so the word uses ink, measured 5.30:1 on production.
  - The overlay derives its list from `effectiveCycles`.
  - The sparkline aria-label now says when none of its wave is drawn.
- **Instruments:**
  - `src/lib/outsideWindow.test.ts`, 22 tests, on the real CSVs. Red-armed: with the old `CycleFacet.tsx` restored, 2 failed and 20 passed; back in place, 22 of 22.
  - `scripts/check-outside-window-word.mjs`, 9 production cases, with its own oracle that shares no code with `src/lib`. Self-test 24 of 24. Red-armed on this morning's production: every case FAIL or MISSING (`blank-without-word schlesinger_jr`, `perez`, `khaldun`).
  - Ceiling, declared in both headers: the source pins cannot see a guard edited to false. The checker reads the DOM, not paint, and skips dark mode, calibration and the CSV loading and error states, which are unit-tested.
- **Round 0** (Sonnet helper, 11 claim lines): it found the overlay word lacked "theory". That is the same finding as Codex r1 #1, so two independent reads converged on it.
- **Codex** (3 read-only foreground pipes; each banner read `workdir: C:\dev\skylark\sinusoidal-cycles`; session 01a1c132, session 01a1c138, session 01a1c13b):
  - r1 on 821076b:
    - MED, overlay word lacked "theory": CONFIRMED, fixed in a40f732.
    - MED, checker could pass a right word beside a wrong line: CONFIRMED, fixed in a40f732 (lines judged against the oracle, CSV keep rule aligned with `parseCsvSeries`).
    - LOW, source pins blind to the render guard: CONFIRMED, pins tightened and the ceiling declared.
  - r2 on a40f732:
    - MED, `drawsLine` read "M10,NaNZ" as a line (the "a" in NaN): CONFIRMED, fixed in 8cc351f as a stated rule (any non-finite token reads blank). The old rule returns true on that path, so the new self-test leg is red-armed.
  - r3 on 8cc351f: no defect found.
- **Delivery:**
  - `check-deployed-sha-drift --service sinusoidal-history --wait` → "OBSERVED after 2 poll(s), 32s — the live commit IS the branch head" (live a56378d7).
  - Then on production: `check-outside-window-word` 9 of 9 OK, `check-strip-near-chart` TOGETHER with 131px spare, `check-embed-snippets` 42/42, `check-holds-up-line` 46/46.
- **Encounter:** blind (see the receipt below).
- **Outcome:** open.
- **Local note:** the `next dev` server orphaned again on port 3917. I stopped pid 44800 by PID after reading its command line (this lane's `start-server.js`), and the port is free.

USER-VISIBLE: A reader who zooms the chart now sees, inside each facet card and on the desktop overlay, which line falls outside the chosen years ("theory and data: none drawn in these years →" on Schlesinger Jr., "theory: …" on Perez, "← … Ibn Khaldun theory" at the Modern range) instead of an empty plot that reads as missing data — 821076b [proof: check-outside-window-word on production went from FAIL (blank-without-word on Schlesinger Jr., Perez, Ibn Khaldun across 9 cases, live 66962f4a) to 9 of 9 OK, live a56378d7 in-sync per check-deployed-sha-drift --wait] [coverage: Search Console page impressions on / (gsc-read.mjs) · last good read 2026-11-09 · founder+test excluded no] [exposure: blind — a zoom sets only a query string and the site has no client analytics by standing choice (card 1e069bb4) · bug row I-074]

<!-- findings:begin -->
- The P1 packet's wording condition held up: a bare "none drawn" beside Perez's drawn HATCH line would have been false. The overlay needed the same correction, which round 0 and Codex r1 each caught independently.
- The review's Policy Mood point was right and changed the card's word: at 1801-1951 Schlesinger Jr. is missing both lines, not just the theory.
- Residuals for the close, as candidate rows, not built today: (1) the overlay's DATA chips stay active with no word when their series has no points in the window (Policy Mood at 1801-1951), a deliberate scope line declared in the checker; (2) a card whose data points straddle the window with fewer than two inside draws no data line and carries no word (round 0 item 5; no current CSV reaches this at a 150-year window, unmeasured).
<!-- findings:end -->

`--run I-074` stamped the row's read this morning (`continuity/items.json`, `continuity/read-outputs/I-074.txt`). The row's status change is left to the close.

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** I-074, a zoomed facet card or desktop overlay says when none of a cycle's wave is drawn. Kind: improve.
- **User problem, in a reader's words:** "go blank with no note that they fall outside the chosen years. On a first look it reads like missing data." That is the 10-25 cold walker on the glance rows (quoted on I-069, synthetic N=1); I-069 fixed those rows and left these two siblings. Behind it is the bar's problem: "I can't tell whether any of it holds up or is just a good story." (`docs/evangelism-bar.md`, HYPOTHESIS.) A blank that reads as missing data makes the site's record look broken on the card that carries the verdict.
- **Evidence:**
  - OBSERVED · production facet cards, Playwright in-page read, 390x664, `/?range=1801-1951&tab=facets`, live 66962f4a, today: 10 cards. Schlesinger Jr. and Perez have a theory path with `d=""`; 8 of 10 draw. 0 of the 2 carry a visible word. The chart's aria-label already says the period "falls outside 1801 to 1951", so a screen reader gets words a sighted reader does not.
  - OBSERVED · production open card, same size, `&focus=<id>`, read in the DOM and by screenshot: Schlesinger Jr. shows an empty chart area with only the dashed zero line, under a legend reading THEORY · POLICY MOOD. Perez draws its HATCH line and no theory line, under a legend reading THEORY · TECH DIFFUSION · SITE-DERIVED. Positive control: the open Ibn Khaldun card draws its theory curve (`d` length 3999), so the read can tell the two apart.
  - OBSERVED · production desktop overlay, 1280x800, `tab=overlay`: Schlesinger Jr. and Perez paths have `d` length 0 and 8 of 10 are non-empty; "none drawn" appears 0 times in the overlay's text. Both legend chips still show a filled swatch. The chart itself was below the fold in my screenshot, so this leg is a DOM read and I did not see it painted.
  - OBSERVED · oracle sharing no code with the site (period computed in the probe from `reference_peak_year`, `period_years`, cut at 2026): the same 2 of 10 fall outside 1801-1951 (Schlesinger Jr. 1955-1985, Perez 1972.5-2026).
  - HYPOTHESIS from source, not read: `CollapsedSparkline` (`CycleFacet.tsx:537`, shown on the other cards while one is focused) gets the same empty path from `useCycleValues`, and its aria-label is "<name> sparkline", which says nothing about the window. The source says FacetLegend renders only with a paired series (`:149`), so Turchin (50y), which has none, could not carry a word placed only in that legend.
  - OBSERVED · Search Console, page-grouped (`gsc-read.mjs --start 2026-10-25`, read today): 39 impressions, 0 clicks, average position 8.1. That is who was shown the site, and it says nothing about who zooms.
  - OBSERVED · the row's readCommand (`--run I-074`, stamped): strip and rows TOGETHER at 390x664, 131px spare. Strip regression only, as the row says; it cannot see this defect.
  - MISSING · `docs/evangelism-evidence.md` does not exist in this lane. The bar's metric reads UNMEASURED (`docs/evangelism-bar.md:30`, instrument not built). `check-cycle-rotation`: "no product-love cycle picks this lane today", exit 0.
  - MISSING · any real reader zooming: a zoom sets only a query string, and the site has no client analytics by standing choice (card 1e069bb4).
  - MISSING · desktop-width facet cards. I read the phone facets and the desktop overlay, as the row asks.
- **Why this over the other candidates:** I-074 is due today and is the only one of the kickoff's leads with an observed defect on production this morning. I-075 and I-076 are not due until 11-10, each rests on one synthetic walker asking a question, and each spends the home first screen's spare (12px and 4px on 11-03). I did not re-read those spares today. Both rows keep their 11-10 date.
- **Prior-retro finding that bears on this** (11-08 retro, still on discipline): a hand-written production comparison, fifth day. This morning's read is another scratch script, so the finding recurred. P3 commits this read as a checker, which covers this surface only; Q5's general `check-rendered-text` classifier stays open.
- **Permission:** I-074 is `open`, owner sinusoidal-cycles, P3. This is lane copy on lane-owned components, inside the row's own closeWhen. No open card names it. David's I-061 ruling binds the words: no surface says where the present sits. Card 9174731b (answered) concerns BloomEDU, Decomposer and Syntopica only: read whole, nothing here.
- **Next action:** kind = improve. The first command is the existing wording test, as the baseline before new legs:

  ```
  npm --prefix C:/dev/skylark/sinusoidal-cycles test -- src/lib/outsideWindow.test.ts
  ```

- **Acceptance condition:**
  1. On production at `?range=1801-1951`, every facet card in all three modes (normal and open at 390x664, collapsed by focusing another card) and the overlay at 1280x800 reads "blank without a word: 0 · word on a drawn cycle: 0". At `?range=1900-2050` Ibn Khaldun's word points to the before side.
  2. The words come from `periodSideOutside` and `outsideWindowWords`, so they cannot drift from the glance rows, and they pass the I-069 claims rule: no year, no present position, true at an exact edge touch.
  3. **The words say it is the theory that is not drawn.** The Perez card draws a data line in this window, so a bare "none drawn in these years" beside that line would be false as read. P3 settles the exact wording and puts it through the claims check.
  4. The side is derived from the **effective** cycle, so a calibrated peak or period moves the word with the curve (`FacetChart` receives `effective`). It covers both render paths of the open card (Facets and Calibrate tabs), and a cycle with no paired series.
  5. A source-pinned test covers this and is red-armed, and the new checker goes RED on today's production before the fix.
  6. No regression: `check-strip-near-chart`, `check-embed-snippets` and `check-holds-up-line` pass on production after the deploy.
  7. If P3 finds a word cannot fit on one of these surfaces, the row's other arm applies to that surface: a recorded decision with the reason.
- **Delivery and encounter checks:** delivery is `check-deployed-sha-drift --service sinusoidal-history --wait` in sync on the fix sha, then the new checker on production. Encounter: blind, for the reason under MISSING. There is no event that would appear at any N; the readable proxy is Search Console page impressions on `/`, which shows who was shown the page and not who zoomed. Outcome stays open.
- **USER-FACING: yes.** Paths: `src/components/CycleFacet.tsx`, `src/components/CycleOverlay.tsx`, possibly `src/lib/overviewReading.ts`. Internal: `src/lib/outsideWindow.test.ts`, one new `scripts/check-*.mjs`, `continuity/items.json`, `docs/daily/`.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: none. Read: `check-due-gates-dispositioned --snapshot` → "1 gate(s) due on/before 2026-11-09" (87 rows swept), and that gate is I-074, selected.
  - (b) owed child rows: none. Read: the kickoff's skylark-site ledger read, "0 of 805 considered".
  - (c) state reads marked CROSSED: none. Read: every kickoff state read. The non-zero ones: dated gates 1 of 1 (above); answered cards 1 (9174731b, not this lane); prior-day retro 2 still-on-discipline of 2 tagged; report artifact PENDING (this file); key metrics "no list yet" (not measured, not 0); listener 0 no-loop warnings since today's session start.

## State Appendix

### Section 0

- **Primer:** no `docs/cold-starts/2026-11-09.md`; the newest is 2026-11-08 and I read it whole.
- **Listener:** SSE alive (slug match, hello 16:10:40Z) with the tick loop armed by tool call. The SessionStart hook started this listener at 08:56 MT (15:56Z).
- **Codex:** GREEN, from the `[codex-probe]` line on the kickoff (2026-11-09T16:02:35Z). 0 calls so far.
- **CI:** `check-ci-status --workflow ci.yml` GREEN on 66962f4a, 1 success, 0 failures, 0 pending.
- **Deploy:** `check-deployed-sha-drift --service sinusoidal-history` in-sync, live 66962f4a, head 66962f4a.
- **Harness:** running 2.1.319 · fleet UNIFORM (28 of 28 panes) · installed 2.1.319 (SAME).
- **Yesterday's recommendation (11-08):** I-049, executed (live 3d7d2cff, closeWhen met, status `monitoring` for the 11-15 read).
- **Untracked at session start:** `continuity/read-outputs/I-027.partial.txt`, not mine and left alone.
- **Production read:** a scratch script this morning (read-only). P3 committed it as `scripts/check-outside-window-word.mjs`.

### Close

ACTION: COMPLETED · item I-074 · P3 d89d471c

- **Since P3:** the manager review (b62bd7af) marked it COMPLETED with no defects found. No state has changed since; live a56378d7.
- **Ledger delta:**
  - I-074 open → closed. Encounter blind by construction, outcome open; nothing is left for the row to read. Precedent: I-069, closed 11-02 on the same arm.
  - I-081 minted, P4, nextEvaluation 2026-11-17: the overlay's data chips stay lit with no word when their series has no points in the window (Policy Mood at 1801-1951).
  - The straddling-data residual is NOT filed, as an explicit decision recorded in I-074's close note. No current CSV reaches it at a 150-year window. Trigger: a series added or refreshed with an internal gap of 150 years or more.
  - No row was minted for "zoom reach is unmeasurable". Checked: no ledger title matches zoom, blind, unmeasurable, client analytics or query string. The blindness is the standing choice (`docs/evangelism-bar.md:30`, card 1e069bb4), not a defect.
- **Hygiene draft:** 0 lines, so there was nothing to accept, amend or reject. READ-MUTATED none. check-wait-justification "RESULT: PASS — 32 of 87 row(s) carry `waitJustification`; 0 warn / 0 info". check-engineering-zero "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable".
- **Due gates:** `check-due-gates-dispositioned` (no flag) → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-11-09).
- **Pending reads:** 11-10 I-034, I-068, I-075, I-076 · 11-11 I-080 · 11-12 I-077, I-078 · 11-15 I-049 · 11-16 I-051 · 11-17 I-081 · 11-18 I-071 · 12-01 I-025, I-042, I-073 · 2027-01-04 W-005.
- **Receipt:** P3's line stands unchanged (d89d471c).
