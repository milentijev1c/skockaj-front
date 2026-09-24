import type { Component, MatchQueueItem } from "./types";

/**
 * Admin calls go through the Next BFF (`/api/admin/*`).
 * The token lives in an httpOnly cookie — JS never sees it.
 */

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/admin/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: "same-origin",
  });
  if (res.status === 204) return undefined as T;
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${body}`);
  }
  return body ? (JSON.parse(body) as T) : (undefined as T);
}

export function fetchQueue(status: string = "pending", limit = 50): Promise<MatchQueueItem[]> {
  return adminFetch(`queue?status=${encodeURIComponent(status)}&limit=${limit}`);
}

export function approveMatch(matchId: number, componentId: number): Promise<MatchQueueItem> {
  return adminFetch(`queue/${matchId}/approve`, {
    method: "POST",
    body: JSON.stringify({ component_id: componentId }),
  });
}

export function rejectMatch(matchId: number): Promise<void> {
  return adminFetch(`queue/${matchId}/reject`, { method: "POST" });
}

export function searchComponents(q: string, limit = 20): Promise<Component[]> {
  const params = new URLSearchParams({ q, limit: String(limit) });
  // public catalog — same-origin Next proxy not required
  return fetch(`/api/catalog?${params}`, { cache: "no-store" }).then(async (r) => {
    if (!r.ok) throw new Error(`API ${r.status}`);
    return r.json();
  });
}

export function adminPing(): Promise<{ status: string }> {
  return adminFetch("ping");
}

export async function adminLogin(token: string): Promise<void> {
  const res = await fetch("/api/admin/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    credentials: "same-origin",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(typeof body?.error === "string" ? body.error : `HTTP ${res.status}`);
  }
}

export async function clearAdminSession(): Promise<void> {
  await fetch("/api/admin/session", {
    method: "DELETE",
    credentials: "same-origin",
  }).catch(() => {});
}
