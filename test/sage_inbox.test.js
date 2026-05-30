// sage_inbox.test.js — Beweis (reziprok): Sages eingegangene Spore verifiziert
// gegen UNSERE kanonische Signier-Form (docs/ANDOCK §4). Offline gegen die
// committete Momentaufnahme sbkim/sage_inbox.json — kein Netz, deterministisch.
// Gegenstück zu andock.test.js (unsere eigene Spore).
import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync } from "node:fs";
import { verifyForeignSpore } from "../scripts/verify_foreign_spore.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const inbox = JSON.parse(readFileSync(resolve(ROOT, "sbkim/sage_inbox.json"), "utf8"));

test("sage_inbox: Sages Spore verifiziert mit unserer kanonischen Form (✔ VALID)", () => {
  const r = verifyForeignSpore(inbox);
  assert.equal(r.valid, true, `Sage-Spore nicht VALID: ${r.reason}`);
  assert.equal(r.checks.id, true, "nodeId != SHA256(pubkey)");
  assert.equal(r.checks.signature, true, "Signatur ungültig");
  assert.equal(r.checks.tamperRejected, true, "Manipulation nicht erkannt");
});

test("sage_inbox: erwartete Sage-Identität (nodeId + Domäne)", () => {
  assert.equal(inbox.nodeName, "Sage");
  assert.equal(inbox.nodeType, "hybrid");
  assert.equal(inbox.id, "nysOZE3VuKqZA23i5G2XL67s41JIIykI58zXMtJkYfA");
  assert.equal(inbox.protocolVersion, "0.1");
});

test("sage_inbox: Manipulation am Inhalt wird abgelehnt", () => {
  const tampered = { ...inbox, domain: "GEFAELSCHT" };
  assert.equal(verifyForeignSpore(tampered).valid, false);
});
