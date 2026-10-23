import type { MetadataRoute } from "next";
import { abs, paths } from "@/lib/site";
import { testimonialPath, testimonials } from "@/lib/testimonials";

// Every indexable page at its exact trailing-slash URL. Bump LASTMOD when content changes.
const LASTMOD = new Date("2026-10-23");

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: string[] = [
    paths.home,
    paths.about,
    paths.services,
    paths.sfp,
    paths.biv,
    paths.whs,
    paths.asb,
    paths.faq,
    paths.faqSfp,
    paths.faqBiv,
    paths.faqWhs,
    paths.faqAsb,
    paths.testimonials,
    ...testimonials.map((t) => testimonialPath(t.slug)),
    paths.contact,
    paths.quote,
    paths.legal,
  ];
  return pages.map((p) => ({
    url: abs(p),
    lastModified: LASTMOD,
    changeFrequency: "monthly",
    priority: p === "/" ? 1 : p.startsWith("/services/") ? 0.9 : 0.6,
  }));
}
