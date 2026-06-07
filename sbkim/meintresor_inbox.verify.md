# Prüf-Vermerk — Mein-Tresor (Knoten D) Spore

Stand: 2026-06-07 · Knoten A (SB·KIMTool·Point) · Inbox-Konvention (ANDOCK §6.2)
**Hochgestuft 2026-06-07: `verified-spore` → `verified-match` (Cosine A↔D = 0.853740).**

## Quelle
- `https://raw.githubusercontent.com/lausiklauskn-png/Mein-Tresor/main/sbkim/spore.json`
  (raw/main = verbindliche Bezugsquelle; github.io in der Sitzungs-Umgebung oft 403).
- Momentaufnahme eingefroren: `sbkim/meintresor_inbox.json`.

## Befund — `node scripts/verify_foreign_spore.mjs sbkim/meintresor_inbox.json` → ✔ VALID

| Prüfpunkt | Ergebnis |
|---|---|
| Signatur gültig (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ ja |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH (`wRsGQouOYPVBOLzAB3nBteRvyvJ-AGv461WTJMKtkS0`) |
| Pflichtfelder (inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `domainVector` | ✔ **vorhanden** (384-dim, L2≈1, Xenova/multilingual-e5-small) |
| **Cross-Knoten-Match A↔D** (Cosine gegen `sbkim/domainVector.real.json`) | ✔ **0.853740 ≥ 0.80 → verified-match** |
| Kanonische Form (sortiertes JSON ohne Whitespace, `signature` ausgenommen) | ✔ deckungsgleich |
| Manipulationsprobe (ein Feld verändert) | ✔ fällt durch |

## Identität
- `nodeName`: Mein-Tresor · `nodeType`: hybrid · `domain`: Mein-Tresor-Bibliothek
- `endpoint`: `https://lausiklauskn-png.github.io/Mein-Tresor/`
- `embeddingModel`: `Xenova/multilingual-e5-small` · `protocolVersion`: `0.1`
- `nodeId`: `wRsGQouOYPVBOLzAB3nBteRvyvJ-AGv461WTJMKtkS0`

## Status
**Endknoten D → `verified-match` (0.8537), hochgestuft 2026-06-07.** Mein-Tresor hat den echten
384-dim `domainVector` (Xenova/multilingual-e5-small, L2≈1) ergänzt und die Spore mit demselben
Schlüssel neu signiert (gleiche nodeId `wRsGQouO…`). Der Cosinus gegen unseren
`sbkim/domainVector.real.json` ergibt **0.853740 ≥ 0.80** — denselben Wert wie A↔C, weil D die
Schwester von Jasons-Tresor mit identischem `domainVector` ist (die beiden zeigen untereinander
cos 1.0000). Eingetragen in `status.json`, `web/data/marktplatz.json`, Postfach
`sbkim/AUSTAUSCH-MeinTresor.md`. Offline gegengeprüft in `test/meintresor_inbox.test.js`.
(Zuvor `verified-spore`: domainVector fehlte bewusst, kein Demo-Stub.)

## Re-Verifikation (jederzeit reproduzierbar)
```
node scripts/verify_foreign_spore.mjs sbkim/meintresor_inbox.json
# oder live:
node scripts/verify_foreign_spore.mjs https://raw.githubusercontent.com/lausiklauskn-png/Mein-Tresor/main/sbkim/spore.json
```
