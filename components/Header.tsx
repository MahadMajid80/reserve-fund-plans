"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { org, paths } from "@/lib/site";

type Item = { label: string; href: string; children?: { label: string; href: string }[] };

export const nav: Item[] = [
  { label: "Home", href: paths.home },
  { label: "About us", href: paths.about },
  {
    label: "Services",
    href: paths.services,
    children: [
      { label: "Reserve Fund Plans", href: paths.sfp },
      { label: "Building Insurance Valuations", href: paths.biv },
      { label: "Work Health and Safety Reports", href: paths.whs },
      { label: "Asbestos Reports", href: paths.asb },
    ],
  },
  { label: "Testimonials", href: paths.testimonials },
  {
    label: "FAQs",
    href: paths.faq,
    children: [
      { label: "Reserve Fund Plans", href: paths.faqSfp },
      { label: "Building Insurance Valuations", href: paths.faqBiv },
      { label: "Work Health and Safety", href: paths.faqWhs },
      { label: "Asbestos Reports", href: paths.faqAsb },
    ],
  },
  { label: "Contact us", href: paths.contact },
];

const isActive = (pathname: string, item: Item) =>
  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href) || !!item.children?.some((c) => pathname === c.href);

export function Header() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="hidden bg-eucalypt-deep text-[0.8125rem] text-white/85 sm:block">
        <div className="wrap flex h-9 items-center justify-between">
          <span>Independent strata reports in Western Australia since {org.foundingDate}</span>
          <a href={org.phoneHref} className="font-semibold text-white hover:underline">
            Call {org.phone}
          </a>
        </div>
      </div>
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
        <Link href={paths.home} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-1 rounded px-3 text-[0.95rem] font-medium transition-colors hover:text-eucalypt ${isActive(pathname, item) ? "text-eucalypt" : "text-graphite"}`}
                >
                  {item.label}
                  {item.children && (
                    <svg viewBox="0 0 12 12" className="size-3 opacity-60" aria-hidden="true">
                      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  )}
                  {isActive(pathname, item) && <span className="absolute inset-x-3 bottom-1 h-0.5 bg-ochre" aria-hidden="true" />}
                </Link>
                {item.children && (
                  <ul className="invisible absolute top-full left-0 min-w-72 translate-y-1 border border-line bg-white p-2 opacity-0 shadow-[0_18px_40px_-18px_rgb(18_48_42/0.35)] transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          aria-current={pathname === c.href ? "page" : undefined}
                          className="flex min-h-11 items-center rounded px-3 text-[0.95rem] text-graphite hover:bg-sand hover:text-eucalypt aria-[current=page]:font-semibold aria-[current=page]:text-eucalypt"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href={paths.quote} className="btn btn-primary hidden sm:inline-flex">
            Request a quote
          </Link>
          <button
            type="button"
            className="inline-flex size-12 items-center justify-center rounded border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" /> : <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.8" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-[4.5rem] bottom-0 overflow-y-auto border-t border-line bg-paper sm:top-[6.75rem] lg:hidden">
          <nav aria-label="Mobile" className="wrap py-6">
            <ul className="divide-y divide-line">
              {nav.map((item) => (
                <li key={item.href} className="py-2">
                  <Link href={item.href} className="flex min-h-12 items-center text-lg font-semibold text-ink">
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="mb-2 grid gap-1 border-l-2 border-ochre pl-4">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="flex min-h-11 items-center text-graphite">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3">
              <Link href={paths.quote} className="btn btn-primary">
                Request a quote
              </Link>
              <a href={org.phoneHref} className="btn btn-ghost text-eucalypt">
                Call {org.phone}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
