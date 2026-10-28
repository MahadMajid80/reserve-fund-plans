// Homepage copy. Taken from reservefundplans.com.au (home, about, services, testimonials, contact)
// unless marked "new copy".

import { facts, org, paths } from "./site";

export const contact = {
  phone: org.phone,
  phoneHref: org.phoneHref,
  quote: paths.quote,
  contactPage: paths.contact,
};

export const nav = [
  { label: "Home", href: paths.home },
  { label: "About", href: paths.about },
  { label: "Services", href: paths.services },
  { label: "FAQ's", href: paths.faq },
  { label: "Testimonials", href: paths.testimonials },
  { label: "Contact", href: paths.contact },
];

/** The strata building photo used on the old Reserve Fund Plans homepage. */
export const buildingPhoto = "/building.jpg";
/** Used behind the "Why it matters" statement. TODO [ASK]: a Perth skyline or WA strata photo would suit better. */
export const skylinePhoto = "/building.jpg";

/** The Reserve Fund Plans logo (yellow on black badge, works on light and dark grounds). Vector redraw of the live site's logo (scripts/make-logo.py). */
export const logoSrc = "/rfp-logo.svg";
export const logoWhiteSrc = "/rfp-logo.svg";

/** The four report colours, from the diamond icons on the old Reserve Fund Plans site. */
export const diamonds = {
  blue: "#3F57A2",
  sage: "#599B51",
  brass: "#E7C733",
  oxblood: "#CC222E",
} as const;
export type DiamondKey = keyof typeof diamonds;

/** Per-colour variants: `text` reads on light grounds, `soft` reads on the dark ground, `tint` is a pale wash, `on` is the text colour on a solid fill. */
export const tones: Record<DiamondKey, { text: string; soft: string; tint: string; on: string }> = {
  blue: { text: "#36508F", soft: "#A9B8E6", tint: "#E8ECF7", on: "#FFFFFF" },
  sage: { text: "#3F7339", soft: "#B4D9AE", tint: "#E8F2E6", on: "#171717" },
  brass: { text: "#7A6100", soft: "#F2DC6B", tint: "#FBF5D9", on: "#1A1A1A" },
  oxblood: { text: "#B01E28", soft: "#F2A0A4", tint: "#FBE6E6", on: "#FFFFFF" },
};

export const services = [
  {
    key: "blue" as DiamondKey,
    code: "BIV",
    title: "Building Insurance Valuations",
    short: "Insurance valuations",
    body: "We provide Certificates of Value for the replacement cost and reinstatement of the buildings of the Strata or Community Plan, in order to comply with the relevant legislation.",
    ref: "Replacement value · Strata Titles Act 1985 (WA)",
    points: ["Prepared by a valuer", `Recommended ${facts.revaluation.recommended}`, `${facts.indemnityShort} indemnity cover`],
    href: paths.biv,
  },
  {
    key: "sage" as DiamondKey,
    code: "WHS",
    title: "WHS Reports",
    short: "Safety reports",
    body: "We carry out Safety Reports to identify hazards and the consequential risk of harm to people and potential damage to property, from both a Common Law Duty of Care and a WHS legislative requirement.",
    ref: "Work Health and Safety Act 2020 (WA)",
    points: ["Every hazard risk assessed", "Practical control measures", "Photos and locations"],
    href: paths.whs,
  },
  {
    key: "brass" as DiamondKey,
    code: "RFP",
    title: "Reserve Fund Plans",
    short: "Reserve fund plans",
    body: "We specialise in, and are passionate about, providing 10 Year Reserve Fund Plans (sometimes referred to as Maintenance Plans) which are compliant with the Strata Titles Act 1985 (WA).",
    ref: "10-year plan · reviewed at least every 5 years",
    points: ["10 year reserve fund plans", "Also called maintenance plans", "Prepared by a valuer"],
    href: paths.sfp,
  },
  {
    key: "oxblood" as DiamondKey,
    code: "ASB",
    title: "Asbestos Reports",
    short: "Asbestos reports",
    body: "Our Asbestos Report includes BOTH an Asbestos Register and an Asbestos Management Plan.",
    ref: "Register + Management Plan in one",
    points: ["Asbestos Register", "Asbestos Management Plan", "NATA accredited testing"],
    href: paths.asb,
  },
];

