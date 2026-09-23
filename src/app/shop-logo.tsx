import { STORE_LOGOS, STORE_NAMES } from "@/lib/types";

export function ShopLogo({
  slug,
  size = 20,
  title,
}: {
  slug: string;
  size?: number;
  title?: string;
}) {
  const src = STORE_LOGOS[slug];
  const name = title ?? STORE_NAMES[slug] ?? slug;
  if (!src) {
    return (
      <span
        title={name}
        aria-label={name}
        className="inline-flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: "var(--glow-dim)",
          color: "var(--glow)",
          fontSize: Math.max(8, size * 0.4),
          fontFamily: "var(--font-geist-mono)",
          fontWeight: 700,
        }}
      >
        {(STORE_NAMES[slug] ?? slug).slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      title={name}
      width={size}
      height={size}
      style={{
        width: size * 1.8,
        height: size,
        objectFit: "contain",
        objectPosition: "center",
        display: "inline-block",
        verticalAlign: "middle",
      }}
    />
  );
}

export function ShopLogoStack({
  slugs,
  max = 4,
  size = 18,
}: {
  slugs: string[];
  max?: number;
  size?: number;
}) {
  const unique = [...new Set(slugs)];
  const shown = unique.slice(0, max);
  const extra = unique.length - shown.length;
  if (unique.length === 0) return <span style={{ color: "var(--text-muted)" }}>/</span>;
  return (
    <span className="inline-flex items-center gap-1 justify-end flex-wrap">
      {shown.map((s) => (
        <ShopLogo key={s} slug={s} size={size} />
      ))}
      {extra > 0 && (
        <span
          className="text-[10px]"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
        >
          +{extra}
        </span>
      )}
    </span>
  );
}

export const STORE_ID_TO_SLUG: Record<number, string> = {
  1: "gigatron",
  2: "monitor",
  3: "exceed",
  4: "winwin",
  6: "bigbang",
  8: "ananas",
};
