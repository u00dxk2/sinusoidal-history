# Journey-walk — 2026-10-14 (flow 1, cold; phone + /methods search entry + desktop)

The rotation pass `check-cycle-rotation` called DUE (exit 3, 18 days since 2026-09-26). It ran on production `cfffd0f` by a fresh cold walker that read no repository files. N=1, synthetic. The screenshots are in the session scratchpad and were not committed. The walker's report follows below the rule, verbatim.

## Lead's dispositions (checked against source before acting)

| # | Finding | Verified | Disposition |
|---|---|---|---|
| 1 | The home focused card and the single-cycle embed show curve-over-data and a "PEAKING" badge with no verdict | Reported, not yet re-read in source | **The ONE.** Carried to the next P1 as a candidate: it is a `Viz` change (client-rendered, so the rendered-text gate is blind to it, per AGENTS.md) and needs its own walk |
| 2 | "Copy attribution" truncates the data credit to "(Bolt & van Zanden, 2024, J)" | **CONFIRMED** at `src/app/(app)/cycles/[id]/page.tsx:787` (`source.split(". ")[0]`). Sibling sweep across all 9 series: **4 broken** (Maddison ×2 "J", Stimson "James A", HATCH "U"). The same pattern occurs nowhere else in src/, scripts/ or public/ | **FIXED today**: an explicit per-series credit list, `src/lib/seriesCredit.ts`, plus a test (see the daily report) |
| 3 | Phone home: ten present-tense phase claims first, "0 of the 9" on screen 7 of 7 | Reported | Carried. It overlaps #1 and is partly a taste call (what the home page leads with is David's) |
| 4 | Desktop hero "for stress-testing" contradicts 0-of-9 | Reported | Carried as a copy fix candidate |
| 5 | Phone calibrate: sliders out of sight of the curve | Reported | Carried |
| 6 | /methods "nothing is interpolated" contradicts forward-fill and WID interpolation on the same page; the shorter-coverage list omits 2 series | Reported | Carried. It is a claims fix on a mirrored page, so both /methods and methods.md change together |
| 7 | No share or copy-link action on the cycle page | Reported | Carried |
| 8 | Calibrate tab: no visible change on tap; 9 chips while the page says ten | Reported | Carried |
| 9 | Minor (a missing full stop, the period-slider range against the prose, the internal "Phase 1" label on embed docs, an unlabelled tick, the title scrolled off on the #does-it-hold-up landing, the share-card face) | Reported | Carried |

**Map vs territory:** the walker met no screen missing from `docs/key-user-flows.md` flow 1. It did not visit /poster, /about, /colophon or /state.

---
## BLUF
- **The pattern:** the honest answer ("Not testable on the record that exists — and that is the finding, not a dodge.") lives on the cycle page and on /methods. The two surfaces a reader meets first or passes on don't carry it: the home chart and the single-cycle embed. Both show a theory curve laid over a data line with a present-tense badge ("PEAKING") and no verdict. On a phone, the "0 of the 9" sentence sits on the last of seven home screens.
- **The highest-leverage fix:** put the cycle page's one-line "Does it hold up?" verdict inside the focused facet card on the home page, and into the `/embed?cycles=<id>` frame. It is the same sentence the share card already prints.
- **Cheap defect:** the copied attribution truncates its data citation to "(Bolt & van Zanden, 2024, J)".
- **Scores:** coherence 3/5, visual/brand 4/5, effectiveness 3/5 (4/5 once you reach the cycle page).

## The walk, in order
Screenshots and dumps were written to the session scratchpad (`journey-1014/`) and were not committed. Console errors: **0 on every page in all three passes.**

### Pass A — phone 390x664, taps
1. `/` first screen. "Ten cycles, / one axis." / "Long-wave history, 1600–2050." / "EVERY CYCLE, AT A GLANCE" lists ten rows such as "Ray Dalio (75-year cycle): peaking in 2026." As a reader I learn ten present-tense positions but nothing about whether any of it holds up. The Facets/Calibrate tabs sit right at the fold (y≈658 of 664) and are cut off.
2. Scroll stops. Ten facet cards, each a theory curve plus a data line. Turchin (50y) has no data line. The facet axis reads "1600 1680 1760 1840 [unlabelled tick] now · 2026". The editor's note says "That is not convergence - it is a selection effect." Then come the Range chips and the brush, and "State of the cycles". The only verdict on the page is at the very bottom (screen 7 of 7): "0 of the 9 reach its 3.0-period evidence gate".
3. Tapped **Calibrate**. The URL becomes `?tab=calibrate` and the page scrolls 38px. The first screen looks identical apart from the tab highlight, because all the new content is below the fold. Weak feedback.
4. Calibrate scroll stops. The chip list has **9** cycles (Turchin (50y) is absent, unexplained). Ibn Khaldun is preselected, with sliders and "PEARSON R … 0.092 … Diagnostic, not a test statistic."
5. Facets again, then tapped **Ray Dalio — Big Cycle** (URL `?focus=dalio`). The card expands with a big curve-over-data chart. The data peak (~1945) sits almost on a curve peak, so it looks like a match. Below it: description, a 14-line "PEAK CALIBRATION" paragraph, "FULL PAGE →", then the sliders. There is **no verdict** on this card.
6. Dragged the peak slider. It read "1972 published 1950", r moved from −0.175 to 0.038, and the URL gained `peak.dalio=1972`. **The curve being moved is about 600px above, off-screen**, so on a phone I moved a slider and saw only numbers change.
7. "reset to published" works.
8. Range **Modern**. "showing 1900–2050" and the brush selection moved. Settled within 300ms. Nothing animated long enough to wait for.
9. Scrolled back to the zoomed Dalio card.
10. Tapped **FULL PAGE →**, reaching `/cycles/dalio`. Title "Ray Dalio — Big Cycle · 75-year period · Sinusoidal History". The first screen has a small curve, the record in its own hatched strip, "A shape that looks alike is not a test.", and the box "RAY DALIO · DOES IT HOLD UP? Not testable on the record that exists — and that is the finding, not a dodge." **This is the first honest answer I got.**
11. Scroll stops. "This is not a verdict about this theory in particular: 0 of the 9 paired constructions on this site clear that floor." Then the position sentence ("2026 sits at a peak … That is a position of this construction, not the theorist's forecast."), PEAKS/TROUGHS, the paired-data block with "UPSTREAM SOURCE ↗ / CSV ↓ / PROVENANCE", the Spectral verdict, the cross-grid sentence, a swipeable figure ("Swipe sideways for the whole figure", ← →), "FIGURE SVG ↓ / FIGURE PNG ↓", and finally **"REUSE THIS · COPY ATTRIBUTION"**, then "OPEN IN THE CHART →".
12. Tapped **NARRATIVE** (in-page jump to `#confidence`). **Back** landed at `/cycles/dalio` scrollY 0, where I tapped. Correct.
13. Tapped "The full verdict, the figure and the protocol →" (`#spectral-verdict`). **Back** landed at y=473, where the link was. Correct.
14. **COPY ATTRIBUTION**. The button changes to "Copied ✓". The clipboard holds: "Kooi, D. (2026). Sinusoidal History: Ray Dalio — Big Cycle. https://sinusoidalhistory.com/cycles/dalio · DOI 10.5281/zenodo.21998618. Paired data series: US Share of World GDP (Maddison Project Database 2023 (Bolt & van Zanden, 2024, J), CC BY 4.0." **The data citation is truncated at "J".** The DOI resolves (HTTP 200 → zenodo.org/records/22036252).
15. **FIGURE PNG ↓** downloads `dalio-spectral.png`. CSV: HTTP 200, 153 data rows, 1870–2022.
16. **Share:** there is no share or copy-link control on the page, and `navigator.share` is undefined in this context. A reader shares through the browser. The link preview (og:image) does carry "DOES IT HOLD UP? Not testable on the record that exists." Good, but it is set in a sans face, not the site's serif.
17. **OPEN IN THE CHART →** lands on `/?focus=dalio` with the Dalio card in view. Again, no verdict there. **Back** returned to the cycle page at y=4639. Correct.
18. "MOVE THE PEAK YOURSELF: CALIBRATE THIS CYCLE →" lands on `/?tab=calibrate&focus=dalio` with the chart and sliders together in view. Better than step 6.
19. **Back from the cycle page** returned to `/?focus=dalio&range=modern` at y=1158 with focus and range restored.
20. Side look at `/cycles`: "By this site's own test, 0 of the 9 paired theories have a record long enough to check at their stated period … See which ones, and how short ↓".

### Pass B — phone 390x664, cold at /methods
- As a searcher I would see the title "Methods · Sinusoidal History" and the description "How every curve and series is built: sources, transforms, normalization — and where the method breaks down, including why the correlation readout isn't a test." It's honest, but it promises plumbing, not an answer about Dalio or Turchin. I would probably not click it with my question in mind.
1. First screen. "How the numbers were chosen", then "In brief. This site draws 10 historical cycle theories as pure sinusoids … with a real data series overlaid on 9 of them." Then "The result to read first: … 0 of the 9 pairings have a record long enough (three full periods) to be tested at the theory's own period. How the test works →". **Worth my time: yes.** The answer to my goal is on screen one.
2. Tapped "How the test works →". It jumps to `#spectral-testing`: one row per cycle, e.g. "Ray Dalio / Insufficient data — no test possible · needs 73 more years / 75y period · 152y record · 2.0 of 3.0 periods". **Back** returned to `/methods` y=0. Correct.
3. Opened "THE 19 RE-PAIRINGS, CELL BY CELL". 19 list items. The plain-words lead is understandable, e.g. "Each p says how often random drift alone would fit that period at least this well; only a p below 0.05 could count, and none here is."
4. Tapped the "Ray Dalio" row, reaching `/cycles/dalio#does-it-hold-up`. It lands with the verdict box at the top. The page title and the small chart are scrolled past, so the box's "RAY DALIO ·" kicker is the only page identity. **Back** returned to `/methods` at y=8016, the row I tapped. Correct.

### Pass C — desktop 1440x900, mouse
1. `/`. This is a different hero from the phone. "Khaldun, Kondratiev, … Modelski — drawn over 1600–2050. Each a pure sinusoid pinned to one documented peak; nine of the ten carry a paired empirical series for stress-testing." / "Click a row to focus one cycle; drag the brush below to zoom in time." Tabs are **Facets / Overlay / Calibrate** (the phone has no Overlay), plus a "show historical events" checkbox. There is no "at a glance" strip.
2. Scroll stops. Facets with event labels (Civil War, WWI … COVID). "State of the cycles" is a two-column list with trough·peak·trough bars.
3. Calibrate tab: 9 cycle chips again. Overlay tab: ten curves plus data in one dense tangle.
4. Clicked the Dalio facet. On desktop the chart, prose and sliders are side by side, so the calibration works here. Still **no verdict** on the card.
5. Dragged the peak slider. The URL gains `peak.dalio=1936`, the badge becomes "cal" / "falling".
6. Dragged the brush. The range becomes 1650–1816 and settled immediately. At this zoom the Dalio data (1870+) is out of frame.
7. "FULL PAGE →" goes to `/cycles/dalio` with the verdict box on the first screen. My calibration is silently dropped, which is reasonable but unannounced.
8. Scroll stops. The figure shows "INSUFFICIENT SPAN — 2.0 OF 3.0 REQUIRED PERIODS".
9. COPY ATTRIBUTION: same truncated "J" text.
10. Verdict jump. **Back** went to y=0. **Back again** returned to `/?focus=dalio&peak.dalio=1936&range=1650-1816` at y=889, with full state restored.
11. Found "EMBED" in the footer, reaching `/embed/docs`. There are snippets for state-only, facets, a single cycle with an override, and overlay. Copy includes the internal label "Phase 1 single-SVG view". `/embed?view=facets&cycles=dalio` shows the curve, the data line laid on it, and "PEAKING". There is **no verdict and no "a shape that looks alike is not a test"**, and the footer links to "/" and "/methods", not `/cycles/dalio`.

## Three-axis score (one journey)
- **(1) Narrative coherence: 3/5.** The home page asks me to play (tabs, sliders, brush, ten present-tense "peaking in 2026" claims) before it gives me the value. On a phone the answer is 7 screens down. On desktop the hero promises "stress-testing", which the site's own result says is impossible. The focused Dalio card is a false finish line: it is the richest view I meet and it looks like a match, yet it never says "not testable". I got the answer only because I tapped "FULL PAGE →". Duplication: the Dalio peak-calibration paragraph appears in full on the home card, the cycle page and (via OPEN IN THE CHART) the home card again. The three "0 of the 9" restatements are consistent but differently worded ("evidence gate", "floor", "three full cycles"). Phone calibrate puts the sliders out of sight of the curve they move. Good: Back behaves correctly everywhere I tested, and /methods lands the answer on screen one and routes cleanly to the cycle verdict.
- **(2) Visual/brand consistency: 4/5.** Serif display, mono kickers and a cream ground are consistent from home to /cycles to the cycle page to /methods. Seams: the share card uses a sans display; the cycle-page verdict box body is sans at a larger size than its neighbours; the embed is a bare chart in a different frame language; the phone and desktop homes differ in hero copy and tab set (Overlay is desktop-only), so it's not the same product description.
- **(3) Effectiveness: 3/5.** Yes, I got an honest answer: Dalio's record is "2.0 of the 3.0", "Roughly 73 more years" short, and the same is true of every cycle. And yes, I could cite it: copy attribution, DOI that resolves, CSV, SVG/PNG, licence text. But the citation text is visibly broken ("…2024, J)"), there is no on-page share action, the most natural thing to share as a picture (the embed, or a screenshot of the home card) carries the curve-matches-data impression without the verdict, and the share card is the only shared surface that carries the answer.

## Claims vs what the page shows
| Page | Sentence (verbatim) | Shown on the page? | Verdict |
|---|---|---|---|
| / (both) | "Ten cycles, one axis." | 10 rows / 10 facets | Matches |
| / (phone) | "0 of the 9 reach its 3.0-period evidence gate" | The 9 and the gate are not listed on the home page; only a link to spectral testing | Not shown here (true on /methods) |
| / (desktop) | "nine of the ten carry a paired empirical series for stress-testing" | 9 facets have a data legend, Turchin (50y) none | Count matches. "for stress-testing" contradicts the 0-of-9 result |
| / | "The grey curve is the mean of all ten cycle sinusoids" | Not checkable | Unverifiable |
| / Calibrate tab | (implied by "tap one to focus and calibrate") | Chip list shows 9 cycles, not 10 | Unexplained gap |
| /, Dalio card | "full record 1870–2022 · n=153" | CSV has 153 rows, 1870–2022 | Matches. The cycle page says "runs 152 years" for the same record: both true (span vs count), but two numbers for one thing |
| /cycles/dalio | "2.0 of the 3.0 full periods … Roughly 73 more years" | 152/75 = 2.03; 225−152 = 73 | Matches |
| /cycles/dalio | "0 of the 9 paired constructions on this site clear that floor" | Not listed on the page | Not shown here (true on /methods) |
| /cycles/dalio | "set against 1 other record … V-Dem (lowest p 0.149)" | /methods row "Ray Dalio's 75-year period × US Liberal Democracy Index … p 0.149" | Matches |
| /cycles/dalio | "set against 2 other theories' periods: Schlesinger Jr.'s 30 years and Turchin's 50 years (lowest p 0.137)" | /methods rows p 0.183 and 0.137 | Matches |
| /cycles/dalio | "None of these 3 reached p < 0.05 under either noise model." | Brackets 0.266 / 0.498 / 0.304 | Matches |
| /cycles/dalio | "All 19 re-pairings, cell by cell →" | /methods lists 19 items | Matches |
| /cycles/dalio | "PEAKS 1650 · 1725 · 1800 · 1875 · 1950 · 2025 / TROUGHS 1613 · … · 1988"; "curve height +1.00"; "next low falls around 2063" | Arithmetic from 75y / 1950 | Matches (cos(2π·76/75) ≈ 0.997; trough 2062.5) |
| /cycles/dalio | "compare it with the other nine on one axis" | 10 on home | Matches |
| /cycles/dalio | "(99,999 bootstrap draws)" | Not checkable | Unverifiable |
| /cycles/dalio attribution | "Maddison Project Database 2023 (Bolt & van Zanden, 2024, J), CC BY 4.0." | Same page's Source line reads "(Bolt & van Zanden, 2024, J. Econ. Surveys, DOI 10.1111/joes.12618)" | **Mismatch, truncated** |
| /methods | "10 historical cycle theories … data series overlaid on 9 of them" | Table: 9 rows plus "Turchin (50y) Not tested — no paired series" | Matches |
| /methods | "0 of the 9 pairings have a record long enough" | All 9 rows say "Insufficient data" | Matches. I re-did every row's arithmetic (periods, records, "needs N more years") and all 9 hold |
| /methods | "19 re-pairings … none reaches p < 0.05 even before any correction (lowest unadjusted p 0.094)" | 19 items, min 0.094 (Schlesinger × V-Dem), min bracket 0.119 | Matches. Composition also checks: 7+5+2+2+2+1 |
| /methods | "nine of the ten cycles have exactly one paired series" | Data sources section lists 9 series, one per cycle | Matches |
| /methods | "Every data series has shorter coverage." followed by a list | The list names 7 series and omits HATCH (1865–2023) and Leading Economy's share | **Incomplete list** |
| /methods | "Gaps are simply absent from the chart - nothing is interpolated." | Same page: Maddison "forward-fills each country's GDP between sparse benchmark observations"; WID pre-1913 points "are WID interpolations" | **Contradicted on the same page** |
| /methods | "There are exactly four verdict states" | Only 2 appear (expected, no claim of use) | OK |
| /cycles | "0 of the 9 paired theories have a record long enough" | Turchin (50y) "No paired data series this round" | Matches |
| /embed/docs | "Ten charts are taller than any frame" | — | OK |

## Screens and states I met
- Home: phone first screen, scroll stops 1–7, Calibrate tab (phone, Khaldun preselected), focused facet `?focus=dalio` (phone and desktop), slider-moved state (`peak.dalio=…`, "published 1950", "cal" badge), reset state, Range preset state (`range=modern`), brushed state (`range=1650-1816`), desktop Overlay tab, desktop event labels on.
- /cycles index.
- /cycles/dalio: first screen, `#confidence` jump, `#spectral-verdict` jump, `#does-it-hold-up` landing, figure scroller with ← →, "Copied ✓" state, PNG download.
- /methods: first screen, `#spectral-testing` table, cross-grid `<details>` closed and opened.
- /embed/docs; /embed single-cycle frame.
- OG share card `/og?cycle=dalio`.
- External: Zenodo DOI landing, CSV file.
- Not visited: /poster, /about, /colophon, /state/2026.

## Findings, ranked
1. **The home focused card (and the embed) never answers "does it hold up?"** Where: `/?focus=dalio` on phone and desktop, reached directly and via "OPEN IN THE CHART →"; `/embed?cycles=dalio`. Why it matters: this is the view a reader spends the most time on, and it is what gets embedded. It shows the data peak landing on a curve peak with a "PEAKING" badge and an r value. The cycle page's own warning, "A shape that looks alike is not a test", is absent exactly where the look-alike is drawn. Reversible fix: add the one-line verdict ("Does it hold up? Not testable on the record that exists — 2.0 of 3.0 periods.") plus a link to `/cycles/<id>#does-it-hold-up` at the top of the expanded card and in the embed caption. Point the embed footer at the cycle page.
2. **The copied attribution is truncated.** On `/cycles/dalio`, COPY ATTRIBUTION gives "(Bolt & van Zanden, 2024, J)". It looks like a cut at the first full stop of "J. Econ. Surveys". Why it matters: a citing reader pastes a visibly broken citation, which undermines trust at the exact moment of reuse. Reversible fix: source the attribution's data citation from the full Source string, and check every cycle's attribution, since other sources contain periods too.
3. **On phone, the answer is at the bottom of the home page and the top shows ten present-tense phase claims.** Where: `/`. "(75-year cycle): peaking in 2026." comes first; "0 of the 9 reach its 3.0-period evidence gate" sits at y≈3669 of 3909. Why it matters: it is ask-before-value. A reader who stops after the first screen leaves with the story, not the finding. Reversible fix: one line under "Long-wave history, 1600–2050.", e.g. "None of the nine paired records is long enough to test its cycle — see why →". Taste reshape: lead with the verdict instead of "an editorial chart-room".
4. **The desktop hero says "for stress-testing".** Where: `/` desktop, "nine of the ten carry a paired empirical series for stress-testing". Why it matters: it promises the thing the site concludes cannot be done. It also differs from the phone hero, so the two surfaces describe different products. Reversible fix: reword to "for comparison — none is yet long enough to test" and align the phone and desktop hero copy.
5. **Phone calibrate separates the sliders from the curve.** Where: `/?focus=<id>` on phone. Sliders sit below roughly 600px of prose and "FULL PAGE →". Why it matters: the editor's note invites me to "see how much the peak-year choice is doing", but on a phone I can't see the curve while I move the slider. The `?tab=calibrate` landing does it right. Reversible fix: put the Calibrate block directly under the chart in the focused card, or collapse the peak-calibration paragraph.
6. **/methods "Missing and sparse data" contradicts itself and is incomplete.** "nothing is interpolated" sits against forward-fill and WID interpolation on the same page, and the list omits 2 of 9 series. It matters because this is the page a skeptical searcher lands on. Reversible fix: say "nothing is interpolated by this site for display; two upstream series contain interpolated or forward-filled values (see below)" and add HATCH and Leading Economy coverage.
7. **No share action on the cycle page.** There is "REUSE THIS" with copy attribution, but no "copy link" or native share, even though the OG card is good and carries the verdict. Reversible fix: a "Copy link" / share button beside COPY ATTRIBUTION.
8. **Calibrate tab gives no visible change on tap (phone), and its chip list has 9 cycles while the page says ten.** Reversible fix: scroll the panel into view on tab change, and either include Turchin (50y) or say why it is absent.
9. **Minor:** the Dalio description ends without a full stop ("…a longer ~250-year empire arc") on home, /cycles and the cycle page; the period slider runs 56–94y while the prose says Dalio's range is "about 50 to 75 years"; the embed docs show the internal label "Phase 1 single-SVG view"; the phone facet axis has an unlabelled 1920 tick; the #does-it-hold-up landing from /methods scrolls the page title off-screen; the share card's sans display face is a brand seam (taste).

## The ONE change you'd make first
Put the cycle's verdict line inside the focused facet card on the home page, and reuse the same component in the single-cycle embed: "Does it hold up? Not testable on the record that exists — {record} covers {x} of the 3.0 periods this site requires" with a link to `/cycles/<id>#does-it-hold-up`. Every path in this walk ("tap one to focus", "OPEN IN THE CHART →", "CALIBRATE THIS CYCLE →", any embed) goes through that card. Today it is the one place the site shows a look-alike match without saying it isn't a test. It is a small, reversible change, and the wording already exists on the share card.