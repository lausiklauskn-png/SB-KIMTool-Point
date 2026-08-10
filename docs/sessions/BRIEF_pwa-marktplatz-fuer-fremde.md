# BRIEF — PWA·Toolpoint wird der Marktplatz für Fremde

> ## 🚨 KORREKTUR, wenige Stunden nach dem Schreiben (2026-08-10)
>
> **Der Laden hat längst ein eigenes Repo: [`lausiklauskn-png/PWA-Toolpoint`](https://github.com/lausiklauskn-png/PWA-Toolpoint)**,
> live unter **pwa-toolpoint.de** (dazu **pwa-toolpoint.com**). Er trägt 14
> Einträge, Wort- und Bedeutungs-Suche, Siegel, Pflege-Studio, nächtlichen
> Mess-Lauf — und seit dem 2026-08-10 den Melde-Knopf.
>
> **Dieser Brief wurde geschrieben, als das noch nicht sichtbar war**: die
> beiden Toolpoint-Repos lagen nicht im Zugriff der Sitzung, also stand hier
> die Frage, ob der Laden ein eigenes Repo bekommt (§ 7 Frage 4). Sie war zu
> dem Zeitpunkt schon beantwortet — nur nicht für mich sichtbar.
>
> **Was daraus folgt:**
>
> | Teil dieses Briefes | gilt noch? |
> |---|---|
> | § 1 — **das Ziel**, Klaus' Worte, das Geld-Modell | **ja**, unverändert |
> | § 2 — der Ist-Stand-Vergleich | **nein** — er vergleicht das falsche Repo |
> | § 3–6 — die Bau-Anweisungen | **nein** — sie zielen hierher statt nach PWA-Toolpoint |
> | § 7 Frage 2 + 4 (Name, eigenes Repo) | **beantwortet** — PWA Toolpoint, eigenes Repo |
> | § 7 Frage 1 (Beitragsform) | **beantwortet** am 2026-08-10 — siehe unten |
> | § 7 Frage 3 (Rauswurf-Regel) | **weiter offen** |
>
> **Wer am Marktplatz baut, baut in `PWA-Toolpoint`, nicht hier.** Der dortige
> Einstieg ist `CLAUDE.md` → `docs/sessions/BRIEF_naechste-sitzung.md`, und der
> Geld-Beschluss steht in `docs/GELD-ENTSCHEIDUNGEN.md`.
>
> **SB·KIMTool·Point bleibt, was es ist:** Werkstatt, Werkzeugkiste und
> Observatorium für Forker — nicht der Laden.
>
> *Stehen gelassen statt gelöscht: der Ziel-Teil ist Klaus' Diktat und gilt.
> Und eine Korrektur, die man sehen kann, ist mehr wert als ein Brief, der so
> tut, als hätte er von Anfang an gestimmt.*

---

> Folge-Brief. Setzt die Brief-Kette aus `CLAUDE.md` fort. **Stand: 2026-08-10.**
>
> **Zweck dieses Briefes:** damit keine Sitzung mehr fragen muss, wohin Toolpoint
> eigentlich soll. Klaus hat das Ziel am 2026-08-10 im Zusammenhang diktiert. Es
> steht hier vollständig — nicht als Idee, sondern als Auftrag.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

In dieser Reihenfolge, **bevor** etwas gebaut wird:

1. `CLAUDE.md` (Verfassung dieses Repos)
2. `PULS.md` (aktueller Stand, oberster Eintrag)
3. **diesen Brief**
4. `Sage-Protokol/docs/PLAN_PILZ_WIRTSCHAFT.md` — **besonders § 3 Säule ③.** Dort
   steht dasselbe Vorhaben aus wirtschaftlicher Sicht, mit dem Kassensturz.
   Dieser Brief ist die Bau-Seite davon; das Papier ist die Geld-Seite.
5. Code der Scheibe: `markt.html` · `assets/app.js` (`renderMarkt`) ·
   `web/data/marktplatz.json` · `web/data/nodes.json` · `status.json`
6. **Die Vorlage, aus der kopiert wird:** `family-project/markt.html`,
   `family-project/server/einreichung.php`, `family-project/assets/config/spenden.js`

**Und immer zuerst — der Klon im Container kann Wochen alt sein:**

```bash
git -C /home/user/SB-KIMTool-Point fetch origin --quiet
git -C /home/user/SB-KIMTool-Point checkout -B <zweig> origin/main
```

Keine Aussage über den Stand einer App treffen, ohne vorher gefetcht zu haben.

**Plan-vor-Code gilt.** Kein Freibrief offen für den Bau selbst. Der Merge-Schritt
läuft unter dem netzweiten Selbst-Merge-Freibrief (Klaus 2026-06-28).

---

## 1. Das Ziel — in Klaus' eigenen Worten, geordnet **[Pflicht lesen]**

Es gibt **zwei Marktplätze**, technisch gleich, im Zweck getrennt:

| | **family-projekt.de** | **PWA·Toolpoint** |
|---|---|---|
| Für wen | Freunde, Bekannte, Geschäftsleute aus Klaus' Gemeinschaft | **wildfremde Leute**, offen für jeden |
| Charakter | die private Plattform, ein besonderer Rahmen | der **offizielle Shop für PWAs** |
| Einnahme | Beteiligung + persönliche Betreuung | **Mitgliedschaft + Spenden**, später Provision |
| Technik | dieselbe | **dieselbe** |

Der Satz, auf den es ankommt: *„Genau dieselbe Technik."* Toolpoint wird kein
zweites, anders gedachtes Ding. Es ist die **getrennte Instanz** desselben
Bausatzes, mit eigenem Namen und eigener Adresse.

### 1.1 Was ein Fremder auf Toolpoint können soll

Alles, was der Family-Markt heute kann:

- **Suchen** — auch die **semantische Suche**, also über die Beschreibung und die
  Vektor-Ähnlichkeit, nicht nur über Stichwörter.
- **Die Studio-Funktion** — die eigene Seite selbst pflegen, ohne Programmierer.
- **Die Messwert-Funktion von Google** — jeder Eintrag trägt seine gemessene
  Leistung offen. Das ist der Ersatz für Werbeversprechen.
- **Leicht eine eigene Spore und einen eigenen Knoten erzeugen** — der Einstieg
  ins Mycel, ohne dass jemand die Krypto verstehen muss.
- **Melden-Knopf** und die übrigen Sachen, die im Family-Projekt schon drin sind.
- **Eine sinnvolle Aufteilung des Containers**, in dem die App steckt.

### 1.2 Das Geld-Modell (Klaus' Festlegung — **keine Diskussion darüber**)

Klaus hat das ausdrücklich so entschieden und will darüber nicht verhandeln. Die
Aufgabe einer Sitzung ist, es **zu bauen**, wenn er es abruft — nicht, es zu
bewerten.

- **Zugehörigkeit zum Netzwerk: 10 €.** Entweder als **Jahresbeitrag** oder als
  **einmalige Zahlung für unbegrenzte Zugehörigkeit**. Beide Formen sind
  genannt; welche gilt, ist noch offen (§ 7).
- **Die erbetene Preis-Aufforderung:** wer eine App einstellt, wird *gebeten*,
  **ein bis zwei Euro** dafür zu verlangen. Nicht erzwungen, aber deutlich
  erbeten.
- **Der Grund dahinter** — und der ist der eigentliche Kern, nicht der Betrag:
  Ein Preis zwingt den Erbauer, die App so zu gestalten, dass sie das Geld auch
  wert ist. Taugt sie nichts, gibt es schlechte Bewertungen. Schlechte
  Bewertungen können dazu führen, dass ein Eintrag **aus dem Pool fliegt** — dann
  sind die 10 € verloren. Wer gute Arbeit abliefert, hat die 10 € nach etwa fünf
  Klicks wieder drin. Ab da ist es Gewinn.
- **Beide Seiten haben etwas davon:** Klaus verdient an der Zugehörigkeit, die
  Anbieter bekommen die Sicherheit, dass die Plattform weiterläuft und gepflegt
  wird.
- **Spenden-Knopf pro App.** Eine Kaffeekasse je Eintrag. Jeder kann sich die App
  ansehen, herunterladen, etwas spenden — **oder es lassen.** Freiwillig heißt
  freiwillig.
- **Zeitpunkt:** das Bezahlen kommt erst, *„wenn genügend Interesse da ist"* und
  Klaus dann **ein Gewerbe anmeldet**. Vorher wird es vorbereitet, aber nicht
  scharf geschaltet.

Warum nicht weniger als 10 €: bei kleineren Beträgen frisst die PayPal-Gebühr
den Rest auf. Das ist der Grund für die Höhe, nicht Willkür.

---

## 2. Wo wir wirklich stehen — nachgesehen, nicht vermutet **[Pflicht]**

Am 2026-08-10 gegen die echten Dateien geprüft, beide Repos frisch gefetcht:

| Baustein | family-project | SB·KIMTool·Point |
|---|---|---|
| `markt.html` | **1.723 Zeilen** | **63 Zeilen** |
| Eintrag einreichen | ja (`server/einreichung.php`) | **nein** |
| Bewertung / Google-Messwerte | ja | **nein** |
| Melden-Knopf | ja | **nein** |
| Spenden + Jahresbeitrag | angelegt, aber **abgeschaltet** (`assets/config/spenden.js`, `enabled:false`) | **nein** |
| Semantische Suche mit Nähe-Zahl | ja (`listings-vec.json`) | **nein** — in `markt.html` steht wörtlich *„Suche bewusst noch nicht gebaut"* |
| Siegel / Wächter / Lampen | ja | **ja** |
| Werkzeuge zum Selbst-Knoten-Werden | teils | **ja** (`werkzeuge.html`, `such-tool/`, `web/tools/`) |

**Ehrliche Einordnung in einem Satz:** Toolpoint ist heute ein *Schaufenster in
drei Schichten*, das echte Live-Endknoten auflistet — **kein Shop**. Die Technik,
die es dazu machen würde, ist gebaut, aber sie liegt in family-project und wurde
noch nie herübergeholt.

**Der einzige Baustein, den es nirgends gibt:** der Bezahlweg. Auch im
Family-Markt ist er nur ein abgeschalteter Platzhalter. Es fließt bis heute an
keiner Stelle Geld durch die Software.

---

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**

**Nicht alles auf einmal.** Die Reihenfolge in § 6 ist Teil des Auftrags.

**Bauen (in dieser Reihenfolge):**

1. **Markt-Technik herüberholen** — `markt.html` aus family-project als Vorlage:
   Einreichen, Bewertung, Messwerte, Melden, Container-Aufteilung. **Kopieren,
   nicht neu erfinden** (Regel „Kopieren, nicht klonen" in `CLAUDE.md`).
2. **Semantische Suche im Markt** — die vorhandenen Module 03/04 liegen bereits
   unter `web/tools/`. Der Vektor-Bestand entsteht wie bei family-project als
   `listings-vec.json` im Repo, **keine Vektordatenbank, kein Server**.
3. **Eigenes Gesicht** — eigener Name, eigene Adresse, eigener Fuß, eigenes
   Impressum. Toolpoint darf nicht wie eine Kopie von family-projekt.de aussehen.
4. **Einstiegs-Weg für Fremde** — „in zehn Minuten vom Besucher zum eigenen
   Knoten": eigene Spore erzeugen, Identität sichern, Eintrag einreichen. Die
   Werkzeuge dafür stehen schon; es fehlt der geführte Weg drumherum.
5. **Bezahlen — erst auf Klaus' Abruf.** Vorbereiten heißt: die Knöpfe und die
   Konfigurationsdatei anlegen, **abgeschaltet**, genau wie `spenden.js` bei
   family-project. Scharf geschaltet wird erst nach der Gewerbeanmeldung.

**Pflegen:**

- `status.json` — die Zeile *„Marktplatz Schicht 3 … Suche bewusst noch NICHT
  gebaut"* ist dann nicht mehr wahr und muss mitwandern.
- `PULS.md`, `docs/STUFEN.md`, `werkzeugkiste.json` nachziehen.
- `Sage-Protokol/docs/PLAN_PILZ_WIRTSCHAFT.md` § 3 ③ — dort eintragen, was
  wirklich gebaut wurde. Das Papier ist ein **lebendes Dokument**.

**Testen:**

- `npm test` muss grün bleiben. **Achtung, ehrlicher Vorbefund:** am 2026-08-08
  standen **114 grün / 2 rot** (`kanon_import`, `spore_v02`). Die Gegenprobe auf
  `origin/main` zeigte **dieselben zwei rot** — sie gehören nicht zur letzten
  Arbeit. Wer hier baut, erbt sie und darf sie nicht als eigenen Schaden lesen.
- Browser-Sichttest durch Klaus. Headless ersetzt ihn nicht.

---

## 4. Datenverträge / Spec **[Pflicht — Spec vor Code]**

- **DB-Kennung bleibt `toolpoint`.** Sie steht in `markt.html` als
  `window.SBKIM_DB_SUFFIX="toolpoint"`. Family-Projekt hat eine eigene. Werden
  beide gleich, überschreiben sich die Datenbestände auf derselben Adresse
  gegenseitig. Diese Falle steht auch im Pilz-Papier § 3 ③ ausdrücklich drin.
- **Eintrags-Schema** — sich an `family-project/web/data/` halten und Abweichungen
  vorher hinschreiben, nicht hinterher.
- **Vektoren** liegen als int8 im Repo (`listings-vec.json`), nicht in einem
  Dienst. Das ist eine bewusste Ersparnis, keine Notlösung.
- **Spore / Andock** unverändert nach `docs/ANDOCK.md`. Der Markt fasst die
  Identitäts-Schicht **nicht** an.
- **Bezahl-Konfiguration** nach dem Muster `spenden.js`: eine Datei, ein
  `enabled`-Schalter, Standard **aus**. Keine Schlüssel, keine Zugangsdaten im
  Repo — niemals.

---

## 5. Akzeptanzkriterien **[Pflicht]**

- Ein Fremder kann auf Toolpoint eine App **finden** — auch, wenn er die
  Beschreibung mit anderen Worten sucht als der Anbieter sie geschrieben hat.
- Ein Fremder kann einen Eintrag **einreichen**, ohne dass Klaus etwas von Hand
  eintragen muss.
- Jeder Eintrag zeigt seine **gemessene Leistung** offen.
- Der **Melden-Knopf** funktioniert und landet irgendwo, wo Klaus ihn sieht.
- Die Seite trägt **eigenen Namen und eigene Adresse**, nicht family-projekt.de.
- `npm test` grün (bis auf die zwei ererbten roten, die benannt bleiben).
- Ehrliche Schließung: *„Browser-Sichttest ungeprüft, wartet auf Klaus' Lauf."*
- Die Bezahl-Knöpfe sind **abgeschaltet**, solange kein Gewerbe angemeldet ist.

---

## 6. Empfohlene Reihenfolge (Einzelschritte)

1. **Lesen und planen.** Beide `markt.html` nebeneinander legen und schriftlich
   festhalten, was übernommen wird und was nicht. Plan an Klaus, dann bauen.
2. **Markt-Grundgerüst** herüberholen (einreichen · bewerten · melden). Ein PR.
3. **Semantische Suche** dazu. Eigener PR.
4. **Eigenes Gesicht** (Name, Adresse, Impressum, Fuß). Eigener PR.
5. **Einstiegs-Weg für Fremde.** Eigener PR.
6. **Bezahlen vorbereiten, abgeschaltet.** Erst auf Klaus' Abruf, eigener PR.

Schritte 2 bis 5 sind unabhängig voneinander und können auch einzeln abgerufen
werden. Schritt 6 ist der letzte, und er hängt nicht an der Technik, sondern an
der Gewerbeanmeldung.

---

## 7. Offene Fragen an Klaus

Diese Fragen **nicht selbst entscheiden** — sie sind Richtungsentscheide:

1. ~~**Jahresbeitrag oder einmalig?**~~ **Beantwortet (Klaus 2026-08-10):**
   **einmalig für unbegrenzt**, nicht jährlich. Der Beschluss steht in
   `PWA-Toolpoint/docs/GELD-ENTSCHEIDUNGEN.md` — hier bewusst ohne Betrag,
   damit keine Sitzung eine Zahl aus einem Arbeitsauftrag auf eine Seite hebt.
2. ~~**Wie heißt der Marktplatz nach außen?**~~ **Beantwortet:** „PWA Toolpoint",
   live unter pwa-toolpoint.de und pwa-toolpoint.com.
3. **Wer entscheidet, dass ein Eintrag rausfliegt?** — **weiter offen.** Ab
   welcher Bewertung, nach wie vielen Stimmen, und darf der Anbieter
   widersprechen? Ohne Regel ist der Rauswurf angreifbar. Bei einer einmaligen
   Zahlung wiegt das schwerer als bei einem Jahresbeitrag: ein Rauswurf nimmt
   jemandem dann etwas weg, das er bezahlt hat.
4. ~~**Bleibt Toolpoint in diesem Repo?**~~ **Beantwortet:** nein, eigenes Repo
   `lausiklauskn-png/PWA-Toolpoint`. Siehe die Korrektur ganz oben.

**Nicht zu fragen:** ob 10 € richtig sind, ob 1–2 € pro App sinnvoll sind, ob das
Modell trägt. Das hat Klaus entschieden und ausdrücklich von der Diskussion
ausgenommen.

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

Am Ende **dieser** Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Sichttest-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach `VORLAGE_BRIEF.md`
   anlegen — inklusive Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls.
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben. Klaus liest
   zuerst den Chat, nicht den Dateibrowser.
4. Zwei bis vier nächste Schritte in der Chat-Antwort, je mit einem Satz
   Begründung.
5. Commit + Push, Draft-PR mit Test-Plan.
