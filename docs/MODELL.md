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

Die **Rollen-Kette** (Ingenieur → Bauer → Gate/Arzt → Beobachter, siehe `BAUTRUPP.md`)
entwirft Ideen, baut Artefakte, prüft sie und vergibt Siegel. Zwei **Negativbauer**
(Sybil) fluten mit getarnten Fälschungen — und werden nachweislich aussortiert
(Stimmgewicht 0 → Misstrauen über Schwelle → Blocklist → Apoptose).

## Der aufgezeichnete Lauf (`web/data/run.json`, Vertrag v0.2)

`npm run demo` schreibt einen Lauf nach dem Datenvertrag **v0.2**. Die Seite liest nur
dieses JSON und **erfindet nichts** — alle Titel/Arten/Beschreibungen stammen aus dem
Modell-Lauf:

- `protocolVersion: "0.2"`, `roles: [ingenieur, bauer, gate_arzt, beobachter, negativbauer]`.
  **Achtung — zwei verschiedene Versionen:** dieses Feld trägt (aus historischen Gründen
  so benannt) die **Run-Vertrags-Version** `0.2`. Das ist **nicht** die Sage-Protokoll-Version
  `0.1` (`PROTOCOL_VERSION` aus `00_config.js`, steckt in der Spore-Identität). In
  `status.json` heißen sie korrekt getrennt: `protocolVersion: 0.1` (Sage) vs.
  `runContractVersion: 0.2` (dieser Lauf). Beide sind **absichtlich verschieden** — die
  `0.1` nicht auf `0.2` ziehen; bei Abweichung gilt Sage.
- `artefacts[]` — je Objekt `id`, `kind` (hintergrund-tool | standalone-pwa | tool |
  webseite), `title`, `description`, `proposedBy`, `builtBy`, `status` (entwurf | gebaut
  | geprueft | graduiert | verworfen), `repaired`, `downloadable` (nur bei `graduiert`).
- `events[]` — geordnet über `t`; Phasen `idee` · `build` · `sybil` · `verdict`. Ein
  `verdict` mit `flagged: true` löst die Apoptose-Animation (grün→orange→rot) aus.
- `summary` + `edgeCases` wie bisher.

`modell.html` + `assets/model.js` spielen diesen Lauf als **animierte Pipeline** ab
(aktiver Agent leuchtet, Artefakt wandert als Lichtpunkt, Angriff stirbt sichtbar) —
**Playback, kein Live-Lauf.** `prefers-reduced-motion` wird respektiert (Ruhe-Variante).

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
