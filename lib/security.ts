// Server-only helpers for the form API: rate limiting, same-origin checks, reCAPTCHA verification, spam heuristics.

/* ───────── Rate limiting ─────────
   Sliding window per IP, kept in memory. On Vercel each warm function instance keeps its own window, which is
   enough to stop a single bot hammering the form. For a hard global limit, also add a Vercel Firewall rate-limit
   rule on /api/quote/ (see SECURITY.md). */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function rateLimited(ip: string, now = Date.now()) {
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  const limited = list.length >= MAX_PER_WINDOW;
  if (!limited) list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) {
    // keep memory bounded
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return limited;
}

export function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : req.headers.get("x-real-ip") || "unknown").trim().slice(0, 64);
}

/* ───────── Same-origin check ─────────
   The form only ever posts from this site, so cross-site posts (CSRF, scripted spam from other pages) are refused. */
export function sameOrigin(req: Request) {
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  const origin = req.headers.get("origin");
  if (!origin) return true; // older browsers on same-origin requests; the other layers still apply
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").toLowerCase();
  try {
    return new URL(origin).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

/* ───────── reCAPTCHA v3 ───────── */
const MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE || 0.5);

export type CaptchaResult = { ok: true; skipped?: boolean; score?: number } | { ok: false; reason: string; score?: number };

export async function verifyRecaptcha(token: string, action: string, ip: string): Promise<CaptchaResult> {
  // Checkbox (v2) keys take priority over v3 keys, matching the browser side (lib/recaptcha.ts).
  // Trimmed: a space or line break pasted into Vercel along with a key would make every check fail.
  const checkboxSecret = (process.env.RECAPTCHA_CHECKBOX_SECRET_KEY || "").trim();
  const secret = checkboxSecret || (process.env.RECAPTCHA_SECRET_KEY || "").trim();
  const mode = checkboxSecret ? "checkbox" : "v3";
  if (!secret) {
    console.warn("[recaptcha] no reCAPTCHA secret key is set in this deployment: not being checked");
    return { ok: true, skipped: true }; // not configured yet: other layers still apply
  }
  if (!token || token.length > 4000) return { ok: false, reason: "missing_token" };
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(6000),
    });
    const d = (await r.json()) as { success?: boolean; score?: number; action?: string; hostname?: string; "error-codes"?: string[] };
    const codes = d["error-codes"] ?? [];
    console.info("[recaptcha]", JSON.stringify({ mode, success: d.success, score: d.score, action: d.action, hostname: d.hostname, errors: codes }));
    if (!d.success) {
      // A wrong/missing secret is OUR misconfiguration, not a bot: log it loudly but don't turn genuine customers away.
      if (codes.includes("invalid-input-secret") || codes.includes("missing-input-secret")) {
        console.error(`[recaptcha] the ${mode === "checkbox" ? "RECAPTCHA_CHECKBOX_SECRET_KEY" : "RECAPTCHA_SECRET_KEY"} in Vercel is wrong. Copy the SECRET key from google.com/recaptcha/admin and redeploy.`);
        return { ok: true, skipped: true };
      }
      return { ok: false, reason: `invalid_token:${codes.join(",") || "unknown"}` };
    }
    if (mode === "checkbox") return { ok: true }; // the tickbox was solved
    if (d.action !== action) return { ok: false, reason: `wrong_action:${d.action}`, score: d.score };
    if (typeof d.score === "number" && d.score < MIN_SCORE) return { ok: false, reason: "low_score", score: d.score };
    return { ok: true, score: d.score };
  } catch (err) {
    // Google unreachable: don't lose a genuine enquiry; honeypot, timing, origin and rate limits still apply.
    console.error("[recaptcha] could not reach Google to verify", err);
    return { ok: true, skipped: true };
  }
}

/** Which protections are switched on in this deployment (booleans only, never the keys themselves). */
export function protectionStatus() {
  const { RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_WEBHOOK_URL } = process.env;
  return {
    recaptchaType: (process.env.RECAPTCHA_CHECKBOX_SECRET_KEY || "").trim() ? "checkbox" : (process.env.RECAPTCHA_SECRET_KEY || "").trim() ? "v3 (invisible)" : "off",
    recaptchaSecretKeySet: !!(process.env.RECAPTCHA_CHECKBOX_SECRET_KEY || process.env.RECAPTCHA_SECRET_KEY || "").trim(),
    recaptchaMinScore: MIN_SCORE,
    emailDelivery: process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS ? "smtp" : RESEND_API_KEY && QUOTE_TO_EMAIL ? "resend" : QUOTE_WEBHOOK_URL ? "webhook" : "not configured",
  };
}

/* ───────── Spam heuristics ───────── */
const URL_ONE = /(https?:\/\/|www\.)\S+/i;
const URL_ALL = /(https?:\/\/|www\.)\S+/gi;

/** True for submissions that look like link spam. Kept loose so real enquiries are never caught. */
export function looksLikeSpam(fields: { name: string; managerName: string; managerCompany: string; instructions: string; address: string }) {
  if (URL_ONE.test(fields.name) || URL_ONE.test(fields.managerName) || URL_ONE.test(fields.address)) return true;
  const links = fields.instructions.match(URL_ALL)?.length ?? 0;
  if (links > 3) return true;
  if (/\[url=|<a\s+href/i.test(fields.instructions)) return true;
  return false;
}

/** Removes control characters (incl. line breaks) from values that go into email headers. */
export const headerSafe = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
