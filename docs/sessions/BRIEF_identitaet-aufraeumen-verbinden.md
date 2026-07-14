# BRIEF — EINE saubere Identität herstellen + sauber verbinden (nach dem Wechsler-Port)

> Folge-Sitzung nach dem Identitäts-Wechsler-Port (Baustein 5). Der Wizard ist jetzt
> **vollständig wie Sage** — jetzt die im Browser angehäuften Test-Identitäten aufräumen,
> **eine** saubere v0.2-Identität etablieren und sauber im Netz-Raum verbinden. Ein großer
> Teil davon ist **Klaus' Browser-Arbeit**; diese Sitzung begleitet + dokumentiert.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge:

1. `CLAUDE.md` (Verfassung) — u. a. § „Quelle der Wahrheit": **Sage gilt, hier nachziehen.**
2. `PULS.md` (aktueller Stand — besonders Nachträge 2026-07-14 (2)/(3)/(5)).
3. **diesen Brief.**
4. `status.json` (Real-Anteil, protocolVersion 0.2).
5. Code der Scheibe:
   - `assets/sbkim-siegel.js` — der 🔑-Wizard inkl. **neuem Identitäts-Wechsler**
     (`refreshWizardIdentities`, `#wiz-ident-select`, `#wiz-o5`) + ✍-Re-Sign-Pfad.
   - `web/tools/sbkim-spore.js` — Modul 02 (Multi-Identität: `listIdentities` /
     `getActiveIdentityKey` / `setActiveIdentity` / `removeIdentity` / `importBackup`).
   - `sbkim/spore.json` (live, nodeId `CyunQNDR…`, v0.1) + `sbkim/node_key.enc.json`.

**Freibrief gilt** (siehe Sage-`CLAUDE.md` § Freibrief). Aber: die eigentliche Identitäts-
Wahl im Browser ist **Klaus' Geste** — hier **nichts blind neu signieren/verbinden**, sondern
Klaus begleiten. Der Netz-relevante Schritt (nodeId ändern) ist ein echter Richtungsentscheid
→ **erst Klaus fragen** (siehe Punkt 7).

---

## 1. Stand **[Pflicht]**

- **Gemerged:** #119 (Browser-✍ v0.2), #120 (Tangel dokumentiert), #121 (14 Module byte-1:1),
  **Identitäts-Wechsler-Port (dieser Brief-Vorgänger): Baustein 5 im 🔑-Wizard, `node --test`
  117/117, `fake-indexeddb` devDependency deklariert.**
- **Wizard jetzt vollständig wie Sage** (Schritte 1–4 + Identitäts-Wechsler). Damit ist das
  Werkzeug da, um die Identitäts-Anhäufung im Browser sichtbar zu machen und aufzulösen.
- **Offen (Kern des Tangels, PULS Nachtrag (3)):** die committete/netz-bekannte nodeId ist
  `CyunQNDR…` (aus dem **Node-Schlüssel** `node_key.enc.json`). Der **Browser** hat davon
  getrennte Test-Identitäten angelegt (`lZmu5nsP…`, `Z5i5Es1A…`). Ohne Wechsler kam man nicht
  zurück — **jetzt geht es.**

## 2. Ziel dieser Aufgabe **[Pflicht]**

Am Ende hat der Browser **eine** saubere, gewollte SBKIM-Identität für SB-KIMTool-Point, mit
der signiert/gesichert/verbunden wird — und die **committete `sbkim/spore.json` bleibt konsistent**
mit dem, was im Netz bekannt ist (nodeId `CyunQNDR…`, sofern Klaus nicht ausdrücklich einen
Identitäts-Wechsel im Netz will). Test-Identitäten sind aufgeräumt.

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**

