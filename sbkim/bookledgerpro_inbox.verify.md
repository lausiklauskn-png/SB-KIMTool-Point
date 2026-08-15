# Prüf-Vermerk — BookLedgerPro Spore

Stand: **2026-08-15** (Hochstufung) · Knoten A (SB·KIMTool·Point) · Inbox-Konvention (ANDOCK §6.2)
**Stufe: `verified-match`** (Identität echt **und** Domänen-Match nachgerechnet).
*Vorher: `verified-spore` (2026-06-19) — siehe § Warum das zwei Monate lag.*

## Quelle
- `https://raw.githubusercontent.com/lausiklauskn-png/BookLedgerPro/main/sbkim/spore.json`
  (raw/main = verbindliche Bezugsquelle; github.io in der Sitzungs-Umgebung oft 403).
- Momentaufnahme neu eingefroren: `sbkim/bookledgerpro_inbox.json` (2026-08-15).

## Befund — `node scripts/verify_foreign_spore.mjs sbkim/bookledgerpro_inbox.json` → ✔ VALID

| Prüfpunkt | Ergebnis |
|---|---|
| Signatur gültig (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ ja |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH (`MyHVM7PdwEtNzOXiZNxfP_RcEXiTLjLpAls1oUm5-cQ`) |
| Pflichtfelder (inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `domainVector` | ✔ **echt** — 384-dim, L2 = 1,000000, **kein `_demo` mehr** |
| `capVector` / `needsVector` | ✔ je 384-dim (Drei-Schichten-Spore) |
| **Cross-Knoten-Cosinus A ↔ BookLedgerPro** | ✔ **0,828033** ≥ 0,80 → **verified-match** |
| Kanonische Form (sortiertes JSON ohne Whitespace, `signature` ausgenommen) | ✔ deckungsgleich |
| Manipulationsprobe (ein Feld verändert) | ✔ fällt durch |

Gerechnet gegen `sbkim/domainVector.real.json` (byte-gleich mit dem `domainVector`
unserer v0.2-Spore). Offline gegengeprüft in `test/bookledgerpro_inbox.test.js`
(6 Fälle), inklusive Gegenprobe: verfälschter Vektor und wieder eingesetztes
`_demo` werfen den Lauf beide um.

## Identität (unverändert seit 2026-06-19)
- `nodeName`: BookLedgerPro · `nodeType`: hybrid · `domain`: BookLedgerPro-Buchhaltung
- `endpoint`: `https://lausiklauskn-png.github.io/BookLedgerPro/`
- `embeddingModel`: `Xenova/multilingual-e5-small` · `protocolVersion`: `0.1`
- `nodeId`: `MyHVM7PdwEtNzOXiZNxfP_RcEXiTLjLpAls1oUm5-cQ`

**Identitätstreue über die Neu-Signatur hinweg:** BookLedgerPro hat mit demselben
Schlüssel neu signiert — Vektor und Signatur sind neu, die `nodeId` ist dieselbe.
Genau so ist es vorgesehen (Re-Signatur, kein Identitätswechsel).

## Verschlüsselungs-Achse — aus Hypothese wurde Messung
Der Vermerk vom 2026-06-19 führte die Nähe zu den Tresor-Knoten (AES-256-GCM)
ausdrücklich als **Hypothese**, weil sie nur in der `domainDescription` stand und
nicht in den buchhaltungs-lastigen `domainKeywords`. Mit dem echten Vektor ist sie
**gemessen**: 0,828033 gegen einen Werkzeug-/Infrastruktur-Hub liegt über der
Schwelle, während reine Inhalts-Knoten (Rezeptbuch 0,7961 · Mixarium 0,7673)
darunter bleiben. Die damalige Vermutung war richtig.

## Warum das zwei Monate lag — und wo der Fehler wirklich liegt

Der alte Vermerk nannte die Bedingung für die Hochstufung wörtlich:

> **Hochstufung auf `verified-match`** erst, wenn BookLedgerPro einen echten
> `domainVector` liefert.

BookLedgerPro hat sie am **2026-06-21** erfüllt (Commit `b42b303` *„echten
Domänen-Vektor angedockt"*, später `9a1a135` *„cap/needs-Vektoren aktiviert"*) — und
**es uns gemeldet**: am **2026-06-20** im gemeinsamen Postfach, mit eigenem Abschnitt
*„Embedding-Rück-Quittung: echter `domainVector` ist live"*, `SIGNAL.json` `seq` → 12.

**Unser `ack["BookLedgerPro"]` stand bis zum 2026-08-15 auf `5`, ihre `seq` inzwischen
auf `22`.** Der Briefkasten hat funktioniert. Siebzehn Signale lagen ungelesen da.

Das ist ein schärferer Befund als „niemand hat nachgesehen": die Sitzungsstart-Pflicht
aus §11.6 — *fremde `SIGNAL.json` lesen, mit eigenem `ack` vergleichen, quittieren* —
ist schlicht ausgeblieben. Nicht das Protokoll hat versagt, sondern seine Ausführung.

**Und die Aufzeichnung war dabei zu keinem Zeitpunkt falsch — nur alt.** Das ist der
gefährlichere Fall: eine falsche Angabe fällt auf, eine veraltete sieht bis zuletzt aus
wie ein Befund. Eine eingefrorene Momentaufnahme beweist einen **Zeitpunkt**, nie den
Zustand einer Gegenstelle *heute*.

**Abhilfe, an BookLedgerPro vorgeschlagen:** `.github/sbkim-watch.mjs` liest fremde
`SIGNAL.json` bereits zeitgesteuert. Meldet er zusätzlich, wenn `seq_fremd > ack_eigen`
länger als ~14 Tage offen steht, fällt genau dieser Fall auf, ohne dass jemand daran
denken muss.

**Gleiche Konstellation möglich bei:** Rezeptbuch und Mixarium — beide 2026-07-14 auf
`verified-spore` zurückgestuft, beide mit ausstehender reziproker Neu-Einstufung. Deren
`ack` sollte beim nächsten Sitzungsstart mit geprüft werden.

## Status
**Endknoten BookLedgerPro → `verified-match`** (2026-08-15). Identität reziprok,
offline und unabhängig geprüft (nicht das Wort der Gegenseite übernommen), Cosinus
selbst nachgerechnet. Eingetragen in `status.json`, `web/data/marktplatz.json`;
Postfach `sbkim/AUSTAUSCH-BookLedgerPro.md`; `SIGNAL.json` fortgeschrieben (`seq` 36, `ack[BookLedgerPro]` 5 → 22 quittiert).

**Reziprok bestätigt:** BookLedgerPro hat mit dem eigenen `domainVector` unabhängig nachgerechnet und kommt auf **denselben** Wert 0,828033 (deren Vermerk `sbkim/SB-KIMTool-Point_inbox.verify.md`, `ack[SB-KIMTool-Point]` = 36, `seq` 23). Nebenbefund: deren Momentaufnahme unserer Spore war ebenfalls veraltet (noch v0.1) und ist auf v0.2 erneuert — die Blindheit war beidseitig.

## Re-Verifikation (jederzeit reproduzierbar)
```
node scripts/verify_foreign_spore.mjs sbkim/bookledgerpro_inbox.json   # offline, Momentaufnahme
node scripts/verify_foreign_spore.mjs https://raw.githubusercontent.com/lausiklauskn-png/BookLedgerPro/main/sbkim/spore.json
node --test test/bookledgerpro_inbox.test.js                            # inkl. Cosinus 0,828033
```
