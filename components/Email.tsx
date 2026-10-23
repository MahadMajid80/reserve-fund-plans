"use client";

import { useEffect, useState } from "react";
import { paths } from "@/lib/site";

/*
  Anti-scraping email link.

  The address never appears in the page's HTML, in the RSC payload or in the JSON-LD, so bots that read the
  HTML (which is how almost all address harvesters work) find nothing. In the HTML the "@" is drawn by CSS
  (.email-at::before), so it looks normal to visitors before JavaScript loads, and the link points to the
  contact page. As soon as the page hydrates, the real mailto: link and text are put in place.
*/
const USER = ["rf", "plans"].join("");
const DOMAIN = ["rfplans", "com", "au"].join(".");

export function Email({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready)
    return (
      <a href={paths.contact} className={className}>
        {USER}
        <span className="email-at">
          <span className="sr-only"> at </span>
        </span>
        {DOMAIN}
      </a>
    );

  const address = `${USER}@${DOMAIN}`;
  return (
    <a href={`mailto:${address}`} className={className}>
      {address}
    </a>
  );
}
