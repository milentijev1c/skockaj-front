import { NextResponse, type NextRequest } from "next/server";

const API_BASE =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/** Public catalog search (server-side proxy — no token). */
export async function GET(req: NextRequest) {
  const qs = req.nextUrl.searchParams.toString();
  const upstream = await fetch(`${API_BASE}/components/?${qs}`, { cache: "no-store" }).catch(
    () => null,
  );
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
