# BRIEF — Siegel-Erlebnis an Sage angeglichen (Beschreibung · Schutz · Erklär-Seite)

Datum: 2026-06-07 · vorige Sitzung: BB · Branch dieser Aufgabe:
`claude/point-siegel-angleich-sage-lkjSH`

## Pflichtlektüre **vor** jeder Arbeit (in dieser Reihenfolge)

1. `CLAUDE.md` — die Verfassung.
2. `PULS.md` — aktueller Stand (oben: Eintrag BB, dann BA …).
3. **Dieser Brief** (neuester in `docs/sessions/BRIEF_*.md`).
4. `status.json` — ehrlicher Real-Anteil / Modul-Status.
5. Code der Scheibe: `assets/sbkim-siegel.js` (Glue, Wizard, Semantik-/Schutz-Block,
   Overlay), `web/tools/sbkim-siegel.js` (Modul 16, Render), `sicherheit.html`,
   `assets/style.css`, `sbkim/spore.json`.

## Stand (was gebaut wurde)

Das Siegel-Modal hat jetzt das Sage-Erlebnis, an Points Struktur angepasst:

- **A** `web/tools/sbkim-siegel.js`: Modul-18-Pfad entfernt (`BRONZE_HINWEIS_HTML_FALLBACK`,
  `[data-siegel-andock-btn]`, `SbkimToolPwa`-Logik). Bronze-Block = reiner Hinweis auf den
  🔑-Knopf. Neuer `ZERTIFIKAT_ASPEKTE`-Eintrag „Semantische Selbst-Beschreibung im Siegel"
  (2026-06-07). Modul 16 bleibt reines Render-Modul.
- **B** `assets/sbkim-siegel.js` → `setupAndockWizard()`: auto-wachsendes Beschreibungs-Textfeld
  unter dem 🔑-Knopf + Sage-Hinweistext + Re-Sign-Knopf. Voller Pfad
  `getOrCreateIdentity → SbkimEmbedding.init (Fortschritt sbkim:embedding-progress) →
  embedPassage → generateOwnSpore → spore.json-Download` + Erfolgsmeldung (nodeId, L2).
  Vorbefüllt aus eigener Spore, sonst Point-Default (reicher Text in `WIZ.domainDescription`).
- **C** Schutz-Block „🛡 …" + Knopf, der **D** als In-Page-Overlay öffnet.
- **D** `sicherheit.html` (flach, Teal-Skin, selbsttragend, iframe-tauglich): Mycel-Erklärung
  wortgleich aus Sage; „zurück"-Link blendet sich im Overlay aus.

`hideBronzeAndockBlock()` entfernt (überflüssig). `npm test` 88/88 grün.

## Datenverträge (unverändert genutzt)

- `SbkimSpore.getOrCreateIdentity()` → `{ nodeId }`; `getOwnSpore()` → `Promise<Spore|null>`;
  `generateOwnSpore({domain,endpoint,nodeType,nodeName,domainDescription,domainKeywords,
  domainVector,stammCategories,guestCategories})` → `Promise<Spore>`.
- `SbkimEmbedding.init()` / `embedPassage(text)` → `Float32Array(384)`;
  Fortschritts-Event `sbkim:embedding-progress` (`detail: {status,file,progress,loaded,total}`).
- Modul 16 öffentliche API unverändert (`init/isCertified/getExplanation/getCertifiedModules/
  getAspects`); `getAspects()` bleibt Liste (Werkstatt-Probe `probeSiegel` grün).

## Akzeptanzkriterien

- [x] `npm test` grün (88/88).
- [x] Keine Modul-18-Reste mehr in `web/tools/sbkim-siegel.js` / `assets/sbkim-siegel.js`.
- [x] Keine neue Krypto, kein PII, privater Schlüssel bleibt im Browser; Lampen unangetastet.
- [ ] **Browser-Lauf durch Klaus** (Hard-Reload Ctrl+Shift+R): Siegel-Modal öffnen → 🔑-Knopf,
      Textfeld (wächst beim Tippen, vorbefüllt), Re-Sign lädt Modell + lädt `spore.json` herunter,
      Schutz-Knopf öffnet das Overlay (✕/Backdrop/Esc schließt, kein neuer Tab).

## Offene Fragen an Klaus

- Soll `sicherheit.html` zusätzlich einen festen Link in Footer/Nav bekommen (aktuell nur per
  Siegel-Overlay erreichbar, plus direkte URL)?
- Re-Sign überschreibt `domainKeywords`/`stammCategories` **nicht** (bleiben Point-Default) —
  gewollt? Falls die Keywords mit der neuen Beschreibung mitwandern sollen, sag Bescheid.

## Abschluss-Befehl (für die nächste Sitzung — Pflicht)

1. `PULS.md` fortschreiben (getan / offen / nächste Schritte).
2. **Neuen Brief** `docs/sessions/BRIEF_<thema>.md` nach `docs/sessions/VORLAGE_BRIEF.md` anlegen.
3. Pflichtlektüre + diesen Abschluss-Befehl im neuen Brief wiederholen (die Kette reißt nie ab).
4. Brief vollständig als Codeblock im Chat ausgeben.
5. Commit + Push (ein Commit pro Aufgabe), Draft-PR mit Test-Plan. **Merge entscheidet Klaus.**
