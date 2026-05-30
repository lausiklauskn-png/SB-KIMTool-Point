/*
 * SB·KIMTool·Point — Werkstatt (Browser-Brücke zur Werkzeugkiste)
 *
 * Erster echter Schritt vom Playback Richtung Live-Modell (docs/LIVE-MODELL.md):
 * lädt ein echtes Werkzeug aus web/tools/ und lässt es eine kleine,
 * NACHVOLLZIEHBARE Selbst-Prüfung ausführen. Kein vorgetäuschter Live-Lauf —
 * nur was hier wirklich rechnet, wird als grün gemeldet.
 *
 * Bewusst OFFLINE: prüft 04 Match (reine Funktion) + 16 Siegel (Lesen). Module
 * mit Netz-/DOM-Bedarf (03/05/06/…) werden hier NICHT als grün behauptet.
 *
 * Die Prüf-Funktionen nehmen die bereits auf `window` registrierten Module
 * entgegen (window.SbkimMatch / window.SbkimSiegel) — genau der Pfad, den auch
 * test/werkstatt.test.js headless mit window-Shim geht.
 *
 * Public surface (window.SbkimWerkstatt):
 *   probeMatch()  -> { ok, name, schritte:[{label, wert, erwartet, ok}], fazit }
 *   probeSiegel() -> { ok, name, schritte:[...], fazit }
 *   probeAll()    -> [probeMatch(), probeSiegel()]
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SbkimWerkstatt = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function step(label, wert, erwartet) {
    return { label: label, wert: wert, erwartet: erwartet, ok: wert === erwartet };
  }

  // ---- 04 Match: reine Offline-Funktion, voll prüfbar ----------------------
  function probeMatch(M) {
    M = M || (typeof window !== "undefined" ? window.SbkimMatch : null);
    var name = "04 Match — semantische Passung (offline)";
    if (!M || typeof M.match !== "function") {
      return { ok: false, name: name, schritte: [], fazit: "Modul 04 nicht geladen." };
    }
    var gleich = new Float32Array(384); gleich[0] = 1;
    var gleich2 = new Float32Array(384); gleich2[0] = 1;
    var quer = new Float32Array(384); quer[1] = 1;

    var schritte = [
      step("Identische Profile → Treffer 1.0", M.match(gleich, gleich2), 1),
      step("Völlig verschiedene → 0.0", M.match(gleich, quer), 0),
      step("Schwelle: 0.9 gilt als Treffer", M.isAboveProviderThreshold(0.9), true),
      step("Schwelle: 0.7 ist kein Treffer", M.isAboveProviderThreshold(0.7), false),
      step("Provider-Schwelle = 0.8 (aus Sage)", M.PROVIDER_MIN_MATCH, 0.8),
    ];
    var ok = schritte.every(function (s) { return s.ok; });
    return {
      ok: ok, name: name, schritte: schritte,
      fazit: ok ? "Match rechnet korrekt — bereit für echte Profile."
                : "Match liefert unerwartete Werte.",
    };
  }

  // ---- 16 Siegel: Geprüft-Zertifikat, Lese-Pfad offline prüfbar ------------
  function probeSiegel(S) {
    S = S || (typeof window !== "undefined" ? window.SbkimSiegel : null);
    var name = "16 Siegel — Geprüft-Nachweis (offline lesen)";
    if (!S || typeof S.getAspects !== "function") {
      return { ok: false, name: name, schritte: [], fazit: "Modul 16 nicht geladen." };
    }
    var aspects = S.getAspects();
    var istListe = Array.isArray(aspects);
    var hatLeseApi = typeof S.isCertified === "function" &&
                     typeof S.getCertifiedModules === "function";
    var schritte = [
      step("Aspekte-Log ist lesbar (Liste)", istListe, true),
      step("Lese-API vorhanden (isCertified/getCertifiedModules)", hatLeseApi, true),
    ];
    var ok = schritte.every(function (s) { return s.ok; });
    return {
      ok: ok, name: name, schritte: schritte,
      fazit: ok ? ("Siegel lesbar — " + (istListe ? aspects.length : 0) +
                   " Aspekt(e) im Log. Grundlage für die Markt-Prüfung.")
                : "Siegel-Lese-API unvollständig.",
    };
  }

  function probeAll() {
    return [probeMatch(), probeSiegel()];
  }

  return { probeMatch: probeMatch, probeSiegel: probeSiegel, probeAll: probeAll, version: "0.1.0" };
});
