# Codex claims pass on the I-078 round 0 fact list, 2026-11-19

Read-only run (`codex exec -C C:\dev\skylark\sinusoidal-cycles --sandbox read-only`), banner workdir `C:\dev\skylark\sinusoidal-cycles` checked, model gpt-6.2-sol, HEAD a4d2a4a. Input: `docs/claims/2026-11-19-i078-round0.md`. Verbatim output below.

## Findings and recommendations

I reviewed the repository at `a4d2a4a` without editing files or browsing. I recomputed the counts from the frozen verdict data and ran the verdict and caption helpers in memory. The viewport measurements come from repository records. The visitor readings below are judgments from the page structure and wording.

1. **Q7 — Scope the verdict when the chart is calibrated.** The caption or verdict should identify the site’s published configurations whenever a period or peak differs from its published value. Pin the rendered behavior for a period-only change, a peak-only change and a reset. The current peak check misses period-only changes, and the screen-reader row can announce a changed period immediately before the stored verdict. If the calibrated view drops the verdict, the caption and spoken rows should also stop conveying it. The test checks power at a target period using sine and cosine, so the wording should avoid implying that it verified the reference peak year. This is the open condition in I-078. F39, F47–F51. [Ledger close condition](C:/dev/skylark/sinusoidal-cycles/continuity/items.json:2399) · [Spectral protocol](C:/dev/skylark/sinusoidal-cycles/public/data/spectral/spectral.source.md:14)

2. **Q4 — Scope the shared per-cycle headline in the headline itself.** For **Schlesinger Jr., Perez and Huntington**, a visitor who reads the whole box will likely take the narrow reading because the next paragraph names Stimson Policy Mood, HATCH or DW-NOMINATE and gives that record’s shortfall. For **Kondratiev**, the narrow reading becomes clear once the reader reaches the explanation naming annual, unsmoothed TFP. A glance at the chart and headline can instead attach the verdict to the rolled series on display. For **Dalio**, the broad reading is more likely on first encounter. The claim question leads directly into the verdict, and the reason naming the GDP record sits below the curve. The lower cross-grid paragraph is useful follow-through, but the headline also travels on its own in cards, embeds and accessibility text. Use the same pairing scope on all nine pages. F5, F8, F32–F34. [Record reasons](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/[id]/page.tsx:181>) · [Verdict placement](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/[id]/page.tsx:311>)

3. **Q3 — Replace the empty-state headline with the fact that distinguishes this cycle.** Earlier candidate **(b)** is literally true of all ten cycles and uses a term the visitor copy leaves undefined. The distinguishing fact is that the site assigned Turchin’s fathers-and-sons cycle **no paired series**. Put that fact in the headline or opening answer. The full page should also acknowledge the five checks at 50 years and point readers to the Methods table, since its usual cross-grid paragraph is absent. Compact surfaces can carry the paired-series fact by itself. F15–F24, F35.

4. **Q1 — Make the home count about the nine pairings at their published periods.** The current line leaves “the record that exists” open to a site-wide reading. Five of the nine periods cleared the gate on other records. The count may convey that none of the nine designated pairings qualified under the site’s three-period rule. The 50-year cycle has no designated pairing. F3–F5, F8, F15, F26–F27.

5. **Q2 — Accept “pairings” and retire earlier candidate (a).** It is **128 characters**, ten over the 118-character limit. Its “records fall short” clause describes the wrong unit: seven of those records qualify at other periods. “Pairings” is the term Methods already uses, and its meaning should be clear from the sentence or the text immediately beside it. “None is confirmed” is supportable as a summary of the site’s results for its published configurations. F11, F28–F31, F42–F43.

6. **Q5 — Include both scope problems in I-078.** The `/cycles` section’s “nothing to test” and the shared reason’s “no record to test it against” both extend beyond the absence of a designated pairing. The design-pass page body already narrows the reason, while the shared reason still reaches cards and alt text. The existing `/cycles` entry and Methods table explicitly say *paired*, so their scope is clearer. Use the same factual distinction across the “Not tested” surfaces and keep the Methods mirror in sync. F15–F16, F23–F24, F35, F40–F41.

