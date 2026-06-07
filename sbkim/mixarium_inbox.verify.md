# Prüf-Vermerk — Mein-Mixarium (Knoten F) Spore

Stand: 2026-06-07 · Knoten A (SB·KIMTool·Point) · Inbox-Konvention (ANDOCK §6.2)
**Aufgenommen 2026-06-07: `verified-match` (Cosinus A↔F = 0.802994).**

## Quelle
- `https://raw.githubusercontent.com/lausiklauskn-png/Mein-Mixarium/main/sbkim/spore.json`
- Momentaufnahme eingefroren: `sbkim/mixarium_inbox.json`.

## Befund — `node scripts/verify_foreign_spore.mjs sbkim/mixarium_inbox.json` → ✔ VALID

| Prüfpunkt | Ergebnis |
|---|---|
| Signatur gültig (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ ja |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH (`B7Fke9CYTR1BrC3xOXzEY5q9RuRH8xxHPUuqRHV3utA`) |
| Pflichtfelder (inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `domainVector` | ✔ vorhanden (384-dim, L2≈1, Xenova/multilingual-e5-small) |
| **Cross-Knoten-Match A↔F** (Cosine gegen unseren `sbkim/spore.json`-Vektor) | ✔ **0.802994 ≥ 0.80 → verified-match** |
| Manipulationsprobe (ein Feld verändert) | ✔ fällt durch |

## Identität
- `nodeName`: Mixarium Klaus · `endpoint`: `https://lausiklauskn-png.github.io/Mein-Mixarium/`
- `embeddingModel`: `Xenova/multilingual-e5-small` · `protocolVersion`: `0.1`
- `nodeId`: `B7Fke9CYTR1BrC3xOXzEY5q9RuRH8xxHPUuqRHV3utA`

## Status
**Endknoten F → `verified-match` (0.8030), aufgenommen 2026-06-07.** Der Cosinus gegen unseren
`sbkim/spore.json`-Vektor ergibt **0.802994** (knapp, aber ehrlich ≥ 0.80; Mein-Mixarium rechnet
denselben Wert). Eingetragen in `status.json`, `web/data/marktplatz.json`; als Peer in
`.github/sbkim-watch.mjs` + `assets/netz-briefkasten.js`; Postfach `sbkim/AUSTAUSCH-Mixarium.md`;
`SIGNAL.json` `ack["Mein-Mixarium"]=5`. Offline gegengeprüft in `test/mixarium_inbox.test.js`.

## Re-Verifikation (jederzeit reproduzierbar)
```
node scripts/verify_foreign_spore.mjs sbkim/mixarium_inbox.json
# oder live:
node scripts/verify_foreign_spore.mjs https://raw.githubusercontent.com/lausiklauskn-png/Mein-Mixarium/main/sbkim/spore.json
```
