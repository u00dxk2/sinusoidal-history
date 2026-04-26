# US Policy Mood (Stimson)

**Retrieved:** 2026-04-26
**Source URL:** https://stimson.web.unc.edu/wp-content/uploads/sites/9919/2025/07/Mood5224.xlsx
**Upstream landing page:** https://stimson.web.unc.edu/data/
**Primary citation:** James A. Stimson, *Public Opinion in America: Moods, Cycles, and Swings* (Westview, 2nd ed., 1999); ongoing data updates posted by Stimson at the URL above. Methodology paper: Stimson, "The Dyadic Ratios Algorithm for Estimating Latent Public Opinion," *Political Methodology* 22(3), 2018.
**License:** Freely shared by the author on a personal academic site; no explicit reuse license. We treat it as freely available for non-commercial scholarly redistribution under fair use, with attribution.

## Columns in our CSV

- `year` — calendar year (1952–2024)
- `mood` — Stimson's annual Policy Mood index. Higher = more liberal public preference for US domestic policy. Scale is anchored such that ~50 is the long-run mean across the series; observed range is roughly 50–75.

## What was filtered

Upstream `Mood5224.xlsx` packs three series into one wide sheet (annual columns A–B; biennial columns D–F; quarterly columns H–J). We extract only the leftmost two columns (annual Year + Mood) and write them to a clean two-column CSV. Values are preserved at the source's three decimal places. The reproducible build is `scripts/build_stimson_policy_mood.py`.

## Why this series pairs with Schlesinger Jr.

Schlesinger Jr.'s cycle is a claim about ~30-year alternation in American public preference between liberal "public purpose" and conservative "private interest" eras. Stimson's Policy Mood is, by construction, a measure of exactly that — a latent index of US public preference for liberal vs. conservative policy estimated from ~150 survey items via the dyadic-ratios algorithm. Stimson himself has used the series to test long-wave claims about American political mood. The pairing is closer to a direct measurement than most pairings on this site.

## Caveats

- **Coverage starts at 1952.** Schlesinger's cycle reaches back to the early 19th century; the empirical window only covers his most recent two completed swings (mid-50s conservative trough → late-60s liberal peak → late-70s conservative trough → late-80s liberal "tide" he predicted but only partly arrived).
- **Annual frequency** masks within-year shifts that survey-week-level policy-mood work would catch.
- **The construction is contested.** Stimson's dyadic-ratios algorithm has critics; the choice of which survey items count as "domestic-policy mood" is itself a modeling decision. The series is widely cited in American political behavior research, not without dissent.
- **Schlesinger's own mid-1980s forecast** of a coming liberal era around 1990 is partly visible in the data (mood ticks up through the early 1990s) but the trough is shallower and later than his ~30-year-from-1970 model would predict — exactly the kind of mismatch the calibration drawer is designed to surface.
