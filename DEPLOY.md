# Deployment — Render + Squarespace DNS

The production target is **`sinusoidal-history.skylarkcreations.com`**, served by a new Render Web Service. The parent domain `skylarkcreations.com` is already on Render with DNS at Squarespace, so this is a "new subdomain on an existing setup" not a new domain registration.

This doc walks the full path: push the repo, create the Render service, point Squarespace DNS at it, verify.

---

## 1. GitHub repo

Repo lives at **https://github.com/u00dxk2/sinusoidal-history** (Dave's
personal account). The initial Phase 4 push is already in `main`. Future
work: just `git push` from this directory.

## 2. Render Web Service

The service is created inside its own Render project ("Sinusoidal History")
and lives at **https://sinusoidal-history.onrender.com** while the custom
domain is wired.

If recreating from scratch, the dashboard configuration:

- **Name:** `sinusoidal-history`
- **Region:** same as `skylark-site`
- **Branch:** `main`
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Plan:** Starter ($7/mo). Free tier sleeps after 15 min and breaks
  social-card scrapers like Bluesky/Twitter, so don't.
- **Environment Variable:** `NODE_VERSION = 22`
- **Auto-Deploy:** on
- **Health Check Path:** `/`

`render.yaml` records the same config — Render will detect it but the
dashboard settings take precedence.

## 3. Add the custom domain in Render

Once the service is live at the auto-generated `*.onrender.com` URL:

1. Render dashboard → the service → **Settings** → **Custom Domains** → **Add Custom Domain**.
2. Enter `sinusoidal-history.skylarkcreations.com`.
3. Render gives you a target hostname to CNAME to. It will look like:
   ```
   sinusoidal-history.onrender.com
   ```
   (or a longer hash-prefixed variant — copy whatever Render shows). **Keep this tab open** while doing step 4.
4. Render also provisions a Let's Encrypt cert automatically once DNS resolves; nothing to configure on that side.

## 4. Add the DNS record at Squarespace

Squarespace manages DNS for `skylarkcreations.com`.

1. Squarespace dashboard → the `skylarkcreations.com` site → **Settings** → **Domains** → **DNS Settings** (sometimes called **Advanced Settings**).
2. Add a new record:
   - **Type:** `CNAME`
   - **Host:** `sinusoidal-history`  (Squarespace prepends the domain automatically — do not type the full FQDN)
   - **Data / Value:** the Render hostname from step 3 (e.g. `sinusoidal-history.onrender.com`)
   - **TTL:** default (3600s is fine)
3. Save.

Propagation is usually under 5 minutes for Squarespace. Verify with:

```bash
dig sinusoidal-history.skylarkcreations.com CNAME +short
# or, on Windows PowerShell:
Resolve-DnsName sinusoidal-history.skylarkcreations.com -Type CNAME
```

You should see the Render hostname returned.

## 5. Wait for cert + verify

- Back in Render, refresh the Custom Domains tab. The status will go: `Verifying` → `Issuing certificate` → `Active`. Usually 2–10 minutes.
- Once **Active**, hit `https://sinusoidal-history.skylarkcreations.com/` in a browser. You should see the overlay.

## 6. Verify embed + OG card

Still on the production URL:

```bash
# Embed CSP must be present:
curl -I https://sinusoidal-history.skylarkcreations.com/embed | grep -i content-security
# Expected: Content-Security-Policy: frame-ancestors *

# Embed must NOT have the SAMEORIGIN restriction:
curl -I https://sinusoidal-history.skylarkcreations.com/embed | grep -i x-frame-options
# Expected: empty value or absent

# OG card must return an image:
curl -sI https://sinusoidal-history.skylarkcreations.com/og | grep -E "Content-Type|Cache-Control"
# Expected: image/png, public, max-age=3600
```

Then validate the OG card by sharing the production URL into Bluesky's [card debugger](https://bsky.app/profile/cardyb.bsky.app) and the [Twitter card validator](https://cards-dev.twitter.com/validator). Confirm the preview renders the "State of the cycles · {month}" headline and the seven phase bars.

## 7. Smoke checklist (production)

- [ ] `https://sinusoidal-history.skylarkcreations.com/` 200, renders Facets default
- [ ] `/about`, `/methods`, `/poster`, `/embed`, `/embed/docs` all 200
- [ ] `/data/dw_nominate.csv` 200 (raw CSV served from `public/`)
- [ ] `/data/dw_nominate.source.md` 200 (provenance file)
- [ ] `/og` returns a 1200×630 PNG
- [ ] `/sitemap.xml` and `/robots.txt` resolve
- [ ] OG card renders correctly when pasted into Bluesky and Twitter
- [ ] Mobile inspection at 375px shows compact layout, no horizontal scroll

## Rollback

Render keeps the last successful deploy. If a push breaks production:
- Render dashboard → service → **Manual Deploy** → pick a prior commit.

For local testing of the production build before pushing:
```bash
npm run build
npm start
# visits http://localhost:3000
```
