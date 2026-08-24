# US Policy Mood (Stimson)

**Retrieved:** 2026-04-26
**Source URL:** https://stimson.web.unc.edu/wp-content/uploads/sites/9919/2025/07/Mood5224.xlsx
**Upstream landing page:** https://stimson.web.unc.edu/data/
**Primary citation:** James A. Stimson, *Public Opinion in America: Moods, Cycles, and Swings* (Westview, 2nd ed., 1999); ongoing data updates posted by Stimson at the URL above. Methodology paper: Stimson, "The Dyad Ratios Algorithm for Estimating Latent Public Opinion: Estimation, Testing, and Comparison to Other Approaches," *Bulletin de Méthodologie Sociologique / Bulletin of Sociological Methodology* 137–138(1), 2018, 201–218. DOI 10.1177/0759106318761614. (An earlier version of this file miscited the title and venue.)
**License:** Freely shared by the author on a personal academic site; no explicit reuse license identified on the upstream page. This site redistributes a two-column extract (year, mood) with attribution on the basis that the file is publicly posted for scholarly use, and will remove it on request. Public availability is not an open-data license, and nothing here should be read as one.

## Columns in our CSV

- `year` — calendar year (1952–2024)
- `mood` — Stimson's annual Policy Mood index. Higher = more liberal public preference for US domestic policy. The index sits on a percent-liberal-style metric, where 50 corresponds roughly to equal liberal and conservative shares among respondents taking a position; it is not the series mean (the committed 1952–2024 series has mean ≈ 63.1) and not a statistical zero. Observed range 53.9–72.8.

## What was filtered

Upstream `Mood5224.xlsx` packs three series into one wide sheet (annual columns A–B; biennial columns D–F; quarterly columns H–J). We extract only the leftmost two columns (annual Year + Mood) and write them to a clean two-column CSV. Values are preserved at the source's three decimal places. The reproducible build is `scripts/build_stimson_policy_mood.py`.

## Why this series pairs with Schlesinger Jr.

Schlesinger Jr.'s cycle is a claim about ~30-year alternation in American public preference between liberal "public purpose" and conservative "private interest" eras. Stimson's Policy Mood is a latent index of US public preference for liberal vs. conservative domestic policy, estimated from ~150 repeated survey items (154 in the 1952–2016 vintage documented in his 2018 methodology paper) via the dyad-ratios algorithm. It is closer to a direct measurement than most pairings on this site, with two honesty notes. First, Stimson's own reading of the series emphasises shorter, thermostatic swings in preference rather than a fixed ~30-year cycle; the pairing tests his data against Schlesinger's period, and does not report his endorsement of it. Second, Mood measures mass preferences over the scope of domestic government — one component of Schlesinger's public-purpose/private-interest rhythm, not the whole political-historical construct.

## Caveats

- **Coverage starts at 1952.** Schlesinger's cycle reaches back to the early 19th century; inside the empirical window the site's construction (period 30, peak 1970) plots troughs at 1955, 1985, and 2015 and peaks at 1970 and 2000. (An earlier version of this file called the late 1970s a trough; at period 30 / peak 1970 the cosine at 1978 is ≈ −0.10, mid-fall — the trough is 1985.)
- **Annual frequency** masks within-year shifts that survey-week-level policy-mood work would catch.
- **The construction is contested.** Stimson's dyad-ratios algorithm has critics; the choice of which survey items count as "domestic-policy mood" is itself a modeling decision. The series is widely cited in American political behavior research, not without dissent.
- **Schlesinger's own mid-1980s forecast** of a coming liberal era around 1990 fits the data better than his stated period does. Mood bottoms in **1980 (53.9, the series minimum)** — five years *earlier* and deeper than the model's 1985 trough — then recovers to near its mean by 1985 (62.9) and to 68.6 by 1990. The empirical low is early and deep where the 30-year-from-1970 clock expects a later trough; exactly the kind of mismatch the calibration drawer is designed to surface. (An earlier version of this file said the trough was "shallower and later"; it is the reverse on both counts.)
