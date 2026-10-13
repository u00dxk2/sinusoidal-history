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

---

[P1 — Evidence and choice]

## Overnight session (round 3) — P1 selection packet

**Outcome:** a reader scrolling a cycle page whose verdict counts a different cut of the paired series sees, right where that series is described, which cut the figure and the verdict use, with a jump to the reason. On Turchin, the pre-1913 points stop reading as a contradiction of the hatch. Item **I-040** (open, P3, nextEvaluation 2026-10-20; minted at the round-2 close as the disposition of Turchin's T1 note, review 19f933a2).

**The user problem, in a reader's words (synthetic, N=1, `docs/walks/2026-10-13-i039.md`, Turchin at 320, scrolled):** "a reader who reaches the Paired-data section before the 'Why two labels' paragraph will see a contradiction for about one screen. 'Missing' is also a stronger word than 'excluded' for years that have five data points."

**Why this beats the next two candidates:**
- **I-034** (local full suite fails under fleet load) and **I-027** (npm audit, dev-only tooling) are both invisible to readers.
- **"Perez's first screen never names its record's start year"** (round-2 walk, not minted) is user-visible but sits on the 320 first screen, where Perez has 5px spare. A new line there is exactly what that budget cannot take, so it needs a design pass, not a round.
- I-040 is a real reader confusion found tonight. Its fix sits far below every fold, and it fits a round.

### Evidence

- **OBSERVED (synthetic, N=1):** the round-2 walk's T1 above. The pre-1913 sentence is at ~y 3014 at 320, and "Why two labels" at ~y 3908, about 1.6 screens later.
- **OBSERVED, mechanism at source:**
  - The Paired data section prints `series.short_description` (`src/data/series.json:38`, Turchin: "The modern Saez–Zucman series begins 1913; pre-1913 points (1820, 1850, 1880, 1900, 1910) are spliced …").
  - It also prints `series.source` (`:39`).
  - It says nothing about the judged cut. The reason, `tested.whyTwoLabels`, renders only inside the Spectral verdict section (`page.tsx:610-617`, `id="why-two-labels"`).
  - The one pointer to it sits in the header's "Judged on: 1913 onward · why? ↓" row (`page.tsx:389-402`), ~1,500px above the section.
- **OBSERVED, scope** (`src/lib/testedSeries.ts:33,43`): two pages carry a judged cut that differs from the Paired data label.
  - **Turchin:** 1913 onward vs the whole series from 1820.
  - **Kondratiev:** annual vs the 5-year rolling average.
  - The other 7 hatched pages have no `tested` note, and fathers-and-sons none.
- **HYPOTHESIS:** one pointer line in the Paired data section on those two pages closes the gap where the doubt starts, which is the pattern I-030 used for the header row. The line names the cut the figure and the verdict use, and links `#why-two-labels`.
  - `series.short_description` is shared with the home chart and `/methods`, so the fix does not touch it.
  - The key words and the verdict box stay as they are (rulings be60d137, 19f933a2).
- **MISSING:** any real reader on any /cycles page (no client analytics by standing choice, `docs/evangelism-bar.md:30`).

### Section 0 (deltas, read this round)

- CI: `check-ci-status --workflow ci.yml` GREEN on `cf99b8a565`.
- Drift: `check-deployed-sha-drift` reads **UNPROVABLE** (not RED). Live is `68184756`; head `cf99b8a5` adds 4 doc-shaped files only. The live build contains every code commit (`26eceef` is an ancestor of `6818475`), so no reader-facing drift exists. Not a stop.
- Due gates: today's snapshot is CURRENT (0 due, 46 swept; round-2 close).
- Listener 🟢. `/loop-tick` armed by tool call. Codex GREEN per the probe line. Board: none.

### Permission

I-040 is this lane's own open row: not parked, no card. It is reader-facing copy on cycle pages, inside the lane's authority (the same class as I-030's "Judged on" row). Untouched: the verdict box, the hatch key words, `series.json` descriptions, `public/data/spectral/`, HashLink.tsx internals (only used, as lint requires for in-page jumps), and the /state bands.

### Next action

Kind: **improve.** In the Paired data section (`page.tsx`, after the series description paragraph), when `tested` exists, render one line. The words, written now:

> The figure at the top and the verdict use {tested.name}, not every point described here. Why two labels ↓

- `Why two labels ↓` is a `<HashLink href="#why-two-labels">`, with a 44px tap box via vertical padding, the same as the header row (I-015/I-030).
- Turchin: "… use US top 1% wealth share (1913 onward), not every point described here."
- Kondratiev: "… use US TFP growth (annual, unsmoothed), not every point described here."
- **A test** pins the line, its link target and its absence on the other 8 paired pages. The oracle is the `testedSeriesNote` name, not the drawing code.

First command (the before-snapshot of the two affected pages and one unaffected control):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles/turchin C:/Users/david/AppData/Local/Temp/claude/C--dev-skylark-sinusoidal-cycles/b2bd006d-e232-4be4-99f1-a0bdfde5498d/scratchpad/r3-before-turchin.txt
```

### Acceptance condition (observable)

- **Delivery:**
  - Live, the line appears in the Paired data section on Turchin and Kondratiev and nowhere else.
  - Its link lands on "Why two labels" (scroll position read after the tap at 320x568).
  - The visible-text multiset is +the new line(s) only on those 2 pages and 0 differences on the other 8 cycle pages.
  - `check-entry-folds` 13/13 at 320x568, Perez 5px (the section is far below every fold).
  - The no-test-ran guard is clean (it reads every page).
  - `check-embed-snippets` 42/42.
  - **One red arm:** remove the block, and the new pin goes RED on the 2 pages. Restore it, GREEN.
- **Outcome (pre-registered, written before any look):** a fresh walker scrolls /cycles/turchin at 320x568 from the top to the end of the Paired data section, then answers:
  - **Q1:** "Does anything here contradict the shaded 1600–1913 span at the top of the page?"
  - **Q2:** "Which data does the verdict count, and how do you know?"
  - It **PASSES only if** Q1 reports no contradiction, or one the walker says the page resolved where they read it, without scrolling past the section; and Q2 names the 1913-onward yearly record.
- **If it fails:** no rewording tonight. Record it on I-040 for the close.

### Delivery and encounter checks

- **Delivery:** CI green → deploy row live = head → the multiset, link-landing, folds and embed reads on production.
- **Encounter:** blind. No reader-arrival instrument exists by standing choice, and no instrument row exists. The synthetic walk is the read.

### USER-FACING: yes

Paths:
- `src/app/(app)/cycles/[id]/page.tsx`: Paired data section, one conditional line.
- A test file: `src/lib/seriesOverlay.test.ts` or `src/lib/testedSeries.test.ts`, whichever already renders every cycle page.

No prose mirror describes cycle-page sections (the mirrors are /about, /methods and /colophon only).

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none**. Read: today's `--snapshot` (0 due, 46 swept).
- (b) Owed child rows (skylark-site ledger): **none**. Read: round-1 kickoff `rows owed to you` (0 of 749); no state block on this prompt.
- (c) State reads marked CROSSED: **none**. No kickoff state block on this prompt.

codexCalls: 0 (P1) — probed-declined

---

[P3 — Product-work loop]

## Overnight session (round 3) — P3 product-work loop

### Action: improve (I-040), as the manager review d48212c3 REDIRECTED it

I built the review's cut instead of my packet's pointer line, which would have been a third pointer to one paragraph. The review was also right on the facts: my generic line ("not every point described here") was false on Kondratiev, which differs by smoothing, not by points.

- On the 2 pages with a `tested` note, `tested.whyTwoLabels` and its `id="why-two-labels"` now render in the Paired data section right after the series description, and no longer in the Spectral verdict section.
- Turchin's paragraph gains one clause, the review's suggestion: "They are left out of that yearly record, which is why the figure at the top hatches 1820 to 1910 along with every other year before 1913."
- **The review's HYPOTHESIS, checked:** the opening words "the 'Paired data' line and section on this page" still read true inside that section (Codex r1: "self-referential, but not inaccurate"). They are pinned by existing tests, so I left them. The walker found the sentence abstract (frank note), and I carry that, not fix it.

### 1. Implementation

- **`534ad31`:**
  - `src/app/(app)/cycles/[id]/page.tsx`: the block moved, with a comment.
  - `src/lib/testedSeries.ts`: the Turchin clause.
  - `src/lib/testedSeries.test.ts`: a placement pin per page (Paired data heading < description < reason < Spectral verdict, with nothing but `</p>` between description and reason) and a Turchin sentence pin.
- **Gates (local, targeted):**
  - `vitest run src/lib/testedSeries.test.ts src/lib/seriesOverlay.test.ts`: 83/83.
  - eslint exit 0 on the three files.
  - `npm run typecheck` exit 0.
  - CI: `check-ci-status --workflow ci.yml --sha 534ad316… --wait`, GREEN.
- **Red arm:** HEAD's `page.tsx` (paragraph back in the verdict section) gives "67 tests | 2 failed", × kondratiev and × turchin "the reason paragraph sits in Paired data, after the description". Restored: "67 passed (67)", and `git status` shows only the intended files.
- **Codex r1 at `534ad31`** (foreground pipe, `--sandbox read-only`, banner workdir `C:\dev\skylark\sinusoidal-cycles` checked): "No actionable findings."
  - **All 8 sentences of the two paragraphs HOLD.** The new Turchin sentence is **REPRODUCED** against the rendered hatch (`data-from="1600"`, `data-to="1913"`).
  - **REPRODUCED:** one anchor per page, and the header link targets it.
  - **REPRODUCED:** the other 8 cycle pages are byte-identical.
  - **REPRODUCED:** the placement pins fail when the paragraph is removed, returned to the verdict section, or the page is empty. No vacuous pass.
  - **REPRODUCED:** TEST_RAN passes on all 10 pages.
- **Sibling sweep:** no other surface renders `whyTwoLabels`. Grep for `whyTwoLabels|why-two-labels|Why two labels` outside docs: only `page.tsx`, `testedSeries.ts` and its test.

### 2. Delivery

- `check-deployed-sha-drift --service sinusoidal-history`: in-sync, live `534ad316` = head.
- **Why-link landing on production at 320x568** (Playwright tap, scratchpad script):
  - Turchin: "anchors 1 · paragraph in section 'Paired data series' at page y 3192 · after tap scrollY 3168, paragraph top 24px in viewport (VISIBLE)".
  - Kondratiev: "anchors 1 · … 'Paired data series' at page y 2961 · after tap scrollY 2937, paragraph top 24px (VISIBLE)".
- **Visible-text multiset, all 10 cycle pages, before vs after:**
  - Kondratiev: 0 differences (the paragraph moved, words unchanged).
  - Turchin: 2, the old and new "Why two labels" paragraph, which is the added clause.
  - The other 8 pages: 0.
- `check-entry-folds … --width 320 --height 568`: **13 of 13 OK**, Perez 5px.
- `check-embed-snippets`: **42/42 PASS**.

### 3. Encounter

**Blind for real readers.** There is no reader-arrival instrument, by standing choice (`docs/evangelism-bar.md:30`), and no instrument row exists.

### 4. Outcome (synthetic, N=1): HELD on both pages

Walk notes: `docs/walks/2026-10-13-i040.md` (fresh walker, 320x568, 08:11Z).

- **Turchin Q1:** the apparent contradiction at y3014 "is resolved immediately below, at y3194 … The gap between the question and the answer was one paragraph, both on the same screen." Before the move, the answer was ~1.6 screens later, past the section.
- **Turchin Q2:** "the yearly US top 1% wealth share record from 1913 onward"; four on-page lines agree.
- **Kondratiev Q2:** "annual, unsmoothed US TFP growth … not the 5-year rolling average"; answered "directly below" the doubt.
- **Link:** lands on the paragraph.

<!-- findings:begin -->
- **Turchin's "Why two labels" paragraph** is ~17 lines at 320, and its opening sentence is abstract (the walker re-read it). Kondratiev's uses "background-noise model", which is jargon. Neither blocked the pass. Both are copy-length notes for the close, not patched tonight.
<!-- findings:end -->

### Receipt

USER-VISIBLE: on the Turchin and Kondratiev cycle pages, the reason the page carries two labels for its data now sits right under the paired-series description that raises the question (and Turchin's says why its five pre-1913 points are shaded), instead of ~1.6 phone screens further down — 534ad31 [proof: live #why-two-labels moved into "Paired data series" on both pages (page y 3192 Turchin, 2961 Kondratiev; header link tap lands with the paragraph 24px from the top at 320x568); visible-text multiset: Turchin only the reason paragraph changed, Kondratiev 0, other 8 pages 0; check-deployed-sha-drift in-sync live 534ad316 = head; check-entry-folds 13/13] [coverage: none — no client analytics by standing choice (docs/evangelism-bar.md:30), Search Console sees impressions not page views · last good read n/a · founder+test excluded no] [exposure: blind — the site has no reader-arrival instrument by standing choice; no instrument row exists, none minted · bug row none] [outcome: held — fresh scroll walk at 320x568, docs/walks/2026-10-13-i040.md, Turchin Q1+Q2 and Kondratiev Q2 pass (synthetic N=1)] [next: no new decision — paragraph length carried to the close]

### What remains

- **For P5:**
  - I-040 linkedCommits + `534ad31`.
  - closeWhen ("A change to the Turchin Paired data section ships and a fresh reader scrolling /cycles/turchin at 320x568 does not report a contradiction …") is met on its "resolved where they read it" form.
  - The paragraph-length note is the close's to disposition.
- **Walk notes:** `docs/walks/2026-10-13-i040.md`, committed with this report.

codexCalls: 1
adversarialReviews: 1 — EXECUTED
hygiene helper: DISPATCHED 2026-10-13 ~01:50 MT · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-13.md PRESENT (0 drafts; wait-justification PASS; engineering-zero PASS 0 findings)

[standing-rules-hash: 88cc2dc9]

---

[P5 — Delta-only close]

## Close (overnight session round 3, 2026-10-13)

ACTION: COMPLETED · item I-040 · P3 f0d023e3

The manager review b289977f rated it COMPLETED and found no defects. Its own live read:
- one `#why-two-labels` per page, sitting in Paired data, with its link resolving;
- the Turchin clause true against the CSV;
- folds 13/13;
- live `ea3654cf` = head, with `534ad31` an ancestor.

**State changed since P3 (f0d023e3):** none for readers. `ea3654c` (report and walk, docs only) is pushed.

**Ledger delta** (each `continuity-edit` printed "wrote 1 change(s)"):
- **I-040:** linkedCommits + `534ad31`.
- **I-040 → closed 2026-10-13** on its closeWhen ("resolved where they read it" form), from the walk in `docs/walks/2026-10-13-i040.md`.
- **The walker's copy-length note: explicitly DECLINED, not minted.** The note covers Turchin's ~17-line paragraph with its abstract opening, and "background-noise model" on Kondratiev. The decline is recorded on I-040's close note.
  - Why: both paragraphs passed their pre-registered reads, and no reader failed on them. Shortening copy with no failed reading behind it is untested polishing.
  - What would re-open it: a later walk, or a real reader, stalling on either paragraph.
- **Not minted, carried as a primer note instead:** the review's tool note that `check-entry-folds.mjs --help` runs the live check at 390x664 instead of refusing an unknown flag. The review called it cheap and said it does not need tonight.

**Hygiene draft:** 0 lines — 0 accepted · 0 amended · 0 rejected (`tmp/hygiene-draft-sinusoidal-cycles-2026-10-13.md`, round-3 helper, inputs none).
- READ-MUTATED: "none — 0 reads guarded".
- check-wait-justification: "PASS, exit 0 … swept 46 rows (37 in scope). No findings".
- check-engineering-zero: "PASS, exit 0. This lane has 0 findings and 0 unreadable".
- No row I touched carries a wait, and no lockfile changed.

**Due-gate verification:** `check-due-gates-dispositioned` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-13; 46 swept, 0 due).

**Receipt:** P3's receipt (f0d023e3) still holds. Its `[next:]` named the copy-length note, which is now declined, a ledger detail. Nothing new.

**David's board:** nothing new, no needs-decision.

**Today panel:** `--date 2026-10-13`, live brief dated 10-13, merge (`reset: false`, 14 lanes preserved). The David line now covers all three overnight rounds.

**Primer:** `docs/cold-starts/2026-10-13.md`, banner rewritten in place.

**Pending reads:**
- 2026-10-20: I-027, I-034.
- 2026-11-01: I-037.
- 2026-11-04: W-005, I-032.
- 2026-12-01: I-025 (David).

**UNRESOLVED:** none.

codexCalls: 0 (this phase; the round's one review run is counted on P3 f0d023e3) — probed-declined

[standing-rules-hash: 88cc2dc9]

---

[P1 — Evidence and choice]

## Day round (2026-10-13) — P1 selection packet

**Outcome:** on a cycle page whose period this site *did* run against other series, the Spectral verdict section says so, right under "No test was run and no p-value exists", with the numbers and a link to the cells. The two pages stop reading as contradicting each other. **Unminted:** this becomes I-041 at P3. The source is the 10-12 cold walk, residue on I-029 (closed), and no row carries it.

**The user problem, in a reader's words (synthetic, N=1, `docs/walks/2026-10-12-w004.md:182`, /methods then /cycles/kondratiev, 1440x900):** "The Kondratiev page says 'No test was run and no p-value exists' for its own pairing, which is true. But Kondratiev's 54-year period was tested twice here (p 0.796 and 0.814), and the cycle page does not mention it … A reader who reads /methods first and a cycle page second may wonder which 'no test' means."

**Why this beats the next two candidates:**
- **Perez, "2026 sits at a low" before the page explains that its peak is a crash** (same walk, ranked #3). This is real but local. It is one sentence's order on one page, and the next paragraph resolves it.
- **"a 84-year claim" on Strauss-Howe** (same walk). It is a grammar slip, and half of it lives in `public/data/spectral/verdicts.json` `lay_text`, which is manifest-frozen. A fix this round would leave the frozen half wrong on the same page.
- **This one goes to the bar.** The bar breaks when a reader catches the site saying two things (`docs/evangelism-bar.md:24`). Here the site is honest on both pages and still reads as if it were hiding something. The fix also puts the "someone actually checked" evidence on 5 cycle pages. Today that evidence sits only 7 screens down /methods.

### Evidence

- **OBSERVED (synthetic, N=1):** the walk quote above. That walk ranked it #2 of its "up to three more" (`:195`).
- **OBSERVED, data (frozen, read today):** `verdicts.json` `cross_grid` has 19 cells, keyed by `period_source_cycle_id`.
  - Schlesinger Jr. (30y): 7 cells, lowest p 0.094.
  - Fathers and sons (50y): 5.
  - Kondratiev (54y): 2, p 0.796 and 0.814.
  - Perez (55y): 2.
  - Huntington (60y): 2.
  - Dalio (75y): 1, p 0.149.
  - Khaldun, Strauss-Howe, Modelski and Turchin (84-150y) have none.
  - Every cell's state is NO_SIGNIFICANT_TARGET_POWER, and none is Holm-significant.
- **OBSERVED, mechanism at source:**
  - The Spectral verdict section (`src/app/(app)/cycles/[id]/page.tsx:605-629`) prints the frozen `lay_text` and the "declined, not failed" note.
  - Nothing on a cycle page reads `spectralCrossGrid` (`src/lib/spectral.ts:58`). Its only reader is /methods.
  - Fathers-and-sons has no primary verdict, so it has no such section. Its 5 cells are out of scope for this round, and the build says so.
- **OBSERVED, constraint:** the no-test-ran guard `TEST_RAN` (`src/lib/testedSeries.test.ts:34-35`) reads every ineligible page.
  - The new sentence must not say the cycle's own pairing was tested. It must also stay outside the guard's shapes ("was tested", "tested on", "test was run on" …), and it must be true.
  - That makes it a claims question, so a Codex claims pass is owed (rule 6).
- **HYPOTHESIS:** one derived line per page resolves the cross-page doubt where it starts. A draft of that line, to be checked against the guard and by Codex: "This site also set the {N}-year period against {k} other record(s) long enough for the 3.0-period rule. Those re-pairings are not this theory's claim, and none came near p < 0.05 (lowest p {x}). The {19} re-pairings, cell by cell →".
- **MISSING:** any real reader on any page (no client analytics by standing choice, `docs/evangelism-bar.md:30`).

### Section 0

- **Primer:** `docs/cold-starts/2026-10-13.md`, read.
- **Listener:** 🟢 SSE alive (restart 16:53:07Z, hello + replay-complete), `/loop-tick 2m` armed by a `ScheduleWakeup` call, waker ladder ranks 1-3 running.
- **Codex:** GREEN per the probe line on this prompt (machine-level, 16:27Z).
- **CI:** `check-ci-status --workflow ci.yml` GREEN on `7758e2503d`.
- **Drift:** `check-deployed-sha-drift --service sinusoidal-history` in-sync, live `7758e250` = head.
- **Due gates:** `--snapshot`, "0 gate(s) due on/before 2026-10-13" (46 swept; identical re-snapshot, nothing dropped).
- **Board:** `answered-cards`, none.
- **Rotation:** `check-cycle-rotation`, exit 0, "no product-love cycle picks this lane today".
- **Harness:** running 2.1.296 · fleet UNIFORM (27/27) · installed 2.1.296 (SAME).
- **North Star:** retention and word-of-mouth. The bar reads UNMEASURED, so this ship is reported unmeasured.
- **Recs yesterday:** one, the I-040 copy-length note. Disposition: dropping. It was declined at the round-3 close, and the primer banner says re-open only on a reader stall.
- **Prior-retro recurrence bearing on the choice:** "a check written from a measurement inherits its looseness". The guard pin for this line takes its oracle from `verdicts.json` `cross_grid`, never from the page's own rendering code.

### Permission

This is new reader-facing copy on cycle pages, derived from frozen data, so it sits inside the lane's own authority (the same class as I-030 and I-040).

Untouched:
- `public/data/spectral/` (read only);
- the verdict box wording and `lay_text`;
- the hatch key words;
- the /state bands;
- `HashLink.tsx` internals.

No card, and no David decision.

### Next action

Kind: **improve.**

1. A pure helper `crossGridForCycle(cycleId)` in `src/lib/spectral.ts` returns the cells whose `period_source_cycle_id` matches.
2. The Spectral verdict section renders one paragraph after the "declined, not failed" note when the helper returns any cells. It names the period, the count, the lowest p, the series, and "not this theory's claim", and it links the /methods cells (an id on the 19-cell `<details>`, or `#spectral-testing`).
3. A test pins the line on the 5 pages with cells and its absence on the 4 without. Its oracle is `verdicts.json`. The TEST_RAN guard stays green on every page, unchanged and with no allowlist entry.

First command (the before-snapshot of one affected page):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles/kondratiev C:/Users/david/AppData/Local/Temp/claude/C--dev-skylark-sinusoidal-cycles/eb0afed0-eb14-4274-b2f3-3470972d3d10/scratchpad/before-kondratiev.txt
```

### Acceptance condition (observable)

- **Delivery:**
  - Live, the line appears in the Spectral verdict section on Schlesinger Jr., Kondratiev, Perez, Huntington and Dalio, with numbers that match `verdicts.json`. It does not appear on Khaldun, Strauss-Howe, Modelski or Turchin.
  - The visible-text multiset changes by the new line only, on those 5 pages, and by 0 on the other 5.
  - The link lands on the 19 cells on /methods.
  - The TEST_RAN guard passes on every page with no new allowlist entry.
  - `check-entry-folds` 13/13 at 320x568 (the section is far below every fold).
  - `check-embed-snippets` 42/42.
  - **One red arm:** remove the paragraph, and the new pin goes RED on the 5 pages. Restore it, and it goes GREEN.
- **Outcome (pre-registered, written before any look):** a fresh walker reads /methods' cross-grid paragraph at 1440x900, then /cycles/kondratiev's Spectral verdict section, and answers: "Did this site test Kondratiev's 54-year idea? What does 'No test was run' on the Kondratiev page refer to?"
  - **PASSES only if** the walker answers from the Kondratiev page itself. The answer has to say the theory's own pairing (US TFP growth) was not tested because its record is too short, and that the 54-year period was run against 2 other records, neither near significance. It also has to report no contradiction between the two pages.
  - **If it fails:** no rewording this round. Record the failure on I-041 for the close.

### Delivery and encounter checks

- **Delivery:** CI green → deploy row live = head → the multiset, link, folds and embed reads on production.
- **Encounter:** blind. No reader-arrival instrument exists, by standing choice, and no instrument row exists. The synthetic walk is the read.

### USER-FACING: yes

Paths:
- `src/app/(app)/cycles/[id]/page.tsx`: Spectral verdict section, one conditional paragraph.
- `src/lib/spectral.ts`: the helper.
- `src/app/(app)/methods/page.tsx`: an `id` on the cross-grid `<details>`, only if `#spectral-testing` does not land on the cells. That is an anchor, with no visible text, so the `public/methods.md` mirror is unaffected.
- A test: `src/lib/testedSeries.test.ts` or a new `src/lib/crossGridLine.test.ts`.

### HYGIENE INPUTS

- **(a) Due rows not bearing on the choice:** none. Read: `check-due-gates-dispositioned --snapshot` (0 due, 46 swept).
- **(b) Owed child rows (skylark-site ledger):** none. Read: kickoff "rows owed to you" (0 of 749).
- **(c) State reads marked CROSSED:** none. Read: the kickoff state block (dated gates 0, rows owed 0, cards 0, stale-actionable 0 of 6, queued 0, CI GREEN, report PRESENT).
  - Two lines are not CROSSED but are noted: missingLinkedCommits reads NOTHING SWEPT (0 of 0), and key-metrics has "no list yet".

codexCalls: 0 (P1) — probed-declined

---

[P3 — Product-work loop]

## Day round (2026-10-13): P3 product-work loop

### Action: improve (I-041), as the manager review d854b486 REDIRECTED it

I built the review's cut, both directions on all 9 verdict pages, not my packet's 5 period-only pages. The review's HYPOTHESIS checked out: the record direction reaches every page my cut left silent. Strauss-Howe has 6 record cells, Khaldun 5, Modelski 2 and Turchin 1, and Perez, Huntington and Dalio have cells in both directions. Kondratiev and Schlesinger have the period direction only.

### 1. Implementation

- **`5515178`**: `src/lib/crossGridLine.ts` (derives the sentence from the frozen `verdicts.json`), the paragraph in the Spectral verdict section of `src/app/(app)/cycles/[id]/page.tsx`, `id="cross-grid"` on the /methods cells (`CrossGridList.tsx`), and `src/lib/crossGridLine.test.ts`.
- **`7b57938`**: test hardened after Codex r1. Each page's whole sentence is pinned as a literal oracle, with one paragraph per page, placed after `lay_text` and before the figure.
- **`a437d56`**: revision after two walks (see 4).
  - The scope comes first: "This pairing has no p-value. Separately, … so none of its re-pairings is this theory's own claim."
  - /methods' plain wording replaces "re-pairs parts of this theory with other pages".
  - Lowest **lead** (AR(1)) p, so the number matches the first p on the /methods row.
  - The link reads "All 19 re-pairings".
  - `src/components/OpenOnHash.tsx` opens the box on arrival.
- **`de1fdb6`**: Codex r2 follow-ups. "No p-value" and "none is this theory's own claim" are now checked on the data, not as text. The oracle provenance comment and OpenOnHash's coverage comment are corrected.
- **Gates:**
  - `verify-with-receipt -- npx vitest run` (crossGridLine, testedSeries, methodsCrossGrid): 87/87, `[verify] TRUE exit 0`.
  - eslint exit 0 on touched files, and `npm run typecheck` exit 0, at each commit.
  - CI GREEN on `de1fdb63` (`check-ci-status --workflow ci.yml --sha … --wait`).
- **TEST_RAN guard:** green on every ineligible page, no allowlist entry.
- **Red arms:**
  - Paragraph switched off → "12 tests | 9 failed", all 9 pages "paragraph present: expected null not to be null". Restored → 12/12.
  - Swapped minima (Codex r1's counterexample) → 3 failed (perez, huntington, dalio). Restored → 12/12.
  - A planted primary carrying a p, and a planted cell equal to a primary pairing (54y × us_tfp_growth_annual) → 2 failed. Restored → 14/14.
- **Codex r1** on `5515178` (foreground pipe, read-only, banner workdir `C:\dev\skylark\sinusoidal-cycles`): all 9 sentences HOLD [REPRODUCED]. Two medium test-coverage gaps (swapped minima; reversed conclusion) were CONFIRMED and fixed in `7b57938`.
- **Codex r2** on `a437d56` (same recipe, workdir checked): every new sentence HOLDS on all 9 pages, each minimum is the lead p on its /methods row, and source reading shows the cross-page arrival opens the box [REPRODUCED]. Dispositions:
  - Same-page router push to the hash does not open: CONFIRMED and unreachable (no link does it). Documented in `de1fdb6`.
  - Data-level checks for the opening claims: CONFIRMED, added in `de1fdb6`.
  - Stale oracle comment: CONFIRMED, fixed in `de1fdb6`.
  - No browser test of OpenOnHash: covered by the live read below and declared as a ceiling.
- **Sibling sweep:** `crossGridSentence` has one consumer (the cycle page). No prose mirror describes cycle-page sections. `/methods`' server-rendered text is unchanged (only an `id` and a null-rendering client component).

### 2. Delivery

- `check-deployed-sha-drift --service sinusoidal-history`: **in-sync, live de1fdb63 = head**.
- **Visible-text multiset, live, all 10 cycle pages, against snapshots taken before any I-041 build was served:**
  - each of the 9 verdict pages: **+2 lines** (the paragraph and its link), **−0**;
  - turchin-fathers-sons: +0 −0.
- **Link, live, 320x568, touch tap** (Kondratiev, Strauss-Howe, Turchin): tap box 47px, lands on `/methods#cross-grid`, `DETAILS top 16px … open=true · VISIBLE`.
- **Open-guard, live hard loads:**
  - `/methods` open=false, 0 rows;
  - `/methods#cross-grid` open=true, 19 rows;
  - `/methods#spectral-testing` open=false.
- `check-entry-folds … --width 320 --height 568`: **13 of 13 OK**, Perez 5px.
- `check-embed-snippets`: **42/42 PASS**.

### 3. Encounter

**Blind.** The site has no reader-arrival instrument, by standing choice (`docs/evangelism-bar.md:30`). No instrument row exists, and none was minted.

### 4. Outcome (synthetic, N=1 per walk): HELD

Walk notes: `docs/walks/2026-10-13-i041.md`.

- **Walk A** (round-1 text, /methods then /cycles/kondratiev, 1440x900): **PASS.**
  - It explained the verdict from the Kondratiev page: "No test was run' means exactly that: no test of the 54-year period against the TFP record". The 54-year period "ran against two unrelated long records … p around 0.8".
  - Contradiction: "No, not in substance … every number matches."
- **Walk B** (round-1 text, /cycles/strauss-howe, 320x568): **PASS** on Q1, and "not strictly" a contradiction on Q2.
- **Both walkers tripped on the same four spots.** I made one revision round (`a437d56`, see 1) and stopped there.
- **Walk C** (revised text, /cycles/strauss-howe, 320x568, fresh walker): **PASS.**
  - "There's no contradiction". The brief doubt "resolved within the same paragraph. 'Separately' does the real work here."
  - The link "lands with every row already open", and the quoted 0.094 is on the landing screen with no scrolling.

<!-- findings:begin -->
- **The packet's bar citation was loose** (the review's note, OBSERVED): `evangelism-bar.md:24` is about overclaims, not "saying two things". The walk carried the choice.
- **Residue for the close, not patched** (stop on the second round):
  - Walk C would name the run the lowest p comes from ("lowest p 0.094, Schlesinger's 30 years").
  - The /methods landing screen opens on AR(1)/AR(2)/Holm jargon.
  - "a 84-year claim" (y 512 in the "Does it hold up?" box, `page.tsx:284`; and y 3532 in frozen `lay_text`). The first is fixable. The second needs a spectral re-freeze.
<!-- findings:end -->

### Receipt

USER-VISIBLE: on all 9 cycle pages with a spectral verdict, the Spectral verdict section now says what this site's cross-grid panel did with that theory's period and its record (counts, lowest lead p, "none of its re-pairings is this theory's own claim"), and its link opens the 19 cells on /methods — a437d56 [proof: live visible-text multiset vs pre-ship snapshots +2 lines (paragraph + link) on each of 9 pages, −0 everywhere, fathers-and-sons 0; 320x568 tap lands on /methods#cross-grid with the box open=true and 19 rows; check-deployed-sha-drift in-sync live de1fdb63 = head (5515178 and a437d56 in it); folds 13/13; embeds 42/42] [coverage: none — no client analytics by standing choice (docs/evangelism-bar.md:30), Search Console sees impressions not page views · last good read n/a · founder+test excluded no] [exposure: blind — the site has no reader-arrival instrument by standing choice; no instrument row exists, none minted · bug row none] [outcome: held — three fresh cold walks, docs/walks/2026-10-13-i041.md (synthetic N=1 each): Kondratiev reader explained "No test was run" from the page, no contradiction with /methods; Strauss-Howe re-walk after the revision: no contradiction, doubt resolved in the same paragraph, quoted p on the landing screen] [next: no new decision — lowest-p attribution, /methods landing jargon and "a 84-year" carried to the close]

### What remains

- **For the close:**
  - I-041's closeWhen is met on its walk form. linkedCommits are written (`5515178`, `7b57938`, `a437d56`, `de1fdb6`).
  - The residue above needs a disposition. The "a 84-year" in `page.tsx:284` is a lane-fixable sibling of the frozen one.

codexCalls: 2
adversarialReviews: 2 — EXECUTED (r1 on 5515178, r2 on a437d56)
hygiene helper: DISPATCHED 2026-10-13 ~11:25 MT · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-13.md PRESENT (0 drafts; wait-justification PASS 31 of 47; engineering-zero PASS 0 findings)

[standing-rules-hash: 88cc2dc9]

---

[P5 — Delta-only close]

ACTION: COMPLETED · item I-041 · P3 f855b820

## Close (day round, 2026-10-13)

The manager review 091238b5 rated it COMPLETED against the REDIRECT's acceptance condition (d854b486).

**State changed since P3 (f855b820):** one more reader-facing fix, `f9bb358`, made in the close as the review allowed.
- **Before:**
  - /cycles/strauss-howe said "a 84-year claim" in the "Does it hold up?" box (page.tsx:287), and the figure aria-label said "a 84-year sinusoid" (page.tsx:959).
  - The /state reason line said "of a 84-year cycle" (stateOfCycles.ts; the API and CSV carry it too).
  - Modelski's meta description said "An 110-year sinusoid". The old helper in cycleRoutes.ts took "an" for any number starting 11 or 18.
- **After:** one helper, `src/lib/article.ts`, reads only the leading spoken group.
- **Gates:**
  - `verify-with-receipt` at f9bb358 TRUE, 150/150 in 7 suites.
  - eslint exit 0; typecheck exit 0.
  - CI GREEN (`check-ci-status --sha f9bb3586… --wait`).
- **Red arm:** helper forced to "a" → 11 failed. Restored → 150/150.
- **Live:**
  - `check-deployed-sha-drift`: in-sync, live f9bb3586 = head.
  - /cycles/strauss-howe HTML: "an 84-year" ×4. The only "a 84-year" left is the frozen lay_text sentence "a 84-year claim. No test was run …" (×2, HTML plus RSC payload).
  - Modelski meta: "A 110-year sinusoid".
  - The /state line is covered by the test, not read live.
- **Review:** BY-INSPECTION (article choice only). Every cycle period and 14 boundary numbers are pinned, and the red arm failed on each "an" case.

**Ledger delta** (every write via `continuity-edit`, each printing "wrote 1 change(s)"):
- **I-041:** linkedCommits `5515178`, `7b57938`, `a437d56`, `de1fdb6`, `f9bb358`. Then **closed 2026-10-13** on its closeWhen (the walk form), with the receipt note.
  - Encounter: blind by standing choice, so no read is pending.
- **I-042 minted** (open, P4, nextEvaluation 2026-12-01): the frozen lay_text "a 84-year". Its waitJustification is `unWaitOn` the next spectral re-freeze, with the owner set to this lane.
- **I-043 minted** (open, P4, nextEvaluation 2026-10-20): the /methods cross-grid lead opens with AR(1)/Holm jargon where a cycle-page link lands.

**Residue dispositions** (review 091238b5, each owned):
1. The lane-fixable "a 84-year" pair, page.tsx:287 and :959: **FIXED** in f9bb358. The sweep found two more siblings, the /state line and Modelski's "An 110-year", both fixed in the same commit.
2. The frozen lay_text instance: **I-042**, waiting for the next re-freeze.
3. Naming which run the lowest p comes from: **DROPPED**. Walk C called it "harmless", the doubt resolved in-paragraph, and the run is one tap away on the open list. The /methods landing jargon: **I-043**.

**Hygiene draft** (`tmp/hygiene-draft-sinusoidal-cycles-2026-10-13.md`): 0 lines — 0 accepted · 0 amended · 0 rejected (inputs none).
- READ-MUTATED: "none — 0 reads guarded (no --run executed)".
- check-wait-justification: "RESULT: PASS — 31 of 47 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)". Re-run after I-042's wait was written: "RESULT: PASS — 32 of 49 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)".
- check-engineering-zero: "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable". No lockfile changed.

**Due-gate verification:** `check-due-gates-dispositioned` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned". The snapshot is CURRENT (taken 2026-10-13, 0 due).

**Receipt:** P3's receipt (f855b820) still holds, and its brackets have not changed. f9bb358 rides beside it:

USER-VISIBLE: on /cycles/strauss-howe the verdict box and the figure's screen-reader label now say "an 84-year", the /state reason line says "of an 84-year cycle", and Modelski's search snippet says "A 110-year sinusoid" instead of "An 110-year" — f9bb358 [proof: live Strauss-Howe HTML "an 84-year" ×4 with "a 84-year" left only in the frozen verdict sentence (I-042); Modelski meta "An 110-year" → "A 110-year"; check-deployed-sha-drift in-sync live f9bb3586 = head] [coverage: none — no client analytics by standing choice (docs/evangelism-bar.md:30), Search Console sees impressions not page views · last good read n/a · founder+test excluded no] [exposure: blind — the site has no reader-arrival instrument by standing choice; no instrument row exists, none minted · bug row none]

**David's board:** nothing new. No needs-decision.

**Primer:** `docs/cold-starts/2026-10-13.md`, banner rewritten in place.

**Pending reads:**
- 2026-10-20: I-027, I-034, I-043.
- 2026-11-01: I-037.
- 2026-11-04: W-005, I-032.
- 2026-12-01: I-025 (David), I-042.

**UNRESOLVED:** none.

codexCalls: 0 (this phase; the round's two review runs are counted on P3 f855b820) — probed-declined

[standing-rules-hash: 88cc2dc9]
