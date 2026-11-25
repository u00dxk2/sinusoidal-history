# sinusoidal-cycles — 2026-11-25 (Wednesday, MT)

## BLUF

**The worked example is live on all ten cycle pages (451a07a7), after David's calendar-years answer.** Each `/cycles/<slug>` page now shows its own arithmetic in its served HTML: the curve formula with that theory's own peak and period, the curve height a quarter-period at a time, and on nine pages the paired record's lowest and highest values carried through the chart's scaling. The home page links all ten cycle pages and its title says what it shows. Released under dispatch 739aa2e2; the bus post is 701d1659.

**P1 picks I-089 for P3:** the cycle pages, /about, /methods and /cycles say the project found Turchin's violence database "in August 2026", and no committed record supports that month. The bar names an overclaiming sentence as what breaks the would-tell-a-friend moment. The packet is under Recommendation and waits for the manager review.

## What changed

**P3, I-089 closed: the Turchin database sentence now cites a source a reader can open (b9ccb23a, live).** It said the project found the database "in August 2026". The only record of that month is the committed 2026-08-24 fact-check summary, whose primary reports are not committed. It now cites the Wayback copy of Turchin's database page dated 2026-06-26, re-fetched today ("Data for download: USPVD2010.xlsx", "between 1780 and 2010", no license text). /methods and methods.md link the capture.
- Surfaces: the cycles.json caveat (it also feeds /api/v1/cycles) + about.md, /cycles, /methods + methods.md, and the design-pass empty state (`DP_NO_SERIES_REASON`) with its test pin. The two "Since August 2026 … spectral verdict" lines stay: cfda495 / 84b2097 landed 2026-08-19.
- Codex claims pass, effort high, banner checked: 8 of 8 HOLD (`docs/claims/2026-11-25-i089-codex-claims.md`). Flag-on test run green. Red-armed: the old wording fails `holdsUp.test`.
- CI ci.yml GREEN on b9ccb23a (run 45691218237); drift in-sync, live b9ccb23a. Signed-out GETs (200 each) of /cycles/turchin-fathers-sons, /cycles, /methods, /methods.md, /about.md and /api/v1/cycles: each carries "June 2026 archived copy" and 0 matches for the old August wording.
- Hygiene helper: draft `tmp/hygiene-draft-sinusoidal-cycles-2026-11-25.md`. It re-dates I-086, I-087 and I-071 to 12-02. Engineering zero is WAIVED by W-007 until 11-28. Its two READ-MUTATED entries were this lane's own I-089 edits.

**Released (dispatch 739aa2e2; I-090 closed).** David's answer, banked verbatim in `docs/answers/2026-11-21.md`: "10 yes" to "allow years that come from the historical record itself, and still show no present-day position on the curve". The orchestrator's scope note: "His yes is to that sentence and nothing wider."

| Commit | What it is |
|---|---|
| `757d9a2` | The held build 37cc794, cherry-picked onto main (src patch-id 868ea4f2, identical). 030d293 dropped: its docs are a subset of main. |
| `1fc9ca0` | The curve table prints the offset from the peak and the height, with no year column. Those years were construction years, not record years, so they are outside his yes (Codex finding 2). Record years stay (finding 1, inside his yes). The home test renders inside NuqsTestingAdapter and compares the emitted JSON-LD with the links (Codex LOW 3). |
| `451a07a` | The home test also asserts that Viz renders. Answers file and Codex confirm record. |

