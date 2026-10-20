[P1 — Evidence and choice]

# 2026-10-19 (Monday night, MT) — sinusoidal-cycles, round 3

## Selection packet (round 3)

**Outcome:** a first-time reader scrolls from the opened Dalio card to "State of the cycles", past the editor's note and the range strip, and nothing on the way says the cycles peak now. **Items:** I-055 (the note, open, nextEvaluation 2026-10-20) and I-059 (the range strip's grey mean curve, open, nextEvaluation 2026-10-20). They are one scroll path and one walk.

**The user problem in the user's words** (walks E1/E2, `docs/walks/2026-10-19-i055.md` lines 25-26): on the note, E1 said "the opening words are the friend's claim in display type", and E2 said "the first sentence registers as agreement before the correction lands … I took the bold sentence for the site's own headline claim." On the strip, E1 called it "the single strongest picture on the page supporting my friend" and E2 said "The picture says 'they all line up now'".

### Section 0

- Primer: `docs/cold-starts/2026-10-19.md` read. Its first action ran: `git grep -n "Nearly every cycle peaks somewhere near the present" -- src` gave **1 match** (`src/components/ConvergenceNote.tsx:15`), so the line that read NOT HELD is still the shipped one. I-059's readCommand (`git grep -n "mean of all" -- src`) gave **2 matches** (`countWords.ts:48`, `countWords.test.ts:61`), so the caption is still shipped.
- Listener: 🟢 SSE alive (pid 34668, hello 04:10:55Z, replay 0) and `/loop-tick` armed by ScheduleWakeup. Waker ranks 1-3 are relaunched for this session.
- Codex: GREEN per the kickoff's `[codex-probe:]` line (04:14:19Z). Spawn caveat: pipe-backed stdio gives EPERM. P1 used none.
- CI: `check-ci-status --workflow ci.yml` is GREEN for d5d32f1bdb (exit 0). Drift: `check-deployed-sha-drift --service sinusoidal-history` is **in-sync**, live d5d32f1b = head (exit 0).
- Harness: running 2.1.304 · fleet UNIFORM (27/27) · installed 2.1.304 (SAME). The build moved from 2.1.277 since the tracked record.
- North Star: retention and word of mouth. Whatever ships here is unmeasured by design (no client analytics, W-003).
- Recs from the last close (primer banner and round-1 § What remains): one recommendation, the shape change for I-055 and I-059. It's **carrying today → P3**, and it is this packet.
- Rotation: `check-cycle-rotation --lane sinusoidal-cycles` gave **exit 2, UNDETERMINED** ("no real-user-evidence artifact on record … the registry does not declare which lanes owe one"). That is not the same as nothing being due.
- Due gates: `check-due-gates-dispositioned --print` gave "0 gate(s) due on/before 2026-10-19" (of 65 ledger items). This morning's round-1 `--snapshot` stands, and I didn't re-take it. I-055 and I-059 come due 10-20, and the work below is their read.
- David's word: `answered-cards --project sinusoidal-cycles` found none.

### Evidence

- OBSERVED (walks E1/E2, N = 2, synthetic, Chromium, 390x664, production b0b0aff, 2026-10-19): both walkers lifted the note's first clause ("Nearly every cycle peaks somewhere near the present.") as agreement before the correction landed. Both called the strip's grey mean curve the page's strongest "peaking now" picture. The same note read failed on D1/D2 (10-18) with the old line, so **the reword has failed twice on this element**. **Limits:** synthetic, N = 1 per seed.
- OBSERVED (source): the note's display line is 20-24px italic (`ConvergenceNote.tsx:14`), its correction is 13-14px, and the "Editor's note" label sits **below** both (`:24`). E2 read the label's position as making the line the site's headline.
- OBSERVED (arithmetic, scratch `mean-curve.mjs`, the same formula as `TimeRangeBrush.tsx:59-66`, 10 cycles from `src/data/cycles.json`, 1600-2050): the grey mean curve's **highest point in the whole window is 2029, at 0.61**. That's 1.40× the next-highest crest (1725, 0.44), and the curve reads 0.58 at 2026. The curve is the selection effect drawn as data: each theory is anchored to a recent peak, so their average crests at the present. What the walkers saw is in the curve itself, not in a misreading of it.
- HYPOTHESIS (why removing it, not relabelling it): a caption that explains a bump argues against a picture, and the picture is read first. That's the same lesson as I-047 and I-048 (both cleared only when the claim was removed) and the round-1 note on I-054 ("stopping a curve early moves its crest to the endpoint": the picture wins). Untested until the walk.
- OBSERVED (source): the strip still works without the curve. The brush, the decade ticks, the zero line, the endpoint years and the range buttons don't depend on `overviewPath`. The only other dependants are the caption `brushCaption()` (`countWords.ts:48`) and its pin (`countWords.test.ts:61`).
- OBSERVED (AGENTS.md): `check-rendered-text` can't see inside `Viz`, so the proof for both changes is the rendered `main` innerText line multiset (Playwright, built against production).
- MISSING: any real-user encounter (no client analytics by standing choice, W-003). Search Console's next read is I-051, 2026-10-30.

