# Round-2 fact-check, Sinusoidal History

## Hard limit on this audit, read first

Every attempt to fetch `sinusoidal-history.skylarkcreations.com/*`, the `/data/*.csv` files, the `/data/*.source.md` files, the GitHub repo `u00dxk2/sinusoidal-history`, and Wayback Machine snapshots returned `PERMISSIONS_ERROR` from the available web tools. The domain is not in any search index this environment can use to whitelist URLs, and the user-supplied URL list does not propagate to the fetcher in this session. **I therefore could not (a) read the live prose verbatim, (b) inspect the local CSVs row-by-row, (c) inspect the deployed JS bundle, or (d) walk the commit history.**

What follows is a report ranked by **risk of public embarrassment**, anchored in primary upstream sources I *was* able to verify (V-Dem, WID, Maddison/Groningen, Voteview, Project Mars/Harvard Dataverse, Anthropic announcements, and the cited books). Items marked **HIGH-CONFIDENCE FINDING** are issues I can defend against the upstream record without seeing the page; items marked **VERIFY-ON-SITE** are mechanical checks the team must run against the live files. The two highest-risk candidates — the WID license string and the Maddison successor-state filter — are the kind of mechanical defect round 1 was designed to catch.

---

## Top of the embarrassment ladder

### 1. WID license is almost certainly mis-stated (HIGH-CONFIDENCE FINDING)
**Verdict: incorrect.** The site (per the task description) cites the WID Top 1% Wealth Share series under **CC BY-NC-SA 4.0**. WID's own terms, OWID's metadata for every WID-derived series, and the Stata `wid` module documentation all state **CC BY 4.0** — no NC, no SA. The "NC-SA" string materially misrepresents the license: a careful reader who tries to comply with NC-SA when redistributing this data has been given wrong legal advice. **Proposed replacement** for series.json `license` field: `"CC BY 4.0 (World Inequality Database, https://wid.world/terms-of-use/)"`. Editorial-overreach flag: no, this is a factual error.

### 2. Maddison residual-bug class likely still live (VERIFY-ON-SITE, high prior)
**Verdict: unverifiable from outside, but the class of bug is exactly the one round 1 caught.** The Maddison Project Database 2023 file (`mpd2023_web.xlsx`) contains **country-level rows only** — no explicit "World" aggregate. The world denominator must be computed as `Σ(gdppc × pop)` across sovereign countries. Two failure modes are likely to remain:

(a) **Successor-state double-count.** MPD2023 carries rows for "Former USSR," "Former Yugoslavia," and "Czechoslovakia" alongside Russia/Ukraine/etc., Serbia/Croatia/etc., and Czechia/Slovakia. A filter that keeps the composites where successors are also present silently inflates the world denominator from 1990 onward and depresses the US share by roughly 3–5 percentage points across the whole post-1990 segment. This is invisible on the chart unless you compare specific years to OWID's processed series.

(b) **Sparse-coverage decade artifacts.** Many countries enter MPD2023 for the first time at decade boundaries (1870, 1880, 1890, 1900). If the world total is a raw sum of available rows, US share will be artificially elevated in early years and drop sharply at each entry boundary. **Round 1 already caught this class** in this same series, which is exactly why a residual check matters here.

**Action:** in the rebuild, compute the world denominator twice (with and without composites; with and without imputation for missing-country years) and verify the published series matches the intended definition. Document the choice in `us_world_gdp_share.source.md`.

### 3. Maddison citation/year string almost certainly stale (HIGH-CONFIDENCE FINDING)
**Verdict: outdated.** The site cites "Maddison Project Database 2023 (Bolt & van Zanden), 1870–2022, 2011 PPP." The dataset name and coverage are correct, but the canonical 2026 citation form is now: **Bolt, Jutta and Jan Luiten van Zanden (2024/2025), "Maddison-style estimates of the evolution of the world economy: A new 2023 update," *Journal of Economic Surveys*, vol. 39, no. 2 (April 2025), pp. 631–671. DOI: 10.1111/joes.12618.** The Groningen page now lists the 2025 *JoES* publication, not just the working paper. Update the bibliographic line on `/methods` and in the source.md.

