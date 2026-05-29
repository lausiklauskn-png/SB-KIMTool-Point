// roles/bauer.js — the Builder role.
//
// A Bauer produces small test artefacts (PWA stubs). It is deliberately an
// imperfect programmer: with BAUER_FAULT_RATE it ships a faulty artefact
// (missing field or broken signature) so the Gate/Arzt has real work to do.

import { Spore } from "../02_spore.js";
import { BAUER_FAULT_RATE } from "../00_config.js";

let artefactCounter = 0;

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

  /** Build one artefact. Honest builders mostly succeed; malicious ones don't. */
  build() {
    const id = `art-${++artefactCounter}`;
    const faulty = this.malicious || this._rng() < BAUER_FAULT_RATE;

    const manifest = {
      id,
      name: `${this.label}-pwa`,
      builtBy: this.spore.nodeId,
      // a valid artefact declares what it can do
      canDo: "demo: zeigt eine Kachel an",
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
