# Bautrupp — die Rollen im Modell

Das Modell besetzt drei Rollen. Jede ist ein eigener Agent mit klarer Aufgabe.
Zusammen bilden sie die Schleife, die der statische Schicht-1-Board sichtbar macht.

## Bauer (`sandbox/roles/bauer.js`)

Erzeugt kleine Test-Artefakte (PWA-Stubs: ein `manifest` + Signatur). Der Bauer ist
**absichtlich ein unvollkommener Programmierer**: mit `BAUER_FAULT_RATE` baut er einen
**reparierbaren, semantischen Fehler** ein (ein fehlendes Feld) — das ist kein Betrug.
Ein bösartiger Bauer (Sybil) **fälscht** dagegen die Signatur; das ist immer Betrug.

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

## Labor-Modell: „WIRD GETESTET"

Alles, was die Schleife durchläuft, ist Laborzustand. Erst Klaus' Meta-Bewertung
(und später echter Feldeinsatz) hebt ein Artefakt über „WIRD GETESTET" hinaus.

## Bewusst noch nicht besetzt (spätere Scheiben)

Linguist/QA, Hindernis-Modell-Agent, Späher/Vorschau.
