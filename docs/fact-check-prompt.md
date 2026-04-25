# Fact-check prompt for /deep-research

Paste the section below into a deep-research agent. It is self-contained — the agent does not need access to the site or repo, only the structured list of factual claims.

---

## Begin prompt

You are a fact-checker for **Sinusoidal History** (https://sinusoidal-history.skylarkcreations.com), a public-facing data visualization that overlays seven historical cycle theories on one shared time axis, each paired with a real long-run empirical data series. The site is going to writers and economists who care about precision. We need to know if any factual claim, source citation, or coverage claim on the site is wrong.

For each item below, your job is:

1. **Verify the claim against primary or authoritative secondary sources.** Cite at least one source per verdict.
2. **Return a verdict:** `correct`, `correct-with-caveat`, `imprecise`, `incorrect`, or `unverifiable-from-public-sources`.
3. **For anything not `correct`, propose a specific replacement string** (period number, year, citation title, etc.) that would be defensible.
4. **Flag editorial overreach:** statements that put words in a theorist's mouth, or that conflate the project's interpretive choices with the original theorist's claims.

Bias toward the strictest reading. The artifact is meant to be screenshotted and shared, so an error is harder to walk back than a hedge.

---

## Section A: Cycle theories

### A1. Ibn Khaldun — dynastic / asabiyyah cycle

- **Claim:** Period of the asabiyyah cycle is **120 years**.
- **Claim:** Source is *Muqaddimah* (1377).
- **Claim:** Khaldun's framework describes a five-stage dynastic cycle (founding → prosperity → luxury → decline → collapse).
- **Claim:** The site anchors the project's sinusoid at **1789 (French Revolution)**, framed as "a late-stage collapse point anchored at the start of a new cycle."

Questions:
1. What is the standard scholarly range for the period of Khaldun's dynastic / asabiyyah cycle? Is 120 years inside that range, or is the consensus closer to 4 generations × ~40 years = ~160 years?
2. Is *Muqaddimah* dated 1377, 1377–1379, or 1382 in standard scholarship?
3. Is Khaldun's framework a five-stage cycle in his own writing, or is the five-stage version a later codification?
4. Is anchoring Khaldun's sinusoid to a European event (French Revolution) defensible in any reception literature, or is it a project-original interpretive choice that should be more explicitly flagged?

### A2. Nikolai Kondratiev — long economic waves

- **Claim:** Period is **54 years**.
- **Claim:** Source is *The Major Economic Cycles* (1925).
- **Claim:** Reference peak is **1973** (oil shock + end of Bretton Woods).
- **Claim:** Confidence level: "empirical-contested."

Questions:
1. What is the actual title and year of Kondratiev's foundational publication on long waves? Standard sources give: 1925 Russian article in *Voprosy Konyunktury*, 1926 German translation "Die langen Wellen der Konjunktur," 1928 expanded book version, 1935 English translation in *Review of Economics and Statistics*. Which is the right citation, and is "The Major Economic Cycles (1925)" accurate or a translation artifact?
2. Is 54 years inside the standard scholarly range for K-wave period?
3. Is 1973 the most commonly cited K-wave peak in the post-WWII cycle, or do other scholars locate the peak elsewhere (1971, 1974, etc.)?

### A3. Samuel Huntington — creedal passion cycle

- **Claim:** Period is **60 years**.
- **Claim:** Source is *American Politics: The Promise of Disharmony* (1981).
- **Claim:** Reference peak is **1965**, the civil-rights-era creedal-passion peak per Huntington.

Questions:
1. Confirm 1981 publication and Belknap/Harvard imprint.
2. In *American Politics*, did Huntington identify roughly 60-year cycles between four "creedal passion" periods (Revolution, Jacksonian, Progressive, S&S/civil rights), and is 1965 a defensible anchor for the fourth period's peak — or did Huntington locate the peak somewhere else in the 1960s?

### A4. Carlota Perez — techno-economic paradigm

- **Claim:** Period is **55 years**.
- **Claim:** Source is *Technological Revolutions and Financial Capital* (2002).
- **Claim:** Reference peak is **2000** ("Dot-com bubble peak, end of installation phase of the ICT paradigm per Perez (2002)").
- **Claim:** Confidence level: **"quantitative"** (highest tier in the project, alongside Turchin).

Questions:
1. Is 55 years inside Perez's stated period range for a great surge?
2. In her 2002 framework, is 2000 (dot-com bubble) the *peak* of the ICT surge, or the *turning point* between installation and deployment? If turning point, is anchoring the sinusoid's peak there mathematically defensible (peaks of installation phase tend to coincide with frenzy/bubble), or should the peak be located elsewhere (e.g., the synergy phase peak)?
3. **Critical:** Is "quantitative" an appropriate confidence tier for Perez's work, or should this be downgraded to "empirical" or "empirical-contested"? Perez's analysis is historical pattern-recognition; she does not fit statistical models in the way Turchin (cliodynamics) does. Reasonable comparators: how would you classify her methodological mode against Kondratiev (currently "empirical-contested") and Turchin (currently "quantitative")?

### A5. Peter Turchin — secular cycles

- **Claim:** Period is **150 years**.
- **Claim:** Sources are *Secular Cycles* (2009, with Nefedov), *Ages of Discord* (2016), *End Times* (2023).
- **Claim:** Reference peak is **2020**, anchored to Turchin's published forecast of US instability peaking in the 2020s.

Questions:
1. In Turchin/Nefedov *Secular Cycles*, what range do they give for the period of pre-modern European secular cycles? Is 150 years a representative central value, or is the range wider (e.g., ~100-300 years)?
2. Did Turchin in *Ages of Discord* (2016) or follow-on work specifically forecast 2020 as a peak instability year, or is the forecast worded as "the 2020s" without a specific year?
3. Confirm the three-book bibliography is correct (Princeton 2009, Beresta 2016, Penguin Press 2023).

### A6. Ray Dalio — Big Cycle

- **Claim:** Period is **85 years**.
- **Claim:** Source is *Principles for Dealing with the Changing World Order* (2021).
- **Claim:** Reference peak is **1945** ("Peak of US empire by Dalio's composite index, end of WWII consolidating reserve-currency dominance").

Questions:
1. In Dalio's 2021 book, what is the stated period range for the "long-term debt cycle" / "big cycle"? Is 85 years a defensible central value?
2. **Critical:** Where does Dalio's composite "empire score" graph place the peak of the US arc? Multiple visualizations in the book and his accompanying YouTube video appear to peak between 1944 and 1950, with the visual "peak" sometimes shown closer to 1950 than 1945. What year does Dalio explicitly call the peak? Is "1945" his own choice, an averaged interpretation, or the project's editorial pick?

### A7. Strauss & Howe — saeculum / Fourth Turning

- **Claim:** Period is **84 years**.
- **Claim:** Source is *The Fourth Turning* (1997).
- **Claim:** Reference peak is **2008** ("Onset of Strauss-Howe's predicted Fourth Turning, anchored to the 2008 financial crisis").

Questions:
1. In *The Fourth Turning* (1997), what range did Strauss & Howe give for the saeculum? Confirm 84y as a defensible central value.
2. **Critical:** In Strauss-Howe's framework, is the "Fourth Turning" event a peak or a trough of their cycle? The site treats 2008 as a "peak" of the sinusoid because the system anchors all cycles by reference peak year. But the Fourth Turning is conceptually a *crisis nadir*, not a high point — and 2008 is its *onset*, not its midpoint or climax. Is anchoring the project's sinusoid to 2008 a defensible mapping of Strauss-Howe's theory, and if so, how should the rationale be worded to avoid implying Strauss-Howe themselves identified 2008 as a peak? Or does the math actually require a trough year here?
3. Confirm 1997 publication, Broadway Books imprint.

---

## Section B: Data series

For each of the six data series below, verify the source citation, the URL, the license, and the temporal coverage. **Critical: open the URL and confirm the dataset still exists at that endpoint with that name.**

### B1. DW-NOMINATE party polarization
- Source: **Voteview / Lewis, Poole, Rosenthal et al.**
- URL: **https://voteview.com/articles/party_polarization**
- License: **public**
- Coverage: **46th–118th Congress** (i.e., 1879–2025)
- Used as the long-run roll-call proxy for Huntington's creedal-passion cycle.

Questions: Is "Lewis, Poole, Rosenthal et al." the correct attribution (with Jeff Lewis at UCLA hosting Voteview)? Is the URL stable? Does Voteview's own party-polarization article match the temporal coverage claimed?

### B2. Fernald TFP (5-yr rolling)
- Source: **Fernald (FRBSF), Quarterly TFP series**
- URL: **https://www.frbsf.org/research-and-insights/data-and-indicators/total-factor-productivity-tfp/**
- License: **public**
- Coverage: **1948–2025**, utilization-adjusted, 5-year centered rolling average.
- Used as the productivity proxy for Kondratiev waves.

Questions: Does the Fernald series start 1947Q2 or 1948Q1? Is the FRBSF URL stable? Is "5-year centered rolling" a documented Fernald presentation, or is it the project's own derived series (in which case the original quarterly series is 1947Q2+)?

### B3. WID Top 1% Wealth Share
- Source: **WID · World Inequality Database**
- URL: **https://wid.world/country/usa/**
- License: **CC BY**
- Coverage: **1820–2024**, share of total household wealth held by the top 1% of US adults.
- Used as the elite-overproduction proxy for Turchin's secular cycles.

**Critical question:** Does WID actually publish a US top-1% wealth share series back to 1820? Saez-Zucman's wealth concentration estimates typically start ~1913. Pre-1900 wealth-share estimates rely on heterogeneous historical sources (e.g., Lindert; Saez-Zucman extensions). If WID's series only starts ~1913 and the local CSV silently extends backward via interpolation or composite sources, the "1820–2024" coverage claim is misleading. **Confirm by opening WID's US wealth distribution page and checking the actual coverage.**

### B4. US share of world GDP
- Source: **Maddison Project Database 2023**
- URL: **https://www.rug.nl/ggdc/historicaldevelopment/maddison/releases/maddison-project-database-2023**
- License: **CC BY 4.0**
- Coverage: **1870–2022**
- The site's `association_note` says: "Peak at 1945 (~42%) is exactly Dalio's reference peak year."

**Critical question:** What does Maddison Project 2023 give as the US share of world GDP at 1945? Commonly cited figures range 35-50% depending on geographic coverage, currency, and whether war-disrupted economies are included. Confirm the **~42%** figure against the actual MPD 2023 dataset.

### B5. V-Dem Liberal Democracy Index
- Source: **V-Dem Institute v15**
- URL: **https://v-dem.net/data/the-v-dem-dataset/**
- License: **CC BY 4.0**
- Coverage: **1789–2025** for the US, scale 0–1.
- Used as the institutional-stress proxy for Strauss-Howe.

Questions: What is the latest released V-Dem version (v14? v15? v16?), and does our "v15" attribution match what's actually in the local CSV's metadata? V-Dem typically updates annually in spring.

### B6. Global conflict deaths (log-transformed)
- Source: **Our World in Data · Project Mars (Lyall 2020)**
- URL: **https://ourworldindata.org/grapher/deaths-in-wars-by-region-project-mars**
- License: **CC BY**
- Coverage: starts 1800.
- Transform: **log1p** (natural log of 1 + deaths per 100,000), to keep WWI/WWII spikes from flattening the rest of the series.
- Used as the state-breakdown intensity proxy for Khaldun.

Questions: Does the OWID URL still resolve to a Project Mars (Lyall 2020) chart? What temporal coverage does Project Mars actually have (1800–2011 is one cited range)?

---

## Section C: Prose claims (the about and home pages)

The site says, on /about:

1. *"Huntington anchored on 1965 because he was writing in 1981 and the civil-rights surge dominated his view."*
   — Is this attribution of motivation defensible from Huntington's own text in *American Politics*?

2. *"Kondratiev-wave popularisers anchored on 1973 because the oil shock was vivid to them."*
   — Is this a fair characterization of the post-1970s K-wave revival (Mandel, Mensch, Forrester, etc.)?

3. *"Khaldun anchored a European Enlightenment collapse because his later Western readers needed the framework legible in their own history."*
   — As written, this is ambiguous about whether *Khaldun himself* anchored this or the *project* did. Should be rephrased to make explicit that the European-Enlightenment anchoring is the project's editorial choice, not Khaldun's claim. Flag for rewrite.

4. *"Perez anchors on 2000 because the dot-com bubble was the defining technology-finance event of her career."*
   — Did Perez explicitly choose 2000 as the anchor, or is "anchors on 2000" the project's interpretive overlay on her installation-vs-deployment framework?

5. *"Kondratiev waves have never been cleanly confirmed in empirical long-run data."*
   — Is this an accurate statement of the academic consensus as of 2025?

6. *"Strauss-Howe is generational theory — influential in popular discourse, contested in academic history."*
   — Confirm this characterization against actual academic reception.

7. **/methods coverage claims** (these can be checked against the local CSVs in `/public/data/`, but if any external review is doing source-side verification, please confirm):
   - DW-NOMINATE: starts 1879
   - Fernald TFP: starts 1948
   - Project Mars: starts 1800
   - WID top-1% wealth: starts 1820
   - Maddison: trimmed to 1870+
   - V-Dem: starts 1789

---

## Output format requested

For each item A1–A7, B1–B6, and C1–C7:

1. **Verdict** (one of: `correct`, `correct-with-caveat`, `imprecise`, `incorrect`, `unverifiable-from-public-sources`)
2. **Authoritative citation(s)** supporting the verdict
3. **If not `correct`, the proposed replacement string** for the relevant `cycles.json` / `series.json` field or prose paragraph
4. **Editorial-overreach flag** if applicable (the site puts words in the theorist's mouth, or conflates project interpretation with original claim)

Return one master report at the end ranking the items by **risk of being publicly embarrassing if a careful reader caught it**. The artifact is being sent to historians and economists; precision matters more than completeness.

## End prompt

---

## Notes for Dave

This prompt covers what we have today. Two things worth knowing:

1. **The fastest local check** is `/public/data/*.csv` — opening each and confirming `min(year)` matches the methods page's coverage claims. That's a 5-minute pass and catches one whole category of error.
2. **The riskiest items** by my reading: WID top-1% wealth start year (1820 looks suspicious), Strauss-Howe peak vs onset (conceptually muddled), Perez confidence_level (probably too high), and the Khaldun / French Revolution attribution wording.

If you want, run the deep-research pass once and we can fold any corrections back into `cycles.json` / `series.json` / the prose pages in a single Phase-6 commit.
