import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import SiteFooter from "./site-footer";
import { Brand } from "./brand";
import CookieBanner from "./cookie-banner";
import "./globals.css";

// Nonce CSP in proxy.ts requires dynamic rendering (fresh nonce per request)
export const dynamic = "force-dynamic";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "skockaj.rs — uporedi cene komponenti u Srbiji",
    template: "%s | skockaj.rs",
  },
  description:
    "Uporedi cene procesora, grafičkih kartica, RAM-a, matičnih ploča i ostalih računarskih komponenti iz domaćih prodavnica. Skockaj svoj računar bez registracije.",
  keywords: [
    "cene komponenti",
    "procesori",
    "grafičke kartice",
    "RAM memorija",
    "matične ploče",
    "konfigurator računara",
    "Srbija",
    "skockaj",
  ],
  openGraph: {
    title: "skockaj.rs — uporedi cene komponenti u Srbiji",
    description:
      "Uporedi cene procesora, grafičkih kartica, RAM-a i ostalih komponenti iz domaćih prodavnica.",
    locale: "sr_RS",
    type: "website",
    siteName: "skockaj.rs",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ background: "var(--void)", color: "var(--text)" }}>
        {/* LED-strip header */}
        <header className="header-glow" style={{ background: "var(--panel)", borderBottom: "1px solid var(--edge)", position: "relative" }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "var(--glow)", opacity: 0.4 }} />
          <nav className="mx-auto flex items-center justify-between px-6 py-4" style={{ maxWidth: 1100 }}>
            <Link href="/" className="logo-link" aria-label="skockaj.rs početna">
              <Brand size={20} />
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
        <SiteFooter />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
