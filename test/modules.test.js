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

test("alle fünf Module registrieren ihre API auf window", () => {
  assert.equal(typeof globalThis.SbkimStorage, "object", "01 Storage");
  assert.equal(typeof globalThis.SbkimSpore, "object", "02 Spore");
  assert.equal(typeof globalThis.SbkimEmbedding, "object", "03 Embedding");
  assert.equal(typeof globalThis.SbkimMatch, "object", "04 Match");
  assert.equal(typeof globalThis.SbkimAnastomose, "object", "05 Anastomose");
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
