const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method ?? "GET";
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> | undefined),
  };
  // Content-Type on GET forces a CORS preflight — only send it for bodies
  if (method !== "GET" && method !== "HEAD" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const isRead = method === "GET" || method === "HEAD";
  const res = await fetch(`${API_BASE}${path}`, {
    // Server reads participate in ISR; client fetch ignores `next`.
    // Mutations must never be cached.
    ...(isRead ? { next: { revalidate: 3600 } } : { cache: "no-store" as const }),
    ...init,
    headers,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}
