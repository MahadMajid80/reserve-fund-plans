import type { MetadataRoute } from "next";
import { paths, abs } from "@/lib/site";
import { allTestimonials, testimonialPath } from "@/lib/testimonials";

// Every indexable page, at its exact trailing-slash URL.
// LASTMOD: bump when content changes (one date for the launch).
const LASTMOD = new Date("2026-10-23");

export default function sitemap(): MetadataRoute.Sitemap {
  const main = [
    paths.home,
    paths.about,
    paths.services,
    paths.biv,
    paths.whs,
    paths.sfp,
    paths.asb,
    paths.faqBiv,
    paths.faqWhs,
    paths.faqSfp,
    paths.faqAsb,
    paths.testimonials,
    ...allTestimonials.map((t) => testimonialPath(t.slug)),
    paths.contact,
    paths.quote,
    paths.legal,
    paths.faq,
  ];
  return main.map((p) => ({
    url: abs(p),
    lastModified: LASTMOD,
    changeFrequency: "monthly",
    priority: p === "/" ? 1 : p.startsWith("/services/") ? 0.9 : 0.7,
  }));
}
