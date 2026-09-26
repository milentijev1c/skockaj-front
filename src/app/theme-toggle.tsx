"use client";

import { useSyncExternalStore } from "react";
import {
  getServerTheme,
  getThemeSnapshot,
  setTheme,
  subscribeTheme,
} from "@/lib/theme";

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 7 7 0 1 0 20.5 14.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Header theme control: shows moon while dark is active, sun while light is active.
 * Click toggles and persists to localStorage (`skockaj-theme`).
 */
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerTheme);
  // Server snapshot is always dark; client store updates after hydration if needed.
  const isLight = theme === "light";
  const label = isLight ? "Prebaci na tamnu temu" : "Prebaci na svetlu temu";

  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="theme-toggle"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: 8,
        background: "transparent",
        border: "1px solid var(--edge)",
        color: "var(--text-muted)",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          transform: isLight ? "rotate(0deg)" : "rotate(-12deg)",
          transition: "transform 0.2s ease, opacity 0.15s ease",
        }}
      >
        {isLight ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}
