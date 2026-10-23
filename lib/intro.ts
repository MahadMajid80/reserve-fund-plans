"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// True only for components rendered in the very first page load of a visit.
// Used to play the preloader once, and to skip the page-change curtain on that first load.
let played = false;

/**
 * True on every page except the homepage. Entrance and scroll-reveal animations only play on the homepage;
 * everywhere else content is rendered in its final state straight away (also in the server HTML, so the page is
 * fully visible even before, or without, JavaScript).
 */
export function useStill() {
  return usePathname() !== "/";
}

export function useFirstLoad() {
  const [first] = useState(() => !played);
  useEffect(() => {
    played = true;
  }, []);
  return first;
}
