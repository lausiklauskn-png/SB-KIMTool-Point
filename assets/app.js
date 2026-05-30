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
  "17": "web/tools/sbkim-floating-widget.js",
  "18": "web/tools/sbkim-tool-pwa.js",
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
    const matchChip = (typeof e.matchScore === "number")
      ? `<span class="chip c-fertig" title="${e.matchHinweis || ""}"><span class="dot"></span>✓ voller Match · ${e.matchScore.toFixed(2)}</span>` : "";
    const monogram = (e.name || "?").trim().charAt(0).toUpperCase();
    // "→ andocken" öffnet die echte Live-Seite des Knotens. Externe (http)-Links
    // gehen in einem neuen Tab auf; tote #-Anker bleiben (falls je wieder genutzt) inline.
    const extern = /^https?:\/\//.test(e.andockLink || "");
    const dockAttr = extern ? ` target="_blank" rel="noopener noreferrer"` : "";
    const dockLabel = extern ? "→ andocken ↗" : "→ andocken";
    const el = document.createElement("div");
    el.className = "pwa";
    el.innerHTML = `
      <div class="p-head"><span class="p-mark">${monogram}</span><span class="name">${e.name}</span></div>
      <div class="p-chips">${statusChip}${echtChip}${matchChip}</div>
      <div class="can">„${e.kannDas}"</div>
      <div class="nodeid">${e.nodeId}</div>
      <a class="dock" href="${e.andockLink}"${dockAttr}>${dockLabel}</a>`;
    market.appendChild(el);
  }
  $("#market-note").textContent = data.hinweis;
}

// --- Werkstatt: echte Selbst-Prüfung der offline-Werkzeuge ----------------
// Nutzt window.SbkimWerkstatt (assets/werkstatt.js), das die echten Module
// window.SbkimMatch / window.SbkimSiegel prüft. Was grün wird, rechnet wirklich.
function renderWerkstatt() {
  const btn = $("#werkstatt-run");
  const out = $("#werkstatt-out");
  if (!btn || !out) return;
  if (typeof window.SbkimWerkstatt === "undefined") {
    btn.disabled = true;
    out.textContent = "Werkstatt-Brücke nicht geladen.";
    return;
  }
  const renderProbe = (p, badge) => {
    const schritte = p.schritte.map((s) =>
      `<li class="${s.ok ? "ok" : "bad"}">${s.ok ? "✓" : "✗"} ${s.label}</li>`
    ).join("");
    const cls = p.ok ? (badge === "netz" ? "ready" : "ok") : "bad";
    const kopf = p.ok
      ? (badge === "netz" ? "◐ bereit · braucht Netz" : "✓ grün")
      : "✗ rot";
    return `
      <div class="probe ${cls}">
        <div class="probe-head">${kopf} · ${p.name}</div>
        <ul class="probe-steps">${schritte}</ul>
        <div class="probe-fazit">${p.fazit}</div>
      </div>`;
  };
  btn.addEventListener("click", () => {
    const r = window.SbkimWerkstatt.probeAll();
    const offline = r.offline.map((p) => renderProbe(p, "offline")).join("");
    const netz = r.netz.map((p) => renderProbe(p, "netz")).join("");
    out.innerHTML =
      `<div class="probe-group"><div class="probe-group-titel">Offline — wirklich gerechnet</div>${offline}</div>` +
      `<div class="probe-group"><div class="probe-group-titel">Netzgebunden — Bereitschaft geprüft</div>${netz}</div>`;
  });

  // Live-Match: zwei Profile vergleichen (echtes Embedding im Browser, sonst Demo)
  const lmBtn = $("#lm-run");
  const lmOut = $("#lm-out");
  if (lmBtn && lmOut && typeof window.SbkimWerkstatt.liveMatch === "function") {
    lmBtn.addEventListener("click", async () => {
      const a = ($("#lm-a") || {}).value || "";
      const b = ($("#lm-b") || {}).value || "";
      lmOut.textContent = "… vergleiche (lädt ggf. das Sprachmodell) …";
      try {
        const r = await window.SbkimWerkstatt.liveMatch(a, b);
        if (!r.ok) { lmOut.innerHTML = `<div class="probe bad"><div class="probe-head">✗ ${r.fazit}</div></div>`; return; }
        const cls = r.treffer ? "ok" : "ready";
        const proz = Math.round(r.score * 100);
        lmOut.innerHTML = `
          <div class="probe ${cls}">
            <div class="probe-head">${r.treffer ? "✓ Treffer" : "◐ kein Treffer"} · Passung ${proz}%</div>
            <ul class="probe-steps">
              <li>Profil A: „${a}"</li>
              <li>Profil B: „${b}"</li>
              <li>Score ${r.score.toFixed(3)} · Schwelle ${r.schwelle}</li>
            </ul>
            <div class="probe-fazit">Quelle: ${r.quelle}</div>
          </div>`;
      } catch (e) {
        lmOut.innerHTML = `<div class="probe bad"><div class="probe-head">✗ Fehler: ${String(e).slice(0, 120)}</div></div>`;
      }
    });
  }

  // Protokoll-Lauf: die ganze Kette (Identität → Match → Vertrauen → Siegel)
  const prBtn = $("#pr-run");
  const prOut = $("#pr-out");
  if (prBtn && prOut && typeof window.SbkimWerkstatt.protocolRun === "function") {
    const stStil = { ok: "ok", ready: "ready", browser: "ready", skip: "ready", bad: "bad" };
    const stIcon = { ok: "✓", ready: "◐", browser: "◐", skip: "·", bad: "✗" };
    prBtn.addEventListener("click", async () => {
      const a = ($("#lm-a") || {}).value || "";
      const b = ($("#lm-b") || {}).value || "";
      prOut.textContent = "… Protokoll-Lauf (lädt ggf. das Sprachmodell) …";
      try {
        const r = await window.SbkimWerkstatt.protocolRun(a, b);
        const zeilen = r.schritte.map((s) =>
          `<li class="${s.status === "ok" ? "ok" : s.status === "bad" ? "bad" : ""}">` +
          `${stIcon[s.status] || "·"} ${s.label}${s.info ? " — " + s.info : ""}</li>`
        ).join("");
        prOut.innerHTML = `
          <div class="probe ${r.ok ? "ok" : "bad"}">
            <div class="probe-head">${r.zusammenfassung}</div>
            <ul class="probe-steps">${zeilen}</ul>
          </div>`;
      } catch (e) {
        prOut.innerHTML = `<div class="probe bad"><div class="probe-head">✗ Fehler: ${String(e).slice(0, 120)}</div></div>`;
      }
    });
  }
}

