# BRIEF — Such-Werkzeug live: GitHub Pages, Installations-Sichttest, Drift-Guard

Stand: 2026-06-22 · für eine **Nachfolgesitzung** · Branch-Vorschlag `claude/such-tool-pages`

> **Was diese Sitzung tun soll, in einem Satz:** Das in `such-tool/` gebaute,
> eigenständige Such-Werkzeug **live schalten** (GitHub Pages), Klaus' Installations-
> und Resize-Sichttest **begleiten/auswerten**, und einen kleinen **Drift-Guard**
> einziehen, damit die Modul-Kopien nicht still von Sage abweichen.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge lesen, **bevor** Code geschrieben wird:

1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (aktueller Stand — der 2026-06-22-Nachtrag betrifft genau diese Aufgabe)
3. **diesen Brief**
4. `status.json` (Real-Anteil)
5. `docs/components/_standalone_such_tool.md` + der Ordner `such-tool/` (index.html,
   manifest.json, sbkim-sw.js, modules/)

**Erst Überblick, dann bauen:** relevanten Code lesen, Plan formulieren, Plan kurz an
Klaus zeigen, Rückmeldung abwarten — **nicht sofort losbauen**. Offene PRs vorher sichten.

---

## 1. Stand **[Pflicht]**

- **Gebaut (diese Sitzung, Draft-PR offen):** `such-tool/` als eigenständige,
  installierbare PWA — Variante A (eigener Unterordner). Inhalt 1:1 aus
  `Sage-Protokol/such-tool/`: `index.html`, `manifest.json` (relativ `./`),
  `sbkim-sw.js` (SW mit `fetch`-Handler), `impressum.html` (Platzhalter, keine PII),
  `icon-192/512.png`, `modules/` (Kopien 03/04/21/22). Modul 22 ist die Sage-Fassung
  **nach PR #388** (Resize-Fix). Hub-Knopf auf `werkzeuge.html`. Doku +
  `status.json` + `README` nachgezogen. `npm test` **6/6 grün**.
- **Offen / blockiert:**
  - **GitHub Pages** für dieses Repo ist (vermutlich) noch nicht aktiv → ohne https
    keine Installation. Pages-Status prüfen/aktivieren.
  - **Installations-/Resize-Sichttest** durch Klaus steht aus (headless ersetzt das nicht).
  - **Kein Drift-Guard** im Repo: die Modul-Kopien werden nur manuell mit Sage
    abgeglichen.

## 2. Ziel dieser Aufgabe **[Pflicht]**

Am Ende ist das Such-Werkzeug unter `…/SB-KIMTool-Point/such-tool/` **live über https**
erreichbar, Klaus konnte es als **eigene App installieren** (eigenes Fenster) und der
**Resize** stimmt — oder die Sitzung hat ehrlich dokumentiert, woran es noch hakt.
Zusätzlich existiert ein leichter **Drift-Guard** für die Modul-Kopien.

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**

- **Bauen:**
  - **Drift-Guard** (leichtgewichtig, ohne Sage als Abhängigkeit): ein kleiner
    Node-Smoke (`test/such_tool.test.js`), der prüft, dass (a) alle Schalen-Dateien
    aus `sbkim-sw.js`'s `APP_SHELL` **existieren**, (b) `index.html` genau die 4 Module
    referenziert, (c) `manifest.json` valide ist (Icons 192+512, `display:standalone`,
    relative `start_url`/`scope`). Den Test in `npm test` aufnehmen (dann 7+ grün).
    *(Byte-Abgleich gegen Sage ist hier nicht möglich, weil Sage kein Teil dieses Repos
    ist — daher Struktur-/Vollständigkeits-Prüfung statt byte-identisch.)*
- **Pflegen:**
  - **GitHub Pages** aktivieren (Settings → Pages → Branch `main` bzw. der gemergte
    Stand). Falls Pages nur über die Web-UI geht: Klaus die **benannten Klicks**
    nennen (kein Terminal), nicht über die Konsole.
  - Nach Klaus' Sichttest `status.json` + `PULS.md` von „wartet auf Klaus" auf
    **grün/„im Browser bestätigt"** ziehen (nur mit echtem Beleg).
- **Testen:**
  - `npm test` muss grün bleiben (inkl. neuem `such_tool`-Smoke).
  - **Browser-Sichttest durch Klaus:** `…/such-tool/` öffnen → „App installieren" →
    eigene App? Offline-Start nach Installation? Griff unten rechts zieht Breite +
    Lesefeld-Höhe, Größe bleibt nach Reload? (Hard-Reload Ctrl+Shift+R wegen SW.)

## 4. Datenverträge / Spec **[Pflicht, falls Module/Dateien Daten teilen]**

- Keine neuen Datenverträge. Der Drift-Guard liest **nur** vorhandene Dateien
  (`such-tool/sbkim-sw.js`, `index.html`, `manifest.json`) und prüft deren Konsistenz.
  Ändert sich die App-Schale, ist `APP_SHELL` in `sbkim-sw.js` die Quelle.

## 5. Akzeptanzkriterien (Erfolgsmerkmale) **[Pflicht]**

1. `…/SB-KIMTool-Point/such-tool/` ist über **https** (Pages) erreichbar.
2. Klaus konnte die PWA **installieren** (eigene App, eigenes Fenster) — oder es ist
   ehrlich dokumentiert, warum noch nicht.
3. `test/such_tool.test.js` prüft Schale/Module/Manifest; **`npm test` grün**.
4. `status.json`/`PULS.md` spiegeln den **echten** Sichttest-Stand (kein Selbst-Grün
   ohne Klaus' Beleg).

## 6. Empfohlene Reihenfolge (Einzelschritte)

1. Pages-Status klären; Klaus die benannten Klicks zum Aktivieren geben (falls nötig).
2. Drift-Guard-Smoke schreiben, in `npm test` aufnehmen, grün halten.
3. Klaus' Installations-/Resize-Sichttest begleiten und auswerten.
4. `status.json` + `PULS.md` ehrlich nachziehen; Draft-PR mit Test-Plan. **Merge: Klaus.**

## 7. Offene Fragen an Klaus

- Soll Pages auf **`main`** zeigen (nach Merge dieses PRs) oder auf den Branch?
- Bleibt es bei **Variante A** (Unterordner), oder willst du das Tool später doch in
  ein **eigenes Repo** (Variante B) heben (sauberere App-Identität, keine Scope-Falle)?
- Sollen die **echten Impressums-Angaben** rein — und wenn ja, wie halten wir sie aus
  dem öffentlichen Repo heraus (kein PII-Commit)?

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

Am Ende **dieser** Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach `docs/sessions/VORLAGE_BRIEF.md`
   anlegen — inkl. Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
