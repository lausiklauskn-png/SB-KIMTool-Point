# SB·KIMTool·Point

Der **Tool-Point** für das SBKIM-Protokoll: eine eigenständige, neutrale Heimat, die
**zwei Dinge parallel** trägt.

1. **Werkzeugkiste** — reife Module aus dem [Sage-Protokol](https://github.com/lausiklauskn-png/Sage-Protokol)
   in drei Stufen (Basic / Pro / Profi), jede mit Klartext-Erklärung und ehrlichem
   Doppel-Status. Externe PWAs verlinken/kopieren hierher.
2. **Modell** — ein agenten-basierter, **headless** Node-Durchlauf, der Protokoll-Logik
   vorab durchspielt. Es heißt bewusst *Modell*, nicht „Orakel": wissenschaftlicher
   Bezug statt Raten. Bewährt sich etwas, wird es in die echten Tools zurückgeholt.

> Ehrlichkeit zuerst: Diese Seite ist **statisch** und **zeigt** das Modell als
> aufgezeichneten Lauf — sie führt es **nicht** live im Browser aus. Der Beweis ist
> der headless Smoke-Test (`npm test`). Siehe `status.json` für den Real-Anteil.

## Schnellstart

```bash
npm run demo   # spielt das Modell einmal durch, druckt den Bericht, schreibt web/data/run.json
npm test       # headless Smoke-Test (Beweis) — 5 Prüfungen
```

Keine Abhängigkeiten. Node ≥ 20 (Ed25519/SHA-256 über `node:crypto`, `node --test`).

## Die drei Schichten der Seite

- **Schicht 1 · Modell** — Agenten-Board (Bauer → Gate/Arzt → Beobachter), spielt
  `web/data/run.json` ab; Sybil-Knoten werden ausgegraut/apoptosiert.
- **Schicht 2 · Werkzeugkiste** — Reiter Basic/Pro/Profi aus `werkzeugkiste.json`,
  jede Kachel mit Erklärung und Status.
- **Schicht 3 · PWA-Marktplatz** — Schaufenster aus `web/data/marktplatz.json`
  (Saat = echte Live-Endknoten). Suche bewusst noch nicht gebaut.

## Aufbau

```
sandbox/        # das headless Modell (reiner Node, keine Deps)
test/           # Smoke-Test (der Beweis)
docs/           # HERKUNFT, IMMUNSCHICHT, BAUTRUPP, WERKZEUGE, STUFEN, MODELL
web/data/       # run.json (aufgezeichneter Lauf), marktplatz.json, nodes.json
index.html      # statische Drei-Schichten-Seite (Playback, kein Live-Node)
assets/         # Optik (an Sage angelehnt, eigene neutrale Identität)
status.json     # ehrlicher Real-Anteil
werkzeugkiste.json  # Quelle der Werkzeug-Kacheln
```

## Prinzipien

- **Kopieren, nicht klonen.** Reife Sage-Module kommen später Datei für Datei herüber.
  Das Modell *wiederverwendet die Logik* headless, klont keine Browser-Live-Elemente.
- **„Schablone" heißt nicht leer.** Module 10/11/12/14 sind vorgebaut und schlummern,
  bis ein Angriff sie aktiviert — wie die Membran (15).
- **Nichts vortäuschen.** Sprache: Deutsch in Doku, Englisch im Code.

Details in `docs/`.
