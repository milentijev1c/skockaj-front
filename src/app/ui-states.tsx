import type { ReactNode } from "react";

export function SkeletonRow({ lines = 2 }: { lines?: number }) {
  return (
    <div
      className="flex items-center justify-between px-5 py-4"
      style={{ borderBottom: "1px solid var(--edge)" }}
    >
      <div className="flex-1 space-y-2 pr-6">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton-bar"
            style={{ width: i === 0 ? "42%" : "22%", height: i === 0 ? 14 : 10 }}
          />
        ))}
      </div>
      <div className="skeleton-bar" style={{ width: 72, height: 14 }} />
      <div className="skeleton-bar ml-4" style={{ width: 56, height: 14 }} />
    </div>
  );
}

export function SkeletonList({ rows = 6, lines = 2 }: { rows?: number; lines?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Učitavanje"
      style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} lines={lines} />
      ))}
    </div>
  );
}

export function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Učitavanje"
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton-card p-6"
          style={{ background: "var(--panel)", border: "1px solid var(--edge)", minHeight: 120 }}
        >
          <div className="skeleton-bar mb-4" style={{ width: 40, height: 40, borderRadius: 4 }} />
          <div className="skeleton-bar mb-2" style={{ width: "55%", height: 14 }} />
          <div className="skeleton-bar" style={{ width: "35%", height: 10 }} />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="text-center px-6 py-16 fade-in"
      style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}
    >
      <div
        className="mx-auto mb-5 flex items-center justify-center"
        style={{
          width: 56,
          height: 56,
          border: "1px dashed var(--edge)",
          color: "var(--text-dim)",
        }}
        aria-hidden="true"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3
        className="text-sm font-bold mb-2"
        style={{ color: "var(--text)", fontFamily: "var(--font-geist-mono)" }}
      >
        {title}
      </h3>
      {description && (
        <p className="text-xs mb-6 max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
