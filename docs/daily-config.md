---
project: sinusoidal-cycles
repoPath: C:\dev\skylark\sinusoidal-cycles
liveUrl: https://sinusoidalhistory.com
reportPath: docs/daily/<MT-date>-prelaunch.md
primerPath: docs/cold-starts/<MT-date>.md
primerOffset: +1
---

<!-- primer convention, declared 2026-09-16 because check-next-primer-exists.mjs read
     this lane as UNRESOLVABLE (no PRIMER_CONVENTIONS row, no primary cold-starts entry
     in REPORT_CONFIGS): the primer written at tonight's close is named for TOMORROW's
     MT date, i.e. offset = filename date − write date = +1. Evidence: the section
     inside docs/cold-starts/2026-09-09.md is headed "Session close-out — 03:30Z
     (2026-09-08 ~21:30 MT)", so that file was written the evening before its own
     filename date. The fleet registry row lives in skylark-site and is the
     orchestrator's to add; this declaration is the lane-side half. -->


# Daily config — sinusoidal-cycles (Sinusoidal History)

Created 2026-08-15 (P2 continuity). Two skills looked for this file earlier the
same day and fell back by guess: `/listen` step 1 (resolving the bus slug — it
guessed from the directory name and happened to be right) and `/daily` step 0.10
(looking for "yesterday's report"). Both now resolve from here.

## Where this project's state actually lives

There is **no `docs/daily-reports/`**. Do not go looking for one.

| What | Where |
|---|---|
| Daily report of record (rail days, since 2026-09-16) | `docs/daily/<MT-date>-prelaunch.md` — this repo is **public**: write it for a stranger (no personal emails, no board-card text) |
| Cold-start primer | `docs/cold-starts/<MT-date>.md` — multi-session, each close-out appends a section |
| Ship log | `CHANGELOG.md` |
| Tracked items + known patterns | `continuity/items.json` |
| Narrative record across sessions | agent memory (`MEMORY.md` index) |

For step 0.10 ("re-read yesterday's Recommendations"), read the `## Recommendation`
block of yesterday's `docs/daily/` report. On a day with no report, use the
**"Tomorrow's first action"** list in the newest `docs/cold-starts/` section instead.

`C:\dev\skylark\sinusoidal-history` is a directory **junction** to this checkout, not a
second lane. The fleet roster reads the lane through that alias.

## CI (since 2026-09-16) — and the part that still bites

`.github/workflows/ci.yml` runs lint, typecheck, test and build on every push and PR
to `main`. Read it for a commit with:

```powershell
node ../skylark-site/scripts/check-ci-status.mjs --workflow ci.yml
```

**Render deploys on every push and does NOT wait for CI** (`autoDeploy: true`, not
checksPass). A red CI run therefore means a broken build may already be live — check
CI *before* claiming a ship is safe, not after. Locally, run only the gate you touched
and let CI be the full gate (fleet capacity rule: heavy jobs one at a time).

