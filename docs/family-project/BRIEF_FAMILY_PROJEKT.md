# Übergabe-Brief — Family Projekt (neue Seite, neues Repo)

> Stand 2026-06-27. Geschrieben für die **Folge-Sitzung**, die im **neuen Repo
> `family-project`** baut. Diese Sitzung konnte das Repo nicht selbst anlegen
> (GitHub-Integration 403) und kein Repo nachladen (kein `add_repo`-Werkzeug) —
> daher Übergabe. Alles hier ist mit **Klaus abgestimmt**. Freibrief gilt
> (selbstständig bauen/mergen wenn logisch+getestet; im echten Zweifel fragen).

---

## 0. Das Allerwichtigste in 5 Sätzen

Wir bauen **„Family Projekt"** — eine **neue, öffentliche Website** auf Klaus'
**eigenem Hetzner-Server** (Domains `family-projekt.de` + `.com`), die seine
Werkzeuge/Apps bündelt und ein freies Netzwerk + einen Marktplatz bietet.
**Klaus' bestehende App-Repos werden NICHT umgebaut** — sie werden nur verlinkt.
Die Optik ist mit Klaus **abgenommen** (Mockup `mockup-startseite-v3.html`):
holografische Schrift, Glas-Karten mit umlaufendem Leucht-Rand, **echter
three.js-„Mycel"-Hintergrund** (aus der Sage-Einladung), 3 Themen
(Dunkel/Neon/Hell), Mikrofon in jedem Textfeld, Deutsch/Englisch.
Die Bezahl-/Einreich-Mechanik wird **vorbereitet, nicht final gebaut**.

---

## 1. Hosting & Infrastruktur (mit Klaus bestätigt)

- **Server:** Hetzner **CX23** (`ubuntu-4gb-fsn1-1`, Falkenstein), IPv4
  `167.233.204.72`, Projekt `family-projekt`. ~6,53 €/Monat (inkl. 1 IPv4).
- **Domains:** `family-projekt.de` **und** `.com` (beide gesichert, DNS bei INWX).
- **Relay läuft schon** auf demselben Server: `wss://relay.family-projekt.de`
  (nostr-rs-relay hinter **Caddy**, Docker, log-frei). Smoke 58/58.
- **Hosting-Entscheid:** Die Website läuft auf **diesem Server**, **NICHT** auf
  GitHub Pages — weil Einreich-Formular + Bezahlung einen kleinen
  Hintergrund-Dienst brauchen, den GitHub Pages nicht kann.
- **Deploy-Weg (Vorschlag):** die schon laufende **Caddy** bedient die Website
  gleich mit (ein zusätzlicher Site-Block + `git pull` in ein Verzeichnis).
  Konkrete Caddy-Konfig + Schritt-für-Schritt-Anleitung ins Repo legen; das
  Aufspielen macht die Sitzung **gemeinsam mit Klaus** (er hat Termux + Hetzner).
- Klaus arbeitet am **Galaxy Tab S6** (Termux: `git pull`,
  `python3 -m http.server` für lokalen Sichttest; Chrome zum Ansehen). **Keine
  Terminal-Kommandos als Bedien-Fluss** — Sichttest über lokalen Server genügt.

## 2. Repo

- Neues Repo **`family-project`** (Name Nebensache, da nicht öffentlich sichtbar —
  sichtbar ist nur die Domain; jederzeit umbenennbar). Privat anlegen.
- **Diese Sitzung konnte es nicht anlegen** — Klaus legt es an, Folge-Sitzung
  baut darin.

## 3. Marke & Icon (abgenommen)

