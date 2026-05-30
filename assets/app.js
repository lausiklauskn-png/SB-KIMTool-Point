// app.js — static page logic for the Toolbox and Marketplace pages.
// Pure browser, no dependencies. The Model page (modell.html) plays back the
// recorded run via its own assets/model.js; this file renders the JSON-driven
// toolbox and marketplace.

const $ = (sel) => document.querySelector(sel);

async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

// --- Schicht 2: toolbox with three tiers -----------------------------------
const STUFEN = [
  ["basic", "Basic"],
  ["pro", "Pro"],
  ["profi", "Profi"],
];

// Sage-Reife -> Spine-Farbe (Karte) + Chip + Klartext. Echo der Lampen-Farben.
const REIFE = {
  fertig:                 { cls: "m-fertig",     chip: "c-fertig",     label: "reif ✅" },
  "vorgebaut-schlummert": { cls: "m-schlummert", chip: "c-schlummert", label: "schlummert ⏾" },
  "vorgebaut-kopierbar":  { cls: "m-schlummert", chip: "c-schlummert", label: "kopierbar ⏾" },
  "teil-fertig":          { cls: "m-teil",       chip: "c-teil",       label: "teil-fertig ◐" },
  stub:                   { cls: "m-stub",       chip: "c-stub",       label: "stub ◐" },
  "code-stub":            { cls: "m-stub",       chip: "c-stub",       label: "code-stub ○" },
};

const POINT = {
  "modell-prototyp":            { chip: "c-point",        label: "im Modell" },
  "noch-nicht-kopiert":         { chip: "c-point c-cold", label: "noch nicht kopiert" },
  "kopiert · headless getestet":{ chip: "c-fertig",       label: "geliefert · headless getestet ✓" },
};

// Modules whose REAL, offline, copy-paste-able file already lives in this repo.
// Only these get the "copy code / download file" actions — honest: no fake button
// for modules that are not actually here yet.
const TOOL_FILES = {
  "01": "web/tools/sbkim-storage.js",
  "02": "web/tools/sbkim-spore.js",
  "03": "web/tools/sbkim-embedding.js",
  "04": "web/tools/sbkim-match.js",
  "05": "web/tools/sbkim-anastomose.js",
  "06": "web/tools/sbkim-heterokaryose.js",
  "07": "web/tools/sbkim-apoptose.js",
  "08": "web/tools/sbkim-ui-demo.js",
  "15": "web/tools/sbkim-membran.js",
  "16": "web/tools/sbkim-siegel.js",
};

