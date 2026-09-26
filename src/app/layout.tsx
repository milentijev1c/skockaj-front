import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import SiteFooter from "./site-footer";
import { Brand } from "./brand";
import CookieBanner from "./cookie-banner";
import ThemeToggle from "./theme-toggle";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme";
import { SITE_URL, SITE_NAME, websiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/lib/json-ld";
import "./globals.css";

// Nonce CSP in proxy.ts requires dynamic rendering (fresh nonce per request)
export const dynamic = "force-dynamic";

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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="sr" data-theme="dark" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <JsonLd data={websiteJsonLd()} />
      <body className="min-h-full flex flex-col" style={{ background: "var(--void)", color: "var(--text)" }}>
        {/* LED-strip header */}
        <header className="header-glow" style={{ background: "var(--panel)", borderBottom: "1px solid var(--edge)", position: "relative" }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "var(--glow)", opacity: 0.4 }} />
          <nav className="mx-auto flex items-center justify-between gap-4 px-6 py-4" style={{ maxWidth: 1100 }}>
            <Link href="/" className="logo-link" aria-label="skockaj.rs početna">
              <Brand size={20} />
            </Link>
            <div className="flex items-center gap-6">
              <div className="flex gap-8 text-sm font-medium nav-links" style={{ fontFamily: "var(--font-geist-mono)" }}>
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
