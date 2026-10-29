# sinusoidal-cycles — 2026-10-29 (Thursday, MT) — full day

## BLUF

[P1 — Evidence and choice]

This is a full day (David, 10-29, verbatim: "regular day today not a light day. go1"). The selected item is **I-065**: the site still says, in 16 lines across 9 files, that each cycle *is* one period. Since I-061 every curve stops at today, so for Turchin (81 of 150 years drawn) and Perez (53.5 of 55) that sentence is false. The fix is a copy batch plus a claims pass from the other model family (portable rule 6). CI is green on HEAD 207b829 and live = head. No David card, no product-love cycle today. The 5 zoom-strip rows due today (I-067..I-071) go to hygiene.

## Recommendation

### P1 selection packet

- **Outcome:** I-065 — make every reader-facing description of the drawing say what it actually draws.
- **User problem, in a reader's words:** "It says each curve is one full period, but the Turchin curve stops halfway: is the chart broken, or is the text wrong?" (HYPOTHESIS: no reader has said this; the mismatch is measured below, the confusion is inferred.)
- **Evidence:**
  - OBSERVED · I-065 readCommand (`git grep -n -i -E "drawn as one period|…" -- public src`) at HEAD 207b829 · 16 lines in 9 files: `public/about.md` 11/13/17, `public/data/state-2026.source.md` 4, `public/llms.txt` 30/31/33, `src/app/(app)/about/page.tsx` 46/58/74, `src/app/(app)/cycles/[id]/page.tsx` 475 (every cycle page), `src/app/api/v1/state/route.ts` 19 (the 410 note), `src/components/CycleFacet.tsx` 144 (a comment, not served), `src/lib/claimQuestion.ts` 21 (the three claim pages) and its test 28/46. Same count as 10-25, 10-27 and 10-28.
  - OBSERVED · I-065 notes (Codex r2 on 10-24, STATIC, CONFIRMED): "each cycle is one period" is false for Perez (53.5 of 55 years drawn in 2026) and Turchin (81 of 150). `sampleDrawnPeriod` in `src/lib/cycleMath.ts` cuts at the current year.
  - OBSERVED · `check-cycle-rotation --lane sinusoidal-cycles` · exit 0 · "no product-love cycle picks this lane today".
  - OBSERVED · `answered-cards --project sinusoidal-cycles` · no waiting, answered or pending-verify cards.
  - OBSERVED · kickoff state reads · 0 queued rows, 0 rows owed in skylark-site's ledger, 0 stale-actionable of 18.
  - MISSING · real-user evidence. The bar reads UNMEASURED (no client analytics, by standing choice). The next instrument read is the 10-30 Search Console read on the three claim pages (I-051).
- **Permission:** I-065 is an open P3 issue owned by this lane, not parked, frozen or waiting, with no open card. It's copy correction on the lane's own pages, which the lane decides. It's published under the site's name, so portable rules 3 and 6 require a claims pass from the other model family before push.
- **Next action:** kind = improve. First command, to pin the claim-page sentence before editing it:

  ```
  git -C C:/dev/skylark/sinusoidal-cycles grep -n -i -E "drawn as one period|draws each cycle\s+as one period|is drawn as one period|curve is one period|draws one period of a wave" -- public src
  ```

  Then: reword each reader-facing hit to a narrower true sentence ("at most one period around its reference peak, cut at today", matching the 92fa188 / 646e89a wording), move `claimQuestion.test.ts` and any whole-text checker pins (`check-holds-up-line`) with it, edit `about/page.tsx` and `public/about.md` in the same commit (mirror rule), sweep `public/llms.txt`, run the cos-math audit (no year claims should change), then the Codex claims pass (read-only, banner workdir checked).
- **Acceptance condition:** the readCommand exits 1 at HEAD, or every remaining hit is listed with a reason it is true as written (e.g. the dated provenance file `state-2026.source.md`). `npm test` and the claim-page checkers are green, and the Codex claims pass returns no REFUTED-AS-WRITTEN that's left unaddressed. After deploy, the live `/about`, `/cycles/turchin` and `/llms.txt` serve the new wording.
- **Delivery and encounter checks:** delivery: `check-deployed-sha-drift --service sinusoidal-history` reads in-sync on the fix sha, plus `check-rendered-text.mjs snap https://sinusoidalhistory.com/about` showing the new sentence (server-rendered prose, so that gate sees it). Encounter: the GSC per-page read (`scripts/gsc-read.mjs`) on /about and the claim pages; at this traffic level an impression on those pages after the deploy date is the readable event, about N≥1 per page by the 10-30 read. A reader seeing the sentence cannot be observed (no analytics), so exposure will read blind or no-arrival.
- **USER-FACING: yes.** Paths: `public/about.md`, `public/llms.txt`, `src/app/(app)/about/page.tsx`, `src/app/(app)/cycles/[id]/page.tsx`, `src/lib/claimQuestion.ts`, `src/app/api/v1/state/route.ts` (served 410 body); internal: `src/lib/claimQuestion.test.ts`, `src/components/CycleFacet.tsx` (comment), `public/data/state-2026.source.md` (served provenance text, so treat it as user-facing), `continuity/items.json`.
- **HYGIENE INPUTS:**
  - (a) Due rows that don't bear on the choice: 5, from this morning's snapshot ("snapshot written — 5 gate(s) due on/before 2026-10-29"): I-067 (never run; Playwright `check-brush-widened.mjs`), I-068 (stamped 10-27, the `end: 2050` grep), I-069 (never run; Playwright `check-strip-near-chart.mjs`), I-070 (stamped 10-27, the phone dek grep), I-071 (stamped 10-27, the rounding grep). Primer rule: run I-067 and I-069 alone, one at a time.
  - (b) Owed child rows in the orchestrator's ledger: none (kickoff read "rows owed to you": 0 of 769).
  - (c) State reads marked CROSSED: none. Only the dated-gates read carried a threshold clause (5 owed today, listed in (a)). Stale-actionable 0 of 18; missingLinkedCommits swept nothing; queued rows 0.
