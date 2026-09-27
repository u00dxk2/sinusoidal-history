# sinusoidal-cycles — 2026-09-27 (three-stage day)

## Selection packet (P1 — evidence and choice)

[P1 — Evidence and choice]

**Outcome:** a phone reader who meets the tag NARRATIVE on `/cycles` can tap it and land
on its definition. Row `W-002`, fix branch (b) of its closeWhen.

**The user's problem, in their words:** "It says NARRATIVE, and right under that it says
'Paired data'. So is this one backed by data or not? And where does it say what NARRATIVE
means?"

### Section 0

- Primer `docs/cold-starts/2026-09-27.md`: read. Its first action (W-002 frame) was run
  first; see Evidence.
- Listener: 🟢. The SSE listener has been alive since 15:18:47Z (hello received, 0
  replayed). The waker ladder (ranks 1–3) is armed, and `/loop-tick` is armed by tool call.
- Codex: GREEN per the `[codex-probe: …]` line on the kickoff (15:23Z). Nothing is planned
  for Codex: the P3 change is under 60 LOC, involves a taste call, and the context is warm.
- CI: `check-ci-status --workflow ci.yml` on HEAD `1a4239c` → **GREEN** (exit 0).
- Deploy drift: `check-deployed-sha-drift --service sinusoidal-history` →
  `NOT-APPLICABLE-BY-REGISTRY` (commit-trigger service). That is a decline, not a pass.
  Liveness was read directly from the Render deploy rows instead: **`1a4239c` is `live`**
  (finished 2026-09-26 22:21 UTC). The live sha equals HEAD.
- Harness: running 2.1.283 · fleet UNIFORM (27 of 27) · installed 2.1.283 (SAME).
- Recommendations from yesterday: the primer's first action (W-002) was **executed** today
  (frame below). I-006 is **carrying → the hygiene helper at P3** (list (a)). I-007 is
  due 10/03 and not owed today.

### Evidence

- OBSERVED — the W-002 read, which is this row's own readCommand run through the gate
  (`check-due-gates-dispositioned --run W-002`, exit 0, stamped). The frame is
  `docs/frames/2026-09-27-cycles-390.png`: production `/cycles` at 390x664, clipped to the
  viewport. Population: one frame, the first screen only. Limits: this is one agent's cold
  read. **It is not a real-user encounter.**
  **Verdict: (b), the tag reads as unexplained.** Here is what the reader sees on the
  first screen:
  1. The line `30Y · PEAK 1970 · NARRATIVE` is set in one register. NARRATIVE reads as a
     third fact *about the cycle*, like its period and its peak year. Nothing marks it as
     *the site's grade of the evidence*.
  2. The next line under the description says `Paired data - US Policy Mood (Stimson)`.
     The gloss for NARRATIVE is "no statistical fitting behind the period". A cold reader
     has no way to reconcile "narrative" with "paired data", so the two lines look like
     they contradict each other.
  3. The second entry, which starts at the bottom of the frame, carries QUANTITATIVE. The
     contrast suggests "some kind of evidence type". That is only a guess, and nothing on
     the screen confirms it or says where to confirm it.
  4. The definition exists (`#confidence-tags`, below ten entries and the verdict table,
     and on every per-cycle page). Nothing on the index points at it, and nothing
     responds to a touch on the tag.
- OBSERVED: the tag has no affordance on any input. `src/app/(app)/cycles/page.tsx:244-259`
  renders it as a bare `<span>` inside the entry's block `<Link>`. The tooltip was tried
  and reverted on 2026-09-20; the revert is recorded in a comment at `:246-257`.
- MISSING: any real-user read. The site has no analytics and no reader has written in, and
  `docs/evangelism-bar.md` / `docs/evangelism-evidence.md` do not exist in this repo.
  Search Console clicks: 0, last read 2026-09-16.
- Cycle rotation: `check-cycle-rotation --lane sinusoidal-cycles` exit 0. No product-love
  pass is due today.
- Changed decisions: `answered-cards --project sinusoidal-cycles` shows no unread David
  cards. `git pull` brought in `1a4239c` (the 09-26 walk fix), which is done; nothing
  instructed yesterday is missing from the tree.

### Permission

- The change is layout and markup on `/cycles` only. Titles, meta, H1 text and URLs do not
  change, so it is outside the `W-001` freeze (to 2026-10-07). The lane's own presentation
  code; no card is open and no row is parked. The fix is the one W-002's own closeWhen
  names. No David decision is needed.

### Next action — improve

Kind: improve. The fix is to make the tag a real anchor to `#confidence-tags` without nesting
an `<a>` inside the entry's `<Link>`. The plan is the stretched-link pattern: the entry
`<Link>` keeps the whole block clickable through a positioned `::after` overlay. The tag
becomes a sibling `<a href="#confidence-tags">` above that overlay (`relative z-10`). The
J11 whole-block click target survives, and the HTML stays valid. Styling stays the same, so
the line's height does not move. The tag also gets a visible hint that it is tappable,
such as a dotted underline. The row also gets a `scroll-mt` so the jump lands readable.

First command (the red arm: prove that no anchor exists today):

```
node C:/dev/skylark/sinusoidal-cycles/scripts/check-rendered-text.mjs snap https://sinusoidalhistory.com/cycles C:/Users/david/AppData/Local/Temp/claude/C--dev-skylark-sinusoidal-cycles/e232c7b4-0f8e-448f-bc29-cec86ea6804a/scratchpad/cycles-before.txt
```

