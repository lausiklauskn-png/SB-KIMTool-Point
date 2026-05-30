// browser-verify.mjs — ECHTER Browser-Beweis (Playwright/Chromium).
//
// Anders als test/modules.test.js (headless, window-Shim) laedt dieser Lauf die
// Werkzeuge-Seite in einem ECHTEN Chromium: IndexedDB, WebCrypto und DOM sind real.
// Damit werden die bisher "wartet auf Klaus' Browser-Lauf"-Pfade automatisch belegt:
//   - 01 Storage: echtes IndexedDB put/get
//   - 02 Spore:  echtes Ed25519 erzeugen + signieren + verifizieren (WebCrypto)
//   - Werkstatt: Knopf "Werkzeuge pruefen" -> echte Proben im DOM
//
// EHRLICHE GRENZE: Live-Verbindung zu den echten Endknoten (github.io) ist durch
// die Netz-Policy des Containers blockiert (403). Der Cross-Knoten-Handshake wird
// daher hier NICHT gegen Live-Knoten getestet — der offene Live-Pfad ist in
// docs/LIVE-MODELL.md dokumentiert (fuer spaetere Agenten-Loesungen).
//
// Start: node test/browser-verify.mjs   (bzw. npm run verify)
// Playwright wird global ODER lokal aufgeloest; fehlt es, endet der Lauf mit
// klarer Meldung statt hart zu scheitern (CI-freundlich, ehrlich).

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);

