# sinusoidal-cycles — 2026-11-06 (Friday, MT) — full day

## BLUF

**P3 shipped I-080 legs 3-8, live e230fc25, CI green.** Five sentences the site's own sources do not back are gone from /about, /methods, /colophon, /cycles, the Kondratiev page and llms.txt: each is now narrowed to a fact-check line or cut. Every "Last updated" stamp matches its mirror. Codex r1 found one more unsupported clause ("fitted"), now fixed; r2 found both changed sentences HOLD. Encounter blind (no client analytics). One I-080 leg remains, due 11-11. The P1 selection follows.

Full day (the orchestrator's kickoff: "Day: 11-06 Friday, full day"). **P1 selects I-080's remaining source legs: five served sentences the 11-04 claims pass could not back, plus the stale "Last updated" stamps.** All of them are live today (production fetch, cache-busted, 9 URLs, all 200): "1973 as the most cited single year" on `/`, `/about`, `/about.md` and `/cycles/kondratiev`; "the most developed quantitative literature of the ten" on `/about` and `/about.md`; the Korotayev & Tsirel "only after … never retracted" sentence and the Turchin "one realized oscillation" sentence on `/methods` and `/methods.md`; "post-fact-check Phase 11" on `/llms.txt`. The stamps are stale, and the /about pair disagrees with itself: the page says 2026-08-19 and about.md says 2026-08-24. Kind: improve. Due 11-11; today takes every leg that needs no ruling. The colophon "five rough phases" leg is held for review because it is David's first-person page, and CITATION.cff is kept unchanged until a release. Section 0 is clean: CI GREEN on c779a554, deploy in sync, Codex probe GREEN, harness UNIFORM on 2.1.319. No product-love cycle picks this lane today.

## What changed

[P3 — Product-work loop]

**I-080 legs 3-8 shipped, live e230fc25, CI green.** Kind: improve. Manager review: APPROVE (24ed4eb3), with three notes taken: the Kondratiev rationale uses fact-check line 238's wording; the Korotayev & Tsirel sentence says "weak significance"; and the colophon count is cut ("in rough phases"), not changed to "six".

- **Commits:** f071c56 (the copy) → 8af8e9d (Codex r1 fixes) → e230fc2 (Codex r2 fix). CI ci.yml green on e230fc25.
- **Before → after:**
  - Kondratiev anchor (`/`, `/about`, `/about.md`, `/cycles/kondratiev`): "we use 1973 as the most cited single year" → "K-wave revivalists variously dated the turning point between 1968 and 1974 (Mandel preferred 1968), often clustering around the 1973–74 stagflation episode; we use 1973 as a conventional anchor" (fact-check-2026-04-25:237-238).
  - /about and about.md: "Turchin's secular cycles have the most developed quantitative literature of the ten, but the 150-year period for the modern American cycle is a fitted parameter" → "… are set out in a quantitative literature (Turchin & Nefedov, *Secular Cycles*, 2009; Turchin, *Ages of Discord*, 2016), but the 150-year period belongs to the modern American cycle in *Ages of Discord*; the pre-modern agrarian cycles in *Secular Cycles* run roughly 200–300 years" (:91, :93).
  - /methods and methods.md: "Korotayev & Tsirel (2010) report a significant Kondratiev wave only after replacing the World War years with geometric means, on a record of at most three cycles - contested, never retracted" → "spectral analyses of the Kondratiev wave (Korotayev & Tsirel 2010; Metz 1992) report some periodicity at weak significance, and the wave remains contested" (:249). The Turchin sentence ("reports the ~150-year cycle as one realized oscillation and offers no formal spectral test") is cut: no held source carries it.
  - /cycles: "His fitted American cycle" → "His modern American cycle" (:93; Codex r1 sibling sweep).
  - llms.txt: "the site is post-fact-check Phase 11 (round-4 verdicts folded)" → "the round-4 fact-check verdicts are folded in".
  - Colophon, both mirrors: "over five rough phases" → "in rough phases".
  - "Last updated" on about, methods and colophon, page and mirror: → 2026-11-06. The /about pair had disagreed (08-19 against 08-24).
- **Deliberately kept, with reason:** /cycles "one realized oscillation is a case study, not a periodicity". It is the site's own framing, not a report of what Turchin says. CITATION.cff "theorist motivation" stays until a release (claims pass) and goes with I-073. Claims-pass row 1 ("the theory's own stated period") is the one remaining I-080 leg, due 11-11.
- **Instrument:** `src/lib/i080Claims.test.ts` grows to 15 tests: a ban on each old phrase across 9 surfaces, the source lines read from disk, each new sentence pinned on both mirrors and on the rendered /about, and stamp equality per mirror pair. Red-armed three times: the old copy restored gave 5 of 5 new tests FAIL; f071c56's copy restored gave 2 of 15 FAIL; `<em>Secular Cycles</em>run` gave 1 of 15 FAIL. Each was restored and passed 15 of 15. `methodsCrossGrid.test.ts` was re-anchored to the paragraph's new opening words. Ceiling: a word ban plus required phrases, so an unsupported claim in other words still passes, and vitest's JSX transform cannot see Next's whitespace stripping.
- **Cos-math audit:** `python scripts/audit_cycle_rationales.py`: Kondratiev 1973 PEAK (+1.000); 1968 and 1974 near the peak, consistent with the rationale.
- **Codex, read-only foreground pipe, banner `workdir: C:\dev\skylark\sinusoidal-cycles` checked each round.** r1 on f071c56, CHANGES REQUESTED. HIGH "fitted parameter": CONFIRMED, fixed in 8af8e9d. HIGH /cycles "one realized oscillation": DELIBERATE, kept (above). MED (surface list, prefix-only pin): CONFIRMED, fixed in 8af8e9d. LOW (pin the stamp date): REJECTED, because it would pin one day and fail the next real edit. r2 on 8af8e9d: both changed sentences HOLD. One LOW (JSX space): CONFIRMED, fixed in e230fc2. e230fc2 was not re-reviewed: it is a one-token whitespace fix plus a test.
- **Round 0** (a helper listing what the code does) was not run. These sentences describe held scholarship lines, not code behaviour, and each names its source line in the commit and above. The claims pass is the cross-family check.
- **Delivery:** `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live e230fc25 = head (10:05 MT). Production fetch after the deploy covered 11 URLs, all 200 and cache-busted. Old strings: 0 on every URL. New strings: the Kondratiev anchor on `/` 1, `/about` 2, `/about.md` 1, `/cycles/kondratiev` 2. The Turchin literature sentence on `/about` 2, `/about.md` 1. The weak-significance sentence on `/methods` 2, `/methods.md` 1. "folded in" on `/llms.txt` 1. "in rough phases" on `/colophon` 2, `/colophon.md` 1. "His modern American cycle" on `/cycles` 2. The 2026-11-06 stamp on all six pages. The rendered /about junction reads `Secular Cycles</em> <!-- -->run`, with no joined word. Positive control: this morning's fetch read the old strings non-zero on the same URLs (BLUF above).
- **Encounter:** blind. The site has no client analytics, by standing choice (`docs/evangelism-bar.md`). Search Console lags ~3 days. A crawler fetch of /llms.txt, /about.md or /methods.md after 17:05Z would show in `scripts/crawl-read.mjs` (monthly). I-080 carries this.

USER-VISIBLE: A reader of /about, /methods, /colophon, the Kondratiev and /cycles pages and llms.txt no longer meets five claims the site's own sources do not back ("most cited single year", "most developed quantitative literature", the Korotayev & Tsirel "only after … never retracted" sentence, Turchin's "one realized oscillation" attributed to him, "fitted" American cycle), and each page's "Last updated" now matches its mirror — e230fc2 [proof: production fetch this morning on c779a554 read the old strings non-zero (/ 1, /about 2-2, /about.md 1-1, /methods 2-2-2, /methods.md 1-1-1, /llms.txt 1, /cycles/kondratiev 2) → after (live e230fc25, in-sync per check-deployed-sha-drift at 10:05 MT): 0 old strings on 11 URLs, new sentences served on each] [coverage: Search Console page impressions (gsc-read.mjs) · last good read 2026-11-05 · founder+test excluded no] [exposure: blind — no client analytics by standing choice, Search Console lags ~3 days · bug row I-080]

<!-- findings:begin -->
- The P1 packet scoped the Turchin fix to "most developed". Codex r1 found that the same sentence's "fitted parameter" also had no held source, and a sibling sweep found "His fitted American cycle" on /cycles. Both are fixed.
- The P1 packet missed that /cycles was a surface for these claims at all, and the test's surface list missed it too. It is now on the list.
<!-- findings:end -->

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** I-080 (public pages carry sentences the 11-04 claims pass could not back), scoped to claims-pass findings 6, 8, 9, 10, 13 and 14. Kind: improve.
- **User problem, in a reader's words:** "Someone told me history runs in cycles and I can't tell whether any of it holds up or is just a good story." (`docs/evangelism-bar.md`, HYPOTHESIS; no real reader has said it). The site's offer is "someone checked". A superlative it never measured ("most cited", "most developed") or a characterisation of a named scholar that only its own internal spec repeats undercuts that offer on the pages a careful reader opens: /about and /methods.
- **Evidence:**
  - OBSERVED · I-080's readCommand, run today on c779a554: `git grep -n -E "most cited single year|…|five rough phases" -- public src/data` → 6 hits: `public/about.md:47`, `public/about.md:161`, `public/colophon.md:15`, `public/llms.txt:86`, `public/methods.md:189`, `src/data/cycles.json:20`. The React side, found by Grep over `src/`: `about/page.tsx:190` ("most developed"), `methods/page.tsx:339-346` (Korotayev & Tsirel, Turchin), and the stamps at `about/page.tsx:244`, `methods/page.tsx:479`, `colophon/page.tsx:147`.
  - mechanism-verified: production fetch today, 9 URLs, each 200, cache-busted. "most cited single year": `/` 1, `/about` 2, `/about.md` 1, `/cycles/kondratiev` 2. "most developed quantitative": `/about` 2, `/about.md` 1. "only after" / "never retracted" / "one realized oscillation": `/methods` 2/2/2, `/methods.md` 1/1/1. "post-fact-check Phase 11": `/llms.txt` 1. "Last updated": `/about` 2, `/about.md` 1, `/methods` 2, `/methods.md` 1, `/colophon` 2, `/colophon.md` 1. (Doubled HTML counts are the page text plus its embedded payload.)
  - OBSERVED · `docs/housekeeping/2026-11-04-claims-pass.md` rows 6, 8, 9, 10, 13 and 14. Row 6: "UNVERIFIED: fact-check-2026-04-25:39 backs 1973 as defensible, not 'most cited'". Row 8: "UNVERIFIED superlative". Row 9: "The paper does report a Kondratieff wave; 'only after' and 'never retracted' are undecided". Row 10: "only the internal spec repeats it" (that spec is `docs/specs/spectral-verdict-build-spec.md:160-164`). Row 13: "CONFIRMED stale". Row 14: "CONFIRMED stale per Codex's git read (not re-run by the lane)".
  - OBSERVED · the held sources the narrowed wording can stand on. `docs/fact-check-2026-04-25.md:249`: "Spectral analyses (Korotayev–Tsirel 2010, Metz 1992) report some periodicity at weak significance". Line 237: "Korotayev locates the K4/K5 transition as '1973–74' but with a 1968–74 window". Line 91 cites Turchin & Nefedov, *Secular Cycles* (2009) and Turchin & Korotayev, *PLOS ONE* (2020). No held source says anything about Turchin and a "formal spectral test".
  - OBSERVED (new today) · the /about stamp pair disagrees: `about/page.tsx:244` "Last updated: 2026-08-19", `public/about.md:167` "2026-08-24". Both pages changed on 11-05 (7c7ee86).
  - MISSING · the full text of Korotayev & Tsirel (2010) and of Turchin's own statements on the 150-year cycle. The narrowed sentences therefore claim only what fact-check-2026-04-25 holds, or are cut.
  - MISSING · any reader's own words about these sentences. Search Console (page-grouped, read 11-05) showed /about 3 and /methods 2 impressions in 11-01..11-05, 0 clicks; founder and test traffic not excluded. Not re-read today; the choice does not rest on it.
- **Prior-retro finding that bears on this** (11-05 retro, still on discipline): Q5, give `check-deployed-sha-drift` a `--wait <sha>`. Today's delivery read polls by hand on the state column (`in-sync`), as the primer says, not on the text "RED".
- **Permission:** I-080 is `open`, owner sinusoidal-cycles, due 11-11. Every leg taken is lane copy on lane-owned served pages and mirrors, narrowing toward held sources, the same class as the legs David's card ddbe0735 governed. **Held:** row 18, colophon "five rough phases" (the list shows six). It is a one-word fix on David's first-person page, so P3 takes it only if the review says to. **Kept, with reason:** row 4, CITATION.cff "theorist motivation". The claims pass says "CITATION is not edited before a release", and it travels with I-073. **Not today:** row 1, "the theory's own/exact stated period" across colophon, methods, /cycles and llms. It touches several surfaces and gets its own pass before 11-11.
- **Next action:** kind = improve. First command, a baseline of what /methods serves now (production):

  ```
  node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/methods C:/dev/skylark/sinusoidal-cycles/tmp/i080-methods-before.txt
  ```

- **Acceptance condition:** on production, each fetch above reads 0 for "most cited single year", "most developed quantitative", "only after replacing", "never retracted", "one realized oscillation" and "post-fact-check Phase 11". Each replacement sentence names, in its commit, the held source line it rests on. A sentence with no held source is cut. The Kondratiev rationale (`cycles.json` → `/`, `/cycles/kondratiev`, `/about`) and `about.md:47` change together. Each page and its mirror (about, methods, colophon) change in one commit, and their "Last updated" stamps agree with each other and with that commit's MT date. `python scripts/audit_cycle_rationales.py` runs clean, because the Kondratiev rationale names a year. `src/lib/i080Claims.test.ts` gains pins for the new legs (old phrase absent on both mirrors, the stamps equal across each pair) and is red-armed: put an old sentence back, see it fail, restore. A Codex claims pass (read-only, banner workdir checked) returns no REFUTED-AS-WRITTEN sentence. I-080's readCommand then reads 1 hit (colophon), or 0 if review takes row 18.
- **Delivery and encounter checks:** delivery is `check-deployed-sha-drift --service sinusoidal-history` in-sync on the fix sha, then the same 9-URL production fetch for old and new strings. Encounter: blind. There are no client analytics (standing choice). Search Console lags ~3 days. A crawler fetch of /llms.txt, /about.md or /methods.md after the deploy would show in `scripts/crawl-read.mjs` (monthly), and one LLM fetch (N=1) dated after the deploy is readable.
- **USER-FACING: yes.** Paths: `src/data/cycles.json` (Kondratiev `reference_peak_rationale`), `src/app/(app)/about/page.tsx`, `public/about.md`, `src/app/(app)/methods/page.tsx`, `public/methods.md`, `src/app/(app)/colophon/page.tsx` and `public/colophon.md` (stamps only, unless review takes row 18), `public/llms.txt`. Internal: `src/lib/i080Claims.test.ts`, `continuity/items.json` (the I-080 note), `docs/daily/`.
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice, 3 of 3 due (`check-due-gates-dispositioned --snapshot`: "3 gate(s) due on/before 2026-11-06"):
    - **I-034**: readCommand `npm --prefix C:/dev/skylark/sinusoidal-cycles test` has never run (READ_NEVER_RUN). The 10-23 note re-scoped it to "a cheap measured run of the load-sensitive files alone", under David's 10-21 ruling against queuing local full verifies while CI is green. CI is green on c779a554.
    - **I-049**: readCommand is the /cycles snap; last run 11-03, exit 0, 313 lines. The 11-03 note: "short_description lines ending in a full stop: 0 of 10".
    - **I-068**: readCommand `git grep -n "end: 2050" -- src/lib/siteConfig.ts`; last run 11-03, exit 0, one hit at line 15. Its proof is "a decision or a walk"; none is on record.
  - (b) owed child rows: none. Read: the kickoff's skylark-site ledger read, "0 of 798 considered".
  - (c) state reads marked CROSSED: none carry a CROSSED marker. Read: every kickoff state read. The non-zero ones: dated gates 3 due (of 87 swept); prior-day retro 2 still-on-discipline + 1 sweep-shipped of 3 tagged; stale-actionable 1 of 15; report artifact PENDING (this file); key metrics "no list yet" (not measured, not 0).

## State Appendix

### Section 0

- Step 0 primer: `docs/cold-starts/2026-11-05.md` (newest; no 11-06 file). First action run: `check-due-gates-dispositioned --snapshot` → "3 gate(s) due on/before 2026-11-06" (I-034, I-049, I-068).
- Step 0.5 listener: 🟢 SSE alive (restart 15:48:11Z pid 5388, hello 15:48:24Z, replay-complete 0) + loop armed by ScheduleWakeup; waker ladder ranks 1-3 launched. Rank 1 exited by design at 15:55Z (`WAKE-SHORTEN`, the kickoff arriving) and was relaunched.
- Step 0.6 Codex: GREEN (the kickoff's `[codex-probe: GREEN …]` line, 15:44:34Z).
- Step 0.7 CI: `check-ci-status --workflow ci.yml` → GREEN on c779a55417 (exit 0). Drift: `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live c779a554 = head (exit 0).
- Step 0.8: context read by targeted Grep and offset reads.
- Step 0.9: the binding constraint is retention and word of mouth. This ship will be reported unmeasured (`docs/evangelism-bar.md`: metricReady false).
- Step 0.10 Recs yesterday: one, the 11-05 P1 packet (I-080 legs 1-2) → executed (a4e0607, live, CI green; 2026-11-05 report § What changed).
- Step 0.11 Harness: running 2.1.319 · fleet UNIFORM (28 of 28) · installed 2.1.319 (SAME). The tracked record reads CHANGED 2.1.277 → 2.1.319; no skew.
- Product-love rotation: `check-cycle-rotation --lane sinusoidal-cycles` → no cycle picks this lane today (exit 0).
- David's word: `answered-cards --project sinusoidal-cycles` → 0 lane cards, 5 portfolio riders, 0 new since the last read. Card ddbe0735 ("soften Metz") is already carried out.

### Close

ACTION: COMPLETED · item I-080 · P3 f2c3353d

- **Since the P3 post:** manager review 5a152e68 marked it COMPLETED against the P1 acceptance condition. No state changed after that: live e230fc25, in-sync.
- **Hygiene draft:** 3 lines: 3 accepted, 0 amended, 0 rejected. I-034's readCommand was re-pointed to `src/lib/checkStagedSecrets.test.ts` alone, and the row moved to 11-10. I-049 and I-068 moved to 11-10. I-049's note says the next look decides the convention or records a hold, not a 7th re-date. READ-MUTATED: "I-049 src/data/cycles.json" and "I-068 public/about.md", both the lane's own uncommitted I-080 edits at read time (status ec22b3be). wait-justification: PASS (re-run at close after I-034's wait moved: "RESULT: PASS — 32 of 87 row(s) carry `waitJustification`; 0 warn / 0 info"). engineering-zero: PASS (0 findings, 0 unreadable).
- **Ledger delta:**
  - I-080 stays open, due 11-11. A note was appended with legs 3-8 shipped. Its readCommand was replaced: the old grep reads 0 hits at close, and the new one, for claims-pass row 1 ("the theory's own/exact stated period"), reads 9 hits in `public` and `src`.
  - I-034, I-049 and I-068 were re-dated to 11-10, each with a note.
- **Exposure:** per David's card 1e069bb4 item 2, the site's blindness is declared once as its standing state: no client analytics by choice (`docs/evangelism-bar.md:30`). I-080 carries the claims work and the crawl read, not a bug leg. P3's receipt stands unchanged.
- **Verify:** `check-due-gates-dispositioned` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-11-06).
- **Pending reads:**
  - I-080 row 1, due 2026-11-11.
  - The encounter read: a crawler fetch of /llms.txt, /about.md or /methods.md after 2026-11-06 17:05Z, from `scripts/crawl-read.mjs` at its next monthly run.
  - I-034, I-049 and I-068 on 11-10.
- **Today panel:** written (update-daily-brief, P5, date 2026-11-06).
