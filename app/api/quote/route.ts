import { NextResponse } from "next/server";
import { emptyQuote, preferences, roles, states, propertyTypes, timings, validateQuote, yesNoUnsure, LIMITS, EMAIL_RE, type QuoteRequest } from "@/lib/quote";
import { quoteEmailHtml, quoteEmailText } from "@/lib/emailTemplate";
import { sendViaSmtp, smtpConfigured } from "@/lib/mail";
import { clientIp, headerSafe, looksLikeSpam, protectionStatus, rateLimited, sameOrigin, verifyRecaptcha } from "@/lib/security";

/*
  POST /api/quote/ : receives the multi-step quote form and emails it through SMTP.

  Layers, in order:
    1. same-origin check (Origin / Sec-Fetch-Site)       → 403
    2. JSON only, body ≤ 16 KB                            → 415 / 413
    3. rate limit: 5 requests per IP per 10 minutes       → 429
    4. reCAPTCHA v2 checkbox (when keys are set)          → 403
    5. honeypot field / completed in under 4 seconds      → told "ok", nothing sent (unless reCAPTCHA verified)
    6. link-spam heuristics                               → told "ok", nothing sent (unless reCAPTCHA verified)
    7. server-side validation (same rules as the form)    → 422
    8. delivery                                           → 200, or 502 on failure, 503 if not configured
  The email only ever goes to QUOTE_TO_EMAIL (or SMTP_USER), never to an address from the form, so the route
  cannot be used as an open mail relay. The customer's address is used only as Reply-To.
*/

export const dynamic = "force-dynamic";
const MAX_BODY = 16 * 1024;
const MIN_FILL_MS = 4000;
const json = (data: object, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });

const str = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max) : "");
const pick = (v: unknown, list: readonly string[]) => (typeof v === "string" && list.includes(v) ? v : "");

function clean(b: Record<string, unknown>): QuoteRequest {
  return {
    ...emptyQuote,
    services: Array.isArray(b.services) ? [...new Set(b.services.filter((x): x is string => typeof x === "string").slice(0, 10))] : [],
    schemeName: str(b.schemeName, LIMITS.schemeName + 1),
    address: str(b.address, LIMITS.address + 1),
    suburb: str(b.suburb, LIMITS.suburb + 1),
    state: pick(b.state, states),
    propertyType: pick(b.propertyType, propertyTypes),
    lots: str(b.lots, 10),
    planNo: str(b.planNo, LIMITS.planNo + 1),
    existingPlan: pick(b.existingPlan, yesNoUnsure),
    builtBefore2004: pick(b.builtBefore2004, yesNoUnsure),
    name: str(b.name, LIMITS.name + 1),
    organisation: str(b.organisation, LIMITS.organisation + 1),
    role: pick(b.role, roles),
    email: str(b.email, LIMITS.email + 1),
    phone: str(b.phone, LIMITS.phone + 1),
    preference: pick(b.preference, preferences),
    timing: pick(b.timing, timings),
    message: str(b.message, LIMITS.message + 1),
    website: str(b.website, 200),
  };
}

/** GET /api/quote/ : health check showing which protections are on (booleans only). */
export function GET() {
  return json({ ok: true, ...protectionStatus() });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, error: "forbidden" }, 403);
  if (!(req.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) return json({ ok: false, error: "unsupported_media_type" }, 415);
  if (Number(req.headers.get("content-length") || 0) > MAX_BODY) return json({ ok: false, error: "too_large" }, 413);

  const ip = clientIp(req);
  if (rateLimited(ip)) return json({ ok: false, error: "rate_limited" }, 429);

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY) return json({ ok: false, error: "too_large" }, 413);
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }
  const q = clean(body);

  const captcha = await verifyRecaptcha(typeof body.token === "string" ? body.token : "", ip);
  if (!captcha.ok) {
    console.warn("[quote] reCAPTCHA rejected", captcha.reason);
    return json({ ok: false, error: "captcha_failed" }, 403);
  }
  const verified = !captcha.skipped;

  const elapsed = typeof body.elapsed === "number" ? body.elapsed : 0;
  if ((q.website || elapsed < MIN_FILL_MS) && !verified) {
    console.warn(`[quote] bot trap (honeypot=${!!q.website}, elapsed=${elapsed}ms): dropped`);
    return json({ ok: true });
  }
  if (looksLikeSpam(q) && !verified) {
    console.warn("[quote] link-spam check: dropped");
    return json({ ok: true });
  }

  const errors = validateQuote(q);
  if (Object.keys(errors).length) return json({ ok: false, error: "invalid", errors }, 422);

  if (!smtpConfigured()) {
    console.error("[quote] email delivery is not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS and QUOTE_TO_EMAIL)");
    return json({ ok: false, error: "not_configured" }, 503);
  }

  const to = [...new Set((process.env.QUOTE_TO_EMAIL || process.env.SMTP_USER || "").split(",").map((s) => s.trim()).filter(Boolean))];
  try {
    await sendViaSmtp({
      from: process.env.QUOTE_FROM_EMAIL || `Reserve Fund Plans website <${(process.env.SMTP_USER || "").trim()}>`,
      to,
      replyTo: EMAIL_RE.test(q.email) ? headerSafe(q.email) : undefined,
      subject: headerSafe(`Quote request: ${q.services.join(", ")} – ${q.suburb} – ${q.name}`).slice(0, 200),
      text: quoteEmailText(q),
      html: quoteEmailHtml(q),
    });
  } catch (err) {
    console.error("[quote] delivery failed", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "delivery_failed" }, 502);
  }
  console.info("[quote] delivered", JSON.stringify({ services: q.services.length, elapsed, captchaVerified: verified }));
  return json({ ok: true });
}
