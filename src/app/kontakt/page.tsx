import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Javi se skockaj.rs timu — povratne informacije, prijava greške, predlog funkcije ili poslovna saradnja sa prodavnicama i distributerima.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <div className="fade-in">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Copy column */}
        <div>
          <p
            className="text-[10px] tracking-[0.2em] uppercase mb-2"
            style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}
          >
            kontakt
          </p>
          <h1
            className="text-3xl md:text-4xl font-black tracking-tight mb-4"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Javi nam se
          </h1>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
            Pitanja, predlozi, prijava greške ili poslovna saradnja —
            piši nam. Odgovaramo u najkraćem roku.
          </p>

          <ul className="space-y-3 text-sm mb-8">
            {[
              {
                title: "Povratna informacija",
                desc: "Šta radi dobro, a šta bi moglo bolje.",
              },
              {
                title: "Prijava greške",
                desc: "Ako nešto ne radi — pošalji link stranice i šta si video.",
              },
              {
                title: "Poslovna saradnja",
                desc: "Prodavnice i distributeri koji žele da budu u poređenju cena.",
              },
            ].map((item) => (
              <li key={item.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  style={{
                    width: 6,
                    height: 6,
                    marginTop: 7,
                    borderRadius: 99,
                    background: "var(--glow)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div className="font-bold" style={{ color: "var(--text)" }}>
                    {item.title}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {item.desc}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside
            className="p-5"
            style={{
              background: "var(--panel)",
              border: "1px solid var(--edge)",
            }}
          >
            <h2
              className="text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: "var(--glow)", fontFamily: "var(--font-geist-mono)" }}
            >
              Poslovna saradnja
            </h2>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Imate prodavnicu ili distribuciju računarskih komponenti?
              Javite se — skockaj.rs nije prodavnica, već poređenje cena
              iz domaćih prodavnica.
            </p>
          </aside>

          <p className="text-[11px] mt-6 leading-relaxed" style={{ color: "var(--text-dim)" }}>
            Slanjem poruke prihvatate{" "}
            <Link href="/politika-privatnosti" className="hover-link" style={{ color: "var(--text-muted)" }}>
              politiku privatnosti
            </Link>
            . Ne šaljemo newsletter i ne delimo vaš email sa trećim stranama.
          </p>
        </div>

        {/* Form column */}
        <ContactForm />
      </div>
    </div>
  );
}
