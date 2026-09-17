---
product: sinusoidal-cycles
date: 2026-09-17
lifecycle_stage: pre-launch
north_star_metric: organic search clicks to sinusoidalhistory.com — the first signal that a human, not a crawler, arrived (retention and word-of-mouth are structurally unmeasurable here; the site carries no analytics by design)
north_star_value: 0
north_star_status: measured-zero
north_star_classification: expected-zero
last_deploy: e1254f4
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "The change a reader should see today: the methods page gets one scannable table of all nine verdicts, each row linking to that cycle's 'does it hold up?' block. Behind it, the 46 dependency alerts GitHub started reporting last night get sized by root package and either fixed or given a dated waiver — new coverage, not new breakage."
---

# Daily — sinusoidal-cycles — 2026-09-17

## BLUF

A skeptic can now check the site's headline claim in one table instead of nine pages, and every dependency alert that turning on GitHub's scanner surfaced yesterday is closed — 46 → 0, with nothing a reader sees changing. Baseline and close both read with `gh api repos/u00dxk2/sinusoidal-history/dependabot/alerts?state=open --paginate`: 46 at 2026-09-17 16:05Z, 0 at 17:44Z.

**FIRST ACTION.** Run W-001's Search Console read as a sample-size check — did the query set grow past the five Ray Dalio rows, and did average position move off ~20. It is due 2026-09-19; a zero before ~2026-10-07 is a question, not a verdict.

```powershell
node C:/dev/skylark/sinusoidal-cycles/scripts/gsc-read.mjs --start 2026-09-10
```

**DON'T-TOUCH.** W-001's page-only Search Console read, `node scripts/gsc-read.mjs --start 2026-09-10`. Page grouping is the one grouping whose totals are whole, and a cold agent runs it from the lane root in seconds with no David step; the orchestrator ruled it tier-1 (`45285f05`).

## What changed

**Every spectral verdict now sits in one table on `/methods`** (`44557c1`, refined by `832f4d8`; CI green on both, live 16:27:45Z and 16:37:26Z). The site's most arguable claim — that 0 of 9 cycle-and-data pairings have a record long enough to test — was a single number on `/methods`, with the nine verdicts behind it one per cycle page. Checking it meant opening nine pages. The Spectral testing section now opens with a row per pairing: cycle, stated period, the span of the record the verdict actually tests, periods covered out of the required 3.0, years short of the gate, and the verdict. Each row links to that cycle page's "Does it hold up?" block, which gained the anchor it lands on. The tenth cycle, which has no paired series, is listed and marked rather than silently omitted.

The numbers a reader now sees together make the finding concrete in a way the headline did not: Carlota Perez is 7 years short of testable, Ray Dalio 73, Peter Turchin 339. Every value derives from the frozen `verdicts.json`, which this ship only reads.

**Every dependency alert closed, none of it visible to a reader.** Two ships. `a400821` took the same-range fixes: `npm audit fix` without `--force`, plus vitest and `@vitest/ui` to `^4.1.11`, the only two stated ranges that moved, both dev-only. `7dadae1` then took Next.js 16.2.4 → 16.3.5 under the orchestrator's ruling (bus `15ac3b4b`), both pins still exact — the one bump that could close the other 30. CI green on Linux for both; live 16:59:09Z and 17:37:52Z. Counted from the alert list, not inferred: `gh api repos/u00dxk2/sinusoidal-history/dependabot/alerts?state=open --paginate` read 46 at 16:05Z, 30 at 17:05Z, 0 at 17:44Z.

## Inputs (controllable)

**The gate that made both dependency ships safe.** A snapshot of the visible text of all 20 prerendered pages plus the emitted CSS, diffed across builds on identical source. It is red-armed — mutating one page hash and one CSS hash in the baseline makes the diff name both and exit 3 — so a zero from it is a measurement, not a dead probe. On the same-range sweep it read 0 differences outright; on the framework bump it read dirty until the per-build font-asset URL tokens were normalized away, which is the gate working, not failing. Its one blind spot, stated because this bump is exactly where it matters: the page-text leg collapses runs of whitespace, so it cannot see a one-space-vs-two-space change — which HTML also collapses, and which the frames cover.

**The framework bump was surfaced as a decision, ruled, and then held to its gate.** The 30 alerts that survived the same-range sweep were all one bump: 24 on `next`, 4 on the `postcss` copy nested inside it, 2 on `sharp`. Exposure was verified rather than read off severities — no `middleware.ts` exists (so twelve middleware-bypass advisories describe a file this repo does not have), one critical targets Windows hosts (this is Linux on Render), and the other targets image optimization, where no `next/image` component is used though `/_next/image` answers 200 and `next.config.ts` sets no `images.remotePatterns`, so it reads same-origin paths only on a site that accepts no uploads. That read is what the orchestrator ruled on (`15ac3b4b`), dismissing the board card rather than asking David.

