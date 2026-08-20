/*
 * Die Modell-Seite verlinkt seit dem 2026-08-20 eine ECHTE Werkstatt. Damit wird
 * ihr ehrlicher Satz wichtig: sie spielt einen aufgezeichneten Lauf ab, sie
 * fuehrt nichts live aus. Faellt der Satz weg, waehrend der Link stehen bleibt,
 * liest sich die Seite wie ein Betriebsmonitor — und niemand merkt es.
 *
 * Bis hierher hat diese Datei ueberhaupt keine Probe beruehrt.
 */
// Dieses Repo faehrt ES-Module ("type": "module" in package.json) — deshalb
// import statt require und import.meta.url statt __dirname.
import test from "node:test";
import assert from "node:assert";
import { readFileSync } from "node:fs";

const seite = readFileSync(new URL("../modell.html", import.meta.url), "utf8");

test("die Seite sagt weiterhin, dass sie nichts live ausfuehrt", () => {
  assert.ok(seite.includes("nicht live"), "der Satz „nicht live“ fehlt");
  assert.ok(/aufgezeichnet/i.test(seite), "das Wort „aufgezeichnet“ fehlt");
});

test("und sie verweist auf die echte Werkstatt", () => {
  assert.ok(seite.includes("https://github.com/lausiklauskn-png/Kimhub"),
    "der Link zur Werkstatt fehlt");
});

test("der Link verspricht keine Live-Anzeige", () => {
  // Waere hier eine Live-Anzeige behauptet, muesste es sie auch geben. Gibt es
  // nicht — der Puls uebers Relais kommt erst, wenn wirklich Schichten laufen.
  const naheDemLink = seite.split("Kimhub");
  assert.ok(naheDemLink.length > 1);
  assert.ok(!/live\s*(anzeige|ansicht|verfolgen|zuschauen)/i.test(seite),
    "die Seite behauptet eine Live-Anzeige, die es nicht gibt");
});