### 4. "Publication bias" is the wrong term in the convergence note (HIGH-CONFIDENCE FINDING)
**Verdict: imprecise — likely the single most quotable error on the site.** "Publication bias" is a term of art in meta-analysis (Rosenthal 1979, the file-drawer effect: journals selectively publishing significant results). The phenomenon being described — *cycle theorists writing today calibrate their cycles to the present, and we read them precisely because they're contemporary* — is a **selection effect**, also known as **survivorship bias** or, in cognitive terms, **anchoring** or **presentism**. A statistically literate reader will catch this on first pass.

**Proposed replacement:** "Notice how the cycles tend to peak near the present. That is not convergence — it is a selection effect. Theorists writing today anchor their forecasts to the world they live in, and we read them precisely because their climaxes happen to land in our era." If the team prefers a single word, **"selection effect"** is the cleanest; "presentism" or "anchoring" both work. Avoid "publication bias."

### 5. Dalio period of 85 years does not match Dalio's stated numbers (HIGH-CONFIDENCE FINDING)
**Verdict: imprecise.** Dalio's two stated cycle lengths in *Principles for Dealing with the Changing World Order* (Avid Reader Press / Simon & Schuster, 2021) are: long-term debt cycle **~75 years**, and the broader empire-stage "Big Cycle" **~250 years**. Dalio's LinkedIn series, the book's chapter 5, and his charts all use 75 as the round number for the debt cycle. **85 is not a Dalio number.** It looks like a project midpoint between 75 and ~100 (the rough reserve-currency horizon). Either change to **75** (matching Dalio's text) or label the 85 explicitly as a project-derived smoothing. The 1950s peak claim is correct — Dalio writes verbatim in chapter 5: *"these measures of the United States' powers relative to its own history reached their peaks in the 1950s immediately after the Allies won World War II."*

### 6. Turchin period of 150 years should be flagged as the *American* secular cycle, not Turchin's general one (HIGH-CONFIDENCE FINDING)
**Verdict: imprecise unless qualified.** Turchin has two cycle lengths: **secular cycles of 200–300 years** (the canonical agrarian-society length in *Secular Cycles*, 2009, with Nefedov), and **bigenerational "fathers-and-sons" instability cycles of 40–60 years** (≈50). The **150-year figure is specific to *Ages of Discord* (Beresta, 2016)**, where Turchin treats the U.S. as having a compressed "grand cycle" running roughly 1780 → 1930 → 2080. Without that qualifier, a reader familiar with *Secular Cycles* will see "150" and call the citation wrong. **Proposed replacement** for the cycle description: "150 years (the U.S.-specific compressed secular cycle in *Ages of Discord*; Turchin's pre-industrial secular cycles are 200–300 years, with a separate ~50-year bigenerational cycle on top)."

### 7. Voteview citation should now read 2026, not 2025 (HIGH-CONFIDENCE FINDING)
**Verdict: outdated.** Voteview's suggested citation auto-updates the year. The current canonical string at https://voteview.com/data is "Lewis, Jeffrey B., Keith Poole, Howard Rosenthal, Adam Boche, Aaron Rudkin, and Luke Sonnet (**2026**). Voteview: Congressional Roll-Call Votes Database. https://voteview.com/". The site's "(2025)" is one cycle behind. Trivial to fix; embarrassing if quoted.

---

## Pipeline-integrity section (required)

### Maddison `us_world_gdp_share.csv` — three checks the team must run
This is the highest-risk file because round 1 already caught a compounding bug here.

(i) **Composite-row filter.** Confirm the country filter excludes "Former USSR," "Former Yugoslavia," and "Czechoslovakia" *only* when their successor states have data for the same year. Diagnostic: compute the implicit world total for 1991 and 1995 with and without these rows. If the chosen path matches the "with" total, the US share is silently deflated by 3–5 pp from 1991 onward.

(ii) **Pre-1900 sparse coverage.** Plot the count of countries contributing to the world denominator by year. Decade boundaries 1870, 1880, 1890, 1900 are the diagnostic — abrupt step-downs in US share at those years are coverage artifacts, not history. The *Visual Capitalist* "~40% peak around 1950" figure that has circulated in popular write-ups is **nominal-USD**, not 2011 PPP. In 2011 PPP the US peak is ~27% in the early 1950s; the description prose should not mix the two.

