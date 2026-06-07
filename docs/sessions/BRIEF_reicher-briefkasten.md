# BRIEF — an die nächste Sitzung (SB·KIMTool·Point)

> Folge-Brief nach „reicher Briefkasten + Wächter-Vorteil-Auftrag". Setzt die Brief-Kette aus
> `CLAUDE.md` fort und löst `BRIEF_briefkasten-angeglichen.md` ab. Stand: 2026-06-07.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

1. `CLAUDE.md` — inkl. „Briefkasten pflegen (Netz-Sync §11.6)".
2. `PULS.md` — oberste Einträge **AU** (reicher Briefkasten), **AT** (Angleichung), **AS/AR**.
3. **diesen Brief**.
4. `status.json` + `sbkim/SIGNAL.json` (seq/ack/mailboxes).
5. Code: `assets/netz-briefkasten.js` (reiches Modal), `assets/style.css` (`.netz-mb-*`),
   `.github/sbkim-watch.mjs` + Workflow, `sbkim/AUSTAUSCH*.md`, `sbkim/*_inbox.json`.

**Briefkasten-Pflicht (Sitzungsstart):** Peer-`SIGNAL.json` aus `raw/main` lesen; bei
`seq > ack[peer]` Postfach lesen, handeln, `ack[peer]` hochsetzen.

**Plan-vor-Code; kein Freibrief offen.** Merge-Regel: selbst mergen bei Tests grün +
(UI) Browser-verifiziert + reine Ergänzung; sonst fragen.

## 1. Stand **[Pflicht]**

- `main` aktuell, `npm test` **78/78**, `SIGNAL.json` **seq 17**, `ack` Sage 16 / Jasons-Tresor 8 / Mein-Tresor 8.
- **Reicher Briefkasten** auf allen 5 Seiten: Karte je Nachbar (Spore/Match/Sync/Brief),
  Match **live im Browser** (Sage 0.8485 · Jasons-Tresor 0.8537 · Mein-Tresor 0.8537), Siegel-Kopf,
  Ungelesen-Badge. **Plus** Action-Wächter (Auto-Issue) — reiche UI + Hintergrund vereint.
- **Auftrag an C + D** in deren Postfächern: unseren Wächter-Vorteil (Auto-Issue) übernehmen.
- Impressum live (Startseiten-Footer); Netz auf Match-Ebene komplett.

## 2. Offene Punkte (Auswahl, Klaus priorisiert)

1. **Browser-Check (wartet auf Klaus):** reiche Karten-Ansicht des 📬 auf einer Seite ansehen —
   zeigt sie Sage/Jasons-Tresor/Mein-Tresor mit verified-match + Sync korrekt?
2. **Antworten von C + D abwarten**: Impressum (Auftrag seq 15) + Wächter-Vorteil (seq 17).
   Beim Briefkasten-Check schauen, ob sie gemeldet haben → `ack` nachziehen.
3. **Impressum-Footer auf Modell/Werkzeuge/Markt** ausweiten? (Klaus fragen.)
4. **Sage-Hochstufung A → verified-match** prüfen (status.json: „ausstehend").
5. **GENERALPROBE** planen, wenn Klaus startet.

## 3. Datenverträge / Spec **[nicht brechen]**

- **SIGNAL.json (§11.6):** `{ node, lastBuild, seq, headline, sporeUrl, nodeId, mailboxes, forNodes,
  ack, _doc, history }`. seq +1/Bau; ack[peer] = höchste gelesene seq; history nie zurücksetzen.
- **Reicher Briefkasten** liest: eigener Vektor/id aus `sbkim/spore.json`; pro Nachbar
  `sbkim/<peer>_inbox.json` (Spore + domainVector) für den Live-Cosinus; Nachbar-`SIGNAL.json`
  (seq) live; `ack` aus eigener SIGNAL. Schwelle verified-match ≥ 0.80.
- **Wächter:** nur Node-`fetch`, keine npm-Deps, kein Schreiben ins fremde Repo; Workflow öffnet
  Issue (Label `sbkim-watch`) nur bei Neuem.

## 4. Akzeptanzkriterien

- `npm test` grün; Live-Match reproduzierbar; UI im Browser verifiziert (sonst „wartet auf Klaus").
- Real/Demo getrennt; echte Krypto; kein PII (außer freigegebenem Impressum); offline.
- Bei Netz-Bau: `SIGNAL.json` `seq`+1 + `history` + Postfach-Quittung.

## 5. Empfohlene Reihenfolge

1. Pflichtlektüre + Briefkasten-Check (C/D-Antworten? ack nachziehen).
2. Nächsten Punkt mit Klaus wählen.
3. Schritt bauen + Test + (UI) Browser-Smoke + Doku.
4. Abschluss-Befehl (Teil 7).

## 6. Offene Fragen an Klaus

- Zeigt der reiche 📬 bei dir alle drei Nachbarn korrekt (Match + Sync)?
- Impressum-Footer auf die anderen Seiten ausweiten? Generalprobe planen?

## 7. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` anlegen — inkl. Pflichtlektüre (Teil 0) +
   diesem Abschluss-Befehl (Teil 7).
3. Brief **vollständig als Codeblock im Chat** ausgeben.
4. Bei Netz-Bau `SIGNAL.json` fortschreiben. Commit/Push; Merge nach der Regel oben.
