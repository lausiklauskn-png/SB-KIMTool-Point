// spore_v02.test.js — Beweis: die Browser-Module (web/tools/) tragen Spore v0.2
// (A6+A10). sbkim-spore.js ist byte-1:1 mit Sages Modul 02 (v0.2), sbkim-embedding.js
// hat den A10-Schnipsel-Pfad. Headless via fake-indexeddb + node:crypto (WebCrypto).
//
// Ehrlichkeit: das echte Embedding-Modell (~30 MB) lädt nur im Browser; hier sind
// die Satz-Zerlegung + die Spore-Signier-/Verifizier-Logik bewiesen, nicht der
// Modell-Lauf selbst ("wartet auf Klaus' Browser-Lauf").

import { test } from "node:test";
import assert from "node:assert/strict";
import "fake-indexeddb/auto";
import { webcrypto } from "node:crypto";

globalThis.window = globalThis;
if (!globalThis.crypto || !globalThis.crypto.subtle) {
  Object.defineProperty(globalThis, "crypto", { value: webcrypto, writable: false, configurable: true });
}

await import("../web/tools/sbkim-storage.js");
await import("../web/tools/sbkim-spore.js");
await import("../web/tools/sbkim-embedding.js");

const S = globalThis.SbkimStorage;
const Sp = globalThis.SbkimSpore;
const E = globalThis.SbkimEmbedding;

function fakeVec(seedText) {
  let h = 2166136261; const s = String(seedText);
  for (let c = 0; c < s.length; c++) { h ^= s.charCodeAt(c); h = Math.imul(h, 16777619); }
  let seed = h >>> 0; const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const v = new Array(384); let n = 0;
  for (let d = 0; d < 384; d++) { const x = rnd() - 0.5; v[d] = x; n += x * x; }
  n = Math.sqrt(n) || 1;
  return v.map((x) => x / n);
}

// Storage ist ein Singleton (init nur einmal pro Prozess, fixer dbSuffix) +
// eine Identität — beides einmal vorbereiten, die Tests nutzen sie gemeinsam.
await S.init({ dbSuffix: "test_v02" });
await Sp.getOrCreateIdentity();

test("Browser-Spore-Modul: PROTOCOL_VERSION 0.2 + snippetVectors signiert + verifiziert", async () => {
  const snips = [
    { vec: fakeVec("s1"), text: "Satz eins." },
    { vec: fakeVec("s2"), text: "Satz zwei." },
  ];
  const spore = await Sp.generateOwnSpore({
    domain: "test.example", endpoint: "https://test.example/", nodeType: "hybrid",
    nodeName: "TestPoint", domainDescription: "Testknoten.", domainKeywords: ["test"],
    domainVector: fakeVec("domain"), snippetVectors: snips,
    stammCategories: ["A"], guestCategories: ["B"],
  });
  assert.equal(spore.protocolVersion, "0.2", "v0.2 erwartet");
  assert.ok(Array.isArray(spore.snippetVectors), "snippetVectors fehlt");
  assert.equal(spore.snippetVectors.length, 2);
  assert.equal(spore.snippetVectors[0].vec.length, 384);
  const v = await Sp.verifyForeignSpore(spore);
  assert.equal(v.valid, true, "Signatur inkl. Schnipsel muss gültig sein: " + (v.reason || ""));
});

test("Browser-Spore-Modul: harte Kürzung auf 20 Schnipsel", async () => {
  const many = Array.from({ length: 25 }, (_, i) => ({ vec: fakeVec("n" + i), text: "S" + i }));
  const spore = await Sp.generateOwnSpore({
    domain: "t", endpoint: "https://t/", nodeType: "hybrid", nodeName: "T",
    domainDescription: "d", domainKeywords: ["k"], domainVector: fakeVec("d2"),
    snippetVectors: many, stammCategories: ["A"], guestCategories: ["B"],
  });
  assert.equal(spore.snippetVectors.length, 20, "muss hart auf 20 gekürzt werden");
});

test("Browser-Spore-Modul: ohne snippetVectors bleibt der Umschlag frei (0.1-kompatibel)", async () => {
  const spore = await Sp.generateOwnSpore({
    domain: "t", endpoint: "https://t/", nodeType: "hybrid", nodeName: "T",
    domainDescription: "d", domainKeywords: ["k"], domainVector: fakeVec("d3"),
    stammCategories: ["A"], guestCategories: ["B"],
  });
  assert.equal(spore.protocolVersion, "0.2");
  assert.equal(spore.snippetVectors, undefined, "ohne Eingabe kein snippetVectors-Feld");
});

test("Embedding-Modul: A10-Helfer (Satz-Zerlegung + Deckel) headless", () => {
  assert.equal(typeof E.embedSnippets, "function");
  assert.deepEqual(E._splitIntoSentences("Satz eins. Satz zwei! Und drei?"),
    ["Satz eins.", "Satz zwei!", "Und drei?"]);
  assert.equal(E._prepareSnippetTexts("A. B. C. D.", { max: 2 }).length, 2);
});