A `pre-commit` hook (`.githooks/`, armed by `npm install`'s `prepare`) runs the
vendored secret scanner on every commit. Refresh `scripts/check-staged-secrets.mjs` by
copying skylark-site's file byte-exact, never by editing it here.

The other half of the CI-truth pair (R-2, 2026-08-15) still applies, because any
lane can post a SHA it never pushed:

```powershell
node ../skylark-site/scripts/check-posted-unpushed.mjs --project sinusoidal-cycles
```

Flags task-completes citing commits absent from origin >3h; exit 3 = findings.

## The instruments

**Tier-1 (since 2026-09-16, orchestrator-approved): organic clicks by page**, read
through the portfolio's Search Console client. The lane was wired into
`GSC_PROPERTIES` as `sc-domain:sinusoidalhistory.com` by skylark-site `ae4e4460f`,
so this no longer needs David at the pane:

```powershell
Set-Location C:\dev\skylark\sinusoidal-cycles
node scripts/gsc-read.mjs --start 2026-09-10      # totals + per-page, WHOLE
```

`gsc-read.mjs` groups by **page only**, which is the one grouping whose click totals are
whole. For the **query list**, use the portfolio worklist, and never take a click total
from it: any query grouping drops the rows Search Console anonymizes, and their clicks
go with them.

```powershell
doppler run --project skylark-site --config dev_personal -- node ../skylark-site/scripts/gsc-demand-worklist.mjs --projects sinusoidal-cycles --days 28 --min-impressions 1 --position-gt 0
```

Search Console lags **~3 days**, so a read today cannot see the last 2-3 days. Its days
are Pacific time, so label ship dates in MT and say which bucket a ship day fell in.

**Tier-2, monthly coverage check: `scripts/crawl-read.mjs`.** It reads Render's HTTP
request logs and answers who *crawls* the site; it can never see impressions, queries,
position or clicks. Nothing is instrumented in the app (no client script, no cookie,
no consent surface) and that is deliberate.

```powershell
$env:RENDER_API_KEY = [System.Environment]::GetEnvironmentVariable('RENDER_API_KEY','User')
node scripts/crawl-read.mjs --days 7 --snapshot
```

**Always pass `--snapshot`** on a real read. Render serves only a trailing log
window, so an un-snapshotted finding stops being checkable once the window rolls
past it; `docs/crawl-reads.jsonl` is the series that survives, and it is what the
next read diffs against.

Two standing cautions on its output:

- `browser-ish` and `unknown (no UA)` are **UA-shape buckets, not humans.** Never
  report them as an audience read without IP-range verification.
- A Google zero is real, not a dead probe — `--selfcheck` unit-asserts the
  `Googlebot` / `Google-Extended` branches, and the buckets sum to the raw line
  count. Cite that positive control when the zero rides a claim.

## The two leading product numbers (declared 2026-09-25, I-004)

Both are **secondary to the organic-clicks north star, not a replacement for it.** They
exist because the site carries no analytics, so the only product quality this lane can
measure before a human arrives is whether the arriving reader gets the page's answer
without scrolling. Both are read at **390x664**, the real visible area of an iPhone 14 in
Safari (`scripts/measure-fold.mjs` explains why not 844).

1. **Entry-page legs that answer on the first screen, out of the roster walked.** The
   denominator is the wrapper's leg count (13 today: `/`, `/cycles`, `/methods`, and one
   `/cycles/<slug>` per cycle in `src/data/cycles.json`), never a hand count. Each leg's
   question and selector are in the table at the top of the script.

   ```powershell
   node scripts/check-entry-folds.mjs
   ```

   **Current value: 13 of 13** — production, 2026-09-25 ~7:54 AM MT, after `5838ca8`.
   The first run, before that ship, read 11 of 13 (`/cycles/turchin` cut 37px,
   `/cycles/turchin-fathers-sons` had no answer). Thinnest leg: `/cycles/turchin`, 7px.
   **At 360x560 it reads 2 of 13**; the smaller phones are not yet fitted beyond the
   home page.

2. **Home-page cycle curves inside the first screen, out of ten.** The rows are stacked,
   so the last row clearing the fold means all ten do; the `/` leg above measures the
   last row (`[data-overview-id="turchin_fathers_sons"] svg`).

   **Current value: 10 of 10** — the same 2026-09-25 production run, 72px spare. It was
   1 of 10 before `57ca745` (2026-09-22); 320x568 and 360x560 fit since `be29b3a`
   (2026-09-24, 12px and 4px spare).

## Prose invariants that will silently break

See `AGENTS.md` for the full set. The two that catch people:

- The three prose pages have plain-markdown mirrors (`public/about.md`,
  `methods.md`, `colophon.md`) — **edit both sides in the same commit.**
- Adding a cycle auto-updates most surfaces, but **`public/llms.txt`'s per-cycle
  list and `public/about.md`'s mirror block are hand-written** and go stale silently.
- Any prose naming a year and a cycle's phase must clear
  `python scripts/audit_cycle_rationales.py` first.
