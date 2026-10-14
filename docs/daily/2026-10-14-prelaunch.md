# Daily — sinusoidal-cycles — 2026-10-14 (Wednesday, MT)

## Day round (2026-10-14): P1 selection packet

[P1 — Evidence and choice]

**Outcome (I-043, the /methods cross-grid rows):** a reader who follows a cycle page's re-pairings link can read all 19 rows without meeting a term they don't understand. Every row's "(AR(2) null: 0.185)" bracket is reworded in plain words. The note after the rows gains one plain sentence before its technical one.

**The user problem, in a reader's words (synthetic, N=1, the 10-13 evening walk, 320x568, /cycles/schlesinger-jr, then the link):** the walker answered correctly from the landing screen and did not stall on the new lead. But it named the rows' "(AR(2) null: …)" label as a term it could not understand. It also said the note "explained below the list" explains it only in technical terms (I-043 notes, `continuity/items.json`; the full walk report was never saved, as the primer's Non-obvious section says).

### Evidence

- **OBSERVED (synthetic, N=1):** the quote above, from the evening round's pre-registered walk. That walk ruled NOT HELD by its own bar (I-043 latest note).
- **OBSERVED, source (read at `a15900d`):** the label is built at `src/components/CrossGridList.tsx:22` as `p ${p} (AR(2) null: ${p_ar2})`. It is mirrored in the independent oracle at `src/lib/methodsCrossGrid.test.ts:47` and on the 19 lines `public/methods.md:167-185`. `CROSS_GRID_NOTE` (`CrossGridList.tsx:41-42`) opens with "In technical terms:" and has no plain sentence. The lead (`:39`) already promises "a second model of drift, explained below the list". Today nothing below the list explains it in plain words. [linter-report]
- **OBSERVED:** a Grep for `AR(2) null:` finds it on no other reader surface. It appears only in `CrossGridList.tsx`, the test and `public/methods.md`, plus in history (two walk files, the 10-13 daily, the 10-14 primer and continuity), which stays as written.
- **OBSERVED, live baseline:** I-043's own readCommand ran just now: `check-rendered-text snap https://sinusoidalhistory.com/methods` gives 351 lines in `tmp/i043-methods.txt`. That matches the evening round's after-count of 351.
- **OBSERVED, the plain wording's basis:** /methods already says the p is "calibrated by parametric bootstrap … from a fitted AR(1) null and re-checked against an AR(2) null" (`public/methods.md:161`). The rows report those same two numbers, so the plain words describe the same two nulls.
- **HYPOTHESIS, wording for P3 (owes a Codex claims pass under rule 6):** rows become `… · p 0.094 (second drift model: 0.185)`, reusing the lead's own phrase. The note opens with something like "In plain words: drift is the slow wandering a long record shows even when nothing repeats. The first p models it with each year leaning on the year before; the bracketed one lets each year lean on the two years before." The existing technical sentence follows unchanged.
- **MISSING:** any real reader on /methods. The site has no client analytics, by standing choice (`docs/evangelism-bar.md:30`). The bar reads UNMEASURED (`metricReady: false`).

### Section 0

- **Primer:** `docs/cold-starts/2026-10-14.md`, read whole.
- **Listener:** 🟢 SSE alive (restart 17:07:43Z, hello and replay-complete), and `/loop-tick` is armed by a `ScheduleWakeup` call. All three waker ranks are running. Rank 1 fired a wake-shorten for this prompt and was relaunched. Rank 2 refused its relaunch twice because its pidfile names a live process, which is benign.
- **Codex:** GREEN per the probe line on this prompt (machine-level, 17:18Z).
- **CI:** `check-ci-status --workflow ci.yml` reads GREEN on `a15900d072` (kickoff said UNKNOWN on a 10 s gh timeout; the live read outranks it).
- **Drift:** `check-deployed-sha-drift --service sinusoidal-history` is in sync: live `a15900d0` = head.
- **Due gates:** `check-due-gates-dispositioned --snapshot` (taken once, this morning): "0 gate(s) due on/before 2026-10-14" across 49 ledger items.
- **Board:** `answered-cards`: none.
- **Rotation:** `check-cycle-rotation --lane sinusoidal-cycles` exits 3: **"journey-walk DUE — P3 IS the pass (run /journey-walk); 18d since 2026-09-26 (cadence 7d)"**. The kickoff lead does not name this. See "Rotation vs lead" below.
- **Harness:** `check-claude-build --panes` exits 3: fleet SKEW (2.1.299 ×27, 2.1.296 ×1), installed 2.1.299 (AHEAD of the 09-18 record). This is a read only, not a stop.
- **North Star:** retention and word-of-mouth. The bar reads UNMEASURED, so this ship is reported as unmeasured.
- **Recs yesterday:** the 10-13 evening close named one next step (this one). It is carried here, not dropped.
- **Prior-retro recurrence that bears on the choice:** "Q2: I wish I had delegated the post-deploy read battery". It applies to P3 here: the delivery reads (snapshot diff, folds, landing) go to a subagent after P3's deploy reaches production.

### Rotation vs lead (for the manager review)

Two owed things point at P3: the lead's I-043 reword and the rotation's due journey-walk (flow 1, `docs/key-user-flows.md`, last walked 2026-09-26). **Recommendation:** P3 ships I-043 first; it is one small commit. Then it runs the I-043 walk **exactly as pre-registered**, because changing that walk would change its bar. The rest of P3 is the `/journey-walk` of flow 1, which walks the cycle page → /methods seam with I-043's fix in place. If the review would rather P3 be the journey-walk alone, I-043 waits for its 10-20 trigger.

### Permission

This is reader-facing copy on /methods and its mirror, the same class as I-029, I-041 and the 10-13 evening ship, so it is inside the lane's own authority. The row is open, with no park, wait or card. Not touched: `public/data/spectral/` (read only, frozen), the row numbers, the lead, the paragraph above the box, and I-042 (frozen verdicts.json text, waiting until 12-01). No David decision is needed.

### Next action

Kind: **improve.**
1. Change the oracle in `src/lib/methodsCrossGrid.test.ts:47` to the plain label, and add the pass-bar assertions below. Record them RED against today's component.
2. Change `CrossGridList.tsx:22` (the label) and prepend the plain sentence to `CROSS_GRID_NOTE`. Mirror both in `public/methods.md:167-187`.
3. Run the targeted test, then the Codex read-only round (code and claims), then push. CI is the full gate.

First command (the targeted test, RED once the oracle is changed):

```
npx vitest run src/lib/methodsCrossGrid.test.ts
```

### Acceptance condition (observable)

- **Pin (red arm recorded before the build):** no row's detail text, on the page or in methods.md, contains `AR(2) null` or `AR(1)`. Each row carries the plain label, built by the independent oracle. Page and mirror still match byte for byte. **Positive control:** the note after the 19th row still contains `AR(1)`, `AR(2)` and `Holm` (the existing `:165,175` checks), and its plain sentence comes before "In technical terms". The lead is unchanged.
- **Delivery, live:** the deploy row reads live = head. `check-rendered-text diff tmp/i043-methods.txt https://sinusoidalhistory.com/methods` changes only the 19 row details and the note, and the line multiset otherwise matches. `check-entry-folds` reads 13/13 at 320x568, as a regression read.
- **Landing fold:** at 320x568, landing on /methods#cross-grid, the first row is still in view. A longer label may wrap; the evening round measured the first row at y 287-386.
- **Outcome (pre-registered, before any look, the same walk and bar as 10-13):** a fresh cold walker at 320x568 starts on /cycles/schlesinger-jr, taps the re-pairings link and answers: "In plain words, what does each row do, and did any come out significant?" **It passes only if** the walker answers from the landing screen without naming a term it could not understand. **If it fails:** no rewording this round; record it on I-043. The walker's full report is saved to `docs/walks/2026-10-14-i043.md`.

### Delivery and encounter checks

- **Delivery:** CI green → the deploy row reads live = head → the diff, folds and landing reads run on production.
- **Encounter:** blind. No reader-arrival instrument exists, by standing choice. The synthetic walk is the read (comprehension, N=1, not a real-user encounter).

### USER-FACING: yes

Paths:
- `src/components/CrossGridList.tsx` (the row label and the note)
- `public/methods.md` (mirror: 19 row lines and the note)
- `src/lib/methodsCrossGrid.test.ts` (the oracle and the pins)
- `docs/walks/2026-10-14-i043.md` (internal: the walk record)

### HYGIENE INPUTS

- **(a) Due rows not bearing on the choice:** none. Read: `check-due-gates-dispositioned --snapshot` (0 due, 49 swept).
- **(b) Owed child rows (skylark-site ledger):** none. Read: the kickoff's "rows owed to you" line (0 of 749).
- **(c) State reads marked CROSSED:** none. Read: the kickoff state block (dated gates 0, rows owed 0, cards 0, stale-actionable 0 of 8, queued 0). The two lines that could not be judged were re-read here: HEAD CI (kickoff UNKNOWN, GREEN live) and the report artifact (PENDING, now this file). Also noted: missingLinkedCommits reads NOTHING SWEPT (0 of 0), and key-metrics has "no list yet".

codexCalls: 0 (P1) — probed-declined

Posted as bus `92309e83`.

### P1 prep while the review is pending (nothing committed)

- **Red arm recorded (uncommitted, `src/lib/methodsCrossGrid.test.ts`):** the oracle at `:47` now builds `(second drift model: …)`, and two new tests were added. One checks that no row on the page or in methods.md carries `AR(1)`, `AR(2)`, `null`, `bootstrap` or `Holm`; it is bounded by structure, so the cut does not depend on the expected words. The other checks that the note opens "In plain words:" and that its plain part is free of those terms. `npx vitest run src/lib/methodsCrossGrid.test.ts --pool=threads` gives **12 tests, 4 failed**: the two whole-block pins (the received rows still read `(AR(2) null: …)`) and the two new tests. The other 8 pass, and those include the lead and note positive controls.
- **Live baseline:** `tmp/i043-methods.txt` holds the 351 lines of production /methods, the diff's before-side.

## Day round (2026-10-14): P3 product-work loop

### Action: improve (I-043), as manager review 00190f9d APPROVED it

Sequence as approved: the I-043 commit, its pre-registered walk unchanged, then the flow 1 journey-walk.

### 1. Implementation

- `8fd7f6a`: every row's bracket now reads `(second drift model: 0.185)` instead of `(AR(2) null: 0.185)`, and the note opens with a plain sentence. `public/methods.md` mirrors both. The test oracle builds the plain label independently of the component. Two new pins: no row (page or mirror, cut by structure) carries a listed technical term, and the note's plain part comes first and is jargon-free. **Red arm:** 4 of 12 failed on the old text (recorded at P1 prep). After the change, 12/12 pass. The mirror pin caught a dropped space after "In technical terms:" before commit.
- `fc7ed63` (Codex r1): **CONFIRMED (MED)** "each year leans on the year before" was false for the first row, because House polarization is sampled every two years (`scripts/spectral_verdict.py:106`). **CONFIRMED (LOW)** "a long record shows" overclaimed. **CONFIRMED (LOW)** the contract asked for one plain sentence and the commit added two. **CONFIRMED (LOW)** the row pins checked five case-sensitive strings. Fixed: one sentence with "reading", not "year"; the pins now match case-insensitively over 8 terms, with a CEILING comment (a fixed list, not "no technical word").
- `cfffd0f` (Codex r2): **CONFIRMED (MED)** "the two models differ only in memory" is false, because the AR(1) and AR(2) nulls also differ in fitting and simulation (`spectral_verdict.py:303ff`). That was the second round in which describing HOW the models differ overclaimed, so the sentence was changed to claim less: "In plain words: drift here means slow wandering that can happen with no repeating cycle, and each p checks against a different model of that drift, so the bracketed one is a second opinion on the first." Codex r3: **HOLDS, no defects** (claims, consistency with the lead and the technical sentence, mirror parity REPRODUCED).
- Gates: `verify-with-receipt -- npm test`, TRUE exit 0, 34 files and 344 tests. Typecheck and lint are clean on the changed files. Sibling sweep: `AR(2) null:` appears on no other reader surface (Grep over src, scripts, public).

### 2. Delivery

- CI: `check-ci-status --workflow ci.yml --wait`, GREEN on `cfffd0fc39` after 90 s.
- Deploy: `check-deployed-sha-drift --service sinusoidal-history`, in sync, live `cfffd0fc` = head.
- Surface, /methods: before and after snapshots are 351 lines each. Exactly 20 lines differ: the 19 rows (old label to new label) and the note. Live lines still carrying `AR(2) null:`: 0. The ordered `check-rendered-text diff` reads RED at line 289, the first changed row, which is the expected result for an ordered diff of a wording change. The multiset comparison above is the proof.
- Surface, mirror: live `https://sinusoidalhistory.com/methods.md` has the new label 19 times, the old label 0 times and the plain note once.
- Folds: `check-entry-folds` at 320x568 reads 13 of 13 OK. /methods has 25 px spare; Perez's spare is still 5 px.
### 3. Encounter

Blind. The site has no reader-arrival instrument, by standing choice (`docs/evangelism-bar.md:30`). The bar reads UNMEASURED. There is no bug row, because this is a deliberate absence, not a defect. Search Console (`scripts/gsc-read.mjs`) sees impressions and clicks per page, but not a reader reaching the cross-grid box.

### 4. Outcome (synthetic, N=1): NOT HELD as the pre-registered bar is written, with the targeted residual resolved

Walk record: `docs/walks/2026-10-14-i043.md`, saved whole this time. The setup was the same as 10-13: production `cfffd0f`, 320x568, start on /cycles/schlesinger-jr, tap the link, same question.

- **Answered correctly from the landing screen:** yes. The landing was clean: the box was open, its heading 16 px from the top, and the lead plus three rows were on the first screen.
- **The targeted residual is resolved.** The rows' bracket was the 10-13 stall, and the walker read it this time as "a second opinion … as a cross-check". It did not list the bracket as a term it could not understand.
- **By the bar as written, it fails.** The walker named other terms it half-understood. In the box: "fit that period at least this well", how the second model *differs*, "brackets" (the rows show parentheses), "periods", "×", and the series acronyms (DW-NOMINATE, V-Dem, Project Mars/log, HATCH). In the technical note, which it skipped as labelled technical: bootstrap, AR(1)/AR(2), Holm. Across the two pages: "noise model" on the cycle page against "drift model" in the box, and "7" against "All 19". It also said the note's Holm sentence "muddies the lead's clear rule".
- **Instrument caveat (honest):** this walker was told "a term you could only half-understand counts". The 10-13 prompt was never saved, so the two walks may not apply the same strictness. Two of the named items were present on 10-13 and not flagged then: the acronyms and "periods".
- **No rewording this round, as pre-registered.** The residuals go to I-043's next step, in this order:
  1. "brackets" → "parentheses" or "in round brackets": the lead's word is factually mismatched to what the page shows. It is a one-word fix.
  2. One vocabulary across the cycle page's "noise model" and the box's "drift model".
  3. The Holm sentence, which contradicts the lead's plain rule for this reader.
  4. A one-line row key for "periods" and the series acronyms. This is the widest change and may belong to the series names, not this box.