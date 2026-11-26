# Codex review — I-087 home chart faces (2026-11-26)

Two rounds, both `codex exec --sandbox read-only`, model gpt-6.2-sol, reasoning effort high. The banner `workdir` read `C:\dev\skylark\sinusoidal-cycles` on both. Both rounds are STATIC; the measurements are in `docs/design-pass-2026-11-17/run-home-chart.mjs` (batch run 2026-11-26, compares before→after and before→off both PASS).

## Round 1 — head d76467ef, base 026fbc1d

| # | Finding | Sev | Tag | Disposition |
|---|---|---|---|---|
| 1 | NowSummaryPanel's per-row verdict (inside the row's button) inherits the display face at 600 | MEDIUM | STATIC | CONFIRMED, fixed in 882b935 (`[data-panel-verdict]` takes the text face, 400) |
| 2 | The Plex latin subsets lack U+2190/U+2192, so `← drag to zoom →` and `Details →` fall back to a system face | LOW | STATIC | CONFIRMED, predates this change: the cycle pages (flag on since 2026-11-18) carry the same arrows in the same faces. Not changed today; carried |
| 3 | Runner: a missing or moved-down budget line passed | MEDIUM | STATIC | CONFIRMED, fixed in 882b935 |
| 4 | Runner: flag state taken from the CLI; a flag-off build could change styles and pass | MEDIUM | STATIC | CONFIRMED, fixed in 882b935 (served `data-design-variant`, wrapper asserted, flag-off faces compared element by element) |
| 5 | Runner: a deleted space between inline nodes passed the per-node multiset | LOW | STATIC | CONFIRMED, fixed in 882b935 (whole textContent compared) |
| 6 | Runner: the digit leg only printed widths | LOW | STATIC | CONFIRMED, fixed in 882b935 and 8d7c3c7 (equal widths asserted on a visible tick). Codex also checked statically that the display subset has equal default advances for all ten digits |

## Round 2 — head 8d7c3c72, base 026fbc1d (round 1's findings out of scope)

| # | Finding | Sev | Tag | Disposition |
|---|---|---|---|---|
| 1 | The overview caption "Site's peaks · no cycle confirmed" is set in the display face at 600 | MEDIUM | STATIC | DELIBERATE. The figcaption is the figure's label (the plate header in DESIGN.md's recorder-strip world), and the display face has one weight. Before, it was 11px all-caps Geist Mono with 0.18em tracking, which is not a quieter setting. Its words are unchanged and fit their 33-character budget on one line at 320 |
| 2 | `--batch`: an interrupt during the base build could skip the `finally` restore | MEDIUM | STATIC | CONFIRMED, fixed in the round-2 commit (SIGINT/SIGTERM handlers restore from HEAD; the restore's exit is printed). A failed restore was already caught: the files read dirty against HEAD and the batch stopped with exit 1 |
| 3 | "nothing drawn after 2026" inherits the display face from the range readout | LOW | STATIC | DELIBERATE. It is the readout's own label, set in mono in the same span before |
| 4 | Runner: flag-off compare does not see colour | LOW | STATIC | CONFIRMED as a coverage limit. Second round to find runner coverage gaps, so the runner now claims less: its header names what it does not see |
| 5 | Runner: does not see styles outside the chart root | LOW | STATIC | CONFIRMED as a coverage limit, named in the header, same reason |
