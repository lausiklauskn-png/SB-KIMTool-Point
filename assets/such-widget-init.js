// such-widget-init.js — mountet das Such-Werkzeug (Modul 22) auf dieser Seite
// und ergänzt eine NICHT-INVASIVE „größer ziehen"-Funktion. Das Modul selbst
// (web/tools/sbkim-such-widget.js) bleibt 1:1 unverändert — diese Datei dockt
// nur von außen an die bekannte Panel-Klasse an (Auftrag Sage 2026-06-21 §2).
//
// Geladen NACH sbkim-embedding.js + sbkim-match.js + sbkim-such-widget.js.
// Fail-soft: fehlt eine Abhängigkeit, passiert nichts (keine Eintritts-Barriere).
(function () {
  "use strict";

  var W = window.SbkimSearchWidget;
  if (!W || typeof W.init !== "function") {
    // Modul 22 nicht geladen — still aussteigen (kein Fehler für die Seite).
    return;
  }

  // --- „Größer ziehen": Panel breit-/größer-ziehbar + Größe merken -----------
  // Reines CSS von außen auf die Modul-Klasse .sbkim-sw-panel; plus ein kleiner
  // Wächter, der die gezogene Größe in localStorage sichert und wiederherstellt.
  var SIZE_KEY = "sbkim_search_panel_size_point";
  var style = document.createElement("style");
  style.textContent =
    "#sbkim-search-widget .sbkim-sw-panel{resize:both;overflow:auto;" +
    "max-width:96vw;max-height:92vh;min-width:260px;min-height:200px;}" +
    // Treffer-Lesefeld nicht mehr selbst deckeln — die gezogene Panel-Höhe
    // bestimmt jetzt, wie viel von den Web-Treffern lesbar ist (Sage §2).
    "#sbkim-search-widget .sbkim-sw-results{max-height:none;}";
  document.head.appendChild(style);

  function restoreSize(panel) {
    try {
      var s = JSON.parse(localStorage.getItem(SIZE_KEY) || "null");
      if (s && s.w) panel.style.width = s.w + "px";
      if (s && s.h) panel.style.height = s.h + "px";
    } catch (e) { /* fail-soft */ }
  }

  function watchSize(panel) {
    if (typeof ResizeObserver === "undefined") return;
    var t = null;
    var ro = new ResizeObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(function () {
        try {
          localStorage.setItem(SIZE_KEY, JSON.stringify({
            w: Math.round(panel.offsetWidth),
            h: Math.round(panel.offsetHeight),
          }));
        } catch (e) { /* fail-soft */ }
      }, 250);
    });
    ro.observe(panel);
  }

  function hookPanel() {
    var panel = document.querySelector("#sbkim-search-widget .sbkim-sw-panel");
    if (!panel) return false;
    restoreSize(panel);
    watchSize(panel);
    return true;
  }

  // --- Demo-Korpus für die „App"-Suche (lokal, server-los eingebettet) -------
  // Einmaliges Modell-Laden beim ersten Lauf (Modul 03 / e5-small vom CDN) —
  // danach lokal. Ohne Modell bleibt der Korpus leer (Vorfilter-leer, fail-soft).
  var DEMO_KORPUS = [
    { label: "Zecken-Schutz für den Hund", text: "Wirksames, in Deutschland erhältliches Mittel gegen Zecken für den Hund." },
    { label: "Wespen am Esstisch vertreiben", text: "Hausmittel, die Wespen vom gedeckten Tisch im Sommer fernhalten." },
    { label: "Cocktail-Rezepte mischen", text: "Getränke und Cocktails aus vorhandenen Zutaten zusammenstellen." },
    { label: "Rezepte nach Zutaten finden", text: "Passende Gerichte zu vorhandenen Lebensmitteln vorschlagen." },
    { label: "Knoten ans Mycel andocken", text: "Eine PWA Schritt für Schritt ins SBKIM-Protokoll einbinden." },
  ];

  W.init({
    euPolicy: "frei",
    queryLabel: "Frag nach Bedeutung …",
    prepareCorpus: function () {
      var E = window.SbkimEmbedding;
      if (!E || typeof E.embedPassageBatch !== "function") return Promise.resolve([]);
      var ready = (typeof E.isReady === "function" && E.isReady())
        ? Promise.resolve()
        : (typeof E.init === "function" ? E.init() : Promise.resolve());
      return ready
        .then(function () { return E.embedPassageBatch(DEMO_KORPUS.map(function (d) { return d.text; })); })
        .then(function (vecs) {
          return DEMO_KORPUS.map(function (d, i) {
            return { label: d.label, anchorId: d.label, passageVec: vecs[i] };
          });
        })
        .catch(function (e) {
          console.warn("Such-Werkzeug: Demo-Korpus nicht eingebettet (Modell offline?):", e);
          return [];
        });
    },
  }).then(function () {
    if (!hookPanel()) {
      var tries = 0;
      var iv = setInterval(function () {
        if (hookPanel() || ++tries > 20) clearInterval(iv);
      }, 150);
    }
  });
})();
