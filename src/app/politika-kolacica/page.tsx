export default function PolitikaKolacica() {
  return (
    <div className="fade-in max-w-3xl mx-auto">
      <h1 className="text-3xl font-black tracking-tight mb-2" style={{ fontFamily: "var(--font-geist-sans)" }}>
        Politika kolačića
      </h1>
      <p className="text-xs mb-8" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
        Poslednje ažuriranje: septembar 2026.
      </p>

      <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>
            1. Šta su kolačići
          </h2>
          <p>
            Kolačići (cookies) su male tekstualne datoteke koje pretraživač čuva na vašem uređaju
            radi ispravnog funkcionisanja sajta.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>
            2. Kako ih koristimo
          </h2>
          <p>
            skockaj.rs koristi samo tehnički neophodne kolačiće i lokalno skladištenje (localStorage)
            za čuvanje konfiguracije računara u vašem pretraživaču. Ne koristimo kolačiće za praćenje,
            analitiku treće strane niti reklamne kolačiće.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>
            3. Vrste zapisa
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>localStorage</strong> — lista komponenti u konfiguratoru (npr. <code>builder</code>)
            </li>
            <li>
              <strong>Neophodni kolačići</strong> — eventualno za rad sesije i bezbednost, bez profila korisnika
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>
            4. Upravljanje kolačićima
          </h2>
          <p>
            Kolačiće i lokalno skladištenje možete obrisati u podešavanjima svog pretraživača
            (Chrome, Firefox, Safari, Edge). Brisanjem se uklanja i sačuvana konfiguracija računara.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>
            5. Izmene ove politike
          </h2>
          <p>
            Svaku izmenu objavićemo na ovoj stranici. Nastavkom korišćenja sajta prihvatate
            važeću politiku kolačića.
          </p>
        </section>
      </div>
    </div>
  );
}
