# PULS — Übergabeprotokoll

Stand: 2026-05-29 · Branch `claude/sbkimtool-founding-TXRdc`

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