function loadPlaywright() {
  const candidates = [];
  try { candidates.push(require.resolve("playwright")); } catch {}
  for (const base of ["/opt/node22/lib/node_modules", "/usr/lib/node_modules", "/usr/local/lib/node_modules"]) {
    try { candidates.push(require.resolve("playwright", { paths: [base] })); } catch {}
  }
  for (const c of candidates) {
    try { return require(c); } catch {}
  }
  return null;
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent((req.url || "/").split("?")[0]);
      if (p === "/") p = "/index.html";
      const full = normalize(join(ROOT, p));
      if (!full.startsWith(ROOT)) { res.writeHead(403); res.end("nope"); return; }
      const body = await readFile(full);
      res.writeHead(200, { "Content-Type": MIME[extname(full)] || "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404); res.end("not found");
    }
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

const results = [];
const ok = (name, cond, detail = "") => results.push({ name, ok: !!cond, detail });

async function main() {
  const pw = loadPlaywright();
  if (!pw) {
    console.log("⚠ Playwright nicht gefunden — echter Browser-Lauf übersprungen.");
    console.log("  (npm test deckt die headless-Logik ab; dieser Lauf ist der Browser-Zusatzbeweis.)");
    process.exit(0); // ehrlich: kein Fehlschlag, nur nicht verfügbar
  }
  const server = await startServer();
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;
  const browser = await pw.chromium.launch();
  const errors = [];
  try {
    const page = await browser.newPage();
    // Echte JS-Fehler sammeln. Fehlende OPTIONALE Bild-Assets (icon/banner/ambient/
    // hero/truhe) sind KEIN Logik-Fehler — sie sind progressive enhancement (Gradient-
    // Fallback, liefert Klaus). Solche 404 ehrlich ausfiltern, nicht rot faerben.
    const harmlosesAsset = /\.(png|jpg|jpeg|webp|svg|ico)(\?|$)/i;
    const fehlende404 = new Set();
    page.on("response", (resp) => { if (resp.status() === 404) fehlende404.add(resp.url()); });
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => {
      if (m.type() !== "error") return;
      const t = m.text();
      // "Failed to load resource"-Zeilen tragen keine URL -> separat über response-404 bewerten
      if (/Failed to load resource/i.test(t)) return;
      errors.push(t);
    });

    // 1) Werkzeuge-Seite laden, Werkstatt-Knopf klicken
    await page.goto(`${base}/werkzeuge.html`, { waitUntil: "networkidle" });
    await page.click("#werkstatt-run");
    await page.waitForSelector(".probe", { timeout: 5000 });
    const gruen = await page.locator(".probe.ok").count();
    const bereit = await page.locator(".probe.ready").count();
    ok("Werkstatt: >=2 offline-Proben grün", gruen >= 2, `gefunden: ${gruen}`);
    ok("Werkstatt: >=3 netz-Proben 'bereit'", bereit >= 3, `gefunden: ${bereit}`);

    // 1b) Live-Match: zwei Profile vergleichen (im Container ohne Modell -> Demo-Pfad)
    const lmDirekt = await page.evaluate(async () => {
      const W = window.SbkimWerkstatt;
      const aehnlich = await W.liveMatch("vegetarische suppe kochen rezept gemüse",
                                         "vegetarische suppe kochen rezept brühe");
      const fremd = await W.liveMatch("vegetarische suppe kochen rezept gemüse",
                                      "fahrrad bremse schaltung reparatur werkstatt");
      return { aehnlich: aehnlich.score, fremd: fremd.score, echt: aehnlich.echt };
    });
    ok("Live-Match: ähnliche Profile passen besser als fremde",
       lmDirekt.aehnlich > lmDirekt.fremd,
       `ähnlich ${lmDirekt.aehnlich?.toFixed(3)} > fremd ${lmDirekt.fremd?.toFixed(3)} (echt=${lmDirekt.echt})`);

    // 1c) Protokoll-Lauf — die ganze Kette im ECHTEN Browser (Identität läuft hier!)
    //     Identische Profile -> Score 1.0 -> sicherer Treffer, damit auch der
    //     Vertrauensschritt (3) echt durchläuft. (Demo-Score knapp an der Schwelle
    //     wäre sonst grenzwertig — der echte Match im Browser ist davon unberührt.)
    const proto = await page.evaluate(async () => {
      const text = "vegetarische suppe kochen rezept gemüse brühe";
      const r = await window.SbkimWerkstatt.protocolRun(text, text);
      const st = (n) => (r.schritte.find((s) => s.label.startsWith(n)) || {}).status;
      return { s1: st("1)"), s2: st("2)"), s3: st("3)"), s4: st("4)"), ok: r.ok };
    });
    ok("Protokoll-Lauf: Identität (Schritt 1) läuft echt im Browser", proto.s1 === "ok",
       `Status: ${proto.s1}`);
    ok("Protokoll-Lauf: Vertrauen (Schritt 3) grün bei Treffer", proto.s3 === "ok",
       `Status: ${proto.s3}`);
    ok("Protokoll-Lauf: Siegel (Schritt 4) lesbar", proto.s4 === "ok", `Status: ${proto.s4}`);

    // 2) 01 Storage: echtes IndexedDB im Browser
    const storageOk = await page.evaluate(async () => {
      const S = window.SbkimStorage;
      if (!S || typeof S.init !== "function") return false;
      await S.init();
      // sbkim_doku_meta ist ein vom Modul erlaubter Store-Name (echte Validierung).
      await S.put("sbkim_doku_meta", "probe", { n: 42 });
      const v = await S.get("sbkim_doku_meta", "probe");
      return v && v.n === 42;
    });
    ok("01 Storage: echtes IndexedDB put/get", storageOk);

    // 3) 02 Spore: echtes Ed25519 erzeugen + signieren + verifizieren
    const sporeOk = await page.evaluate(async () => {
      const Sp = window.SbkimSpore;
      if (!Sp || typeof Sp.init !== "function") return false;
      await Sp.init();
      const id = await Sp.getOrCreateIdentity();
      const nodeId = await Sp.getNodeId();
      return typeof nodeId === "string" && nodeId.length > 0 && !!id;
    });
    ok("02 Spore: echte Ed25519-Identität (WebCrypto)", sporeOk);

    // 4) Lokaler 2-Knoten-Handshake (echte Krypto, ohne Live-Endknoten).
    //    Versuch laut Klaus: echten Handschlag bauen; Live-Knoten sind per Netz-
    //    Policy blockiert (403), daher ZWEI lokale Browser-Kontexte (Knoten A + B),
    //    jeder mit eigener Ed25519-Identität. A signiert eine Hülle, B verifiziert
    //    sie gegen A's öffentlichen Schlüssel. Das beweist die Signatur-Mechanik
    //    von Modul 05 echt — die echte Live-Verbindung bleibt offen (docs/LIVE-MODELL.md).
    async function knotenIdentitaet(ctx) {
      const p = await ctx.newPage();
      await p.goto(`${base}/werkzeuge.html`, { waitUntil: "networkidle" });
      return p;
    }
    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();
    try {
      const pA = await knotenIdentitaet(ctxA);
      const pB = await knotenIdentitaet(ctxB);

      // Knoten A: eigene Identität + signierte ÖFFENTLICHE Spore erzeugen
      // (echter, dokumentierter Vertrauenspfad: generateOwnSpore -> verifyForeignSpore).
      const aSpore = await pA.evaluate(async () => {
        const Sp = window.SbkimSpore, St = window.SbkimStorage;
        await St.init(); await Sp.init();
        await Sp.getOrCreateIdentity();
        const nodeId = await Sp.getNodeId();
        const spore = await Sp.generateOwnSpore({
          domain: "knoten-A-test",
          endpoint: "https://example.test/knoten-a",
          nodeType: "hybrid",
        });
        return { nodeId, spore };
      });

      // Knoten B (eigener Kontext, eigene Identität): A's Spore signatur-prüfen
      const bUrteil = await pB.evaluate(async (paket) => {
        const Sp = window.SbkimSpore, St = window.SbkimStorage;
        await St.init(); await Sp.init();
        await Sp.getOrCreateIdentity(); // B ist ein anderer Knoten
        const r = await Sp.verifyForeignSpore(paket.spore);
        return { valid: !!(r && r.valid), reason: r && r.reason };
      }, aSpore);

      // Gegenprobe: manipulierte Spore MUSS abgelehnt werden (kein Greenwashing).
      const bManipuliert = await pB.evaluate(async (paket) => {
        const Sp = window.SbkimSpore;
        const kopie = JSON.parse(JSON.stringify(paket.spore));
        if (kopie.nodeId) kopie.nodeId = kopie.nodeId.split("").reverse().join("");
        else kopie.domain = "manipuliert";
        const r = await Sp.verifyForeignSpore(kopie);
        return !(r && r.valid); // true = korrekt abgelehnt
      }, aSpore);

      ok("05/02 Cross-Knoten: B akzeptiert A's echte Spore", bUrteil.valid,
         bUrteil.reason ? "reason: " + bUrteil.reason : "lokal 2-Knoten");
      ok("05/02 Cross-Knoten: B lehnt manipulierte Spore ab", bManipuliert);
    } finally {
      await ctxA.close();
      await ctxB.close();
    }

    // Nur ECHTE 404 zählen (keine optionalen Bild-Assets).
    const echte404 = [...fehlende404].filter((u) => !harmlosesAsset.test(u));
    ok("Keine echten JS-Fehler im Browser", errors.length === 0, errors.slice(0, 3).join(" | "));
    ok("Keine fehlenden Pflicht-Dateien (Bild-404 erlaubt)", echte404.length === 0,
       echte404.slice(0, 3).join(" | "));
  } finally {
    await browser.close();
    server.close();
  }

  // Bericht
  let fails = 0;
  for (const r of results) {
    console.log(`${r.ok ? "✓" : "✗"} ${r.name}${r.detail ? "  (" + r.detail + ")" : ""}`);
    if (!r.ok) fails++;
  }
  console.log(`\nBrowser-Verify: ${results.length - fails}/${results.length} grün`);
  process.exit(fails ? 1 : 0);
}

main().catch((e) => { console.error("Browser-Verify-Fehler:", e); process.exit(1); });
