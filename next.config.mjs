/** @type {import('next').NextConfig} */

// 301 redirects. Only for (a) the temporary paths the new site used before launch, and (b) old WordPress
// leftovers. Every page URL from the old sitemap is served directly at its original path (no redirect).
const r = (source, destination) => ({ source, destination, statusCode: 301 });

const dev = process.env.NODE_ENV !== "production";

// Content Security Policy: only this site, Google reCAPTCHA, Google Analytics and (on Vercel preview
// deployments only) the Vercel toolbar may load scripts, frames or make requests.
// 'unsafe-inline' for scripts is needed by Next.js' inline hydration scripts on statically generated pages
// (a nonce would force every page to render on demand and lose the speed of static HTML).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.googletagmanager.com https://vercel.live`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://www.google-analytics.com https://www.googletagmanager.com https://www.gstatic.com https://vercel.live https://vercel.com",
  "font-src 'self' data: https://vercel.live",
  "connect-src 'self' https://www.google.com/recaptcha/ https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://vercel.live wss://ws-us3.pusher.com",
  "frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/ https://vercel.live",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // HTTPS only for a year. (includeSubDomains/preload left off so other subdomains, e.g. mail, are not affected.)
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  // Every URL ends in "/" like the old WordPress site. Next's own slash redirect is a 308, so it is switched
  // off here and proxy.ts sends a single 301 from "/about-us" to "/about-us/" instead.
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  // no "X-Powered-By: Next.js" header (don't advertise the stack)
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // building photos come from Unsplash's CDN (see lib/photos.ts)
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // the form API: never cached
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
      // images and icons in /public: cached by browsers and the CDN for a week, refreshed in the background
      { source: "/:all*(jpg|jpeg|png|svg|webp|avif|ico)", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
    ];
  },

  async redirects() {
    return [
      // reservefundplans.com.au (no www) → https://www.reservefundplans.com.au is handled in proxy.ts (one hop, slash included).

      // WordPress image attachment page → the image itself (the image keeps its original URL)
      r("/home-2/uev-img_9964/", "/wp-content/uploads/2018/04/UEV-IMG_9964.jpg"),
      // old logo, slider image and thumbnail → current files
      r("/wp-content/uploads/2018/10/RFP-WA-Logo-5-Oct-2018.png", "/rfp-logo.png"),
      r("/wp-content/uploads/2018/04/UEV-IMG_9961-e1523419492177.jpg", "/building.jpg"),
      r("/wp-content/uploads/2018/04/UEV-IMG_9964-300x225.jpg", "/wp-content/uploads/2018/04/UEV-IMG_9964.jpg"),

      // WordPress leftovers
      r("/wp-sitemap.xml", "/sitemap.xml"),
      r("/sitemap_index.xml", "/sitemap.xml"),
      r("/feed", "/"),
      r("/feed/", "/"),
      r("/comments/feed", "/"),
      r("/comments/feed/", "/"),
    ];
  },
};

export default nextConfig;
