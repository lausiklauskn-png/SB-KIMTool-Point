// match.test.js — Beweis: echter semantischer Cross-Knoten-Match Sage ⟷ SB·KIMTool·Point.
// Reproduziert den Score offline aus zwei echten, L2-normalisierten domainVectors:
//   - unser echter Vektor: sbkim/domainVector.real.json (Modul 03, von Sage geliefert)
//   - Sages echter Vektor: sbkim/sage_inbox.json (verifizierte Spore-Momentaufnahme)
// Cosine-Similarity = Skalarprodukt (beide L2-normalisiert). Erwartet ≈ 0.8618 ≥ 0.80
// (Stand 2026-07-14 nach v0.2-Neu-Signatur mit voller Domänen-Beschreibung; vorher 0.8485).
import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const load = (p) => JSON.parse(readFileSync(resolve(ROOT, p), "utf8"));

const ours = load("sbkim/domainVector.real.json");
const sage = load("sbkim/sage_inbox.json").domainVector;

const l2 = (v) => Math.sqrt(v.reduce((a, x) => a + x * x, 0));
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);

test("Match: beide Vektoren sind echte 384-dim, L2-normalisiert", () => {
  assert.equal(ours.length, 384);
  assert.equal(sage.length, 384);
  assert.ok(Math.abs(l2(ours) - 1) < 1e-3, `unser L2=${l2(ours)}`);
  assert.ok(Math.abs(l2(sage) - 1) < 1e-3, `Sage L2=${l2(sage)}`);
});

test("Match: Cross-Knoten-Score ≥ 0.80 (echter semantischer Match, ~0.8618)", () => {
  const score = dot(ours, sage);
  assert.ok(score >= 0.80, `Score ${score} < 0.80 — kein Match`);
  assert.ok(Math.abs(score - 0.8618) < 0.01, `Score ${score} weicht stark von erwartet 0.8618 ab`);
});
