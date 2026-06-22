// Offline-Beweis: die signierte Spore von Mein-Rezeptbuch (Knoten E, Momentaufnahme in
// sbkim/rezeptbuch_inbox.json) bleibt unter UNSERER kanonischen Form ✔ VALID — und der echte
// Cross-Knoten-Match A<->E ist offline reproduzierbar (>= 0.80 -> verified-match).
// Kein Netz (eingefrorene Momentaufnahme, ANDOCK §6.2). Gegenstueck zu den anderen *_inbox-Tests.

import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync } from "node:fs";
import { verifyForeignSpore } from "../scripts/verify_foreign_spore.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const inbox = JSON.parse(readFileSync(resolve(ROOT, "sbkim/rezeptbuch_inbox.json"), "utf8"));

function loadVec(p) {
  const v = JSON.parse(readFileSync(resolve(ROOT, p), "utf8"));
  return Array.isArray(v) ? v : (v.vector || v.domainVector);
}
function cosine(a, b) {
  let d = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return d / (Math.sqrt(na) * Math.sqrt(nb));
}

test("rezeptbuch_inbox: Spore verifiziert mit unserer kanonischen Form (✔ VALID)", () => {
  const r = verifyForeignSpore(inbox);
  assert.equal(r.valid, true, `Rezeptbuch-Spore nicht VALID: ${r.reason}`);
  assert.equal(r.checks.id, true, "nodeId != base64url(SHA256(pubkey))");
  assert.equal(r.checks.signature, true, "Signatur ungültig");
  assert.equal(r.checks.tamperRejected, true, "Manipulation nicht erkannt");
});

test("rezeptbuch_inbox: erwartete Identität (Knoten E)", () => {
  assert.equal(inbox.nodeName, "Rezeptbuch Klaus");
  assert.equal(inbox.id, "uOpUBezUVbOMsVd2C9BkHW80agnLx5tCx_nIRy2KkXg");
  assert.equal(inbox.protocolVersion, "0.1");
});

test("rezeptbuch_inbox: echter domainVector (384-dim, L2≈1)", () => {
  assert.ok(Array.isArray(inbox.domainVector) && inbox.domainVector.length === 384);
  const l2 = Math.sqrt(inbox.domainVector.reduce((a, x) => a + x * x, 0));
  assert.ok(Math.abs(l2 - 1) < 1e-3, `domainVector nicht L2-normalisiert (L2=${l2})`);
});

test("rezeptbuch_inbox: echter Cross-Knoten-Match A<->E >= 0.80 (verified-match)", () => {
  const mine = loadVec("sbkim/spore.json");
  const score = cosine(mine, inbox.domainVector);
  // Reproduzierbar 0.832019 (Stand 2026-06-07; Mein-Rezeptbuch rechnet denselben Wert).
  assert.ok(score >= 0.80, `Match unter Schwelle: ${score}`);
  assert.ok(Math.abs(score - 0.832019) < 1e-4, `Match-Score abweichend: ${score}`);
});

test("rezeptbuch_inbox: Manipulation am Inhalt wird abgelehnt", () => {
  const tampered = { ...inbox, domain: "GEFAELSCHT" };
  assert.equal(verifyForeignSpore(tampered).valid, false);
});
