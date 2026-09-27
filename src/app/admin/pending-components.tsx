"use client";

import { useCallback, useEffect, useState } from "react";
import type { Component } from "@/lib/types";
import { approveComponent, fetchPendingComponents } from "@/lib/admin";
import { EmptyState, SkeletonList } from "../ui-states";

/**
 * Pending components — scraped/adopted catalog rows that are not public
 * until an admin approves them.
 */
export default function PendingComponents() {
  const [items, setItems] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const rows = await fetchPendingComponents(50);
      setItems(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Greška pri učitavanju komponenti");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setLoading(true);
      void load();
    }, 0);
    return () => window.clearTimeout(t);
  }, [load]);

  async function onApprove(id: number) {
    setBusyId(id);
    try {
      await approveComponent(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Odobravanje nije uspelo");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section aria-label="nove komponente" className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <p
            className="text-[10px] tracking-[0.2em] uppercase mb-2"
            style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}
          >
            katalog
          </p>
          <h2
            className="text-lg font-bold mb-1"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            nove komponente
          </h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Tek usvojene komponente nisu javne dok ih ne odobriš.
          </p>
        </div>
        {!loading && items.length > 0 && (
          <span
            className="text-xs px-3 py-1.5"
            style={{
              border: "1px solid var(--edge)",
              color: "var(--text-muted)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {items.length} na čekanju
          </span>
        )}
      </div>

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
        <SkeletonList rows={3} lines={2} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Nema novih komponenti"
          description="Sve usvojene komponente su već odobrene."
        />
      ) : (
        <ul
          style={{
            background: "var(--panel)",
            border: "1px solid var(--edge)",
            borderRadius: 2,
            overflow: "hidden",
          }}
          aria-label="komponente na čekanju"
        >
          {items.map((c) => {
            const busy = busyId === c.id;
            return (
              <li
                key={c.id}
                className="row-hover px-5 py-4"
                style={{ borderBottom: "1px solid var(--edge)" }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className="text-[10px] tracking-widest uppercase px-1.5 py-0.5"
                        style={{
                          border: "1px solid var(--edge)",
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-geist-mono)",
                        }}
                      >
                        {c.category}
                      </span>
                      <span
                        className="text-[10px] tracking-widest uppercase px-1.5 py-0.5"
                        style={{
                          border: "1px solid var(--amber)",
                          color: "var(--amber)",
                          fontFamily: "var(--font-geist-mono)",
                        }}
                      >
                        pending
                      </span>
                    </div>
                    <p className="text-sm font-medium truncate" title={c.name}>
                      {c.name}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {c.manufacturer}
                      {c.socket ? ` · ${c.socket}` : ""}
                      {c.prices?.length ? ` · ${c.prices.length} cena` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void onApprove(c.id)}
                    className="text-xs px-3 py-1.5 shrink-0"
                    style={{
                      border: "1px solid var(--glow)",
                      background: "var(--glow-dim)",
                      color: "var(--glow)",
                      fontFamily: "var(--font-geist-mono)",
                      opacity: busy ? 0.6 : 1,
                    }}
                  >
                    {busy ? "…" : "odobri"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
