# BRIEF — Komplett-Werkzeuge pflegen + Quittung an Sage + Live-Sync prüfen

Stand: 2026-06-20 · für eine **Nachfolgesitzung** · Branch-Vorschlag `claude/komplett-werkzeuge-pflege`

> **Was diese Sitzung tun soll, in einem Satz:** Die zwei aufgenommenen Komplett-Werkzeuge
> (Andock-Werkzeug, Komplett-Knoten) **aktuell halten**, die **Quittung an Sage** über den
> Briefkasten abschicken und prüfen, ob unser lokal gespiegelter Stand byte-gleich mit
> Sages Quelle ist (Live-Sync).

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge, **bevor** Code geschrieben wird:
1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (aktueller Stand — siehe Nachtrag 2026-06-20)
3. **dieser Brief**
4. `status.json` (Real-Anteil)
5. Doku + Code der Scheibe: `docs/WERKZEUGE.md` (Abschnitt „Eigenständige Werkzeuge"),
   `werkzeugkiste.json` (`komplett_werkzeuge`), `assets/app.js` (`renderKomplettWerkzeuge`),
   `web/tools/`, sowie der Briefkasten `sbkim/` (SIGNAL.json, AUSTAUSCH-*.md).

**Erst Überblick, dann bauen.** Offene PRs vorher sichten. **Immer gegen das aktuelle `main`
arbeiten** (nicht gegen alte Branch-Erwartungen — diese Sitzung musste den Branch erst auf
`main` nachziehen). Kein Freibrief aktiv → normale „Plan-an-Klaus-zeigen"-Pflicht.

---

## 1. Stand **[Pflicht]**
- **Aufgenommen (PR #81 / Nachfolge-PR):** zwei Ein-Datei-PWAs als Kategorie
  „Komplett-Werkzeuge". Dateien 1:1 von Sage gespiegelt in `web/tools/`
  (`andock.html`, `mycelknoten.html`), byte-exakt (sha256 hinterlegt + im Test geprüft).
- **Test:** `npm test` grün (inkl. `test/komplett-werkzeuge.test.js`).
- **Offen:** (a) Quittung an Sage noch nicht versendet (wartet auf bestätigte Point-URL).
  (b) Browser-Sichtprüfung durch Klaus steht aus. (c) Live-Sync-Prüfung ohne Automatik.

## 2. Ziel dieser Aufgabe **[Pflicht]**
Die Spiegel-Dateien nachweisbar byte-gleich mit Sage halten und Sage die geforderte
Quittung (Ein-Zeiler + Point-URL) über den Briefkasten zukommen lassen.

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**
- **Pflegen:** `web/tools/andock.html` + `mycelknoten.html` gegen Sages Quelle abgleichen
  (curl, sha256 vergleichen); bei Abweichung neu spiegeln, `sha256` in `werkzeugkiste.json`
  aktualisieren, im Commit nennen. **Nicht verändern** (byte-kompatibel, kein PROTOCOL_VERSION-Bump).
- **Quittung:** über den Briefkasten (`sbkim/AUSTAUSCH-Sage.md` / `sbkim/SIGNAL.json`,
  vgl. die anderen `AUSTAUSCH-*.md`) eine Zeile + Point-URL zurückmelden.
- **Testen:** `npm test` grün halten; bei neuem sha256 den Test mitziehen. Browser-Sichttest
  durch Klaus (Hard-Reload Ctrl+Shift+R).

## 4. Datenverträge / Spec **[Pflicht]**
- `werkzeugkiste.json` → `komplett_werkzeuge[]`: Felder `id, name, kategorie, datei, quelle,
  herkunft, sha256, point_status, was, nutzen, verwendung, einbau, aktiviert_durch`.
  Schema-Änderung erst hier dokumentieren, dann Code/Render anpassen.

## 5. Akzeptanzkriterien **[Pflicht]**
- `sha256` der lokalen Dateien == aktuelle Sage-Quelle (oder bewusst nachgezogen + getestet).
- `npm test` grün. Quittung an Sage raus (oder klar begründet, warum noch nicht).
- Ehrliche Schließung „ungeprüft, wartet auf Klaus' Browser-Lauf", bis Klaus es ansieht.

## 6. Empfohlene Reihenfolge (Einzelschritte)
1. Sage-Quelle holen (curl), sha256 vergleichen.
2. Bei Abweichung: neu spiegeln + `werkzeugkiste.json`/Test/Doku nachziehen.
3. Quittung über den Briefkasten formulieren (Point-URL bestätigen lassen).
4. `npm test`, Draft-PR/Update, PULS + neuer Brief. **Merge entscheidet Klaus.**

## 7. Offene Fragen an Klaus
- Unter welcher **öffentlichen Point-URL** erscheinen die Werkzeuge (GitHub-Pages-Pfad)?
  Die braucht Sage für die Gegenprüfung in der Quittung.
- Soll die Quittung automatisch über den Briefkasten laufen oder gibst du sie manuell weiter?

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**
1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach `docs/sessions/VORLAGE_BRIEF.md`
   anlegen — inkl. Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
