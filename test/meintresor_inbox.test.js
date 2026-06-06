// Offline-Beweis: die live-signierte Spore von Mein-Tresor (Knoten D, Momentaufnahme in
// sbkim/meintresor_inbox.json) bleibt unter UNSERER kanonischen Form ✔ VALID — Manipulation
// faellt durch. Kein Netz (eingefrorene Momentaufnahme, ANDOCK §6.2). Gegenstueck zu
// jason_inbox.test.js / sage_inbox.test.js.

import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync } from "node:fs";
import { verifyForeignSpore } from "../scripts/verify_foreign_spore.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const inbox = JSON.parse(readFileSync(resolve(ROOT, "sbkim/meintresor_inbox.json"), "utf8"));

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

test("meintresor_inbox: noch KEIN domainVector -> nur verified-spore, kein Match behauptet", () => {
  // Ehrlich: Mein-Tresor hat den domainVector weggelassen (kein Demo-Stub).
  // verified-match folgt erst mit echtem 384-dim Vektor + Re-Sign.
  assert.equal("domainVector" in inbox, false);
});

test("meintresor_inbox: Manipulation am Inhalt wird abgelehnt", () => {
  const tampered = { ...inbox, domain: "GEFAELSCHT" };
  assert.equal(verifyForeignSpore(tampered).valid, false);
});
