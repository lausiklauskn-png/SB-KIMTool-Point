# Prüf-Vermerk — sbkim/sage_inbox.json (Sages Spore, eingegangen)

> ⚠ **NEUE FASSUNG AM 2026-09-10.** Sage hat neu signiert — **neue Kennung**
> `BgjXhSApoOrJD6zFJ4uuEpAliGWPokpKn7UMWRm94PA`
> (vorher `nysOZE3VuKqZA23i5G2XL67s41JIIykI58zXMtJkYfA`).
>
> Die hier abgelegte Adresskarte war besonders alt: **Protokoll-Fassung 0.1**,
> 135 Zeichen Beschreibung, **null** Satz-Schnipsel. Die neue ist **0.2**,
> 3028 Zeichen, 50 Stichworte,
> 17 Schnipsel. Reziprok geprüft: **✔ VALID** ·
> `id == base64url(SHA256(rawPub))` · kein `d` · `key_ops` nur `["verify"]` ·
> L2 = 0.999999927 · kein `_demo`.
>
> Cross-Knoten-Score gegen unsere Spore: **≈ 0.8930** (vorher ≈ 0.8618) — der
> Wert ist **gestiegen**, weil die alte Karte nur 135 Zeichen trug.
>
> **Der Vermerk darunter bleibt unverändert.** Er belegt, was am jeweiligen
> Datum galt.

> Begleit-Vermerk zu `sage_inbox.json` (ANDOCK §6.2: „Kopie + Prüf-Vermerk").
> Die `.json` daneben ist eine **originalgetreue, unveränderte** Kopie von Sages Spore —
> bewusst signatur-rein (kein Zusatzfeld, das die Signatur zerstören würde). Dieser
> Vermerk hält das Prüf-Ergebnis fest; der reproduzierbare Beweis ist `test/sage_inbox.test.js`.

- **Quelle:** `https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/sbkim/spore.json`
- **Gelesen / geprüft:** 2026-05-30
- **Verifizierer:** `scripts/verify_foreign_spore.mjs` (headless, `node:crypto`, unsere kanonische Form ANDOCK §4)
- **Befehl:** `node scripts/verify_foreign_spore.mjs sbkim/sage_inbox.json`

## Ergebnis: ✔ VALID

| Prüfpunkt | Ergebnis |
|---|---|
| Signatur (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ gültig |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH |
| Pflichtfelder (inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| Manipulationsprobe (ein Feld verändert) | ✔ fällt durch |

- **nodeName:** `Sage` · **nodeType:** `hybrid` · **domain:** `Mycel-Bibliothek`
- **nodeId:** `nysOZE3VuKqZA23i5G2XL67s41JIIykI58zXMtJkYfA`
- **publicKey.x:** `gzAWXKluwNale_0CH24sV5BzAv5LQQsUdYJiKMD6HwA`
- **domainVector:** 384 Floats (Sage: echtes Embedding)

Damit ist die Andock-Identität **beidseitig** kryptografisch bestätigt — Sages Form und
unsere sind byte-deckungsgleich.
