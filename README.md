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
npm test       # headless Smoke-Test (Beweis) — 29 Prüfungen (Modell + Module 01–18 + Werkstatt offline+netz)
```

Keine Abhängigkeiten. Node ≥ 20 (Ed25519/SHA-256 über `node:crypto` bzw. WebCrypto,
`node --test`).

## Die drei Schichten — je eine eigene Seite

Eine Startseite (`index.html`) führt mit drei Knöpfen auf je eine eigene Seite.
Oben auf jeder Seite eine Navigationsleiste, die zwischen allen Seiten wechselt.

- **Schicht 1 · Modell** (`modell.html`) — **animierte Pipeline** der Rollen-Kette
  (Ingenieur → Bauer → Gate/Arzt → Beobachter, Negativbauer als Angreifer). Spielt
  `web/data/run.json` (Vertrag v0.2) ab: der aktive Agent leuchtet, das Artefakt wandert
  als Lichtpunkt, ein Angriff läuft sichtbar grün→orange→rot bis zur Apoptose. Klartext-
  Statusleiste + Detail-Karte mit Export. Zero-dependency, `prefers-reduced-motion`.
- **Schicht 2 · Werkzeugkiste** (`werkzeuge.html`) — Reiter Basic/Pro/Profi aus
  `werkzeugkiste.json`, jede Kachel mit Erklärung und Status. Hier wachsen einzelne Tools.
- **Schicht 3 · PWA-Markt** (`markt.html`) — Schaufenster aus `web/data/marktplatz.json`
  (Saat = echte Live-Endknoten). Suche bewusst noch nicht gebaut.

`assets/app.js` rendert Werkzeugkiste + Markt (per Element-Erkennung), die Modell-Seite
nutzt das eigene `assets/model.js` für die Animation; ein gemeinsames `assets/style.css`
trägt die Optik.

## Aufbau

```
sandbox/        # das headless Modell (reiner Node, keine Deps)
test/           # Smoke-Test (der Beweis)
docs/           # HERKUNFT, IMMUNSCHICHT, BAUTRUPP, WERKZEUGE, STUFEN, MODELL
web/data/       # run.json (aufgezeichneter Lauf), marktplatz.json, nodes.json
web/tools/      # echte SBKIM-Module, 1:1 aus Sage kopiert (01–08, 15–18 = zwölf Module)
index.html      # Startseite mit drei Knöpfen
modell.html     # Schicht 1 (Playback, kein Live-Node)
werkzeuge.html  # Schicht 2 (Werkzeugkiste)
markt.html      # Schicht 3 (PWA-Markt)
assets/         # gemeinsame Optik + app.js (an Sage angelehnt, eigene Identität)
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
