# PULS — Übergabeprotokoll

Stand: 2026-05-30 · Branch `claude/truhe-doppelstatus-awegv`

## 2026-05-30 (C) — Erstes echtes Werkzeug zum Einbauen: 01 Storage

Klaus' Steuerung: „der Nutzer will etwas von der Seite **in sein System einbauen**, nicht
nur schön anzusehen" + Entscheidungs-Freibrief für (b)/(c) („nach Sinn, Logik,
Nutzerfreundlichkeit"). Daraus dieser Schritt — gegen das echte `origin/main` gearbeitet,
**nicht** auf dem ungemergten Truhe-PR #11 aufgebaut.

**Getan:**
- **Erstes echtes, offline einbaubares Modul:** `web/tools/sbkim-storage.js` (Modul 01
  Storage). Eine Datei, **keine Abhängigkeiten**. Browser → IndexedDB; headless/Node →
  In-Memory-Fallback. Point-eigene Umsetzung, Kopf-Kommentar + Version, kein Klarname.
- **Beweis:** `test/storage.test.js` → **`npm test` 16/16 grün** (8 alt + 8 neu;
  In-Memory-Pfad + API-Vertrag bewiesen).
- **Seite liefert die Datei aus** (nicht nur Anzeige): in `assets/app.js` für Module mit
  Feld `datei` zwei echte Knöpfe **„⧉ Code kopieren"** + **„⬇ Datei laden"** (offline, kein
  Sage-Hotlink). Styles in `assets/style.css`. Doppel-Status (Sage/Point) **bleibt** —
  er war auf `main` nie weg (nur die Truhe in #11 hatte ihn entfernt).
- **Ehrlich nachgezogen:** `werkzeugkiste.json` (01 `point_status` „kopiert · headless
  getestet" + `point_hinweis` + `datei`), `status.json` (Real-Anteil ~22 %, neue
  Komponente), `docs/WERKZEUGE.md` (Modul 01 dokumentiert + Truhe↔JSON-Mapping-Hinweis).

**Offen / wartet:**
- **Browser-Sichttest aller vier Seiten + die neuen Knöpfe — ungeprüft, wartet auf Klaus.**
  Der **IndexedDB-Pfad** von 01 ist ebenfalls erst im Browser belegbar.
- **GitHub Pages:** Klaus wünscht Aktivierung auf `main`. Lässt sich **nicht** per API
  hier schalten → Klaus klickt: Repo → **Settings → Pages → Source: „Deploy from a
  branch" → Branch `main` / `/ (root)` → Save**. Danach Hard-Reload (Strg+Shift+R).
- **PR #11 (Truhe):** Draft, **HOLD — Merge entscheidet Klaus**. Überschneidung: #11
  ersetzt `werkzeuge.html` komplett und entfernt den Doppel-Status; dieser Branch
  verbessert die **bestehende** `werkzeuge.html`/`app.js`. Bei Merge zuerst entscheiden,
  welche Werkzeuge-Ansicht gilt; die echte Datei + der Liefer-Mechanismus sind in beide
  übertragbar.
- **Nächstes echtes Modul:** 02 Spore als Browser-WebCrypto-Ed25519 (Quelldateien aus
  Sage noch nicht beigestellt; WebCrypto-Pfad hier nicht sicher prüfbar → Browser nötig).

**Hinweis Umgebung:** Die Tool-Ausgabe war zeitweise instabil (abgeschnittene/
eingestreute Texte). Verlässliche Belege wurden per Wiederholung + Datei-Capture
gesichert; der saubere `npm test`-Lauf zeigt 16/16.

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