- Name überall **„Family Projekt"** (mit **k**, deutsch) — passend zur Domain,
  **konsequent** (wie Klaus es beim „Mycel" gelernt hat). Mischsprache
  (engl. „Family" + dt. „Projekt") ist **gewollt und gut**, nicht ändern.
- **Name wird NICHT übersetzt** — bleibt auf der englischen Version gleich.
- **Schriftzug:** holografisch fließend (NICHT der bunte Spektral-Regenbogen —
  Klaus: „zu 2010/zu bunt"). Siehe `.holo` im Mockup.
- **Icon/Logo:** holografische Kachel mit **drei verbundenen Knoten** (Dach/
  Familie + Netzwerk). Liegt als Inline-SVG im Mockup (Header + Favicon).

## 4. Seiten-Struktur — Start + DREI Räume

**Ton (verbindlich):** sachlich, erwachsen, **wenig Analogie** auf Start /
Werkzeuge / Marktplatz. **Ausnahme (Klaus 2026-06-27):** im **Netzwerk-Raum**
darf die **Mycel-Analogie ausdrücklich bleiben** — das ist die Protokoll-/Profi-
Ebene.

### Startseite
- **Bild des Tages** (Doodle-Platz, holografischer Rahmen) — Klaus setzt täglich
  ein Bild ein (wechselbar über kleine Konfig-Datei, kein Code).
- **Weekly Discovery** (englischer Name bestätigt) — ein **Stöber-Knopf**
  („Noch eine entdecken / Discover another") zeigt **zufällig** eine App mit
  Mini-Vorschau. **Fair:** automatisch + zufällig, damit auch kleine/neue Apps
  drankommen. **Regeln:** (a) **kein Such-Bonus** — Featuring gibt nur
  Sichtbarkeit, ändert NIE die Such-Reihenfolge; (b) **nur Einträge MIT Bild**
  erscheinen hier (kein Bild → nächster ist dran). Optional später ein
  kosmetisches Abzeichen „war Weekly Discovery" (kein Such-Effekt).
- **Suche** mit **Mikrofon** (siehe §6) + die **drei Raum-Karten**.

### Raum 1 — Netzwerk (gratis, Schicht 1, Mycel-Analogie erlaubt)
- Ehrliches **dreistufiges, prüfbares Versprechen**: (1) Daten bleiben **in
  deinem Gerät** (local-first); (2) Netz-Inhalte Ende-zu-Ende verschlüsselt,
  Treffpunkt sieht nur Geheimtext; (3) Relay protokoll-frei + **nachprüfbar**
  (offene Konfig; für IP-Anonymität Tor). „Aus *vertrau mir* wird *prüf mich*."
- **„server-los" ehrlich einordnen:** stimmt für App-Daten; für Netz-Botschaften
  trifft „herren-los" (es gibt einen Treffpunkt, aber keinen Vermittler).
  Wortlaut-Quelle: `Sage-Protokol/docs/discovery/notiz-toolpoint-relay.md`
  („Die zwei Versprechen" + „Das dreistufige, prüfbare Versprechen").
- **Andock-Werkzeug** (Modul 19) eingebettet: erzeugt **Spore-Vorlage** +
  status.json-Zeile + PR-Link (reine Eingabe→Text, kein Krypto/Netz). Plus
  **Spore-Download** + Einbau in die eigene PWA.
- **Profi-Link** zur **Sage-Einladung / Sage-Protokoll** (dort ist das Mycel voll
  dokumentiert).
- **Vision (Klaus):** „sag *Verbindung herstellen* → Spore-Handshake →
  Gegenseite quittiert automatisch über das Relay zurück". **EHRLICHER STAND:**
  Spore-Erzeugung + lokale Krypto + Relay-Transport **funktionieren**; der
  **vollautomatische Rück-Handshake über das Relay ist NOCH NICHT end-to-end
  bewiesen** (heute ein manueller Eintrags-/Bestätigungs-Schritt). Das ist der
  **nächste echte Bau-Schritt** — auf der Seite ehrlich als **„in Vorbereitung"**
  kennzeichnen, NICHT vortäuschen. (Deckt sich mit Sage CLAUDE.md
  ⭐-Meilenstein: bidirektionale Cross-Knoten-Suche noch nicht end-to-end.)

### Raum 2 — Werkzeuge = KLAUS' EIGENE Werkzeuge
**(Klaus-Klarstellung 2026-06-27, wichtig — vorher verwechselt!)**
- Hier stehen **Klaus' eigene** Werkzeuge zum **Ansehen, Herunterladen und
  Bauen** — NICHT fremde Einreichungen.
- **Pro Werkzeug eine eigene Landing-/Verkaufsseite** (Vorlage abgenommen:
  `mockup-werkzeug-landingpage.html`): Held + 2 Knöpfe (Öffnen · Installieren) +
  **Screenshot-Galerie** (mehrere Bilder, ＋ hinzufügen / × entfernen) +
  Vorteils-Kacheln + „Was es kostet" (kostenlos + Spenden-Platzhalter) +
  Vertrauens-Punkte + Zurück-Link.
- Inhalte: **Such-Werkzeug** (installierbare PWA, liegt in
  `Sage-Protokol/such-tool/` + Kopie in `SB-KIMTool-Point/such-tool/`),
  **Andock-Werkzeug** + **Knoten-Werkzeug** (`Sage-Protokol/docs/observatorium/
  tools/andock.html` + `mycelknoten.html`), die Bausteine (Module 00–22).

### Raum 3 — Marktplatz = FREMDE Einträge (kommerziell, vorbereiten)
- **Andere** tragen ihre eigene PWA/Seite ein — **nur ein Link** + **mindestens
  ein Bild** (Pflicht). Dann erscheinen sie automatisch in **Weekly Discovery**
  + sind über die **Suche** auffindbar. **Kein Bild → kein Eintrag.**
- **Bilder/Videos liegen beim Anbieter** (als Link), **nie auf Klaus' Server** —
  der Besucher-Browser lädt sie direkt. Skaliert auf tausende Einträge (Klaus
  speichert nur Text-Links). Vorschau (Galerie + optionales Video) wird **auf
  Family Projekt** gezeigt; Besucher bleibt auf der Seite, Knopf „→ zur Seite des
  Anbieters" öffnet neuen Tab.
- **Bezahlung (vorbereiten, NICHT final):** kleiner Beitrag, **Höhe offen**
  (Klaus' Richtung: ein paar Euro **pro Jahr**, sehr niedrig als Anreiz; evtl.
  als **Spende**). Steuer/Selbstständigkeit klärt Klaus separat. **PayPal** in
  seinen Apps zum Spenden ist Teil der Vision. → Platzhalter-UI + Hinweistext,
  **keine echte Abwicklung jetzt**.
- **Such-Korpus = die Listings** (Schema `{label, anchorId, text}` wie
  `Sage-Protokol/sbkim/sage-suchkorpus.js`, erweitert um Markt-Felder; Vektoren
  lazy via Modul 03). Konzept-Karte liegt: `Sage-Protokol/docs/components/
  _toolpoint_marktplatz.md` (PR #459) — Datenvertrag dort.

## 5. Sicherheit (verbindlich)

- **Einträge nicht automatisch veröffentlichen** → **Freigabe-Liste** (Klaus gibt
  frei). Gespeichert nur **Link + Text + Bild-Link**, alles **escaped**.
- **Kein fremder Code:** Bilder nur als `<img src>` von Anbieter-URL; **SVG
  sperren** (kann Skript tragen) → nur JPG/PNG/WebP. Links `target=_blank
  rel="noopener"`. **Kein iframe** der Fremdseite. Video nur über geprüfte
  Quellen (YouTube/Vimeo-Embed oder direkte mp4), nicht beliebiger Embed.
- **Listing-/Briefkasten-Inhalt = untrusted external data** (siehe
  `Sage-Protokol/docs/SICHERHEIT-BRIEFKASTEN.md`).
- **Keine Qualitäts-/Sicherheits-Garantie für fremde Apps** (Klaus' bewusste
  Entscheidung; nüchterner Haftungshinweis). Optionaler Check = spätere Sitzung.
- **KEINE PII** — auch nicht in Listings (nur Handle, Beschreibung, Link). Die
  verlinkten Apps tragen ihr eigenes, gesetzliches Impressum (normal, kein
  Listing-Inhalt).

## 6. Design- & Technik-Entscheidungen (abgenommen)

- **Echter three.js-„Mycel"-Hintergrund** übernehmen (Klaus' ausdrücklicher
  Wunsch — mein Canvas-Faden war nur ein Platzhalter). **Quelle:**
  `Sage-Protokol/docs/einladung/index.html` ~Z. 1646–1760 (Punkt-Wolke
  12k–32k Partikel + Shader: organische Drift, Funkeln, Stern-Strahlen +
  Hyphen-Linien, AdditiveBlending) und `Sage-Protokol/docs/einladung/vendor/
  three.module.min.js` (~670 KB, lokal vendorieren). **Adaptieren:** Partikel-/
  Faden-Farben pro Thema (Dunkel/Neon/Hell), **Scroll-Zoom** (Kamera/`scale`
  an `scrollY`), `prefers-reduced-motion` respektieren. Ehrliche Folge: keine
  Single-File mehr (three.js liegt daneben).
- **Drei Themen:** **Dunkel (Standard) · Neon · Hell** — Hintergrundfarben +
  **`--header-bg`** + Holo-Paletten passen sich an. **Hell: Kopf hell halten**
  (Bug-Lehre: Kopf war dunkel geblieben → dunkle Schrift unlesbar; mit
  `--header-bg` gelöst).
- **Holo-Schrift** für die Marke (fließend), **kein** bunter Spektral.
- **Leucht-Rand läuft UM die ganze Karte** (Radius), nicht nur Strich oben —
  Technik: Gradient-Border via Mask-Trick (`-webkit-mask … composite:exclude`),
  rotierend (`@property --rot`). Siehe `.glass::before` im Mockup.
- **Mikrofon in JEDEM Textfeld** (Klaus: „überall, wo Text geschrieben werden
  kann"). Web Speech live in Chrome, **alle Sprachen**; Bedien-Sprache DE/EN ist
  **getrennt** von der Sprach-Eingabe. Das volle Such-Werkzeug bietet zusätzlich
  eine EU-Sprach-Engine (Modul 21). **Kein Erklär-Text unter dem Suchfeld**
  (Klaus: zu viel) — nur der Mikrofon-Knopf.
- **Karten nicht zu hoch** (Platz für spätere Bilder lassen).
- **Wechselbare Inhalte über kleine Konfig-Dateien** (Thema, Tagesbild, Weekly
  Discovery, Listings) → Klaus ändert sie selbst, ohne Code. Später ein
  **verstecktes Admin-Panel** (mit dem Bezahl-/Einreich-Dienst).

## 6b. Family Projekt ist SELBST ein Mycel-Knoten (Klaus 2026-06-27, wichtig)

Die Seite soll von Anfang an **ans Mycel angebunden** sein — sie ist ein
eigener SBKIM-Knoten, nicht nur eine Schauseite.

- **Eigene Identität:** eigene Ed25519-**Spore**; **andockt** an Sage-Protokol +
  SB-KIMTool-Point (+ weitere Knoten). Module **1:1 aus Sage kopieren**
  (kopieren, nicht klonen).
- **Im Kopf (oben) schon eingebaut:**
  - **Modul 17 Floating-Widget** — Vier-Slot-Live-Status **LEBT / VERKEHR /
    FREMD / SIEGEL**.
  - **Modul 16 Siegel** — Siegel-Badge sichtbar (Vertrauens-Signal, Bronze→Gold
    bei echtem Handshake).
  - **Modul 15 Membran** — Lampen + **Fremdzugriff-Erkennung** (FREMD).
  - **Reihenfolge-Lehre (Sage CLAUDE.md Modul 17):** `SbkimWidget.init()` MUSS
    **vor** `SbkimMembrane.init()` / `SbkimSiegel.init()` laufen.
- **Nur diese Status-/Schutz-Module** + die für Identität/Handshake nötigen
  Basis-Module (01/02/03/04/05/09). **Nicht jedes fertige Tool** einbauen
  (Klaus: „brauchen wir nicht").
- **Briefkasten (mailbox) — Sonderregel:**
  - **Öffentlich VERSTECKT.** Der Briefkasten darf auf der **öffentlichen** Seite
    **nicht** sichtbar/lesbar sein (Klaus will nicht, dass Fremde ihn lesen).
  - **Entwicklungsphase (vor Internet-Freigabe): sichtbar FÜR KLAUS** — als
    Test-Kanal, um die **Verbindung zu prüfen** (Handshake/Sync mit Sage,
    SB-KIMTool-Point, weiteren Knoten). Das ist heute der Weg, die Andock-
    Verbindung real zu testen (solange der Auto-Handshake übers Relay noch
    „in Vorbereitung" ist).
  - **Umsetzung:** über einen **Dev-Schalter** (z. B. `localStorage fp_dev=1`
    oder `?dev` in der URL) — Briefkasten-Knopf nur sichtbar, wenn Dev-Modus an.
    **Vor dem öffentlichen Launch ausschalten** (Default aus). Im Brief/PULS
    festhalten, damit es vor Launch nicht vergessen wird.
- **Ton:** Lampen/Siegel/Widget sind kleine Kopf-Statuselemente (wie in
  Mein-Rezeptbuch/Mein-Mixarium) — kein Analogie-Text, passt zur sachlichen Seite.

## 7. Mockups (in diesem Ordner, abgenommen)

- `mockup-startseite-v3.html` — **Startseite, von Klaus „ganz okay"**. Enthält
  alle Stil-Tokens, Themen-Logik, Holo, Glas-Karten-Rand, Mikrofon (Canvas-
  Hintergrund = Platzhalter, im echten Bau durch three.js ersetzen).
- `mockup-werkzeug-landingpage.html` — **Werkzeug-Landingpage, abgenommen**
  (Galerie + Spenden-Platzhalter + Zurück-Link). Schriftzug dort noch „Project"
  (vor der k-Festlegung) → im Bau auf **„Family Projekt"** ziehen.

## 8. Bau-Reihenfolge für die Folge-Sitzung (Vorschlag)

1. **Repo-Grundgerüst** + `vendor/three.module.min.js` (+ggf. GSAP) aus Sage
   kopieren; gemeinsame `assets/style.css` + `assets/app.js` aus Mockup v3.
   **Mycel-Module 1:1 aus Sage kopieren** (15 Membran, 16 Siegel, 17 Floating-
   Widget + Basis 01/02/03/04/05/09) → eigene Spore erzeugen + Andock vorbereiten
   (§6b).
2. **Startseite** mit **echtem three.js-Mycel-Hintergrund** (themed, Scroll-Zoom)
   + **Kopf-Status: Floating-Widget (LEBT/VERKEHR/FREMD/SIEGEL) + Siegel-Badge +
   Lampen** (§6b; `SbkimWidget.init()` vor 15/16). **Briefkasten nur im Dev-Modus.**
   → Klaus' Browser-Sichttest (Termux/lokal) inkl. **Verbindungs-Test** (Handshake
   mit Sage / SB-KIMTool-Point über den Dev-Briefkasten).
3. **Werkzeug-Seiten** (eine Landingpage je eigenem Werkzeug) auf Vorlage.
4. **Netzwerk-Raum** (Versprechen + Andock-Werkzeug + Profi-Link; Auto-Handshake
   „in Vorbereitung").
5. **Marktplatz** (Listings=Such-Korpus + Wort-Suche + Weekly-Discovery-Quelle +
   Platzhalter „Tool anbieten" inkl. Bild-Pflicht + Haftungshinweis).
6. **Such-Discovery** verdrahten (Modul 22 über Listing-Korpus).
7. **Deploy-Doku** (Caddy-Block + git pull) ins Repo; mit Klaus aufspielen.
8. **Später, eigene Sitzungen:** Auto-Handshake übers Relay · Einreich-Dienst +
   Freigabe · Bezahlung/PayPal · Bild-Generator-Helfer · Qualitäts-Check.

## 9. Welche Repos die neue Sitzung im Zugriff braucht

- **`family-project`** (bauen) · **`Sage-Protokol`** (three.js-Quelle, Module,
  such-tool, Relay-Notiz, Konzept-Karte) · **`SB-KIMTool-Point`** (dieser Brief +
  Mockups; Listing-Schema; Andock-Wizard-Kopie) · die **App-Repos**
  (Mein-Rezeptbuch, Mein-Mixarium, BookLedgerPro, Mein-Tresor, Jasons-Tresor)
  für die Listings. **Mein-WorkFloh NICHT listen** (privat, echte Firmendaten).

## 10. Offene PRs dieser Sitzung (einordnen)

- **SB-KIMTool-Point PR #86** („Toolpoint v0.3, drei Räume") — **veraltete
  Basis** (zweigte vom alten Session-Start-Stand ab; echter `origin/main` ist
  weiter) **und durch Family Projekt überholt**. **Empfehlung: schließen**
  (nicht mergen). Brauchbare Teile (such-tool-Kopie, Andock-Wizard-Kopie,
  markt-listings-Schema, Marktplatz-Konzept) sind in Family Projekt aufgehoben.
- **Sage-Protokol PR #459** („Konzept-Karte Toolpoint-Marktplatz") — additive
  Doku, weiter gültig (Datenvertrag für die Listings). **Mergen oder lassen.**
- **Sage-Protokol PR (Branch `claude/toolpoint-marktplatz-konzept`)** = #459.

## 11. Pflichtlektüre für die Folge-Sitzung

1. Dieser Brief.
2. `mockup-startseite-v3.html` + `mockup-werkzeug-landingpage.html` (Optik steht).
3. `Sage-Protokol/docs/einladung/index.html` ~Z. 1646–1760 (three.js-Hintergrund)
   + `…/vendor/three.module.min.js`.
4. `Sage-Protokol/docs/discovery/notiz-toolpoint-relay.md` (Versprechen-Wortlaut).
5. `Sage-Protokol/docs/components/_toolpoint_marktplatz.md` (Listing-Datenvertrag).
6. `Sage-Protokol/src/modules/19_andock_wizard.js`, `22_such_widget.md`,
   `_standalone_such_tool.md`.
7. Für die Knoten-Anbindung (§6b): `Sage-Protokol/src/modules/15_membran.js`,
   `16_siegel.js`, `17_floating_widget.js` + deren Karten in `docs/components/`
   (Reihenfolge 17 vor 15/16); `docs/INTERFACES.md` §11.6 (Briefkasten/Netz-Sync)
   und `SB-KIMTool-Point` (gelebtes Briefkasten-/Siegel-/Lampen-Muster im Kopf).

**Abschluss-Befehl der Folge-Sitzung:** PULS/Brief fortschreiben, neuen Brief
für die nächste Sitzung anlegen — die Kette reißt nie ab.
