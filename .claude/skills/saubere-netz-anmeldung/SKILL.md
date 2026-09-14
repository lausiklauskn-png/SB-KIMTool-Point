---
name: saubere-netz-anmeldung
description: Zeiger auf das kanonische Rezept in Sage-Protokol für die saubere SBKIM-Netz-Anmeldung (eigene Identität, eigene Spore, Rendezvous). Anwenden, wenn ein Knoten dieses Repos andockt, wenn Identitäten kollidieren oder wenn die Reihenfolge der init()-Aufrufe zu klären ist. Der Text steht NICHT hier, sondern in Sage.
---

# saubere-netz-anmeldung — die Fassung liegt in Sage

**Dieses Rezept wird an EINER Stelle gepflegt:**
`Sage-Protokol/.claude/skills/saubere-netz-anmeldung/SKILL.md`

**Lies dort weiter.** Hier steht bewusst keine zweite Fassung.

> **Warum ein Zeiger und keine Kopie.** Bis zum 2026-08-22 lagen diese Rezepte
> doppelt vor — in Sage und in `family-project` —, und die beiden Fassungen
> **sagten Verschiedenes**. Welche galt, hing davon ab, welches Repo gerade
> offen war. Zwanzig Kopien einer Regel sind nicht zwanzigmal so verbindlich;
> sie sind zwanzig Stellen, an denen sie auseinanderlaufen kann. `family-project`
> trägt seitdem denselben Zeiger.

## Was für dieses Repo besonders gilt

**Dieses Repo ist Schablone und Modell zugleich.** Die Seite **zeigt** einen
aufgezeichneten Lauf, sie **führt** das Modell nicht live aus — der Beweis ist
`npm test`. Wer hier an der Anmeldung baut, hält beides auseinander.

**Quelle der Wahrheit** für echte Konstanten und Modul-Status ist
`Sage-Protokol/status.json`, gespiegelt in `sandbox/00_config.js`. Bei
Abweichung gilt Sage; hier nachziehen.

## Die Sprache (seit 2026-09-14)

Verbinden-Fenster (Modul 23 UI, 237 Texte), **Siegel (16, 55 Texte)** und
**Lampen (17, 28 Texte)** sprechen Deutsch und Englisch. Ausgelöst wird es durch
`<html lang>` **oder** `init({lang:"en"})`; **ohne Einstellung ändert sich
nichts.**

⚠ **`lang` geht an DREI Aufrufe, nicht an einen** — 23-UI, 16 und 17 starten
getrennt, keiner reicht ihn an die anderen weiter. Über `<html lang>` entfällt
das: alle drei lesen das Attribut selbst.

Der ganze Abschnitt samt der drei Browser-Übersetzer-Fälle und dem langen Druck
auf den Sprachknopf steht in der Sage-Fassung unter „Die Sprache — Deutsch und
Englisch, mehr nicht".
