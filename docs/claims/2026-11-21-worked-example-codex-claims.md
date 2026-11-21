# Codex claims pass r1 — worked example, home, /methods title (2026-11-21)

Run: foreground `codex exec -C C:\dev\skylark\sinusoidal-cycles --sandbox read-only -`, prompt `tmp/codex-claims-worked-example-2026-11-21.md` (base bdfa4bb, uncommitted tree). Banner `workdir: C:\dev\skylark\sinusoidal-cycles` (checked). Reviewer's report, verbatim:
codex
I checked the uncommitted working tree at `bdfa4bbde19ffcb757925afb4783f92a5d77a24f`. I used read-only Node scripts to execute the repo’s CSV and chart pipeline, and rendered the React components in memory with the year fixed at 2026.

1. **A1 — HOLDS · REPRODUCED.** Nine pages render the curve-and-record wording. Turchin’s fathers-and-sons page renders the curve-only wording. The worked example and figure receive the same cycle and normalized record points. [WorkedExample.tsx:35](C:/dev/skylark/sinusoidal-cycles/src/components/WorkedExample.tsx:35), [cycle page:154](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/[id]/page.tsx:154>), [cycle page:571](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/[id]/page.tsx:571>)

2. **A2 — HOLDS · REPRODUCED.** The formula matches `sineAtYear` with unit amplitude. The figure samples that function and joins the samples to draw the curve. [cycleMath.ts:3](C:/dev/skylark/sinusoidal-cycles/src/lib/cycleMath.ts:3), [cycleMath.ts:103](C:/dev/skylark/sinusoidal-cycles/src/lib/cycleMath.ts:103), [CycleCurveFigure.tsx:59](C:/dev/skylark/sinusoidal-cycles/src/components/CycleCurveFigure.tsx:59)

3. **A3 — HOLDS · REPRODUCED.** All ten rendered formulas and labels use the stored reference peak and period. The wording explicitly attributes the period to the site’s construction. [WorkedExample.tsx:38](C:/dev/skylark/sinusoidal-cycles/src/components/WorkedExample.tsx:38), [WorkedExample.tsx:56](C:/dev/skylark/sinusoidal-cycles/src/components/WorkedExample.tsx:56), [cycles.json:1](C:/dev/skylark/sinusoidal-cycles/src/data/cycles.json:1)

4. **A4 — HOLDS · REPRODUCED.** The implementation multiplies by amplitude, and all ten stored amplitudes are `1`. [cycleMath.ts:3](C:/dev/skylark/sinusoidal-cycles/src/lib/cycleMath.ts:3), [cycles.json:1](C:/dev/skylark/sinusoidal-cycles/src/data/cycles.json:1)

5. **A5 — HOLDS · REPRODUCED.** A quarter-period step changes the cosine argument by π/2, the distance from an extremum to the nearest midline crossing. [cycleMath.ts:3](C:/dev/skylark/sinusoidal-cycles/src/lib/cycleMath.ts:3), [workedExample.ts:28](C:/dev/skylark/sinusoidal-cycles/src/lib/workedExample.ts:28)

6. **A6 — HOLDS · REPRODUCED.** On all ten pages, the extrema above the table equal its exact peak and trough years rounded to whole years. Perez’s `1972.5` becomes `1973`. Dalio’s `1912.5` and `1987.5` become `1913` and `1988`. Perez’s drawn span ends in 2026 with four quarter-period rows, and secular Turchin’s ends in 2026 with three. Both omit their out-of-span landmarks. [cycle page:535](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/[id]/page.tsx:535>), [cycleRoutes.ts:183](C:/dev/skylark/sinusoidal-cycles/src/lib/cycleRoutes.ts:183), [workedExample.ts:28](C:/dev/skylark/sinusoidal-cycles/src/lib/workedExample.ts:28)

