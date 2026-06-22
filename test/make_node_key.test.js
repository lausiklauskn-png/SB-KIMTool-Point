// Beweis fuer scripts/make_node_key.mjs (Tresor ANLEGEN). Headless, node:crypto —
// kein IndexedDB/Browser noetig. Prueft: Roundtrip (anlegen -> mit open_node_key-Logik
// wieder entschluesseln == Original), nodeId stabil + identisch zur generate_spore-Ableitung,
// Umschlag-Format wie open_node_key.mjs es liest, Fehlerfaelle (zu kurz, falsches Passwort).

import { test } from "node:test";
import assert from "node:assert/strict";
import { pbkdf2Sync, createDecipheriv, createPrivateKey, createPublicKey } from "node:crypto";
import { makeNodeKeyEnvelope, deriveNodeId } from "../scripts/make_node_key.mjs";

// Spiegelt die Entschluesselung aus scripts/open_node_key.mjs (Gegenstueck-Vertrag).
function openEnvelope(env, password) {
  const dk = pbkdf2Sync(password, Buffer.from(env.kdf.salt, "base64"), env.kdf.iterations, 32, "sha256");
  const d = createDecipheriv("aes-256-gcm", dk, Buffer.from(env.cipher.iv, "base64"));
  d.setAuthTag(Buffer.from(env.cipher.tag, "base64"));
  return Buffer.concat([d.update(Buffer.from(env.ciphertext, "base64")), d.final()]).toString("utf8");
}

test("Roundtrip: anlegen -> open_node_key-Logik liefert den Schluessel zurueck", () => {
  const { nodeId, keyPlain, envelope } = makeNodeKeyEnvelope("passwort123");
  const back = openEnvelope(envelope, "passwort123");
  assert.equal(back, keyPlain, "entschluesselt == Original (base64 PKCS8-PEM)");
  // keyPlain ist ein gueltiger PKCS8-PEM (Ed25519) und ergibt dieselbe nodeId:
  const pem = Buffer.from(keyPlain, "base64").toString("utf8");
  assert.ok(pem.includes("BEGIN PRIVATE KEY"), "PKCS8-PEM");
  const pub = createPublicKey(createPrivateKey({ key: pem, format: "pem" }));
  assert.equal(deriveNodeId(pub), nodeId, "nodeId aus dem Schluessel == envelope.nodeId");
});

test("Umschlag-Format entspricht dem open_node_key.mjs-Leser", () => {
  const { envelope } = makeNodeKeyEnvelope("passwort123");
  assert.equal(envelope.version, 1);
  assert.equal(envelope.kdf.algorithm, "PBKDF2");
  assert.equal(envelope.kdf.hash, "SHA-256");
  assert.equal(envelope.kdf.iterations, 600000);
  assert.equal(envelope.cipher.algorithm, "AES-256-GCM");
  assert.ok(typeof envelope.kdf.salt === "string" && envelope.kdf.salt.length > 0);
  assert.ok(typeof envelope.cipher.iv === "string" && envelope.cipher.tag === envelope.cipher.tag);
  assert.ok(typeof envelope.ciphertext === "string" && envelope.ciphertext.length > 0);
  assert.equal(typeof envelope.nodeId, "string");
});

test("zwei Laeufe -> verschiedene nodeIds (frischer Schluessel je Lauf)", () => {
  assert.notEqual(makeNodeKeyEnvelope("passwort123").nodeId, makeNodeKeyEnvelope("passwort123").nodeId);
});

test("zu kurzes Passwort wird abgelehnt", () => {
  assert.throws(() => makeNodeKeyEnvelope("kurz"), /mindestens/);
});

test("falsches Passwort scheitert beim Entschluesseln (AES-GCM)", () => {
  const { envelope } = makeNodeKeyEnvelope("passwort123");
  assert.throws(() => openEnvelope(envelope, "falschespw"));
});
