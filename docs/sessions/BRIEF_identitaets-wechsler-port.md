# BRIEF — Identitäts-Wechsler (Baustein 5) in den 🔑-Wizard portieren

> Frischer, fokussierter Durchgang. Ein kleiner UI-Baustein aus **Sage** (Quelle der
> Wahrheit) in den SB-KIMTool-Point-Wizard, dann **Klaus' Browser-Sichttest**. Klein
> halten — nichts anderes anfassen.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge:

1. `CLAUDE.md` (Verfassung) — u. a. § „Quelle": **Sage gilt, hier nachziehen.**
2. `PULS.md` (aktueller Stand)
3. **diesen Brief**
4. `status.json` (Real-Anteil, jetzt protocolVersion 0.2)
5. Der Code der Scheibe:
   - **Vorlage (Sage):** `Sage-Protokol/index.html` — Dropdown bei Zeile ~3815–3824
     (`<h3>Identitäts-Wechsler</h3>` + `<select id="sage-andock-identity-select"
     onchange="andockSwitchIdentity(this.value)">`), Logik `refreshAndockIdentities()`
     ~Z. 4459 + `andockSwitchIdentity()` ~Z. 4484.
   - **Ziel (hier):** `assets/sbkim-siegel.js` — `buildWizardDialog()` ~Z. 392
     (aktuell Schritte 1–4, **kein** Schritt 5), `openWizard()` ~Z. 505.
   - **API-Nachweis:** `web/tools/sbkim-spore.js` trägt `listIdentities()`,
     `getActiveIdentityKey()`, `setActiveIdentity()` (byte-1:1 mit Sages Modul 02, PR #121).

**Freibrief gilt** (siehe Sage-`CLAUDE.md` § Freibrief): dieser Port ist klein,
logisch, byte-nah an Sage — ohne Rückfrage umsetzen, dann headless testen. Klaus'
Browser-Sichttest bleibt der Schluss-Beweis.

---

## 1. Stand **[Pflicht]**

- **Gemerged:** PR #119 (Browser-✍-Signierknopf auf Spore v0.2), #120 (Identitäts-Tangel
  + Aufräum-Plan dokumentiert), **#121 (2. Hub aus Sage neu bespielt — alle 14 geteilten
  Module byte-1:1 mit Sage, `node --test` 111/111).** origin/main trägt das alles.
- **Sage ist verifiziert vollständig:** Siegel + voller Andock-Wizard **inkl.
  Identitäts-Wechsler** (Baustein 5) + v0.2-Sporen-Pflege + „Mit dem Knotennetz
  verbinden" (Modul 23). Das ist die Quelle.
- **Die eine Lücke hier:** SB-KIMTool-Points 🔑-Wizard (`assets/sbkim-siegel.js`) hat nur
  Schritte 1–4. Der **Identitäts-Wechsler fehlt** — das ist die dokumentierte Ursache des
  „Doppel-/Dreifach-Identitäts"-Problems: ohne sichtbaren Wechsler sammeln sich aus Tests
  mehrere Browser-Identitäten an, und man signiert/verbindet versehentlich mit der falschen.
- **Offen:** genau dieser Port + Klaus' Sichttest. Danach: Klaus räumt seine Test-
  Identitäten auf, etabliert EINE saubere v0.2-Identität, verbindet sauber. Erst dann
  weiter „mit den anderen Apps" (Mixarium → Rezeptbuch → BLP …), immer aus Sage propagiert.

## 2. Ziel dieser Aufgabe **[Pflicht]**

Im 🔑-Wizard erscheint unter Schritt 4 ein **Identitäts-Wechsler**: ein Dropdown aller
im Browser vorhandenen SBKIM-Identitäten, die **aktive** ist markiert, Auswahl setzt die
aktive Identität (`SbkimSpore.setActiveIdentity`). So kann Klaus sichtbar die richtige
Identität wählen, bevor er signiert / sichert / verbindet — das Identitäts-Tangel ist
damit im Browser lösbar, ohne Termux.

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**

