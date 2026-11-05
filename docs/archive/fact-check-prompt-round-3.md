# Fact-check prompt for /deep-research, round 3

This is a third pass focused specifically on the VERIFY-ON-SITE items round 2 flagged but couldn't check (round 2's fetcher refused the target subdomain). Round 3's job: actually browse the live pages, inspect the served HTML and JS, and confirm the items round 2 left dangling.

If your environment can browse `https://sinusoidal-history.skylarkcreations.com/*` and the GitHub repo `https://github.com/u00dxk2/sinusoidal-history`, this prompt is for you. If it can't, return that as the first sentence and we'll route the work elsewhere.

Paste the section below.

---

## Begin prompt

You are a fact-checker for **Sinusoidal History** (https://sinusoidal-history.skylarkcreations.com), a public-facing data visualization that overlays seven historical cycle theories on one shared time axis. Two prior fact-check rounds caught material errors and we corrected them in commits f9f2668 and 9eb1447. This is round 3, focused on a specific list of items the round-2 review marked **VERIFY-ON-SITE** because its fetcher couldn't reach the live subdomain. Your job: actually open the pages, the deployed JS, the GitHub repo, and the local CSVs (served from `/data/*.csv` on the same domain), and resolve each item.

If you cannot reach the live site, the GitHub repo, or `/data/*.csv` URLs, **stop and say so as the first sentence of your output**. Do not return prior-knowledge guesses; the project depends on actual verification this round.

## What to check

### Group A: deployed prose

For each, open the relevant live page and quote the verbatim text, then assess.

A1. `/about` — the disclaimer paragraph that begins "All seven theories are contested in different ways." Does it explicitly state that:
- (a) The Strauss-Howe Crisis climax around 2020 is a *trough* in this construction, not a peak (i.e., the project's sinusoidal mapping is editorial, not Strauss-Howe's own claim)?
- (b) Dalio's stated peak is the 1950s, not 1945, and the project uses 1950?
- (c) Perez's framework is qualitative pattern recognition, not statistical fitting (and that an earlier draft mistakenly labeled it "quantitative")?
- (d) Khaldun (d. 1406) made no claim about European history?

A2. `/about` — the per-cycle list (auto-rendered from `cycles.json`). For each cycle, confirm the displayed `period` and `peak` values are: Khaldun 120y/1789, Kondratiev 54y/1973, Huntington 60y/1968, Perez 55y/2000, Turchin 150y/2020, Dalio **75y/1950**, Strauss-Howe 84y/1955.

A3. `/methods` — the "Why Pearson is the wrong tool" section. Confirm:
- The Pearson-cosine identity is qualified "**over a full period**" (or equivalent).
- The autocorrelation claim now reads "are anti-conservative" (or equivalent), not "don't apply."
- The alternative-tools sentence specifies that Lomb-Scargle is for unevenly sampled records.

A4. `/methods` — the Normalization section. Confirm the `amplitude_normalized = 1.0` disclosure is present (i.e., the page says the cycle curves are unit-amplitude sinusoids and the y-axis is dimensionless).

A5. `/methods` — the Missing-and-sparse-data section. Confirm the WID pre-1913 splice is disclosed (the five pre-1913 points come from earlier historical sources spliced via OWID/WID).

A6. `/colophon` — the "On the AI part" paragraph. Confirm the build is attributed to Claude Code (Opus 4.7) over five rough phases. Then walk the GitHub commit history at `https://github.com/u00dxk2/sinusoidal-history/commits/main` and check whether all phases of the build were post-April 16, 2026 (the Opus 4.7 release date per Anthropic's announcement). If any commits predate April 16, 2026 and substantively built the site, the colophon's framing is anachronistic and should be revised.

A7. `/` (home) — the ConvergenceNote component. Confirm the visible text says **"selection effect"** and not "publication bias."

A8. `/poster` — the editorial broadside. Walk the headline, standfirst, and per-row metadata. Flag any factual claim that disagrees with `cycles.json` or any of the prose pages.

### Group B: data files (served at /data/*.csv)

Open each CSV directly. Do not trust round-1/round-2 reports.

B1. `/data/dw_nominate.csv` — Confirm the first row is 1879 and the last row is 2023. Confirm the polarization metric is consistent with Voteview's `party.mean.diff.d1` (House) for the corresponding Congress. Sample three rows (one early, one mid-century, one recent) and compare to Voteview's published values.

B2. `/data/us_tfp_growth.csv` — Confirm coverage 1948–2025. Random-sample three years against the published Fernald `quarterly_tfp.xlsx` (`annual` sheet, `dtfp_util` column, 5-year centered rolling mean with edge clipping). The repo has a verification script at `scripts/verify_tfp.py`; run it if you can. The expected match: 78/78 rows within 0.0001 against `dtfp_util` centered-5.

B3. `/data/wid_top1_wealth.csv` — Confirm coverage 1820–2024 and that the values look like wealth share (~35% in 2018), not income share (~19% in 2018). Sample three years against OWID's published WID series and confirm the local CSV matches.

B4. `/data/us_world_gdp_share.csv` — Confirm coverage 1870–2022 and that decade-boundary years no longer show anomalous dips (the round-1 finding). Sample 1900, 1950, 1980, 2000 and 2022 and confirm they're in the same neighborhood as adjacent years (no drops > ~3 percentage points). The repo's `scripts/build_us_world_gdp_share.py` should be reproducible — re-run it and confirm the output matches the served CSV byte-for-byte.

B5. `/data/vdem_libdem.csv` — Confirm coverage 1789–2025, that the 2024→2025 drop (0.751 → 0.571) is present and matches V-Dem's published v16 re-coding of the US, and that early years (1789, 1865, 1920) all have values in [0, 1].

B6. `/data/conflict_deaths.csv` — Confirm coverage 1800–2011 and that the values reflect OWID's "ongoing conflict deaths, low estimate" with the even-distribution methodology (multi-year wars distributed evenly across active years). Sample 1939–1945 (WWII years) and confirm the values look uniformly elevated rather than spiking sharply at 1942–1944.

### Group C: deployed JavaScript

C1. Open the deployed bundle for the home page (`https://sinusoidal-history.skylarkcreations.com/`) and find the implementation of:
- `sineAtYear` / cycle-curve generation in `cycleMath.ts`
- The `phasePositionLabel` band thresholds (peaking/rising/falling/troughing)
- The Pearson r computation in the calibration drawer

Confirm:
- The cycle formula is `cos(2π × (year − peak_year) / period_years)` (or equivalent), so cos(0)=1 at the reference peak.
- The phase-band thresholds are at quarter-period boundaries (or sensible).
- The Pearson r computation joins on integer year, drops NaN pairwise, and does not display a naive p-value beside the r.

C2. Open the calibration drawer in a live browser. Confirm the displayed Pearson r updates as you move the period or peak-year slider, and that no p-value is displayed.

### Group D: external URLs in series.json

For each of the six series, confirm the source URL still resolves and the dataset hasn't been moved or relabeled:

D1. https://voteview.com/articles/party_polarization
D2. https://www.frbsf.org/wp-content/uploads/quarterly_tfp.xlsx (and the indicator landing page)
D3. https://wid.world/country/usa/
D4. https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023
D5. https://v-dem.net/data/the-v-dem-dataset/
D6. https://ourworldindata.org/grapher/deaths-in-wars-by-region-project-mars

For each, confirm: page resolves, dataset name matches our citation, license matches our claim. If the upstream site has restructured (common at year boundaries), report the new URL.

### Group E: license claims

Beyond the round-2 corrections, confirm these license strings against the upstream sources:

E1. WID = **CC BY 4.0** (per OWID's indicator metadata for indicator id 1209663; round 1 mistakenly said BY-NC-SA).
E2. V-Dem = **CC BY-SA 4.0** (per V-Dem GitHub release notes).
E3. Maddison = **CC BY 4.0**.
E4. DW-NOMINATE = "freely available; project code MIT-licensed; no explicit data license."
E5. Fernald = "freely available; © FRBSF, no explicit reuse license."
E6. Project Mars underlying data = **Public Domain** per OWID indicator metadata (round 2 noted the prior "Harvard Dataverse terms" was vague; round 3 should confirm the Dataverse panel itself if reachable).

### Group F: the four "VERIFY-ON-SITE" items round 2 specifically named

F1. Strauss-Howe forecast year — verify the `/about` and `cycles.json` rationale clearly states the project's Crisis-as-trough mapping is editorial, not Strauss-Howe's own claim. Strauss-Howe describe the Crisis climax as a transformative high point of intensity, not a low point of social cohesion; the page's framing must own the inversion.

F2. Huntington S&S gloss — confirm the prose says or implies "Sixties and Seventies" (Huntington's actual gloss in *American Politics*) and not anything like "Smelser & Smelser" or other mistaken expansion.

F3. Fernald window centering — round 2 wanted this empirically verified. The repo has `scripts/verify_tfp.py` which confirms the local CSV is a perfect match (78/78 within 0.0001) to `dtfp_util` centered-5. Re-run if you can; otherwise confirm the script logic.

F4. DW-NOMINATE Congress→year mapping — confirm 46th Congress → 1879, 118th Congress → 2023 (last row in current CSV). The 119th Congress is sitting (Jan 2025–Jan 2027) but Voteview hasn't yet published final estimates.

### Group G: discoveries-not-listed

Most important section. What is wrong on the live site that we didn't think to ask about? Round 1 missed two compounding pipeline bugs in the Maddison series; round 2 missed the WID license verdict (and got it wrong in the opposite direction); round 2 also did not catch the `dtfp` vs `dtfp_util` column mismatch in the Fernald derivation, which round 3's empirical verification surfaced.

Read the live site adversarially. Surface anything you find.

## Output format

Return one master report ranked by **risk of public embarrassment**. For each item:
1. **Verdict**: `correct` / `correct-with-caveat` / `imprecise` / `incorrect` / `unverifiable-from-public-sources`.
2. **Evidence**: at least one primary source with URL, plus a verbatim quote from the live page where applicable.
3. **Proposed replacement**: exact replacement string for the relevant field or paragraph.

The **discoveries-not-listed section** is the most valuable output. Do not pad it. If you find nothing new, say so clearly — that itself is information.

## End prompt

---

## Notes for Dave

This prompt assumes the deep-research agent's environment has actual fetch access to the target subdomain, GitHub, and the OWID/Voteview/etc. URLs. Round 2 didn't, so most of round 2's findings were about prose and bibliographic citation — items the agent could verify against textbook-level sources. Round 3 is where the live-data, live-prose, live-JS verification happens.

Three calibration shifts in the prompt:

1. **Tells the agent what's been corrected so it doesn't waste cycles re-flagging fixed items.** Both prior reports are linked by commit; round 3 can read them if useful.
2. **Names the specific bug-class round 3 should be hunting.** Round 3 already inherits round 2's findings as priors; the new value is in adversarial reading of the actually-deployed surface.
3. **Includes a hard halt instruction.** If the agent's fetcher refuses the subdomain (as round 2's did), it should stop and say so as the first sentence rather than producing prior-knowledge guesses.

When round 3 returns, paste the report and we'll fold the verdicts into a Phase 8 commit (or close out the audit if round 3 finds nothing new).
