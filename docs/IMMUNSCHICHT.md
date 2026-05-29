# Immunschicht — drei Schichten

Die Abwehr gegen Sybil-/Krebs-Knoten ist nicht ein einzelner Wächter, sondern
drei ineinandergreifende Schichten. Das Modell (`sandbox/`) spielt sie headless
durch; in Sage sind die zugehörigen Module **vorgebaut und schlummern bis zum Bedarf**.

## Schicht 1 — individuell („Tun statt Sein")

Identität allein („Sein") verleiht **kein** Gewicht. Erst eine **bezeugte Bau-Tat**
(ein vom Gate/Arzt signiertes **Siegel**, Modul 16) verleiht Stimmrecht.

- Datei: `sandbox/16_siegel.js`
- Wirkung: Eine Sybil kann beliebig viele Sporen erzeugen (billig), aber keine
  bezeugte Bau-Tat fälschen. Jede Sybil-Identität trägt damit **0 Stimmgewicht**.

## Schicht 2 — kollektiv (Reputation, Blocklist, Apoptose, Diffusion)

Liefert ein Knoten Müll, sammeln legitime, siegel-tragende Knoten **signiertes
Misstrauen**. Überschreitet das Misstrauen `REP_DISTRUST_RATIO` (Modell-Vorschlag
0,15) der legitimen Bevölkerung, flaggt das Kollektiv den Knoten:

1. **Reputation** (Modul 10, `sandbox/10_reputation.js`) — zählt Misstrauen, nur
   siegel-tragende Knoten dürfen abstimmen (Verschränkung mit Schicht 1).
2. **Blocklist** (Modul 12) — der geflaggte Knoten wird gemieden.
3. **Apoptose** (Modul 07, `sandbox/07_apoptose.js`) — erzwungener Selbst-Tod mit
   signiertem **Anklage-Vermächtnis**.
4. **Diffusion** (Modul 14) — das Vermächtnis verbreitet sich an die Nachbarn.

## Schicht 3 — Meta (Klaus)

Der **Beobachter** (`sandbox/roles/beobachter.js`) urteilt nicht, sondern
protokolliert und legt **Grenzfälle** vor: z. B. ein Artefakt, das nur nach
Reparatur tauglich wurde, oder ein Knoten knapp unter der Misstrauensschwelle.
Diese Kipp-Fälle entscheidet die Meta-Schicht — Klaus.

## Homöostase

Überladung ist selbst eine Krankheit: ein Knoten mit mehr als
`HOMEOSTASIS_SPORE_LIMIT` Sporen begeht Selbstmord (Apoptose, Grund `homeostasis`).
So kann sich auch ein gutartiger, aber entgleister Knoten nicht endlos aufblähen.

## Verschränkung in einem Satz

Stimmgewicht = bezeugte Bau-Taten (16) → wer kein Gewicht hat, kann weder das
Kollektiv (10) kippen noch Abwehr auslösen; wer Müll liefert, sammelt Misstrauen
bis zur Blocklist (12), Apoptose (07) und Diffusion (14).
