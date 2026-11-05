<!-- Moved whole from AGENTS.md on 2026-11-04 (MT, housekeeping night, docs/housekeeping/2026-11-04-inventory.md), both blocks with their markers. AGENTS.md keeps a one-line pointer here; `scripts/spectral_verdict.py` and `src/lib/testedSeries.test.ts` still say "AGENTS.md invariant", and that pointer is how the cite resolves. Read this before adding or refreshing a CSV, a cycle, a pairing or a period. -->

<!-- BEGIN:reproducible-data-pipeline -->
# Every derived data series gets a committed build script

If a CSV in `public/data/` is anything other than a near-pass-through of an upstream file (filtering rows, splicing series, rolling averages, log-transforms, country-aggregate filtering, etc.), there must be a corresponding `scripts/build_<slug>.py` that reproduces it from the upstream URL — committed, self-documenting, and runnable from repo root. The Maddison and Fernald rebuilds (Phase 7) are the canonical examples; the Stimson script (Phase 10) follows the same pattern.

The build scripts do not run automatically. The CSVs are committed for stability and provenance, with a sibling `<slug>.source.md` documenting retrieval date, transform, and caveats. Re-run the script when refreshing data, then re-commit the CSV with an updated `Retrieved:` date in the source.md.
<!-- END:reproducible-data-pipeline -->

<!-- BEGIN:spectral-verdict-invariant -->
# The spectral verdict is manifested: pairings and data are frozen together

Adding a cycle, changing a pairing, changing a `period_years`, or refreshing
any inference CSV in `public/data/` invalidates the spectral verdict. The
run enforces this — `scripts/spectral_verdict.py` pins input-CSV sha256s and
pairing periods inside `scripts/spectral/analysis-manifest.yaml` and aborts
on mismatch. The required sequence: update the frozen plan in
`spectral_verdict.py`, `--write-manifest`, commit the manifest, `--selftest`,
then `--run` (99,999 draws) and re-commit `public/data/spectral/`
(verdicts.json + figures). Never hand-edit verdicts.json, the figures, or
the manifest. TFP inference uses `us_tfp_growth_annual.csv` (unsmoothed) —
the rolled display CSV is banned from inference and the selftest checks that.
<!-- END:spectral-verdict-invariant -->
