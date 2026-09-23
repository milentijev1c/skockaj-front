"use client";

import { useEffect, useState } from "react";
import type { Build, Component } from "@/lib/types";
import { CATEGORIES, CATEGORY_ICONS, STORE_NAMES, srCount, srProdavnice } from "@/lib/types";
import { STORE_ID_TO_SLUG } from "../../shop-logo";
import { apiFetch } from "@/lib/api";
import { getVisitorId } from "@/lib/visitor";
import Link from "next/link";

function getStoreSlug(storeId: number): string {
  return STORE_ID_TO_SLUG[storeId] ?? String(storeId);
}

function CategoryIcon({ value, size = 18, color }: { value: string; size?: number; color: string }) {
  const url = CATEGORY_ICONS[value];
  return (
    <div
      aria-hidden="true"
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
        flexShrink: 0,
      }}
    />
  );
}

type BuildAnalytics = {
  hash_id: string;
  unique_views: number;
  first_at: string | null;
  last_at: string | null;
  by_day: { date: string; count: number }[];
};

function cheapestOffer(c: Component) {
  const priced = c.prices.filter((p) => p.price_rsd > 0);
  if (priced.length === 0) return null;
  return priced.reduce((a, b) => (a.price_rsd <= b.price_rsd ? a : b));
}

function cheapestOf(c: Component): number | null {
  return cheapestOffer(c)?.price_rsd ?? null;
}

