# PULS — Übergabeprotokoll

Stand: 2026-06-27 · Branch `claude/sbkim-lauschen-rollout-stufe2-ob0lrm`

## Nachtrag 2026-07-10 — Identitäts-Hygiene Schritt 3: Modell-Ladebalken (Skill-Pflicht) nachgezogen

Branch `claude/saubere-anmeldung-toolpoint` (frisch von `origin/main`). SB-KIMTool-Point ist der
**Referenz-Knoten** der netzweiten „saubere-netz-anmeldung"-Vereinheitlichung (Klaus 2026-07-10:
„Toolpoint zuerst durchziehen, dann alle gleich"). Prüfung ergab: Toolpoint war bereits sauber —
eigene Schublade `sbkim_toolpoint`, `dbSuffix` in `SbkimRendezvous.init` **und** `RendezvousUI.init`,
Modus A (`ensureIdentity:true`), Modus B (🧹 Aufräumen), Spore aus **eigener** Domänen-Beschreibung.
**Einzige Lücke:** der laut Skill **PFLICHT**-Modell-Ladebalken fehlte im `createIdentity`.

**Getan (`assets/rendezvous-init.js`):** `createIdentity` zeigt jetzt beim ~30-MB-Modell-Laden einen
Live-Prozent-Balken (`sbkim:embedding-progress` → EINE Zeile) + Phasen-Schritte direkt im Panel
(`sbkim-rdv-out`), Listener sauber ab-/angemeldet, fail-soft. Muster 1:1 aus der Skill-Referenz
`Kim-Bell/assets/rendezvous-init.js`. `npm test` **148/148 grün**; `node --check` grün. Kern-Module
unberührt, kein PII, TABU (0.80/DB_VERSION/PROTOCOL_VERSION) unangetastet.

**Für Klaus (Browser):** einmal `🧹 Aufräumen & neu anmelden` drücken (löscht die alte, falsche
Identität aus dem geteilten Topf, erzeugt frische korrekte in `sbkim_toolpoint`), dann hart neu laden.
**Nächste Knoten (alle gleich machen):** Mixarium, Rezeptbuch, Tresore, BLP, Kim-* auf denselben
Stand ziehen (Ladebalken + `dbSuffix` ins Rendezvous + Modus B, wo es fehlt).

## Nachtrag 2026-07-08 — Identitäts-Hygiene Schritt 2: Modul 23 „Mit dem Netz verbinden“ + Modus A/B

Branch `claude/identity-hygiene-module-23-5lh0tm` (frisch auf `origin/main` gesetzt — der lokale
Branch war alter Gründungs-Stand, 0 Commits ahead). Erweiterung von Modul 23 (Rendezvous) um die
zwei Hygiene-Modi aus dem Skill `saubere-netz-anmeldung` — Kern-Module 01/02/05/05b/23 nur über
öffentliche Flächen, TABU (0.80-Riegel / DB_VERSION / PROTOCOL_VERSION) unberührt.

**Getan (`web/tools/sbkim-rendezvous.js` + `-ui.js` + `assets/rendezvous-init.js`):**
- **Modus A — `ensureIdentity(opts?)`** (sanft, automatisch, idempotent, NICHT zerstörend, KEINE
  Netz-Aktion): eigene Schublade `sbkim_<suffix>` sicherstellen (`SbkimStorage.init`, idempotent) →
  Identität sicherstellen (`getOrCreateIdentity`, nur wenn keine da). Läuft bei `init({ensureIdentity:true})`.
- **Modus B — `repairAndReconnect(opts?)`** (zerstörend, NUR hinter Nutzer-Knopf): `cleanupSharedOrigin()`
  reinigt **nur die eigene Origin** — löscht den geteilten Alt-Topf `sbkim` (NIE `sbkim_toolpoint`),
  meldet alle Service-Worker ab, leert alle Caches → eigene Schublade sicherstellen → (opt.
  `newIdentity:true` entfernt die aktive Identität) → `connectAndAnnounce` (Identität+Spore+Anmelden)
  → `reloadHint` „hart neu laden“. Fail-soft in jedem Teilschritt.
- **UI:** neuer dezenter Knopf „🧹 Aufräumen & neu anmelden“ im Rendezvous-Panel (ruft Modus B, zeigt
  Reinigungs-Bilanz + Reload-Hinweis). `-ui.js` reicht jetzt `dbSuffix`+`createIdentity` an das Modul durch.
- **`assets/rendezvous-init.js`:** fährt beim Mounten Modus A (`ensureIdentity`, Schublade `toolpoint`)
  und konfiguriert Modul+UI mit `dbSuffix`/`createIdentity`. Verfassungstreu: kein Auto-Connect.

**Verifiziert (headless):** `node --test` **103/103** (neu `test/rendezvous_hygiene.test.js` 7/7:
Modus-A-Idempotenz, fail-soft ohne Spore, `init({ensureIdentity})`, cleanup löscht nur `sbkim`,
Modus-B-Anmelden+Reload-Hinweis, `newIdentity`), Standalone-Smoke **148/148**. Alle drei geänderten
JS-Dateien `node --check` grün.

**Offen / nächste Schritte:**
- **Demo-/Vorlage-Repo `lausiklauskn-png/netz-anmeldung`** (neues, öffentliches Repo wie `such-tool/`)
  — bewusst NICHT eigenmächtig angelegt (neues öffentliches Repo = schwer umkehrbar, außerhalb des
  Session-Scopes). Wartet auf Klaus' Ja (Chat-Frage gestellt). Byte-Kopie der Modul-Dateien + eigener
  Drift-Guard folgt dann.
- **Netzweiter Rollout** derselben Modus-A/B-Erweiterung in die übrigen PWAs (Mixarium/Rezeptbuch/BLP/
  family-project) — je eigener PR pro Repo.
- **Browser-Sichttest** (Modus-B-Knopf real, echtes IndexedDB/SW-Löschen) **wartet auf Klaus' Browser-Lauf**.

## Nachtrag 2026-07-08 — Identitäts-Hygiene: eigener dbSuffix `toolpoint` (Schritt 1)

Branch `claude/sbkim-identity-hygiene-6pqf1h` (zuerst frisch auf `origin/main` gesetzt —
der lokale Branch war der alte Gründungs-Stand, 124 Commits hinter `main`, seine Commits
alle bereits in `main`; darum `git checkout -B … origin/main`). Netzweite SBKIM-Identitäts-
Hygiene, Teil 1 (Skill `saubere-netz-anmeldung`, Modus A / eigene Schublade):

**Befund (der Browser als schwarzes Loch):** alle Endknoten liegen unter EINER Origin
`lausiklauskn-png.github.io`; IndexedDB hängt an der Origin, nicht am Pfad. SB-KIMTool-Point
initialisierte den SBKIM-Storage **nicht** mit eigenem `dbSuffix` → Identität landete in der
geteilten Default-DB `sbkim`, mehrere Apps zeigten dieselbe nodeId auf der Mycel-Karte.
Drei Kollisions-Flächen auf dieser Origin gefunden + geheilt (alle → `sbkim_toolpoint`):

- **`werkzeuge.html`** (der 🌐-„Mit dem Netz verbinden"-Knopf = die eigentliche Mycel-Karten-
  Anmeldung): lud den vollen Stack, rief aber **nie** `SbkimStorage.init({dbSuffix})`. Neu:
  `assets/sbkim-storage-init.js` (Modus A, idempotent, fail-soft) direkt NACH
  `sbkim-storage.js` und VOR Spore/Anastomose/Rendezvous/nostr-listen geladen → läuft als
  ERSTER `init()` synchron beim Parsen und sperrt die Schublade `sbkim_toolpoint`.
- **`web/tools/mycelknoten.html`** Z. 10121: Fremd-Suffix `"blp"` (BookLedgerPro-Copy-Paste)
  → `"toolpoint"`. Storage-init ist bereits erstes Glied der `initChain`.
- **`jasons-bibliothek/index.html`**: `getOrCreateIdentity()`-Knöpfe ohne vorherigen
  Storage-init → jetzt `init({dbSuffix:"toolpoint"})` im Wiring, vor jedem Knopf-Auslöser.
- **`werkzeugkiste.json`**: Drift-Guard-`sha256` von `mycelknoten.html` nachgezogen.

**Verifikation:** `npm test` **96/96** node-Tests + **148/148** Smoke-Proben grün;
`node --check assets/sbkim-storage-init.js` ok. **Browser-Sichttest der Mycel-Karte
(eigene nodeId, keine Kollision) wartet auf Klaus' Browser-Lauf.**

**Mirror-Hinweis (an Klaus/Sage):** `mycelknoten.html` ist ein Sage-Spiegel; die lokale
`blp→toolpoint`-Heilung weicht bewusst vom Upstream ab. Damit ein Re-Mirror `blp` nicht
zurückholt, sollte Sages Quelle (`docs/observatorium/tools/mycelknoten.html`) den festen
`blp`-Suffix ebenfalls ablegen (generisch/Platzhalter oder App-eigen). Notiert für Folge.

**Offen (Schritt 2, eigene Bau-Sitzung):** Modul 23 um die Hygiene-Schritte erweitern
(Modus A automatisch + Modus B Reinigen-Knopf), als kopierbares Modul + Demo-Repo.
Plan-vor-Code — wartet auf Klaus' Freigabe (Demo-Repo-Name offen).

## Nachtrag 2026-06-29 — Werkzeugkiste-Katalog auf den neuen Sage-Stand gezogen (20/21/23 + Pinnwand)

Branch `claude/pinnwand-verwandt-ki-iyzpi7` (zuerst frisch auf `origin/main` gesetzt —
Achtsamkeits-Regel; lokaler Branch war 122 Commits hinter `main`). Reiner Katalog-/Doku-Nachzug
auf Klaus' Zuruf, damit der Tool-Point den aktuellen Sage-Stand spiegelt:

- **`werkzeugkiste.json` module[]** um drei Einträge erweitert: **20 Schluessel-Safe** +
  **21 Spracheingabe** (beide reif als Code-Stub in Sage, hier noch **nicht kopiert** →
  `point_status: noch-nicht-kopiert`, kein `datei`) und **23 Rendezvous** (Datei
  `web/tools/sbkim-rendezvous.js` liegt bereits → `1:1 aus Sage kopiert`, in `TOOL_FILES`
  ergänzt; in Sage LIVE cross-app bewiesen Sage↔Mixarium 2026-06-28). Pflichtfelder
  (Was/Nutzen/Verwendung/Einbau/Aktiviert-durch) je Eintrag vollständig.
- **`werkzeugkiste.json` komplett_werkzeuge[]** um die **Pinnwand** (Frage-Antwort-Brett)
  erweitert — **link-first** auf die Live-Sage-Seite (mehrteilige PWA → bewusst **nicht**
  lokal gespiegelt, Drift-Vermeidung). Trägt die ehrliche Lesart: gratis Cosinus = **Rangfolge**,
  KI-Richter (opt-in/BYOK) = Urteil. In Klaus' Browser bestätigt (2026-06-29).
