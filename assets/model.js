// model.js — the animated playback of the recorded model run (Schicht 1).
//
// Pure browser, zero dependencies, offline-tauglich. It PLAYS BACK the recorded
// headless Node run (web/data/run.json); it does NOT run the model live. The
// proof of the logic is `npm test`.
//
// Chain it visualizes:  Ingenieur (Idee) -> Bauer (baut) -> Gate/Arzt
// (prüft/repariert) -> Beobachter (protokolliert), with the Negativbauer (Sybil)
// as the adversary that gets flagged and undergoes apoptosis (grün→orange→rot).

const $ = (s) => document.querySelector(s);

// --- static metadata -------------------------------------------------------
const KIND_LABEL = {
  "standalone-pwa": "Standalone-PWA",
  "hintergrund-tool": "Hintergrund-Tool",
  tool: "Tool",
  webseite: "Webseite",
};
const kindLabel = (k) => KIND_LABEL[k] || k;

// node centres in SVG user units (must match the viewBox + node left/top %)
const COORD = {
  ingenieur: [130, 200],
  bauer: [390, 200],
  gate_arzt: [650, 200],
  beobachter: [910, 200],
  negativbauer: [520, 440],
};

const RAIL = ["entwurf", "gebaut", "geprueft", "graduiert"];

// --- playback state --------------------------------------------------------
let runToken = 0; // bumped on restart to cancel any in-flight loop
let paused = false;
let speed = 1;
let motionOn = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const el = {};
let run = null;
let artById = new Map();

// --- tiny async helpers (pause/speed/cancel aware) -------------------------
function cancelled(token) {
  return token !== runToken;
}

