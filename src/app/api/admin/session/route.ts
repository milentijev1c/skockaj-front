import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "skockaj_admin";
const API_BASE =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const COOKIE_SECURE = process.env.COOKIE_SECURE === "1";

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
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

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
