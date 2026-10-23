import { NextResponse } from "next/server";
import { EMAIL_RE, emptyQuote, validateQuote, type QuoteRequest } from "@/lib/quote";
import { quoteEmailHtml } from "@/lib/emailTemplate";
import { EMAIL_LOGO_BASE64, EMAIL_LOGO_CID } from "@/lib/emailLogo";
import { sendViaSmtp, smtpConfigured } from "@/lib/mail";
import { clientIp, headerSafe, looksLikeSpam, protectionStatus, rateLimited, sameOrigin, verifyRecaptcha } from "@/lib/security";

/*
  POST /api/quote/  — receives the quote form.

  Delivery (set in Vercel → Project → Settings → Environment Variables). TODO [ASK]: choose one.
    A) Email through the business mailbox (SMTP): SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, QUOTE_TO_EMAIL
       (QUOTE_FROM_EMAIL defaults to SMTP_USER)
    A2) Email via Resend:  RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL (a verified sender)
    B) Any webhook (Zapier, Make, a CRM): QUOTE_WEBHOOK_URL  — receives the request as JSON
  With neither set, the route answers 503 and the form tells the visitor to phone instead,
  so no enquiry is ever silently lost.

  Spam / abuse protection, in order (details in SECURITY.md):
    1. same-origin check (Origin / Sec-Fetch-Site)   → 403
    2. JSON only, body ≤ 16 KB                        → 415 / 413
    3. rate limit: 5 requests per IP per 10 minutes   → 429
    4. honeypot field + "filled in under 3 seconds"   → silently accepted, nothing sent
    5. Google reCAPTCHA v3 (RECAPTCHA_SECRET_KEY)     → 403 when the score is too low
    6. link-spam heuristics                           → silently accepted, nothing sent
    7. field validation                               → 422
*/

export const dynamic = "force-dynamic";
const MAX_BODY = 16 * 1024;
const MIN_FILL_MS = 3000;
const json = (data: object, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const arr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 20) : []);

function clean(body: Record<string, unknown>): QuoteRequest {
  return {
    ...emptyQuote,
    reports: arr(body.reports),
    address: str(body.address),
    lots: str(body.lots, 10),
    planNo: str(body.planNo, 50),
    managerName: str(body.managerName, 120),
    managerCompany: str(body.managerCompany, 120),
    instructions: str(body.instructions, 3000),
    name: str(body.name, 120),
    phone: str(body.phone, 30),
    email: str(body.email, 200),
    pref: arr(body.pref),
    website: str(body.website, 200),
    source: str(body.source, 100),
  };
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function asText(q: QuoteRequest) {
  return [
    `New quote request from the website (${q.source || "quote form"})`,
    "",
    `Reports: ${q.reports.join("; ")}`,
    `Property address: ${q.address}`,
    `Number of lots: ${q.lots || "-"}`,
    `Strata plan number: ${q.planNo || "-"}`,
    `Strata manager: ${q.managerName || "-"} (${q.managerCompany || "-"})`,
    `Special instructions: ${q.instructions || "-"}`,
    "",
    `Name: ${q.name}`,
    `Phone: ${q.phone}`,
    `Email: ${q.email || "-"}`,
    `Preference: ${q.pref.join(", ") || "-"}`,
  ].join("\n");
}

/** GET /api/quote/ : a quick health check showing what is switched on (true/false only, never any key). */
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

  // bot traps: the hidden honeypot field is filled, or the 3-step form was completed impossibly fast.
  // A real person's browser or password manager can fill a hidden field by mistake, so these are only dropped
  // when Google has not verified the visitor. A solved reCAPTCHA wins. Dropped bots are told "success" so they learn nothing.
  const elapsed = typeof body.elapsed === "number" ? body.elapsed : 0;
  const trapped = !!q.website || elapsed < MIN_FILL_MS;

  const captcha = await verifyRecaptcha(str(body.token, 4000), "quote", ip);
  if (!captcha.ok) {
    console.warn("[quote] reCAPTCHA rejected", captcha.reason, captcha.score ?? "");
    return json({ ok: false, error: "captcha_failed" }, 403);
  }
  if (trapped) {
    const verified = !captcha.skipped;
    console.warn(`[quote] bot trap hit (honeypot=${!!q.website}, elapsed=${elapsed}ms), reCAPTCHA verified=${verified}`);
    if (!verified) return json({ ok: true });
  }

  if (looksLikeSpam(q)) {
    const verified = !captcha.skipped;
    console.warn(`[quote] link-spam check hit, reCAPTCHA verified=${verified}`);
    if (!verified) return json({ ok: true });
  }

  console.info("[quote] received", JSON.stringify({ reports: q.reports.length, hasEmail: !!q.email, elapsed, captchaVerified: !captcha.skipped }));

  const errors = validateQuote(q);
  if (Object.keys(errors).length) return json({ ok: false, error: "invalid", errors }, 422);

  const { RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL, QUOTE_WEBHOOK_URL } = process.env;

  try {
    if (smtpConfigured()) {
      await sendViaSmtp({
        from: QUOTE_FROM_EMAIL || `Reserve Fund Plans <${(process.env.SMTP_USER || "").trim()}>`,
        // QUOTE_TO_EMAIL decides who receives enquiries (comma-separated). Only when it is empty does the website mailbox get them.
        to: [...new Set((QUOTE_TO_EMAIL || process.env.SMTP_USER || "").split(",").map((s) => s.trim()).filter(Boolean))],
        replyTo: q.email && EMAIL_RE.test(q.email) ? headerSafe(q.email) : undefined,
        subject: headerSafe(`Quote request: ${q.reports.length} report${q.reports.length === 1 ? "" : "s"}, ${q.name}`).slice(0, 200),
        text: asText(q),
        html: quoteEmailHtml(q),
      });
      return json({ ok: true });
    }
    if (RESEND_API_KEY && QUOTE_TO_EMAIL) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: QUOTE_FROM_EMAIL || "Reserve Fund Plans <onboarding@resend.dev>",
          to: QUOTE_TO_EMAIL.split(",").map((s) => s.trim()),
          reply_to: q.email && EMAIL_RE.test(q.email) ? headerSafe(q.email) : undefined,
          subject: headerSafe(`Quote request: ${q.reports.length} report${q.reports.length === 1 ? "" : "s"}, ${q.name}`).slice(0, 200),
          text: asText(q),
          html: quoteEmailHtml(q),
          attachments: [{ filename: "rfp-logo.png", content: EMAIL_LOGO_BASE64, content_id: EMAIL_LOGO_CID }],
        }),
        signal: AbortSignal.timeout(10000),
      });
      if (!r.ok) throw new Error(`resend ${r.status}`);
      return json({ ok: true });
    }
    if (QUOTE_WEBHOOK_URL) {
      const r = await fetch(QUOTE_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...q, website: undefined, text: asText(q), receivedAt: new Date().toISOString() }), signal: AbortSignal.timeout(10000) });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
      return json({ ok: true });
    }
  } catch (err) {
    console.error("[quote] delivery failed", err);
    return json({ ok: false, error: "delivery_failed" }, 502);
  }

  console.warn("[quote] no delivery configured (set SMTP_* + QUOTE_TO_EMAIL, or RESEND_API_KEY + QUOTE_TO_EMAIL, or QUOTE_WEBHOOK_URL)");
  return json({ ok: false, error: "not_configured" }, 503);
}
