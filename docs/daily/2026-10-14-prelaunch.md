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
### Journey-walk and P3 post

Action: improve (I-043), as manager review 00190f9d APPROVED it. Then the due flow-1 journey-walk (the rotation pass), whose finding 2 was fixed today as debt-paydown.

## I-043: the /methods cross-grid rows in plain words

1. **Implementation:** commits 8fd7f6a, fc7ed63 and cfffd0f.
   - Every one of the 19 rows now ends in "(second drift model: …)" instead of "(AR(2) null: …)".
   - The note opens with one plain sentence: "drift here means slow wandering that can happen with no repeating cycle, and each p checks against a different model of that drift, so the bracketed one is a second opinion on the first."
   - public/methods.md mirrors both.
   - Red arm: 4 of 12 tests failed on the old text; 12/12 pass after.
   - Codex r1 CONFIRMED that "each year" was false for the biennial House series (MED), plus 3 LOW findings; all fixed. Codex r2 CONFIRMED that "differ only in memory" was false (MED). That was the second overclaim in a row, so I narrowed the claim. Codex r3 HOLDS, no defects.
2. **Delivery:** check-deployed-sha-drift read in sync, live cfffd0fc = head, before the Render outage.
   - Live /methods: 351 lines before and after; exactly 20 changed (19 rows and the note); 0 old labels remain.
   - Live methods.md: the new label appears 19 times, the old one 0 times, and the plain note once.
   - check-entry-folds at 320x568: 13/13 OK.
3. **Encounter:** blind. The site has no reader-arrival instrument, by standing choice (docs/evangelism-bar.md:30), so there is no bug row.
4. **Outcome (synthetic, N=1, pre-registered walk, docs/walks/2026-10-14-i043.md):** NOT HELD as the bar is written.
   - The walker answered correctly from the landing screen.
   - The targeted row label is resolved: it read the bracket as "a second opinion".
   - It still named other terms it could not fully understand: "brackets" (the rows show parentheses), "noise model" on the cycle page vs "drift model" in the box, the Holm sentence, "periods", and the series acronyms.
   - Instrument caveat: this walker was told that half-understood terms count. The 10-13 walker's prompt was never saved, so the two walks may not apply the same strictness.
   - As pre-registered, no rewording this round. The named residuals become I-043's next step, trigger 2026-10-20.

## Journey-walk, flow 1 (rotation DUE, 18 days since the last)

