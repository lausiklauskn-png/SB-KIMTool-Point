/*!
 * SB·KIMTool·Point — Modul 01 "Storage"
 * Version 0.1.0 · 2026 · Quelle: SB-KIMTool-Point (Point-eigene Umsetzung)
 *
 * Speicher-Wrapper fuer alle sbkim_* Daten. Eine einzige, abhaengigkeitsfreie,
 * offline-taugliche Datei zum Kopieren in eine fremde PWA.
 *
 * Browser  : IndexedDB-gestuetzter Schluessel/Wert-Speicher (ueberlebt Neustart).
 * Headless : faellt automatisch auf einen In-Memory-Speicher zurueck (Node, Tests).
 *
 * Ehrlichkeit: Die API + der In-Memory-Pfad sind per `npm test` bewiesen. Der
 * IndexedDB-Pfad laeuft echt im Browser — bis Klaus ihn dort gesehen hat, gilt er
 * als "ungeprueft, wartet auf Klaus' Browser-Lauf".
 *
 * Verwendung (Browser):
 *   <script src="sbkim-storage.js"></script>
 *   const store = await SBKIMStorage.open("sbkim");
 *   await store.set("spore", { nodeId: "…" });
 *   const spore = await store.get("spore");   // -> {nodeId:"…"} oder null
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  // CommonJS (Node, Tests)
  if (typeof module === "object" && module.exports) module.exports = api;
  // Browser-Global / Worker
  if (root) root.SBKIMStorage = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var DB_PREFIX = "sbkim_";
  var STORE = "kv";

  // In-Memory-Registry: ein Map je Namensraum, gilt nur fuer die laufende Sitzung.
  var memoryDbs = Object.create(null);

  function hasIndexedDB() {
    return typeof indexedDB !== "undefined" && indexedDB !== null;
  }

  // ---- In-Memory-Backend (Node / Fallback) --------------------------------
  function memoryStore(namespace) {
    var map = memoryDbs[namespace] || (memoryDbs[namespace] = new Map());
    return {
      backend: "memory",
      set: function (key, value) {
        // tief kopieren ueber JSON, damit gespeicherte Werte unveraenderlich sind
        map.set(String(key), JSON.stringify(value === undefined ? null : value));
        return Promise.resolve();
      },
      get: function (key) {
        var raw = map.get(String(key));
        return Promise.resolve(raw === undefined ? null : JSON.parse(raw));
      },
      remove: function (key) {
        map.delete(String(key));
        return Promise.resolve();
      },
      keys: function () {
        return Promise.resolve(Array.from(map.keys()));
      },
      clear: function () {
        map.clear();
        return Promise.resolve();
      },
    };
  }

  // ---- IndexedDB-Backend (Browser) ----------------------------------------
  function openDb(namespace) {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_PREFIX + namespace, 1);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function tx(db, mode, fn) {
    return new Promise(function (resolve, reject) {
      var t = db.transaction(STORE, mode);
      var os = t.objectStore(STORE);
      var out = fn(os);
      t.oncomplete = function () { resolve(out && out.result !== undefined ? out.result : undefined); };
      t.onerror = function () { reject(t.error); };
      t.onabort = function () { reject(t.error); };
    });
  }

  function idbStore(namespace) {
    var dbp = openDb(namespace);
    return {
      backend: "indexeddb",
      set: function (key, value) {
        return dbp.then(function (db) {
          return tx(db, "readwrite", function (os) {
            os.put(JSON.stringify(value === undefined ? null : value), String(key));
          });
        });
      },
      get: function (key) {
        return dbp.then(function (db) {
          return new Promise(function (resolve, reject) {
            var t = db.transaction(STORE, "readonly");
            var r = t.objectStore(STORE).get(String(key));
            r.onsuccess = function () {
              resolve(r.result === undefined ? null : JSON.parse(r.result));
            };
            r.onerror = function () { reject(r.error); };
          });
        });
      },
      remove: function (key) {
        return dbp.then(function (db) {
          return tx(db, "readwrite", function (os) { os.delete(String(key)); });
        });
      },
      keys: function () {
        return dbp.then(function (db) {
          return new Promise(function (resolve, reject) {
            var t = db.transaction(STORE, "readonly");
            var r = t.objectStore(STORE).getAllKeys();
            r.onsuccess = function () { resolve(Array.from(r.result || [])); };
            r.onerror = function () { reject(r.error); };
          });
        });
      },
      clear: function () {
        return dbp.then(function (db) {
          return tx(db, "readwrite", function (os) { os.clear(); });
        });
      },
    };
  }

  // ---- Oeffentliche Fabrik ------------------------------------------------
  function open(namespace) {
    var ns = namespace == null ? "sbkim" : String(namespace);
    return Promise.resolve(hasIndexedDB() ? idbStore(ns) : memoryStore(ns));
  }

  return { open: open, version: "0.1.0" };
});