### Permission

Both rows are lane-owned issues: not parked, no open card, no David word on either. Round 1's reviewer (286686b2) approved the note's wording change under the lane's copy class. Removing a decorative overview curve and demoting a display line to body type is the same class: the caveat and its words stay on the page.

### The choice, and why

1. **I-055: take the pattern out of display type, rather than leading the display line with the correction.** The note keeps no display-size text. The "Editor's note" label moves **above** the text (fixing E2's "the site's own headline"). The single paragraph at body size **opens with the correction**, and the pattern comes later, after its reason. **Why this arm:** a display line that "leads with the correction" still has to name what it corrects, so its subject is the pattern ("Peaks near today are a selection effect"), and both walkers lift the subject first. That's the third reword the rule forbids. Removing the display type changes the shape: nothing in the note is set big enough to be lifted as a headline. Wording rule for P3, held by a check: the paragraph's first clause doesn't state the pattern ("peaks", "near the present", "converge" don't appear before the first full stop, unless negated as "not convergence"), and it reuses /about's words where it can. `/about` and `public/about.md` don't change: their sentence is prose inside a reasoned paragraph, not a display line.
2. **I-059: remove the grey mean curve, rather than relabelling it.** The strip keeps the brush, ticks, zero line, endpoint years and range buttons. The caption becomes an instruction with no count ("Drag across the strip to zoom the chart above."), and the test pin moves with it. **Why this arm:** the arithmetic above shows the curve's tallest crest **is** the present, so any label would be words arguing against the picture. The strip's job is zoom, and zoom doesn't need it.

### Next action — improve

Edit `src/components/ConvergenceNote.tsx` (shape: label above, one body-size paragraph, correction first), `src/components/TimeRangeBrush.tsx` (drop `overviewPath` and its `<path>`), `src/lib/countWords.ts` + `countWords.test.ts` (caption). Then: build, measure the multiset locally against production, push after CI, check drift, run the walk. The first command is the presence read the change takes from 1 and 2 matches to 0 and 0:

```
git -C C:/dev/skylark/sinusoidal-cycles grep -n -e "Nearly every cycle peaks somewhere near the present" -e "mean of all" -- src
```

### Acceptance condition

- **RED before (production d5d32f1b):** the presence read above gives 3 lines (1 note + 2 caption). At 390x664 on `/` and `/?tab=facets&focus=dalio`, `aside[role="note"]` has a `<p>` whose computed font-size is ≥ 20px. The strip's SVG holds a `<path>` with a non-empty `d`.
- **GREEN after (production):** the presence read gives 0. No text node inside the note has a computed font-size above the body size (≤ 15px). The note's first text in DOM order is the label, and its first sentence states no pattern (the rule above). The strip's SVG holds no data `<path>`. The `main` innerText multiset differs from production by exactly the stated lines (old note lines and old caption out, new paragraph and new caption in), and by no others.
- **Walk (pre-registered before push, `docs/walks/2026-10-20-i055-i059.md`):** walks F1/F2. Walk B's prompt + question (7) + E1/E2's question (8), verbatim. 390x664, production, default + schoolteacher seed. Pass words, written before the walk: **HELD only if neither walker reports the note or the strip read as "peaking now", convergence or the site agreeing, even briefly.** Each half is scored separately, and I-055 and I-059 close on their own half. **NOT HELD on either → record it; no third reword.** The next lever would be removing the note from the scroll path, for a reviewer's call.
- **Positive controls:** check-open-card-position 2/2, check-closed-card-header 2/2, check-holds-up-line 46/46, check-embed-snippets 42/42, check-entry-folds 320x568 13/13 (the note shrinks, so folds can only gain).
- **Red-proof:** an Edit that puts the old display `<p>` back makes the font-size leg and the presence read go RED. An Edit back restores them, with the tree clean.

### Delivery and encounter checks

CI green (`check-ci-status --wait --wait-timeout-min 90`, in case Actions is slow again) → `check-deployed-sha-drift --service sinusoidal-history` in-sync → the size, path and multiset reads on production → walks F1/F2. A real encounter can't be read at this traffic level (no analytics), so the exposure line will be `blind`, naming W-003's standing choice.

**USER-FACING: yes.** Paths: `src/components/ConvergenceNote.tsx` and `src/components/TimeRangeBrush.tsx` (served on `/` to every reader), `src/lib/countWords.ts` (the strip caption). Internal: `src/lib/countWords.test.ts`, `continuity/items.json`, `docs/walks/`, `docs/daily/`.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: none. Read: `check-due-gates-dispositioned --print` gave "0 gate(s) due on/before 2026-10-19". After 00:00 MT the 10-20 rows come due: I-043, I-046, I-027, I-034, I-049 (from the primer banner). They aren't due as of this packet, and I'll list them for the helper once they are.
- (b) Owed child rows: none. Read: the kickoff gave "0 of 754" owner-stamped rows in skylark-site's ledger.
- (c) CROSSED state reads: none. Read: in the kickoff state block, stale-actionable was 0 of 16, missingLinkedCommits was NOTHING SWEPT (0 of 0; not a clean read), and queued rows were 0. Not crossed, but noted: key numbers "no list yet" (`docs/key-metrics.json` absent), and rotation exit 2 UNDETERMINED.

One prior-day retro finding bears on the choice (10-18 Q6, "full checker output pasted into context"): tonight's checker runs went through `Select-Object -Last N`.

---

## P3 (round 3): the note left display type, and the strip lost its mean curve. Both walks HELD.

**Action (kind: improve).** I-055 and I-059 changed SHAPE, not words, as the manager review approved (3dfb7544):
- **The note:** the "Editor's note" label now comes first. Everything is body size (14/15px), and the first sentence is the correction: "A selection effect, not convergence."
- **The range strip:** the grey mean curve is removed. Its highest crest in 1600-2050 was 2029 at 0.61, 1.4× the next. The strip keeps the brush and the 50-year ticks, and it gains century labels, which the review suggested. A label within 48px of either end is dropped, so 2000 goes at 320-390px, where it would overlap 2050. The caption is now "Drag across the strip to zoom the chart above." The stale comment is gone.

### The four states

1. **Implementation.**
   - `c90104c`: the code. `src/components/ConvergenceNote.tsx`, `TimeRangeBrush.tsx` and `Viz.tsx`; `src/lib/countWords.ts`. `brushCaption` leaves, because the caption no longer carries a count.
   - `99af950`: the docs (the P1 packet and the pre-registered walk).
   - New test: `src/components/convergenceShape.test.ts` pins both shapes from source. It has a declared ceiling: it reads source, not the rendered page.
   - Red-proof: I edited the old display `<p>` and a `<path>` back in, and three legs went RED (`expected 24 to be less than or equal to 15`, `expected false to be true`, `not to match /<path\b/`). I then made a wording-only mutation ("Several curves crest near the present…"), and the first-sentence leg went RED (`not to match /\bpeak|\bcrest|near the present…/`). After restoring, 17/17 pass and the tree is clean.
   - Locally: eslint on the changed files passes (exit 0), `npm run typecheck` passes (exit 0), and `npm run build` passes (exit 0).
   - The local full suite through `verify-with-receipt` was NOT run. Its first attempt refused at stamp time because of an untracked walk file I wrote mid-run. The second sat in the fleet heavy-gate queue (position 12 → 7) and was killed by the ~05:20Z low-memory reap before reaching the runner (62437b3f). I did not relaunch it. Per AGENTS.md, CI is the full battery: **CI GREEN on 99af95053f484df7d76147fc4fc00c7702f2428d, run 39374760444.**
   - Codex r1 (read-only, foreground pipe, prompt read back, banner `workdir: C:\dev\skylark\sinusoidal-cycles` checked, head `c90104c` confirmed by the reviewer) found **no defects**. It listed 3 coverage limits of the new test: it sees only `text-[Npx]` sizes, only `<path`/`d3-shape`, and no brush behaviour. All three are disposed DELIBERATE, inside the test's declared source-read ceiling, as the reviewer itself said. The proof is the production read and the walk.
2. **Delivery.** `check-deployed-sha-drift --service sinusoidal-history`: **in-sync, live 99af9505 = head**. Surface read on production with `tmp/measure-shape.mjs`, at 390x664 on `/` and `/?tab=facets&focus=dalio`:
   - the note's largest text went **20px → 14px**;
   - the strip's data paths went **1 → 0**;
   - the strip's years went from [1600, 2050] to [1600, 1700, 1800, 1900, 2050];
   - `main` lines went 161 → 163 and 138 → 140. Against production before the change, the multiset differs by exactly the stated lines: the old display line, the old paragraph and the old caption out; the new paragraph, the new caption and the century labels in.
   - The presence read went **3 → 0** lines.
   - Controls on production: check-open-card-position 2/2, check-closed-card-header 2/2, check-holds-up-line 46/46, check-embed-snippets 42/42, check-entry-folds 320x568 13/13.
3. **Encounter.** blind. The site carries no client analytics by standing choice (W-003, closed 10-03). The bug row is W-003 itself: the decision not to instrument.
4. **Outcome (synthetic).** Walks F1/F2 (`docs/walks/2026-10-20-i055-i059.md`), pre-registered before the push, ran on production 99af9505 with N=1 each:
   - **The note: HELD for both.** F1: "It argues against my friend". F2: "It argues directly against my friend".
   - **The strip: HELD for both.** F1: "an empty gridded box … nothing that bumps". F2: "empty: just year gridlines … no mean curve and no shaded shape".
   - **Controls: HELD.**
   - So I-055 and I-059 each meet their closeWhen. **The rows close at the P5 close, not here.**
   - The RED arm was E1/E2 on 10-19: both NOT HELD on both halves.

### A new finding, recorded and not scored (for the reviewer before the close)

Both walkers independently tapped the **"Now 2000–" range preset** while answering (8). The note invites it ("Drag the time-range below…"). On that window the opened Dalio card becomes "one big gold dome whose top sits about mid-axis, roughly 2025 … It looks exactly like 'peaking right now'" (F2). Several facet rows bow into humps (F1: "for a moment that looked like 'they all crest around now'").

This is the zoom, not the strip's picture, and neither walker read the strip that way. It is the same family as I-054: a window centred on a crest reads as "now". **Proposal for the close:** mint it as I-060, with its own bar and walk, rather than reopen I-059. Candidate levers, none chosen: the "Now" preset's window, or a "now" caveat on a zoomed view. Also recorded again: the Peak calibration phrase "peak again at ~2025" is now the most-lifted phrase in four walks (D2, E1, F2; plus F1 quoting it). That is a candidate row for the close.

### Receipt

USER-VISIBLE: on the home page, the editor's note is now body-size text that opens with its label and the correction ("A selection effect, not convergence."), and the range strip under it shows a plain timeline with century labels instead of a grey mean curve that crested at 2029 — 99af950 [proof: production 390x664 on / and /?tab=facets&focus=dalio: note max text 20px → 14px, strip data paths 1 → 0, presence read 3 → 0 lines, main multiset differs by exactly the stated lines; drift in-sync live 99af9505; walks F1/F2 HELD on both halves] [coverage: none — no client analytics by standing choice (W-003); Search Console sees impressions, not arrivals on a section of / · last good read never · founder+test excluded no] [exposure: blind — no instrument sees an arrival on / by standing choice · bug row W-003]

codexCalls: 1
adversarialReviews: 1 — EXECUTED (Codex r1, read-only, on c90104c: no defects; 3 test-coverage limits disposed DELIBERATE)
hygiene helper: DISPATCHED 2026-10-20T04:45Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-19.md PRESENT (0 drafts; check-wait-justification PASS, check-engineering-zero PASS 0 findings)

### What remains (to the close)

- Close I-055 and I-059 on their halves, citing the walk record.
- Mint I-060 (the "Now" preset zoom).
- Decide whether "peak again at ~2025" gets a row.
- The 10-20 reads due after midnight MT: I-043, I-046, I-027, I-034, I-049.
- Heavy-job note: walks F1/F2 ran side by side. The orchestrator's one-at-a-time rule arrived after both had started. The next walk runs alone.

[standing-rules-hash: 88cc2dc9]

---

# 2026-10-19 (Monday, MT) — sinusoidal-cycles, round 1

## Selection packet

**Outcome:** a first-time reader opens Ray Dalio's card on `/`, scrolls on to "State of the cycles", and never meets the site saying the cycles peak now. **Items:** I-054 (P3, open, nextEvaluation 2026-10-20; the kickoff moved it to today) and I-055 (P3, open, due 2026-10-20). They are one problem on one scroll path: D1 read the opened card's bare last crest as "peaks about now", and both D1 and D2 read the heading a few hundred pixels below it as the site agreeing.

**The user problem in the user's words** (walks D1/D2, `docs/walks/2026-10-18-i054.md` lines 26 and 36): D1: "its last crest is a tall gold peak right at the right edge … For a moment it looked like 'yes, it peaks about now'". D1 and D2 on the editor's note heading: "Notice how the cycles tend to peak near the present." read for "half a second" as the site agreeing (D2) and as leaning toward the friend (D1).

### Section 0

- Primer: `docs/cold-starts/2026-10-18.md` read (newest; there's no 10-19 file). Its first action ran: `check-open-card-position` on production gave **2 of 2 CLEAN** at 390x664 and 320x568 (cards on Facets + Calibrate: tags 0 · phase words 0 · now-lines 0 · current-year labels 0; panel: phase words 0 · in row names 0 · rows with no verdict 0 of 10), exit 0.
- Listener: 🟢 SSE alive (pid 38212, hello 14:28:22Z, replay 0) and `/loop-tick` armed by ScheduleWakeup. The waker ladder is ranks 1-3. Rank 1 fired a wake-shorten at ~14:40Z and was relaunched.
- Codex: GREEN per the kickoff's `[codex-probe:]` line (14:32:32Z). Spawn caveat: pipe-backed stdio gives EPERM. P1 used none.
- CI: `check-ci-status --workflow ci.yml` is GREEN for e582721528 (exit 0). Drift: `check-deployed-sha-drift --service sinusoidal-history` is **in-sync**, live e5827215 = head (exit 0).
- Harness: running 2.1.303 · fleet UNIFORM (28/28) · installed 2.1.303 (SAME). The build moved from 2.1.277 since the tracked record (2026-09-18), and every pane moved with it.
- North Star: retention and word of mouth. Whatever ships here is unmeasured by design (no client analytics, W-003).
- Recs yesterday (`docs/daily/2026-10-18-prelaunch.md` § What remains): one, "one more cycle" on I-054's lever. It's **carrying today → P3**, as a decision rather than the cut (see the evidence below).
- Rotation: `check-cycle-rotation --lane sinusoidal-cycles` gave **exit 2, UNDETERMINED**: "no real-user-evidence artifact on record for sinusoidal-cycles; the registry does not declare which lanes owe one". So no pass is shown as due, and that is not the same as nothing being due.
- Due gates: `check-due-gates-dispositioned --snapshot` gave "0 gate(s) due on/before 2026-10-19" (of 64 ledger items). The snapshot was taken once.
- David's word: none (kickoff board read 14:37Z: no answered, waiting or done-pending card for this lane).

### Evidence

- OBSERVED (walks D1/D2, N = 2, synthetic, Chromium, 390x664, production 60b74b6, 2026-10-18): D1 read the opened card's bare last crest as "peaks about now" for a moment, after reading the verdict first. D2 did not. Both read the editor's note heading as agreement for a moment, before its next line corrected it. **Limits:** synthetic, N = 1 per seed, not real users.
- OBSERVED (source): the opened card's theory curve is drawn over the whole window, `useCycleValues(cycle, startYear, endYear)` in `FacetChart` (`src/components/CycleFacet.tsx:486`), and the window ends at `siteConfig.ts:15` (`end: 2050`). The paired record (`us_world_gdp_share.csv`) runs 1870 to **2022**.
- OBSERVED (arithmetic, `cos(2π·(year − reference_peak_year)/period_years)`; Dalio 75 y, reference peak 1950): Dalio's crests fall in 1950, **2025** and 2100. So D1's "last crest" is the 2025 crest. **The curve's height at the end of the line, per candidate cut:**

  | Where the drawn line ends | Dalio's height there |
  |---|---|
  | 2050 (today) | **−0.50**: past the crest and falling, so the crest sits 25 years inside the edge |
  | 2026, the present | **+1.00**: the line stops on the crest |
  | 2022, the record's end | **+0.97**: the line stops just below the crest, still rising |

  Across the nine paired cycles, the record's end falls at ≥ +0.87 for four (Turchin +0.99, Dalio +0.97, Kondratiev +0.97, Huntington +0.87), and above the midline for three more (Khaldun +0.59, Strauss-Howe +0.50, Schlesinger Jr. +0.31). At 2026, eight of ten sit at ≥ +0.56. So the problem isn't specific to Dalio: a cut at either point ends most of the lines near a crest.
- HYPOTHESIS (the reason the named lever is not recommended): stopping the line at the record's end or at the present doesn't remove the crest D1 read. It turns "a crest inside the picture, then a descent" into "a line that ends at its top". That's the drawn form of "we are at the peak now", so it's predicted to read as a position **more** strongly, not less. The rule that held three times ("claim less, never reword") is followed in words, but it isn't satisfied in the picture: shortening the line puts the crest at its endpoint. Untested. A cut-vs-uncut walk would test it, at the cost of a build and two walkers.
- OBSERVED (source and ledger): I-054's `closeWhen` already names the other arm: "or a recorded decision that the opened card keeps its drawn curve's shape to 2050."
- OBSERVED (source): the I-055 heading is `src/components/ConvergenceNote.tsx:11`, rendered client-side inside `Viz`. Its caveat is the site's headline editorial point. It's carried in prose on `/about` (`page.tsx:62` and `public/about.md:15`), `/colophon` (`page.tsx:104` and `public/colophon.md:27`: "Carry the caveat with you or the rest of the project doesn't work"), `public/llms.txt:9`, the README and CITATION.cff. Only the home page's display line states the pattern **alone**, in 20-24px italic, with the correction in a 13-14px paragraph under it. `/about` and `/colophon` state it with the correction in the same sentence.
- OBSERVED (AGENTS.md): `check-rendered-text` is blind to anything inside `Viz`, so for this note the proof is the rendered `main` innerText line multiset (Playwright, both sides).
- On the kickoff's HYPOTHESIS about `check-holds-up-line`'s denominator: under the recommended plan the opened card's chart doesn't change, so the denominator stays 46. Nothing about the curve's end is read by that script. A cut would also leave the count unchanged (the legs read the verdict and phase-word DOM, not the path), but that's from my reading of yesterday's notes, not today's run.
- MISSING: any real-user encounter (no client analytics by standing choice, W-003). Search Console's next read is I-051, 2026-10-30.

### Permission

Both rows are lane-owned P3 issues: not parked, no open card, no David word on either. I-054's decision arm is written into its own `closeWhen`. **One judgement for the reviewer, on I-055:** the heading is the home page's statement of the site's headline editorial point. The change below keeps the claim and its correction, and changes only which of them the reader meets first in display type. Under the lane's copy class that's mine to make, but it's the most visible sentence the site writes in its own voice. If the reviewer reads it as editorial voice that David or Mark R should approve, I'll post a needs-decision card instead and P3 ships the I-054 decision only.

### Next action — improve

1. **I-054: record the decision, don't cut.** The opened card keeps its drawn curve's shape to 2050. Reason, recorded on the row: the 2025 crest is the drawn theory's own content (reference peak 1950 + 75 years). Both named cuts end the line on that crest (+1.00 at 2026, +0.97 at 2022), where today's window shows it followed by the theory's descent. The verdict sits above the curve, and D1 read it first, then corrected the moment. The remaining read is of the theory's shape, not of a site claim, and the closeWhen's decision arm closes it. Pre-registered for the record: if a later walk reads the full-window crest as a site claim with the verdict *not* read first, the row reopens.
2. **I-055: the user-visible change.** The display line stops stating the pattern on its own. **Recommended, A:** the 20-24px line carries the pattern and its correction together, as `/about` and `/colophon` already do. Wording comes from those two pages, not new text. The paragraph under it loses its now-redundant first sentence, and nothing else changes. **Alternative, B:** swap the two sizes (the correction becomes the display line, the observation goes to the small paragraph), a pure re-order with no word changed. B obeys "never reword" to the letter. A makes the claim-less sentence the one a skimmer lifts. I recommend A because the walkers stopped on the *display* line, and B leaves the observation alone in a sentence of its own. Either way it's checked with the innerText multiset (B: identical multiset, order change only; A: a stated two-line diff).
3. **Substrate:** none owed (`.githooks/pre-commit` is one leg, per the kickoff).

First command (I-055's own readCommand, the presence read that goes from 1 match to 0 under A):

```
git -C C:/dev/skylark/sinusoidal-cycles grep -n "tend to peak near the present" -- src
```

### Acceptance condition

- **I-054:** a dated decision on the row quoting the arithmetic table above and D1's line. The row closes on its `closeWhen`'s decision arm. Regression read: `check-open-card-position` stays 2/2 CLEAN on production.
- **I-055 RED before:** on production at 390x664, the first display-type line of the editor's note states the pattern with no correction in the same element. This is measured as the `aside[role="note"]` first `<p>`'s text, plus the presence grep above (1 match).
- **I-055 GREEN after:** on production, that first line holds the correction (A: the grep gives 0 matches in `src`; B: the correction is in the first `<p>`). The rendered `main` innerText multiset differs from production by exactly the stated lines and no others. A pre-registered cold walk (walk B's prompt + question (7), 390x664, production, two walkers, default + schoolteacher seed, the same as D1/D2) reports nothing in the editor's note read as "peaking now" or the site agreeing, even briefly.
- **Positive controls:** check-open-card-position 2/2, check-closed-card-header 2/2, check-holds-up-line 46/46, check-embed-snippets 42/42, check-entry-folds 320x568 13/13 (the note sits on the first-screen path for phones).
- **Red-proof:** an explicit Edit that puts the old line back makes the presence check and the first-`<p>` read go RED. An Edit back restores them, with the tree clean.

### Delivery and encounter checks

CI green → `check-deployed-sha-drift --service sinusoidal-history` in-sync → the first-`<p>` read and the multiset on production → the walk. At this traffic level a real encounter is unreadable (no analytics), so the exposure line will be `blind`, naming W-003's standing choice.

**USER-FACING: yes.** Paths: `src/components/ConvergenceNote.tsx` (home page, served to every reader of `/`). Possibly `public/llms.txt:9` if its wording is meant to mirror the home line (to be read in P3; `/about` and `/colophon` are the source of the wording, not changed). `continuity/items.json` (I-054 decision, I-055 notes) and `docs/walks/` are internal.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: none. Read: `check-due-gates-dispositioned --snapshot` gave "0 gate(s) due on/before 2026-10-19" (of 64 ledger items).
- (b) Owed child rows: none. Read: the kickoff gave "0 of 754" owner-stamped rows in skylark-site's ledger.
- (c) CROSSED state reads: none. Read: in the kickoff state block, stale-actionable was 0 of 16, missingLinkedCommits was NOTHING SWEPT (0 of 0; not a clean read), and queued rows were 0. Not crossed, but noted: key numbers "no list yet" (`docs/key-metrics.json` absent), and rotation exit 2 UNDETERMINED (above).

One prior-day retro finding bears on the choice (Q6, "full checker output pasted into context"): today's checker runs went to a scratch file and only the tail was read.

---

## P3

[P3 — Product-work loop]

Manager review 286686b2: APPROVE (I-054 decision, no cut; I-055 option A), with three fixes, all applied: (1) I-054's reason calls the crest this site's construction, disclosed on the card, with the verdict above it; (2) the display line uses /about's "nearly every cycle"; (3) the walk scores the note and the range chart as separate halves.

**Action (improve), two legs on one outcome:**
- **I-054 — CLOSED** on its closeWhen's decision arm (the opened card keeps its drawn curve's shape to 2050). The reason, with the arithmetic (Dalio −0.50 at 2050, +1.00 at 2026, +0.97 at 2022), is on the row. Reopen trigger: a cold walk reads the full-window crest as a site claim with the verdict NOT read first. E1/E2 both read the verdict first, so it is not met.
- **I-055 — SHIPPED, NOT HELD, stays OPEN.** `5b30410`: the editor's note display line went from "Notice how the cycles tend to peak near the present." to "Nearly every cycle peaks somewhere near the present. That is not evidence the theories converge - it is a selection effect."

## What a reader sees differently (live b0b0aff)

The large italic line above the range chart on `/` now carries its own correction. Before, the correction sat in the small paragraph under it.

## The four states

1. **Implementation:** `5b30410` (one file, src/components/ConvergenceNote.tsx). Local: built `main` innerText on `/` and `/?tab=facets&focus=dalio` differed from production by exactly the two stated lines (161 and 138 lines, counts unchanged); 5 controls passed on the local build; red-proof by Edit (the presence read gives 1 match with the old line back, 0 restored, tree clean); eslint clean. Gate: verify-with-receipt `npm test` on b0b0aff, 39 files / 373 tests passed. Codex r1 read-only on 5b30410: no defects (STATIC; banner workdir C:\dev\skylark\sinusoidal-cycles checked).
2. **Delivery:** CI GREEN on b0b0aff (run 39281087099, queued ~26 min behind GitHub Actions "degraded_performance"). `check-deployed-sha-drift --service sinusoidal-history` in-sync, live b0b0aff5 = head. On production, the note's first `<p>` reads the new line on both paths, and built-vs-production differs by 0 lines. Production controls: check-open-card-position 2/2, check-closed-card-header 2/2, check-holds-up-line 46/46, check-embed-snippets 42/42, check-entry-folds 13/13.
3. **Encounter:** blind. There is no client analytics on this site by standing choice, so a reader who sees the note leaves no trace (bug row W-003).
4. **Outcome:** open. The synthetic walks E1/E2 (`docs/walks/2026-10-19-i055.md`) read NOT HELD on both halves. Both lifted the display line's first clause as the friend's claim before its correction landed, and both called the range chart's grey mean bump near 2025–2035 the page's strongest "peaking now" picture. Synthetic N=2, not real users.

USER-VISIBLE: the editor's note's large line above the range chart now states its correction in the same sentence ("Nearly every cycle peaks somewhere near the present. That is not evidence the theories converge - it is a selection effect.") — 5b30410 [proof: production first line of the note "Notice how the cycles tend to peak near the present." on e5827215 → the new line on b0b0aff, on / and /?tab=facets&focus=dalio at 390x664, check-deployed-sha-drift in-sync live b0b0aff5, built-vs-production 0 lines differ] [coverage: none, no client analytics on this site · last good read never · founder+test excluded no] [exposure: blind — no client analytics on this site, a reader who sees the note leaves no trace · bug row W-003]

codexCalls: 1 (r1, read-only review of 5b30410)
adversarialReviews: 1 — EXECUTED (Codex r1 on 5b30410, no defects; head sha 5b304107 confirmed by the reviewer)
hygiene helper: DISPATCHED 2026-10-19 ~09:02 MT · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-19.md PRESENT (18 lines; no findings: check-wait-justification PASS, check-engineering-zero PASS)

## What remains (to the close)

- **I-055 stays OPEN on both halves.** The reword has now failed the "even briefly" bar twice in a row on the same element (D1/D2 on the old heading, E1/E2 on the new one), so per the stop-patching rule the next lever changes shape rather than wording again. Candidate for the next cycle (not decided here): the display line no longer opens with the pattern at all. It leads with the correction, or the pattern leaves display type. And the range chart's mean curve, which both walkers named as the strongest "peaking now" picture, gets its own lever (remove the mean curve, or say beside it what the bump is). Propose minting the range-chart half as its own row at the close, so each lever has its own bar.
- E2: the "EDITOR'S NOTE" label sits UNDER the display line, so the line read as the site's headline before it read as a note. Same element, same next cycle.
- Recorded for I-043 (words) and for the Peak calibration "~2025" phrase: in the walk doc.
- No process left running from P3: next start stopped by verified PID (42884, 62896), port 3123 free; the Codex r1 process exited (0 codex.exe for this worktree); both walkers closed their browsers.

<!-- findings:begin -->
- The P1 packet recommended option A over B because "the walkers stopped on the display line". E1/E2 show A still fails: a display sentence that OPENS with the pattern is lifted before its correction lands, even inside the same sentence. The packet's premise that "the claim-less sentence is the one a skimmer lifts" was wrong. A skimmer lifts the first clause.
- The range chart's grey mean curve (unchanged today) was named by both walkers as the strongest "peaking now / converge" picture on the page. D1 named it on 10-18. It is a bigger driver than the note's words, and it sits directly under the note.
<!-- findings:end -->

---

## Close

[P5 — Delta-only close]

ACTION: DEFERRED — both legs shipped as approved (I-054 closed on its decision arm; I-055's 5b30410 live), but I-055's acceptance condition is not met: walks E1/E2 read the note NOT HELD · trigger 2026-10-20 (pre-registered walk on a shape change) · item I-055 · P3 e0769359

[standing-rules-hash: 88cc2dc9]

The manager review (c4547c6f) reads the action as COMPLETED against the approved packet with the outcome open. I write DEFERRED because this line's own definition makes COMPLETED mean the acceptance condition was met, and I-055's walk leg was not.

hygiene draft: 0 lines — 0 accepted · 0 amended · 0 rejected (inputs none; READ-MUTATED none, 0 reads guarded). check-wait-justification: PASS, 32 of 64 rows carry waitJustification, 0 warn. check-engineering-zero --project sinusoidal-cycles: PASS, 0 findings, 0 unreadable (helper).
Due gates: `check-due-gates-dispositioned` (no flag): "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-19), 0 due.

State since P3 (e0769359): production serves 2f17c43e, which contains 5b30410 (manager review's drift read: in-sync). The ledger edits below are new since P3. Nothing else changed for users.

Ledger delta (continuity-edit, continuity/items.json, 64 → 65 rows):
- I-054: CLOSED 2026-10-19 on its closeWhen's decision arm (recorded at P3; the note carries the arithmetic and the reopen trigger).
- I-055: stays OPEN, narrowed to the note. Title and closeWhen narrowed (range-chart half → I-059). readCommand re-pointed to the display line that read NOT HELD (`git grep -n "Nearly every cycle peaks somewhere near the present" -- src`, 1 match today). The manager review found that the old grep returned 0 after the ship and read as progress. Notes record 5b30410, the production read, and walks E1/E2. nextEvaluation 2026-10-20 (unchanged).
- I-059: MINTED, the range chart's grey mean curve (caption src/lib/countWords.ts:48), read as "the cycles line up now" by D1 (10-18) and by E1 and E2 (10-19). readCommand: `git grep -n "mean of all" -- src` (2 matches today). nextEvaluation 2026-10-20, with its own pre-registered walk.

Receipt: P3's line stands unchanged (e0769359). No outcome read exists beyond the synthetic walks, and the exposure is still blind (W-003).

Pending reads: 2026-10-20 I-055 (walk on the shape change) and I-059 (its own walk), plus I-043, I-046, I-027, I-034, I-049; 2026-10-23 I-056; 2026-10-27 I-057, I-058; 2026-10-30 I-051 (Search Console).

UNRESOLVED: none.
