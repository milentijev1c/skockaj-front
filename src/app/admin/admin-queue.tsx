"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Component, MatchQueueItem } from "@/lib/types";
import { STORE_NAMES } from "@/lib/types";
import { approveMatch, clearAdminSession, fetchQueue, rejectMatch, searchComponents } from "@/lib/admin";
import { EmptyState, SkeletonList } from "../ui-states";

type Status = "pending" | "approved" | "rejected";

const TABS: { id: Status; label: string }[] = [
  { id: "pending", label: "na čekanju" },
  { id: "approved", label: "odobrene" },
  { id: "rejected", label: "odbijene" },
];

function fmtRsd(n: number): string {
  return new Intl.NumberFormat("sr-RS", { maximumFractionDigits: 0 }).format(n) + " RSD";
}

function confPct(c: number): string {
  return `${Math.round(c * 100)}%`;
}

export default function AdminQueue() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("pending");
  const [items, setItems] = useState<MatchQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Component[]>([]);
  const [searching, setSearching] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const rows = await fetchQueue(status, 50);
      setItems(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Greška pri učitavanju reda");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setLoading(true);
      void load();
    }, 0);
    return () => window.clearTimeout(t);
  }, [load]);

  useEffect(() => {
    if (openId) return;
    const t = window.setTimeout(() => {
      setQuery("");
      setResults([]);
    }, 0);
    return () => window.clearTimeout(t);
  }, [openId]);

  useEffect(() => {
    if (!openId) return;
    const q = query.trim();
    if (q.length < 2) {
      const t = window.setTimeout(() => setResults([]), 0);
      return () => window.clearTimeout(t);
    }
    let cancelled = false;
    const t = setTimeout(() => {
      setSearching(true);
      searchComponents(q, 20)
        .then((rows) => {
          if (!cancelled) setResults(rows);
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query, openId]);

  const stats = useMemo(
    () => ({
      total: items.length,
      withCandidate: items.filter((i) => i.component_id != null).length,
    }),
    [items],
  );

  async function onApprove(matchId: number, componentId: number) {
    setBusyId(matchId);
    try {
      await approveMatch(matchId, componentId);
      setItems((prev) => prev.filter((x) => x.id !== matchId));
      setOpenId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Odobravanje nije uspelo");
    } finally {
      setBusyId(null);
    }
  }

  async function onReject(matchId: number) {
    setBusyId(matchId);
    try {
      await rejectMatch(matchId);
      setItems((prev) => prev.filter((x) => x.id !== matchId));
      setOpenId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Odbijanje nije uspelo");
    } finally {
      setBusyId(null);
    }
  }

  const actionable = status === "pending";

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p
            className="text-[10px] tracking-[0.2em] uppercase mb-2"
            style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}
          >
            admin
          </p>
          <h1
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            red usklađivanja
          </h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Upari scrape ponude sa kataloškim komponentama. Predlog = fuzzy kandidat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              void clearAdminSession().then(() => router.replace("/admin/login"));
            }}
            className="text-xs px-3 py-1.5"
            style={{
              border: "1px solid var(--edge)",
              color: "var(--text-dim)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            odjavi se
          </button>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setStatus(t.id);
                setOpenId(null);
              }}
              aria-pressed={status === t.id}
              className={`chip-btn text-xs px-3 py-1.5 ${status === t.id ? "is-active" : ""}`}
              style={{
                border: "1px solid var(--edge)",
                background: status === t.id ? "var(--glow-dim)" : "var(--panel)",
                color: status === t.id ? "var(--glow)" : "var(--text-muted)",
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      {!loading && actionable && items.length > 0 && (
        <div
          className="flex flex-wrap gap-4 mb-4 px-4 py-3 text-xs"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--edge)",
            fontFamily: "var(--font-geist-mono)",
            color: "var(--text-muted)",
          }}
        >
          <span>
            <strong style={{ color: "var(--text)" }}>{stats.total}</strong> na čekanju
          </span>
          <span>
            <strong style={{ color: "var(--glow)" }}>{stats.withCandidate}</strong> sa predlogom
          </span>
          <span>
            <strong style={{ color: "var(--text)" }}>{stats.total - stats.withCandidate}</strong> bez predloga
          </span>
        </div>
      )}

      {error && (
        <div
          className="text-xs mb-4 px-4 py-3"
          style={{
            border: "1px solid var(--coral)",
            background: "var(--tint-danger)",
            color: "var(--text)",
          }}
          role="alert"
        >
          {error}
        </div>
      )}

      {loading ? (
        <SkeletonList rows={5} lines={2} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Red je prazan"
          description={
            status === "pending"
              ? "Nema ponuda koje čekaju uparivanje."
              : "Nema stavki u ovom statusu."
          }
        />
      ) : (
        <ul
          style={{
            background: "var(--panel)",
            border: "1px solid var(--edge)",
            borderRadius: 2,
            overflow: "hidden",
          }}
          aria-label="stavke reda"
        >
          {items.map((item) => {
            const offer = item.offer;
            const expanded = openId === item.id;
            const busy = busyId === item.id;
            const conf = item.confidence;
            const confColor =
              conf >= 0.75 ? "var(--glow)" : conf >= 0.5 ? "var(--amber)" : "var(--coral)";

            return (
              <li
                key={item.id}
                className="row-hover px-5 py-4"
                style={{
                  borderBottom: "1px solid var(--edge)",
                  background: expanded ? "var(--edge-soft)" : undefined,
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className="text-[10px] tracking-widest uppercase px-1.5 py-0.5"
                        style={{
                          border: "1px solid var(--edge)",
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-geist-mono)",
                        }}
                      >
                        {STORE_NAMES[offer?.source ?? ""] ?? offer?.source ?? "?"}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5"
                        style={{
                          border: `1px solid ${confColor}`,
                          color: confColor,
                          fontFamily: "var(--font-geist-mono)",
                        }}
                        title="pouzdanost fuzzy predloga"
                      >
                        {confPct(conf)}
                      </span>
                      <span
                        className="text-[10px]"
                        style={{ color: "var(--text-dim)", fontFamily: "var(--font-geist-mono)" }}
                      >
                        sloj {item.match_layer}
                      </span>
                      {item.component_id != null && (
                        <span
                          className="text-[10px] px-1.5 py-0.5"
                          style={{
                            background: "var(--glow-dim)",
                            color: "var(--glow)",
                            fontFamily: "var(--font-geist-mono)",
                          }}
                        >
                          predlog #{item.component_id}
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-medium mb-1 break-words leading-snug">
                      {offer?.raw_name ?? "(nema ponude)"}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      {offer && (
                        <span
                          style={{ color: "var(--text)", fontFamily: "var(--font-geist-mono)" }}
                        >
                          {fmtRsd(offer.raw_price)}
                        </span>
                      )}
                      {offer?.url && (
                        <a
                          href={offer.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "var(--text-muted)", textDecoration: "underline" }}
                        >
                          izvor ↗
                        </a>
                      )}
                    </div>
                  </div>

                  {actionable && (
                    <div className="flex flex-wrap gap-2 shrink-0">
                      {item.component_id != null && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => onApprove(item.id, item.component_id!)}
                          className="btn-glow text-xs px-3 py-1.5"
                          style={{ fontFamily: "var(--font-geist-mono)" }}
                        >
                          odobri predlog
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => setOpenId(expanded ? null : item.id)}
                        className="btn-ghost text-xs px-3 py-1.5"
                        style={{
                          border: "1px solid var(--edge)",
                          color: expanded ? "var(--glow)" : "var(--text)",
                          background: expanded ? "var(--glow-dim)" : "transparent",
                          fontFamily: "var(--font-geist-mono)",
                        }}
                      >
                        {expanded ? "zatvori" : "upari…"}
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onReject(item.id)}
                        className="btn-danger text-xs px-3 py-1.5"
                        style={{
                          border: "1px solid var(--edge)",
                          color: "var(--coral)",
                          fontFamily: "var(--font-geist-mono)",
                        }}
                      >
                        odbaci
                      </button>
                    </div>
                  )}
                </div>

                {expanded && (
                  <div className="mt-4 pt-4" style={{ borderTop: "1px dashed var(--edge)" }}>
                    <label className="block text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                      Pretraži katalog
                      <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="npr. Ryzen 5 7600X, B650, RTX 4060…"
                        className="mt-1 w-full text-sm px-3 py-2"
                        style={{
                          background: "var(--void)",
                          border: "1px solid var(--edge)",
                          color: "var(--text)",
                          borderRadius: 2,
                        }}
                      />
                    </label>

                    {searching && (
                      <p className="text-xs mb-2" style={{ color: "var(--text-dim)" }}>
                        tražim…
                      </p>
                    )}
                    {!searching && query.trim().length >= 2 && results.length === 0 && (
                      <p className="text-xs mb-2" style={{ color: "var(--text-dim)" }}>
                        Nema rezultata.
                      </p>
                    )}

                    <ul className="max-h-64 overflow-auto">
                      {results.map((c) => (
                        <li
                          key={c.id}
                          className="flex items-center justify-between gap-3 py-2 px-1"
                          style={{ borderBottom: "1px solid var(--edge)" }}
                        >
                          <div className="min-w-0">
                            <div className="text-sm truncate">{c.name}</div>
                            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                              #{c.id} · {c.category}
                              {c.socket ? ` · ${c.socket}` : ""}
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => onApprove(item.id, c.id)}
                            className="btn-glow text-xs px-3 py-1.5 shrink-0"
                            style={{ fontFamily: "var(--font-geist-mono)" }}
                          >
                            upari
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
