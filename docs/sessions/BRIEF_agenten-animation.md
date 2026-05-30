# BRIEF — Lebendiges Agenten-Board + Ingenieur-Rolle + Gestaltungs-Freibrief (Schicht 1 „Modell")

Stand: 2026-05-30 · für eine **Nachfolgesitzung** · Branch-Vorschlag `claude/agenten-animation`

> **Was diese Sitzung tun soll, in einem Satz:** Die Modell-Seite (`modell.html`) von
> einem statischen Ticker in eine **lebendige, sofort verständliche, herausragend
> gestaltete Animation** verwandeln, in der man sieht, wie Agenten Ideen liefern, bauen,
> prüfen, angreifen und sterben — und dafür eine **neue Rolle „Ingenieur"** ins Modell aufnehmen.

---

## Gestaltungs-Freibrief — volle Freiheit (von Klaus, 2026-05-30)

Diese Sitzung hat **volle gestalterische Freiheit** und darf **ohne Nachfrage** entscheiden,
solange die unten genannten Leitplanken (Teil 0) gewahrt bleiben:

- **Keine Erlaubnis-Fragen zur Gestaltung.** Design, Layout, Farben, Bewegung, Effekte
  entscheidet die Sitzung selbst. (Die „Plan-an-Klaus-zeigen"-Pflicht aus `CLAUDE.md`
  entfällt **für reine Design-/UX-Entscheidungen** — sie gilt weiter für **Datenverträge,
  Modell-Logik und Sicherheits-Module**.)
- **Mutig gestalten erlaubt und erwünscht:** bewegte Elemente, Effekte, Hologramm-/Glow-/
  3D-/Partikel-Optik — gern auf dem Niveau ausgezeichneter, moderner Seiten. Nicht sparen.
- **Voller Umbau erlaubt.** Die Seite darf vollständig neu gestaltet werden; wir sind am
  Anfang, das ist bewusst leicht änderbar. Auch die anderen Seiten dürfen mitziehen, wenn
  es das Gesamtbild stärkt.
- **Iterieren bis selbst zufrieden.** Die Sitzung arbeitet so lange an der Seite, bis sie
  mit dem Ergebnis selbst zufrieden ist — kein vorzeitiges „reicht erstmal".
- **Unter-Agenten erlaubt.** Die Sitzung darf Agenten für Teilaufgaben einsetzen (Design,
  Bau, Recherche von Effekt-Mustern, Prüfung) und deren Ergebnisse zusammenführen.

**Unverhandelbar (auch im Freibrief):** Funktion bleibt erhalten oder wird besser; es bleibt
ein **ehrliches Modell/Playback** (kein Live-Bau); **`npm test` grün**; **keine
personenbezogenen Daten**; **Offline-Tauglichkeit** (Libs lokal vendorn, kein CDN-Zwang);
**Merge entscheidet Klaus**. `prefers-reduced-motion` bleibt respektiert.

---

## Pflichtlektüre vor Start (vor allem anderen) — erst lesen, planen, dann bauen

Siehe `CLAUDE.md` → „Dokumentations- & Lesepflicht". In dieser Reihenfolge lesen,
**bevor** Code geschrieben wird:
1. `CLAUDE.md` · 2. `PULS.md` · 3. **dieser Brief** · 4. `status.json` ·
5. `docs/BAUTRUPP.md` + `docs/MODELL.md` + der Code in `sandbox/` und `assets/app.js`.

**Nicht sofort bauen:** erst Gesamtüberblick (Code lesen + Plan). Offene PRs vorher sichten.
Für **Datenverträge/Modell-Logik/Sicherheit** den Plan kurz an Klaus zeigen; für **reine
Design-/UX-Gestaltung** gilt der Gestaltungs-Freibrief — **ohne Rückfrage** loslegen.

---

## 0. Leitplanken (gelten unverändert, siehe `CLAUDE.md`)

- **Es bleibt ein Modell / ein Playback.** Die Seite **spielt** einen aufgezeichneten,
  headless Node-Lauf ab; sie baut **nichts live** und automatisiert keine PWA-Produktion.
  Der Beweis bleibt `npm test`. Ehrlich beschriften.
- **Echte PWAs entstehen später separat.** Die im Modell gezeigten „Tools/PWAs" sind
  Modell-Objekte. Reift eine Idee, wird sie **in einem eigenen Repo** echt gebaut — hier
  nur als **Download/Export** des Modell-Entwurfs anbieten (siehe Teil D). Kein
  Auto-Bau im Hintergrund.
