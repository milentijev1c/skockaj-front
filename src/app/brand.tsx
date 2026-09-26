import type { CSSProperties } from "react";

/**
 * Theme-aware CPU+RAM mark. CSS background swaps the asset via `data-theme`
 * so SSR stays dark-default and the light mark appears without hydration work.
 */
export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <span
      className="brand-mark"
      aria-hidden="true"
      style={{ width: size, height: size }}
    />
  );
}

/**
 * Shared skockaj.rs wordmark — same lockup on header, footer, and legal copy.
 * Teal "skockaj" + muted ".rs". Optional mark sits left of the type.
 */
export function Brand({
  size = 20,
  style,
  className,
  withMark = false,
}: {
  size?: number;
  style?: CSSProperties;
  className?: string;
  withMark?: boolean;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-geist-sans)",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        lineHeight: 1.1,
        fontSize: size,
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(size * 0.45),
        ...style,
      }}
    >
      {withMark ? <BrandMark size={Math.round(size * 1.45)} /> : null}
      <span>
        <span style={{ color: "var(--glow)" }}>skockaj</span>
        <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>.rs</span>
      </span>
    </span>
  );
}

/** Inline brand for body copy (slightly stronger than surrounding text). */
export function BrandInline() {
  return (
    <strong
      style={{
        color: "var(--glow)",
        fontFamily: "var(--font-geist-sans)",
        fontWeight: 800,
        letterSpacing: "-0.02em",
      }}
    >
      skockaj<span style={{ color: "var(--text-muted)", fontWeight: 700 }}>.rs</span>
    </strong>
  );
}
