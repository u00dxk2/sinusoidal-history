# DW-NOMINATE House Party Polarization

**Retrieved:** 2026-04-24
**Source URL:** https://voteview.com/static/articles/party_polarization/voteview_polarization_data.csv
**Primary citation:** Lewis, Jeffrey B., Keith Poole, Howard Rosenthal, Adam Boche, Aaron Rudkin, and Luke Sonnet (2026). *Voteview: Congressional Roll-Call Votes Database.* https://voteview.com
**Associated page:** https://voteview.com/articles/party_polarization
**License:** Freely available; Voteview requests citation; project code MIT-licensed; no explicit data license. (An earlier version of this file said "Public.")

## Columns in our CSV

- `year` — calendar year of Congress (House meets every two years, so values are every other year)
- `house_party_distance` — `party.mean.diff.d1` from the source: absolute distance between Democratic and Republican House means on the first DW-NOMINATE dimension (economic/redistributive). Higher = more polarized.

## What was filtered

Source file has House and Senate rows for each Congress (46 through 118, years 1879–2023) with ~21 columns of derived measures. We kept only House rows and only the two columns above, and rounded `house_party_distance` to four decimals.

## Why this series pairs with Huntington

Huntington's creedal-passion cycle predicts surges of political moralism and reform agitation approximately every 60 years. His construct is not roll-call polarization — this pairing is the project's proxy choice, not a measure Huntington proposed. DW-NOMINATE is the cleanest long-run measure of American political division that exists, which is why we use it anyway.

## Caveats

- Polarization ≠ creedal passion — Huntington's construct is broader than roll-call distance.
- Covers 1879 onward; Huntington's theorised earlier peaks (1776 Revolution, 1830s Jacksonian period) are outside the data.
- The series is not smoothed.
