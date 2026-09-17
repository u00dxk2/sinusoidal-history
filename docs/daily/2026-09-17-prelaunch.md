---
product: sinusoidal-cycles
date: 2026-09-17
lifecycle_stage: pre-launch
north_star_metric: organic search clicks to sinusoidalhistory.com — the first signal that a human, not a crawler, arrived (retention and word-of-mouth are structurally unmeasurable here; the site carries no analytics by design)
north_star_value: 0
north_star_status: measured-zero
north_star_classification: expected-zero
last_deploy: a400821
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "The change a reader should see today: the methods page gets one scannable table of all nine verdicts, each row linking to that cycle's 'does it hold up?' block. Behind it, the 46 dependency alerts GitHub started reporting last night get sized by root package and either fixed or given a dated waiver — new coverage, not new breakage."
---

# Daily — sinusoidal-cycles — 2026-09-17

## BLUF

A skeptic can now check the site's headline claim in one table instead of nine pages, and the dependency alerts that turning on GitHub's scanner surfaced yesterday went 46 → 30 with nothing a reader sees changing. The 30 that remain are one decision, carded for David.

**FIRST ACTION.** Run W-001's Search Console read as a sample-size check — did the query set grow past the five Ray Dalio rows, and did average position move off ~20. It is due 2026-09-19; a zero before ~2026-10-07 is a question, not a verdict.

```powershell
node C:/dev/skylark/sinusoidal-cycles/scripts/gsc-read.mjs --start 2026-09-10
```

**DON'T-TOUCH.** W-001's page-only Search Console read, `node scripts/gsc-read.mjs --start 2026-09-10`. Page grouping is the one grouping whose totals are whole, and a cold agent runs it from the lane root in seconds with no David step; the orchestrator ruled it tier-1 (`45285f05`).

## What changed

**Every spectral verdict now sits in one table on `/methods`** (`44557c1`, refined by `832f4d8`; CI green on both, live 16:27:45Z and 16:37:26Z). The site's most arguable claim — that 0 of 9 cycle-and-data pairings have a record long enough to test — was a single number on `/methods`, with the nine verdicts behind it one per cycle page. Checking it meant opening nine pages. The Spectral testing section now opens with a row per pairing: cycle, stated period, the span of the record the verdict actually tests, periods covered out of the required 3.0, years short of the gate, and the verdict. Each row links to that cycle page's "Does it hold up?" block, which gained the anchor it lands on. The tenth cycle, which has no paired series, is listed and marked rather than silently omitted.

The numbers a reader now sees together make the finding concrete in a way the headline did not: Carlota Perez is 7 years short of testable, Ray Dalio 73, Peter Turchin 339. Every value derives from the frozen `verdicts.json`, which this ship only reads.

**16 dependency alerts closed, none of them visible to a reader** (`a400821`, CI green on Linux). `npm audit fix` without `--force`, plus vitest and `@vitest/ui` to `^4.1.11` — the only two stated ranges that moved, both dev-only. The alert list itself reports 46 → 30.

## Inputs (controllable)

**The gate that made the dependency bump safe to ship, and that will decide the next one.** A snapshot of the visible text of all 20 prerendered pages plus the emitted CSS, diffed across builds on identical source: 0 differences. It is red-armed — mutating one page hash and one CSS hash in the baseline makes the diff name both and exit 3 — so the zero is a measurement, not a dead probe. The same gate is what the pending Next.js decision hangs on.

**What the remaining 30 alerts actually are.** All one bump: 24 on `next`, 4 on the `postcss` copy nested inside it, 2 on `sharp`, closable only by `next@16.3.5`, outside the pinned `16.2.4`. Verified about this deployment rather than read off severities: no `middleware.ts` exists (so twelve middleware-bypass advisories describe a file this repo does not have), one critical targets Windows hosts (this is Linux on Render), and the other targets image optimization — no `next/image` component is used, though `/_next/image` answers 200 in production and `next.config.ts` sets no `images.remotePatterns`, so it reads same-origin paths only on a site that accepts no uploads. Posted as a decision with a board card (`fd34588d` / card `5b717731`) instead of a quiet framework bump, because `AGENTS.md`'s first rule is that this Next differs from what a model remembers.

