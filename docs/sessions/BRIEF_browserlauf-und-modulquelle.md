# BRIEF — Klaus' Browser-Lauf einsammeln + Sage-Modulquelle erreichbar machen

Stand: 2026-05-30 · für eine **Nachfolgesitzung** · Branch-Vorschlag `claude/browserlauf-modulquelle`

> **In einem Satz:** Schicht 1/2/3 sind optisch fertig und auf `main` gemerged (PR #8 + #9) —
> jetzt sind nur noch **zwei echte Dinge offen**: (a) **Klaus' Browser-Lauf** aller vier
> Seiten einsammeln und Restpunkte beheben, und (b) die **Sage-Modulquelle erreichbar
> machen**, damit endlich ein reifes Modul **Datei für Datei** kopiert werden kann.

---

## ⚠️ Lehre aus der Vorgänger-Sitzung (bitte zuerst lesen — sonst Doppelarbeit)

Die Vorgänger-Sitzung bekam einen veralteten Brief (`BRIEF_schicht23-politur`), der die
Schicht-2/3-Politur als „noch offen" beschrieb. **Sie war aber längst in `main` gemerged**
(PR #8 + #9). Der zugewiesene Branch hing zudem am alten **Gründungs-Skelett**, nicht an
`main`. Ergebnis: die Politur wurde versehentlich **redundant neu gebaut** — Wegwerfarbeit.

**Konsequenz für dich:** Vor jedem Bau **`git fetch origin main` + gegen `origin/main`
arbeiten** (nicht gegen den vorab gesetzten Branch-Stand). Erst `git log origin/main` und
`git diff origin/main` ansehen; was dort schon existiert, nicht noch einmal bauen. Das ist
exakt die Verfassungsregel „immer gegen das aktuelle `main` arbeiten" — sie wurde verletzt,
weil der Branch-Stand blind geglaubt wurde.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge, **bevor** Code geschrieben wird:

1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (aktueller Stand — Nachträge 2026-05-30 zu Animation + Schicht-2/3-Optik)
3. **diesen Brief** (geplante Aufgabe + Datenverträge)
4. `status.json` (Real-Anteil ~20 %; Hinweis: `protocolVersion` steht dort auf `0.1`,
   `web/data/run.json` trägt aber bereits `0.2` — kleine Inkonsistenz, siehe Teil 3).
5. Doku + Code der Scheibe: `docs/MODELL.md`, `docs/BAUTRUPP.md`, `assets/model.js`,
   `assets/app.js`, `assets/style.css`, `modell.html`/`werkzeuge.html`/`markt.html`,
   `sandbox/loop.js` + `sandbox/roles/*`.

**Erst Überblick, dann bauen.** **Kein automatischer Freibrief** — der Gestaltungs-Freibrief
der Vorsitzung ist mit deren Abschluss **ausgelaufen**. Für neue Design-/Animations-Umbauten
braucht es eine **neue ausdrückliche Freigabe von Klaus**. Datenverträge/Modell-Logik/
Sicherheit ohnehin Plan-vor-Code mit Klaus.

---

## 1. Stand **[Pflicht]**

- **Auf `main` (gemerged):** animierte Modell-Seite (`model.js`, Rolle Ingenieur,
  Negativbauer-Angreifer, `run.json` v0.2 — PR #8) **und** Schicht 2/3 auf Modell-Optik-
  Niveau (Reife-Spine, Mono-Orbs, Status-Chips, Stufen-Legende, Reife-Schlüssel,
  Markt-Karten mit Status-/Echt-Chip — PR #9). `npm test` **8/8 grün**.
- **Keine offenen PRs** zum Zeitpunkt dieses Briefs (Stand prüfen, nicht glauben).
- **Offen / wartet:** **Klaus' Browser-Sichtprüfung aller vier Seiten** (Start · Modell ·
  Werkzeuge · Markt) auf Tablet + Desktop — bisher nur Entwickler-Smoke-Tests, **ungeprüft,
  wartet auf Klaus**.
- **Blockiert:** Es ist **noch kein reifes Sage-Modul real kopiert** (`point_status` aller
  Module ist `modell-prototyp` oder `noch-nicht-kopiert`). Grund: die **Sage-Quelle ist in
  dieser Umgebung nicht erreichbar** — GitHub-Scope nur `sb-kimtool-point`; Sage „public"
  allein **genügt dem Scope nicht**. Ohne Quelle kein „Datei für Datei", kein Erfinden.

## 2. Ziel dieser Aufgabe **[Pflicht]**

Am Ende sichtbar/beweisbar: (a) die in Klaus' Browser-Lauf gefundenen Punkte aller vier
Seiten sind behoben; (b) die Sage-Quelle ist geklärt/erreichbar gemacht und — sobald da —
**ein** reifes Modul ist als echte Datei(en) im Repo, dokumentiert, getestet, mit ehrlich
nachgezogenem `status.json`-Real-Anteil.

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**

- **Bauen/Feinschliff:** Restpunkte aus Klaus' Browser-Lauf aller vier Seiten (Tablet-
  Performance, Lesbarkeit, Knopf-/Chip-Beschriftungen, Kachel-Dichte). **Nur** mit neuer
  Freigabe größere Design-Änderungen. Sobald Sage-Quelle da: erstes reifes Modul (Vorschlag
  **09 Einbau-PWA** oder **19 Andock-Wizard**) **Datei für Datei** kopieren (kein git-clone),
  eigene Identität, Kopf-Kommentar + Version, **kein Klarname** (Kein-PII).
- **Pflegen:**
  - Kleine **Ehrlichkeits-Korrektur** prüfen: `status.json.protocolVersion` (`0.1`) vs.
    `run.json.protocolVersion` (`0.2`) angleichen — **Spec/Doku zuerst**, dann Wert ziehen.
  - `werkzeugkiste.json` (`point_status` des kopierten Moduls hoch) / `status.json`
    (Real-Anteil hoch **nur wenn echt kopiert**) / `docs/WERKZEUGE.md` (Pflichtfelder
    Was·Nutzen·Verwendung·Einbau·Aktiviert-durch) / `README`.
- **Testen:** für ein echt kopiertes Modul mit Logik `npm test` ergänzen. Alle vier Seiten
  **Browser-Sichttest durch Klaus**.

## 4. Datenverträge / Spec **[Pflicht]**

- `run.json` bleibt **v0.2** (nicht brechen). Erweiterungen nur additiv + Doku zuerst.
- **Render-Verträge der Seite (nicht stillschweigend brechen):** `assets/app.js` mappt
  `werkzeugkiste.json.sage_status` → Reife-Klasse/Chip (`REIFE`), `point_status` → Chip
  (`POINT`) und `stufen[*]` → Stufen-Legende; `markt.json`-Felder `status`/`echt` → Chips.
  Neue Status-/Stufen-Werte dort ergänzen, sonst Fallback. `werkzeugkiste.json`-Schema
  (`schemaVersion`/`stufen`/`module[]`) nicht stillschweigend ändern.
- Berührt das kopierte Modul ein Schutz-Modul (10/11/12/14/15) → **`ZERTIFIKAT_ASPEKTE`**
  in `sandbox/16_siegel.js` ans Listenende ergänzen (Datum + Modul-ID + ein Satz).

## 5. Akzeptanzkriterien (Erfolgsmerkmale) **[Pflicht]**

1. `npm test` **grün** (inkl. evtl. neuer Modul-Tests).
2. Alle vier Seiten: Klaus' Browser-Punkte behoben; weiterhin zero-dependency, offline,
   `prefers-reduced-motion` respektiert.
3. Optik bleibt über alle vier Seiten konsistent, **ohne** Funktionsverlust.
4. Falls Quelle da: **ein** reifes Modul real im Repo, dokumentiert; `status.json` ehrlich
   nachgezogen. Falls nicht: Blockade weiter **ehrlich benannt**, nichts erfunden.
5. Ehrliche Schließung: für jeden Browser-Teil **„ungeprüft, wartet auf Klaus"**.

## 6. Empfohlene Reihenfolge (Einzelschritte)

1. **`git fetch origin main`**, `git log/diff origin/main` ansehen, offene PRs sichten —
   gegen den **echten** `main`-Stand arbeiten (Lehre oben).
2. Klaus' Browser-Rückmeldung zu allen vier Seiten einsammeln und Restpunkte beheben.
3. Sage-Quelle erreichbar machen — konkret: Sage-Repo in den **MCP-Scope** nehmen **oder**
   Zieldateien **beistellen**. Ohne Quelle: Modul-Kopie weiter vertagen, ehrlich benennen.
4. Mit Quelle: erstes reifes Modul Datei für Datei kopieren, Doku + Test, `status.json` nachziehen.
5. (Optional, klein) `protocolVersion`-Inkonsistenz angleichen.
6. PULS + neuer Brief, Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**

## 7. Offene Fragen an Klaus

- **Wie wird die Sage-Quelle erreichbar?** Sage-Repo in den MCP-Scope aufnehmen, oder die
  Zieldateien des gewünschten Moduls beistellen? („public" allein genügt dem Scope hier nicht.)
- Welches reife Modul zuerst (Vorschlag **09 Einbau-PWA**)?
- GitHub Pages auf `main` zeigen lassen für den bequemen Live-Sichttest?

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

Am Ende **dieser** Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach `docs/sessions/VORLAGE_BRIEF.md`
   anlegen — inkl. Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
