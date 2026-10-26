# Reserve Fund Plans website (Next.js)

The rebuild of [reservefundplans.com.au](https://www.reservefundplans.com.au). It is built on the **BIV Reports site's components and code**, with its own look: the Reserve Fund Plans colours, different fonts, squarer shapes, a full-width photo hero and photos of Australian high-rises. Every page URL from the old WordPress site is kept.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Lenis · nodemailer

## Run it

```bash
npm install
cp .env.example .env.local   # optional: SMTP + reCAPTCHA so the quote form sends
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Requires Node 20+.

## Colour scheme

Taken from the live reservefundplans.com.au site:

| Token | Hex | Source |
|---|---|---|
| `brand` | `#C8331A` | the old site's red buttons and links (`#DB3A1B`), deepened slightly for readable text |
| `navy` (dark panels) | `#141414` | the black of the logo |
| `brand-soft` | `#F5DC3C` | the logo yellow, used on dark panels |
| `blue` | `#3F57A2` | Building Insurance Valuations (diamond icon) |
| `sage` | `#599B51` | WHS Reports (diamond icon) |
| `brass` | `#E7C733` | Reserve Fund Plans (diamond icon) |
| `oxblood` | `#CC222E` | Asbestos Reports (diamond icon) |

The logo in `public/rfp-logo.svg` is a stand-in redrawn from the yellow-on-black logo until the original file is supplied.

## How it differs from BIV

| | BIV Reports | Reserve Fund Plans |
|---|---|---|
| Fonts | Plus Jakarta Sans | Sora (headings) + Manrope (text), self-hosted |
| Shapes | Very rounded panels (1.5–2.5rem), pill buttons | Squarer: 0.75–1rem panels, square-cornered buttons and menu |
| Homepage hero | Split: text left, rounded photo right | Full-width photo of Sydney CBD high-rises with text over a dark wash, plus a figures strip |
| Photos | One building photo, Sydney skyline | Australian high-rises: Sydney CBD (hero), Elizabeth Quay and Kings Park (Perth), residential and glass towers |
| Closing panels | Plain dark panel | Perth skyline photo behind the call to action, steps on a numbered timeline |
| Section labels | "01 —— TITLE" | Red bar, title, then "/ 01" |
| Report cards | 2×2 white spotlight cards | One row of cards with the old site’s diamond service icons and a report-colour bar |
| Figures | White stat cards | Yellow-and-black band (the logo's colours) |
| Calculator, coverage map | Text left, panel right | Flipped: panel/map left |
| About section | Staggered value cards | Building photo + numbered values list; dark timeline strip |
| Testimonials | Draggable carousel | Grid of quote cards |
| Inner pages | Plain title area | Building-photo banner under the title; photos behind service-page headers |

## Photos

`lib/photos.ts` lists every photo. They are free to use under the [Unsplash License](https://unsplash.com/license) and load from Unsplash's image CDN (`images.unsplash.com`), which resizes them and serves AVIF/WebP. Credits are on `/legal/`. To swap a photo, change its `src` in `lib/photos.ts` (any `images.unsplash.com/photo-…` address works).

## Where things live

```
lib/site.ts           business details, URLs and shared facts (phone, address, indemnity, turnaround)
lib/content.ts        homepage copy, colours, stats, values, coverage
lib/services.ts       the four service pages and four FAQ pages
lib/testimonials.ts   the four testimonials (verbatim) and their original URLs
lib/quote.ts          quote form options and validation (browser and server)
app/api/quote/        the quote form endpoint (spam protection + SMTP)
proxy.ts              apex → www, trailing-slash 301s, 410 for removed test pages, noindex on preview hosts
next.config.mjs       security headers, CSP, redirects for changed URLs
docs/                 audit, URL migration map, keywords, claims to confirm, QA report, deployment
```

## Tests

| Command | What it checks |
|---|---|
| `npm test` | Unit tests: validation, security helpers, content |
| `npm run build && npm run test:site` | Every legacy URL, redirect, 410, canonical, title, H1, sitemap, robots and security header, plus the quote API end to end through a local test mail server |

See [docs/QA-REPORT.md](docs/QA-REPORT.md), [docs/DEPLOY.md](docs/DEPLOY.md), [docs/CLAIMS-TO-CONFIRM.md](docs/CLAIMS-TO-CONFIRM.md) and [SECURITY.md](SECURITY.md).
