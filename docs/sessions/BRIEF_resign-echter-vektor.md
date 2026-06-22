# BRIEF — Re-Sign der Spore mit echtem domainVector (Republish + Hochstufung)

> Folge-Brief der Brief-Kette (CLAUDE.md „Dokumentations- & Lesepflicht").
> Erst lesen, dann planen, dann bauen. Diese Aufgabe braucht **das Secret** — siehe Teil 0.

---

## 0. Pflichtlektüre vor Start [Pflicht] + Voraussetzung

In dieser Reihenfolge: `CLAUDE.md` → `PULS.md` (oberster Eintrag „2026-05-30 (U)") →
**dieser Brief** → `status.json` → `docs/ANDOCK.md` (§5 echt!) + `sbkim/AUSTAUSCH.md` (§7) +
`scripts/generate_spore.mjs` + `sbkim/spore.json` + `sbkim/domainVector.real.json` +
`test/match.test.js` + `test/andock.test.js`.

**HARTE Voraussetzung:** `SBKIM_NODE_KEY` **muss gesetzt** sein. Prüfen:
`node scripts/generate_spore.mjs` (flüchtig in /tmp via `SPORE_OUT`) → die nodeId **muss**
`eC3jzoo9Oii04KiSYBXEWhPQzAe6ezmDFKDo1_i0zdw` ergeben. Weicht sie ab → **STOPP**, Secret
fehlt/falsch, Klaus fragen. Niemals mit flüchtiger Identität republishen.

## 1. Stand [Pflicht]

- Echter `domainVector` liegt vor (`sbkim/domainVector.real.json`, von Sage geliefert).
  Cross-Knoten-Match **0.848508 ≥ 0.80** (offline reproduziert, `test/match.test.js`).
- Generator baut den echten Vektor + `stamm/guestCategories` bereits ein, `_demo` entfällt.
  `npm test` 45/45, `npm run verify` 16/16. Doku (ANDOCK §5) auf „echt" umgeschrieben.
- **Noch offen:** Re-Sign + Republish der `sbkim/spore.json` (braucht Secret); danach Sages
  Hochstufung `verified-spore → verified-match`. Live-Spore trägt aktuell noch Demo-Vektor.

## 2. Ziel dieser Aufgabe [Pflicht]

`sbkim/spore.json` **neu signiert** mit echtem `domainVector` veröffentlichen (nodeId bleibt
`eC3jzoo9…`), sodass Sage reziprok verifiziert und den Match (0.8485) offiziell hochstuft.

## 3. Was gebaut / gepflegt / getestet werden soll [Pflicht]

- **Bauen:** mit gesetztem `SBKIM_NODE_KEY` → `node scripts/generate_spore.mjs` →
  überschreibt `sbkim/spore.json` (echter Vektor, Kategorien, kein `_demo`).
- **Prüfen:** `node scripts/verify_foreign_spore.mjs sbkim/spore.json` → ✔ VALID;
  nodeId == `eC3jzoo9…`; `npm test` grün; `npm run verify` grün.
- **Pflegen:** Postfach §7 + Status-Kopf („Republish erfolgt, wartet auf Sages Hochstufung"),
  Bau-Protokoll-Zeile; `status.json` (domainVector real → Ring; mit Klaus abstimmen, PR #34).

## 4. Datenverträge / Spec [Pflicht]

- Signier-Form unverändert (ANDOCK §4); Vektor + Kategorien sind Teil der signierten Bytes.
- nodeId-Invariante: `eC3jzoo9Oii04KiSYBXEWhPQzAe6ezmDFKDo1_i0zdw` — Abweichung = Abbruch.
- e5-Reproduzierbarkeit: Text-Präfix `passage: …` exakt wie in `domainVector.real.README.md`.

## 5. Akzeptanzkriterien [Pflicht]

- `sbkim/spore.json`: echter 384-dim-Vektor, kein `_demo`, Signatur ✔, nodeId unverändert.
- `npm test` 45/45 (inkl. `match.test.js`), `npm run verify` 16/16.
- Postfach + Bitte an Sage aktuell; Sage kann auf `verified-match` hochstufen.

## 6. Empfohlene Reihenfolge

1. Secret prüfen (nodeId == eC3jzoo9…) — sonst STOPP.
2. Generator laufen lassen → `sbkim/spore.json` neu.
3. `verify_foreign_spore.mjs` + `npm test` + `npm run verify` grün.
4. Postfach/Status/Bau-Protokoll fortschreiben; commit + Draft-PR; mergen wenn sinnvoll.
5. Klaus: GitHub Pages aktivieren (403 → 200) — nicht-blockierend.

## 7. Offene Fragen an Klaus

1. Ist `SBKIM_NODE_KEY` jetzt in der Umgebung hinterlegt?
2. GitHub Pages aktivieren (Settings → Pages → main/root)?
3. `domainVector`/Match als echte Komponente in unser `status.json` (Ring wächst, PR #34)?

## 8. Abschluss-Befehl [Pflicht — Kette darf nie abreißen]

1. `PULS.md` fortschreiben. 2. Neuen Brief `docs/sessions/BRIEF_<thema>.md` nach
`VORLAGE_BRIEF.md` (Pflichtlektüre + diesen Abschluss-Befehl wiederholen). 3. Brief als
Codeblock im Chat. 4. Commit + Push, Draft-PR mit Test-Plan; sinnvolle Andock-PRs eigenständig
mergen (Klaus' Dauer-Freigabe 2026-05-30).
