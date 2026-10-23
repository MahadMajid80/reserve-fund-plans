import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { OG_IMAGE, organizationSchema, websiteSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Self-hosted variable fonts (latin subset), swap with metric-matched fallbacks to limit layout shift.
const fraunces = localFont({
  src: "./fonts/Fraunces-latin-var.woff2",
  weight: "300 800",
  // "optional": the headline never re-paints late on slow connections (protects LCP and CLS); it shows the
  // Georgia-based fallback on a slow first visit and Fraunces from cache afterwards.
  display: "optional",
  variable: "--font-fraunces",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});
const instrument = localFont({
  src: "./fonts/InstrumentSans-latin-var.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--font-instrument",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "10-Year Reserve Fund Plans for WA Strata | Reserve Fund Plans", template: "%s | Reserve Fund Plans" },
  applicationName: SITE_NAME,
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
  openGraph: { siteName: SITE_NAME, locale: "en_AU", type: "website", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image" },
  // Production must always be indexable. Preview hosts get X-Robots-Tag: noindex from proxy.ts instead.
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#12302a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${fraunces.variable} ${instrument.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-white focus:px-5 focus:py-3 focus:font-semibold focus:text-ink focus:shadow-lg">
          Skip to content
        </a>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
