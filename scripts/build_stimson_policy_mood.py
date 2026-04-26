"""Reproducible build of public/data/stimson_policy_mood.csv.

Downloads James A. Stimson's Policy Mood spreadsheet from his UNC site,
extracts the annual series (the leftmost two columns of the Data sheet:
Year, Annual mood), and writes a clean two-column CSV.

Source: https://stimson.web.unc.edu/data/
Spreadsheet: Mood5224.xlsx (last upstream revision July 2025; covers
1952-2024 annual). The xlsx file packs annual, biennial, and quarterly
series into one wide sheet; we only consume the annual columns.

The CSV is committed to the repo for stability and provenance. Re-run
this script to refresh when Stimson posts a new vintage.
"""

from __future__ import annotations

import csv
import io
import urllib.request
from pathlib import Path

import openpyxl

UPSTREAM_URL = (
    "https://stimson.web.unc.edu/wp-content/uploads/sites/9919/2025/07/Mood5224.xlsx"
)
OUT_PATH = Path(__file__).resolve().parents[1] / "public" / "data" / "stimson_policy_mood.csv"


def fetch_workbook() -> openpyxl.Workbook:
    with urllib.request.urlopen(UPSTREAM_URL) as resp:
        blob = resp.read()
    return openpyxl.load_workbook(io.BytesIO(blob), data_only=True)


def extract_annual(wb: openpyxl.Workbook) -> list[tuple[int, float]]:
    ws = wb["Data"]
    rows: list[tuple[int, float]] = []
    # Row 0 is the section header ("Year","Annual",...); row 1+ are data
    # for the annual series in columns A and B. We stop on the first row
    # whose Year cell is not a real year.
    for raw_year, raw_value, *_ in ws.iter_rows(min_row=2, values_only=True):
        if not isinstance(raw_year, (int, float)):
            continue
        year = int(raw_year)
        if year < 1900 or year > 2100:
            continue
        if not isinstance(raw_value, (int, float)):
            continue
        rows.append((year, float(raw_value)))
    rows.sort(key=lambda r: r[0])
    return rows


def write_csv(rows: list[tuple[int, float]], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(["year", "mood"])
        for year, mood in rows:
            writer.writerow([year, f"{mood:.3f}"])


def main() -> None:
    wb = fetch_workbook()
    rows = extract_annual(wb)
    if not rows:
        raise SystemExit("No annual rows extracted from upstream xlsx.")
    write_csv(rows, OUT_PATH)
    print(f"Wrote {len(rows)} rows ({rows[0][0]}-{rows[-1][0]}) to {OUT_PATH}")


if __name__ == "__main__":
    main()