- **Codex confirm, effort high** (79,313 tokens; banner workdir, model gpt-6.2-sol, sandbox read-only and effort high, all checked): the new sentence HOLDS; every record year comes from its record; one test gap was fixed. Its verdict held on the reference-peak year in the formula. **DELIBERATE (the lane's reading):** that year is the stored parameter and is live on every cycle page already (`/cycles/schlesinger-jr` at 4b22f15: "Computed from period 30 and reference peak 1970", "1970" 26 times). Put to the orchestrator in 701d1659. Record: `docs/claims/2026-11-25-codex-confirm-1fc9ca0.md`.
- **Red-armed:** a year cell put back fails 10 worked-example tests. A reversed emitted ItemList, a removed adapter and a deleted `<Viz>` each fail the home test. Restored: green, with a clean tree. Local 641 of 641 tests across 59 files.
- **Live:** CI ci.yml GREEN on 451a07a7 (run 45687057210). `check-deployed-sha-drift --service sinusoidal-history --wait`: in-sync, live 451a07a7. JS-off GETs, as a browser and as OAI-SearchBot (curl): `/cycles/khaldun` curve cells `−0.50 −1.00 −0.25 0.00 0.00 +1.00 +0.25 0.00 +0.50 −1.00`, no 1759, record years 1944 and 2011 present. `/cycles/perez` has 4 rows. `/` has the title "Ten long-wave theories of history, one time axis · Sinusoidal History", 10 cycle links and an ItemList. `/methods` has the title "Methods: curve model, data sources, normalization · Sinusoidal History". IndexNow HTTP 200 for 12 URLs.

## Recommendation

### P1 selection packet

- **Outcome + item:** narrow the unsourced "August 2026" date in the Turchin database sentence (I-089). The user problem in a reader's words: "how do you know that's when it was?" A site whose whole offer is "someone checked" cannot carry a date it cannot show.
- **Evidence:**
  - OBSERVED · `--run I-089` (2026-11-25T19:44Z, exit 0, sidecar `continuity/read-outputs/I-089.txt`) · 9 lines over the row's 6 named surfaces. 7 are the Turchin-database sentence: `public/about.md:155`, `public/methods.md:205`, `src/app/(app)/cycles/page.tsx:179`, `src/app/(app)/methods/page.tsx:473`, `src/data/cycles.json:128`, `src/lib/designPassCopy.ts:65,68`. 2 are a different claim, "Since August 2026 every cycle–series pairing carries a pre-registered spectral verdict" (`public/methods.md:161`, `src/app/(app)/methods/page.tsx:292`).
  - OBSERVED · `git log --diff-filter=A -- scripts/spectral_verdict.py public/data/spectral/verdicts.json` · `cfda495` and `84b2097`, both 2026-08-19. So the spectral "Since August 2026" lines are backed by the committed record (closeWhen (b)) and stay.
  - OBSERVED · I-089's own note: the only source for the database month is the 08-24 fact-check, whose reports are not committed. The row names a June 2026 archived copy as a kept source.
  - MISSING · any real-user reading of these sentences. The bar reads UNMEASURED (`docs/evangelism-bar.md`: no client analytics by standing choice). No reader has written to the site.
  - HYPOTHESIS · a reader who checks one date and finds it unsupported discounts the verdicts beside it.
- **Permission:** lane-owned copy; no David ruling on this row. The class is outward copy on six surfaces plus the `.md` mirrors, so it owes round 0, a Codex claims pass, CI, deploy and a signed-out GET (I-089's closeWhen (a)).
- **Next action (improve):** verify what the kept June 2026 archived copy shows, then narrow the seven lines to it, with the mirrors in the same commit. First command:

  ```
  git -C C:/dev/skylark/sinusoidal-cycles grep -n -i -e "June 2026" -e "web.archive.org" -e "USPVD" -- docs public src
  ```

- **Acceptance:** I-089's readCommand returns only the two spectral lines (the database sentence names no month that lacks a committed source); the Codex claims pass HOLDS on the new sentence; CI green; a signed-out GET of `/cycles/turchin-fathers-sons`, `/methods` and `/about.md` shows the narrowed text.
- **Delivery and encounter:** delivery is the signed-out GET after deploy. Encounter: no instrument sees a reader on these pages (no client analytics). A Search Console page-only read on `/cycles/turchin-fathers-sons` is readable at about 100 impressions, which at current traffic is beyond this month. Reported as unmeasured.
- **USER-FACING: yes** — `src/data/cycles.json`, `src/lib/designPassCopy.ts`, `src/app/(app)/cycles/page.tsx`, `src/app/(app)/methods/page.tsx`, `public/about.md`, `public/methods.md`, and the cos-math audit if any rationale year moves (none expected).
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice, 3 of 5 (`dated gates due today`): I-086 (11-24, one day late, never run), I-087 (11-24, one day late, never run), I-071 (11-25). I-090 was closed today on delivery and I-089 is the choice.
  - (b) owed child rows: none — read "rows owed to you in skylark-site's ledger" (0 of 855).
  - (c) CROSSED state reads: none — read every state read in the kickoff header. None printed a crossed threshold. Stale-actionable 1 of 10 (7d) printed no threshold clause.

## State Appendix

### Section 0

- **Primer:** `docs/cold-starts/2026-11-21.md` (no primer for 11-25). Its first action was run: `check-due-gates-dispositioned --print`, 5 due.
- **Listener:** 🟢 SSE alive (hello 2026-11-25T19:26:33Z, restart marker pid 39372) + loop armed by ScheduleWakeup; waker ladder ranks 1-3 running.
- **Codex:** GREEN (the kickoff's machine probe, 2026-11-25T19:32Z; this session's confirm run completed).
- **CI + drift:** `check-ci-status --workflow ci.yml` GREEN on 451a07a7. `check-deployed-sha-drift --service sinusoidal-history` in-sync, live 451a07a7.
- **Harness:** running 2.1.332 · fleet UNIFORM (28 of 28) · installed 2.1.332 (SAME).
- **North star:** retention and word of mouth. Today's ship is reported as unmeasured (the bar's instrument is not built).
- **Yesterday's recommendations:** no report on 11-22..11-24. The 11-21 report's open recommendation was the held build's release: executed (451a07a7, this report).
- **Snapshot:** `--snapshot` taken once: "5 gate(s) due on/before 2026-11-25".
- **Cards:** `answered-cards --project sinusoidal-cycles`: 0 lane cards, 1 portfolio rider (312499ee, heavy jobs; nothing for this lane to act on).
- **Prior-day retro (Q0):** no prior-day retro on record for this lane.
- **Product-love rotation:** `check-cycle-rotation --lane sinusoidal-cycles` exit 0: no cycle picks this lane today.

### Close

ACTION: COMPLETED · item I-089 · P3 8cb16542 (manager review eb872fa1: COMPLETED, no defects). The held worked example was also released today on David's answer (I-090 closed, 451a07a7, post 701d1659).

- **Since the P3 post:** nothing user-facing changed. Docs commit 99674d0 pushed.
- **Hygiene draft:** 3 lines, 3 accepted · 0 amended · 0 rejected. I-086, I-087 and I-071 re-dated to 2026-12-02, each with a note (none was worked today; I-087's SCREENS.md batch did not move). READ-MUTATED, quoted: "READ-MUTATED I-087 src/lib/designPassCopy.ts — NOT named in the readCommand: may be the lane's own concurrent P3 edit". It and the I-086 entry (7 paths) are this lane's own I-089 edits; HEAD did not move during the reads. check-wait-justification: "RESULT: PASS — 35 of 98 row(s) carry `waitJustification`; 0 warn / 0 info". check-engineering-zero: "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable, WAIVED by a live waiver (Dependabot #62 until 2026-11-28, W-007)".
- **W-007 (the Dependabot #62 waiver), dated for 2026-11-28:** its onTrigger is met early. Read today: alert #62 open (minimatch >= 7.0.0, < 11.0.1). `@typescript-eslint/typescript-estree@8.74.0`, published 2026-11-23, depends on `minimatch ^11.0.1`. eslint-config-next 16.4.5 accepts `typescript-eslint ^8.56.0` (installed 8.59.0). So on 11-28: a lockfile-only `npm update typescript-eslint`, then lint, typecheck and test, CI, deploy, and alert #62 reading fixed → close W-007. A red lint re-dates the waiver with the rule named; never an override. Held to 11-28 so the release is not two days old when it is taken.
- **Ledger delta:** closed I-090 (on delivery) and I-089 (closeWhen (a)); I-089's readCommand expected result corrected to the 2 spectral lines; re-dated I-086, I-087, I-071 → 12-02; W-007 note added.
- **Verify:** `check-due-gates-dispositioned` (no flag): "verdict: CLEAR — every gate due at Phase 0 was dispositioned." with "snapshot: tmp\due-gates-snapshot.json — CURRENT (taken 2026-11-25)".
- **Pending reads:** W-007 on 2026-11-28; I-086, I-087, I-071 on 2026-12-02; W-005 (page-only click-through on `/`, `/methods` and the cycle pages, now dated from the 451a07a7 deploy) near 100 post-change impressions; the 60-day baseline about 2027-01-20.
- **The dated yearly testability verdict question** (never put to David) now has a row: I-091, owner this lane, re-check 2026-12-16. It goes to David as a card only if a build is proposed, because nothing is built or blocked on it today (P5 ack ea7a9377).