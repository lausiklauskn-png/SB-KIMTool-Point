# BAUPLAN & ANDOCK — Jasons-Tresor (neuer SBKIM-Endknoten)

> Dieser Brief gehört in das **neue** Repo `lausiklauskn-png/Jasons-Tresor`.
> Er ist von SB-KIMTool-Point geschrieben, das den Andock an Sage bereits vollzogen hat.
> Lege ihn dort als `START-HIER.md` ab (oder gib ihn der ersten Claude-Sitzung dort).
> Stand: 2026-05-31.

**Was Jasons-Tresor ist:** die herunterladbare **Bibliothek/Tresor** (von außen ein Tresor,
drinnen eine „Jasons-Bibliothek") für beliebige `.json` + SBKIM-Schlüssel — UND ein **echter
SBKIM-Endknoten** mit eigener Identität, der wie SB-KIMTool-Point an **Sage** andockt. Ziel:
Klaus kann 1:1 mit dem Tresor kommunizieren (gemeinsames Format + Andock-Postfach).

**Wichtig (Scope-Grenze):** SB-KIMTool-Point kann dieses Repo nicht fernsteuern. Jasons-Tresor
baut sich **selbst** aus den getesteten Originalen — diese sind öffentlich über
`raw.githubusercontent.com/lausiklauskn-png/SB-KIMTool-Point/<ref>/<pfad>` lesbar
(`<ref>` = `main`, **nachdem PR #44 gemergt ist**; vorher der Branch
`claude/sage-andock-continue-SI1Lu`). 1:1 kopieren, nicht abwandeln.

---

## 0. Pflichtlektüre / Leitplanken (von SB-KIMTool-Point übernehmen)

Hol dir aus SB-KIMTool-Point **1:1** und passe nur Projektname/Identität an:
- `CLAUDE.md` (Verfassung) — re-skinnen auf „Jasons-Tresor", Leitplanken unverändert:
  Ehrlichkeit, echte Krypto, `npm test` = Beweis, kein PII, offline, „Merge entscheidet Klaus",
  Plan-vor-Code, Brief-Kette.
- `docs/SCHLUESSEL.md` (Schlüssel-Disziplin), `docs/ANDOCK.md` (Andock-Vertrag).

## 1. Repo-Grundgerüst

- `package.json`: `"type":"module"`, Scripts `test: "node --test"`, `demo`, `verify`.
- `.nojekyll`, `.gitignore` (`node_modules`), `README.md`, `CLAUDE.md` (s. o.).
- Branch-Disziplin: Entwicklung auf `claude/<scope>`, Draft-PR, Merge durch Klaus.

## 2. Das Produkt holen (die App IST der Tresor)

Kopiere **1:1** aus SB-KIMTool-Point:
- `jasons-bibliothek/index.html`  → bei dir z. B. `index.html` (Wurzel, damit Pages es direkt
  zeigt) oder `tresor/index.html`. Das ist die fertige Bibliothek **mit Tresor**
  (Scheibe 1+2: laden/benennen/ordnen/suchen/exportieren/einlesen + Passwort-Verschlüsselung
  AES-256-GCM/PBKDF2-SHA256 600k, gleicher Umschlag wie Modul 02).
- `test/jason_lib.test.js` → dein `test/…` (prüft den Kern aus der ausgelieferten Datei).
- Optional Name drinnen: „Jasons-Bibliothek" behalten ODER auf „Jasons-Tresor" vereinheitlichen
  (Klaus entscheidet). `npm test` muss grün sein.

## 3. Eigene Identität geben (Modul 02 + Spore) — **so wird der Tresor ein Knoten**

Kopiere **1:1**: `web/tools/sbkim-spore.js` (Modul 02, hat `exportBackup`/`importBackup`),
`scripts/generate_spore.mjs`, `scripts/verify_foreign_spore.mjs`, `scripts/open_node_key.mjs`.

Dann **eine** eigene, dauerhafte Identität erzeugen (Ed25519, `nodeId = base64url(SHA-256(pubKey))`):
1. `node scripts/generate_spore.mjs` **ohne** Secret → erzeugt einen flüchtigen Schlüssel +
   `sbkim/spore.json`. Notiere die ausgegebene `nodeId`.
2. **Schlüssel sofort sichern** (sonst ist die nodeId beim nächsten Lauf weg — genau der Fehler,
   den SB-KIMTool-Point einmal hatte): privaten Schlüssel als Umgebungs-Secret `SBKIM_NODE_KEY`
   **und** als Passwort-Tresor `sbkim/node_key.enc.json` ablegen (Rezept: `docs/SCHLUESSEL.md`;
   der Tresor darf ins Repo, das Passwort **nie**).
3. Re-Sign ab dann **mit** Secret/Tresor → nodeId bleibt stabil.

**Das ist die Identifikation, mit der Klaus 1:1 mit dem Tresor kommuniziert:** die `nodeId` +
die signierte `spore.json`. Alles, was der Tresor „sagt", ist damit prüfbar signiert.

## 4. domainVector (was der Tresor „kann")

`stammCategories`/`guestCategories` + Klartext-Profil in `generate_spore.mjs` setzen
(z. B. „verwahrt und verschlüsselt JSON-Dateien und SBKIM-Schlüssel offline; Bibliothek/Tresor").
Echtes Embedding via Modul 03 im Browser (Xenova/multilingual-e5-small) → `sbkim/domainVector.real.json`
(384 Floats, L2≈1). Bis dahin ehrlich als Demo markieren (kein vorgetäuschter Match).

## 5. Andock an Sage — **dieselbe Verbindung wie SB-KIMTool-Point**

Genau der Ablauf, der bei uns lief (PRs #40–#43, ruht jetzt als `verified-match` 0.8485):
1. **Postfach** `sbkim/AUSTAUSCH.md` anlegen (Vorlage: SB-KIMTool-Points `sbkim/AUSTAUSCH.md`):
   Lese-Quittung („zuletzt gelesen / wartet auf"), Fragen an Sage, Protokoll-Log.
2. **Sage lesen** (öffentlich, via WebFetch / raw): `Sage-Protokol` Vertrag `docs/INTERFACES.md`
   (§11 Andock-Konventionen), Live-`status.json`, Sages signierte Spore.
3. **Reziprok verifizieren**: Sages Spore mit der kanonischen Form (ANDOCK §4) → ✔ VALID;
   eigene `spore.json` veröffentlichen (GitHub Pages an → `…github.io/Jasons-Tresor/sbkim/spore.json`
   liefert 200).
4. **Bitte an Sage** (im Postfach): Jasons-Tresor als **neuen Endknoten** registrieren
   (`pingStatus: verified-spore` → nach Match `verified-match`), `sporeUrl` eintragen.
5. Optional gegenüber **SB-KIMTool-Point** dasselbe (Drei-Knoten-Netz) — dann verifizieren sich
   Tresor ⟷ Sage **und** Tresor ⟷ SB-KIMTool-Point.

## 6. Brücke / „Synchronisationstool" (so kommunizierst du 1:1 mit dem Tresor)

Es braucht **kein** neues Format — die Brücke ist die schon gebaute Mechanik:
- **Identität/Signatur (Modul 02):** der Tresor signiert mit seinem Schlüssel; jede Aussage ist
  prüfbar. `exportBackup(pw)` sichert die Identität verschlüsselt, `importBackup(blob,pw)` stellt
  sie wieder her — auf jedem Gerät, das du besitzt.
- **Gemeinsamer Tresor-Umschlag:** `{ kind:"jason-tresor", version:2, kdf:PBKDF2/SHA-256/600k,
  cipher:AES-GCM-256, ciphertext }` (base64url) — **identisch** zu `node_key.enc.json` und Modul 02.
  Damit liest jede Stelle (Bibliothek, SB-KIMTool-Point, Jasons-Tresor) dieselben verschlüsselten
  Dateien; eine Tür für Bibliothek **und** Schlüssel-Backup.
- **Postfach (`AUSTAUSCH.md`):** der ehrliche, prüfbare „Sync" zwischen Knoten — Lese-Quittungen,
  Fragen/Antworten, Log. Kein Dauer-Server, läuft bei Sitzungsstart.
- **App-übergreifend „immer am selben Ort" (Scheibe 3, geplant):** **Web Share Target**
  (Tresor-PWA als „Teilen-Ziel" → aus jeder App „Teilen → Jasons-Tresor") + **fester Ordner**
  (File System Access). Ehrliche Grenze: echte Automatik über *alle* Apps verhindert die
  Browser-Origin-Trennung — Share-Target + Ordner ist der nächstbeste, offline-taugliche Weg.

## 7. Datenverträge (NICHT brechen)

- **Tresor-Umschlag:** s. §6 (identisch Modul 02 / `node_key.enc.json`).
- **Bibliothek-Eintrag:** `{ schemaVersion, kind:"jason-eintrag", id, name, tags[], category,
  origin, createdAt, updatedAt, size, payload }`. **Export:** `{ kind:"jason-bibliothek",
  exportedAt, count, eintraege[] }`. Quelle: `docs/JASONS-BIBLIOTHEK.md` in SB-KIMTool-Point.
- **Spore/Andock:** kanonische Signier-Form + Pflichtfelder aus `docs/ANDOCK.md`.

## 8. Akzeptanz & Ehrlichkeit

- `npm test` grün (Kern + Tresor-Roundtrip + Andock-Verifizierung).
- Real/Demo klar getrennt; echte Krypto, nichts gestubt. Schlüssel-Disziplin (privater
  Schlüssel/Passwort **nie** ins Repo).
- Browser-Teile „ungeprüft, wartet auf Klaus' Browser-Lauf", bis Klaus sie gesehen hat.

## 9. Abschluss-Befehl (Brief-Kette fortsetzen)

`PULS.md` anlegen/fortschreiben, neuen Brief schreiben, vollständig als Chat-Codeblock ausgeben,
Commit/Push, Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**

---

### Reihenfolge in Kürze
1) Grundgerüst + Leitplanken → 2) App `index.html` + Test kopieren (`npm test` grün) →
3) Identität erzeugen + Schlüssel sichern → 4) domainVector → 5) Andock an Sage (Postfach,
reziprok verifizieren, Pages an, Registrierung erbitten) → 6) optional an SB-KIMTool-Point andocken.
