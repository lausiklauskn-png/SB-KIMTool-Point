# CLAUDE.md — Verfassung dieses Repos

Leitfaden für jede Sitzung an SB-KIMTool-Point.

## Sprache & Begriffe

- Doku auf **Deutsch**, Code-Bezeichner auf **Englisch**. Datum `YYYY-MM-DD`.
- Es heißt **„Modell"**, nie „Orakel" — wissenschaftlicher Bezug statt Raten/Mystik.
- „Schablone" heißt **nicht leer**: vorgebaute Module (10/11/12/14, 15) schlummern und
  springen bei Bedarf (Angriff/Sybil/Flut) an.

## Disziplin

- **Kopieren, nicht klonen.** Repo bleibt CLEAN mit eigener Identität. Reife Sage-Module
  kommen später Datei für Datei herüber; kein git-clone, kein Klon von Browser-Live-Elementen.
- **Echte Krypto.** Ed25519/SHA-256 über `node:crypto`. Embedding/Match im Modell
  deterministisch gestubt und klar als Demo markiert.
- **Ehrlichkeit zuerst.** `status.json` zeigt den Real-Anteil. Die Seite **zeigt** einen
  aufgezeichneten Lauf, sie **führt** das Modell nicht live aus. Der Beweis ist `npm test`.
- **Jedes Werkzeug erklärt.** Pflicht: Was · Nutzen · Verwendung · Einbau · Aktiviert-durch
  (in `werkzeugkiste.json` + `docs/WERKZEUGE.md`).
- **Keine** Massenproduktion, **kein** vorgetäuschtes Wissen, **nichts** im Hintergrund vorbauen.

## Quelle der Wahrheit

Echte Konstanten und Modul-Status stammen aus `Sage-Protokol/status.json` und sind in
`sandbox/00_config.js` gespiegelt. Bei Abweichung gilt Sage; hier nachziehen.

## Befehle

```bash
npm run demo   # Modell-Lauf + Bericht + schreibt web/data/run.json
npm test       # headless Smoke-Test (Beweis)
```

## Optik

