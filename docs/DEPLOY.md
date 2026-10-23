# Deployment, migration checklist and rollback

The site is the BIV Reports codebase with Reserve Fund Plans content: a Next.js 16 app with one server route (`/api/quote/`), so it needs a Node host (Vercel, as for BIV, is the simplest). Nothing here has been deployed yet.

## 1. Environment variables (server)

| Name | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | `https://www.reservefundplans.com.au` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | yes | The mailbox that sends enquiries (e.g. a `website@` mailbox). Port 465 = SSL, 587 = STARTTLS |
| `QUOTE_TO_EMAIL` | yes | Comma-separated recipients. Empty = SMTP_USER's inbox |
| `QUOTE_FROM_EMAIL` | no | Defaults to `Reserve Fund Plans website <SMTP_USER>` |
| `NEXT_PUBLIC_RECAPTCHA_CHECKBOX_SITE_KEY` / `RECAPTCHA_CHECKBOX_SECRET_KEY` | recommended | reCAPTCHA v2 checkbox keys, as on BIV; add both domains + preview domain |
| `RESEND_API_KEY` / `QUOTE_WEBHOOK_URL` | no | Alternatives to SMTP, inherited from BIV |
| `NEXT_PUBLIC_GA_ID` | no | Google Analytics 4; nothing loads while empty |

Without SMTP settings the form answers 503 and tells visitors to phone, so enquiries are never silently lost. Check `/api/quote/` (GET) after deploying: it shows `"emailDelivery": "smtp"` when configured.

## 2. Staging (Vercel)

1. Create a new Vercel project from this repository (do not reuse `biv-reports`). Framework: Next.js, build `npm run build`, Node 22.
2. Add the variables above to Production and Preview.
3. Deploy. Preview URLs get `X-Robots-Tag: noindex` automatically.
4. Run `BASE=https://<preview-url> node scripts/verify-site.mjs --remote` (URL, redirect, 410, canonical and header checks).
5. Send a real quote request on the preview and confirm it arrives at every `QUOTE_TO_EMAIL` address (check spam folders).

## 3. Migration checklist (before DNS changes)

- [ ] Back up the WordPress site (files + database) and export the AIOSEO redirects, if any.
- [ ] Fetch the old `/sitemap.xml` and `/robots.txt`; add any URL missing from `docs/url-migration-map.csv`.
- [ ] Review Search Console (Pages + Links reports) for URLs with impressions or backlinks not in the map.
- [ ] Confirm the items in `docs/CLAIMS-TO-CONFIRM.md`.
- [ ] Real end-to-end email test from staging; SPF/DKIM/DMARC for the sending domain (send through the domain's own mail server, as BIV does).
- [ ] Lower the DNS TTL for `www` and the apex to 300s a day ahead.
- [ ] Note the current DNS records (A/CNAME for `@` and `www`). **Do not touch MX, SPF, DKIM or other mail records.**

## 4. Go-live (needs your approval)

1. In Vercel → Domains, add `www.reservefundplans.com.au` (primary) and `reservefundplans.com.au` (redirect to www).
2. Change only the `www` CNAME and apex A record as Vercel instructs. HTTPS is issued automatically.
3. Smoke test: `node scripts/verify-site.mjs --remote` with `BASE=https://www.reservefundplans.com.au`; one real quote request; `curl -I` the old URLs, e.g. `/services/sfp/` (200) and `/blog/` (410).
4. Search Console: submit `/sitemap.xml`; use URL Inspection on the homepage and `/services/sfp/`.
5. Monitor for two weeks: Search Console coverage/404s, Vercel function logs for `[quote]` lines, enquiry volume.

## 5. Rollback

The WordPress site is untouched until DNS changes. To roll back, restore the previous `www`/apex DNS records noted in step 3 (with the short TTL this takes minutes). Leave the Vercel project in place to fix and retry. No database or mail changes are involved, so rollback has no data impact.

## Ongoing

- `npm test` (unit), `npm run build && npm run test:site` (end-to-end with a local mail server) before each release.
- `npm audit` monthly. Bump `LASTMOD` in `app/sitemap.ts` when content changes.
- Business facts live in `lib/site.ts`; service and FAQ copy in `lib/services.ts`; testimonials in `lib/testimonials.ts`.
