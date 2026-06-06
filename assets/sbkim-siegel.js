/* SBKIM-Siegel (Modul 16) + Lampen (lebt/verkehr/fremd) — gemeinsam für alle Seiten.
 * Re-geskinnt für SB·KIMTool·Point; Wappen-SVG 1:1 aus dem Sage-Protokoll (geteiltes
 * Markt-Zertifikat). Injiziert sich selbst in die .statusbar, damit jede Seite nur EINE
 * <script src="assets/sbkim-siegel.js">-Zeile braucht.
 *
 * Lampen ehrlich: „lebt" = Seite/Identität geladen (an). „verkehr" pulst kurz beim
 * status.json-Fetch. „fremd" bleibt ruhig (Demo-Anker für Modul 15 Membran; rot nur,
 * wenn echter Fremdzugriff erkannt würde — hier nichts vorgetäuscht).
 */
(function () {
  "use strict";
  var NODE_ID = "CyunQNDRZZ3st8xGDYyK0ymJLNxn_S1UcIJpFKpXXNY";
  var ENDPOINT = "https://lausiklauskn-png.github.io/SB-KIMTool-Point/";

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === "class") e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  }

  function init() {
    var bar = document.querySelector(".statusbar");
    if (!bar || document.getElementById("sbkim-siegel-badge")) return;

    // Lampen (vor dem Netz-Knopf / der Version)
    var lamps = el("div", { class: "lamps", title: "Sichtbarkeits-Lampen — lebt / verkehr / fremd" });
    lamps.appendChild(el("span", { class: "lamp on", id: "lamp-alive", title: "Knoten lebt — Seite/Identität geladen" }, '<span class="lamp-label">lebt</span>'));
    lamps.appendChild(el("span", { class: "lamp", id: "lamp-traffic", title: "Verkehr — pulst beim status.json-Fetch" }, '<span class="lamp-label">verkehr</span>'));
    lamps.appendChild(el("span", { class: "lamp", id: "lamp-fremd", title: "Fremdzugriff — ruhig (Membran 15 warnt nur, zerstört nichts)" }, '<span class="lamp-label">fremd</span>'));

    // Siegel-Wappen (Klick öffnet Andock-Modal)
    var badge = el("button", {
      type: "button", id: "sbkim-siegel-badge", class: "sbkim-siegel-badge first-boot",
      title: "SBKIM-Siegel — Andock zum Werkzeug öffnen", "aria-label": "SBKIM-Siegel — Andock öffnen"
    }, '<img src="assets/sbkim-siegel-wappen.svg" alt="" decoding="async" />');

    // Einsortieren: Lampen + Siegel direkt vor den Netz-Knopf bzw. die Version.
    var anchor = bar.querySelector("#netz-check-btn") || bar.querySelector(".version");
    if (anchor) { bar.insertBefore(lamps, anchor); bar.insertBefore(badge, anchor); }
    else { bar.appendChild(lamps); bar.appendChild(badge); }

    // Andock-Modal
    var dlg = el("dialog", { id: "sbkim-andock", class: "andock-modal", "aria-label": "SBKIM Andock" },
      '<h3>SBKIM · Andock</h3>' +
      '<p style="color:var(--muted);margin:.2em 0 1em;font-size:.9rem">SB·KIMTool·Point ist ein bezeugter SBKIM-Endknoten am Sage-Protokoll.</p>' +
      '<div class="andock-row"><span>Endknoten</span><code>SB-KIMTool-Point</code></div>' +
      '<div class="andock-row"><span>Endpunkt</span><a href="' + ENDPOINT + '" target="_blank" rel="noopener">…github.io/SB-KIMTool-Point/ ↗</a></div>' +
      '<div class="andock-row"><span>nodeId</span><code>' + NODE_ID + '</code></div>' +
      '<div class="andock-row"><span>Spore</span><a href="sbkim/spore.json" target="_blank" rel="noopener">sbkim/spore.json ↗</a></div>' +
      '<div class="andock-row"><span>Markt</span><a href="markt.html">verbundene Knoten ansehen →</a></div>' +
      '<p style="color:var(--muted);font-size:.78rem;margin:.9em 0 0">Siegel-Wappen 1:1 aus dem Sage-Protokoll (Modul 16, geteiltes Markt-Zertifikat). Verbunden: Sage (verified-match 0.85), Jasons-Tresor (verified-spore).</p>' +
      '<button class="andock-close" type="button">Schließen</button>');
    document.body.appendChild(dlg);

    function open() { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); }
    function close() { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); }
    badge.addEventListener("click", open);
    dlg.querySelector(".andock-close").addEventListener("click", close);
    dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });

    // first-boot-Animation nur einmal
    setTimeout(function () { badge.classList.remove("first-boot"); }, 700);

    // Verkehrs-Lampe pulst, wenn status.json gelesen wird (auf Seiten, die das tun).
    var traffic = document.getElementById("lamp-traffic");
    if (traffic && window.fetch) {
      var orig = window.fetch;
      window.fetch = function (input) {
        try {
          var url = typeof input === "string" ? input : (input && input.url) || "";
          if (/status\.json/.test(url)) {
            traffic.classList.remove("traffic-pulse");
            void traffic.offsetWidth;
            traffic.classList.add("traffic-pulse");
          }
        } catch (e) {}
        return orig.apply(this, arguments);
      };
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
