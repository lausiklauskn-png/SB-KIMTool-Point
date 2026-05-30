// nodes/sybil.js — Sybil node, in the model shown as the "Negativbauer"
// (the adversary / counter-builder).
//
// A Sybil node is cheap to spawn: it mints many identities (Spores) at no cost.
// What it CANNOT cheaply do is earn a witnessed build deed (Siegel), because
// the Gate/Arzt rejects its forged artefacts. So every Sybil identity carries
// 0 voting weight ("Tun statt Sein"), and its garbage submissions draw signed
// distrust from legitimate builders until the collective sorts it out. It slips
// in DISGUISED fakes on purpose, so one can see how robust the inspection is.

import { Bauer } from "../roles/bauer.js";

/** Disguises the Negativbauer slips its forged artefacts in under. Stable order. */
export const SYBIL_DISGUISES = Object.freeze([
  { kind: "standalone-pwa", title: "falsche Timer-Kachel",
    description: "Sieht echt aus, hat aber eine falsche Signatur." },
  { kind: "tool", title: "untergeschobenes Update",
    description: "Tarnt sich als Update, ist aber nicht signiert." },
  { kind: "standalone-pwa", title: "Schatten-Mix-Rechner",
    description: "Kopie eines echten Tools mit falschem Siegel." },
  { kind: "hintergrund-tool", title: "Schein-Blocklist",
    description: "Gibt vor, die Blocklist zu spiegeln — Signatur ungueltig." },
  { kind: "tool", title: "Phishing-Andock-Karte",
    description: "Lockt zum Andocken, hat aber keine gueltige Signatur." },
]);

export class SybilNode {
  /**
   * @param {object} opts
   * @param {string} opts.label
   * @param {number} [opts.identities]  how many cheap Spores it spins up
   * @param {ReadonlyArray<object>} [opts.disguises]
   */
  constructor({ label, identities = 5, disguises = SYBIL_DISGUISES } = {}) {
    this.label = label;
    this._disguises = disguises;
    // Many identities, all malicious builders -> all forge, none earns a deed.
    this.builders = Array.from({ length: identities }, (_, i) =>
      new Bauer({ label: `${label}#${i}`, malicious: true }),
    );
  }

  /** The Sybil's primary identity (used when it tries to act as one peer). */
  get primary() {
    return this.builders[0];
  }

  /** Spew one disguised, forged artefact from each identity. */
  flood() {
    return this.builders.map((b, i) =>
      b.build(this._disguises[i % this._disguises.length]),
    );
  }
}
