# sinusoidal-cycles — 2026-10-07 (prelaunch)

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** a reader of a cycle page's spectral figure is told how to see all of it in words that fit their pointer, and can read the target period and the band without hunting. **Item:** I-021 (open, P3, lane-owned).

**The user problem, in the walker's words** (W-004 cold walk, today, synthetic, N = 1, `docs/walks/2026-10-07-w004.md:86-88`, step 2, 900x900 with a mouse): "It told me to swipe sideways, which is a touch instruction given to a mouse user. I could not see the whole figure without scrolling the box sideways (shift+wheel or a trackpad) or clicking through to the SVG." and "The instruction does not match the device, and the cut-off parts include the end year and half of the band text." (Corrected at P3, manager review f3d1c14a: the P1 version quoted my paraphrase, not the file.) The walker ranked it the single worst thing today. It is a synthetic walker's quote, not a real user's.

**What a user will see differently:** under 1024 px wide, the line above the figure fits the pointer. A touch reader is told to swipe, and a mouse reader to scroll sideways or click the figure to open it full size. A short HTML line carrying the figure's target period and band also sits above the scroller, so a phone reader gets both on arrival without swiping. The spectral SVGs stay frozen.

### Section 0

- **Primer:** `docs/cold-starts/2026-10-06.md` (written yesterday; there is no `2026-10-07.md`). It names W-001's Search Console read and the W-004 cold walk as first actions. Both ran.
- **git:** `pull --ff-only` printed "Already up to date". HEAD `97a2e89` = origin.
- **Listener:** 🟢 SSE alive. /listen launched it this session (pid 37476, hello 14:34:38Z, 0 replayed). The loop is armed by `ScheduleWakeup` call, and waker ranks 1-3 are running. The kickoff body reported one missed event, recovered by the fallback poll.
- **Codex:** GREEN, from the `[codex-probe]` line on this prompt (04:12Z). Not used at P1, because there is no diff yet.
- **CI:** `check-ci-status --workflow ci.yml` → GREEN for `97a2e89e5e` (1 success, 0 failures, 0 pending).
- **Deploy drift:** `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live `97a2e89e` = head (checksPass service, judged). The first try with `--service sinusoidal-cycles` matched no service; the Render name is `sinusoidal-history`.
- **Harness:** running 2.1.292 · fleet UNIFORM (28 of 28) · installed 2.1.292 (SAME). The record moved from 2.1.277.
- **Cycle rotation:** exit 0, "no product-love cycle picks this lane today (4 cycle(s) rotate over 23 lanes); run the normal P3".
- **Due gates:** `--snapshot`, taken once → "8 gate(s) due on/before 2026-10-07" (`tmp/due-gates-snapshot.json`).
- **Board:** `answered-cards` → no waiting, answered or pending-verify cards.
- **Recs yesterday:** `docs/daily/2026-10-06-prelaunch.md` has no `## Recommendation` block, so `Recs yesterday: none`. Its primer named I-021 as waiting on today's W-004 read of the current cue. That read is now in.
- **Retro (10-05, the newest; no 10-06 reply):** none of the quoted still-on-discipline findings bears on this choice.

### Evidence

