"use client";

import Link from "next/link";
import { STORE_NAMES, STORE_URLS, STORE_LOGOS, STORE_BLURBS, ACTIVE_STORES } from "@/lib/types";
import { EmptyState } from "../ui-states";

type ShopCard = {
  slug: string;
  name: string;
  url: string;
  logo: string;
  blurb: string;
};

export default function ProdavnicePage() {
  const shops: ShopCard[] = ACTIVE_STORES.map((slug) => ({
    slug,
    name: STORE_NAMES[slug],
    url: STORE_URLS[slug],
    logo: STORE_LOGOS[slug],
    blurb: STORE_BLURBS[slug] ?? "",
  })).sort((a, b) => a.name.localeCompare(b.name, "sr"));

  return (
    <div className="fade-in">
      <div className="mb-8">
        <h1
          className="text-3xl font-black tracking-tight"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Prodavnice
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
          {`${shops.length} ${shops.length === 1 ? "prodavnica" : "prodavnice"} u poređenju cena`}
        </p>
      </div>

      {shops.length === 0 && (
        <EmptyState
          title="Nema prodavnica za prikaz"
          description="Trenutno nemamo aktivne prodavnice u poređenju. Pokušajte ponovo kasnije ili pregledajte komponente."
          action={
            <Link
              href="/komponente"
              className="btn-ghost inline-block px-5 py-2.5 text-xs font-bold tracking-widest uppercase"
              style={{ border: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
            >
              Pregledaj komponente
            </Link>
          }
        />
      )}

      {shops.length > 0 && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((s) => (
            <article
              key={s.slug}
              className="p-6 card-hover"
              style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}
            >
              <div
                className="mb-4 flex items-center justify-center"
                style={{
                  height: 64,
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid var(--edge-soft)",
                  padding: "12px 16px",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.logo}
                  alt={`${s.name} logo`}
                  width={160}
                  height={48}
                  style={{ maxWidth: "100%", maxHeight: 48, objectFit: "contain", objectPosition: "center" }}
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                    const fallback = el.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
                <div
                  className="hidden items-center justify-center font-black"
                  style={{
                    width: 48,
                    height: 48,
                    background: "var(--glow-dim)",
                    color: "var(--glow)",
                    fontFamily: "var(--font-geist-sans)",
                  }}
                >
                  {s.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <h2
                className="text-lg font-bold mb-1"
                style={{ fontFamily: "var(--font-geist-sans)", color: "var(--text)" }}
              >
                {s.name}
              </h2>
              {s.blurb && (
                <p className="text-xs mb-4" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
                  {s.blurb}
                </p>
              )}
              <div className="flex items-center gap-3">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase"
                  style={{ border: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
                >
                  Sajt prodavnice
                </a>
                <Link
                  href="/komponente"
                  className="hover-link text-[10px] tracking-widest uppercase"
                  style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}
                >
                  Uporedi cene
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
