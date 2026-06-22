#!/usr/bin/env node
/*
 * SB·KIMTool·Point — Knoten-Schlüssel-Tresor ANLEGEN (Gegenstück zu open_node_key.mjs)
 *
 * WAS: Erzeugt EINMALIG einen frischen Ed25519-Knoten-Schlüssel, zeigt die stabile
 *      nodeId und legt den privaten Schlüssel VERSCHLÜSSELT als sbkim/node_key.enc.json
 *      ab (AES-256-GCM, Schlüssel via PBKDF2 600k SHA-256 aus Klaus' Passwort) — exakt
 *      das Format, das open_node_key.mjs wieder öffnet.
 *
 * SICHERHEIT (Leitplanken): Der private Schlüssel (base64 PKCS8-PEM) und das Passwort
 *      kommen NIE im Klartext ins Repo, in Commits oder auf stdout. Passwort kommt über
 *      die Umgebungsvariable SBKIM_KEY_PW (NICHT als Argument — sonst Prozessliste).
 *      Ein vorhandener Tresor wird NICHT überschrieben (Schutz der Identität), außer
 *      SBKIM_KEY_FORCE=1 ist gesetzt.
 *
 * VERWENDUNG (ein Lauf, dann ist die Identität dauerhaft):
 *   SBKIM_KEY_PW='<dein-Passwort>' node scripts/make_node_key.mjs
 *   -> schreibt sbkim/node_key.enc.json, druckt die nodeId.
 *   Danach signiert generate_spore.mjs dauerhaft:
 *   SBKIM_NODE_KEY="$(SBKIM_KEY_PW='<Passwort>' node scripts/open_node_key.mjs)" \
 *     node scripts/generate_spore.mjs
 *
 * Node >= 18. Keine npm-Abhängigkeiten. nodeId-Ableitung identisch zu generate_spore.mjs.
 */
import { writeFile, mkdir, access } from "node:fs/promises";
import { dirname, resolve, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateKeyPairSync, createPublicKey, createHash,
  pbkdf2Sync, randomBytes, createCipheriv,
} from "node:crypto";

const KDF_ITERATIONS = 600000;
const MIN_PW_LEN = 8;

function base64url(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function base64urlToBuf(str) {
  const pad = str.length % 4 === 0 ? "" : "====".slice(str.length % 4);
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

// nodeId aus einem öffentlichen Ed25519-Schlüssel — IDENTISCH zu generate_spore.mjs:
// base64url(SHA-256(roher 32-Byte-Public-Key)).
export function deriveNodeId(publicKey) {
  const jwk = publicKey.export({ format: "jwk" });          // {kty:"OKP",crv:"Ed25519",x}
  const rawPub = base64urlToBuf(jwk.x);
  return base64url(createHash("sha256").update(rawPub).digest());
}

/*
 * Erzeugt einen frischen Schlüssel + den verschlüsselten Tresor-Umschlag.
 * Reine Funktion (kein Datei-/Konsolen-Effekt) — fürs Testen.
 * Rückgabe: { nodeId, keyPlain (base64 PKCS8-PEM), envelope }.
 */
export function makeNodeKeyEnvelope(password) {
  if (typeof password !== "string" || password.length < MIN_PW_LEN) {
    throw new Error(`Passwort muss mindestens ${MIN_PW_LEN} Zeichen lang sein.`);
  }
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  const pem = privateKey.export({ type: "pkcs8", format: "pem" });
  const keyPlain = Buffer.from(pem, "utf8").toString("base64");   // == SBKIM_NODE_KEY-Wert
  const nodeId = deriveNodeId(publicKey);

  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const dk = pbkdf2Sync(password, salt, KDF_ITERATIONS, 32, "sha256");
  const cipher = createCipheriv("aes-256-gcm", dk, iv);
  const ciphertext = Buffer.concat([cipher.update(keyPlain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  const envelope = {
    version: 1,
    zweck: "Verschluesselter SBKIM_NODE_KEY (privater Knoten-Schluessel). Nur mit Klaus-Passwort zu oeffnen. Inhalt = base64(PKCS8-PEM).",
    nodeId,
    kdf: { algorithm: "PBKDF2", hash: "SHA-256", iterations: KDF_ITERATIONS, salt: salt.toString("base64") },
    cipher: { algorithm: "AES-256-GCM", iv: iv.toString("base64"), tag: tag.toString("base64") },
    ciphertext: ciphertext.toString("base64"),
  };
  return { nodeId, keyPlain, envelope };
}

async function fileExists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function main() {
  const pw = process.env.SBKIM_KEY_PW;
  if (!pw) {
    console.error("FEHLER: Umgebungsvariable SBKIM_KEY_PW (dein Passwort) fehlt.");
    console.error("        Aufruf:  SBKIM_KEY_PW='…' node scripts/make_node_key.mjs");
    process.exit(2);
  }
  const target = process.env.SBKIM_KEY_OUT || "sbkim/node_key.enc.json";
  const outPath = isAbsolute(target) ? target : resolve(process.cwd(), target);

  if (await fileExists(outPath) && process.env.SBKIM_KEY_FORCE !== "1") {
    console.error("FEHLER: " + target + " existiert bereits — NICHT ueberschrieben (Identitaetsschutz).");
    console.error("        Bewusst neu anlegen? SBKIM_KEY_FORCE=1 setzen (alte Identitaet geht verloren).");
    process.exit(3);
  }

  let result;
  try { result = makeNodeKeyEnvelope(pw); }
  catch (e) { console.error("FEHLER:", e.message); process.exit(2); }

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(result.envelope, null, 2) + "\n", "utf8");

  console.log("Tresor angelegt:", target);
  console.log("  nodeId (dauerhaft):", result.nodeId);
  console.log("  Naechste Schritte:");
  console.log("   1) Passwort sicher merken (Passwort-Manager) — es steht NIRGENDS im Repo.");
  console.log("   2) Optional als Umgebungs-Secret setzen:");
  console.log("      SBKIM_NODE_KEY=\"$(SBKIM_KEY_PW='…' node scripts/open_node_key.mjs)\"");
  console.log("   3) Spore signieren:  node scripts/generate_spore.mjs  (zeigt dieselbe nodeId)");
  // Der private Schluessel/das Passwort werden bewusst NICHT ausgegeben.
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) main().catch((e) => { console.error("FEHLER:", e?.stack || e); process.exit(1); });
