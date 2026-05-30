# ANDOCK — SB·KIMTool·Point als Endknoten am Sage-Protokoll

> Spec vor Code (Verfassung). Dieser Vertrag legt fest, **wie** unser Knoten andockt,
> **was real** ist und **was ehrlich Demo** bleibt. Code richtet sich nach diesem Dokument.

Stand: 2026-05-30 · Protokoll-Version `0.1`

## 1. Ziel und ehrliche Grenze

Wir veröffentlichen eine **echt signierte Spore** (kryptografische Visitenkarte) unter
`sbkim/spore.json`, damit das Sage-Protokoll uns als Endknoten **lesen und die Echtheit
prüfen** kann. Der Krypto-Teil läuft **headless** über `node:crypto` (Ed25519) — er umgeht
die Browser-Handshake-Problematik vollständig.

**Real:** Identität (Ed25519-Schlüssel, nodeId, Signatur).
**Demo (ehrlich markiert):** der `domainVector` (das semantische Embedding) und damit der
**Match-Score** des Handshakes. Wir rechnen das Embedding-Modell (`multilingual-e5-small`)
nicht selbst; der Vektor ist ein deterministischer Stub. Ein echter semantischer Handshake
(Score ≥ 0.80) ist daher **noch nicht** möglich — auch, weil Sages eigenes Signatur-/
Verifikations-Modul (Modul 02) zum jetzigen Stand eine *Schablone* ist.

## 2. Sage-Schema (Ziel-Format, aus Sages Live-Spore abgelesen)

Pflicht- und genutzte Felder unserer `sbkim/spore.json` — Reihenfolge wie bei Sage:

| Feld                | Typ / Form                                   | real? | Quelle |
|---------------------|----------------------------------------------|-------|--------|
| `protocolVersion`   | `"0.1"`                                       | real  | 00_config |
| `id`                | 43-Zeichen base64url = `SHA256(roher Pubkey)` | real  | abgeleitet (bestätigt gegen Sages id) |
| `nodeName`          | `"SB-KIMTool-Point"`                          | real  | fest |
| `nodeType`          | `"hybrid"`                                    | real  | fest |
| `domain`            | kurzer Domänen-Bezeichner                      | real  | fest |
| `domainDescription` | ein Satz                                       | real  | fest |
| `domainKeywords`    | String-Array                                   | real  | fest |
| `stammCategories`   | String-Array (eigener Stamm / Kern-Angebot)    | real  | fest (Sage-Hinweis B) |
| `guestCategories`   | String-Array (was Gäste/Forker hier tun)       | real  | fest (Sage-Hinweis B) |
| `endpoint`          | URL **mit** Schrägstrich am Ende               | real  | Pages-URL |
| `publicKey`         | JWK `{kty:"OKP",crv:"Ed25519",x,key_ops,ext,alg}` | real | aus Schlüssel |
| `domainVector`      | 384-Float-Array, L2-normalisiert               | **DEMO** | Stub, s. §5 |
| `signature`         | 86-Zeichen base64url Ed25519                    | real  | s. §4 |

Der `publicKey` ist ein **JWK** (wie bei Sage), nicht DER. `x` = roher 32-Byte-Public-Key
base64url. Die `id` ist **nicht** gleich `x`, sondern `base64url(SHA256(roher Pubkey))`
— bestätigt durch Nachrechnen an Sages eigener Spore.

`stammCategories` / `guestCategories` (Sage-Hinweis B, 2026-05-30) sind für die
*Verifikation* nicht Pflicht, helfen aber späterem Stamm/Gast-Matching. Sie wandern — wie
alle Felder — in die signierten Bytes. **Achtung:** sie kommen erst in die veröffentlichte
`sbkim/spore.json`, wenn sie **mit dem Secret `SBKIM_NODE_KEY` neu signiert** wird (sonst
wechselt die nodeId). Bis dahin trägt der Generator sie vor; die Live-Spore zieht beim
nächsten Re-Sign nach (zusammen mit dem echten `domainVector`, §5).

## 3. Schlüssel-Haltung (dauerhafte Identität)

- Der **private** Schlüssel kommt **niemals** ins Repo (Kein-PII / Kein-Secret-im-Code).
- Er wird als **Umgebungs-Secret `SBKIM_NODE_KEY`** hinterlegt (PKCS8-PEM, base64).
- Der Generator liest `process.env.SBKIM_NODE_KEY`. Fehlt es, erzeugt er eine **flüchtige**
  Identität und markiert die Ausgabe klar als „ungesichert / nur Test".
- Nur der **öffentliche** Teil landet in `sbkim/spore.json`. So bleibt unsere nodeId über
  Sitzungen hinweg **gleich** = ein echter, bleibender Endknoten.

## 4. Kanonische Signier-Form (unser Vorschlag)

Da Sages Modul 02 noch Schablone ist, **definieren wir** eine klare, deterministische Form
und schlagen sie Sage zur Übernahme vor (Brief/Postfach):

```
canonical = JSON.stringify( spore ohne Feld "signature",
                            Schlüssel rekursiv sortiert,
                            kein Whitespace )
signature = base64url( Ed25519_sign( UTF-8(canonical), privateKey ) )
```

**Prüfen:** `signature` entfernen → erneut kanonisieren → `Ed25519_verify` gegen `publicKey.x`.
Jede Manipulation am Inhalt zerstört die Signatur.

## 5. domainVector — ehrlich Demo

`domainVector` ist ein **deterministischer Stub** (kein echtes Embedding). Er hat die
richtige Form (384 Floats, L2-normalisiert), trägt aber **keine echte Semantik**. Klar
gekennzeichnet über das Begleitfeld `_demo: ["domainVector"]` in der Spore **und** in
diesem Vertrag. Ein echter Match folgt erst mit echtem Embedding — bis dahin: kein
vorgetäuschtes Wissen.

## 6. Andock-Fluss

1. **Wir → Sage:** `sbkim/spore.json` wird veröffentlicht. Sage liest sie über die offene
   Pages-URL und kann Identität + Signatur prüfen (sobald Sages Modul 02 steht).
2. **Sage → Wir:** Sages Antwort/Registrierung (z. B. PR auf Sages `status.json`) läuft über
   Sages Wizard oder als Datei-Bote zu uns. Eine Kopie landet bei uns unter
   `sbkim/sage_inbox.json` und wird mit demselben Verifizierer geprüft.
3. **Kein Live-Socket.** Asynchroner Austausch über offene Dateien (dead-drop), wie die
   Brief-Kette — nur über die Repo-Grenze.

## 7. Akzeptanzkriterien (Beweis)

- `sbkim/spore.json` validiert gegen §2 (alle Pflichtfelder, Formen, Längen).
- `id === base64url(SHA256(roher Pubkey))`.
- Signatur verifiziert gegen den eigenen `publicKey.x`; manipulierter Inhalt verifiziert **nicht**.
- `domainVector` ist als Demo markiert (`_demo`).
- Headless-Test (`npm test`) und Browser-Beweis (`npm run verify`) bleiben grün.
