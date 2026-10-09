# sinusoidal-cycles — 2026-10-09 (prelaunch)

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** /methods says what the 19 cross-grid re-pairings found, and where to read them. Right now it says the panel exists but not what it shows. **Item:** new row, minted at P3 (no existing row covers it). It surfaced in today's W-004 cold walk.

**The user problem, in the walker's words** (synthetic, N=1, `docs/walks/2026-10-09-w004.md` step 5): the most confusing sentence on /methods was "A secondary cross-grid panel re-pairs each period with every series long enough to clear the gate (19 cells, labelled as re-pairings, not the site's claims)." The walker could not find the panel anywhere on the page, and the sentence "implies a test may have run and produced a result" without saying which. It was the walk's single worst thing.

**What a user will see differently:** that /methods sentence gains its result: all 19 re-pairings clear the gate, none shows significant power at its period under either null after Holm correction (lowest p 0.094), and the cells are listed with their p-values in verdicts.json (linked). `public/methods.md` gets the same sentence in the same commit. Nothing else changes.

### Section 0

- **Primer:** `docs/cold-starts/2026-10-08.md` (written yesterday; there is no `2026-10-09.md`). First action was the I-028 read, then the W-004 walk. Both done (below).
- **git:** `pull --ff-only` → "Already up to date". HEAD `c53b466` = origin.
- **Listener:** 🟢 SSE alive + loop ticking. The SessionStart hook relaunched the listener at 15:07:14Z (pid 33624). Its log shows hello and 0 events replayed. The loop is armed by a `ScheduleWakeup` call, and waker ranks 1-3 are running.
- **Codex:** GREEN, from the `[codex-probe]` line on this prompt (15:13Z). It wasn't used at P1 because there is no diff yet.
- **CI:** `check-ci-status --workflow ci.yml` → GREEN for `c53b4663d7` (1 success, 0 failures, 0 pending). The kickoff had read UNKNOWN because its gh read timed out after 10 s. The live read is GREEN.
- **Deploy drift:** `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live `c53b4663` = head.
- **Harness:** running 2.1.295 · fleet UNIFORM (27 of 27) · installed 2.1.295 (SAME). The record moved from 2.1.277.
- **Cycle rotation:** exit 0, "no product-love cycle picks this lane today". Normal P3.
- **Due gates:** `--snapshot`, taken once → "4 gate(s) due on/before 2026-10-09" (I-006, I-021, I-028, W-004). `tmp/due-gates-snapshot.json`. The snapshot exited 3 because the I-021 and I-028 checks had never run. Both have run since (below).
- **Board:** `answered-cards` → no waiting, answered or pending-verify cards.
- **Recs yesterday:** `docs/daily/2026-10-08-prelaunch.md` has no `## Recommendation` block, so `Recs yesterday: none`.
- **Retro (10-08):** one finding bears on today: Q6, vitest failure dumps cost the most tokens for the least return. It was carried to I-028's close, which happens today. In P3 I'll run the single test file with a short reporter rather than dumping the whole suite.

### The due reads, run today (live production)

