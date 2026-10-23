"use client";

import { Email } from "@/components/Email";
import { AnimatePresence, animate, motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Logo, Mark } from "./Diamonds";
import { A, Arrow, Button, Chapter, Chip, Counter, FadeUp, LineLink, LineReveal, Marquee, ease, easeInOut, useSectionProgress } from "./ui";
import { useFirstLoad } from "@/lib/intro";
import { alsoAvailable, buildingPhoto, contact, skylinePhoto, diamonds, services, states, stats, steps, timeline, tones, values, type DiamondKey } from "@/lib/content";
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

/* ════════ Hero: split, rounded photo, glass report card ════════ */
export function Hero() {
  const START = useFirstLoad() ? 0.7 : 0.15;
  const at = (n: number) => ({ ["--d" as string]: `${n}s` }) as React.CSSProperties;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pt-28 sm:pt-32">
      {/* soft background glow */}
      <div className="pointer-events-none absolute -top-40 right-[-10%] size-[44rem] rounded-full bg-[radial-gradient(circle,rgb(200_51_26/0.07),transparent_65%)]" />
      <div className="pointer-events-none absolute top-60 left-[-15%] size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(245_220_60/0.16),transparent_65%)]" />

      <div className="wrap relative grid items-center gap-14 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24">
        <div>
          <div className="rise" style={at(START)}>
            <Chip>
              <span className="size-1.5 rounded-full bg-brand" />
              Registered Valuers since 1984
            </Chip>
          </div>

          <h1 className="h-display mt-7 text-[clamp(2.2rem,4.6vw,3.9rem)] [text-wrap:balance]">
            <HeroLine delay={START + 0.08}>10 Year Reserve Fund Plans</HeroLine>{" "}
            <HeroLine delay={START + 0.16}>
              <span className="text-brand">&amp; Strata Reports</span>
            </HeroLine>{" "}
            <HeroLine delay={START + 0.24}>in Western Australia</HeroLine>
          </h1>

          {/* slogan: a styled subheading, not a heading */}
          <p
            className="h-title mt-6 text-[clamp(1.3rem,2.2vw,1.75rem)] text-ink"
          >
            Accurate. Practical.{" "}
            <span className="relative inline-block text-brand">
              Easy to read.
              <svg viewBox="0 0 300 14" className="absolute -bottom-[0.18em] left-0 w-full" preserveAspectRatio="none" aria-hidden="true">
                <motion.path
                  d="M2 9 C 70 3, 150 3, 298 8"
                  fill="none"
                  stroke="var(--color-brand-soft)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: START + 0.9, duration: 1.1, ease: easeInOut }}
                />
              </svg>
            </span>
          </p>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-graphite">
            Reserve fund plans, building insurance valuations, WHS reports and asbestos reports for strata and community schemes.
            Researched in detail, and written so your council of owners can act on them.
          </p>

          <div style={at(START + 0.45)} className="rise mt-9 flex flex-wrap gap-3">
            <Button href={contact.quote}>Request a quote</Button>
            <Button href={contact.phoneHref} tone="ghost">
              {contact.phone}
            </Button>
          </div>

          <div
            style={at(START + 0.6)}
            className="rise mt-12 grid max-w-lg grid-cols-3 divide-x divide-line border-t border-line pt-6"
          >
            {[
              ["40+", "Years of experience", "Over 40 years of experience"],
              ["30,000+", "Strata schemes inspected", `Inspected ${facts.schemesInspected} strata schemes in Australia`],
              [facts.indemnityShort, "Indemnity cover", `${facts.indemnity} professional indemnity cover`],
            ].map(([v, l, phrase], i) => (
              <div key={l} role="group" aria-label={phrase} className={i ? "pl-4 sm:pl-6" : "pr-4"}>
                <p className="h-title text-2xl text-ink sm:text-[1.7rem]">{v}</p>{" "}
                <p className="mt-1 text-[13px] leading-snug text-mute">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* photo + floating cards */}
        <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
          <div
            style={at(START - 0.1)}
            className="clip-in relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-navy shadow-[var(--shadow-lift)]"
          >
            <motion.div style={{ y: imgY, scale: 1.06 }} className="absolute inset-0">
              <Image src={buildingPhoto} alt="A multi-storey strata apartment building" fill priority fetchPriority="high" sizes="(min-width: 1024px) 45vw, (min-width: 640px) 34rem, 100vw" className="object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
          </div>

          {/* floating turnaround chip */}
          <motion.div
            data-reveal
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: START + 0.9, duration: 0.9, ease }}
            className="absolute top-6 -right-2 sm:top-10 sm:-right-6"
          >
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="glass flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[var(--shadow-soft)] ring-1 ring-white/60">
              <span className="grid size-9 place-items-center rounded-full bg-brand text-white">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 7.5V12l3 2" />
                </svg>
              </span>
              <span>
                <span className="block text-[13px] font-bold">3–7 business days</span>
                <span className="block text-[12px] text-mute">Normal turnaround</span>
              </span>
            </motion.div>
          </motion.div>

          {/* glass report card */}
          <motion.div style={{ y: cardY }} className="absolute -bottom-8 left-3 w-[min(21rem,86%)] sm:-left-8 lg:-left-12">
            <motion.div
              data-reveal
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: START + 0.7, duration: 1, ease }}
              className="glass rounded-[1.5rem] p-5 shadow-[var(--shadow-lift)] ring-1 ring-white/70"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-full bg-navy text-white">
                    <Mark className="size-4" />
                  </span>
                  <span className="text-[13px] font-bold leading-tight">
                    10 Year Reserve Fund Plan
                    <span className="block font-medium text-mute">Strata Plan · WA</span>
                  </span>
                </span>
                <span className="rounded-full bg-[#fbe9e5] px-2.5 py-1 text-[11px] font-bold text-brand">Example</span>
              </div>
              <p className="eyebrow mt-5 !text-[0.65rem] text-mute">Annual reserve contribution</p>
              <p className="h-display mt-1 text-[2.1rem] tabular-nums" aria-label="Example annual reserve contribution: $48,500">
                <Counter to={48500} prefix="$" group duration={2.4} />
              </p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink/8">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: START + 1.2, duration: 1.6, ease }} className="h-full rounded-full bg-gradient-to-r from-brand to-brand-soft" />
              </div>
              <p className="mt-2.5 flex justify-between text-[12px] text-mute">
                <span>10 years funded, no special levy</span>
                <span className="font-bold text-brand">100%</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* service ticker */}
      <div style={at(START + 0.8)} className="rise border-y border-line py-5">
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
        <div className="mt-11 grid gap-4 md:grid-cols-2">
          {services.map((s, i) => (
            <FadeUp key={s.code} delay={(i % 2) * 0.08}>
              <SpotCard k={s.key} href={s.href} className="flex min-h-[25rem] flex-col p-7 sm:p-9">
                <div className="flex items-center justify-between" aria-hidden="true">
                  <span className="flex items-center gap-2.5 rounded-full px-3 py-1.5 text-[12px] font-bold tracking-wide" style={{ background: tones[s.key].tint, color: tones[s.key].text }}>
                    <span className="size-2 rounded-full" style={{ background: diamonds[s.key] }} />
                    {s.code}
                  </span>{" "}
                  <span className="text-sm font-semibold text-mute tabular-nums">0{i + 1}</span>
                </div>{" "}
                <h3 className="h-title mt-10 text-[clamp(1.5rem,2.4vw,2rem)]">{s.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-graphite">{s.body}</p>
                <ul className="mt-6 grid gap-2.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-[15px] font-medium">
                      <Check color={tones[s.key].text} /> {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-end justify-between gap-6 pt-8">
                  <span className="text-[13px] text-mute">{s.ref}</span>{" "}
                  <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-line transition-all duration-500 group-hover:bg-brand group-hover:text-white group-hover:ring-brand">
                    <span className="transition-transform duration-500 group-hover:-rotate-45">
                      <Arrow />
                    </span>
                  </span>
                </div>
              </SpotCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
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
      className={`group relative block h-full overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-line transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${className}`}
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
            <Image src={skylinePhoto} alt="" fill sizes="100vw" className="object-cover" />
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
    <section className="py-18 sm:py-24">
      <div className="wrap">
        <Head no="03" title="By the numbers" lines={["Four decades of", "strata expertise."]} />
        <div className="mt-11 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.07} className="h-full">
              <div role="group" aria-label={s.phrase} className="flex h-full flex-col justify-between rounded-[1.5rem] bg-white p-7 ring-1 ring-line">
                <span className="flex items-center justify-between" aria-hidden="true">
                  <span className="text-sm font-semibold text-mute tabular-nums">0{i + 1}</span>
                  <Mark mono className="size-5 text-ink/15" />
                </span>
                <p className="mt-12">
                  <span className="h-display block text-[clamp(2.8rem,4.6vw,4rem)] text-brand">
                    {s.kind === "year" ? <Counter from={1950} to={s.value} duration={2.2} /> : <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} group={s.value >= 10000} />}
                  </span>{" "}
                  <span className="mt-2 block text-graphite">{s.label}</span>
                </p>
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
      <div className="mx-auto max-w-[90rem] rounded-[2rem] bg-mist py-16 sm:rounded-[2.5rem] sm:py-22">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
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

          <FadeUp>
            <div className="grain rounded-[1.75rem] bg-navy p-6 text-white shadow-[var(--shadow-lift)] sm:p-9">
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
        <div className="mt-11 grid items-stretch gap-4 lg:grid-cols-[1fr_1.15fr]">
          <FadeUp className="h-full">
            <div className="flex h-full flex-col rounded-[1.75rem] bg-white p-7 ring-1 ring-line sm:p-9">
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

          <FadeUp delay={0.08} className="h-full">
            <div className="h-full rounded-[1.75rem] bg-white p-3 ring-1 ring-line sm:p-4">
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

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v, i) => (
              <FadeUp key={v.title} delay={(i % 2) * 0.08} className={i % 2 ? "sm:translate-y-10" : ""}>
                <div className="group h-full rounded-[1.5rem] bg-white p-7 ring-1 ring-line transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]">
                  <span className="grid size-11 place-items-center rounded-full transition-transform duration-700 group-hover:rotate-90" style={{ background: tones[v.key].tint, color: tones[v.key].text }}>
                    <Mark className="size-5" />
                  </span>
                  <h3 className="h-title mt-8 text-[1.45rem]">{v.title}</h3>
                  <p className="mt-2.5 leading-relaxed text-graphite">{v.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* timeline */}
        <div className="relative mt-18 sm:mt-24">
          <div className="absolute top-[0.6rem] right-0 left-0 hidden h-px bg-line lg:block" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.8, ease: easeInOut }}
            className="absolute top-[0.6rem] right-0 left-0 hidden h-px origin-left bg-brand lg:block"
          />
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {timeline.map((t, i) => (
              <FadeUp as="li" key={t.year} delay={0.2 + i * 0.12} className="relative list-none">
                <div>
                  <span className="relative z-10 block size-5 rounded-full border-4 border-canvas bg-brand ring-1 ring-brand/30" />
                  <p className="h-display mt-6 text-[2.4rem] text-brand">{t.year}</p>{" "}
                  <p className="mt-3 max-w-xs leading-relaxed text-graphite">{t.text}</p>
                </div>
              </FadeUp>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ════════ Testimonials: draggable carousel ════════ */
const homeQuotes = ["Christine Nesbit", "Michael Kimpton", "Bryan", "Emma Fairbrother"].map(testimonialByName);

export function Quotes() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [max, setMax] = useState(0);
  const progress = useTransform(x, (v) => (max ? Math.min(1, Math.max(0, -v / max)) : 0));
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const measure = () => {
      if (!wrap.current || !track.current) return;
      setMax(Math.max(0, track.current.scrollWidth - wrap.current.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  useEffect(
    () =>
      x.on("change", (v) => {
        setAtStart(v > -4);
        setAtEnd(v < -max + 4);
      }),
    [x, max],
  );

  const step = () => (track.current?.firstElementChild as HTMLElement | null)?.offsetWidth ?? 400;
  const go = (d: number) => animate(x, Math.min(0, Math.max(-max, x.get() - d * (step() + 16))), { type: "spring", stiffness: 140, damping: 26 });

  return (
    <section className="overflow-hidden py-18 sm:py-24">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Chapter no="07" title="In their words" />
            <LineReveal className="h-display mt-6 text-[clamp(2.2rem,4.6vw,4rem)]" lines={["Trusted by strata", "managers and owners."]} />
          </div>
          <div className="flex items-center gap-2">
            {[-1, 1].map((d) => (
              <button
                key={d}
                onClick={() => go(d)}
                disabled={d < 0 ? atStart : atEnd}
                aria-label={d < 0 ? "Previous testimonials" : "Next testimonials"}
                className="grid size-12 place-items-center rounded-full bg-white ring-1 ring-line transition-all hover:bg-brand hover:text-white hover:ring-brand disabled:pointer-events-none disabled:opacity-35"
              >
                <Arrow className={`size-4 ${d < 0 ? "rotate-180" : ""}`} />
              </button>
            ))}
          </div>
        </div>

        <div ref={wrap} className="mt-11">
          <motion.div
            ref={track}
            drag="x"
            dragConstraints={{ left: -max, right: 0 }}
            dragElastic={0.08}
            dragTransition={{ power: 0.25, timeConstant: 260 }}
            style={{ x }}
            className="flex cursor-grab gap-4 active:cursor-grabbing"
          >
            {homeQuotes.map((t, i) => (
              <figure key={t.name} className="flex w-[19rem] shrink-0 flex-col justify-between rounded-[1.75rem] bg-white p-7 ring-1 ring-line select-none sm:w-[25rem] sm:p-8">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex gap-0.5 text-brand" aria-hidden="true">
                      {Array.from({ length: 5 }).map((_, n) => (
                        <svg key={n} viewBox="0 0 20 20" className="size-4" fill="currentColor">
                          <path d="m10 1.8 2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.7l-5.1 2.8 1.1-5.7-4.3-4 5.8-.7z" />
                        </svg>
                      ))}
                    </span>
                    <span className="text-sm text-mute tabular-nums" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <blockquote className="mt-6 text-[1.08rem] leading-relaxed text-ink">“{t.quote}”</blockquote>
                </div>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-5">
                  <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-mist text-sm font-bold text-brand">
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)}
                  </span>{" "}
                  <span>
                    <span className="block text-[15px] font-bold">{t.name}</span>{" "}
                    <span className="block text-[13px] text-mute">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </motion.div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
          <div className="h-px w-full max-w-xs bg-line">
            <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-brand" />
          </div>
          <LineLink href={paths.testimonials}>Read all {testimonialCount} testimonials</LineLink>
        </div>
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
      <div className="grain relative mx-auto max-w-[90rem] overflow-hidden rounded-[2rem] bg-navy py-16 text-white sm:rounded-[2.5rem] sm:py-22">
        <div className="pointer-events-none absolute -top-40 -left-20 size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(200_51_26/0.38),transparent_65%)]" />
        <motion.div style={{ rotate: rot }} className="pointer-events-none absolute -right-48 -bottom-48 w-[40rem]">
          <Mark line className="w-full text-white/[0.07]" />
        </motion.div>
        <div className="wrap relative">
          <Chapter no="08" title="Request a quote" dark />
          <LineReveal className="h-display mt-6 max-w-4xl text-[clamp(2.4rem,5.6vw,4.8rem)]" lines={["Make your next report", <span key="e" className="text-brand-soft">the easy part.</span>]} />
          <ol className="mt-11 grid gap-3 md:grid-cols-3">
            {steps.map((s, i) => (
              <FadeUp as="li" key={s.title} delay={i * 0.08} className="h-full list-none">
                <div className="h-full rounded-[1.5rem] bg-white/[0.06] p-7 ring-1 ring-white/10 backdrop-blur-sm">
                  <span className="grid size-10 place-items-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
                  <h3 className="h-title mt-8 text-xl">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/75">{s.body}</p>
                </div>
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
