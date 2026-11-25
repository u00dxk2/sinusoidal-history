# Codex claims pass — I-089, the Turchin database date (2026-11-25)

Run: foreground `codex exec -C C:\dev\skylark\sinusoidal-cycles --sandbox read-only -c model_reasoning_effort=high -`, prompt `tmp/codex-claims-b9ccb23.md` (lane-local; it quotes I-089's closeWhen verbatim). Banner checked before reading: `workdir: C:\dev\skylark\sinusoidal-cycles`, `model: gpt-6.2-sol`, `sandbox: read-only`, `reasoning effort: high`. Head reviewed: `b9ccb23a595b73049c9e65cbce257ff10055e501` (parent and merge-base `501f501`). Tokens used: 49,847.

## The source (round 0)

The Wayback capture `http://web.archive.org/web/20260626094344/http://peterturchin.com/age-of-discord/united-states-political-violence-database/`, re-fetched by the lead 2026-11-25 (`curl -sL`, HTTP 200). Page title "The United States Political Violence Database – Peter Turchin". Text "Data for download: USPVD2010.xlsx" (2 matches for the file name), "between 1780 and 2010", and 0 case-insensitive matches for `licen`. Codex reproduced these from the saved HTML. Its own fresh Wayback requests failed, so the HTTP 200 is SUPPLIED by the lead. Codex also noted the page footer reads "All rights reserved." That fits the sentence: the page grants no license.

## Findings, as Codex reported them

1. cycles.json caveat + about.md: **HOLDS · REPRODUCED**.
2. /cycles fathers-and-sons text: **HOLDS · REPRODUCED**.
3. /methods + methods.md, linked to capture 20260626094344: **HOLDS · REPRODUCED**.
4. `DP_NO_SERIES_REASON` and its test pin: **HOLDS · REPRODUCED**.
5. Mirror parity, /methods vs methods.md: **HOLDS · REPRODUCED**.
6. JSX spacing around the link (in-memory render, Next 16.4.5): **HOLDS · REPRODUCED**.
7. No other src/ or public/ surface dates the discovery to August; /api/v1/cycles inherits the caveat: **HOLDS · REPRODUCED**.
8. "is offered for download" is scoped by "on a June 2026 archived copy": **HOLDS · STATIC**. Whether the file downloads today: UNVERIFIABLE-HERE (the sentence does not claim it).

Verdict, verbatim: "**Verdict:** `b9ccb23` passes the claims review and may proceed through the release gates. I-089 closure still requires confirmation of round 0, green CI, a live deploy, and a signed-out GET."

No finding needed a disposition.
