# Prüf-Vermerk — Jasons-Tresor (Knoten C) Spore

Stand: 2026-05-31 · Knoten A (SB·KIMTool·Point) · Inbox-Konvention (ANDOCK §6.2)

## Quelle
- Live: `https://lausiklauskn-png.github.io/Jasons-Tresor/sbkim/spore.json`
- Geholt über: `https://raw.githubusercontent.com/lausiklauskn-png/Jasons-Tresor/main/sbkim/spore.json`
  (github.io in der Andock-Sitzungs-Umgebung 403 → `raw/main` als Bezugsquelle; **byte-gleich**
  zur Momentaufnahme `sbkim/jason_inbox.json`).

## Befund — `node scripts/verify_foreign_spore.mjs sbkim/jason_inbox.json` → ✔ VALID

| Prüfpunkt | Ergebnis |
|---|---|
| Signatur gültig (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ ja |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH (`7F_zNopFgYLPCmEFhVlRUDnQVKk3y-RHNr139Z_3hCs`) |
| Pflichtfelder (inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `domainVector` | 384 Floats, **`_demo`** (ehrlich Stub → **kein** Match) |
| Kanonische Form (sortiertes JSON ohne Whitespace, `signature` ausgenommen) | ✔ deckungsgleich |
| Manipulationsprobe (ein Feld verändert) | ✔ fällt durch |

## Identität
- `nodeName`: Jasons-Tresor · `nodeType`: hybrid · `domain`: Jasons-Tresor-Bibliothek
- `publicKey.x`: `NIclmThJRm4dg2AI0f9B61KFs6aXgQWC2yzrr5gRV9c`
- `nodeId`: `7F_zNopFgYLPCmEFhVlRUDnQVKk3y-RHNr139Z_3hCs`

## Status
**Aufgenommen als Endknoten C → `verified-spore`** (Identität bestätigt; Match später mit
echtem `domainVector`). Eingetragen in `status.json`, `web/data/marktplatz.json`, Postfach
`sbkim/AUSTAUSCH.md` §13. Offline gegengeprüft in `test/jason_inbox.test.js`.

## Re-Verifikation (jederzeit reproduzierbar)
```
node scripts/verify_foreign_spore.mjs sbkim/jason_inbox.json
# oder live:
node scripts/verify_foreign_spore.mjs https://lausiklauskn-png.github.io/Jasons-Tresor/sbkim/spore.json
```
