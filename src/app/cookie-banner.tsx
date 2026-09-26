"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";

const KEY = "cookie_consent";

function subscribe(listener: () => void) {
  window.addEventListener("cookie-consent", listener);
  return () => window.removeEventListener("cookie-consent", listener);
}

function readConsentOpen() {
  try {
    return !localStorage.getItem(KEY);
  } catch {
    return false;
  }
}

function readConsentOpenServer() {
  return false;
}

export default function CookieBanner() {
  const open = useSyncExternalStore(subscribe, readConsentOpen, readConsentOpenServer);

  const accept = useCallback((value: "all" | "essential") => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ value, at: new Date().toISOString() }));
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent("cookie-consent", { detail: value }));
  }, []);

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
        boxShadow: "var(--shadow-float)",
        padding: "16px 18px",
        fontFamily: "var(--font-geist-mono)",
      }}
    >
      <p className="text-[11px] mb-3" style={{ color: "var(--text-muted)", lineHeight: 1.5 }}>
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
            background: "var(--glow-fill)",
            color: "var(--on-glow)",
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
