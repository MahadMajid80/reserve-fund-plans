// Site-wide constants: production URL, business details, the URL map and facts used on several pages.
// Anything marked TODO [ASK] needs confirmation from the business (see docs/CLAIMS-TO-CONFIRM.md).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.reservefundplans.com.au").replace(/\/$/, "");
export const SITE_NAME = "Reserve Fund Plans";

/** Absolute URL for a site path such as "/services/sfp/". */
export const abs = (path: string) => `${SITE_URL}${path}`;

/** Every page path. Old WordPress paths are kept exactly, trailing slashes included. */
export const paths = {
  home: "/",
  about: "/about-us/",
  biv: "/services/biv/",
  sfp: "/services/sfp/",
  whs: "/services/whs/",
  asb: "/services/asb/",
  faqBiv: "/building-insurance-valuation/",
  faqSfp: "/sinking-fund-plans/",
  faqWhs: "/work-health-and-safety/",
  faqAsb: "/asbestos-reports/",
  testimonials: "/testimonials/",
  contact: "/contact-us/",
  quote: "/quote-request/",
  legal: "/legal/",
  // new hub pages (the old menu items "Services" and "FAQ" were dropdown headings with no page)
  services: "/services/",
  faq: "/faq/",
} as const;

export const org = {
  name: "Reserve Fund Plans",
  // From the old footer: "Reserve Fund Plans (Super Valuations Pty Limited)".
  legalName: "Super Valuations Pty Limited",
  // The old header, contact page and footer text use 1300 55 18 30. A second number (1300 107 280) appeared in
  // the old footer menu; it is BIV Reports' number and is not used here. TODO [ASK]: confirm.
  phone: "1300 55 18 30",
  phoneIntl: "+61 1300 551 830",
  phoneHref: "tel:1300551830",
  // The email address is assembled in the browser by components/Email.tsx, so it never sits in the HTML.
  emailUser: "rfplans",
  emailDomain: "rfplans.com.au",
  // The old site printed the postcode as 5163; Applecross WA is 6153. TODO [ASK]: confirm the address is current.
  address: { street: "Suite 18, 30 Kearns Crescent", locality: "Applecross", region: "WA", postcode: "6153" },
  foundingDate: "1984",
  abn: null as null | string, // TODO [ASK]
  hours: null as null | string, // TODO [ASK]
};

/** Facts that appear on several pages. Change them here only. */
export const facts = {
  since: "1984",
  schemesInspected: "over 30,000", // historical, cumulative claim from the old site. TODO [ASK]: confirm or update.
  indemnity: "$10,000,000", // old site: $10M professional indemnity insurance. TODO [ASK]: confirm current cover.
  turnaround: "3 to 7 business days",
  // Old site: "we will beat any competitor's written quote by 12%". TODO [ASK] (Australian Consumer Law): confirm
  // it is still offered and the conditions (same report, same scope, same property).
  priceMatch: "We aim to beat a competitor's written quote for the same report by 12%",
};
