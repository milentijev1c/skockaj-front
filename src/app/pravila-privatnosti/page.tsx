export default function PravilaPrivatnosti() {
  return (
    <div className="fade-in max-w-3xl mx-auto">
      <h1 className="text-3xl font-black tracking-tight mb-2" style={{ fontFamily: "var(--font-geist-sans)" }}>
        Pravila privatnosti
      </h1>
      <p className="text-xs mb-8" style={{ color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}>
        Poslednje ažuriranje: septembar 2026.
      </p>

      <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>1. Prikupljanje podataka</h2>
          <p>
            skockaj.rs ne zahteva registraciju niti prikuplja lične podatke korisnika (ime, email, adresa, telefon).
            Konfiguracije se čuvaju kao anonimni hash-ovi bez veze sa identitetom korisnika.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>2. Kolačići (Cookies)</h2>
          <p>
            Sajt može koristiti tehničke kolačiće potrebne za funkcionisanje (npr. čuvanje konfiguracija u pregledaču).
            Ne koristimo kolačiće za praćenje niti reklamne kolačiće.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>3. Lokalno skladištenje</h2>
          <p>
            Konfiguracije koje kreirate čuvaju se u lokalnom skladištu vašeg pregledača (localStorage).
            Ovi podaci se ne šalju na naše servere osim kada eksplicitno zatražite čuvanje (deljenje linka).
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>4. Deljene konfiguracije</h2>
          <p>
            Kada sačuvate konfiguraciju, komponente se čuvaju u bazi podataka kao anonimni JSON zapis
            povezan sa kratkim hash ID-jem. Ovi podaci su javno dostupni putem linka.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>5. Analitika</h2>
          <p>
            Možemo koristiti anonimizovanu analitiku poseta (broj pregleda, popularne komponente)
            za poboljšanje usluge. Ovi podaci ne sadrže lične identifikatore.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>6. Treće strane</h2>
          <p>
            Klikom na linkove ka prodavnicama prelazite na sajte trećih lica koji imaju svoju politiku privatnosti.
            skockaj.rs ne kontroliše niti odgovora za prakse privatnosti tih sajtova.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>7. Bezbednost</h2>
          <p>
            Domen skockaj.rs je registrovan na fizičko lice, čime su lični podaci vlasnika automatski skriveni
            u javnoj WHOIS bazi u skladu sa zakonom o zaštiti podataka o ličnosti.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base mb-2" style={{ color: "var(--glow)" }}>8. Kontakt</h2>
          <p>
            Za pitanja o privatnosti, kontaktirajte nas putem kontakt forme na sajtu.
          </p>
        </section>
      </div>
    </div>
  );
}
