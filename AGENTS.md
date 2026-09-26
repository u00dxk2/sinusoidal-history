<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# JSX whitespace: keep writing `{" "}`

Moved OUT of the block above on 2026-09-26. `next dev` owns everything between its
`nextjs-agent-rules` markers and rewrote them on 2026-09-25, deleting this section. Anything
this repo needs to keep goes below the END marker.

**JSX whitespace hazard (live-verified 2026-08-24):** this Next's compiler strips the edge whitespace of any JSX text node that spans multiple source lines — including a space on the *same line* as an adjacent inline element or `{expression}`. `the {year} reading` rendered as "the 2026reading"; `<em>estimation</em> conventionally` as "estimationconventionally"; the symmetric case (`…anchored to the\n<code>…`) too. Single-line text nodes are safe. Rule when writing prose JSX: at every junction with an inline element or expression, write the space as an explicit `{" "}` (or keep the whole text node on one line). A site-wide sweep landed 2026-08-24; verify new prose against the rendered HTML, not the source.

**Re-measured on the 16.3.5 bump (2026-09-17): the hazard did not reproduce in the two cases probed.** A throwaway route written in exactly the hazardous shape — `the {year} reading` and `<em>estimation</em> conventionally`, both spanning source lines, neither using `{" "}` — prerendered as `the <!-- -->2026<!-- --> reading` and `<em>estimation</em> conventionally`, spaces intact. Two probes are not a proof that the compiler was fixed in general. So the paragraph above describes 16.2.4, which is where it was live-verified; it is kept because this repo's prose still carries the explicit `{" "}` the sweep added, and because the rule is version-scoped, not retired. **Keep writing `{" "}`** — it renders one space either way (HTML collapses whitespace), it is what every existing junction uses, and it is the only form that is correct on both versions. If a future bump is reverted, the hazard comes back with it. Re-run the probe rather than trusting either version's reputation.

<!-- BEGIN:prose-mirror-invariant -->
# CI, the commit hook, and where the traffic numbers come from (all new 2026-09-16)

`.github/workflows/ci.yml` runs lint, typecheck, test and build on every push and PR
to `main`. **Render deploys on every push and does NOT wait for CI**, so a red run can
sit behind a live build — read CI before claiming a ship is safe. Run only the gate you
touched locally and let CI be the full battery.

**Test files are excluded from the BUILD tsconfig, and that is deliberate** (2026-09-17, with
the 16.3.5 bump). This Next type-checks whatever is in scope during `next build`, and test files
import vitest, a devDependency a production install can prune — so `tsconfig.json` excludes
`**/*.test.ts(x)` and `vitest.config.ts`. They are still type-checked: `npm run typecheck` runs
`tsconfig.test.json`, which puts them back, and CI runs that script. If you add a test and want
tsc to see it, run `npm run typecheck`, not `npx tsc --noEmit`.

Portfolio operating principles (product-first 80/20, the validation gate, founder-distribution)
are canonical in `../skylark-site/docs/skylark-operating-principles.md` — this repo does not
restate them.

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

# Prove the words did not move: the rendered-text gate

Before a refactor or a dependency bump, snapshot what a reader sees; after it, diff:

```bash
node scripts/check-rendered-text.mjs snap .next/server/app before.txt   # or a URL
node scripts/check-rendered-text.mjs diff before.txt .next/server/app   # exit 0 same, 3 changed
```

A source is a URL, an `.html` file, a directory of them (`.next/server/app` after a build), or a
saved snapshot. It compares VISIBLE text only: whitespace runs collapse, as HTML's do, so a
one-space change is invisible — and CSS is not compared at all, because a framework bump rewrites
the emitted CSS bytes without changing a style (per-build `@font-face` `url()` tokens, KP-004).
Layout belongs to frames, not to this. `--selftest` carries the red arms and CI runs it through
`src/lib/check-rendered-text.test.ts`.

**It is BLIND to anything the browser renders, and on the home page that is the whole
chart** (measured 2026-09-21). The snapshot reads server-rendered HTML; `Viz` and
everything under it — the ten facets, the editor's note, the brush, the "State of the
cycles" panel — arrive client-side, so `/` snaps to 25 lines and a re-order of those
blocks reads GREEN with nothing compared. The positive control that proves it: a word
changed inside `ConvergenceNote`, and later reverted, did not register either. **For a
change inside `Viz`, the proof is the rendered `main` innerText line multiset** — load
both sides in Playwright, split `innerText`, sort, compare (123 lines, 82 distinct on
2026-09-21, identical against production). Use this gate for server-rendered prose,
where it is still the right instrument.

**`diff` is an ORDER gate, and on a re-ordering it goes RED and is RIGHT to** (learned the slow way
2026-09-20, on the `/cycles` re-order). It compares visible text line-index by line-index, so moving
a paragraph reports RED at the first moved line even though not one word changed. Two failure modes
follow, and the second is the dangerous one: reading that RED as "the page broke", or learning to
wave it through — after which a genuine prose deletion inside a future re-order rides out on the
habit. **What proves a re-order safe is the line MULTISET**: `snap` both sides, sort, compare. On
09-20 that was 216 lines and 166 distinct on both sides, identical, and the adversarial review
reproduced it independently. Note the same command run BUILT-vs-PRODUCTION after a deploy asks a
different question — "does production serve what I built" — and there GREEN is the expected answer.

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
