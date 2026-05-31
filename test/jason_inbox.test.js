// Offline-Beweis: die live-signierte Spore von Jasons-Tresor (Knoten C, Momentaufnahme in
// sbkim/jason_inbox.json) bleibt unter UNSERER kanonischen Form ✔ VALID — und Manipulation
// faellt durch. Kein Netz: die Momentaufnahme ist eingefroren (ANDOCK §6.2). Beweist die
// Cross-Knoten-Vertrauensmechanik A ⟷ C headless + reproduzierbar.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createHash, createPublicKey, verify as edVerify } from "node:crypto";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const inbox = JSON.parse(readFileSync(resolve(ROOT, "sbkim/jason_inbox.json"), "utf8"));

function base64url(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function base64urlToBuf(str) {
  const pad = str.length % 4 === 0 ? "" : "====".slice(str.length % 4);
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}
function canonicalize(value) {
  if (value === null) return null;
  if (Array.isArray(value)) return value.map(canonicalize);
  if (typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = canonicalize(value[k]);
    return out;
  }
  return value;
}
function canonicalBytes(obj) {
  const { signature, ...rest } = obj;
  return Buffer.from(JSON.stringify(canonicalize(rest)), "utf8");
}

test("Jason-Inbox: Momentaufnahme hat die Pflichtfelder", () => {
  for (const f of ["nodeName", "publicKey", "signature", "id"]) {
    assert.ok(inbox[f] !== undefined, "Feld fehlt: " + f);
  }
});

test("Jason-Inbox: Identitaet ist Jasons-Tresor (Knoten C)", () => {
  assert.equal(inbox.nodeName, "Jasons-Tresor");
  assert.equal(inbox.id, "7F_zNopFgYLPCmEFhVlRUDnQVKk3y-RHNr139Z_3hCs");
});

test("Jason-Inbox: Signatur gueltig unter unserer kanonischen Form", () => {
  const pub = createPublicKey({
    key: { kty: "OKP", crv: "Ed25519", x: inbox.publicKey.x },
    format: "jwk",
  });
  const ok = edVerify(null, canonicalBytes(inbox), pub, base64urlToBuf(inbox.signature));
  assert.ok(ok, "Signatur muss gueltig sein");
});

test("Jason-Inbox: nodeId == base64url(SHA256(rawPub))", () => {
  const rawPub = base64urlToBuf(inbox.publicKey.x);
  const derived = base64url(createHash("sha256").update(rawPub).digest());
  assert.equal(derived, inbox.id, "nodeId muss aus dem Public Key ableitbar sein");
});

test("Jason-Inbox: domainVector ist ehrlich Demo (_demo) — kein Match behauptet", () => {
  assert.ok(Array.isArray(inbox._demo) && inbox._demo.includes("domainVector"),
    "Knoten C ist verified-spore, nicht verified-match (echtes Embedding steht aus)");
});

test("Jason-Inbox: Manipulation faellt durch (Signatur bricht)", () => {
  const pub = createPublicKey({
    key: { kty: "OKP", crv: "Ed25519", x: inbox.publicKey.x },
    format: "jwk",
  });
  const tampered = { ...inbox, nodeName: inbox.nodeName + "_tampered" };
  assert.ok(!edVerify(null, canonicalBytes(tampered), pub, base64urlToBuf(inbox.signature)),
    "Manipulation muss die Signatur brechen");
});
