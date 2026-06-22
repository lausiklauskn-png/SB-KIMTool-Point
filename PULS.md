# PULS — Übergabeprotokoll

Stand: 2026-06-22 · Branch `claude/such-tool-pwa-standalone-sbgf2h`

## Nachtrag 2026-06-22 — Such-Werkzeug als eigenständige, installierbare PWA

Befund (Klaus/Sage): Der „Download" des Such-Tools wurde keine eigene App — es blieb
unter dem Hub. Grund: eine lokal über `file://` geöffnete Datei darf keinen
Service-Worker registrieren → keine Installation.

Umgesetzt (Klaus' Wahl: **Variante A** — eigener Unterordner):
- Neuer Ordner **`such-tool/`**, Inhalt 1:1 aus `Sage-Protokol/such-tool/` kopiert:
  `index.html`, `manifest.json` (start_url/scope/id relativ `./` → läuft im
  Unterordner), `sbkim-sw.js` (Service-Worker MIT `fetch`-Handler → installierbar),
  `impressum.html` (Kontakt = **Platzhalter**, keine PII), `icon-192/512.png`,
  `modules/` (Kopien **03/04/21/22** — die einzigen nötigen Module, kein 01/02).
- **Scope-Falle geprüft:** Der Hub hat aktuell **gar keinen** Service-Worker →
  keine Überschattung. Der Tool-SW registriert aus `/such-tool/` (Scope `/such-tool/`).
- **Resize-Stand:** Modul 22 ist die Sage-Fassung **nach PR #388** (Griff unten
  rechts zieht Breite + Lesefeld-Höhe, Größe persistiert in `localStorage`
  `sbkim_search_widget_size`, Drag/Resize getrennt). Also bereits der grüne Stand.
- Hub-Knopf: auf `werkzeuge.html` ein benannter Knopf **„→ Such-Werkzeug öffnen"**
  (`such-tool/index.html`).
- Doku: `docs/components/_standalone_such_tool.md` (Kern-Lehre + Aufbau + Drift-Guard,
  für dieses Repo angepasst). `status.json` um den Standalone-Eintrag ergänzt.
- JS aller kopierten Module `node --check`-sauber; `npm test` weiter **6/6 grün**
  (sandbox unberührt).

**Offen / wartet auf Klaus:**
- **GitHub Pages** für dieses Repo aktivieren (über https), sonst keine Installation.
- **Installations-Sichttest** am Tablet: `…/SB-KIMTool-Point/such-tool/` öffnen →
  „App installieren" → eigene App (eigenes Fenster)? Offline-Start? Resize ok?
- Impressum-Kontakt vor Veröffentlichung mit echten Pflichtangaben füllen (keine PII).
- Drift: `modules/` sind Kopien — bei Änderung in Sage `src/modules` nachziehen.

## Nachtrag 2026-05-30 — Dokumentations- & Lesepflicht (Brief-Kette)

## Nachtrag 2026-05-30 — Dokumentations- & Lesepflicht (Brief-Kette)

Verbindliche Konvention verankert, damit Folge-Sitzungen den Stand kennen und nicht
blind bauen:
- `CLAUDE.md`: neue Section „Dokumentations- & Lesepflicht (Brief-Kette)" — Pflichtlektüre
  vor Start (CLAUDE → PULS → neuester Brief → status.json → Scheiben-Code), „erst
  Überblick/Plan, dann bauen", und der **Abschluss-Befehl**: jede Sitzung schreibt einen
  neuen Brief.
- `docs/sessions/VORLAGE_BRIEF.md`: Brief-Vorlage (Stand · geplant · bauen/pflegen/testen ·
  Datenverträge · Akzeptanz · Reihenfolge · offene Fragen · Abschluss-Befehl).
- `BRIEF_agenten-animation.md`: um Pflichtlektüre (Anfang) + Abschluss-Befehl (Ende) ergänzt.

## Nachtrag 2026-05-29 — Drei Schichten auf je eine eigene Seite

Auf Klaus' Wunsch die eine gedrängte Seite in **vier Seiten** aufgeteilt:
`index.html` (Startseite mit drei Knöpfen) + `modell.html` / `werkzeuge.html` /
`markt.html`. Gemeinsame Kopf-Navigation (Start · Modell · Werkzeuge · Markt,
aktive Seite hervorgehoben). Ein `assets/app.js` lädt pro Seite nur den passenden
Teil (Element-Erkennung), `assets/style.css` um Nav + Startseiten-Karten erweitert.
Version v0.2. So hat jede Schicht Platz; in `werkzeuge.html` können einzelne Tools
heranwachsen. `npm test` weiterhin 6/6 grün (Modell-Logik unberührt).
**Browser-Lauf der neuen Struktur: ungeprüft, wartet auf Klaus.**