Artifact: docs/journey-walk-2026-10-14.md. Three passes: phone from /, phone landing cold on /methods (the reviewer's ask), and desktop. Scores: coherence 3, brand 4, effectiveness 3. The walker saw 0 console errors and Back behaved correctly everywhere it tested.

**The ONE (carried to the next P1):** the home page's focused cycle card and the single-cycle embed draw curve-over-data with a "PEAKING" badge and no verdict, the one place the site shows a look-alike match without saying it isn't a test. Seven more findings are dispositioned in the artifact.

**Finding 2, fixed (debt-paydown):** "Copy attribution" cut 4 of the 9 data credits mid-name ("…2024, J)" twice, "James A", "U").
- **Implementation:** commits ec68a71 and 6a3f06e. The credits are now an explicit per-series list, src/lib/seriesCredit.ts. The 5 credits that were already whole are unchanged.
- Red arm: putting the old split back fails exactly the 4 broken pages. Codex r1 CONFIRMED that a credit cut to "James A. Stim" would still pass (MED). The test now pins hand-written credits, and that mutation fails 1 of 19. Codex r2: no defects.
- **Delivery: PENDING (Render incident).** CI is GREEN on 6a3f06e. Render shows "Builds are not starting in all regions" (orchestrator 5798af47). Disclosed: before that notice reached me, I ran ONE manual `render-put-secret.mjs --deploy-latest`; its build dep-db7tqfg473hc738032lg sits in build_in_progress. No retry, no re-push. Live still serves cfffd0fc, so the 4 cycle pages still copy the cut credit. The live read is carried to when status.render.com reads resolved.

## Receipt
USER-VISIBLE: a reader who follows a cycle page's re-pairings link to /methods now reads each of the 19 rows as "(second drift model: …)" instead of "(AR(2) null: …)", and the note under the list opens with one plain sentence on what drift is before its technical one — cfffd0f [proof: live /methods line multiset 351 → 351 with exactly the 19 rows + the note changed and 0 old labels left, live /methods.md new label ×19 / old ×0, check-deployed-sha-drift in-sync live cfffd0fc = head before the Render outage] [coverage: none — no client analytics by standing choice (docs/evangelism-bar.md:30), Search Console sees impressions not page views · last good read n/a · founder+test excluded no] [exposure: blind — the site has no reader-arrival instrument by standing choice; no instrument row exists, none minted · bug row none]

codexCalls: 5 (P3): I-043 r1/r2/r3 and the credit fix r1/r2, each a foreground `codex exec --sandbox read-only` with the banner workdir checked
adversarialReviews: 5 — EXECUTED
hygiene helper: DISPATCHED 17:49Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-14.md PRESENT (check-wait-justification PASS, check-engineering-zero PASS, 0 drafts, 0 findings)
[standing-rules-hash: 88cc2dc9]

## What remains
- Delivery of 6a3f06e: the live read of the copied credit on /cycles/dalio, schlesinger-jr, modelski and perez, once Render's incident resolves.
- I-043's next step, from today's walk (trigger 10-20): "brackets" → "parentheses"; one word for "noise model" and "drift model" across the cycle page and the box; the Holm sentence; then a key for "periods" and the series acronyms.
- Journey-walk ONE: put the verdict line in the focused home card and the embed. Next P1 candidate; it is a Viz change, so its proof is the rendered `main` innerText, not the rendered-text gate.
## Close (day round, 2026-10-14)

ACTION: COMPLETED · item I-043 · P3 6559efcf. As manager review b67a630a found: the plain-words rows and note are live at cfffd0f; the pre-registered walk ran unchanged (NOT HELD as written, an open outcome); the flow-1 journey-walk ran with its cold /methods pass.

- **Deploys of 6a3f06e (credit fix, I-044):** dep-db7tqfg473hc738032lg (manual, 19:51Z) stuck in build_in_progress through Render's outage, CANCELED 20:25Z with orchestrator approval; dep-db7uaj49v7es73cugi7g (one fresh --deploy-latest, 20:25Z) still build_in_progress at 20:38Z. Render status reads "monitoring". Live still serves cfffd0fc. The copied-credit live read is PENDING, owed by 2026-10-15 (I-044).
- **Ledger delta:** I-043 note appended (stays open, trigger 10-20, next step named); I-044 minted (credit live read, 10-15); I-045 minted (verdict line on the focused home card and the embed, next P1 candidate, 10-15).
- **Hygiene draft:** 0 lines (0 accepted · 0 amended · 0 rejected). check-wait-justification PASS; check-engineering-zero PASS; READ-MUTATED none.
- **Due gates:** `check-due-gates-dispositioned` verdict CLEAR, snapshot CURRENT (taken 2026-10-14).
- **Receipt:** P3's receipt still holds (cfffd0f).
- **NOT DONE (usage limit):** the CC daily brief David line (drafted in the scratchpad, not posted); the evening close-out steps.

## Evening round (2026-10-14): P1 selection packet

[P1 — Evidence and choice]

**Outcome:** a reader who taps a cycle on the home page learns, on that card, whether the record supports it. **Item:** I-045 (verdict line on the focused home card and the single-cycle embed).
**The user problem, in a reader's words (HYPOTHESIS, synthetic walker 10-14):** "It shows the curve on top of the data and says PEAKING. Does that mean it works?"

**Section 0 (read 21:5xZ):**
- Primer: `docs/cold-starts/2026-10-14.md` read; banner names I-044 then I-045.
- Listener: 🟢 SSE alive (hello 21:31:19Z, this session) + loop armed by `ScheduleWakeup`.
- Codex: GREEN by the dispatch's `[codex-probe:]` line (17:18Z, exec + write).
- CI: `check-ci-status --workflow ci.yml` → GREEN for 9d66ef96 (exit 0).
- **Drift: RED, P0 stop, held as a deploy wait, not a fix.** `check-deployed-sha-drift --service sinusoidal-history` → red-drift, live cfffd0fc trails green HEAD 9d66ef96 (exit 3, twice). Render deploys API: dep-db7uo8ss728c73bji8ig (9d66ef96, new_commit) **update_in_progress**, i.e. the build finished and the deploy is rolling. The two older rows (6a3f06e api, 8187fff) read **canceled** at 21:29Z, superseded. status.render.com: "Builds, deploys, and queued deploys are not starting", **monitoring**. No manual deploy, since a newer one is already past the build. I-044's live read runs when the drift reads in-sync. Nothing in this P1 ships, so the stop holds no work.
- Harness (0.11): not read this round.
- Recs yesterday (0.10): today's day-round "What remains" lists three items. The credit read is carrying (I-044, blocked on the deploy above). The I-043 next step is carrying to 10-20 (its row). Journey-walk ONE is **this selection**.

**Evidence:**
- OBSERVED (source read, today): `src/components/CycleFacet.tsx`. In `expanded` mode the card prints the phase word (`FacetHeader`, :250-259), the theory-vs-series legend and chart, then `ExpandedTail`: short description, peak rationale, caveat, source, "Full page →", and the Pearson r with "Diagnostic, not a test statistic". **No verdict line, and no "Does it hold up?".** The single-cycle embed (`src/components/EmbedView.tsx:111-135`) renders the same `CycleFacet` in `normal` + `readOnly`, so it has the header phase word, legend and chart only, and no verdict at all.
- OBSERVED: the verdict wording already exists and is pinned: `src/lib/holdsUp.ts` `holdsUpCard()` (page box and share card, I-032). Every cycle gets a headline ("Not testable on the record that exists" / "Not tested" / "Tested — …"); the record it was judged on is named where it differs (Kondratiev, Turchin).
- HYPOTHESIS (synthetic, N=1): the 10-14 flow-1 journey-walk (`docs/walks/`, 4b2afa9) named this as its ONE: every path from `/` goes through the card, the one place a look-alike match is shown without saying it is not a test.
- OBSERVED: `docs/evangelism-bar.md:20`. The would-tell-a-friend moment is "its curve drawn against a real measured series, **and** a plain verdict on whether the record can even test it", on one screen. The card has the first half and not the second.
- MISSING: any real-user read of the card. The bar reads UNMEASURED (`evangelism-bar.md:30`, no client analytics by standing choice).
- `check-cycle-rotation --lane sinusoidal-cycles` → no product-love cycle due (journey-walk ran today; exit 0).

**Permission:** lane-owned product copy on its own surface, wording reused from a pinned source. Row I-045 is open, not parked, not waiting. No David card (`answered-cards`: none). Fences: I-042 (frozen verdict text, 12-01) and I-043 (/methods, 10-20) are not touched. This reuses the verdict *output* and changes no frozen verdict text.

**Next action — improve.** Put a one-line "Does it hold up? <headline>" (from `holdsUpCard`), linking to `/cycles/<slug>#does-it-hold-up`, at the top of the expanded card's tail and under the single-cycle embed's chart. First command, the RED arm on live:

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-entry-folds.mjs https://sinusoidalhistory.com --width 320 --height 568
```

(That is the fold baseline. The change's own RED read is a Playwright `main` innerText read of `/` with each cycle focused and of `/embed?cycles=<id>`, written as a script in `tmp/` before the build.)

**Acceptance (pass bar, written before building):**
1. Playwright, `main` innerText. On `/` with each of the 10 cycles focused, and on `/embed?cycles=<id>` for each, the text carries "Does it hold up?" plus that cycle's `holdsUpCard` headline. RED on live today, GREEN after.
2. The innerText line multiset on `/` (unfocused) changes by nothing outside the focused card.
3. Positive controls: each `/cycles/<slug>` page's own verdict box is unchanged (`check-rendered-text` snap before/after, those pages are server-rendered); `check-entry-folds` at 320x568 keeps its count; `check-embed-snippets` stays at its count.
4. The I-028 no-test-ran guard and `bareCos`/`testedSeries` tests stay green, so the new line never says a test ran.

**Delivery and encounter checks:** after deploy, `check-deployed-sha-drift` in-sync, then criterion 1 re-run against production. Encounter: a pre-registered cold walker from `/` (synthetic N=1, 390x664) taps a cycle and is asked "does it hold up?" before leaving the card. Real-user encounter: blind (no reader-arrival instrument, by standing choice); readable only via an unprompted share or mention, at N=1.

**USER-FACING: yes.** Paths: `src/components/CycleFacet.tsx`, `src/components/EmbedView.tsx` (and possibly `src/lib/holdsUp.ts` for a short-line helper), plus tests under `src/lib/` / `src/components/`. `public/*.md` mirrors are not touched (the card has no mirror). `public/llms.txt`: no count changes.

**HYGIENE INPUTS:**
- (a) due rows not bearing on the choice: none, read `check-due-gates-dispositioned --print` (0 due on/before 2026-10-14).
- (b) owed child rows: none, read kickoff "rows owed to you" (0 of 754).
- (c) CROSSED state reads: none, read the kickoff state block (stale-actionable 0 of 10; missingLinkedCommits NOTHING SWEPT 0 of 0; queued 0). The one live red is the drift above, which is a P0 deploy wait and not a hygiene line.

### Prep while the P1 review is pending (no commit, push or deploy of the change)

- **Drift CLEARED ~21:55Z:** `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live 9d66ef96 = head (exit 0). **I-044 closeWhen met:** the live select-all citation (the text Copy attribution copies) on /cycles/dalio, modelski, schlesinger-jr and perez carries the whole credit, 4/4, with 0 cut forms (bus 028dbd4d). Ledger close rides this round's close.
- **I-045 RED baseline on production (9d66ef96):** `i045-read.mjs` (scratchpad; it moves into `scripts/` at P3) → **0/40 legs carry "does it hold up?", 0 UNREAD**. The legs are 10 cycles x {expanded card at `/?tab=facets&focus=<id>`, `/embed?cycles=<id>`} x {1280x900, 390x664}. Positive control: /cycles/dalio carries it (true).
- **What the instrument got wrong first, each caught by a guard:** (1) `/?focus=<id>` alone does NOT expand the card, only the Facets tab does, so the first 20 card REDs were unexpanded cards. (2) `innerText` applies CSS `text-transform`, so the uppercase heading reads "DOES IT HOLD UP?", and the needle matched nothing even on the control page; it is now compared lower-cased. (3) The expanded marker is `aria-expanded`, not "Full page".
- **Scope finding for P3:** `turchin_fathers_sons` (no paired series) expands with NO tail, because `ExpandedTail` renders only when `series` exists (`CycleFacet.tsx:156`). Its verdict line ("Not tested", `NO_SERIES_HEADLINE`) must sit outside that gate, or that card stays RED.

## Evening round (2026-10-14): P3 product-work loop

[P3 — Product-work loop]

**Action (kind: improve):** I-045, approved by manager review 5b7295e7 with one correction: the line goes outside `ExpandedTail`'s series gate. It now sits directly under the chart, so the unpaired cycle says "Not tested". The review's two hypotheses were measured. (1) On the Calibrate tab the line sits between the chart bottom and the first slider (y 1432, chart 1398, slider 1564, 3 cycles), so the sliders-first tail cannot push it away. (2) A null `holdsUpCard` renders nothing; that case does not occur in today's data.

**What a reader sees:** opening a cycle on the home page (the Facets card), or loading a single-cycle embed, now shows "DOES IT HOLD UP? Not testable on the record that exists →" under the curve. The unpaired cycle shows "Not tested →". The line links to `/cycles/<slug>#does-it-hold-up`. The words come from `holdsUpCard()`, the same source as the page box and the share card.

**Implementation:** `55b9c57` is the feature: CycleFacet `HoldsUpLine` + the `verdictLine` prop, the embed passes it. Two checker fixes followed, `6df0cad` and `eac0a53`. One regression was caught and fixed before push: the 500px single-cycle snippet's attribution was pushed out of frame at 358px (content 510px). The fix makes the whole line one 44px link, trims the embed chart 200→184px (the check floor is 180), and raises the documented snippet frame 500→540px. Anyone who already pasted the 500px snippet sees ~10px of inner scroll at phone widths; no embedder is known, and that encounter is blind (I-037).
- Gates: typecheck, lint, the targeted verdict and no-test-ran tests (93), and the full suite under `verify-with-receipt` at `eac0a53` (exit 0). CI on `eac0a53` GREEN (`check-ci-status --wait`).
- New instrument `scripts/check-holds-up-line.mjs`. It reads 10 cycles x {expanded card, single-cycle embed} x {1280x900, 390x664}. It requires exactly one line per page, every text node painted, an EXACT headline from a rule stated over `verdicts.json` (an uncovered case refuses), and the right href; plus a positive control. Red arms: production before the change 0/40; mutated build r1 28/40 (the 12 predicted legs); mutated build r2 24/40 (the 16 predicted legs). Each was reverted and the tree left clean.
- Review: Codex r1 on `55b9c57` found no rendering defect and 3 checker defects, all CONFIRMED and fixed in `6df0cad`. r2 on `6df0cad` found 2 more of the same classes (a substring oracle accepted reversals; paint was checked on the line, not its children), both CONFIRMED. That was the second appearance of each class, so `eac0a53` changed the checker's shape instead of patching it. r3 on `eac0a53`: no defects. Every banner `workdir` matched this worktree.

**Delivery:** `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live `eac0a53c` = head. The behaviour on production: `check-holds-up-line https://sinusoidalhistory.com` → **40/40 PASS, 0 UNREAD** (was 0/40 on 9d66ef96). Regression controls on production: `check-entry-folds` 320x568 13/13; `check-embed-snippets` 42/42 (the calibrated snippet's content is 540 in 540). Pre-push, prod vs build: the `main` innerText multiset is identical on `/` (146 lines desktop, 149 phone), `/cycles/dalio` (64) and `/cycles/turchin-fathers-sons` (42); on the focused card it differs by exactly the 2 new lines.

**Encounter:** blind. The site has no reader-arrival instrument, by standing choice (`docs/evangelism-bar.md:30`). Search Console sees impressions, not who opens a card. No bug row: the choice is deliberate and recorded, as in the 10-14 day round's receipt.

**Outcome:** open for real readers; no direct evidence exists. The pre-registered synthetic walk (`docs/walks/2026-10-14-i045.md`, saved verbatim, N=1, 390x664, production at `eac0a53`) is **HELD by its bar**. From `/` → the Dalio card, the walker answered "No — the record that exists can't test it" without leaving the card, and the line was above the card's fold. A synthetic walk is not a real-user outcome.

**Receipt:**
USER-VISIBLE: a reader who opens a cycle on the home page, or loads a single-cycle embed, now reads "Does it hold up? Not testable on the record that exists →" under the curve ("Not tested →" for the unpaired cycle), linking to that cycle's verdict box — 55b9c57 [proof: check-holds-up-line on production 0/40 at 9d66ef96 → 40/40 at eac0a53, 0 UNREAD; check-deployed-sha-drift in-sync live eac0a53c = head] [coverage: none — no client analytics by standing choice (docs/evangelism-bar.md:30), Search Console sees impressions not card opens · last good read n/a · founder+test excluded no] [exposure: blind — the site has no reader-arrival instrument by standing choice; no instrument row exists, none minted · bug row none]

codexCalls: 3 (P3): Codex r1 on 55b9c57, r2 on 6df0cad, r3 on eac0a53, each a foreground `codex exec --sandbox read-only` with the banner workdir checked
adversarialReviews: 3 — EXECUTED
hygiene helper: DISPATCHED 22:08Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-14.md PRESENT (evening section lines 22-43; check-wait-justification PASS, check-engineering-zero PASS, 0 drafts)
[standing-rules-hash: 88cc2dc9]

## What remains (evening round)
- **I-045 → close at P5:** the closeWhen is met by the live 40/40 and the HELD walk. Its walk residuals, for the close to disposition: (1) a dead tap on the home glance-figure labels, a new row candidate; (2) PEAKING plus the curve read as confirmation before the verdict line; (3) the "→" suggests the answer is elsewhere; (4) the off-card "why" and the buried "Dalio does not assert" sentence; (5) the vocabulary terms belong to I-043.
- **I-044 → close at P5:** closeWhen met at 21:55Z (bus 028dbd4d).
- I-043 stays on its 10-20 trigger.