import nodemailer from "nodemailer";
import { EMAIL_LOGO_BASE64, EMAIL_LOGO_CID } from "@/lib/emailLogo";

/* Sends the quote email through the business mailbox (SMTP). Settings come from Vercel environment variables:
   SMTP_HOST, SMTP_PORT (465 or 587), SMTP_USER (e.g. a website@ mailbox), SMTP_PASS (the mailbox password). */
export const smtpConfigured = () => !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

export async function sendViaSmtp(m: { to: string[]; from: string; replyTo?: string; subject: string; text: string; html: string }) {
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: (process.env.SMTP_HOST || "").trim(),
    port,
    secure: port === 465, // 465 = SSL from the start; 587 = STARTTLS
    auth: { user: (process.env.SMTP_USER || "").trim(), pass: process.env.SMTP_PASS || "" },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
  const info = await transport.sendMail({ from: m.from, to: m.to, replyTo: m.replyTo, subject: m.subject, text: m.text, html: m.html,
    attachments: [{ filename: "rfp-logo.png", content: Buffer.from(EMAIL_LOGO_BASE64, "base64"), cid: EMAIL_LOGO_CID, contentType: "image/png", contentDisposition: "inline" }],
  });
  // visible in Vercel logs: which recipients the mail server accepted or refused, and its reply
  console.info("[quote] smtp", JSON.stringify({ accepted: info.accepted, rejected: info.rejected, response: String(info.response).slice(0, 160), messageId: info.messageId }));
  if (!info.accepted?.length) throw new Error("smtp: no recipient accepted the message");
}