function sleep(ms, token) {
  return new Promise((resolve) => {
    let remaining = ms / speed;
    let last = performance.now();
    function tick(now) {
      if (cancelled(token)) return resolve();
      if (paused) {
        last = now;
        return requestAnimationFrame(tick);
      }
      remaining -= now - last;
      last = now;
      if (remaining <= 0) return resolve();
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// move the light packet along an SVG path
function travel(pathId, ms, token) {
  const path = document.getElementById(pathId);
  path.classList.add("flow");
  if (!motionOn) {
    return sleep(ms * 0.35, token).then(() => path.classList.remove("flow"));
  }
  const len = path.getTotalLength();
  const packet = el.packet;
  packet.style.opacity = "1";
  let elapsed = 0;
  let last = performance.now();
  return new Promise((resolve) => {
    function frame(now) {
      if (cancelled(token)) {
        packet.style.opacity = "0";
        path.classList.remove("flow");
        return resolve();
      }
      if (paused) {
        last = now;
        return requestAnimationFrame(frame);
      }
      elapsed += (now - last) * speed;
      last = now;
      const p = Math.min(1, elapsed / ms);
      const pt = path.getPointAtLength(len * p);
      packet.setAttribute("cx", pt.x);
      packet.setAttribute("cy", pt.y);
      if (p >= 1) {
        packet.style.opacity = "0";
        path.classList.remove("flow");
        return resolve();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

// --- node + UI helpers -----------------------------------------------------
const node = (role) => document.getElementById("n-" + role);

function clearActive() {
  document.querySelectorAll(".node").forEach((n) => n.classList.remove("active"));
}
function activate(role) {
  clearActive();
  node(role).classList.add("active");
}
function setSub(role, text) {
  node(role).querySelector(".st").textContent = text;
}
function flag(role, cls, on = true) {
  node(role).classList.toggle(cls, on);
}
function attack(role, color) {
  const n = node(role);
  n.classList.remove("att-green", "att-orange", "att-red");
  if (color) n.classList.add("att-" + color);
}

function status(phaseClass, icon, html) {
  el.statusline.className = "statusline " + phaseClass;
  el.slIcon.textContent = icon;
  el.slText.innerHTML = html;
}

function log(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  el.ticker.appendChild(div);
  el.ticker.scrollTop = el.ticker.scrollHeight;
}

function setRail(step, reject = false) {
  const idx = RAIL.indexOf(step);
  el.rail.querySelectorAll(".rail-step").forEach((s, i) => {
    s.classList.toggle("done", i < idx);
    s.classList.toggle("now", i === idx && !reject);
    s.classList.remove("reject");
  });
  const last = el.rail.querySelector('[data-step="graduiert"]');
  if (reject) {
    last.textContent = "Verworfen";
    last.classList.add("reject");
  } else {
    last.textContent = "Graduiert";
  }
}

function showDetail(id, step, reject = false) {
  const a = artById.get(id);
  if (!a) return;
  el.detail.hidden = false;
  el.detail.classList.toggle("is-fake", a.proposedBy === "negativbauer");
  el.dKind.textContent = kindLabel(a.kind);
  el.dKind.className = "d-kind kind-" + a.kind;
  el.dTitle.textContent = a.title;
  el.dDesc.textContent = a.description;
  setRail(step, reject);
  el.dNote.textContent = a.repaired
    ? "Hinweis: enthielt einen trivialen Fehler, vom Gate/Arzt repariert."
    : "";
  const canExport = a.downloadable && a.status === "graduiert";
  el.export.hidden = !canExport;
  el.export.onclick = canExport ? () => exportArtefact(a) : null;
}

// "WIRD GETESTET" stamp near the gate + a seal spark at the builder
function stampSeal() {
  el.stamp.classList.remove("show");
  void el.stamp.offsetWidth; // restart animation
  el.stamp.classList.add("show");
  flag("bauer", "sealed", true);
  setTimeout(() => flag("bauer", "sealed", false), 900);
}

// apoptosis: an expanding burst ring + the node collapses
function apoptose(role, token) {
  const [cx, cy] = COORD[role];
  if (motionOn) {
    const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ring.setAttribute("cx", cx);
    ring.setAttribute("cy", cy);
    ring.setAttribute("r", "10");
    ring.setAttribute("class", "burst");
    el.fx.appendChild(ring);
    const start = performance.now();
    (function grow(now) {
      if (cancelled(token)) return ring.remove();
      const p = Math.min(1, (now - start) / 700);
      ring.setAttribute("r", 10 + p * 80);
      ring.setAttribute("opacity", 1 - p);
      if (p < 1) requestAnimationFrame(grow);
      else ring.remove();
    })(start);
  }
  node(role).classList.add("dead");
  return sleep(700, token);
}

function revive(role) {
  attack(role, null);
  node(role).classList.remove("dead");
  setSub(role, "Angreifer · 0 Gewicht");
}

// --- export of a model draft ----------------------------------------------
function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function exportArtefact(a) {
  const md =
    `# Modell-Entwurf: ${a.title}\n\n` +
    `- **Art:** ${kindLabel(a.kind)} (\`${a.kind}\`)\n` +
    `- **Vorgeschlagen von:** ${a.proposedBy}\n` +
    `- **Gebaut von:** ${a.builtBy}\n` +
    `- **Status im Modell:** ${a.status}${a.repaired ? " (repariert)" : ""}\n\n` +
    `## Worum handelt es sich?\n${a.description}\n\n` +
    `---\n` +
    `Modell-Entwurf aus **SB·KIMTool·Point** — Ausschnitt eines aufgezeichneten,\n` +
    `headless Modell-Laufs. **Dies ist KEINE fertige PWA.** Die echte Umsetzung\n` +
    `erfolgt separat in einem eigenen Repo. Beweis der Modell-Logik: \`npm test\`.\n`;
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a2 = document.createElement("a");
  a2.href = url;
  a2.download = `${a.id}-${slug(a.title)}.md`;
  document.body.appendChild(a2);
  a2.click();
  a2.remove();
  URL.revokeObjectURL(url);
}

// --- the playback loop -----------------------------------------------------
function resetStage() {
  clearActive();
  ["ingenieur", "bauer", "gate_arzt", "beobachter", "negativbauer"].forEach((r) => {
    attack(r, null);
    node(r).classList.remove("dead", "repair", "reject", "sealed");
  });
  revive("negativbauer");
  el.fx.innerHTML = "";
  el.ticker.innerHTML = "";
  el.detail.hidden = true;
  el.tally.hidden = true;
  el.stamp.classList.remove("show");
  el.packet.style.opacity = "0";
}

async function playEvent(e, token, lastAttackerRef) {
  if (e.phase === "idee") {
    activate("ingenieur");
    setSub("ingenieur", "schlägt vor …");
    status(
      "phase-idee",
      "💡",
      `Ingenieur schlägt ${kindLabel(e.kind)} <b>‚${e.title}'</b> vor.`,
    );
    showDetail(e.artefactId, "entwurf");
    log(`💡 <b>Idee</b> · ${kindLabel(e.kind)} ‚${e.title}'`);
    await travel("e-ing-bau", 1000, token);
    if (cancelled(token)) return;
  } else if (e.phase === "build") {
    // builder builds
    activate("bauer");
    setSub("bauer", `baut ‚${e.title}'`);
    status("phase-build", "🔨", `Bauer baut ${kindLabel(e.kind)} <b>‚${e.title}'</b> …`);
    showDetail(e.artefactId, "gebaut");
    await travel("e-bau-gate", 900, token);
    if (cancelled(token)) return;
    // gate tests / repairs
    activate("gate_arzt");
    showDetail(e.artefactId, "geprueft");
    if (e.repaired) {
      flag("gate_arzt", "repair", true);
      setSub("gate_arzt", "repariert (Naht)");
      status(
        "phase-test",
        "🩹",
        `Gate/Arzt näht einen trivialen Fehler an <b>‚${e.title}'</b> — kein Betrug.`,
      );
      await sleep(650, token);
      flag("gate_arzt", "repair", false);
      if (cancelled(token)) return;
    } else {
      setSub("gate_arzt", "prüft …");
      await sleep(450, token);
      if (cancelled(token)) return;
    }
    if (e.verdict === "taugt") {
      stampSeal();
      status(
        "phase-test",
        "✅",
        `<b>‚${e.title}'</b> besteht → <span class="seal">WIRD GETESTET</span>${e.repaired ? " · repariert" : ""}.`,
      );
      showDetail(e.artefactId, "graduiert");
      log(`✅ <b>${e.builder}</b> → ‚${e.title}': taugt${e.repaired ? " (repariert)" : ""} · Siegel`);
    }
    await sleep(350, token);
    if (cancelled(token)) return;
    // observer records
    await travel("e-gate-beo", 800, token);
    if (cancelled(token)) return;
    activate("beobachter");
    setSub("beobachter", `protokolliert ‚${e.title}'`);
    await sleep(250, token);
  } else if (e.phase === "sybil") {
    if (lastAttackerRef.id !== e.node) {
      // a fresh attacker steps up
      revive("negativbauer");
      lastAttackerRef.id = e.node;
      setSub("negativbauer", `${e.node} · Versuch`);
      attack("negativbauer", "green");
    }
    activate("negativbauer");
    status(
      "phase-attack",
      "☠",
      `Negativbauer <b>${e.node}</b> schleust gefälschte <b>‚${e.title}'</b> ein → wird geprüft …`,
    );
    showDetail(e.artefactId, "geprueft", true);
    log(`☠ <b>${e.node}</b> · gefälschte ‚${e.title}': <span class="bad">${e.verdict}</span> — ${e.reason}`);
    await travel("e-neg-gate", 750, token);
    if (cancelled(token)) return;
    activate("gate_arzt");
    flag("gate_arzt", "reject", true);
    setSub("gate_arzt", "verwirft Fälschung");
    attack("negativbauer", "orange");
    setSub("negativbauer", `${e.node} · unter Verdacht`);
    status("phase-attack", "🚫", `Gate/Arzt: <b>verworfen</b> — ${e.reason}.`);
    await sleep(450, token);
    flag("gate_arzt", "reject", false);
  } else if (e.phase === "verdict") {
    activate("negativbauer");
    attack("negativbauer", "orange");
    setSub("negativbauer", `${e.node} · Misstrauen ${e.distrust}`);
    status(
      "phase-flag",
      "⚠",
      `Negativbauer <b>${e.node}</b>: Stimmgewicht ${e.votingWeight}, Misstrauen ${e.distrust} …`,
    );
    await sleep(750, token);
    if (cancelled(token)) return;
    if (e.flagged) {
      attack("negativbauer", "red");
      status(
        "phase-flag",
        "⛔",
        `<b>${e.node}</b> GEFLAGGT — Quorum erreicht → Blocklist (12) → Apoptose (07).`,
      );
      log(`⛔ <b>${e.node}</b> geflaggt → Apoptose mit signiertem Vermächtnis`);
      await sleep(650, token);
      if (cancelled(token)) return;
      await apoptose("negativbauer", token);
      if (cancelled(token)) return;
      status(
        "phase-flag",
        "☠",
        `<b>${e.node}</b> ausgeschaltet — Apoptose, signiertes Vermächtnis (Modul 07/14).`,
      );
      await sleep(500, token);
    } else {
      status("phase-attack", "•", `<b>${e.node}</b>: unter Schwelle — noch nicht geflaggt.`);
      await sleep(500, token);
    }
  }
}

async function play() {
  const token = runToken;
  resetStage();
  status("phase-idle", "▶", "Lauf startet …");
  await sleep(500, token);
  const lastAttackerRef = { id: null };
  for (const e of run.events) {
    if (cancelled(token)) return;
    await playEvent(e, token, lastAttackerRef);
  }
  if (cancelled(token)) return;
  // closing tally
  clearActive();
  const s = run.summary;
  status(
    "phase-done",
    "✓",
    `Lauf zu Ende: <b>${s.graduated}</b> graduiert · <b>${s.sybilFlagged}/${s.sybilNodes}</b> Negativbauer ausgeschaltet.`,
  );
  el.tally.hidden = false;
  el.tally.innerHTML =
    `<b>Bilanz dieses aufgezeichneten Laufs</b>` +
    `<div class="tally-grid">` +
    `<span>✅ Graduiert (WIRD GETESTET)</span><b>${s.graduated}</b>` +
    `<span>☠ Negativbauer geflaggt</span><b>${s.sybilFlagged} / ${s.sybilNodes}</b>` +
    `<span>⛔ Blocklist (Modul 12)</span><b>${s.blocklist.join(", ") || "—"}</b>` +
    `<span>👁 Grenzfälle für Klaus</span><b>${run.edgeCases.length}</b>` +
    `</div>` +
    `<p class="tally-note">Aufgezeichnet, nicht live. Der Beweis der Logik ist <code>npm test</code>.</p>`;
}

// --- controls --------------------------------------------------------------
function wireControls() {
  el.play.addEventListener("click", () => {
    paused = !paused;
    el.play.textContent = paused ? "▶ Weiter" : "⏸ Pause";
    el.play.setAttribute("aria-pressed", String(!paused));
  });
  el.restart.addEventListener("click", () => {
    runToken++;
    paused = false;
    el.play.textContent = "⏸ Pause";
    el.play.setAttribute("aria-pressed", "true");
    play();
  });
  el.speed.addEventListener("click", () => {
    const cycle = { 1: 2, 2: 0.5, 0.5: 1 };
    speed = cycle[speed] ?? 1;
    el.speed.textContent = `⏩ Tempo ${speed}×`;
    el.speed.dataset.speed = String(speed);
  });
  el.motion.addEventListener("click", () => {
    motionOn = !motionOn;
    el.motion.textContent = `✦ Bewegung: ${motionOn ? "an" : "aus"}`;
    el.motion.setAttribute("aria-pressed", String(motionOn));
    el.stage.classList.toggle("no-motion", !motionOn);
  });
}

// --- boot ------------------------------------------------------------------
async function boot() {
  Object.assign(el, {
    stage: $("#stage"),
    packet: $("#packet"),
    fx: $("#fx"),
    statusline: $("#statusline"),
    slIcon: $("#sl-icon"),
    slText: $("#sl-text"),
    detail: $("#detail"),
    dKind: $("#d-kind"),
    dTitle: $("#d-title"),
    dDesc: $("#d-desc"),
    rail: $("#d-rail"),
    dNote: $("#d-note"),
    export: $("#d-export"),
    tally: $("#tally"),
    ticker: $("#ticker"),
    play: $("#ctl-play"),
    restart: $("#ctl-restart"),
    speed: $("#ctl-speed"),
    motion: $("#ctl-motion"),
  });

  // a stamp that pops near the gate
  el.stamp = document.createElement("div");
  el.stamp.className = "stamp";
  el.stamp.textContent = "WIRD GETESTET";
  el.stage.appendChild(el.stamp);

  if (!motionOn) {
    el.stage.classList.add("no-motion");
    el.motion.textContent = "✦ Bewegung: aus";
    el.motion.setAttribute("aria-pressed", "false");
  }

  try {
    const res = await fetch("web/data/run.json", { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    run = await res.json();
  } catch (err) {
    status(
      "phase-idle",
      "⚠",
      "run.json nicht gefunden. Lokal erzeugen mit <code>npm run demo</code>.",
    );
    return;
  }

  artById = new Map((run.artefacts || []).map((a) => [a.id, a]));
  wireControls();
  play();
}

boot();
