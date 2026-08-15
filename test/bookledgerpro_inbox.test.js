// Offline-Beweis: die live-signierte Spore von BookLedgerPro (Momentaufnahme in
// sbkim/bookledgerpro_inbox.json) bleibt unter UNSERER kanonischen Form ✔ VALID.
// Manipulation faellt durch. Kein Netz (eingefrorene Momentaufnahme, ANDOCK §6.2).
// Gegenstueck zu meintresor_inbox.test.js / jason_inbox.test.js / sage_inbox.test.js.
//
// HOCHGESTUFT 2026-08-15: verified-spore -> verified-MATCH. BookLedgerPro hat am
// 2026-06-21 den ECHTEN domainVector angedockt (Xenova/multilingual-e5-small,
// 384-dim, L2=1) und mit demselben Schluessel neu signiert (nodeId unveraendert),
// spaeter cap/needs-Vektoren ergaenzt. Der alte Test sicherte die Ehrlichkeit
// "KEINE Match-Aussage, weil _demo" ab — diese Bedingung ist entfallen, also
// sichert er jetzt das Gegenteil: den nachgerechneten Score.

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

function loadVec(p) {
  const v = JSON.parse(readFileSync(resolve(ROOT, p), "utf8"));
  return Array.isArray(v) ? v : (v.vector || v.domainVector);
}
function cosine(a, b) {
  let d = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return d / (Math.sqrt(na) * Math.sqrt(nb));
}

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
  // Identitaetstreue ueber die Neu-Signatur hinweg: gleiche nodeId wie 2026-06-19,
  // obwohl Vektor + Signatur seitdem gewechselt haben.
});

test("bookledgerpro_inbox: echter domainVector (384-dim, L2≈1, kein _demo mehr)", () => {
  assert.ok(Array.isArray(inbox.domainVector) && inbox.domainVector.length === 384);
  assert.equal("_demo" in inbox, false, "_demo-Markierung ist entfallen (echtes Embedding)");
  assert.equal(inbox.embeddingModel, "Xenova/multilingual-e5-small");
  const l2 = Math.sqrt(inbox.domainVector.reduce((a, x) => a + x * x, 0));
  assert.ok(Math.abs(l2 - 1) < 1e-3, `domainVector nicht L2-normalisiert (L2=${l2})`);
});

test("bookledgerpro_inbox: Drei-Schichten-Spore (cap/needs beidseitig bereit)", () => {
  // Ergaenzt nach dem echten Vektor: BookLedgerPro traegt zusaetzlich Faehigkeits-
  // und Bedarfs-Vektoren. Fuer die Einstufung nicht noetig, aber Teil der Spore.
  assert.ok(Array.isArray(inbox.capVector) && inbox.capVector.length === 384);
  assert.ok(Array.isArray(inbox.needsVector) && inbox.needsVector.length === 384);
});

test("bookledgerpro_inbox: echter Cross-Knoten-Match A<->BookLedgerPro >= 0.80 (verified-match)", () => {
  const mine = loadVec("sbkim/domainVector.real.json");
  const score = cosine(mine, inbox.domainVector);
  // Reproduzierbar 0.828033 gegen unsere v0.2-Spore (Stand 2026-08-15).
  // Die Verschluesselungs-/Tresor-Achse, die der Vermerk 2026-06-19 nur als
  // Hypothese fuehrte, ist damit gemessen bestaetigt.
  assert.ok(score >= 0.80, `Match unter Schwelle: ${score}`);
  assert.ok(Math.abs(score - 0.828033) < 1e-4, `Match-Score abweichend: ${score}`);
});

test("bookledgerpro_inbox: Manipulation am Inhalt wird abgelehnt", () => {
  const tampered = { ...inbox, domain: "GEFAELSCHT" };
  assert.equal(verifyForeignSpore(tampered).valid, false);
});
