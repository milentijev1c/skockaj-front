import type { Metadata } from "next";
import Link from "next/link";
import { Brand, LegalShell, LegalSection, LegalList } from "../legal-shell";

export const metadata: Metadata = {
  title: "Politika kolačića",
  description:
    "Politika kolačića skockaj.rs — tehnički kolačići i localStorage za konfigurator, bez reklamnog praćenja.",
  alternates: { canonical: "/politika-kolacica" },
};

export default function PolitikaKolacica() {
  return (
    <LegalShell
      title="Politika kolačića"
      intro={
        <p>
          <Brand /> koristi <strong>samo tehnički neophodne</strong> kolačiće i lokalno skladištenje
          pretraživača. Ne koristimo kolačiće za reklame, retargeting niti profilisanje radi marketinga.
        </p>
      }
    >
      <LegalSection n={1} title="Šta su kolačići">
        <p>
          Kolačići (cookies) su male tekstualne datoteke koje sajt ostavlja u vašem pretraživaču
          radi pamćenja podešavanja i ispravnog rada. Slične tehnike su i <strong>localStorage</strong> i{" "}
          <strong>sessionStorage</strong> (podaci čuvani u pretraživaču bez slanja kolačića).
        </p>
      </LegalSection>

      <LegalSection n={2} title="Kako ih koristimo">
        <LegalList
          items={[
            <>
              <strong>Funkcionalnost konfiguratora</strong> — lokalno pamćenje izabranih komponenti
              (localStorage, npr. ključ <code>builder</code>).
            </>,
            <>
              <strong>Rad i bezbednost sajta</strong> — eventualni tehnički kolačići sesije, CSRF /
              zaštita od zloupotrebe, uravnoteženje opterećenja.
            </>,
            <>
              <strong>Bez marketing kolačića</strong> — ne učitavamo tagove oglasnih mreža niti
              alate koji vas prate radi reklama.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection n={3} title="Pregled zapisa">
        <div style={{ background: "var(--panel)", border: "1px solid var(--edge)" }}>
          <div
            className="grid grid-cols-3 gap-2 px-4 py-3 text-[10px] font-bold tracking-widest uppercase"
            style={{ borderBottom: "1px solid var(--edge)", color: "var(--text-muted)", fontFamily: "var(--font-geist-mono)" }}
          >
            <span>Naziv</span>
            <span>Tip / svrha</span>
            <span>Trajanje</span>
          </div>
          {[
            ["builder", "localStorage — izabrane komponente", "do brisanja u pretraživaču"],
            ["vid", "localStorage — anoniman id za jedinstvene preglede", "do brisanja u pretraživaču"],
            ["cookie_consent", "localStorage — saglasnost / zatvaranje bannera", "do brisanja u pretraživaču"],
            ["skockaj-theme", "localStorage — izbor svetle ili tamne teme", "do brisanja u pretraživaču"],
            ["skockaj-kontakt-last", "localStorage — zaštita od ponovljenog slanja forme", "do brisanja u pretraživaču"],
            ["tehnička sesija", "kolačić sesije / bezbednost (ako postoji)", "sesija ili kraći rok"],
          ].map(([name, purpose, duration]) => (
            <div
              key={name}
              className="grid grid-cols-3 gap-2 px-4 py-3 text-xs row-hover"
              style={{ borderBottom: "1px solid var(--edge)" }}
            >
              <span style={{ fontFamily: "var(--font-geist-mono)", color: "var(--text)" }}>{name}</span>
              <span style={{ color: "var(--text-muted)" }}>{purpose}</span>
              <span style={{ color: "var(--text-muted)" }}>{duration}</span>
            </div>
          ))}
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Spisak je informativan i može se dopuniti tehničkim zapisima neophodnim za stabilan rad.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Šta nije predmet ove politike">
        <p>
          Klikom na link ka prodavnici prelazite na drugi sajt. Tamo mogu postojati{" "}
          <strong>sopstveni kolačići</strong> prodavnice, platnih sistema ili analitike koje oni
          koriste. Za njih važi politika kolačića te prodavnice.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Upravljanje i brisanje">
        <p>
          U podešavanjima pretraživača (Chrome, Firefox, Safari, Edge) možete videti, blokirati ili
          obrisati kolačiće i lokalno skladištenje. Ako obrišete localStorage, uklanja se i sačuvana
          konfiguracija računara u konfiguratoru.
        </p>
        <p>
          Blokiranje tehničkih zapisa može dovesti do toga da konfigurator ne pamti izbor delova.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Saglasnost (banner)">
        <p>
          Pri prvom otvaranju prikazujemo mali banner sa ovim informacijama. Dugme{" "}
          <strong>U redu</strong> ili <strong>Odbij</strong> pamti se u lokalnom skladištu
          (<code>cookie_consent</code>) da vas ne uznemiravamo ponovo. Izbrišite taj zapis u
          pretraživaču ako želite ponovo da vidite banner.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Izmene i povezani dokumenti">
        <p>
          Svaku izmenu objavljujemo na ovoj stranici. Više o obradi podataka potražite u{" "}
          <Link href="/politika-privatnosti" className="hover-link" style={{ color: "var(--glow)" }}>
            Politici privatnosti
          </Link>{" "}
          i{" "}
          <Link href="/uslovi-koriscenja" className="hover-link" style={{ color: "var(--glow)" }}>
            Uslovima korišćenja
          </Link>.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
