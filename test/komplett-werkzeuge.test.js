// komplett-werkzeuge.test.js — proof that the two complete tools (single-file
// PWAs, mirrored from Sage) are present, are real HTML, and that the catalog
// (werkzeugkiste.json) describes them with the mandatory fields + local file.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const box = JSON.parse(readFileSync(join(ROOT, "werkzeugkiste.json"), "utf8"));

const MANDATORY = ["was", "nutzen", "verwendung", "einbau", "aktiviert_durch"];

test("catalog: komplett_werkzeuge — zwei lokal gespiegelt, zwei link-first", () => {
  assert.ok(Array.isArray(box.komplett_werkzeuge), "komplett_werkzeuge is an array");
  const ids = box.komplett_werkzeuge.map((t) => t.id).sort();
  assert.deepEqual(ids, ["andock", "kimhub-werkstatt", "mycelknoten", "pinnwand"]);
});

/*
 * Der Hinweis ueber der Liste sagt, was die Liste ist. Bis zum 2026-08-21 sagte
 * er „alles von Sage, alles 1:1 gespiegelt, gegenpruefbar ueber sha256" — und
 * das stimmte schon damals fuer die Pinnwand nicht, die bewusst nur verlinkt
 * ist. Mit Kimhub stimmte auch die Herkunft nicht mehr. Ein Vorspann, der mehr
 * verspricht als die Eintraege halten, ist die stillste Sorte Unwahrheit: er
 * steht ueber allem und wird von niemandem geprueft.
 */
test("der Vorspann verspricht nicht mehr, als die Eintraege halten", () => {
  const h = box.komplett_werkzeuge_hinweis || "";
  const gespiegelt = box.komplett_werkzeuge.filter((t) => t.datei);
  const nurLink = box.komplett_werkzeuge.filter((t) => !t.datei);
  assert.ok(gespiegelt.length > 0 && nurLink.length > 0,
    "es gibt wirklich beide Gestalten — sonst misst diese Probe nichts");
  assert.ok(/nicht gespiegelt|NICHT gespiegelt/i.test(h),
    "der Vorspann nennt die nicht gespiegelte Gestalt");
  for (const t of nurLink)
    assert.ok(h.includes(t.id), `der Vorspann nennt den nur verlinkten Eintrag ${t.id}`);
  // Und er darf nicht behaupten, ALLES komme von Sage — zwei Herkuenfte stehen
  // in der Liste, und eine Kachel traegt eine fremde Adresse.
  const herkuenfte = new Set(box.komplett_werkzeuge.map((t) => t.herkunft));
  if (herkuenfte.size > 1)
    assert.ok(!/^Komplett-Werkzeuge sind [^.]*gepflegt von Sage-Protokol/.test(h),
      "der Vorspann schreibt alles Sage zu, obwohl es mehrere Herkuenfte gibt");
});

/*
 * Die Werkstatt-Kachel traegt EINE Aussage, und es ist genau die, wegen der sie
 * hier steht: das Modell im Point spielt einen aufgezeichneten Lauf ab, die
 * Werkstatt fuehrt einen echten. Faellt der Gegensatz aus dem Text, bleibt eine
 * beliebige Kachel mit einem Link uebrig.
 */
