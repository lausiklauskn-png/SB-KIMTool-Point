# BRIEF — an die nächste Sitzung (SB·KIMTool·Point)

> Folge-Brief nach Impressum + Briefkasten-Angleichung (§11.6). Setzt die Brief-Kette aus
> `CLAUDE.md` fort und löst `BRIEF_nach-meintresor-match.md` ab. Stand: 2026-06-07.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge, **bevor** etwas gebaut wird:
1. `CLAUDE.md` (Verfassung) — inkl. „Briefkasten pflegen (Netz-Sync §11.6)".
2. `PULS.md` — oberste Einträge **AT** (Briefkasten), **AS** (Impressum), **AR** (Mein-Tresor-Match).
3. **diesen Brief**.
4. `status.json` + `sbkim/SIGNAL.json` (eigener Aushang: seq/ack/mailboxes).
5. Code/Doku der berührten Scheibe: `.github/sbkim-watch.mjs`, `assets/netz-briefkasten.js`,
   `assets/sbkim-siegel.js`, `sbkim/AUSTAUSCH*.md`, `docs/ANDOCK.md`.

**Briefkasten-Pflicht (Sitzungsstart):** die `SIGNAL.json` der Peers aus deren `raw/main` lesen
(Sage, Jasons-Tresor, Mein-Tresor). Hat ein Peer `seq > ack[peer]` in unserem
`sbkim/SIGNAL.json`, dessen Postfach lesen, handeln, dann `ack[peer]` hochsetzen.

**Plan-vor-Code:** kurz Plan an Klaus zeigen, dann bauen. **Kein Freibrief** offen.
**Merge-Regel:** selbst mergen bei Tests grün + (UI) Browser-verifiziert + reine Ergänzung/Doku
ohne Risiko; **vorher fragen** bei Identität/Schlüssel/Krypto, Datenverträgen zwischen Knoten,
Größerem/Unklarem. Leitplanken (Ehrlichkeit, `npm test`, kein PII außer freigegebenem Impressum,
offline) immer.

## 1. Stand **[Pflicht]**

- `main` aktuell (nach Merge), `npm test` **78/78**, `SIGNAL.json` **seq 16**.
- **Briefkasten an Referenz angeglichen (§11.6, klug zusammengeführt):**
  - SIGNAL um `sporeUrl` + `nodeId` ergänzt; pro-Nachbar-Postfächer
    (Sage→`AUSTAUSCH.md`, Jasons-Tresor→`AUSTAUSCH-JasonsTresor.md`, Mein-Tresor→`AUSTAUSCH-MeinTresor.md`).
  - **Mein-Tresor als Peer** im Wächter **und** Browser-📬 aufgenommen.
  - `ack` = Sage **16** · Jasons-Tresor **8** · Mein-Tresor **8**.
  - Unser reicherer Wächter (Issue bei Neuem) + 5-Seiten-📬 **behalten** (kein Downgrade).
- **Netz auf Match-Ebene:** Sage↔A 0.8485 · A↔C 0.8537 · A↔D 0.8537.
- **Impressum** live (`impressum.html` + Footer-Link Startseite); PII per Klaus-Freigabe.

## 2. Offene Punkte (Auswahl, Klaus priorisiert)

1. **Impressum bei C + D**: Auftrag liegt in deren Postfächern (`AUSTAUSCH-JasonsTresor.md`,
   `AUSTAUSCH-MeinTresor.md`). Beim Briefkasten-Check schauen, ob C/D ihr Impressum gemeldet haben.
2. **Footer-Link Impressum auf die anderen Seiten** (Modell/Werkzeuge/Markt) — rechtlich sauberer,
   von überall erreichbar. (Klaus hatte zunächst nur die Startseite genannt → kurz rückfragen.)
3. **Sage-Hochstufung A → `verified-match`**: prüfen, ob Sage uns als verified-match führt bzw. ob
   von uns noch eine Quittung fehlt (`status.json`: „Sage-Hochstufung … ausstehend").
4. **GENERALPROBE** (`sbkim/GENERALPROBE.md`): wenn Klaus startet → Spec-Runde Reihenfolge-Fahrplan.
5. **Netzweit:** andere Knoten (Sage, Jasons-Tresor, ggf. Rezeptbuch/Mixarium) sollen ihren
   Briefkasten ebenfalls an die Referenz angleichen — das läuft über ihre eigenen Sitzungen.

## 3. Datenverträge / Spec **[Pflicht, nicht brechen]**

- **SIGNAL.json (§11.6):** `{ node, lastBuild, seq, headline, sporeUrl, nodeId,
  mailboxes:{Knoten→AUSTAUSCH-raw-URL}, forNodes:["*"], ack:{Knoten→seq}, _doc, history:[] }`.
  `seq` monoton +1 pro Bau; `ack[peer]` = höchste gelesene/quittierte Peer-seq; **history nie
  zurücksetzen**. Pushen IST das Signal.
- **Pro-Nachbar-Postfach:** `sbkim/AUSTAUSCH-<Nachbar>.md` (Status-Kopf-Tabelle + Verbindung/
  Angebot + Verlauf). Älteres im gemeinsamen `AUSTAUSCH.md` (Archiv).
- **Spore/Match/Tresor-Umschlag:** wie gehabt (9 Pflichtfelder, `id=base64url(SHA256(rawPub))`,
  Ed25519 kanonisch; domainVector 384-dim L2≈1, match ≥0.80; PBKDF2 600k + AES-GCM-256). Nicht brechen.
- **Wächter:** nur Node-`fetch`, keine npm-Deps, kein Schreiben ins fremde Repo.

## 4. Akzeptanzkriterien

- `npm test` grün; neue Funktion durch Test/echten Lauf belegt.
- UI im echten Browser verifiziert; Browser-only-Pfade ehrlich „wartet auf Klaus".
- Real/Demo getrennt; echte Krypto; kein PII (außer freigegebenem Impressum); offline.
- Bei Netz-Bau: `SIGNAL.json` `seq`+1 + `history` + Postfach-Quittung.

## 5. Empfohlene Reihenfolge

1. Pflichtlektüre + Briefkasten-Check (Peer-SIGNALe lesen/quittieren; C/D-Impressum?).
2. Mit Klaus den nächsten Punkt wählen (Footer-Ausweitung? Sage-Match? Generalprobe?).
3. Einen abgegrenzten Schritt bauen + Test + (UI) Browser-Smoke + Doku.
4. Abschluss-Befehl (Teil 7).

## 6. Offene Fragen an Klaus

- Impressum-Footer auch auf Modell/Werkzeuge/Markt ausweiten?
- Soll die **Generalprobe** geplant werden?
- Browser-Check: zeigt der 📬-Knopf jetzt auch Mein-Tresor sauber an?

## 7. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` anlegen — inkl. Pflichtlektüre (Teil 0) +
   diesem Abschluss-Befehl (Teil 7).
3. Brief **vollständig als Codeblock im Chat** ausgeben.
4. Bei Netz-Bau `SIGNAL.json` fortschreiben. Commit/Push; Merge nach der Regel oben.
