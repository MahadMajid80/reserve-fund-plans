import { beforeEach, describe, expect, it } from "vitest";
import { emptyQuote, reportOptions, validateQuote, type QuoteRequest } from "@/lib/quote";
import { headerSafe, looksLikeSpam, rateLimited, sameOrigin } from "@/lib/security";
import { quoteEmailHtml } from "@/lib/emailTemplate";
import { services } from "@/lib/services";
import { allTestimonials } from "@/lib/testimonials";

const valid: QuoteRequest = { ...emptyQuote, reports: [reportOptions[1]], address: "1 Example St, Applecross WA", name: "Sam Owner", phone: "0400 123 456", email: "sam@example.com.au", pref: ["Call back"] };

describe("quote validation", () => {
  it("accepts a complete request", () => expect(validateQuote(valid)).toEqual({}));
  it("requires a report from the Reserve Fund Plans list", () => {
    expect(validateQuote({ ...valid, reports: [] }).reports).toBeTruthy();
    expect(validateQuote({ ...valid, reports: ["Free money"] }).reports).toBeTruthy();
  });
  it("requires address, name and a valid phone", () => {
    const e = validateQuote({ ...valid, address: "", name: "", phone: "12" });
    expect(Object.keys(e).sort()).toEqual(["address", "name", "phone"]);
  });
  it("needs an email when the visitor asks to be emailed back", () => {
    expect(validateQuote({ ...valid, email: "", pref: ["Email back"] }).email).toBeTruthy();
  });
});

describe("security helpers", () => {
  beforeEach(() => {
    for (let i = 0; i < 6; i++) rateLimited(`warm-${i}`);
  });
  it("rate limits the sixth request in the window", () => {
    const ip = `t-${Math.random()}`;
    for (let i = 0; i < 5; i++) expect(rateLimited(ip)).toBe(false);
    expect(rateLimited(ip)).toBe(true);
  });
  it("refuses cross-site posts", () => {
    const mk = (h: Record<string, string>) => new Request("https://www.reservefundplans.com.au/api/quote/", { method: "POST", headers: h });
    expect(sameOrigin(mk({ host: "www.reservefundplans.com.au", origin: "https://www.reservefundplans.com.au" }))).toBe(true);
    expect(sameOrigin(mk({ host: "www.reservefundplans.com.au", origin: "https://evil.example" }))).toBe(false);
  });
  it("strips header injection characters and flags link spam", () => {
    expect(headerSafe("a@b.com\r\nBcc: x@y.com")).toBe("a@b.com Bcc: x@y.com");
    expect(looksLikeSpam({ name: "http://spam.example", managerName: "", managerCompany: "", instructions: "", address: "" })).toBe(true);
  });
  it("escapes visitor input in the email", () => {
    const html = quoteEmailHtml({ ...valid, name: "<script>x</script>" });
    expect(html).not.toContain("<script>x");
  });
});

describe("content", () => {
  it("has the four services at their original URLs", () => {
    expect(services.map((s) => s.path)).toEqual(["/services/biv/", "/services/whs/", "/services/sfp/", "/services/asb/"]);
  });
  it("keeps the four original testimonial slugs", () => {
    expect(allTestimonials.map((t) => t.slug)).toHaveLength(4);
  });
  it("has no BIV-only claims left in service copy", () => {
    const text = JSON.stringify(services);
    expect(text).not.toMatch(/NSW only|Strata Schemes Management Act|\$330|Australia-wide/);
  });
});
