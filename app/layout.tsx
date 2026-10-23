import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { Footer, Navbar } from "@/components/Chrome";
import { JsReady, RouteScrollReset, ScrollProgress, SmoothScroll } from "@/components/ui";
import { OG_IMAGE } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Self-hosted variable font (latin subset), font-display: swap, with a metric-matched fallback to limit layout shift.
const jakarta = localFont({
  src: "./fonts/PlusJakartaSans-latin-var.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-jakarta",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "10 Year Reserve Fund Plans for WA Strata | Reserve Fund Plans", template: "%s | Reserve Fund Plans" },
  applicationName: SITE_NAME,
  icons: { icon: "/favicon.svg" },
  openGraph: { siteName: SITE_NAME, locale: "en_AU", type: "website", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image" },
  // Production must always be indexable. Preview hosts get X-Robots-Tag: noindex from proxy.ts instead.
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#141414" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={jakarta.variable}>
      <body>
        {/* Without JavaScript: show everything that would otherwise animate in, and skip the intro overlays. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important}[style*="transform"]{transform:none!important}[style*="clip-path"]{clip-path:none!important}[data-preloader],[data-curtain]{display:none!important}`}</style>
        </noscript>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-semibold focus:text-ink focus:shadow-lg">
          Skip to content
        </a>
        <JsReady />
        <SmoothScroll />
        <RouteScrollReset />
        <ScrollProgress />
        <Navbar />
        <div id="main">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
