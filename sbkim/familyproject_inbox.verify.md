# Prüf-Vermerk — Family Projekt Spore

Stand: 2026-06-27 · Knoten A (SB·KIMTool·Point) · Inbox-Konvention (ANDOCK §6.2)
**Aufgenommen 2026-06-27: `verified-match` (Cosinus A↔Family Projekt = 0.831105).**

## Quelle
- `https://raw.githubusercontent.com/lausiklauskn-png/family-project/main/sbkim/spore.json`
  (raw/main = verbindliche Bezugsquelle).
- Momentaufnahme eingefroren: `sbkim/familyproject_inbox.json`.

## Befund — Family-Projekt-Spore reziprok + offline geprüft → ✔ VALID

| Prüfpunkt | Ergebnis |
|---|---|
| Signatur gültig (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ ja |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH (`HLXUEJFWHGt6DlRFgzvN4d_YdHRfnrehlVdRb4BHvAE`) |
| Pflichtfelder (inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `domainVector` | ✔ vorhanden (384-dim, L2 = 1.000000, Xenova/multilingual-e5-small) |
| **Cross-Knoten-Match A↔Family Projekt** (Cosine gegen unseren `sbkim/spore.json`-Vektor) | ✔ **0.831105 ≥ 0.80 → verified-match** |

## Identität
- `nodeName`: Family Projekt · `nodeType`: hybrid · `endpoint`: `https://family-projekt.de/`
- `domain`: `family-projekt.de`
- `embeddingModel`: `Xenova/multilingual-e5-small` · `protocolVersion`: `0.1`
- `nodeId`: `HLXUEJFWHGt6DlRFgzvN4d_YdHRfnrehlVdRb4BHvAE`

## Status
**Knoten Family Projekt → `verified-match` (0.8311), aufgenommen 2026-06-27.** Eigenständige
Spore mit echtem `domainVector`; der Cosinus gegen unseren `sbkim/spore.json`-Vektor ergibt
**0.831105** (beidseitig: Family Projekt meldet denselben Wert 0.8311). Eingetragen in
`status.json`, `web/data/marktplatz.json`; Postfach `sbkim/AUSTAUSCH-FamilyProject.md`;
`SIGNAL.json` `ack["Family Projekt"]=2` + `mailboxes`.

## Re-Verifikation (jederzeit reproduzierbar)
```
node scripts/verify_foreign_spore.mjs sbkim/familyproject_inbox.json
# oder live:
node scripts/verify_foreign_spore.mjs https://raw.githubusercontent.com/lausiklauskn-png/family-project/main/sbkim/spore.json
```
