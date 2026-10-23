# Audit: reservefundplans.com.au and the BIV reference

Date: 23 October 2026. Method: the live site was read page by page (the sandbox could not fetch `sitemap.xml` or `robots.txt` directly, so URLs were discovered from search-engine results, every internal link on every page, and post/author/category links). BIV was audited from the `MahadMajid80/BIV-reports` repository (`main`, commit `6aa5175`).

## What could not be verified

- **Search Console, analytics, backlinks**: no access. Indexation and link equity per URL are unknown; every existing URL is therefore kept or deliberately handled.
- **`sitemap.xml` / `robots.txt` of the old site**: not reachable from the build environment. Check them before launch and add any URL not in `url-migration-map.csv`.
- **Exact HTTP status codes**: pages were fetched successfully (treated as 200); redirects and headers on the old server were not observable.
- **Hosting, DNS, mail (MX/SPF/DKIM/DMARC)**: not inspected.
- **Original logo and hero image files**: could not be downloaded (see CLAIMS-TO-CONFIRM).

## Old site (WordPress, All in One SEO 4.9.6.2)

| Area | Finding |
|---|---|
| Pages | Home, About us, 4 services (`/services/biv|sfp|whs|asb/`), 4 FAQ pages, Testimonials + 4 detail pages, Contact us, Quote request, Legal |
| Leftovers | `/blog/`, two "Test Post" posts (2020), `/category/uncategorized/`, `/author/wdobrow/` (noindex), attachment page `/home-2/uev-img_9964/` (indexed) |
| Menus | "Services" and "FAQ" are dropdown headings linking to `#` (no hub pages) |
| SEO | No meta descriptions on any page. Homepage has no H1. Duplicate titles ("Reserve Fund Plans \| Reserve Fund Plans" on two URLs). Service H2s skipped (H1 → H3) |
| Contact data | Phone 1300 55 18 30 (header/contact), but footer menu shows 1300 107 280 (BIV's number). Postcode printed as 5163 (Applecross is 6153). Email rfplans@rfplans.com.au. Copyright 2008–2018 |
| Forms | Quote form: services checkboxes, contact details, special instructions, preference (call/email). Contact form: preference + topic + honeypot |
| Content risk | Legislation references pre-date WA's 2020 strata reforms and the WHS Act 2020 (in force 31 March 2022): "Designated Strata Company", "Division 4", "proposed Model WHS legislation", OSH Regulations 1996, a Model-Act penalty table |
| Testimonials | All four name "BIV Reports" (sister brand) |

## BIV reference (implementation patterns reused)

Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 4, nodemailer SMTP delivery, static generation, `proxy.ts` for host/slash/noindex handling, `trailingSlash: true` with single 301s, strict security headers + CSP, layered form protection (origin check, size/type limits, rate limit, honeypot, timing, reCAPTCHA, spam heuristics, server validation), post-build indexing guard. Not reused: framer-motion and Lenis (animation libraries), BIV's palette, font, layouts and components.

## Plan carried out

Same stack and security architecture; new brand (Fraunces + Instrument Sans, eucalypt/ochre/sandstone, square-cut ledger aesthetic); every page URL preserved; test content answered 410; a 5-step quote form; rewritten copy with legislation checked against Landgate and WorkSafe WA and uncertain claims flagged.
