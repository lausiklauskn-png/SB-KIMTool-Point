# Satz-Schnipsel (`snippetVectors`) für SB·KIMTool·Point — Spore v0.2 (A10)

> **Optional, fail-soft.** Fehlt die Datei `snippetVectors.real.json`, signiert
> `scripts/generate_spore.mjs` die Spore ehrlich **ohne** Schnipsel (v0.2 bleibt).
> Die Schnipsel sind **reine Anzeige/Verwandt-Messung** — sie gaten nichts, der
> 0.80-Andock-Riegel bleibt unberührt.

## Was das ist

Spore v0.2 (A6+A10) erlaubt ein optionales Feld **`snippetVectors`**: bis zu **20**
satz-granulare, 384-dim, L2-normalisierte Vektoren (`{vec, text?}`), damit ein
Suchender die Frage nicht nur gegen den gemittelten `domainVector`, sondern gegen
**einzelne Sätze** der Domänen-Beschreibung vergleichen kann („verwandt über die
Bedeutung"). Deckungsgleich zu Sage Modul 02 (`snippetVectors`) / INTERFACES §0.

## Wie die Datei erzeugt wird (reproduzierbar, wie beim `domainVector`)

Headless ging das Embedding bei uns nie (HF/jsdelivr 403). Klaus erzeugt die
Vektoren im **Browser** mit Sages `tools/embed_helper.html`, **Abschnitt „A10 —
snippetVectors"** (byte-gleich Modul 03 `embedSnippets`):

1. `tools/embed_helper.html` (aus dem Sage-Repo) im Browser öffnen.
2. Im A10-Abschnitt den **Domänen-Text** eingeben (satz-weise zerlegt → je ein
   Vektor). Empfehlung: denselben Text wie für `domainVector.real.json` (siehe
   `domainVector.real.README.md`), gern zu einem **ausführlicheren Absatz** erweitert
   (mehr Sätze = mehr aussagekräftige Schnipsel, max 20). **Kein PII.**
3. *Schnipsel-Vektoren erzeugen* → Ergebnis ist `{ snippetVectors: [{ vec, text }] }`.
4. Als **`sbkim/snippetVectors.real.json`** in dieses Repo speichern (das blanke
   `{snippetVectors:[…]}`-Objekt **oder** direkt das innere Array — der Generator
   akzeptiert beides).

## Neu signieren (Termux/Node, mit dem bleibenden Schlüssel)

Der private Schlüssel liegt verschlüsselt in `sbkim/node_key.enc.json` und wird mit
Klaus' Passwort geöffnet (`SBKIM_KEY_PW`). Der Schlüssel verlässt das Gerät nie; nur
die **öffentliche** `spore.json` wird committet.

```bash
# Schlüssel öffnen + Spore neu signieren (nodeId bleibt gleich):
SBKIM_NODE_KEY="$(SBKIM_KEY_PW='DEIN-PASSWORT' node scripts/open_node_key.mjs)" \
  node scripts/generate_spore.mjs
# -> schreibt sbkim/spore.json (protocolVersion 0.2, echter domainVector erhalten,
#    snippetVectors angehängt falls die Datei da ist). Danach committen/pushen.
```

**Prüfung:** `npm test` (headless Beweis) muss grün bleiben; die Signatur der neuen
`spore.json` läuft weiterhin durch Sages Verifizierer (0.1↔0.2 handshake-kompatibel).
