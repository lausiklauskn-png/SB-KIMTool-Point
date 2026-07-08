// rendezvous_hygiene.test.js — Beweis für die Identitäts-Hygiene (Schritt 2)
// des Rendezvous-Moduls (Modul 23): Modus A (sanft/automatisch/idempotent,
// NICHT zerstörend) + Modus B (Nutzer-Knopf, reinigt NUR die eigene Origin,
// dann frische Identität + Spore + Anmelden). Alles headless, mit Mocks für
// die Browser-Flächen (IndexedDB / Service-Worker / Caches) und die geteilten
// Kern-Module (Storage 01 / Spore 02 / Relay 05b / Anastomose 05).
//
// Ehrlichkeit: das ist der Logik-Beweis. Der echte Browser-Pfad (Live-Relais,
// echtes IndexedDB-Löschen, Service-Worker) bleibt „ungeprüft, wartet auf
// Klaus' Browser-Lauf".

import { test } from "node:test";
import assert from "node:assert/strict";

// window-Shim VOR dem Modul-Import (Modul registriert auf window == globalThis).
globalThis.window = globalThis;
await import("../web/tools/sbkim-rendezvous.js");
const R = globalThis.SbkimRendezvous;

// Manche Globals (navigator) sind in Node schreibgeschützte Getter — über
// defineProperty setzen, damit die Browser-Mocks greifen.
function setG(name, value) {
  Object.defineProperty(globalThis, name, { value: value, configurable: true, writable: true });
}

// Ein Spore-Mock mit echtem Identitäts-Lebenszyklus (getNodeId wirft ohne
// Identität — exakt wie Modul 02). Zählt, wie oft eine Identität erzeugt wird.
function makeSporeMock() {
  let identity = null;
  let createCount = 0;
  return {
    getNodeId: async () => {
      if (!identity) throw Object.assign(new Error("keine Identität"), { name: "NoIdentityError" });
      return identity.nodeId;
    },
    getOrCreateIdentity: async () => {
      if (!identity) { createCount++; identity = { nodeId: "node-abc" }; }
      return identity;
    },
    getOwnSpore: async () => (identity ? { id: identity.nodeId } : null),
    getActiveIdentityKey: async () => "default",
    removeIdentity: async () => { identity = null; },
    _stats: () => ({ createCount, hasIdentity: !!identity }),
  };
}

test("Modul 23 exponiert die Hygiene-Oberfläche", () => {
  for (const fn of ["ensureIdentity", "cleanupSharedOrigin", "repairAndReconnect"]) {
    assert.equal(typeof R[fn], "function", `Rendezvous.${fn}`);
  }
  assert.equal(R._meta.sharedDbName, "sbkim", "geteilter Alt-Topf ist 'sbkim'");
});

test("Modus A: ensureIdentity ist idempotent + NICHT zerstörend", async () => {
  const sp = makeSporeMock();
  globalThis.SbkimSpore = sp;
  const initCalls = [];
  globalThis.SbkimStorage = { init: async (o) => { initCalls.push(o); } };

  const r1 = await R.ensureIdentity({ dbSuffix: "toolpoint" });
  assert.equal(r1.ok, true);
  assert.equal(r1.created, true, "erstes Mal: Identität erzeugt");
  assert.equal(r1.nodeId, "node-abc");
  assert.equal(initCalls.length, 1, "eigene Schublade genau einmal geöffnet");
  assert.equal(initCalls[0].dbSuffix, "toolpoint", "richtige Schublade");

  const r2 = await R.ensureIdentity({ dbSuffix: "toolpoint" });
  assert.equal(r2.ok, true);
  assert.equal(r2.created, false, "zweites Mal: nichts Neues erzeugt");
  const r3 = await R.ensureIdentity({ dbSuffix: "toolpoint" });
  assert.equal(r3.created, false, "drittes Mal: nichts Neues erzeugt");

  assert.equal(sp._stats().createCount, 1, "Identität nur EINMAL erzeugt (idempotent)");
  assert.equal(sp._stats().hasIdentity, true, "Identität nie gelöscht (nicht zerstörend)");
});

test("Modus A fail-soft: ohne Modul 02 (Spore) kein Bruch", async () => {
  delete globalThis.SbkimSpore;
  globalThis.SbkimStorage = { init: async () => {} };
  const r = await R.ensureIdentity({ dbSuffix: "toolpoint" });
  assert.equal(r.ok, false);
  assert.match(r.reason, /Spore/);
});

test("init({ensureIdentity:true}) fährt Modus A einmal", async () => {
  const sp = makeSporeMock();
  globalThis.SbkimSpore = sp;
  globalThis.SbkimStorage = { init: async () => {} };
  await R.init({ nodeName: "Test", dbSuffix: "toolpoint", ensureIdentity: true });
  assert.equal(sp._stats().hasIdentity, true, "Identität nach init vorhanden");
  assert.equal(R._meta.dbSuffix, "toolpoint");
});

