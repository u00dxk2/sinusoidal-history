# sinusoidal-cycles — 2026-11-25 (Wednesday, MT)

## BLUF

**The worked example is live on all ten cycle pages (451a07a7), after David's calendar-years answer.** Each `/cycles/<slug>` page now shows its own arithmetic in its served HTML: the curve formula with that theory's own peak and period, the curve height a quarter-period at a time, and on nine pages the paired record's lowest and highest values carried through the chart's scaling. The home page links all ten cycle pages and its title says what it shows. Released under dispatch 739aa2e2; the bus post is 701d1659.

**P1 picks I-089 for P3:** the cycle pages, /about, /methods and /cycles say the project found Turchin's violence database "in August 2026", and no committed record supports that month. The bar names an overclaiming sentence as what breaks the would-tell-a-friend moment. The packet is under Recommendation and waits for the manager review.

## What changed

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
