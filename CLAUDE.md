# CLAUDE.md — Verfassung dieses Repos

Leitfaden für jede Sitzung an SB-KIMTool-Point.

## Sprache & Begriffe

- Doku auf **Deutsch**, Code-Bezeichner auf **Englisch**. Datum `YYYY-MM-DD`.
- Es heißt **„Modell"**, nie „Orakel" — wissenschaftlicher Bezug statt Raten/Mystik.
- „Schablone" heißt **nicht leer**: vorgebaute Module (10/11/12/14, 15) schlummern und
  springen bei Bedarf (Angriff/Sybil/Flut) an.

## Disziplin

- **Kopieren, nicht klonen.** Repo bleibt CLEAN mit eigener Identität. Reife Sage-Module
  kommen später Datei für Datei herüber; kein git-clone, kein Klon von Browser-Live-Elementen.
- **Echte Krypto.** Ed25519/SHA-256 über `node:crypto`. Embedding/Match im Modell
  deterministisch gestubt und klar als Demo markiert.
- **Ehrlichkeit zuerst.** `status.json` zeigt den Real-Anteil. Die Seite **zeigt** einen
  aufgezeichneten Lauf, sie **führt** das Modell nicht live aus. Der Beweis ist `npm test`.
- **Jedes Werkzeug erklärt.** Pflicht: Was · Nutzen · Verwendung · Einbau · Aktiviert-durch
  (in `werkzeugkiste.json` + `docs/WERKZEUGE.md`).
- **Keine** Massenproduktion, **kein** vorgetäuschtes Wissen, **nichts** im Hintergrund vorbauen.

## Quelle der Wahrheit

Echte Konstanten und Modul-Status stammen aus `Sage-Protokol/status.json` und sind in
`sandbox/00_config.js` gespiegelt. Bei Abweichung gilt Sage; hier nachziehen.

## Befehle

```bash
npm run demo   # Modell-Lauf + Bericht + schreibt web/data/run.json
npm test       # headless Smoke-Test (Beweis)
```

## Optik

An Sage angelehnt (dunkel, Karten, Mono-Akzente, Lampen-Status-Leiste „was lebt / was
ist tot"), aber **re-geskinnt** für eine eigene, neutrale Identität. Ähnlichkeit ja,
Verwechslung nein. Funktion immer neu/headless, nie aus dem Browser geklont.

## Branch

Entwicklung auf `claude/sbkimtool-founding-TXRdc`. Draft-PR mit Test-Plan.