Then a test that asserts every index entry's tag is an `<a href="#confidence-tags">`, that
no `<a>` is nested inside another, and that `#confidence-tags` exists. It must fail on
today's tree.

### Acceptance condition

- On production at 390x664, tapping NARRATIVE on the first entry scrolls to the
  confidence-tag definitions. Tapping anywhere else on the entry still opens
  `/cycles/schlesinger`.
- No `<a>` inside `<a>` in the built `/cycles` HTML.
- `check-entry-folds.mjs` still reads 13 of 13 at 320x568, 360x560 and 390x664.
- The rendered-text *multiset* on `/cycles` is unchanged. A split of the metadata line is
  an expected ORDER difference (the 09-20 revert note) and is written down, not waved
  through.
- W-002's notes carry today's dated verdict, and the row closes on the ship.

### Delivery and encounter checks

- Delivery: the Render deploy row for the ship's sha reads `live`, and a production frame
  at 390x664 shows the tag styled as tappable.
- Encounter: none is readable. The site has no analytics, so a tap on the tag leaves no
  trace. The first readable encounter would be a reader writing in, or the next cold
  journey-walk on `/cycles` reporting the tag as understood. N = 1 walk.

### USER-FACING: yes

Paths: `src/app/(app)/cycles/page.tsx`, plus a new test under `src/lib/` or beside the page,
and `continuity/items.json` (W-002 verdict and close). `public/*.md` mirrors are not
touched: `/cycles` has no mirror.

### HYGIENE INPUTS (P1)

- (a) Due rows that do not bear on the choice: **1**. `I-006` (cycle counts written as
  literals; due 2026-09-27, readCommand never run; `[READ-PATH]` warns about a relative
  `og/route.tsx` in onTrigger).
- (b) Owed child rows (skylark-site's ledger): **0**. `none — read rows owed to you
  (0 of 724)`.
- (c) State reads marked CROSSED: **2 of 2 due rows never-run** at kickoff (the
  dated-gates read; W-002 has since been run and stamped, so 1 of 2 remains, I-006). HEAD
  CI read UNKNOWN at compose (a gh timeout) and was re-read GREEN live. Nothing else was
  crossed.

## P3 — product-work loop

**Outcome: done.** A phone reader who meets NARRATIVE (or QUANTITATIVE, or EMPIRICAL ·
CONTESTED) on `/cycles` can tap it and land on its definition. That definition now says the
tag grades the theorist's evidence and the paired series is this site's own comparison.
Commit `8e144cb`. `W-002` is closed.

The manager review (bus `84c92a14`) redirected the plan and added the glossary sentence.
It also raised a hypothesis: the stretched-link overlay might swallow taps on "The longer
story". **I measured it, and it does not.** The toggle sits outside the positioned block,
and the production tap test opens it.

**Sibling sweep.** Pattern `confidenceLabel(` across `src/**/*.tsx`: 5 render sites.
- `/cycles`: fixed.
- `/cycles/<slug>` masthead: the same defect, fixed the same way (`#confidence`, same clause).
- Poster and OG card: both are images, where a link cannot exist, so they are exempt.

**Instrument fix, same commit.** `check-entry-folds.mjs`'s `/cycles` selector (`li:first-child
a > p`) could not find the answer in the new markup. The new selector (`li:first-child p`)
matches both markups, and production read the same under it before and after the deploy.

### The four states

1. **Implementation — DONE.** `8e144cb` on `main`, CI `ci.yml` GREEN.
   - `src/lib/cyclesIndexTag.test.ts`: 16 tests. Red arm: 3 of 6 index legs failed on the
     old tree, and 10 of 10 sibling legs failed with the fix stashed.
   - Build, eslint and typecheck: clean.
   - Codex adversarial review ×2 on the working tree (the second after the sibling was
     added): approve, no material findings.
2. **Delivery — DONE.** Render deploy row: `8e144cb` `live`, finished 16:41:45 UTC per
   Render (UTC is my inference). `check-deployed-sha-drift` declines this commit-trigger
   service (`NOT-APPLICABLE-BY-REGISTRY`), so the deploy row is the read.
   - Production tap test at 390x664 (`tmp/tap-test-w002.mjs`): **7 of 7.** The tag lands on
     `#confidence-tags` in view; the description and the metadata line open
     `/cycles/schlesinger-jr`; "The longer story" toggles; there are no nested anchors; the
     masthead tag lands on `#confidence`.
   - Entry folds: **13 of 13** at 320x568, 360x560 and 390x664. The thinnest margins are
     unchanged (`/` 4px at 360x560; `/` and `/cycles/turchin` 12px at 320x568).
   - `check-rendered-text diff`, production against build: GREEN, 226 lines.
   - Frames: `docs/frames/2026-09-27-cycles-390-after.png` (the tag) and
     `docs/frames/2026-09-27-cycles-390-landed.png` (after the tap).
3. **Encounter — unknown.** The site has no analytics, so a tap leaves no trace. The next
   read is the next cold journey-walk on `/cycles` (N = 1).
4. **Outcome — unknown.** Whether readers now understand the tag needs that walk, or a
   reader writing in.

Rendered-text multiset, production before against the build: the only differences are the
ten metadata-line splits (tag ↔ `Ny · peak YYYY ·`), the masthead split on each cycle page,
and the two new sentences.

<!-- findings:begin -->
- The fold check's `/cycles` selector depended on the entry being a single `<a>`. An
  instrument that names markup structure breaks silently, as MISSING rather than as a fold
  RED, when the page is restructured. It is fixed here, and the MISSING verdict is what
  surfaced it.
<!-- findings:end -->