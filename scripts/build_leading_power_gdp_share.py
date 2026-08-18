"""
Build public/data/leading_power_gdp_share.csv from the OWID Maddison Project mirror.

Pairs with the Modelski long-cycle-of-world-leadership entry. The series is the
LARGEST single economy's share of world GDP each year — mechanically defined,
deliberately NOT hand-picked to follow Modelski's hegemon succession. The data
rule (max country GDP / sum of country GDPs) is fixed without reference to the
theory's dates, so the series cannot be quietly fitted to the cycle it is
plotted against.

The pipeline is identical to scripts/build_us_world_gdp_share.py except for the
final step:
  1. Downloads the canonical OWID CSV
  2. Excludes regional aggregates and the "World" rollup
  3. Handles historical-state vs successor-state overlap (USSR/Russia,
     Czechoslovakia/Czechia+Slovakia, Yugoslavia/successors,
     Sudan-former/Sudan+South Sudan) by preferring successors when
     both have data for the same year
  4. Forward-fills each country's GDP between sparse benchmark observations
  5. Computes leading-power share = max(country GDP) / sum_of_countries_GDP * 100
     and records WHICH country was largest
  6. Trims to 1870+ and writes the CSV

Run from repo root:
    python scripts/build_leading_power_gdp_share.py
"""

from __future__ import annotations

import csv
import urllib.request
from collections import defaultdict
from pathlib import Path

OWID_URL = "https://ourworldindata.org/grapher/gdp-maddison-project-database.csv"
OUTPUT = Path("public/data/leading_power_gdp_share.csv")
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
    # OWID rejects the default Python urllib User-Agent with 403 (observed
    # 2026-08-18; the 2026-04 pull without a UA header worked at the time).
    req = urllib.request.Request(
        OWID_URL,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "sinusoidal-cycles build script"
            )
        },
    )
    with urllib.request.urlopen(req) as resp:
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

    out_rows: list[tuple[int, float, str]] = []
    for year in sorted(by_year):
        if year < TRIM_FROM:
            continue
        kept = filter_year(by_year[year])
        if not kept:
            continue
        world = sum(kept.values())
        if world <= 0:
            continue
        leader, leader_gdp = max(kept.items(), key=lambda kv: kv[1])
        share = leader_gdp / world * 100
        out_rows.append((year, share, leader))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, lineterminator="\n")
        writer.writerow(["year", "leading_power_gdp_share_pct", "leading_power"])
        for year, share, leader in out_rows:
            writer.writerow([year, f"{share:.3f}", leader])

    # --- Sanity report ---
    print(f"Wrote {len(out_rows)} rows to {OUTPUT}")
    print(f"Year range: {out_rows[0][0]}-{out_rows[-1][0]}")

    print("Leading-power spans (consecutive runs):")
    run_start, run_leader = out_rows[0][0], out_rows[0][2]
    prev_year = out_rows[0][0]
    for year, _share, leader in out_rows[1:]:
        if leader != run_leader:
            print(f"  {run_leader}: {run_start}-{prev_year}")
            run_start, run_leader = year, leader
        prev_year = year
    print(f"  {run_leader}: {run_start}-{prev_year}")

    nan_rows = [r for r in out_rows if r[1] != r[1] or not r[2]]
    print(f"NaN/empty rows: {len(nan_rows)}")

    sample_years = [1870, 1900, 1945, 1950, 1960, 1980, 2000, 2022]
    print("Sample values:")
    by_year_out = {y: (v, l) for y, v, l in out_rows}
    for y in sample_years:
        if y in by_year_out:
            v, l = by_year_out[y]
            print(f"  {y}: {v:.3f}% ({l})")


if __name__ == "__main__":
    main()
