# sinusoidal-cycles — 2026-10-06 (prelaunch)

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** a reader of /cycles/kondratiev can tell which TFP series the verdict is judged on (no test ran: the record is too short) and why the chart is labelled differently. **Item:** I-024 (open, P3, lane-owned).

**The user problem, in the walker's words** (W-003 cold walk, 2026-10-03, synthetic, N = 1, `docs/walks/2026-10-03-w003.md:191`, D2): "The list on /cycles calls this pairing 'US TFP growth (5-yr rolling)' while the verdict text and figure say 'US TFP growth (annual, unsmoothed)', and the citation under the figure says '5-yr rolling' again; I could not tell from the page which series was tested without reading on." This is a synthetic walker's quote, not a real user's.

**What a user will see differently:** on /cycles/kondratiev the "Does it hold up?" box names the series the verdict is judged on ("annual, unsmoothed") instead of "a different cut… named in the verdict below". One sentence under the verdict's plain-English paragraph says why there are two labels: the site measures the record's length on the annual series, and would run any test on it, while the page's "Paired data" labels and the citation name its 5-year rolling average. (Corrected at P3; the P1 wording said "the test runs", which contradicts the verdict's "No test was run" — manager review a4da274a and Codex r1.)

### Section 0

- **Primer:** `docs/cold-starts/2026-10-05.md` (written yesterday). There is no `2026-10-06.md`.
- **First action:** `check-confidence-tag-taps.mjs https://sinusoidalhistory.com` reads **8/8 PASS** (definition top=16, curves paragraph bottom=0), so I-023 holds on production.
- **git:** `pull --ff-only` printed "Already up to date". HEAD `0636623` = origin.
- **Listener:** 🟢 SSE alive. Launched by /listen this session (pid 41308, hello 14:55:52Z, 4 replayed). The loop is armed by a `ScheduleWakeup` call. Waker ranks 1-3 are running; rank 1 was relaunched after a deliberate `wake-shorten` exit.
- **Codex:** GREEN, from the `[codex-probe]` line on this prompt (14:53:10Z). Not used at P1, because there is no diff yet.
- **CI:** `check-ci-status --workflow ci.yml` → GREEN for `06366238da` (1 success, 0 failures, 0 pending).
- **Deploy drift:** `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live `06366238` = head (checksPass service, judged).
- **Harness:** running 2.1.291 · fleet UNIFORM (27 of 27) · installed 2.1.291 (SAME). The record moved from 2.1.277.
- **Cycle rotation:** exit 0, "no product-love cycle picks this lane today (4 cycle(s) rotate over 23 lanes); run the normal P3".
- **Due gates:** `--snapshot` → "0 gate(s) due on/before 2026-10-06" (taken once, `tmp/due-gates-snapshot.json`). It also flagged that I-021, I-024 and I-025 carry `readCommandWaived`. I-024's waiver is that it's lane work, not a measurement, which fits.
- **Board:** `answered-cards` → no waiting, answered or pending-verify cards.
- **Recs yesterday:** `docs/daily/2026-10-05-prelaunch.md` has no `## Recommendation` block (`Recs yesterday: none`). The primer's candidates are I-024 (selected here) and I-021 (waits on W-004's 10-07 read of the current cue).
- **Retro (10-05):** none of the quoted still-on-discipline findings bears on a body-copy change. The reply was not read whole at P1.

### Evidence

