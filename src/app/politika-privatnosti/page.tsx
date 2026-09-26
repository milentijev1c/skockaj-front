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
          Kratko: <strong>ne tražimo nalog i ne prikupljamo tipične lične podatke</strong> (ime,
          e-pošta, adresa, telefon, broj kartice).
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
          <strong>Ne prikupljamo:</strong> ime i prezime, e-poštu, adresu, telefon, podatke o
          platnim karticama, niti naloge korisnika.
        </p>
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

      <LegalSection n={3} title="Lokalno skladištenje (localStorage)">
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

      <LegalSection n={4} title="Deljene konfiguracije">
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

      <LegalSection n={5} title="Kolačići">
        <p>
          Koristimo isključivo <strong>tehnički neophodne</strong> kolačiće i slične zapise radi rada
          sajta. Ne koristimo kolačiće za profilisanje, retargeting niti reklamne mreže.
          Detalji su u <Link href="/politika-kolacica" className="hover-link" style={{ color: "var(--glow)" }}>Politici kolačića</Link>.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Analitika">
        <p>
          Možemo koristiti <strong>anonimizovanu</strong> analitiku poseta (broj otvaranja stranica,
          popularne kategorije, greške) radi poboljšanja usluge. Ako uvedemo alat treće strane,
          trudićemo se da onemogućimo opcije koje omogućavaju ličnu identifikaciju.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Server i evidencije pristupa">
        <p>
          Radi bezbednosti i stabilnosti (zaštita od zloupotrebe, otklanjanje grešaka) serveri mogu
          privremeno čuvati standardne evidencije pristupa. Ove evidencije se ne koriste za
          profilisanje korisnika niti se prodaju trećim licima.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Treće strane (prodavnice)">
        <p>
          Linkovi vode na sajte prodavnica. Tamo važe <strong>njihove</strong> politike privatnosti
          i uslovi prodaje. Ako neka prodavnica koristi kolačiće ili affiliate parametre u URL-u,
          <Brand /> time ne upravlja niti prima sadržaj tih kolačića.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Prava korisnika">
        <p>
          U skladu sa Zakonom o zaštiti podataka o ličnosti („Sl. glasnik RS“, br. 87/2018) možete
          tražiti pristup, ispravku ili brisanje podataka koje eventualno obrađujemo o vama
          (npr. tehničkih evidencija, ako vas je moguće identifikovati), kao i prigovor na obradu.
        </p>
        <p>
          Pošto ne vodimo naloge i deljene konfiguracije nisu vezane za identitet, za većinu
          korisnika ne postoji set ličnih podataka koji bismo mogli „preuzeti“ ili obrisati —
          osim lokalnog skladišta u vašem pretraživaču (brišete ga sami).
        </p>
      </LegalSection>

      <LegalSection n={10} title="Bezbednost i čuvanje">
        <p>
          Tehničke evidencije čuvamo samo onoliko dugo koliko je potrebno za rad i bezbednost servisa.
          Deljene konfiguracije mogu se obrisati radi održavanja baze. Ne prodajemo lične podatke
          trećim licima.
        </p>
      </LegalSection>

      <LegalSection n={11} title="Deca">
        <p>
          Sajt nije usmeren na decu mlađu od 13 godina i svesno ne prikupljamo njihove lične podatke.
        </p>
      </LegalSection>

      <LegalSection n={12} title="Izmene i kontakt">
        <p>
          Izmene pravila objavljujemo na ovoj stranici sa datumom ažuriranja. Za zahteve u vezi sa
          privatnošću koristite kontakt formu na sajtu (ili kontakt naveden u podnožju).
        </p>
      </LegalSection>
    </LegalShell>
  );
}
