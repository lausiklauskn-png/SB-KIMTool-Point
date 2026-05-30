# BRIEF — Truhe im Browser prüfen + Doppel-Status nachziehen + erstes Modul kopieren

Stand: 2026-05-30 · für eine **Nachfolgesitzung** · Branch-Vorschlag `claude/truhe-doppelstatus`

> **In einem Satz:** Die reife **Werkzeugkiste-Truhe** ist jetzt `werkzeuge.html` (aus Sage
> adaptiert, Point-re-geskinnt, offline-first, `npm test` 8/8). Offen sind drei ehrliche
> Dinge: (a) **Klaus' Browser-Lauf** aller vier Seiten inkl. Truhe, (b) den **Sage/Point-
> Doppel-Status** in der Truhe wieder sichtbar machen, und (c) sobald Klaus weitere
> **Zieldateien beistellt**, das **erste reife Modul Datei für Datei** real ins Repo holen.

---

## ⚠️ Lehre (zuerst lesen — sonst Doppelarbeit)

Vor jedem Bau **`git fetch origin main` + gegen `origin/main` arbeiten**, nicht gegen den
vorab gesetzten Branch-Stand. Erst `git log/diff origin/main` ansehen; was dort schon
existiert, nicht neu bauen. Offene PRs sichten und je als merge/close/hold einordnen.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge, **bevor** Code geschrieben wird:

