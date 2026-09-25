import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "skockaj_admin";

const BASE_SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
};

/**
 * Nonce CSP (Next.js 16: proxy injects nonce, framework tags scripts).
 * Pages must be dynamically rendered for the nonce to apply — see root layout.
 */
function buildCsp(nonce: string, isDev: boolean): string {
  // API origin for fetch() — prod + local compose
  const apiOrigin = process.env.NEXT_PUBLIC_API_URL
    ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
    : "";
  const connect = ["'self'", "https://api.skockaj.rs", apiOrigin, isDev ? "http://localhost:8000" : ""]
    .filter(Boolean)
    .join(" ");

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Tailwind + Next inline styles; styles rarely carry XSS payload
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https:",
    "font-src 'self' data:",
    `connect-src ${connect}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(process.env.COOKIE_SECURE === "1" ? ["upgrade-insecure-requests"] : []),
  ]
    .join("; ")
    .trim();
}

function withSecurityHeaders(res: NextResponse, csp: string): NextResponse {
  for (const [k, v] of Object.entries(BASE_SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }
  res.headers.set("Content-Security-Policy", csp);
  if (process.env.COOKIE_SECURE === "1") {
    res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  return res;
}

/** Page gate for /admin + security headers + nonce CSP on every page response. */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDev = process.env.NODE_ENV === "development";
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce, isDev);

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (req.cookies.get(COOKIE)?.value) {
        return withSecurityHeaders(NextResponse.redirect(new URL("/admin", req.url)), csp);
      }
    } else if (!req.cookies.get(COOKIE)?.value) {
      return withSecurityHeaders(NextResponse.redirect(new URL("/admin/login", req.url)), csp);
    }
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });
  return withSecurityHeaders(res, csp);
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|api/).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
