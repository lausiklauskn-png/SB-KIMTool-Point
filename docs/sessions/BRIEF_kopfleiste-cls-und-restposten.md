# BRIEF — Kopfleiste beruhigen (CLS 0,052) + Restposten der Leistungs-Runde

> Erstellt am Ende der Sitzung 2026-08-06 („Startseite 72 → 86"). Setzt die
> Brief-Kette aus `CLAUDE.md` fort.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

Bevor irgendetwas gebaut wird, in dieser Reihenfolge lesen:

1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (aktueller Stand — **Nachtrag 2026-08-06** ganz oben)
3. **diesen Brief** (geplante Aufgabe + Datenverträge)
4. `status.json` (Real-Anteil)
5. Doku + Code der zugewiesenen Scheibe (`assets/style.css`, `index.html`)

**Erst Überblick, dann bauen:** relevanten Code lesen, Plan formulieren, Plan kurz an
Klaus zeigen, Rückmeldung abwarten — **nicht sofort losbauen**. Offene PRs vorher sichten.

---

## 1. Stand

- **Gemergt 2026-08-06:** Startseiten-Leistung **72 → 86**, Ladezeit (LCP)
  **18,9 s → 3,8 s**. Ursache waren drei Dekor-Banner als PNG mit zusammen
  **3,0 MB** (90 % der Seitenlast). Jetzt WebP, 900 px breit, `loading="lazy"`,
  zusammen 162 KiB. Wirkt auf `index.html` + `modell.html` + `werkzeuge.html` +
  `markt.html`. Alte PNGs entfernt, `assets/img/README.md` nachgezogen.
- **Ebenfalls behoben:** Layout-Sprung durch das Siegel-Abzeichen — `.lamps`
  bekam `min-height: 34px` im app-eigenen CSS. CLS **0,103 → 0,052**.
- **Offen:** die verbleibenden **CLS 0,052**, siehe Ziel. Dazu drei kleine
  Restposten (Teil 3).
- **Nicht von dieser Runde:** `npm test` steht bei **146/148**. Die zwei roten
  Proben („Probe 27: Netz-Link gerendert" / „Klick öffnet URL") waren **schon
  vorher rot** — gegengeprüft auf `origin/main`. Sie betreffen den Netz-Link im
  Rendezvous-Panel (alte Modul-Generation) und gehören in den **netzweiten
  Modul-Rollout**, nicht in eine Leistungs-Sitzung.

## 2. Ziel dieser Aufgabe

Die Statusleiste soll beim Laden **nicht mehr springen**. Messbar: CLS von
**0,052 auf ≤ 0,01**, ohne dass die Leiste auf dem Handy schlechter aussieht.

## 3. Was gebaut / gepflegt / getestet werden soll

**Bauen — den Umbruch der Kopfleiste beruhigen.**
Gemessener Ablauf bei 412 px Breite (Handy):

| | Höhe `header.statusbar` | Zeilen |
|---|---|---|
| erster Anstrich | 144 px | brand / nav / version |
| nach dem Laden | 194 px | brand / nav / gerätename+lampen / version |

Die Leiste ist ein `display: flex; flex-wrap: wrap`. Sobald die Lampen breiter
werden, bricht sie von drei auf vier Zeilen um und wächst um 50 px — alles
darunter rutscht nach. **Wichtig:** dieser Sprung passiert *vor*
`DOMContentLoaded`, ist also **nicht** derselbe wie der bereits behobene
Siegel-Abzeichen-Sprung.

Drei denkbare Wege — bitte **erst messen, dann wählen**, nicht raten:
1. `min-height` auf `header.statusbar` in der Handy-Breite (billigster Weg,
   reserviert die vierte Zeile von Anfang an).
2. Feste Zeilen-Aufteilung unter 620 px (z. B. Gerätename + Lampen bewusst immer
   auf eine eigene Zeile) statt freiem `flex-wrap`.
3. Gerätename auf schmalen Geräten ausblenden und über einen Knopf öffnen.

⚠️ **Das ist eine sichtbare Design-Entscheidung an der Leiste, die auf jeder
Seite steht.** Nach `CLAUDE.md` § Plan-vor-Code: Weg vorschlagen, Klaus zeigen,
Rückmeldung abwarten. Weg 3 ändert die Bedienung und braucht Klaus' Wort.

**Pflegen (kleine Restposten, jeder für sich abgegrenzt):**
- `assets/img/icon-512.png` ist **342 KiB**. Es ist ein Manifest-Icon, wird beim
  Seitenaufruf nicht geholt und war in **keiner** Messung auffällig — also
  **kein** dringender Punkt. Nur mitnehmen, wenn ohnehin jemand an den Bildern ist.
- **Auffindbarkeit 80** (Tomys Hub: 100). Eigener Punkt, in dieser Runde nicht
  angefasst. Vorbild: `Mein-WorkFloh` PR #162 (Titel, Beschreibung, `robots.txt`,
  `sitemap.xml` — dort 80 → 92).

