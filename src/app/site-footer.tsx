import Link from "next/link";
import { CATEGORIES } from "@/lib/types";
import { Brand } from "./brand";

const LEGAL_LINKS = [
  { href: "/uslovi-koriscenja", label: "Uslovi korišćenja" },
  { href: "/politika-privatnosti", label: "Politika privatnosti" },
  { href: "/politika-kolacica", label: "Politika kolačića" },
];

const NAV_LINKS = [
  { href: "/", label: "Početna" },
  { href: "/prodavnice", label: "Prodavnice" },
  { href: "/konfigurator", label: "Konfigurator računara" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function SiteFooter() {
  return (
    <footer
      className="site-footer"
      style={{
        borderTop: "1px solid var(--edge)",
        background: "var(--panel)",
        color: "var(--text-muted)",
      }}
    >
      <div
        className="mx-auto px-6 py-12"
        style={{ maxWidth: 1100, fontFamily: "var(--font-geist-mono)" }}
      >
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <Brand size={20} />
            </div>
            <p className="text-xs leading-relaxed mb-4">
              Upoređivač cena računarskih komponenti u Srbiji.
              Pronađi najjeftiniji procesor, grafičku karticu, RAM i ostalo
              u domaćim prodavnicama — bez registracije.
            </p>
            <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
              skockaj.rs nije prodavnica.
            </p>
          </div>

          {/* Component categories — SEO hub */}
          <nav aria-label="Kategorije komponenti">
            <h2
              className="text-[10px] font-bold tracking-widest uppercase mb-3"
              style={{ color: "var(--text)" }}
            >
              Komponente
            </h2>
            <ul className="space-y-1.5 text-xs">
              {CATEGORIES.map((c) => (
                <li key={c.value}>
                  <Link
                    href={`/komponente?kategorija=${c.slug}`}
                    className="hover-underline footer-link"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/komponente"
                  className="hover-underline footer-link"
                  style={{ color: "var(--glow)" }}
                >
                  Sve komponente
                </Link>
              </li>
            </ul>
          </nav>

          {/* Tools */}
          <nav aria-label="Alati">
            <h2
              className="text-[10px] font-bold tracking-widest uppercase mb-3"
              style={{ color: "var(--text)" }}
            >
              Alati
            </h2>
            <ul className="space-y-1.5 text-xs">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover-underline footer-link"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Pravni dokumenti">
            <h2
              className="text-[10px] font-bold tracking-widest uppercase mb-3"
              style={{ color: "var(--text)" }}
            >
              Pravno
            </h2>
            <ul className="space-y-1.5 text-xs">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover-underline footer-link"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-[11px] mt-4">
              Cene su informativne i preuzete sa sajtova prodavnica.
            </p>
          </nav>
        </div>

        <div
          className="mt-10 pt-6 text-[11px] flex items-center justify-between flex-wrap gap-2"
          style={{ borderTop: "1px solid var(--edge)" }}
        >
          <span>
            © {new Date().getFullYear()} skockaj.rs — upoređivanje cena komponenti u Srbiji
          </span>
        </div>
      </div>
    </footer>
  );
}
