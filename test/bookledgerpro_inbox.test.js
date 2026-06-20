// Offline-Beweis: die live-signierte Spore von BookLedgerPro (Momentaufnahme in
// sbkim/bookledgerpro_inbox.json) bleibt unter UNSERER kanonischen Form ✔ VALID.
// Manipulation faellt durch. Kein Netz (eingefrorene Momentaufnahme, ANDOCK §6.2).
// Gegenstueck zu meintresor_inbox.test.js / jason_inbox.test.js / sage_inbox.test.js.
//
// SONDERFALL: BookLedgerPro ist verified-SPORE, NICHT verified-match — der
// domainVector ist als `_demo` markiert (noch kein echtes Embedding). Darum
// KEINE Cross-Knoten-Match-Behauptung hier; der Test sichert genau diese
// Ehrlichkeit ab (Identitaet echt, Domaenen-Match bewusst offen).

import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync } from "node:fs";
import { verifyForeignSpore } from "../scripts/verify_foreign_spore.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const inbox = JSON.parse(
  readFileSync(resolve(ROOT, "sbkim/bookledgerpro_inbox.json"), "utf8"),
);

test("bookledgerpro_inbox: Spore verifiziert mit unserer kanonischen Form (✔ VALID)", () => {
  const r = verifyForeignSpore(inbox);
  assert.equal(r.valid, true, `BookLedgerPro-Spore nicht VALID: ${r.reason}`);
  assert.equal(r.checks.fields, true, "Pflichtfelder unvollständig");
  assert.equal(r.checks.id, true, "nodeId != base64url(SHA256(pubkey))");
  assert.equal(r.checks.signature, true, "Signatur ungültig");
  assert.equal(r.checks.tamperRejected, true, "Manipulation nicht erkannt");
});

test("bookledgerpro_inbox: erwartete Identität (Knoten BookLedgerPro)", () => {
  assert.equal(inbox.nodeName, "BookLedgerPro");
  assert.equal(inbox.nodeType, "hybrid");
  assert.equal(inbox.id, "MyHVM7PdwEtNzOXiZNxfP_RcEXiTLjLpAls1oUm5-cQ");
  assert.equal(inbox.protocolVersion, "0.1");
});

test("bookledgerpro_inbox: verified-SPORE, NICHT verified-match (domainVector ist _demo)", () => {
  // Identität ist bewiesen, aber der domainVector ist als Demo markiert -> der
  // Domänen-Match bleibt OFFEN bis zum echten Embedding. KEINE Match-Aussage.
  assert.deepEqual(inbox._demo, ["domainVector"]);
  assert.ok(Array.isArray(inbox.domainVector), "domainVector vorhanden (aber _demo)");
});

test("bookledgerpro_inbox: Manipulation am Inhalt wird abgelehnt", () => {
  const tampered = { ...inbox, domain: "GEFAELSCHT" };
  assert.equal(verifyForeignSpore(tampered).valid, false);
});
