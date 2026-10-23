// Shared by the quote form (browser) and /api/quote/ (server): the fields, options and validation rules.

/** Report options from the old /quote-request/ form, plus "Other enquiry". */
export const serviceOptions = [
  "10 Year Reserve Fund Plan (WA)",
  "Building Insurance Valuation",
  "WHS (Safety) Report (WA, SA)",
  "Asbestos Report (Register + Management Plan)",
  "Life Cycle Maintenance Report (WA, SA)",
  "10 Year Sinking Fund Plan (SA)",
  "Other enquiry",
] as const;

export const states = ["WA", "SA", "Other"] as const;
export const propertyTypes = ["Residential", "Commercial", "Mixed use", "Industrial", "Community scheme", "Other"] as const;
export const roles = ["Strata manager", "Council member", "Owner", "Other"] as const;
export const preferences = ["Call back", "Email back"] as const;
export const timings = ["No particular deadline", "Within a month", "Urgent"] as const;
export const yesNoUnsure = ["Yes", "No", "Not sure"] as const;

/** Services that make the conditional questions appear */
export const PLAN_SERVICES = ["10 Year Reserve Fund Plan (WA)", "10 Year Sinking Fund Plan (SA)", "Life Cycle Maintenance Report (WA, SA)"];
export const ASBESTOS_SERVICES = ["Asbestos Report (Register + Management Plan)"];

export type QuoteRequest = {
  services: string[];
  // property
  schemeName: string;
  address: string;
  suburb: string;
  state: string;
  propertyType: string;
  lots: string;
  planNo: string;
  existingPlan: string; // conditional: plan services
  builtBefore2004: string; // conditional: asbestos
  // contact
  name: string;
  organisation: string;
  role: string;
  email: string;
  phone: string;
  preference: string;
  // additional
  timing: string;
  message: string;
  /** honeypot: must stay empty */
  website?: string;
};

export const emptyQuote: QuoteRequest = {
  services: [],
  schemeName: "",
  address: "",
  suburb: "",
  state: "WA",
  propertyType: "",
  lots: "",
  planNo: "",
  existingPlan: "",
  builtBefore2004: "",
  name: "",
  organisation: "",
  role: "",
  email: "",
  phone: "",
  preference: "",
  timing: "",
  message: "",
  website: "",
};

export const LIMITS = { schemeName: 120, address: 200, suburb: 80, lots: 5, planNo: 30, name: 100, organisation: 120, email: 200, phone: 25, message: 3000 } as const;

export const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/;
export const PHONE_RE = /^[+()\d\s-]{8,20}$/;

export const wantsPlan = (q: Pick<QuoteRequest, "services">) => q.services.some((s) => PLAN_SERVICES.includes(s));
export const wantsAsbestos = (q: Pick<QuoteRequest, "services">) => q.services.some((s) => ASBESTOS_SERVICES.includes(s));

export const STEPS = ["Service", "Property", "Your details", "Anything else", "Review"] as const;
export type StepIndex = 0 | 1 | 2 | 3 | 4;

const oneOf = (v: string, list: readonly string[]) => !v || list.includes(v);

/** Field → message for anything invalid. The same rules run in the browser and on the server. */
export function validateQuote(f: QuoteRequest, step: StepIndex | "all" = "all") {
  const e: Record<string, string> = {};
  const at = (s: StepIndex) => step === "all" || step === s;

  if (at(0)) {
    if (!f.services.length) e.services = "Choose at least one service.";
    else if (f.services.some((s) => !(serviceOptions as readonly string[]).includes(s))) e.services = "Choose services from the list.";
  }
  if (at(1)) {
    if (!f.address.trim()) e.address = "Enter the property's street address.";
    else if (f.address.length > LIMITS.address) e.address = "The address is too long.";
    if (!f.suburb.trim()) e.suburb = "Enter the suburb.";
    else if (f.suburb.length > LIMITS.suburb) e.suburb = "The suburb is too long.";
    if (!oneOf(f.state, states) || !f.state) e.state = "Choose a state.";
    if (!oneOf(f.propertyType, propertyTypes)) e.propertyType = "Choose a property type from the list.";
    if (f.lots && !/^\d{1,5}$/.test(f.lots.trim())) e.lots = "Enter the number of lots as a whole number, for example 12.";
    if (f.schemeName.length > LIMITS.schemeName) e.schemeName = "The name is too long.";
    if (f.planNo.length > LIMITS.planNo) e.planNo = "The strata plan number is too long.";
    if (!oneOf(f.existingPlan, yesNoUnsure)) e.existingPlan = "Choose an answer from the list.";
    if (!oneOf(f.builtBefore2004, yesNoUnsure)) e.builtBefore2004 = "Choose an answer from the list.";
  }
  if (at(2)) {
    if (!f.name.trim()) e.name = "Enter your name.";
    else if (f.name.length > LIMITS.name) e.name = "The name is too long.";
    if (f.organisation.length > LIMITS.organisation) e.organisation = "The organisation name is too long.";
    if (!oneOf(f.role, roles)) e.role = "Choose a role from the list.";
    if (!f.email.trim()) e.email = "Enter your email address.";
    else if (!EMAIL_RE.test(f.email.trim()) || f.email.length > LIMITS.email) e.email = "Enter an email address in the format name@example.com.au.";
    if (!f.phone.trim()) e.phone = "Enter a phone number so we can call you back.";
    else if (!PHONE_RE.test(f.phone.trim())) e.phone = "Enter a phone number with at least 8 digits, for example 0400 123 456.";
    if (!f.preference) e.preference = "Choose how you'd like us to reply.";
    else if (!oneOf(f.preference, preferences)) e.preference = "Choose an option from the list.";
  }
  if (at(3)) {
    if (!oneOf(f.timing, timings)) e.timing = "Choose an option from the list.";
    if (f.message.length > LIMITS.message) e.message = `Please keep this under ${LIMITS.message} characters.`;
  }
  return e;
}

/** The first step that has an error, for sending the visitor back to fix it. */
export function firstInvalidStep(f: QuoteRequest): StepIndex | null {
  for (const s of [0, 1, 2, 3] as StepIndex[]) if (Object.keys(validateQuote(f, s)).length) return s;
  return null;
}
