# Jasons-Bibliothek — deine Bibliothek für JSON-Dateien

Stand: 2026-05-31 · Version 0.2.0 (Scheibe 2 — Tresor) · Datei: `jasons-bibliothek/index.html`

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
herstellung eines Schlüssels läuft über Modul 02 `importBackup(blob, password)` (nächste
Scheibe: Modul 02 in die App einbinden).

## Fahrplan (kleine Scheiben)

- **Scheibe 1 — Bibliothek bedienbar (FERTIG, headless bewiesen):** `.json` laden →
  benennen, Kategorie + Schlagworte → suchen/sortieren → ansehen → einzeln exportieren →
  ganze Bibliothek sichern/einlesen.
- **Scheibe 2 — Tresor/Schutz (FERTIG, headless + echter Browser bewiesen):** „🔒 Verschlüsselt
  sichern" (ganze Bibliothek) und „Verschenken 🔒" (ein Eintrag) mit **Passwort** (AES-256-GCM /
  PBKDF2-SHA256 600k über WebCrypto). Einlesen erkennt einen Tresor automatisch und fragt das
  Passwort. **Doppelnutzen:** liest auch verschlüsselte **SBKIM-Schlüssel/ID-Backups** von
  Modul 02 / Mein-Mixarium / Mein-Rezeptbuch (gleiches Format) und legt sie sicher ab.
- **Scheibe 3 — Brücken + Feinschliff (geplant):** App-übergreifend „immer am selben Ort"
  über **Web Share Target** (Teilen-Ziel) + **fester Ordner** (File System Access);
  **Modul 02 einbinden** für volle Schlüssel-Wiederherstellung (`importBackup`); als App
  **installierbar** (Service-Worker/Offline-Cache); ggf. IndexedDB für große Sammlungen;
  **Protokoll-Andock** (eigene Spore + `domainVector` + Andock an Sage) für das eigene Repo.

## Beweis

- `test/jason_lib.test.js` — schneidet die Kern-Logik **aus der ausgelieferten
  `index.html`** (zwischen Markern) und prüft sie headless (kein Duplikat): Parsen,
  Eintrag-Normalisierung, Export-/Import-Hülle, Zusammenführen, Filter/Sortierung **und den
  Tresor** (Verschlüsseln→Entschlüsseln == Original; falsches Passwort scheitert; Manipulation
  fällt durch das AES-GCM-Auth-Tag; `payloadToEntries`/`isTresor`). `npm test` grün.
- Entwickler-Browser-Smoke (Playwright/Chromium): Seite lädt fehlerfrei, `JasonLib`
  registriert, Leer-Zustand + Knöpfe da, echte Eintrag-Runde **und echter Tresor-Roundtrip
  mit WebCrypto** (falsches Passwort abgewiesen). **Klaus' eigener Browser-Lauf**
  (Datei-Auswahl, Download, Passwort-Eingabe, Bearbeiten-Dialog) **steht noch aus**.
