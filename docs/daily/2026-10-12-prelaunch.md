# Daily — sinusoidal-cycles — 2026-10-12 (Monday, MT)

[P1 — Evidence and choice]

## Day session (round 1) — P1 selection packet

**Outcome:** a cold phone reader does not take the drawn data line on a cycle page's first screen as evidence that the cycle fits. Item **I-033** (status monitoring; its own closeWhen reopens it on this answer).

**The user problem, in a reader's words (HYPOTHESIS, synthetic walk):** "The wealth line follows the curve's U, so Turchin's cycle looks like it holds." The verdict box right below says the opposite: "Not testable on the record that exists."

### Evidence

- **OBSERVED (synthetic, N=1)**, W-004 cold walk run a day early. Source: `docs/walks/2026-10-12-w004.md`, live site, 2026-10-12 ~15:15–15:25Z, headless Chromium, no repo source read. On /cycles/turchin at 390x664, first screen: the walker answered both questions (what the line is, does it hold up). But the walker named the line itself as the worst thing on the walk. It makes one high-low-high swing that echoes the curve's U, and the "now" dot sits on top of both. The key at y 352 says "the record the verdict counts, rescaled to the curve's height". The only sentence saying that shape is not evidence ("… and is not evidence for or against the theory.") is at y 3714, 5.6 screens down. Limits: one synthetic reader, one page, and it judges reading, not love.
- **OBSERVED**, the rest of the walk: 4 PASS (Kondratiev key / judged-on 390x844; Kondratiev 900 arrows (I-031); Turchin judged-on 390 + 1440 (I-030); Perez and Turchin/Strauss-Howe "curve height" (I-036)). 3 MIXED: Turchin first screen (this item); /state/2026 "cos +0.67" with its footnote 1,431 px below and no pointer (W-003 question); the /methods cross-grid result at y 6277 is findable but buried (I-029).
- **OBSERVED**, W-004's precondition: `check-verdict-landing` on production 490/490 PASS (run 2026-10-12 ~15:13Z).
- **OBSERVED**, the primer's first action: `check-embed-snippets` on production 42/42 PASS (~15:07Z).
- **HYPOTHESIS**, why the key alone doesn't hold: "rescaled to the curve's height" says HOW the line was drawn. It does not say what the resemblance means. The source comment at `src/app/(app)/cycles/[id]/page.tsx:1016-1020` already names this risk ("a stretched series sitting on a sinusoid reads as a fit"), and the walk says the key's wording did not fully answer it.
- **MISSING:** any real reader on any /cycles page. The bar reads UNMEASURED (`docs/evangelism-bar.md`: no client analytics; the last whole GSC read was 0 clicks). No `docs/evangelism-evidence.md` exists.
- **Retro finding that bears on the choice (recurred, one line):** "a check written from a measurement inherits its looseness." I-033's delivery gates (fold check, line multiset) all passed on 10-10 and could not see this misreading. The ceiling was stated then; the walk is the only instrument that sees it.

### Section 0

- Primer: `docs/cold-starts/2026-10-12.md` read; first action run: embed 42/42.
- Listener: 🟢 posted 3a90a3f6 (SSE hello 15:00:33Z, /loop-tick armed by tool call, waker ranks 1–3 running).
- Codex: GREEN per the kickoff's `[codex-probe: …]` line (04:34Z machine-level exec + write).
- CI: `check-ci-status --workflow ci.yml` GREEN on `71ba62f` (exit 0). Drift: `check-deployed-sha-drift --service sinusoidal-history` in-sync, live `71ba62f7` = head (exit 0). Note: `--service sinusoidal-cycles` does not resolve. The Render service is named `sinusoidal-history`.
- Local suite at HEAD `71ba62f`: `verify-with-receipt -- npm test` exit 0, 32 files / 304 tests (`--allow-untracked` for this report and the walk notes, which no test reads).
- Context budget: targeted reads only.
- North Star: retention + word-of-mouth. This change serves the bar's "what breaks the moment: any sentence that overclaims". Here the overclaim is a picture, not a sentence. Reported unmeasured.
- Recs yesterday: no Recommendations block in `docs/daily/2026-10-11-prelaunch.md` (headings grep). Its "What remains" / pending reads are carried by date in the primer: 10-13 W-004 (read today, early), 10-20 I-027/I-034, 11-01 I-037, 11-04 W-005/I-032, 12-01 I-025.
- Harness: running 2.1.296 · fleet UNIFORM (26/26) · installed 2.1.296 (SAME).
- Rotation: `check-cycle-rotation --lane sinusoidal-cycles` exit 0, no product-love pass picks this lane today.
- Due gates: `--snapshot` "0 gate(s) due on/before 2026-10-12" (43 swept).
- Board: `answered-cards` "NO waiting/answered/pending-verify cards for sinusoidal-cycles".

