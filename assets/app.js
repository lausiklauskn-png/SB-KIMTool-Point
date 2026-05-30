// app.js — static page logic. Pure browser, no dependencies.
// It PLAYS BACK a recorded model run (web/data/run.json); it does not run the
// Node model. Toolbox and marketplace are rendered from JSON data files.

const $ = (sel) => document.querySelector(sel);

async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

// --- Schicht 1: play back the recorded run as an animated board ------------
async function renderModell() {
  const ticker = $("#ticker");
  let run;
  try {
    run = await loadJSON("web/data/run.json");
  } catch (e) {
    ticker.textContent =
      "run.json nicht gefunden. Lokal erzeugen mit: npm run demo (schreibt web/data/run.json).";
    return;
  }

  const tasks = {
    bauer: $("#ag-bauer .task"),
    gate: $("#ag-gate .task"),
    beob: $("#ag-beob .task"),
  };
  ticker.innerHTML = "";

  const lines = [];
  const verdictClass = (v) =>
    v === "taugt" ? "ok" : v === "verwerfen" ? "bad" : "flag";

  let i = 0;
  function step() {
    if (i >= run.events.length) {
      const s = run.summary;
      addLine(
        `— fertig: ${s.graduated} graduiert · ${s.sybilFlagged}/${s.sybilNodes} Sybil geflaggt · Blocklist: ${s.blocklist.join(", ") || "—"}`,
      );
      tasks.beob.textContent = `${run.edgeCases.length} Grenzfälle für Klaus`;
      return;
    }
    const e = run.events[i++];
    if (e.phase === "build") {
      tasks.bauer.textContent = `baut ${e.artefactId}`;
      tasks.gate.textContent = `${e.verdict}${e.repaired ? " (repariert)" : ""}`;
      addLine(
        `[bau] ${e.builder} → ${e.artefactId}: <span class="${verdictClass(e.verdict)}">${e.verdict}</span>${e.repaired ? " (repariert)" : ""}`,
      );
    } else if (e.phase === "sybil") {
      tasks.gate.textContent = `prüft Sybil-Artefakt: ${e.verdict}`;
      addLine(
        `[sybil] ${e.node} ${e.artefactId}: <span class="${verdictClass(e.verdict)}">${e.verdict}</span> — ${e.reason}`,
      );
    } else if (e.phase === "verdict") {
      const tail = e.flagged
        ? `<span class="flag">GEFLAGGT → Apoptose</span>`
        : "unter Schwelle";
      addLine(
        `[urteil] ${e.node} · Stimmgewicht ${e.votingWeight} · Misstrauen ${e.distrust} · ${tail}`,
      );
    }
    setTimeout(step, 420);
  }

  function addLine(html) {
    lines.push(html);
    ticker.innerHTML = lines.map((l) => `<div>${l}</div>`).join("");
    ticker.scrollTop = ticker.scrollHeight;
  }

  step();
}

// --- Schicht 2: toolbox with three tiers -----------------------------------
const STUFEN = [
  ["basic", "Basic"],
  ["pro", "Pro"],
  ["profi", "Profi"],
];

// Modules whose REAL, offline, copy-paste-able file already lives in this repo.
// Only these get the "copy code / download file" actions — honest: no fake button
// for modules that are not actually here yet.
const TOOL_FILES = {
  "01": "web/tools/sbkim-storage.js",
};

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

      // Real, offline file present? Offer "copy code" + "download file".
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
// One shared app.js for all pages. We render a section only if its anchor
// element exists on the current page (Startseite has none → nothing runs).
if ($("#ticker")) renderModell();
if ($("#tabs")) renderWerkzeuge();
if ($("#market")) renderMarkt();