1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (oberster Eintrag „2026-05-30 (B) — Werkzeugkiste-Truhe + Versions-Klarstellung")
3. **diesen Brief** (geplante Aufgabe + Datenverträge)
4. `status.json` (Real-Anteil ~20 %; neues Feld `versionen_hinweis` erklärt 0.1 vs 0.2)
5. Doku + Code der Scheibe: `werkzeuge.html` (die neue Truhe), `werkzeugkiste.json`,
   `assets/style.css`, `assets/app.js`, `docs/WERKZEUGE.md`, `docs/MODELL.md`.

**Erst Überblick, dann bauen. Kein automatischer Freibrief** — größere Design-/Animations-
Umbauten brauchen eine **neue ausdrückliche Freigabe von Klaus**. Datenverträge/Modell-Logik/
Sicherheit ohnehin Plan-vor-Code mit Klaus. Die Leitplanken (Ehrlichkeit, `npm test`,
Kein-PII, Offline/keine CDNs, `prefers-reduced-motion`, eigene Identität) gelten **immer**.

---

## 1. Stand **[Pflicht]**

- **Auf `main` (gemerged, Vorgänger):** Premium-Optik-Ebene über alle vier Seiten (PR #10),
  animierte Modell-Seite (PR #8), Schicht 2/3 (PR #9). `npm test` **8/8 grün**.
- **Diese Sitzung (Branch `claude/werkzeugkiste-truhe`, Draft-PR):**
  - `werkzeuge.html` **ersetzt** durch die **Werkzeugkiste-Truhe** (Klick → Werkzeug-Grid,
    Modal je Tool mit Was/Wie/Einbau/Vibe-Prompt/Kopieren/Test/Querverweise, SVG-Symbole,
    Feenstaub-FX). Re-geskinnt auf Point, offline-first (Truhen-Bild = Gradient; Live-Code-
    Kopieren = ehrlich beschrifteter **Online-Zusatz**, Code wohnt im Sage-Protokol).
  - **Versions-Klarstellung** (0.1 Sage-Protokoll vs 0.2 Run-Vertrag, bewusst verschieden)
    in `sandbox/loop.js`, `docs/MODELL.md`, `status.json` — **keine Wertänderung**.
- **Offen / wartet:**
  - **Klaus' Browser-Sichtprüfung** aller vier Seiten inkl. Truhe (Tablet + Desktop) —
    **ungeprüft, wartet auf Klaus**.
  - **Doppel-Status** (Sage/Point) ist in der Truhe noch **nicht** abgebildet (nur eine Reife).
  - **Daten-Dopplung** Truhe-`TOOLS` vs `werkzeugkiste.json` (siehe Teil 4).
  - **Echte Modul-Kopie** weiter offen (Real-Anteil unverändert ~20 %).

## 2. Ziel dieser Aufgabe **[Pflicht]**

Am Ende sichtbar/beweisbar: (a) Klaus' Browser-Punkte aller vier Seiten inkl. Truhe behoben;
(b) die Truhe zeigt je Tool wieder **ehrlich Sage **und** Point** (Doppel-Status); (c) sobald
Klaus Zieldateien beistellt: **ein** reifes Modul ist als echte Repo-Datei(en) kopiert,
dokumentiert, getestet, `status.json`-Real-Anteil ehrlich nachgezogen.

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**

- **Bauen/Feinschliff:**
  - Restpunkte aus Klaus' Browser-Lauf (Lesbarkeit, Truhen-/Modal-Größe auf Tablet,
    Glow-Stärke, Kachel-Dichte, Performance). **Nur** mit neuer Freigabe größere Umbauten.
  - **Doppel-Status in der Truhe:** je Tool zusätzlich den `point_status` zeigen (z. B.
    zweiter Chip „Point: …"), Quelle = `werkzeugkiste.json`. So bleibt die Honesty-Regel
    „was ist hier echt vs in Sage reif" sichtbar.
  - Sobald Sage-Zieldateien da: erstes reifes Modul (Vorschlag **09 Einbau-PWA** als reine
    Anleitung, oder **01 Storage** als kleinstes Code-Modul) **Datei für Datei** kopieren
    (kein git-clone), eigene Identität, Kopf-Kommentar + Version, **kein Klarname**.
- **Pflegen:** `werkzeugkiste.json` (`point_status` des kopierten Moduls hoch),
  `status.json` (Real-Anteil hoch **nur wenn echt kopiert**), `docs/WERKZEUGE.md`
  (Pflichtfelder Was·Nutzen·Verwendung·Einbau·Aktiviert-durch), `README`.
- **Testen:** für ein echt kopiertes Modul mit Logik `npm test` ergänzen. Truhe selbst:
  optionaler Headless-Anker ist vorhanden (`module.exports` in `werkzeuge.html`), aber als
  HTML nicht von `npm test` geladen — bei Bedarf Tool-Daten in eine `.js`/`.json` auslagern,
  dann testbar. Alle vier Seiten **Browser-Sichttest durch Klaus**.

## 4. Datenverträge / Spec **[Pflicht]**

- **Truhe-`TOOLS` vs `werkzeugkiste.json`:** Derzeit trägt `werkzeuge.html` ihre eigene
  inline `TOOLS`-Liste (id/name/tier/status/task/was/wie/deps/code/smoke/karte).
  `werkzeugkiste.json` bleibt der **maschinenlesbare Record** (id/name/stufe/sage_status/
  point_status/was/nutzen/verwendung/einbau/aktiviert_durch). Wer den Doppel-Status einbaut
  oder die Truhe aus dem JSON speist: **erst das Schema/den Mapping-Vertrag festschreiben**
  (Doku in `docs/WERKZEUGE.md`), dann Code. Tier-Namen Truhe (`must/basic/pro`) vs JSON
  (`basic/pro/profi`) **bewusst mappen**, nicht stillschweigend mischen.
- `run.json` bleibt **v0.2** (nicht brechen); `protocolVersion` (0.1) ≠ `runContractVersion`
  (0.2) — siehe `status.json.versionen_hinweis`, **nicht** angleichen.
- Berührt ein kopiertes Modul ein Schutz-Modul (10/11/12/14/15) → **`ZERTIFIKAT_ASPEKTE`**
  in `sandbox/16_siegel.js` ans Listenende ergänzen (Datum + Modul-ID + ein Satz).
- **Offline-Leitplanke:** Die Truhe muss **ohne Netz** stöberbar bleiben; jeder neue
  externe Zugriff ist **als Online-Zusatz** zu beschriften (wie das Live-Code-Kopieren).

## 5. Akzeptanzkriterien (Erfolgsmerkmale) **[Pflicht]**

1. `npm test` **grün** (inkl. evtl. neuer Modul-Tests).
2. Alle vier Seiten: Klaus' Browser-Punkte behoben; weiterhin offline, keine CDNs zur
   Anzeige, `prefers-reduced-motion` respektiert.
3. Truhe zeigt je Tool **Sage- und Point-Status** (Doppel-Status wieder ehrlich sichtbar).
4. Falls Quelle da: **ein** reifes Modul real im Repo, dokumentiert; `status.json` ehrlich
   nachgezogen. Falls nicht: Blockade weiter **ehrlich benannt**, nichts erfunden.
5. Ehrliche Schließung: für jeden Browser-Teil **„ungeprüft, wartet auf Klaus"**.

## 6. Empfohlene Reihenfolge (Einzelschritte)

1. **`git fetch origin main`**, `git log/diff origin/main`, offene PRs sichten — gegen den
   echten `main`-Stand arbeiten.
2. Klaus' Browser-Rückmeldung zu allen vier Seiten (inkl. Truhe) einsammeln, Restpunkte beheben.
3. Doppel-Status in der Truhe: Mapping-Vertrag Truhe↔`werkzeugkiste.json` in `docs/WERKZEUGE.md`
   festschreiben, dann `point_status`-Chip ergänzen.
4. Mit Sage-Zieldateien: erstes reifes Modul Datei für Datei kopieren, Doku + Test,
   `status.json` nachziehen.
5. PULS + neuer Brief, Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**

## 7. Offene Fragen an Klaus

- **Welche Zieldatei(en) als nächstes beistellen** für die erste echte Modul-Kopie
  (Vorschlag **09 Einbau-PWA** als Anleitung, oder **01 Storage** als kleinstes Code-Modul)?
- Soll die Truhe langfristig **aus `werkzeugkiste.json` gespeist** werden (eine Datenquelle),
  oder bleibt die inline `TOOLS`-Liste bewusst getrennt?
- GitHub Pages auf `main` für den bequemen Live-Sichttest?

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

Am Ende **dieser** Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach `docs/sessions/VORLAGE_BRIEF.md`
   anlegen — inkl. Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
