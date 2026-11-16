# Journey-walk — 2026-11-15 (flow 1, cold; phone)

Walked on production `https://sinusoidalhistory.com` on 2026-11-15 from about 6:35 PM MT, after the lane's same-day ship "each /cycles entry says how many years too short its record is" (`2f533e3`, `b0da386`). Walker: an orchestrator helper, not the lane; it read this repo's 2026-10-14 walk and `docs/key-user-flows.md` before walking and nothing else. N=1, synthetic.

How: one headless Chromium, Playwright `devices['iPhone 13']` (390x664, touch, real taps), anonymous, one pass: `/` first screen and every scroll stop → Calibrate tab → focus Ray Dalio → FULL PAGE → `/cycles/dalio` scroll stops → `/cycles` (today's ship) scroll stops → an index entry → `/methods` first screen → `/embed?view=facets&cycles=dalio`. Same phone size as the 10-14 walk's Pass A. Desktop (that walk's Pass C) was not walked this time.

Screenshots: `docs/journey-walk-2026-11-15/sc-journey-NN-<screen>.png` (32 frames taken). The 10-14 walk kept its frames in the session scratchpad and did not commit them. **Console and page errors: 0 on every page.**

> **Lane note, 2026-11-16 P1:** only frames 11 and 12 are committed, the two the 11-16 report cites as proof of the top finding. David's card dd410b2a says to commit only the pictures a report points at as proof. The other 30 frames were moved out of the repo, not deleted. The other frame numbers below refer to captures that are not in the tree.

---
## BLUF
- **The pattern:** the 10-14 walk's headline is fixed. The honest answer now meets the reader at every surface: the home first screen ("SITE'S PEAKS · NO CYCLE CONFIRMED" over the glance figure, and "None is confirmed: nine cannot be tested on the record that exists…" under it), every facet card ("DOES IT HOLD UP? Not testable on the record that exists"), the focused card (verdict first, with "Its paired record covers 2.0 of the 3.0 full periods…"), the single-cycle embed, and since today every `/cycles` entry ("Can't be tested yet: its record is 73 years too short."). What is left is the **second click**: the one interactive promise on the home page, "tap one to focus and calibrate", still puts the sliders about 700px below the curve they move (more than a phone screen) on a phone, under a 20-line peak-calibration paragraph.
- **The highest-leverage fix:** in the focused card on a phone, put CALIBRATE directly under the chart and fold the peak-calibration paragraph behind a "Why 1950?" disclosure. Same as the 10-14 walk's finding 5, now the top one because finding 1 is done.
- **Cheap defect (new, today's surface):** the Kondratiev entry on `/cycles` names two different series: "Paired data - US TFP growth (5-yr rolling)" and, one line later, "the record it is judged on, US TFP growth (annual, unsmoothed), is 85 years too short." The explanation sits ~4,000px further down ("for some pairings a different cut from the one drawn on the chart"). A cold reader sees a contradiction.
- **Scores:** coherence 4/5 (was 3), visual/brand 4/5 (same), effectiveness 4/5 (was 3).

## The walk, in order (phone 390x664, taps)

1. **`/` first screen** (`01-home-first-screen`). Title "Sinusoidal History"; meta description "Ten historical cycle theories on one shared time axis. A comparison tool — not prophecy." "Ten cycles, / one axis." / "Long-wave theories of history." / kicker "SITE'S PEAKS · NO CYCLE CONFIRMED", ten named one-period curves on a 1600–2000 axis, "height: shape, not size", and the caption "None is confirmed: nine cannot be tested on the record that exists, and Turchin (50y) has no data series on this site." **The answer is on screen one.** The ten present-tense "peaking in 2026" rows of 10-14 are gone.
2. **Scroll stops 1-7** (`02…08-home-scroll*`). "Each in detail below — tap one to focus and calibrate.", range chips directly under the figure, the editor's-note pull line ("They are anchors … not evidence that the cycles agree."), Facets / Calibrate tabs, then ten facet cards **each carrying "DOES IT HOLD UP? Not testable on the record that exists"** (Turchin (50y): "Not tested"), the editor's note, "NO. 10 · A RECKONING / Does each cycle hold up?" listing all ten with the same verdict, and the closing note "0 of the 9 reach its 3.0-period evidence gate — none of these records is long enough to test, which is itself the finding." Page height 4,309px.
3. **Tapped Calibrate** (`09-calibrate-tab`, `10-calibrate-tab-scroll`). URL `?tab=calibrate`; the page scrolled to the tab row (y=661), so the tap now visibly does something (10-14 finding 8, fixed). The cycle list has **nine** entries (Turchin (50y) absent, no reason given: 10-14 finding 8's second half, still there). The selected Ibn Khaldun card leads with its verdict and "covers 1.8 of the 3.0".
4. **Tapped Ray Dalio** (`11-focused-dalio`). `?focus=dalio`. The card opens with "DOES IT HOLD UP? / Not testable on the record that exists / Its paired record covers 2.0 of the 3.0 full periods this site requires before testing. Details →", then the theory-over-data chart. **No "PEAKING" badge.** This was 10-14's ONE; it shipped.
5. **Scroll** (`12-focused-dalio-scroll1`). The italic description, then a ~20-line "PEAK CALIBRATION —" paragraph, the source line, "FULL PAGE →", and only then "CALIBRATE / REFERENCE PEAK YEAR 1950 / PERIOD (YEARS) 75y". The chart ends ~700px above the sliders, so they are never on screen together. Moving a slider here still shows only numbers.
6. **Scroll** (`13-focused-dalio-scroll2`). "PEARSON R · VS. US SHARE OF WORLD GDP -0.175 / full record 1870–2022 · n=153 / Diagnostic, not a test statistic." A big gold number directly after a verdict that says no test exists; it is labelled, but it is the most prominent number on the card.
7. **FULL PAGE →** (`14-cycle-dalio-first-screen`). H1 "Is Ray Dalio's Big Cycle peaking?", verdict box "Not testable on the record that exists — and that is the finding, not a dodge.", "152 years: 2.0 of the 3.0 … Roughly 73 more years".
8. **Cycle page scroll stops** (`15…20`). Curve with "A shape that looks alike is not a test.", peak calibration, "Where this curve plots its extrema" (1913 · 1988), paired data block with the **full** source "Maddison Project Database 2023 (Bolt & van Zanden, 2024, J. Econ. Surveys, DOI 10.1111/joes.12618)", Spectral verdict "INSUFFICIENT DATA — NO TEST POSSIBLE · 2.0 OF 3.0 REQUIRED PERIODS", swipeable figure.
9. **`/cycles` (today's ship)** (`21-cycles-index-first-screen` … `29-cycles-index-scroll8`). "The ten cycles / By this site's own test, 0 of the 9 paired theories have a record long enough … See which ones, and how short ↓". Entries by ascending period, each with a plain-sans verdict line: Schlesinger "its record is 18 years too short", Turchin (50y) "Not tested: there is no paired record to test it against.", Kondratiev (the two-series line above), Perez 7, Huntington 36, Dalio 73, Strauss-Howe … Then "Does any of them hold up?" with the per-cycle table ("needs 73 more years · 75y period · 152y record · 2.0 of 3.0 periods"). Page height 7,368px. **Every entry now answers the question without a click.**
10. **Tapped an index entry** (`30-index-entry-landing`, Kondratiev). The cycle page shows the curve figure first and the verdict box under it (Dalio's page, a claim page, has the verdict first): consistent with the flow map's step 5 rule, but a reader arriving from a verdict-led index sees the verdict move.
11. **`/methods`** (`31-methods-first-screen`). "How the numbers were chosen", "In brief…", "The result to read first: … 0 of the 9 pairings have a record long enough…". Unchanged and good.
12. **Embed** (`32-embed-single-dalio`). "Ray Dalio — Big Cycle / DOES IT HOLD UP? / Not testable on the record that exists →", the chart with a year axis, "via Sinusoidal History · methods & sources". The verdict now travels with the picture (10-14 finding 1's embed half, fixed).

Not walked: desktop, `/poster`, `/about`, `/colophon`, the share card (`/og`), copy attribution (the source line it was built from now reads in full on the page, frame 18, but the copied text itself was not read: **UNREACHED**). No account wall exists on this site.

## What changed since 2026-10-14

| 10-14 finding | Now |
|---|---|
| 1. Focused card and embed show curve-over-data with "PEAKING" and no verdict | **Fixed.** Verdict leads the focused card (frame 11), every facet card (02-05) and the embed (32); no phase badge anywhere |
| 2. Copy attribution truncated at "J" | Fixed per the 10-14 dispositions (`seriesCredit.ts`); the on-page source reads in full (frame 18). Copied text not re-read (UNREACHED) |
| 3. Phone home leads with ten "peaking in 2026" claims; "0 of the 9" on screen 7 | **Fixed.** The verdict is on screen one (frame 01) |
| 4. Desktop hero "for stress-testing" | Not walked (desktop) |
| 5. Phone calibrate: sliders out of sight of the curve | **Still there** (frames 11-12). Now the top finding |
| 6. /methods "nothing is interpolated" contradiction | Not re-read (only the first screen was walked) |
| 7. No share action on the cycle page | Not re-checked |
| 8. Calibrate tab no visible change; 9 chips vs ten | First half **fixed** (tab scrolls to itself, frame 09); second half **still there** (nine cycles, no reason given) |
| New | `/cycles` per-entry verdicts (today). Kondratiev entry names two different series (new defect). Home page now says "Not testable on the record that exists" 18 times on one page (nine facet cards and nine reckoning rows, plus the glance caption in other words): consistent, but the third saying adds nothing |

## Three-axis score (one journey)
- **(1) Narrative coherence: 4/5 (was 3).** Value before asks: the answer is on the first screen of every entry point walked (home, focused card, cycle page, index, methods, embed), and nothing asks the reader to play before telling them what the site concluded. Every phrasing of the verdict uses the same words ("Not testable on the record that exists"), which is the coherence the 10-14 walk lacked ("evidence gate" / "floor" / "three full cycles" still coexist, but each now sits next to the shared headline). Two seams remain: the calibrate promise on a phone (the curve and its sliders are more than a screen apart), and the verdict that jumps from above the chart (claim pages) to below it (other cycle pages) depending on which cycle you tapped.
- **(2) Visual/brand: 4/5.** Serif display, mono kickers, cream ground and plain-sans verdict lines are consistent from home through index, cycle page, methods and the embed. The embed now uses the same card frame language as the home facet. Seam: the gold Pearson r (-0.175) is set larger than the verdict it sits under.
- **(3) Effectiveness: 4/5 (was 3).** A reader who wants "does Dalio's cycle hold up?" gets it in one tap from home, zero taps from the index, and the embed passes it on. The remaining gap is the second job the home page offers (calibrate and see), which a phone reader cannot see working.

## Claims vs what the page shows
| Page | Sentence (verbatim) | Shown on the page? | Verdict |
|---|---|---|---|
| / | "None is confirmed: nine cannot be tested on the record that exists, and Turchin (50y) has no data series on this site." | Nine facet cards "Not testable…", Turchin (50y) "Not tested" | Matches |
| / | "Nine of the ten peak years fall between 1945 and 2020." | Index peaks: 1970, 1970, 1973, 2000, 1968, 1950, 1955, 1945, 1789, 2020 → nine in 1945–2020, Khaldun 1789 outside | Matches |
| / focused Dalio | "Its paired record covers 2.0 of the 3.0 full periods" | 152y / 75y = 2.03 | Matches |
| / Calibrate, Khaldun | "covers 1.8 of the 3.0" | Index: 211y / 120y = 1.76 | Matches |
| /cycles | "0 of the 9 paired theories have a record long enough" | 9 rows "Insufficient data", 1 "Not tested" | Matches |
| /cycles | Schlesinger 18, Kondratiev 85, Perez 7, Huntington 36, Dalio 73, Strauss-Howe 16, Modelski 178, Khaldun 149, Turchin 339 "more years" | 3×period − record: 90−72=18, 162−77=85, 165−158=7, 180−144=36, 225−152=73, 252−236=16, 330−152=178, 360−211=149, 450−111=339 | All 9 match |
| /cycles, Kondratiev | "Paired data - US TFP growth (5-yr rolling)" then "the record it is judged on, US TFP growth (annual, unsmoothed)" | Same entry | **Two series named in one entry**; explained ~4,000px lower |
| /cycles/dalio | "Roughly 73 more years" | 225 − 152 | Matches |
| embed | "Not testable on the record that exists →" | Links out | Matches the cycle page |

## Map vs territory
Screens and states met on this walk that `docs/key-user-flows.md` does not enumerate, or describes as they no longer are. Listed, not edited:

1. **Facet-card verdict line** ("DOES IT HOLD UP? Not testable on the record that exists") on every home facet card, and the verdict block leading the **focused** card ("Its paired record covers X of the 3.0 … Details →"). Step 3 and step 4 do not list it.
2. **The glance kicker** "SITE'S PEAKS · NO CYCLE CONFIRMED" (step 2 describes the caption, not the kicker).
3. **"NO. 10 · A RECKONING / Does each cycle hold up?"** list on home (step 3 calls it "verdict panel (`NowSummaryPanel`)"; it matches, but the visible name differs).
4. **`/cycles` index contents:** the per-entry verdict line (today's ship), "THE LONGER STORY" disclosure per entry, and the "Does any of them hold up?" table. Step 6 lists `/cycles` only as an exit.
5. **Single-cycle embed now carries a verdict line** with a link; flow 3 step 2 still says "the chart alone: a 200px curve with its year axis, no summary panel".
6. The Calibrate tab's **scroll-to-tab on tap** and its nine-cycle list (no Turchin (50y)), not stated in step 4 or the carried gaps.

## The ONE change you'd make first
On a phone, put the CALIBRATE block (the two sliders and "reset to published") directly under the focused card's chart, and fold the peak-calibration paragraph behind a one-line "Why this peak year?" disclosure. The home page's own instruction is "tap one to focus and calibrate", and today the reader who does that moves a slider more than a screen below the curve it moves. The `?tab=calibrate` landing already shows it can be done. Reversible, no copy change beyond the disclosure label. Cheap one alongside: on the Kondratiev `/cycles` entry, say in the same line why the judged record differs from the drawn one ("judged on the annual series; the chart draws its 5-year average").
