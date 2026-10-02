import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import SiteFooter from "./site-footer";
import { Brand } from "./brand";
import CookieBanner from "./cookie-banner";
import ThemeToggle from "./theme-toggle";
import MobileNav from "./mobile-nav";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme";
import { SITE_URL, SITE_NAME, websiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/lib/json-ld";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "skockaj.rs — uporedi cene komponenti u Srbiji",
    description:
      "Uporedi cene procesora, grafičkih kartica, RAM-a i ostalih komponenti iz domaćih prodavnica.",
    url: SITE_URL,
    locale: "sr_RS",
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary",
    title: "skockaj.rs — uporedi cene komponenti u Srbiji",
    description:
      "Uporedi cene procesora, grafičkih kartica, RAM-a i ostalih komponenti iz domaćih prodavnica.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sr" data-theme="dark" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body className="min-h-dvh flex flex-col" style={{ background: "var(--void)", color: "var(--text)" }}>
        <JsonLd data={websiteJsonLd()} />
        {/* LED-strip header */}
        <header className="header-glow" style={{ background: "var(--panel)", borderBottom: "1px solid var(--edge)", position: "relative" }}>
          <div className="header-led" aria-hidden="true">
            <div className="header-led-line" />
            <div className="header-led-flow" />
          </div>
          <nav className="mx-auto flex items-center justify-between gap-4 px-6 py-4" style={{ maxWidth: 1100 }}>
            <Link href="/" className="logo-link" aria-label="skockaj.rs početna">
              <Brand size={20} withMark />
            </Link>
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="nav-links flex gap-8 text-sm font-medium" style={{ fontFamily: "var(--font-geist-mono)" }}>
                <Link href="/komponente" style={{ color: "var(--text-muted)" }}>
                  komponente
                </Link>
                <Link href="/konfigurator" style={{ color: "var(--text-muted)" }}>
                  konfigurator
                </Link>
                <Link href="/kontakt" style={{ color: "var(--text-muted)" }}>
                  kontakt
                </Link>
              </div>
              <MobileNav />
              <ThemeToggle />
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
