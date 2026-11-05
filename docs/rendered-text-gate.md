<!-- Moved whole from AGENTS.md on 2026-11-04 (MT, housekeeping night, docs/housekeeping/2026-11-04-inventory.md). AGENTS.md keeps a one-line pointer here. Read this before a refactor or a dependency bump. -->

# Prove the words did not move: the rendered-text gate

Before a refactor or a dependency bump, snapshot what a reader sees; after it, diff:

```bash
node scripts/check-rendered-text.mjs snap .next/server/app before.txt   # or a URL
node scripts/check-rendered-text.mjs diff before.txt .next/server/app   # exit 0 same, 3 changed
```

A source is a URL, an `.html` file, a directory of them (`.next/server/app` after a build), or a
saved snapshot. It compares VISIBLE text only: whitespace runs collapse, as HTML's do, so a
one-space change is invisible — and CSS is not compared at all, because a framework bump rewrites
the emitted CSS bytes without changing a style (per-build `@font-face` `url()` tokens, KP-004).
Layout belongs to frames, not to this. `--selftest` carries the red arms and CI runs it through
`src/lib/check-rendered-text.test.ts`.

**It is BLIND to anything the browser renders, and on the home page that is the whole
chart** (measured 2026-09-21). The snapshot reads server-rendered HTML; `Viz` and
everything under it — the ten facets, the editor's note, the brush, the verdict
panel ("State of the cycles" until I-061) — arrive client-side, so `/` snaps to 25 lines and a re-order of those
blocks reads GREEN with nothing compared. The positive control that proves it: a word
changed inside `ConvergenceNote`, and later reverted, did not register either. **For a
change inside `Viz`, the proof is the rendered `main` innerText line multiset** — load
both sides in Playwright, split `innerText`, sort, compare (123 lines, 82 distinct on
2026-09-21, identical against production). Use this gate for server-rendered prose,
where it is still the right instrument.

**`diff` is an ORDER gate, and on a re-ordering it goes RED and is RIGHT to** (learned the slow way
2026-09-20, on the `/cycles` re-order). It compares visible text line-index by line-index, so moving
a paragraph reports RED at the first moved line even though not one word changed. Two failure modes
follow, and the second is the dangerous one: reading that RED as "the page broke", or learning to
wave it through — after which a genuine prose deletion inside a future re-order rides out on the
habit. **What proves a re-order safe is the line MULTISET**: `snap` both sides, sort, compare. On
09-20 that was 216 lines and 166 distinct on both sides, identical, and the adversarial review
reproduced it independently. Note the same command run BUILT-vs-PRODUCTION after a deploy asks a
different question — "does production serve what I built" — and there GREEN is the expected answer.
