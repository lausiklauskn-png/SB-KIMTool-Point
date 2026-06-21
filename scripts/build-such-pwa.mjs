// scripts/build-such-pwa.mjs — bündelt das Such-Werkzeug (Modul 22) zu EINER
// eigenständigen Single-File-PWA: such-werkzeug.html (Repo-Wurzel).
//
// Warum ein Build (und warum das NICHT der „Einbau" ist):
// Die kanonischen Quellen bleiben web/tools/{sbkim-embedding,sbkim-match,
// sbkim-such-widget}.js + assets/such-widget-init.js. Dieses Skript hängt sie
// nur 1:1 zwischen eine kleine PWA-Hülle (Live-PWA-Regel: verteilbare Werkzeuge
// = eine einzige index.html, Assets inline, keine externen Abhängigkeiten). So
// kann die Download-Datei nie still von den Modulen abdriften — neu bauen mit
// `npm run build:such-pwa`. Das BENUTZEN des Tools braucht keinen Build.
//
// Einzige inhärente Netz-Abhängigkeit: das e5-Embedding-Modell (transformers.js
// via CDN) beim ersten semantischen Lauf. Ohne KI-Schlüssel bleibt die
// App-/Vorfilter-Suche rein lokal.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const TOOL_VERSION = "0.1.0";
const YEAR = "2026";

const read = (p) => readFileSync(resolve(root, p), "utf8");

const parts = {
  mod03: read("web/tools/sbkim-embedding.js"),
  mod04: read("web/tools/sbkim-match.js"),
  mod22: read("web/tools/sbkim-such-widget.js"),
  init: read("assets/such-widget-init.js"),
};

// Inline-Bündelung ist nur sicher, solange keine Quelle "</script>" enthält.
for (const [name, src] of Object.entries(parts)) {
  if (src.includes("</script")) {
    throw new Error(`${name} enthält </script — Inline-Bündelung unsicher, abbrechen.`);
  }
}

const iconSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' +
  '<rect width="512" height="512" rx="96" fill="#10151c"/>' +
  '<circle cx="226" cy="226" r="120" fill="none" stroke="#6fd3c7" stroke-width="34"/>' +
  '<line x1="312" y1="312" x2="430" y2="430" stroke="#6fd3c7" stroke-width="46" stroke-linecap="round"/>' +
  "</svg>";
const iconDataUri = "data:image/svg+xml;utf8," + encodeURIComponent(iconSvg);

const manifest = {
  name: "SB·KIMTool·Point — Such-Werkzeug",
  short_name: "Such-Werkzeug",
  description: "Semantische, server-lose Bedeutungs-Suche im Browser (SBKIM Modul 22).",
  lang: "de",
  start_url: ".",
  scope: ".",
  display: "standalone",
  background_color: "#0b0f14",
  theme_color: "#10151c",
  icons: [{ src: iconDataUri, sizes: "any", type: "image/svg+xml", purpose: "any maskable" }],
};
const manifestDataUri =
  "data:application/manifest+json," + encodeURIComponent(JSON.stringify(manifest));

