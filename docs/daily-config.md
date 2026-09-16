---
project: sinusoidal-cycles
repoPath: C:\dev\skylark\sinusoidal-cycles
liveUrl: https://sinusoidalhistory.com
reportPath: docs/daily/<MT-date>-prelaunch.md
---

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
doppler run --project skylark-site --config dev_personal -- node ../skylark-site/scripts/gsc-demand-worklist.mjs --projects sinusoidal-cycles --days 28 --min-impressions 1 --position-gt 0
```

It prints the non-brand-clicks baseline (the ONE metric) and the demand-gap queries.
Two caveats that decide how you read it: Search Console lags **~3 days**, so a read
today cannot see the last 2-3 days; and GSC anonymizes low-volume queries, so the
query rows are a *sample* of impressions (5 of 89 on the first read), never the set.
`/api/cc/gsc-performance?project=sinusoidal-cycles` is the same data over HTTP once
Render has deployed the wiring commit.

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

## Prose invariants that will silently break

See `AGENTS.md` for the full set. The two that catch people:

- The three prose pages have plain-markdown mirrors (`public/about.md`,
  `methods.md`, `colophon.md`) — **edit both sides in the same commit.**
- Adding a cycle auto-updates most surfaces, but **`public/llms.txt`'s per-cycle
  list and `public/about.md`'s mirror block are hand-written** and go stale silently.
- Any prose naming a year and a cycle's phase must clear
  `python scripts/audit_cycle_rationales.py` first.
