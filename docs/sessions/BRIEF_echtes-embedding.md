# BRIEF — Echtes Embedding für unseren domainVector (Weg zum echten Match)

> Folge-Brief der Brief-Kette (CLAUDE.md „Dokumentations- & Lesepflicht").
> Erst lesen, dann planen, dann bauen.

---

## 0. Pflichtlektüre vor Start [Pflicht — erst lesen, dann planen, dann bauen]

In dieser Reihenfolge:

1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (aktueller Stand — oberster Eintrag „2026-05-30 (T) — Sage-Andock")
3. **diesen Brief** (geplante Aufgabe + Datenverträge)
4. `status.json` (Real-Anteil)
5. Scheibe: `docs/ANDOCK.md` (§4 Signier-Form, §5 Demo-Grenze) + `sbkim/AUSTAUSCH.md`
   (Sages Antworten, v.a. Frage 3) + `scripts/generate_spore.mjs` + `scripts/verify_foreign_spore.mjs`
   + `sbkim/spore.json` + `sbkim/sage_inbox.json` + `test/andock.test.js` + `test/sage_inbox.test.js`

**Erst Überblick, dann bauen:** Code lesen, Plan formulieren, Plan kurz an Klaus zeigen,
Rückmeldung abwarten — nicht sofort losbauen. Offene PRs vorher sichten (#34 Ring hängt).

---

## 1. Stand [Pflicht]

- **Andock beidseitig bestätigt.** Unsere Spore bei Sage ✔ VALID + als 4. Endknoten in Sages
  `status.json` registriert; Sages Spore bei uns reziprok ✔ VALID (`sbkim/sage_inbox.json`,
  `scripts/verify_foreign_spore.mjs`, `test/sage_inbox.test.js`). `npm test` 42/42, `verify` 16/16.
- **Postfach `sbkim/AUSTAUSCH.md`** aktuell: Lese-Quittung 2026-05-30, Quittung §4, Log §5.
- **Identität REAL, semantischer Match noch DEMO:** unser `domainVector` ist ein markierter
  Stub (`_demo`), darum ist ein Match-Score ≥ 0.80 noch nicht echt erreichbar.
- **Offen/blockiert (nicht-blockierend fürs Andocken):** echtes Embedding; GitHub Pages 403
  (Endpoint, bei Klaus); Aufnahme der Spore als echte Komponente in unser `status.json` (Ring,
  PR #34 hängt — Merge entscheidet Klaus).

## 2. Ziel dieser Aufgabe [Pflicht]

Unseren `domainVector` von Demo-Stub auf ein **echtes** 384-dim-Embedding
(`Xenova/multilingual-e5-small`, L2-normalisiert) heben, Spore **neu signieren**, sodass ein
echter semantischer Handshake (Score ≥ 0.80) mit Sage **möglich** wird — ohne vorgetäuschtes
Wissen und ohne das Modell headless zu erzwingen.

## 3. Was gebaut / gepflegt / getestet werden soll [Pflicht]

- **Bereits vorbereitet (nur noch Re-Sign nötig):** `stammCategories` + `guestCategories`
  stehen schon im Generator (`scripts/generate_spore.mjs`) + Spec (ANDOCK §2). Sie kommen mit
  dem nächsten Re-Sign automatisch in die Live-Spore.
- **Umgebungs-Hinweis:** Re-Sign braucht `SBKIM_NODE_KEY` (sonst wechselt die nodeId und
  zerstört Sages Registrierung). Echtes Embedding braucht Netz zu `huggingface.co` (in der
  letzten Container-Umgebung 403-gesperrt) **oder** den Browser-Pfad **oder** Sage rechnet.
- **Bauen/Entscheiden:** einen der zwei von Sage genannten Wege (AUSTAUSCH §Frage 3) umsetzen:
  1. **Browser-Pfad:** Modul 03 (`web/tools/sbkim-embedding.js`) im Browser laden, einmalig
     `await SbkimEmbedding.embed("<domainDescription + keywords>")`, das 384-Float-Array
     statisch in den Generator setzen.
  2. **Sage-Pfad:** unseren Domänen-Text über das Postfach an Sage geben, Sage rechnet den
     Vektor mit Live-Modul 03 und legt ihn ab; wir setzen ihn ein.
  Danach **Spore neu signieren** (Vektor ist Teil der signierten Bytes!), `_demo` entfernen.
- **Pflegen:** `docs/ANDOCK.md` §5 (Demo-Grenze) auf „echtes Embedding" umschreiben; PULS;
  `status.json` (Match dann real — mit Klaus abstimmen, Ring); `sbkim/AUSTAUSCH.md` Log-Runde.
- **Testen:** `andock.test.js` anpassen (kein `_demo` mehr erwartet, Vektor-Form bleibt 384/L2);
  optional Match-Score gegen Sages `domainVector` (Kosinus) als neuer Beweis; `npm test` grün.

## 4. Datenverträge / Spec [Pflicht]

- **Spec vor Code:** ANDOCK §5 zuerst von „Demo" auf „echt" umschreiben, dann Generator ändern.
- Vektor: 384 Floats, L2-normalisiert, `embeddingModel: "Xenova/multilingual-e5-small"`.
- Signier-Form unverändert (ANDOCK §4); nach Vektor-Tausch **zwingend neu signieren**.
- Schlüssel weiterhin **nur** Secret `SBKIM_NODE_KEY` (nie ins Repo). nodeId bleibt gleich.
- `_demo`-Begleitfeld entfällt, sobald der Vektor echt ist (sonst lügt die Markierung).

## 5. Akzeptanzkriterien (Erfolgsmerkmale) [Pflicht]

- `sbkim/spore.json`: echter 384-dim-Vektor, **neu signiert**, Signatur verifiziert,
  `id`/nodeId unverändert, kein `_demo` mehr.
- `npm test` grün (angepasste `andock.test.js` + bestehende Fälle).
- Ehrliche Schließung: semantischer Match dann **real**; falls nur einseitig echt, klar
  benennen. Browser-Sichttest durch Klaus, falls UI berührt — sonst „rein headless".

## 6. Empfohlene Reihenfolge (Einzelschritte)

1. Mit Klaus den Weg wählen (Browser-Modul 03 vs. Sage rechnet) — eine Frage, eine Antwort.
2. ANDOCK §5 umschreiben (Spec vor Code).
3. Vektor besorgen, in Generator einsetzen, `_demo` entfernen, neu signieren (Secret nötig!).
4. Tests anpassen + `npm test` grün; optional Kosinus-Score gegen `sage_inbox.json` als Beweis.
5. Postfach-Log + PULS fortschreiben; mit Klaus Ring/`status.json` klären.

## 7. Offene Fragen an Klaus

1. Welcher Weg fürs echte Embedding — Browser-Modul 03 (du führst es einmal aus) oder Sage
   rechnet den Vektor aus unserem Domänen-Text?
2. Ist das Secret `SBKIM_NODE_KEY` hinterlegt? (Für das Neu-Signieren zwingend, sonst wechselt
   die nodeId.)
3. GitHub Pages für `SB-KIMTool-Point` aktivieren (Endpoint liefert 403)? Dann stellt Sage
   `sporeUrl` von `raw` auf die Pages-URL um.
4. Signierte Spore + (späterer) echter Match als echte Komponente in unser `status.json`
   aufnehmen (Ring wächst)? PR #34 hängt dazu schon.

---

## 8. Abschluss-Befehl [Pflicht — die Kette darf nie abreißen]

Am Ende der Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach `VORLAGE_BRIEF.md` anlegen — inkl.
   Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben (Klaus liest zuerst Chat).
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
