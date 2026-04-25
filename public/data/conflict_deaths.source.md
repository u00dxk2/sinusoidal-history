# Global Conflict Deaths per 100,000

**Retrieved:** 2026-04-24
**Source URL:** https://ourworldindata.org/grapher/deaths-in-wars-by-region-project-mars.csv?v=1&csvType=full&useColumnShortNames=true
**Primary citation:** Lyall, Jason (2020). *Divided Armies: Inequality and Battlefield Performance in Modern War.* Princeton University Press. Project Mars dataset.
**Coverage:** 1800–2011, world-aggregate.
**License:** Open (Our World in Data, CC BY).

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

- **This is global, not regional.** Khaldun's cycle is about a single polity's dynasty. Aggregating globally averages across many polities in different phases.
- **Project Mars covers organised interstate and civil war;** it undercounts lower-intensity violence, pogroms, and state-led repression (e.g. Holocaust deaths are captured; Stalinist deaths are not).
- **Population normalisation is approximate** — world-population estimates pre-1900 are reconstructions, not measurements.
- **The cycle-matching exercise is illustrative, not evidence of cyclicity.**
- For a longer time horizon (back to ~1400), Peter Brecke's Conflict Catalog would be the definitive source but isn't available as a direct download.
