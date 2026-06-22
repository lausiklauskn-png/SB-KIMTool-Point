# BRIEF — Browser-Lauf bestätigen (01+02) + drittes echtes Werkzeug + PR #11 final

Stand: 2026-05-30 (nach Sitzung D) · für die Nachfolgesitzung · Branch-Vorschlag `claude/drittes-werkzeug`

> In einem Satz: Zwei echte, offline einbaubare Werkzeuge stehen (01 Storage, 02 Spore;
> Suite 25/25) — jetzt Klaus' Browser-Lauf bestätigen, PR #11 endgültig entscheiden und das
> nächste reife Modul real liefern (Vorschlag 19 Andock-Wizard oder 09 Einbau-PWA).

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge, **bevor** Code entsteht:

1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (oberster Eintrag „2026-05-30 (D)")
3. **dieser Brief** (geplante Aufgabe + Datenverträge)
4. `status.json` (Real-Anteil ~24 %)
5. Code der Scheibe: `web/tools/sbkim-spore.js`, `web/tools/sbkim-storage.js`,
   `test/spore.test.js`, `test/storage.test.js`, `assets/app.js`
   (`TOOL_FILES`/`renderWerkzeuge`/`point_hinweis`), `werkzeugkiste.json`, `docs/WERKZEUGE.md`.

**Erst Überblick, dann bauen:** relevanten Code lesen, Plan formulieren, Plan kurz an Klaus
zeigen, Rückmeldung abwarten — **nicht sofort losbauen**. Offene PRs vorher sichten.
**Kein automatischer Freibrief** — eine neue Sitzung braucht eine neue ausdrückliche Freigabe.
Leitplanken (Ehrlichkeit, `npm test`, Kein-PII, Offline/keine CDNs, `prefers-reduced-motion`)
gelten **immer**.

---

## 1. Stand **[Pflicht]**
- **main**: vier Seiten + Premium-Optik (#10) **und** zwei echte, offline einbaubare Werkzeuge
  **01 Storage** + **02 Spore** (`web/tools/`), in die Premium-`renderWerkzeuge` integriert:
  `TOOL_FILES`, Knöpfe „Code kopieren/Datei laden", `point_hinweis`-Block. **`npm test` 27/27**
  (8 Modell + 9 Storage + 10 Spore). Gemerged via PR #13 (Sitzung D; PR #12 inhaltlich enthalten).
- **PR #11** (`claude/sb-kimtool-point-dev-V0MFr`, Draft): Truhe ersetzt `werkzeuge.html`
  komplett. **HOLD** — überschneidet sich mit der integrierten Werkzeug-Linie (gleiche Dateien).
  Merge/Schließen entscheidet Klaus.
- **Offen:** Browser-Sichttest (vier Premium-Seiten, Knöpfe 01+02, IndexedDB- + WebCrypto-Pfad)
  — wartet auf Klaus. GitHub Pages auf `main` aktivieren. PR #11 final entscheiden.

## 2. Ziel dieser Aufgabe **[Pflicht]**
(a) Browser-Lauf bestätigt vier Seiten + Liefer-Knöpfe (01+02) + IndexedDB- und WebCrypto-Pfad;
(b) drittes echtes, offline einbaubares Werkzeug geliefert + getestet; (c) PR #11 final
entschieden (eine Quelle der Wahrheit für die Werkzeuge-Ansicht).

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**
- **Bauen:** nächstes reifes Modul als echte Datei `web/tools/sbkim-<name>.js` (Vorschlag
  **19 Andock-Wizard** — nutzt 02 Spore + 01 Storage, ist der Eingang neuer Knoten; oder
  **09 Einbau-PWA**). Eine Datei, keine Deps, UMD-Muster wie 01/02. Browser-Anforderungen
  ehrlich im Kopf-Kommentar + via `point_hinweis` auf der Seite. Headless-Test in `test/`.
- **Pflegen:** `TOOL_FILES` (app.js) um die neue ID; `werkzeugkiste.json` (`datei` +
  `point_status` + `point_hinweis`); `status.json` (Real-Anteil); `docs/WERKZEUGE.md`;
  `README.md` (Test-Zähler).
- **Testen:** `npm test` muss grün bleiben (inkl. neuer Fälle). **Browser-Sichttest durch
  Klaus** für alle Liefer-Knöpfe + neue Browser-Pfade.

## 4. Datenverträge / Spec **[Pflicht]**
- **Modul-Liefervertrag** („echt geliefert" = alle vier): (1) Datei `web/tools/<name>.js`,
  (2) Feld `datei` in `werkzeugkiste.json`, (3) Eintrag in `TOOL_FILES` (`app.js`),
  (4) Headless-Test in `test/`. Nur dann zeigt die Seite „Code kopieren/Datei laden".
- **UMD-Muster:** `module.exports` + globalThis-Registrierung, abhängigkeitsfrei (wie 01/02).
- **`point_hinweis`** (optional) wird jetzt auf der Karte gerendert → für ehrliche Browser-
  Anforderungen/Belege nutzen.
- Berührt ein Modul ein Schutz-Modul (10/11/12/14/15) → **`ZERTIFIKAT_ASPEKTE`** in
  `sandbox/16_siegel.js` ergänzen. Offline: Kopieren/Laden zieht nur Repo-Dateien.
- **Falls #11 merge:** zuerst **Mapping-Vertrag** Truhe↔`werkzeugkiste.json` in
  `docs/WERKZEUGE.md` festschreiben (Spec vor Code), dann Liefer-Mechanismus + Doppel-Status
  **additiv** in die Truhe (Tool-Texte/Modal nicht antasten — Klaus' Vorgabe).

## 5. Akzeptanzkriterien **[Pflicht]**
1. `npm test` grün (inkl. neuer Werkzeug-Tests).
2. Neue `sbkim-<name>.js` offline, eine Datei; Seite bietet „Code kopieren/Datei laden";
   Browser-Anforderung ehrlich vermerkt (Kopf + `point_hinweis`).
3. PR #11 final entschieden; **eine** Quelle der Wahrheit für die Werkzeuge-Ansicht.
4. `status.json`/`werkzeugkiste.json`/`docs`/`README` nachgezogen.
5. Browser-Teile ehrlich: „ungeprüft, wartet auf Klaus".

## 6. Empfohlene Reihenfolge (Einzelschritte)
1. `git fetch origin main`; PRs sichten (#11 + dieser); gegen `origin/main` arbeiten.
   **PR-#11-Entscheidung bei Klaus einholen.**
2. Klaus' Browser-Rückmeldung (01+02) einsammeln, Restpunkte beheben.
3. Drittes Werkzeug + Test; `npm test` grün; `TOOL_FILES`/JSON/Doku/README nachziehen.
4. Falls #11 merge: erst Mapping-Vertrag, dann Mechanismus/Doppel-Status additiv in die Truhe.
5. PULS + neuer Brief, Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**

## 7. Offene Fragen an Klaus
- PR #11: jetzt **merge, close oder weiter hold**? (kollidiert mit der integrierten Linie)
- Nächstes Werkzeug: **19 Andock-Wizard** (nutzt 01+02) oder **09 Einbau-PWA**?
- GitHub Pages auf `main` aktiviert? Wann Sage-Quelldateien für echte 1:1-Kopie?

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

Am Ende der Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach `docs/sessions/VORLAGE_BRIEF.md`
   anlegen — inkl. Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
