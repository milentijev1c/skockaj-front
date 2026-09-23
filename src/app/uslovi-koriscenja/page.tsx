export default function UsloviKoriscenja() {
  return (
    <div className="fade-in max-w-3xl mx-auto">
      <h1 className="text-3xl font-black tracking-tight mb-2" style={{ fontFamily: "var(--font-geist-sans)" }}>
        Uslovi korišćenja
      </h1>
      <p className="text-xs mb-8" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
        Poslednje ažuriranje: septembar 2026.
      </p>

      <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>1. Prihvatanje uslova</h2>
          <p>
            Korišćenjem sajta skockaj.rs prihvatate ove uslove korišćenja. Ako se ne slažete sa bilo kojim delom uslova,
            molimo vas da ne koristite sajt.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>2. Priroda usluge</h2>
          <p>
            skockaj.rs je <strong>nezavisni agregator informacija</strong> o cenama računarskih komponenti na tržištu Srbije.
            Sajt <strong>nije prodavnica</strong> i ne vrši prodaju, isporuku niti naplatu proizvoda.
            Sve kupovine se obavljaju direktno kod navedenih prodavnica.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>3. Tačnost informacija</h2>
          <p>
            Cene, dostupnost i specifikacije proizvoda se automatski prikupljaju sa sajtova trećih lica.
            Iako težimo tačnosti, ne garantujemo da su sve informacije uvek ispravne ili ažurne.
            Pre kupovine uvek proverite konačnu cenu i dostupnost direktno kod prodavca.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>4. Kompatibilnost</h2>
          <p>
            Alat za proveru kompatibilnosti pruža orijentacionu procenu zasnovanu na poznatim specifikacijama.
            Ne garantujemo kompatibilnost svih komponenti. Pre sastavljanja konfiguracije, proverite
            specifikacije kod proizvođača.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>5. Linkovi ka trećim stranama</h2>
          <p>
            Sajt sadrži linkove ka spoljnim prodavnicama. skockaj.rs nije odgovoran za sadržaj,
            politiku privatnosti niti praksu tih sajtova.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>6. Affiliate partnerstvo</h2>
          <p>
            Neke veze ka prodavnicama mogu sadržati affiliate parametre. To ne utiče na prikazanu cenu
            niti na redosled ponuda.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>7. Intelektualna svojina</h2>
          <p>
            Sav sadržaj sajta (dizajn, kod, baza podataka) je vlasništvo skockaj.rs osim ako nije drugačije naznačeno.
            Podaci o proizvodima i slikama pripadaju njihovim vlasnicima.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>8. Izmene uslova</h2>
          <p>
            Zadržavamo pravo izmene ovih uslova u bilo kom trenutku. Nastavak korišćenja sajta nakon izmena
            predstavlja prihvatanje novih uslova.
          </p>
        </section>
      </div>
    </div>
  );
}
