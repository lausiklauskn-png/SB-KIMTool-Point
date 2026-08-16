// kopien_drift.test.js — die kopierten Module sind genagelt.
//
// WARUM ES DIESEN WÄCHTER GIBT (2026-08-14). „Kopieren, nicht klonen" ist die
// erste Disziplin dieses Repos (CLAUDE.md § Disziplin): die Module kommen aus
// Sage-Protokol und werden hier NICHT abgewandelt. Das stand bisher nur als
// Versprechen da — ohne Prüfung.
//
// Was daraus wurde: `sbkim-rendezvous-ui.js` hing rund 780 Zeilen hinter dem
// Kanon, und niemand hat es bemerkt, bis jemand von Hand nachgesehen hat.
// Dasselbe war in vier weiteren Repos so. Bei diesem Repo wiegt es am
// schwersten: Kim-Bell und Mein-WorkFloh nennen ausdrücklich
// „SB-KIMTool-Point/web/tools/*" als Quelle ihrer eigenen Kopien — ein Drift
// hier wandert also weiter.
//
// WAS DIESER TEST KANN UND WAS NICHT. Der Kanon liegt in einem ANDEREN Repo
// und ist hier nicht lesbar. Geprüft wird deshalb, dass die Dateien seit
// dieser Nagelung UNVERÄNDERT sind — eine Änderung an der Kopie fällt sofort
// auf. Ob eine Kopie noch dem Kanon ENTSPRICHT, kann nur ein Abgleich gegen
// Sage sagen; `kanon: false` ist deshalb KEIN Freibrief, sondern eine offene
// Aufgabe mit Begründung.
//
// Stand 2026-08-15: alle Sage-Module stehen auf dem Kanon. Die sechs
// Abweichungen vom Vortag (match, membran, siegel, spore, storage,
// such-widget) sind nachgezogen — jede war reines Hinterherhinken, keine
// trug Point-eigene Logik. Offen bleibt nur `noble-secp256k1.js`, und das
// ist gar kein Sage-Modul (Fremd-Bibliothek, dort unter anderem Pfad).
//
// Lauf: node --test test/kopien_drift.test.js

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "web", "tools");

// sha = die ersten 16 Zeichen von sha256 der Datei.
// kanon = true  -> am 2026-08-14 byte-1:1 mit Sage-Protokol/src/modules/<gegenstueck>
//         false -> weicht ab; der Grund steht daneben.
const KOPIEN = [
  { datei: "noble-secp256k1.js", sha: "8f3879ca422c4fdf", kanon: false,
    grund: "Fremd-Bibliothek, kein Sage-Modul — liegt dort unter anderem Pfad" },
  { datei: "sbkim-anastomose.js", sha: "255ac79aeb3b0203", kanon: true },
  { datei: "sbkim-apoptose.js", sha: "0acdd6ab2d95e131", kanon: true },
  { datei: "sbkim-embedding.js", sha: "e4bb8bd6a237914e", kanon: true },
  { datei: "sbkim-floating-widget.js", sha: "dd3e0d7fb5963904", kanon: true },
  { datei: "sbkim-heterokaryose.js", sha: "9b2224af8ff13bfb", kanon: true },
  { datei: "sbkim-match.js", sha: "5de95923c3f62f14", kanon: true },
  { datei: "sbkim-membran.js", sha: "f88b5d04bc089192", kanon: true },
  { datei: "sbkim-nostr-relay.js", sha: "030aa2d260149f56", kanon: true },
  { datei: "sbkim-rendezvous-ui.js", sha: "b496bc86b5b23ce0", kanon: true },
  { datei: "sbkim-rendezvous.js", sha: "3caa0bb1fbe7bf52", kanon: true },
  { datei: "sbkim-safe.js", sha: "e7e25c9070e93f82", kanon: true },
  { datei: "sbkim-siegel.js", sha: "95003d2088921ef4", kanon: true },
  { datei: "sbkim-spore.js", sha: "6789fe6e903ad2e5", kanon: true },
  { datei: "sbkim-storage.js", sha: "5a5a4bf64dfcc107", kanon: true },
  { datei: "sbkim-such-widget.js", sha: "45f42a54e224a2c4", kanon: true },
  { datei: "sbkim-tool-pwa.js", sha: "dcba8e6ee67081f9", kanon: true },
  { datei: "sbkim-ui-demo.js", sha: "b75f3ce227ca495f", kanon: true },
];

test("Drift-Guard: jede Kopie in web/tools haelt ihren aufgezeichneten sha256", () => {
  for (const k of KOPIEN) {
    const sum = createHash("sha256").update(readFileSync(join(DIR, k.datei))).digest("hex").slice(0, 16);
    assert.equal(sum, k.sha,
      `Kopie unveraendert: ${k.datei}${k.kanon ? "" : "  [weicht vom Kanon ab: " + k.grund + "]"}`);
  }
});

test("Drift-Guard: keine ungenagelte .js-Datei in web/tools", () => {
  // Der Teil, der den Waechter am Leben haelt: eine NEU dazugelegte Kopie muss
  // auffallen, sonst waechst der Ordner still an der Nagelung vorbei.
  const gefunden = readdirSync(DIR).filter((f) => f.endsWith(".js")).sort();
  const bekannt = KOPIEN.map((k) => k.datei).sort();
  assert.deepEqual(gefunden, bekannt,
    "web/tools enthaelt genau die genagelten Dateien (keine fehlt, keine zusaetzlich)");
});

test("Drift-Guard: die offenen Abweichungen bleiben benannt", () => {
  // Ein `kanon: false` ohne Begruendung waere eine stille Duldung. Wer eine
  // Abweichung eintraegt, sagt auch, was daran offen ist.
  for (const k of KOPIEN) {
    if (k.kanon === false) {
      assert.ok(typeof k.grund === "string" && k.grund.length > 10,
        `Abweichung ohne Begruendung: ${k.datei}`);
    }
  }
});
