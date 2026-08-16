---
project: sinusoidal-cycles
repoPath: C:\dev\skylark\sinusoidal-cycles
liveUrl: https://sinusoidal-history.skylarkcreations.com
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
| Report of record / cold-start primer | `docs/cold-starts/<MT-date>.md` — multi-session, each close-out appends a section |
| Ship log | `CHANGELOG.md` |
| Tracked items + known patterns | `continuity/items.json` |
| Narrative record across sessions | agent memory (`MEMORY.md` index) |
| Daily report to the orchestrator | the bus `task-complete` body — nothing on disk |

For step 0.10 ("re-read yesterday's Recommendations"), the equivalent block is the
**"Tomorrow's first action"** list in the most recent `docs/cold-starts/` section.

## No CI — this is the part that bites

There is **no `.github/workflows/`**. Nothing runs on push. A ship here means
running the gates yourself, then verifying production after Render auto-deploys:

```powershell
Set-Location C:\dev\skylark\sinusoidal-cycles
npm run build; npm run typecheck; npm run lint; npm test
```

Any task-complete citing a SHA from this repo states the conclusion of **that local
run** — there is no CI verdict to cite.

The other half of the CI-truth pair (R-2, 2026-08-15) still applies, because a
local-gates lane can still post a SHA it never pushed:

```powershell
node ../skylark-site/scripts/check-posted-unpushed.mjs --project sinusoidal-cycles
```

Flags task-completes citing commits absent from origin >3h; exit 3 = findings.
Its sibling `check-ci-status.mjs` is a no-op here and stays unrun — with no
workflow file there is nothing for `--workflow` to name.

## The one instrument

`scripts/crawl-read.mjs` is this site's entire analytics stack. It reads Render's
HTTP request logs; nothing is instrumented in the app (no client script, no cookie,
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