## Nachtrag 2026-05-29 — Erprobte Regeln übernommen

Nach Gründung gezielt geprüft, welche bewährten Regeln aus Sage und den Live-PWAs
zu übernehmen sind (PR #1 war da schon gemerged).

- `CLAUDE.md` erweitert um **erprobte Regeln aus Sage** (PR-Workflow, Ehrlichkeit über
  Zustand, Evolutions-Klausel, Sicherheits-Modul-Pflicht, Kein-PII, Spec-vor-Code,
  PULS-/„Nächste-Schritte"-Pflicht, Einzelschritte-Kommunikation) — Sage-Spezifika
  bewusst ausgelassen.
- `CLAUDE.md` erweitert um **Regeln aus den Live-PWAs** (Mixarium/Rezeptbuch):
  verteilbare Werkzeuge = einzelne `index.html` mit inline-Assets/keine Deps,
  PWA-Grundausstattung, Kopf-Kommentar mit Version (aber kein Klarname → Kein-PII),
  Eruda als Tablet-Debug, Service-Worker → Hard-Reload-Regel.
- **Sicherheits-Modul-Pflicht konkret umgesetzt:** `ZERTIFIKAT_ASPEKTE`-Liste in
  `sandbox/16_siegel.js` (append-only) mit Einträgen für 16/10/12/07/14; neuer Test
  sichert sie ab → **`npm test` 6/6 grün**.

## Was in dieser Sitzung entstand (Gründungs-Skelett)

Das Repo startete leer. Diese erste Scheibe legt das Skelett an und baut die
kleinste echte Scheibe + die statische Drei-Schichten-Seite drumherum.

### Scheibe 1 — headless Modell (Beweis steht)
- `sandbox/` — reiner Node, keine Abhängigkeiten:
  - `00_config.js` (echte Sage-Konstanten + Modell-Vorschlag `REP_DISTRUST_RATIO`)
  - `02_spore.js` (echtes Ed25519/SHA-256 via `node:crypto`)
  - `16_siegel.js` (Tun statt Sein), `10_reputation.js` (Sybil-Abwehr), `07_apoptose.js`
  - Rollen `bauer` / `gate_arzt` / `beobachter`, `nodes/sybil.js`, `loop.js`
- `test/smoke.test.js` — **5/5 grün** (`npm test`). Das ist der Beweis.
- `npm run demo` druckt den Bericht und schreibt `web/data/run.json`.

### Scheibe 2 — statische Seite (drei Schichten)
- `index.html` + `assets/style.css` + `assets/app.js` — dunkle, an Sage angelehnte,
  re-geskinnte Optik mit Lampen-Status-Leiste.
- Schicht 1 spielt `run.json` als Board ab (kein Live-Node).
- Schicht 2 rendert `werkzeugkiste.json` in drei Reitern (Basic/Pro/Profi) mit
  Erklärung + Doppel-Status pro Kachel.
- Schicht 3 rendert `web/data/marktplatz.json` (Saat = echte Live-Endknoten).

### Doku & Ehrlichkeit
- `docs/`: HERKUNFT, IMMUNSCHICHT, BAUTRUPP, WERKZEUGE, STUFEN, MODELL.
- `status.json` — ehrlicher Real-Anteil (~20 %), Seite zeigt aufgezeichneten Lauf.
- `README.md`, `CLAUDE.md`.

## Verifiziert
- `npm test` → 5/5 grün. `npm run demo` → Bericht + `run.json`.
- Sybil-Knoten: Stimmgewicht 0 → Misstrauen über Schwelle → Blocklist → signierte Apoptose.
- Alle JSON-Dateien parsen.

## Bewusst NICHT gemacht (nächste Scheiben)
- Reife Sage-Module tatsächlich kopieren (erst wenn Klaus sie dort weiter reift → Datei für Datei).
- Marktplatz-**Suche** (Daten sind vorbereitet: `marktplatz.json` / `nodes.json`).
- Server-Zeh-Entscheidung (Browser-Transport) — vertagt.
- Weitere Rollen (Linguist/QA, Hindernis-Agent, Späher); echtes Embedding statt Stub; Live-Node im Browser.

## Nächster sinnvoller Schritt
GitHub Pages auf den Branch/`main` zeigen lassen und die Seite live ansehen; danach
das erste reife Sage-Modul (z. B. 09 Einbau-PWA) Datei für Datei herüberholen.
