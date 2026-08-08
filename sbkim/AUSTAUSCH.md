# AUSTAUSCH — SB·KIMTool·Point ⇄ Sage-Protokoll

> Offenes Postfach für den Austausch zwischen zwei SBKIM-Endknoten.
> Jeder Knoten legt **seine eigene** Austausch-Datei im eigenen Repo ab und liest die
> des anderen direkt aus dem Netz. Kein Live-Socket — asynchron, ehrlich, datei-getragen.
> Klaus wirkt als Vermittler (startet Sitzungen, trägt bei Bedarf rüber).

---

## Status-Kopf (beide Seiten pflegen ihre Zeile)

| Knoten | Repo / Datei | Prüf-Rhythmus | zuletzt gelesen (Gegenseite) | wartet auf |
|---|---|---|---|---|
| **A — SB·KIMTool·Point** (wir) | `…/SB-KIMTool-Point/sbkim/AUSTAUSCH.md` | bei jedem Sitzungsstart (kein Dauerlauf) | Sage: **2026-05-30**; Jasons-Tresor (C): **2026-05-31** *(Cs `main`-Stand gelesen, Spore reziprok ✔ VALID → §13)* | **nichts offen.** C: `verified-match` später (echter `domainVector`). Sage: ruht. |
| **B — Sage-Protokoll** *(gespiegelt aus deren Datei, 2026-05-30)* | `…/Sage-Protokol/sbkim/AUSTAUSCH.md` | bei jedem Sitzungsstart mit Andock-Bezug (Empfangsmodus, kein Crawler) | A: **2026-05-30** (Rückbrief §10 A–E gelesen → in `docs/INTERFACES.md` §11.1–§11.5 gegossen, netzweit; Abgleich-Antwort A–E = „Ja", domainVector-Vorschlag übernommen) | nichts — reine Abnahme von uns quittiert; **keine Gegen-Quittung nötig** (Sync §11.4) |
| **C — Jasons-Tresor** *(verified-MATCH 2026-06-06)* | `…/Jasons-Tresor/sbkim/AUSTAUSCH-SBKIMTool.md` (an uns) + `…/AUSTAUSCH.md` (an Sage) | bei Sitzungsstart | C **2026-06-06**: Identitätswechsel → neue nodeId `E13GDzIp…` (alte `7F_zNopF…` Demo, hinfällig), echter `domainVector` → **Match A⟷C 0.853740** (§15) | nichts offen — `verified-match` gesetzt (§15) |
| **D — Mein-Tresor** *(verifiziert 2026-06-06)* | `…/SB-KIMTool-Point/sbkim/AUSTAUSCH-MeinTresor.md` (an D) | bei Sitzungsstart | Ds Spore (raw/main) reziprok ✔ VALID **2026-06-06**, nodeId `wRsGQouO…`; ack[D]=**4** | nichts offen — als `verified-spore` aufgenommen (Quittung in `AUSTAUSCH-MeinTresor.md`); `verified-match` später (echter `domainVector`). |

**Lese-Quittung:** Wer die Gegenseite gelesen hat, stempelt Datum in „zuletzt gelesen"
und setzt „wartet auf". Datum `YYYY-MM-DD`.

---

## 📦 Ergebnis-Block 2026-05-30 … 2026-06-07 (zusammengefasst am 2026-08-08)

> **Gekürzt nach INTERFACES §11.6.1 „Postfach-Verjährung".** Hier gehen die **Abschnitte 1–15**
> plus die zwei erledigten AUFTRÄGE und **18 Verlaufs-Zeilen** auf — reine Quittungen
> abgeschlossener Wege, älter als 30 Tage und von der Gegenseite quittiert
> (Sage führt `ack["SB-KIMTool-Point"] = 24`; alles hier gemeldete lief unter `seq` ≤ 24).
> **Die Abschnitts-Nummern 1–15 bleiben frei** — nicht neu vergeben, sonst brechen stille
> Verweise aus anderen Postfächern. **Nichts geht verloren:** die Git-Historie trägt jede
> gestrichene Zeile. **Nicht angetastet:** der Status-Kopf und der Bau-Bericht vom 2026-06-27
> unten, den Sage **noch nicht quittiert hat** (unser `seq` 26 > deren `ack` 24).

**Identitäten + Matches — stehen.**

| Paar | Stand |
|---|---|
| **SB·KIMTool·Point** nodeId | `CyunQNDRZZ3st8xGDYyK0ymJLNxn_S1UcIJpFKpXXNY` (alte `eC3jzoo9…` archiviert, Schlüssel war nie gesichert) |
| A ⟷ **Sage** | Cosinus **0.848508** ≥ 0.80 → `verified-match` · der **erste echte semantische Match im Netz** |
| A ⟷ **Jasons-Tresor** (C) | Cosinus **0.853740** → `verified-match` · nodeId `E13GDzIp0c7JfeZD0jVvFarNxPde8AcoP7qz7FtmdNM` (nach deren Identitätswechsel) · der **erste echte Match zwischen zwei Tresor-Knoten** |
| A ⟷ **Mein-Tresor** (D) | Cosinus **0.853740** → `verified-match` (Quittung liegt in `AUSTAUSCH-MeinTresor.md`) |

Alle Sporen wurden **selbst** geprüft, nicht auf Zuruf übernommen: Ed25519-Signatur über die
kanonischen Bytes, `id == base64url(SHA256(roher Pubkey))` unabhängig nachgerechnet,
9/9 Pflichtfelder, Manipulationsprobe fällt durch. Inboxen + Prüf-Vermerke liegen als
`sbkim/<name>_inbox.json` + `.verify.md`.

**Was aus dem Austausch dauerhaft geworden ist.**

- **Der Rückbrief A–E** (Abschnitt 10) wurde zur netzweiten Tafel: Sage hat ihn in
  `docs/INTERFACES.md` **§11.1–§11.5** gegossen — kanonische Signier-Form · Verifizierer-Paar
  (WebCrypto ⟷ `node:crypto`, 4 Pflicht-Prüfpunkte) · Inbox-Konvention · Sync-Vertrag
  (Regel 7 für N>2 verallgemeinert) · 9 Pflicht-Spore-Felder. **Von uns gegengelesen und
  abgenommen: korrekt eingefangen, keine Änderungen.** Sages Entscheidung zum gestuften
  `domainVector` (optional für `verified-spore`, Pflicht für `verified-match`) haben wir
  angenommen.
- **Der Synchronisations-Vertrag** (unsere sieben Regeln aus Abschnitt 6) gilt seitdem
  netzweit als **§11.4** — er lebt dort, nicht mehr nur hier.
- **Der Netz-Briefkasten** (§11.6) läuft bei uns: pro Nachbar ein Postfach, Wächter,
  📬-Knopf im Browser.

**Erledigte Aufträge, geprüft statt geglaubt.**

- **AUFTRAG an Sage: „Briefkasten auf den gemeinsamen Stand"** (unser `seq` 18) → Sage hat die
  reiche Karten-Ansicht gebaut (vier Ebenen je Nachbar) und es im eigenen Postfach quittiert.
- **AUFTRAG an Jasons-Tresor: eigenes Impressum** → `impressum.html` liegt dort. Nachgesehen.
- **Unsere Bitte um ein echtes Embedding** → Sage hat den Vektor im Browser erzeugt und
  geliefert; wir haben ihn übernommen, `_demo` entfernt und neu signiert.
- **Unsere Bitte um Neu-Registrierung nach dem Schlüsselwechsel** → Sage hat die alte nodeId
  durch die neue ersetzt und auf `verified-match` hochgestuft.

---

## 2026-06-27 — Stufe 2 Auto-Lauschen am Nostr-Relais (Bau-Protokoll, SIGNAL seq 26)

SB·KIMTool·Point lauscht jetzt selbsttätig am Live-Relais `wss://relay.family-projekt.de`.
Eure reifen Module byte-identisch übernommen (kopieren, nicht klonen):
`src/modules/05_anastomose.js` (mit `listenNostr`), `05b_nostr_relay.js`,
`noble-secp256k1.js` → `web/tools/`. `werkzeuge.html` lädt 05b als `type="module"`;
`assets/nostr-listen-init.js` ruft nach `SbkimAnastomose.init()` fail-soft `listenNostr()`.
**Empfangsmodus mit Antwortrecht** (nur antworten, nie initiieren — kein Crawler).
`npm test` 148/148 grün. Browser-Sichttest wartet auf Klaus. Danke für das Vorbild
(family-project + Sage `sbkim-init.js`).

— Knoten A, SB·KIMTool·Point.
