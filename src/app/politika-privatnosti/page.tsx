import type { Metadata } from "next";
import Link from "next/link";
import { Brand, LegalShell, LegalSection, LegalList } from "../legal-shell";

export const metadata: Metadata = {
  title: "Politika privatnosti",
  description:
    "Politika privatnosti skockaj.rs — bez naloga, bez ličnih podataka. Kako čuvamo konfiguracije i šta prikupljamo.",
  alternates: { canonical: "/politika-privatnosti" },
};

export default function PolitikaPrivatnosti() {
  return (
    <LegalShell
      title="Politika privatnosti"
      intro={
        <p>
          Ova politika objašnjava šta <Brand /> radi sa podacima kada koristite sajt.
          Kratko: <strong>ne tražimo nalog</strong>. Lične podatke prikupljamo{" "}
          <strong>samo ako nam ih sami pošaljete</strong> kroz kontakt formu (ime, e-pošta, poruka).
          Ne prikupljamo adresu, telefon niti podatke o platnim karticama.
        </p>
      }
    >
      <LegalSection n={1} title="Ko je rukovalac">
        <p>
          Rukovalac obrade podataka u vezi sa sajtom <Brand /> je vlasnik domena, fizičko lice sa
          prebivalištem u Republici Srbiji.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Šta prikupljamo — i šta ne">
        <p>
          <strong>Ne prikupljamo:</strong> adresu, telefon, podatke o platnim karticama, niti
          naloge korisnika.
        </p>
        <p>
          <strong>Prikupljamo samo ako nam pošaljete poruku</strong> (kontakt forma):
        </p>
        <LegalList
          items={[
            "ime, e-poštu i sadržaj poruke (obavezna polja)",
            "naziv kompanije, ako ste izabrali tip „Poslovna saradnja“",
            "opciono: predmet i link stranice na kojoj ste prijavili problem",
            "tehnički trag potreban za zaštitu od zloupotrebe (npr. hash IP adrese, ne sirova IP adresa u izvozu)",
          ]}
        />
        <p>
          <strong>Možemo tehnički obraditi:</strong>
        </p>
        <LegalList
          items={[
            "IP adresu i tehničke zapise servera (vreme pristupa, stranica, korisnički agent) radi bezbednosti i rada servisa",
            "anonimne agregatne statistike korišćenja (npr. broj pregleda konfiguracije) bez ličnih identifikatora",
            "podatke koje sami pošaljete kada sačuvate konfiguraciju za deljenje (samo ID-jevi komponenti)",
          ]}
        />
      </LegalSection>

      <LegalSection n={3} title="Kontakt forma">
        <p>
          Kada popunite <Link href="/kontakt" className="hover-link" style={{ color: "var(--glow)" }}>kontakt formu</Link>,
          obrađujemo <strong>ime, e-poštu i poruku</strong> isključivo radi odgovora na vaš upit
          (povratna informacija, prijava greške, predlog ili poslovna saradnja).
        </p>
        <LegalList
          items={[
            "Poruke čuvamo dok je potrebno za odgovor i eventualni nastavak korespondencije; zatim ih brišemo ili anonimizujemo.",
            "Ne koristimo vašu e-poštu za newsletter niti je delimo sa trećim radi marketinga.",
            "Možete zatražiti uvid ili brisanje poruke (vidi odeljak o pravima korisnika).",
            "Za slanje se koristi forma na sajtu; sadržaj poruke ne objavljujemo javno.",
          ]}
        />
      </LegalSection>

      <LegalSection n={4} title="Lokalno skladištenje (localStorage)">
        <p>
          Konfigurator čuva spisak izabranih komponenti u <strong>lokalnom skladištu pretraživača</strong>{" "}
          (npr. ključ <code>builder</code>). Ti podaci ostaju na vašem uređaju i ne šalju se na naše
          servere dok sami ne sačuvate / podelite konfiguraciju.
        </p>
        <p>
          Radi brojanja <strong>jedinstvenih</strong> pregleda deljenih konfiguracija čuva se i anoniman
          identifikator uređaja (<code>vid</code>) u localStorage. Na server se šalje samo hash tog
          identifikatora uz ID konfiguracije — bez IP-a, imena ili drugih ličnih podataka.
        </p>
        <p>
          Brisanjem lokalnog skladišta u pretraživaču brišete i sačuvanu konfiguraciju.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Deljene konfiguracije">
        <p>
          Kada izaberete čuvanje konfiguracije, na server se šalje samo spisak identifikatora
          komponenti. Čuva se anoniman zapis povezan sa kratkim hash identifikatorom (link oblika{" "}
          <code>skockaj.rs/k/…</code>). U zapisu <strong>nema naloga, e-pošte ni imena</strong>.
        </p>
        <p>
          Takva konfiguracija je <strong>javna</strong> svakome ko ima link (može je videti i
          indeksirati pretraživači). Uz link se prikazuju i <strong>javni</strong> brojač
          jedinstvenih pregleda i kada je konfiguracija otvarana. Nemojte uz konfiguraciju
          objavljivati lične podatke.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Kolačići">
        <p>
          Koristimo isključivo <strong>tehnički neophodne</strong> kolačiće i slične zapise radi rada
          sajta. Ne koristimo kolačiće za profilisanje, retargeting niti reklamne mreže.
          Detalji su u <Link href="/politika-kolacica" className="hover-link" style={{ color: "var(--glow)" }}>Politici kolačića</Link>.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Analitika">
        <p>
          Koristimo <strong>anonimizovanu</strong> analitiku poseta (Vercel Analytics) radi
          poboljšanja usluge — npr. broj otvaranja stranica, popularne kategorije i greške.
          Podaci se koriste u agregatu; ne pravimo marketinške profile niti lične identifikatore.
          Ako uvedemo dodatni alat treće strane, trudićemo se da onemogućimo opcije lične
          identifikacije.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Server i evidencije pristupa">
        <p>
          Radi bezbednosti i stabilnosti (zaštita od zloupotrebe, otklanjanje grešaka) serveri mogu
          privremeno čuvati standardne evidencije pristupa. Ove evidencije se ne koriste za
          profilisanje korisnika niti se prodaju trećim licima.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Treće strane (prodavnice)">
        <p>
          Linkovi vode na sajte prodavnica. Tamo važe <strong>njihove</strong> politike privatnosti
          i uslovi prodaje. Ako neka prodavnica koristi kolačiće ili affiliate parametre u URL-u,
          <Brand /> time ne upravlja niti prima sadržaj tih kolačića.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Prava korisnika">
        <p>
          U skladu sa Zakonom o zaštiti podataka o ličnosti („Sl. glasnik RS“, br. 87/2018) možete
          tražiti pristup, ispravku ili brisanje podataka koje eventualno obrađujemo o vama
          (uključujući poruke poslate kontakt formom), kao i prigovor na obradu.
        </p>
        <p>
          Pošto ne vodimo naloge, za većinu korisnika ne postoji set ličnih podataka koji bismo
          mogli „preuzeti“ ili obrisati — osim lokalnog skladišta u vašem pretraživaču (brišete ga
          sami) i eventualne poruke poslate preko kontakt forme.
        </p>
      </LegalSection>

      <LegalSection n={11} title="Bezbednost i čuvanje">
        <p>
          Tehničke evidencije čuvamo samo onoliko dugo koliko je potrebno za rad i bezbednost servisa.
          Poruke sa kontakt forme čuvamo dok je potrebno za odgovor i evidenciju korespondencije.
          Deljene konfiguracije mogu se obrisati radi održavanja baze. Ne prodajemo lične podatke
          trećim licima.
        </p>
      </LegalSection>

      <LegalSection n={12} title="Deca">
        <p>
          Sajt nije usmeren na decu mlađu od 13 godina i svesno ne prikupljamo njihove lične podatke.
        </p>
      </LegalSection>

      <LegalSection n={13} title="Izmene i kontakt">
        <p>
          Izmene pravila objavljujemo na ovoj stranici sa datumom ažuriranja. Za zahteve u vezi sa
          privatnošću koristite kontakt formu na sajtu (ili kontakt naveden u podnožju).
        </p>
      </LegalSection>
    </LegalShell>
  );
}
