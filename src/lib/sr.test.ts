import assert from "node:assert/strict";
import test from "node:test";
import { srArtikli, srKomponente, srProdavnice, srRezultati } from "./sr.ts";

test("prodavnice", () => {
  assert.equal(srProdavnice(1), "prodavnica");
  assert.equal(srProdavnice(2), "prodavnice");
  assert.equal(srProdavnice(5), "prodavnica");
  assert.equal(srProdavnice(11), "prodavnica");
  assert.equal(srProdavnice(22), "prodavnice");
});

test("artikli", () => {
  assert.equal(srArtikli(1), "artikal");
  assert.equal(srArtikli(3), "artikla");
  assert.equal(srArtikli(11), "artikala");
});

test("komponente", () => {
  assert.equal(srKomponente(1), "komponenta");
  assert.equal(srKomponente(4), "komponente");
  assert.equal(srKomponente(7), "komponenti");
});

test("rezultati", () => {
  assert.equal(srRezultati(1), "rezultat");
  assert.equal(srRezultati(2), "rezultata");
  assert.equal(srRezultati(15), "rezultata");
});