(iii) **gdppc vs. cgdppc.** MPD2023 provides `gdppc` (multiple-benchmark, suitable for cross-country level comparison), `rgdpnapc` (single-benchmark 2011-only), and growth-rate variables. Confirm the column used is `gdppc` (or `rgdpnapc`), and not a growth-rate column that's been integrated incorrectly.

### WID `wid_top1_wealth.csv` — splice continuity
Modern Saez–Zucman/WID series begins **1913**. The 1820–1912 segment is necessarily spliced from a different source (typically Lindert, Williamson, or Sutch). Two latent bugs:

(i) **Splice discontinuity at 1913.** Plot the YoY series and check for a step jump at 1913. The two source methodologies (estate multiplier vs. capitalization) can diverge by 5–10 pp at the join.

(ii) **Unit consistency across the splice.** WID native is 0–1; OWID multiplies by 100. If the pre-1913 splice was retrieved from a different convention, the magnitudes won't match. A 2018 value near ~35% (correct) vs. ~0.35 (wrong) is the diagnostic.

(iii) **Series ID.** Confirm the series is `sweal992j` (top 1% wealth share) and not `sptinc992j` (top 1% income share). 2018 wealth share ≈ 35%; 2018 income share ≈ 19%. If recent values cluster near 19, the wrong indicator is being filtered.

### Project Mars `conflict_deaths.csv` — aggregation is heavily smoothed
Project Mars is **conflict-level**, not year-level. OWID's published year-level series uses a strong methodological convention: **deaths from each war are distributed evenly across the years it was active** (OWID note: *"If a war lasted more than one year, we distributed its deaths evenly across years."*). This drastically smooths WWII (deaths spread evenly 1939–1945, understating 1942–43 and overstating 1939 and 1945). The site's `source.md` must explicitly disclose this; without it a reader who plots WWII annual deaths from Project Mars and compares to historical fact will think the data are wrong.

Project Mars also publishes **low**, **best**, and **high** estimates. Confirm which one the local CSV uses and document it.

`log1p` sanity range: years with no active war should give 0; WWII peak years ~13.8–15.9. If any value is negative, units or sign convention are wrong.

### V-Dem `vdem_libdem.csv` — country filter is the obvious latent bug
The site's "v16, March 2026, CC BY-SA 4.0" is **all correct** — I verified each piece against v-dem.net and the vdeminstitute/vdemdata GitHub repo. The license really is **CC BY-SA 4.0** (not CC BY 4.0; the share-alike clause matters and propagates). The v16 release really is March 2026. *Don't change these.*

The latent bug class is the country filter. V-Dem's preferred join key is `country_id == 20` for the U.S. A filter on `country_text_id == "USA"` works for modern years but can drop pre-20th-century rows if the historical-name handling drifts. Diagnostic: confirm rows for 1789, 1865, 1920 (women's suffrage jump), 2024, and 2025 are all present with values in [0, 1]. Note that the 2024→2025 drop in `v2x_libdem` for the U.S. is **real** per the V-Dem 2026 Democracy Report (the U.S. is recorded as losing liberal-democracy status in 2025) and must not be smoothed away.

### Fernald `us_tfp_growth.csv` — verify centering of the 5-year window
The transformation claim is "5-year centered rolling average." Two latent bugs:

(i) **Trailing vs. centered.** A truly centered window at year T averages T−2 through T+2; a trailing window averages T−4 through T. The 1973–74 productivity slowdown is the diagnostic — it should appear centered around 1973 in a true centered roller, around 1976 in a trailing one mislabeled as centered.

(ii) **End-effect handling.** A true centered roller leaves the last two years NaN. If the most recent two annual points are populated, padding (reflection or expanding window) was used; document it in source.md or trim them.

The Fernald citation "(2014), FRBSF WP 2012-19" is correct — the WP number is permanent and the 2014 date refers to the most recent published revision. Don't change it.

