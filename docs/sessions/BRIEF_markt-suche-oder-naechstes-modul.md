# BRIEF — Nach dem Andock: Markt-Suche oder nächstes reifes Modul

> Folge-Brief nach Abschluss des Sage-Andocks. Setzt die Brief-Kette aus `CLAUDE.md`
> („Dokumentations- & Lesepflicht") fort. Stand: 2026-05-30.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge lesen, **bevor** etwas gebaut wird:

1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (aktueller Stand — besonders Eintrag **W**, ganz oben)
3. **diesen Brief** (geplante Aufgabe + Datenverträge)
4. `status.json` (Real-Anteil)
5. Doku + Code der Scheibe: für Markt-Suche `markt.html` · `assets/app.js` (`renderMarkt`) ·
   `web/data/marktplatz.json` · `web/data/nodes.json`; für Modul-Kopie `docs/WERKZEUGE.md` ·
   `werkzeugkiste.json` · `web/tools/`.

**Erst Überblick, dann bauen:** relevanten Code lesen, Plan formulieren, Plan kurz an Klaus
zeigen, Rückmeldung abwarten — nicht sofort losbauen. Offene PRs vorher sichten
(PR-Workflow in `CLAUDE.md`).

---

## 1. Stand **[Pflicht]**

- **Andock mit Sage VOLLSTÄNDIG ABGESCHLOSSEN** (gemerged auf `main`):
  - PR #40 — Schlüssel-Tresor (`sbkim/node_key.enc.json`, Passwort bei Klaus: gesichert).
  - PR #41 — Rückbrief A–E im Postfach §10.
  - PR #42 — Abnahme: Sages `docs/INTERFACES.md` §11 gegen unseren Rückbrief gegengelesen,
    korrekt; **reine Abnahme, keine Gegen-Quittung nötig**. Verbindung ruht.
  - PR #43 — Markt: „andocken" öffnet jetzt echte Live-Seiten + Sage-Karte zeigt „✓ voller
    Match · 0.85". **Von Klaus im Browser bestätigt (grün).**
- Wir sind bei Sage als **`verified-match`** (0.848508), dauerhafte nodeId `CyunQNDR…`.
- **Offen / blockiert:** nichts Blockierendes. Die Andock-Verbindung ruht (wacht beim
  nächsten echten Bau oder einem dritten Knoten von selbst auf).

## 2. Ziel dieser Aufgabe **[Pflicht]**

Eine von zwei sinnvollen Richtungen (Klaus wählt):
- **(A) Markt-Suche bauen** — die im Markt gelisteten Knoten durchsuchbar machen (Daten in
  `web/data/nodes.json` sind dafür schon strukturiert; Suche ist bewusst noch NICHT gebaut).
- **(B) Nächstes reifes Sage-Modul** Datei für Datei in `web/tools/` herüberholen (kein
  git-clone; 1:1 kopieren, Werkzeugkiste + Tests + Doku nachziehen).

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**

- **Bauen:** je nach Wahl A oder B (s. o.). Klein anfangen, ein abgegrenzter Schritt.
- **Pflegen:** bei A → `markt.html`/`app.js`/`marktplatz.json`/`nodes.json` + `docs`; bei B →
  `werkzeugkiste.json`, `docs/WERKZEUGE.md`, ggf. `status.json` (Real-Anteil ehrlich), und
  bei Schutz-Modulen `ZERTIFIKAT_ASPEKTE` in `sandbox/16_siegel.js`.
- **Testen:** `npm test` grün halten; bei A einen headless Render-/Logik-Test der Suche; bei
  B Modul-Lade-Test in `test/modules.test.js`. Browser-Sichttest durch Klaus (Hard-Reload).

## 4. Datenverträge / Spec **[Pflicht, falls Module/Dateien Daten teilen]**

- **Markt-Suche (A):** Quelle bleibt `web/data/nodes.json` (`{nodeId,label,tags[]}`) +
  `marktplatz.json` (`eintraege[]`). Schema **nicht brechen**; Suche liest, schreibt nicht.
  Neue Felder erst hier/Spec festschreiben, dann Code.
- **Modul-Kopie (B):** `werkzeugkiste.json`-Eintrag mit `point_status`/`point_hinweis`/`datei`;
  Modul registriert auf `window.Sbkim*` (IIFE), wie die bestehenden in `web/tools/`.

## 5. Akzeptanzkriterien (Erfolgsmerkmale) **[Pflicht]**

- `npm test` grün; neue Funktion durch einen Test belegt.
- Ehrliche Schließung: Browser-Teile „ungeprüft, wartet auf Klaus' Browser-Lauf", bis Klaus
  sie gesehen hat. Real/Demo klar getrennt.
- Bei B: kein erfundenes Modul — nur echte Sage-Quelle 1:1.

## 6. Empfohlene Reihenfolge (Einzelschritte)

1. Pflichtlektüre + offene PRs sichten.
2. Mit Klaus A oder B wählen (kurzer Plan im Chat).
3. Einen abgegrenzten Schritt bauen + Test + Doku nachziehen.
4. Abschluss-Befehl (Teil 8).

## 7. Offene Fragen an Klaus

- Richtung **A (Markt-Suche)** oder **B (nächstes Modul)** — und bei B: welches Modul?
- Soll die ruhende Sage-Verbindung in dieser Sitzung angefasst werden? (Default: **nein** —
  sie ruht; erst ein echter neuer Bau weckt sie.)

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

Am Ende **dieser** Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach `docs/sessions/VORLAGE_BRIEF.md`
   anlegen — inkl. Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
