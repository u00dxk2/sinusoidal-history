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
