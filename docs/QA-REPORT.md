# QA report

Run on 23 October 2026 against the local production build (`next start`). **Not yet run against a staging or production deployment**: repeat sections 2, 5 and 6 there before launch (see DEPLOY.md).

## Summary

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | Pass |
| Production build + indexing guard | Pass (20 pre-rendered pages, all canonical to www, no noindex) |
| Unit tests (`npm test`) | 13 / 13 pass |
| Site verifier (`npm run test:site`) | 176 / 176 pass |
| Browser end-to-end (form, keyboard, mobile menu), 1280px and 390px | 31 / 31 pass |
| axe-core WCAG 2.2 AA, 15 pages | 0 violations (after fixing 2 issues found on the first run) |
| `npm audit` | 0 vulnerabilities |
| Browser console errors | None on any page tested |

## 1. URLs and SEO (site verifier)
All 22 preserved page URLs answer 200 at their original path with a self-referencing `https://www.` canonical, exactly one H1, a unique title (15–70 characters) and a meta description (70–170 characters), valid JSON-LD and no noindex meta. All 8 redirects are a single 301 to a 200 (no chains). All 5 removed test URLs answer 410. Missing trailing slash → one 301, query strings kept. Unknown URL → 404. Sitemap lists exactly the indexable pages; robots.txt allows crawling and points to the sitemap. Non-production hosts get `X-Robots-Tag: noindex`.

## 2. Quote form and email
Tested through the real API and a real SMTP conversation with a local test mail server (nodemailer → smtp-server):
- Valid request → 200 and one email to `QUOTE_TO_EMAIL`, Reply-To set to the customer, subject names service and suburb, conditional answers included, visitor markup escaped.
- Invalid fields → 422 with field messages; missing service → 422.
- Honeypot, too-fast submission, link spam → told "ok", **no email sent**.
- Cross-site post → 403; non-JSON → 415; oversized body → 413; malformed JSON → 400; 6th request in 10 minutes → 429; header-injection attempt rejected, extra recipient fields ignored.
- Mail server unreachable → 502 `delivery_failed`; the form shows a retry/phone message and keeps the answers.
- In the browser: preselected service from `?service=`, inline errors with focus on the first invalid field, conditional questions, Back keeps values, answers restored after reload, review step and Edit links, confirmation screen, saved answers cleared after sending. Same results at 390px.

**Not yet tested:** delivery through your real mailbox (needs the production SMTP credentials) and the reCAPTCHA checkbox (needs keys). Both are in the go-live checklist.

## 3. Accessibility
axe-core (WCAG 2.0/2.1/2.2 A and AA rules) on 15 pages: 0 violations. Fixed during QA: small ochre numerals below 4.5:1 contrast (now darker ochre) and logo links whose accessible name didn't match visible text. Keyboard: skip link is the first Tab stop; menus open on focus; mobile menu closes with Escape; focus moves to each form step's heading; visible focus ring throughout. Reduced-motion users get no chart animation. Touch targets are at least 44px. Manual screen-reader testing has not been done.

## 4. Responsive
Checked at 1440, 1280 and 390px wide. A horizontal-scroll bug at 390px (header tagline) was found and fixed; the verifier now confirms no horizontal scroll at 390px.

## 5. Performance (Lighthouse 12, local server, simulated throttling)

| Page | Mobile perf | LCP | CLS | TBT | Desktop perf | LCP |
|---|---|---|---|---|---|---|
| `/` | 94 | 2.5 s | 0 | 200 ms | 97 | 0.5 s |
| `/services/sfp/` | 95 | 2.4 s | 0 | 190 ms | 100 | 0.6 s |
| `/quote-request/` | 99 | 1.6 s | 0 | 90 ms | 100 | 0.6 s |
| `/building-insurance-valuation/` | 96 | 2.2 s | 0 | 180 ms | 100 | 0.4 s |

Accessibility and best practices scored 100 on every run. SEO scored 66–69 **only** because the local host is deliberately served with `noindex` (the single failing audit is "Page is blocked from indexing"); production is not. These are lab figures from one machine: Core Web Vitals targets apply to real-user data at the 75th percentile, which will only exist after launch (check PageSpeed Insights / Search Console then). INP can't be measured in the lab; TBT is the proxy and is within budget. The mobile homepage LCP sits right at the 2.5 s target in simulation; the display font uses `font-display: optional` to keep it there.

## 6. Outstanding
1. Real SMTP and reCAPTCHA tests on staging.
2. Old site's `sitemap.xml`, `robots.txt`, Search Console and backlink data not checked (no access).
3. Items in CLAIMS-TO-CONFIRM.md.
4. Field Core Web Vitals after launch.
