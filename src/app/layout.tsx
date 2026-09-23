import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "skockaj.rs",
  description: "Uporedi cene računarskih komponenti u Srbiji. Bez registracije.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ background: "var(--void)", color: "var(--text)" }}>
        {/* LED-strip header */}
        <header className="header-glow" style={{ background: "var(--panel)", borderBottom: "1px solid var(--edge)", position: "relative" }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "var(--glow)", opacity: 0.4 }} />
          <nav className="mx-auto flex items-center justify-between px-6 py-4" style={{ maxWidth: 1100 }}>
            <Link href="/" className="font-black text-lg tracking-tight logo-link" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-sans)" }}>
              skockaj<span style={{ color: "var(--text-muted)" }}>.rs</span>
            </Link>
            <div className="flex gap-8 text-sm font-medium nav-links" style={{ fontFamily: "var(--font-geist-mono)" }}>
              <Link href="/komponente" style={{ color: "var(--text-muted)" }}>
                komponente
              </Link>
              <Link href="/konfigurator" style={{ color: "var(--text-muted)" }}>
                konfigurator
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto w-full px-6 py-8 flex-1" style={{ maxWidth: 1100 }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{ borderTop: "1px solid var(--edge)", color: "var(--text-muted)" }}>
          <div className="mx-auto px-6 py-4 text-xs flex items-center justify-between flex-wrap gap-2" style={{ maxWidth: 1100, fontFamily: "var(--font-geist-mono)" }}>
            <div className="flex items-center gap-4">
              <span>skockaj.rs — upoređivač cena, nije prodavnica</span>
              <span style={{ color: "var(--edge)" }}>|</span>
              <Link href="/uslovi-koriscenja" className="hover-underline" style={{ color: "var(--text-muted)" }}>Uslovi korišćenja</Link>
              <Link href="/pravila-privatnosti" className="hover-underline" style={{ color: "var(--text-muted)" }}>Pravila privatnosti</Link>
            </div>
            <span style={{ color: "var(--glow)" }}>v0.1.0</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
