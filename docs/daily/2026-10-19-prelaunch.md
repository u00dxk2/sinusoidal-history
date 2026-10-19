[P1 — Evidence and choice]

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
