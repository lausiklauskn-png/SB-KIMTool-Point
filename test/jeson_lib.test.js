// Headless-Beweis fuer die Kern-Logik der Jesons-Bibliothek (Scheibe 1).
// Prinzip: Wir testen exakt die Bytes, die ausgeliefert werden — der Kern wird
// zwischen den Markern aus jesons-bibliothek/index.html geschnitten und in einer
// Sandbox ausgefuehrt. Keine Kopie der Logik, keine DOM-/Netz-Abhaengigkeit.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(resolve(ROOT, "jesons-bibliothek/index.html"), "utf8");

const START = "// JESONLIB-CORE-START";
const END = "// JESONLIB-CORE-END";
const a = html.indexOf(START);
const b = html.indexOf(END);
assert.ok(a !== -1 && b !== -1 && b > a, "Kern-Marker in index.html gefunden");
const core = html.slice(a, b);

// Sandbox: ein minimales window-Objekt; der IIFE registriert window.JesonLib.
const root = {};
// eslint-disable-next-line no-new-func
const run = new Function("window", "module", core + "\n;return window.JesonLib;");
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
  assert.equal(e.kind, "jeson-eintrag");
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
  assert.equal(L.makeEntry({ payload: {} }).name, "Unbenannte Jeson");
});

test("buildLibraryExport hat die vereinbarte Huelle", () => {
  const e = L.makeEntry({ name: "a", payload: 1 });
  const lib = L.buildLibraryExport([e]);
  assert.equal(lib.kind, "jeson-bibliothek");
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
