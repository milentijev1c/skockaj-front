/**
 * Pure Serbian count helpers (keep in sync with tests in backend/tests/test_serbian_rules.py).
 */

export function srCount(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export function srRadnje(n: number): string {
  return srCount(n, "radnja", "radnje", "radnji");
}

export function srProdavnice(n: number): string {
  return srCount(n, "prodavnica", "prodavnice", "prodavnica");
}

export function srArtikli(n: number): string {
  return srCount(n, "artikal", "artikla", "artikala");
}

export function srKomponente(n: number): string {
  return srCount(n, "komponenta", "komponente", "komponenti");
}

export function srRezultati(n: number): string {
  return srCount(n, "rezultat", "rezultata", "rezultata");
}
