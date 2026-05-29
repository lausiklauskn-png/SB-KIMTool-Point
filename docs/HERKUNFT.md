# Herkunft & Verständnis-Abgleich

Dieses Repo ist die **Tochter-Hyphe für Forker** / der **Tool-Point** aus der
Sage-Design-Sitzung (2026-05-29). Es startet CLEAN mit eigener, neutraler
Identität — es ist **nicht** „Sage minus Dateien".

## Zwei Dinge parallel

1. **Werkzeugkiste** — reife Module aus dem Sage-Protokol, gezielt herübergeholt
   (Datei für Datei, nicht geklont), plus Onboarding. Externe PWAs verlinken/kopieren hierher.
2. **Modell** (NICHT „Orakel" — wissenschaftlicher Bezug statt Raten/Mystik) — ein
   agenten-basierter, headless Node-Durchlauf, der Protokoll-Logik vorab durchspielt.
   Bewährt sich eine Lösung hier, wird sie in die echten Tools zurückgeholt.

## Verifizierte Faktenlage (gelesen 2026-05-29 aus `Sage-Protokol/status.json`)

Echte Konstanten (Quelle der Wahrheit, in `sandbox/00_config.js` gespiegelt):
`PROTOCOL_VERSION="0.1"`, `EMBEDDING_MODEL="Xenova/multilingual-e5-small"`,
`EMBEDDING_DIM=384`, `PROVIDER_MIN_MATCH=0.80`, `QUERY_TIMEOUT_MS=4000`.

| ID | Modul | Sage-Status |
|----|-------|-------------|
| 03 | Embedding | fertig ✅ (Live-Beweis 2026-05-16) |
| 04 | Match | fertig ✅ (Sichttest 5/5 grün) |
| 05 | Anastomose (Handshake) | fertig ✅ (Cross-Node 2026-05-16) |
| 09 | Einbau-PWA | fertig ✅ (live an 2 Endknoten) |
| 15 | Membran | fertig ✅ (schlummert bis Angriff) |
| 16 | SBKIM-Siegel | stub (4/4 grün) |
| 17 | Floating-Widget | stub (19/19 grün) |
| 00,01,02,06,07,08 | Doku/Storage/Spore/Heterokaryose/Apoptose/UI-Demo | code-stub |
| 10,11,12,14 | Reputation/Rate-Limit/Blocklist/Diffusion | **vorgebaut – schlummert bis Bedarf** |
| 18 | Tool-PWA-Container | teil-fertig (Sub a 17/17 grün) |
| 19 | Andock-Wizard (Witstart) | vorgebaut – kopierbar |

**Echte Live-Endknoten:** Rezeptbuch (`BSWxXmXvxF8F…`), Mixarium (`JOlHK31XEiyl…`),
Sage (`nysOZE3VuKqZ…`). → Saat für den Marktplatz (Schicht 3).

## Wichtig: „Schablone" heißt NICHT leer

Die Module 10/11/12/14 sind **bereits vorgebaut** und schlummern — sie springen
bei Bedarf an (Sybil-Effekt, Flooding, Angriff), genau wie die Membran (15) erst
bei einem Angriff wirkt. Dass sie noch nicht durch einen Außen-Eingriff aktiviert
wurden, heißt nicht, dass sie nicht funktionieren.

## Ehrlichkeits-Korrektur (beibehalten)

Das „Schwarze Loch" ist eine **Observatorium-Visualisierung** in der Sage
`index.html` — **nicht** „Lehre 8" (= DeX-Cursor-Overlay). Frühere Verwechslung
hier festgehalten, damit sie nicht wiederkehrt.

## Quellen

Öffentliches Repo `lausiklauskn-png/Sage-Protokol` (Stand 2026-05-26 / -28):
`status.json`, `sbkim/spore.json`, Verzeichnisstruktur (`src/`, `docs/`, `sbkim/`,
`scripts/`, `tests/`, `index.html`, `paper.html`, `sbkim-init.js`, `sbkim-sw.js`).