- **Begleiten (Klaus' Browser, Einzelschritte):**
  1. Siegel → 🔑-Wizard öffnen → **Identitäts-Wechsler** ansehen: welche Identitäten liegen im
     Browser, welche ist aktiv?
  2. **Kanon-Identität `CyunQNDR…` in den Browser bringen** (PULS Nachtrag (3), Weg 2 —
     empfohlen, **kein** Netz-Churn): Konverter `node_key.enc.json` (PBKDF2-600k + AES-GCM) →
     Modul-02-`importBackup`-Backup → Wizard-Schritt 4 „Wiederherstellen". Krypto ist
     deckungsgleich → nodeId bleibt `CyunQNDR…`.
  3. Über den **Wechsler** `CyunQNDR…` aktiv setzen, überzählige Test-Identitäten
     entfernen (ggf. `removeIdentity`-Pfad ergänzen, falls Klaus das im UI braucht —
     **eigener kleiner Bau**, dann fail-soft + Test).
  4. Per **Browser-✍** v0.2 neu signieren (Beschreibung übernehmen) → `CyunQNDR…` bleibt,
     Spore trägt jetzt `snippetVectors`. `spore.json` herunterladen → nach `sbkim/spore.json`
     committen.
- **Pflegen:** `PULS.md` (Ergebnis der Aufräumung); `sbkim/SIGNAL.json` (`seq`+1, headline);
  ggf. `status.json` NUR wenn sich der Real-Anteil ehrlich ändert.
- **Testen:** wenn ein `removeIdentity`-UI-Pfad dazukommt → Logik-Test erweitern
  (`test/identity_switcher.test.js`), `node --test` grün. **Kein** `web/tools/`-Modul ändern
  (Drift-Guard). Browser-Sichttest = Klaus.

## 4. Datenverträge / Spec **[Pflicht, falls Module/Dateien Daten teilen]**

Keine neuen. Modul-02-Fläche (`listIdentities`/`getActiveIdentityKey`/`setActiveIdentity`/
`removeIdentity`/`importBackup`) unverändert byte-1:1 mit Sage. Spore-Vertrag v0.2 (9 Pflichtfelder
+ optional `snippetVectors`). nodeId `CyunQNDR…` bleibt, es sei denn Klaus entscheidet anders
(dann alte ID → `previousNodeIds`, Peers re-verifizieren).

## 5. Akzeptanzkriterien (Erfolgsmerkmale) **[Pflicht]**

- Browser zeigt im Wechsler **genau eine** gewollte aktive Identität; Test-Junk weg.
- `sbkim/spore.json` konsistent zum Netz (nodeId `CyunQNDR…`), v0.2, ggf. mit Schnipseln.
- `node --test` grün (falls Code dazukam); ehrliche Schließung „Browser-Sichttest durch Klaus".

## 6. Empfohlene Reihenfolge (Einzelschritte)

1. `git fetch origin main` → Branch frisch von `origin/main`.
2. Mit Klaus im Browser: Wechsler öffnen, Ist-Zustand sichten (welche IDs, welche aktiv).
3. Kanon-Identität `CyunQNDR…` via Backup→Wiederherstellen in den Browser bringen.
4. Wechsler auf `CyunQNDR…`, Test-Identitäten entfernen (ggf. kleiner `removeIdentity`-UI-Bau).
5. Browser-✍ v0.2 neu signieren → `spore.json` → nach `sbkim/spore.json` committen.
6. `PULS.md` + `sbkim/SIGNAL.json` pflegen; `node --test` grün.
7. Commit + Draft-PR mit Test-Plan; Selbst-Merge nach Freibrief bei headless grün + abgegrenzt.

## 7. Offene Fragen an Klaus

- **Weg 2 (empfohlen, kein Netz-Churn)** — Kanon `CyunQNDR…` in den Browser holen und behalten
  — oder **Weg 3** (eine Browser-Identität als neue Kanon-ID adoptieren, Netz einmalig nachziehen)?
  Weg 3 ist ein echter Netz-Richtungsentscheid (alte ID → `previousNodeIds`, Peers re-verifizieren)
  → nur mit deinem ausdrücklichen Ja.
- Soll der Wechsler auch einen **„Identität löschen"-Knopf** bekommen (für das Aufräumen im
  Browser), oder reicht das Umschalten fürs Erste?

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

Am Ende **dieser** Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach `VORLAGE_BRIEF.md` anlegen —
   inkl. Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. Selbst-Merge nach Freibrief,
   wenn headless grün + abgegrenzt; Klaus' Browser-Sichttest bleibt der Schluss-Beweis.
