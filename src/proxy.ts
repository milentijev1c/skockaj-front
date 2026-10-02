import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "skockaj_admin";

/**
 * Admin page gate only. Security headers + CSP live in next.config.ts so public
 * pages stay prerenderable/cacheable (per-request nonces force dynamic rendering).
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") {
    if (req.cookies.get(COOKIE)?.value) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  } else if (!req.cookies.get(COOKIE)?.value) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
