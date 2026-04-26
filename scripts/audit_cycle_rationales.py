"""Cos-math audit for every cycle's reference_peak_rationale.

For each year mentioned in `cycles.json[*].reference_peak_rationale`, computes
`cos(2π · (year - reference_peak_year) / period_years)` and prints whether
that year sits at a peak, trough, rising arm, or near-zero — so you can read
the prose alongside the numbers and confirm any year-specific phase claim
matches what the sinusoid actually plots.

Background. Round 4 of the project's external fact-check found that the
Strauss-Howe rationale claimed "2020 is a trough in this construction" when
the math says cos(2π · 65/84) ≈ +0.149 (rising arm). An internal sweep run
right after found a similar issue with Turchin's "(≈1780 → 1930 → 2080)"
parenthetical, where all three years actually evaluate to cos ≈ −0.81 (near
trough), not peaks. Both are the same class of error: prose that asserts a
chart position the chart doesn't plot.

Run before shipping any change to a cycle's rationale, and any time a new
cycle is added:

    python scripts/audit_cycle_rationales.py

The script is read-only. It does not modify any files.
"""

from __future__ import annotations

import json
import math
import re
from pathlib import Path

CYCLES_PATH = Path(__file__).resolve().parents[1] / "src" / "data" / "cycles.json"
YEAR_RE = re.compile(r"\b(1[6-9]\d{2}|20[0-9]{2}|2100)\b")


def phase_label(cos_value: float) -> str:
    if cos_value > 0.95:
        return "PEAK"
    if cos_value > 0.4:
        return "near peak"
    if cos_value > 0.05:
        return "mid (positive)"
    if cos_value > -0.05:
        return "zero-crossing"
    if cos_value > -0.4:
        return "mid (negative)"
    if cos_value > -0.95:
        return "near trough"
    return "TROUGH"


def main() -> None:
    cycles = json.loads(CYCLES_PATH.read_text(encoding="utf-8"))
    print(
        f"{'cycle':<18}{'year':>6}  period  peak    frac      cos    phase"
    )
    print("-" * 88)
    for cycle in cycles:
        cid = cycle["id"]
        period = cycle["period_years"]
        peak_year = cycle["reference_peak_year"]
        rationale = cycle["reference_peak_rationale"]

        years = sorted(
            {int(y) for y in YEAR_RE.findall(rationale) if 1600 <= int(y) <= 2100}
        )
        if not years:
            continue
        for year in years:
            frac = ((year - peak_year) / period) % 1.0
            cos_val = math.cos(2 * math.pi * frac)
            label = phase_label(cos_val)
            print(
                f"{cid:<18}{year:>6}  {period:>6}  {peak_year:>5}  "
                f"{frac:6.3f}  {cos_val:+6.3f}  {label}"
            )
        print()

    print(
        "Read each row alongside the rationale prose. Every year-specific phase\n"
        "claim in the prose should match the cos value here. Citation dates\n"
        "(Schlesinger Sr. 1949, Turchin Nature 2010, etc.) are not phase claims\n"
        "and can sit anywhere on the curve harmlessly."
    )


if __name__ == "__main__":
    main()