7. **A7 — REFUTED-AS-WRITTEN · REPRODUCED.** All 47 rows fall inside the drawn spans, and all 47 heights match the analytic curve to the displayed precision. Under the supplied “or any chosen year” rule, the table still publishes positions for selected calendar years on every cycle page. No row uses 2026. Narrower sentence with calendar years omitted from the table: “The table gives curve heights at quarter-period offsets from the reference peak within the drawn span.” [AGENTS.md:79](C:/dev/skylark/sinusoidal-cycles/AGENTS.md:79), [workedExample.ts:28](C:/dev/skylark/sinusoidal-cycles/src/lib/workedExample.ts:28), [WorkedExample.tsx:65](C:/dev/skylark/sinusoidal-cycles/src/components/WorkedExample.tsx:65)

   Each cell is the rendered year for the fraction and curve height in its column heading.

   | Cycle | Period | −0.50 / −1.00 | −0.25 / 0.00 | 0.00 / +1.00 | +0.25 / 0.00 | +0.50 / −1.00 |
   |---|---:|---:|---:|---:|---:|---:|
   | Khaldun | 120 | 1729 | 1759 | 1789 | 1819 | 1849 |
   | Kondratiev | 54 | 1946 | 1959.5 | 1973 | 1986.5 | 2000 |
   | Huntington | 60 | 1938 | 1953 | 1968 | 1983 | 1998 |
   | Schlesinger Jr. | 30 | 1955 | 1962.5 | 1970 | 1977.5 | 1985 |
   | Perez | 55 | 1972.5 | 1986.25 | 2000 | 2013.75 | — |
   | Turchin, secular | 150 | 1945 | 1982.5 | 2020 | — | — |
   | Dalio | 75 | 1912.5 | 1931.25 | 1950 | 1968.75 | 1987.5 |
   | Strauss-Howe | 84 | 1913 | 1934 | 1955 | 1976 | 1997 |
   | Modelski | 110 | 1890 | 1917.5 | 1945 | 1972.5 | 2000 |
   | Turchin, fathers-and-sons | 50 | 1945 | 1957.5 | 1970 | 1982.5 | 1995 |

8. **A8 — HOLDS · REPRODUCED.** All nine paired figures draw their named judged record in a strip below the curve, with a separate vertical scale and a shared time axis. Kondratiev uses annual, unsmoothed TFP. Secular Turchin uses the wealth-share record starting in 1913. [seriesOverlay.ts:40](C:/dev/skylark/sinusoidal-cycles/src/lib/seriesOverlay.ts:40), [testedSeries.ts:38](C:/dev/skylark/sinusoidal-cycles/src/lib/testedSeries.ts:38), [CycleCurveFigure.tsx:46](C:/dev/skylark/sinusoidal-cycles/src/components/CycleCurveFigure.tsx:46), [CycleCurveFigure.tsx:66](C:/dev/skylark/sinusoidal-cycles/src/components/CycleCurveFigure.tsx:66)

9. **A9 — HOLDS · REPRODUCED.** The loader applies `ln(1 + max(0, value))` before normalization. Khaldun’s 212 raw observations have a minimum of `0`, so the clamp has no effect on this record. [csvSeries.ts:5](C:/dev/skylark/sinusoidal-cycles/src/lib/csvSeries.ts:5), [series.json:83](C:/dev/skylark/sinusoidal-cycles/src/data/series.json:83)

10. **A10 — REFUTED-AS-WRITTEN · REPRODUCED.** The earliest minima and maxima map to −1 and +1 on all nine pages. The remaining observations are scaled by **value**. They do not lie on a straight line in **time** between those extrema. For example, Perez’s 1865 observation plots at `+0.76`. Extending a straight line through its 1874 high and 1932 low back to 1865 would give `+1.31`. Huntington also has 73 observations over 145 calendar years. Narrower sentence: “The lowest and highest observed working values map to −1 and +1. Every observed value is scaled linearly using those endpoints.” [seriesMath.ts:18](C:/dev/skylark/sinusoidal-cycles/src/lib/seriesMath.ts:18), [CycleCurveFigure.tsx:66](C:/dev/skylark/sinusoidal-cycles/src/components/CycleCurveFigure.tsx:66), [Perez CSV:2](C:/dev/skylark/sinusoidal-cycles/public/data/perez_tech_diffusion.csv:2)

11. **A11 — HOLDS · REPRODUCED.** The 1600–2050 window retains every observation in each named judged record. For secular Turchin that means 112 observations from 1913–2024, with the five earlier CSV points excluded by the judged cut. The curve’s own span does not enter the scaling calculation. [siteConfig.ts:13](C:/dev/skylark/sinusoidal-cycles/src/lib/siteConfig.ts:13), [seriesOverlay.ts:100](C:/dev/skylark/sinusoidal-cycles/src/lib/seriesOverlay.ts:100), [testedSeries.ts:58](C:/dev/skylark/sinusoidal-cycles/src/lib/testedSeries.ts:58)

