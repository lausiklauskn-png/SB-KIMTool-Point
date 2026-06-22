// Offline-Beweis: die live-signierte Spore von Mein-Tresor (Knoten D, Momentaufnahme in
// sbkim/meintresor_inbox.json) bleibt unter UNSERER kanonischen Form ✔ VALID — und seit
// 2026-06-07 ist der echte Cross-Knoten-Match A<->D offline reproduzierbar
// (>= 0.80 -> verified-match). Manipulation faellt durch. Kein Netz (eingefrorene
// Momentaufnahme, ANDOCK §6.2). Gegenstueck zu jason_inbox.test.js / sage_inbox.test.js.

import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync } from "node:fs";
import { verifyForeignSpore } from "../scripts/verify_foreign_spore.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const inbox = JSON.parse(readFileSync(resolve(ROOT, "sbkim/meintresor_inbox.json"), "utf8"));

function loadVec(p) {
  const v = JSON.parse(readFileSync(resolve(ROOT, p), "utf8"));
  return Array.isArray(v) ? v : (v.vector || v.domainVector);
}
function cosine(a, b) {
  let d = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return d / (Math.sqrt(na) * Math.sqrt(nb));
}

test("meintresor_inbox: Spore verifiziert mit unserer kanonischen Form (✔ VALID)", () => {
  const r = verifyForeignSpore(inbox);
  assert.equal(r.valid, true, `Mein-Tresor-Spore nicht VALID: ${r.reason}`);
  assert.equal(r.checks.id, true, "nodeId != base64url(SHA256(pubkey))");
  assert.equal(r.checks.signature, true, "Signatur ungültig");
  assert.equal(r.checks.tamperRejected, true, "Manipulation nicht erkannt");
});

test("meintresor_inbox: erwartete Identität (Knoten D)", () => {
  assert.equal(inbox.nodeName, "Mein-Tresor");
  assert.equal(inbox.nodeType, "hybrid");
  assert.equal(inbox.id, "wRsGQouOYPVBOLzAB3nBteRvyvJ-AGv461WTJMKtkS0");
  assert.equal(inbox.protocolVersion, "0.1");
});

test("meintresor_inbox: echter domainVector (384-dim, L2≈1, kein _demo)", () => {
  // 2026-06-07: Mein-Tresor hat den echten Vektor ergänzt + mit gleichem Schlüssel
  // neu signiert (gleiche nodeId). Aus verified-spore wird verified-match.
  assert.ok(Array.isArray(inbox.domainVector) && inbox.domainVector.length === 384);
  assert.equal("_demo" in inbox, false);
  const l2 = Math.sqrt(inbox.domainVector.reduce((a, x) => a + x * x, 0));
  assert.ok(Math.abs(l2 - 1) < 1e-3, `domainVector nicht L2-normalisiert (L2=${l2})`);
});

test("meintresor_inbox: echter Cross-Knoten-Match A<->D >= 0.80 (verified-match)", () => {
  const mine = loadVec("sbkim/domainVector.real.json");
  const score = cosine(mine, inbox.domainVector);
  // Reproduzierbar 0.853740 (Stand 2026-06-07; gleicher Wert wie A<->C, da D Schwester
  // von Jasons-Tresor mit identischem domainVector ist). Toleranz fuer Float-Schreibweisen.
  assert.ok(score >= 0.80, `Match unter Schwelle: ${score}`);
  assert.ok(Math.abs(score - 0.853740) < 1e-4, `Match-Score abweichend: ${score}`);
});

test("meintresor_inbox: Manipulation am Inhalt wird abgelehnt", () => {
  const tampered = { ...inbox, domain: "GEFAELSCHT" };
  assert.equal(verifyForeignSpore(tampered).valid, false);
});
