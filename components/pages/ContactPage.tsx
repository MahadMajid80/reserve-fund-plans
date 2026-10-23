"use client";

import { Email } from "@/components/Email";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mark } from "../Diamonds";
import { Check, reportColor, reportKey } from "../Home";
import { PageHero } from "../PageKit";
import { A, Arrow, ease, easeInOut } from "../ui";
import { track } from "@/lib/analytics";
import { grecaptcha, loadRecaptcha, RECAPTCHA_MODE, recaptchaToken } from "@/lib/recaptcha";
import { RecaptchaCheckbox } from "../RecaptchaCheckbox";
import { contact, tones } from "@/lib/content";
import { emptyQuote, preferences, reportOptions, validateQuote, type QuoteRequest } from "@/lib/quote";
import { beatQuote, facts, org, paths } from "@/lib/site";

const steps = ["Reports", "Property", "Your details"];

/* ════════ /contact-us/ : contact details + the quote form ════════ */
export function ContactPage() {
  return (
    <main>
      <PageHero
        size="md"
        crumbs={[
          ["Home", paths.home],
          ["Contact us", paths.contact],
        ]}
        issue={`Call ${contact.phone}`}
        lines={["Contact Us &", <span key="t" className="text-brand">Request a Quote</span>]}
        intro={
          <>
            Call us on{" "}
            <a href={contact.phoneHref} className="font-semibold text-ink underline-offset-4 hover:underline">
              {contact.phone}
            </a>
            , send us a message below or email{" "}
            <Email className="font-semibold text-ink underline-offset-4 hover:underline" />
            . We respect your privacy, and keep all client communications strictly confidential.
          </>
        }
      />
      <section className="pb-18 sm:pb-24">
        <div className="wrap grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <div className="rounded-[2rem] bg-white p-6 ring-1 ring-line sm:p-10 lg:p-12">
            <h2 className="eyebrow text-brand">Send us a message</h2>
            <div className="mt-6">
              <QuoteForm source="contact-us" />
            </div>
          </div>
          <ContactPanel />
        </div>
      </section>
    </main>
  );
}

/* ════════ /quote-request/ : the quote form on its own ════════ */
export function QuotePage() {
  return (
    <main>
      <PageHero
        crumbs={[
          ["Home", paths.home],
          ["Request a quote", paths.quote],
        ]}
        issue="Quote request"
        lines={["Request a", <span key="q" className="text-brand">Quote</span>]}
        intro="Provide a quotation for the selected service at the property listed below. Please select the services you require, complete the form and submit."
      />
      <section className="pb-18 sm:pb-24">
        <div className="wrap grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <div className="rounded-[2rem] bg-white p-6 ring-1 ring-line sm:p-10 lg:p-12">
            <h2 className="eyebrow text-brand">Job description</h2>
            <div className="mt-6">
              <QuoteForm source="quote-request" />
            </div>
          </div>
          <ContactPanel />
        </div>
      </section>
    </main>
  );
}

