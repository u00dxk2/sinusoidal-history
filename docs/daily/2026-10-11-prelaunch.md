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
