"use client";

import { animate, motion, useInView, useMotionValue, useScroll, useSpring } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useStill } from "@/lib/intro";

export const ease = [0.16, 1, 0.3, 1] as const;
export const easeInOut = [0.76, 0, 0.24, 1] as const;

let lenisInstance: Lenis | null = null;

/* ───────── Scrolling ───────── */

/**
 * Marks the page as running JavaScript (adds "js-ready" to <html>). Until then a CSS failsafe in globals.css
 * reveals any animated content after a few seconds, so a page whose JavaScript is slow or blocked (old browser,
 * strict extension, flaky connection) is never left blank.
 */
export function JsReady() {
  useEffect(() => {
    document.documentElement.classList.add("js-ready");
  }, []);
  return null;
}

/** Jumps back to the top whenever the route changes. */
export function RouteScrollReset() {
  const path = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [path]);
  return null;
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenisInstance = lenis;
    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const sel = a.getAttribute("href")!;
      const el = sel === "#top" ? document.body : document.querySelector(sel);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -90, duration: 1.5 });
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
  return null;
}

/** 0→1 progress of a tall section moving past a pinned viewport. */
/**
 * Props for a scroll-reveal: on the homepage it animates from `from` to `to` when scrolled into view; on every other
 * page it renders `to` straight away with no animation.
 */
export function reveal(still: boolean, from: Record<string, string | number>, to: Record<string, string | number>, transition: Record<string, unknown>) {
  return still
    ? ({ initial: false, animate: to } as const)
    : ({ "data-reveal": true, initial: from, whileInView: to, viewport: { once: true }, transition } as const);
}

export function useSectionProgress(ref: React.RefObject<HTMLElement | null>) {
  const p = useMotionValue(0);
  useEffect(() => {
    let id = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      p.set(span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(id);
      id = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, p]);
  return p;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      style={{ scaleX: x }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-brand"
    />
  );
}

/* ───────── Text reveals ───────── */

/** Lines slide up from behind a mask. */
export function LineReveal({
  lines,
  className = "",
  lineClass = "",
  delay = 0,
  immediate = false,
  as = "h2",
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClass?: string;
  delay?: number;
  immediate?: boolean;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const still = useStill();
  const show = immediate || inView;
  const Tag = as;
  if (still)
    return (
      <Tag className={className}>
        {lines.map((l, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className={`block pt-[0.04em] pb-[0.1em] ${lineClass}`}>{l}</span>
          </Fragment>
        ))}
      </Tag>
    );
  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <Fragment key={i}>
          {/* a real space between lines, so the text reads correctly when the block layout is ignored */}
          {i > 0 && " "}
          <span className="block overflow-hidden pt-[0.04em] pb-[0.1em]">
            <motion.span
              data-reveal
              className={`block ${lineClass}`}
              initial={{ y: "115%" }}
              animate={show ? { y: "0%" } : { y: "115%" }}
              transition={{ duration: 1.1, ease, delay: delay + i * 0.07 }}
            >
              {l}
            </motion.span>
          </span>
        </Fragment>
      ))}
    </Tag>
  );
}

export function FadeUp({
  children,
  delay = 0,
  className,
  y = 28,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  /** render as a list item when used directly inside <ul>/<ol>, or as a <div> inside <dl> */
  as?: "div" | "li";
}) {
  const M = as === "li" ? motion.li : motion.div;
  const still = useStill();
  if (still) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <M data-reveal className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.95, ease, delay }}>
      {children}
    </M>
  );
}

/** A hairline rule that draws itself across. */
export function Rule({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const still = useStill();
  if (still) return <div className={`h-px bg-current opacity-15 ${className}`} />;
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: easeInOut, delay }}
      className={`h-px origin-left bg-current opacity-15 ${className}`}
    />
  );
}

/** Small uppercase eyebrow with an optional index number and a blue tick. */
export function Eyebrow({ children, no, className = "", dark = false }: { children: React.ReactNode; no?: string; className?: string; dark?: boolean }) {
  return (
    <span className={`eyebrow inline-flex items-center gap-3 ${dark ? "text-white/70" : "text-mute"} ${className}`}>
      {no ? <span className={`tabular-nums ${dark ? "text-brand-soft" : "text-brand"}`}>{no}</span> : <span className="size-1.5 rounded-full bg-brand" />}
      {no && <span className={`h-px w-8 ${dark ? "bg-white/25" : "bg-ink/20"}`} />}
      {children}
    </span>
  );
}

/** Kept for older call sites: renders as an eyebrow. */
export function Label({ children, className = "", dark }: { children: React.ReactNode; className?: string; color?: string; dark?: boolean }) {
  return (
    <Eyebrow className={className} dark={dark}>
      {children}
    </Eyebrow>
  );
}

