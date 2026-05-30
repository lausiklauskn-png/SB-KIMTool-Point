#!/usr/bin/env node
/*
 * SB·KIMTool·Point — Spore-Generator (v0.1, 2026)
 * Quelle: von Sage-Protokoll geliefert, geprüft, gegen unser docs/ANDOCK.md.
 * Erzeugt sbkim/spore.json, die durch Sages Verifizierer ✔ VALID läuft.
 * Vertrag: ANDOCK §2 Schema, §3 Schlüssel, §4 Signier-Form, §5 Demo-Vektor,
 * + Sages zwei Pflichtfelder (Modul 02): createdAt + embeddingModel.
 *
 * EINBAU:
 *   1. Schlüssel einmalig erzeugen + als Secret SBKIM_NODE_KEY (base64 PKCS8-PEM) ablegen.
 *   2. Lauf:  SBKIM_NODE_KEY=... node scripts/generate_spore.mjs  ->  schreibt sbkim/spore.json
 *   Ohne Secret: flüchtige Test-Identität (nodeId wechselt, klar markiert).
 *   Node >= 18. Keine npm-Abhängigkeiten.
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve, isAbsolute } from "node:path";
import { createPrivateKey, createPublicKey, generateKeyPairSync, sign as edSign, createHash } from "node:crypto";

/* ===== KONFIG — öffentliche Identität unseres Knotens (frei änderbar) ===== */
const CONFIG = {
  nodeName: "SB-KIMTool-Point",
  nodeType: "hybrid",                       // provider | seeker | hybrid
  domain: "SBKIM-Werkzeug-Point",
  domainDescription: "Werkzeugkiste + headless Modell-Lauf für das SBKIM-Protokoll.",
  domainKeywords: ["Werkzeugkiste", "SBKIM-Module", "Modell", "Markt", "Endknoten"],
  // Stamm = unser Kern-Angebot, Gast = was Forker/Gäste hier tun (Sage-Hinweis B, ANDOCK §2)
  stammCategories: ["Werkzeugkiste", "SBKIM-Module", "Headless-Modell-Lauf", "Markt-Siegel"],
  guestCategories: ["Werkzeug-Kopie", "Modul-Andock", "Spore-Verifikation"],
  endpoint: "https://lausiklauskn-png.github.io/SB-KIMTool-Point/",  // mit Schrägstrich!
  embeddingModel: "Xenova/multilingual-e5-small",
  protocolVersion: "0.1",
  // Echter 384-dim domainVector (von Sage im Browser erzeugt, Modul 03, e5 passage-Präfix).
  // Liegt versioniert daneben; fehlt er, fällt der Generator ehrlich auf den Demo-Stub zurück.
  realVectorPath: "sbkim/domainVector.real.json",
  outPath: "sbkim/spore.json",
};
/* ========================================================================= */

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
function canonicalBytes(obj) { return Buffer.from(JSON.stringify(canonicalize(obj)), "utf8"); }

