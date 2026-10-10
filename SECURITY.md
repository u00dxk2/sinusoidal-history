# Security policy: Sinusoidal History

This repository is public. It is the source of https://sinusoidalhistory.com.

## Reporting a vulnerability

Email **hello@skylarkcreations.com**. Include the affected URL or file, what you did, and
what you saw. Please report privately first rather than opening a public issue with the
details.

This is a one-developer project, so there is no bounty program and no response-time
promise. Expect an acknowledgement within a few days.

Scope: this repository and `sinusoidalhistory.com`. Out of scope: the hosting provider
(Render) and GitHub themselves; report issues in their platforms to them.

## What the site is, in security terms

- A static reference site. No accounts, no sessions, no cookies, no user data.
- Three read-only JSON endpoints under `/api/v1/`, derived from data files committed here.
- No runtime secrets: nothing under `src/` reads `process.env`, and the site needs no
  credential to build or serve.

## Controls in place

- **CI on every push and pull request to `main`** (`.github/workflows/ci.yml`): a
  dependency audit of runtime packages at critical severity, a frozen `npm ci` install,
  lint, typecheck, unit tests and a production build. Actions are pinned to commit SHAs.
- **Deploys wait for CI.** The hosting service deploys a push only after its CI run is
  green.
- **Secret scanning.** GitHub secret scanning and push protection are enabled. A
  pre-commit hook (`scripts/check-staged-secrets.mjs`) refuses a commit whose staged lines
  carry secret-shaped content; it is installed by `npm install`, so a clone that never
  ran it has no hook.
- **Dependabot alerts** are enabled.
- **Inline JSON-LD is escaped** through one helper (`src/lib/jsonLdHtml.ts`), used by all
  three pages that emit it. The helper is unit-tested; no automated check yet stops a new
  page from bypassing it.

## Known gaps, stated plainly

- No branch protection on `main`: a single contributor pushes directly.
- Dependabot security updates (automatic fix pull requests) are off; alerts are handled
  by hand.
- No scheduled scan of the full git history for secrets has been run.
- GitHub private vulnerability reporting is not enabled; use the email above.
