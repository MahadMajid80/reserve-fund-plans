/** @type {import('next').NextConfig} */

// Redirects are only for URLs that genuinely change. Every page URL from the old WordPress site is served
// at its original path (see docs/url-migration-map.csv). Test-content URLs that are being removed answer
// 410 Gone from proxy.ts rather than being redirected to the homepage.
const r = (source, destination) => ({ source, destination, statusCode: 301 });

const dev = process.env.NODE_ENV !== "production";

// Content Security Policy: this site plus Google reCAPTCHA (only loaded once someone starts the quote form).
// 'unsafe-inline' for scripts is needed by Next.js' inline hydration on statically generated pages
// (a nonce would force every page to render on demand and lose static HTML speed).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""} https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.gstatic.com",
  "font-src 'self'",
  "connect-src 'self' https://www.google.com/recaptcha/",
  "frame-src https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
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
  // HTTPS only for a year. includeSubDomains/preload left off so other subdomains (e.g. mail) are unaffected.
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig = {
  // Every URL ends in "/" like the old WordPress site. Next's own slash redirect is a 308, so it is off
  // and proxy.ts sends a single 301 from "/about-us" to "/about-us/" instead.
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  poweredByHeader: false,
  reactStrictMode: true,

  images: { formats: ["image/avif", "image/webp"], minimumCacheTTL: 60 * 60 * 24 * 30 },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
      { source: "/:all*(jpg|jpeg|png|svg|webp|avif|ico)", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }] },
    ];
  },

  async redirects() {
    return [
      // WordPress image attachment page → the image itself (the image keeps its original URL)
      r("/home-2/uev-img_9964/", "/wp-content/uploads/2018/04/UEV-IMG_9964.jpg"),
      r("/home-2/uev-img_9964", "/wp-content/uploads/2018/04/UEV-IMG_9964.jpg"),
      // old logo and hero slider image → current files. TODO [ASK]: supply the original logo artwork.
      r("/wp-content/uploads/2018/10/RFP-WA-Logo-5-Oct-2018.png", "/logo.png"),
      r("/wp-content/uploads/2018/04/UEV-IMG_9961-e1523419492177.jpg", "/images/strata-building.jpg"),
      r("/wp-content/uploads/2018/04/UEV-IMG_9964-300x225.jpg", "/wp-content/uploads/2018/04/UEV-IMG_9964.jpg"),
      // WordPress sitemap and feed leftovers
      r("/wp-sitemap.xml", "/sitemap.xml"),
      r("/sitemap_index.xml", "/sitemap.xml"),
      r("/feed/", "/"),
      r("/comments/feed/", "/"),
    ];
  },
};

export default nextConfig;
