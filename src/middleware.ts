import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "skockaj_admin";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  // full CSP is Next-sensitive — lock embedding now, expand after TLS
  "Content-Security-Policy": "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
};

function withSecurityHeaders(res: NextResponse): NextResponse {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v);
  }
  if (process.env.COOKIE_SECURE === "1") {
    res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  return res;
}

/** Page gate for /admin + baseline security headers on every response. */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (req.cookies.get(COOKIE)?.value) {
        return withSecurityHeaders(NextResponse.redirect(new URL("/admin", req.url)));
      }
      return withSecurityHeaders(NextResponse.next());
    }
    if (!req.cookies.get(COOKIE)?.value) {
      return withSecurityHeaders(NextResponse.redirect(new URL("/admin/login", req.url)));
    }
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
