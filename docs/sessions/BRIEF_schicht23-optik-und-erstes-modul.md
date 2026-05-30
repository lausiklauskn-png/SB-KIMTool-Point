# BRIEF — Schicht 2/3 fertig polieren + erstes reifes Sage-Modul (sobald Quelle da)

Stand: 2026-05-30 · für eine **Nachfolgesitzung** · Branch-Vorschlag `claude/schicht23-politur`

> **In einem Satz:** Schicht 2/3 sind optisch auf das Modell-Niveau gehoben (PR folgt) —
> jetzt (a) **Klaus' Browser-Lauf** aller vier Seiten einsammeln und Restpunkte beheben,
> (b) optional Schicht 2/3 dezent **animieren** (eigener Freibrief nötig), und
> (c) das **erste reife Sage-Modul Datei für Datei** kopieren — **erst möglich, wenn die
> Sage-Quelle erreichbar ist** (siehe Befund unten).

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge, **bevor** Code geschrieben wird:

1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (aktueller Stand — Nachtrag 2026-05-30 zu Schicht 2/3)
3. **diesen Brief** (geplante Aufgabe + Datenverträge)
4. `status.json` (Real-Anteil; `runContractVersion: 0.2`, real_anteil ~20 %)
5. Doku + Code der Scheibe: `assets/style.css`, `assets/app.js`, `werkzeuge.html`,
   `markt.html`, `modell.html` + `assets/model.js`; `werkzeugkiste.json`,
   `web/data/marktplatz.json`.

**Erst Überblick, dann bauen:** relevanten Code lesen, Plan formulieren, offene PRs
sichten. **Kein automatischer Freibrief** — für größere Design-/Animations-Umbauten eine
**neue ausdrückliche Freigabe** von Klaus holen. Datenverträge/Modell-Logik/Sicherheit
ohnehin Plan-vor-Code mit Klaus.

---

## 1. Stand **[Pflicht]**

- **Zuletzt gebaut (Branch `claude/feinschliff-erstes-modul-KOnAU`, Draft-PR folgt):**
  Schicht 2 (Werkbank) + 3 (Schaufenster) optisch auf Modell-Niveau — Reife-Spine in
  Lampen-Farben, Mono-Orbs, Status-Chips mit Glow, Hover-Lift, Stufen-Legende,
  Reife-Schlüssel, Markt-Karten mit Monogramm/Status/Echt-Chip. Reine Design-/UX-Arbeit,
  Datenverträge unberührt. `npm test` **8/8 grün**.
- **Gestapelt auf PR #8:** Dieser Branch hängt auf der Animations-Arbeit (`model.js`,
  Ingenieur, `run.json` v0.2) aus dem offenen Draft-**PR #8**
  (`claude/agenten-animation-r4i7f`) auf. **Merge-Reihenfolge: erst #8, dann dieser PR.**
- **Offen / wartet:** Klaus' Browser-Sichtprüfung **aller vier Seiten** (Tablet + Desktop).
- **Bewusst NICHT gemacht — Befund:** Kein reifes Sage-Modul kopiert, weil die
  **Sage-Quelle in der Ausführungsumgebung nicht erreichbar** ist (kein `Sage-Protokol/`,
  Repo-Zugriff auf `sb-kimtool-point` beschränkt, kein Netz zu anderen Repos). „Datei für
  Datei kopieren" braucht Sicht auf die Quelldateien; Erfinden ist verboten.

## 2. Ziel dieser Aufgabe **[Pflicht]**

Am Ende sichtbar/beweisbar: (a) Klaus' Browser-Punkte aller vier Seiten sind behoben;
(b) optional Schicht 2/3 dezent belebt (nur mit neuem Freibrief), ohne Funktionsverlust;
(c) **sobald die Sage-Quelle bereitsteht**: ein reifes Modul real im Repo, dokumentiert,
getestet, `status.json`-Real-Anteil ehrlich nachgezogen.

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**

