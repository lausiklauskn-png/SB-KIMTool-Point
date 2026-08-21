/*
 * keine_depot_links.test.js — diese Seite bietet keinen fremden Quelltext an.
 *
 * ANLASS (Klaus, 2026-08-21). Auf dieser oeffentlichen Seite stand ein direkter
 * Link in sein Kimhub-Depot. Sein Bild dazu:
 *
 *   „Entweder ich gebe das Geld heraus, wie man Geld an jemanden gibt, der
 *    etwas von mir haben moechte — oder ich lasse direkt ins Portemonnaie
 *    greifen, indem ich es einfach aufmache."
 *
 * Der Unterschied ist nicht Zugriff, sondern ANGEBOT. Die Werkstatt ist eine
 * Web-App; wer ihren Quelltext will, liest ihn im Browser. Ihn von hier aus
 * hinzuhalten ist etwas anderes — dann fuehrt eine oeffentliche Seite direkt
 * in ein Depot, dessen Sichtbarkeit dem Besitzer gehoert.
 *
 * WARUM DIE PROBE DIE GANZE AUSLIEFERUNG DURCHSUCHT und nicht nur modell.html:
 * der Link kann ueberall wieder auftauchen — in werkzeugkiste.json, in app.js,
 * in einer neuen Seite. Ein Waechter, der nur die eine Datei kennt, in der es
 * einmal passiert ist, faengt genau den Fall nicht, der als naechstes kommt.
 *
 * DIE APP-ADRESSE BLEIBT ERLAUBT — sie ist der Weg, den Klaus ausdruecklich
 * offen haben will (`lausiklauskn-png.github.io/Kimhub/`). Verboten ist nur
 * `github.com/lausiklauskn-png/Kimhub`.
 *
 * Und die allgemeine Fassung, fuer die naechste Sitzung: stellt Klaus ein Repo
 * privat, ist das eine ANWEISUNG, keine Einstellung. Dann gehoert sein
 * Depot-Link hier heraus — ohne Rueckfrage, ohne Auswahlliste.
 */
import test from "node:test";
import assert from "node:assert";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");
const UEBERSPRINGEN = new Set([".git", "node_modules", "test", "tests", "docs", "scripts"]);
const ENDUNGEN = /\.(html|js|mjs|cjs|json|css)$/;
const VERBOTEN = /github\.com\/lausiklauskn-png\/Kimhub/;

function ausgelieferte(ordner, gefunden = []) {
  for (const n of readdirSync(ordner)) {
    if (UEBERSPRINGEN.has(n)) continue;
    const p = join(ordner, n);
    if (statSync(p).isDirectory()) ausgelieferte(p, gefunden);
    else if (ENDUNGEN.test(n)) gefunden.push(p);
  }
  return gefunden;
}

test("keine ausgelieferte Datei bietet den Kimhub-Quelltext an", () => {
  const dateien = ausgelieferte(WURZEL);
  // Was man ueberspringt, prueft man nicht — also steht die Zahl in der Ausgabe.
  assert.ok(dateien.length > 20,
    `nur ${dateien.length} Dateien durchsucht — der Sammler greift ins Leere`);
  const treffer = dateien
    .filter((p) => VERBOTEN.test(readFileSync(p, "utf8")))
    .map((p) => relative(WURZEL, p));
  assert.deepEqual(treffer, [],
    `direkter Depot-Link in: ${treffer.join(", ")}`);
});

test("die App-Adresse dagegen ist da — sonst waere gar nichts verlinkt", () => {
  const dateien = ausgelieferte(WURZEL);
  const mitApp = dateien.filter((p) =>
    /lausiklauskn-png\.github\.io\/Kimhub\//.test(readFileSync(p, "utf8")));
  assert.ok(mitApp.length >= 2,
    "die Werkstatt ist nirgends mehr erreichbar — das waere zu viel des Guten " +
    "(erwartet: die Modell-Seite UND die Kachel in werkzeugkiste.json)");
});
