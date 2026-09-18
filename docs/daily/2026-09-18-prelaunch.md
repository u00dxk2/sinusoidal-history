---
product: sinusoidal-cycles
date: 2026-09-18
lifecycle_stage: pre-launch
north_star_metric: organic search clicks to sinusoidalhistory.com — the first signal that a human, not a crawler, arrived (retention and word-of-mouth are structurally unmeasurable here; the site carries no analytics by design)
north_star_value: 0
north_star_status: measured-zero
north_star_classification: expected-zero
last_deploy: e0f67e7
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "The change a reader should see today: the /cycles index gets the same nine-row verdict table /methods carries, so a reader who lands on the index sees that no cycle clears the site's own evidence bar before choosing one to read."
---

# Daily — sinusoidal-cycles — 2026-09-18

## BLUF

**FIRST ACTION.** Put the spectral verdict table on `/cycles`. Today it lives only inside `/methods` (`src/app/(app)/methods/page.tsx`), so the index lists ten cycles with no sign that none clears the site's own evidence bar. Lift the table into one shared component and render it on both pages. Start by confirming the guard it must keep green, since that guard fails if the `/methods` rows and `public/methods.md` drift apart:

```powershell
npx vitest run src/lib/spectral.test.ts
```

Run 2026-09-18 15:31Z from the lane root: `2 passed`.

**Due, not today.** W-001's Search Console read is due 2026-09-19 (`node C:/dev/skylark/sinusoidal-cycles/scripts/gsc-read.mjs --start 2026-09-10`). It checks sample size and does not give a click-through verdict. Read Branch 0 first.

**DON'T-TOUCH.** The hand-authored primer banner (`<!-- hand:begin banner -->` in `docs/cold-starts/<date>.md`). It is rewritten in place at every close, not appended, so it always states the day's current rules: what is due, what is not, and what not to "fix". The kickoff quotes it verbatim, which is why today's arrival needed no reconciliation.

## State Appendix

### Section 0 (pre-flight, run at P1)

- **Primer:** PRESENT (`docs/cold-starts/2026-09-18.md`), banner read first.
- **Listener:** SSE alive. Session start 15:11:06Z, last hello 15:26:43Z, 0 no-loop warnings since start (`read-listener-strand.mjs`). Waker ladder: three rungs. Loop armed by tool call.
- **Codex:** GREEN (probe 2026-09-18T15:09:03Z, quoted from the kickoff, not re-run). The SPAWN leg fails with EPERM.
- **CI gate:** `check-ci-status --workflow ci.yml` → GREEN on `e0f67e7` (1 success, 0 failures, 0 pending).
- **Deploy drift:** `check-deployed-sha-drift --service sinusoidal-history` → `NOT-APPLICABLE-BY-REGISTRY` (this service redeploys on every commit, so the checker declines it). I read the deploy rows directly with the Render API: `e0f67e7` is `live` (finished 2026-09-17 20:00:26 MT). The live commit equals HEAD.
- **Dependabot:** `gh api "repos/u00dxk2/sinusoidal-history/dependabot/alerts?state=open&per_page=100" --paginate --jq "length"` → **0** at ~15:28Z. D-001 stays closed; no waiver exists to narrow.
- **Recs yesterday (3):**
  1. "Nothing is open on this lane tonight" → confirmed: 0 alerts, CI green, live commit equals HEAD.
  2. W-001 read on 2026-09-19 → carrying → 2026-09-19 (the row's `nextEvaluation`).
  3. Verdict table on `/cycles` → carrying today → P3 Section A.
