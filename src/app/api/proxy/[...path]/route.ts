import { NextResponse, type NextRequest } from "next/server";

const API_BASE =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const FRONTEND_SECRET = process.env.FRONTEND_SECRET || "";

const ALLOWED_PREFIXES = ["builds", "contact", "compatibility", "components"];

function isAllowed(path: string[]): boolean {
  return path.length > 0 && ALLOWED_PREFIXES.includes(path[0]);
}

/**
 * Same-origin proxy for public API calls.
 * Browser never sees FRONTEND_SECRET — we inject X-Frontend-Secret here.
 */
async function forward(req: NextRequest, path: string[]) {
  if (!isAllowed(path)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const url = `${API_BASE}/${path.join("/")}${req.nextUrl.search}`;
  const headers: Record<string, string> = {};
  const ct = req.headers.get("content-type");
  if (ct) headers["content-type"] = ct;
  if (req.method !== "GET" && req.method !== "HEAD" && FRONTEND_SECRET) {
    headers["X-Frontend-Secret"] = FRONTEND_SECRET;
  }

  const init: RequestInit = { method: req.method, headers, cache: "no-store" };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  const upstream = await fetch(url, init).catch(() => null);
  if (!upstream) {
    return NextResponse.json({ error: "api unreachable" }, { status: 502 });
  }

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json",
    },
  });
}

export function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return ctx.params.then(({ path }) => forward(req, path));
}
export function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return ctx.params.then(({ path }) => forward(req, path));
}
export function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return ctx.params.then(({ path }) => forward(req, path));
}
export function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return ctx.params.then(({ path }) => forward(req, path));
}