- **OBSERVED, W-003 D2** (2026-10-03, synthetic, N = 1, 1440x900): the quote above.
- **OBSERVED, production text today** (`check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles/kondratiev`, 95 lines, server-rendered text only). "5-yr rolling" appears three times: the chart legend "TFP growth · 5-yr" (line 31), the paired-data block "US TFP growth (5-yr rolling)" (55), and the citation (81). "annual, unsmoothed" appears once, in the verdict paragraph (69), which comes from the frozen `verdicts.json` `lay_text`. The box (21) says the tested record is "a different cut… named in the verdict below" but never says which label is which, or why.
- **OBSERVED, in the tree:** the mismatch is deliberate. `verdicts.json` judges the record of `us_tfp_growth_annual` (Kondratiev's is too short, so no test ran); `series.json` draws `us_tfp_growth` (rolled). `us_tfp_growth.source.md:22` says "The rolled CSV remains the display series on the chart", and AGENTS.md bans the rolled CSV from inference. So the fix is copy, not data.
- **OBSERVED, adjacent but not selected:** Turchin's page has the same shape (`wid_top1_wealth_1913` tested, a different series drawn). I-024 names Kondratiev only, so Turchin stays as it is today and is carried as a candidate.
- **MISSING:** real-user evidence. There's no client analytics (a standing choice), and the lane has no evangelism-bar or evangelism-evidence file, so there is no bar metric to read.

### Permission, and the freezes

- **Decision class:** lane-owned product copy. I-024's owner is sinusoidal-cycles, its waitingFor reads "Nothing and nobody", and no card is open on it.
- **Its `waitJustification` dates it 2026-10-07**, but its own `loadBearing` reads "lane product work for a later round; nothing outside the lane blocks it". That date was lane-chosen with nothing funded behind it, so it yields, as I-020's and I-022's did. The primer names I-024 as today's pickup.
- **W-001 freeze (titles, meta, H1s, URLs, to 2026-10-07):** untouched. This is body copy only. I'll log the added body string in W-001's notes, as I-022 did on 10-04, so tomorrow's read can attribute any move.
- **W-004 (10-07 cold walk)** reads /cycles/kondratiev at 1440 and ~900. Shipping today makes that walk the first cold read of I-024's closeWhen. I'll add one line to W-004's notes at P3 and won't start a new walk.
- **Frozen, not touched:** `verdicts.json` and `public/data/spectral/` (the `lay_text` and the figure label stay), `FigureScroller.tsx`, `HashLink.tsx`, the /state bands, `state-2026.csv`.
- **Mirrors:** no /methods change is planned, so `public/methods.md` needs nothing (methods already says inference runs on unsmoothed series, `methods/page.tsx:291`). `public/about.md` and `llms.txt` aren't touched.

### Next action — improve

Prep only until the review. No commit, push or deploy.

1. In `src/app/(app)/cycles/[id]/page.tsx`, add a small map keyed by the TESTED series id (`verdict.series_id`) that holds the tested series' plain name and one "why two labels" sentence. It has one entry, `us_tfp_growth_annual`. With an entry, the box sentence at line 231 names the series ("The record this verdict tests, US TFP growth (annual, unsmoothed), runs 77 years: …"). Without one (Turchin today), the current generic sentence stays.
2. Under `verdict.lay_text` (line 532), when that entry exists, render one sentence along the lines of: "The chart above and the citation below show the 5-year rolling average of this series, which is easier to read. The test uses the annual figures, because a rolling average would make neighbouring years look related and flatter the noise model." The wording gets checked against `us_tfp_growth.source.md`/`_annual.source.md` before the commit, and it must make no claim that the source files don't support.
   - **Prep note (09:19 MT):** `us_tfp_growth_annual.source.md:10-13` supports "a rolling average makes neighbouring years move together (it 'reddens the spectrum') and would corrupt the noise model the test compares against". It also says the smoothing "barely attenuates the 54–55-year band". So "flatter the noise model" in the draft above is unsupported and is dropped. The sentence must not imply that smoothing hides or creates the 54-year cycle.
3. Add a test that renders the Kondratiev page data path and asserts both strings. The red arm: remove the map entry and show the test failing.

First command (the baseline the change must move):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles/kondratiev C:/Users/david/AppData/Local/Temp/claude/C--dev-skylark-sinusoidal-cycles/d3ba0810-d504-472e-affe-da57558d9515/scratchpad/kondratiev-before-2026-10-06.txt
```

(Already run: 95 lines.)

### Acceptance

- On production /cycles/kondratiev, the box names "US TFP growth (annual, unsmoothed)" as the tested record, and one sentence says the chart and citation show the 5-year rolling average and why. The phrase "named in the verdict below" is gone from that page.
- Rendered-text line multiset, before → after: Kondratiev changes only on the box line plus one added line, and no other line moves. /cycles/turchin and /cycles/perez (a page whose tested and drawn series match) are unchanged.
- The new test passes, fails with the map entry removed, and passes again on a clean tree. Both outputs go in the P3 report.
- No title, meta, H1 or URL changes (the rendered-text diff of `<title>`/H1 is unchanged).
- `python scripts/audit_cycle_rationales.py` isn't needed: the new prose names no year position. If the wording ends up naming one, it runs.

### Delivery and encounter checks

- **Delivery:** CI green on the push, then the deploy row reads live (checksPass), then the production rendered-text snap of /cycles/kondratiev shows both strings.
- **Encounter:** W-004, 2026-10-07, step (1) on /cycles/kondratiev at 1440. I add the question "which series did the verdict test, and why does the chart say 5-yr?" to W-004's notes at P3. That walk is synthetic and is not a real-user read. With no client analytics there's no event to watch, so exposure will be `blind — no client analytics`, with the bug row named at P3.

### USER-FACING: yes

Paths: `src/app/(app)/cycles/[id]/page.tsx` (what users get), a new or extended test under `src/` (internal), `continuity/items.json` (internal: I-024, W-001 and W-004 notes), this report (internal).

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none**. `dated gates due today` read 0 at compose and this morning's `--snapshot` read 0.
- (b) Owed child rows in the orchestrator's ledger: **none**. 0 of 747 considered at compose.
- (c) State reads marked CROSSED: **none**. None of the kickoff's reads printed a crossed threshold. The prior-day retro carries 10 still-on-discipline findings, listed for the close and not dispositioned here.

## P3 — Product-work loop

[P3 — Product-work loop]

**Action (improve the product):** I-024. /cycles/kondratiev now names the series its verdict is judged on and says why the page carries two labels. This followed the manager review's APPROVE (a4da274a), including its one wording fix: no sentence says a test ran.

**What a reader sees, live:**
- The "Does it hold up?" box now reads "The record this verdict is judged on, US TFP growth (annual, unsmoothed), runs 77 years: …". It used to read "a different cut … named in the verdict below".
- One paragraph under the verdict reads: "Why two labels: the “Paired data” line and section on this page, and the citation at the end, name the 5-year rolling average of this series, which is the version the interactive chart draws. The site measures the record's length on the annual figures, and would run any test on them, because a rolling average makes neighbouring years move together and would distort the background-noise model a test compares against."

### The four states

1. **Implementation:** four commits on main.
   - `2fe5047`: the copy, a new `src/lib/testedSeries.ts` keyed by the verdict's series_id, and a test that renders the real page.
   - `52a1926`: Codex r1 folds.
   - `4741fe7`: the Codex r2 fold.
   - Red arms, both recorded: renaming the map key failed 4 of 7 tests. Injecting the manager-rejected sentence ("The test uses the annual figures.") failed the whole-page scan. Dropping attributes from the reader-text scan failed the `alt` control. Each was restored, and the restored runs passed (8 of 8).
   - Gates at `b46ce75`: tests 22 files / 167 passed (verify-with-receipt), lint 0 errors, typecheck clean, build green.
   - **CI: GREEN on 4741fe7 and on b46ce75.**
   - One gate run at `b7b9207` read RED: 3 timeouts in files this change does not touch. I had run lint, typecheck and the suite concurrently. Re-run alone at the same commit, it was GREEN 167/167, and the receipt tool recorded the flip.
2. **Delivery:** `check-deployed-sha-drift --service sinusoidal-history` reported in-sync, live `4741fe75`, and later live `b46ce75a` = head. Surface read on production (`check-rendered-text snap`):
   - /cycles/kondratiev went from 95 to 96 lines: 1 replaced + 1 added, every other line identical.
   - /cycles/turchin (93) and /cycles/perez (93) are GREEN, identical.
   - 0 of 96 Kondratiev lines match the "a test ran" pattern. The same text carries the verdict's "No test was run", which is the positive control on the search space.
   - No title, meta, H1, URL or JSON-LD changed (W-001 freeze held).
3. **Encounter:** `blind — no client analytics on this site (a standing choice), so a reader of the Kondratiev page leaves no trace · bug row W-004`. W-004's cold walk on 2026-10-07 now asks I-024's closeWhen question at step (1). It is synthetic, not a real-user read.
4. **Outcome:** open. I-024 is `monitoring`, and its closeWhen ("a cold reader … can say which series was tested and why the chart's label differs") is read on that walk.

USER-VISIBLE: /cycles/kondratiev now names the series its verdict is judged on, US TFP growth (annual, unsmoothed), and says in one paragraph why the page also shows a 5-year rolling average — 4741fe7 [proof: box sentence "a different cut … named in the verdict below" → "The record this verdict is judged on, US TFP growth (annual, unsmoothed), runs 77 years" plus one "Why two labels" paragraph; check-rendered-text snap of https://sinusoidalhistory.com/cycles/kondratiev after deploy reads 95 → 96 lines, 1 replaced + 1 added, turchin and perez identical, live sha 4741fe75 then b46ce75a per check-deployed-sha-drift] [coverage: none — the site has no client analytics · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader of the Kondratiev page leaves no trace · bug row W-004]

### Reviews

codexCalls: 2 — both foreground `codex exec --sandbox read-only` review runs. The probe was GREEN at 14:53:10Z. Banner workdir was `C:\dev\skylark\sinusoidal-cycles` on both runs.

adversarialReviews: 2 — EXECUTED.

**r1 on 2fe5047:** HIGH 0, MED 1, LOW 3, all STATIC and all CONFIRMED.
- MED: the note called the page's sine curve a rolling average. Fixed in 52a1926.
- LOW: "easier to read" went beyond the source. Fixed in 52a1926.
- LOW: the "a test ran" guard missed the rejected sentence and read only the note. Fixed in 52a1926.
- LOW: the report said "the verdict tested". Fixed in 52a1926.
- Also folded: the note now shows only when the judged and drawn series differ.

**r2 on 52a1926:** HIGH 0, MED 0, LOW 1, STATIC, CONFIRMED.
- The tag-strip scan missed split words and attribute text. Fixed in 4741fe7.
- r2 also confirmed, STATIC: the note's three references exist on the page, and the chart at / draws `tfp_growth_5yr_avg_pct`.

**Not reviewed adversarially:** the two lockfile bumps (b7b9207, c208e62), BY-INSPECTION. There is no code diff; each lockfile diff was read whole and touches only the alerted package and its platform binaries.

**Sibling sweep** for the r1 MED class (copy that points at something the page does not draw): `curve earlier|chart above|drawn on the chart|the chart shows|shown on the chart` over src/ and public/*.md|txt gave 5 hits. All 5 correctly name the interactive chart, so 0 further defects.

### Corrective work: engineering-zero (fleet Dependabot batch)

Corrective work, not progress on the outcome. The orchestrator's ordering (90900f60) was product first, then bump, and that's what happened.
- **#55** source-map-js 1.2.1 → 1.2.2 (`b7b9207`): fixed_at 16:55:40Z.
- **#56** sharp 0.35.4 → 0.35.5 (`c208e62`, inside next's `^0.35.4`): opened 16:55:41Z and fixed_at 17:35:18Z.
- `gh api …/dependabot/alerts?state=open` now returns `[]`, against 1 open alert on the same query at ~17:00Z.

**DISAGREEMENT, named:** `check-engineering-zero --project sinusoidal-cycles` at ~17:45Z still reads RED on [#56]. Its population is the /api/cc panel cache, and GitHub's own alert API says fixed. I read this as cache lag, not an open alert, and expect P5's re-run to clear it. If it doesn't, the cache is the finding.

`npm audit` still printed "6 high severity vulnerabilities" during the bumps. That is a different instrument from Dependabot and is not dispositioned here; it is carried to the close.

### Hygiene helper

hygiene helper: DISPATCHED ~15:45Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-06.md PRESENT. Its one production-shaped finding (engineering-zero RED, #55) was posted as status b7947eee.

### What remains

- **W-004 (2026-10-07):** the cold walk reads I-024's closeWhen, plus the manager's hypothesis about the /cycles list label "US TFP growth (5-yr rolling)". The list was not changed today.
- **Turchin:** same two-cut shape, deliberately out of scope ("Don't widen today's cut"). It's a candidate.
- **P5:** re-read engineering-zero against the cache, and disposition the npm-audit count.

[standing-rules-hash: 88cc2dc9]

## Close

[P5 — Delta-only close]

ACTION: COMPLETED · item I-024 · P3 33c561ef

The acceptance condition in force was the P1 packet's plus the review's added check. It was met. On production, /cycles/kondratiev names "US TFP growth (annual, unsmoothed)" and carries the "Why two labels" paragraph. 0 lines match a test-ran pattern, "No test was run" is still present, and the turchin and perez text is unchanged. The manager review (f5b53394) read production independently: COMPLETED.

hygiene draft: 0 lines — 0 accepted · 0 amended · 0 rejected. Its drafts section read "none — no input rows".
- READ-MUTATED: none (0 reads guarded).
- The helper's two checks: wait-justification PASS (20 of 31 rows); engineering-zero RED on Dependabot #55, which was posted as b7947eee and fixed in b7b9207.

### Changed since the P3 post

- **engineering-zero disagreement: RESOLVED, cache lag.** At ~17:45Z, `check-engineering-zero --project sinusoidal-cycles` read RED on #56 while GitHub said fixed (17:35:18Z). Re-run at ~17:55Z, it reads `RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable (exit 0)`, and `gh api …/dependabot/alerts?state=open` returns `[]`. The checker reads the /api/cc panel cache, which lagged GitHub by ~10-20 minutes. No open alert and no row: the cache cleared itself, and the lesson is in tomorrow's primer.
- **npm audit, dispositioned as I-027 (monitoring, re-check 2026-10-20).** The full `npm audit` now reads 5 high, 0 critical (it was 6; the sixth was source-map-js, fixed in b7b9207). All 5 are one advisory, GHSA-vfj7-8cjw-p6xm (braces ≤3.0.3), reached only through dev-only lint tooling: eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces. `npm view braces versions` tops out at 3.0.3, so no patched release exists. npm's offered fix is a major downgrade of eslint-config-next to 14.2.35, rejected. `npm audit --omit=dev` reads 0 of 175 prod deps. This is NOT folded into engineering-zero: they are different instruments.

### Ledger delta (continuity-edit)

- **I-024:** stays `monitoring`. Appended note: the pending read is the W-004 walk on 2026-10-07, step (1), which asks the closeWhen question. It is synthetic, so it reads comprehension, not an encounter; the encounter stays blind. The walk also carries the manager's /cycles list-label hypothesis ("US TFP growth (5-yr rolling)").
- **I-027 minted:** npm audit dev-only braces chain. `waitJustification` until 2026-10-20; `readCommand` = `npm --prefix C:/dev/skylark/sinusoidal-cycles audit --audit-level=high`.
- **I-028 minted:** Turchin's same two-cut box, a candidate by analogy (no reader report), `open`, gated on W-004's notes. `waitJustification` until 2026-10-08.
- **Earlier today, already committed (b46ce75):** I-024 open → monitoring; the W-001 freeze log; the W-004 walk questions.

### Verify

- `check-due-gates-dispositioned` (no flag): `verdict: CLEAR — every gate due at Phase 0 was dispositioned.` The snapshot is CURRENT (taken 2026-10-06), with 0 due.
- `check-wait-justification` re-run after the two new waits: `RESULT: PASS — 22 of 33 row(s) carry waitJustification; 0 warn / 0 info (exit 0)`.
- engineering-zero: PASS (above). Dependabot: 0 open. Sentry: 0 for this lane per the same read.

### Receipt

P3's receipt (33c561ef) is still true and unchanged: the exposure is still blind, and there is no outcome read yet. Nothing new is written.

### Pending reads

- **2026-10-07:** the W-004 cold walk (I-024 closeWhen, the I-020 and I-022 reads, and the list-label hypothesis).
- **2026-10-07:** W-001's Search Console read.
- **2026-10-08:** I-028, after W-004's notes.
- **2026-10-20:** I-027, npm audit.
- **2026-12-01:** I-025, the band question to David.

UNRESOLVED: none.

codexCalls: 0 at P5 (`probed-declined`: a close with no code diff; today's two review runs were counted on P3, 33c561ef).

[standing-rules-hash: 88cc2dc9]
