<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:prose-mirror-invariant -->
# Keep prose mirrors in sync

Three React prose pages have plain-markdown mirrors that LLM crawlers and external agents fetch directly:

- `src/app/(app)/about/page.tsx` ↔ `public/about.md`
- `src/app/(app)/methods/page.tsx` ↔ `public/methods.md`
- `src/app/(app)/colophon/page.tsx` ↔ `public/colophon.md`

When you edit one, edit the other in the same commit. Do not assume one is canonical. The Phase 7.2 commit fixed three drift incidents at once because earlier rounds had only updated one side. Likewise, when a finding from a fact-check or audit applies to per-series provenance (e.g., Project Mars 2010 = 0), update both `/methods` *and* the relevant `public/data/<slug>.source.md`.

`public/llms.txt` is a third surface that summarises both prose and data; if cycle/series counts or stability state change, sweep it too.
<!-- END:prose-mirror-invariant -->

<!-- BEGIN:cycle-rationale-math-rule -->
# Run the cos-math audit before shipping cycle-rationale prose

Any prose claim that names a year and asserts where a cycle sits at that year (peak, trough, rising arm, "+0.15", etc.) must be verified against `cos(2π · (year - reference_peak_year) / period_years)` before being shipped. This is enforced by:

```bash
python scripts/audit_cycle_rationales.py
```

Read every row alongside the rationale prose. The Strauss-Howe round-4 finding ("2020 is a trough" — wrong, cos ≈ +0.15 rising arm) and the Turchin internal-sweep finding (parenthetical sequence at cos ≈ −0.81, not peaks) both survived three earlier fact-check rounds because nobody did the arithmetic. Don't be the next round.
<!-- END:cycle-rationale-math-rule -->

<!-- BEGIN:reproducible-data-pipeline -->
# Every derived data series gets a committed build script

If a CSV in `public/data/` is anything other than a near-pass-through of an upstream file (filtering rows, splicing series, rolling averages, log-transforms, country-aggregate filtering, etc.), there must be a corresponding `scripts/build_<slug>.py` that reproduces it from the upstream URL — committed, self-documenting, and runnable from repo root. The Maddison and Fernald rebuilds (Phase 7) are the canonical examples; the Stimson script (Phase 10) follows the same pattern.

The build scripts do not run automatically. The CSVs are committed for stability and provenance, with a sibling `<slug>.source.md` documenting retrieval date, transform, and caveats. Re-run the script when refreshing data, then re-commit the CSV with an updated `Retrieved:` date in the source.md.
<!-- END:reproducible-data-pipeline -->
