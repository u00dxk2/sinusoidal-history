# sinusoidal-cycles — 2026-10-16 (prelaunch)

## Day round (2026-10-16): P1 selection packet

**Outcome (I-052, with I-048 and a second claim page):** make the claim page impossible to read as a "yes" by a skimmer, then put a second theorist on it. In the user's words (the I-051 walk on d1fa17f, verbatim): "'2026 sits at a peak', 'the curve tops out in 2025' and 'curve height +1.00' all read as 'yes, it's peaking right now.' The disclaimer comes after, in smaller and more abstract words." On the home glance figure (I-048 walk, verbatim): "The picture alone agrees with my friend: Dalio's gold curve has a dot sitting exactly on its crest at the 2026 dotted line".

### Section 0
- Primer: `docs/cold-starts/2026-10-15.md` read (banner + first action).
- Listener: 🟢 SSE alive (hello 2026-10-16T14:34:37Z, slug sinusoidal-cycles) + loop armed by ScheduleWakeup tool call; waker ladder 3 rungs (rank 1 relaunched after its wake-shorten FIRE).
- Codex: GREEN per the kickoff's `[codex-probe:]` line (machine-level, 04:50Z). Not re-probed.
- CI: `check-ci-status --workflow ci.yml` GREEN on b23feb40f6 (exit 0). Drift: `check-deployed-sha-drift --service sinusoidal-history` in-sync, live b23feb40 = head (exit 0). Not a stop.
- Harness: running 2.1.301 · fleet UNIFORM (28 of 28) · installed 2.1.301 (SAME).
- North Star: retention + word-of-mouth. This bar reads UNMEASURED (`docs/evangelism-bar.md`, metricReady false); the ship is reported unmeasured, never replaced by instrument work.
- Recs yesterday: `docs/daily/2026-10-15-prelaunch.md` has no Recommendations block (the 3-stage day writes none). The night close's dated reads are dispositioned here: I-052, I-048 → carrying today → P3 (this choice); I-050, I-046 → HYGIENE INPUTS (a).
- Rotation: `check-cycle-rotation --lane sinusoidal-cycles` exit 0, "no product-love cycle picks this lane today; run the normal P3".
- Retro finding that bears on the choice: 10-15 Q6 "tearing down `next start` four times" — today I stop it by the PID whose command line names this checkout, once per build.

### Evidence
- OBSERVED · `check-holds-up-line https://sinusoidalhistory.com` · 10 cycles × card/embed × 2 sizes + Dalio claim × 2 sizes · read 2026-10-16 ~15:00Z · **42/42 PASS**. It pins today's #where-now wording, so it is the regression read, not the I-052 proof.
- OBSERVED · source `src/lib/claimQuestion.ts:37`, `src/app/(app)/cycles/[id]/page.tsx:161-171` · the claim page's #where-now is `${positionSentence} ${NOT_FORECAST}`, i.e. it OPENS "By this page's curve, 2026 sits at a peak (the curve tops out in 2025; curve height +1.00 …)" and the not-a-forecast clause is last. The FAQPage answer has the same order after the verdict.
- OBSERVED · synthetic walk N=1 (`docs/walks/2026-10-16-dalio-claim.md`) · HELD with the I-052 residual quoted above. A synthetic walk is not a real-user encounter.
- OBSERVED · synthetic walk N=1 (`docs/walks/2026-10-15-i048.md`, 390x664) · NOT HELD on the glance figure: the per-row verdict is screen-reader text only.
- OBSERVED · Search Console, page+query grouped, 2026-07-01..2026-10-16 (scratch read via the CC route; anonymized rows drop out, so these are floors): **named-query impressions Strauss-Howe 0, Turchin 0**; the only named queries are Dalio's (6 impressions, pos 49.5-60) and "cycle of ten" (6, pos 6.3). Total 161 impressions, 0 clicks.
- OBSERVED · Search Console, page-grouped (whole totals), same window: /cycles/turchin 6 impr pos 6.7; /cycles/turchin-fathers-sons 9 pos 3.8; /cycles/strauss-howe 5 pos 20.0; /cycles/dalio 16 pos 35.0.
- HYPOTHESIS · second theorist = **Strauss-Howe**, question "Are we in the Fourth Turning?". The lead's rule (more GSC query impressions) ties at 0-0, and the page tiebreak (6 vs 5) is noise. "The Fourth Turning" is the phrase people use when they quote a cycle at the news; Strauss-Howe's page shows at position 20, i.e. it is offered on more contested queries than Turchin's. Neither half of that is measured here. If the manager prefers the measured tiebreak, Turchin ("Did Peter Turchin predict 2020?") takes the same template with no change in scope.
- MISSING: any real-user read of either claim page (no client analytics by standing choice; GSC shows 0 clicks site-wide).

