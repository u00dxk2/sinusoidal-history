# Round-5 fact-check prompt (self-contained)

**Scope:** everything that shipped *after* round 4 (2026-04-26) and has never been through an external adversarial pass — Schlesinger Jr. (Phase 10), Modelski and Turchin fathers-and-sons (Phase 14, 2026-08-18), the Perez re-anchor and its new HATCH pairing, the two new data series (Stimson Policy Mood, Leading Economy's GDP share), the hand-written "considered and excluded" list, and the spectral-verdict lay text for those pairings.

**How to run (David):** paste everything between `## Begin prompt` and `## End prompt` into a deep-research agent. Run it in **both** Claude and OpenAI — the 8/18 census showed the two engines catch different things (one misattributed the Namenwirth/Weber critiques; the other caught it). Drop the resulting report(s) in Downloads as usual; verdicts get folded in one commit with the cos-math audit and the mirror sync.

**Already known, do not need re-finding** (queued for the fold-in commit): the per-cycle page footer says "compare it with the other seven on one axis" (stale — should be nine); the `/about` disclaimer paragraph opens "All ten cycles are contested" but names neither Modelski nor Turchin fathers-and-sons; the Khaldun anchor sentence says "European-and-American axis" in one paragraph and "modern US and global record" in another.

---

## Begin prompt

You are a fact-checker for **Sinusoidal History** (https://sinusoidalhistory.com), a public data visualization that overlays **ten** historical long-wave theories on one shared time axis (1600–2050), nine of them paired with a real long-run empirical data series. Each cycle is a pure cosine, `cos(2π · (year − reference_peak_year) / period_years)`, built from the theory's stated period and one documented reference peak. The audience includes historians, economists, political scientists, and writers; the project's credibility depends on getting facts, citations, and methodology right, and on saying honestly where the project's construction departs from the theorist's own claim.

Four prior fact-check rounds (April 2026) covered the original seven cycles — Khaldun, Kondratiev, Huntington, Perez, Turchin (secular), Dalio, Strauss-Howe — and their paired series, methods page, and licenses. They caught ~25 issues, including two compounding pipeline bugs, an inverted license verdict, a column mismatch in a derived series, and a claim that a year was a "trough" when the arithmetic put it on the rising arm. Those cycles are **out of scope** here except where a new claim touches them.

**This round is scoped to what has never been externally checked:**

1. **Schlesinger Jr.** — liberal/conservative cycle (30y, peak 1970), paired with Stimson's Policy Mood.
2. **Modelski** — long cycle of world leadership (110y, peak 1945), paired with a Maddison-derived "leading economy's share of world GDP" series.
3. **Turchin — fathers-and-sons** cycle (50y, peak 1970), unpaired.
4. **Perez** — the anchor was *re-described* (2000 now framed as the "financial-frenzy peak" ending Installation) and a new paired series was added: a technology-diffusion composite derived from the HATCH 2.0 dataset.
5. The **"Considered and excluded"** list on `/cycles` — hand-written exclusion reasons with page-cited quotes (Goldstein, Arrighi, Sornette, Namenwirth/Weber, Forrester, Berry) and a "queued" Klingberg note.
6. The **spectral-verdict** lay text for the three new pairings (arithmetic and wording only; the statistical protocol itself was designed from a separate research pass).

You do not need fetch access to the project's domain or repo — everything you need from the project is inline below. You *should* fetch upstream primary sources wherever you can: Modelski's *Long Cycles in World Politics* (Springer/Macmillan 1987), Modelski's EOLSS chapter, Turchin's 2012 *Journal of Peace Research* paper, Schlesinger Jr.'s *Cycles of American History* and Schlesinger Sr.'s *Paths to the Present*, Stimson's UNC data page and his 2018 dyad-ratios paper, the HATCH Zenodo record and its *Nature Communications* companion, the Maddison Project Database 2023 release and Bolt & van Zanden 2024, Goldstein's *Long Cycles* (1988), Mohler 1987, Thome & Rahlf 1996, Klingberg 1952, and Perez 2002.

**Bias toward strict reading.** If a careful historian or economist could quote a sentence as wrong, mark it. Quoted page numbers, table numbers, and verbatim quotations are the highest-risk claims on this list: several were verified against scans by an AI agent, not a human with the book open. Treat every one as unverified until you have checked it yourself.

---

# PART A — THE CYCLE DEFINITIONS (canonical `cycles.json`, verbatim)

These fields render on `/about`, on each `/cycles/<slug>` page ("Peak calibration", "Caveat", source line), in the interactive chart's facet view, and via the public `/api/v1/cycles` endpoint. They are the load-bearing claims.

## schlesinger_jr

```json
{
 "id": "schlesinger_jr",
 "name": "Schlesinger Jr. — liberal/conservative cycle",
 "short_description": "~30-year alternation of American politics between 'public purpose' (liberal/reform) and 'private interest' (conservative/consolidation) eras, ~15 years each",
 "period_years": 30,
 "reference_peak_year": 1970,
 "reference_peak_rationale": "Midpoint of Schlesinger Jr.'s most recently completed liberal era (1962–1978 in his own dating). Schlesinger's ~30-year figure is the average of his recorded liberal-era midpoints (1910 Progressive, 1939 New Deal, 1970 60s/Great Society). The framework descends from Arthur Schlesinger Sr., whose Paths to the Present (1949) described alternating liberal and conservative phases averaging roughly 15–16 years each - implying a same-mood recurrence of about 30 years - which his son formalized as the ~30-year full cycle used here. Note: Schlesinger Jr. himself predicted a new liberal era around 1990; the strict 30-year-from-1970 model puts the next peak at 2000, which doesn't match his own forecast - a textbook selection effect.",
 "source": "Arthur M. Schlesinger Jr., The Cycles of American History (Houghton Mifflin, 1986), Ch. 2 'The Cycles of American Politics'; building on Arthur M. Schlesinger Sr., Paths to the Present (Macmillan, 1949)",
 "confidence_level": "narrative",
 "caveat": "US-only periodization; like Huntington and Strauss-Howe, this is interpretive history, not measurement. Schlesinger's own 1990 forecast for the next liberal turn does not align with the 30-year-from-1970 sinusoid - read the curve as a stylization of his stated period, not as Schlesinger's own prediction."
}
```

Specific things to check for Schlesinger:
- Does Schlesinger Jr. actually date the most recent liberal era as **1962–1978**? (Some readings of Ch. 2 give 1961–1978, or end it at 1980/Reagan.)
- Does he give liberal-era midpoints of **1910, 1939, 1970**, or is that the project's derivation from his era boundaries? The rationale says "his recorded liberal-era midpoints" — is that attribution accurate?
- Does *Paths to the Present* (1949) state phases "averaging roughly 15–16 years"? (Schlesinger Sr.'s well-known figure is 16.55 years for the full sequence; check what the text actually says and whether "15–16" is a fair gloss.)
- Is Ch. 2 of *The Cycles of American History* titled "The Cycles of American Politics"? Is the imprint Houghton Mifflin, 1986? Was *Paths to the Present* published by Macmillan in 1949?
- Did Schlesinger Jr. predict a liberal turn "around 1990"? (The book's forecast language is usually quoted as the "1990s" or "late 1980s/early 1990s.")

## modelski

```json
{
 "id": "modelski",
 "name": "Modelski — long cycle of world leadership",
 "short_description": "~100–120 year long cycle of world leadership - global war → world power → delegitimation → deconcentration - tracked through naval and global-reach preponderance. Plotted here at 110 years, the midpoint of his stated range",
 "period_years": 110,
 "reference_peak_year": 1945,
 "reference_peak_rationale": "Start of the US world-power phase in Modelski's own dating: Table 2.1 of Long Cycles in World Politics (1987, p. 40) dates the American cycle's phases 1914–1945 (global war) and 1945–1973 (world power), and Table 2.2 (p. 42) dates US oceanic supremacy from 1944, when the US crossed his threshold of one-half of the world's capital-ship assets. The 110-year period is this project's midpoint of the '100 to 120 years' range Modelski states in his later encyclopedia treatment ('Long Cycles in Global Politics,' UNESCO-EOLSS); the 1987 book itself says 'about one century' and separately reports a 120-year average interval between successive naval-preponderance attainments. Modelski himself warns that the long cycle 'does not connote strict cycles' - treat the fixed sinusoid as a stylization he explicitly disclaims.",
 "source": "George Modelski, Long Cycles in World Politics (Macmillan, 1987); period range and non-strict-cycles disclaimer from Modelski, 'Long Cycles in Global Politics,' UNESCO-EOLSS",
 "confidence_level": "empirical-contested",
 "caveat": "The 110-year period is this project's midpoint of Modelski's 100–120-year range, and he states the concept 'does not connote strict cycles.' The paired series measures the largest economy - not his naval/global-reach construct - and under that mechanical rule the 1870s–1881 leader is Qing China, not Britain."
}
```

Specific things to check for Modelski:
- **Table 2.1, p. 40** and **Table 2.2, p. 42** — do those tables exist at those pages in the 1987 Macmillan edition, and do they say what is claimed (phases 1914–1945 global war / 1945–1973 world power; US oceanic supremacy from 1944; one-half of capital-ship assets as the threshold)? The book is on SpringerLink (DOI 10.1007/978-1-349-09151-5) — check the pagination there matches.
- The phase names: Modelski's four phases are usually given as **global war → world power → delegitimation → deconcentration**. Confirm the order and terms as used in the 1987 book (some summaries use "agenda-setting / coalitioning / macrodecision / execution" from his later learning-model framing).
- Does the 1987 book say "about one century"? Does it report a **120-year average interval** between naval-preponderance attainments (and between what dates)?
- Does the EOLSS chapter "Long Cycles in Global Politics" state the range as **"100 to 120 years"** and contain the phrase **"does not connote strict cycles"** (or close)? Is the chapter title exactly that?
- The `/cycles` page prose (Part C) says: "since about 1500 … Portugal, the Netherlands, Britain twice, the United States since 1945"; "a University of Washington political scientist"; "capital ships, and later global reach." Check each.
- Is "Macmillan, 1987" the right imprint (vs. Macmillan Press London / University of Washington Press Seattle, which co-published)?

## turchin_fathers_sons

```json
{
 "id": "turchin_fathers_sons",
 "name": "Turchin — fathers-and-sons cycle",
 "short_description": "~50-year 'bi-generation' oscillation in US political violence, superimposed on the longer secular cycle - spikes of unrest roughly every two generations, once living memory of the last convulsion fades",
 "period_years": 50,
 "reference_peak_year": 1970,
 "reference_peak_rationale": "Most recent stated peak, in Turchin's own words: 'a 50-year oscillation superimposed on the secular cycle, with peaks around 1870, 1920, and 1970' (Journal of Peace Research 49(4), 2012). With period 50 and peak 1970, this sinusoid's prior peaks land exactly on his other two stated peaks (1870 and 1920) and the next lands at 2020 - coinciding with the instability forecast of his separate 150-year secular cycle, so the two Turchin curves on this site deliberately peak together at 2020. The paper attributes the mechanism to the 'fathers-and-sons' dynamic and prefers the term 'bi-generation cycles,' with recurrence 'roughly two generations (40–60 years)'; 50 is the headline number and the one used here.",
 "source": "Peter Turchin, 'Dynamics of political instability in the United States, 1780–2010,' Journal of Peace Research 49(4) (2012): 577–591",
 "confidence_level": "quantitative",
 "caveat": "Same author as the 150-year secular cycle - a distinct construct from a distinct paper, not independent corroboration. No paired data series this round: the natural series (Turchin's US political-violence event data) has no cleanly redistributable file."
}
```

Specific things to check for Turchin fathers-and-sons:
- Is the quotation **"a 50-year oscillation superimposed on the secular cycle, with peaks around 1870, 1920, and 1970"** verbatim from the JPR 2012 paper (abstract or body)? If the exact wording differs, supply the exact wording.
- Does the paper use the term **"bi-generation cycles"** and the phrase **"roughly two generations (40–60 years)"**? Does it attribute the mechanism to a "fathers-and-sons" dynamic (that term is from Turchin's *Historical Dynamics* / *Secular Cycles*; check whether the 2012 paper itself uses it)?
- Citation: *Journal of Peace Research* 49(4), 2012, pp. **577–591**, DOI 10.1177/0022343312442078 — correct?
- The rationale says the 150-year secular cycle "forecasts" instability at 2020 and the two curves "deliberately peak together at 2020." The site's secular-cycle anchor is 2020 (from Turchin's *Nature* 2010 forecast of a 2020 peak). Is it accurate to describe the 2012 paper's 50-year cycle as predicting a 2020 spike, or is that the project's extrapolation? The `/cycles` prose says "when this curve and his secular cycle both peak at 2020 on our chart, that's construction, not corroboration" — is that hedge sufficient given the rationale's wording?
- "Quantitative" confidence label: defensible for a three-peak claim? (Compare: the site labels Kondratiev and Perez "empirical-contested" and Schlesinger "narrative".)
- The caveat says the violence-event data "has no cleanly redistributable file." Turchin's US Political Violence Database (USPV) has been released in various forms (e.g., with *Ages of Discord*, and on his site/Seshat). Is the "no redistributable file" claim still true in 2026? If a licensed file exists, say where.

## perez (re-anchored prose; the cycle itself was checked in rounds 1–4)

```json
{
 "id": "perez",
 "name": "Carlota Perez — techno-economic paradigm",
 "short_description": "~50–60 year wave in how each technological revolution is absorbed: installation (finance chases the new technology into a bubble) → turning point (the crash) → deployment (the technology actually spreads - the golden age)",
 "period_years": 55,
 "reference_peak_year": 2000,
 "reference_peak_rationale": "Anchored to Perez's 'Turning Point' (2000–2001), the dot-com crash she identifies as the inflection between Installation and Deployment phases of the ICT surge. Her own term is 'turning point,' not peak; we map it to the sinusoid's peak as a mathematical convenience. Read 2000 as the financial-frenzy peak that ends the Installation phase, not a claimed 'paradigm peak' - Perez's later work treats the Turning Point as a potentially multi-year interval and discusses the 2000 and 2008 crises together.",
 "source": "Carlota Perez, Technological Revolutions and Financial Capital (Edward Elgar, 2002)",
 "confidence_level": "empirical-contested"
}
```

Specific things to check for Perez:
- Does Perez's later work (e.g., her 2009 *Cambridge Journal of Economics* paper "The double bubble at the turn of the century," or her 2010s essays) actually treat the Turning Point as a multi-year interval spanning **2000 and 2008**? Cite where.
- The `/cycles` prose (Part C) says "Each technological revolution since 1771 - canals, railways, steel, mass production, computing." Perez's five revolutions are the Industrial Revolution (1771, Britain — mechanised cotton, water power, canals), Steam & Railways (1829), Steel/Electricity/Heavy Engineering (1875), Oil/Automobile/Mass Production (1908), ICT (1971). Is "canals" a fair one-word label for the first? Is the list otherwise accurate?
- "Financial-frenzy peak" — is "frenzy" Perez's term for the late-Installation phase (she uses "Frenzy" as the second sub-phase of Installation)? Is it accurate to call 2000 the *end* of Installation?

---

# PART B — THE DATA SERIES (canonical `series.json` + provenance files, verbatim)

## stimson_policy_mood (paired with schlesinger_jr)

```json
{
 "id": "stimson_policy_mood",
 "name": "US Policy Mood (Stimson)",
 "short_description": "Stimson's Policy Mood index - composite measure of US public preference for liberal vs. conservative domestic policy, derived from ~150 survey items via the dyad-ratios algorithm; annual, 1952–2024",
 "source": "James A. Stimson, Policy Mood data series (UNC), via Public Opinion in America (Westview, 2nd ed., 1999) and ongoing updates",
 "source_url": "https://stimson.web.unc.edu/data/",
 "license": "freely shared by author; no explicit reuse license",
 "value_units": "index (higher = more liberal)",
 "association_note": "Direct empirical analogue to Schlesinger Jr.'s public-purpose vs. private-interest alternation. Stimson constructed the index in part to test exactly this kind of long-wave claim about American political mood; coverage starts 1952."
}
```

### `public/data/stimson_policy_mood.source.md` (verbatim)

> **Retrieved:** 2026-04-26
> **Source URL:** https://stimson.web.unc.edu/wp-content/uploads/sites/9919/2025/07/Mood5224.xlsx
> **Upstream landing page:** https://stimson.web.unc.edu/data/
> **Primary citation:** James A. Stimson, *Public Opinion in America: Moods, Cycles, and Swings* (Westview, 2nd ed., 1999); ongoing data updates posted by Stimson at the URL above. Methodology paper: Stimson, "The Dyad Ratios Algorithm for Estimating Latent Public Opinion: Estimation, Testing, and Comparison to Other Approaches," *Bulletin de Méthodologie Sociologique / Bulletin of Sociological Methodology* 137–138(1), 2018, 201–218. DOI 10.1177/0759106318761614. (An earlier version of this file miscited the title and venue.)
> **License:** Freely shared by the author on a personal academic site; no explicit reuse license. We treat it as freely available for non-commercial scholarly redistribution under fair use, with attribution.
>
> **Columns:** `year` (1952–2024); `mood` — Stimson's annual Policy Mood index. Higher = more liberal public preference for US domestic policy. 50 is the scale's neutral reference point, not this file's average (the committed 1952–2024 series has mean ≈ 63.1); observed range 53.9–72.8.
>
> **What was filtered:** Upstream `Mood5224.xlsx` packs three series into one wide sheet (annual columns A–B; biennial columns D–F; quarterly columns H–J). We extract only the leftmost two columns (annual Year + Mood). Values preserved at the source's three decimal places.
>
> **Why this series pairs with Schlesinger Jr.:** Schlesinger Jr.'s cycle is a claim about ~30-year alternation in American public preference between liberal "public purpose" and conservative "private interest" eras. Stimson's Policy Mood is, by construction, a measure of exactly that — a latent index of US public preference for liberal vs. conservative policy estimated from ~150 survey items via the dyad-ratios algorithm. Stimson himself has used the series to test long-wave claims about American political mood. The pairing is closer to a direct measurement than most pairings on this site.
>
> **Caveats:**
> - **Coverage starts at 1952.** Schlesinger's cycle reaches back to the early 19th century; inside the empirical window the site's construction (period 30, peak 1970) plots troughs at 1955, 1985, and 2015 and peaks at 1970 and 2000. (An earlier version of this file called the late 1970s a trough; at period 30 / peak 1970 the cosine at 1978 is ≈ −0.10, mid-fall — the trough is 1985.)
> - **Annual frequency** masks within-year shifts that survey-week-level policy-mood work would catch.
> - **The construction is contested.** Stimson's dyad-ratios algorithm has critics; the choice of which survey items count as "domestic-policy mood" is itself a modeling decision.
> - **Schlesinger's own mid-1980s forecast** of a coming liberal era around 1990 is partly visible in the data (mood ticks up through the early 1990s) but the trough is shallower and later than his ~30-year-from-1970 model would predict — exactly the kind of mismatch the calibration drawer is designed to surface.

### Facts from the committed CSV (73 rows, 1952–2024)

| year | mood | | year | mood |
|---|---|---|---|---|
| 1952 | 54.606 | | 1985 | 62.877 |
| 1955 | 68.556 | | 1990 | 68.574 |
| 1961 | **72.777 (max)** | | 2000 | 64.823 |
| 1970 | 66.420 | | 2015 | 56.618 |
| 1978 | 57.610 | | 2024 | 64.259 |
| 1980 | **53.898 (min)** | | mean | 63.06 |

Specific things to check for Stimson:
- Is "50 is the scale's neutral reference point" correct? (Mood is scaled so that 50 is the midpoint of the percent-liberal metric; confirm from Stimson's documentation.)
- "~150 survey items" — Stimson's current documentation gives a count; is ~150 right for the 2025 vintage?
- The dyad-ratios methodology citation (BMS 137–138(1), 2018, 201–218, DOI 10.1177/0759106318761614) — correct in every particular?
- Is *Public Opinion in America: Moods, Cycles, and Swings* 2nd ed. Westview 1999 the right edition/imprint? (1st ed. 1991.)
- **"Stimson himself has used the series to test long-wave claims about American political mood"** — is that true? Where? If the claim rests on his 1991/1999 book's "cycles" discussion, is "long-wave" a fair characterization of what he tested?
- **The last caveat bullet contradicts the inlined data.** The model's trough is 1985; the data's minimum is **1980** (53.9), which is *earlier* than 1985, not later, and 1985's value (62.9) is near the series mean. Determine whether "shallower and later" is wrong, and propose a replacement sentence that matches the numbers above. Also check whether the "mood ticks up through the early 1990s" reading is right (1990 = 68.6 is among the higher values).
- Is a newer vintage than `Mood5224.xlsx` (July 2025) posted on the UNC page as of your read? (The project probed the 2026/06–08 URL pattern for `Mood5225.xlsx` on 2026-08-24 and got 404s.)

## leading_power_gdp_share (paired with modelski)

```json
{
 "id": "leading_power_gdp_share",
 "name": "Leading Economy's Share of World GDP",
 "short_description": "The largest single economy's share of world GDP each year, with the leader named per year (Maddison Project Database 2023, 2011 PPP $); trimmed to 1870+. The rule - largest economy - is mechanical, fixed without reference to Modelski's leadership succession",
 "source": "Maddison Project Database 2023 (Bolt & van Zanden, 2024, J. Econ. Surveys, DOI 10.1111/joes.12618)",
 "source_url": "https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023",
 "license": "CC BY 4.0",
 "value_units": "% of world GDP",
 "association_note": "Relative economic preponderance of the leading state as a proxy for world leadership. Deliberately mechanical - the largest economy per year, never hand-picking Modelski's hegemons - so its divergences show: under Maddison PPP the 1870–1881 leader is Qing China (not Britain, Modelski's naval leader) and China leads again from 2014. The series' all-time maximum, 31.6% in 1945, coincides with the reference peak."
}
```

### `public/data/leading_power_gdp_share.source.md` (verbatim, lightly condensed)

> **Retrieved:** 2026-08-18. **Source URL:** https://ourworldindata.org/grapher/gdp-maddison-project-database.csv (OWID mirror of MPD 2023). **Primary citation:** Bolt & van Zanden (2024), *Maddison-style estimates of the evolution of the world economy: A new 2023 update*, J. Econ. Surveys, DOI 10.1111/joes.12618. **Coverage:** 1870–2022. **License:** CC BY 4.0.
>
> **Pipeline** (`scripts/build_leading_power_gdp_share.py`): download OWID mirror → exclude `(Maddison)`-suffixed regional aggregates and `World` → resolve historical/successor overlap (USSR, Czechoslovakia, Yugoslavia, Sudan-former: where both coexist, keep successors) → forward-fill each entity's GDP between sparse benchmarks → `leading_power_gdp_share_pct = max(country GDP) / sum(filled country GDPs) × 100`, recording which country held the max → trim to 1870+. **The "leading power" is defined mechanically as the largest single economy — NOT Modelski's hand-picked hegemon succession.**
>
> **Why this pairs with Modelski:** Modelski's long cycle (period stated as 100–120 years; we plot 110) is about a single world power's preponderance — Portugal, the Netherlands, Britain (twice), then the United States, with the US cycle's ascent consolidated in 1945. Relative economic size is the most data-tractable proxy: Modelski and Thompson's own seapower concentration indices are not available as a maintained public dataset, while Maddison GDP is. The series' all-time maximum is **31.577% in 1945** — the same year as the reference peak — and both structural minima sit at leadership crossovers (15.941% in 1881, at the China→US handoff; 16.092% in 2013, just before the US→China handoff).
>
> **Leading-power timeline the data shows: China 1870–1881, United States 1882–2013, China 2014–2022.**
>
> **Caveats:** Largest economy ≠ world leader in Modelski's sense — for 1870–1881 the leader is Qing China while Modelski's leader was Britain, which **never appears** in the `leading_power` column. The pre-1950 denominator bias applies in full (many non-Western countries enter Maddison only at 1950; the denominator is too small before ~1950, overstating early shares). PPP-basis drives the modern crossover: China passes the US in 2014 on 2011 PPP; at market rates the US remains larger through 2022. Pre-1900 Maddison estimates are reconstructions; the 1870s China estimates are among the most uncertain. Present-day borders projected back. The 1882 crossover year is a forward-fill artifact and should not be quoted as a historical finding.

### Facts from the committed CSV (153 rows, 1870–2022)

| year | share % | leader |
|---|---|---|
| 1870 | 18.479 | China |
| 1881 | 15.941 | China |
| 1882 | 16.075 | United States |
| 1945 | **31.577** | United States |
| 2013 | 16.092 | United States |
| 2014 | 16.490 | China |
| 2022 | 20.663 | China |

Runs: China 12 years (1870–1881), United States 132 years (1882–2013), China 9 years (2014–2022). Britain/UK never leads.

Specific things to check for this series:
- Does MPD 2023 use **2011 international (PPP) dollars**? (It does in the 2020 release; confirm 2023 didn't change base year.)
- In MPD 2023, is China's GDP actually larger than the US's for **1870–1881**? Maddison's China benchmarks are sparse (1870, 1890, 1900, 1913…). Check whether the crossover is plausible given the raw benchmarks, and whether the UK (with or without its empire) is genuinely never the largest single economy in the 1870s on MPD 2023 numbers.
- In MPD 2023, does China pass the US in **2014**? (Different MPD vintages and IMF PPP series put the crossover between 2013 and 2017.)
- **Modelski and Thompson's seapower data**: *Seapower in Global Politics, 1494–1993* (1988) published capital-ship counts. Is "not available as a maintained public dataset" accurate, or has it been digitized (e.g., via the Correlates of War project, Thompson's site, or the "Global Powers" datasets)?
- "Portugal, the Netherlands, Britain (twice), then the United States" — is that Modelski's sequence exactly (some presentations list Britain I 1714–, Britain II 1815–)?
- Is a series that measures the *largest economy* a defensible pairing for a theory whose construct is *naval/global-reach preponderance*, given the site's own rule that pairings should measure the theorist's construct? The provenance is candid about the mismatch; your job is to say whether the candor is sufficient or whether the pairing should be labeled more strongly as a proxy-of-a-correlate.

## perez_tech_diffusion (paired with perez)

```json
{
 "id": "perez_tech_diffusion",
 "name": "US Technology-Diffusion Intensity (HATCH)",
 "short_description": "Median, across ~105 US technology series, of within-technology z-scored 5-year log-changes in adoption (HATCH 2.0); annual 1865–2023, with the contributing-technology count published per year",
 "source": "HATCH - Extended Historical Adoption of Technology Dataset 2.0 (Greene & Nemet, U. Wisconsin–Madison), Zenodo, DOI 10.5281/zenodo.19579793",
 "source_url": "https://zenodo.org/records/19579793",
 "license": "CC BY 4.0",
 "value_units": "z-score (median)",
 "association_note": "Perez's construct is economy-wide diffusion and deployment of a techno-economic paradigm - not asset prices - so a diffusion-intensity composite is the closest measurable analogue. The transform was fixed without reference to her dates, and the honest result is visible on the chart: the composite shows no local peak at 2000 (it is strongest in the railroad/telegraph decades and persistently negative after the 1970s, partly a panel-composition artifact - see provenance)."
}
```

### `public/data/perez_tech_diffusion.source.md` (verbatim, lightly condensed)

> **Retrieved:** 2026-08-18. **Source URL:** https://zenodo.org/records/19579793 (file `HATCH_national_1.5.csv`, MD5 `3f16f6cb1c947369fbbe2a2b48a986c5`). **DOI:** 10.5281/zenodo.19579793 (version 2.0, published 2026-04-14; concept DOI 10.5281/zenodo.19579792). **Primary citation:** Greene, Jenna and Gregory Nemet (University of Wisconsin–Madison). *Extended Historical Adoption of Technology Dataset 2.0.* Zenodo. Companion dataset to "Drivers of technology diffusion speed in countries," *Nature Communications*, DOI 10.1038/s41467-026-73563-6. HATCH is the successor/kin of the NBER CHAT dataset (Comin & Hobijn). **Coverage:** 1865–2023. **License:** CC BY 4.0.
>
> **Pipeline** (`scripts/build_perez_tech_diffusion.py`): (1) download and MD5-verify; (2) keep US rows only — 121 technology series; (3) drop non-positive values (zeros are pre-commercialization padding); (4) per technology, compute rolling 5-year log-changes Δ_t = ln(x_t) − ln(x_{t−5}) only where both endpoints are observed — no interpolation; (5) z-score the Δs within each technology (sample mean/std over that technology's full Δ history); exclude technologies with < 10 usable Δs or zero variance (16 of 121 excluded; 105 contribute); (6) aggregate per year by **median** across technologies, record N_t, keep years with N_t ≥ 3.
>
> **Anti-overfit provision:** every transform choice was fixed from first principles before the output was looked at; none references Perez's dates.
>
> **What the series shows:** strongly positive in the railroad/telegraph decades (1860s–1880s, decade means +0.6 to +1.2), moderately positive through electrification (1900s–1910s, ≈ +0.35), near zero mid-century, persistently negative from the 1970s (≈ −0.25 to −0.45), **no local peak at 2000**.
>
> **Caveats:** thin early years (1865–1903: N_t = 3–8; ≥ 20 only from 1905, ≥ 50 from 1966); thin final years (2022: 11; 2023: 3); panel-aging/maturity drift (within-series z-scoring puts mature technologies below their own mean late in life; the post-1970 drift is partly composition); technology-selection bias (winners only); metric heterogeneity (stocks, flows, bounded shares mixed); overlapping windows (strong autocorrelation by construction); z-scoring assumes within-series stationarity; source-rotation discontinuities (N_t steps at 1905, 1966).

### Facts from the committed CSV (159 rows, 1865–2023) — decade means and N_t range

| decade | mean | N_t | decade | mean | N_t |
|---|---|---|---|---|---|
| 1860s | +0.712 | 3 | 1940s | +0.127 | 33–41 |
| 1870s | +1.186 | 3–5 | 1950s | +0.129 | 42–47 |
| 1880s | +0.596 | 5–6 | 1960s | −0.063 | 44–53 |
| 1890s | +0.220 | 7–8 | 1970s | −0.254 | 59–66 |
| 1900s | +0.396 | 8–30 | 1980s | −0.455 | 61–65 |
| 1910s | +0.341 | 26–30 | 1990s | −0.308 | 64–70 |
| 1920s | +0.098 | 27–32 | 2000s | −0.304 | 59–70 |
| 1930s | −0.094 | 32–34 | 2010s | −0.259 | 54–66 |
| | | | 2020–23 | −0.603 | 3–45 |

Around the anchor: 1998 −0.23 (N 69), 1999 −0.26, 2000 −0.30 (66), 2001 −0.35, 2002 −0.50.

Specific things to check for HATCH:
- Zenodo record 19579793: is it HATCH **2.0**, published **2026-04-14**, by **Greene & Nemet**, licensed **CC BY 4.0**, and does its file list include `HATCH_national_1.5.csv`? (The "1.5" in the filename vs "2.0" version is odd — is the file naming right?)
- Is the *Nature Communications* companion paper's title "Drivers of technology diffusion speed in countries" and DOI **10.1038/s41467-026-73563-6**? (If the DOI resolves to a different paper, say what.)
- Is HATCH accurately described as the "successor/kin of the NBER CHAT dataset (Comin & Hobijn)"?
- Does the US subset contain **121** technology series, with China (70) the runner-up?
- **Methodology critique** (the highest-value item here). The composite is the *median across technologies of within-technology z-scored 5-year log-changes*. Evaluate: (a) whether a z-score whose mean and std are computed over a technology's *entire* history is a defensible normalizer for an S-curve process (it guarantees the late-life values of every successful technology sit below zero, so the composite's post-1970 negativity may be almost entirely construction); (b) whether the median of z-scores across a panel whose composition changes is interpretable across the 1905 and 1966 N_t steps; (c) whether the 1860s–1880s values, on 3–6 series, should be displayed at all; (d) whether any of this is a fair proxy for Perez's "diffusion of a techno-economic paradigm," or whether it measures something closer to "average S-curve age of the measured panel." The provenance already concedes much of this; say whether the concessions are adequate and whether the series should carry a stronger warning or be dropped.
- "The transform was fixed without reference to her dates" — this is an unfalsifiable process claim. Suggest wording that does not ask the reader to take it on trust.

---

# PART C — THE `/cycles` INDEX PAGE PROSE (hand-written, verbatim)

## "The longer story" expanders (only the four in scope)

**Schlesinger Jr.:** "Two Schlesingers, one idea. Arthur Sr., a Harvard historian, noticed American politics alternating between liberal and conservative moods in phases of about fifteen years. His son formalized it in The Cycles of American History (1986): eras of 'public purpose' alternate with eras of 'private interest,' each exhausting itself and breeding its opposite, a full round trip about every thirty years. The wrinkle we keep on the record: Schlesinger Jr. predicted a liberal turn around 1990, while a strict thirty-year clock started at his 1970 midpoint says 2000. His own forecast and his own period disagree - which tells you how much play these numbers have in them." — Defined in: *The Cycles of American History* (Houghton Mifflin, 1986), link https://archive.org/details/cyclesofamerican0000schl

**Perez:** "Carlota Perez's Technological Revolutions and Financial Capital (2002) is the optimistic entry on this roster. Each technological revolution since 1771 - canals, railways, steel, mass production, computing - arrives the same way: an installation phase in which finance chases the new technology into a bubble, a crash at the turning point, then a deployment phase in which the technology finally spreads through the whole economy and the good years arrive. She dates the ICT turning point to the dot-com crash of 2000-2001. Two honesty notes from our side: her 'turning point' is not a peak (we map it to one for the math), and our paired diffusion series shows no local peak at 2000 at all." — Defined in: *Technological Revolutions and Financial Capital* (Edward Elgar, 2002)

**Modelski:** "George Modelski, a University of Washington political scientist, argued in Long Cycles in World Politics (1987) that since about 1500 world leadership has turned over in century-long cycles, each opened by a bout of global war and each led by the state that commands the oceans: Portugal, the Netherlands, Britain twice, the United States since 1945. Leadership, in his ledger, is countable - capital ships, and later global reach. He also warned that the long cycle 'does not connote strict cycles,' so our fixed 110-year sinusoid is a stylization he explicitly disclaimed. The paired data adds its own friction: measured by GDP share alone, the 1870s leader is Qing China, not Britain." — Defined in: *Long Cycles in World Politics* (Macmillan, 1987), link https://doi.org/10.1007/978-1-349-09151-5

**Turchin fathers-and-sons:** "Same author as the 150-year secular cycle, a different construct, and the plainest empirical claim on the roster: Turchin's 2012 Journal of Peace Research paper reports US political violence spiking about every fifty years, with peaks around 1870, 1920, and 1970. The proposed mechanism is generational memory - the people who lived through one convulsion won't start another, and their grandchildren, who didn't, will. The missing piece above is deliberate: no paired data series, because his violence-event data has no cleanly redistributable file. And when this curve and his secular cycle both peak at 2020 on our chart, that's construction, not corroboration." — Defined in: 'Dynamics of political instability in the United States, 1780–2010,' *Journal of Peace Research* 49(4), 2012, link https://doi.org/10.1177/0022343312442078

## "Considered and excluded" (verbatim)

Intro: "A theory enters the roster only with an explicit period in years from the theorist's primary text, a defensible anchor peak, and a citable source. These famous candidates fail that bar - and the reasons are as instructive as the roster itself."

- **Goldstein - war/hegemony waves (~50y)** — "Goldstein himself forecloses the sinusoid: 'The efforts to identify war cycles based on fixed periodicities are a self-proclaimed dead-end' (Long Cycles: Prosperity and War in the Modern Age, 1988, p. 111; similarly p. 99), and he calls fixed-periodicity methodology 'inappropriate for social cycles' (p. 244). He affirms non-periodic long waves in war - which is exactly what a fixed cosine cannot represent. His own data files also carry no explicit reuse license."
- **Arrighi - systemic cycles of accumulation** — "No fixed period by design: his cycles overlap and shorten over time (Genoese → Dutch → British → American), so no single period_years exists to plot."
- **Sornette - log-periodic power laws** — "Log-periodic means the oscillation interval shrinks toward a critical time; there is no constant year-period, so a fixed sinusoid misstates the mathematics."
- **Toynbee, Spengler, Vico, Sorokin, Quigley, Tainter** — "Civilizational rise-and-fall narratives without a theorist-stated period in years. The bar requires their number, not one imposed on them."
- **Namenwirth/Weber - cultural value cycles** — "The claimed ~152-year cycle was fitted on roughly 120 years of data - it never once repeated inside its own evidence - and the shorter cycle is a median of fits ranging widely. Replication failed on German data (Mohler 1987, Eur. J. Political Research 15) and the extraction method was shown to manufacture cycles from the filtering itself (Thome & Rahlf, 'Dubious cycles,' Quality & Quantity 30(4), 1996). No machine-readable series exists."
- **Forrester - System Dynamics long wave** — "A simulation model reproducing Kondratieff-like waves, not an independent historical periodization with its own anchor; cross-referenced under Kondratiev instead."
- **Berry - long-wave rhythms (~56y)** — "A US-dated restatement of the Kondratieff rather than an independent construct; folded into the Kondratiev entry's literature rather than plotted twice."

Queued note: "Klingberg's foreign-policy mood cycle (~48y: phases later scholarship reports as averaging ~21 introvert + ~27 extrovert years; Klingberg 1952, *World Politics* 4(2)) passes the theory bar, but no candidate paired series clears this site's redistribution-license requirement yet. It ships when its data does."

Specific things to check on the excluded list:
- **Goldstein 1988** (Yale UP): does p. 111 contain "self-proclaimed dead-end" about fixed-periodicity war cycles? Does p. 99 say something similar? Does p. 244 call the methodology "inappropriate for social cycles"? Is "he affirms non-periodic long waves in war" a fair summary of his position (his book argues for ~50-year war/price long waves that are *not* strictly periodic)? Does the "war/hegemony waves (~50y)" label conflate his 50-year war/price wave with his ~150-year hegemony cycle?
- **Namenwirth/Weber** (*Dynamics of Culture*, 1987): is the long cycle "~152 years"? Was it fit on "roughly 120 years" of data? Is the shorter cycle (~48–52y) fairly described as "a median of fits ranging widely"? Is **Mohler 1987, *European Journal of Political Research* 15** the right citation for the failed German replication (title? pages?), and is **Thome & Rahlf, "Dubious cycles," *Quality & Quantity* 30(4), 1996** correct (pages?)? Does Thome & Rahlf actually show the filtering manufactures cycles?
- **Klingberg 1952**, *World Politics* 4(2), "The Historical Alternation of Moods in American Foreign Policy": does he give ~21 introvert / ~27 extrovert averages, or is that later work (Holmes 1985, *The Mood/Interest Theory of American Foreign Policy*)? Is "~48y" the right full-cycle figure?
- **Sornette**: is "the oscillation interval shrinks toward a critical time" a correct one-sentence description of log-periodicity?
- **Arrighi**: is "overlap and shorten over time" accurate to *The Long Twentieth Century* (1994)?
- **Berry** (*Long-Wave Rhythms in Economic Development and Political Behavior*, 1991): is "~56y" his figure?
- The intro says the bar requires "an explicit period in years from the theorist's primary text." Check the ten *included* cycles against that bar: Khaldun (three generations ≈ 120y is an interpretation), Dalio (50–75y debt cycle; 250y empire arc), Modelski (100–120 range), Strauss-Howe (80–100y saeculum, plotted 84). Is the stated bar one the roster itself passes? If not, propose wording.

---

# PART D — `/about` DISCLAIMER PARAGRAPHS THAT TOUCH THE NEW CYCLES (verbatim)

> "A few specifics, since the choices matter. […] Perez identifies 2000–2001 as the 'Turning Point' between Installation and Deployment phases of the ICT surge; we map her Turning Point to our sinusoid's peak - that conflates her concept with our mathematical convention, and 2000 is best read as her financial-frenzy peak (her later work extends the Turning Point through 2008). Schlesinger Jr. dated his most recently completed liberal era as 1962–1978; we anchor at the midpoint (~1970), but Schlesinger himself predicted the next liberal turn around 1990, which a strict 30-year-from-1970 sinusoid does not reproduce - read his curve as a stylization of his stated period, not as his own forecast."

> "All ten cycles are contested in different ways. […] Schlesinger Jr.'s liberal/conservative cycle is interpretive periodization formalizing his father's ~15–16-year alternating phases into a ~30-year full cycle; the empirical pairing (Stimson Policy Mood) only covers 1952 onward, so the Schlesinger curve's pre-1952 shape cannot be stress-tested against the data. Two cycles (Schlesinger Jr. and Strauss-Howe) carry an inline caveat surfaced in the focused-facet view; treat both especially skeptically."

(Known gap, already queued: this paragraph names neither Modelski nor Turchin fathers-and-sons. You may propose the missing sentences; you do not need to flag the omission.)

**Methods page, "Notes on individual pairings"** (verbatim, new entries only):

> "**Perez pairs with technology diffusion, not asset prices.** Through Phase 13 Perez had no paired series; the HATCH diffusion-intensity composite closed that gap in Phase 14. Shiller's CAPE was the runner-up candidate - Perez's frenzy/turning-point mechanism is financial, and the 2000 anchor is exactly a valuation peak - but CAPE carries no explicit reuse license and measures paper values, not the economy-wide diffusion that is Perez's actual object. We cite CAPE here as anchor validation without redistributing it."

> "**No paired series for Turchin's fathers-and-sons cycle.** The natural series - Turchin's US political-violence event data - has no cleanly redistributable file. The cycle ships unpaired rather than paired to a construct-mismatched proxy."

> "**Stimson Policy Mood with Schlesinger Jr.** Of the ten cycles, Schlesinger's pairing is the closest the site gets to a direct measurement: Stimson's index is, by construction, an estimate of US public preference for liberal vs. conservative domestic policy - exactly what Schlesinger's cycle claims to track. The catch is coverage: the series only starts in 1952. Inside the empirical window this construction (period 30, peak 1970) plots troughs at 1955, 1985, and 2015 and peaks at 1970 and 2000 - two full swings. The pre-1952 shape of the Schlesinger curve cannot be stress-tested against the paired data; treat the calibration drawer's Pearson r accordingly."

Check: is Shiller's CAPE data genuinely without an explicit reuse license (Shiller's Yale page)? Is "the 2000 anchor is exactly a valuation peak" right — CAPE's all-time high was December 1999 / early 2000 at ~44?

---

# PART E — SPECTRAL VERDICT LAY TEXT FOR THE NEW PAIRINGS (verbatim from `verdicts.json`)

The methods page describes the protocol: harmonic regression at the exact stated period vs. trend + AR(1) (re-checked AR(2)) red-noise null, parametric bootstrap with 99,999 draws, Holm-corrected, gated on the record covering ≥ 3.0 full periods; four verdict states (INSUFFICIENT_DATA, NO_SIGNIFICANT_TARGET_POWER, MODEL_SENSITIVE, SIGNIFICANT_TARGET_POWER). Every one of the nine primary pairings reads INSUFFICIENT_DATA.

- **schlesinger_jr × stimson_policy_mood**: span 72 years, 2.4 periods of 30 → INSUFFICIENT_DATA. Lay text: "The US Policy Mood (Stimson) record spans 72 years — 2.4 of the 3.0 full periods this site requires before testing a 30-year claim. No test was run and no p-value exists: the honest verdict is that the record is too short to test the claim at all."
- **perez × perez_tech_diffusion**: span 158 years, 2.87 periods of 55 → INSUFFICIENT_DATA. Lay text: "…spans 158 years — 2.9 of the 3.0 full periods this site requires before testing a 55-year claim…"
- **modelski × leading_power_gdp_share**: span 152 years, 1.38 periods of 110 → INSUFFICIENT_DATA. Lay text: "…spans 152 years — 1.4 of the 3.0 full periods…"

A secondary "cross-grid" panel re-pairs each period with every series long enough to clear the gate; all 19 cells read NO_SIGNIFICANT_TARGET_POWER. Examples: 30y vs V-Dem p = 0.094 (AR1) / 0.185 (AR2); 30y vs WID-1913+ p = 0.103 / 0.119; 50y vs US GDP share p = 0.137 / 0.304; 55y vs V-Dem p = 0.743.

Methods-page sentence to check: "A 54- and a 55-year period differ by 0.000337 cycles per year - separating them would take a ~3,000-year record." (1/54 − 1/55 = 0.000337 ✓; the Rayleigh resolution 1/N = 0.000337 gives N ≈ 2,970 years — is "~3,000-year record" the right way to state the resolution limit, or does it need a qualifier?)

Check the arithmetic in each lay text (span ÷ period) against the CSV spans (Stimson 1952–2024; HATCH 1865–2023; leading-power 1870–2022) and flag any wording that overstates what INSUFFICIENT_DATA means (it is an eligibility outcome, not evidence against the theory).

---

# PART F — COS-MATH TABLE (so you can check every year-phase claim)

The site's audit script evaluates `cos(2π · (year − peak) / period)` for every year named in rationale prose. Any prose that says where a cycle "sits" at a year must agree with this table.

| cycle | year | period | peak | phase frac | cos | label |
|---|---|---|---|---|---|---|
| schlesinger_jr | 1978 | 30 | 1970 | 0.267 | −0.105 | mid, falling |
| schlesinger_jr | 1990 | 30 | 1970 | 0.667 | −0.500 | rising from trough (trough = 1985) |
| schlesinger_jr | 2000 | 30 | 1970 | 0.000 | +1.000 | PEAK |
| perez | 2000 | 55 | 2000 | 0.000 | +1.000 | PEAK |
| perez | 2001 | 55 | 2000 | 0.018 | +0.993 | peak |
| perez | 2008 | 55 | 2000 | 0.145 | +0.611 | falling |
| modelski | 1914 | 110 | 1945 | 0.718 | −0.199 | rising, below zero |
| modelski | 1944 | 110 | 1945 | 0.991 | +0.998 | peak |
| modelski | 1945 | 110 | 1945 | 0.000 | +1.000 | PEAK |
| modelski | 1973 | 110 | 1945 | 0.255 | −0.029 | zero-crossing, falling |
| modelski | 1987 | 110 | 1945 | 0.382 | −0.737 | near trough (trough = 2000) |
| turchin_fathers_sons | 1870 / 1920 / 1970 / 2020 | 50 | 1970 | 0.000 | +1.000 | PEAK |
| turchin_fathers_sons | 2012 | 50 | 1970 | 0.840 | +0.536 | rising |

Note for Modelski: with period 110 and peak 1945, the construction's trough is **2000** and its prior peak **1835**. Modelski's own prior leadership peaks (Britain II's world-power phase from 1815; Britain I from 1714) do not land on 1835 or 1725. Is the site sufficiently clear that a 110-year cosine reproduces *none* of Modelski's earlier cycle dates? (The per-cycle page prints the construction's peak/trough years with the disclaimer "These are positions of this construction, not dates claimed by the theorist.")

---

# PART G — WHAT THE PER-CYCLE PAGE AND REUSE PACKET SAY (rendered text)

Each `/cycles/<slug>` page renders, in order: the name, period, reference peak, confidence classification; the `short_description`; a curve figure; "Peak calibration" (= `reference_peak_rationale`); "Caveat" (if any); the sentence "Every cycle on this site is a pure sinusoid built from the theory's stated period and one documented reference peak — a deliberately naïve construction, so that disagreement between theories rather than parameter fitting is what you see"; "Where this curve plots its extrema — Computed from period P and reference peak Y, across the site's default window (1600–2050). These are positions of *this construction*, not dates claimed by the theorist" with the peak and trough years listed; "Paired data series" with the series name, units, `short_description`, "Why this pairing" (= `association_note`), source, license, upstream link, CSV download, provenance link — or, if unpaired, "None in this version … The curve can still be overlaid against any of the other series in the interactive chart, but it has no dedicated empirical pairing to be stress-tested against"; "Spectral verdict" with the state label, "N of 3.0 required periods," the figure (SVG, with PNG export), the lay text, and "Pre-registered harmonic-regression test at the exact stated period against an AR(1) red-noise null (99,999 bootstrap draws), gated on the record covering at least 3.0 full periods"; then a copy-paste attribution block with the note **"Figures and code are MIT-licensed; the underlying data series carry their own upstream licenses, listed above. Reuse freely with attribution."**

Check: is "Figures and code are MIT-licensed" a coherent claim for a figure that *plots* a CC BY 4.0 (Maddison, HATCH) or "no explicit license" (Stimson) series? Does redistributing a PNG of the Stimson series under MIT with a fair-use rationale hold up? Propose wording if not.

---

# WHAT I AM ASKING YOU TO DO

Read everything above adversarially. Return a report with:

1. **Discoveries-not-listed** — most important. Anything wrong, imprecise, or methodologically suspect that the "specific things to check" lists did not anticipate. Look especially for: internal inconsistencies between `cycles.json` / `series.json` and the prose; page-number and table-number citations that do not match the primary text; verbatim quotations that are paraphrases; a theorist's claim conflated with the project's mapping; and any year-phase claim that disagrees with Part F.

2. **Verdicts on every "specific things to check" item** above, in order.

3. **Anything you can verify against upstream that flatly contradicts what's inline** (a newer Stimson vintage, a different HATCH file list, a different MPD 2023 crossover year, a Turchin USPV data release).

For each finding:
- **Verdict**: `correct` / `correct-with-caveat` / `imprecise` / `incorrect` / `unverifiable-from-public-sources`.
- **Evidence**: at least one primary source with URL (and page/table number where the claim is a page citation).
- **Proposed replacement**: the exact replacement string for the relevant field, sentence, or paragraph.

Rank findings by risk of public embarrassment if shipped. If, after a thorough read, a section is clean, say so explicitly — that is information too.

## End prompt

---

## Notes for David

- Two engines, same prompt. Where they disagree, the fold-in treats the disagreement itself as a finding to resolve against the primary text.
- Highest-risk items going in, in my estimation: the Modelski page/table citations (p. 40 / p. 42 / capital-ship threshold); the Goldstein page quotes (p. 99 / 111 / 244); the Stimson source.md "shallower and later" sentence (the inlined data says the minimum is 1980, *before* the 1985 model trough); and whether the HATCH z-score construction should ship at all as a Perez proxy.
- When the reports come back, the fold-in is one commit: `cycles.json` + `series.json` + the three `source.md` files + `/cycles` prose + `/about` & `/methods` + both `.md` mirrors + `llms.txt` if counts change, with `python scripts/audit_cycle_rationales.py` run before push. If any `period_years` or CSV changes, the spectral manifest re-freeze sequence in AGENTS.md applies — that is a bigger ship and would be flagged separately.