- **`assets/app.js`:** Komplett-Werkzeug-Render toleriert jetzt fehlendes `datei`
  (link-first → nur „↗ Live öffnen (Sage)" statt Spiegel-/Download-Knöpfe). `TOOL_FILES["23"]`.
- **`test/komplett-werkzeuge.test.js`** nachgezogen (drei statt zwei; Pinnwand link-first-Vertrag:
  Pflichtfelder + Live-Link, **kein** `datei`/`sha256`).
- **`status.json`** + **`werkzeugkiste.json`** `lastUpdated` → 2026-06-29; Katalog-Komponente
  ehrlich vermerkt.
- **Verifikation:** `npm test` **96/96** grün. **Browser-Lauf der Werkzeuge-Seite wartet auf Klaus.**

## Nachtrag 2026-06-28 — Modul 23 Rendezvous + öffentlicher „🌐 Mit dem Netz verbinden"-Knopf

Branch `claude/module-23-rendezvous-rollout-zqaa8u` (zuerst frisch auf `origin/main`
gesetzt — Achtsamkeits-Regel, siehe CLAUDE.md). Rollout des **gemeinsamen Raums**
(Modul 23, aus Sage) auf den vorhandenen Stack:

- `web/tools/sbkim-rendezvous.js` + `sbkim-rendezvous-ui.js` — **byte-1:1** aus
  `Sage-Protokol/src/modules/23_rendezvous(.ui).js` (kopieren, nicht klonen).
- `werkzeuge.html` lädt beide nach dem Stack + `assets/rendezvous-init.js` mountet
  den öffentlichen Knopf (`SbkimRendezvousUI.init`, nodeName „SB-KIMTool-Point",
  `createIdentity` über das vorhandene `SbkimEmbedding`+`SbkimSpore` mit der
  committeten Domänen-Beschreibung → Match-Wert zu den Nachbarn ≥ 0.80 bleibt).
- **Kein Doppel-Laden:** der Stack (Anastomose/Relais/Spore/Embedding) ist auf
  `werkzeuge.html` bereits da; nur Modul 23 + UI + Init kamen dazu. Kern unangetastet.
- Löst die **Adress-Wand** (committete ≠ lebende nodeId) per Raum `sbkim-rdv`.
- **Verifikation:** Headless-Chromium 9/9 (Knopf mountet, Panel toggelt,
  `_meta.nodeName` „SB-KIMTool-Point", Stack vorhanden), `npm test` **148/148** grün.
- **CLAUDE.md:** Achtsamkeits-Regel „vor dem Bauen die Basis prüfen (wenn sinnvoll)"
  im PR-Workflow verankert (Klaus 2026-06-28).
- §11.6: `sbkim/SIGNAL.json` seq 27.

**Offen:** Browser-Live-Test durch Klaus (z. B. SB-KIMTool-Point ↔ Sage/family/
Mixarium → „ETABLIERT"; nach Pull Hard-Reload nicht nötig — kein Service-Worker).

## Nachtrag 2026-06-27 — Stufe 2: Auto-Lauschen am Nostr-Relais

`main` in den Session-Branch gemerget (Branch hing 117 Commits hinter `main`). Dann
Stufe-2-Auto-Lauschen integriert (Rollout aus `family-project/docs/SESSION_BRIEF_LAUSCHEN_ROLLOUT.md`):

- Byte-identisch aus Sage `src/modules/` kopiert (kopieren, nicht klonen):
  `05_anastomose.js` (Superset der bisherigen Version, ergänzt `listenNostr`/Nostr-Transport)
  → `web/tools/sbkim-anastomose.js`; `05b_nostr_relay.js` → `web/tools/sbkim-nostr-relay.js`;
  `noble-secp256k1.js` → `web/tools/noble-secp256k1.js`.
- `werkzeuge.html` lädt 05b als `<script type="module">` (self-mountet `window.SbkimNostrRelay`,
  importiert noble relativ aus derselben Mappe) + neues `assets/nostr-listen-init.js`, das nach
  `SbkimAnastomose.init()` **fail-soft + nicht-blockierend** `listenNostr()` aufruft.
- Relais `wss://relay.family-projekt.de` (in 05b eingebacken). **Empfangsmodus mit Antwortrecht:**
  nur antworten, nie initiieren (kein Crawler). Schutz-Module 10/11/12/15 = Wächter (später).
- **Verifikation:** `npm test` **148/148 grün** (Anastomose-Oberfläche `init/handshake/receiveHandshake/listSiblings` intakt, kein Import-Bruch). `node --check` der Init-Datei OK.
- §11.6: `sbkim/SIGNAL.json` `seq` 25→26 + history-Eintrag + Postfach-Notiz (`AUSTAUSCH.md`).
- **Offen:** Browser-Sichttest (Hard-Reload Strg+Shift+R) wartet auf Klaus — Live-Echo am Relais.

## Nachtrag 2026-06-22 — Such-Werkzeug als eigenständige, installierbare PWA

Befund (Klaus/Sage): Der „Download" des Such-Tools wurde keine eigene App — es blieb
unter dem Hub. Grund: eine lokal über `file://` geöffnete Datei darf keinen
Service-Worker registrieren → keine Installation.

Umgesetzt (Klaus' Wahl: **Variante A** — eigener Unterordner):
- Neuer Ordner **`such-tool/`**, Inhalt 1:1 aus `Sage-Protokol/such-tool/` kopiert:
  `index.html`, `manifest.json` (start_url/scope/id relativ `./` → läuft im
  Unterordner), `sbkim-sw.js` (Service-Worker MIT `fetch`-Handler → installierbar),
  `impressum.html` (Kontakt = **Platzhalter**, keine PII), `icon-192/512.png`,
  `modules/` (Kopien **03/04/21/22** — die einzigen nötigen Module, kein 01/02).
- **Scope-Falle geprüft:** Der Hub hat aktuell **gar keinen** Service-Worker →
  keine Überschattung. Der Tool-SW registriert aus `/such-tool/` (Scope `/such-tool/`).
- **Resize-Stand:** Modul 22 ist die Sage-Fassung **nach PR #388** (Griff unten
  rechts zieht Breite + Lesefeld-Höhe, Größe persistiert in `localStorage`
  `sbkim_search_widget_size`, Drag/Resize getrennt). Also bereits der grüne Stand.
- Hub-Knopf: auf `werkzeuge.html` ein benannter Knopf **„→ Such-Werkzeug öffnen"**
  (`such-tool/index.html`).
- Doku: `docs/components/_standalone_such_tool.md` (Kern-Lehre + Aufbau + Drift-Guard,
  für dieses Repo angepasst). `status.json` um den Standalone-Eintrag ergänzt.
- JS aller kopierten Module `node --check`-sauber; `npm test` weiter **6/6 grün**
  (sandbox unberührt).

**Offen / wartet auf Klaus:**
- **GitHub Pages** für dieses Repo aktivieren (über https), sonst keine Installation.
- **Installations-Sichttest** am Tablet: `…/SB-KIMTool-Point/such-tool/` öffnen →
  „App installieren" → eigene App (eigenes Fenster)? Offline-Start? Resize ok?
- Impressum-Kontakt vor Veröffentlichung mit echten Pflichtangaben füllen (keine PII).
- Drift: `modules/` sind Kopien — bei Änderung in Sage `src/modules` nachziehen.

---

Stand: 2026-06-21 · Branch `claude/modul22-such-werkzeug-aTHX`

## 2026-06-21 — Such-Werkzeug (Modul 22) als eigenständiges Tool übernommen

Zwei Sage-Briefe (2026-06-21) baten, das fertige **Such-Werkzeug (Modul 22)** zu
übernehmen — eine **semantische, server-lose Bedeutungs-Suche** (versteht die Absicht,
nicht Stichwörter). Umgesetzt **gegen den aktuellen `origin/main`** (frischer Branch;
der zugewiesene alte Branch war 112 Commits zurück und hatte das `web/tools/`-Layout
+ Briefkasten nicht — bewusst nicht darauf gebaut, Klaus' Entscheidung „neuer Branch aus main").

- **Kopiert (1:1, „kopieren, nicht klonen"):** `web/tools/sbkim-such-widget.js`
  (= Sage `src/modules/22_such_widget.js`). Abhängigkeit **04 Match auf den aktuellen
  Sage-Stand gehoben** (`web/tools/sbkim-match.js`, +`hybridMatch`/04.D — Modul 22 braucht
  den KI-Richter); 03 Embedding war schon identisch. Docs: `docs/components/22_such_widget.md`,
  `docs/components/_such_referenzfaelle.md`, `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md`.
- **Beweis:** `tests/smoke_bau22_such_widget.mjs` **148/148**, in `npm test` eingehängt.
  Das Heben von 04 bricht **nichts** — **95** node:test + **148** Proben grün; `npm run verify`
  (Playwright/Chromium) lädt `werkzeuge.html` mit dem Widget **ohne JS-Fehler (16/16)**.
- **In der App (Sage §1):** Profi-Kachel in `werkzeugkiste.json` + Kopier/Download in
  `assets/app.js`; eingehängt auf `werkzeuge.html` **und** `markt.html`; eigener Markt-
  Eintrag (`web/data/marktplatz.json` → `werkzeuge[]`, gerendert in `renderMarkt`).
- **Größer ziehen (Sage §2):** **nicht-invasiv** in `assets/such-widget-init.js` — Panel
  `resize: both` + Größe in `localStorage`; Treffer-Lesefeld-Deckel gelöst. Modul 22 selbst
  **unverändert** (kein Umbau fremder Module).
- **Impressum/Datenschutz (Sage §3):** `impressum.html` Datenschutz **§6a** (DE+EN) ergänzt:
  externe KI-/Web-Suche nur auf **bewusste Nutzer-Aktion**, BYOK-Schlüssel **lokal
  verschlüsselt, nie an Dritte**. Dezenter Footer-Link auf `werkzeuge.html` + `markt.html`.
- **Standalone (Sage §c):** `such-werkzeug.html` — **eine** Single-File-PWA (Module 03/04/22 +
  Init inline, Manifest/Icon als data-URI, kein Build), erzeugt via `npm run build:such-pwa`
  (`scripts/build-such-pwa.mjs`, eine Quelle → keine Divergenz).
- **Manual-Check:** sichtbares Panel/Suchen **ungeprüft, wartet auf Klaus' Browser-Lauf**
  (Hard-Reload). Headless + „mountet ohne JS-Fehler" sind belegt.
- **Ehrlich offen:** semantische Hälfte bewiesen; volle **bidirektionale Cross-Knoten-Suche
  server-los** noch NICHT end-to-end (Meilenstein-Doku). KI-Richter braucht einen Schlüssel.
- **Quittung an Sage:** Entwurf (a/b/c) im Chat; Versand über den Briefkasten-Weg, sobald
  Klaus es freigibt (Sage relayt über Klaus).

## 2026-06-20 — Zwei Komplett-Werkzeuge von Sage aufgenommen

Sage-Brief (2026-06-20) bat, zwei fertige Ein-Datei-PWAs in die Werkzeugliste aufzunehmen.
Umgesetzt als **„Kopie + Link"** (Klaus' Wahl) auf dem **aktuellen** `main`.

- **Wichtig:** Die Sitzung startete versehentlich auf einem **alten Branch-Stand**; `main`
  war weit voraus (bis #80). Branch sauber auf `origin/main` gesetzt und die Arbeit **neu
  gegen die aktuellen Dateien** integriert (statt Stand-Konflikte zu mergen).
- **Sync mit Sage:** anfangs 404 (privat/PR #318) → nach Klaus' Freischaltung **byte-exakt
  per `curl`** geholt (WebFetch wandelt verlustbehaftet zu Markdown, daher curl).
- **Gespiegelt** nach `web/tools/`: `andock.html`, `mycelknoten.html` + Sage-README als
  `web/tools/KOMPLETT-WERKZEUGE.herkunft.md`. Nicht verändert; `sha256` im Katalog + Test.
- **Neue Kategorie „Komplett-Werkzeuge"**: Sektion in `werkzeuge.html`, gerendert aus
  `werkzeugkiste.json` → `komplett_werkzeuge` via `assets/app.js`
  (`renderKomplettWerkzeuge`, **nativer `.tool`-Stil**, kein neues CSS).
- **Doku/Ehrlichkeit:** `docs/WERKZEUGE.md` (unter „Eigenständige Werkzeuge"), `status.json`
  (neue real-browser-taugliche Komponente, lastUpdated 2026-06-20).
- **Test:** `test/komplett-werkzeuge.test.js` (Existenz + HTML + Pflichtfelder + sha256).
- **Manual-Check:** Seite **ungeprüft, wartet auf Klaus' Browser-Lauf** (Hard-Reload).
- **Offen:** Quittung an Sage (Ein-Zeiler + Point-URL) — Entwurf im Chat; Versand über
  Sages Briefkasten-Weg, sobald Klaus die Point-URL bestätigt.

## 2026-06-19 — Sechster Peer BookLedgerPro aufgenommen (verified-spore)

Sage hat BookLedgerPro vermittelt (offline-first, **verschlüsselte** Buchhaltung). Reziprok,
offline und unabhängig verifiziert (nicht das Wort der Gegenseite übernommen) — im
**etablierten `sbkim/`-Muster** (wie C/D/E/F), nicht als paralleles System:

- **Verifikation:** `scripts/verify_foreign_spore.mjs` gegen die Live-Spore → **VALID**
  (9/9 Pflichtfelder, `id == SHA256(pubkey)`, Ed25519-Signatur, Manipulation fällt durch).
  → Stufe **verified-spore**. `domainVector` ist `_demo` → **kein** verified-match, Match offen.
- **Beweis:** `sbkim/bookledgerpro_inbox.json` (eingefrorene 1:1-Spore) +
  `sbkim/bookledgerpro_inbox.verify.md` + `test/bookledgerpro_inbox.test.js` (offline,
  4 Fälle). **`npm test` grün** (88 → 92).
- **Netz:** `web/data/marktplatz.json` (Status `verified-spore`, kein Match-Score),
  `sbkim/AUSTAUSCH-BookLedgerPro.md` (Postfach), `sbkim/SIGNAL.json` (seq 24, mailbox,
  `ack[BookLedgerPro]=5`, history), `status.json`. `assets/app.js`: ehrlicher Chip
  „✓ Spore verifiziert · Match offen" (statt fälschlich wie voller Match).
- **Verschlüsselungs-Achse:** als **Hypothese** dokumentiert (Nähe zu Tresor-Knoten steht nur
  in `domainDescription`, nicht in `domainKeywords`) — **keine** Match-Aussage bis echtes
  Embedding. BookLedgerPro nimmt die Krypto-Nähe beim echten Vektor in den Domänen-Text auf.
- **Manual-Check:** `npm test` belegt die Verifikation offline. Marktplatz-Darstellung des
  neuen Chips **ungeprüft, wartet auf Klaus' Browser-Lauf**.
- **Korrektur-Hinweis:** Der erste Anlauf (PR #80) baute versehentlich ein **paralleles**
  Knoten-System (`web/data/knoten/…`, `docs/KNOTEN.md`), weil der Branch auf dem alten
  Gründungs-Skelett saß. Auf aktuellen `main` neu aufgesetzt und ins bestehende Muster überführt.

---

## (Historie ab hier — älterer Stand)

Stand: 2026-06-07 · Branch `claude/point-siegel-angleich-sage-lkjSH`

## 2026-06-07 (BB) — Siegel-Erlebnis an Sage angeglichen (Beschreibungs-Feld, Schutz-Block, Erklär-Seite)

Das Siegel-Modal bekommt das Sage-Erlebnis, an Points Struktur angepasst. Vier Bausteine:

- **A · Modul 16** (`web/tools/sbkim-siegel.js`): Modul-18-Andock-Pfad entfernt
  (`BRONZE_HINWEIS_HTML_FALLBACK`, `[data-siegel-andock-btn]`, `SbkimToolPwa`-Drei-Pfad-Logik
  raus). Der Bronze-Block ist jetzt **reiner Hinweis-Text** und verweist auf den 🔑-Knopf.
  Neuer `ZERTIFIKAT_ASPEKTE`-Eintrag „Semantische Selbst-Beschreibung im Siegel" (2026-06-07).
  Modul 16 bleibt **reines Render-Modul** (kein Protokoll-Eingriff).
- **B · Beschreibungs-Textfeld** (`assets/sbkim-siegel.js`, `setupAndockWizard`): auto-wachsendes
  `<textarea>` direkt unter dem 🔑-Knopf + Sage-Hinweistext + Knopf „Beschreibung übernehmen →
  Vektor & Spore neu signieren". Voller Sign-Pfad (Modul 02/03): `getOrCreateIdentity` (gleiche
  nodeId) → `SbkimEmbedding.init` (Fortschritt via `sbkim:embedding-progress`) → `embedPassage`
  → `generateOwnSpore` → `spore.json`-Download + Erfolgsmeldung (nodeId, L2). Vorbefüllt aus der
  eigenen Spore, sonst Point-Default. Point-`WIZ.domainDescription` auf den reicheren Default
  gehoben.
- **C · Schutz-Block**: „🛡 Was bedeutet dieses Siegel — und wie bist du geschützt?" + zwei
  beruhigende Sätze + Knopf „Ausführlich erklärt …".
- **D · Erklär-Seite** `sicherheit.html` (flach, dunkler Teal-Skin, selbsttragend): die
  Mycel-Erklärung wortgleich aus Sage. Der C-Knopf öffnet sie als **In-Page-Overlay** (iframe,
  ✕/Backdrop/Esc, kein neuer Tab); der „zurück"-Link blendet sich im Overlay aus.

`hideBronzeAndockBlock()` ist damit überflüssig und entfernt (Bronze-Block ist jetzt sauber).
**`npm test` 88/88 grün** (Modell + Module unberührt; Siegel-Lesepfad `getAspects()` weiter ok).
**Manual-Check: Browser-Lauf ungeprüft, wartet auf Klaus' Hard-Reload (Ctrl+Shift+R).**

## 2026-06-07 (BA) — Korrektur + Knoten F (Mein-Mixarium) aufgenommen: verified-MATCH 0.8030

**Ehrlichkeits-Korrektur:** Eintrag AZ („Ring 5/5") war voreilig — er betraf **Mein-Rezeptbuch (E)**.
**Mein-Mixarium (F) ist ein eigener Knoten** und fehlte in unserer Peer-Liste. Mixarium hat das per
Postfach korrekt angemerkt; 1:1 angenommen und geradegezogen:
- Spore raw/main → **✔ VALID** (nodeId `B7Fke9…`, 384-dim Vektor).
- **Cosinus A↔F = 0.802994 ≥ 0.80 → verified-match** (knapp, ehrlich; ≠ 0.832019 von E; beidseitig).

**Aufgenommen (Muster wie E):** `sbkim/mixarium_inbox.json` + `…verify.md`,
`test/mixarium_inbox.test.js`, `web/data/marktplatz.json` (Mixarium → verified-match, echte nodeId),
`status.json` (Knoten F), `SIGNAL.json` mailboxes + `ack[Mein-Mixarium]=5`, **seq 23**, Peer in
Wächter + Browser-📬, Postfach `sbkim/AUSTAUSCH-Mixarium.md` (Korrektur anerkannt). **Jetzt 5 Peers,
alle verified-match** (Sage · Jasons-Tresor · Mein-Tresor · Mein-Rezeptbuch · Mein-Mixarium).
`npm test` 88/88. **Manual-Check:** Karte im 📬 ungeprüft, wartet auf Klaus' Browser-Lauf.

## 2026-06-07 (AZ) — Mein-Rezeptbuch-Postfach quittiert (Hinweis: „Ring 5/5" war ungenau, s. BA)

Mein-Rezeptbuchs Postfach (`AUSTAUSCH-SBKIMTool.md`, ihr SIGNAL seq 5) gelesen: sie haben unseren
Handschlag (seq 21) gegengeprüft, führen uns reziprok, bestätigen **beidseitig verified-match
0.832019**; pro-Nachbar-Postfächer + reiche Karten-Ansicht haben sie ebenfalls. Quittiert:
`ack[Mein-Rezeptbuch]` 2→5, Quittung in `AUSTAUSCH-Rezeptbuch.md`, `SIGNAL.json` **seq 22**.
**„Point offen" beidseitig geschlossen — Ring 5/5 verified-match.** `npm test` 83/83.

## 2026-06-07 (AY) — Neuer Knoten E (Mein-Rezeptbuch) aufgenommen: verified-MATCH 0.8320

Mein-Rezeptbuch hat per Postfach angedockt (eigene SBKIM-Identität `uOpUBez…`, von Sage bestätigt;
nutzt unseren `verify_foreign_spore.mjs` + Auto-Issue-Wächter). Objektiv gegengeprüft:
- Spore raw/main → **✔ VALID** (Ed25519, `id==SHA256(pub)`, 9/9, 384-dim Vektor, Manipulation fällt durch).
- **Cosinus A↔E = 0.832019 ≥ 0.80 → verified-match** (beidseitig: sie melden denselben Wert).

**Aufgenommen (Muster wie C/D):** `sbkim/rezeptbuch_inbox.json` + `…verify.md`,
`test/rezeptbuch_inbox.test.js` (`npm test` **83/83**), `web/data/marktplatz.json` (Rezeptbuch →
verified-match, echte nodeId uOpUBez…), `status.json` (Knoten E), `SIGNAL.json` mailboxes +
`ack[Mein-Rezeptbuch]=2`, **seq 21**, Peer in Wächter + Browser-📬, Postfach
`sbkim/AUSTAUSCH-Rezeptbuch.md` (3 Fragen beantwortet). **Fünfter Knoten im Netz.**
**Manual-Check:** Karte im 📬 ungeprüft, wartet auf Klaus' Browser-Lauf.

## 2026-06-07 (AX) — Mein-Tresor bat um verified-match → war schon erledigt, frisch quittiert

Mein-Tresor (D) hat per Postfach um verified-match gebeten (ihr SIGNAL seq 9). **War bei uns seit
2026-06-07 (PR #68) erledigt** und im reichen Briefkasten browser-bestätigt. Trotzdem ehrlich
frisch gegengeprüft: ihre Spore raw/main ✔ VALID, Cosinus Point⟷Mein-Tresor = **0.853740 ≥ 0.80**.
Quittung in `AUSTAUSCH-MeinTresor.md` (Beleg + „eure gelbe Lampe darf grün"), `ack[Mein-Tresor]`
8→9, `SIGNAL.json` **seq 19** (Pushen = Signal). Keine Daten-/Statusänderung nötig (schon
verified-match). `npm test` 78/78.

## 2026-06-07 (AW) — Reicher Briefkasten von Klaus im Browser bestätigt ✓

Klaus' Screenshot (markt.html): das reiche 📬-Modal zeigt Teal-Siegel-Kopf + alle drei Nachbarn
mit Karten — Sage verified-match 0.8485 · Jasons-Tresor 0.8537 · Mein-Tresor 0.8537, je
synchron, „3/3 verbunden · alles synchron"; Match live im Browser nachgerechnet. Damit ist der
reiche Briefkasten **browser-bestätigt „grün"** (vorher „wartet auf Klaus' Browser-Lauf").

## 2026-06-07 (AV) — Brief an Sage: Briefkasten auf gemeinsamen Stand

Auf Klaus' Wunsch Sage einen Auftrags-Brief ins Postfach (`sbkim/AUSTAUSCH.md`) gelegt: bitte
die **reiche Karten-Ansicht** (Spore/Match/Sync/Brief, Live-Cosinus) **und** den **Auto-Issue-
Wächter** übernehmen, pro-Nachbar-Postfächer + Mein-Tresor als Peer ergänzen — damit das ganze
Netz denselben Briefkasten fährt (reiche UI + Hintergrund-Wächter). Impressum hat Sage schon
(kanonische Quelle). `SIGNAL.json` **seq 18** (Pushen = Signal). Reine Doku/Netz-Sync, `npm test`
unverändert 78/78.

## 2026-06-07 (AU) — Reicher Briefkasten (Karten-Ansicht) + Auftrag „Wächter-Vorteil" an C & D

Klaus wollte „das Beste aus beiden Welten" sichtbar machen: Mein-Tresors/Jasons reiche
Karten-Ansicht **und** unseren Hintergrund-Wächter — bei allen Knoten.

**Gemacht (Point):**
- `assets/netz-briefkasten.js` **komplett neu** — statt mageres Eck-Popup jetzt ein **Modal mit
  einer Karte pro Nachbar**: ① Spore (verified-spore + nodeId aus Inbox), ② Match (**Cosinus
  LIVE im Browser** aus `spore.json`-Vektor ⟷ Inbox-Vektor; ≥0.80 = verified-match), ③ Sync
  (Nachbar-seq ↔ unser ack), ④ Brief (Postfach öffnen). Siegel-Kopf + „X/Y verbunden". Badge mit
  Ungelesen-Zahl beim Laden. Re-geskinnt (Teal, inline-Siegel — kein fremdes Gold-Wappen).
- `assets/style.css`: Modal-/Karten-Styles ergänzt.
- **Vorteil behalten:** Action-Wächter (`.github/sbkim-watch.mjs` + Workflow, Auto-Issue) bleibt
  unverändert → wir haben jetzt **reiche UI (Browser) + Auto-Issue (Hintergrund)**.

**Auftrags-Briefe (ganz wichtig, Klaus):** an `AUSTAUSCH-MeinTresor.md` + `AUSTAUSCH-JasonsTresor.md`
— bitte **unseren Wächter-Vorteil** (Auto-Issue) übernehmen (Vorlage = unsere `.github/`-Dateien,
nur CONFIG anpassen). Ziel: jeder Knoten hat beide Vorzüge.

**Verifiziert:** `npm test` **78/78**; Live-Match headless reproduziert (Sage 0.8485,
Jasons-Tresor 0.8537, Mein-Tresor 0.8537); JS `node --check` ok; JSON valide. `SIGNAL.json` **seq 17**.
**Manual-Check:** reiche Karten-Ansicht im Browser **ungeprüft, wartet auf Klaus' Browser-Lauf**.

## 2026-06-07 (AT) — SBKIM-Briefkasten an Mein-Tresor-Referenz angeglichen (§11.6)

Auftrag: alle Knoten denselben Briefkasten-Aufbau, angeglichen an Mein-Tresors abhängigkeitsfreie
Referenz. **Befund:** Point war an zwei Stellen schon *weiter* als die Referenz → Klaus' Entscheid
**„klug zusammenführen"** (Protokoll angleichen, aber unseren reicheren Wächter + 5-Seiten-📬
behalten, kein Rückschritt). Additiv, seq/history **nicht** zurückgesetzt.

**Gemacht:**
- `sbkim/SIGNAL.json`: Schema an Referenz angeglichen — `sporeUrl` + `nodeId`
  (`CyunQNDRZZ…`) ergänzt; `ack` quittiert **Sage 16 · Jasons-Tresor 8 · Mein-Tresor 8**
  (Jason hat jetzt erstmals ein SIGNAL — vorher `null`); **seq 15 → 16**; history nur ergänzt.
- **Pro-Nachbar-Postfächer:** neu `sbkim/AUSTAUSCH-JasonsTresor.md` (Jason war vorher im
  geteilten `AUSTAUSCH.md`); Mapping in SIGNAL: Sage→`AUSTAUSCH.md`, Jasons-Tresor→
  `AUSTAUSCH-JasonsTresor.md`, Mein-Tresor→`AUSTAUSCH-MeinTresor.md`. Impressum-Auftrag an
  Jason in das neue Postfach übernommen.
- **Mein-Tresor als Peer aufgenommen** in `.github/sbkim-watch.mjs` **und** `assets/netz-briefkasten.js`
  (war in beiden Listen NICHT enthalten — echte Lücke). Mailbox-URL = deren `AUSTAUSCH-SBKIMTool.md`.
- **Behalten (kein 1:1-Downgrade):** Wächter öffnet/kommentiert weiter ein GitHub-Issue bei Neuem
  (`issues: write`, `$GITHUB_OUTPUT`); 📬-Knopf + Siegel bleiben auf allen 5 Seiten.

**Verifiziert:** `npm test` **78/78**; Wächter live ausgeführt → liest Sage/Jasons-Tresor/
Mein-Tresor, „nichts Neues" (ack deckt aktuellen Stand). JSON valide.
**Manual-Check:** Browser-📬 mit Mein-Tresor in der Liste **ungeprüft, wartet auf Klaus' Browser-Lauf**.

## 2026-06-07 (AS) — Impressum-Seite + Footer-Link + Auftrags-Briefe an C & D

Eigenes `impressum.html` (Rechtstext 1:1 vom SBKIM-Hub, re-geskinnt; §5 TMG, §55 RStV,
Urheberrecht, Haftungsausschluss, Datenschutz; DE+EN) + Footer-Link auf der Startseite. Per
ausdrücklicher Klaus-Freigabe echte PII (benannte Kein-PII-Ausnahme). Auftrags-Briefe an
Jasons-Tresor (C) + Mein-Tresor (D) ins Postfach (selbst nachziehen). PRs #68/#69 gemergt.

## 2026-06-07 (AR) — Mein-Tresor (D) auf verified-MATCH hochgestuft + Wizard-Lauf bestätigt

Anknüpfend an den Brief `BRIEF_naechste-sitzung.md` (offene Punkte 1 + 2). Klaus hat den
Briefkasten der Knoten **Jasons-Tresor** und **Mein-Tresor** im Browser geöffnet (zwei
Screenshots); deren Sage-Tool rechnet die Matches live nach.

**Punkt 1 (Andock-Wizard / Sage-Tool im Browser) — von Klaus bestätigt (2026-06-07).** Der
Wizard läuft im Browser, die Vektor-Spore wurde mit Wert angelegt, Matches rechnen live. Damit
ist der manuelle Sichttest aus dem Brief erfüllt (kein headless-Beweis nötig — Klaus' Beleg).

**Punkt 2 (Mein-Tresor D → verified-match) — erledigt.** D hat seinen echten 384-dim
`domainVector` (Xenova/multilingual-e5-small, L2≈1) ergänzt und die Spore mit demselben Schlüssel
neu signiert (gleiche nodeId `wRsGQouO…`). Auf unserer Seite **unabhängig nachgerechnet**:
- `scripts/verify_foreign_spore.mjs` gegen D's aktuelle Spore (raw/main) → **✔ VALID** (Signatur,
  id=base64url(SHA256(rawPub)), 9/9 Pflichtfelder, Manipulation fällt durch).
- Cosine A↔D gegen `sbkim/domainVector.real.json` = **0.853740 ≥ 0.80 → verified-match**
  (exakt der A↔C-Wert, da D die Schwester von Jasons-Tresor mit identischem Vektor ist).

**Nachgezogen:** `sbkim/meintresor_inbox.json` (Momentaufnahme jetzt mit `domainVector`),
`sbkim/meintresor_inbox.verify.md`, `test/meintresor_inbox.test.js` (Match-Fall, **78/78 grün**),
`web/data/marktplatz.json` + `status.json` (`verified-match`, Score 0.853740), Quittung in
`sbkim/AUSTAUSCH-MeinTresor.md`, `SIGNAL.json` **seq 14** + `ack[Mein-Tresor]=7`.

**Netz jetzt vollständig auf Match-Ebene:** Sage↔A 0.8485 · A↔C 0.8537 · A↔D 0.8537.

**Manual-Check:** Reine Daten/Doku + Test; `npm test` 78/78. Die Hochstufung ist headless
bewiesen. Die Seiten-Anzeige (Marktplatz zeigt D als verified-match) ist **ungeprüft, wartet
auf Klaus' Browser-Lauf**.

## 2026-06-07 (AQ) — SITZUNGSABSCHLUSS: Netz-Sync, vier Knoten, Siegel/Lampen/Wizard ehrlich

**Übergabe nach `CLAUDE.md`.** Lange Sitzung; alles unten (X–AP) ist auf `main`, keine offenen
PRs, `npm test` **77/77**, `SIGNAL.json` seq 13.

**Was diese Sitzung erreicht hat (Kurzfassung):**
- **Jasons-Bibliothek** als eigenständige Offline-App (Scheibe 1–3): laden/ordnen/exportieren,
  Passwort-Tresor (AES-256-GCM/PBKDF2 600k, Modul-02-Umschlag), Modul 01+02 eingebettet,
  „verschlüsselt im Schrank". Umbenannt Jeson→**Jason**. → neues Repo **Jasons-Tresor** (C).
- **Werkzeug `make_node_key.mjs`** (Tresor anlegen) gebaut — schloss Jasons Blockade.
- **Netz-Briefkasten §11.6**: `sbkim/SIGNAL.json` + Wächter (`.github/sbkim-watch.mjs` +
  Workflow) + **📬-Knopf** auf allen vier Seiten.
- **Ehrlichkeits-Fix Lampen/Siegel**: Lampen waren fälschlich alle grün → jetzt echt verdrahtet
  (Modul 15 Membran „fremd"; „lebt"=Identität geladen; „verkehr" pulst bei echtem Fetch);
  **Siegel Bronze→Gold** nur bei echtem Cross-Knoten-Kontakt (Modul 16).
- **Andock-Wizard im Siegel-Modal** (4 Schritte wie Sage: Identität → Spore+echter Vektor →
  verschlüsseltes Backup → Wiederherstellen). Doppeltes/totes „Andocken" (falsch „Modul 18")
  entfernt → Modal sauber wie Sage.
- **Netz gewachsen auf vier Knoten**, alles echt reziprok verifiziert (raw/main):
  - **Sage** ⟷ A: `verified-match` 0.8485
  - **A ⟷ C (Jasons-Tresor)**: Identitätswechsel `E13GDzIp…` + echter Vektor →
    **`verified-match` 0.853740** (erster echter Tresor-Match)
  - **A → D (Mein-Tresor)**: `verified-spore` (nodeId `wRsGQouO…`), `domainVector` folgt
- **Verfahren festgezurrt:** SBKIM-SYNC-VEREINBARUNG v1 + Verfahrens-Erklärungen
  (`AUSTAUSCH-MeinTresor.md`); **GENERALPROBE-Plan** (`sbkim/GENERALPROBE.md`) — Bisheriges =
  Testlauf/Lernphase, später Re-Sync „von links nach rechts" über Browser-Tools.
  `docs/SCHLUESSEL.md`: headless-Tresor (unser Weg) vs. Browser-Identität dokumentiert.

**Manual-Check (ehrlich):** Pages ist live (Klaus bestätigt). **Offen — Klaus' Browser-Lauf:**
Andock-Wizard Schritt 2–4 (Embedding ~30 MB, Spore-Download, Backup, Restore) — headless nicht
voll prüfbar, wartet auf Klaus.

**Nächste Schritte:** siehe Brief `docs/sessions/BRIEF_naechste-sitzung.md` (unten) + Chat.



Klaus: im Siegel-Modal soll oben **nur** „🔑 Eigene Identität & Spore erzeugen / verwalten →" +
„Bezeugt seit …" stehen — wie bei Sage. Der zweite Block „Mycel suchend → [Andocken]" war
doppelt und nannte fälschlich **Modul 18** (das Andock-/Siegel-Modul ist **Modul 16**).

- **`assets/sbkim-siegel.js`**: Modul 16s Bronze-„Andocken"-Block (`[data-siegel-bronze-hinweis]`)
  wird dauerhaft ausgeblendet (`hideBronzeAndockBlock` + MutationObserver, da Modul 16 ihn erst
  beim Öffnen sichtbar schaltet). Der jetzt überflüssige `SbkimToolPwa`-Shim (aus AN) wieder
  entfernt. Modul 16 selbst unangetastet.
- **Echter Browser:** oberer Identitäts-Knopf da, Bronze-Andock-Block unsichtbar, 0 Fehler.
  `npm test` 77/77. `SIGNAL.json` seq 13.

## 2026-06-06 (AO) — Andock-Wizard Schritt 4: Identität wiederherstellen (importBackup)

Klaus (Screenshot Sage): der Wizard braucht den **4. Schritt „Identität wiederherstellen"** —
Backup-Datei (Schritt 3) + Passwort zurückspielen.

- **`assets/sbkim-siegel.js`**: Schritt 4 ergänzt — Datei-Input + Knopf „Backup-Datei wählen +
  wiederherstellen". Liest die Datei (`file.text()` → JSON), fragt Passwort, ruft
  `SbkimSpore.importBackup(blob, pw)` → Schlüssel + Spore zurück in die Browser-IndexedDB.
  Bei vorhandenem Slot: bewusster `confirm` → `importBackup(blob, pw, {force:true})`. Logik
  1:1 nach Sages `andockStep4Restore` (Overwrite-Fallback inklusive). Funktioniert auch auf
  neuem Gerät/Browser.
- **Echter Browser:** Schritt-4-Knopf + Datei-Input vorhanden, 0 Fehler. `npm test` 77/77.
  `SIGNAL.json` seq 12. Wizard jetzt mit **4 Schritten wie Sage** (Identität → Spore → Backup
  → Wiederherstellen). Schritt 2–4 brauchen Klaus' echten Browser-Lauf.

## 2026-06-06 (AN) — Toten [Andocken]-Knopf (Modul 18) auf echten Wizard umgeleitet

Klaus' Befund: im Siegel-Modal steht unter meinem neuen Knopf noch Modul 16s Bronze-Block
„Mycel suchend → [Andocken] (Modul 18)" — und *dieser* Knopf meldete „Modul 18 nicht
installiert". Erklärung: Modul 16 ruft `SbkimToolPwa.openAndockTab()` (Modul 18, Tool-PWA-
Container) auf — bei uns **nie eingebunden** und unnötig (Sage nutzt 18 auch nicht, sondern den
Seiten-Wizard).

- **Fix (`assets/sbkim-siegel.js`):** **vor** Modul-16-Init einen minimalen `window.SbkimToolPwa`-
  Shim registriert; dessen `openAndockTab()` öffnet **unseren** Andock-Wizard (wirft nicht →
  Modul 16 nimmt seinen Erfolgs-Pfad `closeModal`). Damit funktioniert der [Andocken]-Knopf
  ehrlich; kein „Modul 18 nicht installiert" mehr. Modul 16 selbst unangetastet.
- **Echter Browser:** Shim registriert, [Andocken] vorhanden, Klick schließt Modal + öffnet
  Wizard, 0 Fehler. `npm test` 77/77. `SIGNAL.json` seq 11.

## 2026-06-06 (AM) — Andock-Wizard im Siegel-Modal (Identität & Spore erzeugen/pflegen)

Klaus' Befund (Screenshot Sage): im Siegel-Modal fehlte der Knopf „🔑 Eigene Identität & Spore
erzeugen / verwalten" — das Andock-Modul, mit dem man notfalls eine **neue** Spore/Identität
erzeugen und pflegen kann (genau das, was Jasons-Tresor beim Schlüsselverlust brauchte).

- **`assets/sbkim-siegel.js`**: Modul 03 (Embedding) zu den geladenen Modulen ergänzt; nach
  Modul-16-Init wird ein Knopf ins Siegel-Modal (`#sbkim-siegel-modal`) injiziert, der einen
  **Wizard-Dialog** öffnet — re-geskinnt nach Sages Andock-Wizard, mit **unseren** CONFIG-Werten
  (nodeName/domain/endpoint/Kategorien). Drei Schritte über die **echten** Module:
  1. **Identität erzeugen** (`getOrCreateIdentity`, Ed25519 im Browser, nodeId),
  2. **Spore signieren + ⬇** (Modul 03 echter 384-dim domainVector → `generateOwnSpore` →
     `spore.json`-Download),
  3. **verschlüsseltes Backup** (`exportBackup`, AES-256-GCM/PBKDF2 600k).
  Modul 16 (`web/tools/sbkim-siegel.js`) bleibt **unangetastet** (1:1 Sage, byte-getestet).
- **Echter Browser-Beweis:** Siegel→Modal→Knopf sichtbar→Wizard öffnet→Schritt 1 erzeugt echte
  nodeId, Schritt 2 freigeschaltet, 0 Fehler. Schritt 2/3 (Embedding ~30 MB + Backup) brauchen
  Klaus' echten Browser-Lauf. `npm test` 77/77. `SIGNAL.json` seq 10.
- **Nutzen:** jeder unserer Knoten kann jetzt — wie Sage — im Browser eine neue Identität
  erzeugen/sichern, ohne headless-Tresor (passt zum Generalprobe-Plan).

## 2026-06-06 (AL) — Jasons-Tresor (C) Identitätswechsel + erster Tresor-Match → verified-MATCH

C meldete **Identitätswechsel**: alte nodeId `7F_zNopF…` war Demo-Schlüssel (Passwort verloren)
→ hinfällig; neue Identität **im Browser** erzeugt, **mit echtem domainVector**.

- **Verifiziert** (raw/main, `verify_foreign_spore.mjs`) → **✔ VALID**: neue nodeId
  `E13GDzIp0c7JfeZD0jVvFarNxPde8AcoP7qz7FtmdNM` (nachgerechnet), Signatur, 9/9, Manipulation
  fällt durch. `domainVector` **echt** (384-dim, L2=1.000000, kein `_demo`).
- **Echter Cross-Knoten-Match A⟷C: Cosine 0.853740 ≥ 0.80 → verified-MATCH** — erster echter
  semantischer Match **zwischen zwei Tresor-Knoten**. Offline reproduziert im Test.
- **Aktualisiert:** `sbkim/jason_inbox.json` (neue Spore) + `jason_inbox.verify.md`,
  `test/jason_inbox.test.js` (neue nodeId + Match-Reproduktion 0.853740), `status.json` +
  `web/data/marktplatz.json` (`verified-match`, alte nodeId als hinfällig vermerkt), Postfach
  §15 + Status-Kopf C-Zeile, `SIGNAL.json` seq 9. **`npm test` 77/77.**
- **Offen:** Cs eigenes `SIGNAL.json` fehlt weiter (ack[Jasons-Tresor] bleibt null). Impressum.

## 2026-06-06 (AK) — Mein-Tresor (Knoten D) reziprok verifiziert → verified-spore

Knoten D meldete dauerhafte Identität. Reziprok geprüft + aufgenommen — das Netz hat jetzt
**vier** kryptografisch verbundene Knoten (Sage⟷A, A→C, A→D).

- **Verifiziert:** Ds Spore aus `raw…/Mein-Tresor/main/sbkim/spore.json` → `verify_foreign_spore.mjs`
  **✔ VALID**: Signatur, `id == base64url(SHA256(rawPub))` = `wRsGQouOYPVBOLzAB3nBteRvyvJ-AGv461WTJMKtkS0`
  (gemeldete nodeId stimmt), 9/9 Pflichtfelder, Manipulation fällt durch. **domainVector fehlt**
  (bewusst weggelassen, kein Demo-Stub) → `verified-spore`, kein Match.
- **Eingetragen:** Momentaufnahme `sbkim/meintresor_inbox.json` + `…verify.md` + Offline-Test
  `test/meintresor_inbox.test.js` (4 Fälle). `status.json` + `web/data/marktplatz.json`
  (`verified-spore`). Postfach-Quittung in `AUSTAUSCH-MeinTresor.md`; Status-Kopf D-Zeile.
  `SIGNAL.json` seq 8, `ack["Mein-Tresor"]=4`, `mailboxes["Mein-Tresor"]`.
- **Beweis:** `npm test` **78/78** (+4).
- **Offen:** `verified-match` für D, sobald echter 384-dim `domainVector` + Re-Sign (gleicher
  Schlüssel → gleiche nodeId). Impressum (Text steht aus).

## 2026-06-06 (AJ) — Generalprobe-Plan festgehalten + headless-Tresor vs. Browser-Identität

Klaus' Frage „seid ihr über die Browser-Identität verbunden?" beantwortet (ehrlich: **nein —
wir gingen den headless-Tresor-Weg**, Passwort schützt die Datei, steht NICHT im Repo) und seine
strategische Festlegung netzweit dokumentiert.

- **`docs/SCHLUESSEL.md`** Kopf-Abschnitt „Zwei Wege": (A) **headless-Tresor** (unser Weg:
  `node:crypto` → verschlüsselte Datei `node_key.enc.json`, Passwort nötig, Passwort außerhalb
  des Repos) vs. (B) **Browser-Identität** (Jasons-/Mein-Tresor/MM/MR: Schlüssel im Browser,
  kein Passwort zum Erzeugen, Passwort nur fürs `exportBackup`). Klaus' Schluss bestätigt.
- **`sbkim/GENERALPROBE.md`** (neu, netzweit): das Bisherige ist **Testlauf/Lernphase**; später
  **systematischer Re-Sync** „von links nach rechts" (Sage als Anker → jede PWA/Tool bekommt
  über die **Browser-Tools** eine NEUE Identität/Spore/Embedding/Handshake), idealerweise an
  **einem Tag** = die **Generalprobe**, bei der alles über die echten Tools läuft. Offen/bewusst
  vertagt: genauer Reihenfolge-Fahrplan + Namens-/Knoten-Konvention (eigene Spec-Runde).
- **`sbkim/SIGNAL.json`** seq 7 kündigt beides an (jeder Knoten sieht es über Wächter/📬-Knopf).
- Reine Doku. `npm test` 74/74.

## 2026-06-06 (AI) — Mein-Tresor 2. Frage: Werkzeugkiste 1:1 übernehmen?

Knoten D fragte, ob sie unsere `werkzeuge.html`-Werkzeugkiste 1:1 für die Browser-Identität
übernehmen dürfen. **1:1 aus echten Dateien geantwortet** (`werkzeuge.html`-Script-Tags,
`sbkim-embedding.js`, `generate_spore.mjs` CONFIG, `sbkim-spore.js` Backup-Version).

- **Ehrliche Klarstellung:** Mein-Tresor hat als Jasons-Schwester **Scheibe 3 (Modul 01+02
  eingebettet)** schon → Browser-Identität vorhanden, unsere `werkzeuge.html` dafür **nicht
  nötig**. Unsere `werkzeuge.html` ist Schau/Selbstprüfung, **keine** Signier-UI.
- **Freigabe + genaue Liste** (im Postfach): exakte Script-Lade-Reihenfolge (01 Storage zuerst),
  CONFIG-Orte (Browser = `generateOwnSpore(meta)`-Argumente mit Pflicht `domain/endpoint/nodeType`;
  headless = `CONFIG`-Block oben in `generate_spore.mjs`), Backup-Format v2 (rückwärtskompat v1),
  Modul-02-braucht-01.
- **Wichtig/ehrlich (Embedding):** `sbkim-embedding.js` lädt transformers.js von **CDN** + Modell
  `e5-small` von **Hugging Face beim 1. Lauf (~30 MB)** — **nicht** lokal, **nicht** voll offline;
  bei HF-Sperre Vektor von Sage rechnen lassen. Für `verified-spore` gar nicht nötig.
- **Kanonische Form** bestätigt (Browser-Spore == unsere Verifikation, wie bei Jasons-Tresor).
- `SIGNAL.json` seq 6. Reine Doku/Postfach. `npm test` 74/74.

## 2026-06-06 (AH) — Mein-Tresor (Knoten D) andockt: Verfahren erklärt + SYNC-Vereinbarung v1

Vierter Knoten **Mein-Tresor** (design-vereinfachte Schwester von Jasons-Tresor, gleicher
JasonLib-Kern) bat — vorbildlich vor dem Signieren — um detailgetreue Verfahrens-Erklärung +
Synchronisationsvereinbarung. Alles **1:1 aus echten Dateien** beantwortet, nichts geraten.

- **`sbkim/AUSTAUSCH-MeinTresor.md`** (neu, an D adressiert, B3): beantwortet A1–A3 (Registrierung:
  9 Pflichtfelder `createdAt/domain/embeddingModel/endpoint/id/nodeType/protocolVersion/publicKey/
  signature`, Kanal raw/main + SIGNAL/📬, raw genügt), B1–B5 (SIGNAL-Konvention bestätigt,
  Kadenz „lesen bei Start / melden bei Bau", adressiertes Postfach, ack-Semantik), C1–C3
  (domainVector: Modul 03 im Browser/Sage rechnet, veröffentlichen + neu signieren bei gleichem
  Schlüssel→gleiche nodeId, `Xenova/multilingual-e5-small`/384/L2≈1/Cosine≥0.80), D1–D2
  (kanonische Form byte-deckungsgleich, protocolVersion 0.1 kein Drift). Plus **SBKIM-SYNC-
  VEREINBARUNG v1** als fester, 1:1 ablegbarer Text (9 Punkte inkl. Divergenz-Auflösung).
- **`sbkim/SIGNAL.json`** seq 5: Mein-Tresor in `mailboxes` + `ack["Mein-Tresor"]=3` (ihr SIGNAL
  seq 3 gelesen). Status-Kopf D-Zeile in `AUSTAUSCH.md` ergänzt.
- **Ehrlich:** Ds nodeId ist noch flüchtig (kein dauerhafter Tresor), domainVector `_demo` →
  noch **keine** Registrierung; erst nach ihrer dauerhaften Identität + sporeUrl.
- **Offen / nächste Schritte:** (1) D legt Identität an + meldet sporeUrl → wir verifizieren
  raw/main, tragen `verified-spore` ein (Inbox + Offline-Test + marktplatz). (2) danach echter
  `domainVector` → `verified-match`. (3) Impressum (Text steht aus).

## 2026-06-06 (AG) — EHRLICHKEITS-FIX: Lampen + Siegel echt verdrahtet (Modul 15+16)

Klaus' Befund (Pages jetzt live): **alle drei Lampen leuchteten grün** — falscher Eindruck.
Zwei echte Probleme gefunden und behoben:

- **Bug (CSS):** eine alte Regel `.lamp::before { background: var(--lamp-live) }` (Altbestand,
  Zeile ~94) überschrieb die Logik und färbte **jede** Lampe fest grün. Entfernt.
- **Konzept (der eigentliche Punkt):** mein `assets/sbkim-siegel.js` war eine **Attrappe**
  (statische Lampen + Andock-Modal), benutzte die **echten Module 15/16 nicht**. Neu
  geschrieben: lädt jetzt die unveränderten `web/tools/`-Module (01/02/04/05/07/15/16) und
  verdrahtet ehrlich:
  - **lebt** = an, nur wenn Modul 02 wirklich eine Identität lädt (echtes IndexedDB/WebCrypto);
  - **verkehr** = pulst nur bei echtem Fetch (status/SIGNAL/spore.json), kein Dauer-Grün;
  - **fremd** = von **Modul 15 (Membran)** bedient, rot **nur** bei echtem Fremdzugriff;
  - **Siegel** = **Modul 16**, startet **Bronze** („Mycel suchend"), wird **Gold** bei echtem
    Cross-Knoten-Handshake (`sbkim:handshake` outcome:"established"). Der 📬-Knopf feuert das
    Event, wenn er einen Peer (Sage/Jasons-Tresor) **wirklich erreicht** → Gold = Beweis.
- **Lampen-HTML** in alle vier `.statusbar` eingsetzt; altes ungenutztes Wappen-SVG gelöscht
  (Modul 16 trägt sein eigenes inline-SVG).
- **Beweis (echter Browser):** Lampen ehrlich (lebt=on, verkehr/fremd=grau); Modul 15+16 als
  `object` geladen, 0 Fehler; Siegel **bronze→gold** beim 📬-Kontakt verifiziert. `npm test`
  74/74. Statusleisten-Screenshots an Klaus.
- **Offen / nächste Schritte:** (1) Klaus' Browser-Lauf der korrigierten Leiste (Hard-Reload).
  (2) Optional: Gold-Stand über Reload hinweg merken (Modul 16 ist bewusst RAM-only/Bronze nach
  Reload — gewollt, ehrlich). (3) Impressum (Text steht aus). (4) Jason denselben Fix anbieten,
  falls dort auch Fehl-Grün.

## 2026-05-31 (AF) — Netz-Briefkasten §11.6: SIGNAL.json + Wächter + 📬-Knopf (Auto-Sync)

Sages netzweite Regel **INTERFACES §11.6** übernommen, damit sich alle drei Knoten automatisch
über Bauten informieren. Drei Dinge angelegt (Referenz 1:1 von Sage, nur CONFIG/Skin angepasst).

- **Aufgabe 1 — `sbkim/SIGNAL.json`:** Aushang, `seq 1`, `ack` symmetrisch. Sages `seq 7`
  gelesen → `ack["Sage-Protokol"]=7` (nichts offen); Jasons-Tresor hat noch kein SIGNAL (404)
  → `ack["Jasons-Tresor"]=null` (kein Alarm).
- **Aufgabe 2 — Sages Abgleich-Frage (Jason reziprok verifizieren):** Jasons **live** Spore
  (`raw…/Jasons-Tresor/main`) mit `verify_foreign_spore.mjs` → **✔ VALID** (byte-gleich zur
  Inbox aus #50). Als `verified-spore` in `status.json` geführt; Prüf-Vermerk
  `sbkim/jason_inbox.verify.md` angelegt; Postfach §13 (bestand schon). `domainVector` `_demo`
  → kein Match.
- **Aufgabe 3 — Auto-Sync-Schicht:** `.github/sbkim-watch.mjs` (Sages Wächter 1:1, CONFIG =
  Sage+Jasons) + `.github/workflows/sbkim-watch.yml` (Sages Workflow **byte-gleich**) +
  **📬-Knopf** in der Startseiten-Statusleiste (Button+Popup+Script + CSS, re-geskinnt auf
  Teal). Wächter lokal getestet (liest beide Peers, „nichts Neues", Jason-404 als Notiz);
  `node --check` ok; Knopf im echten Browser gegengeprüft (sichtbar, Klick rendert Popup).
- **CLAUDE.md** um „Briefkasten pflegen" (Sitzungsstart-/-ende-Pflicht) ergänzt. Postfach §14.
  **`npm test` 74/74.**
- **Offen / nächste Schritte:** (1) Klaus aktiviert GitHub Actions/Pages (Wächter läuft dann
  zeitgesteuert; 📬-Knopf braucht Pages-200 der eigenen SIGNAL.json). (2) Sobald Jasons-Tresor
  ein eigenes `SIGNAL.json` hat, quittiert unser Wächter dessen `seq` automatisch. (3) `verified-match`
  für C/Sage mit echtem `domainVector`. (4) Klaus' Browser-Lauf des 📬-Knopfs.

## 2026-05-31 (AE) — Knoten C (Jasons-Tresor) reziprok verifiziert → verified-spore (Drei-Knoten-Netz)

Jasons-Tresor meldete seine Spore live. Reziprok geprüft und aufgenommen — das SBKIM-Netz hat
jetzt **drei** kryptografisch verbundene Knoten (Sage ⟷ A, A → C).

- **Geholt + verifiziert:** Spore via `raw…/Jasons-Tresor/main/sbkim/spore.json` (github.io bei
  uns 403, wie immer → raw). `node scripts/verify_foreign_spore.mjs` → **✔ VALID**: Signatur,
  `id == base64url(SHA256(rawPub))` (`7F_zNopF…Z_3hCs`, unabhängig nachgerechnet), 9/9
  Pflichtfelder, Manipulation fällt durch. `domainVector` ehrlich `_demo` → **verified-spore**,
  kein Match behauptet.
- **Inbox-Beweis:** Momentaufnahme `sbkim/jason_inbox.json` + Offline-Test `test/jason_inbox.test.js`
  (+6: Pflichtfelder, Identität=Jasons-Tresor, Signatur, nodeId-Ableitung, `_demo` ehrlich,
  Manipulation bricht). **`npm test` 74/74 grün.**
- **Eingetragen:** `web/data/marktplatz.json` v0.4 — Knoten C als Endknoten (`verified-spore`).
- **Postfach:** §13 Verifikations-Quittung an C; Status-Kopf um C-Zeile ergänzt; §12-Quittung
  auf „erledigt" gesetzt.
- **Offen / nächste Schritte:** (1) `verified-match` für C, sobald echter `domainVector` vorliegt
  (Modul 03 im Browser oder gerechnet) → C signiert neu, wir verifizieren + stufen hoch. (2) C
  kann uns reziprok als Knoten verifizieren (volles Mesh). (3) Offen aus W: Info-Brief an Sage.

## 2026-05-31 (AD) — Jasons Bug-Fund gefixt (flaky Test) + 4 Fragen beantwortet

Knoten C (Jasons-Tresor) meldete über sein Postfach **vier Fragen**, darunter einen **echten
Bug in unserem Test** — gut gefunden, sofort upstream gefixt.

- **Frage 1 / FIX (real):** `test/jason_lib.test.js` „Manipulation faellt durch" kippte das
  **letzte** base64url-Zeichen des Chiffrats — kann ein No-op sein (überzählige Bits werden
  beim Dekodieren verworfen) → kein Reject → Test scheitert. Reproduziert: **1/12 flaky**.
  Fix: **erstes** Zeichen kippen (immer signifikant). 5× `npm test` → **68/68** stabil.
- **Antworten (Postfach §12):** F2 — Scheibe 3 (Modul 01+02 eingebettet, „verschlüsselt im
  Schrank") ist **kanonisch**; `index.html` + `test/jason_lib.test.js` + die zwei `web/tools`-
  Module in **einem** Re-Copy von `main` (byte-genauer Einbettungs-Test!). F3 — Stand aktuell,
  einziges Muss: den Frage-1-Fix nachziehen. F4 — Drei-Knoten-Netz **ja**; sobald Cs nodeId
  dauerhaft + Pages-200, verifizieren wir reziprok (`jason_inbox.json` + Offline-Test), brauchen
  nur die `sporeUrl`.
- **Status-Kopf/Quittung** in `sbkim/AUSTAUSCH.md` gesetzt (gelesen + geantwortet 2026-05-31;
  wartet auf Cs dauerhafte nodeId + Pages-200).

## 2026-05-31 (AC) — Sage informiert: dritter Knoten Jasons-Tresor dockt an (Postfach)

Parallel zum Aufbau von Jasons-Tresor Sage über die **Synchronisations-Brücke** (Postfach
`sbkim/AUSTAUSCH.md`) vorgewarnt — die ruhende Verbindung wacht damit für den neuen Bau auf.

- **`sbkim/AUSTAUSCH.md`**: neuer Abschnitt „§11 Ankündigung an Sage (2026-05-31)" — ein dritter
  Endknoten **Jasons-Tresor** entsteht (gebaut 1:1 aus unseren getesteten Originalen), bekommt
  eine eigene Ed25519-Identität via `make_node_key.mjs` und dockt nach §11-Konventionen an
  (Registrierung, sobald seine `spore.json` 200 liefert). Hinweis auf das neue Werkzeug
  `make_node_key.mjs`. Status-Kopf + Log-Zeile (2026-05-31) aktualisiert.
- **Antwortweg:** Sage kann hier, über sein Postfach oder direkt gegenüber Jasons-Tresor
  antworten; direkte Tresor ⟷ SB·KIMTool·Point-Verifizierung (Drei-Knoten) bei Bedarf.
- Reine Doku/Kommunikation — `npm test` unberührt (68/68). Geht erst live für Sage, wenn der
  PR auf `main` gemergt ist.

## 2026-05-31 (AB) — Lücke geschlossen: Schlüssel-Tresor ANLEGEN (make_node_key.mjs)

Die erste Jasons-Tresor-Sitzung meldete (zu Recht) eine Blockade: es gab nur
`open_node_key.mjs` (öffnen), aber **kein Werkzeug zum Anlegen** des Tresors, und
`docs/SCHLUESSEL.md` Schritt 1 war vage. In **diesem** Repo behoben, damit jeder Knoten
das **getestete** Werkzeug 1:1 kopiert.

- **`scripts/make_node_key.mjs`** (neu): einmalig frischer Ed25519-Schlüssel → dauerhafte
  `nodeId` (Ableitung identisch zu `generate_spore.mjs`) → **verschlüsselt** als
  `sbkim/node_key.enc.json` (AES-256-GCM / PBKDF2 600k, Format wie `open_node_key.mjs` liest).
  Passwort nur über `SBKIM_KEY_PW`; privater Schlüssel/Passwort **nie** auf stdout/ins Repo;
  vorhandener Tresor wird nicht überschrieben (außer `SBKIM_KEY_FORCE=1`).
- **`test/make_node_key.test.js`** (+5): Roundtrip, nodeId stabil + ableitbar, Umschlag-Format,
  zu kurzes/falsches Passwort scheitert. **`npm test` 68/68 grün.**
- `docs/SCHLUESSEL.md`: Abschnitt „Tresor ANLEGEN" + Verlust-Fall auf `make_node_key`.
  Andock-Brief §3: Identität = **ein Lauf** make_node_key, dann open→generate_spore.
- Empfehlung für Jason-Frage 1/3: **Option 1 (Frischer Schlüssel + Tresor)**; Jason kopiert
  dieses getestete Werkzeug. Echter Tresor dieses Repos (`CyunQNDR…`) unangetastet.

## 2026-05-31 (AA) — Jasons-Bibliothek Scheibe 3: SBKIM-Identität im Tresor + Sicherheits-Fix

Klaus: „Option 3 umsetzen". Umgesetzt der belastbare Kern — die App ist jetzt ein eigener
**SBKIM-Knoten** und kann Schlüssel/IDs wirklich sichern/wiederherstellen. Zwei ehrliche
Punkte vorab benannt (statt still zu bauen).

- **Modul 01 (Storage) + Modul 02 (Spore) 1:1 eingebettet** in `jasons-bibliothek/index.html`
  (zwischen `SBKIM-STORAGE/SPORE-EMBED`-Markern; Datei jetzt ~2820 Zeilen, weiter **eine** Datei,
  offline). UI: „🪪 SBKIM-Identität anzeigen/anlegen" (zeigt `nodeId`), „🔒 Identität sichern"
  (`getOrCreateIdentity`→`generateOwnSpore`→`exportBackup` → verschlüsseltes Backup, Download +
  im Schrank), Wiederherstellung über „Öffnen 🔓" (`importBackup`).
- **Sicherheits-Fix (Scheibe 2 hatte ein Leck):** ein eingelesener Tresor wurde vorher sofort
  entschlüsselt und als Klartext (inkl. privater Schlüssel!) in `localStorage` abgelegt. Jetzt:
  **verschlüsselt bleibt verschlüsselt im Schrank** (`wrapTresorEntry`), Öffnen nur per
  Knopf+Passwort. Eintrag zeigt „🔒 verschlüsselt" + „Öffnen 🔓".
- **Befund (ehrlich):** Modul 01/02 brauchen echtes IndexedDB → headless nicht lauffähig; der
  Beweis dafür ist der **echte Browser** (HTTP-Origin), nicht `npm test`.
- **Web Share Target bewusst NICHT in die Einzeldatei:** braucht Manifest **+ Service-Worker**
  (mehrere Dateien) + installierte App → bricht die „eine-Datei"-Regel; gehört ins
  **Jasons-Tresor-Repo** (dort installiert). In den Andock-/Folge-Brief gelegt.
- **Beweis:** `npm test` **63/63** (+2: Einbettung byte-genau, `wrapTresorEntry`). **Echter
  Browser (Playwright/Chromium über lokalen HTTP-Server):** Gerät A legt Identität an + signiert
  Spore + sichert verschlüsselt; **Gerät B (frischer Speicher) stellt dieselbe `nodeId` wieder
  her**; falsches Passwort abgewiesen; `JasonLib.isTresor` erkennt den Modul-02-Blob; keine
  Konsolenfehler. **Klaus' eigener Browser-Lauf** (Knöpfe/Download/Passwort) **steht aus**.
- **Doku:** `docs/JASONS-BIBLIOTHEK.md` (Scheibe 3), `status.json`, `docs/WERKZEUGE.md`.
- **Offen / nächste Schritte:** (1) Klaus' Browser-Lauf. (2) In Jasons-Tresor den Bauplan
  ausführen (App + Identität sind durch das Kopieren schon dabei) + **Web Share Target** dort
  bauen. (3) Offen aus W: Info-Brief an Sage. (4) Optional: `domainVector` + Andock dieses
  Tools/Knotens an Sage.

## 2026-05-31 (Z) — Umbenennung Jeson → Jason + Andock-Bauplan fürs eigene Repo

Klaus' Entscheidung: das Werkzeug heißt **Jasons-Tresor** (eigenes Repo
`lausiklauskn-png/Jasons-Tresor`, von Klaus angelegt) — **von außen ein Tresor, drinnen die
„Jasons-Bibliothek"**. Begründung: weitere Tools kommen später hinzu, die ebenfalls im Tresor
gesichert werden; die Bibliothek ist der Anfang. Innerer Name daher einheitlich **Jason** (mit „a").

- **Umbenannt (1:1, kein Logikwechsel):** Ordner `jesons-bibliothek/ → jasons-bibliothek/`,
  `test/jeson_lib.test.js → jason_lib.test.js`, `docs/JESONS-BIBLIOTHEK.md → JASONS-BIBLIOTHEK.md`,
  Brief `…bruecken-und-repo.md`. Text `Jeson → Jason` in App, Test, aktiver Doku, status.json:
  Titel/Manifest „Jasons-Bibliothek", Kern-Marker `JASONLIB-CORE`, `window.JasonLib`,
  `kind: jason-eintrag/jason-bibliothek/jason-tresor`, Storage-Key `jasons-bibliothek-v1`.
  Historische PULS-Einträge (X/Y) + alter Brief bleiben als Historie unverändert.
- **Tresor-Kompatibilität unberührt:** der verschlüsselte Umschlag wird **strukturell** erkannt
  (`isTresor`: kdf+cipher+ciphertext) — bleibt 1:1 kompatibel zu Modul 02 `exportBackup` und
  `node_key.enc.json` (das `kind`-Label ist nur intern).
- **PR #44 gemergt** (squash) → App + Test + Bauplan auf `main`.
- **Andock-Bauplan** `docs/sessions/BRIEF_jasons-tresor-andock.md`: wie Jasons-Tresor sich aus den
  getesteten Originalen (raw-URLs auf `main`) selbst baut, eigene Ed25519-Identität erzeugt +
  Schlüssel sichert und **wie SB-KIMTool-Point an Sage andockt**. Ehrliche Grenze vermerkt:
  dieses Repo kann Jasons-Tresor nicht fernsteuern (Scope) → Kopier-/Selbstbau-Weg.
- **Beweis:** `npm test` **61/61**; echter Browser-Smoke (Chromium WebCrypto): Titel
  „Jasons-Bibliothek", `jason-tresor`-Roundtrip grün, keine Konsolenfehler.
- **Offen / nächste Schritte:** (1) Klaus' Browser-Lauf der App. (2) In Jasons-Tresor den Bauplan
  ausführen (Grundgerüst → App → Identität → Andock an Sage). (3) Scheibe 3 hier: Web Share Target
  + Modul 02 einbinden (volle Schlüssel-Wiederherstellung). (4) Offen aus W: Info-Brief an Sage.

## 2026-05-31 (Y) — Jasons-Bibliothek Scheibe 2: Tresor (gleicher Umschlag wie Modul 02)

Klaus zeigte (Screenshot Sage-Seite): **Modul 02 macht das Schlüssel-Backup schon** —
„Identität sichern · Modul 02 Backup-Export Stufe 2" (PBKDF2-SHA256 600k + AES-GCM-256, seit
2026-05-16, rückwärtskompatibel zu MM/MR-Backups). Ziel: Jesons + Keys an **einem** Ort,
„von außen ein Tresor, drinnen eine Bibliothek". Klaus „keine Präferenz" → empfohlener Weg
„hier bauen, dann kopieren". **Scheibe 2 (Tresor) gebaut.**

- **Kern (`jesons-bibliothek/index.html`, zwischen Markern):** `encryptTresor`/`decryptTresor`
  über **WebCrypto** — **derselbe Umschlag wie Modul 02 `exportBackup`** und `node_key.enc.json`:
  `{version,kdf:PBKDF2/SHA-256/600k, cipher:AES-GCM-256, ciphertext}` (base64url, Tag im
  Chiffretext). `isTresor` erkennt strukturell; `payloadToEntries` trennt **Bibliothek**
  (`eintraege[]`) von **SBKIM-Schlüssel-Backup** (`identities[]`) von roher JSON.
- **Oberfläche:** Knöpfe „🔒 Verschlüsselt sichern" (ganze Bibliothek) + „Verschenken 🔒"
  (ein Eintrag, Passwort getrennt mitteilen). Einlesen erkennt einen Tresor **automatisch**
  und fragt das Passwort — öffnet auch verschlüsselte Identitäts-Backups von Modul 02/MM/MR.
- **Beweis:** `npm test` **61/61** (+6: Roundtrip, falsches Passwort, GCM-Manipulation,
  `payloadToEntries`/`isTresor`). **Echter Browser-Smoke (Chromium WebCrypto):** Tresor-Roundtrip
  stimmt, falsches Passwort abgewiesen, keine Konsolenfehler. **Klaus' eigener Browser-Lauf**
  (Datei-Auswahl, Download, Passwort-Eingabe) **steht aus**.
- **Doku:** `docs/JESONS-BIBLIOTHEK.md` (Tresor von „geplant" auf „fertig", Format = Modul 02),
  `status.json` + `docs/WERKZEUGE.md` nachgezogen.
- **Offen / nächste Schritte:** (1) Klaus' Browser-Lauf. (2) Scheibe 3 — App-übergreifend
  „immer am selben Ort" (Web Share Target + fester Ordner), **Modul 02 einbinden** für volle
  Schlüssel-Wiederherstellung (`importBackup`), installierbar (Service-Worker). (3) **Brücke
  ans Protokoll** für Klaus' neues Bibliothek-Repo (eigene Spore + `domainVector` + Andock an
  Sage) — als Kopier-Starter, da meine Schreibrechte nur dieses Repo umfassen. (4) Offen aus W:
  Info-Brief an Sage.

## 2026-05-31 (X) — Jesons-Bibliothek Scheibe 1 (eigenständige Einzeldatei-App)

Klaus' größere Idee: aus dem Schlüssel-Tresor-Gedanken eine herunterladbare **„Jesons-
Bibliothek"** machen (wie Mein-Mixarium / Mein-Rezeptbuch) — beliebige `.json` aufheben,
benennen, ordnen, exportieren, wieder einlesen, später verschenken. Klaus' Zusatz: der
Tresor soll **auch SBKIM-Schlüssel + Knoten-IDs** sichern. Plan im Chat gezeigt; Klaus
„keine Präferenz" → empfohlene **Scheibe 1** gebaut (ohne Verschlüsselung; die kommt in 2).

- **`jesons-bibliothek/index.html`** — offline-taugliche **Einzeldatei**, keine externen
  Abhängigkeiten (Live-PWA-Regel). PWA-Grundausstattung (`lang=de`, data-URI-Manifest +
  Icon, theme-color, mobile/apple web-app-capable). Eigene dunkle Teal-Identität.
  Funktion: `.json` laden → benennen, Kategorie + Schlagworte → suchen/sortieren → ansehen
  → einzeln exportieren → ganze Bibliothek **sichern**/**einlesen**. Speicher = `localStorage`.
- **Kern browser- UND node-tauglich:** Logik liegt zwischen Markern `JESONLIB-CORE-START/END`
  im `index.html`. **`test/jeson_lib.test.js`** schneidet genau diese Bytes heraus und prüft
  sie headless (kein Duplikat): Parsen, Eintrag-Normalisierung, Export-/Import-Hülle,
  Zusammenführen nach `id` (neuere `updatedAt` gewinnt), Filter/Sortierung. **`npm test`
  55/55 grün** (+10).
- **Entwickler-Browser-Smoke (Playwright):** Seite lädt fehlerfrei in Chromium, `JesonLib`
  registriert, Leer-Zustand + Knöpfe da, echte Eintrag-Runde im DOM. **Klaus' eigener
  Browser-Lauf** (Datei-Auswahl, Download, Bearbeiten-Dialog) **steht noch aus**.
- **Spec vor Code:** Datenvertrag in `docs/JESONS-BIBLIOTHEK.md` — `jeson-eintrag`,
  `jeson-bibliothek` und (für Scheibe 2 geplant) `jeson-tresor` mit **demselben Umschlag**
  wie `sbkim/node_key.enc.json` (AES-256-GCM/PBKDF2 600k). Pointer in `docs/WERKZEUGE.md`;
  ehrlicher Eintrag in `status.json`.
- **Offen / nächste Schritte:** (1) Klaus' Browser-Lauf der Seite (Hard-Reload). (2) Scheibe 2
  = Tresor (Passwort-Verschlüsselung; sichert auch SBKIM-Schlüssel/IDs). (3) Offen aus
  Eintrag W: Info-Brief an Sage (Krypto-Rezept + Bitte um Werkzeugkiste-Ausrichtung auf echte,
  getestete Werkzeuge). (4) Optional: Link von der Hub-Seite zur Bibliothek.

## 2026-05-30 (W) — Andock abgeschlossen + Schlüssel-Tresor + Markt-Links live (grün)

Abschluss des Sage-Andocks und zwei brauchbare Verbesserungen. **Manual-Check: ✅ von
Klaus im Browser bestätigt** („alles perfekt") — der Markt ist damit grün.

- **Schlüssel-Tresor (PR #40):** Der private `SBKIM_NODE_KEY` liegt jetzt verschlüsselt im
  Repo (`sbkim/node_key.enc.json`, AES-256-GCM/PBKDF2 600k) — nur mit Klaus' Passwort zu
  öffnen, Passwort steht nirgends im Repo. `scripts/open_node_key.mjs` öffnet ihn,
  `docs/SCHLUESSEL.md` dokumentiert Re-Sign-Ablauf + Verlust-Fall. Damit bleibt die nodeId
  `CyunQNDR…` dauerhaft erhalten (kein Identitätswechsel mehr nötig).
- **Andock bilateral vollständig (PR #41 + #42):** Sage hat uns auf `verified-match`
  (matchScore **0.848508**) gesetzt, neue nodeId registriert (alte als `previousNodeIds`).
  Wir lieferten den **Rückbrief A–E** (Postfach §10) → Sage goss ihn in `docs/INTERFACES.md`
  §11 „Andock-Konventionen" (§11.1–§11.5, netzweit). **Abnahme bestätigt:** §11 gegen unseren
  Rückbrief gegengelesen — korrekt eingefangen, keine Änderungen. **Reine Abnahme, keine
  Gegen-Quittung nötig** (Sync §11.4) → die Austausch-Runde ist sauber zu, Verbindung ruht.
- **Markt brauchbar gemacht (PR #43):** Der „→ andocken"-Knopf zeigte auf tote `#andock/…`-
  Anker und tat nichts. Jetzt öffnet er die **echte Live-Seite** des Knotens in neuem Tab
  (URLs aus Sages `status.json`): Rezeptbuch→`Mein-Rezeptbuch`, Mixarium→`Mein-Mixarium`,
  Sage→`Sage-Protokol`. Sage-Karte trägt den Chip **„✓ voller Match · 0.85"** (heutiges
  Ergebnis). `assets/app.js renderMarkt`: externe Links `target=_blank rel=noopener` +
  Match-Chip; `web/data/marktplatz.json` mit echten Links + `matchScore`/`matchHinweis`.
- **Beweis:** `npm test` 45/45 grün. Markt-URLs von Klaus im Browser bestätigt (live).
- **Offen / nächste Schritte:** (1) Nichts Blockierendes — der Andock-Auftrag ist erledigt,
  die Verbindung ruht bis zum nächsten echten Bau (neues Modul oder dritter Knoten weckt
  sie). (2) Optional: Markt-Suche bauen (Daten in `nodes.json` vorbereitet). (3) Optional:
  weitere reife Sage-Module Datei für Datei kopieren.

## 2026-05-30 (V) — Re-Sign vollzogen + Schlüsselwechsel + Pages live

- **Schlüsselwechsel (ehrlich):** Der private Schlüssel zur alten nodeId `eC3jzoo9…` war nie
  dauerhaft gesichert (kein `SBKIM_NODE_KEY`). Mit Klaus’ ausdrücklichem Okay neue, dauerhafte
  Identität erzeugt; Schlüssel diesmal sicher abgelegt (Passwort-Manager + Environment-Secret).
- **Neue nodeId:** `CyunQNDRZZ3st8xGDYyK0ymJLNxn_S1UcIJpFKpXXNY`. Spore live neu signiert mit
  **echtem** `domainVector` (Match **0.848508 ≥ 0.80**), kein `_demo`. ✔ VALID.
- **GitHub Pages aktiv:** `…github.io/SB-KIMTool-Point/sbkim/spore.json` liefert **200**
  (von Klaus bestätigt, JSON sichtbar). Sage kann `sporeUrl` auf die Pages-URL setzen.
- **Postfach:** §8 „Schlüsselwechsel + Bitte um Neu-Registrierung" (alte→neue nodeId,
  `verified-spore`→`verified-match`), Status-Kopf + Bau-Protokoll-Zeile aktualisiert.
- **Beweis:** `npm test` 45/45; `verify_foreign_spore.mjs sbkim/spore.json` → ✔ VALID.
- **Offen:** Sage liest Postfach → verifiziert reziprok → registriert neue nodeId +
  Match-Hochstufung. **Manual-Check:** Pages live im Browser bestätigt (Klaus).

## 2026-05-30 (U) — Erster echter semantischer Match (0.8485) + Re-Sign vorbereitet

**Meilenstein:** der erste echte semantische Match im SBKIM-Netz steht rechnerisch.

- **Sage lieferte unseren echten `domainVector`** (im Browser erzeugt, Modul 03,
  `multilingual-e5-small`, e5 `passage:`-Präfix). Abgelegt als `sbkim/domainVector.real.json`
  (+ Beleg `domainVector.real.README.md`). Geprüft: 384 Floats, L2 ≈ 1.0000.
- **Cross-Knoten-Match Sage ⟷ SB·KIMTool = 0.848508 ≥ 0.80** — offline reproduziert in
  `test/match.test.js` (+2 Beweise). `npm test` **45/45**, `npm run verify` **16/16**.
- **Generator umgestellt:** `scripts/generate_spore.mjs` zieht den echten Vektor fest in die
  signierten Bytes; `_demo` entfällt bei echtem Vektor (Fallback auf Stub bleibt ehrlich +
  scheitert laut bei kaputter Datei). `docs/ANDOCK.md` §5/§2/§7 von „Demo" auf „echt"
  umgeschrieben. `andock.test.js` angepasst (kein `_demo`, Vektor == Lieferung).
- **STOPP vor Re-Sign (ehrlich):** `SBKIM_NODE_KEY` ist in dieser Umgebung **nicht gesetzt**.
  Re-Sign ohne Secret würde die nodeId von `eC3jzoo9…` wegdrehen und Sages Registrierung
  zerstören → laut Auftrag gestoppt. **Live-`spore.json` bewusst unverändert** (trägt noch
  den Demo-Vektor). Alles fürs Re-Sign vorbereitet: sobald Klaus das Secret stellt, ist es
  **ein** Lauf (`node scripts/generate_spore.mjs`) + Republish.
- **Postfach:** Lese-Quittung + Match-Quittung (§7) + Bau-Protokoll-Zeile (Sync §6.3) +
  Bitte an Sage, nach Republish auf `verified-match (0.8485)` hochzustufen.
- **Offen, priorisiert:** (1) Klaus setzt `SBKIM_NODE_KEY` → Re-Sign + Republish; (2) Sage
  stuft hoch; (3) GitHub Pages aktivieren (403). **Manual-Check:** rein headless/statisch.

## 2026-05-30 (T) — Sage-Andock: Antwort gelesen + Sages Spore reziprok ✔ VALID

Andock-Identität ist jetzt **beidseitig** kryptografisch bestätigt. Diese Sitzung startete
auf altem Commit; zuerst per Fast-Forward auf aktuelles `main` gezogen (CLAUDE.md: „immer
gegen main"). Dann der Brief-Auftrag: Sages Antwort einlesen + verifizieren.

- **Sage hat geantwortet** (gelesen über `raw.githubusercontent.com/.../Sage-Protokol/main/`):
  alle 5 Fragen beantwortet, **unsere `spore.json` als ✔ VALID verifiziert**, uns als
  **4. Endknoten** in Sages `status.json` registriert (`pingStatus: "verified-spore"`).
- **Reziprok geprüft:** Sages live-signierte Spore mit **unserer** kanonischen Form (ANDOCK §4)
  → **✔ VALID** (Signatur, `id == SHA256(rawPub)` = `nysOZE3V…JkYfA`, 9/9 Pflichtfelder,
  Manipulation fällt durch). Form beidseits byte-deckungsgleich.
- **Beweis statt Behauptung (neu):** `sbkim/sage_inbox.json` (originalgetreue Momentaufnahme,
  ANDOCK §6.2) + `scripts/verify_foreign_spore.mjs` (headless Fremd-Spore-Verifizierer,
  Datei/URL) + `test/sage_inbox.test.js` (offline, deterministisch). **`npm test` 42/42**
  (+3), **`npm run verify` 16/16**.
- **Postfach `sbkim/AUSTAUSCH.md`:** Lese-Quittung gestempelt (Status-Kopf A: „zuletzt
  gelesen 2026-05-30"), Sages Zeile gespiegelt, neue Quittung §4 + Log-Runde §5. Hinweise
  zurück (nicht-blockierend): Pages-403 (bei Klaus), `stamm/guestCategories`, echtes Embedding.
- **Sage-Hinweis B vorbereitet:** `stammCategories` + `guestCategories` in
  `scripts/generate_spore.mjs` + Spec `docs/ANDOCK.md` §2 ergänzt; Prüf-Vermerk-Sidecar
  `sbkim/sage_inbox.verify.md`. `npm test` **43/43**. **Live-`spore.json` bewusst NICHT
  republished.**
- **Umgebungs-Blocker für Republish/Re-Sign (ehrlich):** in dieser Sitzung war
  `SBKIM_NODE_KEY` **nicht gesetzt** (Re-Sign → flüchtige nodeId → würde Sage-Registrierung
  zerstören) **und** `huggingface.co` **gesperrt (403)** → echter `domainVector` headless
  hier **nicht rechenbar**. Kategorien + echter Vektor + `_demo`-Entfernung gehören in
  **einen** Re-Sign, sobald Secret + Embedding-Pfad stehen.
- **Offen, nicht-blockierend:** (1) echtes Embedding für unseren `domainVector` → echter
  Match (Modul 03 im Browser ODER Sage rechnet aus unserem Text → danach neu signieren);
  (2) GitHub Pages aktivieren (Endpoint liefert 403, bei Klaus); (3) Aufnahme der signierten
  Spore als echte Komponente in unser `status.json` (Ring) — wartet auf Klaus (PR #34 hängt);
  (4) Secret `SBKIM_NODE_KEY` in der Re-Sign-Sitzung bereitstellen.
  **Manual-Check:** rein statisch/headless — kein Browser-Lauf nötig; Seite unverändert.

## 2026-05-30 (S) — Sage-Andock: signierte Spore + Austausch-Postfach

Erste echte Zusammenarbeit zweier SBKIM-Repos. Sage erreichbar über WebFetch (öffentlich)
→ Vertrag, Live-Spore, Module gelesen. Schlüssel-Erkenntnis: **beide Repos können einander
direkt aus dem Netz lesen** — kein Kurier-Zwang, nur Klaus startet Sitzungen.

- **`docs/ANDOCK.md`** — Vertrag (Spec vor Code): Sage-Schema, kanonische Signier-Form,
  Schlüssel via Secret, `domainVector` ehrlich Demo.
- **`sbkim/AUSTAUSCH.md`** — Postfach mit Lese-Quittung („zuletzt gelesen"/„wartet auf"),
  ehrlichem Prüf-Rhythmus (bei Sitzungsstart, kein Dauerlauf), Fragen an Sage, Protokoll-Log.
- **Sage antwortete** (über Klaus) mit funktionierendem Spore-Generator: übernimmt unsere
  Signier-Form (§4), ergänzt Pflichtfelder `createdAt` + `embeddingModel`, akzeptiert
  Demo-Vektor. Geprüft (kein Netz/eval/Shell), übernommen als `scripts/generate_spore.mjs`.
- **`sbkim/spore.json`** — dauerhafte, echt signierte Identität. nodeId
  `eC3jzoo9Oii04KiSYBXEWhPQzAe6ezmDFKDo1_i0zdw`. Privater Schlüssel NUR als Secret
  `SBKIM_NODE_KEY` (nie im Repo). **Real:** Identität/Signatur. **Demo:** semantischer Match.
- **Beweis:** `test/andock.test.js` (5 grün) — Signatur ✔, nodeId=SHA256(pub) ✔, Schema ✔,
  Demo-Markierung ✔, Manipulation fällt durch ✔. `npm test` **39/39**. Siegel-Eintrag gesetzt.
- **Offen:** Klaus setzt Secret `SBKIM_NODE_KEY`; Sage verifiziert unsere veröffentlichte
  Spore + trägt Status-Kopf ein; Sages Modul 02 (Verifizierer) Bau-Plan; Registrierung in
  Sages `status.json`. **Manual-Check:** spore.json ist statisch (kein Browser-Lauf nötig);
  Sichtprüfung der Seite unverändert von gestern.

## 2026-05-30 (R) — Startseiten-Puls: „Was ist real, was ist Demo?" + Agenten in Aktion

Klaus' Wunsch (Sage-Vorbild): das selbst-aktualisierende Real/Demo-Tool oben auf der
Hauptseite, mit erklärendem Symbol in der Mitte + den Agenten/Mitarbeitern in Aktion.

- **`index.html` `<section id="puls">`:** Real-Anteil-RING (grüner Bogen = echte/alle
  Komponenten aus status.json, selbst-aktualisierend) + **eigenes re-geskinntes
  Knoten-Glyph** in der Mitte (kein Pilz-Klon, Verfassung) das die Erklärung auf-/zuklappt
  + **„Agenten in Aktion"**-Liste: jede status.json-Komponente ein Mitarbeiter mit
  Lebt/Demo-Lampe (✓ lebt = echt:true, ◐ Demo = schlummert/zeigt).
- **`app.js` `renderPuls()`:** zählt echt÷alle EHRLICH (aktuell 5/12 = 42 %), animiert Ring
  + Zahl, baut Agenten-Liste, Klick-Toggle für Erklär-Box. Quelle = dieselbe status.json.
- **`style.css`:** `.puls/.ring-*/.agent*` an die neutrale Identität angelehnt.
- **Beweis:** `npm run verify` neue Startseiten-Proben — Ring 42 % == erwartet 42 % (gegen
  status.json gegengerechnet), 12 Agenten gelistet, 5 „lebt", Knoten klappt Erklärung auf.
  **16/16 grün.** Headless **34/34**. (Anekdote: Test las anfangs 29 % mitten in der
  Hochzähl-Animation — abgehärtet auf Animationsende, Zahl ist korrekt 42 %.)
- **Ehrlich-Effekt:** Der Ring wächst automatisch, sobald eine Komponente echt:true wird —
  kein Hand-Tuning, gezählte Wahrheit.
- **Manual-Check:** ✅ von Klaus im Browser bestätigt (2026-05-30): Look „sehr gut bis Top".
  Funktion via verify belegt, Optik jetzt abgenommen — die Startseite ist grün.

## 2026-05-30 (Q) — Protokoll-Lauf: die ganze Kette auf einmal (End-to-End)

Logisch bester Schritt (Embedding-Vendoring verworfen: Modell-Host 403 + ~100 MB gehört
nicht ins Repo). Stattdessen die einzeln bewiesenen Bausteine erstmals als **eine Kette**.

- **`werkstatt.js` v0.4 `protocolRun(A, B)`:** Identität (02) → Passung (03+04) → bei
  Treffer Vertrauen (02 generateOwnSpore→verifyForeignSpore) → Siegel-Stand (16). Jeder
  Schritt ehrlich beschriftet: grün / „braucht Browser" / „übersprungen (kein Treffer)".
- **Sichtbar:** Werkzeuge-Seite, Knopf „Protokoll-Lauf starten" (nutzt dieselben zwei
  Profil-Felder wie Live-Match), zeigt die Schrittfolge + Zusammenfassung.
- **Tests:** headless 2 Fälle (ohne Browser-Spore → Schritt 1 ehrlich „browser"; kein
  Treffer → Schritt 3 „skip"). **`npm test` 34/34 grün.** Browser `npm run verify`: volle
  Kette (Schritt 1 Identität echt, 3 Vertrauen echt bei Treffer, 4 Siegel). **12/12 grün.**
- README/LIVE-MODELL nachgezogen.
- **Manual-Check:** Knöpfe im Browser ungeprüft durch Klaus; automatisch via verify belegt.

## 2026-05-30 (P) — Live-Match: zwei Profile → echter Treffer (semantische Vermittlung)

- **`assets/werkstatt.js` v0.3 `liveMatch(profilA, profilB)`:** verkettet 03 Embedding →
  04 Match. **Echter Pfad** (Klaus' Browser, Modell geladen): `embedQuery/embedPassage` →
  `match`. **Container/offline:** ehrlicher **Demo-Vektor** (Wort-Überlappung auf 384 Dim,
  3 Hash-Seeds), klar als „DEMO — echtes Ergebnis erst in Klaus' Browser" gekennzeichnet.
  Ehrliche Grenze dokumentiert: Demo kann keine Semantik, nur exakte Wort-Überlappung.
- **Sichtbar:** Werkzeuge-Seite hat jetzt „Live-Match" mit zwei Textfeldern + Knopf
  „Profile vergleichen" → Treffer/kein-Treffer + Passung-% + Quelle (echt/Demo).
- **Tests:** headless `test/werkstatt.test.js` (mehr gemeinsame Wörter → höhere Passung;
  Demo ehrlich gekennzeichnet; ohne Match-Modul ok=false). **`npm test` 32/32 grün.**
  Browser `npm run verify`: Live-Match-Probe (ähnlich 0.80 > fremd 0.00). **9/9 grün.**
- README nachgezogen. **Manual-Check:** echter semantischer Vergleich (mit Modell) erst in
  Klaus' Browser sichtbar — Demo-Pfad ist hier bewiesen.

## 2026-05-30 (O) — Echter Browser-Beweis + lokaler 2-Knoten-Handshake (npm run verify)

Klaus' Frage: können die Tests im echten Browser laufen / über SBKIM verbinden? Befund &
Umsetzung:

- **Echter Browser da:** Playwright/Chromium läuft im Container. Neuer `scripts/browser-verify.mjs`
  (`npm run verify`) startet einen lokalen HTTP-Server, lädt `werkzeuge.html` in echtem
  Chromium und beweist die bisher nur „wartet auf Klaus"-Pfade **automatisch**:
  01 Storage (echtes IndexedDB), 02 Spore (echtes Ed25519/WebCrypto), Werkstatt-Knopf
  (2 grün + 3 netz-bereit). **8/8 grün.**
- **Lokaler 2-Knoten-Handshake (echt):** zwei Browser-Kontexte = Knoten A + B mit je eigener
  Identität. A `generateOwnSpore` (echt signiert) → B `verifyForeignSpore`: akzeptiert die
  echte, **lehnt manipulierte ab**. Beweist die Cross-Knoten-Vertrauensmechanik echt.
- **Live-Endknoten (github.io) bleiben offen:** Netz-Policy gibt 403 „Host not in allowlist".
  Ehrlich in `docs/LIVE-MODELL.md` als offener Pfad dokumentiert (3 Lösungswege für spätere
  Agenten: Policy erweitern / lokal simulieren [gebaut] / Klaus' Browser). **Kein** Zugriff
  auf Klaus' privaten Browser — bewusste Sicherheitsgrenze (Empfangsmodus-Prinzip).
- `node --test` greift `test/*` → Browser-Verify liegt daher in `scripts/` (nicht im test-Glob).
  `npm test` headless weiterhin **29/29 grün**. README/Doc nachgezogen.
- **Manual-Check:** automatischer Browser-Beweis ersetzt einen Teil; Klaus' Tablet-Sicht (Live-
  Knoten, Optik) bleibt der nicht-ersetzbare Rest.

## 2026-05-30 (N) — Werkstatt erweitert: netzgebundene Module ehrlich als „bereit · braucht Netz"

- **`assets/werkstatt.js` v0.2:** generische `probeReady()` + Proben für **03 Embedding,
  05 Anastomose, 06 Heterokaryose**. Ehrlich: offline NICHT als „grün" behauptet — geprüft
  wird nur Bereitschaft (geladen + erwartete API), Status `bereit · braucht Netz`, voller
  Lauf ungeprüft (Browser). `probeAll()` liefert jetzt `{offline:[04,16], netz:[03,05,06]}`.
- **`test/werkstatt.test.js`:** trennt offline-bewiesen von netz-bereit; ein Test sichert,
  dass netz-Module **nicht** grün-gerechnet behauptet werden und fehlende API ok=false ergibt.
  **`npm test` 29/29 grün**.
- **werkzeuge.html:** lädt 01/02/03/05/06 + match/siegel als `<script>` (Reihenfolge: 01
  zuerst). **app.js** rendert zwei Gruppen (Offline grün / Netzgebunden gelb „◐ bereit").
  **style.css** `.probe.ready`/`.probe-group`.
- **README** 29 Prüfungen.
- **Manual-Check:** Werkstatt-Knopf im Browser ungeprüft — wartet auf Klaus.

## 2026-05-30 (M) — Werkstatt: erste echte Browser-Brücke zur Werkzeugkiste

Erster realer Schritt vom Playback Richtung Live-Modell (docs/LIVE-MODELL.md). Ehrlich:
nur was wirklich rechnet, wird grün gemeldet — kein vorgetäuschter Live-Lauf.

- **`assets/werkstatt.js`** (IIFE, `window.SbkimWerkstatt`): lädt die echten Module und
  führt eine NACHVOLLZIEHBARE Selbst-Prüfung aus — **offline**: 04 Match (rechnet:
  identisch=1/quer=0, Schwelle 0.8) + 16 Siegel (Aspekte lesbar, Lese-API da). Module mit
  Netz/DOM werden NICHT als grün behauptet. Fehlt ein Modul → ehrlich ok=false.
- **`test/werkstatt.test.js`**: prüft die Brücke headless (window-Shim) inkl. „fehlendes
  Modul täuscht nicht grün vor". **`npm test` 28/28 grün**.
- **werkzeuge.html:** sichtbare „Werkstatt"-Karte mit Knopf „▶ Werkzeuge prüfen" + Ausgabe;
  lädt `sbkim-match.js`/`sbkim-siegel.js`/`werkstatt.js`. **app.js** `renderWerkstatt()`
  (Schritte grün/rot + Fazit). **style.css** `.werkstatt*/.probe*`.
- **README** 28 Prüfungen.
- **Manual-Check:** Werkstatt-Knopf im Browser ungeprüft — wartet auf Klaus.
- **Nächster Schritt:** netzgebundene Module (03/05/06) als eigene, klar gekennzeichnete
  Proben ergänzen; danach Schritt vom Playback zum echten Live-Lauf.

## 2026-05-30 (L) — a+b+c: 17/18 kopiert · Werkzeuge-Seite erklärt · Live-Modell-Vorbereitung · PR #11 zu

Freibrief. Drei Schritte in einem:

- **(a) 17/18 kopiert:** `sbkim-floating-widget.js` (17), `sbkim-tool-pwa.js` (18) 1:1 aus
  Sage nach `web/tools/`. Werkzeugkiste = **zwölf** echte Module. `TOOL_FILES` + `werkzeugkiste.json`
  nachgezogen; `test/modules.test.js` erweitert → **`npm test` 23/23 grün**.
- **(b) Werkzeuge-Seite:** menschlicher „Worum geht's?"-Erklärblock (`.explain`) oben — SBKIM als
  Partnervermittlung für Apps + Hinweis, dass Module mit Knopf echt/1:1-aus-Sage sind, manche
  netzgebunden. `.explain p`-Stil ergänzt.
- **(c) Live-Modell-Vorbereitung:** `docs/LIVE-MODELL.md` (Spec vor Code) — Werkzeug-Vertrag
  (Quelle = werkzeugkiste.json, Laden über `datei`, ehrliche Verfügbarkeit, Beurteilungs-Kriterium
  via 16 Siegel), Bezug zum Markt-Zertifikat. **Kein** vorgetäuschter Live-Lauf — Playback bleibt
  ehrlich; nächster Bauschritt benannt.
- **PR #11 (Truhe) geschlossen** (Klaus' Ansage) mit Begründung: alter Stand, online-Code-Nachladen,
  von der jetzigen Linie überholt.
- **status.json:** Real-Anteil ~50 %; README/Doku nachgezogen.
- **Manual-Check:** Werkzeuge-Seite (neuer Erklärblock) + Browser-Pfade ungeprüft — wartet auf Klaus.

## 2026-05-30 (K) — Fünf weitere Sage-Module 1:1 kopiert (Werkzeugkiste = zehn Module)

Freibrief für den Bau. Nach 01–05 nun **06 Heterokaryose, 07 Apoptose, 08 UI-Demo,
15 Membran, 16 Siegel** 1:1 aus `Sage-Protokol/src/modules/` nach `web/tools/` kopiert
(unverändert, IIFE auf `window.Sbkim*`).

- **Test:** `test/modules.test.js` erweitert — alle **zehn** Module laden headless + API;
  16 Siegel `getAspects()` offline gelesen. **`npm test` 21/21 grün**.
- **Werkzeugkiste:** `TOOL_FILES` (app.js) um 06/07/08/15/16; `werkzeugkiste.json` mit
  `point_status`/`point_hinweis`/`datei` (ehrliche Netz-/Browser-Hinweise).
- **Schutz-Modul-Pflicht:** Modul 15 (Membran) ist ein Schutz-Modul → `ZERTIFIKAT_ASPEKTE`
  in `sandbox/16_siegel.js` um 15-Eintrag ergänzt.
- **16 Siegel** ist das **Markt-Zertifikat** (Geprüft-Nachweis, Anti-Greenwashing) — Grundlage
  für die geplante Markt-Prüfpflicht.
- **status.json:** Real-Anteil ~45 %; README/Doku nachgezogen.
- **PR #24** (01–05) gemergt. **Offen:** 17/18 (in Sage Schablone), Schutz-Backlog 10/11/12/14.
- **Manual-Check:** Browser-Pfade ungeprüft (03/05/06 netzgebunden) — wartet auf Klaus.

## 2026-05-30 (J) — Fünf echte SBKIM-Module 1:1 aus dem Sage-Protokol kopiert

Klaus' Klarstellung: echte, getestete Sage-Module **direkt 1:1 kopieren** (keine
Abwandlung — sie sind als grün befunden, auch in Kombination). Netzzugriff zu
GitHub/raw ist erreichbar; Quelle ist `Sage-Protokol/src/modules/` auf `main`.

- **Kopiert (unverändert) nach `web/tools/`:** `sbkim-storage.js` (01), `sbkim-spore.js`
  (02), `sbkim-embedding.js` (03), `sbkim-match.js` (04), `sbkim-anastomose.js` (05) —
  Originalheader/IIFE bleiben; registrieren auf `window.Sbkim*`.
- **01/02 ersetzt:** meine früheren Point-Eigenbauten sind durch die echten Sage-Originale
  ersetzt (Klaus' Ansage „Sage-Originale 1:1"). Dadurch konsistenter `SbkimStorage`/
  `SbkimSpore`-Namespace mit 04/05.
- **Test:** alte `storage.test.js`/`spore.test.js` (testeten die alte Eigenbau-API) entfernt;
  neuer `test/modules.test.js` mit **window-Shim** lädt alle fünf + prüft Registrierung;
  **04 Match voll offline bewiesen** (match identisch=1/orthogonal=0, Schwellen 0.80/0.60,
  matchDimensions 3 Schichten). **`npm test` 16/16 grün** (6 Modell + 10 Module).
- **Werkzeugkiste:** `TOOL_FILES` (app.js) um 03/04/05 erweitert; `werkzeugkiste.json`
  01–05 mit `point_status`/`point_hinweis`/`datei` ehrlich nachgezogen (inkl. NETZ-Hinweis
  für 03 Embedding/CDN, 05 HTTP-Handshake, 04 explainMatchLLM/Anthropic).
- **status.json:** Real-Anteil ~35 %; README/Doku nachgezogen.
- **Schutz-Modul-Pflicht:** 01–05 sind keine Schutz-Module (10/11/12/14/15) → kein
  ZERTIFIKAT_ASPEKTE-Eintrag nötig.
- **Manual-Check:** Browser-Pfade von 01/02/03/05 ungeprüft (03/05 brauchen Netz) —
  wartet auf Klaus' Browser-Lauf.
- **Offen:** 06/07/08/15/16 ebenfalls in Sage verfügbar; 03 Embedding-Modell könnte für
  echte Offline-Tauglichkeit lokal vendort werden (derzeit CDN).

## 2026-05-30 (I) — Truhe-Knopf zurückgebaut auf Original (Banner über dem Knopf)

Klaus: die große Truhe-im-Knopf sieht nicht gut aus → **komplett zurück auf das ursprüngliche
Design**. Alle drei Start-Karten wieder gleich: kleiner Banner oben über dem Knopf.

- `index.html`: mittlere Karte ist wieder eine normale `.entry` mit `--art:banner-werkzeuge.png`
  (kein `<img>`, keine `.entry--truhe`). Menschliche Texte bleiben.
- `assets/style.css`: alle `.entry--truhe`/`.truhe-img`-Regeln entfernt (auch in den
  Media-Queries) → exakt das Original-Karten-Verhalten.
- `assets/img/truhe.png` gelöscht (nicht mehr gebraucht).
- `assets/img/README.md`: alle drei Karten-Banner-Prompts vereint (Modell/Werkzeugkiste-Truhe/
  Markt), je **1200×400 Querformat**, gleicher Steampunk-Stil. Werkzeugkiste-Banner zeigt die
  Truhe als Centerpiece. Klaus generiert die drei Banner und schickt sie; dann einsetzen.
- **Manual-Check:** wartet auf Klaus' Browser-Lauf. `npm test` 27/27.

## 2026-05-30 (H) — Truhe-Bild lädt nicht: verkleinert + als echtes <img>

Klaus' Browser-Screenshot (Tablet, GitHub Pages live): mittlerer Knopf zeigte nur den
dunklen Fallback-Glow, **das Truhe-Bild fehlte**. HTML/CSS waren neu (Texte + Kasten da),
nur die Bilddatei lud nicht. Wahrscheinlichste Ursache: **2,3 MB PNG** ist mobil zu schwer.

- `assets/img/truhe.png`: mit Pillow auf **~760px / ~190 KB** verkleinert (Palette-Quantisierung;
  Truhe/Teal-Schlüssel/Gold-Glow sichtbar erhalten). Lädt mobil zuverlässig.
- `index.html`: Truhe-Karte nutzt jetzt ein **echtes `<img class="truhe-img">`** (mit Alt-Text,
  `loading="eager"`) statt CSS-`background` — lädt robuster, kein Stacking-Risiko.
- `assets/style.css`: `.entry--truhe .truhe-img` (object-fit: contain, 230px, Hover 300px);
  Touch/`prefers-reduced-motion` halten 230px. Alte `.entry-art`-Truhe-Regeln ersetzt.
- **Manual-Check:** wartet auf Klaus' nächsten Browser-Lauf (Hard-Reload Strg+Shift+R nötig,
  sonst altes Bild aus dem Cache). `npm test` 27/27.

## 2026-05-30 (G) — Truhe IST der Werkzeugkiste-Knopf + menschliche Karten-Texte

Auf Klaus' Wunsch die Truhe vom Hero **runter an die Stelle des mittleren „Werkzeugkiste"-Knopfs**
gesetzt — sie ist jetzt das Bild dieser Karte (Klick öffnet weiter `werkzeuge.html`, Funktion
unverändert). Hero wieder kompakt (nur Titel/Untertitel). Keine Text-Dopplung (Hero-Caption
„Werkzeug-Truhe — öffnen" entfernt; Karte trägt Titel + Erklärung + „→ öffnen").

- `index.html`: `.truhe-hero` aus dem Hero entfernt; mittlere Karte `.entry--truhe` mit
  `--art:url(truhe.png)`. Alle drei Karten-Erklärungen in **menschlicher Alltagssprache**
  neu (kein Jargon wie „headless/Node/Endknoten"); Ehrlichkeit bleibt (Aufzeichnung statt live,
  Suche kommt später).
- `assets/style.css`: `.truhe-hero/.truhe-cap` raus; `.entry--truhe .entry-art` höher (150px,
  Hover 224px) als Blickfang; `.entries { align-items: start }`; Touch (`hover:none`) +
  `prefers-reduced-motion` halten die Standardgröße (Text drunter lesbar).
- `assets/img/README.md`: Start-Karte 2 nutzt jetzt `truhe.png`; `banner-werkzeuge.png` nur
  noch im Werkzeuge-Seitenkopf.
- **Manual-Check:** ungeprüft, wartet auf Klaus' Browser-Lauf. `npm test` 27/27 (reine Optik).

## 2026-05-30 (F) — Klaus' Werkzeug-Truhe als zentraler Startseiten-Blickfang

Klaus hat ein **echtes Truhe-Bild geliefert** (Truhe mit leuchtendem Teal-Schlüssel im Schloss,
dunkler Kosmos-Grund — passt zur Optik). Eingebaut als zentraler Blickfang in der Startseiten-Mitte:

- `assets/img/truhe.png` (Klaus' Bild, 1401×1123 ~2,3 MB; **kein** Bildwerkzeug im Container →
  unkomprimiert übernommen, ehrlich vermerkt; auf Wunsch später verkleinern).
- `index.html`: im Hero ein **klickbarer** `.truhe-hero`-Block (`<img>` mit Alt-Text) →
  führt zur Werkzeugkiste (`werkzeuge.html`). Caption „Werkzeug-Truhe — öffnen".
- `assets/style.css`: Truhe **handlich** (Standard `min(360px, 78vw)` → Karten/Text drunter
  lesbar, auch mobil); **wächst** beim Hover (`scale 1.12`) mit Teal-Glow, schrumpft zurück.
  `@media (hover: none)` → mobil kein Wachstum (Handy-Lesbarkeit). `prefers-reduced-motion` → ruhig.
- Meine zwischenzeitliche **SVG-Notlösung entfernt** (Klaus: „nicht selbst zeichnen") — es gilt sein PNG.
- `assets/img/README.md`: `truhe.png` als vorhandenes Startseiten-Mittenbild dokumentiert.
- **Manual-Check:** ungeprüft, wartet auf Klaus' Browser-Lauf. `npm test` 27/27 (reine Optik).

## 2026-05-30 (E) — Startseiten-Hero als prominenter Blickfang (Truhe-Bild)

Klaus will ein Truhe-Bild auf der Startseite. Befund: **beide Bild-Slots existierten schon**
(Premium-#10, mit Gradient-Fallback) — `banner-werkzeuge.png` (Werkzeuge-Karte) und `hero.png`
(Startseiten-Hero, per CSS verdrahtet). Der Hero zeigte das Bild aber nur als **dezenten,
stark abgedunkelten Backdrop**. Auf Klaus' Wunsch „groß oben":

- `assets/style.css`: `.hero` höher (`min-height: 248px`), `.hero::before`-Veil von einem
  flachen 0.86-Schleier auf einen **vertikalen Verlauf** umgestellt (oben 0.28 → unten 0.82):
  Bild oben **deutlich sichtbar**, Titel unten lesbar. Titel/Absatz mit dunklem Text-Shadow
  für Kontrast. **Fallback bleibt** (ohne Bild nur Glow). `prefers-reduced-motion` unberührt.
- `assets/img/README.md`: Hinweis, dass der Hero jetzt prominent zeigt und ein Truhe-Motiv passt.
- **Drop-in, kein Code mehr nötig:** Klaus legt `assets/img/hero.png` (Truhe, ~1600×900) und/oder
  `assets/img/banner-werkzeuge.png` (~1200×400) ab → erscheinen automatisch.
- **Hover-Wachstum der Eingangs-Karten:** `.entry-art` (Truhe-/Motiv-Bild) standardmäßig klein
  (Text drunter immer lesbar), **wächst beim Drüberfahren** sanft auf 188px und schrumpft zurück.
  Auf Touch-Geräten (`@media (hover: none)`) bleibt es klein → Handy-Lesbarkeit. `prefers-reduced-motion`:
  kein Wachstum, Standardgröße gehalten.
- **Manual-Check:** ungeprüft, wartet auf Klaus' Browser-Lauf (Startseite mit/ohne hero.png, Hover-Wachstum).
  `npm test` unverändert 27/27 (reine Optik, Logik unberührt).

## 2026-05-30 (D) — Zwei echte Werkzeuge (01 Storage + 02 Spore) sauber auf Premium-main integriert

Diese Sitzung lieferte das **zweite** echte Werkzeug (02 Spore) und integrierte die ganze
Werkzeug-Linie **auf den aktuellen `main`-Stand mit Premium-Optik**. Hintergrund: PR #12
(01 Storage) und der ursprüngliche 02-Branch waren auf einem Stand **vor** der Premium-Optik
(#10) gebaut → echte Konflikte. Statt blindem Merge die Liefer-Mechanik **neu auf die
refaktorierte `renderWerkzeuge` aufgesetzt** (Premium-UI bleibt unangetastet, additiv).

- **02 Spore** — `web/tools/sbkim-spore.js`: eine abhängigkeitsfreie Datei (UMD wie 01).
  Ed25519 über **WebCrypto** (`crypto.subtle`), `nodeId = SHA-256(roher publicKey)` (Hex).
  Privater Schlüssel bleibt im Modul; nur der öffentliche Teil verlässt es (`exportPublic`).
  `sign/verify`, statisches `verify(pub,…)`, `nodeId(pub)`. **Ehrliche Feature-Erkennung**
  `isSupported()` + klare Fehlermeldung statt stillem Bruch (WebCrypto-Anforderung).
- **01 Storage** — `web/tools/sbkim-storage.js` (aus PR #12 übernommen): IndexedDB im Browser,
  In-Memory-Fallback headless.
- **Liefer-Mechanismus** in die **Premium-`app.js`** integriert: `TOOL_FILES` (01+02), Knöpfe
  „⧉ Code kopieren" / „⬇ Datei laden" (offline, nur Repo-Dateien), additiv `point_hinweis`
  gerendert (WebCrypto-Anforderung auf der Seite sichtbar), neuer POINT-Status
  „geliefert · headless getestet ✓". `style.css`: `.actions/.get/.getnote/.pointnote`.
- **Tests:** `test/storage.test.js` (9) + `test/spore.test.js` (10). **`npm test` 27/27 grün**
  (8 Modell + 9 Storage + 10 Spore).
- **Nachgezogen:** `werkzeugkiste.json` (01+02: `point_status`/`point_hinweis`/`datei`),
  `status.json` (Real-Anteil ~24 %), `docs/WERKZEUGE.md`, `README.md` (27 Prüfungen).
- **Schutz-Modul-Pflicht:** 01/02 berühren **kein** Schutz-Modul → kein `ZERTIFIKAT_ASPEKTE`-Eintrag.
- **PRs:** #12 (Storage) ist inhaltlich **in dieser integrierten Linie enthalten**; auf Klaus'
  Ansage „#12 dann #13" werden beide Werkzeuge so nach `main` gebracht. **PR #11 (Truhe) = HOLD**
  (nicht angetastet; kollidiert mit dieser Linie — Merge/Schließen entscheidet Klaus).
- **Manual-Check:** **ungeprüft, wartet auf Klaus' Browser-Lauf** — vier Seiten (Premium),
  Liefer-Knöpfe 01+02, `point_hinweis`-Block, WebCrypto-Pfad (Tablet + Desktop, Strg+Shift+R).
- **Offen für Klaus:** GitHub Pages auf `main` aktivieren; Sage-Quelldateien für echte 1:1-Kopie;
  nächster Werkzeug-Kandidat (19 Andock-Wizard / 09 Einbau-PWA).

## Nachtrag 2026-05-30 — Premium-Optik-Ebene über alle vier Seiten (Freibrief)

Unter ausdrücklichem **Gestaltungs-Freibrief** von Klaus eine kohärente Effekt-Ebene
**additiv** über alle vier Seiten gelegt (auf echtem `main`-Stand gebaut). Eigene
Teal-Identität, **kein Klon** fremder Seiten — nur Techniken übernommen.

**Gebaut (reine Optik/UX, Datenverträge + Modell-Logik unberührt):**
- `assets/style.css`: fixer **Ambient-Hintergrund** (Glow-Blooms + optionale Textur),
  langsame **Aurora**, **Glassmorphism** (Statusleiste/Karten), **Halo** am Hero-Titel,
  wiederverwendbarer **Bild-Banner** (`.page-banner`), Hero als Layered-Komposition,
  Karten-Vorschaubilder, **Scroll-Reveal** + gestaffelte Karten-Einblendung.
- `assets/fx.js` (neu): Scroll-Reveal via IntersectionObserver, zero-dependency,
  auf allen vier Seiten eingebunden; degradiert sauber ohne Observer.
- `index/modell/werkzeuge/markt.html`: Banner, Reveal-Marker, Favicon/Theme-Color,
  `fx.js`-Einbindung.
- **Bild-Plätze** `assets/img/` als **progressive enhancement** — Seite sieht auch
  ohne PNGs fertig aus (Gradient-Fallback, nie ein kaputtes Bild-Icon). Bedarf +
  Generierungs-Prompts in `assets/img/README.md`. **Klaus generiert die PNGs**, sie
  erscheinen dann automatisch.
- **Offline**, keine CDNs; **`prefers-reduced-motion`** stellt alle neuen Bewegungen ruhig.
  `npm test` weiterhin **8/8 grün**.

**Offen / wartet:** (1) Klaus legt die generierten PNGs nach `assets/img/` (Namen siehe
README) — bis dahin Gradient-Fallback. (2) **Browser-Sichttest aller vier Seiten:
ungeprüft, wartet auf Klaus** (nach Pull Hard-Reload Strg+Shift+R). Auf Klaus' Ansage in
diesen PR **ohne weitere Rückfrage gemergt**.

## Nachtrag 2026-05-30 — Kurskorrektur: keine Doppelarbeit, Übergabe per Brief

Eine Sitzung auf `claude/schicht23-polish-sage-S4IOC` bekam einen **veralteten Brief**
(beschrieb die Schicht-2/3-Politur als offen) und hing zudem am alten **Gründungs-Skelett**
statt an `main`. Befund: Die Politur (PR #8 + #9) war **längst in `main`** — `main` ist
Wahrheit (8/8 Tests, `run.json` v0.2, alle Politur vorhanden). Die versehentlich neu gebaute
Politur war **redundant** und hätte beim Merge reale Arbeit gelöscht → **bewusst kein PR
darauf**; der Branch wurde **auf `main` zurückgesetzt** und trägt nur noch den neuen Brief.
**Echte offene Punkte unverändert:** (1) Klaus' Browser-Lauf aller vier Seiten — ungeprüft;
(2) Sage-Quelle unerreichbar (Scope nur `sb-kimtool-point`; „public" genügt nicht) → reifes
Modul noch nicht kopierbar. Beides in `docs/sessions/BRIEF_browserlauf-und-modulquelle.md`
übergeben. **Lehre verankert:** vor jedem Bau `git fetch origin main` und gegen `origin/main`
arbeiten, nicht gegen den vorab gesetzten Branch-Stand.

## Nachtrag 2026-05-30 — Schicht 2/3 auf Modell-Optik-Niveau gehoben (Freibrief)

Unter ausdrücklichem, befristetem **Gestaltungs-Freibrief** von Klaus. Diese Sitzung
hängt auf der Animations-Arbeit aus **PR #8** auf (dort in den Arbeitsbranch gemerged,
damit die neue Optik als Fundament da ist) und baut Schicht 2/3 darauf an.

**Zwei Befunde gleich zu Beginn offengelegt (statt blind zu bauen):**
1. Die Modell-Animation (`assets/model.js`, Rolle Ingenieur, `run.json` v0.2, Test 8/8)
   ist **noch nicht in `main`** — sie lebt im offenen Draft-**PR #8**
   (`claude/agenten-animation-r4i7f`). Dieser Branch wurde daher auf #8 gestapelt.
   **Merge-Reihenfolge: erst #8, dann dieser PR.**
2. Die **Sage-Quelle ist in dieser Umgebung nicht erreichbar** (kein `Sage-Protokol/`,
   Repo-Zugriff auf `sb-kimtool-point` beschränkt, kein Netz zu anderen Repos). Ein
   reifes Modul „Datei für Datei" zu kopieren ist **ehrlich nicht möglich** —
   Modul-Kopie daher **bewusst NICHT gemacht** (kein erfundenes Modul → „kein
   vorgetäuschtes Wissen"). Bleibt offene Aufgabe, sobald die Quelle bereitsteht.

**Gebaut (reine Design-/UX-Gestaltung, Datenverträge unberührt):**
- `assets/style.css`: Schicht 2 (Werkbank) + 3 (Schaufenster) neu — Reife-Spine in
  Lampen-Farben, Mono-Orb mit Modul-Nummer, Status-Chips mit Glow-Punkt, Hover-Lift,
  Stufen-Legende, Reife-Schlüssel; Markt-Karten mit Monogramm, Status-/Echt-Chip,
  Andock-Knopf. **`prefers-reduced-motion`** für die neuen Hover-Effekte respektiert.
- `assets/app.js`: reichere Render-Logik (Reife→Spine/Chip-Mapping, Point-Status-Chip,
  Stufen-Zähler an den Tabs, Stufen-Legende aus den bisher ungezeigten `stufen`-Texten,
  „Nutzen" als Lead + Rest in `<details>`-Aufklapper gegen die Textwand; Markt mit
  Monogramm/Status/Echt-Chip).
- `werkzeuge.html`: Container für Stufen-Legende + Reife-Schlüssel.
- Funktion unberührt: Stufen-Tabs, Kennung-kopieren, Andock-Links, Daten aus denselben
  JSON-Quellen. `run.json` **nicht** angefasst (Demo-Regen zurückgesetzt: nur zufällige
  Schlüssel-Churn).

**Bewusst NICHT angefasst:** `modell.html`/`model.js` (Referenz, unter Review in #8;
Klaus' Browser-Lauf steht noch aus → keine erfundenen „Restpunkte"). `status.json`
real_anteil bleibt ehrlich ~20 % (kein Modul real kopiert).

**Verifiziert:** `npm test` **8/8 grün**; JS-Syntax (`node --check`) ok; Headless-
DOM-Stub-Smoke-Test: 3 Stufen-Tabs mit Zählern, 7 Basic-Kacheln, Stufen-Legende (3),
Markt (3) rendern fehlerfrei. **Browser-Sichttest Schicht 2/3 + Modell-Seite:
ungeprüft, wartet auf Klaus** (Hard-Reload Ctrl+Shift+R nach Pull).

---

## Nachtrag 2026-05-30 — Lebendiges Agenten-Board + Ingenieur-Rolle (Schicht 1)

Die Modell-Seite wurde vom statischen Ticker in eine **animierte Pipeline** verwandelt
und die neue Rolle **Ingenieur** ins Modell aufgenommen (Auftrag:
`docs/sessions/BRIEF_agenten-animation.md`, unter dem befristeten **Gestaltungs-Freibrief**).

**Modell-Logik (Spec vor Code, Vertrag v0.2):**
- Neue Rolle `sandbox/roles/ingenieur.js` — schlägt Objekte vor (Titel · `kind` ·
  Beschreibung), deterministischer Ideen-Pool. Kette jetzt:
  **Ingenieur → Bauer → Gate/Arzt → Beobachter**, Sybil = **Negativbauer** (Angreifer).
- `bauer.js` baut die Ingenieur-Idee (Titel/Art/Beschreibung ins Manifest), rückwärtskompatibel.
- `nodes/sybil.js` schleust **getarnte** Fälschungen ein (lesbare Titel für die Statusleiste).
- `loop.js` schreibt `run.json` **v0.2**: `roles`, `artefacts[]` (kind/title/description/
  status/downloadable), `events[]` mit `phase` (idee/build/sybil/verdict) + `t`, plus `summary`/`edgeCases`.
- `16_siegel.js`: zwei neue `ZERTIFIKAT_ASPEKTE`-Einträge (Modul 10/12) — Sicherheits-Modul-Pflicht.
- Tests: +2 (Ingenieur-Rolle, Vertrag v0.2). **`npm test` 8/8 grün.**

**Seite (voller Umbau, zero-dependency, offline):**
- `modell.html` neu: SVG-Pipeline + HTML-Knoten; `assets/model.js` (eigene Engine);
  `assets/style.css` um Bühne/Glow/Zustände/Karten erweitert. `app.js` entschlackt
  (Modell-Logik raus → eigenes `model.js`).
- Aktiver Agent **leuchtet**; Artefakt wandert als **Lichtpunkt** entlang der Kanten;
  Angriff läuft sichtbar **grün→orange→rot→Apoptose** (Zerfall + Burst-Ring).
- **Klartext-Statusleiste** (Art + Titel) + **Detail-Karte** (kind-Chip, Status-Schiene,
  Export-Knopf lädt Modell-Entwurf als `.md`). Legende + Rollen-Erklärung + Protokoll als Aufklapper.
- Steuerung: Pause/Weiter · Neu starten · Tempo (1×/2×/0.5×) · Bewegung an/aus.
- `prefers-reduced-motion` respektiert (Bewegung startet aus, Animationen unterdrückt).

**Manual-Check:** Mit Playwright (lokaler Server, Chromium) gerendert — **keine Konsolen-/
Seitenfehler**, Status/Detail/aktiver Knoten korrekt, Angriffs-/Apoptose-Frame sichtbar,
Export-Download (`art-1-timer-kachel.md`) und Reduced-Motion-Pfad funktionieren. Das ist
ein Entwickler-Smoke-Test; **Klaus' eigener Browser-Lauf steht aus** (nach Pull
Hard-Reload Ctrl+Shift+R).

**Bewusst entschieden (Freibrief, statt zu blockieren):**
- Ein Ingenieur für beide Sorten (Hintergrund-Tool **und** Standalone-PWA) — nicht gesplittet.
- Export = eine **Markdown-Spezifikation** des Modell-Entwurfs (ehrlich „keine fertige PWA").
- Keine separate Erklär-Seite: Legende + Rollen + „Warum ein Modell?" als Aufklapper **auf**
  `modell.html` (weniger Navigation, alles am Ort des Geschehens). Nav unverändert.
- ASCII-Titel ohne Umlaut-Ersatz im `sandbox/` (Codebase-Stil); „Rate-Limit-Bremse" statt „…-Waechter".

**Freibrief für die Folgesitzung:** Klaus hat den **Gestaltungs-Freibrief ausdrücklich auch
für die nächste Sitzung** erteilt (befristet, gleiche unverhandelbare Leitplanken). Er ist
im neuen Brief `docs/sessions/BRIEF_feinschliff-und-erstes-modul.md` (eigener Abschnitt) verankert.

## Nachtrag 2026-05-30 — Dokumentations- & Lesepflicht (Brief-Kette)

Verbindliche Konvention verankert, damit Folge-Sitzungen den Stand kennen und nicht
blind bauen:
- `CLAUDE.md`: neue Section „Dokumentations- & Lesepflicht (Brief-Kette)" — Pflichtlektüre
  vor Start (CLAUDE → PULS → neuester Brief → status.json → Scheiben-Code), „erst
  Überblick/Plan, dann bauen", und der **Abschluss-Befehl**: jede Sitzung schreibt einen
  neuen Brief.
- `docs/sessions/VORLAGE_BRIEF.md`: Brief-Vorlage (Stand · geplant · bauen/pflegen/testen ·
  Datenverträge · Akzeptanz · Reihenfolge · offene Fragen · Abschluss-Befehl).
- `BRIEF_agenten-animation.md`: um Pflichtlektüre (Anfang) + Abschluss-Befehl (Ende) ergänzt.

## Nachtrag 2026-05-29 — Drei Schichten auf je eine eigene Seite

Auf Klaus' Wunsch die eine gedrängte Seite in **vier Seiten** aufgeteilt:
`index.html` (Startseite mit drei Knöpfen) + `modell.html` / `werkzeuge.html` /
`markt.html`. Gemeinsame Kopf-Navigation (Start · Modell · Werkzeuge · Markt,
aktive Seite hervorgehoben). Ein `assets/app.js` lädt pro Seite nur den passenden
Teil (Element-Erkennung), `assets/style.css` um Nav + Startseiten-Karten erweitert.
Version v0.2. So hat jede Schicht Platz; in `werkzeuge.html` können einzelne Tools
heranwachsen. `npm test` weiterhin 6/6 grün (Modell-Logik unberührt).
**Browser-Lauf der neuen Struktur: ungeprüft, wartet auf Klaus.**

## Nachtrag 2026-05-29 — Erprobte Regeln übernommen

Nach Gründung gezielt geprüft, welche bewährten Regeln aus Sage und den Live-PWAs
zu übernehmen sind (PR #1 war da schon gemerged).

- `CLAUDE.md` erweitert um **erprobte Regeln aus Sage** (PR-Workflow, Ehrlichkeit über
  Zustand, Evolutions-Klausel, Sicherheits-Modul-Pflicht, Kein-PII, Spec-vor-Code,
  PULS-/„Nächste-Schritte"-Pflicht, Einzelschritte-Kommunikation) — Sage-Spezifika
  bewusst ausgelassen.
- `CLAUDE.md` erweitert um **Regeln aus den Live-PWAs** (Mixarium/Rezeptbuch):
  verteilbare Werkzeuge = einzelne `index.html` mit inline-Assets/keine Deps,
  PWA-Grundausstattung, Kopf-Kommentar mit Version (aber kein Klarname → Kein-PII),
  Eruda als Tablet-Debug, Service-Worker → Hard-Reload-Regel.
- **Sicherheits-Modul-Pflicht konkret umgesetzt:** `ZERTIFIKAT_ASPEKTE`-Liste in
  `sandbox/16_siegel.js` (append-only) mit Einträgen für 16/10/12/07/14; neuer Test
  sichert sie ab → **`npm test` 6/6 grün**.

## Was in dieser Sitzung entstand (Gründungs-Skelett)

Das Repo startete leer. Diese erste Scheibe legt das Skelett an und baut die
kleinste echte Scheibe + die statische Drei-Schichten-Seite drumherum.

### Scheibe 1 — headless Modell (Beweis steht)
- `sandbox/` — reiner Node, keine Abhängigkeiten:
  - `00_config.js` (echte Sage-Konstanten + Modell-Vorschlag `REP_DISTRUST_RATIO`)
  - `02_spore.js` (echtes Ed25519/SHA-256 via `node:crypto`)
  - `16_siegel.js` (Tun statt Sein), `10_reputation.js` (Sybil-Abwehr), `07_apoptose.js`
  - Rollen `bauer` / `gate_arzt` / `beobachter`, `nodes/sybil.js`, `loop.js`
- `test/smoke.test.js` — **5/5 grün** (`npm test`). Das ist der Beweis.
- `npm run demo` druckt den Bericht und schreibt `web/data/run.json`.

### Scheibe 2 — statische Seite (drei Schichten)
- `index.html` + `assets/style.css` + `assets/app.js` — dunkle, an Sage angelehnte,
  re-geskinnte Optik mit Lampen-Status-Leiste.
- Schicht 1 spielt `run.json` als Board ab (kein Live-Node).
- Schicht 2 rendert `werkzeugkiste.json` in drei Reitern (Basic/Pro/Profi) mit
  Erklärung + Doppel-Status pro Kachel.
- Schicht 3 rendert `web/data/marktplatz.json` (Saat = echte Live-Endknoten).

### Doku & Ehrlichkeit
- `docs/`: HERKUNFT, IMMUNSCHICHT, BAUTRUPP, WERKZEUGE, STUFEN, MODELL.
- `status.json` — ehrlicher Real-Anteil (~20 %), Seite zeigt aufgezeichneten Lauf.
- `README.md`, `CLAUDE.md`.

## Verifiziert
- `npm test` → 5/5 grün. `npm run demo` → Bericht + `run.json`.
- Sybil-Knoten: Stimmgewicht 0 → Misstrauen über Schwelle → Blocklist → signierte Apoptose.
- Alle JSON-Dateien parsen.

## Bewusst NICHT gemacht (nächste Scheiben)
- Reife Sage-Module tatsächlich kopieren (erst wenn Klaus sie dort weiter reift → Datei für Datei).
- Marktplatz-**Suche** (Daten sind vorbereitet: `marktplatz.json` / `nodes.json`).
- Server-Zeh-Entscheidung (Browser-Transport) — vertagt.
- Weitere Rollen (Linguist/QA, Hindernis-Agent, Späher); echtes Embedding statt Stub; Live-Node im Browser.

## Nächster sinnvoller Schritt
GitHub Pages auf den Branch/`main` zeigen lassen und die Seite live ansehen; danach
das erste reife Sage-Modul (z. B. 09 Einbau-PWA) Datei für Datei herüberholen.