### Permission

I-033 is this lane's own row (monitoring, not parked or frozen). There is no card on it. It is a copy and layout change on the cycle pages, within the lane's product authority. It touches nothing on the don't-touch list (`public/data/spectral/`, HashLink.tsx, /state bands, state-2026.csv, judgedOn lengths, verdict wording). The verdict box text stays as it is.

### Next action

Kind: **improve.** On every cycle page that draws a series and whose verdict is "not testable" (all nine paired pages today, 0 of 9 eligible), the first-screen key also says that the line's resemblance to the curve is not evidence. Proposed wording (HYPOTHESIS, settled at P3): append to the key "… rescaled to the curve's height. A shape that looks alike is not a test: this record is too short to run one." The clause is conditioned on `!verdict.eligible`, so an eligible pairing never prints it. First command (reproduce the current key on the Turchin first screen):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-entry-folds.mjs https://sinusoidalhistory.com --width 320 --height 568
```

(That is the tightest fold: the clause adds roughly one 12px line to the key above the verdict headline. The read tells P3 how much margin there is before the wording is chosen.)

### Acceptance condition (observable)

- Live, at 390x664 and 320x568: each of the nine paired pages shows curve, line, key including the new clause, and the verdict headline on the first screen. `check-entry-folds` 13/13 at both.
- Rendered-text line multiset per page = pre-change plus only the changed key line (Playwright `main` innerText, since the key is server-rendered here; verify which).
- fathers-and-sons (no drawn series) is unchanged.
- `check-embed-snippets` still 42/42. `check-verdict-landing` still 490/490.
- Encounter: a cold re-walk of /cycles/turchin at 390x664 is asked "does the line show the cycle holds?" and answers no from the first screen.

### Delivery and encounter checks

- Delivery: deploy row live = head (`check-deployed-sha-drift --service sinusoidal-history`) after CI green, then the fold and multiset reads above on production.
- Encounter: the site has no client analytics, so real-reader encounter is blind. The synthetic re-walk is the read, the same day after deploy. GSC (`scripts/gsc-read.mjs`) would show a /cycles click, but not whether the reader misread the line. W-005 reads click-through at ~100 impressions (11-04).

### USER-FACING: yes

Paths: `src/app/(app)/cycles/[id]/page.tsx` (the key and its aria-label), possibly `src/lib/testedSeries.ts` or a sibling lib for the wording, `src/lib/seriesOverlay.test.ts` (pins the key text). Also `public/llms.txt` / `.md` mirrors if any quote the key (to check; the about/methods/colophon mirrors are not touched).

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none**. Read: `dated gates due today` (0, 43 swept), and the `--snapshot` above.
- (b) Owed child rows (skylark-site ledger): **none**. Read: `rows owed to you` (0 of 749).
- (c) State reads marked CROSSED: **none**. Read: the kickoff's state block (stale-actionable 0 of 13; missingLinkedCommits NOTHING SWEPT 0 of 0, not crossed; queued rows 0; HEAD CI GREEN; report artifact PENDING, which is this file).
- Not hygiene, for the close: W-004 was walked today, a day before its `nextEvaluation`. Its notes (and the I-030, I-031, I-035, I-036 PASS readings, plus the /state and /methods MIXED readings) are appended at P5, not now. `docs/walks/2026-10-12-w004.md` is uncommitted until then.

codexCalls: 0 (P1) — probed-declined

---

[P3 — Product-work loop]

## Day session (round 1) — P3 product-work loop

### Action: improve (I-033), as the manager review 891c65a0 REDIRECTED it

On every cycle page whose verdict is "not testable" (9 of 9 paired pages today), the curve figure now hatches the years a test would still need, just before the record. The span runs 3 periods back from the record's last year, from verdicts.json `span_years`, clipped to 1600–2050. The empty left of the "now · 2026" row carries the hatch's key, "years a test still needs". The series key adds "A shape that looks alike is not a test." Below 360px the ring caption drops "Reference", so the caption keeps to one line and the verdict stays on a 320x568 first screen. Commit `0aae5e6`.

### 1. Implementation

- `0aae5e6` on main: `src/app/(app)/cycles/[id]/page.tsx`, `src/lib/seriesOverlay.ts` (`missingYears`, `MISSING_CLAUSE`), `src/lib/seriesOverlay.test.ts`.
- Gate: `verify-with-receipt -- npm test` at `0aae5e6`, exit 0, 32 files / 305 tests. Lint: 0 errors.
- Red-armed: changing `from` to 2 periods turned 10 of 16 overlay tests RED (all nine paired pages plus the fixture). Reverted; the tree is clean.
- The test's oracle is the manifest-built record and the cycle's period, not `missingYears()`. It pins: hatch ends at the record's first point, starts 3 periods before its last, x and width on the curve's axes, legend span present, aria clause present, and no hatch on fathers-and-sons.
- Codex r1 (foreground pipe, `--sandbox read-only`, banner `workdir: C:\dev\skylark\sinusoidal-cycles` checked) on `0aae5e6`: "No material defects found in this static review." All STATIC. It confirmed the nine hatch endpoints against the CSVs and spans, and named its own ceiling: legend contents, pattern painting, CSS visibility and viewport fit are not verified by the test. Those are covered by the frame and fold reads below.
- Sibling sweep: there is no other CurveFigure caller (Codex: "One figure renders per page"). The embed (`EmbedView`/`CycleFacet`) does not draw this figure, and embed reads 42/42.

### 2. Delivery

- CI GREEN on `0aae5e62ce08b05b51b07c944cf2382aac9322a8` (`check-ci-status --wait`, 55 s).
- `check-deployed-sha-drift --service sinusoidal-history`: "in-sync live 0aae5e62 → head 0aae5e62".
- Production reads (after deploy):
  - `check-entry-folds` 13/13 at 390x664 and 13/13 at 320x568. Perez 9px spare, was 6.
  - Hatch check (`tmp/p3-2026-10-12/hatch.mjs`) 10/10 at 320x568 and 390x664. Hatch drawn on 9/9 paired pages, legend on the first screen and ≥76px clear of "now", clause in the key, nothing on fathers-and-sons. Local reads at 1440x900 were also 10/10.
  - Rendered `main` innerText line multiset at 390x664, production before vs after: each paired page removed 1 and added 2 (the key line with the clause, and "years a test still needs"). fathers-and-sons 40 → 40, unchanged.
  - `check-embed-snippets` 42/42. `check-verdict-landing` 490/490.

### 3. Encounter

blind for real readers: no client analytics, so a reader's reading of the figure leaves no trace (bug row I-033). The synthetic stand-in is today's glance-first cold re-walk (N=1, `docs/walks/2026-10-12-w004-r2.md`).

### 4. Outcome (synthetic, N=1): not held on the page it was aimed at

<!-- findings:begin -->
**The REDIRECT's HYPOTHESIS, measured, is wrong for Turchin.** "The picture itself shows the record covers less than one swing" did not land for a reader who looks and does not read. Glance-first at 390x664, the walker wrote before reading: the line "bottoms out where the sinusoid bottoms out … and climbs to the peak dot … It reads as a fit, and a fairly good one. The striping over roughly 1600–1913 says 'nothing here', but nothing in the picture says the fit doesn't count." Only text corrected it: the key's last sentence (y 387), "a three-line grey sentence a skimmer is likely to miss", and the verdict box (y 459).

Elsewhere:
- **Kondratiev 320:** no fit seen, because the line itself is noise. But the hatch "reads like a highlighted historical era rather than missing record".
- **Perez 320:** the 4.5px hatch is "effectively not visible", yet its legend still shows. That is a legend for a mark the eye can't find.
- **Time direction:** the hatch puts the missing years in the past, while the verdict box's "Roughly 339 more years of that measurement would reach the floor" reads as waiting into the future. The box wording is on the don't-touch list, so I left it.

**This is the second appearance of the same defect class.** The 10-10 key ("rescaled to the curve's height") and today's hatch both tried to annotate a rescaled series that sits on the curve's own axes. Each time the eye read the shape before the words. By the stop-patching rule, the next step is a change of shape, not a third annotation. Candidates for the review, each a HYPOTHESIS:
- **(a)** Draw the record in its own strip under the curve, on its own scale and sharing only the time axis, so it cannot sit on the sinusoid.
- **(b)** On a not-testable page, do not draw the record on the curve at all on the first screen, and leave it to the series section.
- **(c)** Keep the overlay but remove the vertical rescale, so the line's height means nothing curve-like.

(a) and (b) change I-033's original design, which drew the series on the curve to meet the bar's "curve drawn against a real measured series", so they are a choice about the bar, not a fix.

What held: the key's clause is read (B1 cites it). Nothing on the first screen reads as a test having run or passed (B3), with two mild leans quoted in the walk notes ("the record the verdict counts", "judged on"). The hatch does no harm I can measure beyond the Kondratiev "era" reading. I left `0aae5e6` live: it is correct and passes every gate, and reverting it on N=1 would be churn. Whether to keep the hatch once the shape decision is made goes with that decision.

Side findings (pre-existing, not this change):
- **Perez aria label:** it names the series "US Technology-Diffusion Intensity (HATCH)", where HATCH is the dataset's own name. In the same sentence it now meets "Hatched before it…". This is a small collision I introduced by choosing the word "hatched".
- **Turchin's "now" dot:** it sits beside the 2020 ring at the top, while the label says "falling arm" (also noted in the morning walk).
<!-- findings:end -->

### Receipt

USER-VISIBLE: every "not testable" cycle page's curve now hatches the years a test would still need before its record, with the key "years a test still needs" and the clause "A shape that looks alike is not a test." — 0aae5e6 [proof: before, the key said only "rescaled to the curve's height" and no figure marked the shortfall; after, 9 of 9 paired pages show the hatch, legend and clause on the first screen at 390x664 and 320x568 (hatch.mjs 10/10 at both on production after Render live 0aae5e62 = head; check-entry-folds 13/13 at both; line multiset +1 changed +1 added per page)] [coverage: none, no client analytics on this site · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, so a reader's reading of the figure leaves no trace · bug row I-033] [outcome: not held — glance-first synthetic re-walk N=1 (docs/walks/2026-10-12-w004-r2.md): on /cycles/turchin the picture alone still reads as the data fitting the cycle; only the key's clause and the verdict box correct it] [next: revise the bet — the shape question above, at the orchestrator's review; next read: the cold re-walk after whichever shape ships]

codexCalls: 1 (Codex r1 review on 0aae5e6)
adversarialReviews: 1 — EXECUTED (read-only foreground pipe on 0aae5e6, workdir verified, no material findings)
hygiene helper: DISPATCHED 2026-10-12 ~15:41Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-12.md PRESENT (0 disposition lines; wait-justification PASS with 1 info, I-034 WAIT_UNDECLARED_STRUCTURAL; engineering-zero PASS 0 findings; no READ-MUTATED)

### What remains

- The shape decision (a / b / c above), at the review. I hold the build until then. Nothing is half-done in the tree.
- For P5: I-033 notes (shipped `0aae5e6`, outcome not held, the shape question) and linkedCommits; W-004 notes from both walks (`docs/walks/2026-10-12-w004.md`, `-r2.md`), committed then; the I-034 wait-contract info line from the helper.
- Pending dated reads are unchanged: 10-13 W-004 (walked today, early), 10-20 I-027/I-034, 11-01 I-037, 11-04 W-005/I-032, 12-01 I-025.

[standing-rules-hash: 88cc2dc9]

---

[P5 — Delta-only close]
ACTION: COMPLETED · item I-033 · P3 018f447a

## Close (day session, 2026-10-12)

The manager review 90a11b2b rated the action COMPLETED against the REDIRECT's acceptance condition, with the outcome NOT HELD. Evidence is in P3 018f447a § 2: Render live 0aae5e62 = head; CI green on 0aae5e6 (tests green, 305); folds 13/13 at 390x664 and 320x568; hatch 10/10 at both; line multiset +1 changed +1 added per paired page; embed 42/42; verdict-landing 490/490.

**State changed since P3 (018f447a):** none for readers. The review agreed to leave 0aae5e6 live and set the next round as shape (a).

**Ledger delta** (every write via `continuity-edit`, each printing "wrote 1 change(s)"):
- **I-033:** status monitoring → open. Note appended: shipped 0aae5e6, acceptance met, outcome NOT HELD (w004-r2:18), second appearance of the annotate-the-overlay class, next round = shape (a), fallback (b), pre-registered glance pass. linkedCommits + 0aae5e6. closeWhen replaced with the pre-registered pass (`--extend`, nextEvaluation stays 2026-10-13). waitJustification and waitingFor removed: it is open work now, not a wait.
- **Closed on today's walk** (`docs/walks/2026-10-12-w004.md`, synthetic N=1), each with its walk evidence in the close note:
  - **I-030:** step 3, the judged-on entry was used at 390 and 1440.
  - **I-031:** step 2, the arrow and fade were seen before the cue, and the arrows work with a mouse.
  - **I-035:** step 1, the key answered "the record the verdict counts".
  - **I-036:** steps 5 and 6 pass; step 7's /state answer is recorded as "cos holds" (guessed right from the intro, footnote unused), so no new row.
  - **I-029:** step 8, answered from the page; the buried placement and the Kondratiev p-value wording are recorded as residue.
  - **W-004:** closed per its closeWhen (b); the failing step names I-033 as its fix row.
- **I-034:** waitJustification added, until 2026-10-20 (the helper's WAIT_UNDECLARED_STRUCTURAL info line).

**Hygiene draft:** 0 lines — 0 accepted · 0 amended · 0 rejected (`tmp/hygiene-draft-sinusoidal-cycles-2026-10-12.md`; inputs all none).
- READ-MUTATED: "none: 0 reads guarded (no --run was executed)".
- check-wait-justification (helper): "RESULT: PASS — 31 of 43 row(s) carry `waitJustification`; 0 warn / 1 info (exit 0)", where the info line was I-034. Re-run after my I-034 and I-033 edits: "RESULT: PASS — 31 of 43 row(s) carry `waitJustification`; 0 warn / 1 info (exit 0)". At that point the info line was I-033's leftover waitingFor, since removed.
- check-engineering-zero: "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable (exit 0)". No lockfile changed today.

**Due-gate verification:** `check-due-gates-dispositioned` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-12, 0 rows, 43 swept).

**Receipt:** P3's receipt (018f447a) still holds: outcome not held, next is revising the bet. Nothing new.

**Primer:** `docs/cold-starts/2026-10-12.md`, banner rewritten in place (1,412 chars). First action: `check-entry-folds` at 320x568 on production, the budget the strip must fit.

**Pending reads:**
- 2026-10-13: I-033 next round, shape (a); then the glance-first cold re-walk after that ship.
- 2026-10-20: I-027, I-034.
- 2026-11-01: I-037.
- 2026-11-04: W-005, I-032.
- 2026-12-01: I-025 (David).

**UNRESOLVED:** none.

codexCalls: 0 (this phase; the day's one review run is counted on P3 018f447a) — probed-declined

[standing-rules-hash: 88cc2dc9]

---

[P1 — Evidence and choice]

## Afternoon session (round 2) — P1 selection packet

**Outcome:** a reader glancing at a cycle page whose record is too short to test does not take the drawn record as a fit to the curve. Item **I-033** (open; shape (a) approved by the orchestrator in e80c61d3, and recorded in the primer banner).

**The user problem, in a reader's words (synthetic, N=1, `docs/walks/2026-10-12-w004-r2.md:16`):** "the brown line bottoms out where the sinusoid bottoms out and climbs where it climbs, up to the peak dot. At a glance it reads as a fit, and a fairly good one."

### Evidence

- **OBSERVED (synthetic, N=1)**, w004-r2, live site after `0aae5e6`, Turchin at 390x664, glance-first: the picture alone reads as a fit. Only text corrects it: the key's last clause (y 387) and the verdict box (y 459). Limits: one model reader, one page. It measures reading, not love.
- **OBSERVED**, mechanism: the record is drawn on the curve's own axes. `CurveFigure` maps both through the same `y()` (`src/app/(app)/cycles/[id]/page.tsx:848-860`), so a rescaled series lies on top of the sinusoid by construction. Two annotations of that overlay have failed (10-10 key "rescaled to the curve's height"; 10-12 hatch plus "A shape that looks alike is not a test."). Under the stop-patching rule the next step changes the shape.
- **OBSERVED**, the fold budget the strip must fit, production at HEAD `1c37dca`, read ~19:05Z:
  - **320x568:** 13/13 OK. Tightest legs: Perez 9px, `/` 12px, Kondratiev 20px, Methods 25px. All other paired pages 26px or more.
  - **390x664:** 13/13 OK. Tightest paired page is 129px.
  - So at 320 the strip must be **height-neutral**: the figure is a 900x150 viewBox, about 48px tall at 320. The strip comes out of the curve's own height (for example curve 150 → ~100 units, strip ~50, same total). It cannot be added below it.
- **HYPOTHESIS**, why (a) can work: on its own band with its own y-scale, the record's swing no longer occupies the sinusoid's y-range, so the eye cannot lay one on the other. **The risk, stated before the build:** the strip shares the time axis, so Turchin's trough near 1960–80 still sits directly under the curve's trough. A walker may still align them vertically. The pre-registered walk is the only instrument that answers this.
- **MISSING:** any real reader on any /cycles page (no client analytics; the bar reads UNMEASURED). No `docs/evangelism-evidence.md`.
- **Retro finding that recurred and bears on the choice:** "a check written from a measurement inherits its looseness." Folds, hatch geometry and multiset all passed on `0aae5e6` and could not see the misreading. The walk stays the outcome instrument. The checks only guard delivery.

### Section 0

- Primer `docs/cold-starts/2026-10-12.md` read. First action run (folds at 320x568, above), plus 390x664.
- Listener: 🟢 SSE hello 18:53:57Z (pid 61828, slug match). `/loop-tick` armed by tool call. Waker ranks 1–3 running.
- Codex: GREEN per the kickoff's `[codex-probe: …]` line (18:53Z, machine-level exec + write; pipe-backed stdio EPERM noted).
- CI: `check-ci-status --workflow ci.yml` GREEN on `1c37dcaca8` (exit 0). Drift: `check-deployed-sha-drift --service sinusoidal-history` in-sync, live `1c37dcac` = head (exit 0).
- Context budget: targeted reads only.
- North Star: retention + word-of-mouth. The bar's "what breaks the moment" is an overclaim, and here it is a picture. Reported unmeasured.
- Recs: round 1's "What remains" is the shape decision, now ruled (e80c61d3), which makes it today's action → P3.
- Harness: running 2.1.296 · fleet UNIFORM (17/17) · installed 2.1.296 (SAME).
- Rotation: `check-cycle-rotation --lane sinusoidal-cycles` exit 0, no product-love pass picks this lane today.
- Due gates: `--print` "0 gate(s) due on/before 2026-10-12" (43 swept). The morning `--snapshot` stands (not re-taken).
- Board: `answered-cards` "NO waiting/answered/pending-verify cards for sinusoidal-cycles".

### Permission

I-033 is this lane's own open row, not parked or frozen, with no card on it. The orchestrator approved shape (a) in e80c61d3. It is a figure layout change inside the lane's product authority. Untouched: `public/data/spectral/`, HashLink.tsx, /state bands, state-2026.csv, judgedOn lengths, verdict box wording. **Not authorised here:** (b), no record on the first screen. That is a bar change, and it goes to David as a card only if (a) fails its walk.

### Next action

Kind: **improve.** In `CurveFigure`, split the figure's existing height into two bands that share only the x axis:
- **Top band:** the sinusoid, with now-dot, ring, peak line and century ticks.
- **Bottom strip:** the judged record, min-max scaled to the strip's own height. The strip is empty (hatched) for the years a test still needs.
- The key's "rescaled to the curve's height" becomes wording that is true of the strip (for example "drawn on its own scale below the curve"). The aria label and `seriesOverlay.test.ts` pins move with it.
- fathers-and-sons (no record) keeps today's single band.

First command (reproduce the reading to beat, Turchin's first screen as it is now):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-entry-folds.mjs https://sinusoidalhistory.com --width 320 --height 568
```

