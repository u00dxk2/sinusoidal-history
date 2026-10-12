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

---

[P5 — Delta-only close]

ACTION: COMPLETED · item I-006 · P3 c905be47

Manager review 67f9bb6f confirmed both acceptances against origin/main and production.

## Close (day session, 2026-10-11)

- **State changed since P3 (c905be47):**
  - The manager review found residue: the Turchin and Strauss–Howe rationale prose still prints a bare "cos ≈ …".
    - `src/data/cycles.json:70`: "(cos ≈ +0.91 at 1860)" and "(cos ≈ −0.81 at 1780)".
    - `src/data/cycles.json:94`: "(cos ≈ +0.15)". The same claim also appears at `about/page.tsx:185` and in `public/about.md`.
  - It is recorded on I-036, not fixed today. Any edit is editorial rationale, and owes the cos-math audit and the about.md mirror.
- **Ledger delta (today, day session):**
  - I-006 CLOSED. linkedCommits 18e79a4, 450170f, 0b588ae, ddcf5c6, 18a747f; readCommand widened to all five surfaces.
  - I-036 MINTED, `monitoring`, nextEvaluation 2026-10-13. Note added at the close: the bare-cos residue.
  - W-004: two notes. The I-036 curve-height step on /cycles/perez; widened at the close to read the whole page on /cycles/turchin and /cycles/strauss-howe.
- **Hygiene draft:** 0 lines — 0 accepted · 0 amended · 0 rejected (`tmp/hygiene-draft-sinusoidal-cycles-2026-10-11-day.md`; inputs all `none`).
  - READ-MUTATED: none, 0 reads guarded.
  - check-wait-justification: "RESULT: PASS — 29 of 41 row(s) carry `waitJustification`; 0 warn / 1 info (exit 0)". The info line is I-034. I-036 was minted after that run with its own waitJustification.
  - check-engineering-zero: "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable (exit 0)". No lockfile changed since.
- **Due-gate verification:** `check-due-gates-dispositioned` (no flag): "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-11, 0 rows; 42 swept).
- **Receipt:** P3's receipt (c905be47) still holds. Nothing new.
- **Today panel:** written with `--date 2026-10-11`.
- **Primer:** `docs/cold-starts/2026-10-11.md`, banner rewritten in place (1,236 chars). The first action for 2026-10-12 is check-year-position on production.
- **Pending reads:**
  - 2026-10-13: the W-004 walk. It closes I-029 and I-030. It reads I-031, I-033, I-035, and I-036 (the curve-height wording, plus the bare-cos residue on turchin and strauss-howe).
  - 2026-10-20: I-027, I-034.
  - 2026-11-04: W-005, I-032.
  - 2026-12-01: I-025 (David).
- **UNRESOLVED:** none.