// --- Dispatch: each page only loads what it shows -------------------------
// Render a section only if its anchor element exists on the current page
// (Startseite has none → nothing runs; Modell page uses model.js instead).

// --- Puls: Real-Anteil-Ring + Agenten in Aktion (Startseite) --------------
// Selbst-aktualisierend aus status.json: der grüne Bogen = echte/alle Komponenten.
// Jede Komponente mit echt===true zählt als "lebt", sonst als Demo/schlummert.
async function renderPuls() {
  const ring = $("#ring-real");
  const num = $("#ring-num");
  const liste = $("#agenten-liste");
  const fuss = $("#agenten-fuss");
  if (!ring || !num || !liste) return;

  let s;
  try { s = await loadJSON("status.json"); }
  catch (e) { num.textContent = "?"; if (fuss) fuss.textContent = "status.json nicht lesbar."; return; }

  const komp = Array.isArray(s.komponenten) ? s.komponenten : [];
  const echt = komp.filter((k) => k.echt === true);
  const total = komp.length || 1;
  const pct = Math.round((100 * echt.length) / total);

  // Ring: grüner Bogen auf pct% des Umfangs (r=86)
  const C = 2 * Math.PI * 86;
  const realLen = (C * pct) / 100;
  requestAnimationFrame(() => {
    ring.style.strokeDasharray = `${realLen} ${C - realLen}`;
  });
  // Zahl hochzählen
  let start = null;
  const dur = 1200;
  requestAnimationFrame(function step(t) {
    if (start === null) start = t;
    const p = Math.min(1, (t - start) / dur);
    const ease = 1 - Math.pow(1 - p, 3);
    num.textContent = Math.round(pct * ease) + "%";
    if (p < 1) requestAnimationFrame(step);
  });

  // Agenten-Liste: jede Komponente ein "Mitarbeiter" mit Lebt/Demo-Lampe.
  // Kurzname aus dem (oft langen) Komponenten-Namen ziehen.
  const kurz = (name) => {
    const vorDoppel = String(name).split(":")[0];
    return vorDoppel.length > 52 ? vorDoppel.slice(0, 50) + "…" : vorDoppel;
  };
  liste.innerHTML = komp.map((k) => {
    const lebt = k.echt === true;
    return `<li class="agent ${lebt ? "alive" : "demo"}">
      <span class="agent-lamp" aria-hidden="true"></span>
      <span class="agent-name">${kurz(k.name)}</span>
      <span class="agent-state">${lebt ? "lebt" : "Demo"}</span>
    </li>`;
  }).join("");
  if (fuss) {
    fuss.textContent = `${echt.length} von ${total} Komponenten real belegt · `
      + `Rest schlummert/zeigt (ehrlich, kein Theater).`;
  }

  // Knoten in der Mitte: Erklär-Box auf/zu
  const knoten = $("#ring-knoten");
  const erkl = $("#puls-erkl");
  if (knoten && erkl) {
    knoten.addEventListener("click", () => {
      const offen = !erkl.hasAttribute("hidden");
      if (offen) erkl.setAttribute("hidden", "");
      else erkl.removeAttribute("hidden");
      knoten.classList.toggle("active", !offen);
    });
  }
}

if ($("#tabs")) renderWerkzeuge();
if ($("#market")) renderMarkt();
if ($("#werkstatt-run")) renderWerkstatt();
if ($("#puls")) renderPuls();
