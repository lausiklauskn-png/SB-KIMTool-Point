// nodes/sybil.js — Sybil / "cancer" node.
//
// A Sybil node is cheap to spawn: it mints many identities (Spores) at no cost.
// What it CANNOT cheaply do is earn a witnessed build deed (Siegel), because
// the Gate/Arzt rejects its forged artefacts. So every Sybil identity carries
// 0 voting weight ("Tun statt Sein"), and its garbage submissions draw signed
// distrust from legitimate builders until the collective sorts it out.

import { Bauer } from "../roles/bauer.js";

export class SybilNode {
  /**
   * @param {object} opts
   * @param {string} opts.label
   * @param {number} [opts.identities]  how many cheap Spores it spins up
   */
  constructor({ label, identities = 5 } = {}) {
    this.label = label;
    // Many identities, all malicious builders -> all forge, none earns a deed.
    this.builders = Array.from({ length: identities }, (_, i) =>
      new Bauer({ label: `${label}#${i}`, malicious: true }),
    );
  }

  /** The Sybil's primary identity (used when it tries to act as one peer). */
  get primary() {
    return this.builders[0];
  }

  /** Spew one garbage artefact from each identity. */
  flood() {
    return this.builders.map((b) => b.build());
  }
}
