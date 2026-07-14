// kanon_import.test.js — Beweis für den „Kanon-Schlüssel importieren"-Pfad
// (assets/sbkim-siegel.js): eine verschlüsselte node_key.enc.json wird im
// Browser entschlüsselt, in einen Modul-02-Backup-Umschlag (v2) gepackt und
// über den bestehenden importBackup-Pfad eingespielt — gleiche nodeId, kein
// Netz-Wechsel, ohne Modul 02 anzufassen.
//
// Dieser Test fährt die KRYPTO-KETTE + den FORMAT-VERTRAG headless durch:
//   node_key-Umschlag (echt via scripts/make_node_key.mjs)
//     → entschlüsseln (PBKDF2 600k + AES-GCM, Tag anhängen)
//     → PKCS8-PEM → DER → Ed25519-Import → JWK → nodeId ableiten
//     → Backup-Blob (v2) bauen
//     → SbkimSpore.importBackup(blob, pw, {force:true})
//     → getNodeId() == kanonische nodeId, aktiver Slot == "main".
//
// Die Konvertierungs-Logik hier spiegelt nodeKeyToBackupBlob aus
// assets/sbkim-siegel.js 1:1 (DOM-frei nicht importierbar) — geprüft wird der
// entscheidende Teil: dass der erzeugte Blob von Modul 02 akzeptiert wird und
// die RICHTIGE nodeId wiederherstellt. Die DOM-Verdrahtung (Datei-Knopf, prompt,
// fetch spore.json) bleibt „ungeprüft, wartet auf Klaus' Browser-Lauf".

import { test } from "node:test";
import assert from "node:assert/strict";
import "fake-indexeddb/auto";
import { makeNodeKeyEnvelope } from "../scripts/make_node_key.mjs";

globalThis.window = globalThis;
await import("../web/tools/sbkim-storage.js");
await import("../web/tools/sbkim-spore.js");

const subtle = globalThis.crypto.subtle;

function stdB64ToBytes(s) {
  const bin = atob(s); const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}
function b64urlToBytes(s) {
  const pad = s.length % 4 === 0 ? "" : "====".slice(s.length % 4);
  return stdB64ToBytes(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
}
function bytesToB64url(bytes) {
  const u = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = ""; for (let i = 0; i < u.length; i++) bin += String.fromCharCode(u[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function pemToDer(pem) {
  const body = pem.replace(/-----BEGIN[^-]+-----/, "").replace(/-----END[^-]+-----/, "").replace(/\s+/g, "");
  return stdB64ToBytes(body);
}
async function deriveAesGcmKey(password, salt, iterations, usages) {
  const base = await subtle.importKey("raw", new TextEncoder().encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
  return await subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    base, { name: "AES-GCM", length: 256 }, false, usages,
  );
}

// Spiegel von nodeKeyToBackupBlob (assets/sbkim-siegel.js).
async function nodeKeyToBackupBlob(envelope, password, spore) {
  const salt = stdB64ToBytes(envelope.kdf.salt);
  const iv = stdB64ToBytes(envelope.cipher.iv);
  const tag = stdB64ToBytes(envelope.cipher.tag);
  const ct = stdB64ToBytes(envelope.ciphertext);
  const iterations = envelope.kdf.iterations || 600000;
  const aesKey = await deriveAesGcmKey(password, salt, iterations, ["decrypt"]);
  const combined = new Uint8Array(ct.length + tag.length);
  combined.set(ct, 0); combined.set(tag, ct.length);
  const plainBuf = await subtle.decrypt({ name: "AES-GCM", iv }, aesKey, combined);
  const pem = atob(new TextDecoder().decode(plainBuf));
  const der = pemToDer(pem);
  const privKey = await subtle.importKey("pkcs8", der, { name: "Ed25519" }, true, ["sign"]);
  const privJwk = await subtle.exportKey("jwk", privKey);
  const pubJwk = { kty: "OKP", crv: "Ed25519", x: privJwk.x, key_ops: ["verify"], ext: true };
  const rawPub = b64urlToBytes(privJwk.x);
  const hash = await subtle.digest("SHA-256", rawPub);
  const nodeId = bytesToB64url(new Uint8Array(hash));
  if (spore && spore.id && spore.id !== nodeId) throw new Error("nodeId-Mismatch");
  const payload = {
    identities: [{
      key: "main", nodeId,
      keys: { privateKey: { kty: "OKP", crv: "Ed25519", x: privJwk.x, d: privJwk.d, key_ops: ["sign"], ext: true }, publicKey: pubJwk },
      spore, siblings: [],
    }],
    "active-identity": "main",
  };
  const bsalt = crypto.getRandomValues(new Uint8Array(16));
  const biv = crypto.getRandomValues(new Uint8Array(12));
  const bKey = await deriveAesGcmKey(password, bsalt, 600000, ["encrypt"]);
  const bct = await subtle.encrypt({ name: "AES-GCM", iv: biv }, bKey, new TextEncoder().encode(JSON.stringify(payload)));
  return {
    nodeId,
    blob: {
      version: 2,
      kdf: { salt: bytesToB64url(bsalt), iterations: 600000 },
      cipher: { algorithm: "AES-GCM-256", iv: bytesToB64url(biv) },
      ciphertext: bytesToB64url(new Uint8Array(bct)),
      "payload-schema-version": 2,
    },
  };
}

test("node_key.enc.json → importBackup stellt die kanonische nodeId wieder her", async () => {
  const PW = "geheim-test-123";
  const { nodeId: canonical, envelope } = makeNodeKeyEnvelope(PW);
  const spore = { id: canonical, nodeType: "hybrid", nodeName: "SB-KIMTool-Point", signature: "x" };

  const { blob, nodeId } = await nodeKeyToBackupBlob(envelope, PW, spore);
  assert.equal(nodeId, canonical, "abgeleitete nodeId == kanonische");

  await globalThis.SbkimStorage.init({ dbSuffix: "kanon_test" });
  const res = await globalThis.SbkimSpore.importBackup(blob, PW, { force: true });
  assert.equal(res.restored, true);

  const active = await globalThis.SbkimSpore.getActiveIdentityKey();
  assert.equal(active, "main", "aktiver Slot ist main");
  const restoredId = await globalThis.SbkimSpore.getNodeId();
  assert.equal(restoredId, canonical, "wiederhergestellte nodeId == kanonische (kein Netz-Wechsel)");
  const ids = await globalThis.SbkimSpore.listIdentities();
  assert.ok(ids.includes("main"), "main-Slot gelistet");
});

test("falsche node_key-Datei wird abgewiesen (kein stiller Erfolg)", async () => {
  await assert.rejects(
    () => nodeKeyToBackupBlob({ kdf: { salt: "AAAA", iterations: 600000 }, cipher: { iv: "AAAA", tag: "AAAA" }, ciphertext: "AAAA" }, "irgendwas", null),
    /.+/,
  );
});
