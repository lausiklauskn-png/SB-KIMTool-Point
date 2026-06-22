# BRIEF — an die nächste Sitzung (SB·KIMTool·Point)

> Folge-Brief nach der großen Andock-/Netz-Sitzung. Setzt die Brief-Kette aus `CLAUDE.md`
> fort. Stand: 2026-06-07.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge, **bevor** etwas gebaut wird:
1. `CLAUDE.md` (Verfassung) — inkl. Abschnitt „Briefkasten pflegen (Netz-Sync §11.6)".
2. `PULS.md` — aktueller Stand, besonders Eintrag **AQ** (Sitzungsabschluss) ganz oben.
3. **diesen Brief**.
4. `status.json` (Real-Anteil) + `sbkim/SIGNAL.json` (eigener Aushang, seq/ack).
5. Code/Doku der berührten Scheibe: `assets/sbkim-siegel.js` (Lampen/Siegel/Wizard),
   `jasons-bibliothek/index.html`, `docs/JASONS-BIBLIOTHEK.md`, `docs/SCHLUESSEL.md`,
   `sbkim/GENERALPROBE.md`, `docs/ANDOCK.md`.

**Briefkasten-Pflicht (Sitzungsstart):** die `SIGNAL.json` der Peers aus deren `raw/main` lesen
(Sage, Jasons-Tresor, Mein-Tresor). Hat ein Peer `seq > ack[peer]` in unserem
`sbkim/SIGNAL.json`, dessen Postfach lesen, handeln, dann `ack[peer]` hochsetzen.

**Plan-vor-Code:** kurz Plan an Klaus zeigen, dann bauen. **Kein Freibrief** offen.
**Merge-Regel dieser Linie:** Klaus hat „automatisch mergen, wenn sinnvoll" erlaubt — also
selbst mergen bei: Tests grün + (wo UI) im Browser verifiziert + reine Ergänzung/Doku/Optik
ohne Risiko. **Vorher fragen** bei: Identität/Schlüssel/Krypto, Datenverträgen zwischen Knoten,
Größerem/Unklarem. Leitplanken (Ehrlichkeit, `npm test`, kein PII, offline) immer.

## 1. Stand **[Pflicht]**

- `main` = aktuell, **keine offenen PRs**, `npm test` **77/77**, `SIGNAL.json` **seq 13**,
  `ack` = `{Sage-Protokol:7, Jasons-Tresor:null, Mein-Tresor:4}`.
- **Netz (vier Knoten, alle echt verifiziert):**
  - Sage ⟷ A — `verified-match` 0.8485
  - A ⟷ C (Jasons-Tresor) — `verified-match` 0.853740 (nodeId `E13GDzIp…`)
  - A → D (Mein-Tresor) — `verified-spore` (nodeId `wRsGQouO…`), Match offen
- **Pages live.** Andock-Wizard im Siegel-Modal (4 Schritte), Lampen/Siegel ehrlich verdrahtet,
  📬-Knopf netzweit.

## 2. Offene Punkte (Auswahl, Klaus priorisiert)

1. **Klaus' Browser-Lauf des Andock-Wizards** (Schritt 2–4): Embedding ~30 MB lädt? Spore-
   Download? Backup + Wiederherstellen? — headless nicht voll prüfbar, **wartet auf Klaus**.
2. **`verified-match` für Mein-Tresor (D)** — sobald D einen echten `domainVector` liefert +
   Spore neu signiert (gleicher Schlüssel → gleiche nodeId): Spore aus raw/main holen,
   `verify_foreign_spore.mjs`, Cosine gegen `sbkim/domainVector.real.json` rechnen, hochstufen
   (wie bei C, `test/meintresor_inbox.test.js` erweitern).
3. **Jasons-Tresor (C) `SIGNAL.json`** existiert noch nicht → `ack[Jasons-Tresor]` bleibt null.
   Wenn C eines anlegt: lesen + quittieren.
4. **Impressum** — Klaus' Text steht noch aus. Ziel: Footer-Block in `index.html` **oder**
   eigene `impressum.html`. **Kein-PII beachten** (Klaus entscheidet: echte Daten vs.
   Handle/Kontakt). Erst Text abwarten.
5. **GENERALPROBE** (`sbkim/GENERALPROBE.md`): wenn Klaus startet → eigene Spec-Runde für
   Reihenfolge-Fahrplan + Namens-/Knoten-Konvention, dann der große Re-Sync über Browser-Tools.

## 3. Datenverträge / Spec **[Pflicht, nicht brechen]**

- **Spore:** 9 Pflichtfelder (`createdAt, domain, embeddingModel, endpoint, id, nodeType,
  protocolVersion, publicKey, signature`); `id = base64url(SHA256(rawPub))`; kanonische Form =
  JSON ohne Whitespace, Schlüssel rekursiv sortiert, `signature` ausgenommen, Ed25519 base64url
  ohne Padding. `protocolVersion` 0.1.
- **domainVector:** `Xenova/multilingual-e5-small`, 384-dim, L2≈1; `verified-match` ab Cosine ≥ 0.80.
- **Tresor-Umschlag** (Bibliothek + Schlüssel-Backup): `kind:"jason-tresor"`/Modul-02-Form,
  PBKDF2-SHA256 600k + AES-GCM-256. NICHT brechen.
- **SIGNAL.json §11.6:** `seq` monoton +1 pro Bau; `ack[peer]` = höchste gelesene seq.
- **Modul 16/15** (`web/tools/sbkim-*.js`) sind 1:1 Sage-Kopien + byte-getestet → **nicht
  ändern**; Anpassungen nur im Wrapper `assets/sbkim-siegel.js`.

## 4. Akzeptanzkriterien

- `npm test` grün; neue Funktion durch Test belegt (Inbox-Tests bei neuen Verifikationen).
- UI im echten Browser (Playwright-Smoke) verifiziert; Browser-only-Pfade ehrlich „wartet auf
  Klaus".
- Real/Demo getrennt; echte Krypto; kein PII; offline (Ausnahme: erstes Embedding lädt CDN/HF).
- Bei Netz-Bau: `SIGNAL.json` `seq`+1 + `history` + Postfach-Quittung.

## 5. Empfohlene Reihenfolge

1. Pflichtlektüre + Peer-SIGNALe lesen/quittieren.
2. Mit Klaus den nächsten Punkt wählen (Impressum-Text? Mein-Tresor-Match? Generalprobe-Spec?).
3. Einen abgegrenzten Schritt bauen + Test + (UI) Browser-Smoke + Doku.
4. Abschluss-Befehl (Teil 7).

## 6. Offene Fragen an Klaus

- **Impressum:** Text? Und „echte Daten" (ausdrückliche PII-Freigabe, dauerhaft in Git-Historie)
  oder „nur Handle/Kontakt"? Footer-Block oder eigene Seite?
- Läuft der **Andock-Wizard** in deinem Browser sauber durch (Schritt 2–4)?
- Soll die **Generalprobe** geplant werden (Reihenfolge der PWAs/Tools)?

## 7. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` anlegen — inkl. Pflichtlektüre (Teil 0) +
   diesem Abschluss-Befehl (Teil 7).
3. Brief **vollständig als Codeblock im Chat** ausgeben.
4. Bei Netz-Bau `SIGNAL.json` fortschreiben. Commit/Push; Merge nach der Regel oben.
