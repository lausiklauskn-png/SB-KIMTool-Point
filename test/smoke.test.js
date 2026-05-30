// smoke.test.js — headless proof of the model. This is the ground truth;
// the static page only visualizes a recorded run, it does not prove anything.

import { test } from "node:test";
import assert from "node:assert/strict";

import { Spore, verifyWith } from "../sandbox/02_spore.js";
import { SiegelRegistry, ZERTIFIKAT_ASPEKTE } from "../sandbox/16_siegel.js";
import { GateArzt } from "../sandbox/roles/gate_arzt.js";
import { Bauer } from "../sandbox/roles/bauer.js";
import { Ingenieur } from "../sandbox/roles/ingenieur.js";
import { runModel, RUN_ROLES } from "../sandbox/loop.js";

test("Spore: signature verifies for honest data, fails when tampered", () => {
  const sp = new Spore({ label: "t" });
  const sig = sp.sign("hello");
  assert.equal(verifyWith(sp.toJSON(), "hello", sig), true);
  assert.equal(verifyWith(sp.toJSON(), "hell0", sig), false);
});

test("Gate/Arzt: honest artefact graduates and earns a Siegel", () => {
  const siegel = new SiegelRegistry();
  const gate = new GateArzt(siegel);
  // rng=()=>1 keeps the honest builder fault-free (>= BAUER_FAULT_RATE)
  const bauer = new Bauer({ label: "honest", rng: () => 1 });
  const result = gate.inspect(bauer.build());
  assert.equal(result.verdict, "taugt");
  assert.ok(siegel.hasDeed(bauer.spore.nodeId));
  assert.equal(siegel.weight(bauer.spore.nodeId), 1);
});

test("Gate/Arzt: forged Sybil artefact is rejected, no Siegel granted", () => {
  const siegel = new SiegelRegistry();
  const gate = new GateArzt(siegel);
  const sybil = new Bauer({ label: "sybil", malicious: true });
  const result = gate.inspect(sybil.build());
  assert.equal(result.verdict, "verwerfen");
  assert.equal(siegel.hasDeed(sybil.spore.nodeId), false);
});

test("Security obligation: every touched protection module has a ZERTIFIKAT_ASPEKTE entry", () => {
  assert.ok(ZERTIFIKAT_ASPEKTE.length >= 1, "log is not empty");
  for (const e of ZERTIFIKAT_ASPEKTE) {
    assert.match(e.date, /^\d{4}-\d{2}-\d{2}$/, "date is YYYY-MM-DD");
    assert.ok(e.modul && e.text, "entry names a module and a description");
  }
  // the protection modules prototyped in the model must be represented
  for (const id of ["10", "12", "07", "14"]) {
    assert.ok(ZERTIFIKAT_ASPEKTE.some((e) => e.modul === id), `module ${id} logged`);
  }
});

test('"Tun statt Sein": a node without a witnessed deed has 0 voting weight', () => {
  const run = runModel({ rng: () => 1 });
  for (const e of run.events.filter((e) => e.phase === "verdict")) {
    assert.equal(e.votingWeight, 0);
  }
});

test("Immune layer: Sybil flood crosses distrust threshold -> flagged + apoptose", () => {
  const run = runModel({ rng: () => 1 });
  assert.ok(run.summary.graduated >= 1, "at least one honest artefact graduates");
  assert.equal(run.summary.sybilFlagged, run.summary.sybilNodes, "every Sybil node is flagged");
  assert.ok(run.summary.blocklist.length >= 1, "blocklist is populated");
  const flagged = run.events.find((e) => e.phase === "verdict" && e.flagged);
  assert.ok(flagged.apoptose?.signed, "flagged Sybil leaves a signed apoptose legacy");
});

test("Ingenieur: proposes titled, described, kinded ideas (deterministic order)", () => {
  const ing = new Ingenieur();
  const a = ing.propose();
  const b = ing.propose();
  for (const idea of [a, b]) {
    assert.ok(idea.title && idea.description, "idea carries title + description");
    assert.match(idea.kind, /^(hintergrund-tool|standalone-pwa|tool|webseite)$/);
  }
  // deterministic: a fresh Engineer proposes the same first idea
  assert.deepEqual(new Ingenieur().propose(), a);
});

test("Run contract v0.2: roles, idee events and artefacts are present and consistent", () => {
  const run = runModel({ rng: () => 1 });
  assert.equal(run.protocolVersion, "0.2");
  assert.deepEqual(run.roles, RUN_ROLES);
  assert.ok(run.roles.includes("ingenieur") && run.roles.includes("negativbauer"));

  // every build is preceded by an idea for the same artefact, with full metadata
  const ideen = run.events.filter((e) => e.phase === "idee");
  assert.ok(ideen.length >= 1, "at least one idee event");
  for (const e of ideen) {
    assert.equal(e.engineer, "ingenieur");
    assert.ok(e.artefactId && e.kind && e.title && e.description, "idee is fully described");
  }

  // events carry a monotonic timeline index t for the page scheduler
  const ts = run.events.map((e) => e.t);
  assert.deepEqual(ts, [...ts].sort((x, y) => x - y), "t is monotonic");

  // artefacts array mirrors the run; graduated ones are downloadable, rejects are not
  assert.ok(run.artefacts.length >= 1, "artefacts array is populated");
  for (const a of run.artefacts) {
    assert.ok(a.id && a.kind && a.title && a.description, "artefact fully described");
    assert.match(a.status, /^(entwurf|gebaut|geprueft|graduiert|verworfen)$/);
    assert.equal(a.downloadable, a.status === "graduiert");
  }
  const graduated = run.artefacts.filter((a) => a.status === "graduiert").length;
  assert.equal(graduated, run.summary.graduated, "artefacts and summary agree");
});