test('tool "kimhub-werkstatt": der Gegensatz aufgezeichnet/echt steht im Text', () => {
  const t = box.komplett_werkzeuge.find((x) => x.id === "kimhub-werkstatt");
  assert.ok(t, "entry exists");
  for (const f of MANDATORY) assert.ok(t[f] && t[f].length > 0, `field ${f} present`);
  const text = [t.was, t.nutzen].join(" ");
  assert.match(text, /AUFGEZEICHNET/, "das aufgezeichnete Modell wird benannt");
  assert.match(text, /ECHTEN|echte/, "der echte Lauf wird benannt");
  /* ⚠ HIER STAND: „die Kachel zeigt auf die Adresse, die es seit dem
     2026-08-21 gibt." Es gibt sie nicht mehr — ueber sie war Klaus'
     Buchhaltung oeffentlich lesbar, und er hat die Seite abgeschaltet.
     Die Kachel BLEIBT (sie traegt den Gegensatz zum Modell), aber ohne
     anklickbare Quelle. Geprueft wird jetzt genau das. */
  assert.ok(!t.quelle,
    "die Kachel zeigt wieder auf eine Adresse — die Werkstatt ist nicht oeffentlich");
  assert.match(t.point_status, /nicht oeffentlich/,
    "die Kachel sagt nicht, warum kein Knopf dasteht — ein stiller Wegfall wirft eine Frage auf");
  assert.ok(!t.datei, "kein lokaler Spiegel (mehrteilige PWA, Drift-Vermeidung)");
  assert.ok(!/Sage/.test(t.herkunft), "die Herkunft ist Kimhub, nicht Sage");
});

/*
 * Ein nur verlinkter Eintrag bekommt in app.js den Zweig OHNE Spiegel. Der
 * beschriftete den Knopf bis zum 2026-08-21 fest mit „(Sage)" — bei der
 * Kimhub-Kachel haette da eine falsche Herkunft am Knopf gestanden, und zwar
 * neben einer Kachel, die im Chip daneben „Quelle: Kimhub" sagt.
 */
test("der Live-Knopf schreibt keine feste Herkunft mehr hinein", () => {
  const app = readFileSync(join(ROOT, "assets", "app.js"), "utf8");
  const stelle = app.slice(app.indexOf("renderKomplettWerkzeuge"),
                           app.indexOf("renderMarkt"));
  assert.ok(stelle.includes("↗ Live öffnen<"),
    "der Knopf ohne Spiegel heisst schlicht „Live öffnen“");
  assert.ok(!/Live öffnen \(Sage\)/.test(stelle),
    "keine fest eingetragene Herkunft am Knopf");
});

// Pinnwand is a MULTI-file PWA — bewusst NICHT lokal gespiegelt (Drift-Vermeidung),
// sondern link-first auf die Live-Quelle. Hier andere Pflichten als bei den
// Ein-Datei-Spiegeln: Pflichtfelder + Live-Link + Herkunft, aber KEIN datei/sha256.
test('tool "pinnwand": link-first (Live-Quelle), catalog complete, no local mirror', () => {
  const t = box.komplett_werkzeuge.find((x) => x.id === "pinnwand");
  assert.ok(t, "entry exists");
  for (const f of MANDATORY) {
    assert.ok(t[f] && t[f].length > 0, `field ${f} present`);
  }
  assert.match(t.quelle, /Sage-Protokol/, "live Sage source link recorded");
  assert.ok(t.herkunft, "origin recorded");
  assert.ok(!t.datei, "no local mirror file (link-first, Drift-Vermeidung)");
});

for (const id of ["andock", "mycelknoten"]) {
  test(`tool "${id}": real single-file HTML mirrored locally, catalog complete`, () => {
    const t = box.komplett_werkzeuge.find((x) => x.id === id);
    assert.ok(t, "entry exists");

    // every mandatory explanation field is present and non-empty
    for (const f of MANDATORY) {
      assert.ok(t[f] && t[f].length > 0, `field ${f} present`);
    }
    // provenance + live link are recorded (honest "Kopie + Link")
    assert.match(t.quelle, /Sage-Protokol/, "live Sage source link recorded");
    assert.ok(t.herkunft, "origin recorded");

    // the local mirror exists and is real HTML
    const html = readFileSync(join(ROOT, t.datei), "utf8");
    assert.match(html.slice(0, 200).toLowerCase(), /<!doctype html/, "is HTML");

    // byte-compatibility guard: the recorded sha256 matches the local file
    const sum = createHash("sha256").update(html).digest("hex");
    assert.equal(sum, t.sha256, "sha256 matches the mirrored file (unmodified)");
  });
}
