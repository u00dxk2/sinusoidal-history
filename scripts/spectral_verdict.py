"""
Spectral verdict pipeline — pre-registered per docs/specs/spectral-verdict-build-spec.md.

For each of the site's cycle-series pairings, answers: "does this series contain
significant power near the theory's claimed period?" — or, below the eligibility
gate, refuses to answer and says so.

Protocol (frozen; see the spec and scripts/spectral/analysis-manifest.yaml):
  - Eligibility gate BEFORE anything: span / P >= 3.0. Below gate no test runs
    and no code path emits a p-value.
  - Inference: pre-registered harmonic regression at the exact frequency 1/P —
    y_t = b0 + b1*t + A*cos + B*sin + AR(1) errors — likelihood-ratio against
    the same model without the cos/sin pair. Frequencies never fitted or scanned.
  - p-value: parametric bootstrap from the fitted null (99,999 draws final).
  - Sensitivity: everything repeated with an AR(2) null; Holm-adjusted
    disagreement prints MODEL_SENSITIVE.
  - Multiplicity: Holm within each family (primary pairings; cross-grid panel).
  - Estimator (recorded choice): profile Gaussian likelihood maximized on a
    fixed grid — exact/Prais-Winsten for AR(1) (phi in [-0.98, 0.98] step
    0.005), conditional-on-first-two for AR(2) (stationary triangle, step 0.05,
    margin 0.02). The identical grid-maximum estimator is applied to the
    observed series and to every bootstrap draw, so the Monte-Carlo p-value is
    exact for the statistic as defined.
  - Multitaper spectrum (NW=2, K=3) is the descriptive picture only, never the
    verdict.

Usage (from repo root):
    python scripts/spectral_verdict.py --write-manifest   # emit the frozen plan
    python scripts/spectral_verdict.py --selftest         # full test suite
    python scripts/spectral_verdict.py --selftest --fast  # reduced sims
    python scripts/spectral_verdict.py --run --draws 9999 # development run
    python scripts/spectral_verdict.py --run              # final run (99,999)

Dependencies: numpy + scipy only (scipy.signal.windows.dpss, scipy.stats.kstest).
Deterministic given the manifest seed.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import platform
import sys
from pathlib import Path

import numpy as np
from scipy.signal.windows import dpss
from scipy.stats import kstest

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "scripts" / "spectral" / "analysis-manifest.yaml"
OUT_DIR = ROOT / "public" / "data" / "spectral"

# ---------------------------------------------------------------------------
# Frozen analysis plan (single source of truth; --write-manifest emits the YAML,
# the run verifies the committed YAML is byte-identical before doing anything).
# ---------------------------------------------------------------------------

FROZEN_DATE = "2026-08-19"
SEED = 20260819
ALPHA = 0.05
GATE_MIN_PERIODS = 3.0
DRAWS_FINAL = 99999
AR1_GRID_STEP = 0.005
AR1_GRID_MAX = 0.98
AR2_GRID_STEP = 0.05
AR2_MARGIN = 0.02
AR2_BURN_IN = 500

# Inference series. sha256 is of the committed CSV; the run aborts on mismatch
# (data refresh => regenerate manifest, re-run, recommit — AGENTS.md invariant).
SERIES = {
    "stimson_policy_mood": {
        "csv": "public/data/stimson_policy_mood.csv",
        "value_column": "mood",
        "transform": "none",
        "truncate_min_year": None,
        "sampling_interval_years": 1,
        "display_series_id": "stimson_policy_mood",
    },
    "us_tfp_growth_annual": {
        "csv": "public/data/us_tfp_growth_annual.csv",
        "value_column": "dtfp_util_pct",
        "transform": "none",
        "truncate_min_year": None,
        "sampling_interval_years": 1,
        "display_series_id": "us_tfp_growth",
        "lay_name": "US TFP growth (annual, unsmoothed)",
    },
    "perez_tech_diffusion": {
        "csv": "public/data/perez_tech_diffusion.csv",
        "value_column": "tech_diffusion_intensity",
        "transform": "none",
        "truncate_min_year": None,
        "sampling_interval_years": 1,
        "display_series_id": "perez_tech_diffusion",
    },
    "dw_nominate_polarization": {
        "csv": "public/data/dw_nominate.csv",
        "value_column": "house_party_distance",
        "transform": "none",
        "truncate_min_year": None,
        "sampling_interval_years": 2,
        "display_series_id": "dw_nominate_polarization",
    },
    "us_world_gdp_share": {
        "csv": "public/data/us_world_gdp_share.csv",
        "value_column": "us_share_world_gdp_pct",
        "transform": "none",
        "truncate_min_year": None,
        "sampling_interval_years": 1,
        "display_series_id": "us_world_gdp_share",
    },
    "vdem_libdem": {
        "csv": "public/data/vdem_libdem.csv",
        "value_column": "liberal_democracy_index",
        "transform": "none",
        "truncate_min_year": None,
        "sampling_interval_years": 1,
        "display_series_id": "vdem_libdem",
    },
    "leading_power_gdp_share": {
        "csv": "public/data/leading_power_gdp_share.csv",
        "value_column": "leading_power_gdp_share_pct",
        "transform": "none",
        "truncate_min_year": None,
        "sampling_interval_years": 1,
        "display_series_id": "leading_power_gdp_share",
    },
    "conflict_deaths": {
        "csv": "public/data/conflict_deaths.csv",
        "value_column": "deaths_per_100k",
        "transform": "log1p",
        "truncate_min_year": None,
        "sampling_interval_years": 1,
        "display_series_id": "conflict_deaths",
    },
    "wid_top1_wealth_1913": {
        "csv": "public/data/wid_top1_wealth.csv",
        "value_column": "top1_wealth_share_pct",
        "transform": "none",
        # Pre-1913 decadal points are interpolations = low-pass filtering that
        # fabricates power exactly in the 120-150y band. They never count
        # toward N, span, or cycles.
        "truncate_min_year": 1913,
        "sampling_interval_years": 1,
        "display_series_id": "wid_top1_wealth",
        "lay_name": "US top 1% wealth share (1913 onward)",
    },
}

# Primary family: the site's actual pairings (Phase 14 roster;
# turchin_fathers_sons ships unpaired and has no test).
PRIMARY = [
    {"cycle_id": "schlesinger_jr", "period_years": 30, "series_id": "stimson_policy_mood"},
    {"cycle_id": "kondratiev", "period_years": 54, "series_id": "us_tfp_growth_annual"},
    {"cycle_id": "perez", "period_years": 55, "series_id": "perez_tech_diffusion"},
    {"cycle_id": "huntington", "period_years": 60, "series_id": "dw_nominate_polarization"},
    {"cycle_id": "dalio", "period_years": 75, "series_id": "us_world_gdp_share"},
    {"cycle_id": "strauss_howe", "period_years": 84, "series_id": "vdem_libdem"},
    {"cycle_id": "modelski", "period_years": 110, "series_id": "leading_power_gdp_share"},
    {"cycle_id": "khaldun", "period_years": 120, "series_id": "conflict_deaths"},
    {"cycle_id": "turchin", "period_years": 150, "series_id": "wid_top1_wealth_1913"},
]

# Expected gate table from the spec (span, span/P to 2dp). The run recomputes
# from data and aborts on mismatch: CSV drift or a span-definition bug.
EXPECTED_GATE = {
    "schlesinger_jr": (72, 2.40),
    "kondratiev": (77, 1.43),
    "perez": (158, 2.87),
    "huntington": (144, 2.40),
    "dalio": (152, 2.03),
    "strauss_howe": (236, 2.81),
    "modelski": (152, 1.38),
    "khaldun": (211, 1.76),
    "turchin": (111, 0.74),
}

# Cross-grid family: every (P, series) cell with span/P >= 3.0 — re-pairings,
# not the site's claims. Frozen here; the run recomputes eligibility from the
# data and aborts if the computed set differs.
CROSS_GRID = [
    {"period_years": 30, "period_source_cycle_id": "schlesinger_jr", "series_id": s}
    for s in [
        "dw_nominate_polarization", "vdem_libdem", "conflict_deaths",
        "us_world_gdp_share", "leading_power_gdp_share", "wid_top1_wealth_1913",
        "perez_tech_diffusion",
    ]
] + [
    {"period_years": 50, "period_source_cycle_id": "turchin_fathers_sons", "series_id": s}
    for s in [
        "vdem_libdem", "conflict_deaths", "perez_tech_diffusion",
        "us_world_gdp_share", "leading_power_gdp_share",
    ]
] + [
    {"period_years": 54, "period_source_cycle_id": "kondratiev", "series_id": s}
    for s in ["vdem_libdem", "conflict_deaths"]
] + [
    {"period_years": 55, "period_source_cycle_id": "perez", "series_id": s}
    for s in ["vdem_libdem", "conflict_deaths"]
] + [
    {"period_years": 60, "period_source_cycle_id": "huntington", "series_id": s}
    for s in ["vdem_libdem", "conflict_deaths"]
] + [
    {"period_years": 75, "period_source_cycle_id": "dalio", "series_id": "vdem_libdem"},
]

MANIFEST_NOTES = [
    "Band collapse: Kondratiev 54y and Perez 55y differ by 0.000337 cycles/year; "
    "separating them needs a ~3,000-year record. No verdict text may discriminate "
    "the two — every 54y or 55y result is presented as one ~54-55-year band.",
    "HATCH (perez_tech_diffusion) standing caveat: the composite is built from "
    "5-year log-changes, a difference filter with |H(f)|^2 = 4*sin^2(5*pi*f), "
    "~0.32 at f = 1/55. It fails the gate this round (2.87 of 3.0 periods); if "
    "future HATCH releases push span past 165y, the transfer function must be "
    "disclosed alongside any verdict and the AR null fit on the same filtered object.",
    "dw_nominate_polarization is biennial (one obs per Congress). Cosine "
    "regressors use exact calendar years; the AR null is fitted on the "
    "observation grid, so its phi is a 2-year autocorrelation.",
    "TFP inference uses the UNSMOOTHED annual dtfp_util "
    "(us_tfp_growth_annual.csv). The smoothed display CSV "
    "(us_tfp_growth.csv) is banned from inference: the 5-yr MA barely "
    "attenuates the 54-55y band but reddens the spectrum and corrupts the AR fit.",
    "AR(1) draws use the exact stationary initial state; AR(2) draws use a "
    f"{AR2_BURN_IN}-step burn-in. AR(1) likelihood is exact (Prais-Winsten); "
    "AR(2) likelihood is conditional on the first two observations.",
]


# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def sha256_file(path: Path) -> str:
    # LF-normalized so the freeze check is independent of git's autocrlf
    # checkout translation (this repo has mixed on-disk endings on Windows).
    return hashlib.sha256(path.read_bytes().replace(b"\r\n", b"\n")).hexdigest()


def load_series(series_id: str) -> tuple[np.ndarray, np.ndarray]:
    """Return (years, values) for the inference series: transform and
    truncation applied, continuity at the declared sampling interval asserted."""
    spec = SERIES[series_id]
    path = ROOT / spec["csv"]
    years, values = [], []
    with path.open(encoding="utf-8") as f:
        for row in csv.DictReader(f):
            v = row[spec["value_column"]]
            if v in ("", "NA"):
                continue
            years.append(int(row["year"]))
            values.append(float(v))
    years = np.array(years)
    values = np.array(values, dtype=float)
    order = np.argsort(years)
    years, values = years[order], values[order]
    tmin = spec["truncate_min_year"]
    if tmin is not None:
        keep = years >= tmin
        years, values = years[keep], values[keep]
        assert years.min() >= tmin, f"{series_id}: truncation failed"
    if spec["transform"] == "log1p":
        values = np.log1p(values)
    dt = spec["sampling_interval_years"]
    diffs = np.diff(years)
    assert (diffs == dt).all(), (
        f"{series_id}: not evenly sampled at {dt}y (found intervals "
        f"{sorted(set(diffs.tolist()))})"
    )
    return years, values


def load_site_json(name: str) -> list[dict]:
    return json.loads((ROOT / "src" / "data" / name).read_text(encoding="utf-8"))


# ---------------------------------------------------------------------------
# Likelihood machinery
# ---------------------------------------------------------------------------

def ar1_grid() -> np.ndarray:
    n = int(round(2 * AR1_GRID_MAX / AR1_GRID_STEP)) + 1
    return np.linspace(-AR1_GRID_MAX, AR1_GRID_MAX, n)


def ar2_grid() -> np.ndarray:
    """(m, 2) array of (phi1, phi2) on the stationary triangle with margin."""
    p1s = np.arange(-1.95, 1.9501, AR2_GRID_STEP)
    p2s = np.arange(-0.95, 0.9501, AR2_GRID_STEP)
    out = []
    lim = 1.0 - AR2_MARGIN
    for p1 in p1s:
        for p2 in p2s:
            if p1 + p2 < lim and p2 - p1 < lim and abs(p2) < lim:
                out.append((p1, p2))
    return np.array(out)


def design(years: np.ndarray, period: float | None) -> np.ndarray:
    """[1, t, (cos, sin at exact 1/P)] — t normalized for conditioning only."""
    t = (years - years.mean()) / (years.max() - years.min())
    cols = [np.ones(len(years)), t]
    if period is not None:
        w = 2.0 * np.pi * years / period
        cols += [np.cos(w), np.sin(w)]
    return np.column_stack(cols)


def _ssr_all(Xw: np.ndarray, Yw: np.ndarray) -> np.ndarray:
    """Residual sum of squares of Yw (n,N) on Xw (n,k), per column."""
    Q, _ = np.linalg.qr(Xw)
    qy = Q.T @ Yw
    ssr = np.einsum("ij,ij->j", Yw, Yw) - np.einsum("ij,ij->j", qy, qy)
    return np.maximum(ssr, 1e-300)


def ar1_ll_max(X: np.ndarray, Y: np.ndarray) -> np.ndarray:
    """Exact (Prais-Winsten) profile log-likelihood, maximized over the phi
    grid, for each column of Y (n, N). Constants independent of the model
    are dropped (they cancel in the LRT)."""
    n = X.shape[0]
    best = np.full(Y.shape[1], -np.inf)
    Xw = np.empty_like(X)
    Yw = np.empty_like(Y)
    for phi in ar1_grid():
        w = math.sqrt(1.0 - phi * phi)
        Xw[0] = X[0] * w
        Yw[0] = Y[0] * w
        np.subtract(X[1:], phi * X[:-1], out=Xw[1:])
        np.subtract(Y[1:], phi * Y[:-1], out=Yw[1:])
        ssr = _ssr_all(Xw, Yw)
        ll = 0.5 * math.log(1.0 - phi * phi) - 0.5 * n * np.log(ssr / n)
        np.maximum(best, ll, out=best)
    return best


def ar2_ll_max(X: np.ndarray, Y: np.ndarray) -> np.ndarray:
    """Conditional (on first two obs) profile log-likelihood, maximized over
    the (phi1, phi2) grid, for each column of Y."""
    n = X.shape[0]
    m = n - 2
    best = np.full(Y.shape[1], -np.inf)
    for p1, p2 in ar2_grid():
        Xw = X[2:] - p1 * X[1:-1] - p2 * X[:-2]
        Yw = Y[2:] - p1 * Y[1:-1] - p2 * Y[:-2]
        ssr = _ssr_all(Xw, Yw)
        ll = -0.5 * m * np.log(ssr / m)
        np.maximum(best, ll, out=best)
    return best


def fit_null_params(X: np.ndarray, y: np.ndarray, ar_order: int) -> dict:
    """Grid-max null fit on the observed series, returning the simulation
    parameters (beta, AR coefficients, innovation variance)."""
    n = X.shape[0]
    Y = y[:, None]
    best = {"ll": -np.inf}
    if ar_order == 1:
        for phi in ar1_grid():
            w = math.sqrt(1.0 - phi * phi)
            Xw = np.vstack([X[0] * w, X[1:] - phi * X[:-1]])
            yw = np.concatenate([[y[0] * w], y[1:] - phi * y[:-1]])
            beta, *_ = np.linalg.lstsq(Xw, yw, rcond=None)
            ssr = float(((yw - Xw @ beta) ** 2).sum())
            ll = 0.5 * math.log(1.0 - phi * phi) - 0.5 * n * math.log(max(ssr, 1e-300) / n)
            if ll > best["ll"]:
                best = {"ll": ll, "phi": (phi,), "beta": beta, "sigma2": ssr / n}
    else:
        m = n - 2
        for p1, p2 in ar2_grid():
            Xw = X[2:] - p1 * X[1:-1] - p2 * X[:-2]
            yw = y[2:] - p1 * y[1:-1] - p2 * y[:-2]
            beta, *_ = np.linalg.lstsq(Xw, yw, rcond=None)
            ssr = float(((yw - Xw @ beta) ** 2).sum())
            ll = -0.5 * m * math.log(max(ssr, 1e-300) / m)
            if ll > best["ll"]:
                best = {"ll": ll, "phi": (p1, p2), "beta": beta, "sigma2": ssr / m}
    return best


def simulate_ar(n: int, draws: int, phi: tuple, sigma: float,
                rng: np.random.Generator) -> np.ndarray:
    """(n, draws) noise matrix. AR(1): exact stationary initial state.
    AR(2): burn-in of AR2_BURN_IN steps."""
    if len(phi) == 1:
        (p,) = phi
        e = rng.standard_normal((n, draws)) * sigma
        out = np.empty((n, draws))
        out[0] = e[0] / math.sqrt(1.0 - p * p)
        for t in range(1, n):
            out[t] = p * out[t - 1] + e[t]
        return out
    p1, p2 = phi
    total = n + AR2_BURN_IN
    e = rng.standard_normal((total, draws)) * sigma
    prev1 = np.zeros(draws)
    prev2 = np.zeros(draws)
    out = np.empty((n, draws))
    for t in range(total):
        cur = p1 * prev1 + p2 * prev2 + e[t]
        if t >= AR2_BURN_IN:
            out[t - AR2_BURN_IN] = cur
        prev2 = prev1
        prev1 = cur
    return out


def lrt(years: np.ndarray, Y: np.ndarray, period: float, ar_order: int) -> np.ndarray:
    """LRT statistic (full vs null) for each column of Y, grid-max MLE."""
    X_null = design(years, None)
    X_full = design(years, period)
    ll_max = ar1_ll_max if ar_order == 1 else ar2_ll_max
    return 2.0 * (ll_max(X_full, Y) - ll_max(X_null, Y))


def bootstrap_p(years: np.ndarray, y: np.ndarray, period: float, ar_order: int,
                draws: int, rng: np.random.Generator) -> dict:
    """Parametric-bootstrap p for the harmonic-regression LRT at exact 1/P."""
    X_null = design(years, None)
    fit = fit_null_params(X_null, y, ar_order)
    lrt_obs = float(lrt(years, y[:, None], period, ar_order)[0])
    noise = simulate_ar(len(years), draws, fit["phi"], math.sqrt(fit["sigma2"]), rng)
    Ystar = (X_null @ fit["beta"])[:, None] + noise
    lrt_star = lrt(years, Ystar, period, ar_order)
    p = (1.0 + int((lrt_star >= lrt_obs).sum())) / (draws + 1.0)
    return {"p": p, "lrt_obs": lrt_obs, "phi": fit["phi"], "sigma2": fit["sigma2"]}


def holm(pvals: list[float], alpha: float) -> list[bool]:
    """Holm step-down; returns per-test significance flags."""
    m = len(pvals)
    order = sorted(range(m), key=lambda i: pvals[i])
    sig = [False] * m
    for rank, idx in enumerate(order):
        if pvals[idx] <= alpha / (m - rank):
            sig[idx] = True
        else:
            break
    return sig


# ---------------------------------------------------------------------------
# Multitaper spectrum (descriptive only — never the verdict)
# ---------------------------------------------------------------------------

def mtm_spectrum(y: np.ndarray, dt: float) -> tuple[np.ndarray, np.ndarray]:
    """Average of K=3 eigenspectra at NW=2, on a linearly detrended series.
    Returns (freqs in cycles/year, relative power)."""
    n = len(y)
    t = np.arange(n, dtype=float)
    coef = np.polyfit(t, y, 1)
    resid = y - np.polyval(coef, t)
    tapers = dpss(n, NW=2, Kmax=3)
    nfft = 1
    while nfft < 4 * n:
        nfft *= 2
    spec = np.zeros(nfft // 2 + 1)
    for k in range(tapers.shape[0]):
        spec += np.abs(np.fft.rfft(tapers[k] * resid, nfft)) ** 2
    spec /= tapers.shape[0]
    freqs = np.fft.rfftfreq(nfft, d=dt)
    return freqs, spec


# ---------------------------------------------------------------------------
# Manifest emission / verification
# ---------------------------------------------------------------------------

def manifest_text() -> str:
    lines = [
        "# analysis-manifest.yaml — pre-registered spectral-verdict analysis plan.",
        "# Generated by scripts/spectral_verdict.py --write-manifest; the run",
        "# verifies this file is byte-identical to the plan frozen in the script",
        "# and records this file's sha256 in every output. Committed BEFORE results.",
        "schema: spectral-verdict/1",
        f"frozen: {FROZEN_DATE}",
        f"alpha: {ALPHA}",
        f"gate_min_periods: {GATE_MIN_PERIODS}",
        f"seed: {SEED}",
        f"draws_final: {DRAWS_FINAL}",
        "ar_orders: [1, 2]",
        "frequency_mode: exact  # 1/P from cycles.json period_years, never fitted or scanned",
        "trend_model: linear",
        "estimator: >-",
        "  Profile Gaussian likelihood maximized on a fixed grid, LRT of the",
        "  cos/sin pair at exactly 1/P over intercept+trend. AR(1): exact",
        f"  Prais-Winsten likelihood, phi in [-{AR1_GRID_MAX}, {AR1_GRID_MAX}] step {AR1_GRID_STEP}.",
        "  AR(2): likelihood conditional on the first two observations,",
        f"  (phi1, phi2) on the stationary triangle at step {AR2_GRID_STEP}, margin {AR2_MARGIN}.",
        "  The identical grid-maximum estimator is applied to the observed series",
        "  and to every bootstrap draw. p = (1 + #{LRT* >= LRT_obs}) / (draws + 1).",
        "holm_families: [primary, cross_grid]",
        "series:",
    ]
    for sid, s in SERIES.items():
        lines += [
            f"  - id: {sid}",
            f"    csv: {s['csv']}",
            f"    sha256: {sha256_file(ROOT / s['csv'])}",
            "    year_column: year",
            f"    value_column: {s['value_column']}",
            f"    transform: {s['transform']}",
            f"    truncate_min_year: {s['truncate_min_year'] if s['truncate_min_year'] else 'null'}",
            f"    sampling_interval_years: {s['sampling_interval_years']}",
        ]
    lines.append("primary:  # the site's actual pairings; gate expected to fail all 9")
    for t in PRIMARY:
        lines.append(
            f"  - {{cycle_id: {t['cycle_id']}, period_years: {t['period_years']}, "
            f"series_id: {t['series_id']}}}"
        )
    lines.append("cross_grid:  # re-pairings, not the site's claims; every cell with span/P >= gate")
    for t in CROSS_GRID:
        lines.append(
            f"  - {{period_years: {t['period_years']}, "
            f"period_source_cycle_id: {t['period_source_cycle_id']}, "
            f"series_id: {t['series_id']}}}"
        )
    lines.append("notes:")
    for note in MANIFEST_NOTES:
        lines.append(f"  - >-")
        lines.append(f"    {note}")
    return "\n".join(lines) + "\n"


def verify_manifest() -> str:
    """Abort unless the committed manifest matches the frozen plan; return its sha256."""
    expected = manifest_text()
    on_disk = MANIFEST_PATH.read_text(encoding="utf-8")
    if on_disk != expected:
        sys.exit(
            "FATAL: scripts/spectral/analysis-manifest.yaml does not match the "
            "plan frozen in spectral_verdict.py. If data was refreshed or the "
            "plan changed, re-run --write-manifest, commit it, then re-run."
        )
    return hashlib.sha256(on_disk.encode("utf-8")).hexdigest()


# ---------------------------------------------------------------------------
# Verdicts
# ---------------------------------------------------------------------------

def gate_row(period: int, years: np.ndarray) -> dict:
    span = int(years.max() - years.min())
    covered = span / period
    return {"span_years": span, "cycles_covered": round(covered, 2),
            "eligible": covered >= GATE_MIN_PERIODS}


def fmt_p(p: float) -> str:
    return "< 0.0001" if p < 0.0001 else f"{p:.4f}"


BAND_COLLAPSE = (
    " At this record length a 54-year and a 55-year period are indistinguishable"
    " (they differ by 0.000337 cycles per year), so read this as one result for"
    " the ~54–55-year band, not as separating Kondratiev from Perez."
)


def lay_text(row: dict, series_name: str, m: int, draws: int, cross: bool) -> str:
    period = row["period_years"]
    if row["state"] == "INSUFFICIENT_DATA":
        return (
            f"The {series_name} record spans {row['span_years']} years — "
            f"{row['cycles_covered']:.1f} of the 3.0 full periods this site requires "
            f"before testing a {period}-year claim. No test was run and no p-value "
            f"exists: the honest verdict is that the record is too short to test "
            f"the claim at all."
        )
    prefix = (
        f"Re-pairing, not the site's claim: this cell tests the {period}-year "
        f"period against {series_name}. " if cross else ""
    )
    band = BAND_COLLAPSE if period in (54, 55) else ""
    if row["state"] == "NO_SIGNIFICANT_TARGET_POWER":
        return (
            f"{prefix}Harmonic regression at the exact {period}-year period finds no "
            f"significant power above an AR(1) red-noise null (p = {fmt_p(row['p'])}, "
            f"{draws:,} bootstrap draws, Holm-corrected within a family of {m} tests); "
            f"an AR(2) null agrees (p = {fmt_p(row['p_ar2'])})." + band
        )
    if row["state"] == "MODEL_SENSITIVE":
        return (
            f"{prefix}The AR(1) and AR(2) red-noise nulls disagree at the "
            f"Holm-adjusted threshold (p = {fmt_p(row['p'])} vs "
            f"p = {fmt_p(row['p_ar2'])}), so no verdict is claimed either way; "
            f"the result depends on the noise model." + band
        )
    return (
        f"{prefix}Harmonic regression at the exact {period}-year period finds "
        f"significant power above both AR(1) and AR(2) red-noise nulls "
        f"(p = {fmt_p(row['p'])} and p = {fmt_p(row['p_ar2'])}, Holm-corrected "
        f"within a family of {m} tests). Significant target-band power is not "
        f"confirmation of the theory's mechanism." + band
    )


def run_analysis(draws: int, verify: bool = True, progress: bool = True,
                 checkpoint: Path | None = None) -> dict:
    """The whole pre-registered analysis. Returns the verdicts object.

    checkpoint: optional JSONL file recording each completed cell. Because
    every cell seeds its own RNG from (SEED, family, cell_idx, order), a
    resumed run is byte-identical to a straight-through run — checkpointing
    changes no number, it only survives restarts. Records are reused only if
    manifest sha AND draws match. Not used by the selftest (its determinism
    check must recompute)."""
    # Input-CSV shas are embedded in manifest_text(), so the byte-identity
    # check below also pins every input file to its frozen checksum.
    manifest_sha = verify_manifest() if verify else hashlib.sha256(
        manifest_text().encode("utf-8")).hexdigest()

    data = {sid: load_series(sid) for sid in SERIES}
    series_meta = {s["id"]: s for s in load_site_json("series.json")}
    cycles_meta = {c["id"]: c for c in load_site_json("cycles.json")}

    # cycles.json cross-check: pairing periods must match the frozen plan
    for t in PRIMARY:
        assert cycles_meta[t["cycle_id"]]["period_years"] == t["period_years"], (
            f"{t['cycle_id']}: cycles.json period differs from frozen manifest "
            f"— update the manifest and re-run (AGENTS.md invariant)"
        )

    # --- primary family: gate first, expected to fail everywhere -----------
    primary_rows = []
    for t in PRIMARY:
        years, _ = data[t["series_id"]]
        g = gate_row(t["period_years"], years)
        exp_span, exp_ratio = EXPECTED_GATE[t["cycle_id"]]
        if g["span_years"] != exp_span or abs(g["cycles_covered"] - exp_ratio) > 0.005:
            sys.exit(
                f"FATAL: {t['cycle_id']} gate mismatch vs spec table: computed "
                f"span {g['span_years']} ({g['cycles_covered']}) expected "
                f"{exp_span} ({exp_ratio}). CSV drift or span-definition bug."
            )
        primary_rows.append({**t, **g})

    # --- cross-grid eligibility must equal the frozen list -----------------
    computed = []
    periods = sorted({t["period_years"] for t in PRIMARY} | {50})
    for period in periods:
        for sid in SERIES:
            years, _ = data[sid]
            if gate_row(period, years)["eligible"]:
                computed.append((period, sid))
    frozen = [(t["period_years"], t["series_id"]) for t in CROSS_GRID]
    if sorted(computed) != sorted(frozen):
        sys.exit(
            "FATAL: computed cross-grid eligibility differs from the frozen "
            f"manifest list.\ncomputed: {sorted(computed)}\nfrozen: {sorted(frozen)}"
        )

    # --- run tests: only eligible cells ever reach bootstrap_p -------------
    ckpt: dict[tuple[int, int], dict] = {}
    if checkpoint is not None and checkpoint.exists():
        for line in checkpoint.read_text(encoding="utf-8").splitlines():
            rec = json.loads(line)
            if rec["manifest_sha256"] == manifest_sha and rec["draws"] == draws:
                ckpt[(rec["family"], rec["cell_idx"])] = rec["out"]
        if ckpt and progress:
            print(f"  resuming: {len(ckpt)} cells from {checkpoint.name}")

    def run_cell(cell_idx: int, family: int, period: int, sid: str) -> dict:
        if (family, cell_idx) in ckpt:
            return dict(ckpt[(family, cell_idx)])
        years, y = data[sid]
        out = {}
        for order in (1, 2):
            rng = np.random.default_rng([SEED, family, cell_idx, order])
            res = bootstrap_p(years, y, period, order, draws, rng)
            key = "" if order == 1 else "_ar2"
            out[f"p{key}"] = round(res["p"], 6)
            out[f"lrt{key}"] = round(res["lrt_obs"], 4)
            out[f"phi{key}"] = [round(v, 3) for v in res["phi"]]
        if checkpoint is not None:
            checkpoint.parent.mkdir(parents=True, exist_ok=True)
            with checkpoint.open("a", encoding="utf-8", newline="\n") as f:
                f.write(json.dumps({
                    "manifest_sha256": manifest_sha, "draws": draws,
                    "family": family, "cell_idx": cell_idx, "out": out,
                }) + "\n")
        return out

    # primary: expected zero eligible cells; loop is the honest general form
    tested_primary = [r for r in primary_rows if r["eligible"]]
    for i, r in enumerate(tested_primary):
        if progress:
            print(f"  primary {r['cycle_id']} (P={r['period_years']}) ...", flush=True)
        r.update(run_cell(i, 0, r["period_years"], r["series_id"]))

    cross_rows = []
    for i, t in enumerate(CROSS_GRID):
        years, _ = data[t["series_id"]]
        g = gate_row(t["period_years"], years)
        assert g["eligible"]
        if progress:
            print(f"  cross-grid P={t['period_years']} x {t['series_id']} ...", flush=True)
        row = {**t, **g}
        row.update(run_cell(i, 1, t["period_years"], t["series_id"]))
        cross_rows.append(row)

    # --- Holm within each family, states, lay text -------------------------
    def finalize(rows: list[dict], family: str, cross: bool) -> None:
        tested = [r for r in rows if r["eligible"]]
        m = len(tested)
        if m:
            sig1 = holm([r["p"] for r in tested], ALPHA)
            sig2 = holm([r["p_ar2"] for r in tested], ALPHA)
            for r, s1, s2 in zip(tested, sig1, sig2):
                r["holm_significant"] = s1
                r["holm_significant_ar2"] = s2
                if s1 != s2:
                    r["state"] = "MODEL_SENSITIVE"
                elif s1:
                    r["state"] = "SIGNIFICANT_TARGET_POWER"
                else:
                    r["state"] = "NO_SIGNIFICANT_TARGET_POWER"
        for r in rows:
            if not r["eligible"]:
                r["state"] = "INSUFFICIENT_DATA"
                for k in ("p", "p_ar2", "lrt", "lrt_ar2", "phi", "phi_ar2"):
                    r[k] = None
                r["holm_significant"] = None
                r["holm_significant_ar2"] = None
            r["holm_family"] = family
            sid = r["series_id"]
            spec = SERIES[sid]
            name = spec.get("lay_name") or series_meta[spec["display_series_id"]]["name"]
            r["lay_text"] = lay_text(r, name, m, draws, cross)

    finalize(primary_rows, "primary", cross=False)
    finalize(cross_rows, "cross_grid", cross=True)

    eligible_primary = sum(r["eligible"] for r in primary_rows)
    verdicts = {
        "$schema": "spectral-verdict/1",
        "generated": FROZEN_DATE,
        "manifest": "scripts/spectral/analysis-manifest.yaml",
        "manifest_sha256": manifest_sha,
        "seed": SEED,
        "draws": draws,
        "alpha": ALPHA,
        "gate_min_periods": GATE_MIN_PERIODS,
        "versions": {
            "python": platform.python_version(),
            "numpy": np.__version__,
            "scipy": __import__("scipy").__version__,
        },
        "headline": {
            "eligible_primary": eligible_primary,
            "total_primary": len(primary_rows),
            "text": (
                f"{eligible_primary} of the {len(primary_rows)} paired "
                f"constructions reach the {GATE_MIN_PERIODS}-period eligibility "
                f"gate for a spectral test."
            ),
        },
        "primary": [strip_row(r) for r in primary_rows],
        "cross_grid": [strip_row(r) for r in cross_rows],
    }
    return verdicts


ROW_KEYS = [
    "cycle_id", "period_source_cycle_id", "period_years", "series_id",
    "span_years", "cycles_covered", "eligible", "state", "p", "p_ar2",
    "lrt", "lrt_ar2", "phi", "phi_ar2", "holm_family", "holm_significant",
    "holm_significant_ar2", "lay_text",
]


def strip_row(r: dict) -> dict:
    return {k: r[k] for k in ROW_KEYS if k in r}


def verdicts_json(verdicts: dict) -> str:
    return json.dumps(verdicts, indent=2, ensure_ascii=False) + "\n"


# ---------------------------------------------------------------------------
# SVG figures (one per primary pairing)
# ---------------------------------------------------------------------------

W, H = 900, 500
INK, SOFT, RULE = "#2b2926", "#6b675f", "#c9c4b8"


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def polyline(xs, ys, color, width=1.6, dash=None, opacity=1.0) -> str:
    pts = " ".join(f"{x:.1f},{y:.1f}" for x, y in zip(xs, ys))
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (
        f'<polyline points="{pts}" fill="none" stroke="{color}" '
        f'stroke-width="{width}" stroke-linejoin="round" opacity="{opacity}"{d}/>'
    )


def text(x, y, s, size=12, color=SOFT, anchor="start", mono=True, weight="normal") -> str:
    fam = "ui-monospace, Menlo, Consolas, monospace" if mono else "system-ui, sans-serif"
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{fam}" font-size="{size}" '
        f'fill="{color}" text-anchor="{anchor}" font-weight="{weight}">{esc(s)}</text>'
    )


def figure_svg(row: dict, cycle: dict, display_series: dict,
               years: np.ndarray, y: np.ndarray, dt: float) -> str:
    period = row["period_years"]
    gated = not row["eligible"]

    # Panel geometry
    ax_l, ax_r = 55, W - 25
    a_top, a_bot = 64, 218          # series panel
    b_top, b_bot = 296, 430         # spectrum panel

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
        f'font-family="system-ui, sans-serif">',
        f"<title>{esc(cycle['name'])} — spectral verdict</title>",
        text(ax_l, 28, f"{cycle['name']}", size=16, color=INK, mono=False, weight="600"),
        text(ax_l, 46,
             f"vs {SERIES[row['series_id']].get('lay_name') or display_series['name']}"
             f" · target period {period} years",
             size=12, color=SOFT, mono=False),
    ]

    # --- Panel A: series + display cosine ---------------------------------
    y0, y1 = float(y.min()), float(y.max())
    pad = 0.06 * (y1 - y0 or 1.0)
    lo, hi = y0 - pad, y1 + pad
    sx = lambda yr: ax_l + (yr - years[0]) / (years[-1] - years[0]) * (ax_r - ax_l)
    sy = lambda v: a_bot - (v - lo) / (hi - lo) * (a_bot - a_top)
    cos_vals = np.cos(2 * np.pi * (years - cycle["reference_peak_year"]) / period)
    cos_scaled = lo + (cos_vals + 1) / 2 * (hi - lo)
    parts += [
        f'<line x1="{ax_l}" y1="{a_bot}" x2="{ax_r}" y2="{a_bot}" stroke="{RULE}" stroke-width="1"/>',
        polyline([sx(v) for v in years], [sy(v) for v in cos_scaled],
                 cycle["color"], width=1.2, dash="4 4", opacity=0.7),
        polyline([sx(v) for v in years], [sy(v) for v in y],
                 display_series["color"], width=1.6),
        text(ax_l, a_bot + 16, str(int(years[0]))),
        text(ax_r, a_bot + 16, str(int(years[-1])), anchor="end"),
        text(ax_r, a_top - 8,
             f"series (solid) · {period}y reference cosine (dashed, rescaled)",
             size=11, anchor="end", mono=False),
    ]

    # --- Panel B: multitaper spectrum --------------------------------------
    freqs, spec = mtm_spectrum(y, dt)
    f_target = 1.0 / period
    f_span = 1.0 / row["span_years"]
    f_max = min(freqs[-1], 3.5 / period)
    keep = (freqs > 0) & (freqs <= f_max)
    fx, fy = freqs[keep], spec[keep]
    logp = np.log10(np.maximum(fy / fy.max(), 1e-6))
    lp_lo = max(float(logp.min()), -5.0)
    bx = lambda f: ax_l + f / f_max * (ax_r - ax_l)
    by = lambda v: b_bot - (max(v, lp_lo) - lp_lo) / (0 - lp_lo) * (b_bot - b_top)
    parts += [
        f'<line x1="{ax_l}" y1="{b_bot}" x2="{ax_r}" y2="{b_bot}" stroke="{RULE}" stroke-width="1"/>',
        # region below the record's own frequency resolution
        f'<rect x="{ax_l}" y="{b_top}" width="{bx(min(f_span, f_max)) - ax_l:.1f}" '
        f'height="{b_bot - b_top}" fill="{RULE}" opacity="0.25"/>',
        polyline([bx(f) for f in fx], [by(v) for v in logp], INK, width=1.3),
        # target-frequency marker
        f'<line x1="{bx(f_target):.1f}" y1="{b_top - 6}" x2="{bx(f_target):.1f}" '
        f'y2="{b_bot}" stroke="{cycle["color"]}" stroke-width="1.4" stroke-dasharray="3 3"/>',
        text(bx(f_target) + 5, b_top + 6, f"target: {period}y", size=11,
             color=cycle["color"]),
        text(ax_l, b_top - 14,
             "multitaper spectrum (NW=2, K=3), log power — descriptive only",
             size=11, mono=False),
        text(ax_l + 4, b_bot - 6, "below record resolution", size=10, color=SOFT),
        text(ax_l, b_bot + 16, "longer periods", size=10),
        text(ax_r, b_bot + 16, "shorter periods", size=10, anchor="end"),
    ]
    # period tick labels
    for mult in (2.0, 1.0, 0.5):
        f = mult / period
        if 0 < f <= f_max:
            parts += [
                f'<line x1="{bx(f):.1f}" y1="{b_bot}" x2="{bx(f):.1f}" y2="{b_bot + 4}" '
                f'stroke="{SOFT}" stroke-width="1"/>',
                text(bx(f), b_bot + 28, f"{period / mult:.0f}y", size=10, anchor="middle"),
            ]

    # --- gated banner (never a significance line on gated figures) ---------
    if gated:
        parts += [
            f'<rect x="{ax_l}" y="{b_top - 46}" width="{ax_r - ax_l}" height="24" '
            f'fill="#8a2b20" opacity="0.08"/>',
            text((ax_l + ax_r) / 2, b_top - 30,
                 f"INSUFFICIENT SPAN — {row['cycles_covered']:.1f} OF "
                 f"{GATE_MIN_PERIODS:.1f} REQUIRED PERIODS",
                 size=13, color="#8a2b20", anchor="middle", weight="600"),
        ]

    parts.append(text(ax_l, H - 14,
                      "sinusoidal history · spectral verdict · see /methods",
                      size=10))
    parts.append("</svg>")
    return "\n".join(parts) + "\n"


def write_figures(verdicts: dict) -> None:
    cycles_meta = {c["id"]: c for c in load_site_json("cycles.json")}
    series_meta = {s["id"]: s for s in load_site_json("series.json")}
    for row in verdicts["primary"]:
        cycle = cycles_meta[row["cycle_id"]]
        spec = SERIES[row["series_id"]]
        display = series_meta[spec["display_series_id"]]
        years, y = load_series(row["series_id"])
        svg = figure_svg(row, cycle, display, years, y,
                         float(spec["sampling_interval_years"]))
        (OUT_DIR / f"{row['cycle_id']}.svg").write_text(
            svg, encoding="utf-8", newline="\n")


# ---------------------------------------------------------------------------
# Self-test suite
# ---------------------------------------------------------------------------

def _sim_pipeline_p(rng, n, period, phi, amp=0.0, inject_period=None, draws=199):
    """Simulate trend+AR(1)(+optional sinusoid) data, return the AR(1) bootstrap p."""
    years = np.arange(1800, 1800 + n)
    X = design(years, None)
    noise = simulate_ar(n, 1, (phi,), 1.0, rng)[:, 0]
    y = 0.3 + 0.002 * np.arange(n) + noise
    if amp:
        ip = inject_period or period
        y = y + amp * np.cos(2 * np.pi * years / ip + 0.7)
    return bootstrap_p(years, y, period, 1, draws, rng)["p"]


def selftest(fast: bool) -> None:
    failures = []

    def check(name, ok, detail=""):
        print(f"  [{'PASS' if ok else 'FAIL'}] {name} {detail}")
        if not ok:
            failures.append(name)

    n, period = 200, 40
    sims = 100 if fast else 500

    # 1. Null calibration: bootstrap p ~ Uniform(0,1) under trend+AR(1) nulls
    for phi in (0.3, 0.6, 0.9):
        rng = np.random.default_rng([SEED, 90, int(phi * 10)])
        ps = [_sim_pipeline_p(rng, n, period, phi) for _ in range(sims)]
        ks = kstest(ps, "uniform")
        check(f"null calibration AR(1) phi={phi}", ks.pvalue > 0.01,
              f"KS p={ks.pvalue:.3f} (n={sims})")

    # 1b. AR(2)-null leg calibration spot check (phi2=0 nests AR(1))
    sims2 = 40 if fast else 200
    rng = np.random.default_rng([SEED, 91])
    ps = []
    years = np.arange(1800, 1800 + n)
    for _ in range(sims2):
        noise = simulate_ar(n, 1, (0.6,), 1.0, rng)[:, 0]
        y = 0.3 + 0.002 * np.arange(n) + noise
        ps.append(bootstrap_p(years, y, period, 2, 199, rng)["p"])
    ks = kstest(ps, "uniform")
    check("null calibration AR(2) leg phi=0.6", ks.pvalue > 0.01,
          f"KS p={ks.pvalue:.3f} (n={sims2})")

    # 2. Signal injection: amplitude set for theoretical power ~0.8 at alpha=0.05
    phi, lam = 0.6, 9.6
    f = 1.0 / period
    sf = 1.0 / abs(1.0 - phi * np.exp(-2j * np.pi * f)) ** 2
    amp = math.sqrt(2 * lam * sf / n)
    rng = np.random.default_rng([SEED, 92])
    rej = sum(_sim_pipeline_p(rng, n, period, phi, amp=amp) <= ALPHA
              for _ in range(sims)) / sims
    check("signal injection power", rej >= 0.70,
          f"rejection {rej:.2f} (theoretical ~0.8)")

    # 3. Off-target rejection: signal at 25y must not fire at the 50y test
    rng = np.random.default_rng([SEED, 93])
    rej = sum(_sim_pipeline_p(rng, n, 50, phi, amp=amp, inject_period=25) <= ALPHA
              for _ in range(sims)) / sims
    check("off-target rejection", rej <= 0.10, f"false-fire rate {rej:.2f}")

    # 4. Filter-regression trap: the smoothed TFP CSV is banned from inference
    paths = [s["csv"] for s in SERIES.values()]
    check("smoothed TFP never used",
          "public/data/us_tfp_growth.csv" not in paths
          and "public/data/us_tfp_growth_annual.csv" in paths)

    # 5. Interpolation gate: WID inference series starts at/after 1913
    years_w, _ = load_series("wid_top1_wealth_1913")
    check("WID inference starts >= 1913", int(years_w.min()) >= 1913,
          f"min year {int(years_w.min())}")

    # 6-8. Real-manifest run at tiny draws: gate enforcement, Holm, determinism
    v1 = run_analysis(draws=49, verify=MANIFEST_PATH.exists(), progress=False)
    v2 = run_analysis(draws=49, verify=MANIFEST_PATH.exists(), progress=False)
    gated_ok = all(r["p"] is None and r["p_ar2"] is None
                   for r in v1["primary"] if not r["eligible"])
    check("gate enforcement: no p below gate", gated_ok)
    check("expected headline: 0 of 9 primary eligible",
          v1["headline"]["eligible_primary"] == 0)

    tested = [r for r in v1["cross_grid"] if r["eligible"]]
    hand = holm([r["p"] for r in tested], ALPHA)
    check("Holm cross-check (hand recompute)",
          hand == [r["holm_significant"] for r in tested])

    check("determinism: identical JSON", verdicts_json(v1) == verdicts_json(v2))

    print()
    if failures:
        sys.exit(f"SELFTEST FAILED: {failures}")
    print("SELFTEST PASSED")


# ---------------------------------------------------------------------------

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[1])
    ap.add_argument("--write-manifest", action="store_true")
    ap.add_argument("--selftest", action="store_true")
    ap.add_argument("--fast", action="store_true", help="reduced selftest sims")
    ap.add_argument("--run", action="store_true")
    ap.add_argument("--draws", type=int, default=DRAWS_FINAL)
    args = ap.parse_args()

    if args.write_manifest:
        MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
        MANIFEST_PATH.write_text(manifest_text(), encoding="utf-8", newline="\n")
        print(f"Wrote {MANIFEST_PATH.relative_to(ROOT)}")
        return

    if args.selftest:
        selftest(fast=args.fast)
        return

    if args.run:
        print(f"Running pre-registered analysis (draws={args.draws}, seed={SEED})")
        verdicts = run_analysis(
            draws=args.draws,
            checkpoint=ROOT / "tmp" / "spectral-checkpoint.jsonl")
        OUT_DIR.mkdir(parents=True, exist_ok=True)
        (OUT_DIR / "verdicts.json").write_text(
            verdicts_json(verdicts), encoding="utf-8", newline="\n")
        write_figures(verdicts)
        print(f"\n{verdicts['headline']['text']}")
        tested = [r for r in verdicts["cross_grid"] if r["eligible"]]
        by_state: dict[str, int] = {}
        for r in tested:
            by_state[r["state"]] = by_state.get(r["state"], 0) + 1
        print(f"Cross-grid: {len(tested)} tests -> {by_state}")
        print(f"Wrote {OUT_DIR.relative_to(ROOT) / 'verdicts.json'} + "
              f"{len(verdicts['primary'])} figures")
        return

    ap.print_help()


if __name__ == "__main__":
    main()
