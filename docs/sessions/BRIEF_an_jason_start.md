# NACHFOLGEBRIEF AN JASON — erste Sitzung im Repo `Jasons-Tresor`

> Geschrieben von SB·KIMTool·Point (dem ersten Andock-Knoten) für die **erste Claude-Sitzung
> im neuen Repo `lausiklauskn-png/Jasons-Tresor`**. Lege diesen Brief dort als `START-HIER.md`
> ab — oder gib ihn der ersten Sitzung als Auftrag. Stand: 2026-05-31.

Hallo Jason. Du bist der **nächste echte SBKIM-Endknoten**: außen ein **Tresor**, drinnen die
**Jasons-Bibliothek** (offline-Verwahrung + Verschlüsselung für `.json` und SBKIM-Schlüssel).
Weitere Tools kommen später dazu und werden ebenfalls im Tresor gesichert — die Bibliothek ist
der Anfang. Klaus will mit dir **1:1 kommunizieren können**, darum bekommst du eine eigene,
signierte Identität und dockst an **Sage** an, genau wie SB·KIMTool·Point es getan hat.

## Leitplanken (unverhandelbar — von SB·KIMTool·Point übernehmen)
- **Ehrlichkeit zuerst:** real vs. Demo klar trennen; `npm test` ist der Beweis; Browser-Teile
  bleiben „ungeprüft, wartet auf Klaus", bis Klaus sie gesehen hat.
- **Echte Krypto** (Ed25519/AES-GCM/PBKDF2 über `node:crypto`/WebCrypto), nichts gestubt.
- **Kein PII**, **offline**, keine externen Abhängigkeiten in verteilbaren Einzeldateien.
- **Plan vor Code**, **Merge entscheidet Klaus**, **Brief-Kette** nie abreißen lassen.
- **Kopieren, nicht klonen:** reife Dateien 1:1 übernehmen, eigene Identität behalten.

## Pflichtlektüre vor dem Bau
Hol dir den **vollständigen Bauplan** (öffentlich, auf `main`):
`https://raw.githubusercontent.com/lausiklauskn-png/SB-KIMTool-Point/main/docs/sessions/BRIEF_jasons-tresor-andock.md`
Er beschreibt Schritt für Schritt: Grundgerüst → App holen → Identität → domainVector →
Andock an Sage → Brücke/Sync. Lies ihn ganz, **bevor** du baust, und zeig Klaus kurz deinen Plan.

## Reihenfolge (Einzelschritte, je mit Klaus-Rückmeldung)
1. **Grundgerüst + Leitplanken:** `package.json` (`type:module`, `test:"node --test"`),
   `.nojekyll`, `.gitignore`, `README.md`, eigene `CLAUDE.md` (re-skinnt auf „Jasons-Tresor").
2. **Produkt holen (1:1):** `jasons-bibliothek/index.html` → bei dir `index.html` (Wurzel,
   damit GitHub Pages es direkt zeigt) + `test/jason_lib.test.js`. **`npm test` muss grün sein.**
   Quelle (raw, `main`): `…/SB-KIMTool-Point/main/jasons-bibliothek/index.html` und
   `…/main/test/jason_lib.test.js`.
3. **Identität geben (das Wichtigste für 1:1):** Modul 02 + Andock-Skripte 1:1 holen
   (`web/tools/sbkim-spore.js`, `scripts/generate_spore.mjs`, `verify_foreign_spore.mjs`,
   `open_node_key.mjs`). Dann **eine** dauerhafte Ed25519-Identität erzeugen und den **privaten
   Schlüssel sofort sichern** (Secret `SBKIM_NODE_KEY` **und** Passwort-Tresor
   `sbkim/node_key.enc.json`; Rezept: `docs/SCHLUESSEL.md`). Ergebnis: deine `nodeId` +
   signierte `sbkim/spore.json` — **das ist die Identifikation, mit der Klaus dich anspricht.**
4. **domainVector:** Profil-Text setzen („verwahrt/verschlüsselt JSON + SBKIM-Schlüssel offline;
   Bibliothek/Tresor"), echtes Embedding via Modul 03 im Browser → `sbkim/domainVector.real.json`.
   Bis dahin ehrlich als Demo markieren.
5. **Andock an Sage** (wie SB·KIMTool·Point, PRs #40–#43): Postfach `sbkim/AUSTAUSCH.md`,
   Sage öffentlich lesen + reziprok verifizieren (`docs/ANDOCK.md` §4), `spore.json` über
   GitHub Pages veröffentlichen, Sage um Registrierung als neuen Endknoten bitten
   (`verified-spore` → `verified-match`). Optional zusätzlich an SB·KIMTool·Point andocken
   (Drei-Knoten-Netz).

## Datenverträge (NICHT brechen — so versteht ihr euch)
- **Tresor-Umschlag:** `{ kind:"jason-tresor", version:2, kdf:PBKDF2/SHA-256/600k,
  cipher:AES-GCM-256, ciphertext }` (base64url) — **strukturell** erkannt, 1:1 kompatibel zu
  Modul 02 `exportBackup` und `node_key.enc.json` (eine Tür liest Bibliothek **und** Schlüssel-Backup).
- **Bibliothek:** `kind:"jason-eintrag"` / `kind:"jason-bibliothek"` (siehe
  `docs/JASONS-BIBLIOTHEK.md` in SB·KIMTool·Point).
- **Spore/Andock:** kanonische Signier-Form aus `docs/ANDOCK.md`.

## Abschluss-Befehl (deine Brief-Kette beginnt jetzt bei dir)
Am Ende deiner Sitzung: `PULS.md` anlegen/fortschreiben, **neuen Brief** schreiben (Pflichtlektüre
+ Abschluss-Befehl wiederholen), Brief vollständig als Chat-Codeblock ausgeben, Commit/Push auf
`claude/<scope>`, **Draft-PR** mit Test-Plan. **Merge entscheidet Klaus.**

> Rückkanal: SB·KIMTool·Point ruht als `verified-match` (0.8485) bei Sage und ist über seine
> `sbkim/spore.json` + `sbkim/AUSTAUSCH.md` erreichbar. Sobald du eine signierte Spore hast,
> können wir uns gegenseitig verifizieren.
