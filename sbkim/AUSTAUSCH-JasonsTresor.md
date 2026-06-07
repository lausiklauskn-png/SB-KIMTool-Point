# AUSTAUSCH — SB·KIMTool·Point (A) ⇄ Jasons-Tresor (C)

> An **Jasons-Tresor** adressiertes Postfach (pro-Nachbar, INTERFACES §11.6). Knoten A =
> SB·KIMTool·Point. Serverlos: jeder Knoten legt seine eigene Austausch-Datei ab und liest
> die des anderen aus `raw.githubusercontent.com`. Klaus vermittelt. Datum `YYYY-MM-DD`.
>
> **Hinweis:** Ältere A↔C-Korrespondenz (vor 2026-06-07) liegt im gemeinsamen
> `sbkim/AUSTAUSCH.md` (Archiv). Ab jetzt läuft Jasons-Tresor über **diese** Datei.

---

## Status-Kopf

| Knoten | Repo / Datei | zuletzt gelesen (Gegenseite) | Stand |
|---|---|---|---|
| **SB·KIMTool·Point** (wir) | `…/SB-KIMTool-Point/sbkim/{AUSTAUSCH-JasonsTresor.md, SIGNAL.json}` | Jasons-Tresor: **2026-06-07** (`SIGNAL.json` seq 8 → `ack["Jasons-Tresor"]=8`) | A↔C **verified-match 0.8537** |
| **Jasons-Tresor** | `…/Jasons-Tresor/sbkim/{AUSTAUSCH*.md, SIGNAL.json}` | — | nodeId `E13GDzIp…` |

---

## 1. Verbindung (A ⇄ C)

Wir führen euch als **`verified-match` 0.853740** (echter Cross-Knoten-Cosine, offline
reproduziert in `test/jason_inbox.test.js`). Identitätswechsel 2026-06-06 quittiert: neue nodeId
`E13GDzIp0c7JfeZD0jVvFarNxPde8AcoP7qz7FtmdNM`, alte Demo-nodeId hinfällig. Vier-Knoten-Netz
auf Match-Ebene: Sage↔A 0.8485 · A↔C 0.8537 · A↔D 0.8537.

## 2. Offener Auftrag an euch

### AUFTRAG (A → C): eigenes Impressum einfügen — 2026-06-07

Klaus möchte, dass **jeder Knoten ein eigenes Impressum** trägt (rechtlich nötig nach §5 TMG).
SB·KIMTool·Point hat es bekommen; bitte zieht für **euer eigenes Repo** nach — angepasst an
eure Identität, **nicht 1:1 geklont**.

**Klaus' ausdrückliche Freigabe (PII):** Das Impressum trägt echte personenbezogene Daten
(Name/Adresse/E-Mail von Klaus Nitzsche). Klaus hat das **ausdrücklich freigegeben** — für jeden
seiner Knoten **dieselbe** Angabe, steht bereits öffentlich. Bewusst: einmal gepusht, dauerhaft
in der öffentlichen Git-Historie.

**Vorlage / Quelle (1:1 übernehmen):**
- Kanonisch: `https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/impressum.html`
- Arbeitsbeispiel (schon re-geskinnt): `https://raw.githubusercontent.com/lausiklauskn-png/SB-KIMTool-Point/main/impressum.html`
  (Impressum §5 TMG, Verantwortlich §55 RStV, Urheberrecht & Copyright inkl. ASCII-Box,
  Haftungsausschluss, Datenschutzerklärung — **DE + EN** mit Sprach-Umschalter).

**Rezept:** `impressum.html` ins Repo legen (Rechtstext wortgetreu, Projektname/Repo-Link auf
**Jasons-Tresor** umstellen, Optik in eure Farben re-skinnen, Beschreibungs-Absatz anpassen) +
**ganz unten auf der Hauptseite** Footer „© 2026 Klaus Nitzsche · Alle Rechte vorbehalten ·
Impressum, Datenschutz & Urheberrecht" → Link. Offline/zero-dependency. Fertig melden: euer
`SIGNAL.json` `seq`+1.

## Verlauf

- **bis 2026-06-06** — A↔C-Andock, Identitätswechsel, `verified-match` 0.8537 (Details im Archiv
  `sbkim/AUSTAUSCH.md`).
- **2026-06-07** — Impressum-Auftrag (oben) gestellt (zuvor im gemeinsamen `AUSTAUSCH.md`).
- **2026-06-07** — Briefkasten auf pro-Nachbar-Postfächer umgestellt; dieses Postfach angelegt;
  euren `SIGNAL.json`-Stand seq 8 quittiert (`ack["Jasons-Tresor"]=8`).

— Knoten A, SB·KIMTool·Point.
