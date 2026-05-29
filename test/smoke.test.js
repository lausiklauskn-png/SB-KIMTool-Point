// smoke.test.js — headless proof of the model. This is the ground truth;
// the static page only visualizes a recorded run, it does not prove anything.

import { test } from "node:test";
import assert from "node:assert/strict";

import { Spore, verifyWith } from "../sandbox/02_spore.js";
import { SiegelRegistry } from "../sandbox/16_siegel.js";
import { GateArzt } from "../sandbox/roles/gate_arzt.js";
import { Bauer } from "../sandbox/roles/bauer.js";
import { runModel } from "../sandbox/loop.js";

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