function demoVector(seed) {  // deterministischer Stub, KEIN echtes Embedding (ANDOCK §5)
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  const v = new Array(384);
  for (let i = 0; i < 384; i++) { s = (1103515245 * s + 12345) >>> 0; v[i] = (s / 0xffffffff) * 2 - 1; }
  const norm = Math.sqrt(v.reduce((a, x) => a + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}

// Lädt den echten domainVector (ANDOCK §5). Rückgabe {vector, real}. Fehlt/ungültig die
// Datei, ehrlich Demo-Stub. Prüft 384 Floats + L2≈1, sonst Fehler (kein stilles Falschmaß).
async function loadDomainVector() {
  const p = resolve(process.cwd(), CONFIG.realVectorPath);
  try {
    const v = JSON.parse(await readFile(p, "utf8"));
    if (!Array.isArray(v) || v.length !== 384 || !v.every((x) => Number.isFinite(x)))
      throw new Error(`${CONFIG.realVectorPath}: erwartet 384 endliche Floats`);
    const l2 = Math.sqrt(v.reduce((a, x) => a + x * x, 0));
    if (Math.abs(l2 - 1) > 1e-3) throw new Error(`${CONFIG.realVectorPath}: nicht L2-normalisiert (L2=${l2})`);
    return { vector: v, real: true };
  } catch (e) {
    if (e.code === "ENOENT") return { vector: demoVector(CONFIG.nodeName), real: false };
    throw e;  // vorhandene, aber kaputte Datei: laut scheitern statt heimlich Demo
  }
}

function loadKeyPair() {  // ANDOCK §3
  const raw = process.env.SBKIM_NODE_KEY;
  if (raw && raw.trim()) {
    let pem = raw.trim();
    if (!pem.includes("BEGIN")) {
      const decoded = Buffer.from(pem, "base64").toString("utf8");
      pem = decoded.includes("BEGIN") ? decoded : pem;
    }
    const privateKey = createPrivateKey({ key: pem, format: "pem" });
    return { privateKey, publicKey: createPublicKey(privateKey), ephemeral: false };
  }
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  return { privateKey, publicKey, ephemeral: true };
}

async function main() {
  const { privateKey, publicKey, ephemeral } = loadKeyPair();
  const jwk = publicKey.export({ format: "jwk" });   // {kty:"OKP",crv:"Ed25519",x}
  const publicKeyJwk = { alg: "Ed25519", crv: "Ed25519", ext: true, key_ops: ["verify"], kty: "OKP", x: jwk.x };
  const rawPub = base64urlToBuf(jwk.x);
  const id = base64url(createHash("sha256").update(rawPub).digest());

  const { vector, real } = await loadDomainVector();

  const unsigned = {
    createdAt: new Date().toISOString(),          // von Sage verlangt
    domain: CONFIG.domain,
    domainDescription: CONFIG.domainDescription,
    domainKeywords: CONFIG.domainKeywords,
    domainVector: vector,                          // echt (Modul 03) oder Demo-Stub, s. loadDomainVector
    embeddingModel: CONFIG.embeddingModel,        // von Sage verlangt
    endpoint: CONFIG.endpoint,
    guestCategories: CONFIG.guestCategories,      // Sage-Hinweis B (ANDOCK §2)
    stammCategories: CONFIG.stammCategories,       // Sage-Hinweis B (ANDOCK §2)
    id,
    nodeName: CONFIG.nodeName,
    nodeType: CONFIG.nodeType,
    protocolVersion: CONFIG.protocolVersion,
    publicKey: publicKeyJwk,
  };
  // _demo nur, wenn der Vektor wirklich Stub ist — kein vorgetäuschtes Wissen, keine Falsch-Markierung.
  if (!real) unsigned._demo = ["domainVector"];

  const signature = base64url(edSign(null, canonicalBytes(unsigned), privateKey));  // ANDOCK §4
  const spore = canonicalize(unsigned);
  spore.signature = signature;

  const target = process.env.SPORE_OUT || CONFIG.outPath;  // Test-Übersteuerung
  const outPath = isAbsolute(target) ? target : resolve(process.cwd(), target);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(spore, null, 2) + "\n", "utf8");
  console.log("spore.json geschrieben:", outPath, "\n  nodeId:", id);
  console.log(real ? "  ✓ echter domainVector (Modul 03) — kein _demo." : "  ⚠ Demo-domainVector (Stub) — _demo gesetzt.");
  if (ephemeral) console.warn("  ⚠ UNGESICHERT / NUR TEST — kein SBKIM_NODE_KEY gesetzt (nodeId wechselt pro Lauf).");
  else console.log("  ✓ bleibende Identität aus SBKIM_NODE_KEY.");
}
main().catch((e) => { console.error("FEHLER:", e?.stack || e); process.exit(1); });
