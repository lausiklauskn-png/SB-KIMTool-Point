# PULS — Übergabeprotokoll

Stand: 2026-05-30 · Branch `claude/feinschliff-erstes-modul-KOnAU`

## Nachtrag 2026-05-30 — Schicht 2/3 auf Modell-Optik-Niveau gehoben (Freibrief)

Unter ausdrücklichem, befristetem **Gestaltungs-Freibrief** von Klaus. Diese Sitzung
hängt auf der Animations-Arbeit aus **PR #8** auf (dort in den Arbeitsbranch gemerged,
damit die neue Optik als Fundament da ist) und baut Schicht 2/3 darauf an.

**Zwei Befunde gleich zu Beginn offengelegt (statt blind zu bauen):**
1. Die Modell-Animation (`assets/model.js`, Rolle Ingenieur, `run.json` v0.2, Test 8/8)
   ist **noch nicht in `main`** — sie lebt im offenen Draft-**PR #8**
   (`claude/agenten-animation-r4i7f`). Dieser Branch wurde daher auf #8 gestapelt.
   **Merge-Reihenfolge: erst #8, dann dieser PR.**
2. Die **Sage-Quelle ist in dieser Umgebung nicht erreichbar** (kein `Sage-Protokol/`,
   Repo-Zugriff auf `sb-kimtool-point` beschränkt, kein Netz zu anderen Repos). Ein
   reifes Modul „Datei für Datei" zu kopieren ist **ehrlich nicht möglich** —
   Modul-Kopie daher **bewusst NICHT gemacht** (kein erfundenes Modul → „kein
   vorgetäuschtes Wissen"). Bleibt offene Aufgabe, sobald die Quelle bereitsteht.

**Gebaut (reine Design-/UX-Gestaltung, Datenverträge unberührt):**
- `assets/style.css`: Schicht 2 (Werkbank) + 3 (Schaufenster) neu — Reife-Spine in
  Lampen-Farben, Mono-Orb mit Modul-Nummer, Status-Chips mit Glow-Punkt, Hover-Lift,
  Stufen-Legende, Reife-Schlüssel; Markt-Karten mit Monogramm, Status-/Echt-Chip,
  Andock-Knopf. **`prefers-reduced-motion`** für die neuen Hover-Effekte respektiert.
- `assets/app.js`: reichere Render-Logik (Reife→Spine/Chip-Mapping, Point-Status-Chip,
  Stufen-Zähler an den Tabs, Stufen-Legende aus den bisher ungezeigten `stufen`-Texten,
  „Nutzen" als Lead + Rest in `<details>`-Aufklapper gegen die Textwand; Markt mit
  Monogramm/Status/Echt-Chip).
- `werkzeuge.html`: Container für Stufen-Legende + Reife-Schlüssel.
- Funktion unberührt: Stufen-Tabs, Kennung-kopieren, Andock-Links, Daten aus denselben
  JSON-Quellen. `run.json` **nicht** angefasst (Demo-Regen zurückgesetzt: nur zufällige
  Schlüssel-Churn).

**Bewusst NICHT angefasst:** `modell.html`/`model.js` (Referenz, unter Review in #8;
Klaus' Browser-Lauf steht noch aus → keine erfundenen „Restpunkte"). `status.json`
real_anteil bleibt ehrlich ~20 % (kein Modul real kopiert).

**Verifiziert:** `npm test` **8/8 grün**; JS-Syntax (`node --check`) ok; Headless-
DOM-Stub-Smoke-Test: 3 Stufen-Tabs mit Zählern, 7 Basic-Kacheln, Stufen-Legende (3),
Markt (3) rendern fehlerfrei. **Browser-Sichttest Schicht 2/3 + Modell-Seite:
ungeprüft, wartet auf Klaus** (Hard-Reload Ctrl+Shift+R nach Pull).

---

## Nachtrag 2026-05-30 — Lebendiges Agenten-Board + Ingenieur-Rolle (Schicht 1)

Die Modell-Seite wurde vom statischen Ticker in eine **animierte Pipeline** verwandelt
und die neue Rolle **Ingenieur** ins Modell aufgenommen (Auftrag:
`docs/sessions/BRIEF_agenten-animation.md`, unter dem befristeten **Gestaltungs-Freibrief**).

**Modell-Logik (Spec vor Code, Vertrag v0.2):**
- Neue Rolle `sandbox/roles/ingenieur.js` — schlägt Objekte vor (Titel · `kind` ·
  Beschreibung), deterministischer Ideen-Pool. Kette jetzt:
  **Ingenieur → Bauer → Gate/Arzt → Beobachter**, Sybil = **Negativbauer** (Angreifer).
- `bauer.js` baut die Ingenieur-Idee (Titel/Art/Beschreibung ins Manifest), rückwärtskompatibel.
- `nodes/sybil.js` schleust **getarnte** Fälschungen ein (lesbare Titel für die Statusleiste).
- `loop.js` schreibt `run.json` **v0.2**: `roles`, `artefacts[]` (kind/title/description/
  status/downloadable), `events[]` mit `phase` (idee/build/sybil/verdict) + `t`, plus `summary`/`edgeCases`.
- `16_siegel.js`: zwei neue `ZERTIFIKAT_ASPEKTE`-Einträge (Modul 10/12) — Sicherheits-Modul-Pflicht.
- Tests: +2 (Ingenieur-Rolle, Vertrag v0.2). **`npm test` 8/8 grün.**

**Seite (voller Umbau, zero-dependency, offline):**
- `modell.html` neu: SVG-Pipeline + HTML-Knoten; `assets/model.js` (eigene Engine);
  `assets/style.css` um Bühne/Glow/Zustände/Karten erweitert. `app.js` entschlackt
  (Modell-Logik raus → eigenes `model.js`).
- Aktiver Agent **leuchtet**; Artefakt wandert als **Lichtpunkt** entlang der Kanten;
  Angriff läuft sichtbar **grün→orange→rot→Apoptose** (Zerfall + Burst-Ring).
- **Klartext-Statusleiste** (Art + Titel) + **Detail-Karte** (kind-Chip, Status-Schiene,
  Export-Knopf lädt Modell-Entwurf als `.md`). Legende + Rollen-Erklärung + Protokoll als Aufklapper.
- Steuerung: Pause/Weiter · Neu starten · Tempo (1×/2×/0.5×) · Bewegung an/aus.
- `prefers-reduced-motion` respektiert (Bewegung startet aus, Animationen unterdrückt).

**Manual-Check:** Mit Playwright (lokaler Server, Chromium) gerendert — **keine Konsolen-/
Seitenfehler**, Status/Detail/aktiver Knoten korrekt, Angriffs-/Apoptose-Frame sichtbar,
Export-Download (`art-1-timer-kachel.md`) und Reduced-Motion-Pfad funktionieren. Das ist
ein Entwickler-Smoke-Test; **Klaus' eigener Browser-Lauf steht aus** (nach Pull
Hard-Reload Ctrl+Shift+R).

**Bewusst entschieden (Freibrief, statt zu blockieren):**
- Ein Ingenieur für beide Sorten (Hintergrund-Tool **und** Standalone-PWA) — nicht gesplittet.
- Export = eine **Markdown-Spezifikation** des Modell-Entwurfs (ehrlich „keine fertige PWA").
- Keine separate Erklär-Seite: Legende + Rollen + „Warum ein Modell?" als Aufklapper **auf**
  `modell.html` (weniger Navigation, alles am Ort des Geschehens). Nav unverändert.
- ASCII-Titel ohne Umlaut-Ersatz im `sandbox/` (Codebase-Stil); „Rate-Limit-Bremse" statt „…-Waechter".

**Freibrief für die Folgesitzung:** Klaus hat den **Gestaltungs-Freibrief ausdrücklich auch
für die nächste Sitzung** erteilt (befristet, gleiche unverhandelbare Leitplanken). Er ist
im neuen Brief `docs/sessions/BRIEF_feinschliff-und-erstes-modul.md` (eigener Abschnitt) verankert.

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