function ContactPanel() {
  return (
    <aside aria-label="Contact details">
      <div className="grain overflow-hidden rounded-[2rem] bg-navy p-7 text-white sm:p-10 lg:sticky lg:top-28">
        <Mark className="size-10" />
        <h2 className="mt-10 text-[14px] text-white/75">Call us</h2>
        <a href={contact.phoneHref} className="h-display mt-2 block py-1 text-[clamp(2rem,3.4vw,2.8rem)] tabular-nums transition-colors hover:text-brand-soft">
          {contact.phone}
        </a>
        <h2 className="mt-6 text-[14px] text-white/75">Email</h2>
        <Email className="h-title mt-2 inline-flex min-h-11 items-center text-xl underline-offset-4 hover:underline" />
        {/* TODO [ASK]: address, ABN and business hours appear here once supplied in lib/site.ts */}
        {(org.address || org.hours || org.abn) && (
          <dl className="mt-6 grid gap-2 text-white/75">
            {org.address && (
              <div>
                <dt className="text-[14px] text-white/60">Address</dt>
                <dd>
                  {org.address.street}, {org.address.locality} {org.address.region} {org.address.postcode}
                </dd>
              </div>
            )}
            {org.hours && (
              <div>
                <dt className="text-[14px] text-white/60">Business hours</dt>
                <dd>{org.hours}</dd>
              </div>
            )}
            {org.abn && (
              <div>
                <dt className="text-[14px] text-white/60">ABN</dt>
                <dd>{org.abn}</dd>
              </div>
            )}
          </dl>
        )}
        <dl className="mt-10 grid gap-2">
          {[
            ["Turnaround", `Around ${facts.turnaround}`],
            ["Pricing", beatQuote.charAt(0).toUpperCase() + beatQuote.slice(1)],
            ["Coverage", "Western Australia (and SA for some reports)"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
              <dt className="text-[13px] text-white/70">{k}</dt>{" "}
              <dd className="mt-1 font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-white/75">
          Not sure which report you need? Read the{" "}
          <A href={paths.faq} className="font-semibold text-white underline underline-offset-4">
            FAQ's
          </A>{" "}
          or just call. We’re happy to help.
        </p>
      </div>
    </aside>
  );
}

/* ════════ The 3-step quote form ════════ */
type Status = "idle" | "sending" | "error" | "sent";

export function QuoteForm({ source }: { source: string }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [f, setF] = useState<QuoteRequest>(emptyQuote);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const moved = useRef(false);
  const startedAt = useRef(0);
  const [captcha, setCaptcha] = useState("");
  const captchaWidget = useRef<number | null>(null);
  const resetCaptcha = () => {
    if (captchaWidget.current !== null) grecaptcha()?.reset(captchaWidget.current);
    setCaptcha("");
  };
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  // load reCAPTCHA only once the visitor starts using the form (keeps page loads fast)
  const warmUp = () => {
    loadRecaptcha().catch(() => {});
  };
  // when a new step's heading mounts (after the slide animation), move focus to it so keyboard and
  // screen reader users know where they are
  // It must run once per step change only: an inline ref function is re-run on every keystroke, which pulled the
  // cursor out of the field being typed in and back to the heading.
  const focusHeading = useRef(false);
  const legendRef = useCallback((el: HTMLHeadingElement | null) => {
    if (el && focusHeading.current) {
      focusHeading.current = false;
      el.focus();
    }
  }, []);

  const set = <K extends keyof QuoteRequest>(k: K, v: QuoteRequest[K]) => setF((x) => ({ ...x, [k]: v }));
  const toggle = (k: "reports" | "pref", v: string) => set(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);

  const check = (s: 0 | 1 | 2) => {
    const e = validateQuote(f, s);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) requestAnimationFrame(() => document.getElementById(first === "reports" ? "q-reports-0" : `q-${first}`)?.focus());
    return !first;
  };
  const next = () => {
    if (!check(step as 0 | 1)) return;
    moved.current = true;
    focusHeading.current = true;
    setDir(1);
    setStep((s) => s + 1);
  };
  const back = () => {
    moved.current = true;
    focusHeading.current = true;
    setDir(-1);
    setErrors({});
    setStep((s) => s - 1);
  };
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 2) return next();
    if (!check(2)) return;
    if (RECAPTCHA_MODE === "checkbox" && !captcha) {
      setErrors({ captcha: "Please tick “I’m not a robot” to send your request." });
      requestAnimationFrame(() => document.getElementById("q-captcha")?.scrollIntoView({ block: "center", behavior: "smooth" }));
      return;
    }
    setStatus("sending");
    setFailure("");
    try {
      const website = (e.currentTarget.elements.namedItem("hp_6x2q") as HTMLInputElement | null)?.value ?? "";
      const token = RECAPTCHA_MODE === "checkbox" ? captcha : await recaptchaToken("quote");
      const elapsed = Date.now() - startedAt.current;
      const r = await fetch("/api/quote/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, website, source, token, elapsed }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        throw new Error(data.error || String(r.status));
      }
      track("generate_lead", { form: source, reports: f.reports.join("; "), report_count: f.reports.length });
      setStatus("sent");
    } catch (err) {
      const code = err instanceof Error ? err.message : "";
      resetCaptcha(); // a token can only be used once
      setStatus("error");
      setFailure(
        code === "rate_limited"
          ? `You’ve sent a few requests in a short time. Please wait a few minutes and try again, or call us on ${contact.phone}.`
          : code === "captcha_failed"
            ? `Sorry, we couldn’t confirm this request came from a person. Please ${RECAPTCHA_MODE === "checkbox" ? "tick “I’m not a robot” again" : "try again"}, or call us on ${contact.phone}.`
            : `Sorry, your request couldn’t be sent. Please try again, or call us on ${contact.phone}.`,
      );
    }
  };

  if (status === "sent")
    return (
      <Sent
        name={f.name}
        reports={f.reports}
        pref={f.pref}
        reset={() => {
          setF(emptyQuote);
          setStep(0);
          setStatus("idle");
          moved.current = false;
        }}
      />
    );

  const legendCls = "h-display text-[clamp(1.9rem,3.4vw,2.8rem)] outline-none";

  return (
    <form onSubmit={submit} onFocusCapture={warmUp} onPointerDownCapture={warmUp} noValidate aria-label="Request a quote">
      <ol className="grid grid-cols-3 gap-2" aria-label="Form progress">
        {steps.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined}>
            <span aria-hidden="true" className="block h-1 overflow-hidden rounded-full bg-ink/8">
              <motion.span initial={false} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.6, ease: easeInOut }} className="block h-full origin-left rounded-full bg-brand" />
            </span>
            <p className={`mt-3 flex items-center gap-2 text-[13px] font-semibold ${i <= step ? "text-ink" : "text-mute"}`}>
              <span aria-hidden="true" className={`grid size-5 place-items-center rounded-full text-[11px] ${i < step ? "bg-brand text-white" : i === step ? "bg-ink text-white" : "bg-ink/8"}`}>
                {i + 1}
              </span>
              <span className="sr-only">Step {i + 1}: </span>
              <span className={i === step ? "" : "sr-only sm:not-sr-only"}>{s}</span>
              {i < step && <span className="sr-only"> (done)</span>}
            </p>
          </li>
        ))}
      </ol>

      {/* honeypot for spam bots; hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="q-hp">Leave this field empty</label>
        <input id="q-hp" name="hp_6x2q" type="text" tabIndex={-1} autoComplete="off" data-lpignore="true" data-1p-ignore="true" data-form-type="other" />
      </div>

      <div className="relative mt-12 min-h-[28rem]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={step} initial={moved.current ? { opacity: 0, x: dir * 50 } : false} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -50 }} transition={{ duration: 0.45, ease }}>
            {step === 0 && (
              <fieldset aria-describedby={errors.reports ? "q-reports-err" : "q-reports-help"}>
                <legend>
                  <h3 ref={legendRef} tabIndex={-1} className={legendCls}>
                    Which reports?
                  </h3>
                </legend>
                <p id="q-reports-help" className="mt-3 text-lg text-graphite">
                  Choose as many as you like.
                </p>
                <div className="mt-8 grid gap-2 sm:grid-cols-2">
                  {reportOptions.map((r, i) => {
                    const on = f.reports.includes(r);
                    const t = tones[reportKey(r)];
                    return (
                      <label
                        key={r}
                        className={`relative flex min-h-11 cursor-pointer items-center gap-3 overflow-hidden rounded-2xl px-4 py-3.5 text-[15px] font-medium ring-1 transition-[box-shadow,color] duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand ${on ? "ring-transparent" : "ring-line hover:ring-ink/25"}`}
                      >
                        <motion.span aria-hidden="true" initial={false} animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.96 }} transition={{ duration: 0.35, ease }} className="absolute inset-0 rounded-2xl" style={{ background: t.tint, boxShadow: `inset 0 0 0 1.5px ${reportColor(r)}` }} />
                        <input id={`q-reports-${i}`} type="checkbox" name="reports" value={r} className="sr-only" checked={on} onChange={() => toggle("reports", r)} />
                        <span aria-hidden="true" className="relative grid size-5 shrink-0 place-items-center rounded-md ring-1 ring-ink/50 transition-colors" style={on ? { background: reportColor(r), color: t.on } : undefined}>
                          {on && (
                            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="m5 12.5 4.5 4.5L19 7.5" />
                            </svg>
                          )}
                        </span>
                        <span className="relative">{r}</span>
                      </label>
                    );
                  })}
                </div>
                <Err id="q-reports-err" msg={errors.reports} />
              </fieldset>
            )}

            {step === 1 && (
              <fieldset>
                <legend>
                  <h3 ref={legendRef} tabIndex={-1} className={legendCls}>
                    The property
                  </h3>
                </legend>
                <p className="mt-3 text-lg text-graphite">Only the address is required. Anything else helps us quote accurately.</p>
                <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  <Field id="q-address" label="Job property address" required value={f.address} onChange={(v) => set("address", v)} error={errors.address} className="sm:col-span-2" autoComplete="street-address" />
                  <Field id="q-lots" label="Number of lots" value={f.lots} onChange={(v) => set("lots", v)} error={errors.lots} inputMode="numeric" autoComplete="off" />
                  <Field id="q-planNo" label="Strata plan number" value={f.planNo} onChange={(v) => set("planNo", v)} autoComplete="off" />
                  <Field id="q-managerName" label="Strata manager name (if any)" value={f.managerName} onChange={(v) => set("managerName", v)} autoComplete="off" />
                  <Field id="q-managerCompany" label="Strata manager company" value={f.managerCompany} onChange={(v) => set("managerCompany", v)} autoComplete="off" />
                  <div className="sm:col-span-2">
                    <label htmlFor="q-instructions" className="text-[14px] font-medium text-graphite">
                      Special instructions (optional)
                    </label>
                    <textarea id="q-instructions" rows={3} value={f.instructions} onChange={(e) => set("instructions", e.target.value)} className="mt-2 w-full resize-none rounded-2xl bg-canvas px-4 py-3.5 text-[1.05rem] ring-1 ring-ink/40 outline-none transition-shadow focus:bg-white focus:ring-2 focus:ring-brand" />
                  </div>
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset>
                <legend>
                  <h3 ref={legendRef} tabIndex={-1} className={legendCls}>
                    Your contact details
                  </h3>
                </legend>
                <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  <Field id="q-name" label="Your name" required value={f.name} onChange={(v) => set("name", v)} error={errors.name} autoComplete="name" />
                  <Field id="q-phone" label="Phone number" required value={f.phone} onChange={(v) => set("phone", v)} error={errors.phone} type="tel" inputMode="tel" autoComplete="tel" />
                  <Field id="q-email" label="Email" value={f.email} onChange={(v) => set("email", v)} error={errors.email} type="email" inputMode="email" autoComplete="email" className="sm:col-span-2" />
                </div>
                <fieldset className="mt-10">
                  <legend className="text-[14px] font-medium text-graphite">Preference (optional)</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {preferences.map((p) => {
                      const on = f.pref.includes(p);
                      return (
                        <label key={p} className={`inline-flex min-h-11 cursor-pointer items-center rounded-full px-5 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand ${on ? "bg-brand text-white" : "ring-1 ring-ink/40 hover:ring-ink/40"}`}>
                          <input type="checkbox" name="pref" value={p} className="sr-only" checked={on} onChange={() => toggle("pref", p)} />
                          {p}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                <div className="mt-10 rounded-2xl bg-canvas p-5">
                  <p className="text-[13px] text-mute">Your request</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {f.reports.map((r) => (
                      <li key={r} className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold ring-1 ring-line">
                        <span aria-hidden="true" className="size-2 rounded-full" style={{ background: reportColor(r) }} />
                        {r}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-graphite">{f.address}</p>
                </div>
                {RECAPTCHA_MODE === "checkbox" && (
                  <RecaptchaCheckbox
                    widgetId={captchaWidget}
                    error={errors.captcha}
                    onToken={(t) => {
                      setCaptcha(t);
                      if (t) setErrors((e) => ({ ...e, captcha: "" }));
                    }}
                  />
                )}
              </fieldset>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-8 rounded-2xl bg-oxblood/8 p-4 font-semibold text-oxblood">
          {failure}{" "}
          <a href={contact.phoneHref} className="underline underline-offset-4">
            Call {contact.phone}
          </a>
        </p>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-8">
        {step > 0 ? (
          <button type="button" onClick={back} className="group inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-[15px] font-semibold ring-1 ring-ink/40 transition-colors hover:bg-canvas">
            <Arrow className="size-4 rotate-180 transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
        ) : (
          <p className="text-sm text-mute" aria-live="polite">
            {f.reports.length} {f.reports.length === 1 ? "report" : "reports"} selected.
          </p>
        )}{" "}
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex min-h-12 items-center gap-3.5 rounded-full bg-brand py-2 pr-2.5 pl-7 text-[16px] font-semibold text-white transition-colors hover:bg-navy disabled:opacity-60 sm:text-[17px]"
        >
          {step < 2 ? "Continue" : status === "sending" ? "Sending…" : "Send request"}
          <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-white/15 transition-colors group-hover:bg-white group-hover:text-brand sm:size-11">
            <Arrow />
          </span>
        </button>
      </div>
      <p className="mt-5 text-[13px] leading-relaxed text-mute">
        We’ll only use your details to prepare your quote and contact you about it. See our{" "}
        <A href={`${paths.legal}#privacy`} className="font-semibold text-graphite underline underline-offset-4">
          Privacy Policy
        </A>
        .
        {RECAPTCHA_MODE !== "off" && (
          <>
            {" "}
            This form is protected by reCAPTCHA and the Google{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              Terms of Service
            </a>{" "}
            apply.
          </>
        )}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  required,
  className = "",
  type = "text",
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  className?: string;
  type?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-[14px] font-medium text-graphite">
        {label}
        {required ? (
          <span className="text-oxblood">
            {" "}
            *<span className="sr-only"> (required)</span>
          </span>
        ) : (
          <span className="text-mute"> (optional)</span>
        )}
      </label>
      <input
        id={id}
        name={id.replace(/^q-/, "")}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`mt-2 min-h-11 w-full rounded-2xl bg-canvas px-4 py-3.5 text-[1.05rem] ring-1 outline-none transition-shadow focus:bg-white focus:ring-2 ${error ? "ring-oxblood focus:ring-oxblood" : "ring-ink/40 focus:ring-brand"}`}
        {...rest}
      />
      <Err id={`${id}-err`} msg={error} />
    </div>
  );
}

function Err({ msg, id }: { msg?: string; id: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p id={id} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-sm font-semibold text-oxblood">
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Sent({ name, reports, pref, reset }: { name: string; reports: string[]; pref: string[]; reset: () => void }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease }} className="flex min-h-[34rem] flex-col justify-center" role="status">
      <span aria-hidden="true" className="grid size-20 place-items-center rounded-full bg-mist text-brand">
        <Mark animate className="size-10" />
      </span>
      <p className="mt-10 flex items-center gap-2 text-sm font-semibold text-brand">
        <Check color="#4058A0" /> Request received
      </p>
      <h3 ref={ref} tabIndex={-1} className="h-display mt-4 text-[clamp(2.6rem,5.6vw,4.4rem)] outline-none">
        Thanks, {name.split(" ")[0]}.
      </h3>
      <p className="mt-6 max-w-lg text-lg leading-relaxed text-graphite">
        We’ll {pref.includes("Email back") && !pref.includes("Call back") ? "email you" : "call you"} with a quote for {reports.length} {reports.length === 1 ? "report" : "reports"}. If it’s urgent, call{" "}
        <a href={contact.phoneHref} className="font-semibold text-brand underline underline-offset-4">
          {contact.phone}
        </a>
        .
      </p>
      <button type="button" onClick={reset} className="mt-10 min-h-12 w-fit rounded-full px-7 text-[15px] font-semibold ring-1 ring-ink/40 transition-colors hover:bg-canvas">
        Start another request
      </button>
    </motion.div>
  );
}
