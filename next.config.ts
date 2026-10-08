import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Baseline security headers on every response. No Content-Security-Policy
// yet, deliberately: the site uses inline JSON-LD, framer-motion inline
// styles, next/font and Vercel scripts, and a CSP that hasn't been tested
// against all of that would silently break pages. Add one (report-only
// first) once it can be verified in a browser.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Browsers ignore HSTS over plain http, so this is harmless on localhost.
  // `preload` commits the whole domain (all subdomains) to HTTPS — only
  // submit to hstspreload.org once every subdomain serves HTTPS.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework/version in an `X-Powered-By` header.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // The category detail pages (/products/category/<id>) are switched off for
  // now — /products shows each category as a card instead. Old links,
  // bookmarks and indexed URLs land on that card. TEMPORARY (307), not 308:
  // the pages may come back (route + lib/data/categoryContent.ts are in git).
  async redirects() {
    return [
      // /resources was removed (client decision 2026-10-08) — "Resources" is
      // now only a menu label. Old links land on News & Media. Exact path
      // only: /resources/installation still exists.
      { source: "/resources", destination: "/articles", permanent: true },
      { source: "/hi/resources", destination: "/hi/articles", permanent: true },
      // The 2-layer tank lost "ISI" from its name and slug (no certification
      // is held yet — client rule, 2026-10-08). Old links land on the new URL.
      {
        source: "/hi/products/poddar-isi-2-layer-water-storage-tanks",
        destination: "/hi/products/poddar-2-layer-water-storage-tanks",
        permanent: true,
      },
      {
        source: "/products/poddar-isi-2-layer-water-storage-tanks",
        destination: "/products/poddar-2-layer-water-storage-tanks",
        permanent: true,
      },
      {
        source: "/products/category/:category",
        destination: "/products?category=:category",
        permanent: false,
      },
      {
        source: "/:locale/products/category/:category",
        destination: "/:locale/products?category=:category",
        permanent: false,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "cdn.pixabay.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
