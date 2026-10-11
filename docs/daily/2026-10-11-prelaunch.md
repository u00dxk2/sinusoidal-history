# Daily — sinusoidal-cycles — 2026-10-11 (Sunday, MT)

Cycle 6 of the continuous session that began 2026-10-10 (cycles 1-5 are in `docs/daily/2026-10-10-prelaunch.md`).

## Cycle 6 — P1 selection packet

[P1 — Evidence and choice]

**Outcome:** on every cycle page, the line drawn on the curve IS the record the verdict is judged on, and the key says so. Today two of the nine draw a different record from the one their verdict counts.
**Item:** the cycle-6 lead (7add25c3), building on I-033. **I-035 is minted at build time.**

**The user problem (HYPOTHESIS, cycle-5 manager review 7447a3fb, on Kondratiev):** "a reader may take the drawn line for the record the verdict is judged on." The bar's trust half: "someone actually checked" fails if the picture shows one record and the verdict another.

### Evidence

- OBSERVED (source read, all nine pairings): `scripts/spectral/analysis-manifest.yaml:23-105` names each judged record exactly (csv, value_column, transform, truncate_min_year). `src/data/series.json` names what the page draws (data_file, value_column, transform). Population: the nine primary pairings.
  - **Seven match exactly** (same file, column, transform, no truncation): Schlesinger Jr., Perez, Huntington, Dalio, Strauss–Howe, Modelski, Khaldun.
  - **Kondratiev differs:** it draws `us_tfp_growth.csv` / `tfp_growth_5yr_avg_pct` (the 5-year rolling average). The verdict counts `us_tfp_growth_annual.csv` / `dtfp_util_pct` (annual, unsmoothed). The manifest bans the smoothed file from inference (`:134`).
  - **Turchin differs:** it draws `wid_top1_wealth.csv` from 1820, including the five sparse pre-1913 points. The verdict counts the same column from 1913 only (`truncate_min_year: 1913`).
