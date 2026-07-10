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
 * IDENTITÄTS-HYGIENE (Schritt 2, 2026-07-08): dieselbe Schublade wie
 * assets/sbkim-storage-init.js (`sbkim_toolpoint`). Beim Mounten läuft
 * Modus A (SbkimRendezvous.ensureIdentity) — sanft, automatisch, idempotent,
 * NICHT zerstörend, KEINE Netz-Aktion: stellt die eigene Schublade + eine
 * stabile Identität sicher. Der Modus-B-Knopf (Aufräumen) sitzt im Panel.
 *
 * VERFASSUNGSTREU: nutzer-ausgelöst, init mountet nur den Knopf (kein Auto-
 * Connect, kein Dauer-Piepser). Fail-soft. Muster: assets/nostr-listen-init.js.
 */
(function () {
  "use strict";

  var DB_SUFFIX = "toolpoint";  // == assets/sbkim-storage-init.js

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
    // Sichtbarer Fortschritt DIREKT im Panel (Tablet hat keine Konsole) +
    // Phasen-Logs für Eruda. Die einmalige Identitäts-Erzeugung lädt ein
    // ~30-MB-Sprach-Modell — das dauert am Tablet, sieht sonst aus wie „hängt".
    function step(msg) {
      console.info("[SBKIMTool] " + msg);
      try {
        var out = document.getElementById("sbkim-rdv-out");
        if (out) out.textContent += "\n  … " + msg;
      } catch (_e) {}
    }
    step("Sprach-Modell wird geladen (einmalig, ~30 MB — kann am Tablet 1–2 Minuten dauern)…");
    // PFLICHT (Skill „saubere-netz-anmeldung"): beim ~30-MB-Modell-Laden IMMER
    // eine Prozent-Anzeige — sonst denkt man, es hängt, und schließt zu, bevor es
    // fertig ist. Live-Balken aus dem sbkim:embedding-progress-Event, EINE Zeile.
    function ensureProgressEl() {
      var out = document.getElementById("sbkim-rdv-out");
      if (!out || !out.parentNode) return null;
      var el = document.getElementById("tp-model-progress");
      if (!el) {
        el = document.createElement("div");
        el.id = "tp-model-progress";
        el.style.cssText = "margin:6px 0 0;font:.74rem/1.4 var(--mono,monospace);color:#6ee7d3;white-space:pre-wrap";
        out.parentNode.insertBefore(el, out.nextSibling);
      }
      return el;
    }
    var onProg = function (ev) {
      var d = ev && ev.detail; if (!d) return;
      var el = ensureProgressEl(); if (!el) return;
      if (typeof d.progress === "number" && isFinite(d.progress)) {
        var pct = Math.max(0, Math.min(100, Math.round(d.progress)));
        var filled = Math.round(pct / 5);
        var bar = "█".repeat(filled) + "░".repeat(20 - filled);
        var file = d.file ? String(d.file).split("/").pop() : "Modell";
        el.textContent = "Modell laedt  " + bar + "  " + pct + " %   (" + file + ", ~30 MB einmalig)";
      } else if (d.status === "done" || d.status === "ready") {
        el.textContent = "Modell geladen ✓";
      }
    };
    function stopProg() { try { window.removeEventListener("sbkim:embedding-progress", onProg); } catch (_e) {} }
    try { window.addEventListener("sbkim:embedding-progress", onProg); } catch (_e) {}
    return window.SbkimEmbedding.init()
      .then(function () {
        step("Modell geladen, berechne Bedeutungs-Vektor…");
        return window.SbkimEmbedding.embedPassage(CFG.domainDescription + ". " + CFG.domainKeywords.join(", "));
      })
      .then(function (vec) {
        step("erzeuge deine Identität + Visitenkarte (Spore)…");
        return window.SbkimSpore.generateOwnSpore({
          domain: CFG.domain,
          endpoint: CFG.endpoint,
          nodeType: CFG.nodeType,
          nodeName: CFG.nodeName,
          domainDescription: CFG.domainDescription,
          domainKeywords: CFG.domainKeywords,
          domainVector: Array.from(vec),
        });
      })
      .then(function (spore) {
        stopProg();
        step("Identität fertig — melde dich jetzt im Raum an…");
        return spore;
      })
      .catch(function (e) {
        stopProg();
        step("✗ Identitäts-Erzeugung fehlgeschlagen: " + (e && e.message ? e.message : e));
        throw e;
      });
  }

  function mount() {
    // Modul 23 mit eigener Schublade + app-eigenem Identitäts-Erzeuger
    // konfigurieren, dann Modus A (sanft, lokal, idempotent) fahren.
    if (window.SbkimRendezvous && typeof window.SbkimRendezvous.init === "function") {
      try {
        window.SbkimRendezvous.init({
          nodeName: CFG.nodeName,
          dbSuffix: DB_SUFFIX,
          createIdentity: createIdentity,
          ensureIdentity: true,   // Modus A: eigene Schublade + Identität sicherstellen
        });
      } catch (e) {
        console.warn("[SBKIMTool] Rendezvous-Modul-Init (Modus A) übersprungen:", e);
      }
    }
    if (!window.SbkimRendezvousUI) {
      console.warn("[SBKIMTool] SbkimRendezvousUI nicht geladen — web/tools/sbkim-rendezvous-ui.js fehlt?");
      return;
    }
    try {
      window.SbkimRendezvousUI.init({
        nodeName: CFG.nodeName,
        dbSuffix: DB_SUFFIX,
        corner: "bl",
        createIdentity: createIdentity,
      });
      console.info("[SBKIMTool] Rendezvous-UI gemountet (öffentlicher 🌐-Knopf, Modus A aktiv).");
    } catch (e) {
      console.warn("[SBKIMTool] Rendezvous-UI übersprungen:", e);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
