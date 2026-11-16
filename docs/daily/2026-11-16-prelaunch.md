# sinusoidal-cycles — 2026-11-16 (Monday, MT)

## BLUF

**P1 picked one change. When a phone reader taps a cycle on the home page, the Calibrate sliders appear directly under the chart they move.** The home page's own instruction is "tap one to focus and calibrate". Measured on production today, the focused card's chart and its peak slider are never on one screen at a phone width: 0 of 8. At 390x664 the span from chart top to slider bottom is 686 to 935px, and at 320x568 it is 747 to 1071px. Desktop fits, 4 of 4 at 323px. The Calibrate tab already puts the sliders first for this same reason (`CycleFacet.tsx:682-686`); the focused card on the Facets tab does not. The change is layout only, with no new words, and it is outside the 11-17 I-075 re-walk: that walk shoots the home first screen at scroll 0 and taps nothing. Section 0 is clean: CI green on 697d6d0f, deploy in sync. The one due gate, I-051, was read: its three search legs all read "not moved" (Dalio 0, Strauss-Howe 0, Turchin 0 named-query impressions). Nothing is built yet. No commit touches the change until the review.

## What changed

Nothing user-visible yet. P1 is selection and prep.

- **Section 0:**
  - Primer: `docs/cold-starts/2026-11-15.md` was read first. No `2026-11-16.md` exists.
  - Listener: 🟢 SSE alive (relaunched by the SessionStart hook, hello 15:21:28Z, replay 0) + loop armed by tool call. All three waker rungs are running.
  - Codex: GREEN (kickoff probe 15:21:06Z: execute and write both proved). Not used at P1.
  - CI: `check-ci-status --workflow ci.yml` → GREEN on 697d6d0f35 (1 success, 0 failures, 0 pending).
  - Drift: `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live 697d6d0f = head.
  - Harness: running 2.1.325 · fleet UNIFORM (28 of 28) · installed 2.1.325 (SAME). The tracked record still says 2.1.277, so the script prints CHANGED. That is a READ, not a stop.
  - Recs yesterday: the 11-15 Recommendation block was that day's P1 packet (I-082). Executed: 2f533e3 + b0da386, live b0da386f, and I-082 is closed.
- **Morning snapshot** (`check-due-gates-dispositioned --snapshot`): "1 gate(s) due on/before 2026-11-16", I-051.
- **I-051 read** (`check-due-gates-dispositioned --run I-051`, exit 0, 1.3s; output in `continuity/read-outputs/I-051.txt`). The page-grouped window 2026-10-31..11-14 gives TOTAL clicks=1, impressions=46, position=7.4: /cycles 22, /about 10, / 7 (the 1 click), /cycles/dalio 3, /cycles/khaldun 3, /methods 3, others 1 to 2. The same route and window grouped by query (a one-off scratchpad read, no PIN printed) gives 1 named row, "cycle of ten", 2 impressions at 7.0, so 2 of 46 impressions are named. Legs by the closeWhen rule: Dalio 0, Strauss-Howe 0, Turchin 0 named-query impressions, so all three read NOT MOVED. Named counts are a floor, and the "cycle of ten" row is the positive control. The closeWhen says to close as "not moved" unless a claim page changed in between. In the window, the three claim cycles' `short_description` gained a closing full stop (94bc547) and nothing else, so no title, H1 or question changed. Disposition for the close: listed under HYGIENE INPUTS.
- **Night helper's walk, verified** (`docs/journey-walk-2026-11-15.md`, an orchestrator helper's synthetic N=1 walk on a 390x664 phone):
  - Top finding, the focused card's sliders sit out of sight of the chart: **CONFIRMED** in source and on production. In source, `ExpandedTail` renders `about` (description, ~20-line peak calibration, caveat, source, Full page) before `controls` unless `controlsFirst`. `controlsFirst` is set only when `onOpenInFacets` is passed, which is the Calibrate tab (`CycleFacet.tsx:190, :841-842`). On production, `focused-span.mjs` measured 0 of 8 phone fits (table in the State Appendix). Frame 12 shows the sliders on screen and no chart.
  - The Kondratiev /cycles entry names two series: **CONFIRMED** in source. The entry prints `Paired data - ${series.name}` (`src/app/(app)/cycles/page.tsx:328`), and the verdict line under it names the judged cut (`:63-69`, `judgedCut`). Turchin has the same shape (from-1820 drawn, 1913 cut judged); the helper did not name it. This was deliberate on 11-15 (primer "Non-obvious"), so a fix is a wording change and needs round 0. It is the next candidate, not today's.
  - The helper's "PROPOSAL" bar: none is in the doc, so nothing goes to a card.
  - Committed with this report: the walk doc and the two frames this report cites (11 and 12). The other 30 frames moved to the session scratchpad, not deleted, per David's card dd410b2a ("commit only the pictures a report points at as proof"). A lane note in the doc says so.

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** on a phone, the focused cycle card puts Calibrate directly under its chart (no row yet; P3 mints one if the review approves). Kind: improve.
- **The user problem, in a reader's words:** no real reader has said it. The site's own words are the promise: "Each in detail below — tap one to focus and calibrate." (`src/components/CycleOverview.tsx:175`). The helper's walker: "The chart ends ~700px above the sliders, so they are never on screen together. Moving a slider here still shows only numbers." (`docs/journey-walk-2026-11-15.md:22`, synthetic N=1).
- **Evidence:**
  - OBSERVED · production, measured today with `focused-span.mjs` (Playwright, `/?focus=<id>`, Facets tab, span from the focused facet's chart `svg[role=img]` top to its first slider's bottom; the same measure as `scripts/check-calibrate-tab.mjs:72`). Population: 4 cycles (dalio, strauss_howe, kondratiev, khaldun) × 3 sizes. Phone widths fit 0 of 8, spanning 686 to 1071px. Desktop 1280x800 fits 4 of 4 at 323px, which shows the measure can pass. Limits: 4 of the 9 paired cycles. The span grows with the length of the rationale text, and Dalio is the longest measured.
  - OBSERVED · source: the Calibrate tab already solved this with `controlsFirst` (`CycleFacet.tsx:682-686`: "With the rationale first, the peak slider sat ~700px below the chart's top at 390x664"). The Facets tab's focused card never gets it (`:190`).
  - OBSERVED · Search Console, page-only grouping, I-051's window (10-31..11-14): `/` had 7 impressions and the site's only click. /cycles is the most-shown page (22 of 46). Shown, not read.
  - OBSERVED · `check-cycle-rotation --lane sinusoidal-cycles` exited 0: "no product-love cycle picks this lane today … run the normal P3".
  - HYPOTHESIS · that a phone reader who taps a cycle tries the sliders and gives up when nothing visible moves. Nobody real has been seen doing it, and there are no client analytics.
  - MISSING · `docs/evangelism-evidence.md` does not exist. The bar reads UNMEASURED (`docs/evangelism-bar.md:30`). No client analytics, by standing choice (card 1e069bb4).
  - MISSING · `docs/key-metrics.json` does not exist (kickoff: "no list yet").
- **Why not the others:** I-075, I-077 and I-078 change the phone home first screen, which the 11-17 re-walk must see unchanged. This change only renders after a tap (`?focus=`), and that walk taps nothing (`docs/walks/2026-11-13-i075.md:19`). The Kondratiev/Turchin entry wording is a word change on a deliberate 11-15 pairing and needs round 0 first, so it is the next candidate. I-071 is dated 11-18.
- **Prior-retro finding that bears on this** (11-15, "a test leg passed for the wrong reason, and red-arming caught it", still on discipline): the new measure leg is red-armed against production before any edit. Today's 0 of 8 IS that red arm.
- **Permission:** a layout change in a lane-owned component, with no copy change. No open card names the focused card (`answered-cards --project sinusoidal-cycles`: 0 lane cards, 4 portfolio riders, 0 new). Binding rules: I-061 (no present position; nothing here adds one) and the copy rulings in memory `project_copy_rulings` (no new words, so none is touched). The home first screen stays as it is until the 11-17 walk.
- **Next action:** kind = improve. In the Facets tab's focused card, on phone widths only, render `controls` before `about`, with CSS order so desktop's two columns stay as they are. Add a Facets-focused leg to `check-calibrate-tab.mjs` (chart top + peak slider fit one screen at `/?focus=<id>` on the Facets tab), and prove it red on production before any edit. No new words, so no round 0. The first command is that baseline, already run once at P1:

  ```
  node C:/Users/david/AppData/Local/Temp/claude/17513fc36ecaa17b/1017f924-78c9-4caa-a500-a6e68931f6e3/scratchpad/focused-span.mjs https://sinusoidalhistory.com
  ```

- **Acceptance condition:**
  1. On production at 390x664 and 320x568, for every paired cycle at `/?focus=<id>` on the Facets tab, the span from chart top to peak-slider bottom is at most the viewport height. Today that is 0 of 8 measured; after, 9 of 9 at each size.
  2. Desktop is unchanged: 1280x800 keeps the description column left and Calibrate right, with the span at 323px.
  3. The new leg in `check-calibrate-tab.mjs` is red on production before the deploy and green after. The existing legs stay green.
  4. No regression on the home first screen: `check-entry-folds --width 320 --height 568` still reads 13 of 13 with `/` at 12px spare. No word on any page changes.
- **Delivery and encounter checks:** delivery means `check-deployed-sha-drift --service sinusoidal-history --wait --sha <full sha>` reads in sync, then `check-calibrate-tab.mjs` against production with the new leg green at both phone sizes. Encounter: blind. A slider move happens client-side, and there are no client analytics. Search Console sees `/` impressions (7 in two weeks), never a tap.
- **Key number:** focused-card chart-and-peak-slider fits on one phone screen. Today 0 of 8 measured on production (4 cycles × 2 phone sizes); target 18 of 18 (9 paired cycles × 2 sizes). Measured this round: yes, the baseline.
- **USER-FACING: yes.** Paths: `src/components/CycleFacet.tsx` (the `ExpandedTail` order on the Facets tab). Internal: `scripts/check-calibrate-tab.mjs` (a new leg), possibly a source-pinned test under `src/lib/`, `continuity/items.json`, `docs/daily/`. No prose mirror carries the card's layout. `public/llms.txt` does not describe it (checked at P3).
- **HYGIENE INPUTS:**
  - (a) due rows not bearing on the choice: 1. I-051 (monitoring, due 11-16) was read today: Dalio 0, Strauss-Howe 0, Turchin 0 named-query impressions in 10-31..11-14, so all three read NOT MOVED. The only claim-page change in the window was a closing full stop on the three `short_description`s. Its closeWhen says: close as "not moved" rather than open another window. Read: `check-due-gates-dispositioned --snapshot` → "1 gate(s) due on/before 2026-11-16".
  - (b) owed child rows: none. Read: kickoff "rows owed to you in skylark-site's ledger: 0 of 823".
  - (c) state reads marked CROSSED: 2. (1) "dated gates due today: 1": I-051, above. (2) "board cards carrying David's word: 4": 2cf09a9d (the /draw page), 3784317b (skylark-site leftover work), dd410b2a (screenshot piles) and 2516f28c (refactor-night permission rules). All four are skylark-site cards, "governs: unlinked". dd410b2a binds this lane's captures and was followed today (2 of 32 walk frames committed). The other three name no work for this lane. Disposition: read.

## State Appendix

**Focused-card span on production, 2026-11-16 ~15:50Z** (`focused-span.mjs`, live 697d6d0f; chart top → first slider bottom, `/?focus=<id>`, Facets tab):

| size | dalio | strauss_howe | kondratiev | khaldun |
|---|---|---|---|---|
| 390x664 | 935 ✗ | 846 ✗ | 782 ✗ | 686 ✗ |
| 320x568 | 1071 ✗ | 947 ✗ | 879 ✗ | 747 ✗ |
| 1280x800 | 323 ✓ | 323 ✓ | 323 ✓ | 323 ✓ |

**I-051 query-grouped read** (scratchpad `gsc-query-read.mjs 2026-10-31 2026-11-14`): "window 2026-10-31..2026-11-14 (sc-domain:sinusoidalhistory.com) TOTAL clicks=1 impressions=46 position=7.4 [query-grouped]" · "cycle of ten clicks=0 impressions=2 position=7.0" · "named-query rows: 1, named impressions 2 of 46".
