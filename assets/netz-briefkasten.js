/* Netz-Briefkasten (INTERFACES §11.6) — gemeinsamer Knopf für alle Seiten.
 * Prüft live im Browser die SIGNAL.json der Peer-Knoten (raw.githubusercontent
 * erlaubt CORS), vergleicht deren seq gegen unseren eigenen ack in sbkim/SIGNAL.json.
 * Server-los, kein Token, instant. Injiziert Knopf (in .statusbar) + Popup selbst,
 * damit jede Seite nur EINE Zeile <script src="assets/netz-briefkasten.js"> braucht.
 */
(function () {
  "use strict";
  // Relativ zur Seite: liegt index/modell/… im Repo-Root, ist sbkim/ daneben.
  var SELF_SIGNAL = "sbkim/SIGNAL.json";
  var PEERS = [
    { name: "Sage-Protokol", signal: "https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/sbkim/SIGNAL.json", mailbox: "https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/sbkim/AUSTAUSCH.md" },
    { name: "Jasons-Tresor", signal: "https://raw.githubusercontent.com/lausiklauskn-png/Jasons-Tresor/main/sbkim/SIGNAL.json", mailbox: "https://github.com/lausiklauskn-png/Jasons-Tresor/blob/main/sbkim/AUSTAUSCH.md" }
  ];

  function init() {
    var bar = document.querySelector(".statusbar");
    if (!bar || document.getElementById("netz-check-btn")) return;

    // Knopf vor die .version (oder ans Ende der Leiste) setzen.
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "netz-check-btn";
    btn.className = "netz-check-btn";
    btn.title = "Briefkästen der anderen Knoten jetzt prüfen (SIGNAL.json, live im Browser)";
    btn.setAttribute("aria-label", "Netz-Briefkasten jetzt prüfen");
    btn.innerHTML = '📬 <span class="ncb-label">Briefkasten</span>';
    var version = bar.querySelector(".version");
    if (version) bar.insertBefore(btn, version); else bar.appendChild(btn);

    // Popup ans Body-Ende.
    var pop = document.createElement("div");
    pop.className = "netz-check-pop";
    pop.id = "netz-check-pop";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", "Netz-Briefkasten-Ergebnis");
    pop.innerHTML = '<button class="close" id="ncp-close" aria-label="schließen">×</button><div id="ncp-body"></div>';
    document.body.appendChild(pop);
    var body = pop.querySelector("#ncp-body");
    var closeBtn = pop.querySelector("#ncp-close");

    function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]; }); }
    async function getJson(url) {
      try { var r = await fetch(url, { cache: "no-cache" }); if (!r.ok) return { err: r.status }; return { json: await r.json() }; }
      catch (e) { return { err: "netz" }; }
    }

    async function check() {
      btn.classList.add("checking"); btn.classList.remove("has-news");
      var ackRes = await getJson(SELF_SIGNAL);
      var ack = (ackRes.json && ackRes.json.ack) || {};
      var rows = [], news = 0, notes = [], reached = 0;
      for (var i = 0; i < PEERS.length; i++) {
        var p = PEERS[i];
        var r = await getJson(p.signal);
        if (r.err) { notes.push(esc(p.name) + ": kein SIGNAL.json (" + esc(r.err) + ")"); continue; }
        reached++; // echter Cross-Knoten-Kontakt: Peer-Signal wirklich gelesen
        var seq = Number(r.json.seq);
        var acked = ack[p.name] == null ? -1 : Number(ack[p.name]);
        if (isFinite(seq) && seq > acked) {
          news++;
          rows.push('<div class="row new">🔔 <b>' + esc(p.name) + "</b> · seq " + seq +
            " (quittiert: " + (acked < 0 ? "—" : acked) + ')<br><span class="muted">' +
            esc(r.json.headline || "") + '</span><br><a href="' + p.mailbox + '" target="_blank" rel="noopener">Briefkasten lesen →</a></div>');
        } else {
          rows.push('<div class="row ok">✓ ' + esc(p.name) + " · nichts Neues (seq " + (isFinite(seq) ? seq : "?") + ")</div>");
        }
      }
      var html = "<h4>" + (news ? "🔔 Neues im Netz (" + news + ")" : "✓ Netz ruhig") + "</h4>" + rows.join("");
      if (notes.length) html += '<div class="row muted">' + notes.join("<br>") + "</div>";
      html += '<div class="row muted">' + new Date().toLocaleString() + "</div>";
      body.innerHTML = html;
      pop.classList.add("show");
      btn.classList.remove("checking");
      btn.classList.toggle("has-news", news > 0);
      // Echter Cross-Knoten-Kontakt erreicht -> Siegel-Beweis (Modul 16 Bronze->Gold).
      if (reached > 0) {
        try { window.dispatchEvent(new CustomEvent("sbkim:handshake", { detail: { outcome: "established", via: "briefkasten", peers: reached } })); } catch (e) {}
      }
    }

    btn.addEventListener("click", check);
    closeBtn.addEventListener("click", function () { pop.classList.remove("show"); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
