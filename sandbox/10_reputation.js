// 10_reputation.js — Module 10 (Reputation): Sybil defense.
//
// In Sage this module is PRE-BUILT and DORMANT: it springs to life when a
// Sybil effect occurs. This file is the headless PROTOTYPE the model plays
// through, so the logic can be carried back into the live Sage module.
//
// Two intertwined defenses:
//   1) "Tun statt Sein" (entangled with module 16): voting weight = witnessed
//      build deeds. Cheap identities without deeds carry 0 weight by design.
//   2) Distrust accumulation: legitimate, deed-holding peers sign distrust
//      against a misbehaving node. Once distrust reaches REP_DISTRUST_RATIO of
//      the legitimate population, the collective flags it (-> blocklist 12 ->
//      apoptose 07, diffused via 14).

import { REP_DISTRUST_RATIO } from "./00_config.js";

export class Reputation {
  /**
   * @param {import("./16_siegel.js").SiegelRegistry} siegel
   */
  constructor(siegel) {
    this._siegel = siegel;
    /** @type {Map<string, Set<string>>} accused nodeId -> set of accuser nodeIds */
    this._distrust = new Map();
    /** @type {Set<string>} nodes the collective has flagged */
    this.blocklist = new Set();
  }

  /** Voting weight is witnessed build deeds — "Tun statt Sein". */
  weight(nodeId) {
    return this._siegel.weight(nodeId);
  }

  /**
   * Record one peer's signed distrust against a node. Only peers that
   * themselves hold a witnessed deed may vote (entanglement with module 16);
   * a Sybil cannot manufacture distrust votes it has no standing to cast.
   */
  recordDistrust(accusedId, accuserSpore) {
    if (!this._siegel.hasDeed(accuserSpore.nodeId)) return false;
    if (!this._distrust.has(accusedId)) this._distrust.set(accusedId, new Set());
    this._distrust.get(accusedId).add(accuserSpore.nodeId);
    return true;
  }

  /**
   * Evaluate whether accumulated distrust crosses the collective threshold.
   * @param {string} accusedId
   * @param {number} legitimatePopulation  count of deed-holding peers
   */
  isFlagged(accusedId, legitimatePopulation) {
    const votes = this._distrust.get(accusedId)?.size ?? 0;
    const need = Math.max(1, Math.ceil(legitimatePopulation * REP_DISTRUST_RATIO));
    const flagged = votes >= need;
    if (flagged) this.blocklist.add(accusedId); // module 12: blocklist
    return { flagged, votes, need };
  }
}
