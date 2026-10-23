import type { Metadata } from "next";
import { abs, org, SITE_NAME } from "./site";
import type { Faq, Service, Block } from "./services";

export const OG_IMAGE = { url: "/og-image.png", width: 1200, height: 630, alt: "Reserve Fund Plans: strata compliance and valuation reports, Western Australia" };

/** Title, description, self-canonical, Open Graph and Twitter tags for one page. */
export function pageMeta({ path, title, description, type = "website" }: { path: string; title: string; description: string; type?: "website" | "article" }): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: abs(path) },
    openGraph: { title, description, url: abs(path), type, siteName: SITE_NAME, locale: "en_AU", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}

const ORG_ID = `${abs("/")}#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: org.name,
    legalName: org.legalName,
    url: abs("/"),
    logo: abs("/logo.png"),
    image: abs("/og-image.png"),
    telephone: org.phoneIntl,
    foundingDate: org.foundingDate,
    address: { "@type": "PostalAddress", streetAddress: org.address.street, addressLocality: org.address.locality, addressRegion: org.address.region, postalCode: org.address.postcode, addressCountry: "AU" },
    areaServed: { "@type": "State", name: "Western Australia" },
    ...(org.abn ? { taxID: org.abn } : {}),
  };
}

export function websiteSchema() {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": `${abs("/")}#website`, url: abs("/"), name: SITE_NAME, inLanguage: "en-AU", publisher: { "@id": ORG_ID } };
}

export function webPageSchema(path: string, name: string, description: string) {
  return { "@context": "https://schema.org", "@type": "WebPage", "@id": `${abs(path)}#webpage`, url: abs(path), name, description, inLanguage: "en-AU", isPartOf: { "@id": `${abs("/")}#website` } };
}

export function serviceSchema(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.name,
    description: s.description,
    url: abs(s.path),
    provider: { "@type": "ProfessionalService", "@id": ORG_ID, name: org.name, url: abs("/") },
    areaServed: { "@type": "State", name: "Western Australia" },
  };
}

const plain = (b: Block): string =>
  typeof b === "string"
    ? b.replace(/<[^>]+>/g, "")
    : "list" in b
      ? b.list.map((l) => `• ${l}`).join("\n")
      : "table" in b
        ? b.table.map(([a, c]) => `${a}: ${c}`).join("\n")
        : b.note;

export const faqAnswerText = (f: Faq) => f.a.map(plain).join("\n");

/** FAQPage markup is kept because the questions are visible on the page; Google shows FAQ rich results only for some sites. */
export function faqSchema(faqs: Faq[]) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: faqAnswerText(f) } })) };
}

export function breadcrumbSchema(crumbs: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
  };
}
