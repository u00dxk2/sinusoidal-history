# Sinusoidal History — round 4 fact-check

**Top line.** One critical mathematical contradiction between the prose and the chart itself, plus one muddled methods-page claim about Pearson, plus a small but verifiable inconsistency between the methods page's stated TFP display range and the CSV. Three lower-tier items concern the Maddison forward-fill bias, the conflation of Dalio's two cycles, and a misleading WID provenance line. All other prior corrections appear to hold up to a careful adversarial read; the bibliographic and license layers are clean against upstream sources I could reach.

The findings below are ranked by risk of public embarrassment if shipped.

---

## Finding 1 — Strauss-Howe "2020 = trough" is mathematically false

**Verdict:** `incorrect`. This is the round-4 equivalent of the Fernald `dtfp` vs `dtfp_util` issue: a claim that survives the prose layer but collapses on a single arithmetic check.

**Where it appears.** Twice in `/about` and once in `cycles.json[strauss_howe].reference_peak_rationale`:

> "their predicted Crisis climax around 2020 is a trough in this construction, not a peak"
> "Their predicted Fourth-Turning Crisis climax (~2020) is a trough in this construction, not a peak — anchoring at 2008 (Crisis onset) as a peak would invert the model."

**Why it's wrong.** With `period_years = 84` and `reference_peak_year = 1955`, `sineAtYear` evaluates to `cos(2π·(year − 1955)/84)`. The trough (where the cycle equals −1) is exactly half a period after the peak: **1955 + 42 = 1997**, not 2020. At year 2020, phase fraction = 65/84 ≈ 0.774, and the cycle value is `cos(2π · 0.774) ≈ +0.15`. So 2020 sits **on the rising arm**, just past the upward zero-crossing at 1955 + 63 = 2018, climbing toward the next peak at 2039. The chart itself will display Strauss-Howe slightly above zero in 2020 — visually contradicting the disclaimer that calls it a trough.

**Risk.** Any reader who literally looks at the chart in 2020 sees roughly zero-and-rising; the prose tells them they should see a trough. A historian, a Strauss-Howe partisan, or a Pueyo reader cross-checking arithmetic catches this in under a minute.

**Proposed replacement** for the cycles.json rationale:

> "Anchored to the post-WWII American High (~1955), the most recent completed First Turning peak in Strauss-Howe's saeculum. With period = 84, the trough of this construction lands at 1997 and the next peak at 2039; the predicted Fourth-Turning Crisis climax (~2020) therefore sits on the rising arm of the cycle (cos ≈ +0.15), not at a trough or peak. Reducing four turnings to a single sinusoid is a forced choice — there is no peak-year anchor in Strauss-Howe that aligns the Crisis climax with either a sinusoid peak or trough."

And the parallel `/about` sentence should be rewritten the same way: 2020 is on the rising arm, not a trough.

---

## Finding 2 — Pearson "linearity" reasoning is wrong

**Verdict:** `imprecise` (the prose is methodologically muddled, even though the broader point — Pearson is the wrong tool — is correct).

**Where it appears.** `/methods` § "Why Pearson is the wrong tool":

> "**Linearity.** Sinusoids are not linear in year. Pearson will say a perfect cosine, evaluated over a full period, has zero correlation with the same cosine shifted by a quarter period — which is correct numerically but misses that one is just the derivative of the other."

**Why it's wrong.** Pearson's "linearity" assumption is about the **relationship between the two paired variables** being linear, not about either variable being linear in time. Pearson computes correlation on paired arrays; whether either array is linear-in-year is irrelevant. A series `y = cos(2πt/T)` correlated with itself returns r = 1 perfectly. The cos-vs-quarter-shifted-cos result (r = 0) is a consequence of orthogonality of sin and cos over one full period — it is not a violation of "linearity in year." Calling cos and its quarter-shifted version "the derivative of the other" is also imprecise: d/dx cos(x) = −sin(x), and a quarter-period shift of cos(x) is sin(x − π/2) = −cos(x − π) shifted... the colloquial "derivative" framing misleads more than it clarifies.

**The actual reason Pearson is the wrong tool for cyclic data is what the next bullet correctly says** (autocorrelation deflates effective sample size) **plus** the fact that for two sinusoids of the same period, Pearson r becomes a one-parameter function of phase offset Δφ — it equals cos(Δφ). That makes r highly sensitive to calibration and useless as a similarity score for "is this cycle real?".

**Proposed replacement** for the Linearity bullet:

> "**Phase sensitivity.** For two sinusoids of the same period, Pearson r reduces to cos(Δφ), where Δφ is the phase offset. A perfect cosine evaluated over one full period has r = 1 with itself, r = 0 with a quarter-period shift, and r = −1 with a half-period shift — even though all three are 'the same cycle' in any structural sense. Pearson therefore measures phase alignment, not cyclic similarity, and the calibration slider primarily moves r by changing Δφ."

---

## Finding 3 — TFP display range disagrees between methods page and CSV

**Verdict:** `incorrect` (internal inconsistency).

