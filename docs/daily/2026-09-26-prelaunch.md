# sinusoidal-cycles — 2026-09-26 (three-stage day)

## Selection packet (P1 — evidence and choice)

**Outcome:** every entry page answers on the first screen of a 320x568 phone (the smallest
phone in use), taking it from 10 of 13 to 13 of 13. No ledger row: this is the open gap in
the leading number that `docs/daily-config.md` declares ("The two leading product
numbers", number 1). `W-002` and `I-006` are dated 2026-09-27 and are not due today.

**The user's problem, in their words:** "I opened the link on my phone and had to scroll
before I could tell what the page was going to tell me." On a 320-wide phone this happens
on three of the thirteen pages a reader can arrive on: `/cycles`, `/cycles/turchin` and
`/methods`.

### Evidence

- OBSERVED: `node scripts/check-entry-folds.mjs --width 320 --height 568` against
  production, 2026-09-26 ~09:50 MT: **RED, 10 of 13.** `/cycles` is cut 2px, `/methods`
  40px, `/cycles/turchin` 28px. The thinnest passing legs are `/cycles/perez` (2px spare)
  and `/` (12px spare). Population: 13 legs from the script's table, all on production.
  Limits: the script cannot see an answer clipped by an `overflow:hidden` ancestor, and it
  measures one viewport per run.
- OBSERVED: the same number was 13 of 13 at 390x664 and at 360x560 on 2026-09-25
  (`docs/daily-config.md`). At 360x560 the thin legs are `/` at 4px, `/cycles/turchin` at
  12px and `/methods` at 13px, so any change to shared chrome must re-read 360x560.
- OBSERVED: organic clicks are 0 over 14 indexed pages (`scripts/gsc-read.mjs`, last read
  2026-09-16). This lane is under the `W-001` freeze until 2026-10-07.
- MISSING: real-user evidence. The site carries no analytics, `docs/evangelism-bar.md`
  does not exist in this repo, and no reader has written in. The first-screen number is
  the only product-quality read available before a human arrives. It stands in for real
  users; it is not evidence from them.
- MISSING: how many real visitors use 320-wide screens. No analytics, so the share of
  readers affected is unknown.
- Cycle rotation: `check-cycle-rotation --lane sinusoidal-cycles` exit 0. No
  product-love pass is due on this lane today.

### Permission

- The change is layout only: type size, spacing and block order below 390px. That is inside
  `W-001`'s freeze, which holds titles, meta descriptions, H1 text and URLs until
  2026-10-07 but leaves layout and body copy open. H1 *size* may change; H1 *text* may not.
- It is the lane's own presentation code. No card is open and no row is parked. No David
  decision is needed.

### Next action — improve

Kind: improve. First command (the reproduction, which also serves as the red arm):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-entry-folds.mjs --width 320 --height 568
```

Plan: add one more type/spacing step for widths below 360px on the three failing pages.
Each step has a max-width guard (`max-[359px]:`), so 360 and above do not change. Try the
per-page step before touching the 103px shared site header: at 360x560 the home page has
only 4px of headroom. Per yesterday's retro, delegate the measure-and-edit loop to one
sub-agent instead of running ~25 measuring calls in the main context.

### Acceptance condition

- On production after the deploy: `check-entry-folds --width 320 --height 568` reads
  **13 of 13** (exit 0).
- The same command at `--width 360 --height 560` and at the default 390x664 still reads
  13 of 13.
- Desktop unchanged: frames at 1024x768 and 640x800 match production pixel for pixel, and
  `check-rendered-text.mjs diff` over `.next/server/app` is GREEN. The change is layout, so
  no visible text should move.
- `npm run typecheck`, lint and tests pass, and CI is green on the pushed SHA.

### Delivery and encounter checks

- Delivery: re-run all three fold reads on production after Render deploys, and confirm
  the served build carries the change by reading it back in the three sizes.
- Encounter: none possible to read — no analytics. The event that would show it is a
  320-wide mobile visit that does not scroll before leaving, which is unobservable here.
  Report as `reached: unknown`, `exercised: unknown`.

### USER-FACING: yes

Likely paths (confirmed at P3): `src/app/(app)/cycles/page.tsx`,
`src/app/(app)/cycles/[id]/page.tsx`, `src/app/(app)/methods/page.tsx`, possibly
`src/components/SiteHeader*` (only if the per-page step cannot close `/methods`' 40px).

### HYGIENE INPUTS

- (a) Due rows not bearing on the choice: **none** — read `check-due-gates-dispositioned
  --snapshot` (0 gates due on/before 2026-09-26, 9 rows swept).
- (b) Owed child rows in the orchestrator's ledger: **none** — read the kickoff's "rows
  owed to you" (0 of 724).
- (c) State reads marked CROSSED: **none** — read every kickoff state read. No threshold
  line printed. `missingLinkedCommits` read NOTHING SWEPT (0 of 0), which is not a
  crossing.
- Carried unrowed, from the retro: `next dev` rewrites `AGENTS.md` (handed to David with
  no row). It is still uncommitted in the tree today (`git status`: ` M AGENTS.md`).

## P3 — product-work loop

Approved by the orchestrator (bus `d72039f5`), with two suggestions: tighten what sits
above the answer before shrinking type, and aim for at least 8px spare.

- **Implementation:** `4c1228e` changes three files, all with `max-[360px]:` (width < 360)
  classes. On `/cycles`, the first entry's name had wrapped off its colour bar, leaving
  32px of empty space above the answer; it now stays beside the bar. `/methods` and the
  shared cycle-page template get a 16px gutter, a smaller H1 and tighter spacing. No body
  or dek text shrinks. H1 text, titles, meta and URLs are unchanged. CI is GREEN on
  `4c1228e` (`check-ci-status --sha … --workflow ci.yml`). `npm test` passed through
  verify-with-receipt (13 files, 91 tests), and lint and typecheck exited 0 locally.
  Rendered text is GREEN (1589 lines). 12 frame pairs (1024x768, 640x800, 390x664,
  360x560 on the three pages) are pixel-identical to production.
- **Independent review:** Codex adversarial review ran on the working tree, verdict
  needs-attention, with 1 finding. Finding: "/cycles descriptions render at 14px below
  sm, under the 15px floor". REJECTED for today: the 14px was already there before this
  change, nothing here shrinks it, and raising it would change 360 and 390 too. It is
  carried as a note below.
- **Delivery:** Render deploy for `4c1228e` went live at 16:31:26Z (Render deploys API,
  service `srv-d7mcat7lk1mc73bidim0`). The surface read on production, 2026-09-26
  ~10:32 MT, with `check-entry-folds`:
  - 320x568: **13 of 13**, up from 10. Spare: `/cycles` 30px, `/methods` 25px,
    `/cycles/turchin` 12px, `/` 12px.
  - 360x560: 13 of 13, with the same thin legs as yesterday (`/` 4px, `/cycles/turchin`
    12px, `/methods` 13px).
  - 390x664: 13 of 13, thinnest `/` at 72px.
- **Encounter:** unknown. The site carries no analytics, so there is no read of a
  320-wide visit.
- **Outcome:** unknown for the same reason. The leading number moved from 10 of 13 to
  13 of 13 at 320x568. That is a layout measurement, not a user outcome.

### Carry to the close

- The `/cycles` index descriptions are 14px below `sm` (Codex finding, pre-existing).
  Raising them to 15px costs first-screen spare at every phone size. `/cycles` has 30px
  at 320 and 69px at 360, so there is probably room. That is a judgement for a future
  day, not a defect.
- Below 360px, `/cycles` keeps a 20px gutter while `/methods` and the cycle pages use
  16px. This is cosmetic, a one-class change.

### Section 0

- Primer: read (`docs/cold-starts/2026-09-26.md`, first action = this gap).
- Listener: 🟢 SSE alive (hello 15:43:31Z, restart marker 15:29:29Z) + loop armed by
  `ScheduleWakeup`. The Stop hook owns the cadence.
- Codex: GREEN per the kickoff's `[codex-probe]` line (15:31Z). No calls at P1.
- CI: GREEN — `check-ci-status --workflow ci.yml` on `0fb1adf9…`, exit 0.
- Deploy drift: this lane's service `sinusoidal-history` is **not swept**. There is no
  liveness read on record and no `healthCheckPath`, so drift cannot be judged here. That is
  not a stop and not a pass. The P3 delivery check reads production directly instead.
- Harness: running 2.1.283 · fleet UNIFORM · installed 2.1.283 (SAME).
- Yesterday's recommendations: (1) 320x568 gap → **carrying today → P3** (this packet);
  (2) `W-002` on 2026-09-27 → **carrying → tomorrow**, not due today; (3) nothing blocked
  on David → no action; (4) `AGENTS.md` rewrite → **left for David**, still uncommitted,
  and never staged.
- Prior retro finding that bears on the choice: "The P4 small-phone fit … all ran in the
  main context, about 25 tool calls" (still on discipline). Today's measure-and-edit loop
  goes to one sub-agent.
