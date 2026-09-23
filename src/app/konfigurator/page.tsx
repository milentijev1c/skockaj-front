"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Component, CompatibilityResult, Build } from "@/lib/types";
import { CATEGORIES, CATEGORY_ICONS, srKomponente } from "@/lib/types";

export default function BuilderPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [compat, setCompat] = useState<CompatibilityResult | null>(null);
  const [build, setBuild] = useState<Build | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored: number[] = JSON.parse(localStorage.getItem("builder") || "[]");
    if (stored.length > 0) {
      setSelected(stored);
      loadComponents(stored);
    }
  }, []);

  async function loadComponents(ids: number[]) {
    const all = await apiFetch<Component[]>("/components/");
    setComponents(all.filter((c) => ids.includes(c.id)));
  }

  async function checkCompatibility() {
    const result = await apiFetch<CompatibilityResult>("/compatibility/check", {
      method: "POST",
      body: JSON.stringify(selected),
    });
    setCompat(result);
  }

  async function saveBuild() {
    setSaving(true);
    try {
      const b = await apiFetch<Build>("/builds/", {
        method: "POST",
        body: JSON.stringify({ component_ids: selected }),
      });
      setBuild(b);
    } catch (e) {
      alert("Greška: " + (e as Error).message);
    }
    setSaving(false);
  }

  function removeComponent(id: number) {
    const next = selected.filter((i) => i !== id);
    setSelected(next);
    localStorage.setItem("builder", JSON.stringify(next));
    setComponents((prev) => prev.filter((c) => c.id !== id));
    setCompat(null);
    setBuild(null);
  }

  const byCategory: Record<string, Component[]> = {};
  components.forEach((c) => {
    byCategory[c.category] = [...(byCategory[c.category] || []), c];
  });

  const totalPrice = components.reduce((sum, c) => {
    const cheapest = c.prices.length > 0 ? Math.min(...c.prices.map((p) => p.price_rsd)) : 0;
    return sum + cheapest;
  }, 0);

  const totalTdp = components.reduce((sum, c) => sum + c.tdp_w, 0);

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-geist-sans)" }}>
          Konfigurator
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
          {components.length} {srKomponente(components.length)} izabrano
        </p>
      </div>

      {components.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Slot grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {CATEGORIES.map((cat) => {
              const items = byCategory[cat.value] || [];
              const filled = items.length > 0;

              return (
                <div
                  key={cat.value}
                  className="p-4 relative overflow-hidden slot-hover"
                  style={{
                    background: filled ? "var(--panel)" : "transparent",
                    border: `1px dashed ${filled ? "var(--glow)" : "var(--edge)"}`,
                    boxShadow: filled ? "0 0 15px var(--glow-dim)" : "none",
                    minHeight: 100,
                  }}
                >
                  {/* Slot icon */}
                  <img
                    src={CATEGORY_ICONS[cat.value]}
                    alt={cat.label}
                    width={20}
                    height={20}
                    className="mb-3"
                    style={{ color: filled ? "var(--glow)" : "var(--text-muted)" }}
                  />

                  {filled ? (
                    items.map((c) => (
                      <div key={c.id}>
                        <div className="text-xs font-medium leading-tight mb-1" style={{ color: "var(--text)" }}>
                          {c.name}
                        </div>
                        <div className="flex items-center justify-between">
                          {c.prices.length > 0 ? (
                            <span className="text-xs font-bold" style={{ color: "var(--amber)", fontFamily: "var(--font-geist-mono)" }}>
                              {Math.min(...c.prices.map((p) => p.price_rsd)).toLocaleString("sr")}
                            </span>
                          ) : (
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>—</span>
                          )}
                          <button
                            onClick={() => removeComponent(c.id)}
                            className="text-[10px] uppercase tracking-wider"
                            style={{ color: "var(--coral)", fontFamily: "var(--font-geist-mono)", transition: "color 0.15s ease" }}
                          >
                            ukloni
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <a href="/komponente" className="text-[10px] tracking-wider" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                      + Dodaj
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary strip */}
          <div
            className="flex items-center justify-between p-5 mb-6 flex-wrap gap-4"
            style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}
          >
            <div className="flex items-center gap-6">
              <div>
                <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>Ukupno</div>
                <div className="text-2xl font-black" style={{ color: "var(--amber)", fontFamily: "var(--font-geist-mono)" }}>
                  {totalPrice > 0 ? totalPrice.toLocaleString("sr") : "—"}
                  <span className="text-sm font-normal ml-1" style={{ color: "var(--text-muted)" }}>RSD</span>
                </div>
              </div>
              <div style={{ width: 1, height: 32, background: "var(--edge)" }} />
              <div>
                <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>TDP</div>
                <div className="text-lg font-bold" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>
                  {totalTdp}W
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={checkCompatibility}
                className="btn-ghost px-5 py-2.5 text-xs font-bold tracking-widest uppercase"
                style={{ border: "1px solid var(--glow)", color: "var(--glow)", background: "transparent", fontFamily: "var(--font-geist-mono)" }}
              >
                Proveri
              </button>
              <button
                onClick={saveBuild}
                disabled={saving}
                className="btn-glow px-5 py-2.5 text-xs font-bold tracking-widest uppercase disabled:opacity-50"
                style={{ background: "var(--glow)", color: "var(--void)", fontFamily: "var(--font-geist-mono)" }}
              >
                {saving ? "Čuvam..." : "Sačuvaj"}
              </button>
            </div>
          </div>

          {/* Compatibility panel */}
          {compat && (
            <div
              className="p-5 mb-6 fade-in"
              style={{
                background: "var(--panel)",
                border: `1px solid ${compat.compatible ? "var(--glow)" : "var(--coral)"}`,
                boxShadow: `0 0 20px ${compat.compatible ? "var(--glow-dim)" : "rgba(255,92,92,0.15)"}`,
              }}
            >
              {compat.compatible ? (
                <div className="flex items-center gap-3">
                  <span style={{ color: "var(--glow)" }} className="text-lg">+</span>
                  <span className="text-sm font-bold" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>
                    Sve komponente su međusobno kompatibilne
                  </span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span style={{ color: "var(--coral)" }} className="text-lg">!</span>
                    <span className="text-sm font-bold" style={{ color: "var(--coral)", fontFamily: "var(--font-geist-mono)" }}>
                      Problem sa kompatibilnošću
                    </span>
                  </div>
                  {compat.issues.map((issue, i) => (
                    <div
                      key={i}
                      className="text-xs py-2 pl-7"
                      style={{ color: issue.severity === "error" ? "var(--coral)" : "var(--amber)", fontFamily: "var(--font-geist-mono)" }}
                    >
                      {issue.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Build link */}
          {build && (
            <div
              className="p-5 fade-in"
              style={{ background: "var(--panel)", border: "1px solid var(--glow)", boxShadow: "0 0 20px var(--glow-dim)" }}
            >
              <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                Tvoj link za deljenje
              </div>
              <code className="text-sm font-bold" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>
                skockaj.rs/k/{build.hash_id}
              </code>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-24">
      <div className="inline-flex items-center justify-center w-16 h-16 mb-6" style={{ border: "1px dashed var(--edge)" }}>
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" stroke="var(--text-muted)" strokeWidth="1"/>
          <rect x="9" y="1" width="6" height="6" stroke="var(--text-muted)" strokeWidth="1"/>
          <rect x="1" y="9" width="6" height="6" stroke="var(--text-muted)" strokeWidth="1"/>
          <rect x="9" y="9" width="6" height="6" stroke="var(--text-muted)" strokeWidth="1"/>
        </svg>
      </div>
      <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Konfigurator je prazan</p>
      <a
        href="/komponente"
        className="btn-ghost inline-block px-6 py-2.5 text-xs font-bold tracking-widest uppercase"
        style={{ border: "1px solid var(--glow)", color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}
      >
        Dodaj komponente
      </a>
    </div>
  );
}