codexCalls: 0 (this phase; the day's three review runs are counted on the P3 post c905be47) — probed-declined

[standing-rules-hash: 88cc2dc9]

---

[P1 — Evidence and choice]

## Day session (round 3, evening) — P1 selection packet

**Outcome:** no page a reader opens prints a bare "cos ≈ …" number. The Turchin and Strauss–Howe calibration rationales, and the /about paragraph that repeats the Strauss–Howe claim, say "curve height", with the scale, the way the ten cycle pages have since `0196b40`.
**Item:** I-036 (cycle pages name the curve height). This is the bare-cos residue its round-1 close recorded and left unfixed.

**The user problem, in a reader's words (OBSERVED, synthetic, N=1):** "'cos +0.67' means nothing to me without the footnote" (`docs/walks/2026-10-03-w003.md:97`). The cycle-page sentence now explains itself. A paragraph further down the same page then prints "cos ≈ +0.91 at 1860" with no explanation.

### Evidence

- OBSERVED (source grep `\bcos\b` over `public/*.md`, `public/*.txt`, `src/data/cycles.json`, `src/app/**/*.tsx`, `src/components/**/*.tsx`, ~01:15Z). Bare numeric "cos ≈" on reader surfaces:
  - `src/data/cycles.json:70` (Turchin rationale): "(cos ≈ +0.91 at 1860)", "(cos ≈ −0.81 at 1780)"
  - `src/data/cycles.json:94` (Strauss–Howe rationale): "(cos ≈ +0.15)"
  - `src/app/(app)/about/page.tsx:185`: "(cos ≈ +0.15)"
  - `public/about.md:97`, `:121` (mirrors of the two rationales) and `:159` (mirror of about/page.tsx:185)
  - `public/llms.txt:86`: "at cos ≈ +0.15" (round-4 correction history, read by crawlers)
- OBSERVED: the rationale renders on four surfaces: `/cycles/<slug>` (`cycles/[id]/page.tsx:414`), the /about list (`about/page.tsx:144`), the home chart's Calibrate tab (`CycleFacet.tsx:482`, client-rendered) and `/api/v1/*`.
- OBSERVED, deliberately kept: /state and /api/v1/state print "cos" with its footnote (`state/[year]/page.tsx:359`). The /methods `cos(Δφ)` is a formula, not a reading. `llms.txt:18`/`:58` describe the API's "cos value" field. None of these change.
- OBSERVED: the math holds. Turchin (period 150, peak 1870): cos at 1860 = +0.913 and at 1780 = −0.809. Strauss–Howe (period 84, peak 1955): cos at 2020 = +0.149. `audit_cycle_rationales.py` matches on years, not the word "cos" (`YEAR_RE`, line 33), so rewording cannot blind it.
- OBSERVED: production holds round 1's sentence. `check-year-position https://sinusoidalhistory.com --fails-only` → **81/81 PASS** (~01:12Z).
- MISSING: any real reader. The bar reads UNMEASURED (`docs/evangelism-bar.md:30`).
- **Ordering tension, stated plainly:** I-036's onTrigger defers the residue decision to the 2026-10-13 walk. The orchestrator's lead asks for the fix now. I follow the lead. The 10-13 step then reads the new wording on turchin and strauss-howe, not the old.

### Section 0

- Primer: read. Its first action ran: check-year-position on production 81/81.
- Listener: 🟢 SSE alive (hello 00:59:25Z, pid 59384). Loop ticking via ScheduleWakeup. Waker ranks 1-3 armed.
- Codex: GREEN (this prompt's probe line, 15:38Z).
- CI: GREEN for 2a807d9f (kickoff). Drift: `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live 2a807d9f = head (exit 0).
- Due gates: `--snapshot` → "0 gate(s) due on/before 2026-10-11" (42 swept; identical to the existing snapshot).
- Rotation: exit 0, "no product-love cycle picks this lane today". Answered cards: none.
- Retro recurrence that bears on this choice: "a check written from a measurement inherits its looseness". The new guard is a stated rule (no `cos` followed by a number outside /state, the API and /methods), not a list of today's matches.

### Permission

Lane-owned editorial copy. `reference_peak_rationale` is prose, not a pairing, a period or an inference CSV, so the spectral manifest is untouched. No /state, verdict or `public/data/` change. I-036 is `monitoring` and lane-owned. No card is open.

### Next action

**Kind:** improve.

1. Reword the four "cos ≈" claims. The first on each surface carries the scale, for example: "(curve height ≈ +0.91 at 1860, where +1 is a peak and −1 a trough)", then "(curve height ≈ −0.81 at 1780)". Strauss–Howe: "(curve height ≈ +0.15, where +1 is a peak and −1 a trough)".
2. Make the same edits in `public/about.md` and `public/llms.txt` in the same commit (mirror rule).
3. Add a guard test over `cycles.json`, `public/*.md`, `public/llms.txt` and the reader page sources. It fails on `\bcos\s*[≈=]?\s*[−+-]?\d` outside the allowlisted /state and /methods files. Red-arm it by restoring one "cos ≈".
4. Add a leg to `check-year-position`: the whole innerText of each cycle page, and of /about, has no bare "cos <number>". It is red on production before the deploy (turchin, strauss-howe, about) and green after.
5. Run `python scripts/audit_cycle_rationales.py`.

First command (the baseline, before any edit):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/about C:/dev/skylark/sinusoidal-cycles/tmp/i036r-about-before.txt
```

(plus the same for /cycles/turchin and /cycles/strauss-howe)

### Acceptance condition (observable)

1. Built vs production rendered text: /about, /cycles/turchin and /cycles/strauss-howe differ only on the reworded lines. No other page differs.
2. The guard test is red with one "cos ≈" restored and green after. The new check-year-position leg is red against production before the deploy and green after.
3. The cos-math audit numbers are unchanged; the prose values still match them.
4. CI green and the deploy row live at the new head. Then `check-year-position https://sinusoidalhistory.com` passes in full on production, including the new leg.

### Delivery and encounter checks

- Delivery: acceptance reads 1 and 4 after the deploy.
- Encounter: blind (no client analytics; bug row I-036). The 2026-10-13 W-004 walk reads turchin and strauss-howe at 390x664: does any number on the page stop the reader?

### USER-FACING: yes

Paths:
- `src/data/cycles.json` (rationales; also served by `/api/v1/*`)
- `src/app/(app)/about/page.tsx`
- `public/about.md`, `public/llms.txt`
- `scripts/check-year-position.mjs`
- a new guard test under `src/lib/`
- `continuity/items.json` (the I-036 note)

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: none — read `check-due-gates-dispositioned --snapshot` ~01:10Z, 0 due (42 swept).
- (b) Owed child rows in the orchestrator's ledger: none — read kickoff "rows owed to you", 0 of 749 (01:04:50Z).
- (c) State reads marked CROSSED: none — read the kickoff state block (01:04:50Z). Not measured, not clean: missingLinkedCommits 0 of 0 considered; key-metrics has no list.

---

[P3 — Product-work loop]

## Day session (round 3) — P3 product-work loop

### Action — no reader page prints a bare "cos" number (kind: improve), I-036 residue

Approved P1 packet 9a114feb; manager review 03eb9f2c (APPROVE, two HYPOTHESIS checks, one suggestion).

Change (62b69f1): wherever a reader page printed "cos ≈ X", it now says "curve height ≈ X". The first number on each surface adds "on a scale from −1 at a low to +1 at a peak", the same scale as the cycle-page sentence. Surfaces changed:
- the Turchin and Strauss–Howe rationales in `cycles.json`
- the /about paragraph (`about/page.tsx:185`)
- `about.md` (3 places)
- `llms.txt:86`
- `vdem_libdem.source.md:22`, a sibling the P1 grep missed because it did not search `public/data/`

The values are unchanged; `audit_cycle_rationales.py` gives +0.914, −0.809 and +0.149.

<!-- findings:begin -->
- The P1 evidence missed `public/data/vdem_libdem.source.md:22` ("cos ≈ −0.68"). /methods and the Strauss–Howe cycle page link to it. It was reworded in the same commit, and the guard's population names it.
- Review HYPOTHESIS 1 CONFIRMED. The rationale also reaches `/api/v1/cycles` and the home chart's Calibrate tab. Both are expected diffs: the API now carries 3 "curve height ≈" and no "cos ≈".
- Review HYPOTHESIS 2 CONFIRMED. The live check cannot open the client-rendered Calibrate tab. Its header now says it is blind to it, and `bareCos.test.ts` covers that surface from source.
<!-- findings:end -->

The four states:
- **Implementation:** 62b69f1, 2466307.
  - The guard `src/lib/bareCos.test.ts` matches the whole file over `cycles.json`, `src/app` and `src/components` `.tsx`, and `public` `.md`/`.txt`, and names its population.
  - `check-year-position` gains a bare-cos leg on every cycle page, /about and the three served text files. Each passes only on 2xx, with no bare cos, and with "curve height ≈" present. Selftest 19/19.
  - Red arms:
    - "cos ≈" restored: unit test FAIL at `cycles.json:70`.
    - A wrapped "cos\n ≈" in `about/page.tsx`: FAIL at `:185`.
    - Production before the deploy: 89/95, exactly the 6 new legs.
    - Selftest arms for an empty 200 and a 503 both fail.
  - Full suite 297/297 on 2466307 (verify-with-receipt). Lint: 0 errors. Typecheck clean.
  - Codex r1 on 62b69f1: 2 MEDIUM, both REPRODUCED and CONFIRMED, fixed in 2466307. (1) The line-by-line match missed a wrapped "cos". (2) An empty body or an error page passed the live legs. Codex r2 on 2466307: no findings.
- **Delivery:**
  - CI GREEN on 2466307.
  - `check-deployed-sha-drift --service sinusoidal-history`: `in-sync · live 24663076 → head 24663076` (19:37:58 MT).
  - `check-year-position https://sinusoidalhistory.com`: **95/95 PASS**.
  - Built vs production visible text: identical on /about (87 lines), /cycles/turchin (101) and /cycles/strauss-howe (99).
  - Before vs after, line multisets: /about 3 lines changed, turchin 1, strauss-howe 1. Nothing else moved; 0 bare "cos ≈" left.
- **Encounter:** blind. The site has no client analytics, so a reader leaves no trace. Bug row I-036. The 2026-10-13 W-004 walk reads it (synthetic).
- **Outcome:** open, read on the 10-13 walk. That walk now also asks the W-003 "what does cos +0.67 mean?" question on /state (review suggestion; W-004 note).

USER-VISIBLE: the Turchin and Strauss–Howe calibration notes, /about and the served about.md, llms.txt and V-Dem source note say "curve height ≈ +0.91 at 1860, on a scale from −1 at a low to +1 at a peak" instead of a bare "cos ≈ +0.91" — 62b69f1 [proof: "(cos ≈ +0.91 at 1860)" → "(curve height ≈ +0.91 at 1860, on a scale from −1 at a low to +1 at a peak)" on /cycles/turchin, /cycles/strauss-howe and /about; live 24663076 in-sync 19:37 MT; check-year-position 95/95 on https://sinusoidalhistory.com, its 6 bare-cos legs RED on the pre-deploy build] [coverage: Search Console page-level (scripts/gsc-read.mjs) · last good read 2026-10-07 · founder+test excluded no] [exposure: blind — no client analytics on this site, so a reader's reading of the note leaves no trace · bug row I-036]

[red-armed: one "(cos ≈ −0.81 at 1780)" restored in cycles.json, then npx vitest run src/lib/bareCos.test.ts -> AssertionError: expected [ 'src\data\cycles.json:70' ] to deeply equal []]

codexCalls: 2
adversarialReviews: 2 — EXECUTED (r1 62b69f1: 2 MEDIUM fixed in 2466307; r2 2466307: none)
hygiene helper: DISPATCHED ~01:20Z · draft tmp/hygiene-draft-sinusoidal-cycles-2026-10-11-r3.md PRESENT. Inputs all `none`. check-wait-justification PASS (30 of 42; I-034 info only). check-engineering-zero PASS (lane: 0 findings, 0 unreadable).

### Remains

- 2026-10-13: the W-004 walk reads I-036. It reads the new wording on turchin and strauss-howe, plus the /state "cos" question. It also reads I-029, I-030, I-031, I-033 and I-035.
- Nothing waits on David.

[standing-rules-hash: 88cc2dc9]
---

[P5 — Delta-only close]

ACTION: COMPLETED · item I-036 · P3 ed86d258

Manager review a833ef75 confirmed the acceptance against origin/main and production: 0 bare-cos matches, and /api/v1/cycles carries 3 "curve height ≈" and 0 "cos ≈".

## Close (day session round 3, 2026-10-11)

- **State changed since P3 (ed86d258):** none for readers. Docs commit 8aa16ee pushed.
- **Ledger delta:**
  - I-036 stays `monitoring`, nextEvaluation 2026-10-13. Its onTrigger now names the walk's three answers and the move for each:
    1. perez "curve height"
    2. turchin and strauss-howe rationale wording
    3. the /state "cos +0.67" question, which decides a NEW row and leaves this one alone
  - I-036 closeWhen: 95/95 on production (met) plus answers 1 and 2.
  - I-036 linkedCommits: 0196b40, 62b69f1, 2466307. Its waitJustification.unWait now names the three answers.
  - W-004: one note adds the /state step and points the turchin and strauss-howe step at the new wording.
- **Hygiene draft:** 0 lines — 0 accepted · 0 amended · 0 rejected (`tmp/hygiene-draft-sinusoidal-cycles-2026-10-11-r3.md`; inputs all `none`).
  - READ-MUTATED: none, 0 reads guarded.
  - check-wait-justification, re-run after the I-036 edits: "RESULT: PASS — 30 of 42 row(s) carry `waitJustification`; 0 warn / 1 info (exit 0)". The info line is I-034.
  - check-engineering-zero (helper): "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable". No lockfile changed since.
- **Due-gate verification:** "verdict: CLEAR — every gate due at Phase 0 was dispositioned", snapshot CURRENT (taken 2026-10-11, 0 rows; 42 swept).
- **Receipt:** P3's receipt (ed86d258) still holds. Nothing new.
- **Today panel:** written with `--date 2026-10-11`.
- **Primer:** `docs/cold-starts/2026-10-11.md`, banner rewritten in place (1,314 chars). The first action for 2026-10-12 is check-year-position on production.
- **Pending reads:**
  - 2026-10-13: the W-004 walk (synthetic: a reading, not an encounter). It reads I-036's three answers, closes I-029 and I-030, and reads I-031, I-033 and I-035.
  - 2026-10-20: I-027, I-034.
  - 2026-11-04: W-005, I-032.
  - 2026-12-01: I-025 (David).
- **UNRESOLVED:** none.

codexCalls: 0 (this phase; the round's two review runs are counted on P3 ed86d258) — probed-declined

[standing-rules-hash: 88cc2dc9]

---

[P1 — Evidence and choice]

## Night session (round 4) — P1 selection packet

**Outcome:** a writer who pastes the "Huntington only, with calibration" snippet sees the Huntington curve inside the frame. A writer who pastes "State of the cycles" sees all ten rows. Neither has to scroll inside a 280px or 360px box to find what the snippet promised.
**Item:** a new row, embed snippets show what they promise (Flow 3), minted at P3 build time as I-037. No existing row covers /embed.

**The user problem, in a writer's words (OBSERVED, synthetic walk, N=1):** "I pasted the Huntington snippet to argue my 1968 claim, and my page shows a 'State of the cycles' header and the word RISING. There is no curve."

### Why Flow 3, not Flow 2

Flow 3 (Embed) was last walked on 2026-08-24 (journey-walk J9, a layout fix to /embed/docs at 390px). The 09-26 journey-walk says "Not re-walked: `/poster`, `/embed/docs`". Flow 2 surfaces (/state, cycle pages) were reworked on 09-29 (I-009, I-011), 10-03 (I-013) and 10-11 (I-036). Flow 3 is the stalest, so the lead's rotation holds.

### Evidence

- OBSERVED (Playwright walk, ~04:55Z). Script: `scratchpad/embed-walk.mjs`. It fetched live `/embed/docs`, took the four `<pre>` snippets verbatim and pasted each into a blank page served from `http://127.0.0.1:<port>`, a different origin. It rendered each at 390x844 (touch) and 1440x900, waited 4s, then read the frame's document.
- OBSERVED, cross-origin works. All four `src` URLs return 200 with `content-security-policy: frame-ancestors *` and an empty `x-frame-options`. All four frames load, with 0 console errors and no horizontal overflow (frame scrollWidth = clientWidth: 358 at phone, 680 at desktop). The docs page's cross-origin note is accurate.
- OBSERVED, the frames clip what they promise. Frame content height against the snippet's own `height`:

  | snippet | height | phone content | desktop content | what shows in the frame |
  |---|---|---|---|---|
  | state-only ("most embeddable") | 360 | 666 | 679 | header + rows 01–05 of 10 |
  | Huntington, with calibration | 280 | 489 | 501 | panel header + "Huntington RISING" + facet title. **No curve.** |
  | overlay, modern | 620 | 1528 | 1044 | legend list first; chart below the cut on a phone |
  | facets, modern | 900 | 2294 | 2370 | a scrolling stack; expected for 10 facets |

  Screenshots: `scratchpad/shot-390-2.png` and `shot-1440-2.png` show the Huntington frame with no curve at both widths.
- OBSERVED: the attribution footer ("via Sinusoidal History · methods & sources", `EmbedView.tsx:112`) sits below the cut in all four frames at both widths. The docs page promises "All embeds link back to the main site". The links exist, but the reader cannot see them without scrolling inside the frame.
- OBSERVED, cause: `/embed/docs/page.tsx:16-43` hard-codes heights (360/900/280/620) that are smaller than the content. In the facets view, `EmbedView.tsx:81-100` puts the NowSummaryPanel above the facet, so a single-cycle embed spends its first ~300px on a one-row summary table.
- MISSING: any real embedder. There are no referrer reads for /embed in this session. `crawl-read` is tier-2 monthly and was not re-run.
- Retro recurrence that bears on this choice ("a check written from a measurement inherits its looseness"): the guard asserts a stated rule, not today's pixel numbers. "Each non-scrolling snippet's frame contains its whole content, including the footer, at 390 and 1440." It does not assert "height ≥ 501".

### Section 0

- Primer `docs/cold-starts/2026-10-11.md`: banner read. Its first action is dated 2026-10-12 and is not run yet. It runs at the 10-12 morning start.
- Listener: 🟢 SSE alive (pid 25884, hello 04:21:12Z, replay-complete). Loop: ScheduleWakeup thin tick. Waker ranks 1–3 armed. Rank 1 fired wake-shorten at ~04:44Z and was relaunched.
- Codex: GREEN (the probe line on this prompt, 04:34:53Z).
- CI: `check-ci-status --workflow ci.yml` → GREEN for 29cb8df28a (exit 0). Drift: `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live 29cb8df2 = head (exit 0).
- Due gates: `--snapshot` → "0 gate(s) due on/before 2026-10-11" (42 swept; identical to the existing snapshot).
- Rotation: exit 0, "no product-love cycle picks this lane today". Answered cards: none.
- Recs yesterday: the round-3 close carried pending reads only. All are dated 10-13 or later. None is due.

### Permission

Lane-owned product surface: /embed docs copy, snippet heights and the EmbedView layout. No pairing, period, inference CSV, verdict, /state or API wording changes. The surfaces the 10-13 W-004 walk judges (cycle pages, /state, /methods, the home Calibrate tab) are not touched: EmbedView is its own route. No open card.

### Next action

**Kind:** improve.

1. Make each snippet show what it promises at both widths:
   - single-cycle facets: drop the one-row summary panel above the facet (it repeats the facet's own phase label), or move it below the chart;
   - set each snippet's `height` from its measured content at 390 and 1440, whichever is taller, plus the footer;
   - overlay: either a phone-safe height or a docs line saying the overlay is a desktop embed.
   The overlay choice is P3's, made after measuring both options.
2. Add a live leg, `scripts/check-embed-snippets.mjs`, the same shape as check-year-position. It reads `/embed/docs`, pastes each snippet into a cross-origin page and checks at 390 and 1440 that:
   - the frame loads with `frame-ancestors *`;
   - there is no horizontal overflow;
   - for every snippet not declared scrolling, frame scrollHeight ≤ the snippet's height and the "via Sinusoidal History" link is inside the frame;
   - the single-cycle frame has a curve path inside its visible box.
3. Red arm: run the leg against production before the deploy. It must fail on state-only and Huntington.
4. Spawn-shape unit test for the leg's `--selftest` (pre-flight shape (a)). Run root lint on the new script.

First command (the baseline, before any edit):

```
node C:/Users/david/AppData/Local/Temp/claude/C--dev-skylark-sinusoidal-cycles/7aa515a4-2c6a-4ba5-be1a-826f8df69b48/scratchpad/embed-walk.mjs https://sinusoidalhistory.com
```

### Acceptance condition (observable)

1. Pasted cross-origin at 390x844 and 1440x900, the Huntington snippet's frame shows the Huntington curve. The state-only frame shows all ten rows. Both frames show the via-footer without inner scrolling.
2. `check-embed-snippets` against production: RED before the deploy (state-only, Huntington), GREEN after. CI green and the deploy row live at the new head.
3. Rendered-text diff of `/embed/docs`, built against production: only the changed heights/notes differ. No other page's server-rendered text changes.

### Delivery and encounter checks

- Delivery: acceptance reads 1 and 2 on https://sinusoidalhistory.com after the deploy.
- Encounter: blind. There are no client analytics and no embed referrer read. A real encounter would appear as a non-sinusoidalhistory.com `Referer` on `/embed?…` requests in the monthly `crawl-read`. One such request is readable.

### USER-FACING: yes

Paths:
- `src/app/embed/docs/page.tsx` (snippet heights, notes)
- `src/components/EmbedView.tsx` (single-cycle layout)
- `scripts/check-embed-snippets.mjs` (new) + `src/lib/checkEmbedSnippets.test.ts` (new, spawn shape)
- `docs/key-user-flows.md` (Flow 3)
- `continuity/items.json` (I-037)

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: none — read `check-due-gates-dispositioned --snapshot` ~04:50Z, 0 due (42 swept).
- (b) Owed child rows in the orchestrator's ledger: none — read kickoff "rows owed to you", 0 of 749 (04:41:49Z).
- (c) State reads marked CROSSED: none — read the kickoff state block (04:41:49Z). Not measured, not clean: missingLinkedCommits 0 of 0 considered; key-metrics has no list.

codexCalls: 0 (P1 is a read and a selection) — probed-declined

<!-- findings:begin -->
Correction to the round-4 P1 packet (2026-10-12, P3): the packet said an embed encounter would appear as a non-sinusoidalhistory.com Referer on /embed requests in the monthly crawl-read. scripts/crawl-read.mjs has no Referer field (Grep: 0 matches), so it cannot. The encounter is blind; I-037's closeWhen names the 2026-11-01 read that decides whether it can ever be seen. Also measured in P3: Huntington's published peak is 1968, so the docs' 'with calibration' snippet (peak.huntington=1968) calibrated nothing; the manager review's 'undisclosed peak 1968' hypothesis did not apply to it, and the example now overrides to 1972.
<!-- findings:end -->

---

[P3 — Product-work loop]

## Night session (round 4) — P3 product-work loop

### Action — embed snippets show what they promise; the single-cycle embed shows a readable, disclosed curve (kind: improve), I-037

Built to the manager review's REDIRECT (3e286b33). Its acceptance condition replaced the packet's.

### What changed for a writer

- **Snippet heights now hold the whole embed**, attribution included, in a 358px and a 680px column:
  - state-only 360 → 700;
  - Huntington 280 → 500;
  - overlay 620 → 1070.
  The full facet stack scrolls inside its frame, and the docs say so. The docs also say the overlay is for columns wider than 640px.
- **A single-cycle facets embed is the chart alone:** a 200px curve (it was 60px) with its year axis, and no ten-row summary panel above it.
- **Any `peak.`/`period.` override prints a visible line above the chart.** The line names the override beside the site's published value and always names the site's reference peak. For example: "Calibrated for this page, not the site's published values: Huntington — creedal passion, peak 1972 (the site's reference peak is 1968)." The wording lives in `src/lib/embedCalibration.ts`.
- **Facet headers in embeds are labels, not buttons that did nothing when tapped.**
- **The docs' "with calibration" example now overrides to 1972.** Huntington's published peak IS 1968, so the old example calibrated nothing (measured in P3; not in the P1 packet).

### Four states

1. **Implementation.** Commits on main: `f5a2e8e`, `28bbb07`, `69d5c94`, `8bb4dd4`.
   - Gate: 304/304 tests at `69d5c94`; receipt `tmp/.verify-receipt.json`. `8bb4dd4` changes only comments, labels and the ledger.
   - One run at `28bbb07` was RED: the `bareCos` test timed out at 6.1s against a 5s limit while the machine was under load. Alone it passed in 642ms, and the re-run was green 304/304.
   - Typecheck clean. Lint clean on the changed files; CI ran the full lint.
   - New guard: `scripts/check-embed-snippets.mjs`. It pastes the SERVED snippets into a page on another origin and judges rules 0–6 at 390 and 1440. Selftest 38/38, spawned by `src/lib/check-embed-snippets.test.ts`. `src/lib/embedCalibration.test.ts` adds 4 cases.
   - Rendered text of /embed/docs, production → built: exactly 10 lines changed, all intended. No other server-rendered page changed; the component edits are client-side and default to the old behaviour.
2. **Delivery.**
   - `check-ci-status --wait`: GREEN for `8bb4dd43c5`.
   - `check-deployed-sha-drift --service sinusoidal-history`: in-sync, live `8bb4dd43` = head.
   - `check-embed-snippets https://sinusoidalhistory.com`: **42/42 PASS** (25/42 before the deploy, the red arm).
   - `check-year-position https://sinusoidalhistory.com`: 95/95, so the unchanged surfaces still hold. This is also the primer's 10-12 first action.
3. **Encounter: blind.** No client analytics, and no instrument can see a third-party page that embeds the chart. The P1 packet said a non-sinusoidalhistory.com Referer would show in the monthly crawl-read. **That was wrong:** `scripts/crawl-read.mjs` has no Referer field (0 matches). I-037's closeWhen now names the 2026-11-01 read that decides whether one can ever be seen. Bug row: I-037.
4. **Outcome:** open. No read exists.

USER-VISIBLE: a writer who pastes an /embed/docs snippet gets the whole embed in its frame — all ten state rows, a 200px Huntington curve instead of none, and a visible line saying the 1972 peak is the writer's, not the site's (1968) — 8bb4dd4 [proof: check-embed-snippets on https://sinusoidalhistory.com 25/42 before the deploy → 42/42 after (2026-10-12 ~01:45 MT), live 8bb4dd43 = head per check-deployed-sha-drift] [coverage: crawl-read (Render request logs, crawlers only, no Referer) · last good read 2026-09-08 · founder+test excluded no] [exposure: blind — no client analytics and no instrument sees a page that embeds the chart; crawl-read has no Referer field · bug row I-037]
[red-armed: node scripts/check-embed-snippets.mjs https://sinusoidalhistory.com (before the deploy) -> 25/42 FAIL: state-only "4 of 10 rows visible"; Huntington "60px (path 0px), not visible", "no visible calibration clause", "peak.huntington=1968 calibrates something — published 1968"; facet headers "is not a toggle (no aria-pressed)"]

### Review

Three Codex rounds, all read-only. Each round's banner showed `workdir: C:\dev\skylark\sinusoidal-cycles`.

- **r1 on `f5a2e8e`:** 7 findings, all CONFIRMED, fixed in `28bbb07`.
  - 1 product defect: a period-only override did not name the site's reference peak, so contract (5) was unmet.
  - 6 check weaknesses: it rebuilt the iframe instead of pasting it; it had no population, row or painted-curve check; visibility was geometry only; the disclosure match was loose; clicks were programmatic; the docs note was read from raw HTML.
- **r2 on `28bbb07`:** 4 findings, CONFIRMED. Three were SECOND appearances of r1 classes: an empty curve passing via the data path; visibility missing clipped rows and hidden spans; a fallback-stuck frame passing. The fourth was hover effects certifying a dead click. Per the stop-patching rule, I changed the check's shape in `69d5c94`:
  - structural marks set by the components (`path[data-curve=theory]`, `span[data-calibration-for]`);
  - centre hit-tests for visibility;
  - an exact clause match;
  - rule 6 as "every embed button is a toggle whose aria-pressed flips";
  - a frame that never hydrates fails.
- **r3 on `69d5c94`:** 2 findings, each a THIRD appearance: a zero-width stroke passes the curve leg, and the docs-note leg skipped the hit-test. No third matcher: I narrowed both legs' claims in `8bb4dd4`. The curve leg now says "paint not judged" and the docs-note leg says "presence, not readability". The painted line is evidenced by a frame instead (the 200px Huntington curve with its calibration line). The review loop stopped there.

codexCalls: 3
adversarialReviews: 3 — EXECUTED (r1 f5a2e8e, r2 28bbb07, r3 69d5c94; foreground `codex exec --sandbox read-only`, banner workdir checked each round)
hygiene helper: DISPATCHED 2026-10-12 ~05:10Z · draft `tmp/hygiene-draft-sinusoidal-cycles-2026-10-11-r4.md` PRESENT (inputs all none; check-wait-justification PASS 30/42 with 1 info (I-034); check-engineering-zero PASS 0 findings)

### Machine events this phase

- **Low-memory reap ~06:40Z:** it stopped the waker ranks, my local server and a lint run. Free memory read 11.6 GB, so I relaunched ranks 1–3 under the standing go-ahead and posted status f187d892.
- **Orchestrator memory notice 00:45 MT:** I read free memory before each heavy job (17.2, 12.0, 8.4, 15.3, 13.3 GB) and ran builds, tests and Codex one at a time. Local `next start` servers were stopped by their own PIDs.

### What remains

- **2026-11-01, I-037:** read one Render log line for /embed. Referer present → add a crawl-read leg. Absent → close as delivered, with the encounter blind by construction.
- **The 2026-10-13 W-004 walk** is untouched by this work. It touched no surface the walk judges: EmbedView is its own route, and the CycleFacet/FacetView props default to the old behaviour. `check-year-position` reads 95/95.

[standing-rules-hash: 88cc2dc9]

---

[P5 — Delta-only close]
ACTION: COMPLETED · item I-037 · P3 330323f0

## Close (night session round 4, 2026-10-11 rail day, closed 2026-10-12 ~04:00 MT)

The manager review rated the action COMPLETED against the REDIRECT's six conditions.

- **Delivery:** `check-embed-snippets` on production 42/42 (25/42 before the deploy). Live `8bb4dd43` = head per `check-deployed-sha-drift`. CI GREEN on `8bb4dd4`.
- **Gate disclosure:** the local suite at `3d9541a` exited 1. `checkStagedSecrets` selftest timed out at 68s against a 60s limit while memory was tight. `3d9541a` is docs and ledger only over `8bb4dd4`. This is recorded as disclosed, not as green.

**State changed since P3 (330323f0):** none for readers. The P5 prompt (inbox 4bc9f5d0, queued ~08:00Z) was marked surfaced in this session at 08:02Z but never reached the pane. My 08:16Z "P5 not queued +30m" (5e74f75e) was posted in that gap. The orchestrator re-sent the pointer at 09:42Z.

**Ledger delta:**
- **I-037:** `monitoring` (set at P3). linkedCommits f5a2e8e, 28bbb07, 69d5c94, 8bb4dd4. readCommand last run 2026-10-12, exit 0. waitJustification until 2026-11-01. closeWhen names the 11-01 read.
- **I-034:** one note appended. Tonight's two local timeouts under memory pressure (`bareCos` 6.1s, `checkStagedSecrets` 68s) are more evidence for this row. Command: `continuity-edit --set I-034 --field notes --append-value-file tmp/i034-note.md`, which printed "wrote 1 change(s)".

**Hygiene draft:** 0 lines — 0 accepted · 0 amended · 0 rejected. `tmp/hygiene-draft-sinusoidal-cycles-2026-10-11-r4.md`; inputs all `none`.
- READ-MUTATED: "none — 0 reads guarded".
- check-wait-justification: "RESULT: PASS — 30 of 42 row(s) carry `waitJustification`; 0 warn / 1 info (exit 0)". The info line is I-034. I-037 was given its waitJustification after the helper ran, so there are now 31 of 43.
- check-engineering-zero: "RESULT: PASS — lane sinusoidal-cycles: 0 findings, 0 unreadable (exit 0)". No lockfile changed since.

**Due-gate verification:** "verdict: CLEAR — every gate due at Phase 0 was dispositioned" against the rail day's snapshot (taken 2026-10-11, 0 rows, 43 swept). The tool also prints "snapshot STALE · 1 MT day(s) old". That is because the close ran after MT midnight: the snapshot IS the rail day's (2026-10-11), and the rule is never to re-snapshot at close. Today's (10-12) snapshot belongs to the 10-12 day session's Phase 0.

**Receipt:** P3's receipt (330323f0) still holds. Nothing new.

**Today panel — and a clobber I caused and repaired:**
- What happened: I ran `update-daily-brief --date 2026-10-11` as the P5 prompt says ("pass --date explicitly, always"). The server's brief had already rolled to 2026-10-12, with rows from agentic-news, quickbite and sound-shapes. "A different --date starts a fresh day", so my write reset the brief and dropped those three rows (commit b97fff19b; the file before it was 287ed15c0, 3 rows).
- Repair: I restored the three rows verbatim from 287ed15c0 with `--file … --date 2026-10-12` (commit 9bc4a5deb: inserted 3, preserved dreamflyer, `reset: false`, 4 rows). Then I wrote this lane's row as a 10-12 row (commit e1439cd2a, 5 rows, all preserved). The ship landed 10-12 MT ~01:45.
- Finding for the orchestrator: the P5 "--date = rail day" rule clobbers the next day's rows whenever a close runs after MT midnight and another lane has already written the new day.

**Primer:** `docs/cold-starts/2026-10-12.md`, banner 1,153 chars. First action: `check-embed-snippets` on production.

**Pending reads:**
- 2026-10-13: the W-004 walk (I-029, I-030, I-031, I-033, I-035, I-036's three questions).
- 2026-10-20: I-027, I-034.
- 2026-11-01: I-037. One Render log line for /embed. Referer present → add a crawl-read leg; absent → close as delivered, encounter blind by construction.
- 2026-11-04: W-005, I-032.
- 2026-12-01: I-025 (David).

**UNRESOLVED:** none.

codexCalls: 0 (this phase; the round's three review runs are counted on P3 330323f0) — probed-declined

[standing-rules-hash: 88cc2dc9]