### Acceptance condition (observable)

- **Delivery:**
  - Live at 390x664 and 320x568, each of the nine paired pages shows the curve band, the record strip beneath it (no record point inside the curve band's y-range), the key, and the verdict headline on the first screen.
  - `check-entry-folds` 13/13 at both sizes, with Perez still ≥ 0px spare at 320.
  - fathers-and-sons unchanged (line multiset 40 → 40).
  - `check-embed-snippets` 42/42. `check-verdict-landing` 490/490.
  - Tests pin: strip y-range disjoint from the curve band; strip x equals the curve's x for the same year; the oracle is the manifest-built record, not the drawing code.
- **Outcome (pre-registered, written before any look):** a glance-first cold walk on /cycles/turchin at 390x664, same protocol as w004-r2, passes **only if** the walker's pre-read description does NOT say the line follows, tracks or fits the curve. Fails → no third iteration of the figure; post a P3 consult so (b) can go to David as a card.

### Delivery and encounter checks

- **Delivery:** CI green → deploy row live = head (`check-deployed-sha-drift --service sinusoidal-history`) → the fold, multiset, embed and verdict-landing reads on production.
- **Encounter:** blind for real readers (no client analytics; bug row I-033). The synthetic glance walk is the read, the same day after deploy. W-005 reads click-through at ~100 impressions (11-04).

### USER-FACING: yes

Paths: `src/app/(app)/cycles/[id]/page.tsx` (`CurveFigure`, key, aria-label), `src/lib/seriesOverlay.ts` (strip scale, possibly key wording), `src/lib/seriesOverlay.test.ts`. To check: `public/llms.txt` and `/methods` (`page.tsx:161` says overlaid series are "rescaled to the interval [-1, 1]", which is about the home chart and may stay true), plus `public/methods.md` if that sentence changes.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none**. Read: `dated gates due today` (0, 43 swept) and `--print`.
- (b) Owed child rows (skylark-site ledger): **none**. Read: `rows owed to you` (0 of 749).
- (c) State reads marked CROSSED: **none**. Read: the kickoff state block (stale-actionable 0 of 7; missingLinkedCommits NOTHING SWEPT 0 of 0, not crossed; queued rows 0; HEAD CI GREEN; report artifact PRESENT).

codexCalls: 0 (P1) — probed-declined

---

[P3 — Product-work loop]

## Afternoon session (round 2) — P3 product-work loop

### Action: improve (I-033), shape (a) as the manager review ca557cea APPROVED it

This is a new session in the same lane: the 17:10Z close was round 1. On every cycle page that draws a record (9 of 9 paired pages), the figure now has two bands that share only the time axis:
- **Top band:** the sinusoid, with its dots and peak line.
- **Strip below it:** the judged record, min-max scaled to the strip's own height.

The years a test still needs are hatched inside the strip only. The key now reads "the record the verdict counts, drawn below on its own scale. A shape that looks alike is not a test." fathers-and-sons (no record) is unchanged.

### 1. Implementation

- **`5d5031a`**, the figure: `src/app/(app)/cycles/[id]/page.tsx` (CURVE_BAND 104 and STRIP 116–164 in a 900x164 viewBox, `sy()`, the strip rect, the hatch confined to the strip, key and aria-label), plus `src/lib/seriesOverlay.test.ts`. The test's oracle is the frozen analysis manifest. It pins:
  - each record point in the strip on the strip's scale;
  - no record point in the curve band;
  - the hatch y and height equal to the strip;
  - fathers-and-sons keeps 900x150.
  
  **Red-armed:** drawing the record through the curve's `y()` again turned 9 of 16 RED. Restored.
- **`375fc1f`**, a checker fix from Codex r1 (MED, STATIC, CONFIRMED and REPRODUCED). `scripts/check-year-position.mjs` inverted the now-dot with the old 150/14 geometry, so a local build read 86/95, with every paired dot leg a false RED (Perez read −0.17 for −0.99). It now reads the drawn SVG's viewBox height and inverts that band. An unknown height never agrees. Result: 95/95.
  
  **Sibling sweep:** pattern `900x150 | 150/900 | 14/150 | viewBox…150` over the repo excluding node_modules, .next, tmp, docs and continuity found 1 file (this one). No other consumer.
- **`48a9320`**, selftest arms from Codex r2 (MED, STATIC, CONFIRMED): the old arms could not catch a wrong band height. Positive midline (0) and trough (−1) arms were added. **Red-armed:** band 104 → 164 gave 24/26 FAIL. Restored: 26/26.
- **Gate:** `verify-with-receipt -- npm test` on `48a9320`, exit 0, 32 files / 305 tests. Lint 0 errors, typecheck clean.
- **Codex r1** on `5d5031a` (foreground pipe, `--sandbox read-only`, banner `workdir: C:\dev\skylark\sinusoidal-cycles` checked): 1 MED, fixed in `375fc1f`. Everything else checked clean: record y 121–159 inside the strip, curve y 10–94, dots divided by 164, no other stale consumer, no test-ran copy, don't-touch list untouched.
- **Codex r2** on `375fc1f` (same recipe, banner checked): 1 MED, fixed in `48a9320`. It confirmed the inverse is exact for both geometries and that `svg.first()` is the curve SVG.

### 2. Delivery

- CI GREEN on `48a9320c3a…` (46s).
- `check-deployed-sha-drift --service sinusoidal-history`: "in-sync live 48a9320c → head 48a9320c".
- Production reads after deploy:
  - `check-entry-folds`: 13/13 at 320x568 (Perez 5px spare, was 9) and 13/13 at 390x664.
  - Strip geometry (`tmp/p3-2026-10-12-r2/strip.mjs`): 10/10 at both sizes. At 320 the strip is 15.4px with the record drawn over 12.2px; at 390 it is 18.7px with 14.8px. The record sits 8.6 to 10.5px below the curve, the hatch is inside the strip, and the clause is in the key.
  - Rendered `main` innerText line multiset at 390x664, production before vs after: each paired page removed 1 line and added 1 (the key line only). fathers-and-sons 40 → 40.
  - `check-embed-snippets` 42/42, `check-verdict-landing` 490/490, `check-year-position` 95/95.

### 3. Encounter

blind for real readers: the site has no client analytics, so a reader's reading of the figure leaves no trace (bug row I-033). The synthetic stand-in is the pre-registered glance walk below.

### 4. Outcome (synthetic, N=1): held against the pre-registered bar, with a stated ceiling

<!-- findings:begin -->
**Pass, as pre-registered.** A fresh cold walker (a new subagent with no repo reads and no earlier frames), using the w004-r2 protocol, looked at /cycles/turchin at 390x664 on production (19:30:48Z). Before reading, it wrote (`docs/walks/2026-10-12-w004-r3.md`, Step A): "that thin line does not look like it follows, fits, mirrors or moves with the wave: it reads as something separate, a small noisy trace in its own compartment … My eye did not line it up with the wave above it." The manager's wider fail list ("mirrors", "lines up with", "moves with") is explicitly negated in the same sentence.

**The reviewer's height caution, checked.** The walker could still describe the record's shape ("mostly flat, dipping a little and drifting up slightly at the end"), so the record was legible, and this is not a pass by invisibility. The walker's own ceiling stands, though: "'separate' partly means 'too small to compare' … if I stare … a reader who looks longer could start pairing them." So this measures the glance and does not claim the record can't be paired on a long look.

**Carried, not this change:**
- **The hatch key's direction in time** came up again (B2): "years a test still needs" sits over past years, while the verdict box says "339 more years". The box wording is on the don't-touch list. This is the second walk to flag it.
- **The aria label "falling arm"** vs a dot that reads as "cresting": 2026 is 6 years past Turchin's 2020 peak, so the label is right and the glance is coarse. Noted in two walks; no change proposed.
<!-- findings:end -->

### Receipt

USER-VISIBLE: on every "not testable" cycle page the record is drawn in its own strip under the curve, on its own scale, sharing only the time axis, instead of on top of the sinusoid — 5d5031a [proof: before, the record was drawn through the curve's own y() in a 900x150 figure; after, 9 of 9 paired pages draw the curve in y 0–104 and the record in a separate 116–164 strip (strip.mjs 10/10 at 320x568 and 390x664 on production after Render live 48a9320c = head; check-entry-folds 13/13 at both; line multiset 1 key line changed per paired page; embed 42/42; verdict-landing 490/490; year-position 95/95)] [coverage: none, no client analytics on this site · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, so a reader's reading of the figure leaves no trace · bug row I-033] [outcome: held — pre-registered glance-first cold walk N=1 synthetic (docs/walks/2026-10-12-w004-r3.md Step A): the walker did not read the record as following or fitting the curve; ceiling: small trace, a long look could pair them] [next: continue — next meaningful read: W-005 GSC click-through at ~100 impressions (2026-11-04); no further figure change on a synthetic N=1]

codexCalls: 2 (Codex r1 on 5d5031a, r2 on 375fc1f)
adversarialReviews: 2 — EXECUTED (read-only foreground pipes, workdir verified both runs; 1 MED each, both fixed: 375fc1f, 48a9320)
hygiene helper: DISPATCHED 2026-10-12 ~19:06Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-12.md PRESENT (0 disposition lines; wait-justification PASS 0 warn / 0 info; engineering-zero PASS 0 findings; no READ-MUTATED)

### What remains

- For P5: I-033 notes (shipped 5d5031a + 375fc1f + 48a9320, outcome held on the synthetic glance walk with its ceiling), linkedCommits, and closeWhen against the pre-registered pass. The walk notes `docs/walks/2026-10-12-w004-r3.md` are committed with this report.
- **Option (b) is not needed:** the walk passed, so no David card is owed.
- Pending dated reads are unchanged: 10-20 I-027/I-034, 11-01 I-037, 11-04 W-005/I-032, 12-01 I-025.

[standing-rules-hash: 88cc2dc9]

---

[P5 — Delta-only close]
ACTION: COMPLETED · item I-033 · P3 5ed634be

## Close (afternoon session round 2, 2026-10-12)

The manager review bc014388 rated the action COMPLETED against the pre-registered pass. Its own live read: /cycles/turchin returns 200 with "drawn below on its own scale" and the 900x164 viewBox, and Render is live ca3ee657, which descends from 48a9320.

**State changed since P3 (5ed634be):** none for readers. `ca3ee65` (report and walk notes, docs only) is pushed and live.

**Ledger delta** (every write via `continuity-edit`, each printing "wrote 1 change(s)"):
- **I-033:** linkedCommits + `5d5031a`, `375fc1f`, `48a9320`.
- **I-033 → closed** on its closeWhen. The close note records the pass as HELD at 390x664 (synthetic N=1, w004-r3.md:11), with two ceilings written as ceilings:
  - (1) on a long look, the small trace could be paired with the curve (w004-r3.md:25);
  - (2) 320 legibility is measured as geometry only (strip 15.4px, record 12.2px) and was not walked. This is the manager's HYPOTHESIS, accepted: the walk ruled out a pass by invisibility at 390, not at 320.
- **I-038 minted** (open, P3, nextEvaluation 2026-10-20, readCommand `check-entry-folds … --width 320 --height 568`). It covers:
  - the hatch key's direction in time (two walks flagged it; box wording is don't-touch);
  - a 320 glance walk on Turchin and Perez.

