// modules.test.js — beweist, dass die 1:1 aus dem Sage-Protokol kopierten
// SBKIM-Module headless laden und ihre öffentliche API registrieren.
//
// Die Module sind klassische <script>-Module (IIFE), die sich auf `window`
// registrieren — im Browser window.Sbkim*, hier per window-Shim auf globalThis.
// Das ist exakt der Pfad, den auch die statische Seite nutzt.
//
// Ehrlichkeit (Sage-konform):
//   - 04 Match ist eine reine, offline-Funktion -> hier voll bewiesen.
//   - 01 Storage (IndexedDB) + 02 Spore (WebCrypto+Storage) + 03 Embedding
//     (Modell per CDN) + 05 Anastomose (WebCrypto+HTTP) laufen erst im Browser
//     voll; hier ist NUR das Laden + die API-Registrierung bewiesen. Ihr
//     Browser-Pfad gilt als "ungeprüft, wartet auf Klaus' Browser-Lauf".

import { test } from "node:test";
import assert from "node:assert/strict";

// window-Shim VOR den Modul-Importen: die Sage-Module registrieren auf window.
globalThis.window = globalThis;

import "../web/tools/sbkim-storage.js";
import "../web/tools/sbkim-spore.js";
import "../web/tools/sbkim-embedding.js";
import "../web/tools/sbkim-match.js";
import "../web/tools/sbkim-anastomose.js";
import "../web/tools/sbkim-heterokaryose.js";
import "../web/tools/sbkim-apoptose.js";
import "../web/tools/sbkim-ui-demo.js";
import "../web/tools/sbkim-membran.js";
import "../web/tools/sbkim-siegel.js";

test("alle zehn Module registrieren ihre API auf window", () => {
  assert.equal(typeof globalThis.SbkimStorage, "object", "01 Storage");
  assert.equal(typeof globalThis.SbkimSpore, "object", "02 Spore");
  assert.equal(typeof globalThis.SbkimEmbedding, "object", "03 Embedding");
  assert.equal(typeof globalThis.SbkimMatch, "object", "04 Match");
  assert.equal(typeof globalThis.SbkimAnastomose, "object", "05 Anastomose");
  assert.equal(typeof globalThis.SbkimHeterokaryose, "object", "06 Heterokaryose");
  assert.equal(typeof globalThis.SbkimApoptose, "object", "07 Apoptose");
  assert.equal(typeof globalThis.SbkimUiDemo, "object", "08 UI-Demo");
  assert.equal(typeof globalThis.SbkimMembrane, "object", "15 Membran");
  assert.equal(typeof globalThis.SbkimSiegel, "object", "16 Siegel");
});

test("01 Storage zeigt seine erwartete Oberfläche", () => {
  const s = globalThis.SbkimStorage;
  for (const fn of ["init", "get", "put", "del", "all", "clear"]) {
    assert.equal(typeof s[fn], "function", `Storage.${fn}`);
  }
});

test("02 Spore zeigt seine Multi-Identitäts-Oberfläche", () => {
  const sp = globalThis.SbkimSpore;
  for (const fn of ["init", "getOrCreateIdentity", "getNodeId", "generateOwnSpore",
                    "verifyForeignSpore", "listIdentities"]) {
    assert.equal(typeof sp[fn], "function", `Spore.${fn}`);
  }
});

test("05 Anastomose zeigt seine Handshake-Oberfläche", () => {
  const a = globalThis.SbkimAnastomose;
  for (const fn of ["init", "handshake", "receiveHandshake", "listSiblings"]) {
    assert.equal(typeof a[fn], "function", `Anastomose.${fn}`);
  }
});

// ---- 04 Match: reine Offline-Logik, voll bewiesen --------------------------

test("04 Match: spiegelt die Sage-Schwellen (PROVIDER 0.8 / SCHICHT 0.6)", () => {
  assert.equal(globalThis.SbkimMatch.PROVIDER_MIN_MATCH, 0.8);
  assert.equal(globalThis.SbkimMatch.SCHICHT_MIN_MATCH, 0.6);
});

test("04 Match: identische Vektoren -> 1, orthogonale -> 0", () => {
  const a = new Float32Array(384); a[0] = 1;
  const b = new Float32Array(384); b[0] = 1;
  const c = new Float32Array(384); c[1] = 1;
  assert.equal(globalThis.SbkimMatch.match(a, b), 1);
  assert.equal(globalThis.SbkimMatch.match(a, c), 0);
});

test("04 Match: Provider-Schwelle trennt korrekt bei 0.8", () => {
  assert.equal(globalThis.SbkimMatch.isAboveProviderThreshold(0.9), true);
  assert.equal(globalThis.SbkimMatch.isAboveProviderThreshold(0.8), true);
  assert.equal(globalThis.SbkimMatch.isAboveProviderThreshold(0.79), false);
});

test("04 Match: matchDimensions liefert drei orthogonale Schichten", () => {
  const cap = new Float32Array(384); cap[0] = 1;
  const needs = new Float32Array(384); needs[0] = 1;
  const r = globalThis.SbkimMatch.matchDimensions(cap, needs, cap, needs);
  assert.ok(r && typeof r === "object", "Ergebnis-Objekt");
  for (const lane of ["fachlich", "prozess", "skalierung"]) {
    assert.ok(lane in r, `Schicht ${lane} vorhanden`);
  }
});

// ---- weitere reife Module: Laden + Oberfläche (Sage 1:1) -------------------

test("06 Heterokaryose zeigt seine Geschwister-Austausch-Oberfläche", () => {
  const h = globalThis.SbkimHeterokaryose;
  for (const fn of ["init", "requestHeterokaryosis", "receiveHeterokaryosis", "listHeterokaryosis"]) {
    assert.equal(typeof h[fn], "function", `Heterokaryose.${fn}`);
  }
});

test("07 Apoptose zeigt seine Selbstlöschung-+-Vermächtnis-Oberfläche", () => {
  const a = globalThis.SbkimApoptose;
  for (const fn of ["init", "prepareSelfApoptose", "confirmSelfApoptose", "receiveLegacy", "listLegacy"]) {
    assert.equal(typeof a[fn], "function", `Apoptose.${fn}`);
  }
});

test("08 UI-Demo zeigt seine Outbox-Pflege-Oberfläche", () => {
  const u = globalThis.SbkimUiDemo;
  for (const fn of ["init", "listOutbox", "addOutboxAnchor", "removeOutboxAnchor", "setSiblingHeteroOptIn"]) {
    assert.equal(typeof u[fn], "function", `UiDemo.${fn}`);
  }
});

test("15 Membran zeigt seine Read-API (Außenhülle)", () => {
  const m = globalThis.SbkimMembrane;
  assert.equal(typeof m.init, "function", "Membran.init");
  assert.equal(typeof m.read, "function", "Membran.read");
});

test("16 Siegel: Selbst-Bezeugungs-Oberfläche + Aspekte-Liste (offline)", () => {
  const s = globalThis.SbkimSiegel;
  for (const fn of ["init", "isCertified", "getExplanation", "getCertifiedModules", "getAspects"]) {
    assert.equal(typeof s[fn], "function", `Siegel.${fn}`);
  }
  // getAspects ist eine reine Lese-Funktion -> offline prüfbar
  const aspects = s.getAspects();
  assert.ok(Array.isArray(aspects), "getAspects liefert eine Liste");
});
