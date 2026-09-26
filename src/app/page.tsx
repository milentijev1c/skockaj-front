import Link from "next/link";
import {
  ACTIVE_STORES,
  CATEGORIES,
  CATEGORY_ICONS,
  STORE_NAMES,
  srProdavnice,
} from "@/lib/types";
import { faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/lib/json-ld";
import { ShopLogo } from "./shop-logo";
import Typewriter from "./typewriter";
import FaqAccordion from "./faq-accordion";
import "./page.css";

const STEPS = [
  {
    n: "01",
    title: "Izaberi kategoriju",
    desc: "Uporedi cene procesora, grafičkih kartica, RAM-a i ostalih delova iz domaćih prodavnica.",
  },
  {
    n: "02",
    title: "Složi konfiguraciju",
    desc: "Ubaci delove u konfigurator — kompatibilnost se proverava u realnom vremenu.",
  },
  {
    n: "03",
    title: "Podeli i uštedi",
    desc: "Podeli konfiguraciju linkom i uzmi najjeftiniju kombinaciju u prodavnicama.",
  },
];

const BENEFITS = [
  {
    title: "Sve domaće prodavnice",
    desc: "Gigatron, Monitor, BigBang i ostali — na jednom mestu, bez skakanja po sajtovima.",
  },
  {
    title: "Automatsko poređenje cena",
    desc: "Cene se ažuriraju dnevno. Vidiš odmah gde je deo najjeftiniji.",
  },
  {
    title: "Konfigurator sa proverom",
    desc: "Socket, RAM tip, napajanje — greške u kompatibilnosti pre kupovine.",
  },
  {
    title: "Bez naloga, brzo i besplatno",
    desc: "Nema registracije, nema skrivenih troškova. skockaj.rs nije prodavnica.",
  },
];

const FAQ = [
  {
    q: "Kako se ažuriraju cene?",
    a: "Cene redovno preuzimamo sa sajtova prodavnica (uglavnom dnevno). Uvek proveri finalnu cenu na sajtu prodavnice pre kupovine — cene su informativne.",
  },
  {
    q: "Da li moram da se registrujem?",
    a: "Ne. Ceo sajt radi bez naloga. Konfiguraciju možeš podeliti običnim linkom.",
  },
  {
    q: "Kako radi provera kompatibilnosti?",
    a: "Konfigurator proverava socket procesora i matične ploče, tip RAM memorije, snagu napajanja i ostale ključne veze između delova — u realnom vremenu dok slažeš.",
  },
  {
    q: "Koji su izvori cena?",
    a: "Domaće online prodavnice koje pokrivamo (Gigatron, Monitor, Exceed, WinWin, BigBang, Ananas i druge). Skockaj.rs nije prodavnica i ne prodaje robu.",
  },
];

export default function Home() {
  return (
    <div>
      <JsonLd data={faqJsonLd(FAQ)} />
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative text-center" style={{ paddingTop: 48, paddingBottom: 56 }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.04 }}>
          <svg width="100%" height="100%" viewBox="0 0 800 600">
            <defs>
              <pattern id="traces" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50h40l10-10h10l10 10h30" stroke="var(--glow)" fill="none" strokeWidth="1"/>
                <path d="M50 0v30l-10 10v10l10 10v30" stroke="var(--glow)" fill="none" strokeWidth="1"/>
                <circle cx="50" cy="50" r="3" fill="var(--glow)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#traces)"/>
          </svg>
        </div>

        <div className="relative z-10 fade-up">
          <div className="mb-6 text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
            Skockaj &bull; Uporedi &bull; Uštedi
          </div>

          <h1
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none min-h-[2.4em]"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            <Typewriter />
          </h1>

          <p className="text-lg mb-4 max-w-xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Uporedi cene komponenti iz domaćih prodavnica — bez registracije.
          </p>
          <p className="text-sm mb-10 max-w-md mx-auto" style={{ color: "var(--text-dim)" }}>
            Procesori, grafičke kartice, RAM, matične ploče i ostalo. Cene se ažuriraju dnevno.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/konfigurator"
              className="hero-primary-btn inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold tracking-wide uppercase"
              style={{ background: "var(--glow-fill)", color: "var(--on-glow)", fontFamily: "var(--font-geist-mono)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
                <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Pokreni konfigurator
            </Link>
            <Link
              href="/komponente"
              className="home-ghost-btn inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium tracking-wide"
              style={{ border: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
            >
              Pregledaj komponente
            </Link>
          </div>

          {/* Live-ish chips (static counts — no catalog fetch) */}
          <div className="mt-10 flex flex-wrap gap-3 justify-center" style={{ fontFamily: "var(--font-geist-mono)" }}>
            {[
              `${ACTIVE_STORES.length} prodavnica`,
              "cene se ažuriraju dnevno",
              "bez naloga",
            ].map((chip) => (
              <span
                key={chip}
                className="text-[11px] px-3 py-1.5"
                style={{
                  border: "1px solid var(--edge)",
                  color: "var(--text-muted)",
                  borderRadius: 2,
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust / metrics ──────────────────────────── */}
      <section
        aria-label="Podaci o servisu"
        className="py-10"
        style={{ borderTop: "1px solid var(--edge)", borderBottom: "1px solid var(--edge)" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: String(ACTIVE_STORES.length), label: srProdavnice(ACTIVE_STORES.length) },
            { value: "8", label: "kategorija komponenti" },
            { value: "24h", label: "ažuriranje cena" },
            { value: "Bez", label: "naloga i registracije" },
          ].map((s) => (
            <div key={s.label} className="stat-item">
              <div className="text-3xl font-bold" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>
                {s.value}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────── */}
      <section className="py-16">
        <div className="text-center mb-10">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>
            Kategorije
          </p>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-geist-sans)" }}>
            Šta tražiš za svoj računar?
          </h2>
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={`/komponente?kategorija=${cat.slug}`}
              className="card-hover p-6 text-center"
              style={{ background: "var(--panel)", border: "1px solid var(--edge)", minHeight: 130 }}
            >
              <div
                className="mx-auto mb-3"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: "var(--glow-fill)",
                  WebkitMaskImage: `url(${CATEGORY_ICONS[cat.value]})`,
                  maskImage: `url(${CATEGORY_ICONS[cat.value]})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              />
              <span className="text-sm font-bold tracking-wide" style={{ color: "var(--text)", fontFamily: "var(--font-geist-mono)" }}>
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────── */}
      <section
        className="px-6 md:px-10 py-12"
        style={{ background: "var(--panel)", borderTop: "1px solid var(--edge)", borderBottom: "1px solid var(--edge)" }}
      >
        <div className="text-center mb-8">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>
            Kako radi
          </p>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-geist-sans)" }}>
            Tri koraka do bolje cene
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="text-center md:text-left">
              <div
                className="text-xs font-bold tracking-widest mb-2"
                style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}
              >
                {step.n}
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why skockaj ──────────────────────────────── */}
      <section className="py-16">
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>
            Zašto skockaj.rs
          </p>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-geist-sans)" }}>
            Poređenje cena bez frke
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="p-6"
              style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}
            >
              <div
                className="mb-2 font-bold"
                style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)", fontSize: 14 }}
              >
                {b.title}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Shops ────────────────────────────────────── */}
      <section className="py-16" style={{ borderTop: "1px solid var(--edge)", borderBottom: "1px solid var(--edge)" }}>
        <div className="text-center mb-10">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>
            Prodavnice
          </p>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3" style={{ fontFamily: "var(--font-geist-sans)" }}>
            Poređenje iz domaćih prodavnica
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Cene su informativne i preuzete sa sajtova prodavnica.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {ACTIVE_STORES.map((slug) => (
            <div key={slug} title={STORE_NAMES[slug]}>
              <ShopLogo slug={slug} size={48} />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/prodavnice"
            className="home-ghost-btn inline-flex items-center px-6 py-3 text-xs font-medium tracking-wide"
            style={{ border: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
          >
            Sve prodavnice
          </Link>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="py-16">
        <div className="text-center mb-10">
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}>
            FAQ
          </p>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-geist-sans)" }}>
            Česta pitanja
          </h2>
        </div>
        <FaqAccordion items={FAQ} />
      </section>

      {/* ── Final CTA ────────────────────────────────── */}
      <section
        className="py-16 text-center"
        style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}
      >
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3" style={{ fontFamily: "var(--font-geist-sans)" }}>
          Spremna konfiguracija?
        </h2>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
          Uporedi cene delova ili složi ceo računar uz proveru kompatibilnosti.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/konfigurator"
            className="hero-primary-btn inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold tracking-wide uppercase"
            style={{ background: "var(--glow-fill)", color: "var(--on-glow)", fontFamily: "var(--font-geist-mono)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Pokreni konfigurator
          </Link>
          <Link
            href="/komponente"
            className="home-ghost-btn inline-flex items-center gap-2 px-8 py-3.5 text-sm font-medium tracking-wide"
            style={{ border: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
          >
            Pregledaj komponente
          </Link>
        </div>
      </section>
    </div>
  );
}
