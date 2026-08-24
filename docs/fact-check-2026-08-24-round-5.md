# Sinusoidal History — round 5 fact-check (folded 2026-08-24)

**Scope:** everything shipped after round 4 and never externally checked — Schlesinger Jr. + Stimson (Phase 10), Modelski + leading-economy series and Turchin fathers-and-sons (Phase 14), the Perez re-anchor + HATCH pairing, the `/cycles` "considered and excluded" list, spectral lay text. Prompt: `docs/fact-check-prompt-round-5.md`. Run by David in **two engines** (Claude deep research; OpenAI deep research) the same afternoon; both reports are in Downloads, not committed.

**Top line.** No page-level citation was shown to be wrong, but the Stimson provenance was wrong on the facts of its own CSV, three claims over-attributed project constructions to the theorist, one claim ("no redistributable file") was flatly contradicted by Turchin's own site, and the HATCH composite's construction was judged to bake S-curve maturity into the signal. All copy fixes folded in one commit; no `period_years`, no CSV, and no spectral output changed, so the frozen manifest stands. Items both engines flagged independently are marked **[both]**.

---

## Ship-blockers (all fixed)

1. **Stimson caveat "trough shallower and later" — `incorrect` [both].** CSV minimum is 1980 (53.9), five years *earlier* than the model's 1985 trough and the deepest value in the series; 1985 = 62.9 ≈ mean. Rewritten with the numbers in `stimson_policy_mood.source.md`.
2. **"Stimson constructed the index in part to test exactly this kind of long-wave claim" — `incorrect` [both].** No primary support; his own reading stresses shorter thermostatic swings. Replaced everywhere (series.json, source.md, /methods + mirror) with: independently constructed measure of one component of Schlesinger's construct; the pairing tests his data against Schlesinger's period, not his endorsement of it.
3. **"50 is the scale's neutral reference point" — `incorrect`/`imprecise`.** Claude: unsupported; OpenAI: 50 ≈ parity on the percent-liberal metric. Folded the softer reading: percent-liberal-style metric, 50 ≈ equal shares among respondents taking a position, not the mean and not a statistical zero.
4. **"No cleanly redistributable file" for Turchin's violence data — `incorrect` [both].** `USPVD2010.xlsx` (1,590 events, 1780–2010) is posted at `peterturchin.com/age-of-discord/united-states-political-violence-database/` — verified live 2026-08-24; no license text on the page. The barrier is licensing, not existence. Fixed in cycles.json caveat, /cycles prose, /methods note, both mirrors.
5. **Turchin 2020 explained only via the secular cycle — `incorrect` (OpenAI, from the author PDF p. 12).** The 2012 paper itself extends 1870/1920/1970 to "around 2020" and calls it a simple projection, not a scientific prediction. Rationale now says so.
6. **/about "Two cycles (Schlesinger Jr. and Strauss-Howe) carry an inline caveat" — `incorrect` (internal).** Four do. Rewritten; Modelski and fathers-and-sons sentences added to the disclaimer paragraph.
7. **Goldstein label "war/hegemony waves (~50y)" — `imprecise` [both].** Conflated his ~50-year war/price wave with his separate ~150-year hegemony cycle. Relabelled "war/price long wave (~50y)"; hegemony cycle noted as separate. The p. 99/111/244 quotes were verified verbatim against Goldstein's own full-text PDFs by Claude's subagent; the p. 111 quote is a sentence fragment and now carries an ellipsis.
8. **"Considered and excluded" intro bar contradicted by the roster — `incorrect` [both].** Modelski (range), Schlesinger (derived), Khaldun, Strauss-Howe, Dalio don't meet "an explicit period in years from the primary text." Rewritten: an identifiable period (figure or range) grounded in the primary text; midpoints declared on the cycle page.
9. **Stimson "fair use for non-commercial scholarly redistribution" — `incorrect` as a license claim (OpenAI).** Reworded: no license identified; we redistribute a two-column extract with attribution on the basis the file is publicly posted for scholarly use, will remove on request; public availability is not an open-data license. The redistribution decision (April, DW-NOMINATE precedent) stands.
10. **Reuse-packet "Figures and code are MIT-licensed … reuse freely" — `imprecise` [both].** MIT for our code and chart files; plotted data stay under upstream terms; CC BY attribution travels with the figure; no-license series carry no grant we can pass on.

## Should-fix (all fixed)

