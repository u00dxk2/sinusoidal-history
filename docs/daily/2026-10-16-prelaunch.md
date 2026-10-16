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
