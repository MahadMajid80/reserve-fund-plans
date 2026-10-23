# Security (Reserve Fund Plans), spam protection and performance

This is what the site does to stay secure, fast and free of spam, and what to switch on in Vercel.

## 1. What's built in

### Attack surface
- Every page is **static HTML**, generated at build time. There is no database, no CMS, no login and no admin panel, so
  the usual WordPress-style break-ins (plugin exploits, brute-forced logins, SQL injection) have nothing to target.
- The only server code is the quote form endpoint, `POST /api/quote/`. Every other method gets a 405.
- Dependencies are kept to six: next, react, react-dom, framer-motion, lenis and nodemailer (sends the form email). `npm audit` reports **0 vulnerabilities**
  (Next 16.4.1, React 19.3.1).

### HTTP security headers (`next.config.mjs`, on every response)
| Header | Value / purpose |
|---|---|
| Content-Security-Policy | Scripts, frames and requests are allowed only from this site, Google reCAPTCHA, Google Analytics and the Vercel preview toolbar. Also sets `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'` and `upgrade-insecure-requests`. |
| Strict-Transport-Security | `max-age=31536000`: HTTPS only. `includeSubDomains`/`preload` are left off so other subdomains (e.g. mail) are not affected. Add them later if every subdomain is on HTTPS. |
| X-Frame-Options | `DENY`: the site can't be framed (clickjacking). |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | Camera, microphone, geolocation, payment, USB, sensors and topics are all off. |
| Cross-Origin-Opener-Policy | `same-origin` |
| X-Powered-By | Removed, so the site doesn't advertise its stack. |

> The CSP allows `'unsafe-inline'` scripts because Next.js uses small inline scripts to hydrate statically generated pages.
> A nonce-based CSP would force every page to render on each request and lose the speed of static HTML. With no user
> content rendered as HTML anywhere on the site, the XSS risk this would guard against is negligible.

### Quote form protection (`app/api/quote/route.ts`, `lib/security.ts`)
These run in order. Each one is moderate, so genuine visitors never see a puzzle:
1. **Same-origin only**: posts from other websites are refused (403). This blocks CSRF and form-spam scripts hosted elsewhere.
2. **JSON only, at most 16 KB**: 415 / 413.
3. **Rate limit**: 5 submissions per IP per 10 minutes. After that the visitor gets 429 and a friendly "please wait, or call us" message.
4. **Honeypot**: a hidden "website" field. Bots fill it in; people never see it. The bot is told "success" and nothing is sent.
5. **Too-fast check**: the 3-step form can't be completed by a person in under 3 seconds. Faster submissions are treated as bots and quietly dropped.
6. **Google reCAPTCHA v3**: invisible and score-based, with no "click the traffic lights". The Google script loads only
   when someone starts filling in the form, so it doesn't slow pages down. Submissions scoring below 0.5 are refused
   (403), and the visitor is asked to try again or call. You can tune the threshold with `RECAPTCHA_MIN_SCORE`.
7. **Link-spam filter**: URLs in the name, address or strata-manager fields, more than 3 links in the instructions, or
   BBCode/HTML links are quietly dropped.
8. **Validation and sanitising**: same rules as the browser. Values are length-capped, HTML-escaped in the email, and
   stripped of line breaks in email headers (no header injection).

### Email address protection (`components/Email.tsx`)
The office email address does not appear anywhere in the HTML, the page data or the structured data. In the HTML, the "@" is
drawn with CSS, so it still looks normal. The working `mailto:` link is put in place by JavaScript as the page loads,
which address-harvesting bots don't run. Visitors see and click the address exactly as before.

## 2. What to switch on in Vercel

1. **Environment variables** (Project → Settings → Environment Variables). See `.env.example`:
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` turn reCAPTCHA on.
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` + `QUOTE_TO_EMAIL` send the form through the business mailbox. Alternatives: `RESEND_API_KEY` + `QUOTE_TO_EMAIL`, or `QUOTE_WEBHOOK_URL`.
   - Redeploy after adding them. `NEXT_PUBLIC_*` values are built into the pages.
2. **Firewall** (Project → Firewall), recommended:
   - Turn on **Bot Protection** (managed ruleset). Vercel's DDoS mitigation is already on by default.
   - Add a **rate-limit rule** for `/api/quote/`, e.g. 10 requests per minute per IP. This complements the in-app limit,
     which is per server instance.
3. **Domains**: add `reservefundplans.com.au` as well as `www.reservefundplans.com.au`. The apex domain 301s to www.
4. **Deployment Protection**: optional. Password-protect preview deployments so only you can see them.

## 3. Getting the reCAPTCHA keys
1. Open https://www.google.com/recaptcha/admin and sign in with the Google account that should own it.
2. Create a site: label "BIV Reports", type **reCAPTCHA v3**.
3. Domains: `reservefundplans.com.au`, `www.reservefundplans.com.au`, your Vercel preview domain and `localhost`.
4. Copy the **site key** into `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and the **secret key** into `RECAPTCHA_SECRET_KEY` in Vercel.
   Keep the secret key out of the code and the repo.

Both keys live only in Vercel's environment variables: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY`.
Redeploy after adding or changing them. To check, open `/api/quote/` on the live site; it should show `"recaptchaSecretKeySet": true`.

### Visible "I'm not a robot" checkbox (optional)
To show Google's tickbox on the last step of the quote form instead of the invisible check:
1. At google.com/recaptcha/admin/create, choose **Challenge (v2) → "I'm not a robot" Checkbox** and add the same domains.
2. In Vercel, add `NEXT_PUBLIC_RECAPTCHA_CHECKBOX_SITE_KEY` (site key) and `RECAPTCHA_CHECKBOX_SECRET_KEY` (secret key).
3. Redeploy. `/api/quote/` then shows `"recaptchaType": "checkbox"`.

When the checkbox keys are set, they take priority over the v3 keys, so you can leave the v3 keys in place or delete them.

## 4. Performance (Lighthouse, local production build, 23 October 2026)
| Page | Mobile (slow 4G, simulated) | Desktop |
|---|---|---|
| Home | 84 performance · LCP 3.3 s · CLS 0 · TBT 360 ms | 99 · LCP 0.7 s · TBT 0 ms |
| /services/sfp/ | 87 · LCP 2.9 s · CLS 0 | 100 · LCP 0.7 s |
| /quote-request/ | 91 · LCP 3.0 s · CLS 0 | 100 · LCP 0.6 s |

Accessibility 100 and Best Practices 100 on every page tested. SEO scores 69 locally only because non-production
hosts get `noindex` on purpose. The mobile LCP is above the 2.5 s target in simulation: it comes from the BIV design's
intro and headline animations (the same design as BIV). Real-user Core Web Vitals should be checked after launch.

What keeps it fast:
- Static HTML on Vercel's CDN.
- A self-hosted variable font with a metric-matched fallback.
- CSS above-the-fold animations, so nothing waits on JavaScript.
- AVIF/WebP responsive images through `next/image`, cached for 30 days.
- Week-long browser caching for `/public` images.
- reCAPTCHA and Analytics load only when needed.
