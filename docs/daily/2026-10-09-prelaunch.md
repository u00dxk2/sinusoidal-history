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

## P3 — Product-work loop (posted acf6e71a)

[P3 — Product-work loop]

**Action (improve):** /methods says what the 19 cross-grid re-pairings found, and lists them (I-029, new row). Manager review 6103ce43 APPROVE. All three copy instructions were followed: the result is stated on raw p ("none reaches p < 0.05 even before any correction (lowest unadjusted p 0.094), so none survives Holm correction"), "labelled as re-pairings" is gone, and a list shows the cells on the page. The link reads "the full table (machine-readable)".

**1. Implementation.** Commits `d6b6973` (change), `fa9a77b`, `a534ef6`, `8b12658` (Codex fixes) and `7d42482` (docs and stamps), on main. Files: `src/app/(app)/methods/page.tsx`, `src/components/CrossGridList.tsx` (new), `src/lib/spectral.ts` (one export), `public/methods.md` (mirror), `src/lib/methodsCrossGrid.test.ts` (new). The full suite passes with a receipt on `8b12658`: 24 files, 213 tests. Typecheck and lint are clean. **CI green on 8b126583a9** (`check-ci-status --workflow ci.yml --wait`: 1 success, 0 failures).
- The failing run came first: on the old text the new test failed 2 of 3 on both surfaces.
- Red arms: 11 named escapes (Codex r1 ×5, r2 ×4, r3 ×2), each applied as a mutation and each RED, with the files restored after. Logs are in this session's scratchpad (`red-arm2.mjs`, `red-arm3.mjs`).
- Sibling sweep for the `<summary>` display:flex defect: `<summary` across `src/**`, 3 hits. Apart from this one, one is the test and one is /cycles' "The longer story" (`src/app/(app)/cycles/page.tsx:306`), which hides the native marker on purpose and draws its own ▾. That makes 0 other defects.