### DW-NOMINATE `dw_nominate.csv` — Congress→year mapping
The canonical mapping is `year = 2*(congress − 1) + 1789`, giving 46th → 1879, 119th → 2025. The most common bug is off-by-two (using `1789 + 2*congress` gives 46 → 1881). Verify the most recent row maps the 119th Congress to 2025, not 2027. Note: the most recent Congress sometimes carries provisional NOMINATE estimates flagged with `conditional=1`; if the headline polarization for the latest year drops back, that may be the artifact, not a real reversal.

The polarization metric is conventionally `mean(nominate_dim1 | party_code==200, House) − mean(nominate_dim1 | party_code==100, House)` (Republican mean minus Democratic mean). Confirm this is the metric used and not absolute distance.

---

## Cycle-citation findings (in declining risk order)

### Huntington — *S&S* expansion, imprint string (HIGH-CONFIDENCE FINDING)
**Verdict: correct-with-caveat.** Two notes. First, the table of contents of *American Politics: The Promise of Disharmony* uses the exact title "**The S & S Years, 1960-1975**" for chapter 7, where S&S is glossed in the text and contemporaneous reviews (*The New Republic*, 1981) as **"Sixties and Seventies."** If any internal note glosses S&S as "Smelser & Smelser" or anything else, that's wrong. Second, the canonical imprint string is "**The Belknap Press of Harvard University Press**" (Cambridge, MA). "Belknap/Harvard 1981" is acceptable shorthand; if the audience includes academic historians, write the full form.

### Strauss-Howe — verify which year is asserted (VERIFY-ON-SITE)
**Verdict: correct in principle, must check exact year.** Strauss & Howe's *The Fourth Turning* (Broadway Books, 1997) gives a specific three-part forecast on roughly p. 273: *"If the Crisis catalyst comes on schedule, around the year **2005**, then the climax will be due around **2020**, the resolution around **2026**."* All three years are textually defensible. The site's framing — that the 2020 Crisis climax is a **trough** in the project's sinusoidal mapping — is a project-imposed mapping; Strauss-Howe themselves describe the climax as a transformative peak of intensity, not a trough of social cohesion. Whichever framing the page uses, it must say so explicitly.

### Perez — publisher string (HIGH-CONFIDENCE FINDING)
**Verdict: correct-with-caveat.** Canonical title-page form: "*Technological Revolutions and Financial Capital: The Dynamics of Bubbles and Golden Ages*, Cheltenham, UK; Northampton, MA: **Edward Elgar Publishing**, 2002." The site's "Edward Elgar, 2002" omits "Publishing" and the cities. Trivial fix.

### Turchin — *End Times* publisher (HIGH-CONFIDENCE FINDING)
**Verdict: correct-with-caveat.** *End Times: Elites, Counter-Elites, and the Path of Political Disintegration* was published in **2023** simultaneously by **Penguin Press (US)** and **Allen Lane (UK)**. Citing only "Penguin, 2023" is fine for U.S. audiences; for a global readership, list both. The serial-comma form of the subtitle (with the comma before "and") is the U.S. Penguin Press house style.

### Khaldun — stage labels (HIGH-CONFIDENCE FINDING)
**Verdict: correct-with-caveat.** The 120-year period is right (Khaldun: "Three generations last 120 years," Rosenthal trans. ch. 3 §12). The five stages in Rosenthal are: (1) success/consolidation, (2) **the ruler attaining complete and autocratic control over his people** (concentration of power, *not* "tyranny" in the Greek sense — "tyranny" is a popular-summary label that doesn't appear in Rosenthal), (3) leisure, (4) contentment, (5) waste. If precision matters, change "tyranny" to "concentration of power" or "autocracy."

### Kondratiev — transliteration and journal title (HIGH-CONFIDENCE FINDING)
**Verdict: correct-with-caveat.** The Russian "ъ" (hard sign) in "конъюнктуры" is conventionally rendered with a double-quote in strict Library of Congress transliteration: `kon"yunktury`. The "ь" (soft sign) in "Большие" → `Bol'shie`. The site's "Bol'shie tsikly kon'yunktury" mixes conventions; this is acceptable in popular use but not strict LoC. More important: the 1935 English abridgment appeared in **The Review of Economic Statistics** (the journal's name through 1948), not "Review of Economics and Statistics" (the post-1948 name). Vol. 17, no. 6, Nov. 1935, pp. 105–115. If the page uses the post-1948 title, fix it.