- **OBSERVED, W-004 step 2** (today, synthetic, N = 1, Chromium, 900x900, mouse): the quote above. 704 of 900 px visible; no scrollbar showed in headless. Ranked the worst thing of the walk.
- **OBSERVED, W-004 step 5** (390x664, iPhone 15 profile): only 39% of the figure is visible at once. The only cue says swipe. A tap does nothing; that's correct since I-020, `2e00ce7`.
- **OBSERVED, W-003 P11** (2026-10-03, 390x664): on arrival the subtitle reads "target pe" and the band "INSUFFI". The band was never seen whole in one swipe position.
- **OBSERVED, in the tree:** the cue is one unconditional string, `src/app/(app)/cycles/[id]/page.tsx:571-573`, `lg:hidden`, shown from 0 to 1023 px for every pointer. The figure is a 900 px image in `FigureScroller` below lg.
- **OBSERVED, the HTML verdict line** above the figure already says in words that the record falls short (the walker answered Kondratiev's verdict from it on the first screen, step 1a). But it doesn't carry the figure's own "target period N years" or the band phrase as one readable line next to the figure.
- **MISSING:** real-user evidence. There's no client analytics (a standing choice), and the lane has no evangelism-bar or evangelism-evidence file, so there is no bar metric to read.

### Permission, and the freezes

- **Decision class:** lane-owned product UI. I-021's owner is sinusoidal-cycles, waitingFor reads "Nothing and nobody. Lane work for a later round.", its `waitJustification.until` is 2026-10-07 (today), and no card is open on it.
- **W-001 freeze (titles, meta, H1s, URLs) ended today** (`nextEvaluation` 2026-10-07). This change is body copy and CSS in any case. I'll log the added body string in W-001's notes so the next read can attribute a move.
- **Frozen, not touched:** `public/data/spectral/` (the SVGs, verdicts.json, manifest), the /state bands and `state-2026.csv` (I-025). The primer lists `FigureScroller.tsx` as don't-touch. The plan keeps the change in `page.tsx` (the cue line, a caption line, the className passed to the scroller). If an edge fade needs `FigureScroller`, that comes back to the review before I touch it.
- **Mirrors:** no /methods, /about or /colophon prose changes, so there are no `.md` mirror edits. `llms.txt` is untouched.

### Next action — improve

Prep only until the review. No commit, push or deploy.

1. Split the cue by pointer, using the `pointer-coarse:` variant the figure link already uses. Coarse: "Swipe sideways for the whole figure". Fine: "Scroll sideways for the whole figure, or click it to open it full size". Both stay `lg:hidden`.
2. Above the scroller, below lg, add one HTML line built from the verdict data: "Target period {period} years · {band phrase}". The band phrase comes from the same verdict fields the SVG label was built from, never retyped. If I can't derive it from those fields, I'll name the field before committing.
3. A visible right-edge cue on the scroller (fade or always-on scrollbar), only if it fits in page.tsx's className. Otherwise it's dropped from this round and noted.
4. A Playwright check (`scripts/check-figure-cue.mjs`, added to CI the way the existing check-* scripts are) asserts: at 900x900 with a fine pointer, the cue doesn't say "Swipe"; at 390x664 with touch, it does; the target/band line is on screen when the figure's top is. Red arm: revert the cue split and show the 900 leg failing.

First command (the baseline the change must move):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles/kondratiev C:/Users/david/AppData/Local/Temp/claude/C--dev-skylark-sinusoidal-cycles/5f34bd08-8652-461e-bee2-9035a1b6c6ef/scratchpad/kondratiev-before-2026-10-07.txt
```

### Acceptance

- At about 900 wide with a mouse, the line above the figure doesn't say "Swipe". It says scroll sideways or click to open full size. At 390x664 with touch it still says swipe.
- At 390x664, on arrival at the figure, the target period and the band are readable in one line without swiping. (Corrected at P3, Codex r1: "one line" meant one line of text above the figure, not one visual row. At 390 it wraps to 2 rows, both on screen above the figure on arrival, and that is the intended behaviour.)
- The new check passes on production after deploy and fails with the cue split reverted. Both outputs go in the P3 report.
- Rendered-text multiset: on /cycles/kondratiev, /cycles/perez and /cycles/turchin, the only changes are the cue line(s) and the added target/band line. No title, meta, H1 or URL change.
- I-021's closeWhen (a cold walk at 390 and about 900 with a mouse reads the target and the band, and says the cue told it what to do) is answered by the next cold walk, not by me.

### Delivery and encounter checks

- **Delivery:** CI green on the push, then the deploy row reads live (checksPass), then `check-figure-cue.mjs https://sinusoidalhistory.com` and the rendered-text snap on production.
- **Encounter:** the next cold walk asks I-021's closeWhen at 390 and at about 900. That walk is synthetic, not a real-user read. With no client analytics there's no event to watch, so exposure will be `blind — no client analytics · bug row W-004`.

### USER-FACING: yes

Paths: `src/app/(app)/cycles/[id]/page.tsx` (what users get); `scripts/check-figure-cue.mjs` + `.github/workflows/ci.yml` or a vitest spawn test (internal); `continuity/items.json` (internal: I-021, W-001 and W-004 notes); this report (internal).

### HYGIENE INPUTS

- **(a) Due rows not bearing on the choice:** 7 of the 8 due (I-021 is the choice). Each row's read, as run today:
  - **I-009:** `check-year-position.mjs` → 81/81 PASS (stamped).
  - **I-017, I-020, W-004:** one shared read, `check-verdict-landing.mjs --fails-only` → 490/490 PASS (stamped on all three). The first attempt timed out at 420 s, run alongside the walk's browser; the re-run alone took 323 s.
  - **I-020 encounter:** W-004 step 5. The tap does nothing, adds no history entry, and the walker only "half-expected" it to open.
  - **I-022:** `check-calibrate-tab.mjs` timed out at the 60 s default and again at 300 s, with every captured line PASS. `readCommandTimeoutMs` was raised to 600000, and the third run finished alone in 192 s → **93/93 PASS** (stamped). The run time varies from 192 s to over 300 s on this host. W-004 step 3: 1 scroll and 1 tap from /cycles/schlesinger-jr to Calibrate on Schlesinger Jr.; the curve and r moved together on one screen.
  - **I-024:** W-004 step 1a. The walker named the annual unsmoothed series from the box sentence (y 524) and the "why 5-yr" from the "Why two labels" paragraph (y 2380). Two residual findings come with it:
    - That paragraph sits 1,490 px below the "TFP GROWTH · 5-YR" label that raises the question.
    - The "99,999 bootstrap draws" caption and the drawn spectrum "could still read as a test that ran". "No test was run" is 860 px above them.
  - **I-024, manager's hypothesis on the /cycles list label** (W-004 step 1d): REFUTED for this walker. After reading the page, "US TFP growth (5-yr rolling)" "no longer misleads".
  - **W-001:** `gsc-read.mjs --start 2026-09-10` → 57 impressions, 0 clicks, position 10.4, 13 pages. Since 09-20: 31 impressions, 0 clicks, position 5.5. A query-grouped read shows 4 named rows ("cycle of ten" is new; the three Dalio rows sit at 50-60). Dalio's page left the post-09-20 page list. Average position moved under 20, which the row's onTrigger names as the condition to reopen click-through as a fresh row. At 31 impressions a zero is not a verdict.
- **(b) Owed child rows in the orchestrator's ledger:** **none**. 0 of 747 considered at compose.
- **(c) State reads marked CROSSED:** 2.
  - Dated gates due today: 8 of 8 UNREAD at compose. Read today as above, except I-022 (in flight) and the waived I-021/I-024.
  - Prior-day retro (10-05): 10 still-on-discipline findings. Listed for the close, not dispositioned here.

## P3 — Product-work loop

[P3 — Product-work loop]

**Action (kind: improve):** I-021, as REDIRECTED by manager review f3d1c14a. On every paired /cycles/<slug> page the spectral figure now:
- tells the reader how to see all of it in words that fit their pointer;
- states its target period and band in HTML above the figure on phones;
- no longer tells a reader that a test ran when none did.

**User-visible change.** Below 1024 px wide, the figure carries the line "Target period 54 years · Insufficient data — no test possible · 1.4 of 3.0 required periods" (Kondratiev). The cue is split by pointer:
- touch keeps "Swipe sideways for the whole figure";
- a mouse at 768–1023 reads "Scroll sideways for the whole figure, or click it to open it full size".

The protocol caption on a record too short to test (all 9 today) now opens "No test was run: this record covers 1.4 of the 3.0 full periods the pre-registered test requires, so the spectrum in the figure is descriptive only." It used to open "Pre-registered harmonic-regression test … (99,999 bootstrap draws)". An eligible record would keep the old sentence (unit-tested on a constructed row; none is eligible in this freeze).

### The four states

1. **Implementation.** Commits on main:
   - `9b8a54e`: the change, `src/lib/spectralFigureText.ts`, its test, `scripts/check-figure-cue.mjs`.
   - `d521789` and `30beb57`: check-script fixes from Codex r1 and r2.
   - `cc4ffde`: docs and continuity.
   - `c348cd1`: caption reworded. At `30beb57` the full suite went RED. I-024's "a test ran" guard (`testedSeries.test.ts`, pattern `tests? (was|were) run on`) matched the negation "No test was run on this record". The guard stays as strong as it was; the caption reads "No test was run: this record covers …".

   Gates at `c348cd1`: `verify-with-receipt -- npm test` → 170/170, typecheck clean, eslint clean on the four files. **CI green** on `c348cd1` (check-ci-status --wait, 64 s).

   Red arms:
   - `check-figure-cue.mjs` on production before the change: 36/99; production after: 99/99.
   - A `font-size: 0` mutation on the line: 9 of 9 arrival legs FAIL ("text sized false"), 90/99; restored: 99/99.
   - Unit test with the caption forced to the old sentence: "never describes a test as run" FAILs; restored: 3/3.
2. **Delivery.** `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live `c348cd19` = head. Surface read on production: `check-figure-cue.mjs https://sinusoidalhistory.com` → 99/99. Rendered-text line multiset, production before → after:
   - kondratiev 96 → 98, perez 93 → 95, turchin 93 → 95;
   - on each page, exactly 1 line removed (the old caption) and 3 added (target/band, mouse cue, new caption);
   - nothing else moved, so no title, meta, H1 or URL changed.
3. **Encounter.** `blind — no client analytics (a standing choice) · bug row W-004`. The next cold walk asks I-021's closeWhen at 390 and ~900 with a mouse. It is synthetic and reads comprehension, never an encounter.
4. **Outcome.** Open: no read yet.

USER-VISIBLE: on every cycle page the spectral figure now says in words its target period and band, tells a mouse reader to scroll or click (not swipe), and its caption says no test was run instead of describing a test — c348cd1 [proof: check-figure-cue on production 36/99 before → 99/99 after (live c348cd19, deploy drift in-sync); rendered text on kondratiev/perez/turchin: 1 caption line replaced + 2 added, nothing else] [coverage: none — no client analytics on this site · last good read never · founder+test excluded no] [exposure: blind — no client analytics, so no instrument can see a reader arrive · bug row W-004]

### Reviews

- **Codex r1** on `9b8a54e`: read-only, banner workdir `C:\dev\skylark\sinusoidal-cycles` matched. Three findings.
  - (1) MED: the target/band line wraps at 390 against the packet's "in one line". DELIBERATE. Wrapping to 2 rows, both on screen above the figure on arrival, is the intended behaviour; the packet wording was corrected.
  - (2) MED: the 390 geometry leg scrolled the line to the top first, so it passed by construction. CONFIRMED, fixed in `d521789`: the leg now measures from arrival (figure top 300 px down the screen).
  - (3) LOW, pre-existing: Turchin's box says "The record this verdict tests" (`page.tsx:242`) although no test ran. CONFIRMED, routed to I-028 (due 2026-10-08), because the manager's contract limits Turchin's text change today.
  - Sibling sweep for the claim class. Pattern `verdict tests|this test|was tested|tests? (ran|run on)|the test (runs|ran)` over `src/**/*.ts(x)`, `public/*.md` and `public/llms.txt`. One hit outside this change (that line). The llms.txt "p-values where a test ran" is conditional and true.
  - r1 confirmed the new claims against their sources: "descriptive only" (`methods/page.tsx:290`, the SVG's own label), "3.0 full periods" (`methods/page.tsx:298`, `gate_min_periods`), and the 99,999 draws.
- **Codex r2** on `d521789`, script only. The first launch was refused (model at capacity); the retry ran with the banner matched. Two P2 findings, both CONFIRMED:
  - only the max right edge was checked;
  - an empty or zero-size set of text rects passed.
  - Fixed in `30beb57`, with the `font-size:0` red arm above. This was the second appearance of that defect class in the same leg, so the leg now claims only what each text rect shows, and there are no further patch rounds.
- The caption rewording in `c348cd1` came after both rounds. It is the same claims in different word order, held by the unit test, the I-024 guard and the production check. Not re-reviewed.

codexCalls: 3 (r1, r2 refused at capacity, r2 retry)
adversarialReviews: 2 — EXECUTED

### Corrective and other

- **Push blocked ~10 min by GitHub 500s.** 5 rejections from 16:57:33Z to 16:58:34Z, one of them a single-commit push. The consult was 38765001. The orchestrator's answer (7d03cc62): GitHub-side, also seen by frame-dial. Rulesets read `[]` and `main` is unprotected. The push succeeded at the next scheduled try.
- **I-022's read** needed `readCommandTimeoutMs` raised to 600000. The third run finished in 192 s → 93/93.

hygiene helper: DISPATCHED 16:20Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-07.md PRESENT. It drafted:
- closes for I-009, I-017, I-020, I-022, I-024;
- re-dates for W-001 and W-004 (W-004 carries I-021's next walk).

Engineering-zero PASS, no expired waits, no PRODUCTION lines. Its two READ-MUTATED lines name `src/lib/spectralFigureText*.ts`, which are this lane's own P3 files.

### What remains

- **I-021:** `monitoring`, nextEvaluation 2026-10-09. Its read is now `check-figure-cue.mjs`. closeWhen waits on a cold walk.
- **I-028 (2026-10-08):** Turchin's box, including the "this verdict tests" wording.
- **W-001:** average position moved under 20 (5.5 since 09-20), the row's own trigger to mint a fresh click-through row. The close decides between minting that row and closing W-001.
- **Two residual I-024 findings from the walk:**
  - the "Why two labels" paragraph sits 1,490 px below the label it explains;
  - the caption's test wording. Fixed today by I-021.
- Edge fade on the scroller dropped (would need `FigureScroller.tsx`).

[standing-rules-hash: 88cc2dc9]

## Close

[P5 — Delta-only close]
ACTION: COMPLETED · item I-021 · P3 639164c1

The acceptance in force was the manager REDIRECT f3d1c14a, and it is met:
- **Cue.** It fits the pointer: a mouse at 900 is not told to swipe, and touch at 390 is.
- **Target/band line.** It is on screen above the figure on arrival at 390.
- **Caption.** It says no test was run, gated on `verdict.eligible`.
- **Rendered text.** On kondratiev, perez and turchin only the caption, the target/band line and the mouse cue changed.
- **Checks.** `check-figure-cue` reads 99/99 on production (36/99 before). The manager review 4b7d2bc1 read it on the surface: COMPLETED, no defects.

hygiene draft: 8 lines — 5 accepted · 3 amended · 0 rejected
- ACCEPTED: close I-009, I-017, I-020 and I-022, plus the owed-child-rows line "none" (0 of 747; nothing runs).
- AMENDED:
  - I-024: closed, with a note that the caption residual was fixed today by I-021.
  - W-001: closed instead of re-dated; its own trigger fired (position under 20), and W-005 is minted for the click-through question.
  - W-004: re-dated to 2026-10-09 instead of the 10-10 placeholder, to carry I-021's cold walk.
- READ-MUTATED, verbatim:
  - "READ-MUTATED W-001 src/lib/spectralFigureText.ts — NOT named in the readCommand: may be the lane's own concurrent P3 edit; lane checks"
  - "READ-MUTATED W-001 src/lib/spectralFigureText.test.ts — NOT named in the readCommand: may be the lane's own concurrent P3 edit; lane checks"
  - Both are this lane's own P3 files, and neither touches what `gsc-read` reads.
- check-wait-justification: helper PASS (0 findings). Re-run at close after I touched waits on I-021, I-028 and W-005: PASS, 23 of 34 rows carry `waitJustification`, 0 warn.
- check-engineering-zero: helper PASS, 0 findings, 0 unreadable. No lockfile changed since.

**Verify.** `check-due-gates-dispositioned` (no flag): "verdict: CLEAR — every gate due at Phase 0 was dispositioned." The snapshot is CURRENT (taken 2026-10-07), covering 8 rows.

**Ledger delta (continuity-edit), each with its evidence:**
- **Closed:** I-009, I-017, I-020, I-022, I-024, W-001.
- **Minted:** W-005, click-through at a held position under 20. readCommand `gsc-read --start 2026-09-20`, nextEvaluation 2026-11-04.
- **Re-dated:** I-021 to 2026-10-09 (monitoring; readCommand `check-figure-cue.mjs`; waiver removed; `waitJustification` until 2026-10-09) and W-004 to 2026-10-09.
- **Notes and fields:**
  - I-028 notes carry the Turchin "this verdict tests" line from Codex r1, and its `waitingFor` now reads that the gate is met.
  - W-001 notes log the body strings that changed.
  - I-022 `readCommandTimeoutMs` is 600000.

**Deliberate, not an omission (manager HYPOTHESIS):** the caption rewording in `c348cd1` came after both Codex rounds and was not re-reviewed. It is the same claims in a new order, in prose that touches no money, auth or data. Three things hold it: the unit test, I-024's TEST_RAN guard, and `check-figure-cue` on production.

**Receipt:** P3's receipt (639164c1) still holds; no bracket changed.

**Pending reads:**
- **I-028** on 2026-10-08: Turchin's box, the next honesty fix on this page.
- **I-021 / W-004** on or after 2026-10-09: a cold walk at 390 touch and ~900 mouse answers I-021's closeWhen.
- **I-027** on 2026-10-20.
- **W-005** on 2026-11-04.
- **I-025** on 2026-12-01.

UNRESOLVED: none.

codexCalls: 0 at close (3 today, all at P3)
[standing-rules-hash: 88cc2dc9]
