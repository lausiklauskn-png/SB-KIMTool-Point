/* Netz-Briefkasten (INTERFACES §11.6) — gemeinsamer Knopf + reiche Karten-Ansicht
 * für ALLE Seiten. Pro Nachbar drei Ebenen, wie in der SBKIM-Referenz (Mein-Tresor),
 * re-geskinnt in unsere Teal-Identität:
 *   ① Spore  — verified-spore + nodeId (aus eingefrorener Inbox-Momentaufnahme)
 *   ② Match  — Cosinus LIVE im Browser nachgerechnet (eigener ⟷ Nachbar-Vektor), ≥0.80 = verified-match
 *   ③ Sync   — ungelesen/synchron (Nachbar-SIGNAL seq ↔ unser ack)
 *   ④ Brief  — Postfach des Nachbarn öffnen
 * Server-los, kein Token, offline-fähig (raw.githubusercontent erlaubt CORS).
 * Injiziert Knopf (in .statusbar) + Modal selbst -> jede Seite braucht nur EINE
 * <script src="assets/netz-briefkasten.js">-Zeile.
 *
 * VORTEIL gegenüber der Referenz (bewusst behalten): zusätzlich läuft ein
 * GitHub-Action-Wächter (.github/sbkim-watch.mjs) zeitgesteuert und öffnet bei
 * Neuem von allein ein Issue — auch wenn niemand die Seite offen hat.
 */