**Independent review.** Three foreground `codex exec --sandbox read-only` rounds. Each banner's workdir was `C:\dev\skylark\sinusoidal-cycles`, checked before any finding was read.
- **r1 on `d6b6973`:** all reader-facing claims HOLD (REPRODUCED: 19 eligible cells, min p 0.09377, min p_ar2 0.11949, Holm rerun gives 0 rejections). The mirror test was loose: CONFIRMED, fixed in `fa9a77b`. The summary lost its disclosure marker under flex: CONFIRMED, fixed in `fa9a77b`. "Worth a look" was UNVERIFIABLE and was replaced by Codex's narrower sentence.
- **r2 on `fa9a77b`:** the marker fix holds and the new sentence HOLDS. The same matcher class came back (4 escapes, CONFIRMED). The shape changed in `a534ef6`: whole bounded blocks compared exactly.
- **r3 on `a534ef6`:** circular row expectations and an md row above the list: CONFIRMED, fixed in `8b12658` (an independent oracle built from the three JSON files; md bounded at the page's anchors). This was the third round of one class, so I **stopped patching** (global rule 2). Three escapes are DECLARED as the test's ceiling, in its header: new false prose elsewhere on the page, a `hidden` attribute on the rows, an edited number in the next sentence. Review and the live rendered-text diff own those.

**2. Delivery.** `check-deployed-sha-drift --service sinusoidal-history` → **in-sync, live 8b126583 = head**. The surface was read as well:
- Live /methods text multiset, this morning (308 lines) against now (350): 1 removed (the old paragraph) and 43 added. Those are the rewritten paragraph, the link text, the following sentence (now its own line because of the link split), the summary, the lead and 19×2 row lines. Nothing else moved.
- Live /methods and /methods.md each contain the exact sentence "none reaches p < 0.05 even before any correction (lowest unadjusted p 0.094), so none survives Holm correction" (1 hit each).
- At the extremes, live: at 320x568 touch and at 1440x900 mouse, one `<details>`, summary `display: list-item` (the triangle is drawn; screenshot checked at 320), summary height 64 px and 44 px. Opened, it shows 19 of 19 rows visible, 0 past the right edge, 0 px page overflow, and the smallest row text at 12 px.

**3. Encounter.** blind. The site carries no client analytics by standing choice, so no instrument can see a reader open /methods (bug row W-004). The next cold walk (W-004, re-dated to 2026-10-13 in the hygiene draft) asks step 5 again: "what did the re-pairings show?"

**4. Outcome.** Open; no read exists yet. I-029 closes on that walk.

USER-VISIBLE: /methods and /methods.md now say what the 19 cross-grid re-pairings found (none reaches p < 0.05 even before correction, lowest unadjusted p 0.094, so none survives Holm) and list every cell with its record and both p-values — 8b12658 [proof: live /methods 308 → 350 lines, 1 removed + 43 added and nothing else; check-deployed-sha-drift in-sync live 8b126583; the sentence present once on live /methods and /methods.md; list read live at 320x568 and 1440x900, 19/19 rows visible, 0 px overflow] [coverage: Search Console page-only (scripts/gsc-read.mjs) · last good read 2026-09-16 · founder+test excluded no] [exposure: blind — no client analytics on the site by standing choice, so no instrument sees a reader reach /methods · bug row W-004]

codexCalls: 3 (three foreground read-only review rounds; probe GREEN 15:13Z)
adversarialReviews: 3 — EXECUTED (r1 d6b6973, r2 fa9a77b, r3 a534ef6; dispositions above)
hygiene helper: DISPATCHED 2026-10-09 ~10:10 MT · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-09.md PRESENT. It reported no production findings; check-wait-justification PASS, check-engineering-zero PASS; I-021's read timed out at the 60 s default, with a timeout bump drafted. Its 4 READ-MUTATED lines were my own /methods edits; the `.bak` was a mutation backup, since deleted.

**Remains for the close:**
- Apply the hygiene draft: I-028 close, W-004 re-date, I-006 re-date, and I-021 timeout plus re-run, then close.
- Set I-029 to monitoring.
- Commit this report's P3 section.

[standing-rules-hash: 88cc2dc9]

## Close

ACTION: COMPLETED · item I-029 · P3 acf6e71a

The acceptance condition was met, and the manager review (5865e98b) read it as COMPLETED. Live /methods and /methods.md state "19 re-pairings" and "none survives Holm correction", and link the full table. The live text multiset moved 308 → 350 lines: 1 removed, 43 added, nothing else. The new test failed on the old text and passes on the new one. CI is green and drift is in-sync at `8b126583`. No state has changed since the P3 post.

**Hygiene draft:** 5 lines. 4 accepted, 1 amended, 0 rejected.
- **I-006: ACCEPT.** `--extend` to 2026-10-16, plus `waitJustification.until` set to 2026-10-16.
- **I-028: ACCEPT.** `--close` with its own note file.
- **W-004: ACCEPT.** `--extend` to 2026-10-13, `waitJustification.until` set to 2026-10-13, `unWait` re-pointed at the I-029 re-ask, and today's walk appended to notes.
- **Owed child rows: ACCEPT** ("none").
- **I-021: AMEND.** `readCommandTimeoutMs` raised to 300000, then `--run I-021` printed "99/99 PASS" (exit 0, 41.9 s, stamped). I closed it with a note carrying the 900 wheel and clip finding. It does not get its own row, because the fix needs `FigureScroller.tsx`, which is on the do-not-touch list.

**READ-MUTATED, quoted from the draft.** All four are my own P3 edits, and the `.bak` was a mutation backup, since deleted.
- "READ-MUTATED I-006 src/app/(app)/methods/page.tsx — NOT named in the readCommand: may be the lane's own concurrent P3 edit; lane checks"
- "READ-MUTATED I-021 public/methods.md — …"
- "READ-MUTATED W-004 public/methods.md — …"
- "READ-MUTATED W-004 public/methods.md.bak (new untracked) — …"

**Checks:**
- **Wait justification** (re-run after my wait edits): "RESULT: PASS — 24 of 35 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)".
- **Engineering zero** (from the helper): "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable (exit 0)".
- **Due gates:** "verdict: CLEAR — every gate due at Phase 0 was dispositioned", with the snapshot CURRENT (taken 2026-10-09).

**Ledger delta, beyond the draft:**
- **I-029** minted at P3, then set to `monitoring` with `waitJustification` {until 2026-10-13, unWait: W-004 walk step 5}. It closes on that walk's answer and on nothing else.

**Pending reads:**
- **2026-10-13:** the W-004 cold walk, which carries I-029's closeWhen.
- **2026-10-16:** I-006.
- **2026-10-20:** I-027.
- **2026-11-04:** W-005.
- **2026-12-01:** I-025.

**Receipt:** P3's receipt still holds, so I wrote nothing new.
