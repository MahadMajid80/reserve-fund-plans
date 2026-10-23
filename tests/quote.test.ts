import { describe, expect, it, beforeEach } from "vitest";
import { emptyQuote, firstInvalidStep, validateQuote, wantsAsbestos, wantsPlan, type QuoteRequest } from "@/lib/quote";
import { headerSafe, looksLikeSpam, rateLimited, resetRateLimit, sameOrigin } from "@/lib/security";
import { quoteEmailHtml, quoteEmailText } from "@/lib/emailTemplate";

const valid: QuoteRequest = {
  ...emptyQuote,
  services: ["10 Year Reserve Fund Plan (WA)"],
  address: "1 Example Street",
  suburb: "Applecross",
  state: "WA",
  name: "Sam Owner",
  email: "sam@example.com.au",
  phone: "0400 123 456",
  preference: "Call back",
};

describe("validateQuote", () => {
  it("accepts a complete request", () => {
    expect(validateQuote(valid)).toEqual({});
    expect(firstInvalidStep(valid)).toBeNull();
  });
  it("requires a service, and only known services", () => {
    expect(validateQuote({ ...valid, services: [] }, 0).services).toBeTruthy();
    expect(validateQuote({ ...valid, services: ["Free money"] }, 0).services).toBeTruthy();
  });
  it("requires address and suburb, and whole-number lots", () => {
    const e = validateQuote({ ...valid, address: " ", suburb: "", lots: "12a" }, 1);
    expect(Object.keys(e).sort()).toEqual(["address", "lots", "suburb"]);
  });
  it("rejects values outside the option lists", () => {
    const e = validateQuote({ ...valid, state: "NSW", propertyType: "Castle", existingPlan: "Maybe" }, 1);
    expect(Object.keys(e).sort()).toEqual(["existingPlan", "propertyType", "state"]);
  });
  it("checks contact details", () => {
    const e = validateQuote({ ...valid, name: "", email: "not-an-email", phone: "12", preference: "" }, 2);
    expect(Object.keys(e).sort()).toEqual(["email", "name", "phone", "preference"]);
  });
  it("reports the first step with a problem", () => {
    expect(firstInvalidStep({ ...valid, phone: "" })).toBe(2);
    expect(firstInvalidStep({ ...valid, message: "x".repeat(4000) })).toBe(3);
  });
  it("knows when to show the conditional questions", () => {
    expect(wantsPlan(valid)).toBe(true);
    expect(wantsAsbestos(valid)).toBe(false);
    expect(wantsAsbestos({ services: ["Asbestos Report (Register + Management Plan)"] })).toBe(true);
  });
});

describe("security helpers", () => {
  beforeEach(() => resetRateLimit());
  it("rate limits after 5 requests per IP", () => {
    for (let i = 0; i < 5; i++) expect(rateLimited("1.2.3.4")).toBe(false);
    expect(rateLimited("1.2.3.4")).toBe(true);
    expect(rateLimited("5.6.7.8")).toBe(false);
  });
  it("refuses cross-site posts", () => {
    const mk = (h: Record<string, string>) => new Request("https://www.reservefundplans.com.au/api/quote/", { method: "POST", headers: h });
    expect(sameOrigin(mk({ host: "www.reservefundplans.com.au", origin: "https://www.reservefundplans.com.au", "sec-fetch-site": "same-origin" }))).toBe(true);
    expect(sameOrigin(mk({ host: "www.reservefundplans.com.au", origin: "https://evil.example" }))).toBe(false);
    expect(sameOrigin(mk({ host: "www.reservefundplans.com.au", "sec-fetch-site": "cross-site" }))).toBe(false);
  });
  it("strips header injection characters", () => {
    expect(headerSafe("a@b.com\r\nBcc: x@y.com")).toBe("a@b.com Bcc: x@y.com");
  });
  it("flags link spam but not normal text", () => {
    expect(looksLikeSpam({ name: "http://spam.example", organisation: "", address: "", message: "" })).toBe(true);
    expect(looksLikeSpam({ name: "Jo", organisation: "", address: "1 St", message: "Access via the side gate, see www.example.com.au for the plan" })).toBe(false);
  });
});

describe("email template", () => {
  it("escapes everything the visitor typed", () => {
    const html = quoteEmailHtml({ ...valid, name: `<script>alert(1)</script>`, message: `"><img src=x onerror=alert(1)>` });
    expect(html).not.toContain("<script>alert");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
  });
  it("includes conditional answers only when relevant", () => {
    expect(quoteEmailText({ ...valid, existingPlan: "Yes" })).toContain("Existing plan in place: Yes");
    expect(quoteEmailText({ ...valid, services: ["Building Insurance Valuation"] })).not.toContain("Existing plan");
  });
});
