import "server-only";
import nodemailer from "nodemailer";

/* Sends the enquiry email through the business mailbox (SMTP). Settings come from server environment variables:
   SMTP_HOST, SMTP_PORT (465 or 587), SMTP_USER, SMTP_PASS. Nothing here is ever sent to the browser. */
export const smtpConfigured = () => !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

export type Mail = { to: string[]; from: string; replyTo?: string; subject: string; text: string; html: string };

export async function sendViaSmtp(m: Mail) {
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: (process.env.SMTP_HOST || "").trim(),
    port,
    secure: port === 465, // 465 = SSL from the start; 587 = STARTTLS
    auth: { user: (process.env.SMTP_USER || "").trim(), pass: process.env.SMTP_PASS || "" },
    // local test server only (scripts/verify-site.mjs): allow its self-signed certificate
    ...(process.env.SMTP_ALLOW_SELF_SIGNED === "1" ? { tls: { rejectUnauthorized: false } } : {}),
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
  const info = await transport.sendMail({ from: m.from, to: m.to, replyTo: m.replyTo, subject: m.subject, text: m.text, html: m.html });
  // privacy-conscious log: counts and server response only, no names, emails or message content
  console.info("[quote] smtp", JSON.stringify({ accepted: info.accepted?.length ?? 0, rejected: info.rejected?.length ?? 0, response: String(info.response).slice(0, 80) }));
  if (!info.accepted?.length) throw new Error("smtp: no recipient accepted the message");
}
