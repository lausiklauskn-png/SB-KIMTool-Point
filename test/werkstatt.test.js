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
import "../web/tools/sbkim-embedding.js";
import "../web/tools/sbkim-anastomose.js";
import "../web/tools/sbkim-heterokaryose.js";
import "../assets/werkstatt.js";

const W = globalThis.SbkimWerkstatt;

test("Werkstatt registriert ihre Prüf-API", () => {
  assert.equal(typeof W, "object");
  for (const fn of ["probeMatch", "probeSiegel", "probeEmbedding",
                    "probeAnastomose", "probeHeterokaryose", "probeAll"]) {
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

test("probeAll: trennt offline-bewiesen von netz-bereit", () => {
  const all = W.probeAll();
  assert.equal(all.offline.length, 2, "zwei offline-Proben (04/16)");
  assert.equal(all.netz.length, 3, "drei netz-Proben (03/05/06)");
  assert.ok(all.offline.every((r) => r.ok), "offline-Proben grün");
});

test("netz-Module: ehrlich 'bereit · braucht Netz', nicht als grün-gerechnet behauptet", () => {
  for (const r of [W.probeEmbedding(), W.probeAnastomose(), W.probeHeterokaryose()]) {
    assert.equal(r.ok, true, `${r.name} geladen+vollständig`);
    assert.equal(r.status, "bereit · braucht Netz", "Status ist ehrlich netzgebunden");
    assert.match(r.fazit, /Netz|Browser/i, "Fazit nennt die Netz-/Browser-Bedingung");
  }
});

test("liveMatch (Demo-Pfad): mehr gemeinsame Wörter => höhere Passung", async () => {
  // Container hat kein Embedding-Modell (Netz blockiert) -> Demo-Vektor-Pfad.
  // EHRLICH: die Demo kann KEINE Semantik (dafür ist das echte Modell da) — sie
  // misst nur Überlappung exakt gleicher Wörter. Daher Profile mit klarer
  // Wort-Überlappung vs. ohne.
  const ähnlich = await W.liveMatch(
    "vegetarische suppe kochen rezept gemüse",
    "vegetarische suppe kochen rezept brühe");
  const fremd = await W.liveMatch(
    "vegetarische suppe kochen rezept gemüse",
    "fahrrad bremse schaltung reparatur werkstatt");
  assert.equal(ähnlich.ok, true);
  assert.equal(ähnlich.echt, false, "ohne Modell: ehrlich Demo-Pfad");
  assert.match(ähnlich.quelle, /Demo/i);
  assert.ok(ähnlich.score > fremd.score,
    `ähnliche (${ähnlich.score}) sollten besser passen als fremde (${fremd.score})`);
});

test("liveMatch: Fazit kennzeichnet Demo ehrlich (kein vorgetäuschtes Embedding)", async () => {
  const r = await W.liveMatch("a b c", "a b c");
  assert.match(r.fazit, /DEMO|Demo/);
  assert.equal(typeof r.score, "number");
  assert.equal(typeof r.treffer, "boolean");
});

test("liveMatch: ohne Match-Modul ehrlich ok=false", async () => {
  const r = await W.liveMatch("x", "y", { match: null });
  assert.equal(r.ok, false);
  assert.match(r.fazit, /nicht geladen/i);
});

test("ehrlich: fehlendes Modul -> ok=false, nicht grün vortäuschen", () => {
  // probeMatch mit einem leeren Modul: muss ehrlich scheitern
  const r = W.probeMatch({});
  assert.equal(r.ok, false);
  assert.match(r.fazit, /nicht geladen/i);
  // auch die Bereitschafts-Probe darf nicht grün lügen, wenn die API fehlt:
  // ein Objekt OHNE die erwarteten Funktionen muss ok=false ergeben.
  const n = W.probeAnastomose({});
  assert.equal(n.ok, false);
  assert.equal(n.status, "unvollständig");
});

// --- End-to-End: protocolRun verkettet die Module --------------------------

test("protocolRun: ohne Browser-Spore meldet Schritt 1 ehrlich 'browser', kein grün", async () => {
  // Headless: kein IndexedDB/WebCrypto -> Spore nicht nutzbar. Wir geben spore:null,
  // damit Schritt 1+3 als 'braucht Browser' erscheinen (nicht grün-gelogen).
  const r = await W.protocolRun(
    "vegetarische suppe kochen rezept gemüse",
    "vegetarische suppe kochen rezept brühe",
    { spore: null });
  const s1 = r.schritte.find((s) => s.label.startsWith("1)"));
  assert.equal(s1.status, "browser", "Identität braucht Browser");
  // Schritt 2 (Match) muss echt laufen (Demo-Pfad), Treffer bei viel Überlappung
  const s2 = r.schritte.find((s) => s.label.startsWith("2)"));
  assert.ok(["ok", "ready"].includes(s2.status), "Match-Schritt läuft");
  // Schritt 4 (Siegel) ist offline lesbar -> ok
  const s4 = r.schritte.find((s) => s.label.startsWith("4)"));
  assert.equal(s4.status, "ok", "Siegel lesbar");
  assert.match(r.zusammenfassung, /Browser/i, "Zusammenfassung nennt Browser-Bedarf");
});

test("protocolRun: kein Treffer -> Vertrauensschritt wird ehrlich übersprungen", async () => {
  const r = await W.protocolRun(
    "vegetarische suppe kochen rezept gemüse",
    "fahrrad bremse schaltung reparatur werkstatt",
    { spore: null });
  const s3 = r.schritte.find((s) => s.label.startsWith("3)"));
  assert.equal(s3.status, "skip");
  assert.match(s3.info, /kein Treffer/i);
});
