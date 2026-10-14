// Sage Bau 04.J (2026-10-14): Modul 04 lässt den KI-Richter ohne window.PrueferMail
// nicht laufen. Die Prüfliste (pruefer-mail.js, byte-1:1 aus dem Auslieferungsprüfer)
// steht deshalb überall, wo 04 geladen wird, DIREKT danach — auch in der gebündelten
// Ein-Datei-Seite und im Nachlade-Lader des Siegels.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const lies = (p) => readFileSync(join(ROOT, p), "utf8");

test("Prüfliste: direkt nach 04 in jeder Seite, die 04 lädt", () => {
  const seiten = [
    ["index.html", "web/tools/"], ["werkzeuge.html", "web/tools/"], ["markt.html", "web/tools/"],
    ["such-tool/index.html", "./modules/"],
  ];
  for (const [seite, pfad] of seiten) {
    const srcs = [...lies(seite).matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
    const i = srcs.findIndex((s) => /(sbkim-match|04_match)\.js$/.test(s));
    assert.ok(i >= 0, seite + ": 04 wird geladen");
    assert.equal(srcs[i + 1], pfad + "pruefer-mail.js", seite + ": die Prüfliste steht direkt nach 04");
  }
});

test("Prüfliste: der Siegel-Lader holt sie direkt nach 04", () => {
  const block = (lies("assets/sbkim-siegel.js").match(/var SCRIPTS = \[([\s\S]*?)\];/) || [, ""])[1];
  const liste = [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  assert.equal(liste[liste.indexOf("sbkim-match.js") + 1], "pruefer-mail.js", liste.join(" · "));
});

test("Prüfliste: die gebündelte Such-Seite trägt sie direkt nach 04, byte-gleich", () => {
  const html = lies("such-werkzeug.html");
  const skripte = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const liste = lies("web/tools/pruefer-mail.js"), match = lies("web/tools/sbkim-match.js");
  const i = skripte.indexOf(match);
  assert.ok(i >= 0, "04 steht unverändert in der Seite");
  assert.equal(skripte[i + 1], liste, "direkt danach steht die Prüfliste, Zeichen für Zeichen");
});

test("Prüfliste: beide Kopien sind dieselbe Datei", () => {
  const h = (p) => createHash("sha256").update(readFileSync(join(ROOT, p))).digest("hex");
  assert.equal(h("such-tool/modules/pruefer-mail.js"), h("web/tools/pruefer-mail.js"));
});
