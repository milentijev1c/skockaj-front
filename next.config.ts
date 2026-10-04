import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const apiOrigin = process.env.NEXT_PUBLIC_API_URL
  ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
  : "";

// Static CSP (no per-request nonce) so pages can be prerendered and CDN-cached.
// Nonce CSP requires dynamic rendering and disables HTML caching — see proxy.ts.
const csp = [
  "default-src 'self'",
  // Next.js emits inline RSC/flight scripts; without nonces, 'unsafe-inline' is required.
  // va.vercel-scripts.com / *.vercel-insights.com = @vercel/analytics
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https:",
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    "https://api.skockaj.rs",
    "https://va.vercel-scripts.com",
    "https://*.vercel-insights.com",
    apiOrigin,
    isDev ? "http://localhost:8000" : "",
  ]
    .filter(Boolean)
    .join(" "),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(process.env.COOKIE_SECURE === "1" ? ["upgrade-insecure-requests"] : []),
]
  .join("; ")
  .trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  ...(process.env.COOKIE_SECURE === "1"
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : []),
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/pravila-privatnosti",
        destination: "/politika-privatnosti",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Store logos are content-stable; stop revalidating every visit.
        source: "/logos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
