"use client";

import { Email } from "@/components/Email";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, Mark } from "./Diamonds";
import { A, Arrow, Phone, ease, easeInOut } from "./ui";
import { useFirstLoad, useStill } from "@/lib/intro";
import { contact, diamonds, nav } from "@/lib/content";
import { services } from "@/lib/services";
import { org, paths } from "@/lib/site";

const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);
const isActive = (path: string, href: string) => (href === "/" ? path === "/" : norm(path).startsWith(href));

/* ───────── Floating pill navbar ───────── */
export function Navbar() {
  const path = usePathname();
  const first = useFirstLoad();
  const still = useStill();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [raised, setRaised] = useState(false);
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState<null | "services" | "faq">(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setRaised(y > 24);
    setHidden(y > prev && y > 600 && !open && !drop);
  });

  useEffect(() => {
    setOpen(false);
    setDrop(null);
    setHidden(false);
  }, [path]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const delay = first && path === "/" ? 1.9 : 0.1;
  // Version 2 (Changes by Asad): on the service pages the menu sits a little lower, so the navy hero shows above it,
  const serviceDetail = /^\/services\/[^/]+\/?$/.test(path);
  // Version 2 round 4: over the navy service-page hero (before scrolling) the menu turns light-on-dark,
  // with the white logo from the footer, instead of a white bar.
  const dark = serviceDetail && !raised && !drop && !open;

  return (
    <>
      <motion.header
        data-reveal
        initial={still ? false : { y: -120, opacity: 0 }}
        animate={{ y: hidden ? -120 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease, delay: hidden ? 0 : delay }}
        className={`fixed inset-x-0 top-0 z-50 px-3 sm:px-5 transition-[padding] duration-500 ${serviceDetail && !raised ? "pt-7 sm:pt-9" : "pt-3 sm:pt-4"}`}
        onMouseLeave={() => setDrop(null)}
      >
        <div
          className={`mx-auto max-w-[84rem] rounded-[1.75rem] transition-[background,box-shadow] duration-500 ${raised || drop ? "glass shadow-[var(--shadow-soft)] ring-1 ring-line" : "bg-transparent"}`}
        >
          <nav className="flex h-16 items-center justify-between gap-4 pr-2 pl-4 sm:pl-5" aria-label="Main">
            <A href="/" aria-label="Reserve Fund Plans home" className="inline-flex min-h-11 items-center">
              <Logo onDark={dark || (open && !raised)} className="h-10 sm:h-11" />
            </A>

            <ul className={`hidden items-center gap-0.5 rounded-full p-1 ring-1 transition-colors duration-500 lg:flex ${dark ? "bg-transparent ring-white/30" : "bg-white/60 ring-line"}`}>
              {nav.map((n) => {
                const on = isActive(path, n.href);
                const dropKey = n.href === paths.services ? "services" : n.href === paths.faq ? "faq" : null;
                const hasDrop = dropKey !== null;
                return (
                  <li key={n.label} onMouseEnter={() => setDrop(dropKey)} className="relative">
                    {on && <motion.span layoutId="nav-on" className={`absolute inset-0 rounded-full transition-colors duration-500 ${dark ? "bg-white" : "bg-brand"}`} transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                    <A
                      href={n.href}
                      aria-current={on ? "page" : undefined}
                      className={`relative flex min-h-11 items-center gap-1 rounded-full px-4 text-[15px] font-bold tracking-[-0.005em] transition-colors ${on ? (dark ? "text-navy" : "text-white") : dark ? "text-white hover:text-white/75" : "text-ink hover:text-brand"}`}
                    >
                      {n.label}
                      {hasDrop && (
                        <svg aria-hidden="true" viewBox="0 0 24 24" className={`size-3.5 transition-transform duration-300 ${drop === dropKey ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      )}
                    </A>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <a
                href={contact.phoneHref}
                className={`hidden min-h-11 items-center gap-2 rounded-full px-4 text-[14px] font-semibold ring-1 tabular-nums transition-colors xl:inline-flex ${dark ? "bg-transparent text-white ring-white/30 hover:bg-white/10" : "bg-white/60 text-ink ring-line hover:bg-white"}`}
              >
                <Phone className="size-4" />
                {contact.phone}
              </a>
              <A
                href={contact.quote}
                className={`group hidden min-h-11 items-center gap-2 rounded-full py-2 pr-2 pl-5 text-[14px] font-semibold transition-colors sm:inline-flex ${dark ? "bg-white text-navy hover:bg-brand-soft" : "bg-brand text-white hover:bg-navy"}`}
              >
                Request a quote
                <span aria-hidden="true" className={`grid size-7 place-items-center rounded-full transition-colors ${dark ? "bg-brand text-white" : "bg-white/15 group-hover:bg-white group-hover:text-brand"}`}>
                  <Arrow className="size-3.5" />
                </span>
              </A>
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className={`relative z-[60] grid size-11 place-items-center rounded-full transition-colors lg:hidden ${open || dark ? "bg-white text-ink" : "bg-brand text-white"}`}
              >
                <span className={`absolute h-[1.5px] w-4.5 bg-current transition-all duration-500 ${open ? "rotate-45" : "-translate-y-[3.5px]"}`} />
                <span className={`absolute h-[1.5px] w-4.5 bg-current transition-all duration-500 ${open ? "-rotate-45" : "translate-y-[3.5px]"}`} />
              </button>
            </div>
          </nav>

          {/* mega menus: Services and (Version 2) FAQs, same style */}
          <AnimatePresence>
            {drop && (
              <motion.div
                key="mega"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: easeInOut }}
                className="hidden overflow-hidden lg:block"
              >
                {/* Changes by Asad: a little top padding so the cards' top border isn't clipped by the dropdown */}
                <div key={drop} className="grid grid-cols-[1fr_1fr_1fr_1fr_0.9fr] gap-2 px-2 pt-1.5 pb-2">
                  {services.map((s, i) => (
                    <motion.div key={s.slug} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.06 + i * 0.05, duration: 0.6, ease }}>
                      <A href={drop === "faq" ? s.faqPath : s.path} className="group flex h-full flex-col gap-3 rounded-[1.25rem] bg-white p-5 ring-1 ring-line transition-shadow hover:shadow-[var(--shadow-lift)]">
                        <span className="flex items-center justify-between" aria-hidden="true">
                          <span className="size-2.5 rounded-full" style={{ background: diamonds[s.key] }} />
                          <span className="text-mute transition-all duration-500 group-hover:translate-x-0.5 group-hover:text-ink">
                            <Arrow />
                          </span>
                        </span>
                        <span>
                          <span className="h-title block text-[1.05rem]">{drop === "faq" ? s.faq.h1 : s.title}</span>{" "}
                          <span className="mt-1.5 block text-[13px] leading-snug text-mute">
                            {drop === "faq" ? `${s.faq.faqs.length} questions owners ask about ${s.title.toLowerCase().replace("whs", "WHS")}.` : s.tagline}
                          </span>
                        </span>
                      </A>
                    </motion.div>
                  ))}
                  <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6, ease }}>
                    <A href={drop === "faq" ? paths.faq : paths.services} className="grain flex h-full flex-col gap-3 rounded-[1.25rem] bg-navy p-5 text-white">
                      <Mark className="size-6" />
                      <span>
                        <span className="h-title block text-[1.05rem]">{drop === "faq" ? "All FAQ's" : "All services"}</span>{" "}
                        <span className="mt-1.5 block text-[13px] text-white/60">{drop === "faq" ? "Search every question" : "Compare the four reports"}</span>
                      </span>
                    </A>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.4 } }}
            transition={{ duration: 0.4 }}
            className="grain fixed inset-0 z-40 flex flex-col overflow-y-auto bg-navy px-5 pt-24 pb-10 text-white lg:hidden"
          >
            <ul>
              {nav.map((n, i) => (
                <motion.li
                  key={n.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.6, ease }}
                  className="border-b border-white/10"
                >
                  <A
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`h-display flex items-center justify-between py-4 text-[2.2rem] ${isActive(path, n.href) ? "text-brand-soft" : ""}`}
                  >
                    {n.label}
                    <span className="eyebrow text-white/40" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </A>
                  {(n.href === paths.services || n.href === paths.faq) && (
                    <ul className="grid gap-1.5 pb-5">
                      {services.map((s) => (
                        <li key={s.slug}>
                          <A
                            href={n.href === paths.faq ? s.faqPath : s.path}
                            onClick={() => setOpen(false)}
                            className="flex min-h-11 items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-[15px] font-semibold ring-1 ring-white/10"
                          >
                            <span className="size-2 rounded-full" style={{ background: diamonds[s.key] === diamonds.blue ? "var(--color-brand-soft)" : diamonds[s.key] }} />
                            {n.href === paths.faq ? s.faq.h1 : s.title}
                          </A>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6, ease }} className="mt-8 grid gap-2">
              <A href={contact.quote} onClick={() => setOpen(false)} className="rounded-full bg-brand px-6 py-4 text-center font-semibold text-white">
                Request a quote
              </A>
              <a href={contact.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-center font-semibold ring-1 ring-white/25">
                <Phone className="size-4" />
                Call {contact.phone}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ───────── Footer ───────── */
export function Footer() {
  return (
    <footer className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="grain relative overflow-hidden rounded-[2rem] bg-night text-white sm:rounded-[2.5rem]">
        <Mark line className="pointer-events-none absolute -top-24 -right-24 w-[30rem] text-white/[0.04]" />
        <div className="wrap relative grid gap-12 py-14 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo onDark className="h-14" />
            <p className="mt-6 max-w-xs leading-relaxed text-white/70">Accurate, practical property reports for strata and community schemes, in an Easy to Read Report format.</p>
            <a href={contact.phoneHref} className="h-display mt-8 block text-[2rem] tabular-nums transition-colors hover:text-brand-soft">
              {contact.phone}
            </a>
            <Email className="mt-1 inline-flex min-h-11 items-center text-white/80 underline underline-offset-4 transition-colors hover:text-white" />
            <dl className="mt-6 grid gap-3 text-[14px] text-white/65">
              {/* TODO [ASK]: address, ABN and business hours. Hidden until supplied. */}
              {org.address && (
                <div>
                  <dt className="sr-only">Address</dt>
                  <dd>
                    {org.address.street}, {org.address.locality} {org.address.region} {org.address.postcode}
                  </dd>
                </div>
              )}
              {org.hours && (
                <div>
                  <dt className="sr-only">Business hours</dt>
                  <dd>{org.hours}</dd>
                </div>
              )}
              {org.abn && (
                <div>
                  <dt className="inline">ABN </dt>
                  <dd className="inline">{org.abn}</dd>
                </div>
              )}
            </dl>
          </div>
          {/* Version 2 (Changes by Asad): Company without Services/FAQ; a Services column and an FAQ column */}
          <FooterCol
            title="Company"
            items={[...nav.filter((n) => n.href !== paths.services && n.href !== paths.faq).map((n) => [n.label, n.href]), ["Request a quote", contact.quote], ["Legal & privacy", paths.legal]]}
          />
          <FooterCol title="Services" items={[...services.map((s) => [s.title, s.path]), ["All services", paths.services]]} />
          <FooterCol title="Frequently Asked Questions" items={[...services.map((s) => [s.faq.h1, s.faqPath]), ["All FAQ's", paths.faq]]} />
        </div>

        <div className="wrap relative" aria-hidden="true">
          <p className="h-display bg-gradient-to-b from-white/14 to-white/0 bg-clip-text text-[clamp(2.6rem,14.5vw,15rem)] leading-[0.82] whitespace-nowrap tracking-[-0.06em] text-transparent select-none">
            Reserve Fund Plans
          </p>
        </div>

        <div className="wrap relative flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-[13px] text-white/60">
          <p>
            © 2008–{new Date().getFullYear()} {org.legalName}
          </p>
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
            Since 1984 · Perth, Western Australia
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[][] }) {
  return (
    <div>
      <p className="eyebrow text-white/55">{title}</p>
      <ul className="mt-4 space-y-0.5">
        {items.map(([l, h]) => (
          <li key={h}>
            <A href={h} className="inline-flex min-h-9 items-center text-[15px] text-white/80 transition-colors hover:text-white">
              {l}
            </A>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────── Page change: a blue panel with the mark sweeps up ───────── */
/** Page wrapper. Inner pages appear straight away: no page-change curtain or fade (only the homepage animates). */
export function PageCurtain({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