12. **A12 — REFUTED-AS-WRITTEN · REPRODUCED.** The eight linear formulas match the pipeline. Khaldun’s formula uses `5.233` with an equals sign, while the pipeline uses `5.23289151851904`. At the maximum, the printed formula gives `0.999958539…` and the pipeline gives `1`. All 212 values agree to two decimal places. Narrower formula: “Plotted height ≈ 2 × ln(1 + value) ÷ 5.233 − 1.” [WorkedExample.tsx:92](C:/dev/skylark/sinusoidal-cycles/src/components/WorkedExample.tsx:92), [seriesMath.ts:33](C:/dev/skylark/sinusoidal-cycles/src/lib/seriesMath.ts:33), [conflict_deaths.csv:146](C:/dev/skylark/sinusoidal-cycles/public/data/conflict_deaths.csv:146)

13. **A13 — HOLDS · REPRODUCED.** The 25 rendered record rows match the pipeline. Kondratiev’s first year is its high and Dalio’s first year is its low, so each appears once. The unpaired fathers-and-sons page has no record table. [workedExample.ts:62](C:/dev/skylark/sinusoidal-cycles/src/lib/workedExample.ts:62), [WorkedExample.tsx:97](C:/dev/skylark/sinusoidal-cycles/src/components/WorkedExample.tsx:97)

    | Cycle | Rendered record and range | Rendered rows in year order, as year / value / height |
    |---|---|---|
    | Khaldun | Deaths in conventional wars (Project Mars, log), 1800–2011 | `1800 / 0.2097 / 0.19 log / −0.93`, `1944 / 186.3337 / 5.233 log / +1.00`, `1957 / 0 / 0 log / −1.00` |
    | Kondratiev | US TFP growth (annual, unsmoothed), 1948–2025 | `1948 / 4.787 / +1.00`, `1993 / −2.4902 / −1.00` |
    | Huntington | US House Polarization (DW-NOMINATE), 1879–2023 | `1879 / 0.7859 / +0.40`, `1947 / 0.5227 / −1.00`, `2023 / 0.8981 / +1.00` |
    | Schlesinger Jr. | US Policy Mood (Stimson), 1952–2024 | `1952 / 54.606 / −0.92`, `1961 / 72.777 / +1.00`, `1980 / 53.898 / −1.00` |
    | Perez | US Technology-Diffusion Intensity (HATCH), 1865–2023 | `1865 / 1.7845 / +0.76`, `1874 / 2.1482 / +1.00`, `1932 / −0.8262 / −1.00` |
    | Turchin, secular | US top 1% wealth share (1913 onward), 1913–2024 | `1913 / 46.63 / +0.85`, `1929 / 48.67 / +1.00`, `1978 / 21.79 / −1.00` |
    | Dalio | US Share of World GDP, 1870–2022 | `1870 / 10.557 / −1.00`, `1945 / 31.577 / +1.00` |
    | Strauss-Howe | US Liberal Democracy Index (V-Dem), 1789–2025 | `1789 / 0.284 / −0.97`, `1799 / 0.274 / −1.00`, `2013 / 0.852 / +1.00` |
    | Modelski | Leading Economy's Share of World GDP, 1870–2022 | `1870 / 18.479 / −0.68`, `1881 / 15.941 / −1.00`, `1945 / 31.577 / +1.00` |

14. **A14 — HOLDS · REPRODUCED.** The spans and two-decimal coverage match the frozen verdict rows. In the record-table order above, the results are `211 ÷ 120 = 1.76 → 1.8`, `77 ÷ 54 = 1.43 → 1.4`, `144 ÷ 60 = 2.40 → 2.4`, `72 ÷ 30 = 2.40 → 2.4`, `158 ÷ 55 = 2.87 → 2.9`, `111 ÷ 150 = 0.74 → 0.7`, `152 ÷ 75 = 2.03 → 2.0`, `236 ÷ 84 = 2.81 → 2.8`, and `152 ÷ 110 = 1.38 → 1.4`. The one-decimal figure appears above the example on all nine paired pages, in `#why-not-tested` on the three claim pages. “This site requires” states the 3.0-period floor as an eligibility condition. [verdicts.json:9](C:/dev/skylark/sinusoidal-cycles/public/data/spectral/verdicts.json:9), [holdsUp.ts:99](C:/dev/skylark/sinusoidal-cycles/src/lib/holdsUp.ts:99), [cycle page:341](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/[id]/page.tsx:341>), [cycle page:362](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/[id]/page.tsx:362>)

15. **B1 — HOLDS · REPRODUCED.** The title resolves to “Ten long-wave theories of history, one time axis · Sinusoidal History.” The count comes from the same ten cycles passed to the chart. [home page:16](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/page.tsx:16>), [home page:96](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/page.tsx:96>), [root layout:30](C:/dev/skylark/sinusoidal-cycles/src/app/layout.tsx:30)

