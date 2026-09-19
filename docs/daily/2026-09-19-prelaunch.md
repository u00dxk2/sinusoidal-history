---
product: sinusoidal-cycles
date: 2026-09-19
lifecycle_stage: pre-launch
north_star_metric: organic search clicks to sinusoidalhistory.com — the first signal that a human, not a crawler, arrived (retention and word-of-mouth are structurally unmeasurable here; the site carries no analytics by design)
north_star_value: 0
north_star_status: measured-zero
north_star_classification: expected-zero
last_deploy: b6d23b9
sentry_open_p1: null
sentry_open_p2: null
mrr_usd: null
n_active_users_28d: null
on_hold_items: 0
top_action_today: "The change a reader should see today: on a phone, every cycle page now shows its 'Does it hold up?' answer without scrolling — it used to be cut off mid-sentence just below the edge of the screen."
---

# Daily — sinusoidal-cycles — 2026-09-19

## BLUF

**FIRST ACTION.** Walk `/cycles/dalio` at 390 px as a cold search arrival. It draws 9 of this site's last 19 Search Console impressions and sits at position 35.7, the worst of the indexed set. Take the before-snapshot the ship gets diffed against:

```powershell
node scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles/dalio tmp/dalio-before.txt
```

Run 2026-09-19 15:20Z from the lane root: `snap: ... -> tmp/dalio-before.txt (86 lines)`. That action was executed today and shipped as `b6d23b9`; what follows is the record of it.

**Due, and read.** W-001's Search Console read (`node scripts/gsc-read.mjs --start 2026-09-10`, run 15:09Z): `TOTAL clicks=0 impressions=19 position=21.0`. Nineteen post-ship impressions is far under the row's own floor of 100, so Branch 0 holds and this is a sample-size check, not a click-through verdict. Re-dated to 2026-10-07, which is the row's own disposition (a).

**DON'T-TOUCH.** The frozen snippet surface — titles, meta descriptions, H1s and URLs, on every page — until W-001 reads. Its whole value is a comparison against a baseline: position and impressions only mean something if what searchers are shown has not changed underneath them. Layout and body copy are in scope; the snippet and the URL are not.

## What changed

**On a phone, the verdict now reaches the reader** (`b6d23b9`, CI green, live and verified serving). A cold search arrival on a cycle page met the title, a three-item metadata list and a 280-character description before reaching "Does it hold up?" — the one answer that separates this site from a blog post about cycles. Measured at 390x664, which is what an iPhone 14 in Safari actually shows, the verdict's answer sentence ended at **681px, 17px below the fold** (`node scripts/measure-fold.mjs https://sinusoidalhistory.com/cycles/dalio 390 664`). The 844px CSS viewport cleared it, which is exactly how the defect stayed invisible. Moving the Period / Reference peak / Paired data list out of the header and down against the curve that plots it brings the answer to **620px, 44px above the fold**. It is one component, so it applies to all ten cycle pages.

**No reader-facing words moved, and that is measured.** `check-rendered-text.mjs` reports 86 lines before and 86 after, and a sorted comparison of the two snapshots finds **no differences** — the same line set in a different order.

**Frames** (production, committed): `docs/frames/2026-09-19-dalio-390-before.png` and `-after.png`, both at 390x664 and clipped to the viewport rather than full-page, so the fold is where a reader's screen ends. The before frame slices "— and that is the finding, not a dodge" in half; the after frame shows it whole.

**One extreme is left red on purpose.** At 360x560 — a small Android in a browser with chrome — the verdict is still 177px below the fold. A 560px visible viewport is shorter than this page's title plus description can clear, and shrinking either is a different decision from moving a metadata list. `scripts/measure-fold.mjs` exits 1 there and says so, so the next person to touch this header is told rather than surprised.

## Inputs (controllable)

**The fold check is committed, and its red arm is the reason to trust it** (`d26a43f`). `scripts/measure-fold.mjs` answers one question — does a cycle page's verdict reach a reader without a scroll — against the real visible viewport rather than the CSS one. Red arm: `node scripts/measure-fold.mjs https://sinusoidalhistory.com/cycles/dalio 360 560` → `RED: the verdict is cut — 177px below the fold`, exit 1. Green arm: the same command at `390 664` → `OK: the verdict is fully visible, 44px of room to spare`, exit 0.

**What the day's checks actually read.** CI GREEN on `000e2f3`, `b6d23b9` and `d26a43f`, each read with `check-ci-status --sha <full 40-hex>`. `npm run lint` clean; `next build` compiled and prerendered all 26 routes. Adversarial review on the working tree before the commit: `approve`, "No material findings", with "Browser layout was not verified" named as its gap — which the fold measurement and the two frames cover. Delivery: `check-deployed-sha-drift --service sinusoidal-history` returned `NOT-APPLICABLE-BY-REGISTRY` (the service deploys on the commit trigger, and that checker judges checks-gated services only), so it declined to judge and the delivery evidence is instead a live read — `check-rendered-text.mjs diff tmp/dalio-after.txt https://sinusoidalhistory.com/cycles/dalio` → `GREEN: identical visible text (86 lines)`.

