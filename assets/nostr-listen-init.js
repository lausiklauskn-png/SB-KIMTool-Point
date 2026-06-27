/*
 * SBKIM — Auto-Lauschen am Nostr-Relais (Stufe 2, 2026-06-27)
 *
 * Hebt SB-KIMTool-Point vom GitHub-Briefkasten (§11.6) auf den Live-Nostr-
 * Kanal: beim Öffnen der Werkzeug-Seite initialisiert der Knoten die
 * Anastomose (Modul 05) und beginnt selbsttätig am Relais
 * `wss://relay.family-projekt.de` zu lauschen.
 *
 * EMPFANGSMODUS MIT ANTWORTRECHT: der Knoten lauscht auf eingehende
 * Handshakes und ANTWORTET nur — er initiiert NIE von sich aus (kein
 * Crawler, keine Pulsation, keine Eigenanfrage ins offene Netz). Die
 * Schutz-Module (10 Reputation / 11 Rate-Limit / 12 Blocklist / 15 Membran)
 * sind sein Wächter, sobald sie aus der Schablone ins echte Leben gehoben
 * sind.
 *
 * Vollständig fail-soft + nicht-blockierend: ohne Browser (WebCrypto/
 * IndexedDB), ohne Relais-Client (Modul 05b, type=module) oder bei
 * Netz-Fehler passiert schlicht nichts — die Seite bleibt nutzbar.
 *
 * Muster: family-project/sbkim/sbkim-init.js + Sage-Protokol/sbkim-init.js.
 */
(function () {
  "use strict";

  function autoListen() {
    var A = window.SbkimAnastomose;
    if (!A || typeof A.init !== "function") return;
    Promise.resolve()
      .then(function () { return A.init(); })
      .then(function () {
        if (typeof A.listenNostr === "function" && window.SbkimNostrRelay) {
          return A.listenNostr()
            .then(function () {
              console.info("[SBKIMTool] Auto-Lauschen aktiv (Empfangsmodus mit Antwortrecht).");
            })
            .catch(function (e) { console.warn("[SBKIMTool] Auto-Lauschen übersprungen:", e); });
        }
      })
      .catch(function (e) { console.warn("[SBKIMTool] Andock-Init übersprungen (braucht Browser):", e); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoListen);
  } else {
    autoListen();
  }
})();
