# US TFP growth — unsmoothed annual (spectral-inference companion)

**Retrieved:** 2026-08-19 (same download as `us_tfp_growth.csv`)

Raw annual `dtfp_util` (utilization-adjusted TFP growth, percent) from
Fernald's `quarterly_tfp.xlsx`, sheet `annual` — no rolling average, no other
transform. Written by `scripts/build_us_tfp_growth.py` in the same run as the
5-year-rolled display CSV, so the two can never drift apart.

This file exists because the spectral-verdict pipeline must run inference on
the unsmoothed series: the 5-year moving average barely attenuates the
54–55-year band (|H| ≈ 0.99) but reddens the spectrum and corrupts an AR(1)
noise fit. Full provenance, citation, license, and caveats:
[`us_tfp_growth.source.md`](us_tfp_growth.source.md). The worked smoothing
example lives in [`spectral/spectral.source.md`](spectral/spectral.source.md).