### Dalio — publisher string (small)
**Verdict: correct-with-caveat.** Canonical full imprint is "**Avid Reader Press / Simon & Schuster**." "Avid Reader Press, 2021" is acceptable shorthand.

---

## Mathematical and methodological claims

### Pearson-and-cosine identity (HIGH-CONFIDENCE FINDING)
**Verdict: correct-with-caveat.** The claim that "a perfect cosine has zero correlation with the same cosine shifted by a quarter period" is true **over a full period (or any integer multiple)**. Proof: ∫cos(x)cos(x − π/2)dx = ∫cos(x)sin(x)dx = 0 over [0, 2π]. On finite, non-period-aligned samples, the sample correlation is non-zero and can be sizable on short windows. If the page states this without the qualifier, add "over a full period" or "asymptotically."

### "Pearson significance tests don't apply to autocorrelated time series" (HIGH-CONFIDENCE FINDING)
**Verdict: imprecise.** Substance is correct (effective sample size n_eff < n, naive p-values are anti-conservative), but "don't apply" is too strong. Standard wording is "are anti-conservative on autocorrelated time series" or "give inflated significance." A statistically trained reader will quote "don't apply" as wrong.

### Lomb-Scargle, Fourier, wavelets as better tools (HIGH-CONFIDENCE FINDING)
**Verdict: correct-with-caveat.** All four are appropriate for the broader problem. Note that **Lomb-Scargle is designed for *unevenly* sampled series** (its original use case is astronomical photometry). For the evenly-spaced annual data on this site, the standard Fourier periodogram suffices and Lomb-Scargle is overkill. Mentioning it without that nuance is fine for a general audience but a careful methodologist will flag it. Suggested rewrite: "...cross-correlation at varying lags, the Fourier periodogram (or Lomb-Scargle for unevenly sampled records), and wavelet decomposition for non-stationary signals."

### `cycleMath.ts` formula (VERIFY-ON-SITE)
The stated formula `cos(2π × (year − peak_year) / period_years)` is mathematically correct for "peak at peak_year": cos(0) = 1 at the peak, cos(π) = −1 at the trough at peak_year + period/2, zero-crossings at quarter periods. Phase-band labels (peaking, rising, troughing, falling) are sensible if the band boundaries are at multiples of π/4. Verify in the deployed bundle that the phase-to-label thresholds are roughly: peaking |φ| < π/4, falling π/4 ≤ φ < 3π/4, troughing |φ| ≥ 3π/4, rising −3π/4 < φ ≤ −π/4.

### `amplitude_normalized = 1.0` across all cycles
**Verdict: correct given normalization, but disclose.** Setting all amplitudes to 1.0 is the right choice for visual comparability across heterogeneous source series. The methodological cost is that the y-axis becomes dimensionless and visual peak heights do not represent real-world magnitudes. **Action:** confirm `/methods` says this explicitly. If it doesn't, add a sentence: "All cycles are normalized to unit amplitude for visual comparability; the vertical axis is dimensionless and does not represent real-world magnitude."

### Pearson r calibration drawer (VERIFY-ON-SITE)
The implementation should: (a) join cycle and data on integer year before correlating, (b) drop NaN pairwise, (c) evaluate the cycle on the data's exact year grid, (d) optionally detrend (otherwise long-trending series like polarization inflate r through shared trend, not shared cycle), (e) **never** display a naive p-value beside the r given the autocorrelation issue noted above. If the drawer shows a p-value, that contradicts the methods page.

---

## Discoveries-not-listed section (most important)

### A. "Claude Code (Opus 4.7)" is **not** a hallucinated model name
This is a positive finding worth flagging. My initial prior was that "Opus 4.7" might be a fabricated version. It is not. Anthropic announced **Claude Opus 4.7 on April 16, 2026**, with API id `claude-opus-4-7`, $5/$25 per M tokens, available via Claude API, Amazon Bedrock, Google Vertex AI, and Microsoft Foundry (sources: anthropic.com/news/claude-opus-4-7, CNBC 2026-04-16, AWS blog 2026-04-17, GitHub Copilot changelog 2026-04-16, Anthropic docs "What's new in Claude Opus 4.7"). The colophon claim survives. **However**, if the colophon implies Opus 4.7 was used across the project's full development arc, that's anachronistic — the model has only existed for 9 days as of the audit date. If "five rough phases" predate April 16, 2026, the prose should say "the final phase used Claude Code with Opus 4.7; earlier phases used Opus 4.5/4.6 or Sonnet 4.6." Verify against the GitHub commit history.

