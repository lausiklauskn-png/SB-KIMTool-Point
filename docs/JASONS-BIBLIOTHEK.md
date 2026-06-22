# Jasons-Bibliothek — deine Bibliothek für JSON-Dateien

Stand: 2026-05-31 · Version 0.3.0 (Scheibe 3 — SBKIM-Identität) · Datei: `jasons-bibliothek/index.html`

> „Jason" = Klaus' Name für eine `.json`-Datei. Die Bibliothek ist ein Ort, an dem man
> beliebige JSON-Dateien **aufhebt, benennt, ordnet, exportiert, wieder einliest** und
> später **verschenkt** — eigene Arbeit, eigene Zeit, eigener Wert.

## Pflicht-Erklärung (Was · Nutzen · Verwendung · Einbau · Aktiviert-durch)

- **Was:** Eine offline-taugliche **Einzeldatei** (eine `index.html`, keine externen
  Abhängigkeiten), die wie die SBKIM-PWAs (Mein-Mixarium / Mein-Rezeptbuch)
  herunterladbar und installierbar gedacht ist.
- **Nutzen:** Klaus kann seine JSON-Dateien sammeln, benennen, mit Kategorie + Schlagworten
  ordnen, durchsuchen, einzeln oder als ganze Bibliothek **exportieren** (echte, mitnehmbare
  Sicherung) und wieder **einlesen** — auf jedem Gerät, ohne Konto, ohne Netz.
- **Verwendung:** Seite öffnen → **„＋ Jason laden"** wählt eine `.json` vom Gerät →
  benennen/ordnen → **„Exportieren"** (eine Datei) oder **„Bibliothek sichern"** (alles als
  eine Datei). **„Bibliothek einlesen"** holt eine zuvor gesicherte Bibliothek (oder eine
  fremde `.json`) wieder herein.
- **Einbau:** Reine Datei. Auf GitHub Pages erreichbar unter
  `…github.io/SB-KIMTool-Point/jasons-bibliothek/`. Später als eigenes Repo/PWA verteilbar
  (eine Datei kopieren genügt). Kern-Logik ist browser- **und** node-tauglich → vom
  headless Test geprüft.
- **Aktiviert durch:** Klaus' Knopfdruck. Läuft komplett im Browser, kein Server.

## Ehrlichkeit (was schützt, was nicht)

- **Speicherung im Browser** (`localStorage`, pro Gerät/Browser). Wer den Browser-Speicher
  löscht, verliert die Einträge — deshalb ist der **Export die echte Sicherung**.
- **Tresor (Scheibe 2):** „🔒 Verschlüsselt sichern" und „Verschenken 🔒" schützen mit
  Passwort (AES-256-GCM / PBKDF2-SHA256 600k, WebCrypto). Die normalen Exporte bleiben
  Klartext (zum schnellen Aufheben). **Passwort vergessen = Inhalt weg** (kein Hintertürchen).
  Zum Verschenken das Passwort **getrennt** mitteilen.
- **Verschlüsselt bleibt verschlüsselt im Schrank (Scheibe 3):** Ein eingelesener Tresor wird
  **NICHT** automatisch entschlüsselt — er liegt verschlüsselt als Eintrag „🔒 verschlüsselt"
  und wird erst per **„Öffnen 🔓" + Passwort** gelesen. So liegen **keine privaten Schlüssel im
  Klartext** im Browser-Speicher.
- **SBKIM-Identität (Scheibe 3):** Der Tresor ist ein eigener SBKIM-Knoten (Ed25519, Modul 02).
  „🪪 SBKIM-Identität anzeigen/anlegen" zeigt die `nodeId`; „🔒 Identität sichern" legt ein
  **verschlüsseltes** Backup an (Download + im Schrank). Ein solches Backup lässt sich auf einem
  anderen Gerät über „Öffnen 🔓" wiederherstellen (Modul 02 `importBackup`).
- **Größenrahmen:** `localStorage` fasst grob wenige MB. Für sehr große/viele Jasons kommt
  in einer späteren Scheibe IndexedDB (wie Modul 01 Storage). Ehrlich vermerkt.

## Datenvertrag (Spec vor Code)

**Ein Eintrag** (`kind: "jason-eintrag"`):

```json
{
  "schemaVersion": 1,
  "kind": "jason-eintrag",
  "id": "<uuid>",
  "name": "<von Klaus vergeben>",
  "tags": ["klein", "eindeutig"],
  "category": "<optional>",
  "origin": "<urspruenglicher Dateiname, optional>",
  "createdAt": "<ISO>",
  "updatedAt": "<ISO>",
  "size": 123,
  "payload": <die eigentliche JSON — beliebig>
}
```

**Eine gesicherte Bibliothek** (`kind: "jason-bibliothek"`):

```json
{
  "schemaVersion": 1,
  "kind": "jason-bibliothek",
  "exportedAt": "<ISO>",
  "count": 2,
  "eintraege": [ /* jason-eintrag, … */ ]
}
```

**Verschlüsselter Tresor (Scheibe 2, FERTIG)** — bewusst **derselbe Umschlag wie Modul 02**
(`sbkim-spore.js` `exportBackup`) und wie `sbkim/node_key.enc.json`. Eine Tür liest beide:

