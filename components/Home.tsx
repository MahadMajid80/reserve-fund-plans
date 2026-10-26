"use client";

import { Email } from "@/components/Email";
import { AnimatePresence, animate, motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Logo, Mark, ServiceIcon } from "./Diamonds";
import { Photo } from "./Photo";
import { A, Arrow, Button, Chapter, Chip, Counter, FadeUp, LineLink, LineReveal, Marquee, ease, easeInOut, useSectionProgress } from "./ui";
import { useFirstLoad } from "@/lib/intro";
import { alsoAvailable, contact, diamonds, services, states, stats, steps, timeline, tones, values, type DiamondKey } from "@/lib/content";
import { facts, paths } from "@/lib/site";
import { AU_LABELS, AU_PATHS, AU_VIEWBOX } from "@/lib/australiaMap";
import { testimonialByName, testimonialCount } from "@/lib/testimonials";

/* ════════ Preloader ════════ */
export function Preloader() {
  // Plays in CSS on a full page load of the homepage (no JavaScript needed, so it never holds the page up),
  // and is skipped on client-side navigation back to the homepage.
  const first = useFirstLoad();
  if (!first) return null;
  return (
    <div data-preloader aria-hidden="true" className="preloader grain pointer-events-none fixed inset-0 z-[100] grid place-items-center bg-navy text-white">
      <div className="flex flex-col items-center">
        <Logo onDark className="h-20 sm:h-24" />
        <p className="eyebrow mt-6 text-white/60">Est. 1984</p>
      </div>
    </div>
  );
}

/* ════════ Hero: full-bleed Perth photo, text on a dark wash, glass plan card ════════
   (Reserve Fund Plans' own layout: BIV uses a split hero with a rounded photo frame.) */
