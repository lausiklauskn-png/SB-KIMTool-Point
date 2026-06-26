# SB·KIMTool·Point

Der **Toolpoint** für das SBKIM-Protokoll: eine eigenständige, neutrale Heimat,
die brauchbare Werkzeuge und Apps rund um ein freies, server-armes Netzwerk
bündelt. Drei klar getrennte Räume:

1. **Netzwerk** — verbinden, gratis und neutral. Ehrliches, prüfbares Versprechen
   + Andock-Wizard, um eine eigene Seite anzudocken.
2. **Werkzeuge** — fertige, benannte Angebote zum Ansehen/Herunterladen (das
   installierbare Such-Werkzeug voran) und die einzelnen Bausteine (Module aus dem
   [Sage-Protokol](https://github.com/lausiklauskn-png/Sage-Protokol), drei Stufen).
3. **Marktplatz** — Apps finden und anbieten (im Aufbau; Struktur steht).

Hinter den Kulissen läuft zusätzlich ein agenten-basiertes, **headless** *Modell*
(nicht „Orakel": wissenschaftlicher Bezug statt Raten), das Schutz-Logik vorab
durchspielt — erreichbar über `modell.html`.

> Ehrlichkeit zuerst: Diese Seite ist **statisch** und **zeigt** das Modell als
> aufgezeichneten Lauf — sie führt es **nicht** live im Browser aus. Der Beweis ist
> der headless Smoke-Test (`npm test`). Siehe `status.json` für den Real-Anteil.

## Schnellstart

```bash
npm run demo   # spielt das Modell einmal durch, druckt den Bericht, schreibt web/data/run.json
npm test       # headless Smoke-Test (Beweis) — 6 Prüfungen
```

Keine Abhängigkeiten. Node ≥ 20 (Ed25519/SHA-256 über `node:crypto`, `node --test`).

## Die drei Räume — je eine eigene Seite

Eine Startseite (`index.html`) führt mit drei Karten auf je einen Raum. Oben auf
jeder Seite eine Navigationsleiste, die zwischen allen wechselt. Sprache bewusst
sachlich/erwachsen, ohne Analogien.

- **Netzwerk** (`netzwerk.html`) — verbinden, gratis und neutral. Das ehrliche,
  dreistufige *prüfbare* Versprechen (deine Daten bleiben am Gerät / Netz-Inhalte
  Ende-zu-Ende verschlüsselt / Treffpunkt protokoll-frei und nachprüfbar) +
  eingebetteter **Andock-Wizard** (Modul 19) für eine eigene Seite.
- **Werkzeuge** (`werkzeuge.html`) — fertige Angebote (das installierbare
  **Such-Werkzeug** prominent, plus Andock-/Knoten-Werkzeug als Vorlage) und das
  Bausteine-Grid (Basic/Pro/Profi aus `werkzeugkiste.json`).
- **Marktplatz** (`markt.html`) — Apps finden (Wort-Suche über die Listings) und
  anbieten (Platzhalter, im Aufbau). Verlinkt auf die Seite des Anbieters; keine
  Qualitäts-Garantie für fremde Apps. Bezahl-Abwicklung noch nicht gebaut.

Die Modell-Seite (`modell.html`) ist als technische Hintergrund-Seite erreichbar
(„hinter den Kulissen"), nicht mehr Teil der Haupt-Navigation.

Ein gemeinsames `assets/app.js` lädt pro Seite nur den passenden Teil
(per Element-Erkennung), ein gemeinsames `assets/style.css` für die Optik.

## Aufbau

```
sandbox/        # das headless Modell (reiner Node, keine Deps)
test/           # Smoke-Test (der Beweis)
docs/           # HERKUNFT, IMMUNSCHICHT, BAUTRUPP, WERKZEUGE, STUFEN, MODELL
web/data/       # run.json, marktplatz.json, nodes.json, angebote.json, markt-listings.json
such-tool/      # eigenständige, installierbare Such-PWA (byte-Kopie aus Sage)
index.html      # Startseite mit drei Raum-Karten
netzwerk.html   # Netzwerk-Raum (Versprechen + Andock-Wizard)
werkzeuge.html  # Werkzeug-Raum (Angebote + Bausteine)
markt.html      # Marktplatz (finden + anbieten, im Aufbau)
modell.html     # Hintergrund-Seite (Playback, kein Live-Node)
assets/         # gemeinsame Optik + app.js + modules/19_andock_wizard.js
status.json     # ehrlicher Real-Anteil
werkzeugkiste.json  # Quelle der Bausteine-Kacheln
```

## Prinzipien

- **Kopieren, nicht klonen.** Reife Sage-Module kommen später Datei für Datei herüber.
  Das Modell *wiederverwendet die Logik* headless, klont keine Browser-Live-Elemente.
- **„Schablone" heißt nicht leer.** Module 10/11/12/14 sind vorgebaut und schlummern,
  bis ein Angriff sie aktiviert — wie die Membran (15).
- **Nichts vortäuschen.** Sprache: Deutsch in Doku, Englisch im Code.

Details in `docs/`.