- **Bauen/Feinschliff:**
  - Restpunkte aus Klaus' Browser-Lauf (Performance Tablet, Lesbarkeit, Knopf-Beschriftungen,
    Kachel-Dichte) aller vier Seiten abarbeiten.
  - Optional: Schicht 2/3 dezent animieren (Karten-Einblendung, Chip-Glow) — **erst neuer
    Freibrief**, `prefers-reduced-motion` respektieren.
  - **Sobald Sage-Quelle da:** erstes reifes Modul auswählen (Vorschlag **09 Einbau-PWA**
    oder **19 Andock-Wizard**), **Datei für Datei** kopieren (kein git-clone), eigene
    Identität, Kopf-Kommentar + Version, **kein Klarname** (Kein-PII).
- **Pflegen:** `werkzeugkiste.json` / `status.json` (Real-Anteil hochsetzen, sobald ein
  Modul echt kopiert ist) / `docs/WERKZEUGE.md` (Pflichtfelder Was·Nutzen·Verwendung·
  Einbau·Aktiviert-durch) / `README`.
- **Testen:** für ein echt kopiertes Modul **headless `npm test`** ergänzen, falls es Logik
  trägt. Alle vier Seiten **Browser-Sichttest durch Klaus**.

## 4. Datenverträge / Spec **[Pflicht, falls Module/Dateien Daten teilen]**

- `run.json` bleibt **v0.2** (nicht brechen). Erweiterungen nur additiv + Doku zuerst.
- `werkzeugkiste.json`-Schema (id/name/stufe/sage_status/point_status/was/nutzen/
  verwendung/einbau/aktiviert_durch + `stufen`-Texte) nicht stillschweigend ändern.
- Berührt das kopierte Modul ein Schutz-Modul (10/11/12/14/15) → **`ZERTIFIKAT_ASPEKTE`**
  in `sandbox/16_siegel.js` ans Listenende ergänzen (Datum + Modul-ID + ein Satz).

## 5. Akzeptanzkriterien (Erfolgsmerkmale) **[Pflicht]**

1. `npm test` **grün** (inkl. evtl. neuer Modul-Tests).
2. Alle vier Seiten: Klaus' Browser-Punkte behoben; weiterhin zero-dependency, offline,
   `prefers-reduced-motion` respektiert.
3. Schicht 2/3 bleiben optisch konsistent zur Modell-Seite, **ohne** Funktionsverlust.
4. Falls Quelle da: ein reifes Modul real im Repo, dokumentiert; `status.json`-Real-Anteil
   ehrlich nachgezogen.
5. Ehrliche Schließung: für jeden Browser-Teil **„ungeprüft, wartet auf Klaus"**, bis er es ansieht.

## 6. Empfohlene Reihenfolge (Einzelschritte)

1. Offene PRs sichten/klassifizieren (merge/close/hold). **PR #8 zuerst** klären — dieser
   Branch hängt darauf auf.
2. Klaus' Browser-Rückmeldung zu allen vier Seiten einsammeln und Restpunkte beheben.
3. **Klären, ob/wann die Sage-Quelle erreichbar wird** (lokales Verzeichnis? zusätzliches
   Repo im Scope?). Ohne Quelle: Modul-Kopie weiter vertagen, ehrlich benennen.
4. Mit Quelle: erstes reifes Modul Datei für Datei kopieren, Doku + Test, `status.json` nachziehen.
5. PULS + neuer Brief, Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**

## 7. Offene Fragen an Klaus

- **Wie wird die Sage-Quelle erreichbar?** (Verzeichnis ins Repo legen, das Sage-Repo in
  den MCP-Scope nehmen, oder die Zieldateien manuell beistellen?) — ohne sie keine echte Kopie.
- Schicht 2/3 zusätzlich animieren (eigener Freibrief) oder beim ruhigen Hover-Stand belassen?
- GitHub Pages auf `main` zeigen lassen für den Live-Sichttest?

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

Am Ende **dieser** Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach `docs/sessions/VORLAGE_BRIEF.md`
   anlegen — inkl. Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