**Testen:**
- `npm test` muss bei **146/148** bleiben (nicht schlechter). Wer behauptet,
  148/148 zu haben, hat sich vermessen — die zwei roten sind vorbestehend.
- Messen mit dem **einen** Werkzeug, nicht mit einem neu gebauten:
  ```
  cd /home/user/family-project
  LH_ROOT=/home/user/SB-KIMTool-Point node tools/lh-messen.mjs index.html --trace
  ```
  `--trace` zeigt die verschobenen Knoten mit Koordinaten — **erst damit** weiß
  man, welches Element springt. Der Bericht allein sagt es nicht.
- **Immer im Wechsel alt/neu messen**, mindestens drei Runden. Die Zahl schwankt
  auf der Bau-Maschine um mehrere Punkte; eine Einzelmessung beweist nichts.
- **Klaus' Browser-Sichttest** am Tablet: sieht die Leiste im Hoch- **und**
  Querformat noch richtig aus?

## 4. Datenverträge / Spec

Keine. Reine Anzeige-Schicht (`assets/style.css`, ggf. `index.html`-Kopfblock).
**Kein** SBKIM-Modul anfassen — das Siegel-Abzeichen kommt aus Modul 16 und wird
weiterhin nur *aufgenommen*, nicht verändert. Kein `status.json`, keine Spore,
keine `nodeId`, kein Match-Wert.

## 5. Akzeptanzkriterien

- CLS **≤ 0,01** über drei Läufe, im Wechsel gegen den Vorstand gemessen.
- Leistung **nicht schlechter** als 85.
- `npm test` bei **146/148** (unverändert).
- Kein byte-1:1-Modul verändert.
- Ehrliche Schließung: „Browser-Sichttest ungeprüft, wartet auf Klaus' Lauf."

## 6. Empfohlene Reihenfolge

1. `--trace` laufen lassen und die springenden Knoten **notieren** (nicht raten).
2. Die drei Wege gegeneinander messen, jeweils drei Runden.
3. Ergebnis + Empfehlung Klaus zeigen, Rückmeldung abwarten.
4. Gewählten Weg bauen, gegenmessen, `npm test`, PULS + neuer Brief, PR.

## 7. Offene Fragen an Klaus

- Darf der **Gerätename** auf schmalen Geräten hinter einen Knopf wandern, oder
  soll er immer sichtbar bleiben? (Entscheidet zwischen Weg 2 und Weg 3.)
- Soll die **Auffindbarkeit 80** als Nächstes drankommen? Das ist ein eigener,
  gut abgegrenzter Schritt nach dem WorkFloh-Vorbild.

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

Am Ende **dieser** Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach `VORLAGE_BRIEF.md` anlegen —
   inkl. Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan.
   Merge nach dem netzweiten Selbst-Merge-Freibrief, sobald getestet und
   abgegrenzt — bei echtem Zweifel erst Klaus fragen.
