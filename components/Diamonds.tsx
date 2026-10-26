"use client";

import { motion } from "framer-motion";
import { logoSrc, logoWhiteSrc } from "@/lib/content";

// The four diamonds of the service icons on the old Reserve Fund Plans site (shared with the BIV logo):
// top blue, right yellow, bottom red, left green. Each diamond is 31 wide by 41 tall.
const D = (cx: number, cy: number) => `M${cx} ${cy - 20.5} L${cx + 15.5} ${cy} L${cx} ${cy + 20.5} L${cx - 15.5} ${cy} Z`;
const SHAPES = [
  { d: D(42.5, 25), fill: "#3E56A2" },
  { d: D(59.5, 48), fill: "#E7C633" },
  { d: D(42.5, 71), fill: "#CB212D" },
  { d: D(25.5, 48), fill: "#589A50" },
];

/**
 * The diamond mark in its four colours.
 * `line` draws outlines in `currentColor` (for large background decoration); `mono` fills in `currentColor`.
 */
export function Mark({
  className = "",
  animate = false,
  line = false,
  mono = false,
}: {
  className?: string;
  animate?: boolean;
  line?: boolean;
  mono?: boolean;
  /** kept for older call sites; no longer used */
  accent?: number;
}) {
  return (
    <svg viewBox="-3 3 91 90" className={className} aria-hidden>
      {SHAPES.map((s, i) => (
        <motion.path
          key={s.d}
          d={s.d}
          fill={line ? "none" : mono ? "currentColor" : s.fill}
          stroke={line ? "currentColor" : "none"}
          strokeWidth={line ? 0.8 : 0}
          strokeLinejoin="round"
          initial={animate ? { opacity: 0, scale: 0.4 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: animate ? 0.1 + i * 0.1 : 0 }}
          style={{ transformOrigin: "42.5px 48px", transformBox: "view-box" }}
        />
      ))}
    </svg>
  );
}

// Inner diamond cut out of the outlined one (the ring is about a sixth of the diamond's width, as on the old icons).
const Dinner = (cx: number, cy: number) => `M${cx} ${cy - 13.6} L${cx + 10.3} ${cy} L${cx} ${cy + 13.6} L${cx - 10.3} ${cy} Z`;
const ICON_KEYS = ["blue", "brass", "oxblood", "sage"] as const; // same order as SHAPES

/**
 * A service icon from the old Reserve Fund Plans site: the four diamonds, with the given report's diamond drawn as an
 * outline (BIV top/blue, WHS left/green, Reserve Fund Plans right/yellow, Asbestos bottom/red).
 */
export function ServiceIcon({ k, className = "h-16 w-auto" }: { k: (typeof ICON_KEYS)[number]; className?: string }) {
  const centres: [number, number][] = [[42.5, 25], [59.5, 48], [42.5, 71], [25.5, 48]];
  return (
    <svg viewBox="8 2 69 92" className={className} aria-hidden="true" focusable="false">
      {SHAPES.map((s, i) =>
        ICON_KEYS[i] === k ? (
          <path key={s.d} d={`${s.d} ${Dinner(...centres[i])}`} fill={s.fill} fillRule="evenodd" />
        ) : (
          <path key={s.d} d={s.d} fill={s.fill} />
        ),
      )}
    </svg>
  );
}

/** The Reserve Fund Plans logo (a yellow-on-black badge that reads on light and dark grounds). */
export function Logo({ onDark = false, className = "h-11" }: { onDark?: boolean; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={onDark ? logoWhiteSrc : logoSrc} alt="Reserve Fund Plans" width={261} height={100} className={`w-auto select-none ${className}`} draggable={false} />
  );
}
