# Standalone-Such-Tool — eigenständige installierbare PWA

> **Status:** 🟦 Kopiert 2026-06-22 nach `such-tool/` (Variante A: eigener Unterordner
> in diesem Repo). Self-contained: eigene `index.html` + `manifest.json` +
> Service-Worker + Modul-Kopien + Icons. **Browser-/Installations-Sichttest wartet
> auf Klaus** (headless ersetzt das nicht).
>
> Auslöser: Befund am SB-KIMTool-Point, dass ein bloßer „Download-Knopf" **keine**
> eigenständige App erzeugt. Vorlage kam aus `Sage-Protokol/such-tool/`.

---

## Die Kern-Lehre: warum ein „Download" allein keine App ist

Eine heruntergeladene Einzeldatei, **lokal** über `file://` geöffnet, darf vom
Browser **keinen Service-Worker** registrieren → es gibt kein „Zum Startbildschirm
hinzufügen", keine Installation. Es bleibt eine Seite, keine App.

**Eine eigenständige, installierbare PWA braucht vier Dinge ZUSAMMEN, unter einer
eigenen Adresse/Scope:**

1. **Über https gehostet** (GitHub Pages).
2. Eigenes **`manifest.json`** (`name`, Icons 192 + 512, `start_url`, `scope`,
   `display: "standalone"`).
3. Eigener **Service-Worker mit `fetch`-Handler** (Chrome verlangt ihn für die
   Installierbarkeit).
4. Eine eigene **Start-URL/Scope**, getrennt vom Hub.

Ein Knopf, der nur Code kopiert oder eine Datei zum lokalen Öffnen ausliefert,
erfüllt **keinen** dieser Punkte.

---

## Aufbau des Ordners `such-tool/`

```
such-tool/
  index.html            Standalone-Seite: lädt die 4 Module, registriert den SW,
                        mountet das Widget (Internet/KI-Brücke an, App/Knoten aus),
                        eigener Footer (Datenschutz + Link Impressum).
  manifest.json         name/short_name, start_url "./", scope "./", display
                        standalone, theme/background, Icons 192+512 (any+maskable).
  sbkim-sw.js           Service-Worker: cacht die App-Schale (cache-first), reicht
                        Fremd-Origin (CDN-Modell, KI-/Sprach-API) DURCH (nie cachen).
                        Offline-Navigation → ./index.html. CACHE_VERSION bumpen bei
                        Schalen-Änderung.
  impressum.html        Impressum/Datenschutz-Vorlage. Kontakt sind PLATZHALTER
                        ([…]) — KEINE PII hartcodiert (Repo-Konvention). Betreiber
                        füllt sie vor Veröffentlichung.
  icon-192.png          App-Icon (Lupe auf dunklem Grund), maskable-tauglich.
  icon-512.png
  modules/              Kopien aus Sage-Protokol src/modules — die EINZIGEN Module,
    03_embedding.js     die das Widget komponiert: 03 (Embedding) ← 04 (Match) ←
    04_match.js         22 (Widget) → 21 (Sprache). KEIN 01/02 nötig (kein
    21_spracheingabe.js IndexedDB, keine Identität).
    22_such_widget.js
```

### Modul-Abhängigkeitsgraph

- Modul 22 → `SbkimEmbedding` (03), `SbkimMatch` (04), `SbkimSpeech` (21).
- Modul 04 → `SbkimEmbedding` (03).
- Modul 03, 21 → keine SBKIM-Abhängigkeit.
- **Kein** Modul 01 (Storage) / 02 (Spore) nötig — die Standalone-Seite hat keine
  Identität und kein IndexedDB.

### Drift-Guard (Quelle der Wahrheit liegt in Sage)

`such-tool/modules/*.js` sind **Kopien**. Die Quelle der Wahrheit ist
`Sage-Protokol/src/modules`. Ändert sich dort 03/04/21/22, **müssen die Kopien
hier nachgezogen werden** (in Sage sichert ein byte-identischer Smoke-Test das ab;
in diesem Repo gibt es diesen Test (noch) nicht — also bewusst manuell nachziehen).
Abgeglichen gegen Sage **PR #388** (Resize-Fix in Modul 22: Griff unten rechts zieht
Breite + Lesefeld-Höhe, Größe persistiert in `localStorage` `sbkim_search_widget_size`,
Drag/Resize sauber getrennt).

---

## So wird daraus eine eigene App (zwei Wege)

- **(A) Eigener Ordner — hier umgesetzt** (`such-tool/` in diesem Repo): über GitHub
  Pages erreichbar unter `…/SB-KIMTool-Point/such-tool/`. Direkt installierbar
  (Add to Home Screen). Achtung **Service-Worker-Scope-Falle**: ein Hub-SW im
  Repo-Root dürfte den Unterordner-SW nicht überschatten — der Tool-SW wird aus
  `/such-tool/` registriert (Scope `/such-tool/`). **Stand jetzt hat der Hub gar
  keinen Service-Worker → keine Kollision.** Kommt später ein Hub-SW dazu, muss er
  den Unterordner ausnehmen.
- **(B) Eigenes Repo:** den Ordner-Inhalt ins Root eines neuen Repos kopieren, Pages
  aktivieren → eigene URL, eigene App-Identität, keine Scope-Falle. Sauberer für eine
  später verkaufbare eigenständige App; für jetzt genügt (A).

---

## Offen / Sichttest

- **Klaus' Installations-Sichttest** am Tablet: `…/such-tool/` öffnen → Chrome-Menü
  „App installieren" / „Zum Startbildschirm" → startet als eigene App (eigenes
  Fenster, ohne Browser-Leiste)? Offline-Start nach Installation? Headless ersetzt
  das nicht. **Voraussetzung: GitHub Pages für dieses Repo aktiv** (über https,
  nicht `file://`).
- **KI-Anbieter „automatisch":** server-los geht das nur mit **Claude** (CORS).
  Gemini/ChatGPT/Perplexity laufen über den Kopier-Pfad oder später einen eigenen
  Proxy.
- **Impressum:** Kontakt-Felder sind Platzhalter — vor Veröffentlichung mit echten
  Pflichtangaben füllen (nicht als PII committen).