- **Prior retro finding that bears on the choice:** no prior-day retro on record for this lane.

## What changed

[P3 — Product-work loop]

**I-065 shipped and closed.** The manager review (cd482e31) redirected the scope to the whole claim class and required the wording to be true per cycle. Only Perez (drawn 1972.5–2026 of a period ending 2027.5) and Turchin (1945–2026 of a period ending 2095) are cut in 2026; the other eight keep "one period". Every sentence about the cycles as a group now says "at most one period, cut at today where that period has not ended yet".

- **Commits:** 46090ff (copy batch), 36c9da0 (Codex r1 fixes), 5e8e417 (r2 shape change), 64bbb00 (r3 test fix), 9ffe14b (320px regression fix). CI ci.yml was green on 64bbb00 and 9ffe14b (run 40911990232: lint, typecheck, npm test, build).
- **Delivery:** `check-deployed-sha-drift --service sinusoidal-history` reads in-sync, live 9ffe14bd = head.
- **Before → after, live:** /cycles/turchin "This page draws one period of a wave around the peak year this site uses for Peter Turchin's cycle." → "… Peter Turchin's cycle, up to today."; its extrema line "over the one period this site draws (1945–2026)" → "over the part of its one period this site draws, up to today (1945–2026; the period has not ended yet)"; /about "Each curve is one period …" → "Each curve is at most one period …, cut at today where that period has not ended yet". The figure and poster labels say "part of one N-year period" for a cut cycle. The poster headline is now "The cycles, each drawn once".
- **Claim-page checker:** `check-holds-up-line https://sinusoidalhistory.com` read 45/46 on 64bbb00. The one failure was 320x568 Turchin: the verdict box ended at 605 of 568 because my first cut sentence ran about 70 characters long. After 9ffe14b it reads **46/46**, with the box ending at 557.
- **Codex, read-only, four rounds:**
  - r1 REJECT: four MED and one LOW fixed. The HIGH ("the present is computable") was REFUTED: 1945–2026 was already served at 207b829, and the cut curve is the I-061 design.
  - r2 REJECT: the same defect class came back, so the shape changed to "at most one period" (portable rule 2).
  - r3 ACCEPT: 42 served hits, 0 refuted.
  - r4 ACCEPT on 9ffe14b.
- **Instrument:** `src/lib/cutPeriodCopy.test.ts` renders all ten cycle pages and refuses unqualified whole-period wording on a cut page. Red-armed: 2 of 3 failed on 46090ff, and it failed on 36c9da0 (Perez, "a single period").
- **Declined suggestion:** "81 of its 150 years". With the peak at the period's midpoint, a count of years drawn says where the present sits, which I-061 forbids.
- **Encounter:** blind. The site has no client analytics. The claim pages' read is I-051 (Search Console, 10-30).

<!-- findings:begin -->
- The P1 packet's acceptance ("the readCommand exits 1") could not be met as written, because the whole-period branch legitimately says "one period" for eight cycles. The readCommand is now the rendered-page rule test (exit 0 = the rule holds).
- A copy change on a claim page has a layout cost. The 320x568 first-screen rule binds the length of the verdict-box sentence, and that rule is only checked by the production Playwright checker, not by CI.
<!-- findings:end -->

## State Appendix

### Section 0

- Primer: `docs/cold-starts/2026-10-28.md` read (no 10-29 primer, which is the normal morning state).
- Listener: 🟢 SSE alive (hello 14:52:06Z, slug sinusoidal-cycles) + `/loop-tick 2m` armed by ScheduleWakeup; waker ladder ranks 1-3 running.
- Codex: GREEN (kickoff `[codex-probe: GREEN …]` line, 14:49Z).
- CI: `check-ci-status --workflow ci.yml` → GREEN for 207b829c (1 success, 0 failures, 0 pending).
- Drift: `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live 207b829c = head.
- Harness: running 2.1.312 · fleet UNIFORM (28 of 28) · installed 2.1.312 (SAME).
- Recs yesterday: one, "product work resumes on the next non-light day, starting with the I-065 copy batch". Status: carrying today → P3 (this selection).