- **Spec vor Code:** Erst den Datenvertrag `run.json` (Teil C) festziehen, dann animieren.
- **Offline zuerst:** **kein CDN-Zwang** — bevorzugt reines SVG/Canvas/CSS/WebGL ohne
  Abhängigkeit; eine Lib nur, wenn sie klar hebt, dann **lokal vendorn** (offline- und
  kopier-tauglich bleibt Pflicht). Eruda nur optional zum Debuggen.
- **Eigene Identität:** Inspiration von modernen Agenten-Visualisierungen erlaubt, aber
  **nicht 1:1 klonen** — Teal-Akzent und Sage-angelehnte, neutrale Optik beibehalten.
- **Sicherheits-Modul berührt?** (Sybil/Apoptose/Reputation/Blocklist) → `ZERTIFIKAT_ASPEKTE`
  in `sandbox/16_siegel.js` ans Listenende ergänzen.

---

## 1. Neue Rolle: der **Ingenieur** (Ideen-Geber)

Bisher: Bauer → Gate/Arzt → Beobachter, plus Sybil als Angreifer. **Neu davor:** der
**Ingenieur**, der die Ideen für die zu bauenden Objekte liefert.

- Datei: `sandbox/roles/ingenieur.js`, Doku-Ergänzung in `docs/BAUTRUPP.md`.
- Der Ingenieur **schlägt Objekte vor**, die für SBKIM interessant sind — vor allem
  **Tools für Anwender**. Zwei Sorten, klar unterscheidbar:
  1. **Hintergrund-Tool** (`kind: "hintergrund-tool"`) — läuft unsichtbar im Protokoll
     (z. B. Rate-Limit, Diffusion).
  2. **Standalone-PWA** (`kind: "standalone-pwa"`) — eigenständig nutzbar, **auch in
     andere PWAs einbettbar** (z. B. ein Mini-Werkzeug fürs Rezeptbuch).
  (Weitere mögliche `kind`: `"webseite"`, `"tool"`.)
- Jeder Vorschlag trägt **Titel + Kurzbeschreibung** („um was handelt es sich").
- Der Bauer baut **anschließend** das, was der Ingenieur entworfen hat → die Kette wird:
  **Ingenieur (Idee) → Bauer (baut) → Gate/Arzt (prüft/repariert) → Beobachter (protokolliert)**,
  mit **Negativbauer/Sybil** als Gegenspieler, der Fälschungen einschleust, damit man sieht,
  **wie robust** ein Objekt ist.
- „Negativbauer" = die bisherige Sybil-Rolle, in der Anzeige als **Gegenspieler/Angreifer**
  benennen (er baut bewusst Schlechtes/Gefälschtes, um die Prüfung zu testen).

---

## 2. Das optische Element (Herzstück) — `modell.html`

Ersetzt das jetzige statische Board + Text-Ticker. Ziel: **Ein neuer Besucher begreift
auf Anhieb, was passiert.** Nicht sparen an Design.

### 2.1 Aufbau
- **Pipeline/Flow-Graph** der Rollen als Knoten in einer Reihe (oder leicht versetzt):
  `Ingenieur ▸ Bauer ▸ Gate/Arzt ▸ Beobachter`, der **Negativbauer** seitlich/unten
  als andockender Angreifer.
- **Animierte Verbindungen:** zwischen den Knoten fließt ein sichtbares „Paket"
  (das aktuelle Artefakt) entlang der Linie — pulsierende/leuchtende Kante, kleiner
  wandernder Punkt/Partikel. So sieht man die **Bewegung** des Artefakts durch die Kette.

### 2.2 Zustände & Farben (das muss man „sehen")
- **Aktiv:** der gerade arbeitende Agent **blinkt/leuchtet auf** (Glow/Puls), die anderen ruhen gedämpft.
- **Sybil-/Angriffs-Aktion:** der Angreifer-Knoten durchläuft sichtbar
  **grün → orange → rot**:
  - **grün** = startet/versucht,
  - **orange** = unter Verdacht / wird geprüft,
  - **rot** = **ausgeschaltet** (geflaggt → **Apoptose**), Knoten „stirbt" sichtbar
    (z. B. zerfällt/verblasst, Kreuz, Ring kollabiert).
- **Gutes Artefakt:** Gate/Arzt stempelt sichtbar **„WIRD GETESTET"** + Siegel-Funken am Bauer.
- **Reparatur:** kurzes „Naht/Patch"-Signal am Gate/Arzt (semantischer Fehler, kein Betrug).

### 2.3 Live-Leiste (was passiert gerade?)
Statt nüchternem Log eine **gut lesbare Status-Leiste**, die in Klartext sagt, **was**
gerade gebaut/geprüft wird, inkl. **Art** des Objekts:
> „Bauer baut **Standalone-PWA** ‚Timer-Kachel' — wird vom Arzt getestet …"
> „Negativbauer schleust gefälschte Signatur ein → **geflaggt** → Apoptose."

### 2.4 Detail-Karte unterhalb der Animation
Unter der Animation eine **Karte zum aktuell aktiven Objekt**: Titel, `kind`
(Hintergrund-Tool / Standalone-PWA / …), **etwas genauere Beschreibung** „um was es sich
handelt", aktueller Status (Entwurf → gebaut → geprüft → graduiert / verworfen) und —
falls graduiert — ein **Download/Export-Knopf** (Teil D).

### 2.5 Design-Inspiration (Muster, **nicht** 1:1 kopieren) — siehe Gestaltungs-Freibrief
Moderne, ausgezeichnete Agenten-/Pipeline-Visualisierungen als Vorbild, ins eigene Thema
übersetzt. Mutig sein ist ausdrücklich erlaubt (Freibrief):
- Knoten-Graph mit **pulsierenden Kanten** und wandernden Daten-Partikeln (Flow).
- **Glow/Neon-, Hologramm-, 3D-/Tiefen-Effekte** auf dunklem Grund (unser Teal),
  Status-Farbverläufe; gern lebendig und auffällig.
- Mikro-Animationen bei Zustandswechsel (Aufleuchten, Kollaps bei Apoptose).
- Atmosphärischer Hintergrund (Partikel/Gitter/Tiefe), der das Geschehen rahmt, nicht erschlägt.
- Technik frei wählbar: **CSS, SVG, Canvas, WebGL** — bevorzugt ohne Abhängigkeit; eine Lib
  nur, wenn sie das Ergebnis klar hebt, dann **lokal vendorn** (kein CDN, Offline bleibt).
Bleibt zugänglich auf Klaus' Tablet (Performance im Blick; `prefers-reduced-motion`
respektieren — Ruhe-/Abschalt-Variante anbieten).

