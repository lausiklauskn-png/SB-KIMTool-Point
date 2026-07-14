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
  assert.equal(sp.protocolVersion, "0.2");
  assert.ok(sp.endpoint.endsWith("/"), "endpoint braucht Schrägstrich am Ende");
  assert.equal(sp.publicKey.kty, "OKP");
  assert.equal(sp.publicKey.crv, "Ed25519");
});

test("Spore: stamm/guestCategories vorhanden (Sage-Hinweis B, ANDOCK §2)", () => {
  const sp = makeSpore();
  assert.ok(Array.isArray(sp.stammCategories) && sp.stammCategories.length > 0, "stammCategories fehlt");
  assert.ok(Array.isArray(sp.guestCategories) && sp.guestCategories.length > 0, "guestCategories fehlt");
  // Kategorien wandern in die signierten Bytes -> Signatur muss weiterhin gültig sein.
  const { signature, ...rest } = sp;
  const pub = createPublicKey({ key: { kty: "OKP", crv: "Ed25519", x: sp.publicKey.x }, format: "jwk" });
  assert.equal(edVerify(null, Buffer.from(JSON.stringify(canon(rest)), "utf8"), pub, b64uToBuf(signature)), true);
});

test("Spore: domainVector = echtes 384-dim-Embedding, L2-normalisiert, KEIN _demo (ANDOCK §5)", () => {
  const sp = makeSpore();
  assert.equal(sp.domainVector.length, 384);
  // Echter Vektor (Modul 03) liegt versioniert vor -> _demo darf NICHT gesetzt sein.
  assert.equal(sp._demo, undefined, "_demo darf bei echtem Vektor nicht gesetzt sein");
  const l2 = Math.sqrt(sp.domainVector.reduce((a, x) => a + x * x, 0));
  assert.ok(Math.abs(l2 - 1) < 1e-3, `L2=${l2}`);
  // Der Vektor muss exakt Sages gelieferter Datei entsprechen (reproduzierbar).
  const real = JSON.parse(readFileSync(resolve(ROOT, "sbkim/domainVector.real.json"), "utf8"));
  assert.deepEqual(sp.domainVector, real, "domainVector weicht von domainVector.real.json ab");
});

test("Spore: Manipulation zerstört die Signatur", () => {
  const sp = makeSpore();
  const pub = createPublicKey({ key: { kty: "OKP", crv: "Ed25519", x: sp.publicKey.x }, format: "jwk" });
  const { signature, ...rest } = sp;
  rest.domain = "GEFAELSCHT";
  const bytes = Buffer.from(JSON.stringify(canon(rest)), "utf8");
  assert.equal(edVerify(null, bytes, pub, b64uToBuf(signature)), false);
});

// --- A10 „Schnipsel-Mittel" (Spore v0.2) ---
import { writeFileSync } from "node:fs";

function makeSporeWithSnippets(snips) {
  const out = resolve(tmpdir(), `spore_snip_${process.pid}_${Date.now()}.json`);
  const snipPath = resolve(tmpdir(), `snips_${process.pid}_${Date.now()}.json`);
  writeFileSync(snipPath, JSON.stringify(snips));
  const r = spawnSync(process.execPath, [resolve(ROOT, "scripts/generate_spore.mjs")], {
    encoding: "utf8",
    env: { ...process.env, SPORE_OUT: out, SPORE_SNIPPETS: snipPath, SBKIM_NODE_KEY: "" },
  });
  assert.equal(r.status, 0, `Generator-Fehler: ${r.stderr}`);
  const spore = JSON.parse(readFileSync(out, "utf8"));
  rmSync(out, { force: true });
  rmSync(snipPath, { force: true });
  return spore;
}

const fakeVec = (seed) => {
  let s = 0; for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  const v = new Array(384);
  for (let i = 0; i < 384; i++) { s = (1103515245 * s + 12345) >>> 0; v[i] = (s / 0xffffffff) * 2 - 1; }
  const n = Math.sqrt(v.reduce((a, x) => a + x * x, 0)) || 1;
  return v.map((x) => x / n);
};

test("Spore v0.2: ohne Schnipsel-Datei fehlt snippetVectors (fail-soft)", () => {
  const sp = makeSpore();
  assert.equal(sp.protocolVersion, "0.2");
  assert.equal(sp.snippetVectors, undefined, "ohne Datei darf kein snippetVectors erscheinen");
});

test("Spore v0.2: snippetVectors werden angehängt + Signatur bleibt gültig", () => {
  const snips = [{ vec: fakeVec("s1"), text: "Satz eins." }, { vec: fakeVec("s2"), text: "Satz zwei." }];
  const sp = makeSporeWithSnippets(snips);
  assert.equal(sp.protocolVersion, "0.2");
  assert.ok(Array.isArray(sp.snippetVectors), "snippetVectors fehlt");
  assert.equal(sp.snippetVectors.length, 2);
  assert.equal(sp.snippetVectors[0].vec.length, 384);
  assert.equal(sp.snippetVectors[0].text, "Satz eins.");
  // Schnipsel wandern in die signierten Bytes -> Signatur muss weiterhin gültig sein.
  const pub = createPublicKey({ key: { kty: "OKP", crv: "Ed25519", x: sp.publicKey.x }, format: "jwk" });
  const { signature, ...rest } = sp;
  assert.equal(edVerify(null, Buffer.from(JSON.stringify(canon(rest)), "utf8"), pub, b64uToBuf(signature)), true);
});

test("Spore v0.2: akzeptiert {snippetVectors:[…]}-Form (embed_helper-Ausgabe)", () => {
  const sp = makeSporeWithSnippets({ snippetVectors: [{ vec: fakeVec("x"), text: "Nur einer." }] });
  assert.equal(sp.snippetVectors.length, 1);
  assert.equal(sp.snippetVectors[0].text, "Nur einer.");
});

test("Spore v0.2: harte Kürzung auf 20 Schnipsel", () => {
  const many = Array.from({ length: 25 }, (_, i) => ({ vec: fakeVec("n" + i), text: "S" + i }));
  const sp = makeSporeWithSnippets(many);
  assert.equal(sp.snippetVectors.length, 20, "muss hart auf 20 gekürzt werden");
});
