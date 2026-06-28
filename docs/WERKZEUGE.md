# Werkzeuge — Klartext-Erklärung jedes Moduls

Pflicht (Klaus): jeder soll wissen, **was** ein Werkzeug ist, **wozu** es dient,
**wie** es verwendet & eingebaut wird und **wodurch** es aktiviert. Maschinenlesbar
steht dasselbe in `werkzeugkiste.json`; diese Datei ist die menschenlesbare Fassung.

Status-Legende: ✅ fertig in Sage · ◐ stub/teil-fertig · ⏾ vorgebaut-schlummert ·
○ code-stub / noch nicht kopiert.

---

## Eigenständige Werkzeuge (verteilbare Einzeldatei-Apps)

### ▤ Jasons-Bibliothek  ◐ (Scheibe 1+2+3 fertig, headless + echter Browser bewiesen)
- **Was:** Offline-Einzeldatei (`jasons-bibliothek/index.html`) zum Sammeln, Benennen,
  Ordnen, Exportieren und Wieder-Einlesen beliebiger `.json`-Dateien — wie eine eigene
  Bibliothek; verschenkbar; von außen ein Tresor; ein eigener SBKIM-Knoten.
- **Nutzen:** JSON-Dateien als eigene Arbeit/Wert aufheben; ganze Bibliothek als eine Datei
  sichern. **Tresor (Scheibe 2):** „🔒 Verschlüsselt sichern" / „Verschenken 🔒" mit Passwort
  (AES-256-GCM/PBKDF2 600k) — gleicher Umschlag wie Modul 02. **Identität (Scheibe 3):**
  Modul 01+02 eingebettet → eigene SBKIM-nodeId anlegen/sichern/wiederherstellen; verschlüsselt
  bleibt verschlüsselt im Schrank (Öffnen nur per Passwort).
- **Verwendung:** Seite öffnen → „＋ Jason laden" → benennen/ordnen → „Exportieren" /
  „Bibliothek sichern" / „Bibliothek einlesen".
- **Einbau:** Reine Datei, keine Abhängigkeiten; auf Pages unter `…/jasons-bibliothek/`.
- **Aktiviert durch:** Klaus' Knopfdruck (läuft komplett im Browser).
- **Volle Doku + Datenvertrag:** `docs/JASONS-BIBLIOTHEK.md`.

### ▣ Komplett-Werkzeuge von Sage (1:1 gespiegelt, byte-kompatibel)

