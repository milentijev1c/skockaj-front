import type { Metadata } from "next";
import { Brand, LegalShell, LegalSection, LegalList } from "../legal-shell";

export const metadata: Metadata = {
  title: "Uslovi korišćenja",
  description:
    "Uslovi korišćenja sajta skockaj.rs — upoređivač cena računarskih komponenti u Srbiji. Sajt nije prodavnica.",
};

export default function UsloviKoriscenja() {
  return (
    <LegalShell
      title="Uslovi korišćenja"
      intro={
        <p>
          Ovi uslovi uređuju korišćenje sajta <strong><Brand /></strong> (u daljem tekstu: Sajt).
          Korišćenjem Sajta potvrđujete da ste pročitali, razumeli i prihvatili ove uslove.
        </p>
      }
    >
      <LegalSection n={1} title="Prihvatanje uslova">
        <p>
          Ako se ne slažete sa bilo kojim delom ovih uslova, molimo vas da ne koristite Sajt.
          Nastavak korišćenja nakon objave izmena znači da prihvatate ažurirane uslove.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Priroda usluge">
        <p>
          <Brand /> je <strong>nezavisni agregator (upoređivač) informacija</strong> o računarskim
          komponentama i njihovim cenama na tržištu Srbije.
        </p>
        <LegalList
          items={[
            <>
              <strong>Sajt nije prodavnica</strong> i ne prodaje, ne isporučuje i ne naplaćuje proizvode.
            </>,
            <>
              Kupovinu obavljate <strong>direktno kod treće prodavnice</strong> čiji je link prikazan uz cenu.
              Ugovorni odnos kupac–prodavac nastaje isključivo među vama i tom prodavnicom.
            </>,
            <>
              Prikaz cena, naziva, slika i specifikacija je informativnog karaktera i ne predstavlja
              ponudu u pravnom smislu.
            </>,
          ]}
        />
      </LegalSection>

      <LegalSection n={3} title="Nalog i registracija">
        <p>
          Sajt ne zahteva registraciju niti nalog. Konfigurator računara radi bez naloga;
          podešavanja se čuvaju lokalno u vašem pretraživaču, osim kada sami zatražite javni link
          za deljenje konfiguracije.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Cene, zalihe i tačnost podataka">
        <p>
          Cene i dostupnost prikupljaju se automatski sa sajtova prodavnica i mogu se razlikovati od
          trenutnog stanja kod prodavca (greške prikupljanja, zastareli podaci, akcije, greške na
          sajtu prodavca, različiti načini plaćanja).
        </p>
        <p>
          <strong>Pre svake kupovine obavezno proverite</strong> konačnu cenu, dostupnost, uslove
          plaćanja i isporuke direktno na sajtu prodavca. <Brand /> ne garantuje da je prikazana
          cena najpovoljnija u svakom trenutku niti da je proizvod zaista na stanju.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Konfigurator i kompatibilnost">
        <p>
          Provera kompatibilnosti daje <strong>orijentacionu ocenu</strong> na osnovu poznatih
          specifikacija (npr. socket, tip memorije, TDP). Ne zamenjuje stručni savet, uputstvo
          proizvođača niti proveru BIOS-a / verzija ploče.
        </p>
        <p>
          Ne garantujemo da je svaka kombinacija komponenti tehnički ispravna. Korisnik je odgovoran
          za konačan izbor delova.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Deljene konfiguracije">
        <LegalList
          items={[
            <>
              Sačuvana konfiguracija se čuva kao anonimni zapis sa kratkim hash identifikatorom
              (npr. <code>skockaj.rs/k/abc123</code>).
            </>,
            "Svako ko ima link može videti spisak komponenti i okvirne cene.",
            "Zapis ne sadrži ime, e-poštu niti druge lične podatke autora.",
            "Ne garantujemo trajno čuvanje deljenih konfiguracija; mogu biti obrisane radi održavanja baze.",
          ]}
        />
      </LegalSection>

      <LegalSection n={7} title="Prihvatljivo korišćenje">
        <p>Zabranjeno je:</p>
        <LegalList
          items={[
            "ometanje rada Sajta (napadi, automatsko preopterećenje, zaobilaženje mera zaštite)",
            "pokušaj neovlašćenog pristupa serverima, bazi podataka ili tuđim nalozima (ako se uvedu)",
            "objavljivanje nezakonitog, uvredljivog ili obmanjujućeg sadržaja putem deljenih konfiguracija",
            "korišćenje Sajta u svrhe koje krše zakon Republike Srbije",
          ]}
        />
      </LegalSection>

      <LegalSection n={8} title="Linkovi ka trećim stranama i affiliate">
        <p>
          Sajt sadrži linkove ka spoljnim prodavnicama. Ti sajtovi imaju sopstvene uslove i politike
          privatnosti. <Brand /> <strong>ne kontroliše</strong> njihov sadržaj, cene, zalihu,
          isporuku, reklamacije niti praksu privatnosti i ne odgovara za njih.
        </p>
        <p>
          Neke veze mogu sadržavati <strong>affiliate (partnerske) parametre</strong>. To može
          značiti da Sajt može dobiti proviziju ako kupite preko tog linka.
          <strong> To ne utiče na prikazanu cenu niti na redosled ponuda</strong> — uvek se prikazuje
          najniža pronađena cena.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Intelektualna svojina">
        <LegalList
          items={[
            <>
              Dizajn, kod, baza podataka i originalan sadržaj Sajta pripadaju <Brand />, osim ako
              nije drugačije naznačeno.
            </>,
            "Nazivi proizvoda, zaštitni znakovi, logotipi i slike pripadaju njihovim vlasnicima i koriste se radi identifikacije proizvoda.",
            "Zabranjeno je neovlašćeno kopiranje, preprodaja ili javno prenošenje baze proizvoda i cena u komercijalne svrhe bez pisanog odobrenja.",
          ]}
        />
      </LegalSection>

      <LegalSection n={10} title="Odricanje odgovornosti i ograničenje">
        <p>
          Sajt se pruža <strong>„kako jeste“ (as is)</strong>. U najvećoj meri dozvoljenoj zakonom,
          <Brand /> ne daje garancije u pogledu tačnosti, potpunosti, dostupnosti ili pogodnosti
          za određenu svrhu.
        </p>
        <p>
          <Brand /> ne odgovara za posrednu, slučajnu ili posledičnu štetu, niti za štetu nastalu
          kupovinom zasnovanom na prikazanim informacijama (pogrešna cena, nekompatibilnost,
          neisporučen proizvod kod trećeg prodavca i sl.).
        </p>
      </LegalSection>

      <LegalSection n={11} title="Izmene uslova i dostupnost">
        <p>
          Zadržavamo pravo izmene, privremenog ili trajnog prestanka rada Sajta ili njegovih delova
          bez prethodne najave. Važeća verzija uslova uvek je objavljena na ovoj stranici.
        </p>
      </LegalSection>

      <LegalSection n={12} title="Merodavno pravo i kontakt">
        <p>
          Na ove uslove primenjuje se pravo <strong>Republike Srbije</strong>. Za sporove je nadležan
          stvarno nadležni sud u Beogradu, osim ako imperativni propisi ne nalažu drugačije.
        </p>
        <p>
          Za pitanja u vezi sa uslovima korišćenja obratite se putem kontakt forme na sajtu ili na
          kontakt objavljen u podnožju stranice.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
