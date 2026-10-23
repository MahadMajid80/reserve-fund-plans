# QA report

Version 2: the BIV Reports design and code with the Reserve Fund Plans colours and content.
Run on 23 October 2026 against the local production build (`next start`). Not yet run on a staging or production deployment.

| Check | Result |
|---|---|
| TypeScript | Pass |
| Production build + indexing guard | Pass (20 pre-rendered pages, all canonical to `https://www.reservefundplans.com.au/…`, no noindex) |
| Unit tests (`npm test`) | 11 / 11 pass |
| Site verifier (`npm run test:site`) | 177 / 177 pass |
| Browser test of the quote form, 1280px and 390px | 9 / 9 pass (validation, steps, sending, both emails received) |
| axe-core WCAG 2.2 AA, 16 pages | 0 violations (after fixing 3 found on the first run) |
| `npm audit` | 0 vulnerabilities |

## URLs and SEO
All 22 preserved page URLs answer 200 at their original paths with a self-canonical, one H1, a title of 15–70 characters, a meta description and valid JSON-LD. The 9 changed URLs (attachment page, old images, WordPress sitemaps and feeds) each 301 once to a 200. The 5 WordPress test-content URLs answer 410. Missing slashes get one 301, query strings kept. Sitemap lists exactly the indexable pages.

## Quote form and email
Through the real API and a local SMTP server: valid request → 200 and one email to `QUOTE_TO_EMAIL` with the customer as Reply-To and the Reserve Fund Plans logo embedded; invalid fields → 422; honeypot, too-fast and link-spam submissions → no email; cross-site → 403; non-JSON → 415; oversized → 413; malformed → 400; sixth request in 10 minutes → 429; header injection rejected; mail server down → 502 with a "please call" message.

Not yet tested: delivery through the real mailbox and the reCAPTCHA checkbox (need production credentials and keys).

## Accessibility fixes made during QA
- Text on the green WHS colour now uses dark text (white on `#599B51` was below 4.5:1).
- Map state buttons' accessible names now start with the visible label ("WA, Western Australia: …").

## Performance (Lighthouse, simulated)
| Page | Mobile | Desktop |
|---|---|---|
| `/` | 84 · LCP 3.3 s · CLS 0 · TBT 360 ms | 99 · LCP 0.7 s |
| `/services/sfp/` | 87 · LCP 2.9 s · CLS 0 · TBT 350 ms | 100 · LCP 0.7 s |
| `/quote-request/` | 91 · LCP 3.0 s · CLS 0 · TBT 230 ms | 100 · LCP 0.6 s |

Accessibility and Best Practices 100 everywhere; SEO 69 only because local hosts are deliberately `noindex`. Mobile LCP is above the 2.5 s target in simulation because of the BIV design's intro and headline animations. Check real-user data after launch.
