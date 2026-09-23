"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Component, ScrapedPrice } from "@/lib/types";
import { CATEGORIES, STORE_NAMES, categoryToSlug } from "@/lib/types";
import { apiFetch } from "@/lib/api";

export default function ComponentDetail({ component }: { component: Component }) {
  const [added, setAdded] = useState(false);
  const [scrapedPrices, setScrapedPrices] = useState<ScrapedPrice[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const c = component;

  useEffect(() => {
    apiFetch<ScrapedPrice[]>(`/components/${c.id}/prices`)
      .then(setScrapedPrices)
      .catch(() => setScrapedPrices([]))
      .finally(() => setLoadingPrices(false));
  }, [c.id]);

  const categoryLabel = CATEGORIES.find((cat) => cat.value === c.category)?.label ?? c.category;
  const cheapest = scrapedPrices.length > 0 ? Math.min(...scrapedPrices.map((p) => p.price)) : null;

  const addToBuilder = () => {
    const stored: number[] = JSON.parse(localStorage.getItem("builder") || "[]");
    if (!stored.includes(c.id)) {
      stored.push(c.id);
      localStorage.setItem("builder", JSON.stringify(stored));
    }
    setAdded(true);
  };

  // Deduplicate: best price per store
  const bestPerStore = new Map<string, ScrapedPrice>();
  for (const p of scrapedPrices) {
    const existing = bestPerStore.get(p.source);
    if (!existing || p.price < existing.price) {
      bestPerStore.set(p.source, p);
    }
  }
  const storeOffers = [...bestPerStore.values()].sort((a, b) => a.price - b.price);

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs mb-6" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
        <Link href="/komponente" className="hover-link" style={{ color: "var(--text-muted)" }}>Komponente</Link>
        <span>/</span>
        <Link href={`/komponente?kategorija=${categoryToSlug(c.category) ?? c.category}`} className="hover-link" style={{ color: "var(--text-muted)" }}>{categoryLabel}</Link>
        <span>/</span>
        <span style={{ color: "var(--glow)" }}>{c.manufacturer}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div>
          <div className="inline-block text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 mb-3"
            style={{ background: "var(--glow-dim)", color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>
            {categoryLabel}
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2" style={{ fontFamily: "var(--font-geist-sans)" }}>
            {c.name}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
            <span>{c.manufacturer}</span>
            {c.socket && <span style={{ color: "var(--glow)" }}>Socket: {c.socket}</span>}
            {c.ram_type && <span style={{ color: "var(--glow)" }}>{c.ram_type}</span>}
            {c.tdp_w > 0 && <span>TDP: {c.tdp_w}W</span>}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          {cheapest !== null && (
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                Najniža cena
              </div>
              <div className="text-3xl font-black" style={{ color: "var(--amber)", fontFamily: "var(--font-geist-mono)" }}>
                {cheapest.toLocaleString("sr")}
                <span className="text-sm font-normal ml-1" style={{ color: "var(--text-muted)" }}>RSD</span>
              </div>
            </div>
          )}
          <button
            onClick={addToBuilder}
            className="btn-glow px-5 py-3 text-xs font-bold tracking-widest uppercase"
            style={{
              background: added ? "var(--glow)" : "transparent",
              color: added ? "var(--void)" : "var(--glow)",
              border: "1px solid var(--glow)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            {added ? "Dodato ✓" : "Dodaj u konfigurator"}
          </button>
        </div>
      </div>

      {/* Price table */}
      <div className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--text-muted)" }}>
          Ponude iz prodavnica ({storeOffers.length})
        </h2>

        {loadingPrices ? (
          <div className="p-8 text-center" style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}>
            <div className="animate-pulse text-sm" style={{ color: "var(--text-muted)" }}>Učitavanje cena...</div>
          </div>
        ) : storeOffers.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ background: "var(--panel)", border: "1px solid var(--edge)", color: "var(--text-muted)" }}>
            Trenutno nema ponuda za ovu komponentu.
          </div>
        ) : (
          <div style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}>
            {storeOffers.map((offer, i) => (
              <div
                key={offer.source}
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: i < storeOffers.length - 1 ? "1px solid var(--edge)" : "none", background: i === 0 ? "rgba(0,212,170,0.03)" : "transparent" }}
              >
                <div className="flex items-center gap-3">
                  {i === 0 && (
                    <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5" style={{ background: "var(--glow)", color: "var(--void)", fontFamily: "var(--font-geist-mono)" }}>
                      Najpovoljnije
                    </span>
                  )}
                  <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                    {STORE_NAMES[offer.source] ?? offer.source}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold" style={{ color: "var(--amber)", fontFamily: "var(--font-geist-mono)" }}>
                    {offer.price.toLocaleString("sr")}
                    <span className="text-xs font-normal ml-1" style={{ color: "var(--text-muted)" }}>RSD</span>
                  </span>
                  <a
                    href={offer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase"
                    style={{ border: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
                  >
                    Idi u radnju
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Specifications */}
      {c.specifications && Object.keys(c.specifications).length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--text-muted)" }}>
            Specifikacije
          </h2>
          <div style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}>
            {Object.entries(c.specifications).map(([key, value]) => (
              <div key={key} className="flex items-start px-4 py-2.5 text-sm" style={{ borderBottom: "1px solid var(--edge)" }}>
                <span className="w-40 shrink-0 text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                  {key.replace(/_/g, " ")}
                </span>
                <span className="text-xs" style={{ color: "var(--text)", fontFamily: "var(--font-geist-mono)" }}>
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
