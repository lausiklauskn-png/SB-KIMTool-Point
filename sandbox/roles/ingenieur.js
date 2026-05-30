// roles/ingenieur.js — the Engineer role (idea-giver).
//
// The Ingenieur sits at the FRONT of the build chain: it proposes the objects
// that are worth building for SBKIM — above all tools for end users. It judges
// nothing and builds nothing; it hands a titled, described idea to the Bauer.
//
// Chain:  Ingenieur (idea) -> Bauer (builds) -> Gate/Arzt (tests/repairs)
//         -> Beobachter (records), with the Negativbauer/Sybil as adversary.
//
// Two clearly distinct kinds of object (more are allowed):
//   - "hintergrund-tool"  runs invisibly in the protocol (e.g. rate-limit).
//   - "standalone-pwa"    usable on its own AND embeddable in other PWAs.
// (further kinds: "tool", "webseite")
//
// Ideas are picked deterministically (in order), so the recorded model run is
// reproducible regardless of the RNG used elsewhere.

/** Curated pool of ideas the Engineer cycles through. Order is stable. */
export const INGENIEUR_IDEAS = Object.freeze([
  {
    kind: "standalone-pwa",
    title: "Timer-Kachel",
    description:
      "Kleiner Countdown als Kachel — eigenstaendig nutzbar und in andere PWAs " +
      "(z. B. das Rezeptbuch) einbettbar.",
  },
  {
    kind: "hintergrund-tool",
    title: "Rate-Limit-Bremse",
    description:
      "Drosselt Anfragen pro Knoten unsichtbar im Protokoll und schuetzt so vor Fluten.",
  },
  {
    kind: "standalone-pwa",
    title: "Mix-Rechner",
    description:
      "Rechnet Mischungsverhaeltnisse aus — als Kachel auch ins Mixarium einsetzbar.",
  },
  {
    kind: "hintergrund-tool",
    title: "Diffusions-Bote",
    description:
      "Verbreitet signierte Vermaechtnisse an Nachbarknoten (Modul 14), unsichtbar im Hintergrund.",
  },
  {
    kind: "standalone-pwa",
    title: "Notiz-Splitter",
    description:
      "Teilt lange Notizen in handliche Karten — offline, ohne Server.",
  },
  {
    kind: "tool",
    title: "QR-Andock-Karte",
    description:
      "Erzeugt einen QR-Code zum Andocken eines Live-Endknotens am Marktplatz.",
  },
  {
    kind: "hintergrund-tool",
    title: "Blocklist-Spiegel",
    description:
      "Haelt geflaggte Knoten (Modul 12) lokal aktuell, damit Nachbarn sie meiden.",
  },
  {
    kind: "standalone-pwa",
    title: "Einkaufs-Liste",
    description:
      "Offline-Liste mit Haken — eigenstaendig und ins Rezeptbuch einbettbar.",
  },
  {
    kind: "webseite",
    title: "Andock-Schaufenster",
    description:
      "Statische Uebersicht der Live-Endknoten zum Stoebern und Andocken.",
  },
]);

export class Ingenieur {
  /**
   * @param {object} [opts]
   * @param {ReadonlyArray<{kind:string,title:string,description:string}>} [opts.ideas]
   */
  constructor({ ideas = INGENIEUR_IDEAS } = {}) {
    this.label = "ingenieur";
    this._ideas = ideas;
    this._i = 0;
  }

  /** Propose the next idea (deterministic, cycles through the pool). */
  propose() {
    const idea = this._ideas[this._i % this._ideas.length];
    this._i++;
    return { ...idea };
  }
}
