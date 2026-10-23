import { NextResponse, type NextRequest } from "next/server";

// Runs before every page request (not /api, not /_next).
//  1. reservefundplans.com.au (no www) → https://www.reservefundplans.com.au, one 301.
//  2. Removed WordPress test content answers 410 Gone (it was never real content, so no redirect).
//  3. Adds the trailing slash with a single 301 (/about-us → /about-us/), like the old WordPress site.
//  4. Every host except production gets X-Robots-Tag: noindex, so previews stay out of Google.
//     scripts/check-indexing.mjs fails the build if production could ever be noindexed.

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.reservefundplans.com.au").replace(/\/$/, "");
const PROD_HOST = new URL(SITE).host;
const APEX_HOST = PROD_HOST.replace(/^www\./, "");

/** Old WordPress test posts and their archives: removed on purpose (see docs/url-migration-map.csv). */
export const GONE = new Set(["/blog/", "/2020/06/10/test-post/", "/2020/06/11/test-post-2/", "/category/uncategorized/", "/author/wdobrow/"]);

/** A plain 301. (NextResponse.redirect normalises the URL and would strip the trailing slash.) */
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
