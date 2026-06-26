# PULS — Übergabeprotokoll

Stand: 2026-06-26 · Branch `claude/toolpoint-aufbau`

## Nachtrag 2026-06-26 — Toolpoint: drei Räume neu strukturiert (v0.3)

Auf Klaus' Entscheid die Seite von „Modell / Werkzeugkiste / Markt" auf **drei
klare Räume** umgebaut: **Netzwerk · Werkzeuge · Marktplatz**. Die alte
Modell-Seite tritt zurück (erreichbar als „hinter den Kulissen", aus der
Haupt-Navigation genommen). Sprache durchgehend sachlich/erwachsen, **wenig
Analogie** (keine Pilz-/Mycel-Begriffe im Seitentext) — Klaus' Ton-Vorgabe
2026-06-26.

**Vorarbeit:** Datei-für-Datei-Audit aller acht Repos (alle gehören Klaus,
bestätigt). Befund: SB-KIMTool-Point war **nicht leer** (4-Seiten-Seite v0.2
existierte) — daher aufgesetzt, nichts zerstört.

**Gebaut (Branch `claude/toolpoint-aufbau`):**
- `index.html` — neue Startseite mit drei Raum-Karten.
- `netzwerk.html` (neu) — dreistufiges, prüfbares Versprechen (local-first /
  Ende-zu-Ende / offene Konfig), ehrliche „server-los"-Einordnung, Relay-Fakten
  (`wss://relay.family-projekt.de`), **eingebetteter Andock-Wizard** (Modul 19).
- `werkzeuge.html` — Angebote (Such-Werkzeug prominent + Andock-/Knoten-Werkzeug
  als Vorlage) + Bausteine-Grid (werkzeugkiste.json, unverändert).
- `markt.html` — Wort-Suche über Listings, Angebots-Karten, „Tool anbieten"-
  Platzhalter (~1 €/Monat-Hinweis), Download-gegen-Gebühr-Platzhalter,
  Haftungs-/Keine-Garantie-Hinweis für fremde Apps.
- `assets/modules/19_andock_wizard.js` — **byte-identische** Kopie aus Sage.
- `such-tool/` — **byte-identische** Kopie der eigenständigen Such-PWA aus Sage
  (Module 03/04/21/22 byte-gleich) → hier gehostet + installierbar.
- `web/data/angebote.json` (neu), `web/data/markt-listings.json` (neu, Listing =
  Such-Korpus im Schema `label/anchorId/text` + Markt-Felder).
- `assets/app.js` + `assets/style.css` erweitert (renderNetzwerk/renderAngebote/
  renderMarkt + Stile). `modell.html` nur Nav/Überschrift zurückgestuft.

**Verifiziert (headless):** `node --check` app.js + Modul 19 ok; alle JSON parsen;
`npm test` **6/6 grün** (Modell-Logik unberührt); alle verlinkten Pfade
existieren; lokaler HTTP-Server liefert alle Seiten + Such-Tool + Daten als 200;
Such-Tool-Module byte-identisch zur Sage-Quelle (Drift-Guard manuell geprüft).
**Browser-Sichttest der neuen Seite: ungeprüft, wartet auf Klaus' Browser-Lauf.**

**Bewusst NICHT gebaut (Marktplatz = vorbereiten, nicht final):** Bezahl-
Abwicklung (Download-Gebühr + Anbieter-Monatsbeitrag), aktives „Tool anbieten"-
Formular, volle semantische Discovery-Suche direkt im Marktplatz (Korpus liegt
im richtigen Schema; das Such-Werkzeug ist als volle Suche verlinkt), Qualitäts-/
Sicherheits-Check fremder Apps (Klaus' Entscheid: Folge-Sitzung).

**Offene Entscheidungen für Folge-Sitzung:** Tresore erst listen, wenn ihre
GitHub Pages aktiv sind (jetzt als „kommt bald" gelistet); semantische Discovery
im Marktplatz verdrahten (Modul 22 mit Listing-Korpus); Bezahl-Modell (Phase D.2,
bewusst offen).

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