**Codex.** Probe GREEN at 15:19:36Z; SPAWN leg EPERM, so nothing needing a child process goes to it. Zero calls — the work was two small diffs in files already read this session. Two adversarial reviews run as gates, both approve.

## Outputs (lagging)

**Clicks: 0, and today's ships cannot have moved it.** The last read stands at 17 impressions, 0 clicks, average position 20.4 for 2026-09-10..09-16 (`scripts/gsc-read.mjs`, page-only grouping so the totals are whole). Search Console lags ~3 days and today's changes are hours old, so nothing here is a verdict on them. Rule of three on 0 clicks in 17 impressions: the true click-through rate could be anything up to roughly 18% and still produce this zero.

**Reached: no.** Both ships are live and verified in production at 390 and 1440 wide. The site carries no analytics by design, so the only observable that a human arrived is a nonzero click in the page-grouped read.

**Retention and word-of-mouth: still unmeasurable**, and not proxied. No accounts, no return loop. The would-tell-a-friend moment is unchanged: "this chart made a contested idea legible enough to argue with." Today's table serves it directly — the argument a skeptic wants to have is now on one screen.

## Recommendation

**The one open decision: bump Next.js, or hold and carry 30 alerts.** Recommended: bump, gated on the rendered-text diff, reverting automatically if any page's text or the CSS moves. Carded for David as `5b717731`; a dated waiver (`D-001`, until 2026-09-24) keeps the engineering panel explained rather than unexplained in the meantime.

**Tomorrow's first action is W-001's read on 2026-09-19** as a sample-size check, not a click-through verdict.

**Next product build, scoped not started: the same verdict table belongs on `/cycles`.** The index lists ten cycles with no indication that none of them clears the site's own evidence bar; a reader who lands there rather than on `/methods` sees the claims without the verdict. It reuses today's rows wholesale.

## State Appendix

### Retro tags carried into the EOD reply

- Finding #2 (the dispatch pre-flight names the junction path, not the real one): tag `[mitigation: carried — skylark-site/2026-09-18/junction-path-preflight]` until tonight's substrate session mints the real row id (orchestrator `01be84ef`); swap the id in when it arrives.

### Section 0 (pre-flight, run at P1)

- **Primer:** PRESENT (`docs/cold-starts/2026-09-17.md`). Its "tier-1 conflict UNRULED" line printed a runnable revert of a ruled decision; corrected in `0357e54` before the kickoff arrived.
- **Listener:** SSE alive (session start 15:10:47Z, last hello 15:41:37Z); waker ladder three rungs; loop armed by tool call.
- **Codex:** GREEN (probe 2026-09-17T15:19:36Z); SPAWN leg EPERM.
- **CI gate:** `check-ci-status --workflow ci.yml` → GREEN on `0357e54e` (1 success, 0 failures, 0 pending).
- **Deploy drift:** `check-deployed-sha-drift --service sinusoidal-history` → `NOT-APPLICABLE-BY-REGISTRY` (commit-trigger service). The liveness read it names, taken directly: Render deploy row for `0357e54` is `live`, finished 15:14:24Z — live sha equals HEAD.
- **Recs yesterday (4):**
  1. W-001 read as a sample-size check → carrying → 2026-09-19 (the row's `nextEvaluation`).
  2. Compete for "ray dalio big cycle"? → ruled: `957e5e74` (be the best answer to the question; shipped as `e7d8936`).
  3. Per-cycle verdict strip on `/methods` → carrying today → P3 Section A.
  4. Turn on GitHub's free security features → executed: secret scanning and push protection on at ~16:47Z (`e3c97e7`); Dependabot alerts on after the close (`75b79c2e`) → 46 open, Section B today.
