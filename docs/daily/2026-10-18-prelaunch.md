[P1 — Evidence and choice]

# 2026-10-18 (Sunday, MT) — sinusoidal-cycles, round 1

## Selection packet

**Outcome:** a first-time reader who opens the Ray Dalio card on `/`, then scrolls to "State of the cycles", meets a theory nobody has confirmed, and never a site saying "peaking now". **Item:** I-054 (P3, open, nextEvaluation 2026-10-20; the orchestrator's kickoff moved it to today).

**The user problem in the user's words** (walks C1/C2, `docs/walks/2026-10-17-i048-closed-card.md` lines 28-29): "Where the drawn curve sits in 2026: peaking", sitting right above a large gold wave with a dotted vertical line through its right-hand crest, "reads briefly as the site confirming the friend". And "State of the cycles … lists 'Ray Dalio 75y PEAKING' with no verdict beside it".

### Section 0

- Primer: `docs/cold-starts/2026-10-17.md` read (newest; no 10-18 file). Its first action ran: `check-closed-card-header` on production gave **2 of 2 CLEAN** (390x664 and 320x568: tags 0, now-lines 0, current-year labels 0, cut names 0, of 10 cards).
- Listener: 🟢 SSE alive (pid 37132, hello 14:12:31Z, replay 0) and `/loop-tick` armed by ScheduleWakeup. The waker ladder is ranks 1-3; rank 1 was relaunched after its wake-shorten fire.
- Codex: GREEN per the kickoff's `[codex-probe:]` line (14:15:35Z). Spawn caveat: pipe-backed stdio gives EPERM.
- CI: `check-ci-status --workflow ci.yml` is GREEN for 223cdc42e4 (exit 0). Drift: `check-deployed-sha-drift --service sinusoidal-history` is **in-sync**, live 223cdc42 = head (exit 0). The kickoff's UNVERIFIED tag on `--service` is wrong about this flag: the flag belongs to the fleet script, and that script accepted it.
- Harness: running 2.1.302 · fleet UNIFORM (27/27) · installed 2.1.302 (SAME).
- North Star: retention and word of mouth. This change is unmeasured by design (no client analytics, W-003). The receipt will say so.
- Recs yesterday: the 10-17 close carried one forward (I-054, "one more cycle"), and it is carrying today → P3. The vendored secret-scanner selftest timeout (retro Q6) also carries today → P3, as the small second item.

### Evidence

- OBSERVED: cold walks C1/C2 (N = 2, synthetic, Chromium, 390x664, production `2f5df2e`, 2026-10-17). Both read the opened card's position line over the crest as briefly agreeing, and the verdict line above it stopped the conclusion each time. Neither scrolled to "State of the cycles" on screen. They saw its "PEAKING" only in the page text. **Limits:** synthetic, not real users. The panel half rests on page text, not on a reader's eyes.
- OBSERVED (source read today): the opened card draws the 2026 position **three** ways, not the two the row names. They are (1) `CycleFacet.tsx:156-166`, the "Where the drawn curve sits in {year}:" line with `[data-phase-position]`; (2) `CycleFacet.tsx:184`, `markNow={mode === "expanded" || verdictLine}`, the dashed now-line on the chart; and (3) `FacetView.tsx:124`, the expanded card's own `FacetTimeAxis` with `markNow` defaulting to true, which is the "now · 2026" under the card.
- OBSERVED (source): every row of `NowSummaryPanel.tsx` is the name, the period, the phase word (`phasePositionLabel`) and, on desktop only, a gauge bar (`phaseProgressPercent`), which is also a drawn position. The rows have nothing else. The component renders on `/` (`Viz.tsx:254`) and in the "State of the cycles" embed (`EmbedView.tsx:142,150`, `interactive={false}`).
- OBSERVED (source): the OG share card (`src/app/og/route.tsx:181-245`) computes its own `phasePositionLabel` rows. It does **not** read the panel. The lead's HYPOTHESIS ("whether the panel's phase words feed those") is answered **no** by code: the OG card and the embed docs title are separate surfaces. The OG card carries the same claim and is **out of today's scope**. I propose minting it as its own row at P5, not cutting it silently. `/state/<year>` is also separate (I-013 reason line) and also out of scope.
- OBSERVED (script read): `check-holds-up-line.mjs:259-278`. Every **card** leg (10 cycles × 2 viewports = 20 legs) currently *requires* a painted `[data-phase-position]` after the verdict, in ink (`phaseOk`, `phaseAfter`). Cutting the opened card's position line turns those 20 legs RED as written. **Denominator change stated now:** the leg count stays the same, and the card-leg rule inverts to "no `[data-phase-position]` inside the opened card". The embed legs (20) are unchanged, because the single-cycle embed keeps its header tag on purpose.
- OBSERVED (script read): `check-embed-snippets.mjs:293` reads the panel's `li` rows in the State embed. Whether it asserts on the phase word is MISSING (not yet read). I'll read it in prep before the cut.
- MISSING: any real-user encounter (no client analytics by standing choice, W-003).

### Permission

Lane-owned P3 issue: not parked, no open card, `answered-cards` reports none. Copy and layout cuts on the lane's own surfaces fall within the lane's class, and the orchestrator's kickoff chose this item for today. **One judgement for the reviewer:** the panel's rows have no content other than the position. Dropping the phase word alone leaves a list of names. So the panel needs a decision on its shape, not just a word removed (see below).

### Next action — improve

The cut, under the rule that has held twice now: claim less, never reword.

1. **Opened card:** remove all three position marks. The "Where the drawn curve sits" line goes. `markNow` on the chart becomes `verdictLine` only. The expanded card's axis (`FacetView.tsx:124`) takes `markNow={false}`. The verdict line, legend, chart and tail stay.
2. **"State of the cycles" (home and State embed). Recommended, A:** each row's phase word and gauge bar give way to that cycle's verdict headline ("Not tested" / "Not testable on the record that exists"). The words come from the existing `holdsUpCard`, so no new wording is written. A verdict sits beside each cycle and no position is drawn. That is the same combination that held on the closed card (verdict present + position removed). **Alternative, B:** remove the panel from `/` only and leave the embed alone. That is the bigger cut, and it drops the `/state/<year>` permalink link from the home page. I recommend A because it keeps the panel's job ("a reckoning") while changing what the reckoning claims.
3. **Small second item:** `src/lib/checkStagedSecrets.test.ts` gets its own longer timeout (it ran 70.9 s against 60 s on 10-17).
4. **Substrate:** `.githooks/pre-commit` has one leg (`exec node scripts/check-staged-secrets.mjs`), so the one-pass hook shape has nothing to combine here and no change is owed.

First command (prep: the RED-before count. It is written as a committed check in P3 prep and run against production now):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-closed-card-header.mjs https://sinusoidalhistory.com
```

(That is the regression read that already ran clean today. The new count, `check-open-card-position.mjs`, which counts phase words, now-lines and current-year labels inside the opened Dalio card and the panel at 390x664 and 320x568, is written in prep and run against production before any change, for the RED arm.)

### Acceptance condition (I-054 closeWhen, plus the kickoff's pass bar)

- RED before: the new count is non-zero on production at both viewports (expected: the opened card has 1 phase word, 1 now-line and 1 current-year label; the panel has 10 phase words).
- GREEN after: the count is 0 on production at both viewports.
- A pre-registered cold walk (walk B's prompt verbatim, 390x664, production) opens the Dalio card and scrolls to "State of the cycles", and reports nothing it reads as "peaking now" or as the site agreeing before it reaches the verdict in full.
- Positive controls: check-holds-up-line 40 legs + controls with the card-leg rule inverted (denominator stated above), check-closed-card-header 2/2, check-glance-now-mark 2/2, check-embed-snippets 42/42 (or a stated change if it asserts on the panel's phase word), and check-entry-folds 320x568 13/13.
- Red-proof: put the phase word back, the count goes RED; restore it, and the tree is clean.

### Delivery and encounter checks

CI green → `check-deployed-sha-drift --service sinusoidal-history` in-sync → the new count on production → the walk. At this traffic level a real encounter is unreadable (no analytics), so the exposure line will be `blind`, naming W-003's standing choice.

**USER-FACING: yes.** The paths touched are `src/components/CycleFacet.tsx`, `src/components/FacetView.tsx`, `src/components/NowSummaryPanel.tsx` (home and State embed), `scripts/check-holds-up-line.mjs`, a new `scripts/check-open-card-position.mjs` and its test wiring, `src/lib/checkStagedSecrets.test.ts`, and possibly `scripts/check-embed-snippets.mjs`. Whether `public/llms.txt` or `public/about.md` describe the panel's phase words is to be grepped in P3.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: none. Read: `check-due-gates-dispositioned --snapshot` gave "0 gate(s) due on/before 2026-10-18" (of 60 ledger items).
- (b) Owed child rows: none. Read: the kickoff gave "0 of 754" owner-stamped rows in skylark-site's ledger.
- (c) CROSSED state reads: none. Read: in the kickoff state block, stale-actionable was 0 of 12, missingLinkedCommits was NOTHING SWEPT (0 of 0; not a clean read), and queued rows were 0.

One prior-day retro finding bears on the choice (P1): Q3, "hypothesis 2 was TRUE" (the axis kept the position alive). That is the reason the opened card's own axis (`FacetView.tsx:124`) is cut here, rather than just the line the row names.

---

## P3

[P3 — Product-work loop]

**I-054, opened card and "State of the cycles": shipped and live; the panel half HELD, the opened card NOT HELD on one bare crest.** Kind: improve. [standing-rules-hash: 88cc2dc9]

## What a reader sees differently (live 60b74b6)

- **Opened cycle card (Facets and Calibrate tabs):** no "Where the drawn curve sits in 2026: peaking" line, no dashed current-year line on the chart, no "now · 2026" on the axis under it.
- **"State of the cycles" (home + State embed):** each of the 10 rows carries its cycle's verdict ("Not testable on the record that exists" / "Not tested", the closed card's words, unchanged) where the phase word and position bar were. On a phone the verdict takes its own line under the name; from 640px it sits beside it. The row button's spoken label carries the verdict ("… does it hold up? Not testable on the record that exists. Select to focus and calibrate"), not "currently peaking". The "bar: trough · peak · trough" key is gone.

## The four states

1. **Implementation:** `e4bc02c` (the cut + `check-open-card-position` + check-holds-up-line's card legs inverted + scanner test 180s) and `60b74b6` (Codex r1 fix: the Calibrate tab's axis). Tests green: targeted vitest 41/41 via verify-with-receipt on 60b74b6; typecheck clean; **CI GREEN on 60b74b6** (check-ci-status --workflow ci.yml, exit 0, 66s).
2. **Delivery:** `check-deployed-sha-drift --service sinusoidal-history` **in-sync, live 60b74b61 = head** (observed 09:36:19 MT). Behaviour read live: `check-open-card-position https://sinusoidalhistory.com` **2 of 2 CLEAN** (cards on Facets + Calibrate: tags 0 · phase words 0 · now-lines 0 · current-year labels 0; panel: phase words 0 · in row names 0 · rows with no verdict 0 of 10, at 390x664 and 320x568). RED before on production 223cdc4: **40 per viewport** (cards tags 2 · phase 2 · now-lines 2 · year labels 4; panel 10 + 10 + 10).
   Positive controls on production: check-holds-up-line **46/46** (denominator unchanged; the 20 card legs now require NO phase word; red arm on 223cdc4 26/46, exactly those 20); check-embed-snippets **42/42** (the State embed fits its 700px frame, 10 of 10 rows; my first layout overflowed it at 816px and was changed before push); check-closed-card-header **2/2 CLEAN**; check-glance-now-mark **2/2 CLEAN**; check-entry-folds 320x568 **13/13**.
   Red-proof: "peaking" put back into the panel rows → `check-open-card-position` on the local build **MARKED, panel phase words 10, exit 1**; restored by edit, `git status` code-clean.
3. **Encounter:** blind — no client analytics on this site by standing choice; a reader who opens a card leaves no trace · bug row W-003.
4. **Outcome:** pre-registered cold walks D1/D2 (`docs/walks/2026-10-18-i054.md`, N=1 each, synthetic, production 60b74b6). **NOT HELD overall** (the bar needed both):
   - Panel: **HELD, both.** D1: "Nothing in it suggests the Dalio cycle (or any cycle) is peaking now, or confirmed." D2: "It has no curves, no phase words, no year marker, and no 'peaking' or 'confirmed'." Both quote "07 Ray Dalio 75y Not testable on the record that exists". Against C1/C2 (10-17), who found "Ray Dalio 75y PEAKING".
   - Opened card: D2 **HELD** ("the picture does not claim we are at a peak"). D1 read the verdict first and found no phase word, then: "its last crest is a tall gold peak right at the right edge, with no year axis or 'now' label on it. For a moment it looked like 'yes, it peaks about now'". No marked year, after the verdict; scored NOT HELD on the bar's strict "even briefly" clause.
   - New, both walkers, outside this change: the editor's note heading "Notice how the cycles tend to peak near the present." just above the panel read briefly as agreement before its next line corrects it.

USER-VISIBLE: the opened cycle card no longer marks where its curve sits in 2026, and "State of the cycles" lists each cycle's verdict instead of PEAKING/RISING — 60b74b6 [proof: check-open-card-position on production 40 marks per phone viewport on 223cdc4 → 0 of 10 rows without a verdict and 0 marks on 60b74b6, live in-sync 60b74b61] [coverage: none, no client analytics on this site · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader who opens a card leaves no trace · bug row W-003]

codexCalls: 2
adversarialReviews: 2 — EXECUTED (foreground `codex exec --sandbox read-only`, banner workdir C:\dev\skylark\sinusoidal-cycles both rounds). r1 on e4bc02c: 1 MED, STATIC, `Viz.tsx:408` the Calibrate tab's axis kept "now · 2026" → CONFIRMED against source, fixed in 60b74b6 (sibling sweep: all 4 FacetTimeAxis callers; the single-cycle embed keeps its mark on purpose). r2 on 60b74b6 (scoped e4bc02c..60b74b6): no defects.

hygiene helper: DISPATCHED 08:46 MT · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-18.md PRESENT (0 draft lines; check-wait-justification PASS; check-engineering-zero --project sinusoidal-cycles PASS 0/0).

Small second item, done: `checkStagedSecrets.test.ts` timeout 60s → 180s (in e4bc02c).
Substrate: `.githooks/pre-commit` is one leg (`exec node scripts/check-staged-secrets.mjs`), so the one-pass hook shape has nothing to combine here; no change owed.

## What remains (to the close)

- **I-054 stays OPEN**, narrowed: the opened card's bare drawn curve still crests near the right edge of the 1600–2050 range (~2025), and one walker read that shape alone as "peaks about now". Every phase word and marked year is gone. Next lever, by the rule that held three times (claim less): the opened card's curve stops at the record's end or the present, or the shape is accepted with a recorded decision. One more cycle, not decided here.
- **Mint at the close:** (a) the editor's note heading "Notice how the cycles tend to peak near the present." (ConvergenceNote), read as agreement by both walkers; (b) the share image (`/og`), `/state/<year>`, `/api/v1/state` still print phase labels (separate surfaces; `state-2026.csv` is a frozen edition and is not edited).
- Words for I-043 and the missing full stop for I-049 are recorded in the walk doc.
- No process left running: next start stopped by PID (port 3123 free); both walkers closed their browsers; Codex processes exited.

<!-- findings:begin -->
- The P1 packet's HYPOTHESIS that the panel's phase words might feed the share image and embed docs: answered NO by code. The OG card computes its own rows, so it stays a separate surface (to mint at the close).
- The packet named two marks on the opened card. There were three (the line, the chart's now-line, the axis label under the card), plus a fourth path the packet missed: the Calibrate tab renders the same expanded card with its own axis (Codex r1, fixed in 60b74b6).
- The packet's recommended layout ("let the verdict wrap under the name") overflowed the State embed's published 700px frame (816px at 358 wide, 844 at 680). Changed before push: under the name below 640px, beside it from 640px.
<!-- findings:end -->