# sinusoidal-cycles — 2026-11-02 (Monday, MT) — full day

## BLUF

Full day (the orchestrator's kickoff: "FULL day across the portfolio"). **I-069 shipped, live 55d246db, CI green:** a zoomed glance row whose wave lies outside the window now reads "none drawn in these years →" instead of going blank. Production at the walker's window shows 0 blank rows without a word, and the fold holds at 13 of 13. Codex r1 and r2 each found one LOW, both fixed. Encounter blind. The P1 selection follows. **P1 selected I-069:** in a zoomed window, a row whose one drawn wave lies wholly outside the window goes blank with no word, and the 10-25 cold walker read that as missing data. Root cause from source: `drawnSpan()` returns null and `OverviewRow` draws an empty path. At `?range=1801-1951`, Schlesinger Jr. and Perez are blank, as the walker reported. The planned change is a short word in the blank row naming which side of the window the wave is on, with no present position (I-061). Section 0 is clean: CI GREEN on 60247b2, deploy in sync, Codex probe GREEN, harness UNIFORM. Nothing waits on David. Due today: I-051, I-067 (hygiene), I-069 (selected).

## What changed

[P3 — Product-work loop]

**I-069 shipped.** Kind: improve. Manager review: APPROVE (c6d67ef7).

- **Commits:** dfaea61 (the side helper, the row word, `src/lib/outsideWindow.test.ts`), 6a33c11 (Codex r1: claim less at an exact edge touch), 55d246d (Codex r2: a stale comment). CI ci.yml green on 55d246d.
- **Before → after:** at `/?range=1801-1951` on a phone, the Schlesinger Jr. and Perez glance rows were blank (`d=""`, production 60247b2, probe this morning: "blank rows: 2 of 10"). They now read "none drawn in these years →", right-aligned in soft ink. A row whose wave lies before the window reads "← none drawn in these years", left-aligned. The sr-only reading adds "None of its wave is drawn in these years; it starts at or after their end." (or "ends at or before their start"). No year, and no present position (I-061).
- **Local build, Playwright (`scratchpad/i069-word.mjs`):** 1801–1951 @320: words on exactly schlesinger_jr and perez, 114/184px, inside. 1900–2050 @320: khaldun "before". 1600–1750 @320 (the extreme): 9 of 10 rows "after", all inside. Default @390: no word on any row. Across all four: "blank rows without a word: 0 · words on drawn rows: 0 · words overflowing: 0". This was measured on dfaea61's wording, which was 2 characters shorter than the shipped wording; the production read below is on the shipped words.
- **Regressions (local build):** `check-entry-folds` 13 of 13 at 320x568 (home 12px spare), 360x560 (home 4px), 390x664 (home 72px), unchanged from the record. `check-strip-near-chart` TOGETHER, 131px spare.
- **Instrument:** `src/lib/outsideWindow.test.ts`, 10 legs: the side logic (the walker's window, the default axis, before, a sliver, an exact edge touch), the visible words, both sr sentences, and a source check that CycleOverview wires them in. Red-armed: `git stash push -- src/components/CycleOverview.tsx` gave "1 failed | 7 passed" (the source-check leg, `expected '"use client";…' to match /periodSideOutside\(\s*cycle,\s*startYear,\s*endYear/`). Restored with `git stash pop`: 8/8. Ceiling, stated in its header: a source check, blind to the rendered row.
- **Codex, read-only, foreground pipe, banner `workdir: C:\dev\skylark\sinusoidal-cycles` checked both rounds:**
  - r1 on dfaea61: 1 LOW, STATIC, CONFIRMED. At an exact edge touch (`?range=1805-1955`, Schlesinger Jr. drawn from 1955) "drawn after these years" was false. Fixed in 6a33c11: the words now claim only "none drawn in these years", the arrow gives the side, and the sr says "at or after their end". r1 also traced reachability `/` → `parseRange` → `effectiveCycles` → `CycleOverview` and found no blank row without a word, no word on a drawn row (calibration included), and no default-view change.
  - r2 on 6a33c11: all four sentences HOLD. Cold-reader judgment: it "distinguishes the row from missing data". 1 LOW CONFIRMED: a stale comment ("the same at every brush range"), fixed in 55d246d.
- **Sibling sweep:** `Grep "useCycleValues\(|sampleDrawnPeriod\("` over `src/` (non-test) gave 9 call sites. `CycleOverview.tsx:184` is fixed. `CycleFacet.tsx:446,537` (the facet cards, via `useCycleValues`) and `CycleOverlay.tsx:92` (the desktop overlay, direct) take the reader's window, so they can go blank in a narrow one and carry no word. `Poster.tsx:244`, `og/route.tsx:570,599` and `cycles/[id]/page.tsx:931` draw windows this sweep did not trace to a reader zoom; unread. Only the glance rows were in scope; see the findings below.
- **Delivery:** `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live 55d246db = head. Production Playwright reads on the shipped words: 1801–1951 @320 and @390, words on exactly schlesinger_jr and perez ("none drawn in these years →", 125/184px and 125/254px, inside). 1900–2050 @320: khaldun "← none drawn in these years", 126/184px. 1600–1750 @320: 9 of 10 rows, all inside. Default @390: no word on any row. Every read: "blank rows without a word: 0 · words on drawn rows: 0 · words overflowing: 0". Production `check-entry-folds`: 13 of 13 at 320x568 (home 12px) and at 360x560 (home 4px). `check-strip-near-chart` TOGETHER, 131px spare.
- **Not done:** the cos-math audit was not run, because no year-position claim was added.
- **Encounter:** blind. The glance rows render client-side, a zoom sets only a query string, and the site has no client analytics (standing choice), so a reader who zooms leaves no trace any instrument here reads.

USER-VISIBLE: A phone reader who zooms the glance chart no longer sees blank rows that look like missing data: a row whose one wave lies outside the chosen years now reads "none drawn in these years →" (or "← …" when the wave is earlier), with the same in its screen-reader text — 55d246d [proof: production /?range=1801-1951 at 320 and 390 went from Schlesinger Jr. and Perez blank (d="", 2 of 10, this morning on 60247b2) to both carrying the word and 0 blank rows without one, live 55d246db in-sync per check-deployed-sha-drift] [coverage: Search Console page impressions (gsc-read.mjs) · last good read 2026-11-02 · founder+test excluded no] [exposure: blind — the rows render client-side and a zoom sets only a query string, with no client analytics by standing choice · bug row I-069]

<!-- findings:begin -->
- The facet cards (each cycle in detail below the glance) and the desktop overlay sample through the same `sampleDrawnPeriod`, so in a narrow window they can go blank too, and they carry no word yet. I-069's walker saw only the glance rows. Carried as a candidate for the close, not fixed today.
<!-- findings:end -->

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** I-069. In a zoomed window, a row whose one drawn wave lies outside the window says so instead of going blank.
- **User problem, in a reader's words:** "Schlesinger Jr. and Carlota Perez go blank with no note that they fall outside the chosen years. On a first look it reads like missing data." (I-066 cold walk, `docs/walks/2026-10-25-i066.md:43`, 390x664, window 1801–1951.) On a site whose whole promise is "someone actually checked" (`docs/evangelism-bar.md`), a row that looks like missing data reads as a gap in the checking.
- **Evidence:**
  - OBSERVED · source, this morning's tree (HEAD 60247b2 = live): `drawnSpan()` (`src/lib/cycleMath.ts:40`) returns null when the window holds none of a cycle's drawn period. `sampleDrawnPeriod` then returns `[]`, and `OverviewRow` (`src/components/CycleOverview.tsx:174-181`) renders an empty `<path d="">`. The row keeps its name and draws nothing beside it.
  - OBSERVED · arithmetic from `src/data/cycles.json` + `drawnPeriod()`: at `?range=1801-1951`, Schlesinger Jr. is drawn 1955–1985 and Perez 1972.5–2026 (cut at today). Both lie wholly AFTER the window, so both rows are blank, which matches the walker's report. Huntington (1938–1998) and Fathers and sons (1945–1995) only clip the window's right edge, so they draw a short arm, not a blank row. On the default 1600–2050 axis no row is blank.
  - OBSERVED · walk provenance: synthetic cold walker, N=1, 2026-10-25, on production 963782f4. Not a real reader.
  - OBSERVED · `check-cycle-rotation --lane sinusoidal-cycles` exit 0: "no product-love cycle picks this lane today; run the normal P3". `answered-cards`: no David-word cards.
  - MISSING · real-user evidence. The bar reads UNMEASURED (no client analytics, by standing choice). There is no record of any reader zooming on production.
- **Prior-retro finding that bears on this:** 10-31 retro Q0, recurred 11-01, still on discipline: "prose that describes an interaction needs its own source check". The new word describes what a zoom does, so every sentence of it is checked against `drawnPeriod` / `drawnSpan` before it ships, and Codex gets the claims pass.
- **Permission:** I-069 is an open P3 issue owned by this lane. It is not parked, frozen or waiting, and no card is open on it. It changes copy and layout on the lane's own chart, so the lane decides it. I-061 (David 2026-10-21, "one wave per cycle, stop at today") binds the wording: the word may say on which side of the window the wave lies, but never where the present sits. The row's closeWhen requires "Any wording for cut-off arms is checked against I-061". Today's scope is blank rows only; the cut-off-arm reading stays on the row. The copy is published under the site's name, so portable rules 3 and 6 require a Codex claims pass before push.
- **Next action:** kind = improve. First command, reproduce the walker's window on production and record the blank rows' empty paths (scratchpad probe, read-only):

  ```
  node C:/dev/skylark/sinusoidal-cycles/scripts/check-strip-near-chart.mjs https://sinusoidalhistory.com
  ```

  Then do a scratchpad Playwright read of `https://sinusoidalhistory.com/?range=1801-1951` at 390x664 that lists each `[data-overview-id]` row with its path `d` length (the before state: Schlesinger Jr. and Perez with `d=""`). Then the change: when `drawnSpan` is null, the row's chart area carries a short word in the row's 24px. The candidate says which side the wave is on ("wave drawn before these years" / "wave drawn after these years"), with the side derived from `drawnPeriod` and never a hand-written year. The sr-only reading carries the same words. Then: a pinned test of the side logic and the wording, red-armed against the old empty-row behaviour; `check-entry-folds` at 320x568 and 360x560 (the default axis has no blank row, so the fold must not move); `check-strip-near-chart` regression; and the Codex claims pass (read-only, foreground pipe, banner workdir checked).
- **Acceptance condition:** I-069's closeWhen, the source-pinned-test arm: "A reader shown a zoomed window can tell a blank row from missing data (the row says its period lies outside the window, or equivalent), proved by … a source-pinned test of the wording". Observable: on production `/?range=1801-1951` at 390x664, the Schlesinger Jr. and Perez rows each show a visible word naming the side ("after"), and no other row shows one. On the default axis no row shows one. The pinned test goes red on the old behaviour and green on the new. `check-entry-folds` holds 13 of 13 at 320x568 and 360x560. `check-strip-near-chart` stays TOGETHER at 390x664.
- **Delivery and encounter checks:** delivery: `check-deployed-sha-drift --service sinusoidal-history` in sync on the fix sha, then the same scratchpad Playwright read on production showing the word on the two rows. Encounter: blind. The rows render client-side (no Search Console signal for a zoom), and there are no client analytics. Exposure will read blind.
- **USER-FACING: yes.** Paths: `src/components/CycleOverview.tsx`, possibly `src/lib/overviewReading.ts` (sr-only reading) and a small helper beside `drawnSpan` in `src/lib/cycleMath.ts`. Internal: a new test file, `continuity/items.json`.
- **HYGIENE INPUTS:**
  - (a) Due rows that don't bear on the choice: 2, from this morning's snapshot ("snapshot written — 3 gate(s) due on/before 2026-11-02"): **I-051** (the 11-02 fallback Search Console read, `gsc-read.mjs --start 2026-10-16 --end 2026-10-30`, three legs judged by the closeWhen rule) and **I-067** (the zoom-strip handles cover tick labels; its readCommand is a regression that cannot answer the row, and no overlap-measuring script exists). I-069, the third due row, is the selection.
  - (b) Owed child rows in the orchestrator's ledger: none (kickoff read "rows owed to you": 0 of 781).
  - (c) State reads marked CROSSED: none. Read: dated gates (3 owed: 1 selected, 2 in (a)), rows owed 0, board cards 0, queued rows 0, stale-actionable 0 of 16, missingLinkedCommits swept nothing.

## Close

[P5 — Delta-only close]

ACTION: COMPLETED · item I-069 · P3 9b9dfcb4

- **State since the P3 post:** none. Live is still 55d246db (`check-deployed-sha-drift --service sinusoidal-history` in-sync at the manager's boundary read). The receipt is unchanged.
- **Review hypothesis checked:** "a zero-width window leaves a blank row with no word" is REFUTED. `widenToMinSpan` (`src/lib/urlState.ts:30-50`, used by `parseRange` and `brushStatus.ts:46`) forces every window to at least `MIN_VISIBLE_SPAN` = 150 years.
- **Hygiene draft:** 2 lines — 0 accepted · 2 amended · 0 rejected. I-051: re-date ACCEPTED in intent, AMENDED in shape (re-dated to 11-16, with readCommand and closeWhen re-pointed to a fresh 10-31..11-14 window, because the old window's read is complete). I-067 (UNDECIDED in the draft): AMENDED to a close on the closeWhen's recorded-decision arm. The I-064 walker "read the years from the text rather than the strip", and the status line names the window's years. READ-MUTATED, quoted: "none — 2 reads guarded". check-wait-justification: "RESULT: PASS — 32 of 80 row(s) carry `waitJustification`; 0 warn / 0 info". check-engineering-zero: "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable".
- **Ledger delta:** I-069 closed (delivered; encounter blind by construction, outcome open). I-067 closed (recorded decision). I-051 re-dated to 11-16 with a new window. **I-074 minted** (facet cards + desktop overlay blank case; nextEvaluation 2026-11-09). The manager review asked for a written decision, and the decision is its own row, dated off 11-03's heavy day.
- **Due gates:** `check-due-gates-dispositioned.mjs` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-11-02).
- **Pending reads:** 11-03 I-027, I-043, I-049, I-063, I-068, W-006. 11-04 I-032, I-071, W-005. 11-09 I-074. 11-16 I-051.

## State Appendix

- **Section 0:** primer read (docs/cold-starts/2026-11-01.md). Listener 🟢: SSE hello 14:50:26Z, and the loop is armed by ScheduleWakeup. Codex GREEN (the kickoff's probe line, machine-level, 14:49Z). CI GREEN on 60247b2 (`check-ci-status --workflow ci.yml`). Drift in-sync, live 60247b2f = head (`check-deployed-sha-drift --service sinusoidal-history`). Harness 2.1.316, fleet UNIFORM (29 of 29), installed SAME.
- **Recs yesterday:** the 11-01 Recommendation block was the I-070 packet, executed (I-070 closed, c13b646 live). The I-068 and W-006 dates it carried are 11-03.
- **Due-gates snapshot:** `check-due-gates-dispositioned.mjs --snapshot` → "snapshot written — 3 gate(s) due on/before 2026-11-02" (I-051, I-067, I-069).
