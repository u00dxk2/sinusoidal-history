# sinusoidal-cycles — 2026-11-07 (Saturday, MT) — full day

## BLUF

**P3 shipped I-080's last copy leg, live a781cf5, CI green.** No served sentence now calls a cycle's period "the theory's own" or "stated" period. The pages say "the period this site uses for the theory", and the periods mix theorists' figures, range midpoints and values this site derived. Old phrases went from non-zero to 0 on 13 of 13 production URLs, and the new wording is on 13 of 13. Codex r1-r2: 0 REFUTED; every finding was fixed except one, kept deliberately. Manager review a6b19d90: COMPLETED. Encounter blind (no client analytics). I-080 is now monitoring for one read, the crawler check on 11-11. The P1 selection follows.

**P1 selects I-080's last leg: every served sentence that calls a cycle's period "the theory's own" or "stated" period.** For five of the ten cycles that is not true. Round 5 item 8 (`docs/fact-check-2026-08-24-round-5.md:18`) found that Modelski (a range), Schlesinger (a derived value), Khaldun, Strauss-Howe and Dalio give no explicit period in years in the primary text. The README was already narrowed to "the period this site uses for the theory". The public pages were not: 12 sentences across /methods, /colophon, /cycles, the home page, llms.txt, each per-cycle spectral caption and the spectral source note. Kind: improve. Due 11-11.

The row's own readCommand reads **4 lines today, not the 9 the 11-06 close recorded.** The narrow regex misses "its own stated period", "the exact stated period", "their stated period" and "declared period". This packet scopes the leg by meaning, not by that regex, and the row's readCommand gets re-pointed at the close.