- **I-028** (readCommand): `check-rendered-text snap /cycles/turchin` → 96 lines, the same count as 10-08. The box reads "The record this verdict is judged on, US top 1% wealth share (1913 onward), runs 111 years", and "Why two labels" is present.
- **W-004** (readCommand): `check-verdict-landing --fails-only` → 490/490 PASS (iPhone 15 390x664, 360x560, 320x568 and 1440x900: 10 of 10 landings name the cycle at each size).
- **I-021** (readCommand): `check-figure-cue` → 99/99 PASS across 9 pairings: the mouse cue at 900, the swipe cue at 390, the target/band line on screen above the figure on arrival, and an ineligible caption that does not open as a test.
- **W-004 cold walk** (one synthetic Claude agent with a fresh context, Playwright Chromium on the live site; it read no repo source, docs, `.md` or llms.txt): `docs/walks/2026-10-09-w004.md`. Per step:
  1. **Phone 390, Kondratiev figure: PASS.** "Target period 54 years · Insufficient data — no test possible · 1.4 of 3.0 required periods" sits 66 px above the figure top, and the cue is "Swipe sideways for the whole figure".
  2. **900 mouse, same figure: MIXED.** The cue is "Scroll sideways for the whole figure, or click it to open it full size", which fits a mouse. The walker read it and knew what to do. The figure is still clipped by 196 of 900 px, with no edge cue, and a plain wheel scrolls the page, not the figure. The caption does not read as a test having run.
  3. **1440, Turchin: MIXED.** (a) It named the judged record from the box. (c) Nothing read as a test having run. (b) The reason for two labels is right but 1,593 px below the "Paired data" line, and nothing at that line points down to it.
  4. **Phone, Turchin:** the same answers, with the reason about 4.9 screens down.
  5. **/methods: MIXED.** The headline is clear ("0 of the 9 pairings…"). The cross-grid sentence is the worst thing on the walk.

### Evidence for the choice

- **OBSERVED, synthetic walk** (above, step 5): a cold reader cannot find the cross-grid panel and reads the sentence as hinting at a result it never states. Limits: N=1, a model, comprehension rather than love.
- **OBSERVED, the tree:** `src/app/(app)/methods/page.tsx:317-320` holds the sentence. `cross_grid` appears in `src/lib/spectral.ts:27,39` (types only). No component renders it. So "labelled as re-pairings" is true only inside `verdicts.json`'s `lay_text`, which no page shows.
- **OBSERVED, the frozen data** (`public/data/spectral/verdicts.json`, read only): `cross_grid` has 19 rows, all eligible and all `NO_SIGNIFICANT_TARGET_POWER`. `holm_significant` is true for 0 of 19, and `holm_significant_ar2` for 0 of 19. The lowest p is 0.094 (schlesinger_jr / vdem_libdem). Each row's `lay_text` opens "Re-pairing, not the site's claim: …".
- **OBSERVED, the mirrors:** `public/methods.md:163` carries the same sentence word for word. `public/llms.txt:71` already says "plus a 19-cell cross-grid panel of re-pairings". It names the panel, not a result. I'll leave llms.txt alone unless the claims pass says otherwise.
- **HYPOTHESIS:** stating the result moves the bar's "honest resolution" moment. Today a reader sees the site hint at analysis it does not show, which is the overclaim shape in reverse (an underclaim that reads as hiding something).
- **MISSING:** real-user evidence. There is no client analytics (a standing choice, bug row W-004). The encounter is blind.

### Permission, and the freezes

- **Decision class:** lane-owned body copy on /methods with its prose mirror. It reports frozen data and does not change the method, the gate, any verdict, or the API. No card is open on it.
- **Frozen, not touched:** `public/data/spectral/` (read only), `FigureScroller.tsx`, `HashLink.tsx`, the /state bands and `state-2026.csv` (I-025).
- **The TEST_RAN guard** (`src/lib/testedSeries.test.ts:33`) reads /methods and `methods.md`. These re-pairings did run, so the sentence is true. I'll word it without the guard's verbs ("clear the gate; none shows significant power"), so no allowlist entry is needed. If the claims pass wants the plainer "were tested", I'll add an exact-text allowlist entry scoped to those two files, never a looser regex.
- **Cross-family claims pass** (global rule 6, outward-facing factual text): Codex read-only checks the new sentence against `verdicts.json`.

### Next action — improve

Prep only until the review: no commit, push or deploy.

1. Write the failing test first. Add an assertion that /methods (page source and `methods.md`) states the cross-grid count and the number of Holm-significant cells, both derived from `verdicts.json` at test time rather than typed in. It fails on today's text.
2. Edit the sentence in `page.tsx:317-320` and `public/methods.md:163` together, linking `/data/spectral/verdicts.json`. Keep `{" "}` at the JSX junctions.
3. Run the single test file, then `npm run typecheck` and lint. Then run a Codex claims pass on the sentence.
4. After deploy, read the rendered text on live /methods before and after: exactly one line should change.

