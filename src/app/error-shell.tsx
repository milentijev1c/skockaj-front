import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared branded shell for 404 / error screens.
 * Uses theme tokens so light/dark both stay on-brand.
 */
export function ErrorShell({
  code,
  title,
  description,
  children,
}: {
  code?: string;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      className="fade-in flex flex-col items-center justify-center text-center px-6"
      style={{ minHeight: "min(70vh, 560px)", paddingTop: 48, paddingBottom: 48 }}
    >
      {code && (
        <div
          className="mb-4 text-xs font-bold tracking-[0.35em] uppercase"
          style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}
        >
          {code}
        </div>
      )}

      <div
        className="mx-auto mb-6 flex items-center justify-center"
        style={{
          width: 72,
          height: 72,
          border: "1px solid var(--edge)",
          background: "var(--panel)",
          color: "var(--glow)",
        }}
        aria-hidden="true"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="8" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="17" r="1.5" fill="currentColor" />
          <circle cx="20" cy="17" r="1.5" fill="currentColor" />
          <path d="M12 22h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <h1
        className="text-3xl md:text-4xl font-black tracking-tight mb-3"
        style={{ color: "var(--text)", fontFamily: "var(--font-geist-sans)" }}
      >
        {title}
      </h1>

      {description && (
        <p
          className="text-base max-w-md mx-auto mb-8 leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {description}
        </p>
      )}

      {children}
    </div>
  );
}

export function ErrorActions({
  primaryHref = "/",
  primaryLabel = "Nazad na početnu",
  secondaryHref = "/komponente",
  secondaryLabel = "Pogledaj komponente",
  extra,
}: {
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  extra?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Link
        href={primaryHref}
        className="btn-glow inline-flex items-center px-6 py-3 text-xs font-bold tracking-widest uppercase"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        {primaryLabel}
      </Link>
      <Link
        href={secondaryHref}
        className="btn-ghost inline-flex items-center px-6 py-3 text-xs font-medium tracking-wide"
        style={{ border: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
      >
        {secondaryLabel}
      </Link>
      {extra}
    </div>
  );
}
