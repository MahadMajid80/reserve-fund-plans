# Security

## Quote form (`/api/quote/`)
In order: same-origin check (Origin / Sec-Fetch-Site, CSRF protection) → JSON only and 16 KB body limit → 5 requests per IP per 10 minutes → reCAPTCHA v2 checkbox when keys are set → honeypot field and minimum fill time (bots are told "ok" and nothing is sent) → link-spam heuristics → server-side validation with the same rules as the browser, allow-listed option values and length limits → SMTP delivery.

- **Not an open relay**: mail only goes to `QUOTE_TO_EMAIL` (or `SMTP_USER`). The visitor's address is used only as Reply-To, after control characters are stripped. Extra fields like `to`/`bcc` are ignored.
- **Escaping**: every value is HTML-escaped in the email; control characters are removed on input.
- **Secrets** stay in server environment variables; only the reCAPTCHA site key is public by design.
- **Logging** records counts and outcomes only, never names, emails or messages.
- **Failures** answer 502 (delivery) or 503 (not configured) and the form tells the visitor to retry or phone; answers stay in the browser tab.
- No database, no file uploads, no admin area, no authentication.

The in-memory rate limit is per server instance. For a hard global limit add a firewall rule on `/api/quote/` at the host (e.g. Vercel Firewall).

## Headers (all routes)
Content-Security-Policy (self + Google reCAPTCHA only, `frame-ancestors 'none'`, `object-src 'none'`), Strict-Transport-Security (1 year), X-Content-Type-Options, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy; `X-Powered-By` removed. `'unsafe-inline'` scripts are allowed because statically generated Next.js pages use inline hydration scripts; a nonce would make every page render on demand.

## Dependencies
Five runtime packages (next, react, react-dom, nodemailer, server-only and their dependencies). `npm audit` reported 0 vulnerabilities at build time.
