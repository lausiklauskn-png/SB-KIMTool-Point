// identity_switcher.test.js — Beweis für den Identitäts-Wechsler (Baustein 5),
// der aus Sage in den 🔑-Wizard (`assets/sbkim-siegel.js`) portiert wurde.
//
// Zwei Hälften, beide headless:
//   1) CONTRACT: das byte-1:1 aus Sage kopierte Modul 02 (`web/tools/sbkim-spore.js`)
//      trägt die Multi-Identitäts-Fläche, auf die der Wechsler baut
//      (listIdentities / getActiveIdentityKey / setActiveIdentity).
//   2) LOGIK: die Refresh-/Wechsel-Wiring-Logik (Dropdown füllen, aktive
//      markieren, Auswahl setzt aktive, fail-soft) gegen einen Spore-Mock mit
//      echtem Multi-Identitäts-Lebenszyklus — 1:1 die Logik aus dem Port.
//
// Ehrlichkeit (Sage-konform): Modul 02 braucht IndexedDB + WebCrypto und läuft
// erst im Browser voll; ein echter End-to-End-Lauf ist headless nicht möglich
// (keine Abhängigkeiten im Repo — kein jsdom/fake-indexeddb). Darum prüft (1)
// nur die API-Fläche, (2) die Wiring-Logik gegen einen Mock. Die tatsächliche
// DOM-Verdrahtung in `assets/sbkim-siegel.js` bleibt „ungeprüft, wartet auf
// Klaus' Browser-Lauf" (siehe PULS.md).

import { test } from "node:test";
import assert from "node:assert/strict";

// ---- (1) CONTRACT: Modul 02 trägt die Multi-Identitäts-Fläche --------------

globalThis.window = globalThis;
await import("../web/tools/sbkim-spore.js");

test("Modul 02 exponiert die Fläche, auf die der Wechsler baut", () => {
  const sp = globalThis.SbkimSpore;
  for (const fn of ["listIdentities", "getActiveIdentityKey", "setActiveIdentity"]) {
    assert.equal(typeof sp[fn], "function", `Spore.${fn}`);
  }
});

// ---- (2) LOGIK: Refresh + Wechsel gegen einen Spore-Mock -------------------

// Winziger <select>-Shim: nur was die Wiring-Logik anfasst (innerHTML löschen,
// appendChild, options). Keine echte DOM — reine Logik-Bühne.
function makeSelect() {
  const sel = {
    options: [],
    set innerHTML(v) { if (v === "") this.options = []; },
    appendChild(opt) { this.options.push(opt); },
  };
  return sel;
}
function makeOption() { return { value: "", textContent: "", selected: false }; }

// Spore-Mock mit echtem Multi-Identitäts-Lebenszyklus (wie Modul 02:
// mehrere Slots, ein aktiver, wechselbar).
function makeSporeMock(initialIds, initialActive) {
  let ids = initialIds.slice();
  let active = initialActive;
  return {
    listIdentities: async () => ids.slice(),
    getActiveIdentityKey: async () => active,
    setActiveIdentity: async (key) => {
      if (!ids.includes(key)) throw new Error("kein Slot: " + key);
      active = key;
    },
    _active: () => active,
    _add: (k) => { ids.push(k); },
  };
}

// Die portierte Refresh-Logik (1:1 zu refreshWizardIdentities / Sages
// refreshAndockIdentities), hier gegen den Shim + Mock ausgeführt.
async function refresh(sel, spore, doc) {
  if (!sel || !spore || typeof spore.listIdentities !== "function") return;
  const ids = await spore.listIdentities();
  let active = null;
  if (typeof spore.getActiveIdentityKey === "function") {
    try { active = await spore.getActiveIdentityKey(); } catch (_e) { /* nb */ }
  }
  sel.innerHTML = "";
  if (!ids || !ids.length) {
    const opt = doc.createElement();
    opt.value = ""; opt.textContent = "— keine geladen —";
    sel.appendChild(opt);
    return;
  }
  ids.forEach((k) => {
    const opt = doc.createElement();
    opt.value = k; opt.textContent = k + (k === active ? "  (aktiv)" : "");
    if (k === active) opt.selected = true;
    sel.appendChild(opt);
  });
}

// Die portierte Wechsel-Logik (change-Handler).
async function switchTo(key, spore, sel, doc) {
  if (!key || !spore || typeof spore.setActiveIdentity !== "function") return;
  await spore.setActiveIdentity(key);
  await refresh(sel, spore, doc);
}

const DOC = { createElement: makeOption };

test("leer: genau eine Platzhalter-Option (keine geladen)", async () => {
  const sel = makeSelect();
  await refresh(sel, makeSporeMock([], null), DOC);
  assert.equal(sel.options.length, 1);
  assert.equal(sel.options[0].textContent, "— keine geladen —");
});

test("mehrere Identitäten: alle gelistet, aktive mit (aktiv) markiert", async () => {
  const sel = makeSelect();
  await refresh(sel, makeSporeMock(["aaa", "bbb", "ccc"], "bbb"), DOC);
  assert.equal(sel.options.length, 3);
  const active = sel.options.filter((o) => o.selected);
  assert.equal(active.length, 1, "genau eine aktiv");
  assert.equal(active[0].value, "bbb");
  assert.match(active[0].textContent, /\(aktiv\)$/);
  // die nicht-aktiven tragen die Markierung NICHT
  assert.ok(!/\(aktiv\)/.test(sel.options.find((o) => o.value === "aaa").textContent));
});

test("Auswahl wechselt die aktive Identität (nachweisbar beim erneuten Füllen)", async () => {
  const sel = makeSelect();
  const sp = makeSporeMock(["aaa", "bbb"], "aaa");
  await switchTo("bbb", sp, sel, DOC);
  assert.equal(sp._active(), "bbb", "Modul-02-Zustand umgeschaltet");
  const active = sel.options.filter((o) => o.selected);
  assert.equal(active.length, 1);
  assert.equal(active[0].value, "bbb", "neue Markierung im Dropdown");
});

test("nach dem Erzeugen taucht die neue Identität auf", async () => {
  const sel = makeSelect();
  const sp = makeSporeMock(["aaa"], "aaa");
  sp._add("neu"); // simuliert getOrCreateIdentity → refreshWizardIdentities
  await refresh(sel, sp, DOC);
  assert.equal(sel.options.length, 2);
  assert.ok(sel.options.some((o) => o.value === "neu"));
});

test("fail-soft: fehlt Modul 02 / fehlt die Fläche → kein Crash, Dropdown unangetastet", async () => {
  const sel = makeSelect();
  await refresh(sel, null, DOC);                 // gar kein Spore
  await refresh(sel, {}, DOC);                    // ohne listIdentities
  await switchTo("x", {}, sel, DOC);              // ohne setActiveIdentity
  await switchTo("", makeSporeMock(["a"], "a"), sel, DOC); // leerer Key
  assert.equal(sel.options.length, 0, "nichts eingefügt, kein Wurf");
});
