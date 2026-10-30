# sinusoidal-cycles — 2026-10-30 (Friday, MT) — full day

## BLUF

Full day (the orchestrator's kickoff: "FULL day across the portfolio"). P1 selects **I-063**: the home page's "Theory shapes" glance figure draws nine of ten humps bunched between 1945 and 2020, and both production walkers on 10-22 read that as convergence until they reached the editor's note about four screens down. Today's change puts the reason (each theory is anchored to a recent peak, a selection effect) in place, under the figure. I-051's Search Console read ran: all three named-query legs read **not moved yet** (0 named impressions each; 36 of 40 impressions anonymized, so 0 is a floor). CI green, live = head. Nothing waits on David.

## What changed

Nothing shipped yet (P1 is selection only).

## Recommendation

### P1 selection packet

[P1 — Evidence and choice]

- **Outcome:** I-063 — the home glance figure says, on its own screen, why its humps cluster.
- **User problem, in a reader's words:** "Nine humps bunched between 1945 and 2000 look like convergence until you read the note." (walker W1, 10-22; W2: "Nine of the ten humps bunch between 1945 and 2020, which looks like convergence until you read the note." Synthetic walkers, N=1 each, not real readers.)
- **Evidence:**
  - OBSERVED · `docs/walks/2026-10-22-i061-production.md` lines 57, 58, 77 · 2 of 2 production walkers at 390x664 on 5274fce7 · recorded question (13) · limits: synthetic, and under the SCORED question (9) both said nothing suggested convergence.
  - OBSERVED · source: `src/components/CycleOverview.tsx` draws ten rows, an axis, the verdict line and "Each in detail below — tap one to focus and calibrate."; nothing on it says why the humps sit where they do. The reason lives only in `src/components/ConvergenceNote.tsx` ("A selection effect, not convergence. … nine of the ten peak years here fall between 1945 and 2020 …").
  - OBSERVED · evangelism bar (`docs/evangelism-bar.md`): "What breaks the moment: any sentence that overclaims." A figure that reads as the cycles agreeing is that overclaim made by a picture.
  - OBSERVED · I-051 encounter read, `gsc-read.mjs --start 2026-10-16 --end 2026-10-30` (page-grouped, whole totals): 1 click, 40 impressions, position 9.3; /cycles/dalio 2 impressions, /cycles/strauss-howe 1, /cycles/turchin no row (/cycles/turchin-fathers-sons 1). Query-grouped one-off read of the same route and window: 2 named query rows ("cycle of ten" 3, "sinusoid" 1), so 4 of 40 impressions are named and 36 anonymized. Dalio 0, Strauss-Howe 0, Turchin 0 named-query impressions. The positive control is the two named rows the route did return. Search Console lags ~3 days, so 10-28..10-30 are empty.
  - OBSERVED · `check-cycle-rotation --lane sinusoidal-cycles` exit 0: "no product-love cycle picks this lane today".
  - OBSERVED · `answered-cards --project sinusoidal-cycles`: no waiting, answered or pending-verify cards.
  - MISSING · real-user evidence. The bar reads UNMEASURED (no client analytics, by standing choice).
- **Permission:** I-063 is an open P3 issue owned by this lane, not parked, frozen or waiting, with no card. It's copy and layout on the lane's own home page, which the lane decides. It's published under the site's name, so portable rules 3 and 6 require the Codex claims pass before push.
- **Constraint carried from yesterday's retro (Q5, still on discipline):** check any suggested wording against AGENTS.md's I-061 paragraph ("No surface says where the present … sits on a cycle"). The new sentence names why the peaks cluster and never where today sits.
- **Next action:** kind = improve. First command, to pin today's 320x568 fold margin before editing:

  ```
  node C:/dev/skylark/sinusoidal-cycles/scripts/check-entry-folds.mjs https://sinusoidalhistory.com
  ```

  Then: add one short plain sentence under the glance figure's axis (below the rows, where the I-048 comment says anything else must go) naming why the humps cluster. Candidate: "The humps bunch because each theory is drawn around a recent peak it names: a selection effect, not agreement." Pin it in a test beside `convergenceShape.test.ts`, re-run `check-entry-folds` and `check-glance-now-mark`, run the cos-math audit (no year claims should move), then the Codex claims pass (read-only, banner workdir checked).
- **Acceptance condition:** on production at 390x664, the sentence is visible on the same screen as the glance figure. `check-entry-folds` stays at 13 of 13 at 320x568 and 360x560. A pre-registered cold walker who has not seen the site, asked the same recorded question (13), does not read the figure as convergence.
- **Delivery and encounter checks:** delivery: `check-deployed-sha-drift --service sinusoidal-history` in-sync on the fix sha, plus a Playwright `main` innerText read showing the sentence (the figure is client-rendered, so `check-rendered-text` is blind to it, per AGENTS.md). Encounter: blind (no analytics). The readable event is a home-page impression in Search Console after the deploy date (`/` had 8 in the window), readable ~3 days later; exposure will read blind.
- **USER-FACING: yes.** Paths: `src/components/CycleOverview.tsx` (likely also `src/lib/overviewReading.ts` if the sentence lives there); internal: a new or extended test under `src/components/`, `continuity/items.json`.
- **HYGIENE INPUTS:**
  - (a) Due rows that don't bear on the choice: 3, from this morning's snapshot ("snapshot written — 4 gate(s) due on/before 2026-10-30"; I-063 is selected): I-043 (stamped 10-27, `/methods` snap), I-049 (stamped 10-27, `/cycles` snap), I-051 (stored readCommand never run through the gate; read by hand today, verdict above: three legs not moved yet; the 11-02 fallback read is the next date).
  - (b) Owed child rows in the orchestrator's ledger: none (kickoff read "rows owed to you": 0 of 773).
  - (c) State reads marked CROSSED: none — read: dated gates (4 owed today, listed in (a) plus I-063), rows owed 0, board cards 0, queued rows 0, stale-actionable 0 of 17, missingLinkedCommits swept nothing.

## State Appendix

### Section 0

- **Primer:** `docs/cold-starts/2026-10-29.md` read (no 10-30 primer; the newest on or before today).
- **Listener:** 🟢 SSE alive (hello 2026-10-30T14:57:05Z, replayed 0) + `/loop-tick 2m` armed by `ScheduleWakeup`; waker ladder ranks 1–3 running.
- **Codex:** GREEN per the kickoff's `[codex-probe: …]` line (14:53:32Z, execute and write proved).
- **CI:** `check-ci-status --workflow ci.yml` → GREEN for 7d763cdc (1 success, 0 failures, 0 pending).
- **Drift:** `check-deployed-sha-drift --service sinusoidal-history` → in-sync, live 7d763cdc = head.
- **Harness:** running 2.1.314 · fleet UNIFORM (28 of 28) · installed 2.1.314 (SAME).
- **Recs yesterday:** one, the 10-29 P1 packet (I-065) → executed (9ffe14b live, I-065 closed).
- **Due snapshot:** `check-due-gates-dispositioned --snapshot` → "snapshot written — 4 gate(s) due on/before 2026-10-30": I-043, I-049, I-051, I-063.