Full day (the orchestrator's kickoff: "Day: 11-07 Saturday, full day"). Section 0 is clean: CI GREEN on 06d5ea86, deploy in sync, Codex probe GREEN, harness UNIFORM on 2.1.319. 0 dated gates are due today, and no product-love cycle picks this lane.

## What changed

[P3 — Product-work loop]

**I-080 row 1 shipped, live a781cf5, CI green.** Kind: improve. Manager review 53a23275: APPROVE, with two notes taken. The Schlesinger leg narrows now (5 surfaces), and the ban shares one list with `cutPeriodCopy.test.ts`.

- **Commits:** 9b9b33c (the copy, 18 surfaces) → 41f79f6 (Codex r1 fixes) → a781cf5 (Codex r2 test fixes). CI ci.yml green on a781cf5 (40 s).
- **Before → after:**
  - /methods + methods.md, three sentences: "tested at the theory's own period" → "tested at the period this site uses for the theory"; "3.0 full periods of the theory's stated cycle" → "3.0 full periods of the cycle, at the period this site uses for the theory"; "power at the theory's exact stated period … the rhythm the theory names" → "power at exactly the period this site uses for the theory … that rhythm", plus "The stored periods mix theorists' own figures, midpoints of stated ranges and values this site derived." (round 5 :18). The true exactness stays: exactly 1/P, never fitted or scanned.
  - /colophon + colophon.md, /cycles, llms.txt: "the theory's own period" / "its own stated period" → "one period per theory (for some theories the theorist's own figure, for others the midpoint of a stated range or a value this site derived)". Non-exhaustive on purpose, per Codex r1: no held line classifies Khaldun's 120.
  - Home: "each theory's declared period" → "one period this site uses for the theory". /cycles index: "their stated period" → "the period this site uses for each". llms.txt protocol line and both spectral captions (`spectralFigureText.ts`): "the exact stated period" → "exactly the period this site uses for the theory". spectral.source.md the same.
  - Schlesinger (cycles.json caveat, about.md x2, /about, stimson source.md): "his stated period" → "a 30-year period this site derived from the dated eras of his scheme" (round 5 :24; cycles.json:45 holds the 29- and 31-year intervals).
  - conflict_deaths.source.md (Codex r1 missed surface): "roughly every 120 years" and "Khaldun's anchoring of the late-1700s" → "this site draws it with a roughly 120-year period" and "The cycle's 1789 anchor is this site's editorial choice, not Khaldun's" (cycles.json:8).
  - /methods rendered "theory;0 of the 9 do" for about 30 minutes of local work (Codex r1 LOW). It was fixed before the push and never served.
  - "Last updated" on about, methods and colophon, page and mirror: 2026-11-07.
- **Kept, with reason:** "borrows one theory's period" (CrossGridList, methods.md:165). It names which theory's stored period is borrowed, not where the period came from. "theorist-stated period in years" (/cycles excluded-list bar) and "we plot a stated midpoint" were already honest.
- **Instrument:** `src/lib/periodProvenanceBan.ts` is ONE banned-phrase list. `i080Claims.test.ts` walks every served text file with it (public/**/*.md, *.json, llms.txt, src/data/*.json, non-test .ts/.tsx under src/app, src/components and src/lib), with an exact-path positive control per tree. `cutPeriodCopy.test.ts` applies it to every rendered cycle page. Pins: each /methods sentence on both mirrors, the colophon on both, the Schlesinger caveat with about.md, the Khaldun note, and the rendered /methods intro exactly once. Red-armed five times. Old methods.md headline restored → 2 of 20 FAIL. Old caption phrase → cutPeriodCopy FAIL on khaldun. A listed phrase in conflict_deaths.source.md → the walk FAILS on that file. The space removed → the rendered check FAILS. .json dropped from the walk → the control FAILS on verdicts.json. Each was restored, and 180 of 180 passed in 11 files. Ceiling: a phrase list. It does not catch named possessives ("Khaldun's own stated period") or a phrase built across variables.
- **readCommand:** re-pointed to a meaning-scoped grep, the same list. 17 lines at 06d5ea8, 0 at a781cf5. `--run I-080` exit 1 is git grep's no-match, and the stamp is on the row.
- **Codex, read-only foreground pipe, banner `workdir: C:\dev\skylark\sinusoidal-cycles` checked each round.**
  - r1 on 9b9b33c: 22 HOLDS, 0 REFUTED, 4 UNVERIFIABLE-HERE (the exhaustive three-way list), 1 missed surface (conflict_deaths), 3 defects (the missing space, a source-only pin, the 13-file allowlist). All CONFIRMED and fixed in 41f79f6.
  - r2 on 41f79f6: 8 HOLDS, 0 REFUTED, 0 UNVERIFIABLE, 4 test defects. Public JSON not walked, the control too loose, and the rendered pin unscoped: CONFIRMED, fixed in a781cf5. Source scan versus rendered text: DELIBERATE, the stated ceiling. a781cf5 is test-only and was not re-reviewed.
- **Round 0** (a helper listing what the sources say before the sentences were written) was not run. The sentences narrow toward two held lines (round 5 :18, :24) and README:67's shipped wording, and the claims pass is the cross-family check. Codex r1 still found a missed surface that a round 0 sweep might have found first.
- **Cos-math audit:** `python scripts/audit_cycle_rationales.py` runs clean. No year claim changed.
- **Delivery:** `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live a781cf59 = head (11:17:03 MT). Production fetch, cache-busted, 13 URLs, all 200. Old phrases before (live 06d5ea86): `/` 5, `/methods` 8, `/methods.md` 4, `/colophon` 2, `/colophon.md` 1, `/cycles` 4, `/llms.txt` 1, `/cycles/kondratiev` 2, `/about` 4, `/about.md` 2, spectral.source.md 1, stimson source.md 1, conflict_deaths source.md 2. After: 0 on all 13. New phrases after: non-zero on 13 of 13. (Corrected at the close: my fetch pattern read the stimson note as 0 because it wanted "a 30-year…". The manager review's own cache-busted fetch at about 18:35Z read "30-year period this site derived" 1 there.)
- **Encounter:** blind, the site's standing state (no client analytics, `docs/evangelism-bar.md:30`; David's card 1e069bb4). The readable event is a crawler fetch of /llms.txt, /about.md or /methods.md after 2026-11-07 18:17Z in `scripts/crawl-read.mjs`, readable at N=1 and dated 11-11 on I-080.

USER-VISIBLE: A reader of /methods, /colophon, /cycles, the home page, /about, every cycle page's spectral caption, llms.txt and three data provenance notes no longer reads that each cycle's period is "the theory's own" or "stated" period; the pages now say it is the period this site uses, and that the periods mix theorists' figures, range midpoints and values this site derived — a781cf5 [proof: production fetch, cache-busted, 13 URLs: old phrases non-zero on all 13 on live 06d5ea86 this morning → 0 on all 13 after deploy, live a781cf59 in-sync per check-deployed-sha-drift at 11:17 MT] [coverage: Search Console page impressions (gsc-read.mjs) · last good read 2026-11-05 · founder+test excluded no] [exposure: blind — no client analytics by standing choice, Search Console lags ~3 days · bug row I-080]

<!-- findings:begin -->
- The row's own readCommand undercounted: its narrow regex read 4 lines this morning against 9 recorded on 11-06, and the meaning-scoped search found 17 lines across 10 files. It is re-pointed.
- Codex r1 found the P1 packet's provenance parenthetical overclaimed (it read as exhaustive) and found a surface the packet missed (conflict_deaths.source.md). Both are fixed.
- The 11-06 close note on I-034 said its wait moved with the re-date, and it had not (hygiene helper, WAIT_UNTIL_EXPIRED). It was fixed this morning, status b9d45eff.
<!-- findings:end -->

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** I-080, last leg (claims-pass row 1). Public pages say each cycle is drawn from "the theory's own period" or tested at "the theory's exact stated period". For five of the ten cycles the period is this site's midpoint, derivation or reading. Kind: improve.
- **User problem, in a reader's words:** "Someone told me history runs in cycles and I can't tell whether any of it holds up or is just a good story." (`docs/evangelism-bar.md`, HYPOTHESIS; no real reader has said it.) The bar's own words: "What breaks the moment: any sentence that overclaims." If a reader checks Dalio or Strauss-Howe and finds no such number in the book, "the theory's exact stated period" is the overclaim they find, and it sits in the /methods sentence the page tells them to "read first".
- **Evidence:**
  - OBSERVED · I-080's readCommand, run today on 06d5ea86: `git grep -n -E "theory's (own|exact)( stated)? period" -- public src` → **4 lines**: `public/colophon.md:19`, `public/methods.md:11`, `public/methods.md:161`, `src/app/(app)/methods/page.tsx:73`. The 11-06 close recorded 9. **That disagreement is a finding:** the regex cannot see the other wordings of the same claim, and the React lines that wrap ("theory&apos;s" entities, or a line break inside the phrase) do not match it.
  - OBSERVED · a meaning-scoped search today (Grep, `stated period|own period|exact period|stated cycle|declared period` over `public` and `src`). The **user-facing sentences carrying the claim, 12 in total:**
    1. /methods headline: `methods/page.tsx:73` ↔ `methods.md:11` ("tested at the theory's own period")
    2. /methods spectral intro: `methods/page.tsx:265` ↔ `methods.md:144` ("3.0 full periods of the theory's stated cycle")
    3. /methods protocol: `methods/page.tsx:280` ↔ `methods.md:161` ("power at the theory's exact stated period")
    4. /colophon: `colophon/page.tsx:67` ↔ `colophon.md:19` ("built from the theory's own period")
    5. /cycles: `cycles/page.tsx:405` ("from its own stated period")
    6. /cycles: `cycles/page.tsx:213` ("check at their stated period")
    7. home: `page.tsx:86` ("each theory's declared period")
    8. llms.txt `:15` ("harmonic regression at the exact stated period")
    9. llms.txt `:24` ("power at the stated period")
    10. every /cycles/<slug> spectral caption: `src/lib/spectralFigureText.ts:33` (tested form)
    11. the same caption: `src/lib/spectralFigureText.ts:37` (untested form, the one all nine pages show today). Both are pinned by `spectralFigureText.test.ts:28`.
    12. `public/data/spectral/spectral.source.md:14-15` ("the theory's exact stated period"; served at /data/spectral/)
  - OBSERVED · the held source for the narrowing. `docs/fact-check-2026-08-24-round-5.md:18`: "Modelski (range), Schlesinger (derived), Khaldun, Strauss-Howe, Dalio don't meet 'an explicit period in years from the primary text.'" `docs/housekeeping/2026-11-04-claims-pass.md:11` (row 1): "CONFIRMED as imprecise, not as a false claim about a person … Per-cycle pages do disclose it (about.md:141)." The established replacement wording, already shipped: README:67, "the period this site uses for the theory", and README:74-75, "The stored periods mix theorist figures, range midpoints and derived values."
  - OBSERVED · wording already honest, to be **kept**: `cycles/page.tsx:449-453` ("an identifiable period - a single figure or a stated range … we plot a stated midpoint and say so on the cycle's page"), `cycles/page.tsx:71` (the excluded-list "theorist-stated period in years" bar, which is about what *excluded* theories lack), and `cycles/page.tsx:438` ("the theorist's own evidence for the period", a statement about the confidence tag).
  - HYPOTHESIS, P3 checks it against source before touching it · the Schlesinger caveat "read the curve as a stylization of his stated period" (`cycles.json:50` → `about/page.tsx:101`, `about.md:77`). Round 5 calls Schlesinger's period "derived": the intervals 29 and 31 average 30 (`round-5.md:24`). If "stated" does not hold there, it narrows too. Because the change is in `cycles.json`, `about.md` changes with it.
  - MISSING · any reader's words about these sentences. No client analytics by standing choice (`docs/evangelism-bar.md:30`). Not re-read today, and the choice does not rest on it.
  - MISSING · a production fetch of the 12 sentences. P3's first command takes it as the before-baseline.
- **Prior-retro finding that bears on this** (11-06 retro, still on discipline): Q5 is the same as 11-05, a `--wait` for `check-deployed-sha-drift`. Today's delivery read will again poll by hand on the state column (`in-sync`).
- **Permission:** I-080 is `open`, owner sinusoidal-cycles, expectedSignalBy 2026-11-11. This is lane copy on lane-owned served pages, mirrors and one caption helper, narrowing toward held sources: the same class as legs 1-8, which shipped 11-05 and 11-06 under manager review. No open card. **Constraints carried:** David's card ddbe0735 ("soften Metz") stays honoured, so no "withdrew", Solomou or "most-cited" returns. Shared-surface testing sentences avoid "was tested" and kin (TEST_RAN guard). `{" "}` goes at every inline junction. The colophon is David's first-person page, but this is a one-phrase factual narrowing of the kind 11-06 took there ("in rough phases"), under review.
- **Next action:** kind = improve. First command, the production baseline of /methods (the headline sentence):

  ```
  node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/methods C:/dev/skylark/sinusoidal-cycles/tmp/i080r1-methods-before.txt
  ```

- **Acceptance condition:** on production, the 12 sentences above no longer say the period is the theory's own, stated, exact-stated or declared. Each says "the period this site uses" (or "each cycle's period"), and where there is room it adds that the periods mix theorist figures, range midpoints and derived values, with each cycle's page saying which. The /methods spectral protocol keeps the exactness that is true: the test runs at exactly 1/P for the stored P, so "exactly the stored period, never fitted or scanned" stays. Each page and its mirror (methods, colophon) change in one commit, with "Last updated" stamps equal across the pair and set to the commit's MT date. `spectralFigureText.test.ts` is updated to the new caption. `src/lib/i080Claims.test.ts` gains a ban on the old phrases across these surfaces, pinned on both mirrors, and is red-armed: restore one old sentence, see it FAIL, restore, PASS. I-080's readCommand is re-pointed to a meaning-scoped grep that reads 0, or lists each kept hit with its reason. No year claim changes, so the cos-math audit is not triggered. If the Schlesinger caveat changes, P3 runs it anyway. A Codex claims pass (read-only foreground pipe, banner workdir checked) returns no REFUTED-AS-WRITTEN sentence.
- **Delivery and encounter checks:** delivery is `check-deployed-sha-drift --service sinusoidal-history` in-sync on the fix sha, then a cache-busted production fetch of /, /methods, /methods.md, /colophon, /colophon.md, /cycles, /llms.txt, one /cycles/<slug> page and /data/spectral/spectral.source.md, reading old phrases 0 and new phrases non-zero. Encounter: blind, the site's standing state (David's card 1e069bb4). The readable event is a crawler fetch of /llms.txt or /methods.md after the deploy in `scripts/crawl-read.mjs`. That is readable at N=1, and the read is already dated 11-11 on I-080.
- **USER-FACING: yes.** Paths: `src/app/(app)/methods/page.tsx`, `public/methods.md`, `src/app/(app)/colophon/page.tsx`, `public/colophon.md`, `src/app/(app)/cycles/page.tsx`, `src/app/(app)/page.tsx`, `public/llms.txt`, `src/lib/spectralFigureText.ts`, `public/data/spectral/spectral.source.md`. Possibly `src/data/cycles.json` + `public/about.md` + `src/app/(app)/about/page.tsx` (Schlesinger caveat, only if the source check says so). Internal: `src/lib/spectralFigureText.test.ts`, `src/lib/i080Claims.test.ts`, `continuity/items.json`, `docs/daily/`.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: none. Read: `check-due-gates-dispositioned --snapshot` → "0 gate(s) due on/before 2026-11-07".
  - (b) owed child rows: none. Read: the kickoff's skylark-site ledger read, "0 of 798 considered".
  - (c) state reads marked CROSSED: none. Read: every kickoff state read. The non-zero ones: prior-day retro 2 still-on-discipline of 2 tagged; report artifact PENDING (this file); key metrics "no list yet" (not measured, not 0); listener 283 no-loop warnings in the 512 KB window, 0 since today's session start.

## State Appendix

### Section 0

- Step 0 primer: `docs/cold-starts/2026-11-06.md` (newest; no 11-07 file). First action run: `check-due-gates-dispositioned --snapshot` → "0 gate(s) due on/before 2026-11-07" (87 rows swept).
- Step 0.5 listener: 🟢 SSE alive (SessionStart hook relaunch, restart 17:03:34Z pid 19808, hello 17:03:38Z, replay-complete 0) + loop armed by ScheduleWakeup. Waker ladder ranks 1-3 launched by tool call.
- Step 0.6 Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, 17:09:32Z).
- Step 0.7 CI: `check-ci-status --workflow ci.yml` → GREEN on 06d5ea8660 (exit 0). Drift: `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live 06d5ea86 = head (exit 0).
- Step 0.8: context read by targeted Grep and offset reads.
- Step 0.9: the binding constraint is retention and word of mouth. This ship will be reported unmeasured (`docs/evangelism-bar.md`: metricReady false).
- Step 0.10 Recs yesterday: one, the 11-06 P1 packet (I-080 legs 3-8) → executed (e230fc2, live, CI green; 2026-11-06 report § What changed). Its "Not today: row 1" → carrying today → P1 (this packet).
- Step 0.11 Harness: running 2.1.319 · fleet UNIFORM (28 of 28) · installed 2.1.319 (SAME).
- Product-love rotation: `check-cycle-rotation --lane sinusoidal-cycles` → "no product-love cycle due — picked journey-walk (24d since 2026-10-14, within its 30d cadence)" (exit 0).
- David's word: `answered-cards --project sinusoidal-cycles` → 0 lane cards, 3 portfolio riders (1e069bb4, ec2cff25, 9b6d20eb), 0 new since the last read.
- Working tree at arrival: `continuity/continuity-disposition-events.jsonl` modified, `continuity/read-outputs/I-027.partial.txt` untracked. Both pre-date this session. The events log has since grown with today's continuity-edit writes and rides the close commit; I-027.partial.txt is not this session's and was left untouched.

### Close

ACTION: COMPLETED · item I-080 · P3 ea2b2ee3

- **Since the P3 post:** manager review a6b19d90 marked it COMPLETED against the P1 acceptance condition, with two Schlesinger surfaces added. The review corrected the delivery count to 13 of 13 new (its fetch of the stimson note, about 18:35Z), and the What changed section now says so. No other state changed: live a781cf59, in-sync.
- **Hygiene draft:** 0 lines (all P1 lists were none), so 0 accepted, 0 amended, 0 rejected. READ-MUTATED: none. The helper's one finding, I-034 WAIT_UNTIL_EXPIRED, was fixed in P3 (status b9d45eff). Re-run at close, after that wait moved: wait-justification "RESULT: PASS — 32 of 87 row(s) carry `waitJustification`; 0 warn / 0 info"; engineering-zero "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable".
- **Ledger delta:**
  - I-080: status open → monitoring. readCommand re-pointed to the meaning-scoped grep (17 lines at 06d5ea8, 0 at a781cf5; `--run` stamped exit 1, git grep's no-match). onTrigger now holds the one remaining read. Notes appended: P3 ship, and the 13 of 13 correction.
  - I-034: waitJustification.until 2026-11-06 → 2026-11-10 (the 11-06 close note said it had moved; it had not). Note appended.
- **Verify:** `check-due-gates-dispositioned` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-11-07).
- **Receipt:** P3's line stands. Its proof already reads 0 old phrases on all 13 URLs, and the new-phrase count correction does not change a bracket.
- **Pending reads:**
  - I-080 encounter, 2026-11-11: `crawl-read.mjs --days 7`, crawler fetches of /llms.txt, /about.md or /methods.md after 2026-11-07 18:17Z.
  - I-074 on 11-09. I-034, I-049, I-068, I-075 and I-076 on 11-10.
- **Today panel:** written (update-daily-brief, P5, date 2026-11-07).
