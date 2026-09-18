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

## What changed

**The `/cycles` index now shows every spectral verdict before the roster** (`ae830b5`, CI green, live on Render 16:15:12Z). A reader who lands on the index rather than `/methods` used to see ten theories with no sign that none clears the site's own evidence bar. The index now opens a section, "Does any of them hold up?", with a count derived from the frozen verdicts: 0 of the 9 paired theories have a record long enough to check at their stated period. Below the count sits the same table `/methods` carries, one row per pairing, and each row lands on that cycle page's "Does it hold up?" block. The table is now one shared component (`src/components/VerdictTable.tsx`), so the two pages cannot drift apart.

**`/methods` did not change, and that is measured, not assumed.** Production `/methods` visible text read before the change and again after the deploy: identical, 223 lines. The same comparison between production and the local build also came back identical. The comparison is red-armed: changing one verdict cell in a copy (`+73` → `+74`) makes it report `RED: first difference at line 157` and exit 3.

**Frames** (production, committed under `docs/frames/2026-09-18-*`): `/cycles` and `/methods` at 390 and 1440, plus a 390 frame with the table scrolled to its verdict column. Each frame is cropped to the element whose rows the same script counted: 10 rows on every page and width, 0 px of horizontal page scroll, and every theory-name link pointing at `#does-it-hold-up`. I opened every PNG before citing it. At 390 the theory-name column stays pinned while the verdict columns scroll, on both pages.

## Inputs (controllable)

**The gate that proved the refactor is now committed** (`e5c53c4`), which is the day's second change and the answer to a loop that had run twice. `scripts/check-rendered-text.mjs` snapshots the visible text of a URL, an `.html` file, a directory of them, or a saved snapshot, and diffs two of them. Both prior sessions rebuilt this from scratch in a scratchpad and lost it at session end. Its success signal is its red arm, per the orchestrator's ruling: `--selftest` reads `6 passed`, and with the comparison broken in a scratch copy so it can never report a difference it reads `selftest: 2 FAILED`, exit 1. CI runs it through `src/lib/check-rendered-text.test.ts`, which spawns the script rather than importing it, because this lane has no shebang-stripping plugin for vitest.

**What the day's checks actually read.** CI GREEN on `ae830b5` (`check-ci-status --workflow ci.yml`). Full suite through `verify-with-receipt -- npm test`: 85/85, exit 0. Adversarial review on the working tree: approve, no material findings, with mobile overflow named as untested and then covered by the frames. One gate did NOT run: agent-status's verify-receipt, which reads `UNREADABLE … no cc-workspace.json entry for slug "sinusoidal-cycles"`. That is a skylark-site registration gap (the workspace id for this path is `sinusoidal`), confirmed by the orchestrator and on their substrate list. Its silence is not a green.

**Engineering zero, read after the last push of the day.** `gh api "repos/u00dxk2/sinusoidal-history/dependabot/alerts?state=open&per_page=100" --paginate --jq "length"` → **0**. `check-engineering-zero --project sinusoidal-cycles` → `lane sinusoidal-cycles: 0 finding(s), 0 unreadable, nothing to waive`. No waiver is in force.

## Outputs (lagging)

**Clicks: not re-read today.** W-001's read is due 2026-09-19, and Search Console lags ~3 days, so nothing after today's 16:15Z deploy is readable before ~2026-09-21. **Reached: unknown.** The site carries no analytics by design, so no read can show whether a person has opened `/cycles` since the deploy.

## Recommendation

**Tomorrow's first action is W-001's Search Console read**, `node C:/dev/skylark/sinusoidal-cycles/scripts/gsc-read.mjs --start 2026-09-10`. Read Branch 0 in that row's `nextTrigger.branching` before applying any branch under it: below 100 post-ship impressions the discriminators are inapplicable and the disposition is to extend the window to ~2026-10-07. At the measured ~4 impressions a day, a 09-19 read sees about 28.

**Next product build, scoped and not started:** walk `/cycles/dalio` at 390 px as a cold search arrival and remove whatever sits between landing and that page's "Does it hold up?" answer. It drew 9 of 19 impressions in the last window at position 35.7. Its title, meta description, H1 and URL stay frozen until W-001 reads.

**Nothing is blocked on David**, and no board card is open for this lane (`answered-cards --project sinusoidal-cycles`: "NO waiting/answered/pending-verify cards").

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
