import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Production robots.txt: everything allowed. (Preview hosts are kept out of Google with an X-Robots-Tag header in proxy.ts.)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
