// Headless-Beweis fuer die Kern-Logik der Jasons-Bibliothek (Scheibe 1).
// Prinzip: Wir testen exakt die Bytes, die ausgeliefert werden — der Kern wird
// zwischen den Markern aus jasons-bibliothek/index.html geschnitten und in einer
// Sandbox ausgefuehrt. Keine Kopie der Logik, keine DOM-/Netz-Abhaengigkeit.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(resolve(ROOT, "jasons-bibliothek/index.html"), "utf8");

const START = "// JASONLIB-CORE-START";
const END = "// JASONLIB-CORE-END";
const a = html.indexOf(START);
const b = html.indexOf(END);
assert.ok(a !== -1 && b !== -1 && b > a, "Kern-Marker in index.html gefunden");
const core = html.slice(a, b);

// Sandbox: ein minimales window-Objekt; der IIFE registriert window.JasonLib.
const root = {};
// eslint-disable-next-line no-new-func
const run = new Function("window", "module", core + "\n;return window.JasonLib;");
const L = run(root, {});

test("Kern wird aus der ausgelieferten Datei geladen", () => {
  assert.equal(typeof L, "object");
  assert.equal(L.SCHEMA, 1);
  assert.equal(typeof L.makeEntry, "function");
});

test("validateAndParse trennt gut/kaputt/leer", () => {
  assert.equal(L.validateAndParse('{"a":1}').ok, true);
  assert.equal(L.validateAndParse("kein json").ok, false);
  assert.equal(L.validateAndParse("   ").ok, false);
  assert.deepEqual(L.validateAndParse('[1,2,3]').value, [1, 2, 3]);
});

test("normalizeTags: trimmt, klein, dedupliziert, akzeptiert String", () => {
  assert.deepEqual(L.normalizeTags([" A ", "b", "A", ""]), ["a", "b"]);
  assert.deepEqual(L.normalizeTags("x, Y , x"), ["x", "y"]);
  assert.deepEqual(L.normalizeTags(null), []);
});

test("makeEntry normalisiert und stempelt", () => {
  const e = L.makeEntry({ name: "  Mein Rezept ", tags: "essen, Essen", category: " Kochen ", payload: { z: 1 }, origin: "r.json" });
  assert.equal(e.kind, "jason-eintrag");
  assert.equal(e.schemaVersion, 1);
  assert.equal(e.name, "Mein Rezept");
  assert.equal(e.category, "Kochen");
  assert.deepEqual(e.tags, ["essen"]);
  assert.equal(e.origin, "r.json");
  assert.ok(e.id && typeof e.id === "string");
  assert.ok(e.size > 0);
  assert.ok(e.createdAt && e.updatedAt);
  assert.deepEqual(e.payload, { z: 1 });
});

test("leerer Name faellt auf Standard zurueck", () => {
  assert.equal(L.makeEntry({ payload: {} }).name, "Unbenannte Jason");
});

test("buildLibraryExport hat die vereinbarte Huelle", () => {
  const e = L.makeEntry({ name: "a", payload: 1 });
  const lib = L.buildLibraryExport([e]);
  assert.equal(lib.kind, "jason-bibliothek");
  assert.equal(lib.schemaVersion, 1);
  assert.equal(lib.count, 1);
  assert.ok(lib.exportedAt);
  assert.equal(lib.eintraege.length, 1);
});

test("parseLibraryImport: Bibliothek, Einzeleintrag, rohe JSON", () => {
  const lib = L.buildLibraryExport([L.makeEntry({ name: "x", payload: { a: 1 } }), L.makeEntry({ name: "y", payload: 2 })]);
  const r1 = L.parseLibraryImport(JSON.stringify(lib));
  assert.equal(r1.ok, true);
  assert.equal(r1.entries.length, 2);

  const single = L.makeEntry({ name: "solo", payload: [1, 2] });
  const r2 = L.parseLibraryImport(JSON.stringify(single));
  assert.equal(r2.entries.length, 1);
  assert.equal(r2.entries[0].name, "solo");

  const r3 = L.parseLibraryImport('{"beliebig":true}', "fremd");
  assert.equal(r3.ok, true);
  assert.equal(r3.entries.length, 1);
  assert.equal(r3.entries[0].name, "fremd");
  assert.deepEqual(r3.entries[0].payload, { beliebig: true });

  assert.equal(L.parseLibraryImport("kaputt").ok, false);
});

test("mergeEntries dedupliziert nach id, neuere updatedAt gewinnt", () => {
  const base = L.makeEntry({ id: "fix", name: "alt", payload: 1 });
  base.updatedAt = "2020-01-01T00:00:00.000Z";
  const neu = L.makeEntry({ id: "fix", name: "neu", payload: 2 });
  neu.updatedAt = "2030-01-01T00:00:00.000Z";
  const merged = L.mergeEntries([base], [neu]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].name, "neu");

  const other = L.makeEntry({ id: "andere", name: "z", payload: 3 });
  assert.equal(L.mergeEntries([base], [other]).length, 2);
});

