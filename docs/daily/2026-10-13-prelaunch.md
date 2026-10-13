# Daily — sinusoidal-cycles — 2026-10-13 (Tuesday, MT)

## Overnight session (round 1) — where the record is

This round was dispatched at 22:33 MT on 10-12 under the 10-12 kickoff, so its P1 packet and P3 work are in `docs/daily/2026-10-12-prelaunch.md`, in the sections headed "Overnight session (round 1)" (P1 67df2ede, P3 766906d9). The close is here, because it ran after MT midnight and the 10-13 artifact is the one owed.

[P5 — Delta-only close]

## Close (overnight session round 1, 2026-10-13)

ACTION: COMPLETED · item I-038 · P3 766906d9

The manager review rated it COMPLETED against the acceptance in force. Its own reads:
- The live Turchin and Perez HTML carry the new key and aria label, with no old wording and no "does not exist".
- The folds read 13/13 at 320x568.
- Live `ed67174` = head.

**State changed since P3 (766906d9):** none for readers. `ed67174` (report and walk notes, docs only) is pushed and live.

**Ledger delta** (every write via `continuity-edit`, each printing "wrote 1 change(s)"):
- **I-038:** linkedCommits `5d5031a` → + `80eada8`, `2544982`.
- **I-038 → closed 2026-10-13** on its closeWhen, as the review suggested. Both pre-registered legs held on both pages (`docs/walks/2026-10-13-i038.md`).
- **I-039 minted** (open, P3, nextEvaluation 2026-10-20, readCommand `check-entry-folds … --width 320 --height 568`). It is the one figure question: hatch every pre-record year in the window, or keep the shortfall hatch and mark the 3-period floor. It also covers Perez's ~3px hatch, unseen at a glance. Not another rewording.

**Hygiene draft:** 0 lines — 0 accepted · 0 amended · 0 rejected (`tmp/hygiene-draft-sinusoidal-cycles-2026-10-12.md`, inputs none).
- READ-MUTATED: "none — 0 reads guarded (no --run executed; no due rows)".
- check-wait-justification: "RESULT: PASS — 31 of 44 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)".
- check-engineering-zero: "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable (exit 0)". No lockfile changed.
- I-039 was minted after the helper ran, and it carries no wait, so neither check is owed a re-run.

**Due-gate verification: UNRESOLVED (snapshot STALE, by the rule).**
- `check-due-gates-dispositioned` says "verdict: CLEAR … ⚠ 'Phase 0' here means 2026-10-12, NOT 2026-10-13 — snapshot STALE". The morning snapshot was taken at 22:45 MT on 10-12, and the close runs on 10-13. I did not re-snapshot at close.
- Today's due set, read directly (`--print`, read-only, 45 swept): "0 gate(s) due on/before 2026-10-13".

**Receipt, restated with the exposure bracket corrected.** The manager flagged that P3's bracket cited I-038, the wording row, as the instrument row. There is no instrument row. The site carries no client analytics by standing choice (`docs/evangelism-bar.md:30`), so nothing could see a reader arrive.

USER-VISIBLE: on every not-testable cycle page the hatched key now reads "years missing from the record" instead of "years a test still needs", so the shaded years read as record missing behind us rather than a wait ahead — 80eada8 [proof: live /cycles/turchin visible text "years a test still needs" → "years missing from the record" (multiset 103→103, the only changed line); check-deployed-sha-drift in-sync, live = head; check-entry-folds 13/13 at 320x568 with Perez 5px] [coverage: none — no client analytics by standing choice (docs/evangelism-bar.md:30), Search Console sees impressions not page views · last good read n/a · founder+test excluded no] [exposure: blind — the site has no reader-arrival instrument by standing choice; no instrument row exists, none minted · bug row none]

CI: `80eada8`'s descendant `2544982` is tests green (`check-ci-status --wait`, GREEN). `ed67174` is docs-only.

**David's board:** nothing new. No needs-decision. The I-039 shape choice is the lane's call under figure authority, and it goes to David only if the walk fails and "accept as is" is the remaining branch.

**Today panel:** written for rail day 2026-10-12. The live brief was still dated 10-12, so the write merged (`reset: false`, 23 lanes preserved).

