/* SBKIM-Siegel (Modul 16) + Membran-Lampe (Modul 15) + Lebt/Verkehr-Lampen
 * — ECHTE Module, kein Attrappen-Mock. Lädt die unveränderten web/tools/-Module
 * und verdrahtet die Statusleiste ehrlich:
 *
 *   • "lebt"    — an, sobald die eigene SBKIM-Identität (Modul 02) wirklich geladen ist
 *                 (echtes IndexedDB/WebCrypto). Scheitert das, bleibt die Lampe grau.
 *   • "verkehr" — pulst nur bei echtem Netz-Verkehr (status.json-Fetch ODER eine
 *                 Peer-SIGNAL.json-Abfrage über den 📬-Knopf).
 *   • "fremd"   — wird von Modul 15 (Membran) bedient: rot NUR bei echtem
 *                 Fremdzugriff (Cross-Origin/SW-Probe). Ruhe = nichts erkannt.
 *   • Siegel    — Modul 16: startet BRONZE ("Mycel suchend"), wird GOLD erst, wenn
 *                 in dieser Session ein echter Cross-Knoten-Handshake bestätigt wurde
 *                 (Event sbkim:handshake, outcome:"established"). Der Beweis, dass es
 *                 wirklich funktioniert hat — nicht vorgetäuscht.
 *
 * Re-Init-fest (Mehrfach-Einbindung schadet nicht). Lädt die Modul-Skripte einmal
 * dynamisch nach (damit jede Seite nur EINE <script>-Zeile braucht).
 */
(function () {
  "use strict";
  if (window.__sbkimSiegelWired) return;
  window.__sbkimSiegelWired = true;

  var BASE = "web/tools/";
  // Reihenfolge zählt: 01 Storage zuerst, dann 02; 15/16 zuletzt.
  var SCRIPTS = [
    "sbkim-storage.js", "sbkim-spore.js", "sbkim-match.js",
    "sbkim-anastomose.js", "sbkim-apoptose.js",
    "sbkim-membran.js", "sbkim-siegel.js"
  ];

  function loadScript(src) {
    return new Promise(function (resolve) {
      // schon geladen?
      var existing = document.querySelector('script[data-sbkim="' + src + '"]');
      if (existing) { resolve(true); return; }
      var s = document.createElement("script");
      s.src = src; s.async = false; s.setAttribute("data-sbkim", src);
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      document.head.appendChild(s);
    });
  }

  function lamp(id) { return document.getElementById(id); }
  function setLamp(id, cls) {
    var el = lamp(id); if (!el) return;
    el.classList.remove("on", "warn", "bad");
    if (cls) el.classList.add(cls);
  }
  function pulseTraffic() {
    var el = lamp("lamp-traffic"); if (!el) return;
    el.classList.remove("traffic-pulse"); void el.offsetWidth; el.classList.add("traffic-pulse");
  }

  async function wireAliveLamp() {
    // "lebt" ehrlich: nur an, wenn Modul 02 wirklich eine Identität laden kann.
    try {
      if (window.SbkimSpore && typeof window.SbkimSpore.getOrCreateIdentity === "function") {
        var id = await window.SbkimSpore.getOrCreateIdentity();
        if (id && id.nodeId) { setLamp("lamp-alive", "on"); return; }
      }
    } catch (e) { /* IndexedDB/WebCrypto fehlt → ehrlich grau lassen */ }
    setLamp("lamp-alive", null);
  }

  function wireTrafficLamp() {
    // Pulst bei echtem Netz-Verkehr: status.json-Fetch oder Peer-SIGNAL-Abfrage.
    if (!window.fetch || window.__sbkimTrafficWrapped) return;
    window.__sbkimTrafficWrapped = true;
    var orig = window.fetch;
    window.fetch = function (input) {
      try {
        var url = typeof input === "string" ? input : (input && input.url) || "";
        if (/status\.json|SIGNAL\.json|spore\.json/.test(url)) pulseTraffic();
      } catch (e) {}
      return orig.apply(this, arguments);
    };
  }

  async function init() {
    if (!document.querySelector(".statusbar")) return; // nur Seiten mit Statusleiste
    // 1) echte Module nachladen
    var ok = true;
    for (var i = 0; i < SCRIPTS.length; i++) {
      var got = await loadScript(BASE + SCRIPTS[i]);
      if (!got) ok = false;
    }

    // 2) Lampen ehrlich verdrahten
    wireTrafficLamp();
    await wireAliveLamp();

    // 3) Modul 15 (Membran) → bedient #lamp-fremd bei echtem Fremdzugriff
    try {
      if (window.SbkimMembrane && typeof window.SbkimMembrane.init === "function") {
        await window.SbkimMembrane.init({ lampSelector: "#lamp-fremd", mountModal: true });
      }
    } catch (e) { /* fail-soft */ }

    // 4) Modul 16 (Siegel) → injiziert Badge in .lamps, Bronze→Gold bei echtem Handshake
    try {
      if (window.SbkimSiegel && typeof window.SbkimSiegel.init === "function") {
        await window.SbkimSiegel.init({ badgeSelector: ".lamps", mountModal: true });
      }
    } catch (e) { /* fail-soft */ }

    if (!ok) console.info("SBKIM-Statusleiste: einige Module nicht erreichbar — Lampen/Siegel zeigen nur den real ladbaren Stand (ehrlich).");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