test("filterSort: Suche, Kategorie, Schlagwort, Sortierung", () => {
  const es = [
    L.makeEntry({ name: "Apfel", category: "Obst", tags: "rot", payload: 1 }),
    L.makeEntry({ name: "Banane", category: "Obst", tags: "gelb", payload: 2 }),
    L.makeEntry({ name: "Brot", category: "Backwaren", tags: "braun", payload: 3 })
  ];
  assert.equal(L.filterSort(es, { query: "apf" }).length, 1);
  assert.equal(L.filterSort(es, { category: "Obst" }).length, 2);
  assert.equal(L.filterSort(es, { tag: "gelb" }).length, 1);
  const namesAsc = L.filterSort(es, { sort: "name-asc" }).map((e) => e.name);
  assert.deepEqual(namesAsc, ["Apfel", "Banane", "Brot"]);
  const namesDesc = L.filterSort(es, { sort: "name-desc" }).map((e) => e.name);
  assert.deepEqual(namesDesc, ["Brot", "Banane", "Apfel"]);
});

test("allCategories / allTags: sortiert und eindeutig", () => {
  const es = [
    L.makeEntry({ category: "B", tags: "z, a", payload: 1 }),
    L.makeEntry({ category: "A", tags: "a, m", payload: 2 })
  ];
  assert.deepEqual(L.allCategories(es), ["A", "B"]);
  assert.deepEqual(L.allTags(es), ["a", "m", "z"]);
});

// ---- Tresor (Scheibe 2): echte Krypto, WebCrypto in Node >= 20 ----

test("Tresor: verschluesseln -> entschluesseln == Original (gleicher Umschlag wie Modul 02)", async () => {
  const lib = L.buildLibraryExport([L.makeEntry({ name: "geheim", payload: { a: 1, b: [2, 3] } })]);
  const blob = await L.encryptTresor(lib, "passwort123");
  assert.equal(blob.kind, "jason-tresor");
  assert.equal(blob.kdf.algorithm, "PBKDF2");
  assert.equal(blob.kdf.hash, "SHA-256");
  assert.equal(blob.kdf.iterations, 600000);
  assert.match(String(blob.cipher.algorithm), /AES-GCM/);
  assert.ok(typeof blob.ciphertext === "string" && blob.ciphertext.length > 0);
  assert.equal(L.isTresor(blob), true);
  const back = await L.decryptTresor(blob, "passwort123");
  assert.deepEqual(back, lib);
});

test("Tresor: falsches Passwort scheitert sauber", async () => {
  const blob = await L.encryptTresor({ x: 1 }, "richtigespasswort");
  await assert.rejects(() => L.decryptTresor(blob, "falschespw"));
});

test("Tresor: Manipulation faellt durch (AES-GCM Auth-Tag)", async () => {
  const blob = await L.encryptTresor({ x: 1 }, "passwort123");
  const tampered = JSON.parse(JSON.stringify(blob));
  const ch = tampered.ciphertext;
  tampered.ciphertext = ch.slice(0, -1) + (ch.slice(-1) === "A" ? "B" : "A");
  await assert.rejects(() => L.decryptTresor(tampered, "passwort123"));
});

test("Tresor: zu kurzes Passwort wird abgelehnt", async () => {
  await assert.rejects(() => L.encryptTresor({ x: 1 }, "kurz"));
});

test("payloadToEntries trennt Bibliothek / SBKIM-Schluessel / rohe JSON", () => {
  const lib = L.buildLibraryExport([L.makeEntry({ name: "a", payload: 1 })]);
  const rLib = L.payloadToEntries(lib);
  assert.equal(rLib.kind, "bibliothek");
  assert.equal(rLib.entries.length, 1);

  const ident = { identities: [{ nodeId: "abc" }] };
  const rId = L.payloadToEntries(ident, "key-backup");
  assert.equal(rId.kind, "identitaeten");
  assert.equal(rId.entries[0].category, "SBKIM-Schluessel");

  assert.equal(L.payloadToEntries({ beliebig: true }, "x").kind, "roh");
});

test("isTresor erkennt Modul-02-artige Bloecke strukturell", () => {
  assert.equal(L.isTresor({ kdf: { algorithm: "PBKDF2" }, cipher: { algorithm: "AES-GCM-256" }, ciphertext: "x" }), true);
  assert.equal(L.isTresor({ eintraege: [] }), false);
  assert.equal(L.isTresor(null), false);
});