7. **Q6 — Use 49 px as the latest recorded production fold baseline at 320×568.** The November 19 working-tree report records 49 px on `/`, corroborating the November 17 flag-on production read. The 12 px figure is the earlier baseline. Both refer to the last overview row’s SVG. A change to either the caption or the verdict warrants a direct check of that text’s wrapping, since the fold result does not measure it. F42, F44–F46. [November 19 fold read](C:/dev/skylark/sinusoidal-cycles/docs/daily/2026-11-19-prelaunch.md:26) · [Fold selector](C:/dev/skylark/sinusoidal-cycles/scripts/check-entry-folds.mjs:35)

## Fact findings

- **F26.** Each of the nine designated pairings is ineligible at its published period. Schlesinger, Kondratiev, Perez, Huntington and Dalio have eligible re-pairings at those periods. The other four periods are too long for every record in the analysis roster.
- **F23.** Turchin’s 50-year cycle lacks a paired series. Five records were available and used to check for power at 50 years, so the conclusion that there was no record to use is too broad.
- **F29.** Each of the nine designated record–period combinations falls short of the gate. Seven of the nine judged series clear it at a different period. The two absent from the re-pairings are Stimson Policy Mood and annual US TFP.
- **F28.** Recounted **128** characters. Substituting candidate (a) as the helper output would fail the current `≤118` assertion. The historical third-line example was a different, 125-character string. [Budget assertion](C:/dev/skylark/sinusoidal-cycles/src/lib/overviewReading.test.ts:163)
- **F21.** Recounted **39** characters. The statement applies to the nine ineligible pairings and to the unpaired cycle.
- **F22.** The manifest defines the `primary` family, and Methods explains designated pairings and the secondary panel. The visitor-facing text I searched supplies no definition of the phrase “primary test.” Reader comprehension remains unmeasured.
- **F34.** The listed headline consumers exist. The inventory also needs the home summary’s interactive **`aria-label`**, the claim-page description in **Open Graph and Twitter metadata**, and the **`WebPage.description` JSON-LD** field alongside the listed FAQ answer. The expanded card on the home **Calibrate** tab is an instance of the same facet renderer and should be named in the inventory. [Summary label](C:/dev/skylark/sinusoidal-cycles/src/components/NowSummaryPanel.tsx:128) · [Social metadata](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/[id]/page.tsx:86>) · [JSON-LD](C:/dev/skylark/sinusoidal-cycles/src/lib/cycleRoutes.ts:235) · [Calibrate facet](C:/dev/skylark/sinusoidal-cycles/src/components/Viz.tsx:414)
- **F35.** The listed `"Not tested"` forms exist, including both table layouts. The broader no-pairing inventory also includes the `/cycles` **paired-data label and longer story**, the React **`/about` introduction and cycle caveat**, the caveat on the **cycle page itself** and in **`/about.md`**, the same caveat served by **`/api/v1/cycles`**, and the per-cycle **OG card’s “Paired data” stat**. The metadata description also feeds social descriptions and `WebPage.description`. These additional statements express absence of a pairing. [Cycles index](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/page.tsx:337>) · [Longer story](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/page.tsx:177>) · [About page](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/about/page.tsx:45>) · [Cycle caveat](C:/dev/skylark/sinusoidal-cycles/src/data/cycles.json:128) · [About mirror](C:/dev/skylark/sinusoidal-cycles/public/about.md:155) · [Cycles API](C:/dev/skylark/sinusoidal-cycles/src/app/api/v1/cycles/route.ts:10) · [OG stat](C:/dev/skylark/sinusoidal-cycles/src/app/og/route.tsx:313)
- **F36.** The phone figure is the only source renderer I found for the exact **“nine cannot be tested on the record that exists”** clause. The per-cycle headline is a different literal. The inventory of related claims also needs the **home protocol paragraph below the chart**, the **`/cycles` verdict-section lead** already found in F35, and the **Methods explanation and mirror**. The paired table rows, the cycle page’s spectral state and figure alt, and the downloadable SVGs also express the pairing-level eligibility result. The Methods in-brief sentence already states the scope explicitly. At `llms.txt:24`, the nine pairings should be described as ineligible under the rule. Its appositive also risks implying there was a completed statistical test for each. [Home protocol paragraph](C:/dev/skylark/sinusoidal-cycles/src/lib/countWords.ts:56) · [Cycles section lead](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/page.tsx:403>) · [Methods mirror](C:/dev/skylark/sinusoidal-cycles/public/methods.md:161) · [Figure alt](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/[id]/page.tsx:883>) · [Example SVG](C:/dev/skylark/sinusoidal-cycles/public/data/spectral/dalio.svg:27) · [LLM summary](C:/dev/skylark/sinusoidal-cycles/public/llms.txt:24)
- **F45.** The true dated claim is that the November 19 production fold read **recorded** 49 px for the home overview row at 320×568. I could not independently verify current production geometry in this repo-only pass. The flag status and earlier 12 px figure are documented. [Flag record](C:/dev/skylark/sinusoidal-cycles/docs/cold-starts/2026-11-18.md:6) · [Earlier and flag-on baselines](C:/dev/skylark/sinusoidal-cycles/docs/daily/2026-11-17-prelaunch.md:31)
- **F4.** **9 primary rows, 0 eligible, 9 `INSUFFICIENT_DATA`.** All nine have null p-values under both models. The headline matches the rows. [Frozen verdicts](C:/dev/skylark/sinusoidal-cycles/public/data/spectral/verdicts.json:15)
- **F7.** **19 cross-grid rows, all eligible.** All 19 have `NO_SIGNIFICANT_TARGET_POWER` and both Holm flags false. Recomputing `span_years / period_years ≥ 3` across the roster produced the same 19 cells. [Cross-grid provenance](C:/dev/skylark/sinusoidal-cycles/public/data/spectral/spectral.source.md:25)
- **F8.** The period split is **7/5/2/2/2/1** for Schlesinger 30y, Turchin fathers-and-sons 50y, Kondratiev 54y, Perez 55y, Huntington 60y and Dalio 75y, respectively. The other four have zero. All series IDs, rounded coverage values and cited row starts matched.
- **F15.** `turchin_fathers_sons` is absent from the primary rows, manifest primary roster and `associated_cycle_id` values. The 150-year Turchin cycle is a separate, paired entry.
- **F16.** Exactly five checks used the 50-year period. The rounded AR(1)/AR(2) p-values match: V-Dem **.974/.727**, Project Mars **.958/.941**, HATCH **.341/.318**, US GDP share **.137/.304**, and leading-economy GDP share **.398/.533**. The last two each span **3.04** periods, displayed as **3.0**. [Methods rows](C:/dev/skylark/sinusoidal-cycles/public/methods.md:174)
- **F17.** “Five secondary tests ran at that period” describes the five checks. The site's protocol treats them as checks for power at 50 years on other records. They do not adjudicate the fathers-and-sons construct.
- **F33.** Reproduced period/record counts in the listed order: Schlesinger **7/0**, Kondratiev **2/0**, Perez **2/2**, Huntington **2/1**, Dalio **1/2**, Strauss-Howe **0/6**, Modelski **0/2**, Khaldun **0/5**, secular Turchin **0/1**. The actual helper returns a paragraph for all nine, and all nine designated pairings lack a p-value. These are cell counts. The manifest treats the 54–55-year results as one band for interpretive claims. [Paragraph helper](C:/dev/skylark/sinusoidal-cycles/src/lib/crossGridLine.ts:47) · [Band rule](C:/dev/skylark/sinusoidal-cycles/scripts/spectral/analysis-manifest.yaml:128)
- **F32.** All nine paired pages use `NOT_TESTABLE_HEADLINE` and append the “and that is the finding” clause. The rendered source uses an em dash. [Verdict box](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/[id]/page.tsx:325>)
- **F20.** The helper returns `null` for fathers-and-sons, and the page places the paragraph inside the spectral-verdict section, which requires a primary row. It therefore does not describe its five re-pairings.
- **F24.** The design-pass reason names the absence of a series of the cycle’s own. The flag-on box still prefixes it with `Not tested.` [Empty-state branch](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/cycles/[id]/page.tsx:373>)
- **F25.** The actual helper returns the quoted current line. It is wired to the `[data-glance-verdict]` paragraph under the `sm:hidden` home figure. [Figure](C:/dev/skylark/sinusoidal-cycles/src/components/CycleOverview.tsx:165) · [Phone wrapper](C:/dev/skylark/sinusoidal-cycles/src/components/Viz.tsx:156)
- **F27.** The 50-year cycle has no series of its own on this site. The association list and primary roster both support the clause.
- **F30.** Across the 28 rows, no row is `SIGNIFICANT_TARGET_POWER`. The main OG eyebrow and its default alt carry the no-confirmation summary. This is a conclusion about the site’s evidence. [OG eyebrow and alt](C:/dev/skylark/sinusoidal-cycles/src/lib/holdsUp.ts:92)
- **F47.** `Viz` applies period and peak overrides by ID and passes `effectiveCycles` to `CycleOverview`. The mapping spans `Viz.tsx:93–105`, and the figure wiring starts at `:157`.
- **F48.** The actual helper returned the identical verdict line for stored, period-only, peak-only, combined and reset cases. The verdict lookup uses the cycle ID. [Lookup](C:/dev/skylark/sinusoidal-cycles/src/lib/spectral.ts:51)
- **F49.** Of the two sentences at issue, only the caption changes with a moved peak, and its “no cycle confirmed” clause stays fixed. Period-only changes leave both sentences intact. The spoken row period and the separate cluster line can also change. [Caption and spoken row](C:/dev/skylark/sinusoidal-cycles/src/lib/overviewReading.ts:129)
- **F50.** I found no explicit stored-verdict scope in the home figure. The calibrated main share **image** prints the note at `og/route.tsx:199`. Its default alt lacks that note. [Calibrated image note](C:/dev/skylark/sinusoidal-cycles/src/app/og/route.tsx:189) · [Default alt](C:/dev/skylark/sinusoidal-cycles/src/lib/holdsUp.ts:129)
- **F51.** In the actual helper, a moved peak suppresses the second-screen cluster sentence. A period-only change leaves it available when its other conditions hold. It is independent of the verdict line.
- **F43.** Recounted **118** characters for the output of the current helper, leaving zero characters under the code limit.
- **F42.** The **118-character** limit comes from the November 10 measurement at **390×664**. The reported **33 px** was horizontal room on line two (`x=341` of `374`). The recorded bottom was `y=656`, leaving **8 px vertically**. The 125-character trial ended at `y=674`. At 320×568 and 360×560 the historical line started at `y=584` and took three lines. Those positions are historical. [Production measurements](C:/dev/skylark/sinusoidal-cycles/docs/daily/2026-11-10-prelaunch.md:15) · [Source limit](C:/dev/skylark/sinusoidal-cycles/src/lib/overviewReading.ts:21)
- **F44.** Both verdict-bearing captions are **33** characters, and the fallback is **27**. The documented 288 px box, 8.58 px per character, 283.1 px text width and roughly 16 px extra-line cost are measurements for that layout. The 12 px fold figure belongs to the earlier layout. [Caption measurement](C:/dev/skylark/sinusoidal-cycles/docs/daily/2026-11-13-prelaunch.md:13)
- **F46.** The local fold checker’s self-test passed **13/13**. The unpaired page uses the same roster selector as the others. It measures the first matching `#does-it-hold-up p`. I found no declared character limit for `NO_SERIES_HEADLINE`. [Roster](C:/dev/skylark/sinusoidal-cycles/scripts/check-entry-folds.mjs:51)
- **F1.** JSON has exactly two row arrays and all rows have the matching `holm_family`. The family keys are at lines 20 and 193, and the type union is at `spectral.ts:27`.
- **F2.** The manifest identifies the designated pairings at line 96 and the eligible re-pairings at line 106. All 19 cross-grid rows use `period_source_cycle_id` and omit `cycle_id`. [Manifest](C:/dev/skylark/sinusoidal-cycles/scripts/spectral/analysis-manifest.yaml:96)
- **F3.** The site gate is span divided by target period **≥ 3.0**. The manifest and JSON literals agree. Methods identifies it as a conservative rule for this protocol. [Methods gate](<C:/dev/skylark/sinusoidal-cycles/src/app/(app)/methods/page.tsx:300>)
- **F5.** All nine primary ID, period, series and coverage tuples match their cited lines. In ascending period order the coverage is **2.40, 1.43, 2.87, 2.40, 2.03, 2.81, 1.38, 1.76, 0.74**. The Kondratiev and secular Turchin rows use the annual TFP and 1913+ WID inference cuts.
- **F6.** All nine `lay_text` fields contain the quoted “No test was run and no p-value exists” clause, scoped to their row.
- **F9.** All 19 `lay_text` fields open with the re-pairing qualifier and identify the period and series checked.
- **F10.** Comparing `(period source cycle ID, series ID)` with the primary roster produced **zero** identical pairings.
- **F11.** V-Dem fails at 84 years and clears at **30, 50, 54, 55, 60 and 75**. Conflict deaths fails at 120 years and clears in the filed cells at **30, 50, 54, 55 and 60**. Eligibility attaches to the record and period together.
- **F12.** V-Dem’s **236-year** span is the longest among both the analysis records and the associated series CSVs. The four required spans are **252, 330, 360 and 450** years. [V-Dem span](C:/dev/skylark/sinusoidal-cycles/public/data/spectral/verdicts.json:630)
- **F13.** The smallest unadjusted p-value across both models is **0.09377**, rounded to **0.094**, for AR(1) on Schlesinger 30y × V-Dem. The AR(2) minimum is **0.11949**. [Methods result](C:/dev/skylark/sinusoidal-cycles/public/methods.md:168)
- **F14.** `llms.txt:71` already states the 0-of-9 and 19-of-19 results and scopes the latter to borrowed periods. [Published summary](C:/dev/skylark/sinusoidal-cycles/public/llms.txt:71)
- **F18.** Both Methods surfaces describe the 19 re-pairings. The rendered list constructs the pair and detail at `CrossGridList.tsx:21` and `:24` and prints them at `:65–69`. The five 50-year rows match the mirror.
- **F19.** The Methods table and its mirror say `Not tested — no paired series` for this cycle. The pairing note explicitly says the cycle ships unpaired. [Table mirror](C:/dev/skylark/sinusoidal-cycles/public/methods.md:157) · [Pairing note](C:/dev/skylark/sinusoidal-cycles/public/methods.md:205)
- **F31.** Found “eligibility gate,” “3.0-period rule” and the wording about three full periods this site requires. The exact phrase “testing threshold” had no hit in the served-source search. “Unadjusted threshold” on Methods refers to the p-value threshold. [Cross-grid note](C:/dev/skylark/sinusoidal-cycles/src/components/CrossGridList.tsx:48)
- **F37.** The listed code hits are comments or an unrelated diagnostic. `methods.md:203` and the corresponding React passage describe the historical Perez state.
- **F38.** Both comparisons use the imported constants. A consistent rename to distinct strings preserves the counts. The aggregate wording is separately assembled in the helper.
- **F39.** A null verdict produces the 27-character fallback caption in either peak state. Suppressing just the paragraph at render time would leave the caption’s verdict intact. [Caption rule](C:/dev/skylark/sinusoidal-cycles/src/lib/overviewReading.ts:129)
- **F40.** The listed pins are present. The flag-on unpaired box uses a period where `holdsUp.test.ts:54` expects an em dash. I evaluated the actual `TEST_RAN` regex: candidate (b) does not match, `was tested` and `is tested` do. The page-body sweep selects ineligible rows, so it skips the unpaired body. The card and alt sweep includes it. [Test coverage](C:/dev/skylark/sinusoidal-cycles/src/lib/testedSeries.test.ts:219)
- **F41.** All four checkers have the cited expectations. `check-holds-up-line` explicitly excludes the glance caption and closed card, while `check-open-card-position` checks the closed headline. [Checker scope](C:/dev/skylark/sinusoidal-cycles/scripts/check-holds-up-line.mjs:61) · [Closed-card expectations](C:/dev/skylark/sinusoidal-cycles/scripts/check-open-card-position.mjs:56)

