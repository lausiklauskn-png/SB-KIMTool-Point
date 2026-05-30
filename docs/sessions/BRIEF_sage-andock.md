# BRIEF — Sage-Andock fortsetzen (signierte Spore + Live-Austausch)

> Pflichtlektüre **vor** Arbeit (in Reihenfolge): `CLAUDE.md` → `PULS.md` →
> **dieser Brief** → `status.json` → `docs/ANDOCK.md` + `sbkim/AUSTAUSCH.md` + der Code der
> Scheibe (`scripts/generate_spore.mjs`, `sbkim/spore.json`, `test/andock.test.js`).
> Erst Überblick + Plan, dann Code. Leitplanken immer: Ehrlichkeit, `npm test`, Kein-PII,
> offline, „Merge entscheidet Klaus".

## Stand (2026-05-30)

- **Andock-Vertrag steht beidseitig.** Sage übernahm unsere kanonische Signier-Form
  (ANDOCK §4). Pflichtfelder: `createdAt`, `embeddingModel`.
- **Unsere Spore ist echt, signiert, getestet, veröffentlicht** unter `sbkim/spore.json`
  (nodeId `o-5_NJDSWHj2Yg4He9rIVCB3-iJ5OF_Nkkw1Ms2_LZc`). 5 Beweise grün, `npm test` 39/39.
- **Identität real, semantischer Match Demo** (`domainVector` = markierter Stub `_demo`).
- **Postfach** `sbkim/AUSTAUSCH.md` läuft: Lese-Quittung + Prüf-Rhythmus + Log. Jeder Knoten
  hält seine Datei im eigenen Repo und liest die des anderen direkt aus dem Netz.

## Was als Nächstes geplant ist

1. **Sage-Antwort einlesen:** Sobald Sage `…/Sage-Protokol/sbkim/AUSTAUSCH.md` (+ ggf.
   Verifikations-Bestätigung) veröffentlicht hat — per WebFetch lesen, Lese-Quittung im
   Status-Kopf stempeln, nächste Runde ins Log schreiben.
2. **Eingang prüfen:** Sages Spore/Antwort mit demselben Verifizierer gegenchecken
   (Signatur über sortierte kanonische Form, ausgenommen `signature`).
3. **Optional Ring:** Wenn die signierte Spore als echte Komponente in `status.json`
   aufgenommen wird, wächst der Real-Anteil-Ring der Startseite (mit Klaus abstimmen).

## Datenverträge

- Spore-Schema + Signier-Form: `docs/ANDOCK.md` (§2/§4), Demo-Grenze (§5).
- Austausch-Format: `sbkim/AUSTAUSCH.md` (Status-Kopf + Log; jeder Knoten eigene Datei).
- Schlüssel: privater Teil **nur** als Secret `SBKIM_NODE_KEY` (base64 PKCS8-PEM), **nie**
  ins Repo. Generator: `scripts/generate_spore.mjs` (`SPORE_OUT` übersteuert Ausgabepfad).

## Akzeptanzkriterien

- `npm test` grün (inkl. `andock.test.js`).
- `sbkim/spore.json`: Signatur verifiziert, `id == base64url(SHA256(roher Pubkey))`,
  `endpoint` endet auf `/`, `_demo` gesetzt, Pflichtfelder vorhanden.
- Austausch-Log + Lese-Quittungen aktuell.

## Offene Fragen an Klaus

1. Ist das Secret `SBKIM_NODE_KEY` hinterlegt? (Sonst signiert die nächste Sitzung mit
   neuer Identität.)
2. Hat Sage unsere Spore verifiziert + Status-Kopf eingetragen?
3. Sollen wir die signierte Spore als echte Komponente in `status.json` aufnehmen (Ring
   wächst)?

## Abschluss-Befehl für die Folge-Sitzung

`PULS.md` fortschreiben · neuen Brief `docs/sessions/BRIEF_<thema>.md` nach `VORLAGE_BRIEF.md`
anlegen (Pflichtlektüre + diesen Abschluss-Befehl wiederholen) · vollständigen Brief als
Codeblock im Chat ausgeben · ein Commit pro Aufgabe · Draft-PR mit Test-Plan.
