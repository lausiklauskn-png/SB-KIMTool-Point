// Offline-Beweis: die live-signierte Spore von Jasons-Tresor (Knoten C, Momentaufnahme in
// sbkim/jason_inbox.json) bleibt unter UNSERER kanonischen Form ✔ VALID — und der echte
// Cross-Knoten-Match A<->C ist offline reproduzierbar (>= 0.80 -> verified-match).
// Kein Netz (eingefrorene Momentaufnahmen). Identitätswechsel 2026-06-06:
// alte nodeId 7F_zNopF… (Demo-Schlüssel, Passwort verloren) -> neue E13GDzIp…

import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync } from "node:fs";
import { verifyForeignSpore } from "../scripts/verify_foreign_spore.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const inbox = JSON.parse(readFileSync(resolve(ROOT, "sbkim/jason_inbox.json"), "utf8"));

function loadVec(p) {
  const v = JSON.parse(readFileSync(resolve(ROOT, p), "utf8"));
  return Array.isArray(v) ? v : (v.vector || v.domainVector);
}
function cosine(a, b) {
  let d = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return d / (Math.sqrt(na) * Math.sqrt(nb));
}

test("jason_inbox: Spore verifiziert mit unserer kanonischen Form (✔ VALID)", () => {
  const r = verifyForeignSpore(inbox);
  assert.equal(r.valid, true, `Jason-Spore nicht VALID: ${r.reason}`);
  assert.equal(r.checks.id, true, "nodeId != base64url(SHA256(pubkey))");
  assert.equal(r.checks.signature, true, "Signatur ungültig");
  assert.equal(r.checks.tamperRejected, true, "Manipulation nicht erkannt");
});

test("jason_inbox: NEUE Identität nach Identitätswechsel 2026-06-06", () => {
  assert.equal(inbox.nodeName, "Jasons-Tresor");
  assert.equal(inbox.nodeType, "hybrid");
  assert.equal(inbox.id, "E13GDzIp0c7JfeZD0jVvFarNxPde8AcoP7qz7FtmdNM");
  // alte Demo-nodeId ist hinfällig:
  assert.notEqual(inbox.id, "7F_zNopFgYLPCmEFhVlRUDnQVKk3y-RHNr139Z_3hCs");
});

test("jason_inbox: echter domainVector (384-dim, L2≈1, kein _demo)", () => {
  assert.ok(Array.isArray(inbox.domainVector) && inbox.domainVector.length === 384);
  assert.equal("_demo" in inbox, false);
  const l2 = Math.sqrt(inbox.domainVector.reduce((a, x) => a + x * x, 0));
  assert.ok(Math.abs(l2 - 1) < 1e-3, `domainVector nicht L2-normalisiert (L2=${l2})`);
});

test("jason_inbox: echter Cross-Knoten-Match A<->C >= 0.80 (verified-match)", () => {
  const mine = loadVec("sbkim/domainVector.real.json");
  const score = cosine(mine, inbox.domainVector);
  // Reproduzierbar 0.853740 (Stand 2026-06-06). Toleranz fuer Float-Schreibweisen.
  assert.ok(score >= 0.80, `Match unter Schwelle: ${score}`);
  assert.ok(Math.abs(score - 0.853740) < 1e-4, `Match-Score abweichend: ${score}`);
});

test("jason_inbox: Manipulation am Inhalt wird abgelehnt", () => {
  const tampered = { ...inbox, domain: "GEFAELSCHT" };
  assert.equal(verifyForeignSpore(tampered).valid, false);
});
