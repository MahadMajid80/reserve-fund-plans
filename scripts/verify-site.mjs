// End-to-end checks against a production build. Run `npm run build` first, then `npm run test:site`.
//
// It starts `next start` twice on local ports:
//   A) with SMTP pointed at an in-process test mail server, to prove a quote request is really emailed
//   B) with SMTP pointed at a closed port, to prove a delivery failure is reported (502) and nothing is lost silently
// and then checks every legacy URL, redirect, 410, canonical, title, H1, sitemap, robots.txt and security header.
//
// Usage: node scripts/verify-site.mjs            (exit code 1 if anything fails)
//        BASE=https://staging.example node scripts/verify-site.mjs --remote   (URL/SEO checks only, against a deployment)
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { SMTPServer } from "smtp-server";
import { simpleParser } from "mailparser";

const REMOTE = process.argv.includes("--remote");
const PROD = "https://www.reservefundplans.com.au";
const results = [];
const ok = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "✔" : "✖"} ${name}${detail ? `  (${detail})` : ""}`);
};

/* ── the URL inventory (docs/url-migration-map.csv is the source of truth) ── */
const csv = readFileSync(new URL("../docs/url-migration-map.csv", import.meta.url), "utf8").trim().split("\n").slice(1);
const rows = csv.map((l) => {
  const c = l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((x) => x.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"'));
  return { original: c[0], next: c[1], expected: Number(c[3]), redirect: c[4], canonical: c[5] };
});
const pathOf = (u) => new URL(u).pathname;

/* ── helpers ── */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function start(port, env) {
  const p = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], { env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", ...env }, stdio: ["ignore", "pipe", "pipe"] });
  p.stdout.on("data", () => {});
  p.stderr.on("data", () => {});
  return p;
}
async function waitFor(base) {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base + "/robots.txt")).ok) return;
    } catch {}
    await sleep(500);
  }
  throw new Error(`server at ${base} did not start`);
}
let ipCounter = 10;
const post = (base, body, extra = {}) =>
  fetch(base + "/api/quote/", {
    method: "POST",
    headers: { "content-type": "application/json", origin: base, "sec-fetch-site": "same-origin", "x-forwarded-for": `10.0.0.${ipCounter++}`, ...extra },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
const goodQuote = {
  reports: ["10 Year Reserve Fund Plan (WA)", "Asbestos Report (Register + Management Plan)"],
  address: "1 Test Street, Applecross WA 6153",
  lots: "12",
  planNo: "SP 12345",
  managerName: "Pat Manager",
  managerCompany: "QA Strata",
  instructions: "Automated end-to-end test <b>with markup</b>.",
  name: "Verify Script",
  phone: "0400 123 456",
  email: "qa@example.com.au",
  pref: ["Email back"],
  website: "",
  source: "verify-site",
  elapsed: 30000,
};

/* ── URL and SEO checks ── */
async function urlChecks(base) {
  for (const r of rows) {
    const path = pathOf(r.original);
    const res = await fetch(base + path, { redirect: "manual" });
    if (r.expected === 301) {
      const loc = res.headers.get("location") || "";
      const want = pathOf(r.redirect);
      ok(`301 ${path}`, res.status === 301 && pathOf(new URL(loc, base).href) === want, `${res.status} → ${loc}`);
      // the destination must answer 200 directly (no chains)
      const d = await fetch(new URL(loc, base).href, { redirect: "manual" });
      ok(`  destination ${want} is 200 (no chain)`, d.status === 200, String(d.status));
    } else if (r.expected === 410) {
      ok(`410 ${path}`, res.status === 410, String(res.status));
    } else {
      const html = await res.text();
      ok(`200 ${path}`, res.status === 200, String(res.status));
      if (!(res.headers.get("content-type") || "").includes("text/html")) continue;
      const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
      ok(`  canonical ${path}`, canon === r.canonical, canon || "missing");
      const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;
      ok(`  one H1 ${path}`, h1s === 1, String(h1s));
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
      ok(`  title ${path}`, title.length >= 15 && title.length <= 70, `${title.length}: ${title}`);
      const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
      ok(`  description ${path}`, desc.length >= 70 && desc.length <= 170, String(desc.length));
      ok(`  no noindex meta ${path}`, !/<meta name="robots" content="[^"]*noindex/.test(html));
      for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        try {
          JSON.parse(m[1]);
        } catch {
          ok(`  JSON-LD parses ${path}`, false);
        }
      }
    }
  }
  // trailing slash: one 301 hop
  const ns = await fetch(base + "/services/sfp", { redirect: "manual" });
  ok("missing slash → single 301", ns.status === 301 && (ns.headers.get("location") || "").endsWith("/services/sfp/"), `${ns.status} ${ns.headers.get("location")}`);
  // query strings survive the slash redirect
  const qs = await fetch(base + "/quote-request?service=sfp", { redirect: "manual" });
  ok("query string kept on slash redirect", (qs.headers.get("location") || "").endsWith("/quote-request/?service=sfp"), qs.headers.get("location") || "");
  // 404
  const nf = await fetch(base + "/no-such-page/", { redirect: "manual" });
  ok("unknown URL → 404", nf.status === 404, String(nf.status));
  // sitemap and robots
  const sm = await (await fetch(base + "/sitemap.xml")).text();
  const smUrls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const indexable = rows.filter((r) => r.expected === 200 && r.canonical).map((r) => r.canonical);
  ok("sitemap lists every indexable page", indexable.every((u) => smUrls.includes(u)), `${smUrls.length} URLs`);
  ok("sitemap has no redirected or removed URLs", smUrls.every((u) => indexable.includes(u)));
  const rb = await (await fetch(base + "/robots.txt")).text();
  ok("robots.txt allows crawling and lists the sitemap", /Allow: \//.test(rb) && !/Disallow: \/\s*$/m.test(rb) && rb.includes(`${PROD}/sitemap.xml`));
  // security headers
  const h = (await fetch(base + "/")).headers;
  for (const k of ["content-security-policy", "strict-transport-security", "x-content-type-options", "x-frame-options", "referrer-policy", "permissions-policy"]) ok(`header ${k}`, !!h.get(k));
  ok("no X-Powered-By", !h.get("x-powered-by"));
}

/* ── form API checks ── */
async function formChecks(base, inbox) {
  const r1 = await post(base, goodQuote);
  const d1 = await r1.json();
  await sleep(300);
  ok("valid quote → 200 ok", r1.status === 200 && d1.ok === true, `${r1.status} ${JSON.stringify(d1)}`);
  const mail = inbox.at(-1) || "";
  ok("email delivered to QUOTE_TO_EMAIL", inbox.length === 1 && /To: .*enquiries@test\.local/i.test(mail));
  ok("email Reply-To is the customer", /Reply-To: qa@example\.com\.au/i.test(mail));
  const parsed = await simpleParser(mail);
  ok("email contains the reports and property", parsed.text.includes("1 Test Street") && parsed.text.includes("10 Year Reserve Fund Plan (WA)") && parsed.text.includes("SP 12345"));
  ok("visitor markup is escaped in the email", !String(parsed.html).includes("<b>with markup</b>") && String(parsed.html).includes("&lt;b&gt;with markup"));
  ok("email carries the embedded Reserve Fund Plans logo", (parsed.attachments || []).some((a) => a.cid === "rfp-logo"));
  ok("email subject names the customer", /Verify Script/.test(parsed.subject || ""), parsed.subject);

  const before = inbox.length;
  const r2 = await post(base, { ...goodQuote, email: "bad", phone: "" });
  const d2 = await r2.json();
  ok("invalid input → 422 with field errors", r2.status === 422 && d2.errors?.email && d2.errors?.phone, JSON.stringify(d2.errors));
  const r3 = await post(base, { ...goodQuote, reports: [] });
  ok("missing report → 422", r3.status === 422);
  const r4 = await post(base, { ...goodQuote, website: "http://spam.example" });
  ok("honeypot filled → told ok, nothing sent", r4.status === 200);
  const r5 = await post(base, { ...goodQuote, elapsed: 500 });
  ok("submitted too fast → told ok, nothing sent", r5.status === 200);
  const r6 = await post(base, { ...goodQuote, name: "Buy now https://spam.example" });
  ok("link spam → told ok, nothing sent", r6.status === 200);
  await sleep(300);
  ok("no email sent for bot/spam/invalid requests", inbox.length === before, `${inbox.length - before} extra`);
  const r7 = await post(base, goodQuote, { origin: "https://evil.example", "sec-fetch-site": "cross-site" });
  ok("cross-site post → 403", r7.status === 403);
  const r8 = await fetch(base + "/api/quote/", { method: "POST", headers: { "content-type": "text/plain", origin: base }, body: "x" });
  ok("non-JSON → 415", r8.status === 415);
  const r9 = await post(base, JSON.stringify({ ...goodQuote, message: "x".repeat(20000) }));
  ok("oversized body → 413", r9.status === 413);
  const r10 = await post(base, "{not json");
  ok("malformed JSON → 400", r10.status === 400);
  const ip = { "x-forwarded-for": "10.9.9.9" };
  const codes = [];
  for (let i = 0; i < 6; i++) codes.push((await post(base, { ...goodQuote, reports: [] }, ip)).status);
  ok("6th request in 10 minutes → 429", codes[5] === 429 && codes.slice(0, 5).every((c) => c === 422), codes.join(","));
  const r11 = await post(base, { ...goodQuote, to: "victim@example.com", bcc: "x@y.z", email: "a@b.com\r\nBcc: victim@example.com" });
  ok("header injection / extra recipients rejected", r11.status === 422 && inbox.every((m) => !/victim@example\.com/i.test(m.split("\r\n\r\n")[0])));
  const g = await (await fetch(base + "/api/quote/")).json();
  ok("health check exposes no secrets", !/pass|key"\s*:\s*"[^"]{8,}/i.test(JSON.stringify(g)), JSON.stringify(g));
}

async function main() {
  if (REMOTE) {
    await urlChecks(process.env.BASE);
  } else {
    // A) working mail server
    const inbox = [];
    const smtp = new SMTPServer({
      authOptional: true,
      disabledCommands: ["STARTTLS"],
      onAuth: (_a, _s, cb) => cb(null, { user: "test" }),
      onData(stream, _s, cb) {
        let d = "";
        stream.on("data", (c) => (d += c));
        stream.on("end", () => {
          inbox.push(d);
          cb();
        });
      },
    });
    await new Promise((r) => smtp.listen(2526, "127.0.0.1", r));
    const env = { SMTP_HOST: "127.0.0.1", SMTP_PORT: "2526", SMTP_USER: "website@test.local", SMTP_PASS: "test", QUOTE_TO_EMAIL: "enquiries@test.local"};
    const a = start(3201, env);
    const b = start(3202, { ...env, SMTP_PORT: "2599" }); // nothing listens on 2599
    try {
      await waitFor("http://localhost:3201");
      await waitFor("http://localhost:3202");
      await urlChecks("http://localhost:3201");
      await formChecks("http://localhost:3201", inbox);
      const f = await post("http://localhost:3202", goodQuote);
      ok("mail server down → 502 delivery_failed (visitor told to retry or call)", f.status === 502 && (await f.json()).error === "delivery_failed");
      const pv = await fetch("http://localhost:3201/", { redirect: "manual" });
      ok("non-production host gets X-Robots-Tag: noindex", /noindex/.test(pv.headers.get("x-robots-tag") || ""));
    } finally {
      a.kill();
      b.kill();
      smtp.close();
    }
  }
  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    console.log("Failed:\n" + failed.map((f) => `  ✖ ${f.name} ${f.detail}`).join("\n"));
    process.exit(1);
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
