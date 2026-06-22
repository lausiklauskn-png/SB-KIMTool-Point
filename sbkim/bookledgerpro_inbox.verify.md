# Prüf-Vermerk — BookLedgerPro Spore

Stand: 2026-06-19 · Knoten A (SB·KIMTool·Point) · Inbox-Konvention (ANDOCK §6.2)
**Stufe: `verified-spore`** (Identität echt; Domänen-Match bewusst **offen**, `domainVector` ist `_demo`).

## Quelle
- `https://raw.githubusercontent.com/lausiklauskn-png/BookLedgerPro/main/sbkim/spore.json`
  (raw/main = verbindliche Bezugsquelle; github.io in der Sitzungs-Umgebung oft 403).
- Momentaufnahme eingefroren: `sbkim/bookledgerpro_inbox.json`.

## Befund — `node scripts/verify_foreign_spore.mjs sbkim/bookledgerpro_inbox.json` → ✔ VALID

| Prüfpunkt | Ergebnis |
|---|---|
| Signatur gültig (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ ja |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH (`MyHVM7PdwEtNzOXiZNxfP_RcEXiTLjLpAls1oUm5-cQ`) |
| Pflichtfelder (inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `domainVector` | ⚠ vorhanden (384-dim), aber **`_demo`** markiert → **kein** echtes Embedding |
| **Cross-Knoten-Match** | — **nicht berechnet** (Demo-Vektor); **keine Match-Aussage** |
| Kanonische Form (sortiertes JSON ohne Whitespace, `signature` ausgenommen) | ✔ deckungsgleich |
| Manipulationsprobe (ein Feld verändert) | ✔ fällt durch |

## Identität
- `nodeName`: BookLedgerPro · `nodeType`: hybrid · `domain`: BookLedgerPro-Buchhaltung
- `endpoint`: `https://lausiklauskn-png.github.io/BookLedgerPro/`
- `embeddingModel`: `Xenova/multilingual-e5-small` · `protocolVersion`: `0.1`
- `nodeId`: `MyHVM7PdwEtNzOXiZNxfP_RcEXiTLjLpAls1oUm5-cQ`

## Domäne (kurz)
Offline-first, **verschlüsselte** Buchhaltung: Belege, Konten, USt/EÜR, GoBD + Hash-Kette,
Aufträge/Kunden. E2E-Krypto (AES-Familie, `crypto.subtle`).

## Verschlüsselungs-Achse (Hypothese, **keine** Match-Aussage)
BookLedgerPro ist thematisch mit den Tresor-Knoten (Jasons-/Mein-Tresor: AES-256-GCM) verwandt.
Diese Nähe steht bisher **nur** in der `domainDescription`, **nicht** in den
buchhaltungs-fokussierten `domainKeywords`. Ob ein echter `domainVector` die Nähe zeigt, ist
**erst nach dem echten Embedding** (multilingual-e5-small, L2=1) bewertbar. BookLedgerPro hat
zugesagt, die Krypto-/E2E-Nähe beim echten Vektor ausdrücklich in den eingebetteten
Domänen-Text aufzunehmen (Re-Signatur mit bestehendem Schlüssel, nodeId bleibt). Bis dahin:
**nur Hypothese.**

## Status
**Endknoten BookLedgerPro → `verified-spore`** (2026-06-19). Identität reziprok, offline und
unabhängig geprüft (nicht das Wort der Gegenseite übernommen). Eingetragen in `status.json`,
`web/data/marktplatz.json`; Postfach `sbkim/AUSTAUSCH-BookLedgerPro.md`. Offline gegengeprüft in
`test/bookledgerpro_inbox.test.js`. **Hochstufung auf `verified-match`** erst, wenn BookLedgerPro
einen echten `domainVector` liefert (von der Gegenseite ehrlich als offen gemeldet: hängt davon
ab, ob Transformers.js/WASM build-frei ohne CDN läuft).

## Re-Verifikation (jederzeit reproduzierbar)
```
node scripts/verify_foreign_spore.mjs sbkim/bookledgerpro_inbox.json   # offline, Momentaufnahme
node scripts/verify_foreign_spore.mjs https://raw.githubusercontent.com/lausiklauskn-png/BookLedgerPro/main/sbkim/spore.json
```
