# BRIEF — Rezeptbuch + Mixarium: reziproke Neu-Einstufung, „Teil-des-Netzes"-Versuch, v0.2

> Folge-Sitzung, NACHDEM SB-KIMTool-Point v0.2 abgeschlossen ist. Arbeitet an den **anderen
> Repos** (Mein-Rezeptbuch, Mein-Mixarium). Ziel: das Netz ehrlich nachziehen UND Klaus'
> „Teil-des-Netzes"-Idee kontrolliert testen — als Vorbereitung fürs eigentliche Ziel
> (Firmen-PDF-Suchwerkzeug: semantische, bidirektionale Suche + KI-Richter als Nachbrenner).

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

1. `CLAUDE.md` des jeweiligen Repos (Rezeptbuch bzw. Mixarium).
2. `PULS.md` / Projektstand dort.
3. **diesen Brief.**
4. Toolpoints Stand als Quelle: `SB-KIMTool-Point/sbkim/spore.json` (v0.2, nodeId
   `CyunQNDR…`), `sbkim/SIGNAL.json` **seq 34** (Bitte um reziproke Neu-Einstufung),
   `web/data/marktplatz.json` (neue Werte).

**Immer frisch von `origin/main` abzweigen** (SBKIM-Sitzungsstart-Pflicht).

## 1. Stand **[Pflicht]**

- **SB-KIMTool-Point ist auf v0.2 abgeschlossen** (2026-07-14, PRs #123–#127):
  saubere Identität `CyunQNDR…`, verbunden (Mycel-Karte bestätigt), Spore v0.2 mit voller
  Domänen-Beschreibung neu signiert, `node --test` 120/120.
- **Folge fürs Netz:** Toolpoints reichere Beschreibung rückt es zur Infrastruktur. Die
  Cosinus-Werte **aus Toolpoints Sicht**: Sage 0.8618 · Jasons-/Mein-Tresor 0.8624 · family
  0.8492 (verified-match) — **Rezeptbuch 0.7961 · Mixarium 0.7673 jetzt < 0.80** (→ von
  Toolpoint auf verified-spore herabgestuft). Das ist **gewollt** (Werkzeug-Hub ≠ Inhalts-Knoten).
- **Offen:** Rezeptbuch + Mixarium tragen in **ihren** Akten noch „Toolpoint = verified-match
  0.83/0.80". Das ist jetzt veraltet und muss reziprok nachgezogen werden.

## 2. Ziel dieser Aufgabe **[Pflicht]**

Rezeptbuch und Mixarium (a) stufen Toolpoint reziprok neu ein (ehrlich < 0.80), (b) führen
Klaus' kontrollierten Versuch durch — hebt ein Zusatz „Teil des SBKIM-Knotennetzes / Sage-
Protokolls" in **ihrer eigenen** Beschreibung den Match zu Toolpoint (und zu den Hubs) wieder
über 0.80? — und (c) werden selbst sauber auf v0.2 gebracht.

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**

Pro Repo (Rezeptbuch, dann Mixarium):
- **Reziproke Neu-Einstufung:** Toolpoints aktuelle `spore.json` (v0.2) holen, den Cosinus
  eigener Vektor ↔ Toolpoints neuer `domainVector` nachrechnen (~0.796 / ~0.767), die eigene
  Akte (Inbox/Marktplatz/Status) von „verified-match" auf „verwandt-unter-Schwelle / verified-
  spore" ehrlich nachziehen. `ack` für Toolpoints SIGNAL seq 34 setzen.
- **Kontroll-Versuch „Teil des Netzes":** einmal MESSEN ohne, einmal MIT dem Zusatzsatz in
  der eigenen `domainDescription` (z. B. „… Teil des SBKIM-Knotennetzes rund um Sage-Protokoll
  und SB-KIMTool-Point."). Beide Cosinus-Werte (zu Toolpoint UND zu Sage) dokumentieren →
  zeigt, ob Netz-Zugehörigkeit den Match hebt. **Ergebnis an Klaus, er entscheidet**, ob der
  Satz dauerhaft rein soll.
- **v0.2:** die eigene Live-Spore auf v0.2 heben (protocolVersion + snippetVectors), nodeId
  unverändert; vor dem Commit **alle** eigenen Peer-Matches headless prüfen (nichts unter 0.80
  fallen lassen, ohne es zu benennen — wie bei Toolpoint).
- **Ehrlich testen:** node/headless grün; Browser-Sichttest durch Klaus.

## 4. Datenverträge / Spec **[Pflicht]**

Keine neuen. Spore v0.2 (9 Pflichtfelder + optional snippetVectors), nodeId bleibt,
Andock-Schwelle 0.80 unberührt. Match = Cosinus zweier L2-normalisierter domainVectors.

## 5. Akzeptanzkriterien **[Pflicht]**

- Rezeptbuch + Mixarium führen Toolpoint ehrlich als < 0.80 (kein falscher „voller Match").
- Kontroll-Versuch dokumentiert (mit/ohne Zusatz, beide Werte) → Klaus-Entscheid.
- Beide Spores v0.2, alle behaltenen Matches ≥ 0.80 headless verifiziert. Tests grün.

## 6. Empfohlene Reihenfolge

1. Rezeptbuch: reziproke Neu-Einstufung → Kontroll-Versuch messen → Klaus zeigen → v0.2.
2. Mixarium: dasselbe.
3. Kurz mit Klaus über Netz-Form (Stern vs. Netz unter Gleichen) + das PDF-Suchwerkzeug reden.

## 7. Offene Fragen an Klaus

- Soll der Zusatz „Teil des SBKIM-Knotennetzes" dauerhaft in Rezeptbuch/Mixarium (abhängig
  vom Messergebnis)?
- Netz-Form: gleiches-Thema-Match (Hubs matchen Inhalts-Apps NICHT) oder Zugehörigkeits-Match?
- Nächster Baustein Richtung Firmen-PDF-Tool: pro-Dokument-Vektor + KI-Richter-Nachbrenner —
  wann spec'en wir das?

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

1. `PULS.md` des jeweiligen Repos fortschreiben (getan / offen / nächste Schritte + Manual-Check).
2. **Neuen** Brief nach der Repo-Vorlage anlegen (inkl. Pflichtlektüre Teil 0 + diesem Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. Selbst-Merge nach Freibrief,
   wenn headless grün + abgegrenzt; Klaus' Browser-Sichttest bleibt der Schluss-Beweis.
5. **Quittung an SB-KIMTool-Point** (dessen SIGNAL seq 34): `ack` setzen + im eigenen SIGNAL
   melden, dass ihr Toolpoint neu eingestuft habt.
