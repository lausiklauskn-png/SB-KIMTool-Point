# Folge-Brief — Identitäts-Hygiene Schritt 3: netzweiter Rollout Modus A/B

> Setzt die Brief-Kette aus `CLAUDE.md` fort. Freibrief gilt (CLAUDE.md § Branch &
> PR-Workflow): eigene, getestete, abgegrenzte PRs selbst mergen; bei echtem Zweifel
> erst Klaus fragen.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge:

1. `CLAUDE.md` (Verfassung + Freibrief + Achtsamkeit „vor dem Bauen Basis prüfen").
2. `PULS.md` (Nachtrag 2026-07-08 — Schritt 2 gemerged: PR #98).
3. **diesen Brief**.
4. Skill `saubere-netz-anmeldung/SKILL.md` (verbindliche Reihenfolge Modus A/B).
5. `status.json` + der Code der Scheibe: `web/tools/sbkim-rendezvous.js` + `-ui.js`
   (Modus A/B) und die App-eigene Verdrahtung `assets/rendezvous-init.js` +
   `assets/sbkim-storage-init.js`. Vorbild-Tool: das Repo **Kim-Bell** (PR #1 gemerged).

**Erst Überblick, dann bauen.** Offene PRs vorher sichten.

## 1. Stand **[Pflicht]**
- **Schritt 1 (PR #97, gemerged):** SB-KIMTool-Point öffnet die eigene Schublade
  `sbkim_toolpoint` (Modus-A-Hälfte / eigene DB).
- **Schritt 2 (PR #98, gemerged):** Modul 23 um **Modus A** (`ensureIdentity`) +
  **Modus B** (`repairAndReconnect` + `cleanupSharedOrigin`) erweitert; UI-Knopf
  „🧹 Aufräumen & neu anmelden"; `rendezvous-init.js` fährt Modus A beim Mount.
  `node --test` 103/103, Smoke 148/148.
- **Kim-Bell (Repo, PR #1 gemerged):** eigenständiges, kopierbares „Mit dem Netz
  verbinden"-Werkzeug (PWA + byte-1:1-Modul-Kopien + Drift-Guard). node --test 4/4.
- **Offen:** dieselbe Modus-A/B-Erweiterung fehlt noch in den anderen PWAs; Klaus'
  Browser-Sichttest steht aus.

## 2. Ziel dieser Aufgabe **[Pflicht]**
Die Modus-A/B-Hygiene (eigene Schublade + `ensureIdentity` beim Laden + „Aufräumen &
neu anmelden"-Knopf) in **die übrigen SBKIM-PWAs** tragen, je Repo ein eigener PR, mit
jeweils eigenem, eindeutigem `dbSuffix`. Danach ist die Adress-Wand netzweit gelöst.

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**
- **Bauen (pro Repo, je eigener PR):** Modul 23 (`rendezvous`+`ui`) byte-gleich auf den
  Schritt-2-Stand bringen (aus `SB-KIMTool-Point/web/tools/*` bzw. Kim-Bell), einen
  `storage-init` mit **eigenem** `dbSuffix` VOR die identitäts-nutzenden Skripte setzen,
  `rendezvous-init` auf `ensureIdentity:true` + `dbSuffix` umstellen. Kandidaten +
  vorgeschlagene Suffixe: Mixarium `mixarium`, Rezeptbuch `rezeptbuch`, BookLedgerPro
  `bookledgerpro`, family-project `family`, Such-Tool/Pinnwand nach Bedarf.
- **Pflegen:** je Repo PULS/SIGNAL nachziehen; Drift-Guard grün halten.
- **Testen:** Headless-Smoke je Repo grün; **Browser-Sichttest durch Klaus** (Modus-B-Knopf
  real, Mycel-Karte: jede App zeigt eine EIGENE nodeId).

## 4. Datenverträge / Spec **[Pflicht]**
- Keine neuen Verträge. **TABU unberührt:** `PROVIDER_MIN_MATCH` (0.80-Riegel),
  `DB_VERSION`, `PROTOCOL_VERSION`. Kern-Module 01/02/05/05b/23 nur über öffentliche Flächen.
- Karten-Kontrakt bleibt `{kind:"sbkim-presence", nodeId, nodeName, spore, ts}`, Tag `sbkim-rdv`.

## 5. Akzeptanzkriterien **[Pflicht]**
- Modus A idempotent (zweites Laden ändert nichts, löscht nie); Modus B löscht nur den
  geteilten `sbkim`-Topf + SW + Caches, NICHT die eigene Schublade.
- Headless-Smoke + Drift-Guard je Repo grün.
- Ehrliche Schließung: „Browser-Sichttest wartet auf Klaus" bis er es live gesehen hat.

## 6. Empfohlene Reihenfolge (Einzelschritte)
1. **Zuerst Klaus' Browser-Sichttest** von Schritt 2 + Kim-Bell abwarten/bestätigen
   (deployt von `main`) — bestätigt das Muster, bevor es in 4+ Repos vervielfältigt wird.
2. Dann Rollout Repo für Repo (Mixarium → Rezeptbuch → BLP → family), je eigener PR.
3. family-project ggf. auf das geteilte Modul 23 refactoren (family war der Prototyp).

## 7. Offene Fragen an Klaus
- Reihenfolge der Repos beim Rollout? (Vorschlag: Mixarium zuerst, dort lief der erste
  Cross-App-Sichttest.)
- Soll Kim-Bell zusätzlich in die Werkzeugkiste/Startseite verlinkt werden?

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

Am Ende **dieser** Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach der Vorlage anlegen — inkl.
   Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. Freibrief gilt:
   getestete, abgegrenzte PRs selbst mergen; bei echtem Zweifel erst Klaus fragen.