```json
{
  "schemaVersion": 1,
  "kind": "jason-tresor",
  "version": 2,
  "kdf":   { "algorithm": "PBKDF2", "hash": "SHA-256", "iterations": 600000, "salt": "<base64url>" },
  "cipher":{ "algorithm": "AES-GCM-256", "iv": "<base64url>" },
  "ciphertext": "<base64url; AES-GCM hängt das Auth-Tag an den Chiffretext>"
}
```

Beim Einlesen wird der Typ **strukturell** erkannt (`kdf`+`cipher`+`ciphertext` → Tresor):
- **Tresor** → fragt Passwort → entschlüsselt → schaut hinein:
  - Klartext mit `eintraege[]` → eine **Bibliothek** (Einträge werden zusammengeführt),
  - Klartext mit `identities[]` → ein **SBKIM-Schlüssel/ID-Backup** (von Modul 02 / Mein-Mixarium
    / Mein-Rezeptbuch) → wird als Eintrag „SBKIM-Schluessel" sicher abgelegt.
- sonst Klartext: `jason-bibliothek` (viele), `jason-eintrag` (einer), oder rohe JSON
  (als neuer Eintrag eingewickelt). Zusammenführen entdoppelt nach `id` (neuere `updatedAt`
  gewinnt).

**Von außen ein Tresor, drinnen eine Bibliothek** — genau dasselbe Format trägt sowohl die
verschlüsselte Sammlung als auch das verschlüsselte Identitäts-Backup. Die volle Wieder-
herstellung eines Schlüssels läuft über Modul 02 `importBackup(blob, password)` — **Modul 01
(Storage) + Modul 02 (Spore) sind ab Scheibe 3 in die Datei eingebettet** (1:1 aus `web/tools/`,
vom Test byte-genau geprüft).

## Fahrplan (kleine Scheiben)

- **Scheibe 1 — Bibliothek bedienbar (FERTIG, headless bewiesen):** `.json` laden →
  benennen, Kategorie + Schlagworte → suchen/sortieren → ansehen → einzeln exportieren →
  ganze Bibliothek sichern/einlesen.
- **Scheibe 2 — Tresor/Schutz (FERTIG, headless + echter Browser bewiesen):** „🔒 Verschlüsselt
  sichern" (ganze Bibliothek) und „Verschenken 🔒" (ein Eintrag) mit **Passwort** (AES-256-GCM /
  PBKDF2-SHA256 600k über WebCrypto). Einlesen erkennt einen Tresor automatisch und fragt das
  Passwort. **Doppelnutzen:** liest auch verschlüsselte **SBKIM-Schlüssel/ID-Backups** von
  Modul 02 / Mein-Mixarium / Mein-Rezeptbuch (gleiches Format) und legt sie sicher ab.
- **Scheibe 3 — SBKIM-Identität (FERTIG, headless + echter Browser bewiesen):** Modul 01+02
  eingebettet; Identität anzeigen/anlegen, „🔒 Identität sichern" (verschlüsseltes Backup),
  Wiederherstellung auf anderem Gerät via `importBackup`; verschlüsselt-im-Schrank
  (kein Klartext-Schlüssel im Speicher).
- **Scheibe 3b — App-übergreifende Ablage (geplant, im eigenen Repo):** **Web Share Target**
  (Teilen-Ziel) + **fester Ordner** (File System Access) brauchen Manifest **+ Service-Worker**
  (mehrere Dateien) und eine installierte App → gehören in das **Jasons-Tresor-Repo** (dort
  läuft die App installiert), nicht in die Einzeldatei-Vorlage. Ehrliche Grenze: echte Automatik
  über *alle* Apps verhindert die Browser-Origin-Trennung; Share-Target + Ordner ist der nächstbeste Weg.
- **Scheibe 3c — Protokoll-Andock** (eigene Spore + `domainVector` + Andock an Sage) für das
  eigene Repo: Bauplan in `docs/sessions/BRIEF_jasons-tresor-andock.md`.

## Beweis

- `test/jason_lib.test.js` (18 Fälle) — schneidet die Kern-Logik **aus der ausgelieferten
  `index.html`** (zwischen Markern) und prüft sie headless (kein Duplikat): Parsen,
  Eintrag-Normalisierung, Export-/Import-Hülle, Zusammenführen, Filter/Sortierung, **Tresor**
  (Verschlüsseln→Entschlüsseln == Original; falsches Passwort scheitert; AES-GCM-Manipulation
  fällt durch; `payloadToEntries`/`isTresor`), **Einbettung** von Modul 01+02 (byte-genau) und
  **`wrapTresorEntry`** (verschlüsselt im Schrank). `npm test` grün.
- Echter Browser-Beweis (Playwright/Chromium über lokalen HTTP-Server, damit IndexedDB/WebCrypto
  real sind): **Gerät A** legt Identität an + signiert Spore + `exportBackup` → verschlüsselter
  Blob; **Gerät B** (frischer Speicher) `importBackup` → **dieselbe nodeId**; falsches Passwort
  abgewiesen; `JasonLib.isTresor` erkennt den Modul-02-Blob (Kreuz-Erkennung); keine
  Konsolenfehler. **Klaus' eigener Browser-Lauf** (Knöpfe, Datei-Auswahl, Download,
  Passwort-Eingabe) **steht noch aus**.
