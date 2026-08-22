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
/*
 * ⚠ SEIT DEM 2026-08-22 SIND ES ZWEI ADRESSEN, NICHT EINE.
 *
 * Der Kommentar oben sagte: „Die App-Adresse bleibt erlaubt — sie ist der Weg,
 * den Klaus ausdruecklich offen haben will." Das galt, solange die Seite lief.
 * Ueber sie war seine BUCHHALTUNG oeffentlich lesbar: GitHub liefert eine
 * gebaute Pages-Seite weiter aus, auch wenn das Depot privat steht. Er hat sie
 * abgeschaltet.
 *
 * Und der allgemeine Satz von damals gilt genauso: stellt Klaus etwas ab, ist
 * das eine ANWEISUNG, keine Einstellung. Dann gehoert der Link hier heraus.
 */
const VERBOTEN = /github\.com\/lausiklauskn-png\/Kimhub|lausiklauskn-png\.github\.io\/Kimhub/;

function ausgelieferte(ordner, gefunden = []) {
  for (const n of readdirSync(ordner)) {
    if (UEBERSPRINGEN.has(n)) continue;
    const p = join(ordner, n);
    if (statSync(p).isDirectory()) ausgelieferte(p, gefunden);
    else if (ENDUNGEN.test(n)) gefunden.push(p);
  }
  return gefunden;
}

test("keine ausgelieferte Datei bietet Kimhub an — weder Depot noch Seite", () => {
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

/*
 * ⚠ HIER STAND DAS GEGENTEIL: „die App-Adresse dagegen ist da — sonst waere gar
 * nichts verlinkt", und sie verlangte mindestens zwei Fundstellen. Das war
 * richtig, solange die Seite lief: ein Waechter, der nur das Depot verbietet,
 * haette sonst am Ende jede Erreichbarkeit weggeraeumt.
 *
 * Seit dem 2026-08-22 ist die Seite abgeschaltet — ueber sie war Klaus'
 * Buchhaltung oeffentlich lesbar. Die Sorge dahinter bleibt trotzdem gueltig,
 * sie dreht sich nur: ein stiller Wegfall wirft eine Frage auf, die niemand
 * mehr beantwortet. Also wird jetzt verlangt, dass die Kachel SAGT, warum kein
 * Knopf dasteht — statt einfach zu verschwinden.
 */
test("die Kachel sagt, warum kein Knopf dasteht — statt still zu verschwinden", () => {
  const box = JSON.parse(readFileSync(join(WURZEL, "werkzeugkiste.json"), "utf8"));
  const t = box.komplett_werkzeuge.find((x) => x.id === "kimhub-werkstatt");
  assert.ok(t, "die Kimhub-Kachel ist ganz verschwunden — sie traegt den Gegensatz zum Modell");
  assert.ok(!t.quelle, "die Kachel zeigt wieder auf eine Adresse");
  assert.match(t.point_status, /nicht oeffentlich/,
    "die Kachel nennt den Grund nicht");
  const seite = readFileSync(join(WURZEL, "modell.html"), "utf8");
  assert.match(seite, /nicht oeffentlich|nicht öffentlich/,
    "auch die Modell-Seite muss sagen, dass es die Werkstatt gibt, sie aber nicht offen ist");
});
