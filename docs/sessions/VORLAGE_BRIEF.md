# VORLAGE — Folge-Brief (kopieren, ausfüllen, nie weglassen)

> Diese Vorlage setzt die **Brief-Kette** aus `CLAUDE.md` („Dokumentations- &
> Lesepflicht") um. Jede Sitzung erzeugt am Ende einen neuen
> `docs/sessions/BRIEF_<thema>.md` nach diesem Muster und gibt ihn als Codeblock
> im Chat aus. Pflichtteile sind mit **[Pflicht]** markiert.

---

## 0. Pflichtlektüre vor Start **[Pflicht — erst lesen, dann planen, dann bauen]**

Bevor irgendetwas gebaut wird, in dieser Reihenfolge lesen:

1. `CLAUDE.md` (Verfassung)
2. `PULS.md` (aktueller Stand)
3. **diesen Brief** (geplante Aufgabe + Datenverträge)
4. `status.json` (Real-Anteil)
5. Doku + Code der zugewiesenen Scheibe (`docs/*.md`, `sandbox/…`)

**Erst Überblick, dann bauen:** relevanten Code lesen, Plan formulieren, Plan kurz an
Klaus zeigen, Rückmeldung abwarten — **nicht sofort losbauen**. Offene PRs vorher sichten.

---

## 1. Stand **[Pflicht]**
- Was ist gerade da / zuletzt gemerged? (kurz, mit PR-Nummern)
- Was ist offen / blockiert?

## 2. Ziel dieser Aufgabe **[Pflicht]**
- In ein bis zwei Sätzen: was soll am Ende sichtbar/beweisbar sein?

## 3. Was gebaut / gepflegt / getestet werden soll **[Pflicht]**
- **Bauen:** …
- **Pflegen:** … (bestehende Dateien/Doku nachziehen)
- **Testen:** … (welche `npm test`-Fälle, welcher Browser-Sichttest durch Klaus)

## 4. Datenverträge / Spec **[Pflicht, falls Module/Dateien Daten teilen]**
- Schema **zuerst** festschreiben (Spec vor Code), dann Code.

## 5. Akzeptanzkriterien (Erfolgsmerkmale) **[Pflicht]**
- Mess­bare Punkte; `npm test` grün; ehrliche Schließung „ungeprüft, wartet auf Klaus".

## 6. Empfohlene Reihenfolge (Einzelschritte)
1. …
2. …

## 7. Offene Fragen an Klaus
- …

---

## 8. Abschluss-Befehl **[Pflicht — die Kette darf nie abreißen]**

Am Ende **dieser** Folge-Sitzung:

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte + Manual-Check-Status).
2. **Neuen** Brief `docs/sessions/BRIEF_<thema>.md` nach dieser Vorlage anlegen —
   inkl. Pflichtlektüre (Teil 0) und dieses Abschluss-Befehls (Teil 8).
3. Den neuen Brief **vollständig als Codeblock im Chat** ausgeben.
4. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
