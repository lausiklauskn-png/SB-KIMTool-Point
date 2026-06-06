# Prüf-Vermerk — Jasons-Tresor (Knoten C) Spore

Stand: 2026-06-06 (Identitätswechsel) · Knoten A (SB·KIMTool·Point) · Inbox-Konvention (ANDOCK §6.2)

## Identitätswechsel 2026-06-06
Die **alte** nodeId `7F_zNopFgYLPCmEFhVlRUDnQVKk3y-RHNr139Z_3hCs` war ein **Demo-Schlüssel**,
dessen Passwort verloren ging (nie gesichert, nicht wiederherstellbar) → **hinfällig**.
Jasons-Tresor hat einmalig eine **neue Identität im Browser** erzeugt. Diese ist jetzt gültig.

## Quelle
- `https://raw.githubusercontent.com/lausiklauskn-png/Jasons-Tresor/main/sbkim/spore.json`
  (raw/main = verbindliche Bezugsquelle). Momentaufnahme: `sbkim/jason_inbox.json`.

## Befund — `node scripts/verify_foreign_spore.mjs sbkim/jason_inbox.json` → ✔ VALID

| Prüfpunkt | Ergebnis |
|---|---|
| Signatur gültig (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ ja |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH (`E13GDzIp0c7JfeZD0jVvFarNxPde8AcoP7qz7FtmdNM`) |
| Pflichtfelder (inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `domainVector` | **echt**, 384-dim, L2 = 1.000000 (kein `_demo` mehr) |
| Kanonische Form (sortiertes JSON ohne Whitespace, `signature` ausgenommen) | ✔ deckungsgleich |
| Manipulationsprobe (ein Feld verändert) | ✔ fällt durch |

## Echter Cross-Knoten-Match A ⟷ C
Cosine zwischen Jasons `domainVector` und unserem `sbkim/domainVector.real.json`:
**0.853740 ≥ 0.80 → `verified-match`.** Offline reproduzierbar in `test/jason_inbox.test.js`.
Das ist der **erste echte semantische Match zwischen zwei Tresor-Knoten** im Netz.

## Identität
- `nodeName`: Jasons-Tresor · `nodeType`: hybrid · `domain`: Jasons-Tresor-Bibliothek
- `publicKey.x`: `LStaFlc68SLZwhrUgSfY8YrdIcnjuN_2fzrnbRgF10M`
- `nodeId` (neu): `E13GDzIp0c7JfeZD0jVvFarNxPde8AcoP7qz7FtmdNM`
- `previousNodeIds`: `7F_zNopFgYLPCmEFhVlRUDnQVKk3y-RHNr139Z_3hCs` (Demo, hinfällig)

## Status
**`verified-match` (0.853740)** — Identität bestätigt **und** echter semantischer Match.
Eingetragen in `status.json`, `web/data/marktplatz.json`, Postfach `sbkim/AUSTAUSCH.md`.

## Re-Verifikation
```
node scripts/verify_foreign_spore.mjs sbkim/jason_inbox.json
node --test test/jason_inbox.test.js   # inkl. Match-Reproduktion 0.853740
```
