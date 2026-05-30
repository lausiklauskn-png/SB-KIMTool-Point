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

const SAGE_BADGE = {
  fertig: ["fertig", "Sage: fertig ✅"],
  stub: ["stub", "Sage: stub ◐"],
  "teil-fertig": ["teil", "Sage: teil-fertig ◐"],
  "code-stub": ["", "Sage: code-stub ○"],
  "vorgebaut-schlummert": ["schlummert", "Sage: vorgebaut – schlummert ⏾"],
  "vorgebaut-kopierbar": ["schlummert", "Sage: vorgebaut – kopierbar ⏾"],
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

  function draw(stufe) {
    grid.innerHTML = "";
    for (const m of data.module.filter((x) => x.stufe === stufe)) {
      const [cls, label] = SAGE_BADGE[m.sage_status] || ["", `Sage: ${m.sage_status}`];
      const el = document.createElement("div");
      el.className = "tool";
      el.innerHTML = `
        <div class="head"><span class="id">${m.id}</span><span class="name">${m.name}</span></div>
        <div class="badges">
          <span class="badge ${cls}">${label}</span>
          <span class="badge">Point: ${m.point_status}</span>
        </div>
        <dl>
          <dt>Was</dt><dd>${m.was}</dd>
          <dt>Nutzen</dt><dd>${m.nutzen}</dd>
          <dt>Verwendung</dt><dd>${m.verwendung}</dd>
          <dt>Einbau</dt><dd>${m.einbau}</dd>
          <dt>Aktiviert durch</dt><dd>${m.aktiviert_durch}</dd>
        </dl>
        <button class="copy">⧉ Kennung kopieren</button>`;
      el.querySelector(".copy").addEventListener("click", () => {
        const txt = `Modul ${m.id} ${m.name} [${m.stufe}] — ${m.was}`;
        navigator.clipboard?.writeText(txt);
        el.querySelector(".copy").textContent = "kopiert ✓";
      });
      grid.appendChild(el);
    }
  }

  STUFEN.forEach(([key, label], idx) => {
    const t = document.createElement("button");
    t.className = "tab" + (idx === 0 ? " active" : "");
    t.textContent = label;
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
    const el = document.createElement("div");
    el.className = "pwa";
    el.innerHTML = `
      <div class="name">${e.name}</div>
      <div class="nodeid">${e.nodeId}</div>
      <div class="can">„${e.kannDas}"</div>
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
