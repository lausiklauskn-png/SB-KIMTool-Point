# BRIEF — Jesons-Bibliothek: App-Brücken + Protokoll-Andock fürs eigene Repo

> Folge-Brief nach Scheibe 2 (Tresor). Setzt die Brief-Kette aus `CLAUDE.md` fort.
> Stand: 2026-05-31.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (Stand — besonders Einträge **Y** und **X**, ganz oben)
3. **diesen Brief**
4. `status.json` (Real-Anteil)
5. Doku + Code: `docs/JESONS-BIBLIOTHEK.md` · `jesons-bibliothek/index.html`
   (Kern zwischen `JESONLIB-CORE-START/END`) · `test/jeson_lib.test.js` ·
   **Modul 02** `web/tools/sbkim-spore.js` (`exportBackup`/`importBackup`) ·
   Andock-Bausteine: `scripts/generate_spore.mjs` · `docs/ANDOCK.md` · `sbkim/AUSTAUSCH.md` ·
   `sbkim/spore.json` · `docs/SCHLUESSEL.md`.

**Erst Überblick, dann bauen.** Plan kurz an Klaus, Rückmeldung abwarten. Offene PRs sichten.
**Kein Freibrief** offen → normale Plan-vor-Code-Pflicht.

## 1. Stand **[Pflicht]**

- Jesons-Bibliothek **Scheibe 1+2 fertig** (Branch `claude/sage-andock-continue-SI1Lu`,
  Draft-PR #44): laden/benennen/ordnen/suchen/exportieren/einlesen **+ Tresor** (Passwort,
  AES-256-GCM/PBKDF2 600k, WebCrypto). Tresor-Format = **Modul 02 `exportBackup`** → liest
  auch verschlüsselte SBKIM-Schlüssel/ID-Backups (MM/MR/Modul 02). `npm test` 61/61, echter
  Browser-Smoke grün. Klaus' eigener Browser-Lauf steht aus.
- **Klaus' Ziel:** Jesons **und** Keys automatisch immer am selben Ort, egal welche App/PWA/
  Live-Page sie erstellt hat — offline. „Von außen ein Tresor, drinnen eine Bibliothek."
- **Klaus erstellt ein eigenes Repo** für die Bibliothek; wir bauen die **Brücke ans Protokoll**.
  Grenze: meine Schreibrechte gelten **nur** für `sb-kimtool-point` → Brücke als **Kopier-Starter**.

## 2. Ziel dieser Aufgabe **[Pflicht]** — eine Richtung (Klaus wählt)

- **(A) App-übergreifende Ablage:** **Web Share Target** (die Bibliothek-PWA wird „Teilen-Ziel"
  → aus jeder App „Teilen → Jesons-Bibliothek") + optional **fester Ordner** (File System
  Access API). Macht „immer am selben Ort" so weit, wie Browser-Origin-Trennung es offline zulässt.
- **(B) Volle Schlüssel-Wiederherstellung:** **Modul 02 in die App einbinden** (inline,
  abhängigkeitsfrei) → `importBackup(blob, pw)` stellt eine Identität echt wieder her, nicht nur
  ablegen. + „SBKIM-Identität sichern"-Knopf (`exportBackup`).
- **(C) Protokoll-Andock-Starter fürs neue Repo:** Kopier-Paket (eigene Spore via Modul 02 +
  `domainVector` + `docs/ANDOCK.md`-Vertrag + `AUSTAUSCH.md`-Postfach + Andock an Sage),
  damit das neue Repo von Anfang an im SBKIM-Netz hängt.
- **(D) Installierbar:** Service-Worker/Offline-Cache, damit die Seite als App installiert
  offline läuft.

## 3. Was gebaut / getestet werden soll **[Pflicht]**

- Klein anfangen, **ein** abgegrenzter Schritt. Kern weiter zwischen Markern testbar halten.
- Bei (B): Modul 02 ist groß (~1170 Z.) — inline einbetten oder als zweite Datei? Klaus fragen
  (Single-File-Regel vs. Wartbarkeit). Test: `exportBackup`→`importBackup`-Roundtrip headless.
- Bei (C): kein erfundenes Modul — echte Sage-Andock-Mechanik 1:1, wie dieses Repo sie hat.
- `npm test` grün halten; neue Funktion durch Test belegt; Browser-Teile ehrlich „wartet auf Klaus".

## 4. Datenverträge / Spec **[Pflicht]**

- **Tresor-Umschlag NICHT brechen** (identisch Modul 02 / `node_key.enc.json`):
  `{ schemaVersion, kind:"jeson-tresor", version:2, kdf:{PBKDF2,SHA-256,600000,salt}, cipher:{AES-GCM-256,iv}, ciphertext }` (base64url).
- **Share Target (A):** Manifest `share_target` (POST, `enctype multipart/form-data`,
  `files` mit `accept: ["application/json",".json"]`); eingehende Datei → `ingestFile`.
- **Andock (C):** Schema aus `docs/ANDOCK.md` (kanonische Signier-Form, `domainVector` ehrlich).

## 5. Akzeptanzkriterien **[Pflicht]**

- `npm test` grün; neuer Pfad bewiesen. Real/Demo getrennt; **echte Krypto**, nichts gestubt.
- Ehrliche Grenze dokumentiert (Origin-Trennung: „vollautomatisch über alle Apps" nicht möglich;
  Share-Target/Ordner ist der echte Weg).
- Offline, keine externen Abhängigkeiten (verteilbare Einzeldatei).

## 6. Empfohlene Reihenfolge

1. Pflichtlektüre + offene PRs sichten.
2. Mit Klaus A/B/C/D wählen (kurzer Plan im Chat) + klären: neues Repo-Vorgehen
   (Kopier-Starter hier bauen vs. eigene Sitzung im neuen Repo).
3. Einen Schritt bauen + Test + Doku.
4. Abschluss-Befehl (Teil 8).

## 7. Offene Fragen an Klaus

- Reihenfolge: **A** (überall teilen), **B** (Keys echt wiederherstellen), **C** (Andock-Starter)
  oder **D** (installierbar) zuerst?
- Modul 02 in die Einzeldatei **inline** (bleibt eine Datei) oder als **zweite Datei**?
- Neues Repo: soll ich den **Kopier-Starter hier** bauen (du kopierst), oder lieferst du den
  Repo-Namen und ich gebe alle Dateien als Vorlage?

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` anlegen — inkl. Pflichtlektüre (Teil 0)
   und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