export function Hero() {
  const START = useFirstLoad() ? 0.7 : 0.15;
  const at = (n: number) => ({ ["--d" as string]: `${n}s` }) as React.CSSProperties;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section ref={ref} id="top" className="relative">
      <div className="relative isolate overflow-hidden bg-navy text-white">
        <motion.div style={{ y: imgY, scale: 1.08 }} className="absolute inset-0 -z-10">
          <Photo k="sydneyHighRise" fill priority fetchPriority="high" sizes="100vw" className="object-cover" />
        </motion.div>
        {/* dark wash, strongest behind the text, so it reads on any part of the photo */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/95 via-navy/75 to-navy/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/80 via-transparent to-navy/40" />

        <div className="wrap relative grid items-end gap-12 pt-32 pb-14 sm:pt-40 sm:pb-20 lg:min-h-[44rem] lg:grid-cols-[1.25fr_1fr] lg:gap-16 lg:pb-24">
          <div>
            <div className="rise" style={at(START)}>
              <Chip dark>
                <span className="size-1.5 bg-brand-soft" />
                Registered Valuers since 1984 · Perth, WA
              </Chip>
            </div>

            <h1 className="h-display mt-7 text-[clamp(2.2rem,4.3vw,3.75rem)] [text-wrap:balance]">
              <HeroLine delay={START + 0.08}>10 Year Reserve Fund Plans</HeroLine>{" "}
              <HeroLine delay={START + 0.16}>
                <span className="text-brand-soft">&amp; Strata Reports</span>
              </HeroLine>{" "}
              <HeroLine delay={START + 0.24}>in Western Australia</HeroLine>
            </h1>

            <p className="h-title mt-6 text-[clamp(1.25rem,2.1vw,1.65rem)] text-white">
              Accurate. Practical.{" "}
              <span className="relative inline-block text-brand-soft">
                Easy to read.
                <svg viewBox="0 0 300 14" className="absolute -bottom-[0.18em] left-0 w-full" preserveAspectRatio="none" aria-hidden="true">
                  <motion.path
                    d="M2 9 C 70 3, 150 3, 298 8"
                    fill="none"
                    stroke="var(--color-brand)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: START + 0.9, duration: 1.1, ease: easeInOut }}
                  />
                </svg>
              </span>
            </p>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              Reserve fund plans, building insurance valuations, WHS reports and asbestos reports for strata and community schemes. Researched in detail,
              and written so your council of owners can act on them.
            </p>

            <div style={at(START + 0.45)} className="rise mt-9 flex flex-wrap gap-3">
              <Button href={contact.quote}>Request a quote</Button>
              <Button href={contact.phoneHref} tone="ghost-light">
                {contact.phone}
              </Button>
            </div>
          </div>

          {/* glass plan card */}
          <motion.div style={{ y: cardY }} className="w-full max-w-[24rem] lg:ml-auto">
            <motion.div
              data-reveal
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: START + 0.7, duration: 1, ease }}
              className="glass rounded-card p-5 text-ink shadow-[var(--shadow-lift)] ring-1 ring-white/70"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-md bg-navy text-white">
                    <Mark className="size-4" />
                  </span>
                  <span className="text-[13px] leading-tight font-bold">
                    10 Year Reserve Fund Plan
                    <span className="block font-medium text-mute">Strata Plan · WA</span>
                  </span>
                </span>
                <span className="rounded-md bg-[#fbe9e5] px-2.5 py-1 text-[11px] font-bold text-brand">Example</span>
              </div>
              <p className="eyebrow mt-5 !text-[0.65rem] text-mute">Annual reserve contribution</p>
              <p className="h-display mt-1 text-[2.1rem] tabular-nums" aria-label="Example annual reserve contribution: $48,500">
                <Counter to={48500} prefix="$" group duration={2.4} />
              </p>
              {/* ten yearly bars: steady contributions, the plan's signature */}
              <div className="mt-4 flex h-12 items-end gap-1.5" aria-hidden="true">
                {[34, 40, 46, 52, 58, 64, 70, 76, 84, 92].map((h, i) => (
                  <motion.span
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: START + 1.1 + i * 0.06, duration: 0.6, ease }}
                    className={`flex-1 origin-bottom rounded-[3px] ${i === 9 ? "bg-brand" : "bg-brand-soft"}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="mt-2.5 flex justify-between text-[12px] text-mute">
                <span>Years 1–10 funded, no special levy</span>
                <span className="font-bold text-brand">10 yrs</span>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* figures strip along the bottom of the photo */}
        <div className="relative border-t border-white/15 bg-navy/40 backdrop-blur-sm">
          <div className="wrap grid grid-cols-2 divide-white/15 py-5 sm:grid-cols-4 sm:divide-x">
            {[
              ["40+", "Years of experience", "Over 40 years of experience"],
              ["30,000+", "Strata schemes inspected", `Inspected ${facts.schemesInspected} strata schemes in Australia`],
              [facts.indemnityShort, "Indemnity cover", `${facts.indemnity} professional indemnity cover`],
              ["3–7", "Business days turnaround", `Normal turnaround ${facts.turnaround}`],
            ].map(([v, l, phrase], i) => (
              <div key={l} role="group" aria-label={phrase} className={`py-2 ${i ? "sm:pl-6" : ""}`}>
                <p className="h-title text-2xl text-white sm:text-[1.7rem]">{v}</p>{" "}
                <p className="mt-1 text-[13px] leading-snug text-white/70">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* service ticker */}
      <div style={at(START + 0.8)} className="rise border-b border-line bg-white py-5">
        <Marquee>
          {[...services, ...services].map((s, i) => (
            <span key={i} aria-hidden={i >= services.length ? "true" : undefined} className="flex items-center gap-10 pr-10 text-[15px] font-semibold whitespace-nowrap text-graphite">
              {s.title}{" "}
              <Mark className="size-3.5 text-brand" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function HeroLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pt-[0.02em] pb-[0.12em]">
      <span className="line-up" style={{ ["--d" as string]: `${delay}s` } as React.CSSProperties}>
        {children}
      </span>
    </span>
  );
}

/* ════════ Section heading used across the homepage ════════ */
function Head({ no, title, lines, text, dark = false, className = "" }: { no: string; title: string; lines: React.ReactNode[]; text?: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <div className={`grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16 ${className}`}>
      <div>
        <Chapter no={no} title={title} dark={dark} />
        <LineReveal className="h-display mt-6 text-[clamp(2.2rem,4.6vw,4rem)]" lines={lines} />
      </div>
      {text && (
        <FadeUp>
          <p className={`max-w-md text-lg leading-relaxed lg:ml-auto ${dark ? "text-white/70" : "text-graphite"}`}>{text}</p>
        </FadeUp>
      )}
    </div>
  );
}

/* ════════ The reports: spotlight cards ════════ */
export function Reports() {
  return (
    <section id="services" className="py-18 sm:py-24">
      <div className="wrap">
        <Head
          no="01"
          title="The reports"
          lines={["Four reports.", <span key="o" className="text-mute">One standard of care.</span>]}
          text="Each report is properly researched and presented in our Easy to Read Report format, so strata managers and councils of owners can act with confidence."
        />
        {/* Reserve Fund Plans layout: one row of cards with the old site's diamond service icons (BIV uses a 2×2 grid of spotlight cards) */}
        <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <FadeUp key={s.code} delay={i * 0.07} className="h-full">
              <IconCard s={s} n={i + 1} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/** A service card with the report's diamond icon from the old Reserve Fund Plans site and a report-colour bar. */
export function IconCard({ s, n }: { s: (typeof services)[number]; n: number }) {
  return (
    <A href={s.href} className="group flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-line transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]">
      <span className="block h-1.5" style={{ background: diamonds[s.key] }} aria-hidden="true" />
      <span className="flex flex-1 flex-col p-6 sm:p-7">
        <span className="flex items-start justify-between" aria-hidden="true">
          <span className="grid size-20 place-items-center rounded-card transition-transform duration-500 group-hover:-translate-y-0.5" style={{ background: tones[s.key].tint }}>
            <ServiceIcon k={s.key} className="h-16 w-auto" />
          </span>
          <span className="flex flex-col items-end gap-2">
            <span className="text-sm font-semibold text-mute tabular-nums">0{n}</span>
            <span className="rounded-md px-2.5 py-1 text-[12px] font-bold tracking-wide" style={{ background: tones[s.key].tint, color: tones[s.key].text }}>{s.code}</span>
          </span>
        </span>
        <span className="h-title mt-7 text-[1.35rem]">{s.title}</span>
        <span className="mt-2 block text-[15px] leading-relaxed text-graphite">{s.body}</span>
        <span className="mt-auto flex items-center gap-2 pt-6 text-[15px] font-semibold text-brand">
          Read more
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            <Arrow className="size-3.5" />
          </span>
        </span>
      </span>
    </A>
  );
}

export function Check({ color = "currentColor", className = "size-5" }: { color?: string; className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full ${className}`} style={{ background: `${color}14`, color }}>
      <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

/** White card with a soft colour spotlight that follows the pointer. */
export function SpotCard({ k, href, className = "", children }: { k: DiamondKey; href: string; className?: string; children: React.ReactNode }) {
  return (
    <A
      href={href}
      onPointerMove={(e: React.PointerEvent<HTMLAnchorElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={`group relative block h-full overflow-hidden rounded-card bg-white ring-1 ring-line transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${className}`}
      style={{ ["--glow" as string]: tones[k].tint }}
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(420px circle at var(--mx,50%) var(--my,50%), var(--glow), transparent 70%)" }} />
      <span className="relative flex h-full flex-col">{children}</span>
    </A>
  );
}

/* ════════ Statement: the photo opens up as you scroll ════════ */
export function Feature() {
  const ref = useRef<HTMLElement>(null);
  const p = useSectionProgress(ref);
  const inset = useTransform(p, [0, 0.45], [12, 1.2]);
  const radius = useTransform(p, [0, 0.45], [48, 32]);
  const clip = useTransform([inset, radius] as never, ([i, r]: number[]) => `inset(${i}% ${i}% ${i}% ${i}% round ${r}px)`);
  const scale = useTransform(p, [0, 1], [1.3, 1.05]);
  const textY = useTransform(p, [0.25, 0.6], [60, 0]);
  const textO = useTransform(p, [0.25, 0.55], [0, 1]);

  return (
    <section ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ clipPath: clip }} className="absolute inset-0 bg-navy">
          <motion.div style={{ scale }} className="absolute inset-0">
            <Photo k="perthSunset" decorative fill sizes="100vw" className="object-cover" />
          </motion.div>
          {/* the skyline photo is brighter than the old one, so a touch more shade, mostly behind the text */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-navy/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/55 via-navy/20 to-transparent" />
        </motion.div>
        <motion.div data-reveal style={{ y: textY, opacity: textO }} className="wrap absolute inset-x-0 bottom-0 pb-16 text-white sm:pb-24">
          <div className="max-w-4xl">
            <Chapter no="02" title="Why it matters" dark />
            <p className="h-display mt-6 text-[clamp(2.4rem,6vw,5.2rem)]">
              Plan ahead, or <span className="text-brand-soft">pay later.</span>
            </p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              A 10 year reserve fund plan turns large, irregular repair bills into steady annual contributions, so the strata company can keep its common
              property in good repair without hitting owners with a special levy.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════ By the numbers ════════ */
export function Numbers() {
  return (
    <section className="bg-brand-soft text-navy">
      {/* Reserve Fund Plans: a yellow-and-black band in the logo's colours (BIV uses white stat cards) */}
      <div className="wrap py-14 sm:py-18">
        <Chapter no="03" title="By the numbers" />
        <p className="h-display mt-5 max-w-3xl text-[clamp(2rem,4vw,3.4rem)]">Four decades of strata expertise.</p>
        <div className="mt-10 grid grid-cols-2 gap-y-8 border-t-2 border-navy pt-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.07}>
              <div role="group" aria-label={s.phrase} className={`@container pr-4 ${i ? "lg:border-l lg:border-navy/25 lg:pl-8" : ""} ${i % 2 ? "border-l border-navy/25 pl-5 lg:pl-8" : ""}`}>
                <p className="h-display text-[min(3.6rem,24cqw)] leading-none whitespace-nowrap tabular-nums">
                  {s.kind === "year" ? <Counter from={1950} to={s.value} duration={2.2} /> : <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} group={s.value >= 10000} />}
                </p>
                <p className="mt-3 text-[15px] font-semibold text-navy/75">{s.label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════ Calculator ════════ */
const fmt = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2)}M` : `$${Math.round(n / 1000).toLocaleString("en-AU")}k`);

export function Calculator() {
  const [replacement, setReplacement] = useState(8_000_000);
  const [insuredPct, setInsuredPct] = useState(70);
  const [claimPct, setClaimPct] = useState(30);
  const insured = (replacement * insuredPct) / 100;
  const claim = (replacement * claimPct) / 100;
  const paid = Math.min(claim * Math.min(1, insured / replacement), insured);
  const shortfall = Math.max(0, claim - paid);
  const under = insuredPct < 100;

  return (
    <section className="px-3 sm:px-5">
      <div className="mx-auto max-w-[90rem] rounded-panel bg-mist py-16 sm:rounded-panel sm:py-22">
        <div className="wrap grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
          <div>
            <Chapter no="04" title="The averaging clause" />
            <LineReveal className="h-display mt-6 text-[clamp(2.2rem,4.6vw,4rem)]" lines={["What under-insurance", <span key="r" className="text-brand">really costs you.</span>]} />
            <FadeUp>
              <p className="mt-7 max-w-md text-lg leading-relaxed text-graphite">
                If you’re under-insured, the insurer may apply the co-insurance or “averaging” clause and pay only a portion of the claim. Move the sliders to
                see how quickly a gap opens up.
              </p>
              <p className="mt-5 flex max-w-md gap-3 rounded-2xl bg-white/70 p-4 text-sm leading-relaxed text-mute ring-1 ring-line">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand/15 text-[11px] font-bold text-brand">i</span>
                Illustration only, using a simple averaging formula. Policy terms vary; this isn’t insurance advice.
              </p>
            </FadeUp>
          </div>

          <FadeUp className="lg:order-first">
            <div className="grain rounded-card bg-navy p-6 text-white shadow-[var(--shadow-lift)] sm:p-9">
              <div className="grid gap-7">
                <Slider id="calc-replacement" label="True replacement cost" value={fmt(replacement)} min={1_000_000} max={30_000_000} step={500_000} v={replacement} onChange={setReplacement} />
                <Slider id="calc-insured" label="Your sum insured" value={`${fmt(insured)} · ${insuredPct}%`} min={40} max={110} step={1} v={insuredPct} onChange={setInsuredPct} />
                <Slider id="calc-claim" label="Damage claim" value={fmt(claim)} min={5} max={100} step={1} v={claimPct} onChange={setClaimPct} />
              </div>
              <div className="mt-9 flex h-3 gap-1 overflow-hidden rounded-full">
                <motion.div animate={{ width: `${(paid / claim) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 22 }} className="rounded-full bg-brand-soft" />
                <motion.div animate={{ width: `${(shortfall / claim) * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 22 }} className="rounded-full bg-oxblood-soft" />
              </div>
              <dl className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                  <dt className="flex items-center gap-2 text-[13px] text-white/60">
                    <span className="size-2 rounded-full bg-brand-soft" />
                    Insurer pays
                  </dt>
                  <dd className="h-display mt-2 text-[clamp(1.8rem,3.4vw,2.6rem)] tabular-nums">{fmt(paid)}</dd>
                </div>
                <div className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                  <dt className="flex items-center gap-2 text-[13px] text-white/60">
                    <span className="size-2 rounded-full bg-oxblood-soft" />
                    Owners cover
                  </dt>
                  <dd className={`h-display mt-2 text-[clamp(1.8rem,3.4vw,2.6rem)] tabular-nums ${shortfall ? "text-oxblood-soft" : ""}`}>{fmt(shortfall)}</dd>
                </div>
              </dl>
              <p className="mt-5 text-sm text-white/75" aria-live="polite">
                {under ? `Insured at ${insuredPct}% of the true cost, only ${insuredPct}¢ in every dollar of this claim is paid.` : "Fully insured: the claim is paid in full, up to your sum insured."}
              </p>
              <div className="mt-7">
                <Button href={contact.quote} tone="brass">
                  Get an accurate valuation
                </Button>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

function Slider({ id, label, value, min, max, step, v, onChange }: { id: string; label: string; value: string; min: number; max: number; step: number; v: number; onChange: (n: number) => void }) {
  const pct = ((v - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[14px] text-white/75">
          {label}
        </label>
        <output htmlFor={id} className="text-[15px] font-bold tabular-nums">
          {value}
        </output>
      </div>
      {/* 44px tall touch target; touch-action stops the page scrolling while a finger drags the slider */}
      <div className="relative mt-1 h-11" data-lenis-prevent>
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-white/12" />
        <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand-soft" style={{ width: `${pct}%` }} />
        <div className="pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_2px_10px_rgb(0_0_0/0.35)] ring-4 ring-brand-soft/40" style={{ left: `${pct}%` }} />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={v}
          aria-valuetext={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="peer absolute inset-0 size-full cursor-pointer touch-none opacity-0"
        />
        <div className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-transparent peer-focus-visible:ring-white/70" />
      </div>
    </div>
  );
}

/* ════════ Coverage: state tiles ════════ */
export const reportKey = (r: string): DiamondKey =>
  /Insurance|Cladding/.test(r) ? "blue" : /WHS|OHS|COVID/.test(r) ? "sage" : /Fund|Reserve|Life Cycle/.test(r) ? "brass" : "oxblood";
export const reportColor = (r: string) => diamonds[reportKey(r)];

export function Coverage({ no = "05" }: { no?: string }) {
  const [code, setCode] = useState("WA");
  const st = states.find((s) => s.code === code)!;
  return (
    <section id="coverage" className="py-18 sm:py-24">
      <div className="wrap">
        <Head no={no} title="Coverage" lines={["Where we", <span key="r" className="text-brand">prepare reports.</span>]} text="Based in Applecross, Perth. Choose Western Australia or South Australia to see the reports we prepare there." />
        <div className="mt-11 grid items-stretch gap-4 lg:grid-cols-[1.15fr_1fr]">
          <FadeUp className="h-full">
            <div className="flex h-full flex-col rounded-card bg-white p-7 ring-1 ring-line sm:p-9">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={st.code} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }}>
                  <span className="rounded-full bg-brand px-3 py-1.5 text-[12px] font-bold text-white">{st.code}</span>
                  <p className="h-title mt-5 text-[1.9rem]">{st.name}</p>
                  <ul className="mt-6 grid gap-2">
                    {st.reports.map((r) => (
                      <li key={r} className="flex items-center gap-3 rounded-xl bg-canvas px-4 py-3.5 font-medium">
                        <span className="size-2.5 shrink-0 rounded-full" style={{ background: reportColor(r) }} />
                        {r}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
              <A href={paths.quote} className="group mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-brand">
                Request a quote in {st.name}
                <span className="transition-transform group-hover:translate-x-1">
                  <Arrow className="size-3.5" />
                </span>
              </A>
              <div className="mt-auto pt-8">
                <p className="eyebrow text-mute">Good to know</p>
                <p className="mt-2 text-[15px] leading-relaxed text-graphite">{alsoAvailable.join(" · ")}</p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.08} className="h-full lg:order-first">
            <div className="h-full rounded-card bg-white p-3 ring-1 ring-line sm:p-4">
              <svg viewBox={AU_VIEWBOX} className="mx-auto h-full max-h-[34rem] w-full" role="group" aria-label="Map of Australia: choose Western Australia or South Australia">
                {/* ACT is drawn last so it sits on top of NSW */}
                {Object.keys(AU_PATHS)
                  .sort((a, b) => Number(a === "ACT") - Number(b === "ACT"))
                  .map((c) => {
                    const s = states.find((x) => x.code === c);
                    const on = c === code;
                    const [lx, ly] = AU_LABELS[c];
                    const act = c === "ACT";
                    const size = act ? 7 : c === "VIC" || c === "TAS" ? 8 : 10;
                    if (!s)
                      return (
                        <g key={c} aria-hidden="true">
                          {AU_PATHS[c].map((d, i) => (
                            <path key={i} d={d} strokeLinejoin="round" className="fill-canvas stroke-white" strokeWidth={0.8} />
                          ))}
                          <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="pointer-events-none select-none fill-mute/50 font-bold" fontSize={size}>
                            {c}
                          </text>
                        </g>
                      );
                    return (
                      <g
                        key={c}
                        role="button"
                        tabIndex={0}
                        aria-pressed={on}
                        aria-label={`${c}, ${s.name}: ${s.reports.length} ${s.reports.length === 1 ? "report" : "reports"}`}
                        onClick={() => setCode(c)}
                        onMouseEnter={() => setCode(c)}
                        onFocus={() => setCode(c)}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setCode(c))}
                        className="cursor-pointer outline-none [&:focus-visible_path]:stroke-ink [&:focus-visible_path]:stroke-[1.5]"
                      >
                        {AU_PATHS[c].map((d, i) => (
                          <path key={i} d={d} strokeLinejoin="round" className={`stroke-white transition-colors duration-300 ${on ? "fill-brand" : "fill-mist hover:fill-line"}`} strokeWidth={0.8} />
                        ))}
                        <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className={`pointer-events-none select-none font-bold ${on ? "fill-white" : "fill-ink"}`} fontSize={size}>
                          {c}
                        </text>
                      </g>
                    );
                  })}
              </svg>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ════════ About us: mission, values, history ════════ */
export function Article() {
  return (
    <section className="pb-18 sm:pb-24">
      <div className="wrap">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Chapter no="06" title="Our history" />
            <LineReveal className="h-display mt-6 text-[clamp(2.2rem,4.2vw,3.6rem)]" lines={["A word", <span key="w" className="text-brand">about us.</span>]} />
            <FadeUp className="prose-biv mt-8 max-w-lg text-lg leading-relaxed text-graphite">
              <p>
                Since 1984, we have {facts.years} experience in valuing a very wide variety of properties, from carrying out due diligence on the largest
                property transactions in Australia through to the smallest of suburban cottages.
              </p>
              <p>
                We are experts in the presentation of expert evidence in both Federal and State Court systems. We have particular expertise in strata property,
                having inspected {facts.schemesInspected} strata schemes in Australia.
              </p>
              {/* TODO [ASK] (Australian Consumer Law): "most accurate … available" and "simply the best available" are comparative claims kept from
                  the old homepage. Suggested: "Our clients receive accurate, practical property reports in an Easy to Read Report format. Our advice is
                  properly researched in detail." */}
              <p>
                Our clients have the most accurate and practical property reports available, in an Easy to Read Report format. Our advice is properly
                researched in detail, and is simply the best available in the market.
              </p>
            </FadeUp>
            <FadeUp className="mt-8">
              <LineLink href={paths.about}>More about us</LineLink>
            </FadeUp>
          </div>

          {/* Reserve Fund Plans layout: a building photo above a numbered list of values (BIV uses staggered value cards) */}
          <div>
            <FadeUp>
              <div className="relative aspect-[16/10] overflow-hidden rounded-panel bg-navy">
                <Photo k="coastalTower" decorative fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
                <span className="absolute bottom-3 left-3 rounded-md bg-navy/80 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur-sm">Strata specialists since 1984</span>
              </div>
            </FadeUp>
            <ol className="mt-4 divide-y divide-line rounded-panel bg-white ring-1 ring-line">
              {values.map((v, i) => (
                <FadeUp as="li" key={v.title} delay={i * 0.06} className="grid list-none grid-cols-[2.75rem_1fr] gap-4 p-6 sm:p-7">
                  <span className="grid size-11 place-items-center rounded-md text-[15px] font-bold tabular-nums" style={{ background: tones[v.key].tint, color: tones[v.key].text }}>
                    0{i + 1}
                  </span>
                  <span>
                    <h3 className="h-title text-[1.3rem]">{v.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-graphite">{v.body}</p>
                  </span>
                </FadeUp>
              ))}
            </ol>
          </div>
        </div>

        {/* timeline: four dated blocks on a black ledger rule */}
        <ol className="mt-18 grid gap-px overflow-hidden rounded-panel bg-navy/90 ring-1 ring-navy sm:mt-24 sm:grid-cols-2 lg:grid-cols-4">
          {timeline.map((t, i) => (
            <FadeUp as="li" key={t.year} delay={0.1 + i * 0.1} className="list-none bg-navy p-7 text-white">
              <span className="block h-1 w-10 bg-brand-soft" aria-hidden="true" />
              <p className="h-display mt-5 text-[2.2rem] text-brand-soft">{t.year}</p>
              <p className="mt-3 leading-relaxed text-white/75">{t.text}</p>
            </FadeUp>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ════════ Testimonials: a grid of quote cards (BIV uses a draggable carousel) ════════ */
const homeQuotes = ["Christine Nesbit", "Michael Kimpton", "Bryan", "Emma Fairbrother"].map(testimonialByName);

export function Quotes() {
  return (
    <section className="py-18 sm:py-24">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Chapter no="07" title="In their words" />
            <LineReveal className="h-display mt-6 text-[clamp(2.2rem,4.6vw,4rem)]" lines={["Trusted by strata", "managers and agents."]} />
          </div>
          <LineLink href={paths.testimonials}>Read all {testimonialCount} testimonials</LineLink>
        </div>
        <div className="mt-11 grid gap-4 md:grid-cols-2">
          {homeQuotes.map((t, i) => (
            <FadeUp key={t.name} delay={(i % 2) * 0.08} className="h-full">
              <figure className={`flex h-full flex-col rounded-card p-7 ring-1 sm:p-9 ${i === 0 ? "bg-navy text-white ring-navy" : "bg-white ring-line"}`}>
                <span aria-hidden="true" className={`h-display block text-[4.5rem] leading-[0.6] ${i === 0 ? "text-brand-soft" : "text-brand"}`}>
                  “
                </span>
                <blockquote className={`mt-4 mb-8 text-[1.08rem] leading-relaxed ${i === 0 ? "text-white/90" : "text-ink"}`}>{t.quote}</blockquote>
                <figcaption className={`mt-auto flex items-center gap-3 border-t pt-5 ${i === 0 ? "border-white/15" : "border-line"}`}>
                  <span aria-hidden="true" className={`grid size-10 shrink-0 place-items-center rounded-md text-sm font-bold ${i === 0 ? "bg-brand-soft text-navy" : "bg-mist text-brand"}`}>
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </span>{" "}
                  <span>
                    <span className="block text-[15px] font-bold">{t.name}</span>{" "}
                    <span className={`block text-[13px] ${i === 0 ? "text-white/70" : "text-mute"}`}>{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
        <p className="mt-6 text-sm text-mute">These testimonials name BIV Reports, our sister brand.</p>
      </div>
    </section>
  );
}

/* ════════ Closing: steps + CTA on a blue panel ════════ */
export function Closing() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rot = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  return (
    <section ref={ref} className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="grain relative mx-auto max-w-[90rem] overflow-hidden rounded-panel bg-navy py-16 text-white sm:rounded-panel sm:py-22">
        {/* Reserve Fund Plans: Perth skyline behind the closing call to action */}
        <Photo k="perthDay" decorative fill sizes="(min-width: 1440px) 90rem, 100vw" className="object-cover opacity-45" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
        <motion.div style={{ rotate: rot }} className="pointer-events-none absolute -right-48 -bottom-48 w-[40rem]">
          <Mark line className="w-full text-white/[0.07]" />
        </motion.div>
        <div className="wrap relative">
          <Chapter no="08" title="Request a quote" dark />
          <LineReveal className="h-display mt-6 max-w-4xl text-[clamp(2.4rem,5.6vw,4.8rem)]" lines={["Make your next report", <span key="e" className="text-brand-soft">the easy part.</span>]} />
          {/* Reserve Fund Plans layout: a numbered timeline on one rule (BIV uses three glass cards) */}
          <ol className="relative mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
            <span aria-hidden="true" className="absolute top-5 right-0 left-0 hidden h-px bg-white/25 md:block" />
            {steps.map((s, i) => (
              <FadeUp as="li" key={s.title} delay={i * 0.1} className="relative list-none">
                <span className="relative grid size-10 place-items-center rounded-md bg-brand-soft text-sm font-bold text-navy">{i + 1}</span>
                <h3 className="h-title mt-6 text-xl">{s.title}</h3>
                <p className="mt-2 max-w-xs leading-relaxed text-white/75">{s.body}</p>
              </FadeUp>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Button href={contact.quote} tone="brass">
              Request a quote
            </Button>
            <Button href={contact.phoneHref} tone="ghost-light">
              Call {contact.phone}
            </Button>
            <p className="text-white/65 sm:ml-4">
              or email{" "}
              <Email className="font-semibold text-white underline-offset-4 hover:underline" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
