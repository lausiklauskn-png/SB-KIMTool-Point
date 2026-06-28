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

test("catalog: komplett_werkzeuge lists the Sage tools (two lokal gespiegelt + Pinnwand link-first)", () => {
  assert.ok(Array.isArray(box.komplett_werkzeuge), "komplett_werkzeuge is an array");
  const ids = box.komplett_werkzeuge.map((t) => t.id).sort();
  assert.deepEqual(ids, ["andock", "mycelknoten", "pinnwand"]);
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
