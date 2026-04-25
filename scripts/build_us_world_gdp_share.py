"""
Rebuild public/data/us_world_gdp_share.csv from the OWID Maddison Project mirror.

Earlier versions of this CSV had a data-pipeline bug: regional aggregate
entities (named "Western Europe (Maddison)" etc. in OWID's export) were not
properly excluded, because the original filter expected names like
"Western Europe" without the "(Maddison)" suffix. The bug roughly doubled
world_sum on benchmark years (1870, 1900, 1920, 1940, 1950, 1960, 1970, 1980,
1990, 2000, 2010), halving the reported US share at those years.

This script:
  1. Downloads the canonical OWID CSV
  2. Excludes regional aggregates and the "World" rollup
  3. Handles historical-state vs successor-state overlap (USSR/Russia,
     Czechoslovakia/Czechia+Slovakia, Yugoslavia/successors,
     Sudan-former/Sudan+South Sudan) by preferring successors when
     both have data for the same year
  4. Computes US share = US_GDP / sum_of_countries_GDP * 100
  5. Trims to 1870+ and writes the cleaned CSV

Run from repo root:
    python scripts/build_us_world_gdp_share.py
"""

from __future__ import annotations

import csv
import urllib.request
from collections import defaultdict
from pathlib import Path

OWID_URL = "https://ourworldindata.org/grapher/gdp-maddison-project-database.csv"
OUTPUT = Path("public/data/us_world_gdp_share.csv")
TRIM_FROM = 1870

# Regional/world aggregates to drop unconditionally.
AGGREGATE_NAMES = {
    "World",
    "East Asia (Maddison)",
    "Eastern Europe (Maddison)",
    "Latin America (Maddison)",
    "Middle East and North Africa (Maddison)",
    "South and South East Asia (Maddison)",
    "Sub Saharan Africa (Maddison)",
    "Western Europe (Maddison)",
    "Western offshoots (Maddison)",
}

# Historical entities that overlap with their successors. For years where
# any successor is present, drop the historical row; otherwise keep it.
SUCCESSOR_RULES: dict[str, set[str]] = {
    "USSR": {
        "Russia", "Ukraine", "Belarus", "Kazakhstan", "Uzbekistan",
        "Turkmenistan", "Kyrgyzstan", "Tajikistan", "Armenia", "Azerbaijan",
        "Georgia", "Moldova", "Lithuania", "Latvia", "Estonia",
    },
    "Czechoslovakia": {"Czechia", "Slovakia"},
    "Yugoslavia": {
        "Serbia", "Croatia", "Slovenia", "Bosnia and Herzegovina",
        "North Macedonia", "Montenegro", "Kosovo",
    },
    "Sudan (former)": {"Sudan", "South Sudan"},
}


def download() -> str:
    print(f"Downloading {OWID_URL} ...")
    with urllib.request.urlopen(OWID_URL) as resp:
        return resp.read().decode("utf-8")


def parse(csv_text: str) -> dict[int, dict[str, float]]:
    """Return {year: {entity_name: gdp}}."""
    rows: dict[int, dict[str, float]] = defaultdict(dict)
    reader = csv.DictReader(csv_text.splitlines())
    for row in reader:
        entity = row["Entity"]
        gdp_str = row.get("GDP", "")
        try:
            year = int(row["Year"])
            gdp = float(gdp_str)
        except (ValueError, KeyError):
            continue
        rows[year][entity] = gdp
    return rows


def forward_fill(by_year: dict[int, dict[str, float]]) -> dict[int, dict[str, float]]:
    """For every entity, carry its most-recent observed GDP forward to
    subsequent years where it has no observation, until the next observed
    value (which overrides it). This evens out Maddison's sparse-benchmark
    coverage so that countries which only have data at 1900 / 1950 / etc.
    are still represented in intervening years rather than appearing only
    at decade boundaries.
    """
    years = sorted(by_year)
    if not years:
        return by_year
    all_entities: set[str] = set()
    for v in by_year.values():
        all_entities.update(v.keys())

    filled: dict[int, dict[str, float]] = {y: {} for y in years}
    last_seen: dict[str, float] = {}
    for year in years:
        observations = by_year[year]
        for entity in all_entities:
            if entity in observations:
                last_seen[entity] = observations[entity]
            if entity in last_seen:
                filled[year][entity] = last_seen[entity]
    return filled


def filter_year(entities_in_year: dict[str, float]) -> dict[str, float]:
    """Drop aggregates; resolve historical/successor overlaps."""
    kept = {
        name: gdp
        for name, gdp in entities_in_year.items()
        if name not in AGGREGATE_NAMES
    }
    for historical, successors in SUCCESSOR_RULES.items():
        if historical in kept and any(s in kept for s in successors):
            del kept[historical]
    return kept


def main() -> None:
    csv_text = download()
    by_year = parse(csv_text)
    by_year = forward_fill(by_year)

    out_rows: list[tuple[int, float]] = []
    for year in sorted(by_year):
        if year < TRIM_FROM:
            continue
        kept = filter_year(by_year[year])
        if "United States" not in kept:
            continue
        world = sum(kept.values())
        if world <= 0:
            continue
        share = kept["United States"] / world * 100
        out_rows.append((year, share))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, lineterminator="\n")
        writer.writerow(["year", "us_share_world_gdp_pct"])
        for year, share in out_rows:
            writer.writerow([year, f"{share:.3f}"])

    peak_year, peak_val = max(out_rows, key=lambda r: r[1])
    print(f"Wrote {len(out_rows)} rows to {OUTPUT}")
    print(f"Peak: {peak_val:.3f}% in {peak_year}")
    sample_years = [1870, 1900, 1945, 1950, 1960, 1980, 2000, 2022]
    print("Sample values:")
    for y in sample_years:
        for yy, v in out_rows:
            if yy == y:
                print(f"  {y}: {v:.3f}%")
                break


if __name__ == "__main__":
    main()
