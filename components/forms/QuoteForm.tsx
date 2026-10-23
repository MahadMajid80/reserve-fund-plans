"use client";

import Link from "next/link";
import { cloneElement, useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { RecaptchaCheckbox } from "./RecaptchaCheckbox";
import { grecaptcha, RECAPTCHA_SITE_KEY } from "@/lib/recaptcha";
import {
  emptyQuote,
  firstInvalidStep,
  LIMITS,
  preferences,
  propertyTypes,
  roles,
  serviceOptions,
  states,
  STEPS,
  timings,
  validateQuote,
  wantsAsbestos,
  wantsPlan,
  yesNoUnsure,
  type QuoteRequest,
  type StepIndex,
} from "@/lib/quote";
import { org, paths } from "@/lib/site";

const STORE = "rfp-quote-v1";
type Status = "idle" | "sending" | "sent" | "error";

/** Maps ?service=sfp|biv|whs|asb (used by "Request a quote" links on service pages) to a form option. */
const PRESELECT: Record<string, string> = {
  sfp: "10 Year Reserve Fund Plan (WA)",
  biv: "Building Insurance Valuation",
  whs: "WHS (Safety) Report (WA, SA)",
  asb: "Asbestos Report (Register + Management Plan)",
};

const read = (): { f: QuoteRequest; step: StepIndex } | null => {
  try {
    const raw = sessionStorage.getItem(STORE);
    if (!raw) return null;
    const d = JSON.parse(raw);
    return { f: { ...emptyQuote, ...d.f, website: "" }, step: Math.min(Math.max(Number(d.step) || 0, 0), 3) as StepIndex };
  } catch {
    return null;
  }
};
const save = (f: QuoteRequest, step: StepIndex) => {
  try {
    sessionStorage.setItem(STORE, JSON.stringify({ f: { ...f, website: "" }, step }));
  } catch {}
};
const clear = () => {
  try {
    sessionStorage.removeItem(STORE);
  } catch {}
};

export function QuoteForm() {
  const [step, setStep] = useState<StepIndex>(0);
  const [f, setF] = useState<QuoteRequest>(emptyQuote);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<ReactNode>("");
  const [restored, setRestored] = useState(false);
  const [token, setToken] = useState("");
  const widget = useRef<number | null>(null);
  const startedAt = useRef(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const ready = useRef(false);

  // restore a half-finished form from this browser tab, or preselect a service from the link
  useEffect(() => {
    startedAt.current = Date.now();
    const saved = read();
    const pre = PRESELECT[new URLSearchParams(window.location.search).get("service") || ""];
    if (saved && (saved.f.services.length || saved.f.name || saved.f.address)) {
      setF(saved.f);
      setStep(saved.step);
      setRestored(true);
    } else if (pre) setF((x) => ({ ...x, services: [pre] }));
    ready.current = true;
  }, []);

  useEffect(() => {
    if (ready.current && status !== "sent") save(f, step === 4 ? 3 : step);
  }, [f, step, status]);

  // move focus to the step heading after Continue/Back, for keyboard and screen reader users
  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [step, status]);

  const set = <K extends keyof QuoteRequest>(k: K, v: QuoteRequest[K]) => {
    setF((x) => ({ ...x, [k]: v }));
    if (errors[k as string]) setErrors(({ [k as string]: _, ...rest }) => rest);
  };
  const toggleService = (s: string) => set("services", f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s]);

  const go = useCallback((s: StepIndex) => {
    moved.current = true;
    setErrors({});
    setStep(s);
    window.scrollTo({ top: Math.max(0, (document.getElementById("quote-form")?.getBoundingClientRect().top ?? 0) + window.scrollY - 140), behavior: "smooth" });
  }, []);

  const check = (s: StepIndex) => {
    const e = validateQuote(f, s);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) requestAnimationFrame(() => document.getElementById(first === "services" ? "q-services-0" : first === "preference" ? "q-preference-0" : `q-${first}`)?.focus());
    return !first;
  };

  const next = () => {
    if (step < 4 && check(step)) go((step + 1) as StepIndex);
  };
  const back = () => step > 0 && go((step - 1) as StepIndex);

  const submit = async () => {
    const bad = firstInvalidStep(f);
    if (bad !== null) {
      go(bad);
      requestAnimationFrame(() => check(bad));
      return;
    }
    if (RECAPTCHA_SITE_KEY && !token) {
      setErrors({ captcha: "Please tick “I’m not a robot”." });
      document.getElementById("q-captcha")?.focus();
      return;
    }
    setStatus("sending");
    setFailure("");
    try {
      const r = await fetch("/api/quote/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, token, elapsed: Date.now() - startedAt.current }),
      });
      const d = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: Record<string, string> };
      if (r.ok && d.ok) {
        clear();
        moved.current = true;
        setStatus("sent");
        return;
      }
      if (widget.current !== null) grecaptcha()?.reset(widget.current);
      setToken("");
      if (r.status === 422 && d.errors) {
        const s = firstInvalidStep(f) ?? 0;
        setStatus("idle");
        go(s);
        requestAnimationFrame(() => setErrors(d.errors!));
        return;
      }
      setStatus("error");
      setFailure(
        r.status === 429
          ? "You've sent several requests in a short time. Please wait a few minutes and try again, or call us."
          : r.status === 403 && d.error === "captcha_failed"
            ? "The “I’m not a robot” check didn’t go through. Please tick it again and resend."
            : "Sorry, we couldn't send your request just now. Your answers are saved in this tab, so please try again shortly, or call us.",
      );
    } catch {
      setStatus("error");
      setFailure("We couldn't reach the server. Check your connection and try again, or call us. Your answers are saved in this tab.");
    }
  };

  if (status === "sent")
    return (
      <div className="border-t-4 border-eucalypt bg-white p-7 sm:p-10" role="status">
        <h2 ref={headingRef} tabIndex={-1} className="display text-3xl text-eucalypt-deep outline-none sm:text-4xl">
          Thank you, your request has been sent.
        </h2>
        <p className="mt-4 text-lg text-graphite">We have your property details and will be in touch by {f.preference === "Email back" ? "email" : "phone"} to confirm the scope and provide a quote.</p>
        <h3 className="mt-8 kicker text-mute">What happens next</h3>
        <ol className="mt-3 grid gap-3 text-graphite">
          {["We review the property details and the reports you've asked about.", "We contact you to confirm the scope and send a quote.", "Once you accept, we arrange the inspection."].map((t, i) => (
            <li key={t} className="flex gap-4">
              <span className="num flex size-8 shrink-0 items-center justify-center bg-sand text-eucalypt">{i + 1}</span>
              <span className="pt-1">{t}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-graphite">
          Something urgent? Call{" "}
          <a href={org.phoneHref} className="font-semibold text-eucalypt underline decoration-ochre underline-offset-4">
            {org.phone}
          </a>
          .
        </p>
      </div>
    );

  const showPlan = wantsPlan(f);
  const showAsb = wantsAsbestos(f);
  const errCount = Object.keys(errors).length;

  return (
    <div id="quote-form" className="scroll-mt-36">
      {/* progress */}
      <ol className="grid grid-cols-5 gap-1.5" aria-label="Quote request progress">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined} className="min-w-0">
            <span className={`block h-1.5 ${i < step ? "bg-eucalypt" : i === step ? "bg-ochre" : "bg-stone"}`} aria-hidden="true" />
            <span className={`mt-2 hidden truncate text-[0.8rem] sm:block ${i === step ? "font-semibold text-ink" : "text-mute"}`}>
              {label}
              <span className="sr-only">{i < step ? " (done)" : i === step ? " (current step)" : ""}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm text-mute sm:hidden">
        Step {step + 1} of {STEPS.length}: <span className="font-semibold text-ink">{STEPS[step]}</span>
      </p>

      {restored && step < 4 && (
        <p className="mt-6 flex flex-wrap items-center gap-x-3 bg-sage-pale px-4 py-3 text-sm text-graphite">
          We&rsquo;ve kept the answers you started earlier in this tab.
          <button
            type="button"
            className="font-semibold text-eucalypt underline underline-offset-4"
            onClick={() => {
              clear();
              setF(emptyQuote);
              setRestored(false);
              go(0);
            }}
          >
            Start again
          </button>
        </p>
      )}

      <form
        noValidate
        className="mt-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (step === 4) submit();
          else next();
        }}
      >
        <h2 ref={headingRef} tabIndex={-1} className="display text-[1.8rem] text-eucalypt-deep outline-none sm:text-[2.1rem]">
          <span className="sr-only">
            Step {step + 1} of {STEPS.length}:{" "}
          </span>
          {["Which report do you need?", "Tell us about the property", "How can we reach you?", "Anything else we should know?", "Check and send"][step]}
        </h2>

        {errCount > 1 && (
          <div className="mt-5 border-l-4 border-ochre-deep bg-ochre-pale/50 px-4 py-3 text-[0.95rem]" role="alert">
            <p className="font-semibold text-ink">Please fix {errCount} things before continuing:</p>
            <ul className="mt-1 list-disc pl-5 text-graphite">
              {Object.values(errors).map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        )}

        {/* honeypot: hidden from people, left empty by real browsers */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set("website", e.target.value)} />
          </label>
        </div>

        {step === 0 && (
          <fieldset className="mt-6" aria-describedby={errors.services ? "q-services-err" : "q-services-hint"} aria-invalid={!!errors.services}>
            <legend className="sr-only">Services</legend>
            <p id="q-services-hint" className="text-graphite">
              Choose one or more. Not sure? Pick the closest and tell us more in step 4.
            </p>
            <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {serviceOptions.map((s, i) => {
                const on = f.services.includes(s);
                return (
                  <label
                    key={s}
                    className={`flex min-h-14 cursor-pointer items-center gap-3 border-[1.5px] bg-white px-4 py-3 transition-colors ${on ? "border-eucalypt bg-sage-pale/60" : "border-stone hover:border-mute"}`}
                  >
                    <input id={`q-services-${i}`} type="checkbox" className="size-5 shrink-0 accent-[#1f4a40]" checked={on} onChange={() => toggleService(s)} />
                    <span className={on ? "font-semibold text-ink" : "text-graphite"}>{s}</span>
                  </label>
                );
              })}
            </div>
            <ErrorText id="q-services-err" msg={errors.services} />
          </fieldset>
        )}

        {step === 1 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field id="schemeName" label="Strata scheme or property name" optional error={errors.schemeName} className="sm:col-span-2">
              <input className="field" value={f.schemeName} maxLength={LIMITS.schemeName} onChange={(e) => set("schemeName", e.target.value)} placeholder="e.g. Riverside Apartments" />
            </Field>
            <Field id="address" label="Street address" error={errors.address} className="sm:col-span-2">
              <input className="field" autoComplete="street-address" value={f.address} maxLength={LIMITS.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
            <Field id="suburb" label="Suburb" error={errors.suburb}>
              <input className="field" autoComplete="address-level2" value={f.suburb} maxLength={LIMITS.suburb} onChange={(e) => set("suburb", e.target.value)} />
            </Field>
            <Field id="state" label="State" error={errors.state}>
              <select className="field" value={f.state} onChange={(e) => set("state", e.target.value)}>
                {states.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field id="propertyType" label="Property type" optional error={errors.propertyType}>
              <select className="field" value={f.propertyType} onChange={(e) => set("propertyType", e.target.value)}>
                <option value="">Choose…</option>
                {propertyTypes.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field id="lots" label="Number of lots" optional error={errors.lots}>
              <input className="field" inputMode="numeric" value={f.lots} maxLength={LIMITS.lots} onChange={(e) => set("lots", e.target.value.replace(/[^\d]/g, ""))} />
            </Field>
            <Field id="planNo" label="Strata plan number" optional hint="If you have it handy, e.g. SP 12345" error={errors.planNo} className="sm:col-span-2">
              <input className="field" value={f.planNo} maxLength={LIMITS.planNo} onChange={(e) => set("planNo", e.target.value)} />
            </Field>
            {showPlan && (
              <Choice id="existingPlan" label="Does the scheme already have a 10-year plan?" optional options={yesNoUnsure} value={f.existingPlan} onChange={(v) => set("existingPlan", v)} error={errors.existingPlan} />
            )}
            {showAsb && (
              <Choice
                id="builtBefore2004"
                label="Was the building constructed before 2004?"
                hint="Buildings constructed before 31 December 2003 are more likely to contain asbestos."
                optional
                options={yesNoUnsure}
                value={f.builtBefore2004}
                onChange={(v) => set("builtBefore2004", v)}
                error={errors.builtBefore2004}
              />
            )}
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Your name" error={errors.name}>
              <input className="field" autoComplete="name" value={f.name} maxLength={LIMITS.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field id="organisation" label="Organisation" optional hint="e.g. your strata management company" error={errors.organisation}>
              <input className="field" autoComplete="organization" value={f.organisation} maxLength={LIMITS.organisation} onChange={(e) => set("organisation", e.target.value)} />
            </Field>
            <Field id="email" label="Email" error={errors.email}>
              <input className="field" type="email" autoComplete="email" value={f.email} maxLength={LIMITS.email} onChange={(e) => set("email", e.target.value)} />
            </Field>
            <Field id="phone" label="Phone" error={errors.phone}>
              <input className="field" type="tel" autoComplete="tel" value={f.phone} maxLength={LIMITS.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field id="role" label="Your role" optional error={errors.role}>
              <select className="field" value={f.role} onChange={(e) => set("role", e.target.value)}>
                <option value="">Choose…</option>
                {roles.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Choice id="preference" label="How would you like us to reply?" options={preferences} value={f.preference} onChange={(v) => set("preference", v)} error={errors.preference} />
          </div>
        )}

        {step === 3 && (
          <div className="mt-6 grid gap-5">
            <Choice id="timing" label="When do you need the report?" optional options={timings} value={f.timing} onChange={(v) => set("timing", v)} error={errors.timing} wide />
            <Field id="message" label="Special instructions or questions" optional hint="Access arrangements, meeting dates, items to include, anything that helps us quote." error={errors.message}>
              <textarea className="field" value={f.message} maxLength={LIMITS.message} onChange={(e) => set("message", e.target.value)} />
            </Field>
            <p className="text-right text-xs text-mute" aria-live="polite">
              {f.message.length} / {LIMITS.message}
            </p>
          </div>
        )}

        {step === 4 && (
          <div className="mt-6">
            <p className="text-graphite">Check your details below. Use “Edit” to change anything.</p>
            <dl className="mt-5 divide-y divide-line border-y border-line bg-white">
              <Review title="Services" onEdit={() => go(0)} rows={[["Selected", f.services.join(", ")]]} />
              <Review
                title="Property"
                onEdit={() => go(1)}
                rows={[
                  ["Scheme", f.schemeName],
                  ["Address", `${f.address}, ${f.suburb} ${f.state}`],
                  ["Type", f.propertyType],
                  ["Lots", f.lots],
                  ["Plan no.", f.planNo],
                  ...(showPlan ? ([["Existing plan", f.existingPlan]] as [string, string][]) : []),
                  ...(showAsb ? ([["Built before 2004", f.builtBefore2004]] as [string, string][]) : []),
                ]}
              />
              <Review
                title="Your details"
                onEdit={() => go(2)}
                rows={[
                  ["Name", f.name],
                  ["Organisation", f.organisation],
                  ["Role", f.role],
                  ["Email", f.email],
                  ["Phone", f.phone],
                  ["Reply by", f.preference],
                ]}
              />
              <Review
                title="Anything else"
                onEdit={() => go(3)}
                rows={[
                  ["Timing", f.timing],
                  ["Details", f.message],
                ]}
              />
            </dl>
            {RECAPTCHA_SITE_KEY && <RecaptchaCheckbox onToken={setToken} widgetId={widget} error={errors.captcha} />}
            <p className="mt-6 text-sm text-mute">
              We use your details only to respond to this enquiry. See our{" "}
              <Link href={paths.legal} className="underline underline-offset-4">
                privacy statement
              </Link>
              .
            </p>
            {status === "error" && (
              <div className="mt-6 border-l-4 border-ochre-deep bg-ochre-pale/50 px-4 py-3" role="alert">
                <p className="text-ink">{failure}</p>
                <p className="mt-1">
                  <a href={org.phoneHref} className="font-semibold text-eucalypt underline underline-offset-4">
                    Call {org.phone}
                  </a>
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          {step > 0 ? (
            <button type="button" onClick={back} className="btn btn-ghost text-eucalypt">
              <span aria-hidden="true">←</span> Back
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="btn btn-primary min-w-44" disabled={status === "sending"} aria-disabled={status === "sending"}>
            {step < 4 ? (
              <>
                Continue <span aria-hidden="true">→</span>
              </>
            ) : status === "sending" ? (
              "Sending…"
            ) : (
              "Send quote request"
            )}
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {status === "sending" ? "Sending your request" : ""}
        </p>
      </form>
    </div>
  );
}

/* ───────── field helpers ───────── */

function ErrorText({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-[0.92rem] font-semibold text-ochre-deep">
      <svg viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4.5v4.2M8 10.8v.7" stroke="currentColor" strokeWidth="1.7" />
      </svg>
      {msg}
    </p>
  );
}

function Field({ id, label, optional, hint, error, className = "", children }: { id: string; label: string; optional?: boolean; hint?: string; error?: string; className?: string; children: React.ReactElement<Record<string, unknown>> }) {
  const describedBy = [hint ? `q-${id}-hint` : "", error ? `q-${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  const control = cloneElement(children, { id: `q-${id}`, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy, "aria-required": optional ? undefined : true });
  return (
    <div className={className}>
      <label htmlFor={`q-${id}`} className="flex items-baseline justify-between gap-3 font-semibold text-ink">
        {label}
        {optional && <span className="text-sm font-normal text-mute">Optional</span>}
      </label>
      {hint && (
        <p id={`q-${id}-hint`} className="mt-0.5 text-sm text-mute">
          {hint}
        </p>
      )}
      <div className="mt-2">{control}</div>
      <ErrorText id={`q-${id}-err`} msg={error} />
    </div>
  );
}

function Choice({ id, label, hint, optional, options, value, onChange, error, wide }: { id: string; label: string; hint?: string; optional?: boolean; options: readonly string[]; value: string; onChange: (v: string) => void; error?: string; wide?: boolean }) {
  const name = useId();
  return (
    <fieldset className={wide ? "" : "sm:col-span-2"} aria-describedby={[hint ? `q-${id}-hint` : "", error ? `q-${id}-err` : ""].filter(Boolean).join(" ") || undefined}>
      <legend className="flex w-full items-baseline justify-between gap-3 font-semibold text-ink">
        {label}
        {optional && <span className="text-sm font-normal text-mute">Optional</span>}
      </legend>
      {hint && (
        <p id={`q-${id}-hint`} className="mt-0.5 text-sm text-mute">
          {hint}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o, i) => (
          <label key={o} className={`flex min-h-12 cursor-pointer items-center gap-2.5 border-[1.5px] bg-white px-4 ${value === o ? "border-eucalypt bg-sage-pale/60 font-semibold" : "border-stone hover:border-mute"}`}>
            <input id={`q-${id}-${i}`} type="radio" name={name} className="size-4 accent-[#1f4a40]" checked={value === o} onChange={() => onChange(o)} aria-invalid={error ? true : undefined} />
            {o}
          </label>
        ))}
        {optional && value && (
          <button type="button" className="min-h-12 px-2 text-sm text-mute underline underline-offset-4" onClick={() => onChange("")}>
            Clear
          </button>
        )}
      </div>
      <ErrorText id={`q-${id}-err`} msg={error} />
    </fieldset>
  );
}

function Review({ title, rows, onEdit }: { title: string; rows: [string, string][]; onEdit: () => void }) {
  return (
    <div className="grid gap-3 p-5 sm:grid-cols-[10rem_1fr_auto] sm:gap-6">
      <dt className="kicker pt-1 text-eucalypt">{title}</dt>
      <dd className="grid gap-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 text-[0.97rem]">
            <span className="text-mute">{k}</span>
            <span className="break-words whitespace-pre-line text-ink">{v?.trim() ? v : "—"}</span>
          </div>
        ))}
      </dd>
      <dd>
        <button type="button" onClick={onEdit} className="min-h-11 font-semibold text-eucalypt underline decoration-ochre underline-offset-4">
          Edit<span className="sr-only"> {title.toLowerCase()}</span>
        </button>
      </dd>
    </div>
  );
}
