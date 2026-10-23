// Server-only helpers for the quote API: rate limiting, same-origin check, reCAPTCHA verification and spam checks.
// Adapted from the BIV Reports implementation.
import "server-only";

/* ── Rate limiting ──
   Sliding window per IP, in memory. On serverless hosts each warm instance keeps its own window, which is enough
   to stop one client hammering the form. For a hard global limit add a firewall rule on /api/quote/ at the host. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function rateLimited(ip: string, now = Date.now()) {
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  const limited = list.length >= MAX_PER_WINDOW;
  if (!limited) list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return limited;
}

/** For tests only. */
export const resetRateLimit = () => hits.clear();

export function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : req.headers.get("x-real-ip") || "unknown").trim().slice(0, 64);
}

/* ── Same-origin check (CSRF and cross-site scripted posts) ── */
export function sameOrigin(req: Request) {
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  const origin = req.headers.get("origin");
  if (!origin) return true; // some older browsers omit Origin on same-origin requests; the other layers still apply
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").toLowerCase();
  try {
    return new URL(origin).host.toLowerCase() === host;
  } catch {
    return false;
  }
}

/* ── reCAPTCHA v2 checkbox ── */
export type CaptchaResult = { ok: true; skipped?: boolean } | { ok: false; reason: string };

export async function verifyRecaptcha(token: string, ip: string): Promise<CaptchaResult> {
  const secret = (process.env.RECAPTCHA_CHECKBOX_SECRET_KEY || "").trim();
  if (!secret) return { ok: true, skipped: true }; // not configured: honeypot, timing, origin and rate limits still apply
  if (!token || token.length > 4000) return { ok: false, reason: "missing_token" };
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const r = await fetch("https://www.google.com/recaptcha/api/siteverify", { method: "POST", body, signal: AbortSignal.timeout(6000) });
    const d = (await r.json()) as { success?: boolean; "error-codes"?: string[] };
    const codes = d["error-codes"] ?? [];
    if (d.success) return { ok: true };
    if (codes.includes("invalid-input-secret") || codes.includes("missing-input-secret")) {
      console.error("[recaptcha] RECAPTCHA_CHECKBOX_SECRET_KEY is wrong: fix it in the host's environment settings and redeploy");
      return { ok: true, skipped: true }; // our misconfiguration: don't turn real customers away
    }
    return { ok: false, reason: `invalid_token:${codes.join(",") || "unknown"}` };
  } catch (err) {
    console.error("[recaptcha] could not reach Google to verify", err instanceof Error ? err.message : err);
    return { ok: true, skipped: true };
  }
}

/* ── Spam heuristics: loose on purpose, so real enquiries are never caught ── */
const URL_ONE = /(https?:\/\/|www\.)\S+/i;
const URL_ALL = /(https?:\/\/|www\.)\S+/gi;

export function looksLikeSpam(f: { name: string; organisation: string; address: string; message: string }) {
  if (URL_ONE.test(f.name) || URL_ONE.test(f.organisation) || URL_ONE.test(f.address)) return true;
  if ((f.message.match(URL_ALL)?.length ?? 0) > 3) return true;
  if (/\[url=|<a\s+href/i.test(f.message)) return true;
  return false;
}

/** Removes control characters (including line breaks) from values that go into email headers. */
export const headerSafe = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();

/** Which protections are on (booleans only, never the keys). */
export function protectionStatus() {
  return {
    recaptcha: !!(process.env.RECAPTCHA_CHECKBOX_SECRET_KEY || "").trim(),
    emailDelivery: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
  };
}