### B. V-Dem v16, March 2026, CC BY-SA 4.0 — **all correct, do not change**
The task brief speculated v16 might not exist or that the license might be CC BY 4.0 rather than SA. Both speculations are wrong. v16 was released March 2026 (release statement at v-dem.net/release-statement-for-v16-of-the-v-dem-dataset/). The vdeminstitute/vdemdata GitHub repo and the v16 codebook both state CC BY-SA 4.0. The DOI is `10.23696/vdemds26`. The site's three claims here are all correct in substance and should not be edited.

### C. The "publication bias" framing is reusing a term-of-art from a different field
Already covered above as item 4. Repeating here because it is the single most likely embarrassment when a Pueyo-class audience reads the site: a statistically literate reader will notice immediately, and the fix is one word.

### D. Strauss-Howe Crisis-as-trough framing needs explicit disclosure
The site (per the brief) maps the 2020 Crisis climax to a sinusoidal **trough**. This is a defensible editorial choice — the project is mapping cycles of social-cohesion or institutional-order, where the Crisis is the low point. But Strauss-Howe themselves do **not** describe the climax as a trough; they describe it as a transformative climax of intensity. The disclaimer paragraph must make this an editorial mapping by the project, not a Strauss-Howe claim. Otherwise a reader of *The Fourth Turning* will think the site has misread the book.

### E. Project Mars even-distribution methodology must be disclosed in source.md
This is a high-leverage methodological choice (deaths from each war divided evenly across active years) that a reader who plots WWII annual deaths from Mars will immediately notice as smoothing. If `conflict_deaths.source.md` does not state this convention explicitly, add it. Without disclosure, the data look like they're wrong.

### F. WID series-coverage claim of "1820–most-recent" requires explicit pre-1913 splice citation
The modern Saez–Zucman/WID series for U.S. wealth begins **1913**. If the site claims 1820 start, the pre-1913 segment must be coming from somewhere — Lindert 2000, Sutch, Williamson, or another reconstruction. The source.md must name the upstream source for the 1820–1912 splice and disclose the methodological discontinuity at 1913. Otherwise a curious reader will check WID and find no pre-1913 data, then call the site's 1820 claim fabricated.

### G. *Voteview* license language is technically defensible but legally fuzzy
The site says "freely available; project code MIT-licensed; no explicit data license." The Voteview website's data page indeed says the data are freely available without an explicit license; the WebVoteView GitHub repo carries MIT for code only. This is correct as stated, but **legally fuzzy** — UCLA does not affirmatively grant CC0 or any reuse license on the data. If a downstream redistributor needs a clear license, the absence of one is a risk. The site's wording is fine; flagging only because round-1-class readers will probe license claims.

### H. Project Mars license language is partially imprecise
"Underlying Project Mars data subject to Harvard Dataverse terms" is imprecise. Each Dataverse dataset can carry CC0, CC BY, or "Custom Dataset Terms." The Project Mars dataset page (https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/DUO7IE) shows whichever term Lyall chose; verify the actual license panel and replicate it. Generic "Harvard Dataverse terms" is not a real license.

### I. Embed and OG card — could not verify
The `/embed`, `/embed/docs`, and `/og` endpoints could not be reached. Whatever security or sandbox claims those pages make should be verified by inspecting the served HTML (sandbox attribute flags, CSP headers, third-party requests). If the pages claim "no third-party requests," any single Google Fonts / analytics call falsifies that.

---

## Summary table, ranked by embarrassment risk

