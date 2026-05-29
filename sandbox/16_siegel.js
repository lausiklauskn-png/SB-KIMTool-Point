// 16_siegel.js — Module 16 (SBKIM-Siegel): "Tun statt Sein".
//
// A Siegel is a WITNESSED build deed: the Gate/Arzt role inscribes it onto a
// node after that node shipped an artefact that passed validation. Identity
// alone ("Sein") grants nothing; only a witnessed deed ("Tun") earns standing.
// This is the entanglement point with module 10 (Reputation): voting weight
// follows Siegel count, so cheap Sybil identities without deeds carry 0 weight.

/**
 * Registry of witnessed build deeds, keyed by nodeId.
 * Kept as a plain in-memory store for the headless model.
 */
export class SiegelRegistry {
  constructor() {
    /** @type {Map<string, Array<object>>} nodeId -> list of signed seals */
    this._byNode = new Map();
  }

  /**
   * Grant a seal. The witness (Gate/Arzt) signs the deed so it is verifiable.
   * @param {string} nodeId        builder being certified
   * @param {string} artefactId    the artefact that passed
   * @param {object} witnessSpore  the Gate/Arzt Spore (signs the seal)
   */
  grant(nodeId, artefactId, witnessSpore) {
    const payload = `${nodeId}|${artefactId}|WIRD_GETESTET`;
    const seal = {
      nodeId,
      artefactId,
      status: "WIRD GETESTET",
      witnessId: witnessSpore.nodeId,
      signature: witnessSpore.sign(payload),
    };
    if (!this._byNode.has(nodeId)) this._byNode.set(nodeId, []);
    this._byNode.get(nodeId).push(seal);
    return seal;
  }

  /** How many witnessed deeds a node holds — this IS its voting weight. */
  weight(nodeId) {
    return this._byNode.get(nodeId)?.length ?? 0;
  }

  /** True once a node has at least one witnessed build deed. */
  hasDeed(nodeId) {
    return this.weight(nodeId) > 0;
  }
}
