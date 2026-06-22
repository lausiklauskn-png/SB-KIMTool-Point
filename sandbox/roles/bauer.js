// roles/bauer.js — the Builder role.
//
// A Bauer builds the object the Ingenieur proposed (its idea: kind + title +
// description). It is deliberately an imperfect programmer: with
// BAUER_FAULT_RATE it ships a faulty artefact (missing field) so the Gate/Arzt
// has real work to do. A malicious builder (Negativbauer/Sybil) forges the
// signature instead — that is always fraud, never a repairable fault.

import { Spore } from "../02_spore.js";
import { BAUER_FAULT_RATE } from "../00_config.js";

let artefactCounter = 0;

/** Default idea when no Ingenieur spec is supplied (keeps the role usable alone). */
const DEFAULT_SPEC = {
  kind: "tool",
  title: "Demo-Kachel",
  description: "Zeigt eine Kachel an (Modell-Demo ohne Ingenieur-Vorschlag).",
};

export class Bauer {
  /**
   * @param {object} opts
   * @param {string} opts.label
   * @param {() => number} [opts.rng]  injectable RNG for deterministic runs
   * @param {boolean} [opts.malicious] Sybil builders ship garbage on purpose
   */
  constructor({ label, rng = Math.random, malicious = false } = {}) {
    this.spore = new Spore({ label });
    this.label = label;
    this._rng = rng;
    this.malicious = malicious;
  }

  /**
   * Build one artefact from the Ingenieur's idea.
   * @param {{kind?:string,title?:string,description?:string}} [spec]
   *   the Engineer's proposal (kind/title/description). Defaults if omitted.
   */
  build(spec = DEFAULT_SPEC) {
    const id = `art-${++artefactCounter}`;
    const faulty = this.malicious || this._rng() < BAUER_FAULT_RATE;
    const { kind, title, description } = { ...DEFAULT_SPEC, ...spec };

    const manifest = {
      id,
      name: title,
      kind,
      builtBy: this.spore.nodeId,
      // a valid artefact declares what it can do (derived from the idea)
      canDo: description,
    };

    // Honest-but-imperfect fault: drop a required field (a repairable, semantic
    // fault — NOT a forgery). Done before signing so the signature stays valid.
    if (faulty && !this.malicious) delete manifest.canDo;

    // The builder signs its (final) artefact. Malicious builders forge instead,
    // so their signature never verifies regardless of content.
    const signature = this.malicious
      ? "FORGED_not_a_real_signature"
      : this.spore.sign(JSON.stringify(manifest));

    return { manifest, signature, builderSpore: this.spore };
  }
}
