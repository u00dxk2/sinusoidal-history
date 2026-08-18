"""
Build public/data/perez_tech_diffusion.csv from the HATCH dataset (Zenodo).

HATCH ("Historical Adoption of TeCHnology", Extended Dataset 2.0; Greene &
Nemet, University of Wisconsin-Madison) is a cross-country panel of
technology-adoption time series -- 5,994 national series across 228
countries, spanning canals and railroads through solar PV and social media.
It is the successor/kin of the NBER CHAT dataset (many rows cite CHAT as
their source). License: CC BY 4.0. DOI: 10.5281/zenodo.19579793 (version
2.0, published 2026-04-14; concept DOI 10.5281/zenodo.19579792).

This script builds a US **technology-diffusion intensity composite** to pair
with Carlota Perez's techno-economic paradigm cycle:

  1. Downloads HATCH_national_1.5.csv from the versioned Zenodo record and
     verifies its MD5 against the checksum published in the record's
     metadata (versioned Zenodo files are immutable, so a mismatch means a
     corrupt download, not an upstream revision).
  2. Keeps US rows only (Country Code == "USA"; 121 technology series).
     If a technology ever appears under more than one row for the US, the
     row with the most observations wins (currently no duplicates exist).
  3. Per technology: computes rolling 5-year log-changes,
     delta_t = ln(x_t) - ln(x_{t-5}), only where BOTH endpoints are
     observed (no interpolation) and positive (zeros are
     pre-commercialization padding; logs need a positive domain).
  4. Z-scores the log-changes WITHIN each technology (sample mean/std over
     that technology's full delta history), so a railroad boom and a
     smartphone boom are measured against their own series' typical
     growth, not against each other's units. Technologies with fewer than
     MIN_DELTAS = 10 usable log-changes (too few for a stable standard
     deviation) or zero variance are excluded.
  5. Aggregates across technologies per year by MEDIAN (robust to any one
     series' outliers), records N_t = number of contributing technologies,
     and keeps years with N_t >= MIN_TECHS = 3 (a median over one or two
     series is not a composite).
  6. Writes year, tech_diffusion_intensity, n_technologies.

Anti-overfit note: every choice above (5-year window, log-changes,
within-series z-scores, median aggregation, the 10-delta and 3-technology
floors) was fixed from first principles BEFORE looking at the output, and
none of them references Perez's dates. Nothing here is tuned to make the
year 2000 -- or any other year -- look special.

Run from repo root:
    python scripts/build_perez_tech_diffusion.py
"""

from __future__ import annotations

import csv
import hashlib
import math
import statistics
import urllib.request
from pathlib import Path

HATCH_URL = (
    "https://zenodo.org/records/19579793/files/HATCH_national_1.5.csv?download=1"
)
# MD5 published in the Zenodo record metadata (record 19579793 is a
# versioned, immutable deposit -- a mismatch means download corruption).
HATCH_MD5 = "3f16f6cb1c947369fbbe2a2b48a986c5"

OUTPUT = Path("public/data/perez_tech_diffusion.csv")

COUNTRY_CODE = "USA"  # every other paired series on the site is US or global
LAG = 5               # years; the log-change window
MIN_DELTAS = 10       # a z-score needs a stable within-series std
MIN_TECHS = 3         # a median over fewer series is not a composite


def download() -> str:
    print(f"Downloading {HATCH_URL} ...")
    req = urllib.request.Request(
        HATCH_URL, headers={"User-Agent": "sinusoidal-cycles-build/1.0"}
    )
    with urllib.request.urlopen(req) as resp:
        raw = resp.read()
    md5 = hashlib.md5(raw).hexdigest()
    if md5 != HATCH_MD5:
        raise RuntimeError(
            f"MD5 mismatch for HATCH_national_1.5.csv: got {md5}, "
            f"expected {HATCH_MD5}. Corrupt download, or the record id no "
            "longer points at the same versioned file."
        )
    print(f"MD5 verified: {md5}")
    return raw.decode("utf-8")


