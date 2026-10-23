"use client";

import Script from "next/script";
import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { GA_ID } from "@/lib/site";

/**
 * Loads GA4 when NEXT_PUBLIC_GA_ID is set, and reports every tel: link click as a "phone_call" event
 * (plus "generate_lead" fires from the quote form on a successful submit).
 */
export function Analytics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href^='tel:']") as HTMLAnchorElement | null;
      if (a) track("phone_call", { link_url: a.getAttribute("href"), link_text: a.textContent?.trim() ?? "", page_path: location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