const html = `<!DOCTYPE html>
<!--
  SB·KIMTool·Point — Such-Werkzeug (SBKIM Modul 22) · v${TOOL_VERSION} · ${YEAR}
  Quelle: Sage-Protokol Module 03 Embedding / 04 Match / 22 Such-Widget
          (kopiert, nicht geklont — Datei für Datei übernommen).
  Eigenständige Single-File-PWA: alle Skripte inline, Icon/Manifest als data-URI.
  Einzige Netz-Abhängigkeit: das e5-Embedding-Modell (transformers.js-CDN) beim
  ersten semantischen Lauf. Ohne Schlüssel bleibt die App-/Vorfilter-Suche lokal.
  GENERIERT von scripts/build-such-pwa.mjs — nicht von Hand bearbeiten,
  neu bauen: npm run build:such-pwa
-->
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Such-Werkzeug · SB·KIMTool·Point</title>
  <meta name="description" content="Semantische, server-lose Bedeutungs-Suche im Browser (SBKIM Modul 22)." />
  <meta name="theme-color" content="#10151c" />
  <meta name="color-scheme" content="dark" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Such-Werkzeug" />
  <link rel="manifest" href="${manifestDataUri}" />
  <link rel="icon" type="image/svg+xml" href="${iconDataUri}" />
  <link rel="apple-touch-icon" href="${iconDataUri}" />
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; font: 16px/1.6 system-ui, sans-serif;
      color: #d7e0e6; background: #0b0f14;
      background-image: radial-gradient(1200px 600px at 70% -10%, #131c26 0%, #0b0f14 60%);
      -webkit-font-smoothing: antialiased;
    }
    main { max-width: 720px; margin: 0 auto; padding: 48px 20px 120px; }
    .badge {
      display: inline-block; font: 600 12px/1 ui-monospace, monospace;
      letter-spacing: .08em; text-transform: uppercase;
      color: #6fd3c7; border: 1px solid #21424044; border-radius: 999px;
      padding: 7px 12px; background: #0e1a1844;
    }
    h1 { font-size: 1.8rem; margin: 18px 0 6px; letter-spacing: -.01em; }
    .lead { color: #9fb0ba; margin: 0 0 28px; }
    .card { border: 1px solid #1d2730; border-radius: 14px; background: #0e141b88; padding: 18px 20px; margin: 14px 0; }
    .card h2 { font-size: 1rem; margin: 0 0 8px; color: #cfe9e4; }
    .card p { margin: 0; color: #9fb0ba; font-size: .95rem; }
    ul { margin: 8px 0 0; padding-left: 1.1em; color: #9fb0ba; font-size: .95rem; }
    code { font: .85em ui-monospace, monospace; color: #8fd0c6; }
    .hint { margin-top: 26px; color: #74858f; font-size: .85rem; }
    .hint b { color: #9fb0ba; }
  </style>
</head>
<body>
  <main>
    <span class="badge">SB·KIMTool·Point · Werkzeug</span>
    <h1>Such-Werkzeug 🔍</h1>
    <p class="lead">
      Eine semantische Bedeutungs-Suche, die die <b>Absicht</b> hinter den Worten
      versteht — nicht die Stichwörter zählt. Server-los, im Browser. Die schwebende
      🔍-Blase unten rechts öffnet das Such-Panel; an der unteren rechten Ecke lässt
      es sich <b>größer ziehen</b> (Größe wird gemerkt).
    </p>

    <div class="card">
      <h2>Drei Bereiche</h2>
      <p>
        <b>App</b> — durchsucht den lokalen Demo-Korpus dieser Seite nach Bedeutung ·
        <b>Knoten</b> — verbundene Mycel-Knoten (rein lokal) ·
        <b>Internet</b> — KI-Such-Brücke (braucht einen eigenen Schlüssel im Tresor).
      </p>
    </div>

    <div class="card">
      <h2>So funktioniert die App-Suche</h2>
      <ul>
        <li>🔍-Blase antippen → Panel öffnet sich.</li>
        <li>Eine Frage in eigenen Worten eingeben (z. B. „Mittel gegen Zecken").</li>
        <li>Beim ersten Lauf lädt das Bedeutungs-Modell einmalig (~30&nbsp;MB, danach lokal).</li>
        <li>Treffer erscheinen nach <b>Bedeutungs-Nähe</b> sortiert, mit Prozenten.</li>
      </ul>
    </div>

    <div class="card">
      <h2>Ehrlich offen</h2>
      <p>
        Die <b>semantische</b> Hälfte (Bedeutung verstehen + sortieren) ist bewiesen
        (<code>npm test</code> · 148/148). Die volle bidirektionale Cross-Knoten-Suche
        server-los ist noch <b>nicht</b> end-to-end gezeigt — Details im
        <code>docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md</code>.
      </p>
    </div>

    <p class="hint">
      <b>Standalone:</b> diese Datei läuft allein, ohne Mycel-Anschluss. Ohne
      KI-Schlüssel bleibt die App-/Vorfilter-Suche rein lokal. Quelle: SBKIM
      Modul 03/04/22 (kopiert, nicht geklont).
    </p>
  </main>

  <script>${parts.mod03}</script>
  <script>${parts.mod04}</script>
  <script>${parts.mod22}</script>
  <script>${parts.init}</script>
</body>
</html>
`;

const outPath = resolve(root, "such-werkzeug.html");
writeFileSync(outPath, html, "utf8");
const kb = (html.length / 1024).toFixed(1);
console.log(`such-werkzeug.html geschrieben (${kb} KB, Module 03+04+22 + init inline, v${TOOL_VERSION}).`);
