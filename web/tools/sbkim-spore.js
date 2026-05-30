/*!
 * SB·KIMTool·Point — Modul 02 "Spore"
 * Version 0.1.0 · 2026 · Quelle: SB-KIMTool-Point (Point-eigene Umsetzung)
 *
 * Kryptografische Identitaet eines Knotens. Eine einzige, abhaengigkeitsfreie,
 * offline-taugliche Datei zum Kopieren in eine fremde PWA.
 *
 *   Schluesselpaar : Ed25519 ueber WebCrypto (crypto.subtle) — echte Krypto.
 *   nodeId         : SHA-256(rohes oeffentliches Schluessel-Bytes), als Hex.
 *   Geheimnis      : der private Schluessel bleibt in der Closure. Es verlaesst
 *                    NUR der oeffentliche Teil das Modul (exportPublic()).
 *
 * WEBCRYPTO-ANFORDERUNG (ehrlich): Ed25519 in WebCrypto ist relativ jung. Aeltere
 * Browser (u.a. manche Tablet-Browser) koennen es noch nicht. Darum kein stiller
 * Bruch: `SBKIMSpore.isSupported()` meldet vorab ehrlich true/false, und `create()`
 * wirft eine klare Meldung statt undefiniert zu scheitern. Headless ist der
 * Sign/Verify-Pfad per `npm test` gegen Node-WebCrypto bewiesen; der Browser-Pfad
 * gilt als "ungeprueft, wartet auf Klaus' Browser-Lauf", bis er ihn gesehen hat.
 *
 * Verwendung (Browser):
 *   <script src="sbkim-spore.js"></script>
 *   if (!(await SBKIMSpore.isSupported())) {  // ehrlicher Hinweis statt Bruch
 *     alert("Dieser Browser kann Ed25519 noch nicht."); return;
 *   }
 *   const spore = await SBKIMSpore.create();
 *   const sig   = await spore.sign("hallo");          // Hex-Signatur
 *   const ok    = await spore.verify("hallo", sig);   // true
 *   const oeffentlich = spore.exportPublic();          // {nodeId, alg, publicKey}
 *   // teilbar; der private Schluessel ist NICHT enthalten.
 *   const fremdOk = await SBKIMSpore.verify(oeffentlich, "hallo", sig); // true
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  // CommonJS (Node, Tests)
  if (typeof module === "object" && module.exports) module.exports = api;
  // Browser-Global / Worker
  if (root) root.SBKIMSpore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var ALG = "Ed25519";

  // crypto.subtle aus dem jeweiligen Wirt holen (Browser-Fenster, Worker, Node 20+).
  function getSubtle() {
    var c = (typeof globalThis !== "undefined" && globalThis.crypto) ? globalThis.crypto
          : (typeof crypto !== "undefined" ? crypto : null);
    return c && c.subtle ? c.subtle : null;
  }

  function utf8(str) { return new TextEncoder().encode(String(str)); }

  // Hex statt base64 ueberall: trivial in beide Richtungen, keine btoa/atob-Abhaengigkeit.
  function bytesToHex(buf) {
    var b = new Uint8Array(buf), s = "";
    for (var i = 0; i < b.length; i++) {
      s += (b[i] >>> 4).toString(16) + (b[i] & 15).toString(16);
    }
    return s;
  }
  function hexToBytes(hex) {
    var h = String(hex), n = h.length >> 1, out = new Uint8Array(n);
    for (var i = 0; i < n; i++) out[i] = parseInt(h.substr(i * 2, 2), 16);
    return out;
  }

  function requireSubtle() {
    var subtle = getSubtle();
    if (!subtle) {
      return Promise.reject(new Error(
        "WebCrypto fehlt (crypto.subtle). Modul 02 Spore braucht einen modernen " +
        "Browser/Node mit WebCrypto-Ed25519."));
    }
    return Promise.resolve(subtle);
  }

  // Ehrliche Feature-Erkennung: versucht wirklich, einen Ed25519-Schluessel zu erzeugen.
  // Liefert eine Promise<boolean> — false statt stillem Bruch auf alten Browsern.
  function isSupported() {
    var subtle = getSubtle();
    if (!subtle) return Promise.resolve(false);
    return subtle.generateKey({ name: ALG }, false, ["sign", "verify"])
      .then(function () { return true; })
      .catch(function () { return false; });
  }

  function nodeIdFrom(subtle, rawPub) {
    return subtle.digest("SHA-256", rawPub).then(bytesToHex);
  }

  // Pruef-Hilfe an einen ROHEN oeffentlichen Schluessel (Bytes) gebunden.
  function verifyWithRaw(subtle, rawPub, message, signatureHex) {
    return subtle.importKey("raw", rawPub, { name: ALG }, false, ["verify"])
      .then(function (pk) {
        return subtle.verify({ name: ALG }, pk, hexToBytes(signatureHex), utf8(message));
      });
  }

  // Neue Knoten-Identitaet erzeugen. Der private Schluessel bleibt in der Closure.
  function create() {
    var subtle;
    return requireSubtle().then(function (s) {
      subtle = s;
      return subtle.generateKey({ name: ALG }, true, ["sign", "verify"]).catch(function (e) {
        throw new Error("Ed25519 wird hier nicht unterstuetzt: " +
          (e && e.message ? e.message : e));
      });
    }).then(function (pair) {
      var priv = pair.privateKey; // geheim, verlaesst das Modul nie
      return subtle.exportKey("raw", pair.publicKey).then(function (rawPub) {
        return nodeIdFrom(subtle, rawPub).then(function (nodeId) {
          var pubHex = bytesToHex(rawPub);
          return {
            nodeId: nodeId,
            alg: ALG,
            publicKey: pubHex,
            // Eine String-Nachricht signieren -> Hex-Signatur.
            sign: function (message) {
              return subtle.sign({ name: ALG }, priv, utf8(message)).then(bytesToHex);
            },
            // Mit dem EIGENEN oeffentlichen Schluessel pruefen.
            verify: function (message, signatureHex) {
              return verifyWithRaw(subtle, rawPub, message, signatureHex);
            },
            // NUR den oeffentlichen Teil herausgeben (nodeId + publicKey). Kein Privatschluessel.
            exportPublic: function () {
              return { nodeId: nodeId, alg: ALG, publicKey: pubHex };
            },
          };
        });
      });
    });
  }

  // Statisch pruefen mit einer exportierten oeffentlichen Spore
  // (Objekt {publicKey} aus exportPublic() oder direkt der Hex-String).
  function verify(exportedPublic, message, signatureHex) {
    var pubHex = typeof exportedPublic === "string"
      ? exportedPublic
      : (exportedPublic && exportedPublic.publicKey);
    if (!pubHex) return Promise.reject(new Error("publicKey fehlt"));
    return requireSubtle().then(function (subtle) {
      return verifyWithRaw(subtle, hexToBytes(pubHex), message, signatureHex);
    });
  }

  // nodeId aus einem oeffentlichen Schluessel (Hex) neu berechnen — so kann ein
  // Pruefer die Bindung "nodeId == SHA-256(publicKey)" selbst bestaetigen.
  function nodeId(publicKeyHex) {
    return requireSubtle().then(function (subtle) {
      return nodeIdFrom(subtle, hexToBytes(publicKeyHex));
    });
  }

  return {
    create: create,
    verify: verify,
    isSupported: isSupported,
    nodeId: nodeId,
    version: "0.1.0",
  };
});