**Where.** `/methods` § "Missing and sparse data":

> "Fernald TFP underlying series 1947Q2–present, displayed ~1950–present after the 5-year centered window"

But `us_tfp_growth.csv` has 78 rows running **1948–2025**, and the further note says "the windows at the extreme ends are clipped, which is why the displayed series effectively starts ~1950 rather than 1948." If the CSV starts at 1948, the displayed series starts at 1948 — there's no mechanism in `seriesMath.ts` or the loader described to hide rows. The "1950" claim contradicts the CSV.

**Likely root cause.** `build_us_tfp_growth.py` runs a 5-year centered rolling mean with edge clipping. With centered means, even 1948 has a (clipped, asymmetric) value: it's the mean of {1948, 1949, 1950} — a 3-year right-trailing window dressed up as a "centered" window. Whether to display these clipped endpoints is a real choice; the methods page describes one choice (hide ~1948–49) and the CSV implements the other (keep them).

**Proposed replacement** for that line in /methods:

> "Fernald TFP annual series 1948–present, displayed 1948–present; the 1948 and 1949 values use a clipped (asymmetric) window because a true 5-year centered window only becomes available at 1950. Treat the first two displayed points as edge artifacts."

Or — if Dave actually wants to hide the clipped points — drop rows 1948 and 1949 from the CSV and update the row-count comment accordingly.

---

## Finding 4 — Maddison forward-fill induces an asymmetric pre-1950 bias

**Verdict:** `imprecise` (the methodology has a known direction of bias not surfaced in the methods page).

**Where.** `scripts/build_us_world_gdp_share.py` step 3: "Forward-fills each entity's GDP across years to handle Maddison's sparse-benchmark coverage."

**The hidden bias.** Forward-fill carries each country's last observed GDP value forward in time; it does **not** back-fill. Many non-Western countries in MPD 2023 have their first observation only in 1950 (or even later), so for years 1870–1949 those countries effectively contribute **zero** to the world denominator. The US, which has continuous coverage from 1800, contributes its full value. Net effect: **US share of world GDP is systematically over-stated for early years** (1870–~1920) relative to what a full-coverage series would show, and the visible "decline" in US share over 1945→2020 is partly an artifact of progressively more countries entering the denominator in the post-1950 window. The 10.6% figure for 1870 is particularly suspect on these grounds.

This is the kind of methodological footnote that earlier rounds caught for individual scripts (e.g., the dtfp_util fix) but didn't generalize to the Maddison rebuild's coverage asymmetry. Worth surfacing.

**Proposed addition** to /methods § "Missing and sparse data":

> "The Maddison rebuild forward-fills each country's GDP between sparse benchmark observations but does not back-fill before each country's first observation. Many non-Western countries enter Maddison only at 1950, so the world denominator is systematically smaller pre-1950 than post-1950, biasing US share of world GDP upward for early years. The 1870 value (~10.6%) and the magnitude of the 1870→1945 climb should both be read as 'US share of countries Maddison covers in that year,' not 'US share of world GDP' literally."

---

## Finding 5 — Dalio 75-year cycle anchored to the 250-year cycle's peak

**Verdict:** `imprecise` (cycle and anchor are from two different Dalio constructs).

**Where.** `cycles.json[dalio]`:
- `period_years: 75` — Dalio's long-term debt cycle
- `reference_peak_year: 1950` rationale cites "Bridgewater's empire-score chart visually peaks ~1950" — the empire-score chart is Dalio's **~250-year Big Cycle** (rise/peak/decline of reserve-currency empires), not the 75-year long-term debt cycle.

The cycles.json `name` and `short_description` already disclose this ambiguity ("Dalio also describes a longer ~250-year empire arc; this curve uses the 75-year figure"), but the calibration peak is taken from the 250-year chart and applied to a 75-year sinusoid. With period 75 and peak 1950, the cycle is back at peak in **2025** — implying a second post-WWII US apex within Dalio's framework that Dalio does not claim and that the empire-score chart explicitly contradicts (it shows decline, not a second peak). This is a bigger issue than the GDP-share-vs-empire-score offset already disclosed.

**Proposed sharpening** of the rationale:

> "Per Dalio, ch. 5: 'these measures of the United States' powers relative to its own history reached their peaks in the 1950s immediately after the Allies won World War II.' The 1950 anchor comes from Bridgewater's ~250-year empire-score chart, while the 75-year period here represents Dalio's long-term debt cycle. The two are different constructs in Dalio's framework; using one's peak to anchor the other forces the curve to peak again at ~2025, which Dalio does not assert. Treat the Dalio sinusoid as a forced single-cycle reduction of two stacked Dalio cycles."

---

## Finding 6 — WID source line attributes pre-1913 points to Saez-Zucman 2016

**Verdict:** `imprecise`.

**Where.** `series.json[wid_top1_wealth].source` reads: `"WID (Saez–Zucman 2016 / DINA, retrieved via OWID)"`. /methods then admits: "the five pre-1913 points (1820, 1850, 1880, 1900, 1910) come from earlier historical sources spliced via OWID/WID."

