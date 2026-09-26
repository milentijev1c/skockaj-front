import type { ReactNode } from "react";
import { BrandInline } from "./brand";

/** Inline brand mark for legal copy (shared lockup). */
export function Brand() {
  return <BrandInline />;
}

export function LegalShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="fade-in max-w-3xl mx-auto">
      <h1
        className="text-3xl font-black tracking-tight mb-2"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        {title}
      </h1>
      <p className="text-xs mb-8" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
        Poslednje ažuriranje: 26. septembar 2026.
      </p>
      {intro && (
        <div className="mb-8 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          {intro}
        </div>
      )}
      <div className="space-y-7 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        {children}
      </div>
    </div>
  );
}

export function LegalSection({
  n,
  title,
  children,
}: {
  n?: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>
        {n ? `${n}. ` : ""}
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