First command (the failing run):

```
npm --prefix C:/dev/skylark/sinusoidal-cycles test -- src/lib/testedSeries.test.ts --reporter=dot
```

### Acceptance

- Live `/methods` and `/methods.md` state "19" re-pairings and "none" (0 Holm-significant under either null), with a working link to verdicts.json.
- `check-rendered-text` on live /methods, before vs after: 1 line removed and 1 line added, nothing else.
- The new test fails on the old text and passes on the new. The TEST_RAN guard stays green with no new allowlist entry, or with one exact-text entry if the claims pass requires it.
- CI green, and drift in-sync on the new sha.

### Delivery and encounter checks

- Delivery: CI, then `check-deployed-sha-drift`, then the live rendered-text diff, all today after the push.
- Encounter: blind (no client analytics, bug row W-004). The next cold walk can ask its step-5 question again: "what did the re-pairings show?" At this traffic, Search Console (W-005, 2026-11-04) is the only real-reader read, and it cannot see this paragraph.

USER-FACING: yes — `src/app/(app)/methods/page.tsx`, `public/methods.md`, `src/lib/testedSeries.test.ts` (test, internal). Possibly `public/llms.txt`, only if the claims pass finds its line false.

### Prep done while the review is pending (uncommitted)

- `src/lib/methodsCrossGrid.test.ts` was written. It derives the count (19), the number of Holm-significant cells (0) and the lowest p (0.094) from `verdicts.json`, and checks the cross-grid passage on both `/methods` (server-rendered) and `public/methods.md`. **The failing run on today's text:** 2 failed, 1 passed. Both surfaces fail at `/\bnone\b[^.]*significant/`, and the received text is exactly the live sentence. The copy is not edited yet.

<!-- findings:begin -->
- **Correction to (a) I-006 below:** `src/app/og/route.tsx` exists (`git ls-files src/app/og/route.tsx` prints it). The snapshot's READ-PATH warning was about the bare `og/route.tsx` spelling in the row's onTrigger, which does not resolve from the repo root. It was not about a missing file, and I repeated the warning without checking. The hygiene helper's I-006 read printed "og: true poster: true brush: true".
<!-- findings:end -->

### HYGIENE INPUTS

(a) **Due rows not bearing on the choice:** 4 of 4 due (`dated gates due today`), each read today:
  - I-006: due, last run 2026-10-03. Its readCommand is UNSCOPED, and its notes cite `og/route.tsx`, which does not exist in this repo (the snapshot's READ-PATH warning). It needs a fixed path or a dead-ref note, and a re-read.
  - I-021: readCommand 99/99, and the cold walk answered its closeWhen at 390 touch and 900 mouse (step 1 PASS; step 2 the cue fit and the walker read the target/band). Candidate: close. Carry the 900 clipping-without-edge-cue and the wheel-scrolls-page finding as a note, or as a new row if the close judges it user-facing.
  - I-028: readCommand 96 lines as shipped. The cold walk answered closeWhen ("can say why it differs": yes, steps 3 and 4). Candidate: close. Note the distance (1,593 px desktop, about 4.9 screens on a phone) as the same shape Kondratiev carried. The carried retro Q6 folds into this close.
  - W-004: readCommand 490/490 and walk done. Candidate: re-date it to the next walk, which re-asks step 5 after today's ship.
(b) **Owed child rows (skylark-site ledger):** none, read `rows owed to you` (0 of 747).
(c) **State reads marked CROSSED:**
  - `dated gates due today`: 4 of 34 ledger rows.
  - `HEAD CI`: UNKNOWN at compose (gh timeout). The live read is GREEN.
  - `missingLinkedCommits`: NOTHING SWEPT (0 of 0). This is not a finding.
