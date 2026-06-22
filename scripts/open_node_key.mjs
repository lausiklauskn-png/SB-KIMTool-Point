#!/usr/bin/env node
/*
 * SB·KIMTool·Point — Knoten-Schlüssel-Tresor öffnen
 * Entschlüsselt sbkim/node_key.enc.json mit Klaus' Passwort und gibt den
 * SBKIM_NODE_KEY (base64 PKCS8-PEM) auf stdout aus.
 *
 * VERWENDUNG (Passwort über Umgebungsvariable, NICHT als Argument — sonst steht
 * es in der Prozessliste):
 *   SBKIM_KEY_PW='…' node scripts/open_node_key.mjs            # druckt den Schlüssel
 *   SBKIM_NODE_KEY="$(SBKIM_KEY_PW='…' node scripts/open_node_key.mjs)" \
 *     node scripts/generate_spore.mjs                          # direkt zum Re-Signieren
 *
 * Sicherheit: Das Passwort kommt NIE ins Repo. Der Tresor (AES-256-GCM, PBKDF2
 * 600k SHA-256) ist ohne Passwort wertlos. Gegenstück: erzeugt wurde er einmalig
 * aus dem frisch generierten Schlüssel (siehe docs/SCHLUESSEL.md).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { pbkdf2Sync, createDecipheriv } from "node:crypto";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pw = process.env.SBKIM_KEY_PW;
if (!pw) {
  console.error("FEHLER: Umgebungsvariable SBKIM_KEY_PW (Klaus' Passwort) fehlt.");
  process.exit(2);
}

const v = JSON.parse(readFileSync(resolve(ROOT, "sbkim/node_key.enc.json"), "utf8"));
const dk = pbkdf2Sync(pw, Buffer.from(v.kdf.salt, "base64"), v.kdf.iterations, 32, "sha256");
const d = createDecipheriv("aes-256-gcm", dk, Buffer.from(v.cipher.iv, "base64"));
d.setAuthTag(Buffer.from(v.cipher.tag, "base64"));
try {
  const keyB64 = Buffer.concat([d.update(Buffer.from(v.ciphertext, "base64")), d.final()]).toString("utf8");
  process.stdout.write(keyB64);  // base64(PKCS8-PEM) — direkt als SBKIM_NODE_KEY nutzbar
} catch {
  console.error("FEHLER: Passwort falsch oder Tresor beschädigt (Entschlüsselung abgewiesen).");
  process.exit(1);
}
