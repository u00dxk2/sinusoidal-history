# Cold walk, pre-registered: the Dalio claim page (2026-10-16)

Written 2026-10-15 night round (MT), BEFORE the change is live. Synthetic walker, N=1; not a real user.

## Setup
- Viewport 390x664 (a phone's visible area), production, after `check-deployed-sha-drift --service sinusoidal-history` reads the change in sync.
- The walker first sees a search-result shape: the page's `<title>` and meta description exactly as served, nothing else. Then it opens https://sinusoidalhistory.com/cycles/dalio.

## Prompt (verbatim)
> A friend just told you Ray Dalio's Big Cycle is peaking right now. You searched "ray dalio big cycle theory" and got this result: [title] — [description]. Would you tap it? Then open the page. Using only the first screen, before scrolling: is Ray Dalio's Big Cycle peaking? What can this page say, and what can it not? Then say anything on that first screen you read as agreeing with your friend.

## Pass bar (HELD if all three)
1. From the first screen alone, the walker says the record cannot test the cycle (not testable), not that it is confirmed.
2. It says where the drawn curve puts 2026 AND that this is the page's drawing, not Dalio's forecast.
3. Nothing on the first screen is reported as confirmation before the verdict.

## Recorded, not scored
Whether it would tap the result, and why; any word it does not understand.

## RED arm
Production before the change (97aa59b5): the title, H1 and description do not state the question, and the curve's 2026 position sits 1.5 to 2.2 screens down (`check-holds-up-line` claim legs FAIL, 40/42).

## Result (walked 2026-10-16 ~00:58 MT, production d1fa17f, synthetic N=1)

Instrument: one fresh sub-agent, headless Chromium via Playwright, 390x664, isMobile + hasTouch, DSF 2, against production after `check-deployed-sha-drift` read in-sync (live d1fa17fd = head) and `check-holds-up-line` read 42/42. It read only rendered pages, wrote its tap answer before its first-screen screenshot, and did not scroll.

**HELD as written, with a residual the bar did not price.**
1. Verdict: HELD. "there isn't enough data to say whether the theory is real"; "Not testable on the record that exists".
2. Position, and that it is the drawing: HELD. "the drawn curve is at its peak"; "Its own words call that 'a position of this construction, not the theorist's forecast.'"
3. Nothing read as confirmation BEFORE the verdict: HELD. The verdict line came first, in bold.
- Tap (recorded): "Yes. The title asks my friend's exact question, and 'Not testable on the record that exists' is an honest, unusual answer that makes me want to know why."
- **Residual (recorded, the next lever):** under "anything on that first screen you read as agreeing with your friend", the walker said: "'2026 sits at a peak', 'the curve tops out in 2025' and 'curve height +1.00' all read as 'yes, it's peaking right now.' The disclaimer comes after, in smaller and more abstract words." The position sentence leads with the peak and the clause that says it is the drawing comes last.
- Words not understood (recorded, to I-043's vocabulary step): "NARRATIVE", "this construction", "paired record", "the floor".

Scripts and the first-screen screenshot are session scratch (`walk-dalio/`), not committed.
