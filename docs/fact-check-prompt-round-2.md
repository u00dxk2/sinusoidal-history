# Fact-check prompt for /deep-research, round 2

This is a second-pass prompt. Round 1 caught material errors; we corrected them and want a fresh adversarial review with maximum discovery, not just verification.

Paste the section below into a deep-research agent.

---

## Begin prompt

You are a fact-checker for **Sinusoidal History** (https://sinusoidal-history.skylarkcreations.com), a public-facing data visualization that overlays seven historical cycle theories on one shared time axis, each paired with a real long-run empirical data series. The artifact is being shared with historians and economists and writers (Tomas Pueyo's audience among them) who will read carefully and quote anything wrong. The project's credibility depends on getting this right.

A first-round fact-check already found ~13 errors and we corrected them. This is round 2. **Your job is not to verify our corrections — it is to find what we missed.** Read the live site adversarially. Open every external URL. Check every direct quote. Recompute every number you can. Hunt for pipeline bugs of the kind that aren't visible from the prose alone.

The first round caught two errors in the same data file that compounded — a name-mismatch bug in the filter list and a sparse-benchmark coverage issue that stacked on top. That kind of mechanical defect is *exactly* what a prose-only audit will miss. Treat the data files and pipelines as suspect by default.

## Method

1. **Browse the live site fresh.** Don't trust internal documents; verify against the live pages. Pages to read in full:
   - `https://sinusoidal-history.skylarkcreations.com/` — home, with overlay viz, NowSummaryPanel, ConvergenceNote
   - `https://sinusoidal-history.skylarkcreations.com/poster` — print broadside
   - `https://sinusoidal-history.skylarkcreations.com/about` — the argument and disclaimer
   - `https://sinusoidal-history.skylarkcreations.com/methods` — provenance and methodological caveats
   - `https://sinusoidal-history.skylarkcreations.com/colophon` — letter from the maker
   - `https://sinusoidal-history.skylarkcreations.com/embed` and `/embed/docs` — iframe embed and its docs
   - `https://sinusoidal-history.skylarkcreations.com/og` — OG card

2. **Open every external URL the site cites.** For each data series, click through to the upstream source page (Voteview, FRBSF Fernald, WID/wid.world, Maddison Project at Groningen, V-Dem, Project Mars/OWID). Confirm the URL still resolves and that the dataset name, license, version, and coverage match what the site claims.

3. **Verify every direct quote.** When the site quotes a theorist (e.g., a Dalio sentence about US power peaking in the 1950s, or a Strauss-Howe forecast about 2005/2020/2026), pull the exact source. Confirm the words, the chapter, and the edition. Flag paraphrases presented as quotes.

4. **Check every numerical claim against primary data.** When the site says "peak at 1945 at ~32%" or "DW-NOMINATE starts in 1879" or "Project Mars covers 1800–2011," confirm against the actual upstream dataset, not against the local CSV.

5. **Audit the local data pipelines for residual bugs.** The first round found a regional-aggregate filter mismatch in the Maddison pipeline that produced obvious decade-boundary anomalies in the US-share-of-world-GDP series. The other five series may have analogous defects. For each local CSV the project ships:
   - DW-NOMINATE: `https://sinusoidal-history.skylarkcreations.com/data/dw_nominate.csv` (House polarization, 1879–current; should be one row per Congress, every two years)
   - Fernald TFP: `/data/us_tfp_growth.csv` (5-year centered rolling, displayed ~1950–present)
   - WID Top 1% Wealth: `/data/wid_top1_wealth.csv` (1820–most-recent; modern series 1913+)
   - Maddison US/world GDP: `/data/us_world_gdp_share.csv` (1870–2022, recently rebuilt)
   - V-Dem libdem: `/data/vdem_libdem.csv` (1789–most-recent, US only)
   - Project Mars conflict deaths: `/data/conflict_deaths.csv` (1800–2011, log-transformed)

   For each, do at least these checks:
   - Open the upstream source. Pick three random years (one early, one mid-20th-century, one recent). Compare the local CSV value against the upstream value.
   - Scan the local CSV for year-over-year jumps that don't correspond to known economic/political events. Flag anything that looks like a coverage artifact.
   - Verify the documented transformation (log1p, rolling average, etc.) is actually being applied as claimed.
   - Confirm the start/end years.

6. **Read the prose with an adversarial eye.** Treat every sentence on /about, /methods, /colophon as potentially wrong. Look especially for:
   - Direct attribution of motivation to a person who didn't write that ("X anchored on Y because Z" — flag any unsourced psychologizing)
   - Claims about academic consensus that may overstate or understate
   - Mathematical claims about Pearson, sinusoids, normalization — verify they're correct as stated
   - Edition or imprint specifics (e.g., "Belknap/Harvard 1981," "Broadway Books 1997") — verify exact publisher and year
   - Death/birth dates or other biographical specifics
   - Geographic specifics (Maghreb, etc.)

7. **Check internal consistency.** The site has multiple places where the same fact appears (cycles.json, series.json, /about, /methods, /colophon, source.md provenance files). Where they disagree, flag it.

## Categories to audit

### Cycle theories (cycles.json equivalents on the site)

Each of the seven cycles has: name, period (years), reference peak year, peak rationale prose, source citation (book/paper/year/imprint), confidence-level classification, and short description. For each, verify all six fields against primary or authoritative-secondary sources.

The seven cycles and their currently displayed values, for reference:

1. **Ibn Khaldun** — 120y, peak 1789 (project's editorial choice, framed as such), source *Muqaddimah* (1377), confidence "narrative." Stages described as a paraphrase: consolidation → tyranny → leisure → contentment → waste.
2. **Kondratiev** — 54y, peak 1973, source "Bol'shie tsikly kon'yunktury" (1925) / 1935 English abridgment, confidence "empirical-contested."
3. **Huntington (creedal passion)** — 60y (range 60–70 acknowledged), peak 1968 (interval midpoint of his "S&S Years 1960–1975"), source *American Politics: The Promise of Disharmony* (Belknap/Harvard, 1981), confidence "narrative."
4. **Carlota Perez** — 55y, peak 2000 (her "Turning Point," not a peak in her terminology), source *Technological Revolutions and Financial Capital* (Edward Elgar, 2002), confidence "empirical-contested."
5. **Peter Turchin** — 150y, peak 2020 (decade-level forecast), sources *Secular Cycles* (Princeton, 2009, with Nefedov), *Ages of Discord* (Beresta, 2016), *End Times* (Penguin, 2023), confidence "quantitative."
6. **Ray Dalio (Big Cycle)** — 85y, peak 1950 (per Dalio's stated 1950s peak in Ch. 5), source *Principles for Dealing with the Changing World Order* (Avid Reader Press, 2021), confidence "narrative."
7. **Strauss-Howe (saeculum)** — 84y, peak 1955 (post-WWII American High peak; the Crisis climax around 2020 is a trough in this construction, not a peak), source *The Fourth Turning* (Broadway Books, 1997), confidence "narrative."

For each: verify the period number is inside the consensus range, the peak year is defensible, the source citation is accurate (title, year, publisher), and the confidence-level classification is appropriate. Flag any direct quote that doesn't appear verbatim in the cited source.

### Data series

Six series, each with: name, source attribution, source URL, license, coverage range, transformation, association note linking it to a cycle. Currently shown:

1. **DW-NOMINATE House polarization** — Voteview / Lewis, Poole, Rosenthal, Boche, Rudkin, Sonnet (2025); 46th Congress–present (1879–current); license "freely available; project code MIT-licensed; no explicit data license."
2. **US TFP growth (5-yr rolling)** — Fernald (2014), FRBSF WP 2012-19; underlying 1947Q2+, displayed ~1950+; project's own derived 5-year centered rolling average; license "freely available; © FRBSF, no explicit reuse license."
3. **US Top 1% Wealth Share** — WID / Saez–Zucman 2016 / DINA, retrieved via Our World in Data; modern series 1913+; pre-1913 splice from earlier sources; license CC BY-NC-SA 4.0.
4. **US Share of World GDP** — Maddison Project Database 2023 (Bolt & van Zanden); 1870–2022; 2011 PPP \$; license CC BY 4.0.
5. **US Liberal Democracy Index (V-Dem)** — V-Dem Institute, Country-Year Dataset v16, March 2026, retrieved via OWID; 1789–2025; license CC BY-SA 4.0.
6. **Deaths in conventional wars (Project Mars, log)** — OWID + Project Mars v1.1 (Lyall 2020); 1800–2011; log1p-transformed; license "OWID chart CC BY 4.0; underlying Project Mars data subject to Harvard Dataverse terms."

For each, verify license, version, coverage, and the upstream URL. Cross-check at least three values from the local CSV against the upstream dataset. Flag anything off by more than rounding.

### Prose attributions

The /about page has a paragraph explaining why each theorist's peak year is where it is. The current version (after round 1 corrections) attributes anchor choices to the project rather than to the theorists. Verify that:
- The Khaldun sentence makes clear he died in 1406 and the 1789 anchor is the project's choice
- The Huntington sentence acknowledges his "S&S Years 1960–1975" interval and that 1968 is the project's midpoint
- The Kondratiev sentence cites the 1968–1974 turning-point window
- The Perez sentence calls 2000 a "Turning Point" (her term) and discloses the project's mapping to a sinusoid peak

The disclaimer paragraph claims:
- All seven theories are contested in different ways
- Kondratiev waves are not cleanly confirmed in long-run data
- Perez's framework is "qualitative — Schumpeterian historical pattern recognition, not statistical fitting"
- Turchin has the most developed quantitative literature of the seven
- Dalio's stated peak is the 1950s
- Strauss-Howe's predicted Crisis climax around 2020 is a trough in this construction

Verify each.

### /methods page claims

- "DW-NOMINATE: 46th Congress–present (1879–current)"
- "Fernald TFP underlying 1947Q2–present, displayed ~1950–present after 5-year centered window"
- "Project Mars conflict data 1800–2011"
- "WID top-1% wealth modern coverage 1913–most-recent (with five earlier decadal points spliced from secondary sources)"
- "Maddison US/world GDP share trimmed to 1870+"
- "V-Dem 1789–present"
- The mathematical claim about Pearson and sinusoids: "a perfect cosine has zero correlation with the same cosine shifted by a quarter period." (Verify this is mathematically correct as stated.)
- The claim that Pearson significance tests don't apply to autocorrelated time series. (Verify.)
- The claim that better tools include "cross-correlation at varying lags, Lomb-Scargle or Fourier spectra, and wavelet decomposition." (Verify these are appropriate alternatives.)

### Provenance files (per-series source.md)

Available at `/data/{series-id}.source.md` URLs (e.g., `/data/wid_top1_wealth.source.md`). Each documents retrieval URL, primary citation, license, coverage. Compare against the corresponding fields in series.json and against the upstream source. Flag any inconsistencies.

### Things round 1 didn't cover but might be wrong

- **The convergence note** ("Notice how the cycles tend to peak near the present. That is not convergence — it is publication bias.") — is the framing correct? Is "publication bias" the right term, or is this better described as anchoring or selection effect?
- **Mathematical claims in cycleMath.ts** (visible in the deployed JS bundle): the sinusoid uses `cos(2π × (year - peak_year) / period_years)`. Does that match the documented intent of "peak at peak_year"? (Verify cos(0) = 1, so peak_year is correctly the peak.) Phase position labels (peaking, rising, troughing, falling) — are the band boundaries reasonable?
- **The Pearson r diagnostic** — when the calibration drawer is open, the site reports Pearson r between the cycle curve and the data series, recomputed live. Is the computation correct? Does it agree with what `scipy.stats.pearsonr` would give for the same inputs?
- **The amplitude_normalized field on each cycle** is set to 1.0 across the board. Should it be? (Probably yes, since the curves are normalized; verify.)
- **The colophon page's claims about the build** — that the model is "Claude Code (Opus 4.7)," that the build was five rough phases, etc. — these are verifiable to the extent that the GitHub commit history backs them up. (Repo is at https://github.com/u00dxk2/sinusoidal-history.) If the timeline doesn't match, flag.

## Output format requested

Return one master report ranked by **risk of public embarrassment** if a careful reader caught it.

For each item:
1. **Verdict**: `correct` / `correct-with-caveat` / `imprecise` / `incorrect` / `unverifiable-from-public-sources`.
2. **Evidence**: at least one primary or authoritative-secondary citation, with URL.
3. **Proposed replacement**: exact replacement string (for cycles.json field, series.json field, prose paragraph, etc.).
4. **Editorial-overreach flag** if applicable.

Also include a **pipeline-integrity section** specifically for any data-handling defect you find — these are the highest-risk class of error because they're invisible to a prose audit and can change the headline numbers materially.

Also include a **discoveries-not-listed section** for anything wrong on the site that wasn't in our checklist. This is the most important section. The first-round prompt missed two compounding pipeline bugs in the Maddison series; assume there are similar issues we haven't thought to flag.

**Bias toward strict reading.** Hedge on "correct-with-caveat" only when the claim is materially defensible; mark `imprecise` or `incorrect` when a careful reader could quote the discrepancy.

## End prompt

---

## Notes for Dave

This prompt is more aggressive than round 1. Three deliberate changes:

1. **Asks the agent to recompute and pipeline-audit, not just verify.** The first round was framed as "verify these claims"; this one says "find what's wrong." That changes the failure mode: round 1's agent found the things on its checklist; this prompt should find things that aren't.
2. **Names the Maddison pipeline bug explicitly as the model of what to look for.** That kind of mechanical defect is the highest-risk class because the prose looks fine and the upstream looks fine — it's only the local processing that's wrong. By naming the pattern, we make the agent more likely to find similar issues in the other five series.
3. **The "discoveries-not-listed" section is the highest-priority output.** Round 1 caught what was on the list. Round 2 should try to find what we didn't think to ask about.

When the report comes back, paste it and I'll fold the verdicts into a Phase-7 commit. If round 2 finds new pipeline bugs in any of the other five series, we should expect to write per-series rebuild scripts the way we did for Maddison.
