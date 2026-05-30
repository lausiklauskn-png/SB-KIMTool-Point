# Bautrupp — die Rollen im Modell

Das Modell besetzt eine **Kette von Rollen**. Jede ist ein eigener Agent mit klarer
Aufgabe. Zusammen bilden sie den Ablauf, den die animierte Schicht-1-Seite
(`modell.html`) sichtbar macht:

> **Ingenieur (Idee) → Bauer (baut) → Gate/Arzt (prüft/repariert) → Beobachter
> (protokolliert)** — mit dem **Negativbauer** (Sybil) als Angreifer, der sich
> seitlich andockt und ausgeschaltet wird.

## Ingenieur (`sandbox/roles/ingenieur.js`)

Steht **am Anfang** der Kette und liefert die **Idee**: was überhaupt gebaut werden
soll. Er urteilt nicht und baut nicht — er reicht dem Bauer einen **Titel + Art +
Kurzbeschreibung** („um was handelt es sich"). Zwei klar unterscheidbare Sorten:

- **Hintergrund-Tool** (`kind: "hintergrund-tool"`) — läuft unsichtbar im Protokoll
  (z. B. Rate-Limit, Diffusion, Blocklist-Spiegel).
- **Standalone-PWA** (`kind: "standalone-pwa"`) — eigenständig nutzbar **und** in
  andere PWAs einbettbar (z. B. eine Timer-Kachel fürs Rezeptbuch).

(Weitere mögliche `kind`: `"tool"`, `"webseite"`.) Die Ideen kommen aus einem festen
Pool und werden **deterministisch** der Reihe nach vergeben, damit der aufgezeichnete
Lauf reproduzierbar ist.

## Bauer (`sandbox/roles/bauer.js`)

Baut **das, was der Ingenieur entworfen hat** (Idee → Artefakt: ein `manifest` mit
Titel/Art + Signatur). Der Bauer ist **absichtlich ein unvollkommener Programmierer**:
mit `BAUER_FAULT_RATE` baut er einen **reparierbaren, semantischen Fehler** ein (ein
fehlendes Feld) — das ist kein Betrug. Ein bösartiger Bauer (Negativbauer/Sybil)
**fälscht** dagegen die Signatur; das ist immer Betrug.

## Gate/Arzt (`sandbox/roles/gate_arzt.js`)

Prüft und klassifiziert jedes Artefakt:

- **verwerfen** — Signatur ungültig (Fälschung).
- **nachbessern / repariert** — trivialer Fehler, der Arzt ergänzt das fehlende Feld.
- **taugt** — besteht; der Arzt stempelt **„WIRD GETESTET"** und schreibt dem Erbauer
  ein **Siegel** (Modul 16) ein. Der Arzt ist der **Zeuge** und signiert das Siegel.

„WIRD GETESTET" ist Sages Ehrlichkeits-Marke: im Labor bestanden, aber **noch nicht
feldbewiesen**. Nichts wird als fertig ausgegeben, was es nicht ist.

## Beobachter (`sandbox/roles/beobachter.js`)

Urteilt nicht, **protokolliert**. Legt der Meta-Schicht (Klaus) Grenzfälle vor:
„repariert-dann-tauglich" und „knapp-unter-Schwelle". Das ist die Brücke von der
Maschine zum menschlichen Urteil.

## Negativbauer / Sybil (`sandbox/nodes/sybil.js`)

Der **Angreifer** (in Sage „Sybil"). Er ist billig zu erzeugen — viele Identitäten zum
Nulltarif —, kann sich aber **keine bezeugte Bau-Tat (Siegel) erschwindeln**, weil der
Gate/Arzt seine gefälschten Artefakte verwirft. Er schleust **getarnte Fälschungen**
ein („falsche Timer-Kachel", „untergeschobenes Update" …), damit man sieht, **wie
robust** die Prüfung ist. Sein Stimmgewicht bleibt **0** („Tun statt Sein"); gesammeltes
Misstrauen der echten Bauer flaggt ihn → Blocklist (12) → **Apoptose** (07), diffundiert
(14). In der Animation läuft das sichtbar **grün → orange → rot → Zerfall**.

## Labor-Modell: „WIRD GETESTET"

Alles, was die Kette durchläuft, ist Laborzustand. Erst Klaus' Meta-Bewertung
(und später echter Feldeinsatz) hebt ein Artefakt über „WIRD GETESTET" hinaus.

## Bewusst noch nicht besetzt (spätere Scheiben)

Linguist/QA, Hindernis-Modell-Agent, Späher/Vorschau.