(function () {
  "use strict";

  var SELF = "SB·KIMTool·Point";
  var SELF_SIGNAL = "sbkim/SIGNAL.json";
  var SELF_SPORE = "sbkim/spore.json"; // eigener domainVector + id für den Live-Match
  var PEERS = [
    { name: "Sage-Protokol", label: "Sage-Protokol",
      inbox: "sbkim/sage_inbox.json",
      mailbox: "https://github.com/lausiklauskn-png/Sage-Protokol/blob/main/sbkim/AUSTAUSCH.md",
      signal: "https://raw.githubusercontent.com/lausiklauskn-png/Sage-Protokol/main/sbkim/SIGNAL.json" },
    { name: "Jasons-Tresor", label: "Jasons-Tresor (Schwester)",
      inbox: "sbkim/jason_inbox.json",
      mailbox: "https://github.com/lausiklauskn-png/Jasons-Tresor/blob/main/sbkim/AUSTAUSCH.md",
      signal: "https://raw.githubusercontent.com/lausiklauskn-png/Jasons-Tresor/main/sbkim/SIGNAL.json" },
    { name: "Mein-Tresor", label: "Mein-Tresor (Schwester)",
      inbox: "sbkim/meintresor_inbox.json",
      mailbox: "https://github.com/lausiklauskn-png/Mein-Tresor/blob/main/sbkim/AUSTAUSCH-SBKIMTool.md",
      signal: "https://raw.githubusercontent.com/lausiklauskn-png/Mein-Tresor/main/sbkim/SIGNAL.json" },
    { name: "Mein-Rezeptbuch", label: "Mein-Rezeptbuch",
      inbox: "sbkim/rezeptbuch_inbox.json",
      mailbox: "https://github.com/lausiklauskn-png/Mein-Rezeptbuch/blob/main/sbkim/AUSTAUSCH-SBKIMTool.md",
      signal: "https://raw.githubusercontent.com/lausiklauskn-png/Mein-Rezeptbuch/main/sbkim/SIGNAL.json" }
  ];

  // Re-geskinntes Siegel (eigene Teal-Identität, inline -> offline, kein Asset nötig).
  var SIEGEL_SVG =
    '<svg viewBox="0 0 64 64" width="74" height="74" aria-hidden="true" style="display:block;margin:0 auto .3rem">' +
    '<circle cx="32" cy="32" r="29" fill="none" stroke="#36d6c3" stroke-width="2"/>' +
    '<circle cx="32" cy="32" r="23" fill="none" stroke="#1f7a72" stroke-width="1.5"/>' +
    '<circle cx="32" cy="32" r="8.5" fill="#36d6c3" opacity="0.18" stroke="#36d6c3" stroke-width="1.5"/>' +
    '<path d="M32 32 L32 12 M32 32 L51 23 M32 32 L46 49 M32 32 L18 49 M32 32 L13 23" stroke="#36d6c3" stroke-width="1.2" opacity="0.8"/>' +
    '<circle cx="32" cy="12" r="2.4" fill="#36d6c3"/><circle cx="51" cy="23" r="2.4" fill="#36d6c3"/>' +
    '<circle cx="46" cy="49" r="2.4" fill="#36d6c3"/><circle cx="18" cy="49" r="2.4" fill="#36d6c3"/>' +
    '<circle cx="13" cy="23" r="2.4" fill="#36d6c3"/>' +
    '<text x="32" y="60" text-anchor="middle" fill="#8a97a3" font-size="6" font-family="monospace">SBKIM</text></svg>';

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c];
    });
  }
  async function getJson(url) {
    try { var r = await fetch(url, { cache: "no-store" }); if (!r.ok) return { error: "HTTP " + r.status }; return { json: await r.json() }; }
    catch (e) { return { error: "netz" }; }
  }
  function cosine(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return null;
    var dot = 0, na = 0, nb = 0;
    for (var i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
    if (!na || !nb) return null;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
  }

  function init() {
    var bar = document.querySelector(".statusbar");
    if (!bar || document.getElementById("netz-check-btn")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "netz-check-btn";
    btn.className = "netz-check-btn";
    btn.title = "SBKIM-Briefkasten: Spore/Match/Sync der Nachbarn live im Browser prüfen";
    btn.setAttribute("aria-label", "SBKIM-Briefkasten öffnen");
    btn.innerHTML = '📬 <span class="ncb-label">Briefkasten</span><span class="ncb-badge" id="ncb-badge" hidden></span>';
    var version = bar.querySelector(".version");
    if (version) bar.insertBefore(btn, version); else bar.appendChild(btn);

    // Modal (Overlay + zentrierte Karte).
    var ov = document.createElement("div");
    ov.id = "netz-mb-overlay";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-label", "SBKIM-Briefkasten");
    ov.innerHTML =
      '<div class="netz-mb-card">' +
      '  <button class="netz-mb-close" id="netz-mb-close" aria-label="schließen">×</button>' +
      '  <h3 class="netz-mb-title">📬 SBKIM-Briefkasten</h3>' +
      '  <div id="netz-mb-body"></div>' +
      '</div>';
    document.body.appendChild(ov);
    var body = ov.querySelector("#netz-mb-body");

    function closeModal() { ov.classList.remove("show"); }
    ov.querySelector("#netz-mb-close").addEventListener("click", closeModal);
    ov.addEventListener("click", function (e) { if (e.target === ov) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });

    function setBadge(n) {
      var b = document.getElementById("ncb-badge");
      if (!b) return;
      if (n > 0) { b.textContent = String(n); b.hidden = false; btn.classList.add("has-news"); }
      else { b.hidden = true; btn.classList.remove("has-news"); }
    }

    async function check(silent) {
      if (!silent) {
        body.innerHTML = '<p class="netz-mb-loading">Lese Nachbarn & rechne die Verbindung live nach …</p>';
        ov.classList.add("show");
      } else {
        btn.classList.add("checking");
      }

      var selfAck = {}, selfVec = null, selfId = "";
      var s = await getJson(SELF_SIGNAL);
      if (s.json && s.json.ack) selfAck = s.json.ack;
      if (!silent) {
        var sp = await getJson(SELF_SPORE);
        if (sp.json) { if (Array.isArray(sp.json.domainVector)) selfVec = sp.json.domainVector; selfId = sp.json.id || ""; }
      }

      var cards = [], unread = 0, connected = 0, reached = 0;
      var total = PEERS.length;

      for (var i = 0; i < PEERS.length; i++) {
        var peer = PEERS[i];
        var sig = await getJson(peer.signal);
        var seq = sig.json ? (Number(sig.json.seq) || 0) : null;
        if (seq !== null) reached++;
        var seen = Number(selfAck[peer.name]) || 0;

        var sync;
        if (seq === null) sync = '<span class="nm-muted">SIGNAL nicht lesbar</span>';
        else if (seq > seen) { unread++; sync = '<b class="nm-warn">⏳ ' + (seq - seen) + ' ungelesen</b> (ihr seq ' + seq + ')'; }
        else sync = '<span class="nm-ok">✔ synchron</span> (seq ' + seq + ', quittiert ' + seen + ')';

        var spore = "—", match = "—";
        if (!silent) {
          var inbox = await getJson(peer.inbox);
          if (inbox.json) {
            spore = '<span class="nm-ok">✔ verified-spore</span> · <code>' + esc((inbox.json.id || "").slice(0, 16)) + '…</code>';
            var c = selfVec && Array.isArray(inbox.json.domainVector) ? cosine(selfVec, inbox.json.domainVector) : null;
            if (c === null) match = '<span class="nm-muted">wartet auf Vektor</span>';
            else if (c >= 0.8) { connected++; match = '<span class="nm-ok">✔ verified-match</span> · cos <b>' + c.toFixed(4) + '</b>'; }
            else match = '<span class="nm-muted">cos ' + c.toFixed(4) + ' — unter 0.80</span>';
          } else spore = '<span class="nm-muted">Spore nicht lesbar</span>';
        }

        cards.push(
          '<div class="netz-mb-peer">' +
          '<div class="nm-name">' + esc(peer.label || peer.name) + '</div>' +
          '<div class="nm-rows">' +
          '<div><span class="nm-k">① Spore</span>' + spore + '</div>' +
          '<div><span class="nm-k">② Match</span>' + match + '</div>' +
          '<div><span class="nm-k">③ Sync</span>' + sync + '</div>' +
          '<div><span class="nm-k">④ Brief</span><a href="' + esc(peer.mailbox) + '" target="_blank" rel="noopener">Postfach öffnen ↗</a></div>' +
          '</div></div>');
      }

      setBadge(unread);

      if (!silent) {
        var head =
          '<div class="netz-mb-head">' + SIEGEL_SVG +
          '<div class="nm-self">' + esc(SELF) + ' — SBKIM-Endknoten</div>' +
          '<div class="nm-id">' + (selfId ? "nodeId " + esc(selfId.slice(0, 20)) + "… · verified-spore ✔" : "Identität: sbkim/spore.json") + '</div></div>';
        var foot =
          '<p class="netz-mb-foot"><b class="nm-ok">' + connected + '/' + total + ' verbunden</b> · ' +
          (unread ? '<b class="nm-warn">' + unread + ' ungelesen</b>' : '📭 alles synchron') + '</p>' +
          '<p class="netz-mb-note">Match jetzt <b>live in deinem Browser</b> nachgerechnet (Cosinus eigener ⟷ Nachbar-Spore). Quittieren via <code>ack</code> in sbkim/SIGNAL.json.</p>';
        body.innerHTML = head + cards.join("") + foot;
      }

      btn.classList.remove("checking");
      // Echter Cross-Knoten-Kontakt -> Siegel-Beweis (Modul 16 Bronze->Gold).
      if (reached > 0) {
        try { window.dispatchEvent(new CustomEvent("sbkim:handshake", { detail: { outcome: "established", via: "briefkasten", peers: reached } })); } catch (e) {}
      }
    }

    btn.addEventListener("click", function () { check(false); });
    // Beim Laden still prüfen -> nur Badge setzen (kein Modal).
    check(true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
