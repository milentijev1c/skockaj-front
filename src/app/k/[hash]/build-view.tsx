"use client";

import type { Build, Component } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import Link from "next/link";

export default function BuildView({ build, components }: { build: Build; components: Component[] }) {
  const totalPrice = components.reduce((sum, c) => {
    const cheapest = c.prices.length > 0 ? Math.min(...c.prices.map((p) => p.price_rsd)) : 0;
    return sum + cheapest;
  }, 0);

  const totalTdp = components.reduce((sum, c) => sum + c.tdp_w, 0);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
          Konfiguracija
        </div>
        <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-geist-sans)" }}>
          skockaj.rs/k/<span style={{ color: "var(--glow)" }}>{build.hash_id}</span>
        </h1>
        <div className="flex gap-4 mt-2 text-xs" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
          <span>{build.view_count} pregleda</span>
          <span>{new Date(build.created_at).toLocaleDateString("sr")}</span>
        </div>
      </div>

      {/* Component list */}
      <div className="mb-6" style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}>
        {CATEGORIES.map((cat) => {
          const items = components.filter((c) => c.category === cat.value);
          if (items.length === 0) return null;
          return (
            <div key={cat.value} className="flex items-start" style={{ borderBottom: "1px solid var(--edge)" }}>
              <div
                className="w-24 shrink-0 p-4 text-[10px] font-bold tracking-widest uppercase"
                style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)", background: "rgba(0,212,170,0.03)" }}
              >
                {cat.label}
              </div>
              <div className="flex-1 p-4">
                {items.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-1">
                    <span className="text-sm" style={{ color: "var(--text)" }}>{c.name}</span>
                    {c.prices.length > 0 ? (
                      <span className="text-sm font-bold" style={{ color: "var(--amber)", fontFamily: "var(--font-geist-mono)" }}>
                        {Math.min(...c.prices.map((p) => p.price_rsd)).toLocaleString("sr")} RSD
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>—</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div
        className="flex items-center justify-between p-6 mb-6"
        style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}
      >
        <div>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
            Ukupna cena
          </div>
          <div className="text-3xl font-black" style={{ color: "var(--amber)", fontFamily: "var(--font-geist-mono)" }}>
            {totalPrice > 0 ? totalPrice.toLocaleString("sr") : "—"}
            <span className="text-base font-normal ml-2" style={{ color: "var(--text-muted)" }}>RSD</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
            Ukupna potrošnja
          </div>
          <div className="text-xl font-bold" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>
            {totalTdp}W
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/konfigurator"
          className="inline-block px-8 py-3 text-xs font-bold tracking-widest uppercase"
          style={{ background: "var(--glow)", color: "var(--void)", fontFamily: "var(--font-geist-mono)" }}
        >
          Skockaj svoju konfiguraciju
        </Link>
      </div>
    </div>
  );
}