---

## 3. Datenvertrag `web/data/run.json` (Spec **vor** Code)

Das Modell (`sandbox/`) muss die nötigen Felder **liefern**; die Seite **erfindet nichts**.
Erst dieses Schema festschreiben, `sandbox/loop.js` + `ingenieur.js` anpassen, dann
`npm run demo` neu erzeugen, `npm test` grün halten (+ neue Tests).

Vorschlag (erweitert das bestehende Schema, bricht es nicht):

```jsonc
{
  "protocolVersion": "0.2",
  "roles": ["ingenieur", "bauer", "gate_arzt", "beobachter", "negativbauer"],
  "artefacts": [
    {
      "id": "art-1",
      "kind": "standalone-pwa",          // hintergrund-tool | standalone-pwa | webseite | tool
      "title": "Timer-Kachel",
      "description": "Kleiner Countdown, auch in andere PWAs einbettbar.",
      "proposedBy": "ingenieur",
      "builtBy": "bauer",
      "status": "graduiert",              // entwurf | gebaut | geprueft | graduiert | verworfen
      "downloadable": true                // nur bei graduiert; Modell-Entwurf, kein Live-Bau
    }
  ],
  "events": [
    { "phase": "idee",    "engineer": "ingenieur", "artefactId": "art-1",
      "kind": "standalone-pwa", "title": "Timer-Kachel",
      "description": "…", "t": 0 },
    { "phase": "build",   "builder": "bauer", "artefactId": "art-1",
      "verdict": "taugt", "repaired": false, "t": 1 },
    { "phase": "sybil",   "node": "…", "artefactId": "art-x",
      "verdict": "verwerfen", "reason": "Signatur gefälscht", "t": 2 },
    { "phase": "verdict", "node": "…", "votingWeight": 0, "distrust": 3,
      "flagged": true, "t": 3 }   // flagged → Apoptose-Animation (grün→orange→rot)
  ],
  "summary": { "graduated": 9, "sybilNodes": 2, "sybilFlagged": 2, "blocklist": ["…"] },
  "edgeCases": [ { "kind": "repariert-dann-tauglich", "artefactId": "art-1", "note": "…" } ]
}
```

Die Seite liest nur dieses JSON; alle Texte (Titel/Beschreibung/`kind`) kommen aus dem
Modell-Lauf, nicht aus dem HTML.