- OBSERVED (live frame, cycle 5's read, `tmp/c5-frames-live/kondratiev-390x844.png`): the first screen shows the curve with the 5-yr line keyed "TFP growth · 5-yr, rescaled to the curve's height". Directly below, the box reads "The record this verdict is judged on, US TFP growth (annual, unsmoothed), runs 77 years". The two are on one screen and name different records.
- OBSERVED: `src/lib/seriesOverlay.ts` draws whatever `seriesForCycle` returns, the chart's series. Nothing on the page draws the annual TFP or the 1913+ cut, though both files are already in `public/data/`.
- HYPOTHESIS: drawing the judged record will change the visible shape on two pages. Kondratiev's annual TFP is much noisier than the 5-yr; Turchin loses its five pre-1913 points (the line starts at 1913). Neither should change the fold, because the figure's height is fixed; the key's wording might.
- MISSING: any real reader (no client analytics; GSC last whole read 2026-09-09, 59 impressions, 0 clicks). The 10-13 W-004 walk already carries the Kondratiev question; this change lands before it, so the walk reads the fixed page.
- Rotation: `check-cycle-rotation` exit 0 for 2026-10-11 ("no product-love cycle picks this lane today"). Due gates: 0 on/before 2026-10-11 (snapshot taken now, 40 rows). Answered cards: none.

### Permission

Lane-owned figure and key copy on the cycle pages. It reads `public/data/us_tfp_growth_annual.csv` and `wid_top1_wealth.csv` and writes no data. It reads the manifest; it does not touch `public/data/spectral/` or the manifest. The verdict wording is unchanged; the lead forbids fitting it to the line, and this changes the line instead. `judgedOn` is not touched. No row is parked, and no card is open.

### Next action

**Kind:** improve. Make the figure draw the judged record on every paired page:
1. A `judgedRecord(cycle)` in `src/lib/seriesOverlay.ts`: the series' own file, column and transform where the verdict counts it unchanged (seven pages), and the judged file, column and start year for Kondratiev and Turchin. These live beside `testedSeriesNote` in `src/lib/testedSeries.ts`, so the "two labels" facts stay in one place.
2. The key names that record and says what it is: "<record name>, rescaled to the curve's height: the record the verdict is judged on". The two pages use the judged name (`testedSeriesNote.name`, e.g. "US TFP growth (annual, unsmoothed)"). Wording is final only after a 320x568 fold read.
3. The SVG aria-label says the same.

The test's oracle is the frozen manifest itself. It parses `analysis-manifest.yaml`, builds each primary pairing's line (csv, column, transform, truncate_min_year, then the 1600–2050 window, then min-max), and compares it with the points the server-rendered page draws, for all nine. So the page cannot draw a record the verdict did not count.

```
node C:/dev/skylark/sinusoidal-cycles/tmp/c5-first-screens.mjs https://sinusoidalhistory.com C:/dev/skylark/sinusoidal-cycles/tmp/c6-frames-before 390 664
```

(Baseline frames before the edit; the same script reads after.)

### Acceptance condition (observable, live)

1. For all nine paired pages, the drawn points equal the manifest's judged record (test, oracle = the manifest), and the key names that record. On Kondratiev the line is the annual series (1948 onward, unsmoothed); on Turchin it starts at 1913.
2. After deploy, nine first screens at 390x664 read as frames: curve, the judged record's line, a key naming it, and the verdict headline, with no scrolling. Turchin and Kondratiev are also read at 390x844.
3. The fold gate reads 13 of 13 at 390x664 and at 320x568 on production.
4. The verdict box text is byte-identical. On the rendered-text line multiset, only key lines change: removed lines are the old key lines, added lines are the new ones, and nothing else.
5. CI is green (the full gate) and the deploy row reads live. Locally: the touched test files.

### Delivery and encounter checks

- Delivery: the frames and fold gate on production after the deploy row reads live.
- Encounter: blind. The 2026-10-13 W-004 walk's Kondratiev step ("is the drawn line the record the verdict is judged on?") reads the fixed page, N=1 synthetic.

### USER-FACING: yes

Paths: `src/lib/seriesOverlay.ts`, `src/lib/testedSeries.ts` (the judged-record spec for the two cuts), `src/app/(app)/cycles/[id]/page.tsx` (the key and aria-label), tests (`seriesOverlay.test.ts` re-pointed to the manifest oracle). No `public/*.md` mirror carries the figure.

**Second items, if time, and only once the first has shipped and been read:** I-006 (the og route's "Ten long-wave cycles", `og/route.tsx:191`, due 10-16) and I-031 (the 900 px Kondratiev figure, headed browser first, due 10-16).

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: none — read: `check-due-gates-dispositioned --snapshot` at ~00:40 MT 2026-10-11, "0 gate(s) due on/before 2026-10-11" (40 swept).
- (b) Owed child rows in the orchestrator's ledger: none — read: last kickoff "rows owed to you", 0 of 749 (2026-10-11T02:24Z; this cycle's lead carried no kickoff state block).
- (c) State reads marked CROSSED: none — read: the last kickoff state block. Not measured, not clean: missingLinkedCommits 0 of 0; key-metrics has no list.

[standing-rules-hash: 88cc2dc9]

## Cycle 6 — P3 product-work loop

[P3 — Product-work loop]

**Action (kind: improve).** On every cycle page, the line drawn on the curve is now the record the verdict right below it is judged on, and the key says so: "<record>: the record the verdict counts, rescaled to the curve's height". The two pages that differed now draw the judged record:
- Kondratiev draws the annual, unsmoothed TFP figures, not the 5-year average.
- Turchin draws the wealth share from 1913, not from 1820.

The verdict wording and `judgedOn` are untouched. Link to the core experience: "someone actually checked" holds only if the picture shows what was checked.

**The manager review (9b068bd8), checked:**
- HYPOTHESIS, measured and right. Read cold, Kondratiev's "Why two labels" sentence ("…the version the interactive chart draws") sat under a figure that now draws something else. Turchin's "rougher estimates … that the chart joins into one line" described a line the page's figure no longer draws. Both are rewritten to name which figure draws what; every phrase the I-024/I-028 tests pin is kept. The before and after text, as the review asked:
  - Kondratiev, added after "…which is the version the interactive chart draws.": "The figure at the top of this page draws the annual figures instead, because those are what the verdict counts."
  - Turchin, "…which starts in 1913 with the Saez–Zucman series." became "…which starts in 1913 with the Saez–Zucman series, and that is what the figure at the top of this page draws."; and "…that the chart joins into one line" became "…that the interactive chart joins into one line".
- SUGGESTION taken: acceptance item 4 widened to "only key lines and the two Why-two-labels paragraphs change"; this held live (below).

**1. Implementation.**
- Commits `f5cb55b` (the judged record, key, paragraphs, manifest-oracle test, I-035) and `d4ea3e4` (Codex r1 fix).
- `judgedCut()` in `src/lib/testedSeries.ts` is now the one decision for "is this page's verdict judged on a cut", used by the figure, the meta description and the page's notes.
- The test oracle is the frozen manifest: `seriesOverlay.test.ts` parses `analysis-manifest.yaml` (9 series, 9 primary pairings), rebuilds each judged line with its own parser, and compares it with the points the server-rendered page draws.
- Gates: CI ran the full suite on `d4ea3e4`, GREEN. Locally, the four touched test files passed 122/122 at `d4ea3e4`. Once fleet load eased (CPU 58%, from 100%), the local full suite passed 275/275 at HEAD `914bfb8` (docs-only past `d4ea3e4`) under `verify-with-receipt` in 27.7 s. That bears out I-034: the earlier red runs were load. Typecheck green. Lint: 0 errors (3 warnings in gitignored `tmp/` scripts).
- Red-armed, each restored afterwards:
  - Kondratiev pointed back at the 5-yr file failed 2 of 15.
  - Drawing Turchin without its 1913 start failed Turchin (117 points vs the 112 the verdict counts).
  - The meta description reverted to `series.name` failed the description test.
- Declared ceilings:
  - The manifest parse is format-specific, not a YAML validator; its counts plus the per-pair assertions prevent a vacuous pass (Codex r1 read this).
  - The fold gate measures the verdict headline, not the line or key; frames cover those.
  - The tests do not see whether a reader takes the line for the judged record (that is the W-004 question).

**2. Delivery.**
- CI: GREEN on `d4ea3e4` (`check-ci-status --workflow ci.yml --wait`: "1 completed non-scheduled success(es) for HEAD, 0 failures, 0 pending").
- Deploy: `check-deployed-sha-drift --service sinusoidal-history`: "in-sync · live d4ea3e4f → head d4ea3e4f".
- Live positions (Playwright, sinusoidalhistory.com): verdict headline on the first screen 10/10 at 390x664 and 390x844; curve 243–331; key 352–416.
- Fold gate on production: "OK: 13 of 13" at 390x664 and at 320x568. The tightest legs are Perez and Modelski at 320x568, with 6 px to spare (23 px before; the longer key takes one more line at 320).
- Live text multiset against the pre-change production snapshots: on each of the nine paired pages, only the key line changed, plus the Why-two-labels paragraph on Kondratiev and Turchin. All other lines are identical, and fathers-and-sons is unchanged.
- Live meta descriptions:
  - Kondratiev: "A 54-year sinusoid anchored to a 1973 peak, plotted against US TFP growth (annual, unsmoothed). The paired record is too short to test the period."
  - Turchin: "A 150-year sinusoid anchored to a 2020 peak, plotted against US top 1% wealth share (1913 onward). The paired record is too short to test the period."
  - Logged on W-005 before its click-through read.
- Frames read live:
  - Kondratiev 390x844: the noisy annual TFP line, keyed "US TFP growth (annual, unsmoothed): the record the verdict counts, rescaled to the curve's height", directly above "The record this verdict is judged on, US TFP growth (annual, unsmoothed), runs 77 years".
  - Turchin 390x664: the line begins at 1913, keyed "US top 1% wealth share (1913 onward): the record the verdict counts…".
  - Strauss–Howe 390x664: a same-series key, "V-Dem libdem index: the record the verdict counts…".

**3. Encounter.** Blind: the site has no client analytics by standing choice. The nearest read is the 2026-10-13 W-004 walk, whose Kondratiev step already asks "is the drawn line the record the verdict is judged on?" (N=1, synthetic). Bug row I-035.

**4. Outcome.** Open. No real reader observed.

**Review.**
- Codex r1, read-only, on `f5cb55b`; banner workdir matched.
  - One P2, CONFIRMED against `cycleRoutes.ts:140` and fixed in `d4ea3e4`: the meta, og, twitter and JSON-LD WebPage descriptions still said "plotted against US TFP growth (5-yr rolling)" (and the whole wealth series on Turchin).
  - Claims: the key, the aria-label and both rewritten paragraphs HOLD.
  - Fidelity: all nine records match the manifest (file, column, transform, start year).
  - Nothing now says a test ran.
- Codex r2, read-only, on `d4ea3e4`; banner workdir matched. No findings: `judgedCut()` behaves the same for all ten cycles, there is no import cycle, the descriptions are 146 and 149 characters, and no remaining surface contradicts the figure.
- Sibling sweep for the r1 class (a surface naming a record separately from the figure's decision): Grep `testedSeriesNote\(|series_id !==|series\.id === verdict|\.series_id\)` over `src/` (non-test).
  - 5 call sites: 3 now go through `judgedCut`.
  - `holdsUp.ts:62-65` makes the equivalent decision inline. Left unchanged on purpose: it is correct, and I-032 is reviewed and live.
  - `CrossGridList.tsx:14` names each cross-grid verdict's own series, which is correct.

USER-VISIBLE: On Kondratiev and Turchin the line drawn on the curve is now the record the verdict below it is judged on (annual TFP figures; the wealth share from 1913), and every paired page's key says "the record the verdict counts" — d4ea3e4 [proof: before Kondratiev drew the 5-year average and Turchin the series from 1820 while each verdict counted a different record → after the drawn line, the key and the verdict name the same record; live frames, fold gate 13/13 at 390x664 and 320x568, and the text multiset read on sinusoidalhistory.com after Render live d4ea3e4f] [coverage: Search Console (who is shown a page; cannot see on-page reading) · last good read 2026-09-16 · founder+test excluded no] [exposure: blind — no client analytics on this site, so a reader's reading of the figure leaves no trace · bug row I-035]

codexCalls: 2
adversarialReviews: 2 — EXECUTED
hygiene helper: DISPATCHED 2026-10-11 ~00:55 MT · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-11.md PRESENT (0 draft lines; check-wait-justification PASS with 2 info lines, I-031 and I-034; check-engineering-zero PASS for this lane)

**Ledger.**
- I-035 minted (`continuity-edit --mint`) and set to `monitoring`: linkedCommits f5cb55b and d4ea3e4; waitJustification until 2026-10-13.
- W-005: the meta-description change logged with before and after text.

**What remains.**
- On this outcome, nothing eligible today: the encounter read is the 10-13 walk.
- The lead's second items were not started: I-031 (Kondratiev figure at 900 px, headed browser first) and I-006 (the og card's hard-coded "Ten long-wave cycles", `og/route.tsx:191`). Both are due 10-16 and carried to the next cycle; this one ran to ~01:50 MT on a loaded machine.

