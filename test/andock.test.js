// andock.test.js — Beweis: unsere Spore erfüllt Sages Schema + ist echt signiert.
// Erzeugt eine flüchtige Spore in eine Temp-Datei (überschreibt NICHT sbkim/spore.json)
// und prüft Krypto + Form gegen docs/ANDOCK.md (§2 Schema, §4 Signier-Form, §5 Demo).
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { createPublicKey, createHash, verify as edVerify } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const b64uToBuf = (s) =>
  Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4), "base64");
const canon = (v) =>
  v === null ? null
  : Array.isArray(v) ? v.map(canon)
  : typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])]))
  : v;

function makeSpore() {
  const out = resolve(tmpdir(), `spore_test_${process.pid}_${Date.now()}.json`);
  const r = spawnSync(process.execPath, [resolve(ROOT, "scripts/generate_spore.mjs")], {
    encoding: "utf8",
    env: { ...process.env, SPORE_OUT: out, SBKIM_NODE_KEY: "" }, // flüchtig
  });
  assert.equal(r.status, 0, `Generator-Fehler: ${r.stderr}`);
  const spore = JSON.parse(readFileSync(out, "utf8"));
  rmSync(out, { force: true });
  return spore;
}

test("Spore: echte Ed25519-Signatur verifiziert (ANDOCK §4)", () => {
  const sp = makeSpore();
  const { signature, ...rest } = sp;
  const pub = createPublicKey({ key: { kty: "OKP", crv: "Ed25519", x: sp.publicKey.x }, format: "jwk" });
  const bytes = Buffer.from(JSON.stringify(canon(rest)), "utf8");
  assert.equal(edVerify(null, bytes, pub, b64uToBuf(signature)), true);
});

test("Spore: nodeId == base64url(SHA256(roher Pubkey)) (ANDOCK §2)", () => {
  const sp = makeSpore();
  const raw = b64uToBuf(sp.publicKey.x);
  assert.equal(createHash("sha256").update(raw).digest("base64url"), sp.id);
  assert.equal(sp.id.length, 43);
  assert.equal(sp.signature.length, 86);
});

test("Spore: Sage-Pflichtfelder + Schema vollständig", () => {
  const sp = makeSpore();
  for (const f of ["protocolVersion", "id", "nodeName", "nodeType", "domain",
                   "endpoint", "publicKey", "domainVector", "signature",
                   "createdAt", "embeddingModel"]) {
    assert.ok(sp[f] !== undefined, `Feld fehlt: ${f}`);
  }
  assert.equal(sp.nodeType, "hybrid");
  assert.equal(sp.protocolVersion, "0.1");
  assert.ok(sp.endpoint.endsWith("/"), "endpoint braucht Schrägstrich am Ende");
  assert.equal(sp.publicKey.kty, "OKP");
  assert.equal(sp.publicKey.crv, "Ed25519");
});

test("Spore: domainVector ehrlich als Demo markiert + L2-normalisiert (ANDOCK §5)", () => {
  const sp = makeSpore();
  assert.equal(sp.domainVector.length, 384);
  assert.deepEqual(sp._demo, ["domainVector"]);
  const l2 = Math.sqrt(sp.domainVector.reduce((a, x) => a + x * x, 0));
  assert.ok(Math.abs(l2 - 1) < 1e-6, `L2=${l2}`);
});

test("Spore: Manipulation zerstört die Signatur", () => {
  const sp = makeSpore();
  const pub = createPublicKey({ key: { kty: "OKP", crv: "Ed25519", x: sp.publicKey.x }, format: "jwk" });
  const { signature, ...rest } = sp;
  rest.domain = "GEFAELSCHT";
  const bytes = Buffer.from(JSON.stringify(canon(rest)), "utf8");
  assert.equal(edVerify(null, bytes, pub, b64uToBuf(signature)), false);
});
