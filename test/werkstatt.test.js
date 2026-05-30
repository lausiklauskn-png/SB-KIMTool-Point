// werkstatt.test.js — beweist die Browser-Brücke (assets/werkstatt.js) headless.
//
// Die Werkstatt lädt echte Werkzeuge (window.Sbkim*) und führt eine echte
// Selbst-Prüfung aus. Hier per window-Shim: dieselben Module wie im Browser,
// dieselbe Prüf-Logik. Was hier grün ist, rechnet wirklich.

import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.window = globalThis;

import "../web/tools/sbkim-match.js";
import "../web/tools/sbkim-siegel.js";
import "../assets/werkstatt.js";

const W = globalThis.SbkimWerkstatt;

test("Werkstatt registriert ihre Prüf-API", () => {
  assert.equal(typeof W, "object");
  for (const fn of ["probeMatch", "probeSiegel", "probeAll"]) {
    assert.equal(typeof W[fn], "function", `Werkstatt.${fn}`);
  }
});

test("probeMatch: 04 Match besteht alle Schritte (offline)", () => {
  const r = W.probeMatch();
  assert.equal(r.ok, true, r.fazit);
  assert.ok(r.schritte.length >= 5, "mehrere Prüfschritte");
  for (const s of r.schritte) {
    assert.equal(s.ok, true, `Schritt fehlgeschlagen: ${s.label} (war ${s.wert}, erwartet ${s.erwartet})`);
  }
});

test("probeSiegel: 16 Siegel-Lesepfad besteht (offline)", () => {
  const r = W.probeSiegel();
  assert.equal(r.ok, true, r.fazit);
  for (const s of r.schritte) {
    assert.equal(s.ok, true, `Schritt fehlgeschlagen: ${s.label}`);
  }
});

test("probeAll: beide Offline-Werkzeuge grün", () => {
  const all = W.probeAll();
  assert.equal(all.length, 2);
  assert.ok(all.every((r) => r.ok), "alle Proben grün");
});

test("ehrlich: fehlendes Modul -> ok=false, nicht grün vortäuschen", () => {
  // probeMatch mit einem leeren Modul: muss ehrlich scheitern
  const r = W.probeMatch({});
  assert.equal(r.ok, false);
  assert.match(r.fazit, /nicht geladen/i);
});