test("cleanupSharedOrigin löscht NUR den geteilten Topf + SW + Caches", async () => {
  const deletedDbs = [];
  globalThis.indexedDB = {
    deleteDatabase: (name) => {
      deletedDbs.push(name);
      const req = {};
      setTimeout(() => { if (req.onsuccess) req.onsuccess(); }, 0);
      return req;
    },
  };
  let unreg = 0;
  setG("navigator", {
    serviceWorker: {
      getRegistrations: async () => [
        { unregister: async () => { unreg++; return true; } },
        { unregister: async () => { unreg++; return true; } },
      ],
    },
  });
  const cacheDeleted = [];
  globalThis.caches = { keys: async () => ["v1", "v2"], delete: async (k) => { cacheDeleted.push(k); return true; } };

  const c = await R.cleanupSharedOrigin();
  assert.deepEqual(deletedDbs, ["sbkim"], "genau der geteilte Topf 'sbkim' gelöscht");
  assert.ok(!deletedDbs.includes("sbkim_toolpoint"), "eigene Schublade NIE angefasst");
  assert.equal(c.dbDeleted, true);
  assert.equal(c.swUnregistered, 2, "beide Service-Worker abgemeldet");
  assert.equal(unreg, 2);
  assert.equal(c.cachesDeleted, 2, "beide Caches geleert");
  assert.equal(cacheDeleted.length, 2);
});

test("Modus B: repairAndReconnect reinigt, meldet an, gibt Reload-Hinweis", async () => {
  const deletedDbs = [];
  globalThis.indexedDB = {
    deleteDatabase: (name) => {
      deletedDbs.push(name);
      const req = {};
      setTimeout(() => { if (req.onsuccess) req.onsuccess(); }, 0);
      return req;
    },
  };
  setG("navigator", { serviceWorker: { getRegistrations: async () => [] } });
  globalThis.caches = { keys: async () => [], delete: async () => true };

  // Kern-Stack: Relais + Anastomose + Spore (Identität schon da → nur anmelden).
  const published = [];
  globalThis.SbkimNostrRelay = { publish: async (ev) => { published.push(ev); }, subscribe: () => () => {} };
  let listened = 0;
  globalThis.SbkimAnastomose = { handshake: async () => ({ outcome: "established" }), listenNostr: async () => { listened++; } };
  const sp = makeSporeMock();
  await sp.getOrCreateIdentity();
  globalThis.SbkimSpore = sp;
  globalThis.SbkimStorage = { init: async () => {} };

  R.configure({ dbSuffix: "toolpoint", nodeName: "SB-KIMTool-Point" });
  const rb = await R.repairAndReconnect();

  assert.deepEqual(deletedDbs, ["sbkim"], "eigene Schublade unangetastet, nur geteilter Topf gelöscht");
  assert.equal(rb.ok, true, "im Netz angemeldet");
  assert.equal(rb.created, false, "bestehende Identität behalten (nicht zerstört)");
  assert.equal(rb.nodeId, "node-abc");
  assert.equal(published.length, 1, "Visitenkarte in den Raum geheftet");
  assert.ok(listened >= 1, "lauscht nach dem Anmelden");
  assert.match(rb.reloadHint, /neu laden/, "Reload-Hinweis vorhanden");
  assert.equal(rb.cleaned.dbDeleted, true);
});

test("Modus B mit newIdentity:true erzeugt eine FRISCHE Identität", async () => {
  globalThis.indexedDB = {
    deleteDatabase: () => { const req = {}; setTimeout(() => { if (req.onsuccess) req.onsuccess(); }, 0); return req; },
  };
  setG("navigator", { serviceWorker: { getRegistrations: async () => [] } });
  globalThis.caches = { keys: async () => [], delete: async () => true };
  globalThis.SbkimNostrRelay = { publish: async () => {}, subscribe: () => () => {} };
  globalThis.SbkimAnastomose = { handshake: async () => ({ outcome: "established" }), listenNostr: async () => {} };

  const sp = makeSporeMock();
  await sp.getOrCreateIdentity();      // alte Identität da
  globalThis.SbkimSpore = sp;
  globalThis.SbkimStorage = { init: async () => {} };

  // app-eigener createIdentity-Callback: erzeugt nach Entfernen die neue Identität
  let madeFresh = 0;
  const createIdentity = async () => { madeFresh++; await sp.getOrCreateIdentity(); };

  R.configure({ dbSuffix: "toolpoint", createIdentity });
  const rb = await R.repairAndReconnect({ newIdentity: true });
  assert.equal(rb.ok, true);
  assert.equal(rb.created, true, "nach newIdentity: als neu erzeugt gemeldet");
  assert.equal(madeFresh, 1, "createIdentity-Callback genau einmal gefeuert");
});