export const stats = [
  { value: 1984, label: "Valuing property since", kind: "year" as const, phrase: "Valuing property since 1984" },
  { value: 30000, suffix: "+", label: "Strata schemes inspected", phrase: `Inspected ${facts.schemesInspected} strata schemes in Australia` },
  { value: 10, prefix: "$", suffix: "M", label: "Professional indemnity cover", phrase: `${facts.indemnity} professional indemnity cover` },
  { value: 7, prefix: "3–", label: "Business days turnaround", phrase: `Normal turnaround ${facts.turnaround}` },
];

export const values = [
  {
    key: "blue" as DiamondKey,
    title: "Innovative",
    full: "Our enviable and unique experience provides us a strong foundation, original in its intent, to provide our clients leading solutions to meet today’s industry challenges. We can provide clients with creative and relevant results, ensuring accountability throughout the process and remaining responsible for the outcome.",
    body: "Our unique experience gives us a strong, original foundation to deliver leading solutions to today’s industry challenges.",
  },
  {
    key: "sage" as DiamondKey,
    title: "Vigilant",
    full: "On a weekly basis, we review Court cases dealing with negligence, work health and safety and asbestos, amongst other topics, and any changes to legislation that may be relevant to the property industry. We are intimately aware of proposed changes to legislation and have instigated some of these changes.",
    body: "Every week we review court cases and legislative changes on negligence, WHS and asbestos. We’ve even instigated some of those changes.",
  },
  {
    key: "brass" as DiamondKey,
    title: "Professional",
    full: "We are Registered Valuers (since 1984), licensed Real Estate Agents (since 1983) and appropriately qualified Asbestos and Work Health and Safety specialists serving the property industry. Our Directors serve on both government and industry committees providing advice on strata and other property issues. We abide by our respective Institutes’ Code of Professional Conduct and Ethics.",
    body: "Registered Valuers since 1984, licensed Real Estate Agents and qualified Asbestos and WHS specialists. Our Directors sit on government and industry committees.",
  },
  {
    key: "oxblood" as DiamondKey,
    title: "Independent",
    full: "Our role is to provide independent professional advice to our clients. We are not affiliated with any maintenance companies, nor do our recommendations or our work practices rely on referrals to these types of companies. We are similar to independent auditors providing practical recommendations.",
    body: "We’re not affiliated with any maintenance company and rely on no referrals. Think of us as independent auditors with practical recommendations.",
  },
];

export const timeline = [
  { year: "1984", text: "Founded as Registered Valuers, valuing everything from Australia’s largest property transactions to suburban cottages." },
  { year: "Ethics", text: "Bound by our Institutes’ Code of Professional Conduct and Ethics." },
  { year: "Courts", text: "Experts in presenting expert evidence in both Federal and State Court systems." },
  { year: "Today", text: `Inspected ${facts.schemesInspected} strata schemes in Australia, with a Perth office in Applecross.` },
];

/** Reports by state, from the quote form on reservefundplans.com.au/quote-request. */
export const states = [
  { code: "WA", name: "Western Australia", reports: ["Building Insurance Valuation", "10 Year Reserve Fund Plan", "WHS (Safety) Report", "Life Cycle Maintenance Report", "Asbestos Report (Register + Management Plan)"] },
  { code: "SA", name: "South Australia", reports: ["10 Year Sinking Fund Plan", "WHS (Safety) Report", "Life Cycle Maintenance Report"] },
];

export const alsoAvailable = ["Office in Applecross, Perth", "Reports prepared after a site inspection", `Normal turnaround ${facts.turnaround}`];

// new copy: three-step summary of how ordering works
export const steps = [
  { title: "Request a quote", body: `Tell us about the property and the reports you need, online or on ${org.phone}.` },
  { title: "We inspect", body: "A qualified specialist inspects the property and assesses the materials and the building." },
  { title: "Easy-to-read report", body: "You receive an accurate, practical report, ready for your council of owners or meeting." },
];
