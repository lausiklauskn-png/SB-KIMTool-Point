# BRIEF — Jesons-Bibliothek: Scheibe 2 (Tresor) oder Browser-Lauf

> Folge-Brief nach Scheibe 1 der Jesons-Bibliothek. Setzt die Brief-Kette aus `CLAUDE.md`
> („Dokumentations- & Lesepflicht") fort. Stand: 2026-05-31.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge lesen, **bevor** etwas gebaut wird:

1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (aktueller Stand — besonders Eintrag **X**, ganz oben)
3. **diesen Brief** (geplante Aufgabe + Datenverträge)
4. `status.json` (Real-Anteil)
5. Doku + Code der Scheibe: `docs/JESONS-BIBLIOTHEK.md` · `jesons-bibliothek/index.html`
   (Kern zwischen `JESONLIB-CORE-START/END`) · `test/jeson_lib.test.js` · als Krypto-Vorlage
   `sbkim/node_key.enc.json` + `scripts/open_node_key.mjs` + `docs/SCHLUESSEL.md`.

**Erst Überblick, dann bauen:** relevanten Code lesen, Plan formulieren, Plan kurz an Klaus
zeigen, Rückmeldung abwarten — nicht sofort losbauen. Offene PRs vorher sichten
(PR-Workflow in `CLAUDE.md`). **Kein Freibrief** offen → normale Plan-vor-Code-Pflicht.

---

## 1. Stand **[Pflicht]**

- **Jesons-Bibliothek Scheibe 1 fertig** (auf Branch `claude/sage-andock-continue-SI1Lu`,
  Draft-PR #44): `jesons-bibliothek/index.html` — offline-Einzeldatei, `.json` laden →
  benennen/ordnen/suchen/sortieren → ansehen → einzeln exportieren → Bibliothek sichern/einlesen.
  Speicher `localStorage`. **Ohne** Verschlüsselung. `npm test` 55/55, Browser-Smoke grün.
- **Klaus' Anforderung notiert:** der Tresor (Scheibe 2) soll **auch SBKIM-Schlüssel +
  Knoten-IDs** sichern — gleicher Umschlag wie `sbkim/node_key.enc.json`.
- **Offen aus Eintrag W (nicht erledigt):** Info-Brief an Sage (wie wir Schlüssel sichern +
  Bitte, Sages Werkzeugkiste auf echte/getestete/freigegebene Werkzeuge auszurichten).
- **Klaus' eigener Browser-Lauf** der Bibliothek steht aus (Datei-Auswahl/Download/Dialog).

## 2. Ziel dieser Aufgabe **[Pflicht]** — eine Richtung (Klaus wählt)

- **(A) Scheibe 2 — Tresor:** Export/Import mit **Passwort verschlüsseln** (WebCrypto:
  AES-256-GCM, Schlüssel via PBKDF2 600k SHA-256) → `kind: "jeson-tresor"`. Sicheres Aufheben
  **und Verschenken** (Passwort getrennt mitteilen). Doppelnutzen: SBKIM-Schlüssel/IDs sichern.
- **(B) Scheibe 3 / Feinschliff:** als App installierbar (Service-Worker/Offline-Cache,
  Icons), „verschenken"-Knopf, ggf. IndexedDB für große Sammlungen, Link von der Hub-Seite.
- **(C) Sage-Info-Brief** (aus Eintrag W) zuerst, falls Klaus das vorzieht.

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**

- **Bauen (A):** Verschlüsseln/Entschlüsseln im Browser (WebCrypto), Knopf „mit Passwort
  sichern" / „verschlüsselt einlesen" (fragt Passwort), `kind: "jeson-tresor"` schreiben/lesen.
  Klein anfangen: erst ganze Bibliothek, dann ggf. einzelner Eintrag.
- **Pflegen:** `docs/JESONS-BIBLIOTHEK.md` (Tresor von „geplant" auf „fertig"),
  `status.json` (ehrlich), `docs/WERKZEUGE.md`. Keine Schutz-Module 10/11/12/14/15 berührt →
  vermutlich **kein** `ZERTIFIKAT_ASPEKTE`-Eintrag nötig (prüfen).
- **Testen:** headless Roundtrip — verschlüsseln → entschlüsseln == Original; falsches
  Passwort scheitert sauber; manipulierter `ciphertext`/`tag` fällt durch (GCM). `npm test`
  grün halten. **Wichtig:** der Kern muss weiter zwischen `JESONLIB-CORE-START/END` testbar
  bleiben — WebCrypto ist im Node-Test über `globalThis.crypto.subtle` (Node ≥ 20) nutzbar.

## 4. Datenverträge / Spec **[Pflicht]**

- **Verschlüsselter Umschlag** (NICHT brechen, identisch zu `node_key.enc.json`):
  ```json
  { "schemaVersion": 1, "kind": "jeson-tresor",
    "kdf": {"algorithm":"PBKDF2","hash":"SHA-256","iterations":600000,"salt":"<b64>"},
    "cipher": {"algorithm":"AES-256-GCM","iv":"<b64>","tag":"<b64>"},
    "ciphertext": "<b64>" }
  ```
- Klartext-Inhalt vor Verschlüsselung = eine `jeson-bibliothek` (oder ein `jeson-eintrag`).
- `parseLibraryImport` erkennt `kind` → bei `jeson-tresor` Passwort anfragen, entschlüsseln,
  dann wie bisher zusammenführen (dedupe nach `id`).

## 5. Akzeptanzkriterien (Erfolgsmerkmale) **[Pflicht]**

- `npm test` grün; Verschlüsselungs-Roundtrip + Fehlerfälle (falsches PW, Manipulation) belegt.
- Ehrliche Schließung: Browser-Teile „ungeprüft, wartet auf Klaus' Browser-Lauf".
- Real/Demo klar getrennt; **echte Krypto** (`node:crypto`/WebCrypto), nichts gestubt.
- Honest: Passwort vergessen = Inhalt weg (kein Hintertürchen), wie beim Knoten-Tresor.

## 6. Empfohlene Reihenfolge (Einzelschritte)

1. Pflichtlektüre + offene PRs sichten.
2. Mit Klaus A / B / C wählen (kurzer Plan im Chat).
3. Einen abgegrenzten Schritt bauen + Test + Doku nachziehen.
4. Abschluss-Befehl (Teil 8).

## 7. Offene Fragen an Klaus

- Richtung **A (Tresor)**, **B (Feinschliff/installierbar)** oder **C (Sage-Info-Brief)**?
- Soll die Bibliothek ihr **eigenes Repo/PWA** bekommen (wie MM/MR) oder vorerst hier wohnen?
- Beim Verschenken: ein **Passwort pro Datei** oder ein Bibliotheks-Passwort? (Default: pro
  Export ein Passwort.)

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

Am Ende **dieser** Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach `docs/sessions/VORLAGE_BRIEF.md`
   anlegen — inkl. Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
