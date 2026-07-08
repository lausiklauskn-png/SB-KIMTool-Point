/*
 * SBKIM — Storage-Init (Identitäts-Hygiene) für SB-KIMTool-Point.
 *
 * Öffnet die EIGENE Schublade dieser Origin: `sbkim_toolpoint` statt der
 * geteilten Default-DB `sbkim`. Muss als ERSTER Storage-Aufruf laufen — darum
 * wird dieses klassische <script> direkt NACH `web/tools/sbkim-storage.js` und
 * VOR allen identitäts-nutzenden Skripten (Spore, Anastomose, Rendezvous,
 * nostr-listen-init) geladen. Es läuft synchron beim Parsen, also bevor die
 * DOMContentLoaded-Inits (z.B. assets/nostr-listen-init.js) oder ein Klick auf
 * „🌐 Mit dem Netz verbinden" den Stack anfassen.
 *
 * Warum nötig (der Browser als schwarzes Loch): alle Endknoten-PWAs liegen
 * unter EINER Adresse `lausiklauskn-png.github.io`; IndexedDB hängt an der
 * Origin, nicht am Pfad. Ohne eigenen dbSuffix teilen sich alle Apps eine DB
 * `sbkim` und damit EINE Identität → mehrere Apps zeigten dieselbe nodeId auf
 * der Mycel-Karte. Bekannte Suffixe: Mixarium `mixarium` · Rezeptbuch
 * `rezeptbuch` · BookLedgerPro `bookledgerpro` · SB-KIMTool-Point `toolpoint`.
 *
 * Modus A (sanft, automatisch, idempotent, NICHT zerstörend): nur die eigene
 * Schublade sicherstellen. Kein Löschen, kein Auto-Anmelden ins Netz
 * (Empfangsmodus). Der Storage-Kern ist idempotent: der erste init({dbSuffix})
 * sperrt den DB-Namen, alle späteren init()-Aufrufe der Module (ensureStore →
 * init()) landen in derselben Schublade. Fail-soft: ohne Browser/IndexedDB
 * oder ohne geladenes Modul 01 passiert schlicht nichts.
 */
(function () {
  "use strict";
  var DB_SUFFIX = "toolpoint";
  try {
    if (window.SbkimStorage && typeof window.SbkimStorage.init === "function") {
      // init() gibt eine Promise zurück; wir müssen nicht darauf warten — der
      // dbName wird synchron im ersten init-Aufruf gesetzt. Fehler still
      // schlucken (fail-soft), damit die Seite nutzbar bleibt.
      Promise.resolve(window.SbkimStorage.init({ dbSuffix: DB_SUFFIX })).then(
        function () {
          if (console && console.info) {
            console.info("[SBKIMTool] Storage-Schublade: sbkim_" + DB_SUFFIX + " (eigene Identität).");
          }
        },
        function (e) {
          if (console && console.warn) console.warn("[SBKIMTool] Storage-Init übersprungen:", e);
        }
      );
    }
  } catch (e) {
    if (console && console.warn) console.warn("[SBKIMTool] Storage-Init fail-soft:", e);
  }
})();
