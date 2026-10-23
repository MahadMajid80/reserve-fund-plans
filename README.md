# Reserve Fund Plans website

The Next.js site for [reservefundplans.com.au](https://www.reservefundplans.com.au): 10-year reserve fund plans, building insurance valuations, WHS and asbestos reports for WA strata schemes. It replaces the WordPress site and keeps every existing page URL.

Built to the same technical standard as the BIV Reports site (Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, nodemailer), with its own brand, layouts and components. It has no runtime dependency on BIV.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in SMTP and (optionally) reCAPTCHA values
npm run dev                  # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run build` | Production build, then `scripts/check-indexing.mjs` (fails if production could be noindexed) |
| `npm start` | Serve the production build |
| `npm test` | Unit tests (validation, security helpers, email escaping) |
| `npm run test:site` | After a build: starts the site against a local test mail server and checks every legacy URL, redirect, 410, canonical, H1, title, sitemap, robots, security header, and the quote API end to end (including real SMTP delivery and failure handling) |
| `npm run typecheck` | TypeScript check |

## Where things live

```
app/                  one folder per URL (old WordPress paths kept exactly, trailing slashes on)
app/api/quote/        the quote form endpoint (validation, anti-spam, SMTP)
components/           Header, Footer, page shells, ServiceArticle, FaqArticle, the quote form
lib/site.ts           business details, URLs and shared facts (edit contact details here)
lib/services.ts       all service and FAQ copy
lib/testimonials.ts   testimonials (verbatim)
lib/quote.ts          form fields and validation, shared by browser and server
proxy.ts              apex→www, trailing-slash 301s, 410 for removed test pages, noindex on non-production hosts
next.config.mjs       security headers, CSP, redirects for changed URLs
docs/                 audit, URL migration map, keywords, claims to confirm, QA report, deployment and rollback
```

## Documentation

- [docs/AUDIT.md](docs/AUDIT.md): findings on the old site and the BIV reference
- [docs/url-migration-map.csv](docs/url-migration-map.csv): every old URL and what it does now (also drives `test:site`)
- [docs/KEYWORDS.md](docs/KEYWORDS.md): keyword-to-page map and its limits
- [docs/CLAIMS-TO-CONFIRM.md](docs/CLAIMS-TO-CONFIRM.md): business facts awaiting confirmation
- [docs/QA-REPORT.md](docs/QA-REPORT.md): test results
- [docs/DEPLOY.md](docs/DEPLOY.md): environment variables, staging, go-live checklist, rollback
- [SECURITY.md](SECURITY.md): form protections and security headers

Never commit `.env*` files or real credentials.
