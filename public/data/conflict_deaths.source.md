# Global Conflict Deaths per 100,000

**Retrieved:** 2026-04-24
**Source URL:** https://ourworldindata.org/grapher/deaths-in-wars-by-region-project-mars.csv?v=1&csvType=full&useColumnShortNames=true
**Primary citation:** Lyall, Jason (2020). *Divided Armies: Inequality and Battlefield Performance in Modern War.* Princeton University Press. Project Mars dataset.
**Coverage:** 1800–2011, world-aggregate.
**License:** OWID chart layer CC BY 4.0; underlying Project Mars data Public Domain (per OWID indicator metadata for this series, dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/DUO7IE).

## Columns in our CSV

- `year` — calendar year
- `deaths_per_100k` — deaths in ongoing armed conflicts, low estimate, divided by estimated world population for that year, multiplied by 100,000

**Note on transform:** In Phase 3 we added a `"transform": "log1p"` to the series definition in `src/data/series.json`. The CSV still stores raw per-100k deaths; the application computes `log(1 + value)` at load time before normalization so WWI/WWII spikes don't flatten the rest of the series. Hover tooltips show the raw per-100k value.

## What was filtered and transformed

From the source CSV:
1. Kept only rows where `entity == "World"` (the world aggregate).
2. Used the `number_deaths_ongoing_conflicts_low__conflict_type_all` column (the conservative estimate).
3. Divided by interpolated world population to get a per-100,000 rate. Population anchors (in millions, by decade, blended from Maddison Project Database and HYDE 3.2):
   - 1800: 984 · 1850: 1,262 · 1900: 1,654 · 1950: 2,536 · 2000: 6,143 · 2010: 6,957 · 2011: 7,041
   Linear interpolation between anchors.

## Why this series pairs with Khaldun

Khaldun's dynastic cycle describes periodic breakdown of political order — roughly every 120 years. We use conflict-death rate as a rough proxy for "state breakdown intensity." The two World Wars dominate the series, which also roughly aligns with Khaldun's anchoring of the late-1700s collapse period.

## Caveats (important)

- **OWID smooths multi-year wars by even-distribution.** OWID's processing note for this series: *"If a war lasted more than one year, we distributed its deaths evenly across years."* So the WWII bar is not "deaths in 1942" but "WWII total ÷ 7," repeated across 1939–1945. Anyone who plots annual WWII deaths from this series and compares them to historical fact will see what looks like a smoothing — that is the methodology, not a bug. Project Mars itself is conflict-level, not year-level.
- **We use the "low estimate" column.** Project Mars publishes low / best / high deaths-per-conflict estimates; we use `number_deaths_ongoing_conflicts_low__conflict_type_all`, the conservative low. Other estimates would shift levels but not the shape of the curve.
- **This is global, not regional.** Khaldun's cycle is about a single polity's dynasty. Aggregating globally averages across many polities in different phases.
- **Project Mars counts battle deaths in organised conventional wars.** One-sided violence against civilians is outside the measure: genocide (including the Holocaust) and state-led repression (Stalinist terror) are not captured, and lower-intensity violence and pogroms are undercounted. (An earlier version of this file wrongly said Holocaust deaths were captured.)
- **Zero-death years are a definitional artifact, not absence of war.** Years like 2010 register as zero because no qualifying conventional war (interstate or civil war between states with differentiated militaries causing ≥500 deaths) was active. Other conflict datasets (UCDP, COW, PRIO) record substantial casualties in 2010 (Afghanistan, Iraq, Mexican drug war, etc.). The series measures conventional-war intensity, not all conflict deaths.
- **Population normalisation is approximate** — world-population estimates pre-1900 are reconstructions, not measurements.
- **The cycle-matching exercise is illustrative, not evidence of cyclicity.**
- For a longer time horizon (back to ~1400), Peter Brecke's Conflict Catalog would be the definitive source but isn't available as a direct download.
