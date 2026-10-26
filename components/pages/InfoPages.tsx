"use client";

import { Photo } from "../Photo";
import { photos } from "@/lib/photos";
import { Email } from "@/components/Email";
import { AnimatePresence, LayoutGroup, motion, useMotionValue, useSpring } from "framer-motion";
import { useMemo, useState } from "react";
import { Mark } from "../Diamonds";
import { Coverage } from "../Home";
import { FaqList, PageHero, QuoteBand, SectionHead, ServiceCards } from "../PageKit";
import { A, Arrow, Chapter, Counter, FadeUp, ease, reveal } from "../ui";
import { useStill } from "@/lib/intro";
import { contact, diamonds, stats, timeline, tones, values } from "@/lib/content";
import { faqId, services, totalFaqs, type Service } from "@/lib/services";
import { facts, org, paths } from "@/lib/site";
import { allTestimonials, tags, testimonialByName, testimonialCount, type Tag } from "@/lib/testimonials";

/* ════════════════════════ ABOUT ════════════════════════ */

const credentials = [
  "Registered Valuers since 1984",
  "Licensed Real Estate Agents",
  "Qualified Asbestos and Work Health and Safety specialists",
  "Directors serve on government and industry committees",
  "Expert evidence in Federal and State Courts",
  "Cover of Excellence scheme, Professional Standards Councils",
  `${facts.indemnity} Professional Indemnity Insurance`,
  "Bound by our Institutes’ Code of Professional Conduct and Ethics",
];

