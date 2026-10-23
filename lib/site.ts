// Site-wide constants: the production URL, the organisation's details, the URL map and facts that
// appear in more than one place. Anything marked TODO [ASK] is waiting on confirmation from the business
// (see docs/CLAIMS-TO-CONFIRM.md).

/** Production origin. Used for canonicals, the sitemap, Open Graph and schema. No trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.reservefundplans.com.au").replace(/\/$/, "");
export const SITE_HOST = new URL(SITE_URL).host;
export const SITE_NAME = "Reserve Fund Plans";

/** Absolute URL for a site path such as "/services/sfp/". */
export const abs = (path: string) => `${SITE_URL}${path}`;

/** Every page path, exactly as on the old WordPress site (trailing slashes included). */
export const paths = {
  home: "/",
  about: "/about-us/",
  services: "/services/",
  biv: "/services/biv/",
  whs: "/services/whs/",
  sfp: "/services/sfp/",
  asb: "/services/asb/",
  faqBiv: "/building-insurance-valuation/",
  faqWhs: "/work-health-and-safety/",
  faqSfp: "/sinking-fund-plans/",
  faqAsb: "/asbestos-reports/",
  testimonials: "/testimonials/",
  contact: "/contact-us/",
  quote: "/quote-request/",
  legal: "/legal/",
  // hub pages: the old "Services" and "FAQ" menu headings had no page of their own
  faq: "/faq/",
} as const;

export const org = {
  // From the old footer: "Reserve Fund Plans (Super Valuations Pty Limited)". TODO [ASK]: confirm.
  legalName: "Super Valuations Pty Limited",
  name: "Reserve Fund Plans",
  // The old header, logo and contact page use 1300 55 18 30. (The old footer menu also showed 1300 107 280,
  // which is BIV Reports' number.) TODO [ASK]: confirm.
  phone: "1300 55 18 30",
  phoneIntl: "+61 1300 551 830",
  phoneHref: "tel:1300551830",
  // The email address is assembled in the browser only (components/Email.tsx), never in the HTML.
  foundingDate: "1984",
  // Old site printed postcode 5163; Applecross WA is 6153. TODO [ASK]: confirm the office is current.
  address: { street: "Suite 18, 30 Kearns Crescent", locality: "Applecross", region: "WA", postcode: "6153" } as null | {
    street: string;
    locality: string;
    region: string;
    postcode: string;
  },
  abn: null as null | string, // TODO [ASK]
  hours: null as null | string, // TODO [ASK]
  areaServed: ["Western Australia"],
};

/** Facts that appear on several pages. Change them here only. */
export const facts = {
  // Old site: "having inspected over 30,000 strata schemes in Australia". TODO [ASK]: confirm or update.
  schemesInspected: "over 30,000",
  schemesInspectedNumber: 30000,
  turnaround: "3–7 business days",
  // Old site: $10M professional indemnity insurance. TODO [ASK]: confirm current cover.
  indemnity: "$10,000,000",
  indemnityShort: "$10M",
  years: "over 40 years",
  revaluation: {
    minimum: "at least every 5 years",
    recommended: "every 2–3 years",
    best: "an annual inspection",
  },
  // TODO [ASK]: stale figures carried over from the old site. Update or approve removal.
  stale: {
    costRise2004: "in 2004 concrete and steel costs rose by over 25%",
    assessed: "We assess over $10 billion worth of property per annum.",
  },
};

/**
 * Pricing claim from the old site ("we will beat any competitors written quote by 12%").
 * TODO [ASK] (Australian Consumer Law): confirm it is still offered and its conditions.
 */
export const beatQuote = "we will beat any competitor’s written quote by 12%";

/** GA4 measurement ID. Nothing loads while it is empty. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
