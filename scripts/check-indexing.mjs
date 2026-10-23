// Fails the build if production could be kept out of Google.
// Runs automatically after `npm run build` (the "postbuild" script).
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.reservefundplans.com.au").replace(/\/$/, "");
const errors = [];

if (site !== "https://www.reservefundplans.com.au") console.warn(`[check-indexing] NOTE: SITE_URL is ${site}`);

// 1. no page HTML has a robots noindex meta (the 404 page is allowed to)
// Where Next leaves the pre-rendered HTML depends on the build host (on Vercel it is moved into
// .vercel/output), so search all known places. If none is found, fall back to checking the source.
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const root = ".next/server/app";
const roots = [root, ".next/server/pages", ".vercel/output/static", ".vercel/output/functions"].filter(existsSync);
const html = roots.flatMap(walk).filter((f) => f.endsWith(".html") && !/_not-found|_global-error|\/404|\/500/.test(f));
for (const f of html) {
  const s = readFileSync(f, "utf8");
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(s)) errors.push(`noindex meta in ${f}`);
  if (!/<link rel="canonical" href="https:\/\/www\.reservefundplans\.com\.au\//.test(s) && site === "https://www.reservefundplans.com.au") errors.push(`missing or wrong canonical in ${f}`);
}
// source check (always runs): no page or layout sets index: false / noindex
const srcFiles = walk("app").filter((f) => /\.(tsx?|mjs)$/.test(f) && !/not-found/.test(f));
for (const f of [...srcFiles, "lib/seo.ts"]) {
  const s = readFileSync(f, "utf8");
  if (/index:\s*false|["'`][^"'`\n]*noindex/i.test(s)) errors.push(`${f} sets noindex`);
}
if (!/robots:\s*\{\s*index:\s*true/.test(readFileSync("app/layout.tsx", "utf8"))) errors.push("app/layout.tsx no longer sets robots index: true");

// 2. robots.txt allows everything
// The pre-rendered robots.txt lives in a different place depending on where Next builds
// (a file locally, a directory on Vercel), so look for any file named robots.txt*, and fall back to the source.
const isFile = (f) => existsSync(f) && statSync(f).isFile();
const robotsFiles = existsSync(".next") ? walk(".next").filter((f) => /robots\.txt(\.body)?$/.test(f) && isFile(f)) : [];
const robotsText = robotsFiles.length ? readFileSync(robotsFiles[0], "utf8") : null;
const robotsSrc = readFileSync("app/robots.ts", "utf8");
if (robotsText) {
  if (/^\s*disallow:\s*\/\s*$/im.test(robotsText)) errors.push("robots.txt contains 'Disallow: /'");
  if (!/sitemap:\s*https:\/\/www\.reservefundplans\.com\.au\/sitemap\.xml/i.test(robotsText) && site === "https://www.reservefundplans.com.au") errors.push("robots.txt is missing the sitemap line");
} else {
  if (/disallow/i.test(robotsSrc)) errors.push("app/robots.ts contains a disallow rule");
  if (!/allow:\s*"\/"/.test(robotsSrc)) errors.push("app/robots.ts does not allow '/'");
}

// 3. the only X-Robots-Tag in the code is the preview-host guard in proxy.ts
const proxy = readFileSync("proxy.ts", "utf8");
if (!/if \(host !== PROD_HOST\) res\.headers\.set\("X-Robots-Tag"/.test(proxy)) errors.push("proxy.ts noindex guard changed: make sure production is never noindexed");
const cfg = readFileSync("next.config.mjs", "utf8");
if (/x-robots-tag/i.test(cfg)) errors.push("next.config.mjs sets X-Robots-Tag");

if (errors.length) {
  console.error("\n✖ Indexing check failed:\n  - " + errors.join("\n  - ") + "\n");
  process.exit(1);
}
console.log(`✔ Indexing check passed (${html.length ? `${html.length} pre-rendered pages` : "source files"}: no noindex, canonicals present, robots.txt allows all)`);
