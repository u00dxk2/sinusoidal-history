---
product: sinusoidal-cycles
date: 2026-09-16
lifecycle_stage: pre-launch
north_star_metric: organic search clicks to sinusoidalhistory.com — the first signal that a human, not a crawler, arrived (retention and word-of-mouth are structurally unmeasurable here; the site carries no analytics by design)
north_star_value: 0
north_star_status: measured-zero
north_star_classification: expected-zero
last_deploy: 6e41ff6
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "First day on the daily rail. The change a reader sees: the methods page — the page Google shows most often — now opens by saying what the site is, linking to the chart, and stating the result a skeptic wants first, instead of starting with a list of data sources. Behind that, the Search Console reader the rest of the portfolio uses can now see this site, so whether anyone clicks through from Google is a command an agent runs rather than a screenshot you take. One thing needs you: GitHub's free security features (secret scanning, push protection, Dependabot alerts) are all switched off on this public repo."
---

# Daily — sinusoidal-cycles — 2026-09-16

## BLUF

First rail day. One user-visible ship, both lane-contract gaps closed, and the site's search instrument moved from David's screen to an agent command.

**FIRST ACTION.** Run W-001's own read and compare it against today's baseline in the row's notes — it is the ledger's only open row, due 2026-09-19.

```powershell
node C:/dev/skylark/sinusoidal-cycles/scripts/gsc-read.mjs --start 2026-09-10
```

**THE NUMBER THAT WILL LIE TO YOU.** "0 clicks." Post-ship there are 17 impressions at average position 20.4 (table below). At that n a zero is what a *working* page looks like — a page-two result earns well under one click at any healthy rate — so the zero says nothing about the 2026-09-09 snippet rewrite or about today's ship. The first date it can say anything is ~2026-10-07.

**DON'T-TOUCH.** The per-cycle page titles, 76–82 characters (appendix). They truncate from the brand suffix inward, so a search result loses "· Sinusoidal History", which is the right thing to lose. Re-cutting them is the edit most likely to disturb indexing while that leg is fresh.

## What changed

**`/methods` opens as a front door instead of an appendix** (`6e41ff6`, CI GREEN, live 16:04:21Z). It is the site's highest-impression page — 14 of 73 impressions pre-ship — but its first screen went straight from the H1 into data-source entries: nothing said what the site is, nothing linked to the chart, and the site's most arguable result sat ~200 lines down. It now carries an "In brief" block (10 cycle theories as sinusoids, a real series on 9 of them, a link to the chart, and the spectral headline) and an "On this page" list covering every section on the page (Data sources, Normalization, Why Pearson is the wrong tool, Spectral testing, Missing and sparse data, Notes on individual pairings). Every count is derived from `cycles.json`, `series.json` and `verdicts.json`, so it cannot drift the way `SITE_DESCRIPTION`'s "Eight" did against ten. `public/methods.md` moved in the same commit; `docs/key-user-flows.md` now lists `/methods` as a flow-1 ENTRY, not only an exit.

**The Search Console read became an agent command** (`7f1267d`, `07273cf`). skylark-site `ae4e4460f` wired this lane's property into the portfolio registry, so `node scripts/gsc-read.mjs --start <date>` returns per-page totals in seconds. W-001's first programmatic read:

| Window | Impressions | Clicks | Avg position |
|---|---|---|---|
| Pre-`1136b87` (2026-08-19 … 09-09) | 73 | 0 | 16.4 |
| Post-`1136b87` (2026-09-10 … 09-16) | 17 | 0 | 20.4 |

**The first non-brand queries this project has ever seen** — and they name one man. Every query Search Console will disclose, in full:

- "ray dalio big cycle" — 2 impressions, position 60.0
- "ray dalio big cycle theory" — 1, position 49.0
- "ray dalio the big cycle" — 1, position 55.0
- "ray dalio big cycles" — 1, position 52.0
- "cycle of ten" — 1, position 8.0
 Search Console hides low-volume queries, so these five sit under 89 impressions and are a sample, never the set. **The demand that exists is for a named theory, and the site is on page 5–6 for it.** No wording change on our own pages reaches a position-55 result.

**Secret scanning at the commit boundary** (`f9f2d47`, `831d100`, `114fe20`). The repo is public and had no pre-commit secret scan. The fleet scanner is now vendored byte-exact behind a `pre-commit` hook, armed on a fresh clone by `npm install`. Proven both ways: a staged AWS-key-shaped string was blocked, clean commits pass. Fleet coverage reads 25 of 25 repos covered.

**CI exists** (`49a7658`). `.github/workflows/ci.yml` runs lint, typecheck, test and build on every push and PR; first run GREEN. `repo-health.json` describes the repo for a public reader. The lane-contract gate moved from GAP to `COMPLIANT`.

## Inputs (controllable)

**The instrument that changed today, and what it can now answer.** `crawl-read.mjs` (Render request logs) could only ever say who *crawls* the site. `gsc-read.mjs` says who was *shown* it, for which query, at what position — the first read on this project that can distinguish "nobody can find us" from "people see us and don't click". It is deliberately grouped by page only: any query grouping drops the rows Search Console anonymizes, and their clicks go with them, so a query-grouped click total silently undercounts.

