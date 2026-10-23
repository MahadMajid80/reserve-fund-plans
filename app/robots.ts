import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Production robots.txt: everything allowed except the form API. Preview hosts are kept out of Google by the
// X-Robots-Tag header that proxy.ts adds.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
