import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "skockaj_admin";
const API_BASE =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
// Secure by default in production; COOKIE_SECURE=0 can override for local http
const COOKIE_SECURE =
  process.env.COOKIE_SECURE != null
    ? process.env.COOKIE_SECURE === "1"
    : process.env.NODE_ENV === "production";

/** Failed logins per client IP per day (login page brute-force cap). */
const LOGIN_MAX_FAILURES = 5;
const LOGIN_WINDOW_MS = 24 * 60 * 60 * 1000;
const loginFailures = new Map<string, number[]>();

function clientIp(req: NextRequest): string {
  // last XFF hop is the one the trusted proxy appended
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",").pop()!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (loginFailures.get(key) ?? []).filter((t) => now - t < LOGIN_WINDOW_MS);
  loginFailures.set(key, hits);
  return hits.length >= LOGIN_MAX_FAILURES;
}

function recordFailure(key: string): void {
  const now = Date.now();
  const hits = (loginFailures.get(key) ?? []).filter((t) => now - t < LOGIN_WINDOW_MS);
  hits.push(now);
  loginFailures.set(key, hits);
}

function setSession(res: NextResponse, token: string) {
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: COOKIE_SECURE,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

/** POST — validate token with API, then set httpOnly session cookie. */
export async function POST(req: NextRequest) {
  let token = "";
  try {
    const body = await req.json();
    token = String(body?.token ?? "").trim();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!token) {
    return NextResponse.json({ error: "token required" }, { status: 400 });
  }

  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "too many attempts" },
      { status: 429, headers: { "Retry-After": "86400" } },
    );
  }

  const upstream = await fetch(`${API_BASE}/admin/ping`, {
    headers: { "X-Admin-Token": token },
    cache: "no-store",
  }).catch(() => null);

  if (!upstream) {
    return NextResponse.json({ error: "api unreachable" }, { status: 502 });
  }
  if (upstream.status === 503) {
    return NextResponse.json({ error: "ADMIN_TOKEN not configured" }, { status: 503 });
  }
  if (!upstream.ok) {
    recordFailure(ip);
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  loginFailures.delete(ip);
  const res = NextResponse.json({ status: "ok" });
  setSession(res, token);
  return res;
}

/** DELETE — clear session. */
export async function DELETE() {
  const res = NextResponse.json({ status: "ok" });
  res.cookies.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: COOKIE_SECURE,
    path: "/",
    maxAge: 0,
  });
  return res;
}
