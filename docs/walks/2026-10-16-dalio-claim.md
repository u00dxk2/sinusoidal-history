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
