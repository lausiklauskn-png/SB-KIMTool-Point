/* SB·KIMTool·Point — Service Worker (Klaus 2026-09-30: „soll installierbar sein").
 *
 * Netz zuerst, Vorrat nur, wenn das Netz fehlt. Die Seiten zeigen einen
 * aufgezeichneten Lauf und lesen status.json; eine veraltete Fassung aus dem
 * Vorrat sähe aus wie ein aktueller Stand. Offline kommt die zuletzt gesehene.
 *
 * Nur eigene Adressen, nur GET, nur vollständige Antworten (200). Fremde
 * Adressen (Relais, andere Knoten) kommen nie in den Vorrat.
 * Nur EIGENE Vorräte aufräumen: `caches` gehört dem Ursprung, nicht dem Pfad —
 * auf lausiklauskn-png.github.io liegen rund zwanzig Apps. */
var CACHE = "kimtool-point-v3";
var PRAEFIX = "kimtool-point-";
var SHELL = [
  "./", "./index.html", "./modell.html", "./werkzeuge.html", "./markt.html",
  "./manifest.webmanifest", "./assets/style.css", "./assets/installieren.js?v=3",
  "./assets/img/icon-192.png?v=3", "./assets/img/icon-512.png?v=3"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () {}); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf(PRAEFIX) === 0 && k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith(fetch(req).then(function (res) {
    if (res && res.status === 200 && res.type === "basic") {
      var kopie = res.clone();
      caches.open(CACHE).then(function (c) { c.put(req, kopie); });
    }
    return res;
  }).catch(function () {
    return caches.match(req).then(function (r) {
      return r || (req.mode === "navigate" ? caches.match("./index.html") : Response.error());
    });
  }));
});
