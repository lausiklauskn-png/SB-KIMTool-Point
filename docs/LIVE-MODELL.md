# Vom Playback zum Live-Modell — Vorbereitung (Spec vor Code)

> Ehrlich vorweg: Heute **zeigt** die Modell-Seite einen **aufgezeichneten** Lauf
> (`web/data/run.json`). Sie führt das Modell **nicht** live im Browser aus. Dieses
> Dokument ist die **Vorbereitung** (Vertrag/Plan), damit eine spätere Sitzung das
> Live-Modell baut — es wird hier **nichts** vorgetäuscht und **nichts** still
> vorgebaut. Der Beweis bleibt `npm test`.

## Ziel

Ein Agentennetzwerk, das SBKIM **selbst baut, testet und verfeinert**, indem die
Rollen (Ingenieur · Bauer · Gate/Arzt · Beobachter) sich aus der **Werkzeugkiste**
(`web/tools/`) die Bausteine nehmen, die sie gerade brauchen — und am Ende beurteilen,
welches Modul die höchste Chance hat, im echten Leben zu funktionieren.

## Was schon real ist (Bausteine)

Zwölf echte SBKIM-Module liegen 1:1 aus dem Sage-Protokoll in `web/tools/` und sind
in `werkzeugkiste.json` registriert (Feld `datei`). Sie laden headless (Beweis:
`test/modules.test.js`) und registrieren ihre API auf `window.Sbkim*`.

| Was eine Rolle braucht | Werkzeug | offline? |
|---|---|---|
| Identität geben/prüfen | 02 Spore | Browser-API |
| Zustand merken | 01 Storage | Browser-API |
| Bedeutung von Text erfassen | 03 Embedding | Netz (Modell/CDN) |
| Passung messen | **04 Match** | **offline** |
| Verbindung aufbauen | 05 Anastomose | Netz |
| Wissen teilen | 06 Heterokaryose | Netz |
| Kranke Knoten beenden | 07 Apoptose | Browser-API |
| Schutzhülle | 15 Membran | Browser-API |
| Geprüft-Nachweis | **16 Siegel** | offline (Lesen) |
| Bedienoberfläche | 08 UI-Demo · 17 Widget · 18 Tool-PWA | Browser |

## Werkzeug-Vertrag (verbindlich, bevor Live-Code entsteht)

1. **Quelle der Wahrheit ist `werkzeugkiste.json`.** Ein Werkzeug gilt als
   „verfügbar für Agenten", wenn es das Feld `datei` trägt und unter `web/tools/`
   liegt. Live-Code zieht die Liste aus dieser Datei — keine zweite Tool-Liste.
2. **Laden über die echte Datei.** Eine Rolle „nimmt" ein Werkzeug, indem sie die
   `datei` als `<script>` lädt; das Modul registriert sich auf `window.Sbkim*`.
   Genau dieser Pfad ist headless durch `test/modules.test.js` bewiesen.
3. **Ehrliche Verfügbarkeit.** Module mit Netz-Bedarf (03/05/06, optional 04-LLM)
   sind im Live-Modell als „braucht Netz" zu kennzeichnen; ohne Netz nutzt eine
   Rolle nur die offline-Werkzeuge (mindestens 04 Match + 16 Siegel-Lesen).
4. **Beurteilungs-Kriterium der Agenten.** „Höchste Chance im echten Leben" =
   (a) offline lauffähig, (b) keine personenbezogenen Daten, (c) besteht den
   Selbst-Prüf-Pfad von 16 Siegel (Anti-Greenwashing), (d) `npm test` grün.
   Dieses Kriterium ist die Grundlage des späteren Markt-Zertifikats.

## Bezug zum Markt (Schicht 3)

Apps, die sich am Markt anmelden, müssen geprüft sein. **16 Siegel** ist das
technische Mittel: selbst-einschreibendes Zertifikat, das nur entsteht, wenn die
Selbstprüfung erfüllt ist. Das Live-Modell ist der Ort, an dem diese Prüfung
durch die Gate/Arzt-Rolle stattfindet, bevor ein Eintrag im Markt sichtbar wird.