export function AboutPage() {
  return (
    <main>
      <PageHero
        photo="glassTower"
        size="md"
        crumbs={[
          ["Home", paths.home],
          ["About us", paths.about],
        ]}
        issue="About us · Since 1984"
        lines={["About Reserve Fund Plans:", <span key="p" className="text-brand">Registered Valuers since 1984</span>]}
        intro={`Since 1984, we have ${facts.years} experience in valuing a very wide variety of properties, from carrying out due diligence on the largest property transactions in Australia through to the smallest of suburban cottages.`}
        aside={
          <div role="group" aria-label="Valuing property since 1984" className="glass flex items-center gap-4 rounded-2xl p-4 ring-1 ring-white/60">
            <span className="h-display text-[2rem] text-brand">
              <Counter from={1950} to={1984} duration={2} />
            </span>{" "}
            <span className="text-[13px] leading-snug text-graphite">Valuing everything from landmark transactions to suburban cottages</span>
          </div>
        }
      />

      {/* numbers */}
      <section aria-label="Reserve Fund Plans in numbers">
        <div className="wrap grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.06} className="h-full">
              <div role="group" aria-label={s.phrase} className="@container h-full rounded-card bg-white p-6 ring-1 ring-line sm:p-7">
                <p>
                  <span className="h-display block text-[min(3.6rem,19cqw)] leading-none whitespace-nowrap text-brand tabular-nums">
                    {s.kind === "year" ? <Counter from={1950} to={s.value} duration={2} /> : <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} group={s.value >= 10000} />}
                  </span>{" "}
                  <span className="mt-3 block text-[15px] text-graphite">{s.label}</span>
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* history */}
      <section className="py-18 sm:py-24">
        <div className="wrap">
          <SectionHead
            no="01"
            title="The story so far"
            lines={["Our history"]}
            text={`We are experts in the presentation of expert evidence in both Federal and State Court systems. We have particular expertise in strata property, having inspected ${facts.schemesInspected} strata schemes in New South Wales.`}
          />
          <ol className="mt-11 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {timeline.map((t, i) => (
              <FadeUp as="li" key={t.year} delay={i * 0.08} className="h-full list-none">
                <div className="h-full rounded-card bg-white p-7 ring-1 ring-line">
                  <span className="flex items-center gap-2" aria-hidden="true">
                    {timeline.map((_, n) => (
                      <span key={n} className={`h-1 rounded-full ${n <= i ? "w-6 bg-brand" : "w-3 bg-ink/10"}`} />
                    ))}
                  </span>
                  <p className="h-display mt-10 text-[2.6rem] text-brand">{t.year}</p>{" "}
                  <p className="mt-3 leading-relaxed text-graphite">{t.text}</p>
                </div>
              </FadeUp>
            ))}
          </ol>
        </div>
      </section>

      {/* values */}
      <section className="px-3 sm:px-5">
        <div className="mx-auto max-w-[90rem] rounded-panel bg-mist py-16 sm:rounded-panel sm:py-22">
          <div className="wrap">
            <SectionHead no="02" title="Four diamonds" lines={["Our values"]} text="Each diamond in our logo stands for something we hold ourselves to." />
            <div className="mt-11 grid gap-4 md:grid-cols-2">
              {values.map((v, i) => (
                <FadeUp key={v.title} delay={(i % 2) * 0.1} className="h-full">
                  <div className="group flex h-full min-h-[18rem] flex-col justify-between rounded-card bg-white p-8 ring-1 ring-line transition-shadow duration-500 hover:shadow-[var(--shadow-lift)] sm:p-10">
                    <span className="flex items-center justify-between" aria-hidden="true">
                      <span className="grid size-12 place-items-center rounded-full transition-transform duration-700 group-hover:rotate-90" style={{ background: tones[v.key].tint, color: tones[v.key].text }}>
                        <Mark className="size-6" />
                      </span>
                      <span className="text-sm font-semibold text-mute tabular-nums">0{i + 1}</span>
                    </span>
                    <div className="mt-10">
                      <h3 className="h-display text-[clamp(2rem,3.6vw,3rem)]">{v.title}</h3>
                      <p className="mt-3 max-w-xl leading-relaxed text-graphite">{v.full}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* vision & mission */}
      <section className="py-18 sm:py-24">
        <div className="wrap grid gap-4 lg:grid-cols-2">
          {/* TODO [ASK] (Australian Consumer Law): the vision makes comparative claims ("most accurate … available", "simply the best available").
              Kept from the old About page. Suggested: "Our clients receive accurate, practical property reports in an Easy to Read Report format,
              backed by advice that is properly researched in detail." */}
          {[
            {
              dark: true,
              label: "Our vision",
              t: "Our clients have the most accurate and practical property reports available, in an Easy to Read Report format.",
              s: "Our advice is properly researched in detail, and is simply the best available in the market.",
            },
            { dark: false, label: "Our mission", t: "Our mission starts with our clients, by simply making their work easier and enjoyable.", s: "We work together with our clients to achieve a positive and rewarding outcome." },
          ].map((b, i) => (
            <FadeUp key={b.label} delay={i * 0.1} className="h-full">
              <div className={`relative h-full overflow-hidden rounded-panel p-8 sm:p-12 ${b.dark ? "grain bg-navy text-white" : "bg-white ring-1 ring-line"}`}>
                {b.dark && <Mark line className="pointer-events-none absolute -right-20 -bottom-20 w-80 text-white/[0.07]" />}
                <h2 className={`eyebrow ${b.dark ? "text-brand-soft" : "text-brand"}`}>{b.label}</h2>
                <p className="h-display relative mt-8 text-[clamp(1.8rem,3.2vw,2.7rem)]">{b.t}</p>
                <p className={`relative mt-8 max-w-md text-lg ${b.dark ? "text-white/75" : "text-graphite"}`}>{b.s}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* credentials */}
      <section className="px-3 sm:px-5">
        <div className="grain mx-auto max-w-[90rem] overflow-hidden rounded-panel bg-navy py-16 text-white sm:rounded-panel sm:py-22">
          <div className="wrap">
            <SectionHead dark no="03" title="Credentials" lines={["Qualified, insured", "and independent."]} text="We are not affiliated with any maintenance companies, and our recommendations don’t rely on referrals. Think of us as independent auditors with practical recommendations." />
            <ul className="mt-11 grid gap-3 md:grid-cols-2">
              {credentials.map((c, i) => (
                <FadeUp as="li" key={c} delay={(i % 4) * 0.05} className="flex list-none items-center gap-4 rounded-2xl bg-white/[0.05] p-5 ring-1 ring-white/10">
                    <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/25 text-brand-soft">
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    <span className="text-[1.05rem] font-semibold">{c}</span>
                </FadeUp>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-18 sm:py-24">
        <div className="wrap">
          <SectionHead no="04" title="What we do" lines={["Four reports,", "one easy format."]} />
          <div className="mt-11">
            <ServiceCards />
          </div>
        </div>
      </section>

      <QuoteBand title="Let’s make your job easier." />
    </main>
  );
}

/* ════════════════════════ SERVICES INDEX ════════════════════════ */

export function ServicesIndexPage() {
  const still = useStill();
  const [hover, setHover] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 160, damping: 22 });
  const y = useSpring(my, { stiffness: 160, damping: 22 });
  const sarah = testimonialByName("Emma Fairbrother");

  return (
    <main>
      <PageHero
        size="md"
        crumbs={[
          ["Home", paths.home],
          ["Services", paths.services],
        ]}
        issue="Four reports"
        lines={["Strata Reports and Valuations", <span key="c" className="text-brand">We Provide</span>]}
        intro="Reserve Fund Plans, Building Insurance Valuations, WHS Reports and Asbestos Reports. Every report is properly researched and presented in our Easy to Read Report format, so strata managers and councils of owners can act with confidence."
      />

      {/* row list with a floating preview that follows the cursor (desktop) */}
      <section
        className="relative pb-16"
        onPointerMove={(e) => {
          mx.set(e.clientX);
          my.set(e.clientY);
        }}
      >
        <div className="wrap">
          <ul className="border-t border-line" onMouseLeave={() => setHover(null)}>
            {services.map((s, i) => (
              <motion.li
                key={s.slug}
                {...reveal(still, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, { duration: 0.8, ease, delay: i * 0.06 })}
                onMouseEnter={() => setHover(i)}
                className="border-b border-line"
              >
                <A href={s.path} className="group relative block py-8 sm:py-10">
                  <span aria-hidden="true" className="absolute inset-y-2 -inset-x-4 scale-y-90 rounded-card bg-white opacity-0 shadow-[var(--shadow-soft)] transition-all duration-500 group-hover:scale-y-100 group-hover:opacity-100 sm:-inset-x-6" />
                  <span className="relative grid items-center gap-5 lg:grid-cols-[4rem_1.3fr_1fr_auto] lg:gap-10">
                    <span className="flex items-center gap-3 lg:block" aria-hidden="true">
                      <span className="text-sm font-semibold text-mute tabular-nums">0{i + 1}</span>
                      <span className="rounded-full px-2.5 py-1 text-[11px] font-bold lg:hidden" style={{ background: tones[s.key].tint, color: tones[s.key].text }}>
                        {s.code}
                      </span>
                    </span>{" "}
                    <span>
                      <span className="h-display block text-[clamp(1.8rem,3.6vw,3rem)] transition-transform duration-500 group-hover:translate-x-2">{s.title}</span>{" "}
                      <span className="mt-2 block text-graphite">{s.excerpt}</span>{" "}
                      <span className="mt-1 block text-[15px] text-mute">{s.tagline}</span>
                    </span>{" "}
                    <span className="grid grid-cols-2 gap-x-6 gap-y-3">
                      {s.facts.map((f) => (
                        <span key={f.label} className="block">
                          <span className="block text-[12px] text-mute">{f.label}</span>{" "}
                          <span className="block text-[14px] font-semibold">{f.value}</span>{" "}
                        </span>
                      ))}
                    </span>
                    <span aria-hidden="true" className="hidden size-14 place-items-center rounded-full ring-1 ring-line transition-all duration-500 group-hover:bg-brand group-hover:text-white group-hover:ring-brand lg:grid">
                      <span className="transition-transform duration-500 group-hover:-rotate-45">
                        <Arrow className="size-5" />
                      </span>
                    </span>
                  </span>
                </A>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div style={{ x, y }} className="pointer-events-none fixed top-0 left-0 z-30 hidden lg:block" aria-hidden="true">
          <AnimatePresence>
            {hover !== null && (
              <motion.div
                key="pv"
                initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.45, ease }}
                className="relative -mt-36 ml-8 h-56 w-44 overflow-hidden rounded-card shadow-[var(--shadow-lift)]"
              >
                <Photo k="apartmentTowers" decorative fill sizes="176px" className="object-cover" />
                <motion.div key={hover} initial={{ opacity: 0 }} animate={{ opacity: 0.55 }} transition={{ duration: 0.4 }} className="absolute inset-0 mix-blend-multiply" style={{ background: diamonds[services[hover].key] }} />
                <span className="absolute inset-x-3 bottom-3 rounded-full bg-white/90 px-3 py-1.5 text-center text-[11px] font-bold text-ink">{services[hover].code} · View report</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* client quote carried over from the old /services/ page */}
      <section className="pb-8">
        <div className="wrap">
          <FadeUp>
            <figure className="rounded-panel bg-white p-8 ring-1 ring-line sm:p-12">
              <blockquote className="max-w-4xl text-[clamp(1.15rem,2vw,1.5rem)] leading-relaxed font-medium text-ink">“{sarah.quote}”</blockquote>
              <figcaption className="mt-6 text-graphite">
                <span className="font-bold text-ink">{sarah.name}</span>, {sarah.role}
              </figcaption>
            </figure>
          </FadeUp>
        </div>
      </section>

      <Coverage no="01" />

      <QuoteBand />
    </main>
  );
}

/* ════════════════════════ FAQ HUB (/faq/) ════════════════════════ */

export function FaqHubPage() {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const groups = useMemo(
    () => services.map((s) => ({ s, faqs: s.faq.faqs.filter((f) => !term || f.q.toLowerCase().includes(term) || f.a.join(" ").toLowerCase().includes(term)) })).filter((g) => g.faqs.length),
    [term],
  );
  const total = groups.reduce((n, g) => n + g.faqs.length, 0);

  return (
    <main>
      <PageHero
        crumbs={[
          ["Home", paths.home],
          ["FAQ's", paths.faq],
        ]}
        issue={`${totalFaqs} questions`}
        lines={["Frequently Asked", <span key="a" className="text-brand">Questions</span>]}
        intro="Everything owners and strata managers ask us about Reserve Fund Plans, Building Insurance Valuations, WHS Reports and Asbestos Reports. Choose a topic, or search below."
      >
        <div className="relative mt-10 max-w-2xl">
          <label htmlFor="faq-search" className="sr-only">
            Search questions
          </label>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-mute" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id="faq-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search, e.g. how often"
            className="w-full rounded-full bg-white py-4.5 pr-6 pl-13 text-lg shadow-[var(--shadow-soft)] ring-1 ring-line outline-none transition-shadow placeholder:text-mute focus:ring-2 focus:ring-brand/40"
          />
        </div>
      </PageHero>

      <section className="pb-18 sm:pb-24">
        <div className="wrap">
          <p className="text-sm text-mute" aria-live="polite">
            {total} {total === 1 ? "question" : "questions"}
            {term && ` matching “${q.trim()}”`}
          </p>
          {groups.length === 0 ? (
            <div className="mt-8 rounded-card bg-white p-10 ring-1 ring-line">
              <p className="h-title text-[clamp(1.6rem,3vw,2.2rem)]">No questions match that search.</p>
              <p className="mt-3 text-lg text-graphite">
                Try another word, or ask us directly on{" "}
                <a className="font-semibold text-brand underline underline-offset-4" href={contact.phoneHref}>
                  {contact.phone}
                </a>
                .
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {groups.map((g) => (
                <div key={g.s.slug} className="flex flex-col rounded-card bg-white p-7 ring-1 ring-line sm:p-9">
                  <span aria-hidden="true" className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold" style={{ background: tones[g.s.key].tint, color: tones[g.s.key].text }}>
                    <span className="size-2 rounded-full" style={{ background: diamonds[g.s.key] }} />
                    {g.s.code}
                  </span>{" "}
                  <h2 className="h-title mt-6 text-[clamp(1.5rem,2.4vw,2rem)]">
                    <A href={g.s.faqPath} className="hover:text-brand">
                      {g.s.faq.h1}
                    </A>
                  </h2>
                  <ul className="mt-5 grid gap-1">
                    {g.faqs.map((f) => (
                      <li key={f.q}>
                        <A href={`${g.s.faqPath}#${faqId(f.q)}`} className="group flex min-h-11 items-start gap-3 rounded-xl px-3 py-2.5 text-[15px] leading-snug text-graphite transition-colors hover:bg-canvas hover:text-ink">
                          <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ background: diamonds[g.s.key] }} />
                          {f.q}
                        </A>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-6 text-sm font-semibold">
                    <A href={g.s.faqPath} className="inline-flex min-h-11 items-center gap-2 text-brand">
                      Read all the answers <Arrow className="size-3.5" />
                    </A>
                    <A href={g.s.path} className="inline-flex min-h-11 items-center gap-2 text-graphite hover:text-ink">
                      About our {g.s.name}
                    </A>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <QuoteBand title="Still have a question?" text={
          <>
            Call us on{" "}
            <a href={contact.phoneHref} className="font-semibold text-white underline underline-offset-4">
              {contact.phone}
            </a>{" "}
            or email{" "}
            <Email className="font-semibold text-white underline underline-offset-4" />
            . We keep all client communications strictly confidential.
          </>
        } />
    </main>
  );
}

/* ════════════════════════ ONE FAQ TOPIC (e.g. /building-insurance-valuation/) ════════════════════════ */

export function FaqTopicPage({ service: s }: { service: Service }) {
  const others = services.filter((x) => x.slug !== s.slug);
  return (
    <main>
      <PageHero
        crumbs={[
          ["Home", paths.home],
          ["FAQ's", paths.faq],
          [s.faq.h1, s.faqPath],
        ]}
        issue={`${s.faq.faqs.length} questions · ${s.code}`}
        accent={s.key}
        lines={[s.faq.h1]}
        intro={s.faq.intro}
      />
      <section className="pb-18 sm:pb-24">
        <div className="wrap grid gap-6 lg:grid-cols-[1.45fr_.55fr] lg:gap-10">
          <FaqList faqs={s.faq.faqs} k={s.key} level={2} startOpen={0} group={`faq-${s.slug}`} />
          <aside className="grid content-start gap-4 lg:sticky lg:top-28 lg:self-start">
            <div className="grain rounded-card bg-navy p-7 text-white">
              <Mark className="size-8" />
              <p className="h-title mt-8 text-[1.4rem]">Our {s.name}</p>
              <p className="mt-2 leading-relaxed text-white/75">{s.tagline}</p>
              <A href={s.path} className="group mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-brand-soft">
                About our {s.name}
                <span className="transition-transform group-hover:translate-x-1">
                  <Arrow className="size-3.5" />
                </span>
              </A>
            </div>
            <nav aria-label="Other FAQ's" className="rounded-card bg-white p-3 ring-1 ring-line">
              <p className="eyebrow px-3 pt-2 pb-2 text-mute">Other FAQ's</p>
              <ul>
                {others.map((o) => (
                  <li key={o.slug}>
                    <A href={o.faqPath} className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-[15px] font-semibold transition-colors hover:bg-canvas">
                      <span aria-hidden="true" className="size-2 rounded-full" style={{ background: diamonds[o.key] }} />
                      {o.faq.h1}
                    </A>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>
      <QuoteBand title={`Order your ${s.noun}.`} text={
          <>
            Call us on{" "}
            <a href={contact.phoneHref} className="font-semibold text-white underline underline-offset-4">
              {contact.phone}
            </a>{" "}
            or email{" "}
            <Email className="font-semibold text-white underline underline-offset-4" />
            . We keep all client communications strictly confidential.
          </>
        } />
    </main>
  );
}

/* ════════════════════════ TESTIMONIALS ════════════════════════ */

const initials = (n: string) =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .replace(/[^A-Z]/gi, "")
    .slice(0, 2);

export function TestimonialsPage() {
  const [tag, setTag] = useState<Tag | "All">("All");
  const featured = allTestimonials.find((t) => t.featured)!;
  const list = allTestimonials.filter((t) => tag === "All" || t.tags.includes(tag));

  return (
    <main>
      <PageHero
        size="md"
        crumbs={[
          ["Home", paths.home],
          ["Testimonials", paths.testimonials],
        ]}
        issue={`${testimonialCount} reviews`}
        lines={["Testimonials from Strata Managers", <span key="o" className="text-brand">and Property Professionals</span>]}
        intro="Strata managers and real estate principals on working with our team. These testimonials name BIV Reports, our sister brand."
      />

      {/* featured: the one-hour answer */}
      <section className="px-3 sm:px-5">
        <div className="grain relative mx-auto max-w-[90rem] overflow-hidden rounded-panel bg-navy py-16 text-white sm:rounded-panel sm:py-24">
          <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-center lg:gap-16">
            <FadeUp>
              <Chapter no="01" title="The one-hour answer" dark />
              <p className="h-display mt-6 text-[clamp(4.5rem,11vw,9rem)] leading-none text-brand-soft tabular-nums" aria-hidden="true">
                1 hr
              </p>
              <p className="mt-3 text-white/75">from an emailed question to a phone call and an answer</p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="text-[clamp(1.3rem,2.4vw,2rem)] leading-snug font-medium [text-wrap:balance]">
                “We emailed a question to BIV Reports and within an hour we had a reply phone call and an answer. These guys are prompt, professional and caring…”
              </p>
              <p className="mt-8 flex items-center gap-3">
                <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-brand text-sm font-bold text-white">
                  {initials(featured.name)}
                </span>{" "}
                <span>
                  <span className="block font-bold">{featured.name}</span>{" "}
                  <span className="block text-sm text-white/75">{featured.role}</span>
                </span>
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      <section className="py-18 sm:py-24">
        <div className="wrap">
          <SectionHead no="02" title="All reviews" lines={["What people", "keep telling us."]} />
          <LayoutGroup>
            <div className="mt-12 flex flex-wrap gap-2" role="group" aria-label="Filter testimonials by topic">
              {(["All", ...tags] as const).map((t) => {
                const on = tag === t;
                const count = t === "All" ? testimonialCount : allTestimonials.filter((x) => x.tags.includes(t)).length;
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setTag(t)}
                    className={`relative min-h-11 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${on ? "text-white" : "bg-white text-graphite ring-1 ring-line hover:text-ink"}`}
                  >
                    {on && <motion.span layoutId="t-tab" className="absolute inset-0 rounded-full bg-brand" transition={{ type: "spring", stiffness: 340, damping: 32 }} />}
                    <span className="relative">
                      {t} <span className={on ? "" : "text-mute"}>({count})</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="sr-only" aria-live="polite">
              Showing {list.length} of {testimonialCount} testimonials
            </p>

            <motion.ul layout className="mt-10 columns-1 gap-4 md:columns-2 xl:columns-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {list.map((t, n) => {
                  const dark = n % 6 === 1;
                  return (
                    <motion.li
                      layout
                      key={t.name}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.45, ease }}
                      className="mb-4 break-inside-avoid"
                    >
                      <figure className={`rounded-card p-7 sm:p-8 ${dark ? "grain bg-brand text-white" : "bg-white ring-1 ring-line"}`}>
                        <ul className="flex flex-wrap gap-1.5" aria-label="Topics">
                          {t.tags.map((x) => (
                            <li key={x} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${dark ? "bg-white/10 text-white/85" : "bg-canvas text-graphite"}`}>
                              {x}
                              <span className="sr-only">,</span>{" "}
                            </li>
                          ))}
                        </ul>{" "}
                        <blockquote className={`mt-5 leading-relaxed ${dark ? "text-[1.2rem] font-medium" : "text-[1.05rem] text-ink"}`}>“{t.quote}”</blockquote>
                        <figcaption className={`mt-6 flex items-center gap-3 border-t pt-5 ${dark ? "border-white/15" : "border-line"}`}>
                          <span aria-hidden="true" className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold ${dark ? "bg-white text-brand" : "bg-mist text-brand"}`}>
                            {initials(t.name)}
                          </span>{" "}
                          <span>
                            <span className="block font-bold">{t.name}</span>{" "}
                            <span className={`block text-sm ${dark ? "text-white/80" : "text-mute"}`}>{t.role}</span>
                          </span>
                        </figcaption>
                      </figure>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          </LayoutGroup>
        </div>
      </section>

      <QuoteBand title="Join them." />
    </main>
  );
}

/* ════════════════════════ LEGAL ════════════════════════ */

// TODO [ASK]: the privacy sections marked "draft" below are new and need legal review before launch.
export const LEGAL_UPDATED = "14 October 2026";

type LegalSection = { id: string; title: string; body: React.ReactNode[]; draft?: boolean };

const legal: LegalSection[] = [
  {
    id: "disclaimer",
    title: "Disclaimer",
    body: [
      `The information contained in this website is for general information purposes only. The information is provided by ${org.legalName} and while we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.`,
      `Through this website you are able to link to other websites which are not under the control of ${org.legalName}. We have no control over the nature, content and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.`,
      "Every effort is made to keep the website up and running smoothly. However, we take no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    body: [
      `This privacy policy sets out how ${org.legalName} uses and protects any information that you give us when you use this website. We are committed to ensuring that your privacy is protected.`,
      "Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement.",
      "We may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes.",
    ],
  },
  {
    id: "privacy-act",
    title: "The Privacy Act and the Australian Privacy Principles",
    draft: true,
    body: [
      // TODO [ASK]: confirm with your adviser that this statement is correct for Reserve Fund Plans.
      "We handle personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).",
    ],
  },
  {
    id: "what-we-collect",
    title: "What we collect and why",
    draft: true,
    body: [
      "When you request a quote or contact us, we collect the details you choose to give us: your name, phone number and email address; the property address, number of lots and strata plan number; the strata manager’s name and company; any special instructions; and whether you would like a call or an email back.",
      "We use these details to prepare and send your quote, to contact you about your request, and to carry out and invoice any report you order. We do not sell your personal information.",
      // TODO [ASK]: confirm whether Google Analytics (or any other tracking) will run on the site.
      "Our website may use analytics cookies to understand, in aggregate, how visitors use the site. These do not identify you personally.",
      "To protect our forms from spam and automated abuse, the quote form uses Google reCAPTCHA, which collects hardware and software information (such as device and browser data) and sends it to Google for analysis. Its use is subject to Google’s Privacy Policy (policies.google.com/privacy) and Terms of Service (policies.google.com/terms).",
    ],
  },
  {
    id: "storage",
    title: "How we store and protect your information",
    draft: true,
    body: [
      // TODO [ASK]: describe where enquiries and client records are kept (e.g. email system, practice software) and for how long.
      "Quote requests sent through this website are delivered to our office by email. We take reasonable steps to protect personal information from misuse, interference, loss and unauthorised access, and we keep it only for as long as we need it for the purposes above or as required by law.",
    ],
  },
  {
    id: "access",
    title: "Accessing and correcting your information",
    draft: true,
    body: [
      <>
        You can ask to see, or correct, the personal information we hold about you by emailing{" "}
        <Email className="font-semibold text-brand underline underline-offset-4" />{" "}
        or calling{" "}
        <a href={org.phoneHref} className="font-semibold text-brand underline underline-offset-4">
          {org.phone}
        </a>
        .
      </>,
    ],
  },
  {
    id: "complaints",
    title: "Making a complaint",
    draft: true,
    body: [
      <>
        If you have a concern about how we have handled your personal information, please contact us first at{" "}
        <Email className="font-semibold text-brand underline underline-offset-4" />{" "}
        and we will respond as soon as we can. If you are not satisfied with our response, you can contact the Office of the Australian Information
        Commissioner (OAIC) at{" "}
        <a href="https://www.oaic.gov.au/" className="font-semibold text-brand underline underline-offset-4">
          oaic.gov.au
        </a>
        .
      </>,
    ],
  },
  {
    id: "links",
    title: "Links",
    body: [
      "Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website.",
      "Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites, and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.",
    ],
  },
  {
    id: "photo-credits",
    title: "Photo credits",
    body: [
      "Building photographs are used under the Unsplash License, courtesy of these photographers:",
      <ul key="credits" className="mt-2 grid gap-1">
        {Object.values(photos).map((p) => (
          <li key={p.src}>
            <a href={p.page} rel="noopener noreferrer" className="underline-offset-4 hover:underline">
              {p.alt}
            </a>{" "}
            by{" "}
            <a href={p.profile} rel="noopener noreferrer" className="font-semibold underline-offset-4 hover:underline">
              {p.credit}
            </a>
          </li>
        ))}
      </ul>,
    ],
  },
];

export function LegalPage() {
  return (
    <main>
      <PageHero
        crumbs={[
          ["Home", paths.home],
          ["Legal & privacy", paths.legal],
        ]}
        issue={`Last updated ${LEGAL_UPDATED}`}
        lines={["Disclaimer and", <span key="p" className="text-brand">Privacy Policy</span>]}
      />
      <section className="pb-18 sm:pb-24">
        <div className="wrap grid gap-10 lg:grid-cols-[.45fr_1.55fr] lg:gap-14">
          <aside>
            <nav aria-label="On this page">
              <ol className="grid gap-1 rounded-card bg-white p-2 ring-1 ring-line lg:sticky lg:top-28">
                {legal.map((l, i) => (
                  <li key={l.id}>
                    <a href={`#${l.id}`} className="flex min-h-11 items-center gap-3 rounded-xl px-4 py-2.5 font-semibold transition-colors hover:bg-canvas">
                      <span aria-hidden="true" className="text-[12px] text-mute tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {l.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <div className="rounded-panel bg-white p-7 ring-1 ring-line sm:p-12">
            <p className="text-[15px] text-mute">
              <strong className="text-ink">Last updated:</strong> {LEGAL_UPDATED}
            </p>
            <div className="mt-10 space-y-16">
              {legal.map((l, i) => (
                <article key={l.id} id={l.id} className="scroll-mt-28">
                  <div className="flex items-center gap-4">
                    <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-mist text-[13px] font-bold text-brand">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="h-title text-[clamp(1.5rem,2.6vw,2.1rem)]">{l.title}</h2>
                  </div>
                  <div className="prose-biv mt-6 max-w-3xl text-[1.05rem] leading-relaxed text-graphite">
                    {l.body.map((p, n) => (
                      <p key={n}>{p}</p>
                    ))}
                  </div>
                </article>
              ))}
              <div className="flex items-center gap-4 border-t border-line pt-8">
                <Mark className="size-9 text-ink" />
                <p className="text-graphite">
                  {org.legalName} ·{" "}
                  <a href={org.phoneHref} className="font-semibold text-ink">
                    {org.phone}
                  </a>{" "}
                  ·{" "}
                  <Email className="font-semibold text-ink" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