def parse_us_series(csv_text: str) -> dict[str, dict[int, float]]:
    """Return {technology_name: {year: value}} for US rows, positive values
    only. Wide format upstream: one row per (country, technology, metric),
    year columns 1702..2025."""
    reader = csv.reader(csv_text.splitlines())
    header = next(reader)
    col = {name: i for i, name in enumerate(header)}
    year_cols = [(i, int(h)) for i, h in enumerate(header) if h.isdigit()]

    candidates: dict[str, dict[int, float]] = {}
    for row in reader:
        if row[col["Country Code"]] != COUNTRY_CODE:
            continue
        tech = row[col["Technology Name"]]
        series: dict[int, float] = {}
        for i, year in year_cols:
            cell = row[i].strip()
            if not cell:
                continue
            try:
                value = float(cell)
            except ValueError:
                continue
            if value > 0:  # zeros = pre-adoption padding; logs need > 0
                series[year] = value
        # Duplicate-technology guard: keep the row with more observations.
        if tech not in candidates or len(series) > len(candidates[tech]):
            candidates[tech] = series
    return candidates


def zscored_log_changes(
    series: dict[int, float],
) -> dict[int, float] | None:
    """Rolling LAG-year log-changes, z-scored against this series' own
    history. None if the series has too few usable changes to z-score."""
    deltas: dict[int, float] = {}
    for year, value in series.items():
        prev = series.get(year - LAG)
        if prev is not None:
            deltas[year] = math.log(value) - math.log(prev)
    if len(deltas) < MIN_DELTAS:
        return None
    mean = statistics.mean(deltas.values())
    std = statistics.stdev(deltas.values())
    if std == 0:
        return None
    return {year: (d - mean) / std for year, d in deltas.items()}


def main() -> None:
    csv_text = download()
    series_by_tech = parse_us_series(csv_text)
    print(f"US technology series found: {len(series_by_tech)}")

    z_by_tech: dict[str, dict[int, float]] = {}
    skipped: list[str] = []
    for tech, series in sorted(series_by_tech.items()):
        z = zscored_log_changes(series)
        if z is None:
            skipped.append(tech)
        else:
            z_by_tech[tech] = z
    print(
        f"Technologies contributing: {len(z_by_tech)} "
        f"(skipped {len(skipped)} with < {MIN_DELTAS} usable "
        f"{LAG}-year log-changes)"
    )

    by_year: dict[int, list[float]] = {}
    for z in z_by_tech.values():
        for year, value in z.items():
            by_year.setdefault(year, []).append(value)

    out_rows: list[tuple[int, float, int]] = []
    for year in sorted(by_year):
        values = by_year[year]
        if len(values) < MIN_TECHS:
            continue
        out_rows.append((year, statistics.median(values), len(values)))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, lineterminator="\n")
        writer.writerow(["year", "tech_diffusion_intensity", "n_technologies"])
        for year, intensity, n in out_rows:
            writer.writerow([year, f"{intensity:.4f}", n])

    # ---- Sanity checks ----------------------------------------------------
    assert out_rows, "no output rows"
    for year, intensity, n in out_rows:
        assert not math.isnan(intensity), f"NaN intensity at {year}"
        assert n >= MIN_TECHS, f"N_t below floor at {year}"
    years = [r[0] for r in out_rows]
    assert years == sorted(set(years)), "years not unique/sorted"
    n_values = [r[2] for r in out_rows]

    print(f"Wrote {len(out_rows)} rows to {OUTPUT}")
    print(f"Year range: {years[0]}-{years[-1]}")
    print(
        f"N_t: min={min(n_values)}, median={statistics.median(n_values)}, "
        f"max={max(n_values)}"
    )
    sample_years = [1850, 1875, 1900, 1925, 1950, 1975, 2000, 2020]
    print("Sample values (intensity, N_t):")
    for target in sample_years:
        for year, intensity, n in out_rows:
            if year == target:
                print(f"  {year}: {intensity:+.4f}  (N={n})")
                break


if __name__ == "__main__":
    main()
