# BRIEF — Identitäts-Hygiene Schritt 2: Modul 23 „Mit dem Netz verbinden" um Hygiene erweitern

Datum: 2026-07-08 · Vorgänger: Schritt 1 (dbSuffix `toolpoint`, PULS-Nachtrag 2026-07-08)

## Stand (was Schritt 1 erledigt hat)

Die SBKIM-Identitäts-Hygiene ist netzweit (Skill `saubere-netz-anmeldung`). **Schritt 1**
(dieses Repo) hat die **Modus-A-Hälfte** für SB-KIMTool-Point gebaut: jede Origin-Seite
öffnet jetzt ihre **eigene Schublade** `sbkim_toolpoint` statt der geteilten Default-DB
`sbkim` (`werkzeuge.html` via `assets/sbkim-storage-init.js`, `mycelknoten.html` blp→toolpoint,
`jasons-bibliothek/index.html`). `npm test` 96/96 + 148 Proben grün. Browser-Sichttest offen.

**Noch nicht gebaut:** die **Modus-B-Hälfte** (Reparatur/Neu-Anmelden hinter EINEM Knopf) +
die Auslagerung als kopierbares Modul + Demo-Repo.

## Was Schritt 2 geplant ist (Plan-vor-Code — Klaus' Freigabe abwarten)

Erweiterung von **Modul 23** (`sbkim-rendezvous(.ui).js`), NICHT Neubau. Die Hygiene-Schritte
kommen VOR das bestehende Anmelden. Kern-Module 01/02/05/23 nur über öffentliche Flächen nutzen.

- **Modus A (automatisch, bei init, idempotent, NICHT zerstörend):** dbSuffix-Schublade
  sicherstellen → `loadIdentity`; wenn keine, EINMAL `getOrCreateIdentity`. Kein Löschen,
  kein Auto-Anmelden (Empfangsmodus).
- **Modus B (EIN Nutzer-Knopf, zerstörend, bewusst):**
  1. Reinigen NUR eigene Origin: `indexedDB.deleteDatabase("sbkim")` (geteilter Alt-Topf),
     alle Service-Worker `unregister()`, alle `caches.delete(...)`. Eigene Schublade
     `sbkim_<suffix>` NICHT anfassen (außer Nutzer will ausdrücklich neue Identität).
  2. neue Identität (`getOrCreateIdentity`) → 3. Spore (`getOwnSpore`) →
  4. im Netz anmelden (`SbkimRendezvous.connectAndAnnounce`) → 5. Hinweis „hart neu laden".
- **Bauform:** Modul byte-gleich kopierbar in jede PWA + kleines Demo-/Vorlage-Repo
  (Muster `such-tool/`: index.html + manifest + sw + Icons + Modul-Kopien mit Drift-Guard).
  Das Werkzeug darf in der App versteckt/in der Ecke liegen.
- **Headless-Smoke:** Modus A idempotent; Modus B ruft die richtigen Reinigungs-/Anmelde-
  Flächen; fail-soft.

## Leitplanken (immer, unberührt)

- Empfangsmodus: Anmelden nutzer-ausgelöst, kein Dauer-Piepser, `init()` baut nichts ins Netz.
- Kein PII: nur nodeId / Schlüssel / Spore.
- TABU: `PROVIDER_MIN_MATCH` (0.80-Riegel), `DB_VERSION`, `PROTOCOL_VERSION` NICHT anfassen.
- Kopieren, nicht klonen: Drift-Guard im Smoke.

## Offene Fragen an Klaus

1. **Name/Ort des Demo-Repos** für das Werkzeug (Vorschlag: `netz-anmeldung/`-Ordner in
   diesem Repo analog `such-tool/`, ODER eigenes Repo `lausiklauskn-png/netz-anmeldung`).
2. Soll Schritt 2 in **einer eigenen Sitzung** laufen (empfohlen — eigener Bau-Scope)?

## Pflichtlektüre vor der Arbeit (in dieser Reihenfolge)

1. `CLAUDE.md` (Verfassung) → 2. `PULS.md` (Nachtrag 2026-07-08) → 3. dieser Brief →
4. Skill `saubere-netz-anmeldung/SKILL.md` (die verbindliche Reihenfolge) →
5. Sage `src/modules/23_rendezvous.js` + `web/tools/sbkim-rendezvous(.ui).js` (die Flächen).

## Abschluss-Befehl (die Kette reißt nie ab)

Am Sitzungsende: `PULS.md` fortschreiben (getan/offen/nächste Schritte) · Draft-PR je Repo mit
Verifikations-Sektion (auch was NICHT geprüft wurde; Browser-Sichttest „wartet auf Klaus") ·
„Nächste Schritte"-Block direkt im Chat · neuen Folge-Brief anlegen + vollständig als Codeblock
im Chat ausgeben · **Freibrief gilt** (CLAUDE.md § Branch & PR-Workflow): eigene, getestete,
abgegrenzte PRs selbst mergen; bei echtem Zweifel erst Klaus fragen · diesen Abschluss-Befehl
im Folge-Brief wiederholen.
