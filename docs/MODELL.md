# Das Modell — was es durchspielt (und was nicht)

Wir nennen es **Modell**, nicht „Orakel": wissenschaftlicher Bezug statt Raten oder
mystischer Erkenntnis. Es ist ein **headless Node-Durchlauf** (reiner Code, keine
Browser-Wände), der Protokoll-Logik vorab durchspielt, damit eine bewährte Lösung
in die echten Tools zurückgeholt werden kann.

## Was das Modell durchspielt

Genau die in Sage **vorgebauten, schlummernden** Immunmodule:

- **10 Reputation** — Misstrauen sammeln, Stimmgewicht = bezeugte Bau-Taten.
- **12 Blocklist** — geflaggte Angreifer meiden.
- **07 Apoptose** — erzwungener Selbst-Tod mit signiertem Vermächtnis.
- **14 Diffusion** — Vermächtnis verbreiten.
- **16 SBKIM-Siegel** — „Tun statt Sein", die Verschränkung mit der Reputation.
- **02 Spore** — echte Ed25519-Identität als Fundament.

Die 3-Rollen-Schleife (Bauer → Gate/Arzt → Beobachter, siehe `BAUTRUPP.md`) erzeugt
Artefakte, prüft sie und vergibt Siegel. Zwei Sybil-Knoten fluten mit gefälschten
Artefakten — und werden nachweislich aussortiert (Stimmgewicht 0 → Misstrauen über
Schwelle → Blocklist → Apoptose).

## Was das Modell NICHT ist

- **Kein Live-Browser-Lauf.** Das Modell läuft in Node. Die statische Seite spielt
  nur den **aufgezeichneten** Lauf (`web/data/run.json`) als Board ab.
- **Kein echtes Embedding.** Xenova läuft im Browser; im Modell ist Match/Embedding
  deterministisch gestubt und als Demo markiert.
- **Kein Browser-Transport.** Adressbuch/Postfach über das Netz ist die „offene Wand"
  (Server-Zeh-Entscheidung bewusst vertagt).

## Der Beweis

Der Beweis ist der **headless Smoke-Test** (`npm test`), nicht die Seite:

1. Spore-Signatur verifiziert echt (und scheitert bei Manipulation).
2. Ehrliches Artefakt graduiert und erhält ein Siegel.
3. Gefälschtes Sybil-Artefakt wird verworfen, kein Siegel.
4. Ein Knoten ohne bezeugte Bau-Tat hat **0 Stimmgewicht**.
5. Sybil-Flut überschreitet die Misstrauensschwelle → geflaggt + signierte Apoptose.

## Konstanten

Echte Sage-Werte in `sandbox/00_config.js` gespiegelt (`PROTOCOL_VERSION`,
`EMBEDDING_MODEL`, `EMBEDDING_DIM`, `PROVIDER_MIN_MATCH`, `QUERY_TIMEOUT_MS`).
`REP_DISTRUST_RATIO = 0.15` ist ein **Modell-Vorschlag**, klar als solcher markiert —
er wird, wenn er sich bewährt, nach Sage Modul 10 zurückgeholt.
