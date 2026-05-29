// loop.js — orchestrates the 3-role loop plus Sybil nodes.
//
// This is the headless MODEL (not an oracle): it plays through the still-dormant
// Sage immune logic (modules 10/12/14/07) so the result can be carried back into
// the live protocol. It prints a human-readable report AND writes a recorded run
// to web/data/run.json, which the static page later plays back as an animated
// board. The PROOF of correctness is the smoke test; the page only makes it visible.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Bauer } from "./roles/bauer.js";
import { GateArzt } from "./roles/gate_arzt.js";
import { Beobachter } from "./roles/beobachter.js";
import { SybilNode } from "./nodes/sybil.js";
import { SiegelRegistry } from "./16_siegel.js";
import { Reputation } from "./10_reputation.js";
import { apoptose } from "./07_apoptose.js";
import { PROTOCOL_VERSION } from "./00_config.js";

/**
 * Run the model once.
 * @param {object} [opts]
 * @param {number} [opts.rounds]       build rounds for honest builders
 * @param {() => number} [opts.rng]    injectable RNG for deterministic runs/tests
 * @param {number} [opts.honestCount]  number of honest builder nodes
 * @param {number} [opts.sybilCount]   number of Sybil nodes
 */
export function runModel({ rounds = 3, rng = Math.random, honestCount = 3, sybilCount = 2 } = {}) {
  const siegel = new SiegelRegistry();
  const reputation = new Reputation(siegel);
  const gate = new GateArzt(siegel);
  const beobachter = new Beobachter();

  const honest = Array.from({ length: honestCount }, (_, i) =>
    new Bauer({ label: `bauer-${i + 1}`, rng }),
  );
  const sybils = Array.from({ length: sybilCount }, (_, i) =>
    new SybilNode({ label: `sybil-${i + 1}`, identities: 5 }),
  );

  const events = [];

  // --- Phase 1: honest builders work the loop, earning deeds -----------------
  for (let r = 0; r < rounds; r++) {
    for (const bauer of honest) {
      const artefact = bauer.build();
      const result = gate.inspect(artefact);
      const event = {
        phase: "build",
        round: r,
        builder: bauer.label,
        builderId: bauer.spore.shortId(),
        artefactId: artefact.manifest.id,
        verdict: result.verdict,
        repaired: result.repaired,
        reason: result.reason,
      };
      events.push(event);
      beobachter.record(event);
    }
  }

  // --- Phase 2: Sybil flood. Forged artefacts are rejected; legitimate,
  //     deed-holding builders sign distrust against the Sybil's primary id. ---
  const legitimatePopulation = honest.filter((b) => siegel.hasDeed(b.spore.nodeId)).length;

  for (const sybil of sybils) {
    const garbage = sybil.flood();
    for (const artefact of garbage) {
      const result = gate.inspect(artefact);
      events.push({
        phase: "sybil",
        node: sybil.label,
        builderId: artefact.builderSpore.shortId(),
        artefactId: artefact.manifest.id,
        verdict: result.verdict,
        reason: result.reason,
      });
    }

    // legitimate builders observe the garbage and cast signed distrust
    const accusedId = sybil.primary.spore.nodeId;
    for (const bauer of honest) {
      reputation.recordDistrust(accusedId, bauer.spore);
    }
    const state = reputation.isFlagged(accusedId, legitimatePopulation);
    beobachter.recordDistrustState(accusedId, state);

    const sybilWeight = reputation.weight(accusedId);
    const event = {
      phase: "verdict",
      node: sybil.label,
      nodeId: sybil.primary.spore.shortId(),
      votingWeight: sybilWeight, // 0 by design: no witnessed build deed
      distrust: `${state.votes}/${state.need}`,
      flagged: state.flagged,
    };

    if (state.flagged) {
      // module 12 blocklist -> module 07 apoptose, diffused (module 14)
      const legacy = apoptose(sybil.primary.spore, {
        reason: "collective-distrust",
        accusedBy: "quorum(reputation@0.15)",
        detail: `${sybil.label}: keine bezeugte Bau-Tat, nur geflschte Artefakte.`,
      });
      event.apoptose = { reason: legacy.reason, signed: !!legacy.signature };
    }
    events.push(event);
    beobachter.record(event);
  }

  return {
    protocolVersion: PROTOCOL_VERSION,
    recordedAt: "2026-05-29",
    note: "Aufgezeichneter Modell-Lauf (headless). Die Seite spielt dies ab, fuehrt es NICHT live aus.",
    summary: {
      graduated: events.filter((e) => e.phase === "build" && e.verdict === "taugt").length,
      sybilNodes: sybils.length,
      sybilFlagged: events.filter((e) => e.phase === "verdict" && e.flagged).length,
      blocklist: [...reputation.blocklist].map((id) => id.slice(0, 12) + "…"),
    },
    edgeCases: beobachter.edgeCases,
    events,
  };
}

function printReport(run) {
  const s = run.summary;
  console.log("\n=== SB-KIMTool-Point — Modell-Lauf ===");
  console.log(`Protokoll v${run.protocolVersion} · ${run.recordedAt}`);
  console.log(`\nGraduierte Artefakte (WIRD GETESTET): ${s.graduated}`);
  console.log(`Sybil-Knoten: ${s.sybilNodes} · davon geflaggt: ${s.sybilFlagged}`);
  console.log(`Blocklist (Modul 12): ${s.blocklist.length ? s.blocklist.join(", ") : "—"}`);

  console.log("\n-- Sybil-Ausgang --");
  for (const e of run.events.filter((e) => e.phase === "verdict")) {
    const tail = e.flagged
      ? `GEFLAGGT → Apoptose (${e.apoptose?.reason})`
      : "unter Schwelle";
    console.log(`  ${e.node} (${e.nodeId}) · Stimmgewicht ${e.votingWeight} · Misstrauen ${e.distrust} · ${tail}`);
  }

  if (run.edgeCases.length) {
    console.log("\n-- Grenzfaelle fuer Klaus (Meta-Schicht) --");
    for (const c of run.edgeCases) console.log(`  [${c.kind}] ${c.note}`);
  }
  console.log("");
}

// Run when invoked directly (npm run demo).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const run = runModel();
  printReport(run);

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outPath = join(__dirname, "..", "web", "data", "run.json");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(run, null, 2));
  console.log(`Aufgezeichneter Lauf geschrieben: web/data/run.json`);
}
