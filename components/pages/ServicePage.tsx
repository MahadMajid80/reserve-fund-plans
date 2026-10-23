"use client";

import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaqList, PageHero, QuoteBand, SectionHead, ServiceCards } from "../PageKit";
import { Mark } from "../Diamonds";
import { Check } from "../Home";
import { A, Arrow, Chapter, Counter, FadeUp, LineReveal, ease, reveal } from "../ui";
import { useStill } from "@/lib/intro";
import { diamonds, tones, type DiamondKey } from "@/lib/content";
import { services as allServices, turnaround, type Service, type Special } from "@/lib/services";
import { facts, paths } from "@/lib/site";

export function ServicePage({ service: s }: { service: Service }) {
  const idx = allServices.findIndex((x) => x.slug === s.slug);

  return (
    <main>
      {/* Changes by Asad: compact hero (about a third of the screen), no photo */}
      <PageHero
        dark
        compact
        crumbs={[
          ["Home", paths.home],
          ["Services", paths.services],
          [s.h1, s.path],
        ]}
        issue={`${s.code} · Report 0${idx + 1} of 04`}
        accent={s.key}
        lines={[s.h1]}
        intro={s.tagline}
      />

      {/* facts */}
      <section className="pt-4 sm:pt-5">
        <dl className="wrap grid grid-cols-2 gap-3 lg:grid-cols-4">
          {s.facts.map((f, i) => (
            <FadeUp key={f.label} delay={i * 0.06} className="h-full rounded-[1.25rem] bg-white p-5 ring-1 ring-line sm:p-6">
              <dt className="flex items-center gap-2 text-[13px] text-mute">
                <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: diamonds[s.key] }} />
                {f.label}
              </dt>{" "}
              <dd className="h-title mt-3 text-[clamp(1.05rem,1.8vw,1.4rem)]">{f.value}</dd>
            </FadeUp>
          ))}
        </dl>
      </section>

      {/* why */}
      <section className="py-18 sm:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <Chapter no="01" title="The short answer" />
            <LineReveal className="h-display mt-6 text-[clamp(2.1rem,4.2vw,3.6rem)] [text-wrap:balance]" lines={[s.why.q]} />
          </div>
          <FadeUp className="prose-biv text-lg leading-relaxed text-graphite lg:pt-12">
            {s.why.a.map((p, i) => (
              <p key={p.slice(0, 30)} className={i === 0 ? "text-[1.3rem] leading-relaxed text-ink" : ""}>
                {p}
              </p>
            ))}
          </FadeUp>
        </div>
      </section>

      <Detail s={s} />

      <SpecialBlock special={s.special} k={s.key} />

      <Order s={s} />

      <section className="px-3 sm:px-5">
        <div className="wrap grid gap-4 lg:grid-cols-2">
          <FadeUp className="h-full">
            <div className="h-full rounded-[1.75rem] bg-white p-8 ring-1 ring-line sm:p-10">
              <h2 className="h-title text-[clamp(1.5rem,2.6vw,2rem)]">Further services</h2>
              <p className="mt-4 text-[1.05rem] leading-relaxed text-graphite">{s.further}</p>
            </div>
          </FadeUp>
          <FadeUp delay={0.08} className="h-full">
            <div className="grain h-full rounded-[1.75rem] bg-navy p-8 text-white sm:p-10">
              <h2 className="h-title text-[clamp(1.5rem,2.6vw,2rem)]">Turnaround time and fees</h2>
              <p className="mt-4 text-[1.05rem] leading-relaxed text-white/75">{turnaround}</p>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-18 sm:py-24">
        <div className="wrap">
          <SectionHead no="05" title="FAQ's" lines={[s.faq.h1]} text={s.faq.intro} />
          <div className="mt-11">
            <FaqList faqs={s.faq.faqs} k={s.key} group={`faq-${s.slug}`} />
          </div>
          <A href={s.faqPath} className="group mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-brand">
            All {s.faq.h1} on one page
            <span className="transition-transform group-hover:translate-x-1">
              <Arrow className="size-4" />
            </span>
          </A>
        </div>
      </section>

      <section className="pb-18 sm:pb-24">
        <div className="wrap">
          <Chapter no="06" title="More reports" />
          <h2 className="h-display mt-6 text-[clamp(2rem,3.6vw,3rem)]">Other reports we prepare</h2>
          <div className="mt-10">
            <ServiceCards exclude={s.slug} />
          </div>
        </div>
      </section>

      <QuoteBand title={`Order your ${s.noun}.`} />
    </main>
  );
}

