"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Fragment, useRef } from "react";
import { Mark } from "./Diamonds";
import { useStill } from "@/lib/intro";
import { SpotCard } from "./Home";
import { A, Arrow, Button, Chapter, FadeUp, LineReveal, ease, easeInOut } from "./ui";
import { JsonLd } from "./JsonLd";
import { contact, diamonds, tones, type DiamondKey } from "@/lib/content";
import { servicePhoto, type PhotoKey } from "@/lib/photos";
import { Photo } from "./Photo";
import { breadcrumbSchema } from "@/lib/seo";
import { faqId, services, type Faq } from "@/lib/services";
import { beatQuote, facts } from "@/lib/site";

/** CSS animation delay, e.g. */
export const d = (s: number) => ({ ["--d" as string]: `${s}s` }) as React.CSSProperties;

/* ───────── Page header ───────── */
export function PageHero({
  crumbs,
  issue,
  lines,
  intro,
  dark = false,
  photo = false,
  accent,
  aside,
  size = "lg",
  compact = false,
  banner,
  bgPhoto,
  children,
}: {
  crumbs: [string, string][];
  /** small chip shown above the title */
  issue?: string;
  lines: React.ReactNode[];
  intro?: React.ReactNode;
  /** navy ground with white type */
  dark?: boolean;
  /** show a building photo in a framed panel (true = the default coastal tower) */
  photo?: boolean | PhotoKey;
  /** report colour used for the chip dot */
  accent?: DiamondKey;
  /** floats over the bottom of the photo */
  aside?: React.ReactNode;
  /** "md" for long H1s */
  size?: "lg" | "md";
  /** Changes by Asad: a short hero (about a third of the screen), no photo, chip beside the breadcrumbs */
  compact?: boolean;
  /** Reserve Fund Plans: a building-photo banner under the title on light pages (false to turn it off) */
  banner?: PhotoKey | false;
  /** Reserve Fund Plans: a building photo behind a dark hero */
  bgPhoto?: PhotoKey;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const still = useStill();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

  const chip = issue && (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${dark ? "bg-white/10 text-white/85 ring-1 ring-white/15" : "bg-white text-graphite ring-1 ring-line"}`}
    >
      <span className="size-1.5 rounded-full" style={{ background: accent ? (dark ? tones[accent].soft : diamonds[accent]) : "var(--color-brand)" }} />
      {issue}
    </span>
  );

  // Version 2 (Changes by Asad): heroes without a photo put the chip on the breadcrumb row and let the
  // heading run the full width, so short headings sit on one line and there is less empty space.
  const row = compact || !photo;
  const pad = compact ? "pt-24 pb-7 sm:pt-[6.75rem] sm:pb-9" : photo ? "pt-28 pb-12 sm:pt-32 sm:pb-16" : "pt-28 pb-10 sm:pt-32 sm:pb-12";

  // Light pages without a side photo get a wide building-photo banner under the title (not on the form pages).
  const lastPath = crumbs[crumbs.length - 1]?.[1] ?? "";
  const formPage = ["/contact-us/", "/quote-request/", "/legal/"].includes(lastPath);
  const autoBanner: PhotoKey = (["perthDay", "apartmentTowers", "elizabethQuay", "coastalTower", "perthSunset", "glassTower"] as PhotoKey[])[lastPath.length % 6];
  const bannerKey: PhotoKey = banner || autoBanner;
  const showBanner = !dark && !photo && !compact && banner !== false && !formPage;

  const inner = (
    <div className={`wrap relative ${pad}`}>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <div className={row ? "flex flex-wrap items-center justify-between gap-x-6 gap-y-2" : ""}>
      <nav aria-label="Breadcrumb">
        <ol className={`crumbs flex flex-wrap items-center gap-2 text-[13px] font-medium ${dark ? "text-white/55" : "text-mute"}`}>
          {crumbs.map(([label, href], i) => (
            <li key={href} className="flex items-center gap-2">
              {i < crumbs.length - 1 ? (
                <A href={href} className={`inline-flex min-h-11 items-center transition-colors ${dark ? "hover:text-white" : "hover:text-ink"}`}>
                  {label}
                </A>
              ) : (
                <span aria-current="page" className={dark ? "text-white" : "text-ink"}>
                  {label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      {row && chip}
      </div>

      <div className={`${compact ? "mt-3 sm:mt-4" : row ? "mt-4 sm:mt-6" : "mt-8 sm:mt-10"} grid gap-12 ${photo ? "lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16" : ""}`}>
        <div>
          {issue && !row && chip}{" "}
          {row ? (
            <h1
              className={`h-display [text-wrap:balance] ${compact ? "text-[clamp(1.9rem,3.8vw,3.3rem)]" : size === "md" ? "text-[clamp(2.1rem,4.4vw,4rem)]" : "text-[clamp(2.3rem,5vw,4.6rem)]"}`}
            >
              {lines.map((l, i) => (
                <Fragment key={i}>
                  {i > 0 && " "}
                  {l}
                </Fragment>
              ))}
            </h1>
          ) : (
            <h1 className={`h-display mt-6 [text-wrap:balance] ${size === "md" ? "text-[clamp(2.2rem,5vw,4.4rem)]" : "text-[clamp(2.5rem,6vw,5.2rem)]"}`}>
              {lines.map((l, i) => (
                <Fragment key={i}>
                  {i > 0 && " "}
                  <span className="block overflow-hidden pt-[0.04em] pb-[0.1em]">
                    <span className="block">
                      {l}
                    </span>
                  </span>
                </Fragment>
              ))}
            </h1>
          )}
          {intro && (
            <p
              className={`${compact ? "mt-3 max-w-2xl text-[1.05rem] sm:text-lg" : row ? "mt-5 max-w-3xl text-lg sm:text-xl" : "mt-7 max-w-2xl text-lg sm:text-xl"} leading-relaxed ${dark ? "text-white/70" : "text-graphite"}`}
            >
              {intro}
            </p>
          )}
          {children}
        </div>

        {photo && (
          <div
            className="relative aspect-[5/4] w-full overflow-hidden rounded-panel bg-navy shadow-[var(--shadow-lift)] lg:aspect-[4/4.4]"
          >
            {/* decorative, so alt="" on purpose */}
            <motion.div style={{ y: still ? 0 : imgY }} className="absolute inset-0 h-[116%] w-full">
              <Photo k={photo === true ? "coastalTower" : photo} decorative fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/5 to-transparent" />
            {aside && <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">{aside}</div>}
          </div>
        )}
      </div>
      {showBanner && (
        <FadeUp className="mt-8 sm:mt-10">
          <div className="relative h-36 overflow-hidden rounded-panel bg-navy sm:h-48 lg:h-56">
            <motion.div style={{ y: still ? 0 : imgY }} className="absolute inset-0 h-[120%] w-full">
              <Photo k={bannerKey} decorative fill sizes="(min-width: 1344px) 84rem, 100vw" className="object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy/45 to-transparent" />
            <span aria-hidden="true" className="absolute bottom-0 left-0 h-1.5 w-28 bg-brand-soft" />
          </div>
        </FadeUp>
      )}
    </div>
  );

  if (!dark)
    return (
      <section ref={ref} className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-[-10%] size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(200_51_26/0.07),transparent_65%)]" />
        {inner}
      </section>
    );

  return (
    <section ref={ref} className="px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="grain relative overflow-hidden rounded-panel bg-navy text-white sm:rounded-panel">
        {bgPhoto && (
          <>
            <Photo k={bgPhoto} decorative fill priority sizes="100vw" className="object-cover opacity-40" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/35" />
          </>
        )}
        <Mark line className="pointer-events-none absolute -top-32 -left-32 w-[34rem] text-white/[0.05]" />
        {inner}
      </div>
    </section>
  );
}

/* ───────── Section heading ───────── */
export function SectionHead({ no, title, lines, text, dark = false, className = "" }: { no: string; title: string; lines: React.ReactNode[]; text?: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <div className={`grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16 ${className}`}>
      <div>
        <Chapter no={no} title={title} dark={dark} />
        <LineReveal className="h-display mt-6 text-[clamp(2.1rem,4.4vw,3.8rem)] [text-wrap:balance]" lines={lines} />
      </div>
      {text && (
        <FadeUp>
          <p className={`max-w-md text-lg leading-relaxed lg:ml-auto ${dark ? "text-white/70" : "text-graphite"}`}>{text}</p>
        </FadeUp>
      )}
    </div>
  );
}

/* ───────── FAQ accordion ─────────
   Native <details>/<summary>: every answer is in the server HTML, works without JavaScript, and is
   keyboard accessible. Questions in one list share a `name`, so opening one closes the others. */
export function FaqList({
  faqs,
  k = "blue",
  startOpen = 0,
  level = 3,
  group = "faq",
}: {
  faqs: Faq[];
  k?: DiamondKey;
  startOpen?: number | null;
  /** heading level for each question */
  level?: 2 | 3;
  group?: string;
}) {
  const H = level === 2 ? "h2" : "h3";
  return (
    <div className="grid gap-2" style={{ ["--faq-on" as string]: diamonds[k], ["--faq-on-text" as string]: tones[k].on }}>
      {faqs.map((f, i) => {
        const id = faqId(f.q);
        return (
          <details key={f.q} id={id} name={group} open={i === startOpen} className="faq scroll-mt-28 rounded-card bg-white ring-1 ring-line transition-shadow duration-500 open:shadow-[var(--shadow-soft)] open:ring-ink/10">
            <summary className="group grid min-h-11 cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-5 px-5 py-5 text-left sm:px-7 sm:py-6 [&::-webkit-details-marker]:hidden">
              <H className="h-title text-[clamp(1.05rem,1.6vw,1.25rem)] transition-colors group-hover:text-brand">{f.q}</H>
              <span aria-hidden="true" className="faq-icon grid size-9 place-items-center rounded-full">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </summary>
            <div className="space-y-4 px-5 pb-7 leading-relaxed text-graphite sm:px-7 sm:text-[1.05rem] lg:pr-24">
              {f.a.map((p) => (
                <p key={p.slice(0, 40)} className="max-w-3xl">
                  {p}
                </p>
              ))}
              {f.list && (
                <ul className="max-w-3xl list-disc space-y-1.5 pl-5">
                  {f.list.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              )}
              {f.table && (
                <div className="overflow-x-auto rounded-2xl bg-canvas p-1">
                  <table className="w-full min-w-[30rem] text-left text-[15px]">
                    <thead>
                      <tr className="text-[12px] tracking-wide text-mute uppercase">
                        <th scope="col" className="px-4 py-3 font-semibold">
                          Property type
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          Revalue
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {f.table.map(([a, b]) => (
                        <tr key={a} className="border-t border-line">
                          <td className="px-4 py-3">{a}</td>
                          <td className="px-4 py-3 font-semibold whitespace-nowrap text-ink">{b}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}

/* ───────── Report cards: photo-topped (same style as the homepage) ───────── */
export function ServiceCards({ exclude }: { exclude?: string }) {
  const list = services.filter((s) => s.slug !== exclude);
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${list.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {list.map((s, i) => (
        <FadeUp key={s.slug} delay={i * 0.06} className="h-full">
          <A href={s.path} className="group flex h-full flex-col overflow-hidden rounded-card bg-white ring-1 ring-line transition-shadow duration-500 hover:shadow-[var(--shadow-lift)]">
            <span className="relative block aspect-[16/9] overflow-hidden bg-navy">
              <Photo k={servicePhoto[s.slug]} decorative fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-[12px] font-bold tracking-wide text-ink">{s.code}</span>
            </span>
            <span className="block h-1.5" style={{ background: diamonds[s.key] }} aria-hidden="true" />
            <span className="flex flex-1 flex-col p-6">
              <span className="h-title block text-[1.35rem]">{s.title}</span>
              <span className="mt-2 block leading-relaxed text-graphite">{s.tagline}</span>
              <span className="mt-auto flex items-center gap-2 pt-5 text-[15px] font-semibold text-brand">
                Read more
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <Arrow className="size-3.5" />
                </span>
              </span>
            </span>
          </A>
        </FadeUp>
      ))}
    </div>
  );
}

/* ───────── Closing call to action (blue panel) ───────── */
export function QuoteBand({ title = "Ready when you are.", text, no = "→" }: { title?: string; text?: React.ReactNode; no?: string }) {
  const ref = useRef<HTMLElement>(null);
  const still = useStill();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rot = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  return (
    <section ref={ref} className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="grain relative mx-auto max-w-[90rem] overflow-hidden rounded-panel bg-navy py-16 text-white sm:rounded-panel sm:py-22">
        {/* Reserve Fund Plans: Perth skyline behind the closing call to action */}
        <Photo k="perthDay" decorative fill sizes="(min-width: 1440px) 90rem, 100vw" className="object-cover opacity-45" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
        <motion.div style={{ rotate: still ? 0 : rot }} className="pointer-events-none absolute -right-40 -bottom-40 w-[36rem]">
          <Mark line className="w-full text-white/[0.07]" />
        </motion.div>
        <div className="wrap relative">
          <Chapter no={no} title="Request a quote" dark />
          <LineReveal className="h-display mt-6 max-w-4xl text-[clamp(2.4rem,5.6vw,4.8rem)] [text-wrap:balance]" lines={[title]} />
          <FadeUp>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              {text ?? `Tell us about the property and the reports you need. Our normal turnaround is around ${facts.turnaround}, and ${beatQuote}.`}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={contact.quote} tone="brass">
                Request a quote
              </Button>
              <Button href={contact.phoneHref} tone="ghost-light">
                Call {contact.phone}
              </Button>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
