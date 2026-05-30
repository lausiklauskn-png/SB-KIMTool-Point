// spore.test.js — proves Modul 02 "Spore" logic headless against Node-WebCrypto.
// Ed25519 in WebCrypto is the real crypto here (no stub). The browser path is the
// SAME code; until Klaus has seen it run we call the browser path "ungeprueft".
//
// The distributable module is a classic UMD script (so a forker can <script src> it).
// Importing it for its side effect registers it on globalThis — exactly how the
// browser reaches it (window.SBKIMSpore).

import { test } from "node:test";
import assert from "node:assert/strict";
import "../web/tools/sbkim-spore.js";

const SBKIMSpore = globalThis.SBKIMSpore;

test("module registered itself (globalThis / window in the browser)", () => {
  assert.ok(SBKIMSpore, "SBKIMSpore is available");
  assert.equal(typeof SBKIMSpore.create, "function");
  assert.equal(typeof SBKIMSpore.verify, "function");
  assert.equal(typeof SBKIMSpore.isSupported, "function");
});

test("isSupported is honest: true here (Node has WebCrypto-Ed25519)", async () => {
  assert.equal(await SBKIMSpore.isSupported(), true);
});

test("create yields an Ed25519 identity with a SHA-256 nodeId (64 hex)", async () => {
  const spore = await SBKIMSpore.create();
  assert.equal(spore.alg, "Ed25519");
  assert.match(spore.nodeId, /^[0-9a-f]{64}$/, "nodeId is 32-byte SHA-256 hex");
  assert.match(spore.publicKey, /^[0-9a-f]{64}$/, "Ed25519 raw public key is 32 bytes hex");
});

test("nodeId is bound to the public key (nodeId == SHA-256(publicKey))", async () => {
  const spore = await SBKIMSpore.create();
  assert.equal(await SBKIMSpore.nodeId(spore.publicKey), spore.nodeId);
});

test("sign then self-verify round-trips a message", async () => {
  const spore = await SBKIMSpore.create();
  const sig = await spore.sign("hallo welt");
  assert.match(sig, /^[0-9a-f]+$/, "signature is hex");
  assert.equal(await spore.verify("hallo welt", sig), true);
});

test("a tampered message fails verification", async () => {
  const spore = await SBKIMSpore.create();
  const sig = await spore.sign("original");
  assert.equal(await spore.verify("manipuliert", sig), false);
});

test("anyone can verify with the EXPORTED public spore (no private key needed)", async () => {
  const spore = await SBKIMSpore.create();
  const pub = spore.exportPublic();
  const sig = await spore.sign("signiert");
  assert.equal(await SBKIMSpore.verify(pub, "signiert", sig), true);
  // also accepts the bare public-key hex string
  assert.equal(await SBKIMSpore.verify(pub.publicKey, "signiert", sig), true);
});

test("exportPublic leaks ONLY the public part (no private key)", async () => {
  const spore = await SBKIMSpore.create();
  const pub = spore.exportPublic();
  assert.deepEqual(Object.keys(pub).sort(), ["alg", "nodeId", "publicKey"]);
  // no field name even hints at a private/secret key
  for (const k of Object.keys(pub)) {
    assert.doesNotMatch(k, /priv|secret|geheim/i);
  }
});

test("two spores are distinct identities", async () => {
  const a = await SBKIMSpore.create();
  const b = await SBKIMSpore.create();
  assert.notEqual(a.nodeId, b.nodeId);
  // a's signature must NOT verify under b's public key
  const sig = await a.sign("x");
  assert.equal(await SBKIMSpore.verify(b.exportPublic(), "x", sig), false);
});

test("a foreign signature does not verify under our key", async () => {
  const me = await SBKIMSpore.create();
  const other = await SBKIMSpore.create();
  const foreignSig = await other.sign("nachricht");
  assert.equal(await me.verify("nachricht", foreignSig), false);
});
