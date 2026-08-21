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

/*
 * Der ehrliche Satz steht im EINLEITUNGS-ABSATZ, gleich unter der Ueberschrift —
 * dort, wo ihn jeder liest, bevor er die Buehne sieht.
 *
 * BEFUND 2026-08-21, in der Gegenprobe gemessen: bis hierher suchte diese Probe
 * die Zeichenkette „nicht live" in der GANZEN Seite. Sie steht dort aber
 * ZWEIMAL — einmal im ehrlichen Satz ueber das Modell, einmal weiter unten in
 * einem Satz ueber die Werkstatt („die Werkstatt zeigt sie nicht live an").
 * Nimmt man den ersten weg, bleibt der zweite stehen, und die Probe meldet
 * gruen. Sie war seit dem Tag blind, an dem der zweite Satz dazukam — dieselbe
 * alte Lehre, nur andersherum: nicht der Anker der Sabotage stand zweimal da,
 * sondern der Anker der PRUEFUNG.
 *
 * Deshalb wird jetzt der Absatz herausgeschnitten und NUR dort gesucht.
 */
const einleitung = (() => {
  const von = seite.indexOf("Schicht 1 · Modell");
  const bis = seite.indexOf('<div class="controls"');
  assert.ok(von > -1 && bis > von,
    "der Einleitungs-Abschnitt ist nicht mehr auffindbar — diese Probe misst sonst nichts");
  return seite.slice(von, bis);
})();

test("die Seite sagt weiterhin, dass sie nichts live ausfuehrt", () => {
  // Auf den SATZ verankert, nicht auf die Zeichenkette. „nicht live" steht auch
  // im naechsten Absatz („die Werkstatt zeigt sie nicht live an") — und der ist
  // im selben Ausschnitt. Wer nur die Zeichenkette sucht, misst weiter nichts,
  // auch nach dem Zuschneiden. Zwischenraum fuer Markup (<strong>) ist erlaubt.
  assert.match(einleitung, /führt das Modell[^.]{0,60}nicht live[^.]{0,20}aus/,
    "der Satz „sie führt das Modell nicht live aus“ fehlt");
  assert.ok(/aufgezeichnet/i.test(einleitung),
    "das Wort „aufgezeichnet“ fehlt im Einleitungs-Absatz");
});

test("und sie verweist auf die echte Werkstatt", () => {
  assert.ok(seite.includes("https://github.com/lausiklauskn-png/Kimhub"),
    "der Link zum Quelltext der Werkstatt fehlt");
});

/*
 * Seit dem 2026-08-21 gibt es die Werkstatt auch als SEITE, nicht nur als Depot.
 * Bis dahin stand hier zwangslaeufig nur der Quelltext-Link — die Adresse gab es
 * nicht. Jetzt gibt es sie, und ein Leser, der „echte Werkstatt" liest, will sie
 * ansehen und nicht ihren Quelltext lesen.
 *
 * Beide Kimhub-Erwaehnungen muessen sie tragen. Die zweite steht in einem
 * ZUGEKLAPPTEN Abschnitt („Warum ein Modell?") — genau die Sorte Stelle, die bei
 * einer Aenderung uebersehen wird, weil man sie beim Draufschauen gar nicht
 * sieht. Deshalb wird gezaehlt, nicht nur gesucht.
 */
test("die Seiten-Adresse steht bei JEDER Kimhub-Erwaehnung, auch der zugeklappten", () => {
  const seitenLink = /https:\/\/lausiklauskn-png\.github\.io\/Kimhub\//g;
  const treffer = (seite.match(seitenLink) || []).length;
  assert.ok(treffer >= 2,
    `die Pages-Adresse steht nur ${treffer}× da — erwartet mindestens 2 ` +
    "(oben im Absatz UND im zugeklappten „Warum ein Modell?“)");
});

test("der Link verspricht keine Live-Anzeige", () => {
  // Waere hier eine Live-Anzeige behauptet, muesste es sie auch geben. Gibt es
  // nicht — der Puls uebers Relais kommt erst, wenn wirklich Schichten laufen.
  const naheDemLink = seite.split("Kimhub");
  assert.ok(naheDemLink.length > 1);
  // BINDESTRICH ZAEHLT MIT. Bis zum 2026-08-21 stand hier `live\s*(…)` — und
  // „Live-Anzeige", die normale deutsche Schreibweise und genau die Wendung,
  // gegen die dieser Riegel gebaut ist, rutschte daran vorbei. In der
  // Gegenprobe gemessen, nicht vermutet.
  assert.ok(!/live[\s-]*(anzeige|ansicht|verfolgen|zuschauen|mitverfolgen)/i.test(seite),
    "die Seite behauptet eine Live-Anzeige, die es nicht gibt");
});
