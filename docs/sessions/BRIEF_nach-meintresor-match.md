# BRIEF — an die nächste Sitzung (SB·KIMTool·Point)

> Folge-Brief nach der Hochstufung von Mein-Tresor (D) auf verified-match. Setzt die Brief-Kette
> aus `CLAUDE.md` fort und löst `BRIEF_naechste-sitzung.md` ab (dessen Punkte 1+2 sind erledigt).
> Stand: 2026-06-07.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge, **bevor** etwas gebaut wird:
1. `CLAUDE.md` (Verfassung) — inkl. Abschnitt „Briefkasten pflegen (Netz-Sync §11.6)".
2. `PULS.md` — aktueller Stand, besonders die obersten Einträge **AR** + **AQ**.
3. **diesen Brief**.
4. `status.json` (Real-Anteil) + `sbkim/SIGNAL.json` (eigener Aushang, seq/ack).
5. Code/Doku der berührten Scheibe: `assets/sbkim-siegel.js`, `scripts/verify_foreign_spore.mjs`,
   `web/data/marktplatz.json`, `sbkim/AUSTAUSCH*.md`, `docs/ANDOCK.md`.

**Briefkasten-Pflicht (Sitzungsstart):** die `SIGNAL.json` der Peers aus deren `raw/main` lesen
(Sage, Jasons-Tresor, Mein-Tresor). Hat ein Peer `seq > ack[peer]` in unserem
`sbkim/SIGNAL.json`, dessen Postfach lesen, handeln, dann `ack[peer]` hochsetzen.

**Plan-vor-Code:** kurz Plan an Klaus zeigen, dann bauen. **Kein Freibrief** offen.
**Merge-Regel dieser Linie:** Klaus hat „automatisch mergen, wenn sinnvoll" erlaubt — also selbst
mergen bei: Tests grün + (wo UI) im Browser verifiziert + reine Ergänzung/Doku/Optik ohne Risiko.
**Vorher fragen** bei: Identität/Schlüssel/Krypto, Datenverträgen zwischen Knoten, Größerem/Unklarem.
Leitplanken (Ehrlichkeit, `npm test`, kein PII, offline) immer.

## 1. Stand **[Pflicht]**

- `main` = aktuell (nach Merge des verified-match-PR), `npm test` **78/78**, `SIGNAL.json` **seq 14**,
  `ack` = `{Sage-Protokol:7, Jasons-Tresor:null, Mein-Tresor:7}`.
- **Netz (vier Knoten, jetzt alle auf Match-Ebene):**
  - Sage ⟷ A — `verified-match` 0.8485
  - A ⟷ C (Jasons-Tresor) — `verified-match` 0.853740
  - A ⟷ D (Mein-Tresor) — `verified-match` 0.853740 **(NEU 2026-06-07)**
- **Erledigt aus dem Vorbrief:** (1) Klaus' Browser-Lauf des Andock-Wizards bestätigt;
  (2) Mein-Tresor auf verified-match hochgestuft (Beleg + Test + Quittung).

## 2. Offene Punkte (Auswahl, Klaus priorisiert)

1. **Sage-Hochstufung A → `verified-match` bei Sage selbst.** Unser Match zu Sage (0.8485) ist
   beidseitig sichtbar; prüfen, ob Sage uns schon als verified-match führt bzw. ob von uns noch
   eine Quittung/SIGNAL fehlt (siehe `status.json`: „Sage-Hochstufung … ausstehend").
2. **Jasons-Tresor (C) `SIGNAL.json`** existiert noch nicht → `ack[Jasons-Tresor]` bleibt null.
   Sobald C ein SIGNAL anlegt: lesen + quittieren.
3. **Impressum** — Klaus' Text steht noch aus. Ziel: Footer-Block in `index.html` **oder** eigene
   `impressum.html`. **Kein-PII beachten** (Klaus entscheidet: echte Daten vs. Handle/Kontakt).
   Erst Text abwarten.
4. **GENERALPROBE** (`sbkim/GENERALPROBE.md`): wenn Klaus startet → eigene Spec-Runde für
   Reihenfolge-Fahrplan + Namens-/Knoten-Konvention, dann der große Re-Sync über Browser-Tools.
5. **Marktplatz-Anzeige** im Browser ansehen: zeigt D jetzt korrekt als verified-match? (wartet
   auf Klaus' Browser-Lauf).

## 3. Datenverträge / Spec **[Pflicht, nicht brechen]**

- **Spore:** 9 Pflichtfelder; `id = base64url(SHA256(rawPub))`; kanonische Form = JSON ohne
  Whitespace, Schlüssel rekursiv sortiert, `signature` ausgenommen, Ed25519 base64url ohne Padding.
  `protocolVersion` 0.1.
- **domainVector:** `Xenova/multilingual-e5-small`, 384-dim, L2≈1; `verified-match` ab Cosine ≥ 0.80.
- **Inbox-Konvention (ANDOCK §6.2):** fremde Spore als eingefrorene Momentaufnahme
  `sbkim/<peer>_inbox.json` + Prüf-Vermerk + Offline-Test; Match offline gegen
  `sbkim/domainVector.real.json` reproduzierbar.
- **SIGNAL.json §11.6:** `seq` monoton +1 pro Bau; `ack[peer]` = höchste gelesene seq.
- **Modul 16/15** (`web/tools/sbkim-*.js`) sind 1:1 Sage-Kopien + byte-getestet → **nicht ändern**;
  Anpassungen nur im Wrapper `assets/sbkim-siegel.js`.

## 4. Akzeptanzkriterien

- `npm test` grün; neue Verifikation durch Test belegt (Inbox-Test mit Cosine-Match).
- UI im echten Browser verifiziert; Browser-only-Pfade ehrlich „wartet auf Klaus".
- Real/Demo getrennt; echte Krypto; kein PII; offline (Ausnahme: erstes Embedding lädt CDN/HF).
- Bei Netz-Bau: `SIGNAL.json` `seq`+1 + `history` + Postfach-Quittung.

## 5. Empfohlene Reihenfolge

1. Pflichtlektüre + Peer-SIGNALe lesen/quittieren.
2. Mit Klaus den nächsten Punkt wählen (Sage-Match-Quittung? Impressum-Text? Generalprobe-Spec?).
3. Einen abgegrenzten Schritt bauen + Test + (UI) Browser-Smoke + Doku.
4. Abschluss-Befehl (Teil 7).

## 6. Offene Fragen an Klaus

- **Impressum:** Text? „echte Daten" (ausdrückliche PII-Freigabe, dauerhaft in Git-Historie) oder
  „nur Handle/Kontakt"? Footer-Block oder eigene Seite?
- Soll die **Generalprobe** geplant werden (Reihenfolge der PWAs/Tools)?
- Zeigt der **Marktplatz** in Deinem Browser Mein-Tresor jetzt als verified-match (Score 0.8537)?

## 7. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` anlegen — inkl. Pflichtlektüre (Teil 0) +
   diesem Abschluss-Befehl (Teil 7).
3. Brief **vollständig als Codeblock im Chat** ausgeben.
4. Bei Netz-Bau `SIGNAL.json` fortschreiben. Commit/Push; Merge nach der Regel oben.
