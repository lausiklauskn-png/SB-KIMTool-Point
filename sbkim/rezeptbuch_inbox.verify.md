# Prüf-Vermerk — Mein-Rezeptbuch (Knoten E) Spore

Stand: 2026-06-07 · Knoten A (SB·KIMTool·Point) · Inbox-Konvention (ANDOCK §6.2)
**Aufgenommen 2026-06-07: `verified-match` (Cosinus A↔E = 0.832019).**

## Quelle
- `https://raw.githubusercontent.com/lausiklauskn-png/Mein-Rezeptbuch/main/sbkim/spore.json`
  (raw/main = verbindliche Bezugsquelle).
- Momentaufnahme eingefroren: `sbkim/rezeptbuch_inbox.json`.

## Befund — `node scripts/verify_foreign_spore.mjs sbkim/rezeptbuch_inbox.json` → ✔ VALID

| Prüfpunkt | Ergebnis |
|---|---|
| Signatur gültig (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ ja |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH (`uOpUBezUVbOMsVd2C9BkHW80agnLx5tCx_nIRy2KkXg`) |
| Pflichtfelder (inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `domainVector` | ✔ vorhanden (384-dim, L2≈1, Xenova/multilingual-e5-small) |
| **Cross-Knoten-Match A↔E** (Cosine gegen unseren `sbkim/spore.json`-Vektor) | ✔ **0.832019 ≥ 0.80 → verified-match** |
| Manipulationsprobe (ein Feld verändert) | ✔ fällt durch |

## Identität
- `nodeName`: Rezeptbuch Klaus · `nodeType`: hybrid · `endpoint`: `https://lausiklauskn-png.github.io/Mein-Rezeptbuch/`
- `embeddingModel`: `Xenova/multilingual-e5-small` · `protocolVersion`: `0.1`
- `nodeId`: `uOpUBezUVbOMsVd2C9BkHW80agnLx5tCx_nIRy2KkXg`

## Status
**Endknoten E → `verified-match` (0.8320), aufgenommen 2026-06-07.** Eigenständige Spore mit
echtem `domainVector`; der Cosinus gegen unseren `sbkim/spore.json`-Vektor ergibt **0.832019**
(beidseitig: Mein-Rezeptbuch rechnet denselben Wert). Eingetragen in `status.json`,
`web/data/marktplatz.json`; als Peer in `.github/sbkim-watch.mjs` + `assets/netz-briefkasten.js`;
Postfach `sbkim/AUSTAUSCH-Rezeptbuch.md`; `SIGNAL.json` `ack["Mein-Rezeptbuch"]=2`. Offline
gegengeprüft in `test/rezeptbuch_inbox.test.js`.

## Re-Verifikation (jederzeit reproduzierbar)
```
node scripts/verify_foreign_spore.mjs sbkim/rezeptbuch_inbox.json
# oder live:
node scripts/verify_foreign_spore.mjs https://raw.githubusercontent.com/lausiklauskn-png/Mein-Rezeptbuch/main/sbkim/spore.json
```