16. **B2 — HOLDS · REPRODUCED.** The rendered H2 is “One page per cycle.” All ten entries have the expected name, stored period and reference peak. All ten name links match the generated cycle routes. [home page:136](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/page.tsx:136>), [homeIndex.ts:22](C:/dev/skylark/sinusoidal-cycles/src/lib/homeIndex.ts:22), [cycle page:75](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/[id]/page.tsx:75>)

17. **B3 — HOLDS · REPRODUCED.** The rendered `WebSite` uses `Sinusoidal History`, `https://sinusoidalhistory.com/` and `SITE_DESCRIPTION`. The rendered `ItemList` has the stated name, and all ten names, URLs and positions match the visible list. [homeIndex.ts:39](C:/dev/skylark/sinusoidal-cycles/src/lib/homeIndex.ts:39), [siteConfig.ts:1](C:/dev/skylark/sinusoidal-cycles/src/lib/siteConfig.ts:1), [home page:151](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/page.tsx:151>)

18. **C1 — REFUTED-AS-WRITTEN · STATIC.** The title matches, but “how every curve and series is built” overstates the page’s coverage. `/methods` describes the shared sinusoid, clipping and scaling rules, summarizes all nine data sources, and links to fuller processing notes. Individual curve calibrations live on `/about` and the cycle pages. Narrower title: “Methods: the curve model, data sources and normalization · Sinusoidal History.” [methods page:28](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/methods/page.tsx:28>), [methods page:113](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/methods/page.tsx:113>), [methods page:175](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/methods/page.tsx:175>), [about page:166](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/about/page.tsx:166>)

**Overall — REFUTED-AS-WRITTEN.** Fourteen claims hold. A7, A10, A12 and C1 need revision.

## Dispositions (lead)

- A7 REFUTED-AS-WRITTEN → **DELIBERATE (the LANE's reading of David's I-061 ruling, not his word), wording folded.** Put to David in one line through the orchestrator's card batch: does a table of the construction's quarter-period years (no present year) sit inside "one wave per cycle, stop at today"? The rows are the construction's own quarter-period landmarks (peak ± a quarter or half period), the same class as the page's existing "Where this curve plots its extrema" list, which states peak and trough years and calls them "positions of this construction". No row is a year a reader or the site chose, and no row is 2026 or the present. The table now carries the same sentence: "Like that list, they are positions of this construction, not dates claimed by the theorist."
- A10 REFUTED-AS-WRITTEN → **CONFIRMED, fixed.** "Every other year is placed on the straight line between them" became "Every other value is scaled in proportion between those two."
- A12 REFUTED-AS-WRITTEN → **CONFIRMED, fixed.** Khaldun's printed formula uses 3-decimal endpoints, so it reads "plotted height ≈ …". The other eight use the CSV's own values and keep "=".
- C1 REFUTED-AS-WRITTEN → **CONFIRMED, fixed.** /methods title is "Methods: curve model, data sources, normalization" (Codex's narrower text, shortened to fit 70 characters with the suffix).
- The other 14 HOLD (REPRODUCED). Nothing else changed.
## Same-family review of the first cut (fresh Claude context, 2026-11-21; NOT the cross-family review)

Report: `tmp/claude-review-9756514.md` (lane-local). No HIGH. Dispositions:
1. MEDIUM, the /methods meta description still opened with the refuted phrase, and pageSocial spread it to og:/twitter: → **CONFIRMED.** Commit A (2d6efd1) keeps the share description as the site's. Commit B narrows the description to "The curve model, the data sources and their transforms, normalization — and where the method breaks down, including why the correlation readout isn't a test." These are NEW WORDS, owed a cross-family claims pass.
2. LOW, the formula read "− −2.4902" and "−0" → **CONFIRMED, fixed** (`scaleFormula`, tested). The Khaldun line now reads "plotted height ≈ 2 × ln(1 + value) ÷ 5.233 − 1". NEW WORDS: owed a claims pass.
3. LOW, the record block names years past the drawn period's end → **CONFIRMED as a wording point.** The rule the code enforces is "no CURVE row past the drawn end"; the record is drawn across the whole window, as the figure already does. It is stated that narrowly in the report.
4. LOW, two WebSite @ids → **CONFIRMED, fixed** (home now uses the cycle pages' form).
5. LOW, hard-coded 3 → **CONFIRMED, fixed** (`REQUIRED_PERIODS` exported).
6. LOW, indexnow fetch failure exit code, and no test → **CONFIRMED, fixed in A** (exit 2; `indexnowPing.test.ts`).
7. LOW, A7 is the lane's reading → **CONFIRMED**, labelled above and put to David.