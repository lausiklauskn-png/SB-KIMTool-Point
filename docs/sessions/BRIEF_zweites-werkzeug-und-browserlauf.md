# BRIEF — Browser-Lauf bestätigen + zweites echtes Werkzeug (02 Spore) + PR #11 klären

Stand: 2026-05-30 · für eine Nachfolgesitzung · Branch-Vorschlag `claude/zweites-werkzeug`

> In einem Satz: Das erste echte, offline einbaubare Werkzeug (01 Storage) steht und ist
> headless bewiesen (Suite 15/15: 6 Modell + 9 Storage) — jetzt Klaus' Browser-Lauf bestätigen, das nächste
> reife Modul real liefern (Vorschlag 02 Spore als Browser-WebCrypto-Ed25519) und die
> offene Truhe-PR #11 entscheiden.

---

## ⚠️ Lehre (zuerst lesen — sonst Doppelarbeit)

Vor jedem Bau `git fetch origin main` + gegen `origin/main` arbeiten. Offene PRs sichten
und je als **merge/close/hold** einordnen. **PR #11 (Truhe) ist weiter offen** und
überschneidet sich mit `werkzeuge.html`/`app.js` — erst klären, was die gültige
Werkzeuge-Ansicht ist, bevor man dort weiterbaut.

---

## 0. Pflichtlektüre vor Start [Pflicht — erst lesen, dann planen, dann bauen]

In dieser Reihenfolge, bevor Code geschrieben wird:

