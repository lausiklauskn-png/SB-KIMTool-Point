# Prüf-Vermerk — Mein-Tresor (Knoten D) Spore

Stand: 2026-06-06 · Knoten A (SB·KIMTool·Point) · Inbox-Konvention (ANDOCK §6.2)

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
| `domainVector` | **fehlt** (bewusst weggelassen, kein Demo-Stub) → **kein** Match |
| Kanonische Form (sortiertes JSON ohne Whitespace, `signature` ausgenommen) | ✔ deckungsgleich |
| Manipulationsprobe (ein Feld verändert) | ✔ fällt durch |

## Identität
- `nodeName`: Mein-Tresor · `nodeType`: hybrid · `domain`: Mein-Tresor-Bibliothek
- `endpoint`: `https://lausiklauskn-png.github.io/Mein-Tresor/`
- `embeddingModel`: `Xenova/multilingual-e5-small` · `protocolVersion`: `0.1`
- `nodeId`: `wRsGQouOYPVBOLzAB3nBteRvyvJ-AGv461WTJMKtkS0`

## Status
**Aufgenommen als Endknoten D → `verified-spore`** (Identität bestätigt). Eingetragen in
`status.json`, `web/data/marktplatz.json`, Postfach `sbkim/AUSTAUSCH-MeinTresor.md`. Offline
gegengeprüft in `test/meintresor_inbox.test.js`. **`verified-match`** folgt, sobald Mein-Tresor
einen echten 384-dim `domainVector` (Xenova/multilingual-e5-small, L2≈1) ergänzt und die Spore
neu signiert (gleicher Schlüssel → gleiche nodeId).

## Re-Verifikation (jederzeit reproduzierbar)
```
node scripts/verify_foreign_spore.mjs sbkim/meintresor_inbox.json
# oder live:
node scripts/verify_foreign_spore.mjs https://raw.githubusercontent.com/lausiklauskn-png/Mein-Tresor/main/sbkim/spore.json
```
