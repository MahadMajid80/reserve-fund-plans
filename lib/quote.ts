// Shared by the quote form (client) and the /api/quote/ route (server).

/** Report options from the old reservefundplans.com.au quote form (/quote-request/). */
export const reportOptions = [
  "Building Insurance Valuation",
  "10 Year Reserve Fund Plan (WA)",
  "WHS (Safety) Report (WA, SA)",
  "Life Cycle Maintenance Report (WA, SA)",
  "Asbestos Report (Register + Management Plan)",
  "10 Year Sinking Fund Plan (SA)",
];

export const preferences = ["Call back", "Email back"];

export type QuoteRequest = {
  reports: string[];
  address: string;
  lots: string;
  planNo: string;
  managerName: string;
  managerCompany: string;
  instructions: string;
  name: string;
  phone: string;
  email: string;
  pref: string[];
  /** honeypot: must stay empty */
  website?: string;
  /** page the form was sent from */
  source?: string;
};

export const emptyQuote: QuoteRequest = { reports: [], address: "", lots: "", planNo: "", managerName: "", managerCompany: "", instructions: "", name: "", phone: "", email: "", pref: [] };

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^[+()\d\s-]{8,20}$/;

/** Returns field → message for anything invalid. Same rules on the client and the server. */
export function validateQuote(f: QuoteRequest, step: 0 | 1 | 2 | "all" = "all") {
  const e: Record<string, string> = {};
  const all = step === "all";
  if (all || step === 0) {
    if (!f.reports.length) e.reports = "Choose at least one report.";
    else if (f.reports.some((r) => !reportOptions.includes(r))) e.reports = "Choose reports from the list.";
  }
  if (all || step === 1) {
    if (!f.address.trim()) e.address = "Enter the property address.";
    if (f.lots && !/^\d{1,5}$/.test(f.lots.trim())) e.lots = "Enter the number of lots as a whole number, e.g. 12.";
  }
  if (all || step === 2) {
    if (!f.name.trim()) e.name = "Enter your name.";
    if (!f.phone.trim()) e.phone = "Enter a phone number so we can call you back.";
    else if (!PHONE_RE.test(f.phone.trim())) e.phone = "Enter a phone number with at least 8 digits, e.g. 0400 123 456.";
    if (f.email && !EMAIL_RE.test(f.email.trim())) e.email = "Enter an email address in the format name@example.com.";
    if (f.pref.includes("Email back") && !f.email.trim()) e.email = "Enter an email address so we can email you back.";
  }
  return e;
}