## All 51 verdicts

For entries about disputed copy, the verdict applies to the wording at issue. For F34–F36, it applies to the inventory’s completeness. **REPRODUCED** means a local command independently checked the result. **STATIC** means source inspection. **SUPPLIED** means a recorded measurement I did not rerun.

| Fact | Verdict | Basis |
|---|---|---|
| F1 | HOLDS | REPRODUCED |
| F2 | HOLDS | REPRODUCED + STATIC |
| F3 | HOLDS | REPRODUCED + STATIC |
| F4 | HOLDS | REPRODUCED |
| F5 | HOLDS | REPRODUCED |
| F6 | HOLDS | REPRODUCED |
| F7 | HOLDS | REPRODUCED |
| F8 | HOLDS | REPRODUCED |
| F9 | HOLDS | REPRODUCED |
| F10 | HOLDS | REPRODUCED |
| F11 | HOLDS | REPRODUCED |
| F12 | HOLDS | REPRODUCED |
| F13 | HOLDS | REPRODUCED |
| F14 | HOLDS | STATIC |
| F15 | HOLDS | REPRODUCED |
| F16 | HOLDS | REPRODUCED |
| F17 | HOLDS | STATIC |
| F18 | HOLDS | STATIC |
| F19 | HOLDS | STATIC |
| F20 | HOLDS | REPRODUCED + STATIC |
| F21 | HOLDS | REPRODUCED |
| F22 | HOLDS | REPRODUCED |
| F23 | REFUTED-AS-WRITTEN | REPRODUCED + STATIC |
| F24 | HOLDS | STATIC |
| F25 | HOLDS | REPRODUCED + STATIC |
| F26 | REFUTED-AS-WRITTEN | REPRODUCED |
| F27 | HOLDS | REPRODUCED |
| F28 | HOLDS | REPRODUCED + SUPPLIED |
| F29 | REFUTED-AS-WRITTEN | REPRODUCED |
| F30 | HOLDS | REPRODUCED + STATIC |
| F31 | HOLDS | REPRODUCED |
| F32 | HOLDS | REPRODUCED + STATIC |
| F33 | HOLDS | REPRODUCED + STATIC |
| F34 | REFUTED-AS-WRITTEN | REPRODUCED + STATIC |
| F35 | REFUTED-AS-WRITTEN | REPRODUCED + STATIC |
| F36 | REFUTED-AS-WRITTEN | REPRODUCED + STATIC |
| F37 | HOLDS | STATIC |
| F38 | HOLDS | STATIC |
| F39 | HOLDS | REPRODUCED |
| F40 | HOLDS | REPRODUCED + STATIC |
| F41 | HOLDS | STATIC |
| F42 | HOLDS | STATIC + SUPPLIED |
| F43 | HOLDS | REPRODUCED |
| F44 | HOLDS | REPRODUCED + SUPPLIED |
| F45 | UNVERIFIABLE-HERE | SUPPLIED |
| F46 | HOLDS | REPRODUCED + STATIC |
| F47 | HOLDS | STATIC |
| F48 | HOLDS | REPRODUCED |
| F49 | HOLDS | REPRODUCED |
| F50 | HOLDS | REPRODUCED + STATIC |
| F51 | HOLDS | REPRODUCED |
