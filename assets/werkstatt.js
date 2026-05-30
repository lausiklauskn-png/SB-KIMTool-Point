/*
 * SB·KIMTool·Point — Werkstatt (Browser-Brücke zur Werkzeugkiste)
 *
 * Erster echter Schritt vom Playback Richtung Live-Modell (docs/LIVE-MODELL.md):
 * lädt ein echtes Werkzeug aus web/tools/ und lässt es eine kleine,
 * NACHVOLLZIEHBARE Selbst-Prüfung ausführen. Kein vorgetäuschter Live-Lauf —
 * nur was hier wirklich rechnet, wird als grün gemeldet.
 *
 * Bewusst OFFLINE: prüft 04 Match (reine Funktion) + 16 Siegel (Lesen). Module
 * mit Netz-/DOM-Bedarf (03/05/06/…) werden hier NICHT als grün behauptet.
 *
 * Die Prüf-Funktionen nehmen die bereits auf `window` registrierten Module
 * entgegen (window.SbkimMatch / window.SbkimSiegel) — genau der Pfad, den auch
 * test/werkstatt.test.js headless mit window-Shim geht.
 *
 * Public surface (window.SbkimWerkstatt):
 *   probeMatch()  -> { ok, name, schritte:[{label, wert, erwartet, ok}], fazit }
 *   probeSiegel() -> { ok, name, schritte:[...], fazit }
 *   probeAll()    -> [probeMatch(), probeSiegel()]
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SbkimWerkstatt = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  function step(label, wert, erwartet) {
    return { label: label, wert: wert, erwartet: erwartet, ok: wert === erwartet };
  }

  // ---- 04 Match: reine Offline-Funktion, voll prüfbar ----------------------
  function probeMatch(M) {
    M = M || (typeof window !== "undefined" ? window.SbkimMatch : null);
    var name = "04 Match — semantische Passung (offline)";
    if (!M || typeof M.match !== "function") {
      return { ok: false, name: name, schritte: [], fazit: "Modul 04 nicht geladen." };
    }
    var gleich = new Float32Array(384); gleich[0] = 1;
    var gleich2 = new Float32Array(384); gleich2[0] = 1;
    var quer = new Float32Array(384); quer[1] = 1;

    var schritte = [
      step("Identische Profile → Treffer 1.0", M.match(gleich, gleich2), 1),
      step("Völlig verschiedene → 0.0", M.match(gleich, quer), 0),
      step("Schwelle: 0.9 gilt als Treffer", M.isAboveProviderThreshold(0.9), true),
      step("Schwelle: 0.7 ist kein Treffer", M.isAboveProviderThreshold(0.7), false),
      step("Provider-Schwelle = 0.8 (aus Sage)", M.PROVIDER_MIN_MATCH, 0.8),
    ];
    var ok = schritte.every(function (s) { return s.ok; });
    return {
      ok: ok, name: name, schritte: schritte,
      fazit: ok ? "Match rechnet korrekt — bereit für echte Profile."
                : "Match liefert unerwartete Werte.",
    };
  }

  // ---- 16 Siegel: Geprüft-Zertifikat, Lese-Pfad offline prüfbar ------------
  function probeSiegel(S) {
    S = S || (typeof window !== "undefined" ? window.SbkimSiegel : null);
    var name = "16 Siegel — Geprüft-Nachweis (offline lesen)";
    if (!S || typeof S.getAspects !== "function") {
      return { ok: false, name: name, schritte: [], fazit: "Modul 16 nicht geladen." };
    }
    var aspects = S.getAspects();
    var istListe = Array.isArray(aspects);
    var hatLeseApi = typeof S.isCertified === "function" &&
                     typeof S.getCertifiedModules === "function";
    var schritte = [
      step("Aspekte-Log ist lesbar (Liste)", istListe, true),
      step("Lese-API vorhanden (isCertified/getCertifiedModules)", hatLeseApi, true),
    ];
    var ok = schritte.every(function (s) { return s.ok; });
    return {
      ok: ok, name: name, schritte: schritte,
      fazit: ok ? ("Siegel lesbar — " + (istListe ? aspects.length : 0) +
                   " Aspekt(e) im Log. Grundlage für die Markt-Prüfung.")
                : "Siegel-Lese-API unvollständig.",
    };
  }

  // ---- Netzgebundene Module: EHRLICHE Bereitschafts-Probe ------------------
  // Diese Module brauchen Netz (Modell/CDN bzw. Handshake zwischen zwei Knoten).
  // Offline koennen wir NICHT "grün" behaupten — wir pruefen wahrheitsgemaess nur
  // die Bereitschaft: Modul geladen + erwartete Funktionen registriert. Status
  // bleibt "bereit · braucht Netz", der volle Lauf gilt als ungeprueft (Browser).
  function probeReady(mod, name, fns, netzNote) {
    if (!mod) {
      return { ok: false, status: "fehlt", name: name, schritte: [],
               fazit: "Modul nicht geladen." };
    }
    var schritte = fns.map(function (fn) {
      return step("API vorhanden: " + fn + "()", typeof mod[fn] === "function", true);
    });
    var bereit = schritte.every(function (s) { return s.ok; });
    return {
      ok: bereit,
      status: bereit ? "bereit · braucht Netz" : "unvollständig",
      name: name,
      schritte: schritte,
      fazit: bereit
        ? ("Geladen und vollständig — " + netzNote + " Voller Lauf erst im Browser (ungeprüft).")
        : "Erwartete API unvollständig.",
    };
  }

  function probeEmbedding(E) {
    E = E || (typeof window !== "undefined" ? window.SbkimEmbedding : null);
    return probeReady(E, "03 Embedding — Text verstehen (braucht Netz)",
      ["embedQuery"], "lädt das Sprachmodell per CDN.");
  }
  function probeAnastomose(A) {
    A = A || (typeof window !== "undefined" ? window.SbkimAnastomose : null);
    return probeReady(A, "05 Anastomose — Handschlag zwischen zwei Apps (braucht Netz)",
      ["init", "handshake", "receiveHandshake"], "verbindet zwei Knoten über HTTP/Channel.");
  }
  function probeHeterokaryose(H) {
    H = H || (typeof window !== "undefined" ? window.SbkimHeterokaryose : null);
    return probeReady(H, "06 Heterokaryose — Wissen teilen (braucht Netz)",
      ["init", "requestHeterokaryosis", "receiveHeterokaryosis"], "tauscht Daten mit Geschwister-Knoten.");
  }

  // ---- Live-Match: zwei "das kann ich"-Profile -> Treffer ------------------
  // Der echte Pfad: 03 Embedding (Sprachmodell per CDN) wandelt Text in Vektoren,
  // 04 Match misst die Passung. Das Modell braucht NETZ und laeuft echt erst in
  // Klaus' Browser. Wo es nicht bereit ist (Container/offline), nutzen wir einen
  // DETERMINISTISCHEN Demo-Vektor (klar markiert) — kein vorgetaeuschtes Embedding.
  //
  // Demo-Vektor: einfacher Wort-Hash auf 384 Dimensionen, L2-normalisiert. Genug,
  // damit aehnliche Texte aehnlicher sind als verschiedene — ehrlich als Demo,
  // NICHT als das echte multilingual-e5-small ausgegeben.
  function demoVector(text) {
    var v = new Float32Array(384);
    var worte = String(text).toLowerCase().split(/[^a-zäöüß0-9]+/).filter(Boolean);
    for (var i = 0; i < worte.length; i++) {
      var w = worte[i];
      // Jedes Wort auf DREI Dimensionen streuen (drei Hash-Seeds), damit gleiche
      // Woerter echte Ueberlappung erzeugen und nicht zufaellig kollidieren.
      var seeds = [2166136261, 16777619, 5381];
      for (var s = 0; s < seeds.length; s++) {
        var h = seeds[s];
        for (var j = 0; j < w.length; j++) h = (h * 31 + w.charCodeAt(j)) >>> 0;
        v[h % 384] += 1;
      }
    }
    var norm = 0; for (var k = 0; k < 384; k++) norm += v[k] * v[k];
    norm = Math.sqrt(norm) || 1;
    for (var m = 0; m < 384; m++) v[m] /= norm;
    return v;
  }

  function liveMatch(profilA, profilB, deps) {
    deps = deps || {};
    // "match" in deps explizit gesetzt (auch null) -> respektieren; sonst window.
    var E = ("embedding" in deps) ? deps.embedding
          : (typeof window !== "undefined" ? window.SbkimEmbedding : null);
    var M = ("match" in deps) ? deps.match
          : (typeof window !== "undefined" ? window.SbkimMatch : null);
    if (!M || typeof M.match !== "function") {
      return Promise.resolve({ ok: false, fazit: "Modul 04 Match nicht geladen." });
    }
    var echt = !!(E && typeof E.isReady === "function" && E.isReady() &&
                  typeof E.embedQuery === "function");

    var vecsP;
    if (echt) {
      vecsP = Promise.all([E.embedQuery(profilA), E.embedPassage(profilB)]);
    } else {
      vecsP = Promise.resolve([demoVector(profilA), demoVector(profilB)]);
    }
    return vecsP.then(function (vecs) {
      var score = M.match(vecs[0], vecs[1]);
      var treffer = M.isAboveProviderThreshold(score);
      return {
        ok: true,
        echt: echt,
        quelle: echt ? "echtes Embedding (multilingual-e5-small)"
                     : "Demo-Vektor (Modell nicht geladen — braucht Netz)",
        profilA: profilA,
        profilB: profilB,
        score: score,
        treffer: treffer,
        schwelle: M.PROVIDER_MIN_MATCH,
        fazit: (treffer ? "Treffer" : "kein Treffer") +
               " — Passung " + score.toFixed(3) +
               " (Schwelle " + M.PROVIDER_MIN_MATCH + ")" +
               (echt ? "" : " · DEMO-Vektor, echtes Ergebnis erst in Klaus' Browser"),
      };
    });
  }

  // ---- End-to-End: ein Protokoll-Lauf über mehrere Module -------------------
  // Erstmals wirken die Bausteine als KETTE statt einzeln — die SBKIM-Vermittlung
  // in einem Durchlauf, jeder Schritt nachvollziehbar:
  //   1) Identität (02 Spore)         — braucht Browser (WebCrypto + IndexedDB)
  //   2) Passung   (03 Embedding+04)  — Match offline/echt, Embedding braucht Netz
  //   3) Vertrauen (02 verifyForeign) — bei Treffer: eigene Spore signieren+prüfen
  //   4) Siegel    (16)               — Geprüft-Stand lesen
  // Ehrlich abgestuft: Schritte ohne Browser-API melden "braucht Browser", nicht grün.
  function protocolRun(profilA, profilB, deps) {
    deps = deps || {};
    var Sp = ("spore" in deps) ? deps.spore
           : (typeof window !== "undefined" ? window.SbkimSpore : null);
    var Si = ("siegel" in deps) ? deps.siegel
           : (typeof window !== "undefined" ? window.SbkimSiegel : null);
    var schritte = [];
    var push = function (label, status, info) {
      schritte.push({ label: label, status: status, info: info || "" });
    };

    // 1) Identität — nur mit echtem Browser (WebCrypto + IndexedDB)
    var identP;
    if (Sp && typeof Sp.getOrCreateIdentity === "function") {
      identP = Sp.init()
        .then(function () { return Sp.getOrCreateIdentity(); })
        .then(function () { return Sp.getNodeId(); })
        .then(function (nodeId) {
          push("1) Identität (02 Spore)", "ok", "nodeId " + String(nodeId).slice(0, 12) + "…");
          return nodeId;
        })
        .catch(function (e) {
          push("1) Identität (02 Spore)", "browser",
               "braucht Browser: " + String(e && e.name || e).slice(0, 40));
          return null;
        });
    } else {
      identP = Promise.resolve(null);
      push("1) Identität (02 Spore)", "browser", "Modul 02 nicht geladen.");
    }

    return identP.then(function (nodeId) {
      // 2) Passung — Match echt (offline möglich)
      return liveMatch(profilA, profilB, deps).then(function (m) {
        if (!m.ok) { push("2) Passung (04 Match)", "bad", m.fazit); return finish(); }
        push("2) Passung (03+04)", m.treffer ? "ok" : "ready",
             m.fazit + (m.echt ? " · echtes Embedding" : ""));

        // 3) Vertrauen — nur bei Treffer und mit Browser-Identität
        var vertrauenP;
        if (m.treffer && nodeId && typeof Sp.generateOwnSpore === "function") {
          vertrauenP = Sp.generateOwnSpore({
            domain: "protokoll-lauf", endpoint: "https://example.test/lauf", nodeType: "hybrid",
          }).then(function (spore) {
            return Sp.verifyForeignSpore(spore);
          }).then(function (r) {
            push("3) Vertrauen (02 verify)", (r && r.valid) ? "ok" : "bad",
                 (r && r.valid) ? "eigene Spore signiert + verifiziert"
                                : ("abgelehnt: " + (r && r.reason)));
          }).catch(function (e) {
            push("3) Vertrauen (02 verify)", "browser", "braucht Browser: " + String(e && e.name || e).slice(0, 40));
          });
        } else {
          vertrauenP = Promise.resolve();
          push("3) Vertrauen (02 verify)",
               m.treffer ? "browser" : "skip",
               m.treffer ? "braucht Browser-Identität" : "übersprungen (kein Treffer)");
        }
        return vertrauenP.then(finish);
      });
    });

    function finish() {
      // 4) Siegel — Geprüft-Stand lesen (synchron, offline lesbar)
      if (Si && typeof Si.getAspects === "function") {
        var n = (Si.getAspects() || []).length;
        var zert = (typeof Si.isCertified === "function") ? Si.isCertified() : null;
        push("4) Siegel (16)", "ok",
             n + " Aspekt(e) im Log" + (zert === null ? "" : (zert ? " · zertifiziert" : " · noch nicht zertifiziert")));
      } else {
        push("4) Siegel (16)", "browser", "Modul 16 nicht geladen.");
      }
      var grün = schritte.filter(function (s) { return s.status === "ok"; }).length;
      return {
        ok: !schritte.some(function (s) { return s.status === "bad"; }),
        schritte: schritte,
        zusammenfassung: grün + "/" + schritte.length + " Schritte grün" +
          (schritte.some(function (s) { return s.status === "browser"; })
            ? " · einige Schritte brauchen Klaus' Browser" : ""),
      };
    }
  }

  // Voll offline-bewiesen (grün/rot) vs. nur bereitschafts-geprüft (braucht Netz).
  function probeAll() {
    return {
      offline: [probeMatch(), probeSiegel()],
      netz: [probeEmbedding(), probeAnastomose(), probeHeterokaryose()],
    };
  }

  return {
    probeMatch: probeMatch,
    probeSiegel: probeSiegel,
    probeEmbedding: probeEmbedding,
    probeAnastomose: probeAnastomose,
    probeHeterokaryose: probeHeterokaryose,
    liveMatch: liveMatch,
    protocolRun: protocolRun,
    probeAll: probeAll,
    version: "0.4.0",
  };
});