[standing-rules-hash: 88cc2dc9]

## Close (cycle 6)

[P5 — Delta-only close]

ACTION: COMPLETED · item I-035 · P3 86d8a122

- **State since P3.** Manager review c7ccc6bb reads COMPLETED, defects none. The manager read the live Kondratiev page and the Turchin frame independently; deploy is in sync at `914bfb89` (docs-only past `d4ea3e4`). After the P3 post, the local full suite was run once more at low load: 275/275 at `914bfb8` under verify-with-receipt; P3 was posted with that receipt.
- **Ledger delta (cycle 6):**
  - I-035 minted and set to `monitoring`, with linkedCommits f5cb55b and d4ea3e4 and waitJustification until 2026-10-13.
  - W-005 has the two-page meta-description change logged, with before and after text, ahead of its 11-04 read.
  - W-004 notes that its Kondratiev step now reads I-035; the expected answer is yes.
  - I-031 and I-006 got carry notes. Both were named as second items, not started this cycle, and are still due 2026-10-16.
  - No row closed, re-dated or held.
- hygiene draft: 0 lines — 0 accepted · 0 amended · 0 rejected (`tmp/hygiene-draft-sinusoidal-cycles-2026-10-11.md`; inputs all `none`).
  - READ-MUTATED: none, 0 reads guarded.
  - check-wait-justification, re-run after I-035's wait was written: "RESULT: PASS — 28 of 41 row(s) carry `waitJustification`; 0 warn / 2 info". The two info lines are I-031 and I-034, structural `waitingFor` fields with no wait contract (shadow arm, not findings).
  - check-engineering-zero (helper's run, ~00:51 MT): "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable". No lockfile changed since.
- **Due-gate verification:** `check-due-gates-dispositioned` (no flag): "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-11, 0 rows).
- **Receipt:** P3's receipt (86d8a122) still holds. Nothing new is written.
- **Evidence frames** are machine-local in gitignored `tmp/`: `tmp/c6-frames-before/`, `tmp/c6-frames-after/` and `tmp/c6-frames-live/`. To re-capture: `node tmp/c5-first-screens.mjs <origin> <outDir> <w> <h>` (named on the manager's note).
- **Pending reads:**
  - 2026-10-13: W-004 cold walk (closes I-029, I-030; reads I-033 and I-035).
  - 2026-10-16: I-031 and I-006 (carried, not started).
  - 2026-10-20: I-027 and I-034.
  - 2026-11-04: W-005 and I-032's encounter read.
  - 2026-12-01: I-025 (David).
- **Today panel:** written with `--date 2026-10-10`, per the orchestrator's standing rule tonight.
- **Primer:** `docs/cold-starts/2026-10-11.md`, banner rewritten in place for cycle 6.
- **UNRESOLVED:** none.

codexCalls: 0 (this phase; cycle 6's two review runs are counted on the P3 post)

[standing-rules-hash: 88cc2dc9]

## Cycle 7 — P1 selection packet

[P1 — Evidence and choice]

**Outcome:** on a laptop-width window, the spectral figure shows at its cut edge that it goes on, and offers a way to see the rest that works with a plain mouse. The words above it say only what is true for the pointer in hand.
**Item:** I-031 (open, due 2026-10-16), the cycle-7 lead (bc6c5881).

**The user problem, in the walker's words (W-004, 2026-10-09, `docs/walks/2026-10-09-w004.md:44, :149`):** "196 px of the Kondratiev figure is cut off with no visual edge cue. 'Scroll sideways' with a plain wheel scrolls the page, not the figure (Shift+wheel works)."

### Evidence

- OBSERVED (headed Chromium on this Windows machine, 900x900, live sinusoidalhistory.com, tonight; `tmp/c7-figure-900.mjs`, frames in `tmp/c7-frames-before/`). Population: every page that renders a FigureScroller, i.e. the nine paired cycle pages (`page.tsx:641` is the only call site; fathers-and-sons renders none).
  - **Overflow:** 196 px on 9 of 9 (704 of 900 visible).
  - **Scrollbar:** **a 15 px horizontal scrollbar IS drawn on 9 of 9**, with arrow buttons, along the figure's bottom edge. The walk's "no scrollbar" was a headless artifact; the walk itself flagged that as UNREAD. In the Kondratiev frame the bar sits ~480 px below the figure's top. It is on screen once the whole figure is in view, but not where the cut is (the top-right legend).
  - **Edge cue:** none on 9 of 9.
  - **Plain wheel:** a 200 px wheel over the figure moved the page 200 px and the figure 0 px on 9 of 9.
  - **Cue shown:** "Scroll sideways for the whole figure, or click it to open it full size" on 9 of 9. It is true for the scrollbar, Shift+wheel and a trackpad, and not for a plain wheel, which is what most mouse users try first.
  - **Kondratiev frame, read as an image:** the legend reads "series (solid) · 54y" at the cut; the right ~22% of the figure is out of view with nothing marking the cut.
- OBSERVED (source): the scroll instruction is stated on ONE source surface, `page.tsx:634-643` (touch cue, mouse cue, and the scroller's aria-label "Spectral-verdict figure, scrolls sideways"). One script pins its text: `scripts/check-figure-cue.mjs:44-45`.
  - Grep for `Scroll sideways|Swipe sideways|scrolls sideways` over `src/` found those 3 lines plus a code comment.
  - The same grep over `public/*.md` and `public/llms.txt` found 0 matches, so no prose mirror states it. The retro's "move every surface together" therefore covers the cue, the aria-label and the check script.
- HYPOTHESIS: an edge cue (a fade on the clipped side plus a visible arrow button that scrolls the figure) is the version that works for every pointer. A plain-mouse reader gets a clickable target exactly where the cut is. Touch keeps the swipe. The wheel keeps scrolling the page, which is deliberate: hijacking the wheel would trap a reader scrolling past the figure.
- MISSING: any real reader (no client analytics; GSC last whole read 2026-09-09: 59 impressions, 0 clicks). The 10-13 W-004 walk's 900 px step is the nearest read, and this lands before it.
- Rotation: exit 0 for 2026-10-11 (no pass due). Due gates: 0 on/before 2026-10-11 (`--print`, 41 swept; this morning's snapshot stands, not retaken). Answered cards: none (00:40 MT read).
- Prior-retro finding that bears on this: "a claim … lived on more than one surface, and the fix reached only one" (10-11, sweep shipped for the record name). It applies to the cue and its aria-label here.

### Permission

Lane-owned component and copy. I-031 is `open`, nothing is parked, and no card is open. FigureScroller was "don't-touch" only for 10-09; the 10-10 manager review scoped the click-to-SVG as deliberate and out of scope, and it stays as is. Not touched: `public/data/spectral/`, `HashLink.tsx`, the /state bands, `judgedOn`, verdict wording. FigureScroller reaches every reader of the nine pages, so P3 runs a cross-family Codex review.

### Next action

**Kind:** improve. In `src/components/FigureScroller.tsx`:
- **Measure.** Read overflow (`scrollWidth > clientWidth`) and the scroll position. Show the cue only while the figure actually overflows, so at lg+ (where the figure is drawn whole) nothing shows: data-driven, not a breakpoint.
- **Edge cue.** A fade on each clipped side, plus a 44 px arrow button on that side that scrolls the figure by most of its visible width. The buttons sit outside the figure's link, so a click on them never opens the SVG, and they disappear at the end they point to.
- **Mouse cue words.** Replace "Scroll sideways for the whole figure, or click it to open it full size" with words true for a mouse, naming the arrow at the edge and keeping the click. The touch cue ("Swipe sideways…") stays.
- **Aria-label.** "Spectral-verdict figure, scrolls sideways" stays true; the buttons get their own labels.
- **Check script.** `check-figure-cue.mjs` moves with the words, in the same commit.

```
node C:/dev/skylark/sinusoidal-cycles/tmp/c7-figure-900.mjs https://sinusoidalhistory.com C:/dev/skylark/sinusoidal-cycles/tmp/c7-frames-before 900 900
```

(Already run: that is tonight's "before". The same script reads the "after".)

### Acceptance condition (observable)

1. Headed at 900x900 on all nine pages, before and after: overflow (unchanged, 196 px), scrollbar (unchanged), and **edge cue visible at the cut: no → yes**. A click on the right arrow moves the figure and does not open the SVG. At the right end the right arrow is gone and the left one shows.
2. Every cue line shown to a mouse is true for a plain mouse; the frame is read as an image. The touch cue at 390 is unchanged.
3. At 1440x900 (figure drawn whole, no overflow) no edge cue and no cue line show, on all nine.
4. At 390x664 (touch) the swipe still moves the figure. The edge cue shows at the cut, and the Back-restores-place behaviour (I-018) still holds: `check-verdict-landing` stays green on production.
5. `check-figure-cue` and `check-entry-folds` pass on production after deploy. The rendered-text multiset changes only in the cue line(s) and the new button labels.
6. Typecheck, lint, the touched tests and CI are green; the deploy row reads live; then live frames.

### Delivery and encounter checks

- Delivery: the headed 900x900 read and the 390 and 1440 reads against production after the deploy row reads live; frames named in the close.
- Encounter: blind. The 10-13 W-004 walk's step (2) ("About 900x900 with a mouse … what did the cue tell you to do, and could you see the whole figure?") reads it, N=1 synthetic.

### USER-FACING: yes

Paths: `src/components/FigureScroller.tsx`, `src/app/(app)/cycles/[id]/page.tsx` (cue words), `scripts/check-figure-cue.mjs`, and a test for the overflow/arrow logic. No `public/*.md` mirror states the instruction (grep above).

**Second, if time:** I-006 (the og card's "Ten long-wave cycles of history", `src/app/og/route.tsx:191`), derived from `cycles.length` and pinned by a test, taken between the I-031 push and its CI read.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: none. Read: `check-due-gates-dispositioned --print` at ~02:30 MT 2026-10-11, "0 gate(s) due on/before 2026-10-11" (41 swept). Today's snapshot (taken ~00:40 MT) is CURRENT and was not retaken.
- (b) Owed child rows in the orchestrator's ledger: none. Read: last kickoff "rows owed to you", 0 of 749 (2026-10-11T02:24Z).
- (c) State reads marked CROSSED: none. Read: the last kickoff state block. Not measured, not clean: missingLinkedCommits 0 of 0; key-metrics has no list.

[standing-rules-hash: 88cc2dc9]

## Cycle 7 — P3 product-work loop

[P3 — Product-work loop]

**Action (kind: improve).** On the nine paired cycle pages, a spectral figure cut by a narrow window now shows that it goes on. Each clipped side has a fade and an arrow button near the top, where the cut legend is; a plain mouse can click it. The arrows sit outside the figure's link, so a click never opens the SVG. Both arrows stay on screen while the figure overflows, and the unavailable one is dimmed, aria-disabled and inert. Nothing shows where the figure fits (lg+). The mouse cue reads "Wider than this window: use the arrows at its edges to see the rest, or click it to open it full size"; the touch cue and the click-to-SVG are unchanged. Link to the core experience: the figure is where a reader checks a claim against its record, and a reader who cannot tell it is cut misses the half that holds the target period.

**Second item, shipped during the CI wait:** I-006's og part. The main share card's "Ten long-wave cycles of history, on one shared axis." now derives from `cycles.length` (`src/lib/countWords.ts`), pinned by a test. The served text is unchanged.

**The manager review's points (cc219970), each checked:**
- HYPOTHESIS, right: the scroller root is the scroll box, so the fade and arrows sit in a non-scrolling wrapper. `overflow-x-auto lg:overflow-visible lg:-mx-[98px]` stay on the scroller.
- HYPOTHESIS, right: overflow is measured with a ResizeObserver (on the scroller and its children) plus the scroll event, not once at mount.
- HYPOTHESIS, measured: the cue block stays `lg:hidden`, and the arrows track measured overflow. At 1000x900 (between 768 and 1023) the cue shows on 9/9; at 1440 overflow is 0 and nothing shows on 9/9.
- SUGGESTION taken: "the arrows at its edges", never "the right edge".
- SUGGESTION taken: the arrows sit at the top, beside the cut legend.
- "Keep the wheel off the figure": kept. A plain wheel still moves the page (200 px) and the figure 0 px.

**1. Implementation.**
- I-031 commits: `88914e2` (edge cue, cue words, check legs, unit test), `9b41736` (r1), `d31f301` (r2), `03e74e9` (shape change, r3), `8d2aa3f` (r4), `356214b` (r5).
- I-006 commit: `18e79a4`.
- Gates:
  - CI GREEN on `356214b` and on `18e79a4` (full suite).
  - Locally: typecheck green; lint 0 errors (3 warnings in gitignored `tmp/` scripts); the touched unit tests pass.
  - The local full suite passed 283/283 at HEAD `b6a0d2e` (docs-only past `18e79a4`) under `verify-with-receipt`, in 5.1 s at CPU 4% (I-034: the load decides, not the code).
- The checks, run locally on the final build:
  - `check-figure-cue` 189/189.
  - `check-verdict-landing` 490/490: Back still restores the figure's place (I-018).
- Red-armed:
  - **The updated check against production before the deploy:** 108/144, with the 36 new-behaviour legs failing on all 9 pages.
  - **Refocus disabled (r1):** focus fell to BODY on 9/9.
  - **"Arrows only focus the region" (r2's escape):** "scrollLeft 0 of 196; right arrow still shown; focus on region".
  - **The old remove-at-edge shape restored (r3):** "focus on BODY" on 9/9.
  - **No guard plus a dimmed button (r4):** "scrollBy calls 1", "4 → 6", "button opacity 0.35".
  - **The shared border class put back (r5):** both borders at alpha 0.5.
  - **I-006 literal count restored:** the source test failed.
- Declared ceilings:
  - The checks run in headless Chromium plus one headed read on Windows. Safari, Firefox and macOS overlay scrollbars are unread.
  - The overflow-ends handoff (resize to lg+ with an arrow focused) is reasoned (Codex r4), not exercised by a check.
  - The I-006 test reads the route source, not the rendered card.

**2. Delivery.**
- I-031:
  - CI GREEN on `356214b`.
  - Render's deploy row: `356214bb` live, finished 10:19:56Z. The drift checker had read red-drift just before, from its committer-date anchor, the same false RED named in the 10-11 retro.
  - Production, headed 900x900, before → after: on 9/9 pages overflow stays 196 px and the 15 px scrollbar stays; the edge cue goes from no to yes.
  - Production checks: `check-figure-cue` 189/189 and `check-verdict-landing` 490/490.
  - Frame read live (Kondratiev 900x900): a dimmed "←" at the top-left margin, an active "→" at the top right beside the cut legend, and the new cue above the figure.
  - Frames committed: `docs/evidence/2026-10-11-i031/kondratiev-900x900-{before,after-live}.png`.
- I-006:
  - CI GREEN on `18e79a4`.
  - Render's deploy row: `18e79a47` live, finished 10:27:41Z. `check-deployed-sha-drift` reads "in-sync · live 18e79a47 → head 18e79a47".
  - The live main `/og` card is byte-identical to the pre-change copy, and the 10 per-cycle cards are byte-identical to their cycle-4 copies.

**3. Encounter.** Blind: the site has no client analytics by standing choice. The nearest read is the 2026-10-13 W-004 cold walk. Its step (2), ~900x900 with a mouse on Kondratiev, now notes the arrows and asks whether the walker saw that the figure goes on and could see all of it (N=1, synthetic). Bug row I-031.

**4. Outcome.** Open.

**Review.** Cross-family, read-only, with the banner workdir matched on every round.
- **r1 on `88914e2`:** P2, a focused arrow was removed at its end and focus fell to <body>. Fixed in `9b41736`. Click routing, place restoration, hydration, layout, the words ("HOLDS at 768–1023") and accessible names all held.
- **r2 on `9b41736`:** P2, the deferred refocus could override the reader. P3, the keyboard leg could pass without reaching the end. Both fixed in `d31f301`.
- **r3 on `d31f301`, asked as a shape question** (the second appearance of the same class): P2, the repair could target an arrow about to unmount. It recommended "the `aria-disabled` shape", which removes the destruction-and-repair entirely. Done in `03e74e9`.
- **r4 on `03e74e9`:** focus class confirmed closed. P2, opacity faded the focus ring to ~2.2:1. P3, the inert-arrow leg could not tell the guard from clamping. Both fixed in `8d2aa3f`.
- **r5 on `8d2aa3f`:** confirmed (focus outline 16.63:1 light, 15.15:1 dark). P3, the disabled border never dimmed (Tailwind rule order). Fixed in `356214b`, proven by a computed-style leg and its red arm, with no further round.
- **I-006, r1 on `18e79a4`:** no defects. Coverage limit declared.
- Sibling sweep for the r5 class (a variant class on the same property as a base class, where rule order decides): Grep `border-rule/\d+.*border-rule/\d+` over `src/` found 1 other hit, `CycleFacet.tsx:101` (`border-rule/20` with `hover:border-rule/35`). A base colour and a `hover:` variant do not conflict, so: 0 defects.

USER-VISIBLE: On a laptop-width window the cut spectral figure on every paired cycle page now shows arrows at its edges that a mouse can click to see the rest, and its cue says so — 356214b [proof: before the figure was cut 196px on 9/9 pages with no edge cue and a cue a plain wheel could not follow → after a fade and arrows show at the cut on 9/9, the right arrow moves the figure and never opens the SVG, nothing shows at lg+; headed 900x900 read and check-figure-cue 189/189 on sinusoidalhistory.com after Render live 356214bb] [coverage: Search Console (who is shown a page; cannot see on-page interaction) · last good read 2026-09-16 · founder+test excluded no] [exposure: blind — no client analytics on this site, so a reader's use of the arrows leaves no trace · bug row I-031]

codexCalls: 6
adversarialReviews: 6 — EXECUTED
hygiene helper: DISPATCHED 2026-10-11 ~02:40 MT · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-11.md PRESENT (cycle 7; 0 draft lines; check-wait-justification PASS with 2 info lines; check-engineering-zero PASS for this lane)

**Ledger.**
- I-031 set to `monitoring`: linkedCommits are the six above; nextEvaluation 2026-10-13; waitJustification until 2026-10-13, owner this lane.
- I-006 note: the og part shipped. Poster, TimeRangeBrush and the home dek remain, in the row's rank order. It stays `open`, due 2026-10-16.
- W-004 notes that step (2) now reads I-031.

**What remains.**
- On I-031: the encounter read on 2026-10-13. Safari and Firefox are unread.
- On I-006: the next three surfaces by 2026-10-16.

[standing-rules-hash: 88cc2dc9]

## Close (cycle 7)

[P5 — Delta-only close]

ACTION: COMPLETED · item I-031 · P3 370f16f6

- **State since P3.** Manager review d3adc79d reads COMPLETED. The manager independently confirmed all eight commits on origin/main, deploy in sync at `b6a0d2e3`, the live cue text, and the committed after-live frame. No state changed on the site since the P3 post.
- **A deliberate change to the acceptance wording, recorded as the review asked.** The packet said the arrow disappears at its end. As shipped, both arrows stay on screen while the figure overflows, and the unavailable one is dimmed, aria-disabled and inert. Removing the arrow and then repairing focus failed three Codex rounds running (r1 focus fell to <body>; r2 the repair overrode the reader; r3 the repair targeted an arrow already scheduled to unmount). Codex r3 recommended the aria-disabled shape. The 10-13 walk judges this shape.
- **The review's HYPOTHESIS on `snapshotCard`, checked:** `effective` is built as `cycles.map(...)` (`src/app/og/route.tsx:94`), so an override changes a cycle's values but can never drop one, and `effective.length === cycles.length` by construction. No change made.
- **Ledger delta (cycle 7):**
  - I-031 set to `monitoring` at P3 (linkedCommits 88914e2, 9b41736, d31f301, 03e74e9, 8d2aa3f, 356214b; waitJustification until 2026-10-13). At this close it gets a note recording the acceptance-wording change above.
  - I-006 note at P3: the og part shipped (`18e79a4`); Poster, TimeRangeBrush and the home dek remain. It stays `open`, due 2026-10-16.
  - W-004 note: step (2) now reads I-031.
  - No row closed, re-dated or held. I-031 waits on its 10-13 encounter read, and I-006 has three surfaces left, so neither met its closeWhen.
- hygiene draft: 0 lines — 0 accepted · 0 amended · 0 rejected (`tmp/hygiene-draft-sinusoidal-cycles-2026-10-11.md`, cycle 7; inputs all `none`).
  - READ-MUTATED: none, 0 reads guarded.
  - check-wait-justification, re-run at this close: "RESULT: PASS — 29 of 41 row(s) carry `waitJustification`; 0 warn / 1 info". The info line is I-034 (a structural `waitingFor` with no wait contract; shadow arm). I-031's info line from the draft is gone because its wait contract was written at P3.
  - check-engineering-zero (helper's run, ~02:35 MT): "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable". No lockfile changed since.
- **Due-gate verification:** `check-due-gates-dispositioned` (no flag): "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-11, 0 rows).
- **Receipt:** P3's receipt (370f16f6) still holds. Nothing new is written.
- **Pending reads:**
  - 2026-10-13: the W-004 cold walk (closes I-029 and I-030; reads I-033, I-035 and I-031).
  - 2026-10-16: the rest of I-006.
  - 2026-10-20: I-027 and I-034.
  - 2026-11-04: W-005 and I-032's encounter read.
  - 2026-12-01: I-025 (David).
- **Today panel:** written with `--date 2026-10-10`.
- **Primer:** `docs/cold-starts/2026-10-11.md`, banner rewritten in place for cycle 7.
- **UNRESOLVED:** none.

codexCalls: 0 (this phase; cycle 7's six review runs are counted on the P3 post)

[standing-rules-hash: 88cc2dc9]

---

[P1 — Evidence and choice]

## Day session (round 1) — P1 selection packet

**Outcome:** the poster, the time-range control's caption and the home page's headline and intro state the cycle count, the paired-series count and the "0 of N reach the gate" count from the data, the way the main share card has since `18e79a4`.
**Item:** I-006 (count surfaces derive from the data), due 2026-10-16. The og part is done; this is the rest.

**The user problem (HYPOTHESIS, from the row, not a reader):** a reader on the poster or the home page is told "Ten long-wave cycles", "all ten", "nine of the ten" and "0 of the 9". Each is typed by hand. When a cycle is added, these pages will state a wrong number while the chart beside them draws the right one. That is the overclaim that breaks the bar's "someone actually checked". I-006 opened because the og card once shipped "Eight".

**Honest scope: the served text does not change today.** There are still 10 cycles, 9 pairings and 0 of 9 at the gate, so every derived string renders the same as today's literal. What changes is that the number can no longer go stale. The P3 receipt will therefore most likely be `USER-VISIBLE: none — …` (byte-identical rendered text, by design), unless the review wants this framed otherwise.

### Evidence

- OBSERVED: I-006's readCommand at ~16:05Z printed `og: false poster: true brush: true`, so the og literal is gone and the poster and brush literals remain.
- OBSERVED: a source grep of `src/**/*.tsx` found the hand-typed counts at `src/components/Poster.tsx:169` ("Ten long-wave cycles of history…"), `src/components/TimeRangeBrush.tsx:283` ("the mean of all ten cycle sinusoids"), `src/app/(app)/page.tsx:44` (the H1 "Ten cycles,"), `:55-56` (the desktop dek "nine of the ten carry a paired empirical series") and `:95` ("0 of the 9 reach its 3.0-period evidence gate").
  - **Finding:** the row's cited lines, page.tsx:47-55 and :86, have drifted to :44-56 and :95. The packet names the current lines.
- OBSERVED: the dek also names every cycle by hand ("Khaldun, Kondratiev, … Modelski"). It is a list, not a count. I propose a test that every cycle in `cycles.json` appears in it (a stale list fails CI), rather than generating the prose.
- OBSERVED, out of scope per I-006's onTrigger ("surfaces where the number is a claim, not … a sentence"): prose "ten" in /about, /cycles (TITLE "The ten cycles" and its description), /methods, /colophon and /state/[year]. These are named here, not changed. If the review wants /cycles TITLE counted as a claim, it moves in, and its metadata comes with it.
- OBSERVED: `Poster` and `TimeRangeBrush` already hold the data (`cycles` props; Poster prints `No. ${cycles.length}` at :125). `/poster` server-renders Poster, so `check-rendered-text` sees it. TimeRangeBrush sits inside `Viz`, which renders client-side, so `snap` is blind to it (AGENTS.md); its proof is the `main` innerText line multiset in Playwright.
- MISSING: any real reader. The bar reads UNMEASURED (`docs/evangelism-bar.md:30`, no client analytics by standing choice).
- Rotation: `check-cycle-rotation --lane sinusoidal-cycles` → exit 0, "no product-love cycle picks this lane today".
- Due gates: `check-due-gates-dispositioned --print` → "0 gate(s) due on/before 2026-10-11" (41 swept). The morning snapshot was already taken at ~00:40 MT in cycle 6 and is not re-taken.
- Answered cards: `answered-cards --project sinusoidal-cycles` → none.

### Section 0

- Primer: read (`docs/cold-starts/2026-10-11.md`). Its first action is done: `check-figure-cue` on production → **189/189 PASS** (~15:58Z), so I-031 holds until the 10-13 walk.
- Listener: 🟢 SSE alive (hello 15:35:45Z, pid 39516) + loop ticking (ScheduleWakeup), waker ladder ranks 1-3 armed.
- Codex: GREEN (this prompt's probe line, 15:38Z).
- CI: `check-ci-status` → GREEN for e4cd69a4 (exit 0). Drift: `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live e4cd69a4 = head (exit 0).
- Harness: running 2.1.296 · fleet UNIFORM (27/27) · installed 2.1.296 (SAME).
- Recs from the last close (cycle 7): the rest of I-006 → carrying today → P3 (this packet). The 10-13 walk is dated, not today.
- Retro recurrence that bears on this choice: "a check written from a measurement inherits its looseness". The new test reads source, the same ceiling Codex named on the og part, so it is declared, and the rendered-text multiset is the proof rather than the test.

### Permission

Lane-owned copy and components. No data, no manifest, no verdict and no `public/data/` change. No mirror: `/`, `/poster` and the brush are not among the three prose pages with a `.md` mirror. I-006 is `open` (not parked or waiting), and no card is open.

### Next action

**Kind:** improve. Derive each count via `src/lib/countWords.ts`:
1. Poster standfirst: `countWord(cycles.length)`.
2. Brush caption: "the mean of all {n} cycle sinusoids", from `cycles.length` (lowercase word form; a `countWordLower` helper).
3. Home H1: `countWord(cycles.length)` cycles. Desktop dek: "{paired} of the {n}", from `dataSeries.length`. ":95": "0 of the 9" from `verdicts.json` (count reaching the gate, and the pairing count).
4. Every JSX junction keeps the explicit `{" "}` (AGENTS.md).
5. Extend `src/lib/countWords.test.ts`: helper outputs for 9, 10 and 11, plus a source read that no literal remains, plus the dek-name-list test. Red-arm by restoring each literal.

First command (the baseline, before any edit):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/poster C:/dev/skylark/sinusoidal-cycles/tmp/i006-poster-before.txt
```

(plus the same for `/`, and a Playwright `main` innerText capture of `/` for the client-rendered brush caption)

### Acceptance condition (observable)

1. The `/poster` and `/` server text and the `/` `main` innerText multiset are **identical** to production before the change (no reader-visible text moves).
2. The test goes red on each restored literal (mutation shown) and green after. Helpers give "Eleven"/"eleven" for 11.
3. `node -e` I-006 readCommand → `og: false poster: false brush: false` (the row's readCommand is updated to also check page.tsx).
4. CI green, and the deploy row live at the new head. The same text multisets are read against production after deploy.

### Delivery and encounter checks

- Delivery: the post-deploy multiset reads above, built vs production.
- Encounter: none possible by design, because the visible text is unchanged. The guard's value appears the day a cycle is added, when the count updates with no hand edit. I-006 closes on the acceptance reads, not on an encounter.

### USER-FACING: yes

Paths: `src/components/Poster.tsx`, `src/components/TimeRangeBrush.tsx`, `src/app/(app)/page.tsx`, `src/lib/countWords.ts`, `src/lib/countWords.test.ts`, `continuity/items.json` (I-006 note and readCommand). The rendered text is intended byte-identical.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: none — read: `check-due-gates-dispositioned --print` ~16:05Z, "0 gate(s) due on/before 2026-10-11" (41 swept).
- (b) Owed child rows in the orchestrator's ledger: none — read: kickoff "rows owed to you", 0 of 749 (15:57:40Z).
- (c) State reads marked CROSSED: one, re-read live and cleared. The kickoff's HEAD CI was UNKNOWN (gh timeout 10 s, 15:51Z); `check-ci-status` re-read it GREEN at ~16:03Z. Queued rows: 1 (4a1d5c6a, the dup-phase body-fallback, already absorbed). Not measured, not clean: missingLinkedCommits 0 of 0; key-metrics has no list.

---

[P3 — Product-work loop]

## Day session (round 1) — P3 product-work loop

### Action 1 — I-006, the rest of it (kind: improve). CLOSED.

Approved P1 packet 4b40fb3e, with manager review 6edfdb02's three additions.

These surfaces now take their counts from the data via `src/lib/countWords.ts`:
- the poster standfirst
- the time-range brush caption
- the home H1, desktop dek and spectral sentence
- the /cycles title and meta description

The home sentence's "none of these records is long enough to test, which is itself the finding" stays only while `eligible_primary` = 0 (review item 1). The three hand-written name lists (home dek, /cycles description, poster "Drawn from" roster) fail CI if any cycle id has no name. The check uses an id-to-name map, so "Turchin (twice)" works (review item 2).

Readers see no change today, by design.

The four states:
- **Implementation:** 450170f, 0b588ae, ddcf5c6, 18a747f.
  - countWords.test.ts 13/13, red-armed by 6 mutations: poster literal restored; clause kept for eligible > 0; Dalio dropped from the dek; `homeGateLine(0, 9)` in page.tsx; verb forced to "reaches"; Dalio dropped from the poster roster.
  - Codex r1 on 0b588ae: 3 LOW, all CONFIRMED and fixed in ddcf5c6 (H1 `{" "}` junction; test pins both gate-line arguments; whole sentences, so "reaches" cannot pass as "reach"). Codex r2 on ddcf5c6: no findings.
  - The I-006 row's readCommand now covers all five surfaces: `og: false poster: false brush: false home: false index: false`.
- **Delivery:** CI green on ddcf5c6; `check-deployed-sha-drift` in-sync, live ddcf5c69 at 10:37 MT. Production:
  - / and /cycles visible text identical to the pre-change snapshot (GREEN, 25 and 314 lines)
  - head title/description/og/twitter identical on / /cycles /poster
  - browser innerText multiset identical at 1440x900 and 390x664 on all three (built vs prod)
  - the 7 derived strings PRESENT on production (the positive control)
- **Encounter:** none possible by design; the visible text did not move.
- **Outcome:** n/a. The value appears the day a cycle is added.
- **Deviation, recorded on the row:** its 09-22 note marked the H1 "literal by design". The approved packet listed it, so it now derives too. It renders byte-identical.

### Action 2 — cycle pages name the curve height (kind: improve), I-036, minted at build time

This is the review's "best visible change for a cold phone reader on a /cycles page".

Evidence (OBSERVED, synthetic, N=1): the 2026-10-03 W-003 walk said "'cos +0.67' means nothing to me without the footnote" (`docs/walks/2026-10-03-w003.md:97`). /state has that footnote. The cycle pages printed the same number bare, on all ten.

Change in 0196b40: the "where this year sits" sentence reads "(the curve bottoms out in 2028; curve height −0.99, from −1 at a low to +1 at a peak)". Same value, same derivation. /state and the API keep "cos".

The four states:
- **Implementation:** 0196b40.
  - `scripts/check-year-position.mjs` (the independent oracle, built from /api/v1/state) moved with it. Selftest 11/11, its numeric sign arm intact.
  - Red-armed:
    - the updated oracle against production's old sentence → 71/81, exactly the 10 sentence legs FAIL
    - bare "cos" restored in `yearPositionSentence` → 2 unit tests FAIL
  - Full suite 293/293 (verify-with-receipt on 0196b40). Codex r3: no findings.
- **Delivery:** CI green on 0196b40; drift in-sync, live 0196b40c at 11:01 MT. Production:
  - check-year-position 81/81
  - fold gate 13/13 at 320x568
  - before the deploy, built vs production on all 10 cycle pages: exactly 1 line removed and 1 added each
- **Encounter:** blind. No client analytics, so a reader meeting the sentence leaves no trace. Bug row I-036. The 2026-10-13 W-004 walk adds the step (synthetic).
- **Outcome:** open, read on the 10-13 walk.

USER-VISIBLE: every /cycles/<slug> page's "where this year sits" sentence names its number ("curve height −0.99, from −1 at a low to +1 at a peak") instead of a bare "cos −0.99" — 0196b40 [proof: "…bottoms out in 2028; cos −0.99)" → "…bottoms out in 2028; curve height −0.99, from −1 at a low to +1 at a peak)"; live 0196b40c in-sync 11:01 MT; check-year-position 81/81 on https://sinusoidalhistory.com] [coverage: Search Console page-level (scripts/gsc-read.mjs) · last good read 2026-10-07 · founder+test excluded no] [exposure: blind — no client analytics on this site, so a reader's reading of the sentence leaves no trace · bug row I-036]

codexCalls: 3
adversarialReviews: 3 — EXECUTED (r1 0b588ae: 3 LOW fixed in ddcf5c6; r2 ddcf5c6: none; r3 0196b40: none; 18a747f test-only, by inspection)
hygiene helper: DISPATCHED 16:13Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-11-day.md PRESENT. Inputs all `none`; check-wait-justification PASS (I-034 info only); check-engineering-zero PASS (0 findings).

### Remains

- 2026-10-13: the W-004 walk reads I-036 (new step), I-031, I-033, I-035, I-029 and I-030.
- I-006: closed.
- Nothing waits on David.

[standing-rules-hash: 88cc2dc9]
