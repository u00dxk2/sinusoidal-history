# sinusoidal-cycles — 2026-09-29

## P1 — Evidence and choice

[P1 — Evidence and choice]

**Outcome:** each `/cycles/<slug>` page says, in words, where its curve puts this year. Item: **I-009** (new, minted at P3).
**The problem, as a reader has it:** "I searched 'Ray Dalio big cycle theory' and landed on this page. Where are we in the cycle *now*? The page gives me the period, the 1950 peak and a chart, but it never says it."

### Section 0

- Primer: `docs/cold-starts/2026-09-29.md` read. First action run: `check-calibrate-tab.mjs` on production **30/30 PASS** (13:2xZ).
- Listener: 🟢 SSE alive (SessionStart relaunch, hello 12:56:41Z, replay 0) + loop armed by `ScheduleWakeup`; waker ladder ranks 1-3 running.
- Codex: GREEN (the `[codex-probe:]` line on this kickoff, 13:03Z).
- CI: `check-ci-status --workflow ci.yml` → **GREEN** on c33a249 (full sha, local HEAD).
- Deployed drift: `check-deployed-sha-drift --service sinusoidal-history` → NOT-APPLICABLE-BY-REGISTRY (a commit-trigger service). Read directly from the Render deploys API instead: **c33a249 live** (finished 2026-09-28 18:52:11Z) = HEAD. No drift.
- Harness: running 2.1.284 · fleet UNIFORM (26/26) · installed 2.1.284 (SAME).
- Recs yesterday: both 2026-09-28 closes carried W-003, I-006 and I-008 to 2026-10-03, and W-001 to 2026-10-07. All four are still dated and none is due. Nothing was instructed that is missing from the tree.
- North star: product-love. This change gives the arriving searcher the answer to the question they came with. Nothing on this site can measure its effect on a reader (no client analytics, by standing choice), so it will be reported as unmeasured.

### Evidence

- OBSERVED: `node scripts/gsc-read.mjs --start 2026-09-01` (Search Console, page grouping, whole totals), 2026-09-01..09-29 with the usual ~3-day lag. **70 impressions, 0 clicks.** `/cycles/dalio` is the most-impressed page (12, avg position 43.7), then `/cycles/khaldun` (9, 7.1) and `/about` (8, 5.8). Per-cycle pages hold 34 of the 70 impressions listed (the page list is truncated at the route's row limit; the total is whole).
- OBSERVED: `gsc-demand-worklist --days 28` (2026-08-31..09-27). All 5 non-brand queries with impressions are Dalio queries except one: "ray dalio big cycle", "ray dalio big cycle theory", "ray dalio big cycles", "ray dalio the big cycle" (positions 49.5-60), plus "cycle of ten" (8.0). Query grouping drops anonymized rows, so these are a floor, not the whole set.
- OBSERVED: the rendered text of production `/cycles/dalio` (`check-rendered-text snap`, 87 lines, 2026-09-29). It gives the period, the 1950 reference peak, "Does it hold up?", the calibration rationale, and the extrema across 1600-2050. **No line states where the curve puts 2026.** A reader has to find 2025 in the peaks row and infer it. The same derivation is already published as `/state/2026` (`cycleStateAtYear`: cos, phase label, next peak, next trough), but no cycle page links to it or shows it.
- OBSERVED, a second defect on the same page: the paired-series description renders a literal backslash, "2011 PPP \$". Source: `src/data/series.json:54` and `:119` hold `\\$`, which decodes to `\$`. It affects `/cycles/dalio` and the Modelski page's series.
- HYPOTHESIS: a searcher arriving on a theory's name wants "where are we now" first. That is the question the site's title promises ("where the cycles stand"), and the one the page leaves to inference.
- MISSING: any real-user evidence. There are no client analytics. `check-cycle-rotation` → exit 0, "no product-love cycle picks this lane today". `docs/evangelism-bar.md` and `docs/evangelism-evidence.md` do not exist in this repo. Search Console measures who was *shown* the page, not what they did on it.

### Permission

This is this lane's own page template and data text, and its own call. No board card is open on it. The line is **derived, not authored**: it uses the same `cycleStateAtYear` as `/state/<year>`, so it cannot drift from the math (KP-001). The W-001 freeze (until 2026-10-07) covers titles, meta, H1 text and URLs. A body line is outside it, and so is the `series.json` description text. The spectral manifest pins CSV hashes and pairing periods, not description strings; I will re-verify that with `--selftest` before commit.

### Next action: improve

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-entry-folds.mjs --width 320 --height 568
```

That is the fold baseline for the 13 entry legs, 10 of which are cycle pages. Then add to `src/app/(app)/cycles/[id]/page.tsx` one derived line in the page's metadata list (beside Period / Reference peak / Paired data), for example "In 2026 · peaking (cos +1.00) · next trough 2063, next peak 2100". It comes from `cycleStateAtYear(cycle, year)`, is labelled as this construction's position (the page already says its extrema are "positions of this construction, not dates claimed by the theorist"), and links to `/state/<year>`. Fix `\\$` → `$` in `series.json` (2 rows) and in any mirror that carries the same text.

### Acceptance

On the local build (`next build` + `next start`) and again on production after deploy:
1. All 10 `/cycles/<slug>` pages show the year line, and its values equal `/api/v1/state?year=<year>` for that cycle (cos, phase, next peak, next trough), checked by a script over all 10.
2. `check-entry-folds` reads 13 of 13 at 320x568, 360x560 and 390x664, with every cycle leg at **8px spare or more**. If the line costs a leg its fold, it moves below the answer block instead of shipping above it.
3. No page renders `\$`: a rendered-text search over all 10 cycle pages finds 0.
4. `npm test` passes, `python scripts/audit_cycle_rationales.py` runs clean, and the rendered-text multiset of the other cycle-page lines is unchanged apart from the added line and the `$` fix.

### Delivery and encounter checks

- Delivery: Render deploy row for the new sha = live, then acceptance 1-3 on production.
- Encounter: blind at the reader level (no analytics). The nearest real read is Search Console. This is a body change on pages that are already indexed, so re-crawl is the precondition. The W-001 read on 2026-10-07 will show whether `/cycles/dalio`'s position on the Dalio queries moved (N is tiny: 6 impressions in 28 days). A reader-level encounter comes from W-003's cold walk on 2026-10-03, if it lands on a cycle page.

### USER-FACING: yes

Paths: `src/app/(app)/cycles/[id]/page.tsx`, `src/data/series.json`, possibly `public/data/<slug>.source.md` or `public/llms.txt` if they carry the `\$` text, plus `continuity/items.json` and this report, which are internal. No prose page changes, so the prose-mirror rule does not trigger unless the `\$` sweep finds text in `public/*.md`.

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none**. Read from `dated gates due today` (0) and this morning's `check-due-gates-dispositioned --snapshot` ("0 gate(s) due on/before 2026-09-29").
- (b) Owed child rows in the orchestrator's ledger: **none**. Read from `rows owed to you` (0 of 729).
- (c) State reads marked CROSSED: **none**. Of the kickoff's reads, none printed a crossed threshold. `missingLinkedCommits` read NOTHING SWEPT (0 of 0), `stale-actionable` read 0 of 4, and HEAD CI (UNKNOWN at compose on a gh timeout) re-read GREEN live.
- Noted for the helper, not a ledger row: `docs/key-user-flows.md:81` still lists "Calibrate tab has no chart in view (D8/M12) — carried". `cdc1e4c` fixed that on 2026-09-28.
