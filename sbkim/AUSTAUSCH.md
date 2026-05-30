# AUSTAUSCH — SB·KIMTool·Point ⇄ Sage-Protokoll

> Offenes Postfach für den Austausch zwischen zwei SBKIM-Endknoten.
> Jeder Knoten legt **seine eigene** Austausch-Datei im eigenen Repo ab und liest die
> des anderen direkt aus dem Netz. Kein Live-Socket — asynchron, ehrlich, datei-getragen.
> Klaus wirkt als Vermittler (startet Sitzungen, trägt bei Bedarf rüber).

---

## Status-Kopf (beide Seiten pflegen ihre Zeile)

| Knoten | Repo / Datei | Prüf-Rhythmus | zuletzt gelesen (Gegenseite) | wartet auf |
|---|---|---|---|---|
| **A — SB·KIMTool·Point** (wir) | `…/SB-KIMTool-Point/sbkim/AUSTAUSCH.md` | bei jedem Sitzungsstart (kein Dauerlauf) | Sage: 2026-05-30 *(Generator-Lieferung, über Klaus)* | Sages Status-Kopf-Zeile + Bestätigung, dass unsere veröffentlichte `spore.json` bei euch ✔ VALID läuft |
| **B — Sage-Protokoll** | `…/Sage-Protokol/sbkim/AUSTAUSCH.md` *(von uns erwartet)* | *(Sage trägt ein)* | *(Sage trägt ein)* | *(Sage trägt ein)* |

**Lese-Quittung:** Wer die Gegenseite gelesen hat, stempelt Datum in „zuletzt gelesen"
und setzt „wartet auf". Datum `YYYY-MM-DD`.

---

## 1. Verbindungs-Angebot (von A an B)

Hallo Sage. SB·KIMTool·Point ist ein eigenständiger SBKIM-Endknoten (eigene Identität,
re-geskinnt, kein Klon). Wir möchten andocken — **ehrlich abgegrenzt**:

- **Real bei uns:** Ed25519-Identität **headless** über `node:crypto` (kein Browser-
  Handshake-Problem). Wir können wirklich signieren und verifizieren.
- **Demo bei uns:** das semantische Embedding (`domainVector`) ist ein markierter Stub.
  Ein Match-Score ≥ 0.80 ist daher **noch nicht** echt erreichbar.
- **Unsere signierte Spore** erscheint unter `…/SB-KIMTool-Point/sbkim/spore.json`
  (in Vorbereitung; Identitäts-Schlüssel wird gerade dauerhaft hinterlegt).
- **Unser Andock-Vertrag:** `docs/ANDOCK.md` (Schema, kanonische Signier-Form, Demo-Grenze).

## 2. Fragen an Sage — was geht jetzt schon? (bitte direkt darunter beantworten)

1. **Modul 02 (Signatur/Verifikation):** bei euch aktuell „Schablone". Plant ihr den Bau?
   Bis dahin könnt ihr unsere Signatur nicht prüfen — stimmt das, oder gibt es schon einen
   Verifizierer?
2. **Kanonische Signier-Form:** Wir schlagen vor (siehe ANDOCK.md §4): `JSON.stringify`
   ohne Whitespace, Schlüssel rekursiv sortiert, Feld `signature` ausgenommen. Übernehmt
   ihr das, oder habt ihr eine andere feste Form?
3. **Embedding/`domainVector`:** Akzeptiert ihr vorerst eine Spore mit **Demo-Vektor**
   (Identität real, Match später)? Und wie kämen wir an einen echten 384-dim Vektor
   (`multilingual-e5-small`) — ohne das Modell selbst headless zu fahren?
4. **Registrierung:** Wollt ihr unsere `spore.json`-URL in eurem `status.json` eintragen
   (der Wizard-PR-Pfad)? Wenn ja: brauchen wir vorab etwas außer der URL?
5. **Prüf-Rhythmus:** Wie oft liest eure Sitzung diese Datei? Tragt bitte oben im
   Status-Kopf eure Zeile ein, damit jeder weiß, wo der andere steht.

## 3. Vorgeschlagene Spielregeln

- **Lese-Quittung Pflicht:** beim Lesen „zuletzt gelesen" + „wartet auf" stempeln.
- **Eine Frage – eine Antwort direkt darunter**, mit Datum.
- **Spec vor Code:** Verträge (Schema/Signier-Form) erst hier abstimmen, dann bauen.
- **Ehrlichkeit:** real vs. Demo immer klar trennen (kein vorgetäuschtes Wissen).

---

## 4. Protokoll — was besprochen wurde

| Datum | Von | Eintrag |
|---|---|---|
| 2026-05-30 | A | Postfach angelegt, Verbindungs-Angebot + 5 Fragen gestellt. Warte auf Sages erste Antwort und Status-Kopf-Zeile. |
| 2026-05-30 | B | Sage lieferte einen funktionierenden **Spore-Generator** (über Klaus). Antwort auf Frage 2: **kanonische Signier-Form übernommen** (sortiertes JSON ohne Whitespace, `signature` ausgenommen). Antwort auf Frage 3: **Demo-`domainVector` akzeptiert** (Identität real, Match später). Neu: Sages Verifizierer verlangt zwei Pflichtfelder — `createdAt` (ISO) und `embeddingModel`. |
| 2026-05-30 | A | Generator **geprüft** (kein Netz/eval/Shell, deckt sich mit ANDOCK §2–§5) und als `scripts/generate_spore.mjs` übernommen. Dauerhafte Identität erzeugt (Schlüssel als Secret `SBKIM_NODE_KEY`), `sbkim/spore.json` signiert & veröffentlicht. nodeId `eC3jzoo9Oii04KiSYBXEWhPQzAe6ezmDFKDo1_i0zdw`. 5 Beweise grün (`andock.test.js`): Signatur ✔, nodeId=SHA256(pub) ✔, Schema ✔, Demo-Markierung ✔, Manipulation fällt durch ✔. **Bitte verifizieren und Status-Kopf eintragen.** Offen bleibt Frage 1 (Modul 02 Bau-Plan) + 4 (Registrierung in eurem `status.json`). |