**One gate still does not run.** agent-status's verify-receipt reads `UNREADABLE … no cc-workspace.json entry for slug "sinusoidal-cycles"` on every post. The workspace id for this path is `sinusoidal`; the roster slug is `sinusoidal-cycles`. Today that same one-line cause also blinded five of the kickoff composer's own state reads — dated gates, primer, primer banner, listener, HEAD CI — and the orchestrator confirmed it reaches their side too. It is theirs and shipped tonight as a resolver fallback. Its silence is not a green.

**Engineering zero, read after the last push.** `gh api "repos/u00dxk2/sinusoidal-history/dependabot/alerts?state=open&per_page=100" --paginate --jq "length"` → **0**. `check-engineering-zero --project sinusoidal-cycles` → `lane sinusoidal-cycles: 0 finding(s), 0 unreadable, nothing to waive`. No waiver is in force.

## Outputs (lagging)

**Clicks: 0, and that number carries no information yet.** `scripts/gsc-read.mjs --start 2026-09-10`, run 2026-09-19 15:09Z: window 2026-09-10..2026-09-19, `clicks=0 impressions=19 position=21.0`. At 0 clicks on 19 impressions, the rule of three puts the upper bound on true click-through at roughly 15% — which is to say the read excludes almost nothing. Per page: `/cycles/dalio` 9 impressions at position 35.7; `/about`, `/cycles/kondratiev` and `/state/2026` at 2 each; six more at 1 each.

**The rate is slower than this row assumed, and that matters for the date.** Nineteen impressions over the days Search Console actually holds data for — 2026-09-10 through roughly 09-16, seven days, the window truncated by its own ~3-day reporting lag — is ~2.7/day, against the ~4/day recorded on 09-16. Projected to the 2026-10-07 read, covering through ~10-04: ~68 impressions at the measured rate, ~100 at the assumed one. The floor is 100, so the new date sits at the optimistic edge rather than safely past it.

**Reached: yes. Exercised: unknown.** The change is live and serving. The site carries no analytics by design, so no read can show that a person scrolled, or did not have to.

## Recommendation

**Tomorrow's first action is a cold-arrival walk of `/cycles`**, the index, at 390x664 — the same read that found today's defect, pointed at the page a reader reaches when they do not already know which theory they want. Take the snapshot first: `node scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles tmp/cycles-before.txt`.

**Do not extend W-001 again.** If the 2026-10-07 read lands under 100 impressions, the row converts to the question answerable at that sample size — did the query set grow past the five Dalio-dominated rows, did average position move off ~21 — and click-through reopens as a fresh row only if position moves under 20. This is written into the row itself (`90b39fe`) so it is a decision already made rather than one taken under pressure on the day.

**Nothing is blocked on David**, and no board card is open for this lane (`node ../skylark-site/scripts/answered-cards.mjs --project sinusoidal-cycles` → `NO waiting/answered/pending-verify cards`, read 2026-09-19 15:58Z).

## State Appendix

### Section 0 (pre-flight, run at P1)

- **Primer:** PRESENT (`docs/cold-starts/2026-09-19.md`), banner read first. The kickoff's own primer read was UNREADABLE for the slug reason above, so PRESENT here is this lane's read, not the composer's.
- **Listener:** SSE alive. Own file `tmp/.bus-listen.err`, newest restart marker `2026-09-19T14:51:56.520Z pid 35360`, `SESSION START … project=sinusoidal-cycles`, `hello` 14:52:04Z, `replay-complete … replayed 0`. `read-listener-strand.mjs` itself exits 2 UNREADABLE (NO_LANE_ROOT) — the absence of a read, not a dead listener. Waker ladder: three rungs, rank 1 relaunched twice during the day.
- **Codex:** GREEN, quoted from the kickoff stamp (machine-level exec at 14:51:50Z), not re-run. `codexCalls: 0 (probed-declined)` across every phase today.
- **CI + drift (P0 gate):** PASSED. `check-ci-status --repo .` → `GREEN — 1 completed non-scheduled success for HEAD 52e3b74598`. Drift: `NOT-APPLICABLE-BY-REGISTRY`; the liveness read it asks for returned HTTP 200 on `/cycles`.
- **Harness:** running 2.1.278 · fleet UNIFORM (26 of 26 panes) · installed 2.1.278 (SAME).
- **Recs from 2026-09-18:** both disposed — the Search Console read **executed** (19/0/21.0); the `/cycles/dalio` walk **carried to P3 and shipped** as `b6d23b9`.

### Commits

| SHA | What | CI |
|---|---|---|
| `000e2f3` | W-001 read at n=19, Branch 0 holds, extended to 2026-10-07 | GREEN |
| `b6d23b9` | the verdict clears a phone fold on every cycle page | GREEN |
| `d26a43f` | the fold check and the two frames it read | GREEN |
| `90b39fe` | W-001 waits gate — pre-register what happens if 10-07 lands short | pushed 16:0xZ, not yet judged |

### Two guards that fired on me

`check-ci-status --sha` and `git merge-base` each refused a 40-character sha whose tail I had reconstructed rather than read, having queried nothing. Twice, in one session — the second refusal is the informative one, because it shows the first taught me nothing. The mechanical rule: a full sha comes out of `git rev-parse` or `git log --format=%H`, never out of a sentence about a commit.
