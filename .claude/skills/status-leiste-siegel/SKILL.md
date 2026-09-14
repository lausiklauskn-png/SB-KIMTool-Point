---
name: status-leiste-siegel
description: Zeiger auf das kanonische Rezept in Sage-Protokol für das SBKIM-Siegel + die Status-Lampen-Leiste (Modul 15/16/17). Anwenden, wenn an einem Siegel, an den Lampen oder am Andock-Werkzeug im Siegel-Modal gebaut wird — oder wenn zu klären ist, ob ein Siegel vollständig ist. Der Text steht NICHT hier, sondern in Sage; diese Datei nennt nur den Weg dorthin und das, was für dieses Repo besonders gilt.
---

# status-leiste-siegel — die Fassung liegt in Sage

**Dieses Rezept wird an EINER Stelle gepflegt:**
`Sage-Protokol/.claude/skills/status-leiste-siegel/SKILL.md`

**Lies dort weiter.** Hier steht bewusst keine zweite Fassung.

> **Warum ein Zeiger und keine Kopie.** Bis zum 2026-08-22 lagen diese Rezepte
> doppelt vor — in Sage und in `family-project` —, und die beiden Fassungen
> **sagten Verschiedenes**. Welche galt, hing davon ab, welches Repo gerade
> offen war. Zwanzig Kopien einer Regel sind nicht zwanzigmal so verbindlich;
> sie sind zwanzig Stellen, an denen sie auseinanderlaufen kann. `family-project`
> trägt seitdem denselben Zeiger.

## Was für dieses Repo besonders gilt

⚠ **DREI Siegel-Dateien, und nur eine davon ist die Modul-Kopie.**

| Datei | was sie ist |
|---|---|
| `assets/sbkim-siegel.js` | **der LOADER** — wird bei einem Modul-Rollout NICHT ersetzt |
| `web/tools/sbkim-siegel.js` | die Modul-Kopie in der Werkzeugkiste |
| `sandbox/16_siegel.js` | die Fassung des Modells |

Erst `head` lesen und `grep ZERTIFIKAT_ASPEKTE` laufen lassen, dann
entscheiden. Wer den Loader überschreibt, nimmt der Seite ihr Siegel.

**Sicherheits-Aspekte:** wer hier ein Schutz-Modul (10/11/12/14/15) baut oder
pflegt, trägt einen `ZERTIFIKAT_ASPEKTE`-Eintrag in `sandbox/16_siegel.js` ans
Listen-Ende — `CLAUDE.md` § Sicherheits-Modul-Pflicht.

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