**Primer:** `docs/cold-starts/2026-10-13.md`.

**Pending reads:**
- 2026-10-20: I-027, I-034, I-039.
- 2026-11-01: I-037.
- 2026-11-04: W-005, I-032.
- 2026-12-01: I-025 (David).

**UNRESOLVED:** due-gate verification (snapshot STALE, see above; today's direct read is 0 due).

codexCalls: 0 (this phase; the round's one review run is counted on P3 766906d9) — probed-declined

[standing-rules-hash: 88cc2dc9]

---

[P1 — Evidence and choice]

## Overnight session (round 2) — P1 selection packet

**Outcome:** on every not-testable cycle page, the hatch under the curve covers every year before the record begins, so the key "years missing from the record" is true of the picture. The strip then has no unexplained blank stretch, and Perez's hatch is wide enough to see. Item **I-039** (open, P3, nextEvaluation 2026-10-20; minted at the round-1 close as the ONE figure row, per the manager review be60d137).

**The user problem, in a reader's words (synthetic, N=1, `docs/walks/2026-10-13-i038.md`, Perez at 320):**
- "the blank 1600 to about 1860 region also has no record, yet it is not hatched. Either blank and hatched mean different things, which is not explained, or the hatch is not drawn where it should be."
- On the hatch itself: "essentially no", it was "about two diagonal strokes … about 3 CSS px".

**Why this beats the next two candidates:**
- **I-034** (local full suite fails under fleet load) is test infrastructure. No reader sees it.
- **The Kondratiev "no p-value exists" residue** (primer, not minted) sits in the verdict copy. That copy is don't-touch, so it needs a ruling first.
- I-039 is the one known contradiction between a figure and its key on pages every not-testable reader sees, and it fits a round.

### Evidence

- **OBSERVED (synthetic, N=1):** the round-1 walk above, Perez at 320x568, read 06:07Z.
- **OBSERVED (synthetic, N=1):** an earlier walk on Kondratiev at 320 read the mid-timeline hatch as "something special about that era (a gap? a war-and-depression period?)" (`docs/walks/2026-10-12-w004-r2.md:54`).
- **OBSERVED, measured on production now** (every cycle page; a scratchpad fetch script reading each served rect's `data-from/to/x/width` and the window from the aria label; read 2026-10-13 ~06:45Z). All windows are 1600–2050. The hatched pages split three ways:

  **1. No blank stretch (1 page):**

  | Page | Hatch | Pre-record years in window | Blank years | Width at 320 |
  |---|---|---|---|---|
  | Turchin | 1574 → 1913 | 313 | **0** | 200px |

  **2. Blank pre-record years, and the hatch is 12px or less at 320 (3 pages):**

  | Page | Hatch | Pre-record years in window | Blank years | Width at 320 |
  |---|---|---|---|---|
  | Perez | 1858 → 1865 | 265 | **258** | **4.5px** |
  | Strauss-Howe | 1773 → 1789 | 189 | **173** | **10.2px** |
  | Schlesinger | 1934 → 1952 | 352 | **334** | **11.5px** |

  **3. Blank pre-record years, hatch wider (5 pages):**

  | Page | Hatch | Pre-record years in window | Blank years | Width at 320 |
  |---|---|---|---|---|
  | Khaldun | 1651 → 1800 | 200 | 51 | 95px |
  | Kondratiev | 1863 → 1948 | 348 | 263 | 54px |
  | Huntington | 1843 → 1879 | 279 | 243 | 23px |
  | Dalio | 1797 → 1870 | 270 | 197 | 47px |
  | Modelski | 1692 → 1870 | 270 | 92 | 114px |

  Fathers-and-sons has no hatch. In short: 8 of 9 hatched pages carry a blank pre-record stretch beside a key that says "missing", and 3 of 9 hatches are 12px or less at 320.
- **OBSERVED, mechanism at source:**
  - `missingYears()` (`src/lib/seriesOverlay.ts:88-96`) returns `[recordEnd − 3·period, recordEnd − span]`, the shortfall to the 3-period floor.
  - `page.tsx:893-896` clips that span to the window.
  - The pin `seriesOverlay.test.ts:208-211` asserts exactly that span.
  - Only Turchin's shortfall reaches past 1600, which is why Turchin alone walked clean.
- **HYPOTHESIS, the choice between I-039's two shapes:**
  - **(a) Hatch every pre-record year in the window**, `[window start, record start]`. This makes the approved key literally true on all 9 pages. Every hatch becomes ≥ 121px at 320 (years ÷ 450 × 288: smallest Strauss-Howe 189 years ≈ 121px; Perez 265 ≈ 170px; Kondratiev 348 ≈ 223px). It adds no mark and no text, so the 320 fold budget (Perez 5px) cannot move.
    - **The cost, stated before building:** the picture stops showing the size of the shortfall. Schlesinger's 18-year gap and Turchin's 339-year gap become the same kind of shading. The verdict box already states the shortfall in years, in words that are don't-touch.
  - **(b) Keep the shortfall hatch and mark the floor.** This needs a new mark plus a key entry. A key line at 320 is exactly what the 5px Perez budget cannot absorb, and it leaves the blank stretch on 8 pages needing its own explanation.
  - I choose (a).
- **MISSING:** any real reader on any /cycles page (no client analytics by standing choice, `docs/evangelism-bar.md:30`).
- **Retro finding that recurred and bears on the choice:** "a check written from a measurement inherits its looseness." The round-1 walk passed on the two pages it read, while the defect sat on 8 of 9 pages. Tonight's measurement covers all ten pages, and the walk covers the two worst kinds: Perez (thinnest) and Kondratiev (largest blank).

### Section 0 (deltas since round 1's, all read this round)

- Listener 🟢 (pid 55924; waker ranks 1–3 relaunched 00:3x MT). `/loop-tick` armed by tool call.
- Codex GREEN per the `[codex-probe: …]` line.
- CI GREEN and drift in-sync at `2dd531a` (round-1 close, docs-only).
- Due gates: `--snapshot` "0 gate(s) due on/before 2026-10-13" (45 swept), taken after MT midnight.
- Board: none (`answered-cards`, read in round 1, ~3h ago; no card filed since).
- Rotation: exit 0, no product-love pass for this lane.

### Permission

I-039 is this lane's own open row: not parked, no card. It is a figure change inside the lane's product authority (same class as I-033/I-035). Untouched: the verdict box wording, `public/data/spectral/`, HashLink.tsx, the /state bands and state-2026.csv (I-025), and `judgedOn` lengths. The key words stay as approved; the manager ruled "don't reword again".

### Next action

Kind: **improve.**
- In `CurveFigure` (`page.tsx:889-896`), the hatch spans `[start, record's first year]` whenever the verdict is not testable and the record begins inside the window. It no longer spans the shortfall.
- `missingYears()` stays as the not-testable gate. Its doc comment says what the figure now draws.
- **Aria label:** "Hatched before it: the earlier years a test would need, missing from this record." → "Hatched before it: the earlier years missing from this record." On Perez the hatch now covers 258 years more than a test needs, so "a test would need" would overclaim.
- **Pin (`seriesOverlay.test.ts:208-211`):** `from` = window start and `to` = the record's first year. The oracle stays the manifest-built record, never `missingYears()`.
- The key words are unchanged.

First command (the before-snapshot of every hatch, for the after-diff):

```
node C:/Users/david/AppData/Local/Temp/claude/C--dev-skylark-sinusoidal-cycles/b2bd006d-e232-4be4-99f1-a0bdfde5498d/scratchpad/hatchspan.mjs
```

### Acceptance condition (observable)

- **Delivery:**
  - Live, the same measurement reads **blank 0 on all 9 hatched pages**, each hatch from 1600 to its record's first year.
  - Fathers-and-sons is still unhatched.
  - `check-entry-folds` is 13/13 at 320x568, with Perez still at 5px.
  - Visible-text multiset is unchanged on a hatched page (the hatch is SVG; the aria label is not visible text).
  - `check-embed-snippets` 42/42.
  - **One red arm:** restore the old x1, and the pin goes RED on the pages whose shortfall starts inside the window. Restore the fix, and it is GREEN with the tree clean.
- **Outcome (pre-registered, written before any look):** a fresh glance-first walk at 320x568 on /cycles/perez and /cycles/kondratiev, with the round-1 brief's questions plus one. It PASSES only if, on BOTH pages:
  - (1) A2: the walker notices the hatched area at a glance;
  - (2) the walker does not read part of the strip's empty years as unexplained or contradicting (no "blank and hatched mean different things", no "something special about that era");
  - (3) Step A names the record's shape without "follows/fits/mirrors/lines up with/moves with" the curve;
  - (4) B2 reads the hatch as years with no record, not a wait.
- **If it fails:** no further figure iteration tonight. I-039's other branch is a recorded decision to accept the figure as is, and that goes to the close.

### Delivery and encounter checks

- **Delivery:** CI green → deploy row live = head (`check-deployed-sha-drift --service sinusoidal-history`) → the hatch-span measurement, folds, multiset and embed reads on production.
- **Encounter:** blind. No reader-arrival instrument exists by standing choice, and no instrument row exists. The synthetic walk is the read, the same round, after deploy.

### USER-FACING: yes

Paths:
- `src/app/(app)/cycles/[id]/page.tsx`: hatch x1, `data-from`, aria label, comments.
- `src/lib/seriesOverlay.ts`: doc comment.
- `src/lib/seriesOverlay.test.ts`: pin.

No prose mirror describes the hatch (Grep over `public/` for "hatch": checked in round 1, none).

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none**. Read: `--snapshot` "0 gate(s) due on/before 2026-10-13" (45 swept).
- (b) Owed child rows (skylark-site ledger): **none**. Read: round-1 kickoff `rows owed to you` (0 of 749); this prompt carries no state block.
- (c) State reads marked CROSSED: **none**. This prompt carries no kickoff state block; round 1's block had none crossed.

codexCalls: 0 (P1) — probed-declined

---

[P3 — Product-work loop]

## Overnight session (round 2) — P3 product-work loop

### Action: improve (I-039), shape (a), as the manager review af4bddfa APPROVED it

The hatch runs from the window's start to the judged record's first year on every not-testable page. Turchin is handled as the review asked:
- its hatch still ends at 1913, the record the verdict counts, although the file starts in 1820;
- the code comment says so;
- a test arm reads the real CSV's first row (1820) and pins the rendered `to` at 1913;
- the walk asked T1.

### 1. Implementation

- **`26eceef`:**
  - `src/app/(app)/cycles/[id]/page.tsx`: hatch `{from: start, x1: x(start), x2: x(min(end, missing.to))}`, `data-from`, the aria label "Hatched before it: the earlier years missing from this record.", and the comments.
  - `src/lib/seriesOverlay.ts`: doc comment only.
  - `src/lib/seriesOverlay.test.ts`: `from = start`, `x = 0`, `to = first drawn year`, the Turchin arm, and the aria pin.
- **Gates (local, targeted):**
  - `vitest run src/lib/seriesOverlay.test.ts` 16/16.
  - eslint exit 0 on the three files.
  - `npm run typecheck` exit 0.
  - CI: `check-ci-status --workflow ci.yml --sha 26eceef6… --wait`, GREEN.
- **Red arm:** I restored the shortfall-only span (`from: missing.from, x1: x(Math.max(start, missing.from))`).
  - Result: "9 failed | 7 passed (16)", e.g. "expected 1651 to be 1600", "expected 1863 to be 1600".
  - Restored: "16 passed (16)", and `git status` shows only the intended files.
- **Codex r1 at `26eceef`** (foreground pipe, `--sandbox read-only`, banner workdir `C:\dev\skylark\sinusoidal-cycles` checked): **"No HIGH/MED/LOW findings."**
  - **REPRODUCED:** all 9 hatches run from 1600 to the first drawn judged-record year; `missing.to > start` is still the right gate.
  - **REPRODUCED:** the old span fails 9/9; the old geometry alone fails 8 (Turchin was already clipped); Turchin's end moved to 1820 fails.
  - **REPRODUCED:** all 10 verdict boxes are byte-identical and the visible text is identical; 64/64 `testedSeries` cases pass, including the I-028 guards.
  - **STATIC:** no other consumer of `data-from` or the hatch wording.
  - It marked the folds SUPPLIED. I re-read them after the deploy (below).
- **Sibling sweep:** I searched `scripts/` for `missing-years|data-from|missingYears`: 0 hits. Only the test reads the span.

### 2. Delivery

- `check-deployed-sha-drift --service sinusoidal-history`: in-sync, live `26eceef6` = head.
- **Hatch-span measurement on production, all 10 cycle pages** (the same scratchpad script as at P1):
  - Before: Perez 258 blank / 4.5px, Strauss-Howe 173 / 10.2px, Schlesinger 334 / 11.5px.
  - After: **blank 0 on all 9 hatched pages**, each hatch from 1600. The thinnest is Strauss-Howe at 121px; Perez is 170px.
  - Fathers-and-sons is unhatched.
- `check-entry-folds … --width 320 --height 568`: **13 of 13 OK**, Perez 5px (unchanged).
- **Visible-text line multiset, all 10 cycle pages, before (snapped before the build) vs after:** 0 differences on every page (khaldun 100, kondratiev 105, huntington 99, schlesinger-jr 101, perez 99, turchin 103, dalio 99, strauss-howe 101, modelski 101, fathers-and-sons 70). The same instrument caught round 1's key change, so a 0 here is a reading and not a dead probe.
- `check-embed-snippets`: **42/42 PASS**.

### 3. Encounter

**Blind for real readers.** There is no reader-arrival instrument by standing choice (`docs/evangelism-bar.md:30`), and no instrument row exists. The synthetic walk is the read.

### 4. Outcome (synthetic, N=1): HELD on both pages, all four legs

Walk notes: `docs/walks/2026-10-13-i039.md` (fresh walker, 320x568, 07:09–07:11Z).

- **Perez:**
  - The hatch was seen: "from the left edge (1600) to … about 1865". Round 1 had "essentially no".
  - The only blank parts were read as the future, plus "the data simply ends a year or two before 2026".
  - The line "doesn't follow the 55-year wave visibly".
  - The hatch means "years … for which the measured series doesn't exist".
- **Kondratiev:**
  - The hatch was seen, 1600 to ~1948.
  - The only blank is after "now".
  - The line has "no visible wave shape".
  - The hatch means "years with no TFP measurement". The 10-12 reading "something special about that era" is gone.
- **Turchin T1:** "No hard contradiction." At ~y 3014 the page says pre-1913 points exist and resolves it at ~y 3908 ("Why two labels"). That leaves "a one-screen confusion", and the walker adds that "'missing' is … stronger … than 'excluded' for years that have five data points". Recorded on I-039 for the close, not iterated (review af4bddfa).

<!-- findings:begin -->
- **Turchin's word "record" carries two meanings across the page.** The 1913+ yearly record is what the hatch and the verdict use. The paired-data section, ~5 screens down, lists 1820–1910 points. The page resolves this itself ~1.6 screens later. The walker's suggestion ("years before the yearly record") would be a key rewording, and the review rules out rewording, so it is recorded on I-039 for a decision, not shipped.
- **Perez never names its record's start year on the first screen**, and Kondratiev's sits at the fold. This is outside I-039's bar. Noted, not minted.
<!-- findings:end -->

### Receipt

USER-VISIBLE: on every not-testable cycle page the hatch now shades every year before the record begins (from 1600), so no unexplained blank stretch sits beside "years missing from the record", and Perez's shading grew from ~4px to ~170px wide on a phone — 26eceef [proof: production hatch spans before → after, blank pre-record years Perez 258 → 0, Kondratiev 263 → 0, Schlesinger 334 → 0, all 9 hatched pages blank 0; check-deployed-sha-drift in-sync live 26eceef6 = head; check-entry-folds 13/13 at 320x568, Perez 5px; visible-text multiset 0 differences on 10 pages] [coverage: none — no client analytics by standing choice (docs/evangelism-bar.md:30), Search Console sees impressions not page views · last good read n/a · founder+test excluded no] [exposure: blind — the site has no reader-arrival instrument by standing choice; no instrument row exists, none minted · bug row none] [outcome: held — fresh glance walk at 320x568, docs/walks/2026-10-13-i039.md, Perez and Kondratiev pass all four pre-registered legs (synthetic N=1)] [next: no new decision — Turchin's two meanings of "record" carried to the close on I-039]

### What remains

- **For P5:**
  - I-039 linkedCommits + `26eceef`.
  - closeWhen ("a shape ships, and a fresh glance-first walk at 320x568 on /cycles/perez sees the hatched area and does not read the blank and hatched parts of the strip as contradicting each other") is met.
  - The disposition of Turchin's T1 note is the close's call.
- **Walk notes:** `docs/walks/2026-10-13-i039.md`, committed with this report.

codexCalls: 1 (P3: one read-only review run at 26eceef)
adversarialReviews: 1 — EXECUTED
hygiene helper: DISPATCHED 2026-10-13 ~00:50 MT · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-13.md PRESENT (0 drafts; wait-justification PASS 31/45; engineering-zero PASS 0 findings)

[standing-rules-hash: 88cc2dc9]

---

[P5 — Delta-only close]

## Close (overnight session round 2, 2026-10-13)

ACTION: COMPLETED · item I-039 · P3 8afb9df6

The manager review (19f933a2) rated it COMPLETED and found no defects. Its own live read:
- On all 9 hatched pages, the served hatch runs 1600 → the judged record's first year, matching an oracle built straight from the manifest CSVs.
- Every verdict `lay_text` appears verbatim in the served page.
- Folds read 13/13 at 320x568.

**State changed since P3 (8afb9df6):** none for readers. `6818475` (report and walk notes, docs only) is pushed; live = head per the review's drift read.

**Ledger delta** (every write via `continuity-edit`, each printing "wrote 1 change(s)"):
- **I-039:** linkedCommits + `26eceef`.
- **I-039 → closed 2026-10-13** on its closeWhen. A shape shipped, and the fresh 320x568 walk on Perez saw the hatch and read no contradiction between the blank and hatched parts (`docs/walks/2026-10-13-i039.md`).
- **I-040 minted** (open, P3, nextEvaluation 2026-10-20, readCommand `check-entry-folds … --width 320 --height 568`). This is the disposition of Turchin's T1 note the review asked for.
  - **Minted, not left as is**, because the confusion sits in a different surface: the Paired data section (~5 screens down) lists the 1820–1910 points before the page explains, ~1.6 screens later, that they are not the record the verdict counts.
  - The fix belongs there, as a one-clause pointer or by moving "Why two labels" up.
  - The hatch key words and the verdict box stay unreworded (rulings be60d137, 19f933a2).
  - The aria label's "missing from this record" stays as well. It is literally true of the judged record (Codex r1 REPRODUCED, review 19f933a2), and I-040 records the walker's point that "missing" is stronger than "excluded" on Turchin.

**Hygiene draft:** 0 lines — 0 accepted · 0 amended · 0 rejected (`tmp/hygiene-draft-sinusoidal-cycles-2026-10-13.md`, inputs none).
- READ-MUTATED: "none — 0 reads guarded (no `--run` executed; no due rows)".
- check-wait-justification: "RESULT: PASS — 31 of 45 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)".
- check-engineering-zero: "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable (exit 0)". No lockfile changed.
- I-040 was minted after the helper ran, and it carries no wait.

**Due-gate verification:** `check-due-gates-dispositioned` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", "snapshot CURRENT: taken today (2026-10-13)" (46 swept, 0 due).

**Receipt:** P3's receipt (8afb9df6) still holds. Its `[next:]` names I-039 for the Turchin note, and that is now I-040, which is a ledger detail, not a changed bracket. Nothing new.

**David's board:** nothing new, no needs-decision.

**Today panel:** written with `--date 2026-10-13`, per the orchestrator's note (56a4ac85). The live brief was dated 10-13 → merge (`reset: false`, 7 lanes preserved).

**Primer:** `docs/cold-starts/2026-10-13.md`, banner rewritten in place for round 2. First action: `check-entry-folds` at 320x568.

**Pending reads:**
- 2026-10-20: I-027, I-034, I-040.
- 2026-11-01: I-037.
- 2026-11-04: W-005, I-032.
- 2026-12-01: I-025 (David).

**UNRESOLVED:** none.

codexCalls: 0 (this phase; the round's one review run is counted on P3 8afb9df6) — probed-declined

[standing-rules-hash: 88cc2dc9]