**Hygiene draft:** 0 lines — 0 accepted · 0 amended · 0 rejected (`tmp/hygiene-draft-sinusoidal-cycles-2026-10-12.md`, inputs none).
- READ-MUTATED: "none: 0 reads guarded (no --run was executed)".
- check-wait-justification (helper): "RESULT: PASS — 31 of 43 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)". Re-run after my edits: "RESULT: PASS — 31 of 44 row(s) carry `waitJustification`; 0 warn / 0 info (exit 0)".
- check-engineering-zero: "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable". No lockfile changed today.

**Due-gate verification:** `check-due-gates-dispositioned` → "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-12, 0 rows, 44 swept).

**Receipt:** P3's receipt (5ed634be) still holds. Nothing new.

**Primer:** `docs/cold-starts/2026-10-12.md`, banner rewritten in place (1,341 chars). First action: `check-entry-folds` at 320x568 (nothing is due on 10-13).

**Pending reads:**
- 2026-10-20: I-027, I-034, I-038.
- 2026-11-01: I-037.
- 2026-11-04: W-005 (GSC click-through at ~100 impressions, the next meaningful read for the figure), I-032.
- 2026-12-01: I-025 (David).

**UNRESOLVED:** none.

codexCalls: 0 (this phase; the round's two review runs are counted on P3 5ed634be) — probed-declined

[standing-rules-hash: 88cc2dc9]