- **Schlesinger** [both]: "in his own dating" → conventional tabulation; "his recorded liberal-era midpoints … average" → midpoints are our derivation, the *intervals* (29, 31) average 30; Sr.'s figure is **16.55 years** (eleven periods through 1947), not "15–16"; "predicted around 1990" → "shortly before or after 1990"; "a textbook selection effect" → calibration sensitivity (OpenAI: wrong label). short_description no longer says "~15 years each".
- **Modelski**: imprint → "Macmillan / University of Washington Press, 1987"; dropped the two clauses neither engine could verify in the 1987 book ("about one century"; "120-year average interval"); added the back-cast mismatch figures (cosine peaks 1835/1725/1615/1505 vs. world-power starts 1815/1714/1609/1516 = +20/+11/+6/−11 years — Claude's F2).
- **Turchin F&S**: added "sharply peaked, not sinusoidal" (OpenAI, from the paper's spectral discussion); "an additional process distinct from structural-demographic theory" (author PDF p. 4).
- **Perez**: /about "later work extends the Turning Point through 2008" → the 2009 *CJE* "double bubble" paper treats 2000 and 2008 as two parts of one structural episode (OpenAI: the prior wording overstated). "Canals" label kept (Claude verified against Perez's own infrastructure list for revolution 1).
- **Leading-economy series**: short_description now says share of the *summed covered-country GDP*; name kept as "world GDP" for consistency with the sibling US-share series (OpenAI wanted a rename — declined; the name is also embedded in the frozen spectral lay text); 1945-maximum sentence reworded as descriptive coincidence, not validation; forward-fill plateau caveat added; "proxy for a correlate" wording added.
- **HATCH**: series relabelled experimental / site-derived in short_description and legend (name kept for the same lay-text reason); ex-post look-ahead caveat added (OpenAI); "partly a panel-composition artifact" → "substantially an artifact" (Claude B19); pre-1905 decade means flagged as non-comparable; "fixed without reference to her dates" replaced with an auditable statement; Zenodo version-field `v1` / filename `1.5` note; *Nature Communications* paper cited as Greene, Gidden, Brutschin & Nemet; 121 raw vs 120 filtered US series; CC BY 4.0 re-verified live 2026-08-24.
- **Excluded list**: Berry ~56y → **~55y** [both]; Klingberg's 21/27 are his own 1952 figures (Claude), not "later scholarship"; Mohler "replication failed" → "found no evidence of a general cyclical process".
- **Spectral**: INSUFFICIENT_DATA glossed as an eligibility outcome, not evidence, on the cycle page (conditional sentence) and /methods; Rayleigh "~3,000-year" now labelled a resolution heuristic. Arithmetic in all lay texts confirmed correct by both engines; Part F cos table confirmed by both.
- **CAPE**: "exactly a valuation peak" → extreme at the turn of 1999–2000.
- **/methods Stimson note**: "exactly what Schlesinger's cycle claims to track" → one component; "two full swings" → two complete trough-to-trough swings inside 2.4 periods.
- **Known-queued items** also fixed: cycle-page footer "other seven" → nine; Khaldun axis sentence aligned to "US-and-global".

## Declined or deferred

- **Rename the leading-economy and HATCH series** (OpenAI): declined — names appear in the frozen `verdicts.json` lay text; re-running the 99,999-draw verdict for a cosmetic rename is the wrong trade. Descriptions and legends carry the correction.
- **Truncate the HATCH display to N ≥ 20 / build a lifecycle-adjusted version** (Claude B19-i, OpenAI 0.5–2 days): deferred. Changing the CSV invalidates the manifest and forces a re-freeze; the lifecycle-adjusted series is queued as the upgrade path and named in the provenance. Until then the series is labelled a sensitivity check.
- **Use the upstream `World` aggregate as denominator** (OpenAI): deferred for the same manifest reason; and the sibling US-share series would need the same change. Caveat added instead.
- **Perez "canals" label** (OpenAI: too narrow): kept — Claude verified it against Perez's own infrastructure list.

## Modelski 1987 — RESOLVED same day against the book's text

Neither engine could reach the 1987 text. The Internet Archive holds an OCR'd copy (`george-modelski-long-cycles-in-world-politics-1987`, with a leaf→printed-page map), read 2026-08-24 evening:

- **Table 2.1, p. 40** "Long cycles in global politics (systemic mode)": American cycle 1914–1945 (global war), 1945–1973 (world power), 1973–2000, 2000–2030. World-power phase starts for the earlier cycles are 1516 / 1609 / 1714 / 1815 — exactly the figures used in the back-cast comparison. **`correct`.**
- **Table 2.2, p. 42** "World powers": "United States 1944–"; footnote defines the threshold as a naval concentration ratio ≥ 0.5, "one-half or more of the world's oceanic warships"; body text (p. 41–42): "one-half or more of the world's assets in capital ships." **`correct`.**
- **"120-year average interval"**: p. 42 — "In four of the cases, the average interval of time between the attainment of naval preponderance by one power and by its successor is 120 years. This is one preliminary measurement of the period of the long cycle." **`correct`** — the clause dropped in the afternoon fold was true; restored with the page cite.
- **"about one century"**: p. 218 — "the recurrence of global wars at intervals of about one century." **`correct`** — restored with the page cite.
- "does not connote strict cycles" and "100 to 120 years" do **not** appear in the 1987 book; they are EOLSS phrasings, as the site attributes them. **`correct`.**

Lesson for the next round: "unverifiable-from-public-sources" from a deep-research agent means the agent's fetcher could not reach it, not that it is unreachable. Check Internet Archive's full-text layer before deleting a claim.

## Day-2 verification sweep (2026-08-24 evening) — remaining items closed against primary sources directly

- **HATCH raw counts `correct`:** re-downloaded `HATCH_national_1.5.csv` from Zenodo (MD5 matches the pinned `3f16f6cb…`); distinct technology series per country: **USA 121, CHN 70** (next: BRA/AUS 65, DEU 64). Closes B18.
- **Turchin 2012 body strings `correct` (verbatim, author PDF):** p. 4 — "An additional process (which is not part of the structural-demographic theory) … is the 'fathers-and-sons' dynamic"; "periods of intense conflict tend to recur with a period of roughly two generations (40–60 years)"; "These swings … may be termed 'bi-generation cycles'". p. 12 — "the next instability peak should occur in the United States around 2020. This is a simple projection, rather than a scientific prediction". Closes A13; the folded rationale wording is exactly right. Bonus (p. 13): the USPV replication data is also posted at PRIO's JPR datasets page and cliodynamics.info — still no explicit reuse license anywhere.
- **Stimson "154 items" `correct` (verbatim, BMS preprint p. 6, stimson.web.unc.edu/files/2017/12/BMSMood.pdf):** "The data consist of 154 separate survey questions for 1952 through 2016, 65 years."
- **Goldstein pp. 99/111/244 `correct` (verbatim — now checked by this project directly against the author's chapter PDFs at joshuagoldstein.com/jgcycle.htm, not only by the round-5 agent):** p. 99 "This line is a self-proclaimed dead-end, currently inactive"; p. 111 "The efforts to identify war cycles based on fixed periodicities are a self-proclaimed dead-end and may be seen as a 'degenerate research program' in Imre Lakatos's terms (see chapter 7)" — the site's ellipsis is correct; p. 244 "a methodology based on fixed periodicities—even though I think it is inappropriate for social cycles." Also p. 99 fn. 2 directly supports the relabel: his longer war cycles are "about 150 years long and not closely tied to long waves."

## Human-verification queue (remaining — David, optional)

- **Namenwirth/Weber "~152 years" / "fit on roughly 120 years of data".** The IA copy (`dynamicsofcultur0000name`) is print-disabled and the search-inside API refuses unauthenticated queries. Claim is plausible (platforms 1844–1964 ≈ 120 years) but unconfirmed from the primary text.
- **Schlesinger Jr. 1962–1978 dating and Sr.'s 16.55 in the original texts** — already phrased defensively ("conventional tabulation"; secondary-source 16.55), so this is belt-and-suspenders. Borrowable at archive.org: `cyclesofamerican0000schl` (search: "1962", "before or after"), `pathstopresent0000schl` (search: "16.55").

## Clean (both engines)

Turchin JPR quote verbatim; JPR/BMS/CJE/Maddison/HATCH DOIs and page ranges; Modelski EOLSS "100 to 120 years" and "does not connote strict cycles" verbatim; phase order; Portugal→Netherlands→Britain×2→US; Perez 2009 double bubble; Stimson vintage (no 2026 file); MPD 2023 base year and the 2014 crossover (vintage-sensitive, disclosed); Goldstein pp. 99/111/244 (Claude, from the author's PDFs); Thome & Rahlf 30(4):427–448; Mohler EJPR 15(2):155–165; Klingberg World Politics 4(2); Sornette; Arrighi; all 13 cos-table rows; all three span/period computations.
