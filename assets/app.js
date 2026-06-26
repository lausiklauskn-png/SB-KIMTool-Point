// app.js — static page logic. Pure browser, no dependencies.
// One shared app.js for all pages. Each section renders only if its anchor
// element exists on the current page. The Modell page PLAYS BACK a recorded
// run (web/data/run.json); it does not run the Node model. Toolbox, offerings
// and marketplace are rendered from JSON data files.

const $ = (sel) => document.querySelector(sel);

async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]),
  );
}

// --- Netzwerk: embed the copyable Andock-Wizard (module 19) -----------------
function renderNetzwerk() {
  if (!window.SbkimAndockWizard) {
    $("#andock-wizard").textContent =
      "Andock-Wizard nicht geladen (assets/modules/19_andock_wizard.js).";
    return;
  }
  // Pure input→text helper. Registration target stays the Sage hub status.json
  // (default inside the module). No crypto, no network here.
  window.SbkimAndockWizard.mount({ container: "#andock-wizard" });
}

// --- Modell: play back the recorded run as an animated board ----------------
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

// --- Werkzeuge: featured offerings ------------------------------------------
async function renderAngebote() {
  let data;
  try {
    data = await loadJSON("web/data/angebote.json");
  } catch (e) {
    $("#angebote").textContent = "angebote.json nicht gefunden.";
    return;
  }
  const wrap = $("#angebote");
  wrap.innerHTML = "";
  // Featured first.
  const list = [...data.angebote].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  for (const a of list) {
    const tags = (a.tags || []).map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join("");
    const actions = [];
    if (a.open) {
      actions.push(`<a class="btn-primary" href="${escapeHtml(a.open)}">→ öffnen</a>`);
    }
    if (a.quelle) {
      actions.push(`<a class="btn-ghost" href="${escapeHtml(a.quelle)}" target="_blank" rel="noopener noreferrer">Quelle ansehen</a>`);
    }
    const hostBadge = a.hosted
      ? `<span class="badge fertig">hier gehostet</span>`
      : `<span class="badge">Vorlage · Hosting folgt</span>`;
    const el = document.createElement("div");
    el.className = "angebot" + (a.featured ? " featured" : "");
    el.innerHTML = `
      <div class="angebot-head">
        <span class="kind">${escapeHtml(a.kind)}</span>
        ${hostBadge}
      </div>
      <h4>${escapeHtml(a.name)}</h4>
      <p class="tagline">${escapeHtml(a.tagline)}</p>
      <p class="was">${escapeHtml(a.was)}</p>
      <p class="einbau"><strong>Nutzung:</strong> ${escapeHtml(a.einbau)}</p>
      <div class="chips">${tags}</div>
      <div class="actions">${actions.join("")}</div>`;
    wrap.appendChild(el);
  }
}

// --- Werkzeuge: building-block modules with three tiers ---------------------
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
        <div class="head"><span class="id">${escapeHtml(m.id)}</span><span class="name">${escapeHtml(m.name)}</span></div>
        <div class="badges">
          <span class="badge ${cls}">${label}</span>
          <span class="badge">Point: ${escapeHtml(m.point_status)}</span>
        </div>
        <dl>
          <dt>Was</dt><dd>${escapeHtml(m.was)}</dd>
          <dt>Nutzen</dt><dd>${escapeHtml(m.nutzen)}</dd>
          <dt>Verwendung</dt><dd>${escapeHtml(m.verwendung)}</dd>
          <dt>Einbau</dt><dd>${escapeHtml(m.einbau)}</dd>
          <dt>Aktiviert durch</dt><dd>${escapeHtml(m.aktiviert_durch)}</dd>
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

// --- Marktplatz: listings + simple discovery search ------------------------
// Each listing doubles as a search-corpus entry (label/anchorId/text), the same
// shape Sage uses (sage-suchkorpus.js). The semantic Such-Werkzeug consumes the
// same corpus; here on the page we offer a light keyword filter for discovery.
async function renderMarkt() {
  let data;
  try {
    data = await loadJSON("web/data/markt-listings.json");
  } catch (e) {
    $("#market").textContent = "markt-listings.json nicht gefunden.";
    return;
  }
  const market = $("#market");
  const haftung = $("#haftung-text");
  if (haftung) haftung.textContent = data.haftung || "";

  const STATUS_LABEL = {
    live: ["fertig", "live"],
    "kommt-bald": ["schlummert", "kommt bald"],
  };

  function card(e) {
    const [cls, lbl] = STATUS_LABEL[e.status] || ["", e.status];
    const tags = (e.tags || []).map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join("");
    const open = e.status === "kommt-bald"
      ? `<span class="btn-disabled">in Vorbereitung</span>`
      : `<a class="btn-primary" href="${escapeHtml(e.landingUrl)}"${/^https?:/.test(e.landingUrl) ? ' target="_blank" rel="noopener noreferrer"' : ""}>→ Seite öffnen</a>`;
    return `
      <div class="pwa">
        <div class="pwa-top">
          <span class="badge ${cls}">${lbl}</span>
          <span class="preis">${escapeHtml(e.preis)}</span>
        </div>
        <div class="name">${escapeHtml(e.label)}</div>
        <div class="kat">${escapeHtml(e.kategorie)} · ${escapeHtml(e.anbieter)}</div>
        <div class="can">${escapeHtml(e.einZeiler)}</div>
        <div class="chips">${tags}</div>
        <div class="actions">${open}</div>
      </div>`;
  }

  function draw(query) {
    const q = (query || "").trim().toLowerCase();
    const hits = !q
      ? data.listings
      : data.listings.filter((e) => {
          const hay = [e.label, e.einZeiler, e.text, (e.tags || []).join(" "), e.kategorie]
            .join(" ")
            .toLowerCase();
          // every whitespace-separated term must appear (simple AND match)
          return q.split(/\s+/).every((term) => hay.includes(term));
        });
    market.innerHTML = hits.map(card).join("") ||
      `<p class="note">Nichts gefunden. Tipp: weniger oder andere Wörter — oder die volle Suche im <a href="such-tool/">Such-Werkzeug</a>.</p>`;
    const note = $("#market-note");
    if (note) {
      note.textContent = q
        ? `${hits.length} von ${data.listings.length} Angeboten passen zu „${query.trim()}".`
        : `${data.listings.length} Angebote. ${data.preisHinweis || ""}`;
    }
  }

  draw("");
  const input = $("#markt-q");
  if (input) input.addEventListener("input", () => draw(input.value));
}

// --- Dispatch: each page only loads what it shows -------------------------
if ($("#andock-wizard")) renderNetzwerk();
if ($("#ticker")) renderModell();
if ($("#angebote")) renderAngebote();
if ($("#tabs")) renderWerkzeuge();
if ($("#market")) renderMarkt();