An Sage angelehnt (dunkel, Karten, Mono-Akzente, Lampen-Status-Leiste „was lebt / was
ist tot"), aber **re-geskinnt** für eine eigene, neutrale Identität. Ähnlichkeit ja,
Verwechslung nein. Funktion immer neu/headless, nie aus dem Browser geklont.

## Branch

Entwicklung auf `claude/<scope>` (z. B. `claude/sbkimtool-founding-TXRdc`).
Ein Commit pro abgegrenzter Aufgabe, semantische Nachricht. Draft-PR mit Test-Plan.

---

# Erprobte Regeln (übernommen aus Sage-Protokol/CLAUDE.md, 2026-05-29)

Sage hat eine bewährte Verfassung. Folgendes ist die für dieses Repo (Node-headless
+ statische Seite) **adaptierte** Übernahme der universellen, getesteten Disziplinen.
Reine Sage-Spezifika (Galaxy-Tab/DeX, `manual_check.html`, `INTERFACES.md`,
Vier-Schichten-Vision, `update_puls_pie.py`) sind bewusst NICHT übernommen.

## Evolutions-Klausel

Diese Regeln binden, **bis neue Evidenz** sie widerlegt. Eine Änderung erfordert
**ausdrückliche Nennung an Klaus** (welche Regel, welche Entdeckung, welcher Vorschlag)
— **niemals stille Workarounds**.

## PR-Workflow (verbindlich)

Vor dem nächsten Bau-Schritt / Brief:

1. Offene PRs **listen** und je als **merge / close / hold** klassifizieren.
2. **Konfliktrisiken** auf geteilten Dateien markieren (`PULS.md`, `status.json`,
   `werkzeugkiste.json`, `web/data/run.json`).
3. **Merge-Reihenfolge** vorschlagen.
4. Immer gegen das **aktuelle `main`** arbeiten, nicht gegen Branch-Erwartungen.
5. Setzt ein Schritt ungemergte PRs voraus, diese **explizit benennen** oder zuerst mergen lassen.

**Merge entscheidet Klaus.** Ich bereite vor (Draft-PR, Test-Plan) und merge nur auf
ausdrückliche Ansage. Niemals auf einen anderen als den vorgegebenen Branch pushen
ohne ausdrückliche Erlaubnis.

## Test & Ehrlichkeit über den Zustand

- **Headless Smoke-Test** (`npm test`) bestätigt die **Modell-Logik** — das ist unser Beweis.
- Die **statische Seite** ist erst „grün", wenn **Klaus sie im Browser angesehen** hat.
  Solange das aussteht: ehrlich **„ungeprüft, wartet auf Klaus' Browser-Lauf"** schreiben.
- Keine Sitzung markiert sich selbst grün ohne diesen Beleg.
- **Hard-Reload (Ctrl+Shift+R)** nach jedem Pull, sobald Service-Worker/Pages im Spiel sind.

## Sicherheits-Modul-Pflicht

Wer ein Schutz-Modul berührt (10 Reputation / 11 Rate-Limit / 12 Blocklist /
14 Diffusion / 15 Membran / künftige), trägt einen **`ZERTIFIKAT_ASPEKTE`-Eintrag**
ans Listenende in `sandbox/16_siegel.js` (Datum + Modul-ID + ein Satz). So bleiben
Sicherheits-Updates im Siegel sichtbar, ohne dass ein Forker neu andocken muss.

## Daten & Spec

- **Keine personenbezogenen Daten** in Code, Specs, Tests oder `PULS.md`.
- **Spec/Vertrag vor Code**: bei Verträgen zwischen Modulen erst Doku/Schema aktualisieren,
  dann Code — nie umgekehrt.
- **Kein Modul-Mix ohne Zuweisung**: den Scope der zugewiesenen Scheibe respektieren.

## Übergabe (PULS) am Sitzungsende — Pflicht

1. `PULS.md` aktualisieren: Datum, was getan, was bleibt, nächste Schritte.
2. **Manual-Check** vermerken: läuft die Seite im Browser (oder „ungeprüft, weil …").
3. Commit + Push, ein Commit pro Aufgabe.
4. **„Nächste Schritte"-Block direkt in der Chat-Antwort** (2–4 priorisierte Punkte, je
   mit Ein-Satz-Begründung + Reihenfolge-Hinweis, z. B. „braucht PR #X", „wartet auf
   Klaus' Browser-Lauf"). Klaus liest zuerst den Chat, nicht den Dateibrowser.
5. Erstellst du einen Folge-Brief, gib ihn **vollständig als Codeblock im Chat** aus.

## Kommunikations-Disziplin

- **Einzelschritte, nicht Block-Anweisungen**: ein konkreter Schritt pro Antwort mit
  klarem Erfolgsmerkmal, dann Feedback abwarten.
- **Klaus ist kein Programmierer** (lernt gern): ruhiger, präziser Ton, kein Angeben,
  Antworten auf Deutsch. Bevorzugt einfache Seiten.
- **Keine Terminal-/Adressleisten-Kommandos für Klaus.** Bedien-Flüsse laufen über
  benannte Knöpfe in der Seite, nicht über die Konsole.

---

# Regeln aus den Live-PWAs (Mixarium & Rezeptbuch, geprüft 2026-05-29)

Beobachtet an `Mein-Mixarium` und `Mein-Rezeptbuch` (echte, deployte SBKIM-PWAs).
Diese Muster sind im Feld erprobt:

- **Verteilbare Werkzeuge = eine einzige `index.html`.** Alle Assets (Icons, Splash)
  **inline als data-URI**, **keine externen Abhängigkeiten** → offline- und
  kopier-tauglich. Gilt für alles, was ein Forker aus der Werkzeugkiste kopiert
  (z. B. Tool-PWA-Container 18). *Die Hub-Seite dieses Repos darf mehrteilig bleiben
  (`assets/…`) — bekannte, bewusste Abweichung zugunsten der Wartbarkeit.*
- **PWA-Grundausstattung:** `lang="de"`, ein Manifest (`app-manifest.json`),
  `theme-color`, `apple-mobile-web-app-capable` / `mobile-web-app-capable` /
  `apple-mobile-web-app-status-bar-style`, Icons/Splash in mehreren Größen als data-URI.
- **Kopf-Kommentar** mit Projektname + **Version** + Jahr + Quell-Kennung.
  **ABER** (Kollision mit unserer Kein-PII-Regel): **kein voller Klarname** im Code —
  neutral halten (Projektname/Handle), nicht der bürgerliche Name.
- **Eruda** (In-Page-DevTools) ist Klaus' akzeptiertes Debug-Werkzeug auf dem Tablet,
  wo es kein Terminal gibt. Optional, da CDN-Abhängigkeit; passt zur Regel „Bedienung
  über Knöpfe/Seite, nicht Konsole". Nicht in Test-/Prüfseiten einbauen.
- **Offline/Service-Worker** ist Standard → die Hard-Reload-Regel (Ctrl+Shift+R nach
  jedem Pull) gilt beim Browser-Lauf.