---

## 4. Mehr als eine Seite, falls nötig

Reicht `modell.html` nicht, **Erklär-Seite(n)** ergänzen und in die Kopf-Navigation
aufnehmen (z. B. `modell-erklaert.html`):
- **Was ist das hier?** — die Rollen in Ruhe erklärt (Ingenieur/Bauer/Arzt/Beobachter/
  Negativbauer), je mit Icon + zwei Sätzen.
- **Legende der Animation** — was Blinken, grün/orange/rot, Apoptose, „WIRD GETESTET" bedeuten.
- **Warum ein Modell?** — Ehrlichkeit: Playback, kein Live-Bau; echte PWAs entstehen separat.

---

## 5. Download/Export der Modell-Objekte (Teil D)

- Graduierte Artefakte (`downloadable: true`) bekommen unter der Detail-Karte einen
  **Export-Knopf**: lädt eine **kleine Beschreibung/Spezifikation** des Modell-Entwurfs
  herunter (JSON oder Mini-`README`), **keine fertige PWA**.
- Klartext dazusetzen: „Modell-Entwurf — echte Umsetzung erfolgt in einem eigenen Repo."

---

## 6. Akzeptanzkriterien (Erfolgsmerkmale)

1. `sandbox/roles/ingenieur.js` existiert; `run.json` enthält `idee`-Events + `artefacts`
   mit `kind`/`title`/`description`. `npm run demo` erzeugt es; **`npm test` grün**
   (inkl. Tests für die neue Rolle und das erweiterte Schema).
2. `modell.html` zeigt die animierte Kette **Ingenieur → Bauer → Arzt → Beobachter**
   plus Negativbauer; aktiver Agent leuchtet; Angriff läuft sichtbar **grün→orange→rot**
   bis zur Apoptose.
3. Status-Leiste nennt in Klartext **Art + Titel** des aktuellen Objekts; Detail-Karte
   beschreibt es genauer; `prefers-reduced-motion` wird respektiert.
4. Optik ansprechend, zero-dependency, eigene Identität (nicht 1:1 geklont).
5. Doku nachgezogen (`BAUTRUPP.md`, `MODELL.md`, `README`, `PULS.md`, `status.json`).
6. Ehrliche Schließung: **„ungeprüft, wartet auf Klaus' Browser-Lauf"** bis Klaus es ansieht.

---

## 7. Empfohlene Reihenfolge (Einzelschritte)

1. Datenvertrag `run.json` festschreiben (dieser Brief, Teil 3) — Doku zuerst.
2. `sandbox/roles/ingenieur.js` + `loop.js` erweitern, `npm run demo`, `npm test` grün.
3. Animation in `modell.html` (SVG/Canvas + CSS), datengetrieben aus `run.json`.
4. Detail-Karte + Status-Leiste + Export-Knopf.
5. Falls nötig Erklär-Seite(n) + Navigation.
6. Doku + PULS, Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**

---

## 8. Offene Punkte — die Sitzung entscheidet selbst (Klaus, 2026-05-30)

Klaus überlässt diese Punkte der Sitzung. **Selbst entscheiden** — Maßstab:
**intelligent, logisch, nutzerfreundlich**. Nicht nachfragen, sinnvolle Vorgabe wählen
und im PR/PULS kurz begründen. Empfohlene Defaults:

- **„Zivilaktion"** = die **Sybil-/Angriffs-Aktion** des Negativbauers. (So deuten.)
- **Ein Ingenieur**, der beide Sorten vorschlägt (Hintergrund-Tool **und** Standalone-PWA);
  nur in zwei Figuren splitten, wenn es die Verständlichkeit klar verbessert.
- Export-Knopf: eine **Spezifikations-Datei** (JSON/README) als Download genügt; sonst ein
  ehrlicher Platzhalter „kommt im eigenen Repo". Was für den Nutzer klarer ist, gewinnt.

Gleiches gilt für die **Schritt-Reihenfolge** und alle weiteren Detailfragen: eigenständig,
intelligent und nutzerfreundlich entscheiden, statt zu blockieren.

---

## 9. Abschluss-Befehl (Pflicht — die Brief-Kette darf nie abreißen)

Am Ende dieser Sitzung (siehe `CLAUDE.md` → „Dokumentations- & Lesepflicht"):
1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<naechstes-thema>.md` nach
   `docs/sessions/VORLAGE_BRIEF.md` anlegen — inkl. Pflichtlektüre und diesem Abschluss-Befehl.
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push, Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
