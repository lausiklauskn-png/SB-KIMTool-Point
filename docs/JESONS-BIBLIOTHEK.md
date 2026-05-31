# Jesons-Bibliothek — deine Bibliothek für JSON-Dateien

Stand: 2026-05-31 · Version 0.1.0 (Scheibe 1) · Datei: `jesons-bibliothek/index.html`

> „Jeson" = Klaus' Name für eine `.json`-Datei. Die Bibliothek ist ein Ort, an dem man
> beliebige JSON-Dateien **aufhebt, benennt, ordnet, exportiert, wieder einliest** und
> später **verschenkt** — eigene Arbeit, eigene Zeit, eigener Wert.

## Pflicht-Erklärung (Was · Nutzen · Verwendung · Einbau · Aktiviert-durch)

- **Was:** Eine offline-taugliche **Einzeldatei** (eine `index.html`, keine externen
  Abhängigkeiten), die wie die SBKIM-PWAs (Mein-Mixarium / Mein-Rezeptbuch)
  herunterladbar und installierbar gedacht ist.
- **Nutzen:** Klaus kann seine JSON-Dateien sammeln, benennen, mit Kategorie + Schlagworten
  ordnen, durchsuchen, einzeln oder als ganze Bibliothek **exportieren** (echte, mitnehmbare
  Sicherung) und wieder **einlesen** — auf jedem Gerät, ohne Konto, ohne Netz.
- **Verwendung:** Seite öffnen → **„＋ Jeson laden"** wählt eine `.json` vom Gerät →
  benennen/ordnen → **„Exportieren"** (eine Datei) oder **„Bibliothek sichern"** (alles als
  eine Datei). **„Bibliothek einlesen"** holt eine zuvor gesicherte Bibliothek (oder eine
  fremde `.json`) wieder herein.
- **Einbau:** Reine Datei. Auf GitHub Pages erreichbar unter
  `…github.io/SB-KIMTool-Point/jesons-bibliothek/`. Später als eigenes Repo/PWA verteilbar
  (eine Datei kopieren genügt). Kern-Logik ist browser- **und** node-tauglich → vom
  headless Test geprüft.
- **Aktiviert durch:** Klaus' Knopfdruck. Läuft komplett im Browser, kein Server.

## Ehrlichkeit (was schützt, was nicht)

- **Speicherung im Browser** (`localStorage`, pro Gerät/Browser). Wer den Browser-Speicher
  löscht, verliert die Einträge — deshalb ist der **Export die echte Sicherung**.
- **Scheibe 1 hat noch keinen Passwort-Schutz.** Die exportierte `.json` ist Klartext.
- **Größenrahmen:** `localStorage` fasst grob wenige MB. Für sehr große/viele Jesons kommt
  in einer späteren Scheibe IndexedDB (wie Modul 01 Storage). Ehrlich vermerkt.

## Datenvertrag (Spec vor Code)

**Ein Eintrag** (`kind: "jeson-eintrag"`):

```json
{
  "schemaVersion": 1,
  "kind": "jeson-eintrag",
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

**Eine gesicherte Bibliothek** (`kind: "jeson-bibliothek"`):

```json
{
  "schemaVersion": 1,
  "kind": "jeson-bibliothek",
  "exportedAt": "<ISO>",
  "count": 2,
  "eintraege": [ /* jeson-eintrag, … */ ]
}
```

**Verschlüsselte Bibliothek/Eintrag (Scheibe 2, geplant)** — **gleicher Umschlag** wie der
Knoten-Schlüssel-Tresor `sbkim/node_key.enc.json` (kein neues Format):

```json
{
  "schemaVersion": 1,
  "kind": "jeson-tresor",
  "kdf":   { "algorithm": "PBKDF2", "hash": "SHA-256", "iterations": 600000, "salt": "<base64>" },
  "cipher":{ "algorithm": "AES-256-GCM", "iv": "<base64>", "tag": "<base64>" },
  "ciphertext": "<base64 der verschluesselten Bibliothek/Eintrag>"
}
```

Beim Einlesen wird `kind` erkannt: `jeson-bibliothek` (viele), `jeson-eintrag` (einer),
`jeson-tresor` (verschlüsselt → fragt nach Passwort), sonst → rohe JSON wird als ein neuer
Eintrag eingewickelt. Zusammenführen entdoppelt nach `id` (neuere `updatedAt` gewinnt).

## Fahrplan (kleine Scheiben)

- **Scheibe 1 — Bibliothek bedienbar (FERTIG, headless bewiesen):** `.json` laden →
  benennen, Kategorie + Schlagworte → suchen/sortieren → ansehen → einzeln exportieren →
  ganze Bibliothek sichern/einlesen. Noch **ohne** Verschlüsselung.
- **Scheibe 2 — Tresor/Schutz (geplant):** Export/Import mit **Passwort verschlüsseln**
  (AES-256-GCM / PBKDF2 600k über WebCrypto — dieselbe echte Krypto wie der Knoten-Schlüssel).
  Damit: sicheres Aufheben und **Verschenken** (Beschenkter braucht das Passwort, getrennt
  mitgeteilt). **Doppelnutzen:** der Tresor sichert auch Klaus' **SBKIM-Schlüssel und
  Knoten-IDs** — `spore.json`/Schlüssel als Jeson ablegen und passwortgeschützt aufheben,
  derselbe Umschlag wie `node_key.enc.json`.
- **Scheibe 3 — Feinschliff (geplant):** Kategorien/Sortierung vertiefen, als App
  **installierbar** (Service-Worker/Offline-Cache, Icons), „verschenken"-Knopf,
  ggf. IndexedDB für große Sammlungen.

## Beweis

- `test/jeson_lib.test.js` — schneidet die Kern-Logik **aus der ausgelieferten
  `index.html`** (zwischen Markern) und prüft sie headless (kein Duplikat): Parsen,
  Eintrag-Normalisierung, Export-/Import-Hülle, Zusammenführen, Filter/Sortierung.
  `npm test` grün.
- Entwickler-Browser-Smoke (Playwright/Chromium): Seite lädt fehlerfrei, `JesonLib`
  registriert, Leer-Zustand + Knöpfe da, eine echte Eintrag-Runde im DOM. **Klaus' eigener
  Browser-Lauf** (Datei-Auswahl, Download, Bearbeiten-Dialog) **steht noch aus**.
