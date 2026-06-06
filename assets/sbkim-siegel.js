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
    "sbkim-embedding.js", "sbkim-anastomose.js", "sbkim-apoptose.js",
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

    // 3b) Modul-18-Shim: Modul 16 zeigt im Bronze-Zustand einen [Andocken]-Knopf, der
    //     SbkimToolPwa.openAndockTab() (Modul 18 Tool-PWA-Container) aufruft. Modul 18 ist
    //     bei uns NICHT eingebunden (und unnötig) — statt des toten Knopfs leiten wir ihn
    //     auf unseren echten Andock-Wizard um. So nimmt Modul 16 seinen Erfolgs-Pfad
    //     (closeModal) und der Knopf funktioniert ehrlich, statt "Modul 18 nicht installiert".
    if (!window.SbkimToolPwa) {
      window.SbkimToolPwa = {
        openAndockTab: function () {
          // Wizard sicherstellen + öffnen. Wirft NICHT → Modul 16 Pfad 1.
          setupAndockWizard();
          // kurz warten, bis Modul 16 sein Modal geschlossen hat, dann Wizard zeigen.
          setTimeout(openWizard, 60);
        }
      };
    }

    // 4) Modul 16 (Siegel) → injiziert Badge in .lamps, Bronze→Gold bei echtem Handshake
    try {
      if (window.SbkimSiegel && typeof window.SbkimSiegel.init === "function") {
        await window.SbkimSiegel.init({ badgeSelector: ".lamps", mountModal: true });
      }
    } catch (e) { /* fail-soft */ }

    // 5) Andock-Wizard: Knopf „🔑 Eigene Identität & Spore erzeugen / verwalten"
    //    ins Modul-16-Modal hängen + eigenen Wizard-Dialog bereitstellen (wie Sage).
    setupAndockWizard();

    if (!ok) console.info("SBKIM-Statusleiste: einige Module nicht erreichbar — Lampen/Siegel zeigen nur den real ladbaren Stand (ehrlich).");
  }

  // ---- Andock-Wizard (eigene Identität/Spore erzeugen + pflegen) ----
  // Re-geskinnt nach Sages Andock-Wizard. Nutzt die ECHTEN Module 02 (Spore) +
  // 03 (Embedding). Erzeugt Identität im Browser, signiert die Spore (mit echtem
  // domainVector), bietet sie als Download an und macht ein verschlüsseltes Backup
  // (exportBackup). Notfall-tauglich: neue Identität, wenn die alte verloren ist.
  var WIZ = {
    domain: "SBKIM-Werkzeug-Point",
    endpoint: "https://lausiklauskn-png.github.io/SB-KIMTool-Point/",
    nodeType: "hybrid",
    nodeName: "SB-KIMTool-Point",
    domainDescription: "Werkzeugkiste + headless Modell-Lauf für das SBKIM-Protokoll.",
    domainKeywords: ["Werkzeugkiste", "SBKIM-Module", "Modell", "Markt", "Endknoten"],
    stammCategories: ["Werkzeugkiste", "SBKIM-Module", "Headless-Modell-Lauf", "Markt-Siegel"],
    guestCategories: ["Werkzeug-Kopie", "Modul-Andock", "Spore-Verifikation"]
  };
  var lastSpore = null;

  function setupAndockWizard() {
    var modal = document.getElementById("sbkim-siegel-modal");
    if (modal && !modal.querySelector("#sbkim-ident-open")) {
      // Knopf möglichst weit oben im Modal-Panel platzieren.
      var panel = modal.querySelector('[role="dialog"]') || modal;
      var openBtn = document.createElement("button");
      openBtn.type = "button"; openBtn.id = "sbkim-ident-open"; openBtn.className = "andock-tool";
      openBtn.textContent = "🔑 Eigene Identität & Spore erzeugen / verwalten →";
      openBtn.style.cssText = "display:block;width:100%;margin:0 0 0.9rem;padding:0.6rem 0.9rem;" +
        "font:inherit;cursor:pointer;border-radius:10px;border:1px solid #C9A961;" +
        "background:rgba(201,169,97,0.12);color:#F5E6B8;font-weight:700;";
      openBtn.addEventListener("click", openWizard);
      // robust: an den Anfang des Panels (vor das erste Kind, falls vorhanden).
      if (panel.firstChild) panel.insertBefore(openBtn, panel.firstChild);
      else panel.appendChild(openBtn);
    }
    if (!document.getElementById("sbkim-ident-wizard")) buildWizardDialog();
  }

  function buildWizardDialog() {
    var dlg = document.createElement("dialog");
    dlg.id = "sbkim-ident-wizard"; dlg.className = "andock-modal";
    dlg.setAttribute("aria-label", "Identität & Spore erzeugen");
    dlg.innerHTML =
      '<h3>🔑 Eigene Identität & Spore</h3>' +
      '<p style="color:var(--muted);margin:.2em 0 1em;font-size:.88rem">Erzeugt eine SBKIM-Identität <b>im Browser</b> (Ed25519, IndexedDB) — der private Schlüssel verlässt diesen Browser nie. Notfall-tauglich: damit kann man jederzeit eine <b>neue</b> Spore/Identität erzeugen und sichern. Erstes Embedding lädt ~30 MB (Modul 03, einmalig).</p>' +
      '<ol style="padding-left:1.1rem;line-height:1.5;font-size:.9rem">' +
        '<li><b>Identität erzeugen</b> — Ed25519-Schlüsselpaar, nodeId aus dem Public Key.<br>' +
          '<button type="button" class="andock-close" id="wiz-s1" style="margin:.4em 0">Identität erzeugen</button>' +
          '<div id="wiz-o1" style="font-family:var(--mono);font-size:.8rem;color:var(--accent);word-break:break-all"></div></li>' +
        '<li style="margin-top:.6em"><b>Spore signieren + herunterladen</b> — mit echtem 384-dim domainVector.<br>' +
          '<button type="button" class="andock-close" id="wiz-s2" disabled style="margin:.4em 0">Spore erzeugen + ⬇</button>' +
          '<div id="wiz-o2" style="font-family:var(--mono);font-size:.8rem;color:var(--accent);word-break:break-all"></div></li>' +
        '<li style="margin-top:.6em"><b>Verschlüsseltes Backup</b> — Passwort-Sicherung (AES-256-GCM/PBKDF2 600k) gegen IndexedDB-Verlust.<br>' +
          '<button type="button" class="andock-close" id="wiz-s3" disabled style="margin:.4em 0">Backup erzeugen + ⬇</button>' +
          '<div id="wiz-o3" style="font-family:var(--mono);font-size:.8rem;color:var(--accent);word-break:break-all"></div></li>' +
        '<li style="margin-top:.6em"><b>Identität wiederherstellen</b> — Backup-Datei (Schritt 3) + Passwort zurückspielen: Schlüssel <em>und</em> Spore landen wieder in der Browser-IndexedDB. Funktioniert auch auf neuem Gerät/Browser.<br>' +
          '<input type="file" id="wiz-s4-file" accept=".json,application/json" hidden />' +
          '<button type="button" class="andock-close" id="wiz-s4" style="margin:.4em 0">Backup-Datei wählen + wiederherstellen</button>' +
          '<div id="wiz-o4" style="font-family:var(--mono);font-size:.8rem;color:var(--accent);word-break:break-all"></div></li>' +
      '</ol>' +
      '<p style="color:var(--muted);font-size:.78rem;margin:.7em 0 0">Die heruntergeladene <code>spore.json</code> nach <code>sbkim/spore.json</code> ins Repo legen. Backup-Datei + Passwort sicher aufbewahren — ohne beides keine Wiederherstellung. Mit Schritt 4 spielst du sie jederzeit (auch auf neuem Gerät) zurück.</p>' +
      '<button class="andock-close" type="button" id="wiz-close" style="margin-top:1em">Schließen</button>';
    document.body.appendChild(dlg);

    function out(id, msg, bad) {
      var e = dlg.querySelector(id); if (!e) return;
      e.textContent = msg; e.style.color = bad ? "var(--bad)" : "var(--accent)";
    }
    dlg.querySelector("#wiz-s1").addEventListener("click", function () {
      var b = dlg.querySelector("#wiz-s1");
      if (!window.SbkimSpore || !window.SbkimSpore.getOrCreateIdentity) { out("#wiz-o1", "Modul 02 nicht geladen.", true); return; }
      b.disabled = true; out("#wiz-o1", "Erzeuge Identität …");
      window.SbkimSpore.getOrCreateIdentity().then(function (id) {
        out("#wiz-o1", "nodeId: " + id.nodeId);
        dlg.querySelector("#wiz-s2").disabled = false;
      }).catch(function (e) { out("#wiz-o1", "Fehler: " + (e && e.message || e), true); b.disabled = false; });
    });
    dlg.querySelector("#wiz-s2").addEventListener("click", function () {
      var b = dlg.querySelector("#wiz-s2");
      if (!window.SbkimEmbedding || !window.SbkimSpore) { out("#wiz-o2", "Modul 02/03 nicht geladen.", true); return; }
      b.disabled = true; out("#wiz-o2", "Lade Embedding-Modell (~30 MB, einmalig) …");
      window.SbkimEmbedding.init()
        .then(function () { out("#wiz-o2", "Erzeuge domainVector (384) …");
          return window.SbkimEmbedding.embedPassage(WIZ.domainDescription + ". " + WIZ.domainKeywords.join(", ")); })
        .then(function (vec) { out("#wiz-o2", "Signiere Spore …");
          return window.SbkimSpore.generateOwnSpore({
            domain: WIZ.domain, endpoint: WIZ.endpoint, nodeType: WIZ.nodeType, nodeName: WIZ.nodeName,
            domainDescription: WIZ.domainDescription, domainKeywords: WIZ.domainKeywords,
            domainVector: Array.from(vec), stammCategories: WIZ.stammCategories, guestCategories: WIZ.guestCategories
          }); })
        .then(function (spore) { lastSpore = spore; downloadJson("spore.json", spore);
          out("#wiz-o2", "Spore erzeugt + ⬇ (nodeId=" + spore.id + "). Nach sbkim/spore.json committen.");
          dlg.querySelector("#wiz-s3").disabled = false; })
        .catch(function (e) { out("#wiz-o2", "Fehler: " + (e && e.message || e), true); b.disabled = false; });
    });
    dlg.querySelector("#wiz-s3").addEventListener("click", function () {
      if (!window.SbkimSpore || !window.SbkimSpore.exportBackup) { out("#wiz-o3", "Modul 02 exportBackup fehlt.", true); return; }
      var pw = window.prompt("Backup-Passwort (mind. 8 Zeichen, KEIN Reset möglich):");
      if (!pw) { out("#wiz-o3", "Abgebrochen — kein Passwort.", true); return; }
      var b = dlg.querySelector("#wiz-s3"); b.disabled = true;
      out("#wiz-o3", "Erzeuge Backup (PBKDF2 600k + AES-GCM-256) …");
      window.SbkimSpore.exportBackup(pw).then(function (blob) {
        downloadJson("sbkimtool-backup-" + new Date().toISOString().replace(/[:.]/g, "-") + ".sbkim.json", blob);
        out("#wiz-o3", "Backup ⬇ — Datei + Passwort sicher aufbewahren.");
      }).catch(function (e) { out("#wiz-o3", "Fehler: " + (e && e.message || e), true); b.disabled = false; });
    });
    // Schritt 4 — Identität wiederherstellen (Modul 02 importBackup). Datei + Passwort →
    // Schlüssel + Spore zurück in die IndexedDB. Bei vorhandenem Slot bewusstes force-Overwrite.
    dlg.querySelector("#wiz-s4").addEventListener("click", function () {
      dlg.querySelector("#wiz-s4-file").click();
    });
    dlg.querySelector("#wiz-s4-file").addEventListener("change", function (ev) {
      var input = ev.target;
      var file = input.files && input.files[0];
      if (!window.SbkimSpore || !window.SbkimSpore.importBackup) { out("#wiz-o4", "Modul 02 importBackup fehlt.", true); return; }
      if (!file) { out("#wiz-o4", "Keine Datei gewählt.", true); return; }
      file.text().then(function (text) {
        var blob;
        try { blob = JSON.parse(text); }
        catch (e) { out("#wiz-o4", "Datei ist kein gültiges JSON-Backup.", true); input.value = ""; return; }
        var pw = window.prompt("Backup-Passwort eingeben (das beim Sichern in Schritt 3 vergebene):");
        if (!pw) { out("#wiz-o4", "Abgebrochen — kein Passwort.", true); input.value = ""; return; }
        out("#wiz-o4", "Entschlüssele Backup (AES-GCM-256) + spiele Identität zurück …");
        window.SbkimSpore.importBackup(blob, pw).then(function (res) {
          afterRestore(res);
        }).catch(function (err) {
          var msg = (err && err.message) ? err.message : String(err);
          var name = (err && err.name) ? err.name : "";
          if (/Overwrite/i.test(name) || /vorhanden|überschreib|overwrite/i.test(msg)) {
            if (window.confirm("Eine Identität mit diesem Schlüssel existiert bereits im Browser. Mit der Backup-Version überschreiben? (Die jetzige lokale Identität geht verloren.)")) {
              out("#wiz-o4", "Überschreibe vorhandene Identität …");
              window.SbkimSpore.importBackup(blob, pw, { force: true }).then(afterRestore)
                .catch(function (e2) { out("#wiz-o4", "Fehler beim Überschreiben: " + (e2 && e2.message || e2), true); });
            } else { out("#wiz-o4", "Abgebrochen — vorhandene Identität unverändert.", true); }
          } else { out("#wiz-o4", "Fehler: " + msg + " (falsches Passwort oder beschädigte Datei?)", true); }
        }).then(function () { input.value = ""; });
      });
    });
    function afterRestore(res) {
      if (res && res.restored) {
        out("#wiz-o4", "Identität wiederhergestellt — Schlüssel + Spore zurück in der Browser-IndexedDB.");
        dlg.querySelector("#wiz-s2").disabled = false;
        dlg.querySelector("#wiz-s3").disabled = false;
      } else {
        out("#wiz-o4", "Nichts wiederhergestellt" + (res && res.reason ? " — " + res.reason : "") + ".", true);
      }
    }
    dlg.querySelector("#wiz-close").addEventListener("click", function () { closeWiz(dlg); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) closeWiz(dlg); });
  }

  function openWizard() {
    var dlg = document.getElementById("sbkim-ident-wizard");
    if (dlg && dlg.showModal) dlg.showModal(); else if (dlg) dlg.setAttribute("open", "");
  }
  function closeWiz(dlg) { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); }
  function downloadJson(filename, obj) {
    var blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a"); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