The five pre-1913 points are **not from Saez-Zucman 2016**; that paper's wealth series begins in 1913. The pre-1913 points in WID's US wealth series are interpolations/extrapolations sourced from earlier US wealth-distribution literature (e.g., Lindert 2000; Wolff; Sutch). The `source` field as written conflates two different provenances.

**Proposed replacement** for the source field:

> "WID (US top-1% wealth share). 1913–present from Saez & Zucman (2016) / DINA; pre-1913 decadal points (1820, 1850, 1880, 1900, 1910) are WID interpolations sourced from earlier US wealth-distribution literature, not from Saez-Zucman directly. Retrieved via OWID."

---

## Finding 7 — Project Mars 2010 = 0 is a definitional artifact, not absence of war

**Verdict:** `correct-with-caveat`.

The `conflict_deaths.csv` shows `2010 → 0.0000` between non-zero values in 2009 and 2011. Project Mars (Lyall 2020, v1.1, Harvard Dataverse) covers **conventional wars** — interstate wars fought between differentiated militaries along clear frontlines, 1800–2011. By that strict definition, 2010 had no qualifying conventional war, hence zero deaths-per-100k. But under any broader definition (UCDP, COW, PRIO), 2010 had substantial conflict deaths (Afghanistan, Iraq, Mexican drug war, etc.).

A reader who sees the chart drop to zero in 2010 will reasonably misread this as "no one died in any war in 2010." The methods page does not flag this. Worth a one-sentence note.

**Proposed addition** to /methods § "Missing and sparse data":

> "Project Mars covers only conventional interstate wars. Years like 2010, where no qualifying conventional war was active, register as zero deaths even though other conflict datasets (UCDP, COW) record substantial casualties. The series therefore measures conventional-war intensity, not all conflict deaths."

---

## Items I checked and found clean

To save Dave time on the next pass, here is what I verified against upstream and could not falsify:

- **Voteview citation `Lewis, Poole, Rosenthal, Boche, Rudkin, Sonnet (2026)`** — matches the current voteview.com/data citation string verbatim.
- **Bolt & van Zanden 2024, J. Econ. Surveys, DOI 10.1111/joes.12618** — paper is online April 2024, in print Vol 39 No 2 pp 631–671 April 2025; "2024" is consistent with both rug.nl and OWID's preferred citation. Adding "39, 631–671" would be more precise but isn't wrong as-is.
- **Maddison Project Database 2023 license CC BY 4.0** — confirmed on rug.nl's MPD 2023 release page.
- **V-Dem v16 release timing (March 2026), DOI 10.23696/vdemds26** — confirmed on v-dem.net release statement and OWID metadata.
- **V-Dem license CC BY-SA 4.0** — confirmed on the vdeminstitute/vdemdata GitHub README.
- **Project Mars v1.1 on Harvard Dataverse, 1800–2011, 252 conventional wars** — confirmed on Lyall's Dartmouth publications page and the Dataverse landing page.
- **Strauss-Howe `The Fourth Turning`, Broadway, 1997** — Broadway/Crown both appear as imprints; original 1997 hardcover is Broadway Books (ISBN 055306682X). Citation as written is fine.
- **Huntington 1981 Belknap/Harvard, Perez 2002 Edward Elgar, Turchin Princeton 2009 / Beresta 2016 / Penguin 2023, Dalio Avid Reader Press 2021** — all match.
- **Khaldun's five stages** (consolidation → concentration of power → leisure → contentment → waste) — matches the standard Rosenthal-translation rendering of Muqaddimah, p. 353–355 in the 1958 Bollingen edition. The phrase "paraphrased from Rosenthal" is technically imprecise (it's Khaldun, in Rosenthal's translation), but this is a stylistic nit.
- **`sineAtYear`, `normalizedPhase`, and `phasePositionLabel`** — all three functions are mathematically self-consistent. "rising" and "falling" labels assign correctly given the cosine convention (frac < 0.5 falls from peak to trough; frac > 0.5 rises from trough back to peak). The narrow band widths (0.03 of period; 0.015 for crossings) are a design choice, not a bug.
- **`pearsonCorrelation`** — textbook implementation, no numerical-stability issues at this data scale.
- **DW-NOMINATE first-year arithmetic** (46th Congress → 2·(46−1)+1789 = 1879) — matches voteview's published R code exactly, and the sample CSV values for 1879/1881/1883 (0.7859, 0.7827, 0.7244) are the exact party-mean differences voteview publishes.

---

## What this round did *not* find

Nothing in the bibliographic, license, or upstream-citation layers contradicts what's inline. If the round-4 release ships with findings 1–3 fixed and findings 4–7 acknowledged, the artifact is defensible against a strict adversarial historian or economist reading. The single line that would publicly embarrass the project — "the Crisis climax around 2020 is a trough in this construction" — is finding 1, and a careful Strauss-Howe reader catches it on the chart itself before reading the prose. Fix that one first.