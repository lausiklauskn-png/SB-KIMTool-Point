// 02_spore.js — Module 02 (Spore): node identity.
//
// Reuses the PROTOCOL LOGIC of the Sage Spore module, adapted headless:
// real Ed25519 + SHA-256 via node:crypto (no browser, no WebCrypto shim).
// The public Spore JSON mirrors the shape of Sage's sbkim/spore.json.

import {
  generateKeyPairSync,
  createPublicKey,
  sign as nodeSign,
  verify as nodeVerify,
  createHash,
} from "node:crypto";
import { PROTOCOL_VERSION } from "./00_config.js";

const toBuf = (data) => (Buffer.isBuffer(data) ? data : Buffer.from(data));

/** Derive a stable node id from the DER-encoded public key. */
function deriveNodeId(publicKeyDer) {
  return createHash("sha256").update(publicKeyDer).digest("base64url");
}

function publicKeyFromDer(der) {
  return createPublicKey({ key: der, type: "spki", format: "der" });
}

/**
 * A Spore is a node's cryptographic identity. Create one per node.
 * Holds the private key in memory; exposes only the public Spore JSON.
 */
export class Spore {
  constructor({ label = "node" } = {}) {
    const { publicKey, privateKey } = generateKeyPairSync("ed25519");
    this._privateKey = privateKey;
    this._publicKeyDer = publicKey.export({ type: "spki", format: "der" });
    this.nodeId = deriveNodeId(this._publicKeyDer);
    this.label = label;
    this.createdAt = "2026-05-29"; // session date; deterministic for the model
  }

  /** Sign arbitrary data, returns a base64url signature. */
  sign(data) {
    return nodeSign(null, toBuf(data), this._privateKey).toString("base64url");
  }

  /** Public, shareable identity document — same shape family as sbkim/spore.json. */
  toJSON() {
    return {
      protocolVersion: PROTOCOL_VERSION,
      nodeId: this.nodeId,
      label: this.label,
      publicKey: this._publicKeyDer.toString("base64url"),
      createdAt: this.createdAt,
    };
  }

  /** Short, human-readable id (Sage-style truncation, e.g. "BSWxXmXvxF8F…"). */
  shortId() {
    return this.nodeId.slice(0, 12) + "…";
  }
}

/**
 * Verify a signature against a public Spore JSON document.
 * Stateless on purpose — any node can verify any other node's claim.
 */
export function verifyWith(spJson, data, signatureB64) {
  const der = Buffer.from(spJson.publicKey, "base64url");
  const keyObject = publicKeyFromDer(der);
  return nodeVerify(
    null,
    toBuf(data),
    keyObject,
    Buffer.from(signatureB64, "base64url"),
  );
}
