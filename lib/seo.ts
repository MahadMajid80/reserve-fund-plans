import type { Metadata } from "next";
import { abs, org, paths, SITE_NAME } from "./site";
import type { Faq, Service } from "./services";

export const OG_IMAGE = { url: "/og-image.png", width: 1200, height: 630, alt: "Reserve Fund Plans: 10 year reserve fund plans and strata reports, Western Australia" };

/** Title, description, self-canonical, Open Graph and Twitter tags for one page. */
export function pageMeta({ path, title, description, type = "website" }: { path: string; title: string; description: string; type?: "website" | "article" }): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: abs(path) },
    openGraph: {
      title,
      description,
      url: abs(path),
      type,
      siteName: SITE_NAME,
      locale: "en_AU",
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}

/* ───────── JSON-LD ───────── */

const ORG_ID = `${abs("/")}#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: org.name,
    legalName: org.legalName,
    url: abs("/"),
    logo: abs("/rfp-logo.png"),
    image: abs("/og-image.png"),
    telephone: org.phoneIntl,
    // no "email": keeping the address out of the HTML protects it from scrapers (phone is the main contact)
    foundingDate: org.foundingDate,
    areaServed: org.areaServed.map((n) => ({ "@type": "State", name: n })),
    ...(org.address
      ? { address: { "@type": "PostalAddress", streetAddress: org.address.street, addressLocality: org.address.locality, addressRegion: org.address.region, postalCode: org.address.postcode, addressCountry: "AU" } }
      : {}),
    ...(org.abn ? { taxID: org.abn } : {}),
  };
}

const providerRef = { "@type": "ProfessionalService", "@id": ORG_ID, name: org.name, url: abs("/") };

export function serviceSchema(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.name,
    description: s.description,
    url: abs(s.path),
    provider: providerRef,
    areaServed: { "@type": "State", name: "Western Australia" },
    ...(s.offer
      ? {
          offers: {
            "@type": "Offer",
            description: s.offer.description,
            priceSpecification: { "@type": "PriceSpecification", minPrice: s.offer.price, price: s.offer.price, priceCurrency: "AUD", valueAddedTaxIncluded: true },
          },
        }
      : {}),
  };
}

/** Plain-text version of an answer, from the same data that renders the visible answer. */
export const faqAnswerText = (f: Faq) =>
  [...f.a, ...(f.list ?? []).map((l) => `• ${l}`), ...(f.table ?? []).map(([a, b]) => `${a}: ${b}`)].join("\n");

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: faqAnswerText(f) } })),
  };
}

export function breadcrumbSchema(crumbs: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
  };
}

export const crumbsFor = {
  home: ["Home", paths.home] as [string, string],
};
