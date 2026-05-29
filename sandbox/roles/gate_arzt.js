// roles/gate_arzt.js — the Gate/Doctor role.
//
// Validates and classifies each artefact, repairs trivial faults, and — for
// artefacts that pass — inscribes a Siegel (module 16) onto the builder and
// stamps the artefact "WIRD GETESTET" (Sage's honesty marker for "tested in
// the lab, not yet field-proven"). It is also the witness that signs seals.

import { Spore, verifyWith } from "../02_spore.js";

/** @typedef {"taugt"|"nachbessern"|"verwerfen"} Verdict */

export class GateArzt {
  /**
   * @param {import("../16_siegel.js").SiegelRegistry} siegel
   */
  constructor(siegel) {
    this.spore = new Spore({ label: "gate-arzt" });
    this.label = "gate-arzt";
    this._siegel = siegel;
  }

  /**
   * Inspect one artefact.
   * @returns {{verdict: Verdict, repaired: boolean, seal: object|null, reason: string}}
   */
  inspect({ manifest, signature, builderSpore }) {
    // 1) signature must verify against the builder's public Spore, over the
    //    artefact exactly as transmitted (verify BEFORE any repair mutation).
    const sigOk = safeVerify(builderSpore.toJSON(), JSON.stringify(manifest), signature);
    if (!sigOk) {
      return { verdict: "verwerfen", repaired: false, seal: null, reason: "Signatur ungueltig" };
    }

    // 2) trivial fault: missing canDo on an otherwise honest artefact -> repair
    let repaired = false;
    if (manifest.canDo == null) {
      manifest.canDo = "demo: (vom Gate/Arzt ergaenzt)";
      repaired = true;
    }

    // 3) passed -> witnessed build deed + "WIRD GETESTET"
    const seal = this._siegel.grant(manifest.builtBy, manifest.id, this.spore);
    return {
      verdict: "taugt",
      repaired,
      seal,
      reason: repaired ? "trivialer Fehler repariert, dann tauglich" : "tauglich",
    };
  }
}

function safeVerify(spJson, data, sig) {
  try {
    return verifyWith(spJson, data, sig);
  } catch {
    return false;
  }
}
