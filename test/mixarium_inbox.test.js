// Offline-Beweis: die signierte Spore von Mein-Mixarium (Knoten F, Momentaufnahme in
// sbkim/mixarium_inbox.json) bleibt unter UNSERER kanonischen Form ✔ VALID — und der echte
// Cross-Knoten-Match A<->F ist offline reproduzierbar (>= 0.80 -> verified-match).
// Kein Netz (eingefrorene Momentaufnahme, ANDOCK §6.2). Gegenstueck zu den anderen *_inbox-Tests.

import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync } from "node:fs";
import { verifyForeignSpore } from "../scripts/verify_foreign_spore.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const inbox = JSON.parse(readFileSync(resolve(ROOT, "sbkim/mixarium_inbox.json"), "utf8"));

function loadVec(p) {
  const v = JSON.parse(readFileSync(resolve(ROOT, p), "utf8"));
  return Array.isArray(v) ? v : (v.vector || v.domainVector);
}
function cosine(a, b) {
  let d = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return d / (Math.sqrt(na) * Math.sqrt(nb));
}

test("mixarium_inbox: Spore verifiziert mit unserer kanonischen Form (✔ VALID)", () => {
  const r = verifyForeignSpore(inbox);
  assert.equal(r.valid, true, `Mixarium-Spore nicht VALID: ${r.reason}`);
  assert.equal(r.checks.id, true, "nodeId != base64url(SHA256(pubkey))");
  assert.equal(r.checks.signature, true, "Signatur ungültig");
  assert.equal(r.checks.tamperRejected, true, "Manipulation nicht erkannt");
});

test("mixarium_inbox: erwartete Identität (Knoten F)", () => {
  assert.equal(inbox.nodeName, "Mixarium Klaus");
  assert.equal(inbox.id, "B7Fke9CYTR1BrC3xOXzEY5q9RuRH8xxHPUuqRHV3utA");
  assert.equal(inbox.protocolVersion, "0.1");
});

test("mixarium_inbox: echter domainVector (384-dim, L2≈1)", () => {
  assert.ok(Array.isArray(inbox.domainVector) && inbox.domainVector.length === 384);
  const l2 = Math.sqrt(inbox.domainVector.reduce((a, x) => a + x * x, 0));
  assert.ok(Math.abs(l2 - 1) < 1e-3, `domainVector nicht L2-normalisiert (L2=${l2})`);
});

test("mixarium_inbox: Cross-Knoten-Cosinus A<->F jetzt UNTER 0.80 (neu eingestuft)", () => {
  const mine = loadVec("sbkim/spore.json");
  const score = cosine(mine, inbox.domainVector);
  // NEU 2026-07-14: nach Toolpoints v0.2-Neu-Signatur (volle Domänen-Beschreibung) ist
  // der Cosinus 0.767273 (< 0.80). Mixarium war vorher mit 0.802994 nur knapp über der
  // Schwelle; die ehrlichere Beschreibung trennt Werkzeug-Hub vom Getränke-Knoten sauber.
  // Mixarium stuft in seiner Folge-Sitzung reziprok neu ein (siehe SIGNAL/Postfach).
  assert.ok(score < 0.80, `Erwartet unter Schwelle, ist aber ${score}`);
  assert.ok(Math.abs(score - 0.767273) < 1e-4, `Match-Score abweichend: ${score}`);
});

test("mixarium_inbox: Manipulation am Inhalt wird abgelehnt", () => {
  const tampered = { ...inbox, domain: "GEFAELSCHT" };
  assert.equal(verifyForeignSpore(tampered).valid, false);
});
