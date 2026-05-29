// roles/beobachter.js — the Observer role.
//
// The Beobachter does not judge; it records. It logs every outcome of the loop
// and surfaces tipping/edge cases (the "Meta-Schicht") for Klaus to weigh in on
// — e.g. an artefact that only passed because the Gate had to repair it, or a
// node that sits just under the distrust threshold.

export class Beobachter {
  constructor() {
    this.label = "beobachter";
    this.log = [];
    this.edgeCases = [];
  }

  /** Record one inspected artefact and flag edge cases for human review. */
  record(event) {
    this.log.push(event);
    if (event.verdict === "taugt" && event.repaired) {
      this.edgeCases.push({
        kind: "repariert-dann-tauglich",
        artefactId: event.artefactId,
        note: "Nur nach Reparatur tauglich — Grenzfall fuer Meta-Bewertung.",
      });
    }
  }

  /** Record a near-miss on the collective distrust threshold. */
  recordDistrustState(nodeId, { votes, need }) {
    if (votes > 0 && votes < need) {
      this.edgeCases.push({
        kind: "knapp-unter-schwelle",
        nodeId,
        note: `Misstrauen ${votes}/${need} — noch nicht geflaggt.`,
      });
    }
  }
}
