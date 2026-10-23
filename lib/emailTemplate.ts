import { wantsAsbestos, wantsPlan, type QuoteRequest } from "@/lib/quote";

/* The enquiry email sent to the business. Email clients ignore most CSS, so this uses tables and inline styles.
   Every value from the form is HTML-escaped. */
const C = { page: "#efebe2", card: "#fbfaf6", panel: "#f2eee5", brand: "#1f4a40", accent: "#b5562e", ink: "#1b201e", mute: "#69706b", line: "#ddd6c8" };
const FONT = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const val = (s: string) => (s && s.trim() ? esc(s.trim()).replace(/\n/g, "<br>") : `<span style="color:${C.mute}">—</span>`);

const row = (label: string, value: string) => `<tr>
  <td style="padding:3px 0;width:34%;vertical-align:top;font:600 11px/1.5 ${FONT};letter-spacing:.04em;text-transform:uppercase;color:${C.mute}">${label}</td>
  <td style="padding:3px 0;vertical-align:top;font:15px/1.5 ${FONT};color:${C.ink}">${value}</td>
</tr>`;

const panel = (title: string, rows: string) => `<tr><td style="padding:0 24px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.panel};border-radius:6px">
    <tr><td style="padding:12px 16px 4px;font:700 11px/1 ${FONT};letter-spacing:.14em;text-transform:uppercase;color:${C.brand}">${title}</td></tr>
    <tr><td style="padding:4px 16px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>
  </table>
</td></tr>`;

/** Plain-text version (always sent alongside the HTML). */
export function quoteEmailText(q: QuoteRequest) {
  const lines = [
    "New quote request from reservefundplans.com.au",
    "",
    `Services: ${q.services.join("; ")}`,
    "",
    `Scheme / property name: ${q.schemeName || "-"}`,
    `Address: ${q.address}, ${q.suburb} ${q.state}`,
    `Property type: ${q.propertyType || "-"}`,
    `Number of lots: ${q.lots || "-"}`,
    `Strata plan number: ${q.planNo || "-"}`,
    ...(wantsPlan(q) ? [`Existing plan in place: ${q.existingPlan || "-"}`] : []),
    ...(wantsAsbestos(q) ? [`Built before 2004: ${q.builtBefore2004 || "-"}`] : []),
    "",
    `Name: ${q.name}`,
    `Organisation: ${q.organisation || "-"}`,
    `Role: ${q.role || "-"}`,
    `Email: ${q.email}`,
    `Phone: ${q.phone}`,
    `Preferred reply: ${q.preference}`,
    "",
    `Timing: ${q.timing || "-"}`,
    `Details: ${q.message || "-"}`,
  ];
  return lines.join("\n");
}

export function quoteEmailHtml(q: QuoteRequest, receivedAt = new Date()) {
  const when = new Intl.DateTimeFormat("en-AU", { dateStyle: "medium", timeStyle: "short", timeZone: "Australia/Perth" }).format(receivedAt);
  const tel = q.phone.replace(/[^\d+]/g, "");
  const first = esc(q.name.trim().split(/\s+/)[0] || "customer");
  const chips = q.services
    .map((s) => `<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 10px;border-radius:4px;background:${C.card};border:1px solid ${C.line};color:${C.ink};font:600 12px/1.3 ${FONT}">${esc(s)}</span>`)
    .join("");

  const property = [
    row("Scheme", val(q.schemeName)),
    row("Address", `${val(q.address)}<br>${val(`${q.suburb} ${q.state}`)}`),
    row("Type", val(q.propertyType)),
    row("Lots", val(q.lots)),
    row("Plan no.", val(q.planNo)),
    ...(wantsPlan(q) ? [row("Existing plan", val(q.existingPlan))] : []),
    ...(wantsAsbestos(q) ? [row("Built pre-2004", val(q.builtBefore2004))] : []),
  ].join("");
  const contact = [
    row("Name", val(q.name)),
    row("Organisation", val(q.organisation)),
    row("Role", val(q.role)),
    row("Email", `<a href="mailto:${esc(q.email)}" style="color:${C.brand}">${esc(q.email)}</a>`),
    row("Phone", `<a href="tel:${esc(tel)}" style="color:${C.brand}">${esc(q.phone)}</a>`),
    row("Reply by", val(q.preference)),
  ].join("");
  const extra = [row("Timing", val(q.timing)), row("Details", val(q.message))].join("");

  return `<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Quote request</title></head>
<body style="margin:0;padding:0;background:${C.page}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page}"><tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.card};border:1px solid ${C.line};border-radius:8px">
    <tr><td style="padding:22px 24px 6px;border-top:4px solid ${C.accent};border-radius:8px 8px 0 0">
      <div style="font:600 20px/1.2 ${SERIF};color:${C.brand}">Reserve Fund Plans</div>
      <div style="margin-top:4px;font:12px/1.4 ${FONT};color:${C.mute}">Website quote request · ${esc(when)} (Perth time)</div>
    </td></tr>
    <tr><td style="padding:14px 24px 8px;font:600 22px/1.3 ${SERIF};color:${C.ink}">${esc(q.name)} would like a quote</td></tr>
    <tr><td style="padding:0 24px 14px">${chips}</td></tr>
    ${panel("Property", property)}
    ${panel("Contact", contact)}
    ${panel("Additional information", extra)}
    <tr><td style="padding:6px 24px 24px">
      <a href="mailto:${esc(q.email)}" style="display:inline-block;margin-right:8px;padding:10px 18px;border-radius:4px;background:${C.brand};color:#ffffff;text-decoration:none;font:700 13px/1 ${FONT}">Reply to ${first}</a>
      <a href="tel:${esc(tel)}" style="display:inline-block;padding:9px 16px;border-radius:4px;border:1.5px solid ${C.brand};color:${C.brand};text-decoration:none;font:700 13px/1 ${FONT}">Call ${esc(q.phone)}</a>
    </td></tr>
  </table>
  <p style="margin:12px 0 0;font:11px/1.4 ${FONT};color:${C.mute}">Sent by the quote form on reservefundplans.com.au. Replying goes to the customer.</p>
</td></tr></table>
</body></html>`;
}
