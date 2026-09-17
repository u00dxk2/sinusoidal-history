<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

**JSX whitespace hazard (live-verified 2026-08-24):** this Next's compiler strips the edge whitespace of any JSX text node that spans multiple source lines — including a space on the *same line* as an adjacent inline element or `{expression}`. `the {year} reading` rendered as "the 2026reading"; `<em>estimation</em> conventionally` as "estimationconventionally"; the symmetric case (`…anchored to the\n<code>…`) too. Single-line text nodes are safe. Rule when writing prose JSX: at every junction with an inline element or expression, write the space as an explicit `{" "}` (or keep the whole text node on one line). A site-wide sweep landed 2026-08-24; verify new prose against the rendered HTML, not the source.

**Re-measured on the 16.3.5 bump (2026-09-17): the hazard did not reproduce in the two cases probed.** A throwaway route written in exactly the hazardous shape — `the {year} reading` and `<em>estimation</em> conventionally`, both spanning source lines, neither using `{" "}` — prerendered as `the <!-- -->2026<!-- --> reading` and `<em>estimation</em> conventionally`, spaces intact. Two probes are not a proof that the compiler was fixed in general. So the paragraph above describes 16.2.4, which is where it was live-verified; it is kept because this repo's prose still carries the explicit `{" "}` the sweep added, and because the rule is version-scoped, not retired. **Keep writing `{" "}`** — it renders one space either way (HTML collapses whitespace), it is what every existing junction uses, and it is the only form that is correct on both versions. If a future bump is reverted, the hazard comes back with it. Re-run the probe rather than trusting either version's reputation.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:prose-mirror-invariant -->
# CI, the commit hook, and where the traffic numbers come from (all new 2026-09-16)

`.github/workflows/ci.yml` runs lint, typecheck, test and build on every push and PR
to `main`. **Render deploys on every push and does NOT wait for CI**, so a red run can
sit behind a live build — read CI before claiming a ship is safe. Run only the gate you
touched locally and let CI be the full battery.

`.githooks/pre-commit` runs `scripts/check-staged-secrets.mjs`, a **byte-exact copy** of
skylark-site's scanner — refresh it by re-copying that file, never by editing this one.
`npm install` arms it via `prepare` (`core.hooksPath`). `.gitattributes` pins
`.githooks/*` to LF, because a CRLF shebang silently disables the hook on a fresh clone.

**Traffic questions have two instruments, and they answer different questions.**
`scripts/gsc-read.mjs --start <YYYY-MM-DD>` (tier-1) reads Search Console per page:
impressions, clicks, position — who was *shown* the site. `scripts/crawl-read.mjs`
(tier-2, monthly) reads Render request logs: who *crawls* it. **Never take a click total
from a query-grouped read** — Search Console anonymizes low-volume queries and their
clicks vanish with the rows; page-only grouping is the one whose totals are whole.

# Keep prose mirrors in sync

Three React prose pages have plain-markdown mirrors that LLM crawlers and external agents fetch directly:

- `src/app/(app)/about/page.tsx` ↔ `public/about.md`
- `src/app/(app)/methods/page.tsx` ↔ `public/methods.md`
- `src/app/(app)/colophon/page.tsx` ↔ `public/colophon.md`

When you edit one, edit the other in the same commit. Do not assume one is canonical. The Phase 7.2 commit fixed three drift incidents at once because earlier rounds had only updated one side. Likewise, when a finding from a fact-check or audit applies to per-series provenance (e.g., Project Mars 2010 = 0), update both `/methods` *and* the relevant `public/data/<slug>.source.md`.

`public/llms.txt` is a third surface that summarises both prose and data; if cycle/series counts or stability state change, sweep it too.
<!-- END:prose-mirror-invariant -->

<!-- BEGIN:new-cycle-checklist -->
# Adding or renaming a cycle: what is automatic, and what isn't

Since Phase 12, most per-cycle surfaces derive from `src/data/cycles.json` and need no edit when a cycle is added:

- `/cycles/<slug>` and its metadata, OG card, and JSON-LD (`generateStaticParams` over `cycles`)
- the `/cycles` index, the `/about` list, the sitemap entry, the poster and chart rows
- the `/state/<year>` annual-reading rows and all three `/api/v1/*` endpoints (Phase 13 — they map over `cycles.json`/`series.json` at request/build time)

Two surfaces are **hand-written** and will silently go stale:

- `public/llms.txt` — the "Per-cycle pages" bullet list, plus the ascending-period ordering in the intro
- `public/about.md` — the mirror needs a new `### <name>` block *and* its `- **Page:**` line (see the prose-mirror rule above)

Renaming a cycle's `id` changes its URL. Slugs are the id with underscores swapped for hyphens (`strauss_howe` → `/cycles/strauss-howe`), so an id change is a redirect-worthy URL change, not a cosmetic edit.
<!-- END:new-cycle-checklist -->

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
