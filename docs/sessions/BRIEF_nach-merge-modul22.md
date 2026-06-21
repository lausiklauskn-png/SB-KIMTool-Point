# BRIEF — Nach dem Merge: Browser-Lauf bestätigen, Quittung an Sage, optionale Vertiefung

> Folge-Brief nach `docs/sessions/VORLAGE_BRIEF.md`. **Neuester Brief gilt.**
> Vorgänger: `BRIEF_such-werkzeug-modul22.md` (Inhalt jetzt in `main` gemergt).

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge:
1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (aktueller Stand, oben der 2026-06-21-Merge-Eintrag)
3. **diesen Brief**
4. `status.json` (Real-Anteil)
5. Doku + Code der Scheibe: `docs/components/22_such_widget.md`,
   `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md`, `web/tools/sbkim-such-widget.js`,
   `assets/such-widget-init.js`

**Erst Überblick, dann bauen.** Immer gegen das **aktuelle `origin/main`** arbeiten
(Modul 22 ist jetzt dort). Offene PRs vorher sichten.

---

## 1. Stand **[Pflicht]**
- **In `main` (PR #83, Squash `31bfe46`, 2026-06-21):** Modul 22 Such-Werkzeug 1:1 aus Sage in
  `web/tools/sbkim-such-widget.js`; 04 Match auf aktuellen Sage-Stand gehoben (hybridMatch/04.D);
  Smoke `tests/smoke_bau22_such_widget.mjs` **148/148** in `npm test`; Profi-Kachel + Markt-
  Eintrag; „größer ziehen" nicht-invasiv (`assets/such-widget-init.js`); Impressum/Datenschutz
  §6a (DE+EN); Standalone-PWA `such-werkzeug.html`. `npm test` 95+148 grün, `npm run verify` 16/16.
- **Offen / blockiert:** sichtbarer **Browser-Lauf durch Klaus** (Panel sehen, suchen, größer
  ziehen) — bis dahin ehrlich „ungeprüft". **Quittung an Sage** (a/b/c) noch nicht im Briefkasten.
- **Erledigt/geklärt:** die „separater Container unterm schwarzen Loch"-Bitte war für **Sage**,
  nicht Point — hier nichts zu tun.

## 2. Ziel dieser (nächsten) Aufgabe **[Pflicht]**
Den Browser-Lauf bestätigen lassen und — falls Klaus mag — die nächste ehrliche Vertiefung
wählen (siehe §3 „optional"). Kein Muss; das Tool ist als eigenständiges Werkzeug fertig
übernommen **und gemergt**.

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**
- **Pflegen:** nach Klaus' Browser-Lauf die „wartet auf Klaus"-Vermerke in `status.json` /
  `werkzeugkiste.json` / `docs/WERKZEUGE.md` auf „browser-bestätigt" heben — **nur** wenn
  wirklich gesehen (keine Selbst-Grün-Markierung).
- **Quittung an Sage:** Ein-Zeiler (a übernommen, b Kategorie Profi + Werkzeuge + Markt,
  c Standalone-PWA gebaut) in den Point-Briefkasten (`sbkim/AUSTAUSCH.md`) + `SIGNAL.json`
  seq +1 — **erst auf Klaus' Ansage** (er relayt / entscheidet den Versand-Weg).
- **Optional (nur mit Klaus' Freigabe):**
  - **B3-Richter** (sicherheits-/eignungs-bewusst) — Sage baut das; abwarten, dann 1:1 holen.
  - **Cross-Knoten-Suche server-los** (Modul 04.C + 15 `op:"query"`) — die offene Hälfte;
    Sage-seitig noch nicht fertig, **nicht** vorbauen.
  - Optionales **Modul 21 Spracheingabe** (`sbkim-speech.js`) als zusätzlicher Komfort.

## 4. Datenverträge / Spec **[Pflicht, falls Module/Dateien Daten teilen]**
- `SbkimSearchWidget.init(options)` self-mountet; `setCorpus(corpus)` reicht an
  `SbkimMatch.setLocalCorpus` durch. Korpus-Schema: `{ label, anchorId?, passageVec:Float32Array(384) }`.
- „Größer ziehen" lebt **außerhalb** des Moduls (`assets/such-widget-init.js`, localStorage-Key
  `sbkim_search_panel_size_point`). Modul 22 bleibt unverändert (kein Umbau fremder Module).
- Standalone-PWA wird **generiert** (`scripts/build-such-pwa.mjs`) — `such-werkzeug.html` nicht
  von Hand editieren, sondern `npm run build:such-pwa`.

## 5. Akzeptanzkriterien **[Pflicht]**
- `npm test` grün (node:test 95 + Smoke 148). `npm run verify` 16/16.
- Honest closure: solange Klaus das Panel nicht im Browser sah → „ungeprüft, wartet auf Klaus".

## 6. Empfohlene Reihenfolge (Einzelschritte)
1. Browser-Lauf durch Klaus (Werkzeuge-/Markt-Seite + `such-werkzeug.html`, Hard-Reload).
2. Quittung an Sage (nach Klaus' Freigabe).
3. Erst danach optionale Vertiefung (B3/Cross-Knoten/21) — und nur, was Sage wirklich fertig hat.

## 7. Offene Fragen an Klaus
- Soll die Quittung an Sage formal in den Briefkasten (`sbkim/AUSTAUSCH.md` + `SIGNAL.json` seq+1),
  oder reicht der Chat-Relay?
- Demo-Korpus der App-Suche (5 Beispiele in `assets/such-widget-init.js`) so lassen oder
  durch echte Point-Inhalte (z. B. Werkzeugkiste-Texte) ersetzen?

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**
Am Ende der nächsten Sitzung: `PULS.md` fortschreiben · **neuen** Brief
`docs/sessions/BRIEF_<thema>.md` nach der Vorlage (inkl. Teil 0 + dieses Befehls) · Brief
vollständig als Codeblock im Chat · Commit + Push · Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
