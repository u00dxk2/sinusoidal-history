# Blind pick — sinusoidal-cycles, design pass 2026-11-17

Judge: Codex (`codex exec --sandbox read-only`, model gpt-6.2-sol per each run's banner), six runs, one after another. Each run's working folder held only two files, `left.png` and `right.png`, copies of two variants' 1440x900 first-screen frames (`variants/a-1440.png`, `b-1440.png`, `c-1440.png`). The judge was not told which is new, who made them, or that a third exists. Each banner's `workdir` matched its own run folder. Runner: `tmp/dp-blind/run-blind.ps1` (not committed; the loop is: copy the pair, pipe the prompt below on stdin, attach the two images with `--image`).

The 390 frames were not judged: on a phone the three variants are the same screen (the sheet is hidden below the `sm` breakpoint, where the existing glance figure is the ten-row strip), so there is nothing to pick between.

## The prompt, verbatim

```
You are judging two screenshots of a web page's first screen. They are attached as two images: the FIRST attached image is "LEFT" and the SECOND is "RIGHT". Both are the same size and show the same product.

Do not run any command and do not read any file. Judge only what is in the two images.

Answer three questions, then give one verdict.

1. Which of the two looks more like it was made by a professional design team: LEFT or RIGHT? Consider hierarchy, typography, spacing, alignment, and whether the screen has one clear focal point.
2. After five seconds on each, which one makes it clearer what this product is and why someone would use it: LEFT or RIGHT?
3. Name one specific visual detail you would remember from each.

Then end with exactly one line in this form, and nothing after it:

VERDICT: LEFT
or
VERDICT: RIGHT
or
VERDICT: TIE

Keep the whole answer under 200 words.
```

## Results

| Run | Left | Right | Verdict line | Winner |
|---|---|---|---|---|
| 1 | a | b | VERDICT: LEFT | a |
| 2 | b | a | VERDICT: RIGHT | a |
| 3 | a | c | VERDICT: LEFT | a |
| 4 | c | a | VERDICT: RIGHT | a |
| 5 | b | c | VERDICT: RIGHT | c |
| 6 | c | b | VERDICT: RIGHT | b |

- a over b: survives the swap.
- a over c: survives the swap.
- b against c: RIGHT both times, so it follows the side, not the variant. Discarded.

**Selected: variant a** (the ten-channel recorder sheet).

Run 1's answer, in full, as the judge wrote it:

> 1. **LEFT** looks more professionally designed. The headline and actions lead into one dominant chart, and the aligned rows make ten theories easy to scan. RIGHT divides attention among the featured card, the cycle links, and the range controls.
> 2. **LEFT** is clearer after five seconds. You can see all ten theories on a shared timeline and immediately understand that the site lets you compare them and check them against the historical record.
> 3. **LEFT** has the lone red Ibn Khaldun curve centuries before the others. **RIGHT** has the diagonal hatching beneath the gold Dalio curve, marking years missing from the record.
>
> VERDICT: LEFT

Limits: one judge model, one size, frames taken before two later changes (the sheet's verdict sentence was held to a reading measure; variant c's known small row labels were left as they were in the judged frame). The other five answers were read for their verdict line only.