## Echter Browser-Beweis (neu) — `npm run verify`

Seit 2026-05-30 gibt es einen **echten Browser-Lauf** (Playwright/Chromium,
`scripts/browser-verify.mjs`): Er lädt die Werkzeuge-Seite in einem echten Browser
und prüft die Pfade, die headless nicht beweisbar sind:

- **01 Storage** — echtes IndexedDB `put`/`get` ✅
- **02 Spore** — echte Ed25519-Identität über WebCrypto ✅
- **Werkstatt** — Knopf rendert 2 grüne (offline) + 3 gelbe (netz-bereit) Proben ✅

Damit ist ein Teil von „wartet auf Klaus' Browser-Lauf" durch einen **automatischen
Beweis** ersetzt. `npm test` (headless, window-Shim) bleibt der schnelle Logik-Beweis;
`npm run verify` ist der Browser-Beweis. Beide grün.

## Live-Verbindung zu echten Endknoten — offener Pfad (für Agenten-Lösungen)

**Status (2026-05-30): nicht möglich in dieser Umgebung.** Die echten Endknoten-
Sporen (`https://lausiklauskn-png.github.io/Mein-Rezeptbuch|Mein-Mixarium|Sage-Protokol/
sbkim/spore.json`) antworten aus dem Container mit **403 „Host not in allowlist"** —
die Netz-Policy lässt nur GitHub/raw zu, nicht die `github.io`-Live-Seiten.

Ein **echter** Cross-Knoten-Handshake (05 Anastomose / 06 Heterokaryose) zwischen
laufenden Knoten ist daher hier **nicht** herstellbar. Bewusst **offen gelassen**,
damit eine spätere Sitzung / ein Agent eine Lösung findet, z. B.:

1. **Netz-Policy erweitern** — `github.io` (bzw. die drei Endknoten-Origins) in die
   Allowlist der Umgebung aufnehmen; dann kann `npm run verify` einen echten
   Spore-Abruf + Handshake gegen die Live-Knoten zeigen.
2. **Lokaler 2-Knoten-Handshake** — **gebaut** (`npm run verify`): zwei echte
   Browser-Kontexte (Knoten A + B), jeder mit eigener Ed25519-Identität. A erzeugt
   per `generateOwnSpore` eine **echt signierte** öffentliche Spore; B prüft sie per
   `verifyForeignSpore` → akzeptiert die echte, **lehnt eine manipulierte ab**
   (kein Greenwashing). Echte Krypto, Endknoten lokal — beweist die Vertrauens-
   Mechanik, nicht die Live-Knoten.
3. **Klaus' Browser** — der Mensch-Knoten: auf dem Tablet sind die Live-Seiten
   erreichbar; ein Sichttest dort zeigt den echten Cross-Knoten-Pfad. (SBKIM ist
   ausdrücklich Mensch+Agent — dieser Pfad ist kein Notbehelf, sondern vorgesehen.)

> Wichtig (Empfangsmodus-Prinzip, aus Sage): das Mycel ist **Empfangsmodus mit
> Antwortrecht** — kein Crawler, keine Eigenanfragen ins offene Netz. Ein Agent darf
> NICHT ungefragt in fremde Browser oder Knoten greifen. Verbindungen entstehen
> beidseitig-bestätigt (Anastomose) oder per Opt-in (Heterokaryose).

## Was als Nächstes zu bauen ist (für die Folge-Sitzung)

- Eine kleine Browser-Brücke `web/tools/` ↔ Modell-Seite, die ein Werkzeug auf
  Knopfdruck wirklich lädt und seine Selbst-Prüfung (16 Siegel) sichtbar macht —
  zuerst offline mit 04 Match + 16 Siegel, dann netzgebundene Module.
- Erst danach den Schritt vom Playback zum echten Live-Lauf (Server-/Transport-
  Entscheidung steht in `status.json` bewusst noch offen).

**Menschliche Sprache zuerst:** Damit Mensch und Agent gemeinsam bauen und Fehler
finden können, beschreiben Module und Modell ihre Schritte in klarer Alltagssprache;
Fachbegriffe ergänzen, ersetzen sie nicht.
