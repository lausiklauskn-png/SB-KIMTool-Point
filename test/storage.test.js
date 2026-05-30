// storage.test.js — proves Modul 01 "Storage" logic headless (in-memory backend).
// The IndexedDB path runs only in the browser (ungeprueft, wartet auf Klaus' Lauf);
// here we prove the API contract + the Node fallback that the page also relies on.
//
// The distributable module is a classic UMD script (so a forker can <script src> it).
// Importing it here for its side effect registers it on globalThis, which is also
// exactly how the browser reaches it (window.SBKIMStorage).

import { test } from "node:test";
import assert from "node:assert/strict";
import "../web/tools/sbkim-storage.js";

const SBKIMStorage = globalThis.SBKIMStorage;

test("module registered itself (globalThis / window in the browser)", () => {
  assert.ok(SBKIMStorage, "SBKIMStorage is available");
  assert.equal(typeof SBKIMStorage.open, "function");
});

test("uses the in-memory backend headless (no IndexedDB in Node)", async () => {
  const store = await SBKIMStorage.open("test-a");
  assert.equal(store.backend, "memory");
});

test("set/get round-trips objects", async () => {
  const store = await SBKIMStorage.open("test-roundtrip");
  await store.set("spore", { nodeId: "abc", weight: 3 });
  assert.deepEqual(await store.get("spore"), { nodeId: "abc", weight: 3 });
});

test("missing key returns null (clear contract)", async () => {
  const store = await SBKIMStorage.open("test-missing");
  assert.equal(await store.get("nope"), null);
});

test("stored values are decoupled from the original object", async () => {
  const store = await SBKIMStorage.open("test-immutable");
  const obj = { n: 1 };
  await store.set("k", obj);
  obj.n = 999; // must not leak into the store
  assert.deepEqual(await store.get("k"), { n: 1 });
});

test("undefined is stored as null", async () => {
  const store = await SBKIMStorage.open("test-undef");
  await store.set("u", undefined);
  assert.equal(await store.get("u"), null);
});

test("remove deletes a key", async () => {
  const store = await SBKIMStorage.open("test-remove");
  await store.set("k", 1);
  await store.remove("k");
  assert.equal(await store.get("k"), null);
});

test("keys lists what was set; clear empties it", async () => {
  const store = await SBKIMStorage.open("test-keys");
  await store.set("a", 1);
  await store.set("b", 2);
  assert.deepEqual((await store.keys()).sort(), ["a", "b"]);
  await store.clear();
  assert.deepEqual(await store.keys(), []);
});

test("namespaces are isolated from each other", async () => {
  const one = await SBKIMStorage.open("ns-one");
  const two = await SBKIMStorage.open("ns-two");
  await one.set("shared", "from-one");
  assert.equal(await two.get("shared"), null);
  assert.equal(await one.get("shared"), "from-one");
});