async function renderWerkzeuge() {
  let data;
  try {
    data = await loadJSON("werkzeugkiste.json");
  } catch (e) {
    $("#tools").textContent = "werkzeugkiste.json nicht gefunden.";
    return;
  }

  const tabs = $("#tabs");
  const grid = $("#tools");

  // Stufen-Legende aus den (bisher ungezeigten) stufen-Texten des JSON.
  const legend = $("#tier-legend");
  if (legend && data.stufen) {
    legend.innerHTML = "";
    for (const [key, label] of STUFEN) {
      const txt = data.stufen[key];
      if (!txt) continue;
      const c = document.createElement("div");
      c.className = "tier-card";
      c.innerHTML = `<b>${label}</b><span>${txt}</span>`;
      legend.appendChild(c);
    }
  }

  function draw(stufe) {
    grid.innerHTML = "";
    for (const m of data.module.filter((x) => x.stufe === stufe)) {
      const r = REIFE[m.sage_status] || { cls: "m-stub", chip: "c-stub", label: m.sage_status };
      const p = POINT[m.point_status] || { chip: "c-point c-cold", label: m.point_status };
      const el = document.createElement("div");
      el.className = `tool ${r.cls}`;
      el.innerHTML = `
        <div class="head"><span class="id-orb">${m.id}</span><span class="name">${m.name}</span></div>
        <div class="status-row">
          <span class="chip ${r.chip}"><span class="dot"></span>Sage: ${r.label}</span>
          <span class="chip ${p.chip}"><span class="dot"></span>Point: ${p.label}</span>
        </div>
        <p class="lead"><b>Nutzen</b>${m.nutzen}</p>
        <details class="more">
          <summary>Mehr — Was · Verwendung · Einbau · Aktiviert durch</summary>
          <dl>
            <dt>Was</dt><dd>${m.was}</dd>
            <dt>Verwendung</dt><dd>${m.verwendung}</dd>
            <dt>Einbau</dt><dd>${m.einbau}</dd>
            <dt>Aktiviert durch</dt><dd>${m.aktiviert_durch}</dd>
          </dl>
        </details>
        <button class="copy">⧉ Kennung kopieren</button>`;
      el.querySelector(".copy").addEventListener("click", () => {
        const txt = `Modul ${m.id} ${m.name} [${m.stufe}] — ${m.was}`;
        navigator.clipboard?.writeText(txt);
        el.querySelector(".copy").textContent = "kopiert ✓";
      });

      // Honest per-module note (e.g. proven path vs. browser requirement).
      if (m.point_hinweis) {
        const note = document.createElement("p");
        note.className = "pointnote";
        note.textContent = m.point_hinweis;
        el.appendChild(note);
      }

      // Real, offline file present? Offer "copy code" + "download file".
      // No external fetch, no hotlink — the file lives in this repo.
      const file = TOOL_FILES[m.id];
      if (file) {
        const actions = document.createElement("div");
        actions.className = "actions";
        actions.innerHTML = `
          <button class="get copy-code">⧉ Code kopieren</button>
          <a class="get download" href="${file}" download>⬇ Datei laden</a>
          <p class="getnote">Echte, offline einbaubare Datei aus diesem Repo (<code>${file}</code>).</p>`;
        actions.querySelector(".copy-code").addEventListener("click", async (ev) => {
          const btn = ev.currentTarget;
          try {
            const code = await (await fetch(file, { cache: "no-store" })).text();
            await navigator.clipboard?.writeText(code);
            btn.textContent = "Code kopiert ✓";
          } catch {
            btn.textContent = "Fehler — Datei laden";
          }
        });
        el.appendChild(actions);
      }

      grid.appendChild(el);
    }
  }

  STUFEN.forEach(([key, label], idx) => {
    const count = data.module.filter((x) => x.stufe === key).length;
    const t = document.createElement("button");
    t.className = "tab" + (idx === 0 ? " active" : "");
    t.innerHTML = `${label}<span class="cnt">${count}</span>`;
    t.addEventListener("click", () => {
      tabs.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      draw(key);
    });
    tabs.appendChild(t);
  });

  draw("basic");
}

// --- Schicht 3: marketplace ------------------------------------------------
async function renderMarkt() {
  let data;
  try {
    data = await loadJSON("web/data/marktplatz.json");
  } catch (e) {
    $("#market").textContent = "marktplatz.json nicht gefunden.";
    return;
  }
  const market = $("#market");
  for (const e of data.eintraege) {
    const isInt = (e.status || "").startsWith("integriert");
    const statusChip = isInt
      ? `<span class="chip c-int"><span class="dot"></span>${e.status}</span>`
      : `<span class="chip c-live"><span class="dot"></span>live · direkt</span>`;
    const echtChip = e.echt
      ? `<span class="chip c-fertig"><span class="dot"></span>✓ echt</span>` : "";
    const monogram = (e.name || "?").trim().charAt(0).toUpperCase();
    const el = document.createElement("div");
    el.className = "pwa";
    el.innerHTML = `
      <div class="p-head"><span class="p-mark">${monogram}</span><span class="name">${e.name}</span></div>
      <div class="p-chips">${statusChip}${echtChip}</div>
      <div class="can">„${e.kannDas}"</div>
      <div class="nodeid">${e.nodeId}</div>
      <a class="dock" href="${e.andockLink}">→ andocken</a>`;
    market.appendChild(el);
  }
  $("#market-note").textContent = data.hinweis;
}

// --- Dispatch: each page only loads what it shows -------------------------
// Render a section only if its anchor element exists on the current page
// (Startseite has none → nothing runs; Modell page uses model.js instead).
if ($("#tabs")) renderWerkzeuge();
if ($("#market")) renderMarkt();
