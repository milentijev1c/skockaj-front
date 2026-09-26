"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { Component, CompatibilityResult, Build } from "@/lib/types";
import { CATEGORIES, CATEGORY_ICONS, categoryToSlug, srKomponente } from "@/lib/types";

function CategoryIcon({
  value,
  size = 36,
  color,
}: {
  value: string;
  size?: number;
  color: string;
}) {
  const url = CATEGORY_ICONS[value];
  return (
    <div
      aria-hidden="true"
      className="mb-3"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        WebkitMaskImage: `url(${url})`,
        maskImage: `url(${url})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

export default function BuilderPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [compat, setCompat] = useState<CompatibilityResult | null>(null);
  const [build, setBuild] = useState<Build | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadComponents(ids: number[]) {
    const all = await apiFetch<Component[]>("/components/");
    setComponents(all.filter((c) => ids.includes(c.id)));
  }

  useEffect(() => {
    let cancelled = false;
    const t = window.setTimeout(() => {
      let stored: number[] = [];
      try {
        stored = JSON.parse(localStorage.getItem("builder") || "[]");
      } catch {
        stored = [];
      }
      if (cancelled || stored.length === 0) return;
      setSelected(stored);
      void loadComponents(stored);
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, []);

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

      {components.length === 0 && (
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
          Izaberi kategoriju ispod da dodaš deo — ili idi na komponente.
        </p>
      )}

      {/* Slot grid — whole card is clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {CATEGORIES.map((cat) => {
          const items = byCategory[cat.value] || [];
          const filled = items.length > 0;
          const href = filled
            ? `/komponente/${items[0].id}`
            : `/komponente?kategorija=${categoryToSlug(cat.value) ?? cat.value}`;

          return (
            <Link
              key={cat.value}
              href={href}
              className="p-5 relative overflow-hidden slot-hover"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 6,
                background: filled ? "var(--panel)" : "transparent",
                border: `1px dashed ${filled ? "var(--glow)" : "var(--edge)"}`,
                boxShadow: filled ? "0 0 15px var(--glow-dim)" : "none",
                minHeight: 150,
                cursor: "pointer",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <CategoryIcon
                value={cat.value}
                size={40}
                color={filled ? "var(--glow)" : "var(--text-muted)"}
              />
              <div
                style={{
                  color: filled ? "var(--glow)" : "var(--text-muted)",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {cat.label}
              </div>

              {filled ? (
                items.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      width: "100%",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      style={{
                        color: "var(--text)",
                        fontSize: 12,
                        lineHeight: 1.35,
                        fontWeight: 500,
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      {c.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        width: "100%",
                      }}
                    >
                      {c.prices.length > 0 ? (
                        <span
                          style={{
                            color: "var(--amber)",
                            fontFamily: "var(--font-geist-mono)",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          {Math.min(...c.prices.map((p) => p.price_rsd)).toLocaleString("sr")}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: 10 }}>—</span>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeComponent(c.id);
                        }}
                        style={{
                          color: "var(--coral)",
                          fontFamily: "var(--font-geist-mono)",
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          transition: "color 0.15s ease",
                        }}
                      >
                        ukloni
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <span
                  style={{
                    color: "var(--glow)",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                  }}
                >
                  + Dodaj
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {components.length > 0 && (
        <>
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
                Proveri kompatibilnost
              </button>
              <button
                onClick={saveBuild}
                disabled={saving}
                className="btn-glow px-5 py-2.5 text-xs font-bold tracking-widest uppercase disabled:opacity-50"
                style={{ background: "var(--glow-fill)", color: "var(--on-glow)", fontFamily: "var(--font-geist-mono)" }}
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
                boxShadow: `0 0 20px ${compat.compatible ? "var(--glow-dim)" : "var(--shadow-danger)"}`,
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
