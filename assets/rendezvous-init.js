/*
 * SBKIM — Rendezvous-Init (gemeinsamer Raum, Modul 23) für SB-KIMTool-Point.
 *
 * Mountet den öffentlichen Floating-Knopf „🌐 Mit dem Netz verbinden"
 * (SbkimRendezvousUI, web/tools/sbkim-rendezvous-ui.js) auf der Werkzeug-Seite.
 * Die Mechanik liegt im geteilten Modul 23 (SbkimRendezvous), das den
 * vorhandenen Stack nutzt (web/tools/sbkim-anastomose · sbkim-nostr-relay ·
 * sbkim-spore · sbkim-embedding). Es wird NICHT doppelt geladen — der Stack
 * ist auf werkzeuge.html bereits da.
 *
 * Der Knopf reicht einen app-eigenen Identitäts-Erzeuger durch: erst beim
 * ersten „Verbinden" wird (falls im Browser noch keine lebende Identität da
 * ist) eine Spore erzeugt — Modul 03 Embedding (~30 MB einmalig) + Modul 02
 * generateOwnSpore, mit der committeten Domänen-Beschreibung, damit der
 * Match-Wert zu den anderen Knoten (≥ 0.80) erhalten bleibt.
 *
 * VERFASSUNGSTREU: nutzer-ausgelöst, init mountet nur den Knopf (kein Auto-
 * Connect, kein Dauer-Piepser). Fail-soft. Muster: assets/nostr-listen-init.js.
 */
(function () {
  "use strict";

  var CFG = {
    nodeName: "SB-KIMTool-Point",
    domain: "SBKIM-Werkzeug-Point",
    endpoint: "https://lausiklauskn-png.github.io/SB-KIMTool-Point/",
    nodeType: "hybrid",
    domainDescription: "Werkzeugkiste + headless Modell-Lauf für das SBKIM-Protokoll.",
    domainKeywords: ["Werkzeugkiste", "SBKIM", "Mycel", "Marktplatz", "Observatorium", "Modell", "Knoten"],
  };

  function createIdentity() {
    if (!window.SbkimEmbedding || !window.SbkimSpore) {
      return Promise.reject(new Error("Module 02/03 (Spore/Embedding) nicht geladen."));
    }
    return window.SbkimEmbedding.init()
      .then(function () {
        return window.SbkimEmbedding.embedPassage(CFG.domainDescription + ". " + CFG.domainKeywords.join(", "));
      })
      .then(function (vec) {
        return window.SbkimSpore.generateOwnSpore({
          domain: CFG.domain,
          endpoint: CFG.endpoint,
          nodeType: CFG.nodeType,
          nodeName: CFG.nodeName,
          domainDescription: CFG.domainDescription,
          domainKeywords: CFG.domainKeywords,
          domainVector: Array.from(vec),
        });
      });
  }

  function mount() {
    if (!window.SbkimRendezvousUI) {
      console.warn("[SBKIMTool] SbkimRendezvousUI nicht geladen — web/tools/sbkim-rendezvous-ui.js fehlt?");
      return;
    }
    try {
      window.SbkimRendezvousUI.init({ nodeName: CFG.nodeName, corner: "bl", createIdentity: createIdentity });
      console.info("[SBKIMTool] Rendezvous-UI gemountet (öffentlicher 🌐-Knopf).");
    } catch (e) {
      console.warn("[SBKIMTool] Rendezvous-UI übersprungen:", e);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
