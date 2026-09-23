"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "cookie_consent";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      /* ignore */
    }
  }, []);

  function accept(value: "all" | "essential") {
    try {
      localStorage.setItem(KEY, JSON.stringify({ value, at: new Date().toISOString() }));
    } catch {
      /* ignore */
    }
    setOpen(false);
    window.dispatchEvent(new CustomEvent("cookie-consent", { detail: value }));
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Kolačići i privatnost"
      className="fade-in"
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 50,
        width: "min(360px, calc(100vw - 32px))",
        background: "var(--panel)",
        border: "1px solid var(--edge)",
        boxShadow: "0 8px 28px rgba(0,0,0,0.4)",
        padding: "14px 16px",
        fontFamily: "var(--font-geist-mono)",
      }}
    >
      <p
        className="text-[11px] mb-3"
        style={{ color: "var(--text-muted)", lineHeight: 1.5 }}
      >
        Koristimo samo neophodne kolačiće (npr. vaša konfiguracija). Bez reklamnog praćenja.{" "}
        <Link href="/politika-kolacica" className="hover-link" style={{ color: "var(--glow)" }}>
          Više
        </Link>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => accept("all")}
          className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase"
          style={{
            background: "var(--glow)",
            color: "var(--void)",
            border: "none",
            borderRadius: 2,
            cursor: "pointer",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          U redu
        </button>
        <button
          type="button"
          onClick={() => accept("essential")}
          className="px-3 py-1.5 text-[10px] tracking-wider uppercase"
          style={{
            background: "transparent",
            color: "var(--text-muted)",
            border: "1px solid var(--edge)",
            borderRadius: 2,
            cursor: "pointer",
            fontFamily: "var(--font-geist-mono)",
          }}
        >
          Odbij
        </button>
      </div>
    </div>
  );
}

export function getCookieConsent(): "all" | "essential" | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw).value ?? "essential";
  } catch {
    return null;
  }
}