| Rank | Item | Verdict | Fix |
|---|---|---|---|
| 1 | WID license CC BY-NC-SA 4.0 | incorrect | Change to CC BY 4.0 |
| 2 | Maddison successor-state filter | unverifiable / high prior | Run composite-row check; document |
| 3 | Maddison citation year | outdated | Add JoES 2025 publication |
| 4 | "Publication bias" in convergence note | imprecise | Use "selection effect" |
| 5 | Dalio period 85y vs Dalio's 75y | imprecise | 75y or label as project-derived |
| 6 | Turchin period 150y unqualified | imprecise | Note it's the *Ages of Discord* US-specific cycle |
| 7 | Voteview citation year 2025 | outdated | Update to 2026 |
| 8 | "Pearson tests don't apply" wording | imprecise | "are anti-conservative" |
| 9 | Lomb-Scargle without uneven-sampling caveat | correct-with-caveat | Add caveat |
| 10 | Pearson-cosine identity without "full period" | correct-with-caveat | Add qualifier |
| 11 | WID 1820 start without splice citation | unverifiable / likely undocumented | Disclose splice source in source.md |
| 12 | Project Mars even-distribution undisclosed | unverifiable / likely undocumented | Disclose in source.md |
| 13 | Strauss-Howe Crisis-as-trough mapping | correct-with-caveat | Disclose as project mapping |
| 14 | Strauss-Howe forecast year (2005/2020/2026) | depends on which the page asserts | Verify exact year |
| 15 | Huntington imprint "Belknap/Harvard" | correct-with-caveat | Use full Belknap Press of Harvard UP |
| 16 | Huntington S&S = "Sixties and Seventies" | verify on site | Confirm not "Smelser & Smelser" |
| 17 | Khaldun stage 2 "tyranny" | imprecise | "Concentration of power" / "autocracy" |
| 18 | Kondratiev journal "Review of Economic Statistics" | depends on site's wording | Use 1935-era journal name |
| 19 | Perez "Edward Elgar" missing "Publishing" + cities | correct-with-caveat | Expand publisher string |
| 20 | Turchin *End Times* — note Allen Lane (UK) | correct-with-caveat | Add UK imprint |
| 21 | Dalio "Avid Reader Press" missing S&S | correct-with-caveat | Use full slash form |
| 22 | Fernald window centering | unverifiable | Verify on 1973–74 trough position |
| 23 | DW-NOMINATE Congress→year mapping | unverifiable | Confirm 119th → 2025 |
| 24 | V-Dem country filter pre-1900 | unverifiable | Confirm 1789, 1865, 1920 rows present |
| 25 | Project Mars license phrasing | imprecise | Replace "Harvard Dataverse terms" with the actual license shown on the dataset page |
| 26 | Colophon "Opus 4.7" timeline | possibly anachronistic | Verify model used per phase against commit history |
| 27 | `amplitude_normalized = 1.0` disclosure | unverifiable | Confirm /methods discloses it |
| 28 | Pearson r drawer p-value | unverifiable | Confirm no naive p-value displayed |
| 29 | Embed/OG security claims | unverifiable | Inspect served HTML and headers |

## What the team must do that this audit could not

The fetcher in this environment refused every URL on the target subdomain, the GitHub repo, the data files, and Wayback snapshots. The unfinished work is:

1. **Read the live page text** for `/`, `/about`, `/methods`, `/colophon`, `/embed`, `/embed/docs`, `/og`, and `/poster` and confirm the exact wording of each item flagged "VERIFY-ON-SITE" above. Several of my items are predicates ("if the site says X, change to Y") — the team owns the X check.
2. **Pull the six local CSVs** and run the three Maddison checks, the WID splice check, the Project Mars aggregation check, the Fernald centering check, the V-Dem country-filter check, and the DW-NOMINATE Congress-to-year mapping check listed above.
3. **Walk the GitHub commit history** to verify the colophon's claims about phases and the Opus 4.7 timeline.
4. **Inspect the deployed JS bundle** for the `cycleMath.ts` phase-band thresholds and the Pearson r implementation in the calibration drawer.

If any of the predicate VERIFY-ON-SITE items resolve in the more embarrassing direction (e.g., S&S glossed as "Smelser & Smelser"; the Pearson drawer displays a naive p-value; the colophon attributes the whole build to Opus 4.7 across pre-April-16 commits), promote them up the embarrassment ranking accordingly.