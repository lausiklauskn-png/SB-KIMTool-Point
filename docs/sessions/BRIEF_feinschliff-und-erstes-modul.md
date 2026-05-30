# BRIEF — Optik-Feinschliff der Schichten 2/3 + erstes reifes Sage-Modul kopieren

Stand: 2026-05-30 · für eine **Nachfolgesitzung** · Branch-Vorschlag `claude/feinschliff-erstes-modul`

> **In einem Satz:** Die animierte Modell-Seite ist gebaut und entwickler-geprüft —
> jetzt (a) **Klaus' Browser-Lauf** der Modell-Seite einsammeln und Restpunkte beheben,
> (b) die Schichten **Werkzeuge/Markt** behutsam auf das neue Optik-Niveau heben, und
> (c) das **erste reife Sage-Modul Datei für Datei** herüberholen.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge, **bevor** Code geschrieben wird:

1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (aktueller Stand — Nachtrag 2026-05-30 zur Animation)
3. **diesen Brief** (geplante Aufgabe + Datenverträge)
4. `status.json` (Real-Anteil; `runContractVersion: 0.2`)
5. Doku + Code der Scheibe: `docs/MODELL.md`, `docs/BAUTRUPP.md`, `assets/model.js`,
   `assets/app.js`, `assets/style.css`, `sandbox/loop.js` + `sandbox/roles/*`.

**Erst Überblick, dann bauen:** relevanten Code lesen, Plan formulieren, offene PRs
sichten. Für **reine Design-/UX-Gestaltung gilt KEIN automatischer Freibrief mehr** —
der war auf die Animations-Aufgabe befristet und ist ausgelaufen. Diese Sitzung zeigt
ihren Plan kurz an Klaus (Chat) und holt für Design eine **neue ausdrückliche Freigabe**,
falls ein größerer Umbau ansteht. Datenverträge/Sicherheit ohnehin nur mit Klaus.

---

## 1. Stand **[Pflicht]**

- **Zuletzt gebaut (dieser Branch `claude/agenten-animation-r4i7f`, Draft-PR):** animierte
  Modell-Seite (`modell.html` + `assets/model.js`), neue Rolle **Ingenieur**, Negativbauer
  als Angreifer, `run.json`-Vertrag **v0.2**. `npm test` **8/8 grün**. Entwickler-Smoke-Test
  mit Playwright ok; **Klaus' Browser-Lauf steht aus**.
- **Offen / wartet:** Klaus' Sichtprüfung der Modell-Seite (Tablet + Desktop); danach
  Merge-Entscheidung. PR #7 (Brief-Doku) evtl. noch offen — vor Bau klassifizieren.
- **Bewusst noch nicht gemacht:** Schicht 2/3 sind optisch noch auf altem Stand; kein
  reifes Sage-Modul ist real kopiert.

## 2. Ziel dieser Aufgabe **[Pflicht]**

Am Ende sichtbar/beweisbar: (a) die in Klaus' Browser-Lauf gefundenen Punkte der
Modell-Seite sind behoben; (b) Werkzeuge/Markt wirken mit der Modell-Seite **wie aus
einem Guss** (gleiche Karten/Akzente), ohne Funktionsverlust; (c) **ein** reifes
Sage-Modul ist als echte Datei(en) im Repo, dokumentiert und — falls sinnvoll — getestet.

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**

- **Bauen/Feinschliff:**
  - Restpunkte aus Klaus' Browser-Lauf der Modell-Seite (Performance Tablet, Lesbarkeit,
    Knopf-Beschriftungen) abarbeiten.
  - Schicht 2 (`werkzeuge.html`) und 3 (`markt.html`) optisch angleichen (gemeinsame
    Karten/Chips/Hover aus `style.css` wiederverwenden) — **erst Plan an Klaus**.
  - Erstes reifes Sage-Modul auswählen (Vorschlag: **09 Einbau-PWA** oder ein klar
    abgegrenztes Hintergrund-Tool) und **Datei für Datei** kopieren (kein git-clone),
    mit eigener Identität, Kopf-Kommentar + Version, **kein Klarname** (Kein-PII).
- **Pflegen:** `werkzeugkiste.json` / `status.json` (Real-Anteil hochsetzen, wenn ein
  Modul echt kopiert ist) / `docs/WERKZEUGE.md` (Pflichtfelder Was·Nutzen·Verwendung·
  Einbau·Aktiviert-durch) / `README`.
- **Testen:** für ein echt kopiertes Modul **headless `npm test`** ergänzen, falls es
  Logik trägt. Modell-Seite + Schichten 2/3 **Browser-Sichttest durch Klaus**.

## 4. Datenverträge / Spec **[Pflicht, falls Module/Dateien Daten teilen]**

- `run.json` bleibt **v0.2** (nicht brechen). Erweiterungen nur additiv + Doku zuerst.
- Berührt das kopierte Modul ein Schutz-Modul (10/11/12/14/15) → **`ZERTIFIKAT_ASPEKTE`**
  in `sandbox/16_siegel.js` ans Listenende ergänzen (Datum + Modul-ID + ein Satz).
- Werkzeugkiste-Schema (`werkzeugkiste.json`) nicht stillschweigend ändern; bei Bedarf
  Schema zuerst dokumentieren.

## 5. Akzeptanzkriterien (Erfolgsmerkmale) **[Pflicht]**

1. `npm test` **grün** (inkl. evtl. neuer Modul-Tests).
2. Modell-Seite: Klaus' Browser-Punkte behoben; weiterhin zero-dependency, offline,
   `prefers-reduced-motion` respektiert.
3. Schicht 2/3 optisch konsistent zur Modell-Seite, **ohne** Funktionsverlust.
4. Ein reifes Modul ist real im Repo, dokumentiert; `status.json`-Real-Anteil ehrlich nachgezogen.
5. Ehrliche Schließung: für jeden Browser-Teil **„ungeprüft, wartet auf Klaus"**, bis er es ansieht.

## 6. Empfohlene Reihenfolge (Einzelschritte)

1. Offene PRs sichten/klassifizieren (merge/close/hold), Konfliktdateien markieren.
2. Klaus' Browser-Rückmeldung zur Modell-Seite einsammeln und Restpunkte beheben.
3. Plan für Schicht-2/3-Angleichung kurz an Klaus → nach Freigabe umsetzen.
4. Erstes reifes Modul auswählen, Datei für Datei kopieren, Doku + Test, `status.json` nachziehen.
5. PULS + neuer Brief, Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**

## 7. Offene Fragen an Klaus

- Welches reife Sage-Modul zuerst (Vorschlag 09 Einbau-PWA)?
- Schicht 2/3 nur angleichen oder auch animieren (eigener Freibrief nötig)?
- GitHub Pages auf `main` zeigen lassen für den Live-Sichttest?

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

Am Ende **dieser** Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach `docs/sessions/VORLAGE_BRIEF.md`
   anlegen — inkl. Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
