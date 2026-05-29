// 07_apoptose.js — Module 07 (Apoptose): self-deletion with signed legacy.
//
// When a node is removed (forced by the collective, or self-triggered by
// homeostasis overload), it does not vanish silently: it leaves a signed
// legacy ("Vermaechtnis"). A forced removal carries an accusation legacy so
// siblings learn WHY, and the record stays verifiable after the node is gone.

/**
 * Produce a signed legacy document for a dying node.
 * @param {import("./02_spore.js").Spore} spore  the dying node's own Spore
 * @param {object} opts
 * @param {"homeostasis"|"collective-distrust"} opts.reason
 * @param {string} [opts.accusedBy]  who/what flagged it (for forced removals)
 * @param {string} [opts.detail]     human-readable detail
 */
export function apoptose(spore, { reason, accusedBy = null, detail = "" } = {}) {
  const body = {
    type: "apoptose-legacy",
    nodeId: spore.nodeId,
    reason,
    accusedBy,
    detail,
    diedAt: "2026-05-29",
  };
  const payload = JSON.stringify(body);
  return {
    ...body,
    signature: spore.sign(payload),
  };
}
