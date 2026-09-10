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
  // ⚠ BEIDE WERTE HABEN SICH AM 2026-09-10 GEAENDERT, und diese Probe hat es zu
  // Recht gemeldet — genau dafuer ist sie gebaut. Sage hat neu signiert: neue
  // Kennung (BgjXhSApoOrJ... statt nysOZE3VuKqZ...) und eine neue Bedeutungs-
  // Beschreibung. Die hier abgelegte Adresskarte stammte ausserdem noch aus der
  // Protokoll-Fassung 0.1 mit 135 Zeichen und OHNE Satz-Schnipsel; die neue ist
  // 0.2 mit 3028 Zeichen und 17 Schnipsel. Die alte Kennung steht als
  // previousNodeId daneben, damit ein Verlauf nachvollziehbar bleibt.
  assert.equal(inbox.nodeName, "Sage");
  assert.equal(inbox.nodeType, "hybrid");
  assert.equal(inbox.id, "BgjXhSApoOrJD6zFJ4uuEpAliGWPokpKn7UMWRm94PA");
  assert.equal(inbox.protocolVersion, "0.2");
});

test("sage_inbox: Manipulation am Inhalt wird abgelehnt", () => {
  const tampered = { ...inbox, domain: "GEFAELSCHT" };
  assert.equal(verifyForeignSpore(tampered).valid, false);
});