**What the day spent itself on.** Most of today's bus posts were substrate rather than product — the secret scan (`215bd89e`), CI and the manifest, and the ledger re-point (`6cb34450`, `232112f3`) — against one product ship (`edcf4fac`). That is the correction budget for a lane joining the rail with two contract gaps and no CI, and it is not repeatable tomorrow — the gaps are closed.

**Codex.** Probe GREEN at 14:03:22Z; one call used, the P3 adversarial review of the working tree (`approve`, no material findings). Its SPAWN leg is EPERM on this host, so nothing needing a child process goes to it.

## Outputs (lagging)

**Clicks: 0, and it is a MEASURED zero, not a dead probe.** Positive control: the same read returns non-zero impressions (73 pre, 17 post) and non-zero query rows through the same pipeline, so the click column can move; it has not. Search Console lags ~3 days, so today's read cannot see 09-14 onward.

**Reached: no.** Today's ship is live and verified in production, and no human has arrived on it. There is no analytics on this site by design, so the only observable is a nonzero click in the page-grouped read.

**Retention and word-of-mouth: still unmeasurable**, and I am not substituting a proxy. No accounts, no return loop, no analytics. The would-tell-a-friend moment is unchanged: "this chart made a contested idea legible enough to argue with."

## Recommendation

**Tomorrow's first action is W-001's read — as a sample-size check, not a verdict.** Run `node C:/dev/skylark/sinusoidal-cycles/scripts/gsc-read.mjs --start 2026-09-10` and answer two questions only: did the query set grow past the five Dalio-dominated rows, and did average position move off ~20. The CTR question is not answerable until ~2026-10-07, and the row's own `nextTrigger.action` now says so.

**The open decision, for David or the orchestrator: does this site compete for "ray dalio big cycle"?** It is the only legible demand, it sits at position 49–60, and it is a rank question — no post-click work reaches it. The tension is real: the site's stance is comparison across ten theories, and optimizing for one theorist's brand is a different product. Surfaced at P3, not carded, pending the manager's read.

**The next product build, scoped not shipped: a per-cycle verdict strip on `/methods`** — 9 rows from `verdicts.json` (cycle · stated period · record length in periods · verdict · link), with the unpaired cycle marked. It turns one headline number into the evidence a skeptic would otherwise scroll 200 lines for. It needs a mapper plus a frame read on a table at 390px.

**Blocked on David: turn on GitHub's free security features** — secret scanning, push protection, Dependabot alerts, all currently disabled on a public repo (appendix). Today's pre-commit hook is the only layer, and it only sees commits from a local clone that ran `npm install`.

## State Appendix

### Section 0 (pre-flight, run at P1)

- **Primer:** today's was absent. The newest was `docs/cold-starts/2026-09-09.md`, written *before* `1136b87`; its "Pending — David-side: one Search Console read" line was stale, because that read happened 2026-09-09 and was folded into W-001.
- **Listener:** SSE alive (session start 13:59Z, hello received); waker ladder all three rungs.
- **Codex:** GREEN (probe 2026-09-16T14:03:22.264Z); SPAWN leg EPERM.
- **CI gate at P1:** `check-ci-status` → UNKNOWN (UNREADABLE, exit 2) — expected, there was no workflow. GREEN after `49a7658`.
- **Deploy drift:** `check-deployed-sha-drift --service sinusoidal-history` → `NOT-APPLICABLE-BY-REGISTRY` — the service deploys on every commit, so there is no green-HEAD gate to be behind, and **a red CI does not stop a deploy here**.
- **Recs yesterday:** none — no 2026-09-15 report exists; the lane joined the rail today.

### Findings from arrival

- **`C:/dev/skylark/sinusoidal-history` is a directory junction to this checkout**, not a second lane. The dispatch pre-flight reads the lane through that alias; both paths show the same listener pidfile.
- **GitHub's free security features are all disabled on this public repo.** `gh api repos/u00dxk2/sinusoidal-history --jq '.security_and_analysis'` → secret scanning, push protection, non-provider patterns, validity checks and Dependabot security updates all `disabled`; the alerts endpoint returns HTTP 403 "Dependabot alerts are disabled for this repository". Consequence: dependency risk on this lane is currently *unreportable*, which is why no engineering-zero count appears above.
- **Per-cycle titles are 76–82 characters** (the DON'T-TOUCH figure), deliberately left long by `1136b87` because they truncate from the brand suffix inward.

### Section A detail — which lever `/methods` pulls

Post-click. It serves searchers who arrive once rank moves; it does not change the search result itself. Measurement floor: BELOW (0 clicks in the trailing 7d on that surface), so the hook is the named observable — a nonzero click on `/methods` in the page-grouped read — not an instrument build. Frame-read at 390×844 and 1440×900 before and after, live: no horizontal scroll at either extreme, six of six anchors resolving, `#spectral-testing` (linked from `/` and every cycle page) intact.

### A check that lied, and how

The live pass first ran a fused-word regex over RAW HTML and reported a match. Every hit was the same literal "9of", inside one hashed chunk filename (`/_next/static/chunks/0nnfeh9ofqg-4.js`) that the page's HTML repeats — once as a `<script src>`, then inside the inlined React flight payload; there was no prose defect. A raw-HTML regex is the wrong instrument for a rendered-text question. The check now runs over `innerText` and is red-armed: injecting the fused junctions into the live DOM makes it exit 1 naming all four.
