import type { CSSProperties } from "react";

/**
 * Shared skockaj.rs wordmark — same lockup on header, footer, and legal copy.
 * Teal "skockaj" + muted ".rs".
 */
export function Brand({
  size = 20,
  style,
  className,
}: {
  size?: number;
  style?: CSSProperties;
  className?: string;
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
        ...style,
      }}
    >
      <span style={{ color: "var(--glow)" }}>skockaj</span>
      <span style={{ color: "var(--text-muted)", fontWeight: 700 }}>.rs</span>
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
