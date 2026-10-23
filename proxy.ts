import { NextResponse, type NextRequest } from "next/server";

// Runs before every page request (not /api, not /_next).
//  1. reservefundplans.com.au (no www) → https://www.reservefundplans.com.au, one 301.
//  2. Adds the trailing slash with a single 301 (e.g. /about-us → /about-us/), like the old WordPress site.
//  3. Keeps every host except the production host out of search results with X-Robots-Tag: noindex.
//     Production (www.reservefundplans.com.au) never gets a noindex: scripts/check-indexing.mjs fails the build if it would.

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.reservefundplans.com.au").replace(/\/$/, "");
const PROD_HOST = new URL(SITE).host;
const APEX_HOST = PROD_HOST.replace(/^www\./, "");

/** A plain 301. (NextResponse.redirect normalises the URL and would strip the trailing slash.) */
/** Old WordPress test posts and their archives: removed on purpose, answered with 410 Gone (see docs/url-migration-map.csv). */
const GONE = new Set(["/blog/", "/2020/06/10/test-post/", "/2020/06/11/test-post-2/", "/category/uncategorized/", "/author/wdobrow/"]);

const moved = (location: string) => new NextResponse(null, { status: 301, headers: { Location: location } });

function guard(res: NextResponse, host: string) {
  if (host !== PROD_HOST) res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export function proxy(req: NextRequest) {
  const host = (req.headers.get("x-forwarded-host") || req.headers.get("host") || "").toLowerCase();
  const { pathname, search } = req.nextUrl;
  const last = pathname.slice(pathname.lastIndexOf("/") + 1);
  const slashed = !pathname.endsWith("/") && !last.includes(".") ? `${pathname}/` : pathname;

  if (host === APEX_HOST) return moved(`${SITE}${slashed}${search}`);

  if (GONE.has(slashed.toLowerCase())) {
    const res = new NextResponse("410 Gone: this page has been removed.", { status: 410, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    res.headers.set("X-Robots-Tag", "noindex");
    return res;
  }

  if (slashed !== pathname) {
    const proto = req.headers.get("x-forwarded-proto") || req.nextUrl.protocol.replace(":", "");
    return guard(moved(`${proto}://${host}${slashed}${search}`), host);
  }
  return guard(NextResponse.next(), host);
}

export const config = {
  matcher: ["/((?!api/|_next/|_vercel/).*)"],
};
