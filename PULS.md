# PULS — Übergabeprotokoll

Stand: 2026-05-31 · Branch `claude/sage-andock-continue-SI1Lu`

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