/* ───────── Article with a sticky contents card ───────── */
function Detail({ s }: { s: Service }) {
  const still = useStill();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))), { rootMargin: "-40% 0px -55% 0px" });
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);
  const go = (i: number) => refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  const t = tones[s.key];

  return (
    <section className="px-3 sm:px-5">
      <div className="mx-auto max-w-[90rem] rounded-[2rem] bg-white py-16 ring-1 ring-line sm:rounded-[2.5rem] sm:py-22">
        <div className="wrap">
          <SectionHead no="02" title="In detail" lines={["Everything in the report,", "explained."]} />
          <div className="mt-11 grid gap-12 lg:grid-cols-[.6fr_1.4fr] lg:gap-20">
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-[1.5rem] bg-canvas p-3">
                <h3 className="eyebrow px-3 pt-2 pb-3 text-mute">Contents</h3>
                <ol className="grid gap-0.5">
                  {s.sections.map((sec, i) => (
                    <li key={sec.title}>
                      <button onClick={() => go(i)} className="relative flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left">
                        {active === i && <motion.span layoutId={`rail-${s.slug}`} className="absolute inset-0 rounded-xl bg-white shadow-[var(--shadow-soft)]" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                        <span aria-hidden="true" className="relative text-[12px] font-bold tabular-nums" style={{ color: active === i ? t.text : "#636363" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className={`relative text-[14px] transition-colors ${active === i ? "font-semibold text-ink" : "text-graphite hover:text-ink"}`}>{sec.title}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            <div className="space-y-16">
              {s.sections.map((sec, i) => (
                <article
                  key={sec.title}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  data-i={i}
                  className="scroll-mt-28"
                >
                  <FadeUp>
                    <div className="flex items-center gap-4">
                      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full text-[13px] font-bold tabular-nums" style={{ background: t.tint, color: t.text }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="h-title text-[clamp(1.5rem,2.6vw,2.1rem)]">{sec.title}</h3>
                    </div>
                    <div className="prose-biv mt-5 max-w-3xl text-[1.08rem] leading-relaxed text-graphite sm:pl-14">
                      {sec.body?.map((p) => (
                        <p key={p.slice(0, 30)}>{p}</p>
                      ))}
                    </div>
                    {sec.list && (
                      <ul className="mt-6 grid max-w-3xl gap-2 sm:pl-14">
                        {sec.list.map((li, n) => (
                          <motion.li
                            key={li}
                            {...reveal(still, { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, { delay: n * 0.04, duration: 0.6, ease })}
                            className="flex gap-3 rounded-xl bg-canvas px-4 py-3.5 leading-relaxed"
                          >
                            <Check color={t.text} className="mt-0.5 size-5" /> <span>{li}</span>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </FadeUp>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Ordering: steps along a line that fills as you scroll ───────── */
function Order({ s }: { s: Service }) {
  const ref = useRef<HTMLOListElement>(null);
  const still = useStill();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section className="py-18 sm:py-24">
      <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Chapter no="04" title="After you order" />
          <LineReveal className="h-display mt-6 text-[clamp(2.1rem,4.4vw,3.8rem)] [text-wrap:balance]" lines={[s.order.title]} />
          <FadeUp>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-graphite">{s.order.intro}</p>
            <div className="mt-8 rounded-[1.5rem] bg-navy p-6 text-white">
              <p className="h-display text-[2.4rem] text-brand-soft">{facts.turnaround}</p>
              <p className="mt-2 leading-relaxed text-white/75">Normal turnaround</p>
            </div>
          </FadeUp>
        </div>
        <ol ref={ref} className="relative">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[1.2rem] w-px bg-line" />
          <motion.span aria-hidden="true" style={{ scaleY: still ? 1 : fill }} className="absolute top-2 bottom-2 left-[1.2rem] w-px origin-top">
            <span className="block size-full" style={{ background: diamonds[s.key] }} />
          </motion.span>
          {s.order.steps.map((st, i) => (
            <Step key={st} i={i} text={st} k={s.key} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Step({ i, text, k }: { i: number; text: string; k: DiamondKey }) {
  const ref = useRef<HTMLLIElement>(null);
  const still = useStill();
  // off the homepage there are no scroll animations: every step is shown in its finished state
  const seen = useInView(ref, { once: true, margin: "-20% 0px -40% 0px" }) || still;
  return (
    <li ref={ref} className="relative grid grid-cols-[2.4rem_1fr] gap-5 pb-6 last:pb-0">
      <motion.span
        initial={false}
        aria-hidden="true"
        animate={{ backgroundColor: seen ? diamonds[k] : "#ffffff", color: seen ? tones[k].on : "#636363" }}
        transition={{ duration: 0.5 }}
        className="relative z-10 grid size-[2.4rem] place-items-center rounded-full text-[13px] font-bold tabular-nums ring-1 ring-line"
      >
        {String(i + 1).padStart(2, "0")}
      </motion.span>
      <motion.p initial={false} animate={{ opacity: seen ? 1 : 0.8, x: seen ? 0 : 8 }} transition={{ duration: 0.6, ease }} className="rounded-[1.25rem] bg-white p-5 text-[1.05rem] leading-relaxed font-medium ring-1 ring-line sm:p-6">
        {text}
      </motion.p>
    </li>
  );
}

/* ───────── Per-report interactive block ───────── */
function SpecialBlock({ special, k }: { special: Special; k: DiamondKey }) {
  return (
    <section className="px-3 pt-4 sm:px-5 sm:pt-5">
      <div className="mx-auto max-w-[90rem] rounded-[2rem] bg-mist py-16 sm:rounded-[2.5rem] sm:py-22">
        <div className="wrap">
          {special.kind === "frequency" && <Frequency sp={special} k={k} />}
          {special.kind === "consider" && <Consider sp={special} k={k} />}
          {special.kind === "hazards" && <Hazards sp={special} k={k} />}
          {special.kind === "penalties" && <Penalties sp={special} k={k} />}
        </div>
      </div>
    </section>
  );
}

function Frequency({ sp }: { sp: Extract<Special, { kind: "frequency" }>; k: DiamondKey }) {
  const [i, setIndex] = useState(4);
  // nothing animates on page load; the figures animate only when the visitor picks another property type
  const [touched, setTouched] = useState(false);
  const setI = (n: number) => {
    setTouched(true);
    setIndex(n);
  };
  const row = sp.rows[i];
  const marks: number[] = [];
  for (let t = 0; t <= 10.001; t += row.years) marks.push(t);
  return (
    <>
      <SectionHead no="03" title="Revaluation guide" lines={[sp.title]} text={sp.intro} />
      <div className="mt-11 grid gap-4 lg:grid-cols-[1fr_1.05fr]">
        <ul className="grid gap-1 rounded-[1.75rem] bg-white p-2 ring-1 ring-line" aria-label="Property type">
          {sp.rows.map((r, n) => (
            <li key={r.type}>
              <button
                type="button"
                aria-pressed={n === i}
                onClick={() => setI(n)}
                onMouseEnter={() => setI(n)}
                className={`relative flex min-h-11 w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] transition-colors ${n === i ? "text-white" : "text-graphite hover:text-ink"}`}
              >
                {n === i && <motion.span layoutId="freq-on" className="absolute inset-0 rounded-2xl bg-brand" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                <span className={`relative size-2 shrink-0 rounded-full ${n === i ? "bg-brand-soft" : "bg-ink/15"}`} />
                <span className="relative font-medium">{r.type}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="grain rounded-[1.75rem] bg-navy p-7 text-white sm:p-10 lg:sticky lg:top-28 lg:self-start">
          <p className="text-[14px] text-white/75">Recommended minimum</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={row.every} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.4, ease }} className="h-display mt-3 text-[clamp(2.6rem,5.6vw,4.6rem)] text-brand-soft">
              {row.every}
            </motion.p>
          </AnimatePresence>
          <div className="mt-12">
            <div aria-hidden="true" className="flex justify-between text-[12px] font-semibold text-white/60">
              {Array.from({ length: 11 }).map((_, y) => (
                <span key={y} className={y % 2 ? "hidden sm:inline" : ""}>
                  Y{y}
                </span>
              ))}
            </div>
            <div aria-hidden="true" className="relative mt-3 h-12">
              <div className="absolute top-1/2 h-px w-full bg-white/20" />
              {marks.map((m, n) => (
                <motion.span
                  key={`${row.years}-${m}`}
                  initial={touched ? { scale: 0 } : false}
                  animate={{ scale: 1 }}
                  transition={{ delay: n * 0.05, type: "spring", stiffness: 260, damping: 18 }}
                  className="absolute top-1/2 -mt-2 -ml-2 size-4 rounded-full bg-brand ring-4 ring-white/15"
                  style={{ left: `${(m / 10) * 100}%` }}
                />
              ))}
            </div>
            <p className="mt-6 text-white/75" aria-live="polite">
              {marks.length} valuations over 10 years. Each point is a revaluation by a Registered Valuer.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Consider({ sp, k }: { sp: Extract<Special, { kind: "consider" }>; k: DiamondKey }) {
  const still = useStill();
  const t = tones[k];
  return (
    <>
      <SectionHead no="03" title="Why a good plan pays for itself" lines={["Points of", "consideration."]} />
      <ul className="mt-11 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {sp.points.map((p, n) => (
          <motion.li
            key={p}
            {...reveal(still, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, { delay: (n % 5) * 0.05, duration: 0.6, ease })}
            className="flex min-h-36 flex-col justify-between gap-6 rounded-[1.25rem] bg-white p-5 ring-1 ring-line"
          >
            <Check color={t.text} className="size-7" /> <span className="font-semibold leading-snug">{p}</span>
          </motion.li>
        ))}
      </ul>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <FadeUp className="h-full">
          <div className="grain h-full rounded-[1.75rem] bg-navy p-8 text-white sm:p-12">
            <h3 className="text-[14px] font-semibold text-white/75">{sp.goal}</h3>
            <p className="h-display mt-5 text-[clamp(1.8rem,3.4vw,2.8rem)] text-brand-soft">{sp.is}</p>
          </div>
        </FadeUp>
        <FadeUp delay={0.1} className="h-full">
          <div className="h-full rounded-[1.75rem] bg-white p-8 ring-1 ring-line sm:p-12">
            <h3 className="text-[14px] font-semibold text-mute">{sp.isNotTitle}</h3>
            <ul className="mt-5 grid gap-4">
              {sp.isNot.map((n, j) => (
                <li key={n} className="relative w-fit text-xl font-semibold">
                  {n}
                  <motion.span aria-hidden="true" {...reveal(still, { scaleX: 0 }, { scaleX: 1 }, { delay: 0.3 + j * 0.12, duration: 0.6, ease })} className="absolute top-1/2 left-0 h-[2px] w-full origin-left bg-oxblood" />
                </li>
              ))}
            </ul>
          </div>
        </FadeUp>
      </div>
      <FadeUp className="mt-11">
        <h3 className="eyebrow text-mute">Final points to consider</h3>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {sp.final.map((f) => (
            <li key={f} className="flex gap-3 rounded-xl bg-white/70 p-4 leading-relaxed text-graphite ring-1 ring-line">
              <Check color={t.text} className="mt-0.5 size-5" /> {f}
            </li>
          ))}
        </ul>
      </FadeUp>
    </>
  );
}

const hazardIcons: Record<string, React.ReactNode> = {
  Trip: <path d="M4 18h6v-4h10M14 14l-3-6" />,
  Fall: <path d="M6 4h7v6M13 10v10M9 16l4 4 4-4" />,
  Electrical: <path d="M13 3 6 13h5l-1 8 7-10h-5z" />,
  Protrusion: <path d="M3 18h18M8 18l4-12 4 12" />,
  Slip: <path d="M3 16c3 0 3-3 6-3s3 3 6 3 3-3 6-3M3 20c3 0 3-3 6-3s3 3 6 3 3-3 6-3" />,
};

function Hazards({ sp, k }: { sp: Extract<Special, { kind: "hazards" }>; k: DiamondKey }) {
  const still = useStill();
  const t = tones[k];
  return (
    <>
      <SectionHead no="03" title="What we look for" lines={[sp.title]} text={sp.intro} />
      <div className="mt-11 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {sp.hazards.map((h, n) => (
          <motion.div
            key={h}
            {...reveal(still, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, { delay: n * 0.07, duration: 0.8, ease })}
            className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-[1.5rem] bg-white p-6 ring-1 ring-line transition-colors duration-500 hover:text-white"
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 rounded-[1.5rem] bg-brand transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-y-100" />
            <span aria-hidden="true" className="relative grid size-14 place-items-center rounded-full transition-colors duration-500 group-hover:!bg-white/10 group-hover:!text-white" style={{ background: t.tint, color: t.text }}>
              <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {hazardIcons[h]}
              </svg>
            </span>
            <h3 className="h-title relative text-[clamp(1.3rem,2.2vw,1.7rem)]">{h}</h3>
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-lg text-graphite">{sp.note}</p>
    </>
  );
}

function Penalties({ sp, k }: { sp: Extract<Special, { kind: "penalties" }>; k: DiamondKey }) {
  const still = useStill();
  const max = Math.max(...sp.rows.map((r) => r.corp));
  return (
    <>
      <SectionHead no="03" title="The cost of not complying" lines={[sp.title]} text={sp.intro} />
      <div className="mt-11 grid gap-3">
        {sp.rows.map((r, n) => (
          <FadeUp key={r.category} delay={n * 0.08}>
            <div className="grid gap-6 rounded-[1.5rem] bg-white p-6 ring-1 ring-line sm:p-8 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
              <div>
                <h3 className="inline-flex rounded-full px-3 py-1.5 text-[12px] font-bold" style={{ background: tones[k].tint, color: tones[k].text }}>
                  {r.category}
                </h3>
                <p className="mt-4 leading-relaxed text-graphite">{r.desc}</p>
              </div>
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[14px] text-mute">Maximum penalty for a corporation</span>{" "}
                  <span className="h-display text-right text-[clamp(1.8rem,3.4vw,2.8rem)]">
                    <Counter to={r.corp} prefix="$" group duration={1.6} />
                  </span>
                </div>
                <div aria-hidden="true" className="mt-3 h-2 overflow-hidden rounded-full bg-canvas">
                  <motion.div {...reveal(still, { width: 0 }, { width: `${(r.corp / max) * 100}%` }, { duration: 1.4, ease, delay: 0.2 })} className="h-full rounded-full" style={{ background: diamonds[k] }} />
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-canvas p-3.5">
                    <dt className="text-[13px] text-mute">Maximum penalty for an officer</dt>
                    <dd className="mt-1 font-semibold">{r.officer}</dd>
                  </div>
                  <div className="rounded-xl bg-canvas p-3.5">
                    <dt className="text-[13px] text-mute">Maximum penalty for a worker</dt>
                    <dd className="mt-1 font-semibold">{r.worker}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </>
  );
}