export default function BuildView({ build, components }: { build: Build; components: Component[] }) {
  const [viewCount, setViewCount] = useState(build.view_count);
  const [analytics, setAnalytics] = useState<BuildAnalytics | null>(null);

  useEffect(() => {
    const visitor_id = getVisitorId();
    if (!visitor_id) return;
    apiFetch<Build>(`/builds/${build.hash_id}/view`, {
      method: "POST",
      body: JSON.stringify({ visitor_id }),
    })
      .then((b) => setViewCount(b.view_count))
      .catch(() => {});
    apiFetch<BuildAnalytics>(`/builds/${build.hash_id}/analytics`)
      .then(setAnalytics)
      .catch(() => {});
  }, [build.hash_id]);

  const totalPrice = components.reduce((sum, c) => sum + (cheapestOf(c) ?? 0), 0);
  const totalTdp = components.reduce((sum, c) => sum + c.tdp_w, 0);
  const shopCount = new Set(
    components.flatMap((c) => c.prices.filter((p) => p.price_rsd > 0 && p.in_stock).map((p) => p.store_id)),
  ).size;
  const shareUrl = `skockaj.rs/k/${build.hash_id}`;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <div
          className="text-[10px] uppercase tracking-widest mb-2"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
        >
          Konfiguracija
        </div>
        <h1
          className="text-3xl md:text-4xl font-black tracking-tight mb-3 break-all"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          skockaj.rs/k/<span className="glow-pulse" style={{ color: "var(--glow)" }}>{build.hash_id}</span>
        </h1>
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
        >
          <span>
            {viewCount}{" "}
            {srCount(viewCount, "jedinstveni pregled", "jedinstvena pregleda", "jedinstvenih pregleda")}
          </span>
          <span style={{ color: "var(--edge)" }}>|</span>
          <span>{new Date(build.created_at).toLocaleDateString("sr")}</span>
          {shopCount > 0 && (
            <>
              <span style={{ color: "var(--edge)" }}>|</span>
              <span>{shopCount} {srProdavnice(shopCount)} sa cenama</span>
            </>
          )}
        </div>
      </div>

      {/* Component list */}
      <div className="mb-6" style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}>
        {CATEGORIES.map((cat) => {
          const items = components.filter((c) => c.category === cat.value);
          if (items.length === 0) return null;
          return items.map((c) => {
            const offer = cheapestOffer(c);
            return (
              <div
                key={c.id}
                className="row-hover"
                style={{
                  borderBottom: "1px solid var(--edge)",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  padding: "18px 16px",
                  gap: 12,
                }}
              >
                {/* category — left edge */}
                <div
                  style={{
                    flex: "0 0 auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    minWidth: 140,
                  }}
                >
                  <CategoryIcon value={cat.value} color="var(--glow)" />
                  <span
                    style={{
                      color: "var(--glow)",
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    {cat.label}
                  </span>
                </div>

                {/* model name — horizontally centered */}
                <div style={{ flex: 1, minWidth: 0, textAlign: "center", padding: "0 8px" }}>
                  <Link
                    href={`/komponente/${c.id}`}
                    className="hover-link"
                    style={{
                      color: "var(--text)",
                      textDecoration: "none",
                      fontSize: 15,
                      fontWeight: 600,
                      display: "inline-block",
                      maxWidth: "100%",
                    }}
                  >
                    {c.name}
                  </Link>
                </div>

                {/* price — right edge, links to shop offer when available */}
                <div style={{ flex: "0 0 auto", minWidth: 140, textAlign: "right" }}>
                  {offer ? (
                    <a
                      href={offer.product_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover-link"
                      title={`Idi u prodavnicu — ${STORE_NAMES[getStoreSlug(offer.store_id)] ?? "prodavnica"}`}
                      style={{
                        color: "var(--amber)",
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: 16,
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      {offer.price_rsd.toLocaleString("sr")}
                      <span style={{ color: "var(--text-muted)", fontSize: 11, fontWeight: 400, marginLeft: 4 }}>RSD</span>
                      <span
                        style={{
                          display: "block",
                          marginTop: 2,
                          color: "var(--text-muted)",
                          fontSize: 9,
                          fontWeight: 400,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        {STORE_NAMES[getStoreSlug(offer.store_id)] ?? "prodavnica"}
                      </span>
                    </a>
                  ) : (
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>Nema u ponudi</span>
                  )}
                </div>
              </div>
            );
          });
        })}
      </div>

      {/* Totals */}
      <div
        className="flex flex-wrap items-center justify-between gap-6 p-6 mb-8"
        style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}
      >
        <div>
          <div
            className="text-[10px] uppercase tracking-widest mb-1"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
          >
            Ukupna cena
          </div>
          <div className="text-3xl font-black" style={{ color: "var(--amber)", fontFamily: "var(--font-geist-mono)" }}>
            {totalPrice > 0 ? totalPrice.toLocaleString("sr") : "—"}
            <span className="text-base font-normal ml-2" style={{ color: "var(--text-muted)" }}>RSD</span>
          </div>
        </div>
        <div className="hidden sm:block" style={{ width: 1, height: 32, background: "var(--edge)" }} />
        <div>
          <div
            className="text-[10px] uppercase tracking-widest mb-1"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
          >
            Ukupna potrošnja
          </div>
          <div className="text-xl font-bold" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>
            {totalTdp > 0 ? `${totalTdp}W` : "—"}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/konfigurator"
          className="btn-glow inline-flex items-center px-8 py-3 text-xs font-bold tracking-widest uppercase"
          style={{ background: "var(--glow)", color: "var(--void)", fontFamily: "var(--font-geist-mono)" }}
        >
          Skockaj svoju konfiguraciju
        </Link>
        <Link
          href="/komponente"
          className="btn-ghost inline-flex items-center px-6 py-3 text-xs font-medium tracking-wide"
          style={{ border: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
        >
          Pregledaj komponente
        </Link>
      </div>

      <p className="text-center text-[11px] mt-4" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
        {shareUrl} — cene su informativne i menjaju se u prodavnicama
      </p>

      {/* View analytics */}
      {analytics && (
        <section
          className="mt-8 p-5 fade-in"
          style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}
          aria-label="Analitika pregleda"
        >
          <div
            className="text-[10px] uppercase tracking-widest mb-3"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
          >
            Analitika pregleda
          </div>
          <div className="flex flex-wrap gap-6 mb-4 text-xs" style={{ fontFamily: "var(--font-geist-mono)" }}>
            <div>
              <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>Jedinstveni pregledi</div>
              <div style={{ color: "var(--glow)", fontWeight: 700, fontSize: 16 }}>
                {analytics.unique_views}
              </div>
            </div>
            <div>
              <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>Prvi pregled</div>
              <div style={{ color: "var(--text)" }}>
                {analytics.first_at
                  ? new Date(analytics.first_at).toLocaleDateString("sr")
                  : "—"}
              </div>
            </div>
            <div>
              <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>Poslednji pregled</div>
              <div style={{ color: "var(--text)" }}>
                {analytics.last_at
                  ? new Date(analytics.last_at).toLocaleDateString("sr")
                  : "—"}
              </div>
            </div>
          </div>

          {analytics.by_day.length > 0 && (
            <div>
              <div
                className="text-[10px] uppercase tracking-widest mb-2"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
              >
                Po danu
              </div>
              <ul className="space-y-1">
                {analytics.by_day.map((d) => {
                  const max = Math.max(...analytics.by_day.map((x) => x.count), 1);
                  return (
                    <li key={d.date} className="flex items-center gap-3 text-xs" style={{ fontFamily: "var(--font-geist-mono)" }}>
                      <span style={{ color: "var(--text-muted)", width: 88 }}>{d.date}</span>
                      <span
                        style={{
                          display: "block",
                          height: 8,
                          width: `${Math.max(8, Math.round((d.count / max) * 120))}px`,
                          background: "var(--glow)",
                          opacity: 0.75,
                          borderRadius: 2,
                        }}
                      />
                      <span style={{ color: "var(--text)" }}>{d.count}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