- **Bauen (nur `assets/sbkim-siegel.js`):**
  1. In `buildWizardDialog()` **nach** dem `</ol>` (Ende Schritt 4, vor dem Schluss-`<p>`)
     einen Abschnitt „Identitäts-Wechsler" mit `<select id="wiz-ident-select">` + Ausgabe
     `<div id="wiz-o5">` einfügen (re-geskinnt in der bestehenden Wizard-Optik, kein
     neuer Look).
  2. Funktion `refreshWizardIdentities(dlg)`: liest `SbkimSpore.listIdentities()` +
     `getActiveIdentityKey()`, füllt das Dropdown, markiert die aktive („(aktiv)"),
     fail-soft wenn Modul/Funktion fehlt (Wechsler bleibt still leer — nie Crash, nie
     toter Knopf; Fremdnutzer-Brille).
  3. `change`-Handler → `SbkimSpore.setActiveIdentity(key)` → danach `refreshWizardIdentities`
     erneut + kurze Bestätigung in `#wiz-o5`.
  4. Refresh **auslösen**: (a) nach erfolgreichem Schritt 1 (`getOrCreateIdentity`-`then`),
     (b) beim Öffnen in `openWizard()`.
  - Vorlage 1:1 aus Sage (`refreshAndockIdentities`/`andockSwitchIdentity`), nur IDs an den
    hiesigen Dialog angepasst (`wiz-ident-select`/`wiz-o5`).
- **Pflegen:** `PULS.md` (Baustein 5 ergänzt → Wizard jetzt vollständig wie Sage);
  `sbkim/SIGNAL.json` (`seq`+1, headline). **Kein** Modul-Code in `web/tools/` anfassen
  (Drift-Guard!). **Kein** `status.json`/PROTOCOL_VERSION-Bump.
- **Testen:**
  - Headless: ein kleiner Node-Test (oder Erweiterung eines bestehenden) beweist, dass
    `web/tools/sbkim-spore.js` mehrere Identitäten führen + die aktive wechseln kann
    (`getOrCreateIdentity` → 2. via passendem API-Weg → `listIdentities().length>=1`,
    `setActiveIdentity` → `getActiveIdentityKey` stimmt). Die **UI-Verdrahtung** ist
    DOM/Browser → **ehrlich als „ungeprüft, wartet auf Klaus' Browser-Lauf" markieren.**
  - Drift-Guard `node --test` muss grün bleiben (web/tools unangetastet).
  - **Klaus' Browser-Sichttest:** Wizard öffnen → Dropdown zeigt die Identität(en),
    aktive markiert; Wechseln setzt sie; nach „Identität erzeugen" taucht die neue auf.

## 4. Datenverträge / Spec **[Pflicht, falls Module/Dateien Daten teilen]**

Keine neuen Verträge. Genutzt wird nur die **bestehende** öffentliche Fläche von Modul 02:
`listIdentities() -> Promise<string[]>`, `getActiveIdentityKey() -> Promise<string>`,
`setActiveIdentity(key) -> Promise<void>`. Keine Änderung an Modul 02 selbst (byte-1:1 mit
Sage bleibt Pflicht — sonst Drift-Guard rot).

## 5. Akzeptanzkriterien (Erfolgsmerkmale) **[Pflicht]**

- Wizard zeigt einen 5. Abschnitt „Identitäts-Wechsler" mit befülltem Dropdown.
- Auswahl wechselt die aktive Identität (nachweisbar: erneutes Öffnen zeigt neue Markierung).
- Fehlt Modul 02 / gibt es keine Identität → Dropdown bleibt still „— keine geladen —",
  **kein Crash** (fail-soft).
- `node --test` (Drift-Guard + neuer Logik-Test) grün.
- Ehrliche Schließung: UI „ungeprüft, wartet auf Klaus' Browser-Lauf".

## 6. Empfohlene Reihenfolge (Einzelschritte)

1. `git fetch origin main` → Branch frisch von `origin/main` (nicht auf altem Stand bauen).
2. Sage-Vorlage (`refreshAndockIdentities`/`andockSwitchIdentity` + Dropdown-HTML) lesen.
3. HTML-Abschnitt + drei Funktionen in `assets/sbkim-siegel.js` einbauen, Refresh-Hooks setzen.
4. Headless-Logik-Test schreiben/erweitern, `node --test` grün.
5. `PULS.md` + `sbkim/SIGNAL.json` pflegen.
6. Commit + Draft-PR mit Test-Plan; nach Freibrief selbst mergen (headless grün, abgegrenzt),
   Klaus prüft dann live.
7. **Chat:** „Nächste Schritte"-Block + diesen (nächsten) Brief als Codeblock.

## 7. Offene Fragen an Klaus

- Nach dem Port: möchtest du erst **hier** (2. Hub) sauber eine EINE-Identität herstellen
  und verbinden, bevor wir „mit den anderen Apps" weitermachen? (Empfehlung: ja — erst der
  Hub sauber, dann Mixarium → Rezeptbuch → BLP aus Sage propagieren.)

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

Am Ende **dieser** Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach `VORLAGE_BRIEF.md` anlegen —
   inkl. Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. Selbst-Merge nach
   Freibrief, wenn headless grün + abgegrenzt; Klaus' Browser-Sichttest bleibt der
   Schluss-Beweis.
