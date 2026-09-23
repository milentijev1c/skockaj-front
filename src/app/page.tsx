import Link from "next/link";
import "./page.css";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {/* Circuit-board trace background */}
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

      {/* Hero */}
      <div className="relative z-10 fade-up">
        <div className="mb-6 text-xs tracking-widest uppercase" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
          Skockaj &bull; Uporedi &bull; Uštedi
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none" style={{ fontFamily: "var(--font-geist-sans)", color: "var(--text)" }}>
          Skockaj svoj<br/>
          <span className="glow-pulse" style={{ color: "var(--glow)" }}>računar</span>
        </h1>

        <p className="text-lg mb-10 max-w-lg mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Uporedi cene komponenti iz svih domaćih prodavnica.<br/>
          Bez registracije. Bez skrivenih troškova.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/konfigurator"
            className="hero-primary-btn inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold tracking-wide uppercase"
            style={{ background: "var(--glow)", color: "var(--void)", fontFamily: "var(--font-geist-mono)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/></svg>
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

        {/* Stats strip */}
        <div className="mt-16 flex gap-12 justify-center fade-up-delay" style={{ fontFamily: "var(--font-geist-mono)" }}>
          {[
            { value: "5+", label: "prodavnica" },
            { value: "24h", label: "ažuriranje" },
            { value: "Bez", label: "naloga" },
          ].map((s) => (
            <div key={s.label} className="text-center stat-item">
              <div className="text-2xl font-bold" style={{ color: "var(--glow)" }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