### Permission
I-052 and I-048 are open lane rows (no park, no card). Copy order and a new data field on an existing cycle are lane decisions; the prose fences hold: never a forecast, never "a test ran", headline not reworded, reason = `holdsUpCard().detail` verbatim. No David card bears on it (`answered-cards` none).

### Next action — improve
(a) On claim pages only, the #where-now line and the FAQ answer's position part lead with the not-a-forecast clause, then the curve's position (the other nine pages and /api/v1/state keep today's sentence; `check-year-position` and the claim legs are re-stated on purpose). (b) Strauss-Howe gets `question` in cycles.json on that template, plus its llms.txt line. (c) I-048: a visible verdict signal on the home glance figure inside the last row's 12px spare at 320x568.

First command (RED before):
```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-holds-up-line.mjs https://sinusoidalhistory.com
```
extended first with a claim-leg rule that the first sentence of #where-now on a claim page is the clause, not a position — expected RED on production for Dalio, and "no claim legs" for Strauss-Howe.

### Acceptance (observable)
- RED before: the new claim-leg rule fails /cycles/dalio on production (#where-now opens "By this page's curve, 2026 sits at a peak"); Strauss-Howe has no claim legs.
- GREEN after, on production: on both claim pages the first sentence of #where-now and of the FAQ position part is the clause, by whole-text equality; both answers end on the first screen at 320x568 and 390x664; /cycles/strauss-howe's title and H1 are the question.
- Positive controls unchanged: `check-entry-folds` 320x568 13/13, `check-year-position` (the nine non-claim pages), `check-embed-snippets` 42/42. A one-word mutation of the clause turns the claim legs red.
- I-048: the pre-registered walk prompt (`docs/walks/2026-10-15-i048.md`) re-run from / does not read the dot as agreement; `check-entry-folds` 320x568 13/13.

### Delivery and encounter
- Delivery: CI green on the pushed sha + `check-deployed-sha-drift --service sinusoidal-history` in-sync, then the production checks above.
- Encounter: no-arrival is the expected reading at this traffic. Event that would appear: a named Strauss-Howe or Dalio query in GSC page+query rows for the claim URLs; readable at ≥4 named-query impressions in 14 days (I-051's 10-30 read gains a Strauss-Howe leg).

USER-FACING: yes — `src/lib/claimQuestion.ts`, `src/app/(app)/cycles/[id]/page.tsx`, `src/data/cycles.json`, `src/components/CycleOverview.tsx` (I-048), `public/llms.txt`, `scripts/check-holds-up-line.mjs`, `scripts/check-year-position.mjs`, tests (`claimQuestion.test.ts`, `seriesOverlay.test.ts`, `stateOfCycles.test.ts`).

### HYGIENE INPUTS
- (a) due rows not bearing on the choice: 2 — I-050 (320px header truncation sweep), I-046 (tap probe on the glance figure). From `check-due-gates-dispositioned --snapshot` ("4 gate(s) due on/before 2026-10-16"; I-048 and I-052 are the choice).
- (b) owed child rows: none — read the kickoff's "rows owed to you in skylark-site's ledger" (0 of 754).
- (c) CROSSED state reads: none — read stale-actionable 0 of 14, missingLinkedCommits NOTHING SWEPT (0 of 0), queued rows 0.

## Day round (2026-10-16): P3 product-work loop

**Action: improve the product.** Manager review 2af4adc6 APPROVE, order a; c; b. Mid-round, consult ad680494 → orchestrator answer 19c2b867 changed the claim page's shape.

### 1. Implementation (all on main; CI GREEN on every pushed head)
- `a3780c2` + `53e1264` (I-052, first lever): on claim pages the position sentence leads with "This page draws a wave, not Ray Dalio's forecast: on that wave, …"; the caveat-last form is gone. Codex r1 found an unmapped claim theorist falling back to the plain form (MED, STATIC) — fixed in 53e1264 with a selftest arm (check-year-position selftest 35/35).
- `4c042a9` (I-048): the home glance figure's now-dots are hollow rings; the caption reads "Theory shapes · none confirmed"; a visible line under the axis, counted from holdsUpCard, reads "None of these ten is confirmed: nine cannot be tested on the record that exists, and one has no record on this site." Null, and the caption falls back, as soon as any verdict is tested. Codex r2: no defects.
- `021ed20` (I-052, the shape change, after walk A failed a second time): the claim page's first screen is the verdict plus "Where this site's drawn wave puts 2026 is not evidence for or against Ray Dalio's cycle."; the position moved under the curve; the FAQ answers verdict + that line + position. check-holds-up-line states it, including the rule "#where-now STARTS below the first screen". Codex r3: no defects (declared not-seen: a position phrase in another first-screen element; the walks cover it).
- `edceb88` (part b): /cycles/strauss-howe asks "Are we in the Fourth Turning?" on that template — one data field, no route. Second theorist: Search Console named-query impressions tie 0-0 with Turchin, so per the manager review no time went on the tiebreak.
- `8cd7d43` + `d13077c` (Codex r4 and r5, MED, STATIC, each confirmed against source): the V-Dem pairing note called the recent US drop "the clearest empirical analogue to Strauss-Howe's 'Fourth Turning'", and the /methods pairing notes called it "a Fourth-Turning institutional-stress signal" — under an H1 asking that question, a yes from measured data. Both now say it is an exploratory proxy that cannot show a Fourth Turning is underway (cycle page, /methods, methods.md, vdem_libdem.source.md). Sweep: every remaining "Fourth Turning" in src/public attributes it to Strauss-Howe or their readers.

### 2. Delivery
- `check-deployed-sha-drift --service sinusoidal-history`: in-sync, live d13077c5 = head.
- Production, on d13077c: `check-holds-up-line` **44/44** (was 42/42 with one claim page; RED before the shape change 40/42 — not evidence false, position starts 368). Both claim pages: not-evidence ends 416/664 and 440/568 (Dalio), 387/664 and 440/568 (Strauss-Howe); position starts 1099/1223 and 1047/1177. `check-year-position` 95/95 (Dalio and Strauss-Howe in claim form). `check-entry-folds` 320x568 13/13 (home spare 12px, unchanged). `check-embed-snippets` 42/42 (read on 4c042a9).
- Red arms on production: clause mutation "draws a wave"→"draws a curve" 40/42 (a3780c2); not-evidence mutation "is not evidence"→"is evidence" 40/42 (021ed20). Each restored; `git diff --stat -- scripts/ src/` empty.

### 3. Walks (synthetic, not real users — `docs/walks/2026-10-16-i052-i048.md`, pre-registered before each ran)
- Walk A (a3780c2): NOT HELD on bar 4 — "on that wave, 2026 sits at a peak" still read as agreement. Second appearance → consult, no third wording.
- Walk B (I-048, 4c042a9): NOT HELD as written but moved — two visible verdicts quoted ("the words twice say 'not confirmed'"); the ring on the crest still reads as "peaking now". Orchestrator: keep the home page as shipped.
- Walks A2 + A3 (021ed20, two independent walkers, the orchestrator's strengthened bar): **HELD on both, bars 1-4.** A3: "Candidly, I found nothing that sides with my friend."

### 4. Encounter
No-arrival: no instrument sees a person on these pages (no client analytics by standing choice); Search Console lags ~3 days. Next read: I-051 on 10-30 gains a Strauss-Howe leg ("moved" = ≥4 named queries or any at position ≤30).

### Carried
- I-048 stays open: the drawn position on the glance figure still reads as "peaking now" (walk B); the orchestrator kept the home page as shipped. I-052 closes on A2+A3 at the close.
- Walkers' unknown words (paired record, the floor, full periods, NARRATIVE, drawn wave, 2.0 of the 3.0) → I-043 (10-20). Both A walkers saw the box's last line half-cut at the 390x664 fold (~673 of 664).
- Hygiene draft: `tmp/hygiene-draft-sinusoidal-cycles-2026-10-16.md` (I-046 → 10-20, I-050 → 10-17), applied at the close.

codexCalls: 5 · adversarialReviews: 5 — EXECUTED (r1-r5, read-only, banner workdir checked each time)

## Close (day round, 2026-10-16)

ACTION: COMPLETED · item I-052 · P3 dd9536cb. Acceptance in force: the P1 review 2af4adc6 plus orchestrator answer 19c2b867, which strengthened the bar to two walkers, both holding bar 4. Both walks held (A2, and A3 on a different seed). Manager review df3ee3f0 marked P3 COMPLETED.

- **State since the P3 post:** unchanged. Live is still d13077c's code. 4b276d9 (the read stamps) and this close are docs and ledger only.
- **Hygiene draft:** 2 lines, 2 accepted, 0 amended, 0 rejected. I-046 moves to 10-20 and I-050 to 10-17, the drafted commands run as written.
  - Its READ-MUTATED lines (5) were all my own concurrent P3 edits (status e4d05ced): I-046 on page.tsx, claimQuestion.ts and stateOfCycles.ts; I-050 on check-holds-up-line.mjs and check-year-position.mjs.
  - check-wait-justification: PASS, 0 warnings. check-engineering-zero: PASS, 0 findings.
- **Ledger delta (continuity-edit):**
  - I-052 CLOSED, on A2 and A3. The close note cites the walk file, 19c2b867, the red-proof, and 44/44 and 95/95.
  - I-048 re-dated to 10-20, with walk B's result. The ring on the crest still reads as "peaking now", and the home page stays as shipped per 19c2b867.
  - I-051 note: the 10-30 read gains a Strauss-Howe leg. Baseline: 0 named-query impressions; the page has 5 impressions at position 20.0.
  - I-053 MINTED, per review df3ee3f0: the verdict box's last line is half-cut at the 390x664 fold on both claim pages. Due 10-20.
- **Verify:** `check-due-gates-dispositioned` verdict: CLEAR, every gate due at Phase 0 was dispositioned (snapshot CURRENT, taken 2026-10-16; 4 of 4).
- **Pending reads:**
  - 10-17: I-050.
  - 10-20: I-043, I-046, I-048, I-053, I-027, I-034, I-049.
  - 10-30: I-051.
  - 11-01: I-037.
  - 11-04: W-005, I-032.
  - 12-01: I-025, I-042.
- **Primer:** `docs/cold-starts/2026-10-16.md` (banner 999 characters).
- UNRESOLVED: none.

## Afternoon round (round 2, 2026-10-16): P1 selection packet

[P1 — Evidence and choice]

**Outcome (I-053, then a third claim page):** on a phone, the whole verdict box of a claim page fits on the first screen. Then Peter Turchin gets the same verdict-first page. The user problem: both A walkers flagged that the box's last line is "half-cut at the fold, at about 673 of 664" (`docs/walks/2026-10-16-i052-i048.md:74`, the walk file's own words, not a walker's). *(Corrected at P3, per review 24813b55: the P1 packet quoted A3 as "a minor clip … doesn't change the answer". That quote appears only in the I-053 ledger note, not in the walk file, so it is withdrawn as unverifiable.)* The clip is the last thing a skimmer sees on the first screen, and it is cut mid-sentence.

### Section 0
- **Session state:**
  - This is a fresh pane (session a61cdfe4). The round-1 retro was answered from records (c8500e37). The round-1 close-out was never posted because round 2 arrived first, so this round's close covers both.
  - Primer `docs/cold-starts/2026-10-16.md` (`db8fcf8`) was read.
  - Listener: hello at 2026-10-16T18:21:25Z, slug sinusoidal-cycles. Waker rank 1 relaunched after its wake-shorten FIRE. The loop is armed by a ScheduleWakeup call.
- **Codex:** GREEN per the kickoff's `[codex-probe:]` line (18:20Z).
- **CI and drift:**
  - `check-ci-status --workflow ci.yml`: UNKNOWN, with 1 run in progress on `db8fcf8`, a docs-only commit.
  - `check-deployed-sha-drift --service sinusoidal-history`: PASS, live ecacb81b (in-flight, inside grace).
  - Not a stop: the head commit is docs-only, and the live code equals `d13077c`.
- **Rotation:** `check-cycle-rotation` exit 0: "no product-love cycle picks this lane today; run the normal P3".
- **Dated gates:** the kickoff read 0 due (`check-due-gates-dispositioned --print`). The morning snapshot is not re-taken.
- **Recurring retro finding:** "the next start child left on :3123" (10-15 Q6). This round I stop it by the PID whose command line names this checkout, once per build.

### Evidence
- **OBSERVED: the verdict box ends below the fold on both claim pages.**
  - Read with a scratch Playwright measurement (`box-fold.mjs`, against the live site, 18:4xZ, each child of `#does-it-hold-up`). It is not committed yet; P3 turns it into a checker leg. Box bottom against the fold:

    | Page | 390x664 | 320x568 | 360x560 |
    |---|---|---|---|
    | /cycles/dalio | 745 (OFF by 81) | 841 (OFF by 273) | 809 (OFF by 249) |
    | /cycles/strauss-howe | 740 (OFF by 76) | 865 (OFF by 297) | 809 (OFF by 249) |

  - At 390x664 the "This is not a verdict about this theory in particular…" paragraph runs 556-676 (Dalio) and 551-671 (Strauss-Howe). That is the half-cut line the walkers saw.
  - At 320x568 the record paragraph is also off, at 450-594 and 450-618.
  - The answer and the not-evidence line end at 440 or less at every size.
- **OBSERVED: the box's shape in source** (`src/app/(app)/cycles/[id]/page.tsx:296-350`). The box holds, in order: label, answer, not-evidence (claim pages only), the record paragraph, the "not a verdict about this theory" paragraph, and the link. Fitting it on screen at 320x568 leaves about 128px after the not-evidence line. Neither reason paragraph fits in that space without being cut.
- **OBSERVED: I-048 stays as shipped.** Orchestrator answer 19c2b867 (inbox 144e2202, read from `tmp/.bus-events.jsonl` line 333), verbatim: "Keep the home page (I-048) as shipped." So I-048 is left alone, and walk B is not re-run this round.
- **OBSERVED: no Search Console number picks the third theorist.**
  - From the morning's read (2026-07-01..2026-10-16, under 24h old): named-query impressions are Turchin 0. Page-grouped, /cycles/turchin has 6 impressions at position 6.7.
  - There is no searcher's question on record. The title will be chosen by hand and labelled as a hypothesis.
- **HYPOTHESIS: the third claim page's question.** Turchin is in cycles.json (`turchin`, 150 years, reference peak 2020). The question will be "Did Peter Turchin predict 2020?", which is how his name is quoted at the news, and it is unmeasured.
- **MISSING:** any real-user read of a claim page. There is no client analytics by standing choice, and Search Console shows 0 clicks site-wide.

### Permission
- I-053 is an open lane row, with no park and no card.
- Moving prose within a page and adding a `question` field to an existing cycle are lane decisions.
- The prose fences hold:
  - never a forecast;
  - never "a test ran";
  - the headline is not reworded;
  - the reason text stays verbatim from `holdsUpCard().detail`, and is moved, not rewritten.
- `answered-cards` read at kickoff: 0 cards for this lane.

### Next action — improve
- **(a) I-053.** On claim pages only, the box keeps the label, answer, not-evidence line and link. The record paragraph and the "not a verdict about this theory" paragraph move below the curve, unreworded, next to `#where-now`. This is the same move the morning made for the position: the first screen claims less and the reasons sit one scroll down. The other eight pages keep today's box.
- **(b) I-048.** Unchanged, per 19c2b867.
- **(c) Turchin claim page.** Built only after (a) is green on production: a `question` field, both checkers' `CLAIM_THEORIST` maps, and the llms.txt line. Before shipping, read the page's other prose against the question: the series.json `association_note`, the /methods pairing note and `turchin` source.md (the r4/r5 lesson).

First command (RED before), extending check-holds-up-line with a "box on first screen" leg:
```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-holds-up-line.mjs https://sinusoidalhistory.com
```

### Acceptance (observable)
- **RED before:** the new leg fails both claim pages at 390x664 and 320x568 on production. The scratch read above already measured box bottoms of 745 and 740 against 664.
- **GREEN after, on production:**
  - `#does-it-hold-up` ends at or above the fold at 390x664 and 320x568 on every claim page.
  - check-holds-up-line covers all three claim pages, Turchin included.
  - The moved paragraphs still render verbatim (whole-text equality).
- **Positive controls:**
  - `check-year-position` 95/95.
  - `check-embed-snippets` 42/42.
  - `check-entry-folds` 320x568 13/13.
  - The "is not evidence" mutation still turns check-holds-up-line red.
  - Putting the record paragraph back in the box turns the new fold leg red.

### Delivery and encounter
- **Delivery:** CI green on the pushed sha, `check-deployed-sha-drift` in sync, then the checks above on production.
- **Encounter:** at this traffic, no arrival is the expected reading. I-051's 10-30 Search Console read gains a Turchin leg: a named Turchin query, readable at 4 or more impressions in 14 days.

USER-FACING: yes. Paths: `src/app/(app)/cycles/[id]/page.tsx`, `src/data/cycles.json`, `public/llms.txt`, `scripts/check-holds-up-line.mjs`, `scripts/check-year-position.mjs`, and tests (`seriesOverlay.test.ts`, `claimQuestion.test.ts`).

### HYGIENE INPUTS
- (a) Due rows not bearing on the choice: none. Source: the kickoff's "dated gates due today: 0".
- (b) Owed child rows: none. Source: the kickoff's "rows owed to you in skylark-site's ledger: 0 of 754".
- (c) CROSSED state reads: none.
  - stale-actionable: 0 of 14.
  - missingLinkedCommits: NOTHING SWEPT (0 of 0).
  - Queued rows: 2 (812b28b1 retro, answered c8500e37; a22d35ac close-session, superseded by this round).

## Afternoon round (round 2): P3 product-work loop

[P3 — Product-work loop]

**Action: improve the product.** Manager review 24813b55 approved I-053, then the Turchin claim page. All three claim pages (Dalio, Strauss-Howe and now Turchin) answer on a phone's first screen: the whole verdict box and its reason, with no drawing that reads as "yes". [standing-rules-hash: 88cc2dc9]

### 1. Implementation (main; CI GREEN on every head that deployed)
- **`ada68f6` + `10f5345` + `9187a07` (I-053).** The claim box keeps the label, answer, not-evidence line and link. The two reason paragraphs moved out of it, unreworded. check-holds-up-line gained a "whole box on first screen" leg and checks the reasons whole (Codex r6/r7).
- **`5558300` (corrective).** CI was RED on 9187a07: holdsUp.test (I-032) still expected the coverage number inside the box. Fixed and reviewed (r8). I had pushed without the full suite; I now run it before every push.
- **`8707b6b` (a regression of I-052 that I caused, fixed the same round).**
  - What went wrong: ada68f6's shorter box pulled the curve onto the first screen (it started at 472-525 on production). Walks A4 and A5 BOTH read the "now · 2026" dot on Dalio's crest as "it's at the top". A2/A3 had held only because the long box pushed the curve below the fold.
  - The fix: the order is now box, then reasons, then curve, then position. A new leg, "curve figure off first screen", went RED on production 5558300 (501/525/472) and is GREEN now.
- **`942a456` + `3fc8d7e` + `ac8e4bd` (part c).** /cycles/turchin asks "Does Turchin's secular cycle hold up?".
  - **Wording: not the review's 2020s suggestion,** for two reasons. The wave's 2020 peak is anchored on Turchin's own forecast window (cycles.json:70), so a 2020s question would sit a crest-on-the-unrest drawing under it. And the 43-character form broke the 70-character title test.
  - **Search Console: 0 named Turchin queries.** No number chose this.
  - **Prose read against the question (the r4/r5 lesson):**
    - the top-1% wealth note (series.json, methods.md, source.md) now calls the series "a proposed proxy" that "measures wealth concentration, not elite numbers or instability" (Codex r9 claims pass);
    - the COVID annotation no longer says "signals converge".
- **Review-quote correction:** the P1 packet's A3 quote "a minor clip …" was not in the walk file. It is withdrawn in the report (review 24813b55).

### 2. Delivery
- `check-deployed-sha-drift --service sinusoidal-history`: in-sync, live 28c5774e = head (92c7e69 after it is walk docs only).
- **Production, on 28c5774:**
  - check-holds-up-line **46/46** (was 44/44 with two claim pages; RED before: 40/44 on 5558300). Box ends at 485/509 (Dalio, Turchin) and 456/509 (Strauss-Howe). Curve figure starts at 761/833, 732/833, 761/857.
  - check-year-position **95/95**, with Turchin in claim form.
  - check-entry-folds 320x568 **13/13**: claim pages at 210px spare.
  - check-embed-snippets **42/42**, read on 5558300; embeds unaffected.
- **Red arms:**
  - The box leg failed 4/4 on production before the change.
  - Reasons back in the box failed 2 tests.
  - A one-word oracle mutation took the checker to 40/44.
  - The curve leg was RED on production 5558300.
  - Each was restored and the tree checked clean.
- verify-with-receipt `npm test`: TRUE exit 0, 374/374. It ran on 92c7e69; the only dirty path was the doc-shaped daily report.

### 3. Walks (synthetic, N=1 each, not real users; `docs/walks/2026-10-16-i052-i048.md`, pre-registered before each)
- **A4/A5** (on 5558300): NOT HELD on both. Bar 4: the crest dot was on screen. The cause and the fix are above.
- **A6/A7** (on 8707b6b): **HELD on both, bars 1-5.** A6: "There is no phase word, no 'peak', and no curve on the first screen." A7: "The record isn't long enough yet." Both could now say WHY from the first screen; A4/A5 could not. **I-053 closes.**
- **T1** (Turchin, on 28c5774): **HELD, bars 1-5.** "Nothing supports 'proven' … nothing on the screen backs 'predicted the 2020s'."

### 4. Encounter and outcome
- **Encounter:** blind. There is no client analytics by standing choice, and Search Console lags about 3 days. The next read is I-051 on 10-30, which now has Dalio, Strauss-Howe and Turchin legs. "Moved" = 4 or more named queries, or any at position 30 or better.
- **Outcome:** open.

USER-VISIBLE: three claim pages (/cycles/dalio, /cycles/strauss-howe, new /cycles/turchin "Does Turchin's secular cycle hold up?") show the whole verdict box and the reason it is not testable on a phone's first screen, with the curve below the fold — 28c5774 [proof: box bottom 745→485 / 841→509 (Dalio 390x664 / 320x568), curve 501→761 off screen; check-holds-up-line 46/46 and check-year-position 95/95 on production live 28c5774e; walks A6/A7/T1 HELD] [coverage: Search Console (page+query) · last good read 2026-10-16 · founder+test excluded no] [exposure: blind — no client analytics by standing choice; Search Console lags ~3 days · bug row I-051]

codexCalls: 5
adversarialReviews: 5 — EXECUTED (r6 on ada68f6, r7 on 10f5345, r8 on 5558300, r9 on 5558300..942a456 incl. claims pass, r10 on 3fc8d7e; read-only, banner workdir checked each time). Finding fates:
- r6 MED: fixed in 10f5345.
- r6 LOWs: fixed in 10f5345.
- r7 LOW: declared ceiling (9187a07).
- r8: no defects.
- r9 MED (checker): fixed in 3fc8d7e.
- r9 MED (claims): fixed in 3fc8d7e.
- r9 LOW: declared.
- r10 MED: the third appearance of "a leg passes for the wrong reason". The leg was narrowed and the ceiling declared, not patched (ac8e4bd).
- r10 LOW: fixed in ac8e4bd. ac8e4bd itself is BY-INSPECTION: it only narrows the claim.

hygiene helper: DISPATCHED 18:55Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-16-r2.md PRESENT (22 lines; nothing to disposition; check-wait-justification PASS, check-engineering-zero PASS, no READ-MUTATED, no production finding).

### Remains
- **I-048:** unchanged per 19c2b867. A4/A5 showed the same crest reading on the claim page whenever the curve is on screen, so I-048's open question (should the drawn 2026 position claim less?) is now evidenced on two surfaces.
- **To I-043:** the walkers' unknown words. New this round: "secular cycle" is never defined on the Turchin page, and "this site's drawn wave" is named on the first screen with no wave visible.
- **I-051 (10-30):** gains a Turchin leg.