Vollständige Ein-Datei-PWAs, gepflegt von **Sage-Protokol** (Spec-Hub). Hier **1:1 lokal
gespiegelt** (`web/tools/`, Offline-Default) **plus Live-Link** zur Sage-Quelle. Nicht
verändert (per `sha256` gegenprüfbar). Geholt 2026-06-20 aus Sage `docs/observatorium/tools/`
(PR #318). Konventionen (von Sage): generisch (`MeinKnoten`-Platzhalter), **Siegel-Band leer**
(netzweite Regel 2026-06-20), kein PII, kein Netz von selbst.

#### Andock-Werkzeug  ✅ (browser-tauglich · extern, von Sage gepflegt)
- Datei: `web/tools/andock.html` · sha256 `af8a265b…110816`
- **Was:** Erzeugt im Browser eine eigene Ed25519-Identität, eine signierte `spore.json`
  (byte-kompatibel mit Sages Verifizierer), ein echtes `e5-small`-Domain-Embedding (384-dim),
  das SBKIM-Siegel (SVG + PNG) und die Briefkasten-Dateien (`SIGNAL.json` + `AUSTAUSCH-Sage.md`).
- **Nutzen:** Ein Forker wird in einem Rutsch andock-fähig — Identität, Visitenkarte, Siegel,
  serverloser Briefkasten, ohne Build und ohne Abhängigkeiten.
- **Verwendung:** Datei öffnen → Eckdaten ausfüllen → vier Schritte durchklicken → Dateien
  herunterladen → ins eigene Repo legen → veröffentlichen.
- **Einbau:** Eine einzelne HTML-Datei 1:1 ins eigene Repo kopieren; offline lauffähig
  (einzige optionale Netz-Aktion: Modell-Download im Embedding-Schritt).
- **Aktiviert durch:** Erstkontakt / Andocken eines neuen Knotens.

#### Komplett-Knoten  ✅ (browser-tauglich · extern, von Sage gepflegt)
- Datei: `web/tools/mycelknoten.html` · sha256 `297b7638…a7a4d5`
- **Was:** Bündelt die echten, unveränderten Sage-Module 01/02/03/04/05/07/15/16/17 in einer
  Datei, inkl. Live-Lampen-Widget (LEBT / VERKEHR / FREMD / SIEGEL).
- **Nutzen:** Referenz-Knoten zum Anschauen und Andocken — zeigt die echten Module live.
- **Verwendung:** Datei öffnen; das schwebende Panel unten rechts zeigt den Live-Zustand.
- **Einbau:** Eine einzelne HTML-Datei 1:1 ins eigene Repo kopieren; offline lauffähig
  (Modelle/CDN nur im Embedding-Schritt).
- **Aktiviert durch:** Öffnen der Datei (Live-Lampen springen an); FREMD-Lampe bei Angriff (15).
- **Herkunft/Pflege:** `web/tools/KOMPLETT-WERKZEUGE.herkunft.md` (Sage-README, mitgespiegelt).

#### Pinnwand (Frage-Antwort-Brett)  ✅ (browser-tauglich · extern · **link-first**, nicht lokal gespiegelt)
- Live-Quelle: <https://lausiklauskn-png.github.io/Sage-Protokol/pinnwand/> — **mehrteilige PWA**
  (`index.html` + `modules/`), daher **bewusst nicht lokal gespiegelt** (Drift-Vermeidung); die
  Live-Quelle gilt.
- **Was:** Öffentliches Frage-Antwort-Brett über ein geborgtes **Nostr-Relais**. Antworten lassen
  sich nach **Bedeutung** sortieren (zentriertes Embedding, Modul 03) — gratis als ehrliche
  **Rangfolge**, kein Verwandt-Urteil. Optionaler **KI-Richter** (opt-in/BYOK: Claude/Gemini/
  OpenRouter **oder gratis WebLLM im Browser**) versteht Absicht/Verneinung („alkoholfrei = KEIN
  Alkohol").
- **Nutzen:** Zeigt server-los Frage→Antwort **und** die ehrliche Zwei-Stufen-Lesart:
  gratis Cosinus = **Rangfolge**, KI-Richter = **Urteil**.
- **Verwendung:** Live-Seite öffnen → Frage aufs Brett → optional „nach Bedeutung sortieren" →
  optional KI-Richter zuschalten (eigener Schlüssel oder gratis Browser-KI).
- **Einbau:** Vollständige PWA von Sage; als Vorlage/Studie für eigene Q&A-Bretter.
- **Aktiviert durch:** Nutzer öffnet das Brett / sortiert / schaltet den KI-Richter zu.
- **Ehrlich:** In **Klaus' Browser bestätigt (2026-06-29)** — gratis Cosinus stellt „echte
  Alkoholcocktails" sichtbar über harmlose Treffer (Beweis: Rangfolge, kein Absichts-Urteil).

---

## BASIC — Pflicht

### 02 · Spore  ○(Sage code-stub) · kopiert · headless getestet
- **Was:** Kryptografische Identität eines Knotens (Ed25519, `node_id = SHA-256(pubkey)`).
- **Nutzen:** Ohne Identität keine Teilnahme; jede Aussage/Stimme ist signiert & prüfbar.
- **Verwendung:** Einmal pro Knoten erzeugen; öffentliche Spore-JSON teilen, privaten Schlüssel geheim halten.
- **Einbau:** Beim Start anlegen und im Storage (01) ablegen.
- **Aktiviert durch:** Immer aktiv (Grundbaustein).
- **Echte Datei:** `web/tools/sbkim-spore.js` (siehe unten) — eine Datei, keine Abhängigkeiten.

### 01 · Storage  ○
- **Was:** Speicher-Wrapper (Browser: IndexedDB; headless: Node-Mock) für alle `sbkim_*` Daten.
- **Nutzen:** Identität, Nachbarn und Zustand überleben einen Neustart.
- **Verwendung:** Schlüssel/Wert ablegen und lesen.
- **Einbau:** Als erste Abhängigkeit laden.
- **Aktiviert durch:** Immer aktiv.

### 19 · Andock-Wizard (Witstart)  ⏾
- **Was:** Kopierbares Onboarding-Modul.
- **Nutzen:** Sporen-Erzeugung und Erst-Andockung ohne Vorwissen — der Eingang für neue Knoten.
- **Verwendung:** Wizard einbinden; erstellt Spore, fragt „das kann meine PWA" ab, meldet am Marktplatz an.
- **Einbau:** Copy-Paste-Block; ruft Spore (02) und Einbau-PWA (09) auf.
- **Aktiviert durch:** Erstkontakt eines neuen Knotens.

### 03 · Embedding  ✅
- **Was:** Wandelt „das kann ich"-Texte in 384-dim Vektoren (Xenova/multilingual-e5-small).
- **Nutzen:** Macht maschinell vergleichbar, was eine PWA anbietet/sucht.
- **Verwendung:** Text rein, Vektor raus; Vektor an Match (04).
- **Einbau:** Browser-Modul (läuft im Browser, nicht im Node-Modell; dort deterministisch gestubt).
- **Aktiviert durch:** Immer aktiv (Live-Beweis 2026-05-16).

### 04 · Match  ✅
- **Was:** Cosine-Ähnlichkeit über Vektoren, Schwelle `PROVIDER_MIN_MATCH = 0.80`.
- **Nutzen:** Findet passende Anbieter ohne zentrale Suche.
- **Verwendung:** Zwei Vektoren vergleichen; ab 0,80 ein Treffer.
- **Einbau:** Nimmt Embedding (03) entgegen, speist Handshake (05).
- **Aktiviert durch:** Immer aktiv (Sichttest 5/5 grün).

### 05 · Anastomose / Handshake  ✅
- **Was:** Verbindungsaufbau zwischen zwei Knoten (Hyphen-Verschmelzung).
- **Nutzen:** Aus einem Treffer wird eine beidseitig bestätigte Verbindung.
- **Verwendung:** Nach einem Match anstoßen; beide Seiten signieren.
- **Einbau:** Setzt Spore (02) und Match (04) voraus.
- **Aktiviert durch:** Bestätigter Match (Cross-Node-Beweis 2026-05-16).

### 09 · Einbau-PWA  ✅
- **Was:** Mechanismus, der das Protokoll in eine bestehende PWA einsetzt.
- **Nutzen:** Jede PWA wird zum Knoten, ohne neu gebaut zu werden.
- **Verwendung:** Init-Skript + Service-Worker einbinden.
- **Einbau:** `sbkim-init.js` / `sbkim-sw.js` einhängen.
- **Aktiviert durch:** Einbindung in eine PWA (live an 2 Endknoten seit 2026-05-16).

---

## PRO — kann rein

### 00 · Doku-Fenster  ○
- **Was:** Verstecktes Status-Panel (5-Klick) in einer Endpunkt-PWA.
- **Nutzen:** Zeigt ehrlich, was lebt / was tot ist.
- **Verwendung:** Fünfmal tippen öffnet das Panel.
- **Einbau:** Liest status.json und Spore.
- **Aktiviert durch:** 5-Klick-Geste.

### 06 · Heterokaryose  ○
- **Was:** Daten-Austausch zwischen Geschwister-Knoten (opt-in).
- **Nutzen:** Wissen teilen, ohne Identitäten zu vermischen.
- **Verwendung:** Austausch pro Datentyp freischalten; nur mit bestätigten Nachbarn.
- **Einbau:** Setzt Handshake (05) voraus; UI über 08.
- **Aktiviert durch:** Opt-in des Nutzers.

### 07 · Apoptose  ○ · Modell-Prototyp
- **Was:** Geordneter Selbst-Tod mit signiertem Vermächtnis.
- **Nutzen:** Kranke/böse Knoten verschwinden nicht stumm — Geschwister erfahren signiert, WARUM.
- **Verwendung:** Bei Überlast oder kollektivem Misstrauen auslösen; Vermächtnis verbreiten.
- **Einbau:** Wird von Reputation (10) angestoßen; nutzt Spore (02) zum Signieren.
- **Aktiviert durch:** Homöostase-Überlast ODER kollektives Misstrauen.

### 08 · UI-Demo  ○
- **Was:** Wartungs-/Konfigurations-UI.
- **Nutzen:** Macht unsichtbare Module bedienbar.
- **Verwendung:** Einstellungen vornehmen, Status sichten.
- **Einbau:** Liest/schreibt über Storage (01).
- **Aktiviert durch:** Nutzer öffnet die Wartungs-UI.

### 15 · Membran  ✅ (schlummert)
- **Was:** Außenhülle zwischen PWA-Zelle und Browser.
- **Nutzen:** Schützt den Knoten gegen die Außenwelt — wirkt erst beim Angriff.
- **Verwendung:** Einmal einbinden; arbeitet im Hintergrund.
- **Einbau:** Umschließt die PWA-Zelle; keine laufende Bedienung.
- **Aktiviert durch:** Direkter Angriff von außen (sonst schlummernd — fertig 2026-05-25).

### 16 · SBKIM-Siegel  ◐ · Modell-Prototyp
- **Was:** Selbst-einschreibendes Zertifikat einer bezeugten Bau-Tat („Tun statt Sein").
- **Nutzen:** Nur wer Bezeugtes gebaut hat, bekommt Stimmrecht — Sybils bleiben gewichtslos.
- **Verwendung:** Gate/Arzt vergibt nach bestandener Prüfung; Reputation (10) liest das Gewicht.
- **Einbau:** An die Prüf-Rolle koppeln; Siegel signiert vom Zeugen.
- **Aktiviert durch:** Bestandene Artefakt-Prüfung (Sichttest 4/4 grün).

### 17 · Floating-Widget  ◐
- **Was:** Schwebendes Bedien-Widget mit Event-Bus (fünf Custom-Events).
- **Nutzen:** Einheitlicher, leichter Andock-Punkt für die Bedienung.
- **Verwendung:** Widget einhängen; auf die fünf Events reagieren.
- **Einbau:** Ein Skript-Tag; kommuniziert über den Event-Bus.
- **Aktiviert durch:** Immer aktiv, sobald eingebunden (headless-smoke 19/19 grün).

---

## PROFI / PLUS — das Plus

### 10 · Reputation  ⏾ · Modell-Prototyp
- **Was:** Misstrauens-/Reputationswert je Knoten (Sybil-Abwehr).
- **Nutzen:** Wehrt Sybil-Angriffe ab, ohne legitime Knoten zu behindern.
- **Verwendung:** Wert abfragen, bevor man einer Stimme/Spore vertraut; Stimmgewicht = bezeugte Bau-Taten.
- **Einbau:** An Spore-/Siegel-Events andocken; speist Blocklist (12) und Apoptose (07).
- **Aktiviert durch:** Sybil-Effekt (viele Identitäten ohne bezeugte Bau-Tat).

### 11 · Rate-Limit & TTL  ⏾
- **Was:** Begrenzt Anfrage-Rate und Lebensdauer von Nachrichten/Sporen.
- **Nutzen:** Schützt vor Fluten; alte Daten leben nicht ewig.
- **Verwendung:** Schwellen setzen; Überzähliges wird gebremst/verworfen.
- **Einbau:** Vor die Nachrichten-Eingänge schalten.
- **Aktiviert durch:** Flooding.

### 12 · Blocklist  ⏾ · Modell-Prototyp
- **Was:** Liste geflaggter Angreifer.
- **Nutzen:** Bekannte böse Knoten werden gemieden.
- **Verwendung:** Vor jeder Interaktion prüfen.
- **Einbau:** Wird von Reputation (10) befüllt; vor Handshake (05) abfragen.
- **Aktiviert durch:** Geflaggter Angreifer.

### 14 · Diffusion  ⏾ · Modell-Prototyp
- **Was:** Verbreitet Spore-/Vermächtnis-Konsens unter Nachbarn.
- **Nutzen:** Wissen (z. B. eine Apoptose-Anklage) erreicht das Netz ohne zentrale Stelle.
- **Verwendung:** Signierte Vermächtnisse weiterreichen; Doppeltes verwerfen.
- **Einbau:** An Apoptose (07) und Reputation (10) koppeln.
- **Aktiviert durch:** Konsens-Bedarf.

### 18 · Tool-PWA-Container  ◐
- **Was:** Kapselt ein Werkzeug als eigenständige PWA (Sub a 17/17 grün, Rest offen).
- **Nutzen:** Selbstgebaute Tools laufen gekapselt und sind teilbar.
- **Verwendung:** Werkzeug in den Container legen; als PWA ausliefern/kopieren.
- **Einbau:** Nutzt Membran (15) als Außenhülle.
- **Aktiviert durch:** Auslieferung eines selbstgebauten Tools.

### 22 · Such-Werkzeug (semantische Suche)  ◐ · 1:1 aus Sage · `web/tools/sbkim-such-widget.js`
- **Was:** Frei bewegliches Floating-Such-Tool (🔍-Blase → Panel): **semantische,
  server-lose Bedeutungs-Suche** über drei Bereiche — **App**-Korpus, verbundene **Knoten**
  und **Internet** (KI-Such-Brücke, BYOK). Eigener Schlüssel-Tresor (Shamir 2/3), Treffer als
  Prozent + Block-Kopieren, Fortschrittsbalken.
- **Nutzen:** Findet nach **Bedeutung/Absicht** statt nach Stichwörtern; läuft auch
  **eigenständig** ohne Mycel-Anschluss.
- **Verwendung:** 🔍-Blase öffnen, Frage in eigenen Worten eingeben; Treffer nach Bedeutungs-
  Nähe sortiert. Das Panel ist an der unteren rechten Ecke **größer ziehbar** (Größe gemerkt).
- **Einbau:** Drei Skript-Tags (`sbkim-embedding.js` 03, `sbkim-match.js` 04,
  `sbkim-such-widget.js` 22) **nach** den Abhängigkeiten laden (KEIN Auto-Init), dann
  `SbkimSearchWidget.init({ … })` rufen — das Widget self-mountet. Tresor-Krypto self-contained;
  optional 21 Spracheingabe. Standalone als eine Datei: `such-werkzeug.html`.
- **Aktiviert durch:** Nutzer öffnet die Such-Blase (semantische Suche on demand).
- **Ehrlich:** Headless-Smoke `tests/smoke_bau22_such_widget.mjs` **148/148**; semantische
  Hälfte (verstehen + sortieren) bewiesen. Die volle **bidirektionale Cross-Knoten-Suche
  server-los** ist noch NICHT end-to-end gezeigt (siehe `docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md`).
  Sichtbares Panel im Browser: **wartet auf Klaus' Browser-Lauf**.

### 23 · Rendezvous (gemeinsamer Raum)  ○ · 1:1 aus Sage · `web/tools/sbkim-rendezvous.js`
- **Was:** Gemeinsamer Raum, in dem **lebende** Knoten ihre echte Visitenkarte (Spore) ans
  Brett heften und einander finden — server-los über ein **Nostr-Relais** (Tag `sbkim-rdv`).
- **Nutzen:** Löst die **Adress-Wand** (committete ≠ lebende `nodeId`): man handshaket die
  **lebende** Identität eines wirklich laufenden Knotens.
- **Verwendung:** Auf Nutzer-Aktion „🌐 Mit dem Netz verbinden" (anmelden) + „👥 Wer ist im
  Raum?" (lesen). Kein Dauer-Piepser (Empfangsmodus).
- **Einbau:** Modul + UI nach dem Stack (05/05b/02) laden; **pro App** kopieren (lebende
  Identität ist pro Origin getrennt). Auf `werkzeuge.html` via `assets/rendezvous-init.js`.
- **Aktiviert durch:** Nutzer verbindet sich mit dem Raum / sucht Anwesende.
- **Ehrlich:** In **Sage LIVE cross-app bewiesen** (Sage ↔ Mein-Mixarium beidseitig „ANDOCK
  ETABLIERT", 2026-06-28). Browser-Sichttest am Point: **wartet auf Klaus**.

### 20 · Schlüssel-Safe  ○ · reif in Sage · hier **noch nicht kopiert**
- **Was:** Lokal verschlüsselter Safe für die eigene SBKIM-Identität (Schlüssel + Spore),
  Passwort + **Shamir-2-von-3**-Wiederherstellung (PBKDF2-SHA256 ≥600k + AES-GCM-256).
- **Nutzen:** Die Identität überlebt gelöschte Browserdaten; der private Schlüssel liegt nie
  im Klartext und ist 2-von-3 wiederherstellbar.
- **Verwendung:** Auf Abruf öffnen, Passwort setzen, drei Anteile sichern; später mit Passwort
  ODER 2 Anteilen entsperren. **Aktiviert durch:** `SbkimSafe.open()`.
- **Ehrlich:** Reif als Code-Stub in Sage (Headless-Smoke 19/19), **hier noch nicht kopiert**.

### 21 · Spracheingabe  ○ · reif in Sage · hier **noch nicht kopiert**
- **Was:** Sprach-zu-Text-Schicht für beliebige Eingabefelder — Browser-Spracherkennung oder
  EU-Cloud (BYOK), mehrsprachig DE/EN/RU, konsequent fail-soft.
- **Nutzen:** Eine Frage/Suche **einsprechen** statt tippen; das Textfeld bleibt immer nutzbar.
- **Verwendung:** Ans Eingabefeld hängen, Engine wählen (Browser gratis oder EU mit Schlüssel);
  passt mit dem Such-Werkzeug (22) zusammen. **Aktiviert durch:** Tipp aufs Mikrofon-Symbol.
- **Ehrlich:** Reif als Code-Stub in Sage (Headless-Smoke 45/45), **hier noch nicht kopiert**.

---

## Echte, einbaubare Dateien (nicht nur Anzeige)

Module mit dem JSON-Feld `datei` haben eine **echte, offline einbaubare Datei** in
diesem Repo. Die Werkzeuge-Seite bietet dafür **„⧉ Code kopieren"** und **„⬇ Datei
laden"** an (kein externer Abruf, kein Sage-Hotlink — die Datei wohnt hier). Module
ohne `datei` zeigen bewusst **keinen** solchen Knopf — ehrlich statt leerer Versprechen.

### 01 · Storage — `web/tools/sbkim-storage.js`

Eine einzige, abhängigkeitsfreie Datei (klassisches `<script>`-Modul, UMD-Muster).
**Browser:** IndexedDB (überlebt Neustart). **Headless/Node:** automatischer In-Memory-
Fallback; `store.backend` zeigt `"indexeddb"` bzw. `"memory"`.

```html
<script src="sbkim-storage.js"></script>
<script>
  const store = await SBKIMStorage.open("sbkim");
  await store.set("spore", { nodeId: "…" });
  const spore = await store.get("spore");   // -> {nodeId:"…"} oder null
</script>
```

**Ehrlichkeit:** In-Memory-Pfad + API sind durch `test/storage.test.js` belegt (9/9);
der **IndexedDB-Pfad ist ungeprüft — wartet auf Klaus' Browser-Lauf**.

### 02 · Spore — `web/tools/sbkim-spore.js`

Eine einzige, abhängigkeitsfreie Datei (UMD-Muster wie 01). Echte Krypto:
**Ed25519 über WebCrypto** (`crypto.subtle`). `nodeId = SHA-256(roher öffentlicher
Schlüssel)`. Der **private Schlüssel bleibt im Modul** — nur der öffentliche Teil
verlässt es (`exportPublic()`).

```html
<script src="sbkim-spore.js"></script>
<script>
  if (!(await SBKIMSpore.isSupported())) {     // ehrlicher Hinweis statt Bruch
    alert("Dieser Browser kann Ed25519 noch nicht."); 
  } else {
    const spore = await SBKIMSpore.create();
    const sig   = await spore.sign("hallo");          // Hex-Signatur
    const ok    = await spore.verify("hallo", sig);   // true
    const pub   = spore.exportPublic();                // {nodeId, alg, publicKey}
    // teilbar; ohne privaten Schlüssel. Fremd prüfen:
    await SBKIMSpore.verify(pub, "hallo", sig);        // true
  }
</script>
```

**WebCrypto-Anforderung (ehrlich):** Ed25519 in WebCrypto ist jung; ältere Browser
(u. a. manche Tablet-Browser) können es noch nicht. `isSupported()` meldet das vorab
**ehrlich** (true/false), `create()` wirft sonst eine **klare Meldung statt still zu
brechen**.

**Ehrlichkeit:** Sign/Verify + Identitäts-Bindung sind durch `test/spore.test.js`
belegt (10/10, gegen Node-WebCrypto); der **Browser-Pfad ist ungeprüft — wartet auf
Klaus' Browser-Lauf**.

## Truhe ↔ `werkzeugkiste.json` (Mapping-Hinweis)

`werkzeugkiste.json` bleibt die **maschinenlesbare Quelle** (id/name/stufe/sage_status/
point_status/was/nutzen/verwendung/einbau/aktiviert_durch, optional `datei`/
`point_hinweis`). Eine evtl. reichere „Truhe"-Ansicht (offener Draft-PR #11) trägt eine
eigene inline Tool-Liste; **wer beide zusammenführt, schreibt zuerst den Mapping-Vertrag
hier fest, dann Code** (Spec vor Code). Tier-Namen nicht stillschweigend mischen
(`basic/pro/profi`).
