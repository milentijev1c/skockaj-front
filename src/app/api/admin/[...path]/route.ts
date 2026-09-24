import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "skockaj_admin";
const API_BASE =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const ALLOWED = new Set(["ping", "queue", "offers", "offers/batch", "catalog/refresh"]);

function isAllowed(path: string[]): boolean {
  if (path.length === 0) return false;
  const head = path[0];
  if (head === "queue") {
    // /queue
    if (path.length === 1) return true;
    // /queue/:id/approve | /queue/:id/reject
    if (path.length === 3 && /^\d+$/.test(path[1] ?? "")) {
      return path[2] === "approve" || path[2] === "reject";
    }
    return false;
  }
  if (head === "offers") {
    // /offers or /offers/batch
    return path.length === 1 || (path.length === 2 && path[1] === "batch");
  }
  return ALLOWED.has(path.join("/"));
}

async function proxy(req: NextRequest, path: string[]) {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isAllowed(path)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // never forward the cookie upstream — only the API token header
  const url = `${API_BASE}/admin/${path.join("/")}${req.nextUrl.search}`;
  const headers: Record<string, string> = {
    "X-Admin-Token": token,
  };
  if (req.headers.get("content-type")) {
    headers["content-type"] = req.headers.get("content-type")!;
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
  return ctx.params.then(({ path }) => proxy(req, path));
}
export function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return ctx.params.then(({ path }) => proxy(req, path));
}
export function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return ctx.params.then(({ path }) => proxy(req, path));
}
export function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return ctx.params.then(({ path }) => proxy(req, path));
}
export function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return ctx.params.then(({ path }) => proxy(req, path));
}
