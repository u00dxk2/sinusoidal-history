# docs/ index

One line for every top-level file and folder in `docs/`. Dated files are records: leave them as they were written. The substrate reads `daily-config.md`, `key-user-flows.md`, `housekeeping-ledger.md`, `daily/` and `cold-starts/` by path, so those stay where they are.

## Folders

- `answers/`: David's rulings, verbatim and dated (2026-10-03; 2026-10-21, the one-wave ruling for I-061).
- `archive/`: retired history docs with no live reader (a superseded fact-check prompt, the blocked round-3 note, the 2026-09-26 journey walk).
- `cold-starts/`: one primer per MT date. The newest is the cold-start entry point; `archive/` inside it holds primers from 08-14 to 10-27, listed in its `INDEX.md`.
- `daily/`: the daily report of record, `<MT-date>-prelaunch.md`. The Command Center fetches these by date, so none is moved.
- `evidence/`: before/after captures backing one item (`2026-10-11-i031`).
- `frames/`: dated viewport screenshots from ship verification. Frames from 09-17 to 09-25 are in `frames/archive/2026-09/` with an `INDEX.md`.
- `housekeeping/`: housekeeping-night records (`2026-11-04-inventory.md`, `2026-11-04-claims-pass.md`).
- `specs/`: pre-registered build specs. `spectral-verdict-build-spec.md` is the frozen spectral pre-registration.
- `walks/`: cold-reader walk reports per item (W-00x, I-0xx), with captures in `walks/frames/`.

## Files

- `daily-config.md`: lane config, covering report and primer paths, the CI and deploy reads, the Search Console and crawl instruments, and the leading numbers.
- `key-user-flows.md`: the reader flows that `/journey-walk` walks.
- `evangelism-bar.md`: the would-tell-a-friend bar and its proving metric (all hypothesis; refresh due 2027-01-08).
- `housekeeping-ledger.md`: small itches noticed but not yet done.
- `how-this-was-made.md`: the build journal, linked from `/colophon`.
- `rendered-text-gate.md`: `scripts/check-rendered-text.mjs`, what it can and cannot see. Read before a refactor or a dependency bump.
- `data-pipeline.md`: the build-script rule and the spectral-verdict manifest sequence. Read before changing a CSV, a cycle, a pairing or a period.
- `crawl-reads.jsonl`: series snapshotted by `scripts/crawl-read.mjs --snapshot`.
- `design-canon-review-2026-08-14.md`: the design and usability canon review.
- `journey-walk-2026-08-24.md`, `journey-walk-2026-10-14.md`: whole-flow journey walks. The 10-14 walk is evidence for open row I-049.
- `fact-check-prompt*.md`, `fact-check-2026-*.md`: external fact-check prompts and reports, rounds 1 to 5. Round 4 is the Phase 11 reference state, and `public/llms.txt` links rounds 1 to 3 by URL.
