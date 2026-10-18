// manifest_id.test.js — jede App braucht ihre EIGENE Manifest-id.
//
// WARUM ES DIESEN WÄCHTER GIBT (Klaus 2026-10-18, gemessen am Tablet über
// chrome://webapks). Chrome löst die `id` gegen den URSPRUNG der start_url auf,
// nicht gegen den App-Ordner. Alle Apps liegen auf
// https://lausiklauskn-png.github.io/<Repo>/ — `"id": "./"` wird damit für JEDE
// App zu `https://lausiklauskn-png.github.io/`. Chrome hält verschiedene Apps
// dann für eine: das Menü sagt „Diese App wurde bereits installiert", und beim
// Öffnen steht „App konnte nicht geöffnet werden". chrome://webapks zeigte zehn
// installierte Apps mit genau dieser id. Der Installieren-Knopf in der Seite
// ging trotzdem (eine andere Prüfung) — deshalb fiel es so lange nicht auf.
//
// Geprüft wird die RECHNUNG, nicht der Wortlaut: die id, wie Chrome sie bildet,
// muss im scope des eigenen Manifests liegen, und zwei Manifeste dieses Repos
// dürfen nicht dieselbe id ergeben.
//
// Nicht geprüft: Manifeste als data:-URI (such-werkzeug.html,
// jasons-bibliothek/index.html) — sie tragen keine id, und ihre start_url
// hängt an der Adresse der Seite, nicht an einer Datei.
//
// Lauf: node --test test/manifest_id.test.js

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASIS = "https://lausiklauskn-png.github.io/SB-KIMTool-Point/";

// Pfad im Depot → Adresse, unter der das Manifest ausgeliefert wird.
const MANIFESTE = ["manifest.webmanifest", "such-tool/manifest.json"];

// Wie Chrome (Web App Manifest, „process the id member"): gegen den Ursprung
// der start_url, ohne Fragment.
export function chromeId(id, startUrl, manifestUrl) {
  const start = new URL(startUrl, manifestUrl);
  const u = new URL(id === undefined || id === "" ? start.href : id, start.origin);
  u.hash = "";
  return u.href;
}

export function imScope(id, startUrl, scope, manifestUrl) {
  const start = new URL(startUrl, manifestUrl);
  const sc = new URL(scope, start).href;
  return chromeId(id, startUrl, manifestUrl).startsWith(sc);
}

test("die Rechnung selbst: \"./\" wird zum Ursprung, nicht zum App-Ordner", () => {
  const m = BASIS + "such-tool/manifest.json";
  assert.equal(chromeId("./", "./", m), "https://lausiklauskn-png.github.io/");
  assert.equal(chromeId("/SB-KIMTool-Point/such-tool/", "./", m),
    "https://lausiklauskn-png.github.io/SB-KIMTool-Point/such-tool/");
  assert.equal(chromeId(undefined, "./index.html?x=1", m),
    "https://lausiklauskn-png.github.io/SB-KIMTool-Point/such-tool/index.html?x=1");
  assert.equal(imScope("./", "./", "./", m), false);
  assert.equal(imScope("/SB-KIMTool-Point/such-tool/", "./", "./", m), true);
  // die Wurzel-App liegt NICHT im scope des Such-Werkzeugs
  assert.equal(imScope("/SB-KIMTool-Point/", "./", "./", m), false);
});

const ids = new Map();
for (const pfad of MANIFESTE) {
  test("Manifest-id liegt im eigenen scope: " + pfad, () => {
    const man = JSON.parse(readFileSync(join(ROOT, pfad), "utf8"));
    const url = BASIS + pfad;
    const id = chromeId(man.id, man.start_url, url);
    assert.ok(man.id, "ohne id rechnet Chrome sie aus der start_url — hier ausdrücklich setzen");
    assert.notEqual(id, "https://lausiklauskn-png.github.io/", "die id des Ursprungs teilen sich alle Apps auf github.io");
    assert.ok(imScope(man.id, man.start_url, man.scope, url), pfad + " → " + id + " liegt nicht im scope");
    ids.set(pfad, id);
  });
}

test("keine zwei Manifeste dieses Repos ergeben dieselbe id", () => {
  assert.equal(ids.size, MANIFESTE.length, "nicht alle Manifeste gelesen");
  assert.equal(new Set(ids.values()).size, ids.size, [...ids.entries()].join(" · "));
});