**The gate came back dirty first, and the dirty reading was a filename.** Page text across all 20 prerendered pages: identical. Raw CSS: different — 14 `@font-face` rules whose `url()` carries a different per-build cache-buster, same 743 rules, same 60,063 bytes, font content hashes unchanged. Normalized for that token shape: identical. Two independent confirmations followed — the production frames re-captured on the deployed bump are byte-identical to the ones committed before it, and the 1440 frame shows fonts and table unchanged. Also answered as a condition of the ruling: the JSX whitespace hazard `AGENTS.md` warns about did not reproduce on 16.3.5 in the two cases probed, now recorded there version-scoped.

**Codex.** Probe GREEN at 15:19:36Z; SPAWN leg EPERM, so nothing needing a child process goes to it. Zero calls — every diff today was small and in files this session had already read. Three adversarial reviews run as gates, all approve; the third caught two real things before they shipped, npm having rewritten both exact version pins to caret ranges and an `AGENTS.md` note that claimed more than two probes can support.

## Outputs (lagging)

**Clicks: 0, and today's ships cannot have moved it.** Read today, not carried from yesterday: `node scripts/gsc-read.mjs --start 2026-09-10` at 2026-09-17 18:02Z returns 19 impressions, 0 clicks, average position 21.0 for the 09-10..09-17 window, page-grouped so the totals are whole. Search Console lags ~3 days, so that window can only see through roughly 09-14, and today's changes are hours old — nothing here is a verdict on them. Rule of three on 0 clicks in 19 impressions: the true click-through rate could be anything up to ~16% and still produce this zero. `/cycles/dalio` is again the top page at 9 impressions, position 35.7, which is the same named-theory demand the 09-16 query read found.

**Reached: no.** The verdict table is live and verified in production at 390 and 1440 wide, and the frames were re-taken after the framework bump to confirm it still is. The site carries no analytics by design, so the only observable that a human arrived is a nonzero click in the page-grouped read.

**Retention and word-of-mouth: still unmeasurable**, and not proxied. No accounts, no return loop. The would-tell-a-friend moment is unchanged: "this chart made a contested idea legible enough to argue with." Today's table serves it directly — the argument a skeptic wants to have is now on one screen.

## Recommendation

**Nothing is open on this lane tonight.** The Next.js decision was raised, ruled and shipped the same day; `D-001` is closed and its waiver removed outright rather than re-dated, because a waiver outliving its reason is how a panel goes quietly green. `node ../skylark-site/scripts/check-engineering-zero.mjs --project sinusoidal-cycles` reads `0 finding(s), 0 unreadable, nothing to waive` (17:46Z).

**Tomorrow's first action is W-001's read on 2026-09-19** as a sample-size check, not a click-through verdict.

**Next product build, scoped not started: the same verdict table belongs on `/cycles`.** The index lists ten cycles with no indication that none of them clears the site's own evidence bar; a reader who lands there rather than on `/methods` sees the claims without the verdict. It reuses today's rows wholesale.

## State Appendix

### Retro tags carried into the EOD reply

- Finding #2 (the dispatch pre-flight names the junction path, not the real one): tag `[mitigation: carried — skylark-site/2026-09-18/junction-path-preflight]` until tonight's substrate session mints the real row id (orchestrator `01be84ef`); swap the id in when it arrives.

### Engineering zero-state (read AFTER the last lockfile bump)

- **Dependabot:** `gh api repos/u00dxk2/sinusoidal-history/dependabot/alerts?state=open --paginate` → **0 open** at 17:44Z, read after `7dadae1` landed. 46 at 16:05Z.
- **Gate:** `node ../skylark-site/scripts/check-engineering-zero.mjs --project sinusoidal-cycles` → `lane sinusoidal-cycles: 0 finding(s), 0 unreadable, nothing to waive (both counts are zero)`, exit 0. No waiver in force; `D-001`'s was removed with the row, not re-dated.
- **Sentry:** this lane has no Sentry project (`sentry_open_p1`/`p2` null in every report's frontmatter); the gate's Sentry leg reads nothing for it, which is absence, not a zero.
- **Stale-cache question from P3, settled:** the 16 alerts the gate still listed at 17:05Z after `a400821` had closed them were the panel's cached total, not a second finding — the same command reads zero with nothing done to them in between.

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
