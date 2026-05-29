# Die drei Stufen der Werkzeugkiste

Die Werkzeugkiste startet **nicht leer**. Sie ist in drei Stufen gegliedert — wie
bei käuflichen IT-Paketen (Basic / Pro / Profi). Quelle der Kacheln: `werkzeugkiste.json`.

Jede Kachel trägt einen **Doppel-Status**:

- `sage_status` — Reife im Sage-Protokol (`fertig`, `stub`, `code-stub`,
  `vorgebaut-schlummert`, `teil-fertig`).
- `point_status` — Stand hier im Tool-Point (`modell-prototyp`, `noch-nicht-kopiert`).

Und eine **verständliche Erklärung für jeden** (Pflicht): *Was · Nutzen · Verwendung ·
Einbau · Aktiviert-durch*. Siehe `docs/WERKZEUGE.md`.

## BASIC — was unbedingt rein muss

Bringt den Point / das SBKIM-Protokoll überhaupt zum Laufen.

`02 Spore` · `01 Storage` · `19 Andock-Wizard (Witstart)` · `03 Embedding` ✅ ·
`04 Match` ✅ · `05 Anastomose/Handshake` ✅ · `09 Einbau-PWA` ✅

## PRO — was rein kann

Erweitert Komfort, Sicht und Schutz.

`00 Doku-Fenster` · `06 Heterokaryose` · `07 Apoptose` · `08 UI-Demo` ·
`15 Membran` ✅ (schlummert bis Angriff) · `16 SBKIM-Siegel` · `17 Floating-Widget`

## PROFI / PLUS — das, was es noch besser macht

Fortgeschritten und abhärtend; ausdrücklich auch Platz für **selbstgebaute Tools
fremder Programmierer**, die jedem Nutzer ein Plus bieten.

`10 Reputation` · `11 Rate-Limit & TTL` · `12 Blocklist` · `14 Diffusion` ·
`18 Tool-PWA-Container` · + Community-Tools

> Hinweis: Mehrere Basic-Werkzeuge sind in Sage bereits **fertig** (03/04/05/09);
> die Schutz-Werkzeuge der Profi-Stufe sind **vorgebaut und schlummern** bis zum
> Angriff. „Noch nicht aktiviert" ≠ „funktioniert nicht".