1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (oberster Eintrag „2026-05-30 (C) — Erstes echtes Werkzeug … 01 Storage")
3. **dieser Brief** (geplante Aufgabe + Datenverträge)
4. `status.json` (Real-Anteil ~22 %; neue Komponente Storage)
5. Doku + Code der Scheibe: `web/tools/sbkim-storage.js`, `test/storage.test.js`,
   `assets/app.js` (`TOOL_FILES`/`renderWerkzeuge`), `werkzeugkiste.json`,
   `docs/WERKZEUGE.md`.

Erst Überblick, dann bauen. **Kein automatischer Freibrief** — Klaus' Delegation
(„nach Sinn/Logik/Nutzerfreundlichkeit entscheiden") galt nur der Vor-Sitzung. Neue
Sitzung = neue ausdrückliche Freigabe. Datenverträge/Modell-Logik/Sicherheit ohnehin
Plan-vor-Code. Leitplanken (Ehrlichkeit, `npm test`, Kein-PII, Offline/keine CDNs,
prefers-reduced-motion, eigene Identität) gelten immer.

---

## 1. Stand [Pflicht]

- Auf `main` (gemerged): vier Seiten, Premium-Optik, Modell-Animation, npm test 8/8.
- Dieser Branch `claude/truhe-doppelstatus-awegv` (Draft-PR neu):
  - **Erstes echtes Werkzeug** `web/tools/sbkim-storage.js` (Modul 01) — offline, eine
    Datei, Browser=IndexedDB / headless=In-Memory. Suite **15/15 grün** (6 Modell + 9 Storage).
  - Seite liefert die Datei aus: **„Code kopieren" + „Datei laden"** für Module mit Feld
    `datei` (`assets/app.js`/`style.css`). Doppel-Status (Sage/Point) unverändert sichtbar.
  - `werkzeugkiste.json`/`status.json`/`docs/WERKZEUGE.md` ehrlich nachgezogen.
- Offen/wartet: **Browser-Sichttest (inkl. neuer Knöpfe + IndexedDB-Pfad) — ungeprüft,
  wartet auf Klaus.** GitHub Pages soll Klaus auf `main` aktivieren (Settings → Pages).
  **PR #11 (Truhe) = HOLD**, Merge entscheidet Klaus.

## 2. Ziel dieser Aufgabe [Pflicht]

Am Ende sichtbar/beweisbar: (a) Klaus' Browser-Lauf bestätigt die vier Seiten + die
neuen „Code kopieren/laden"-Knöpfe + den IndexedDB-Pfad von 01; (b) ein **zweites**
echtes, offline einbaubares Werkzeug ist geliefert und getestet; (c) PR #11 ist
entschieden (merge/close/hold) und die Werkzeuge-Ansicht ist eindeutig.

## 3. Was gebaut / gepflegt / getestet werden soll [Pflicht]

- **02 Spore (Browser):** `web/tools/sbkim-spore.js` — Ed25519-Identität via **WebCrypto**
  (`crypto.subtle`), `nodeId = SHA-256(rawPublicKey)`, `sign`/`verify`, Export nur des
  öffentlichen Teils. Eine Datei, keine Deps, gleiches UMD-Muster wie Storage. **Achtung:**
  WebCrypto-Ed25519 braucht moderne Browser — Support **ehrlich im Kopf-Kommentar + auf der
  Seite** vermerken; Fallback/Hinweis statt stillem Bruch. Headless-Test gegen Node-WebCrypto.
- `TOOL_FILES` in `app.js` um `"02"` ergänzen; `werkzeugkiste.json` (02 `datei`/
  `point_status`/`point_hinweis`), `status.json` (Real-Anteil), `docs/WERKZEUGE.md`.
- Falls Klaus #11 mergen lässt: **zuerst Mapping-Vertrag** Truhe↔`werkzeugkiste.json` in
  `docs/WERKZEUGE.md` festziehen, dann den Liefer-Mechanismus + Doppel-Status in die Truhe
  übertragen (additiv, Tool-Texte/Modal nicht antasten — Klaus' Vorgabe).

## 4. Datenverträge / Spec [Pflicht]

- **Modul-Liefervertrag:** Ein Modul ist „echt geliefert", wenn es (1) eine Datei unter
  `web/tools/<name>.js` hat, (2) in `werkzeugkiste.json` das Feld `datei` trägt, (3) in
  `TOOL_FILES` (app.js) steht und (4) einen headless-Test in `test/` hat. Nur dann zeigt die
  Seite „Code kopieren/laden".
- **UMD-Muster:** `module.exports` (CommonJS-Test) **und** `globalThis.<Name>` (Browser),
  abhängigkeitsfrei. Wie `sbkim-storage.js`.
- Berührt ein Modul ein Schutz-Modul (10/11/12/14/15) → `ZERTIFIKAT_ASPEKTE` in
  `sandbox/16_siegel.js` ans Listenende. (02 Spore tut das nicht.)
- Offline-Leitplanke: Kopieren/Laden zieht **nur** Repo-Dateien, kein externer Abruf.

## 5. Akzeptanzkriterien (Erfolgsmerkmale) [Pflicht]

1. `npm test` grün (inkl. Test für 02 Spore).
2. `web/tools/sbkim-spore.js` existiert, offline, eine Datei; Seite bietet „Code
   kopieren/laden" dafür an; WebCrypto-Browser-Anforderung ehrlich vermerkt.
3. PR #11 entschieden; Werkzeuge-Ansicht eindeutig (eine Quelle der Wahrheit).
4. `status.json`/`werkzeugkiste.json`/`docs` ehrlich nachgezogen.
5. Ehrliche Schließung: jeder Browser-Teil „ungeprüft, wartet auf Klaus".

## 6. Empfohlene Reihenfolge (Einzelschritte)

1. `git fetch origin main`, offene PRs sichten; PR #11-Entscheidung von Klaus einholen.
2. Klaus' Browser-Rückmeldung zu Seiten + neuen Knöpfen einsammeln, Restpunkte beheben.
3. `web/tools/sbkim-spore.js` + Test bauen, `npm test` grün; `TOOL_FILES`/JSON/Doku nachziehen.
4. Falls #11 merge: Mapping-Vertrag, dann Mechanismus/Doppel-Status additiv in die Truhe.
5. PULS + neuer Brief, Draft-PR mit Test-Plan. Merge entscheidet Klaus.

## 7. Offene Fragen an Klaus

- **PR #11 (Truhe): merge, close oder hold?** Davon hängt ab, welche `werkzeuge.html` gilt.
- Ist der WebCrypto-Browser-Support (modernes Tablet-Browser) für 02 Spore ok, oder soll
  Storage-Stil (universell) Vorrang haben und Spore warten?
- GitHub Pages auf `main` aktiviert? (Settings → Pages → Deploy from branch `main` / root.)
- Wann stellst du Sage-Quelldateien für eine echte 1:1-Modul-Kopie bei (statt Point-Port)?

## 8. Abschluss-Befehl [Pflicht — die Kette darf nie abreißen]

Am Ende dieser Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<naechstes-thema>.md` nach
   `docs/sessions/VORLAGE_BRIEF.md` anlegen — inkl. Pflichtlektüre (Teil 0) und dieses
   Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
