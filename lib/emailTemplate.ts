import { abs } from "@/lib/site";
import { EMAIL_LOGO_CID } from "@/lib/emailLogo";
import type { QuoteRequest } from "@/lib/quote";

/* The enquiry email: light grey surfaces, dark text, brand blue only for links and buttons. Compact on purpose.
   Email clients ignore most CSS, so this uses nested tables and inline styles only. */
const C = { page: "#e6e9ef", card: "#f3f4f7", panel: "#e8ebf0", band: "#dde1e9", brand: "#4058a0", ink: "#141722", graphite: "#4a4f5e", mute: "#626879", line: "#d5dae3" };
const FONT = "'Plus Jakarta Sans',-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const dash = (s: string) => (s && s.trim() ? esc(s.trim()) : `<span style="color:${C.mute}">—</span>`);

const row = (label: string, value: string) => `<tr>
  <td style="padding:1px 0;width:28%;vertical-align:top;font:600 10px/1.6 ${FONT};letter-spacing:.06em;text-transform:uppercase;color:${C.mute}">${label}</td>
  <td style="padding:1px 0;vertical-align:top;font:500 13px/1.4 ${FONT};color:${C.ink}">${value}</td>
</tr>`;

const panel = (title: string, rows: string) => `<tr><td style="padding:0 20px 6px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.panel};border-radius:8px">
    <tr><td style="padding:7px 12px 1px;font:700 10px/1 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${C.brand}">${title}</td></tr>
    <tr><td style="padding:1px 12px 6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>
  </table>
</td></tr>`;

/** logoSrc defaults to the embedded (cid) logo that the sender attaches to the email. */
export function quoteEmailHtml(q: QuoteRequest, logoSrc = `cid:${EMAIL_LOGO_CID}`) {
  const when = new Intl.DateTimeFormat("en-AU", { dateStyle: "medium", timeStyle: "short", timeZone: "Australia/Perth" }).format(new Date());
  const tel = q.phone.replace(/[^\d+]/g, "");
  const hasEmail = !!q.email;
  const reports = q.reports
    .map((r) => `<span style="display:inline-block;margin:0 4px 4px 0;padding:3px 9px;border-radius:999px;background:${C.panel};color:${C.ink};font:600 11px/1.2 ${FONT}">${esc(r)}</span>`)
    .join("");
  const manager = [q.managerName, q.managerCompany].filter((s) => s && s.trim()).map(esc).join(" · ");
  const first = esc(q.name.split(" ")[0] || "customer");

  const buttons = `<table role="presentation" cellpadding="0" cellspacing="0"><tr>
    ${hasEmail ? `<td style="padding-right:8px"><a href="mailto:${esc(q.email)}" style="display:inline-block;padding:8px 16px;border-radius:999px;background:${C.brand};color:#ffffff;text-decoration:none;font:700 12px/1 ${FONT}">Reply to ${first}</a></td>` : ""}
    <td><a href="tel:${esc(tel)}" style="display:inline-block;padding:7px 14px;border-radius:999px;border:1.5px solid ${C.brand};color:${C.brand};text-decoration:none;font:700 12px/1 ${FONT}">Call ${esc(q.phone)}</a></td>
  </tr></table>`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>New quote request</title></head>
<body style="margin:0;padding:0;background:${C.page}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(q.name)} · ${esc(q.phone)} · ${esc(q.address)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page}"><tr><td align="center" style="padding:10px 8px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.card};border-radius:14px;overflow:hidden;border:1px solid ${C.line}">

  <tr><td style="background:${C.band};padding:9px 20px;border-bottom:1px solid ${C.line}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><img src="${logoSrc}" width="80" height="31" alt="Reserve Fund Plans" style="display:block;border:0;height:auto"></td>
      <td align="right" style="font:500 12px/1.4 ${FONT};color:${C.mute}">${esc(when)}</td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:10px 20px 6px">
    <h1 style="margin:0;font:800 19px/1.2 ${FONT};letter-spacing:-.01em;color:${C.ink}">Quote request from ${esc(q.name)}</h1>
  </td></tr>

  <tr><td style="padding:0 20px 3px">${reports}</td></tr>

  ${panel(
    "Contact",
    row("Phone", q.phone ? `<a href="tel:${esc(tel)}" style="color:${C.brand};text-decoration:none;font-weight:700">${esc(q.phone)}</a>` : dash("")) +
      row("Email", hasEmail ? `<a href="mailto:${esc(q.email)}" style="color:${C.brand};text-decoration:none;font-weight:700">${esc(q.email)}</a>` : dash("")) +
      row("Prefers", dash(q.pref.join(", ")))
  )}
  ${panel("Property", row("Address", dash(q.address)) + row("Lots", dash(q.lots)) + row("Strata plan", dash(q.planNo)) + row("Manager", manager || dash("")))}
  ${q.instructions && q.instructions.trim() ? panel("Special instructions", `<tr><td style="padding:1px 0;font:500 13px/1.4 ${FONT};color:${C.graphite};white-space:pre-wrap">${esc(q.instructions.trim())}</td></tr>`) : ""}

  <tr><td style="padding:2px 20px 10px">${buttons}</td></tr>

  <tr><td style="background:${C.band};padding:7px 20px;border-top:1px solid ${C.line};font:500 10px/1.5 ${FONT};color:${C.mute}">Sent from the quote form at <a href="${abs("/")}" style="color:${C.graphite};text-decoration:none;font-weight:700">${abs("/").replace(/^https?:\/\//, "").replace(/\/$/, "")}</a> · Reply to answer the customer directly.</td></tr>

</table></td></tr></table>
</body></html>`;
}