/** A soft pill chip. */
export function Chip({ children, className = "", dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${dark ? "bg-white/10 text-white/85 ring-1 ring-white/15" : "bg-white text-graphite ring-1 ring-line"} ${className}`}>
      {children}
    </span>
  );
}

/** Section index: "01 — Title". */
export function Chapter({ no, title, className = "", dark = false }: { no: string; title: string; note?: string; className?: string; dark?: boolean }) {
  return (
    <Eyebrow no={no} className={className} dark={dark}>
      {title}
    </Eyebrow>
  );
}

/** Infinite horizontal ticker. */
export function Marquee({ children, reverse = false, className = "" }: { children: React.ReactNode; reverse?: boolean; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`flex w-max animate-marquee motion-reduce:animate-none ${reverse ? "[animation-direction:reverse]" : ""}`}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ───────── Links & buttons ───────── */

export function Magnetic({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14 });
  const sy = useSpring(y, { stiffness: 180, damping: 14 });
  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.15);
        y.set((e.clientY - r.top - r.height / 2) * 0.15);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Link that uses client-side routing for internal paths and opens external sites in a new tab. */
export function A({
  href,
  children,
  className,
  onClick,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
  const ext = href.startsWith("http");
  return (
    <a href={href} className={className} onClick={onClick} {...(ext ? { target: "_blank", rel: "noreferrer" } : {})} {...rest}>
      {children}
    </a>
  );
}

export function Arrow({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Phone handset icon, used instead of the arrow on call buttons. */
export function Phone({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4h3.5l1.8 4.6-2.3 1.4a11 11 0 0 0 6 6l1.4-2.3L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" />
    </svg>
  );
}

type Tone = "blue" | "light" | "brass" | "ghost" | "ghost-light";
const tones: Record<Tone, { base: string; dot: string }> = {
  blue: { base: "bg-brand text-white hover:bg-navy", dot: "bg-white/15 text-white group-hover:bg-white group-hover:text-brand" },
  light: { base: "bg-white text-ink hover:bg-canvas", dot: "bg-brand text-white group-hover:bg-navy group-hover:text-white" },
  brass: { base: "bg-white text-navy hover:bg-brand-soft", dot: "bg-brand text-white group-hover:bg-navy group-hover:text-white" },
  ghost: { base: "text-ink ring-1 ring-inset ring-ink/15 hover:ring-ink/40 hover:bg-white", dot: "bg-ink/5 text-ink group-hover:bg-brand group-hover:text-white" },
  "ghost-light": { base: "text-white ring-1 ring-inset ring-white/25 hover:ring-white/60 hover:bg-white/5", dot: "bg-white/10 text-white group-hover:bg-white group-hover:text-ink" },
};

/** Pill button with a circular arrow that slides on hover. */
export function Button({ href, children, tone = "blue", className = "", arrow = true }: { href: string; children: React.ReactNode; tone?: Tone; className?: string; arrow?: boolean }) {
  const t = tones[tone];
  return (
    <Magnetic>
      {/* Version 2 (Changes by Asad): larger content buttons; the menu uses its own, smaller buttons */}
      <A href={href} className={`group inline-flex items-center gap-3.5 rounded-full py-2.5 text-[16px] font-semibold transition-colors duration-300 sm:text-[17px] ${arrow ? "pr-2.5 pl-7" : "px-7 py-4"} ${t.base} ${className}`}>
        <span className={arrow ? "py-1.5" : ""}>{children}</span>
        {arrow && (
          <span className={`relative grid size-10 place-items-center overflow-hidden rounded-full transition-colors duration-300 sm:size-11 ${t.dot}`}>
            {href.startsWith("tel:") ? (
              /* call buttons show a phone icon that gives a little ring on hover */
              <span className="transition-transform duration-500 group-hover:-rotate-12">
                <Phone className="size-[1.1rem]" />
              </span>
            ) : (
              <>
                <span className="absolute transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-8">
                  <Arrow />
                </span>
                <span className="absolute -translate-x-8 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0">
                  <Arrow />
                </span>
              </>
            )}
          </span>
        )}
      </A>
    </Magnetic>
  );
}

/** Text link with a fine underline that draws in on hover. */
export function LineLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <A href={href} className={`group inline-flex min-h-11 items-center gap-2 font-semibold ${className}`}>
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-current opacity-30" />
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 group-hover:scale-x-100" />
      </span>
      <span className="transition-transform duration-500 group-hover:translate-x-1">
        <Arrow />
      </span>
    </A>
  );
}

/* ───────── Numbers ───────── */

/**
 * A number that counts up when scrolled into view.
 * The real final value is in the server HTML (for crawlers and no-JS visitors); the count-up is visual only,
 * skipped under prefers-reduced-motion, and the width is reserved so nothing shifts while it counts.
 */
export function Counter({
  to,
  from = 0,
  prefix = "",
  suffix = "",
  duration = 2,
  className = "",
  group = false,
}: {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  /** add thousands separators */
  group?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [v, setV] = useState(to);
  const still = useStill();
  const fmt = (n: number) => `${prefix}${group ? n.toLocaleString("en-AU") : n}${suffix}`;
  useEffect(() => {
    if (still || !inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = animate(from, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [still, inView, from, to, duration]);
  return (
    <span ref={ref} className={`inline-block tabular-nums ${className}`} style={{ minWidth: `${fmt(to).length * 0.6}em` }}>
      {fmt(v)}
    </span>
  );
}
