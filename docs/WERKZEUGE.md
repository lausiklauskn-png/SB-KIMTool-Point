# Werkzeuge — Klartext-Erklärung jedes Moduls

Pflicht (Klaus): jeder soll wissen, **was** ein Werkzeug ist, **wozu** es dient,
**wie** es verwendet & eingebaut wird und **wodurch** es aktiviert. Maschinenlesbar
steht dasselbe in `werkzeugkiste.json`; diese Datei ist die menschenlesbare Fassung.

Status-Legende: ✅ fertig in Sage · ◐ stub/teil-fertig · ⏾ vorgebaut-schlummert ·
○ code-stub / noch nicht kopiert.

---

## BASIC — Pflicht

### 02 · Spore  ○(Sage code-stub) · kopiert · headless getestet
- **Was:** Kryptografische Identität eines Knotens (Ed25519, `node_id = SHA-256(pubkey)`).
- **Nutzen:** Ohne Identität keine Teilnahme; jede Aussage/Stimme ist signiert & prüfbar.
- **Verwendung:** Einmal pro Knoten erzeugen; öffentliche Spore-JSON teilen, privaten Schlüssel geheim halten.
- **Einbau:** Beim Start anlegen und im Storage (01) ablegen.
- **Aktiviert durch:** Immer aktiv (Grundbaustein).
- **Echte Datei:** `web/tools/sbkim-spore.js` (siehe unten) — eine Datei, keine Abhängigkeiten.

### 01 · Storage  ○
- **Was:** Speicher-Wrapper (Browser: IndexedDB; headless: Node-Mock) für alle `sbkim_*` Daten.
- **Nutzen:** Identität, Nachbarn und Zustand überleben einen Neustart.
- **Verwendung:** Schlüssel/Wert ablegen und lesen.
- **Einbau:** Als erste Abhängigkeit laden.
- **Aktiviert durch:** Immer aktiv.

### 19 · Andock-Wizard (Witstart)  ⏾
- **Was:** Kopierbares Onboarding-Modul.
- **Nutzen:** Sporen-Erzeugung und Erst-Andockung ohne Vorwissen — der Eingang für neue Knoten.
- **Verwendung:** Wizard einbinden; erstellt Spore, fragt „das kann meine PWA" ab, meldet am Marktplatz an.
- **Einbau:** Copy-Paste-Block; ruft Spore (02) und Einbau-PWA (09) auf.
- **Aktiviert durch:** Erstkontakt eines neuen Knotens.

### 03 · Embedding  ✅
- **Was:** Wandelt „das kann ich"-Texte in 384-dim Vektoren (Xenova/multilingual-e5-small).
- **Nutzen:** Macht maschinell vergleichbar, was eine PWA anbietet/sucht.
- **Verwendung:** Text rein, Vektor raus; Vektor an Match (04).
- **Einbau:** Browser-Modul (läuft im Browser, nicht im Node-Modell; dort deterministisch gestubt).
- **Aktiviert durch:** Immer aktiv (Live-Beweis 2026-05-16).

### 04 · Match  ✅
- **Was:** Cosine-Ähnlichkeit über Vektoren, Schwelle `PROVIDER_MIN_MATCH = 0.80`.
- **Nutzen:** Findet passende Anbieter ohne zentrale Suche.
- **Verwendung:** Zwei Vektoren vergleichen; ab 0,80 ein Treffer.
- **Einbau:** Nimmt Embedding (03) entgegen, speist Handshake (05).
- **Aktiviert durch:** Immer aktiv (Sichttest 5/5 grün).

### 05 · Anastomose / Handshake  ✅
- **Was:** Verbindungsaufbau zwischen zwei Knoten (Hyphen-Verschmelzung).
- **Nutzen:** Aus einem Treffer wird eine beidseitig bestätigte Verbindung.
- **Verwendung:** Nach einem Match anstoßen; beide Seiten signieren.
- **Einbau:** Setzt Spore (02) und Match (04) voraus.
- **Aktiviert durch:** Bestätigter Match (Cross-Node-Beweis 2026-05-16).

### 09 · Einbau-PWA  ✅
- **Was:** Mechanismus, der das Protokoll in eine bestehende PWA einsetzt.
- **Nutzen:** Jede PWA wird zum Knoten, ohne neu gebaut zu werden.
- **Verwendung:** Init-Skript + Service-Worker einbinden.
- **Einbau:** `sbkim-init.js` / `sbkim-sw.js` einhängen.
- **Aktiviert durch:** Einbindung in eine PWA (live an 2 Endknoten seit 2026-05-16).

---

## PRO — kann rein

### 00 · Doku-Fenster  ○
- **Was:** Verstecktes Status-Panel (5-Klick) in einer Endpunkt-PWA.
- **Nutzen:** Zeigt ehrlich, was lebt / was tot ist.
- **Verwendung:** Fünfmal tippen öffnet das Panel.
- **Einbau:** Liest status.json und Spore.
- **Aktiviert durch:** 5-Klick-Geste.

### 06 · Heterokaryose  ○
- **Was:** Daten-Austausch zwischen Geschwister-Knoten (opt-in).
- **Nutzen:** Wissen teilen, ohne Identitäten zu vermischen.
- **Verwendung:** Austausch pro Datentyp freischalten; nur mit bestätigten Nachbarn.
- **Einbau:** Setzt Handshake (05) voraus; UI über 08.
- **Aktiviert durch:** Opt-in des Nutzers.

### 07 · Apoptose  ○ · Modell-Prototyp
- **Was:** Geordneter Selbst-Tod mit signiertem Vermächtnis.
- **Nutzen:** Kranke/böse Knoten verschwinden nicht stumm — Geschwister erfahren signiert, WARUM.
- **Verwendung:** Bei Überlast oder kollektivem Misstrauen auslösen; Vermächtnis verbreiten.
- **Einbau:** Wird von Reputation (10) angestoßen; nutzt Spore (02) zum Signieren.
- **Aktiviert durch:** Homöostase-Überlast ODER kollektives Misstrauen.

### 08 · UI-Demo  ○
- **Was:** Wartungs-/Konfigurations-UI.
- **Nutzen:** Macht unsichtbare Module bedienbar.
- **Verwendung:** Einstellungen vornehmen, Status sichten.
- **Einbau:** Liest/schreibt über Storage (01).
- **Aktiviert durch:** Nutzer öffnet die Wartungs-UI.

### 15 · Membran  ✅ (schlummert)
- **Was:** Außenhülle zwischen PWA-Zelle und Browser.
- **Nutzen:** Schützt den Knoten gegen die Außenwelt — wirkt erst beim Angriff.
- **Verwendung:** Einmal einbinden; arbeitet im Hintergrund.
- **Einbau:** Umschließt die PWA-Zelle; keine laufende Bedienung.
- **Aktiviert durch:** Direkter Angriff von außen (sonst schlummernd — fertig 2026-05-25).

### 16 · SBKIM-Siegel  ◐ · Modell-Prototyp
- **Was:** Selbst-einschreibendes Zertifikat einer bezeugten Bau-Tat („Tun statt Sein").
- **Nutzen:** Nur wer Bezeugtes gebaut hat, bekommt Stimmrecht — Sybils bleiben gewichtslos.
- **Verwendung:** Gate/Arzt vergibt nach bestandener Prüfung; Reputation (10) liest das Gewicht.
- **Einbau:** An die Prüf-Rolle koppeln; Siegel signiert vom Zeugen.
- **Aktiviert durch:** Bestandene Artefakt-Prüfung (Sichttest 4/4 grün).

### 17 · Floating-Widget  ◐
- **Was:** Schwebendes Bedien-Widget mit Event-Bus (fünf Custom-Events).
- **Nutzen:** Einheitlicher, leichter Andock-Punkt für die Bedienung.
- **Verwendung:** Widget einhängen; auf die fünf Events reagieren.
- **Einbau:** Ein Skript-Tag; kommuniziert über den Event-Bus.
- **Aktiviert durch:** Immer aktiv, sobald eingebunden (headless-smoke 19/19 grün).

---

## PROFI / PLUS — das Plus

### 10 · Reputation  ⏾ · Modell-Prototyp
- **Was:** Misstrauens-/Reputationswert je Knoten (Sybil-Abwehr).
- **Nutzen:** Wehrt Sybil-Angriffe ab, ohne legitime Knoten zu behindern.
- **Verwendung:** Wert abfragen, bevor man einer Stimme/Spore vertraut; Stimmgewicht = bezeugte Bau-Taten.
- **Einbau:** An Spore-/Siegel-Events andocken; speist Blocklist (12) und Apoptose (07).
- **Aktiviert durch:** Sybil-Effekt (viele Identitäten ohne bezeugte Bau-Tat).

### 11 · Rate-Limit & TTL  ⏾
- **Was:** Begrenzt Anfrage-Rate und Lebensdauer von Nachrichten/Sporen.
- **Nutzen:** Schützt vor Fluten; alte Daten leben nicht ewig.
- **Verwendung:** Schwellen setzen; Überzähliges wird gebremst/verworfen.
- **Einbau:** Vor die Nachrichten-Eingänge schalten.
- **Aktiviert durch:** Flooding.

### 12 · Blocklist  ⏾ · Modell-Prototyp
- **Was:** Liste geflaggter Angreifer.
- **Nutzen:** Bekannte böse Knoten werden gemieden.
- **Verwendung:** Vor jeder Interaktion prüfen.
- **Einbau:** Wird von Reputation (10) befüllt; vor Handshake (05) abfragen.
- **Aktiviert durch:** Geflaggter Angreifer.

### 14 · Diffusion  ⏾ · Modell-Prototyp
- **Was:** Verbreitet Spore-/Vermächtnis-Konsens unter Nachbarn.
- **Nutzen:** Wissen (z. B. eine Apoptose-Anklage) erreicht das Netz ohne zentrale Stelle.
- **Verwendung:** Signierte Vermächtnisse weiterreichen; Doppeltes verwerfen.
- **Einbau:** An Apoptose (07) und Reputation (10) koppeln.
- **Aktiviert durch:** Konsens-Bedarf.

### 18 · Tool-PWA-Container  ◐
- **Was:** Kapselt ein Werkzeug als eigenständige PWA (Sub a 17/17 grün, Rest offen).
- **Nutzen:** Selbstgebaute Tools laufen gekapselt und sind teilbar.
- **Verwendung:** Werkzeug in den Container legen; als PWA ausliefern/kopieren.
- **Einbau:** Nutzt Membran (15) als Außenhülle.
- **Aktiviert durch:** Auslieferung eines selbstgebauten Tools.

---

## Echte, einbaubare Dateien (nicht nur Anzeige)

Module mit dem JSON-Feld `datei` haben eine **echte, offline einbaubare Datei** in
diesem Repo. Die Werkzeuge-Seite bietet dafür **„⧉ Code kopieren"** und **„⬇ Datei
laden"** an (kein externer Abruf, kein Sage-Hotlink — die Datei wohnt hier). Module
ohne `datei` zeigen bewusst **keinen** solchen Knopf — ehrlich statt leerer Versprechen.

### 01 · Storage — `web/tools/sbkim-storage.js`

Eine einzige, abhängigkeitsfreie Datei (klassisches `<script>`-Modul, UMD-Muster).
**Browser:** IndexedDB (überlebt Neustart). **Headless/Node:** automatischer In-Memory-
Fallback; `store.backend` zeigt `"indexeddb"` bzw. `"memory"`.

```html
<script src="sbkim-storage.js"></script>
<script>
  const store = await SBKIMStorage.open("sbkim");
  await store.set("spore", { nodeId: "…" });
  const spore = await store.get("spore");   // -> {nodeId:"…"} oder null
</script>
```

**Ehrlichkeit:** In-Memory-Pfad + API sind durch `test/storage.test.js` belegt (9/9);
der **IndexedDB-Pfad ist ungeprüft — wartet auf Klaus' Browser-Lauf**.

### 02 · Spore — `web/tools/sbkim-spore.js`

Eine einzige, abhängigkeitsfreie Datei (UMD-Muster wie 01). Echte Krypto:
**Ed25519 über WebCrypto** (`crypto.subtle`). `nodeId = SHA-256(roher öffentlicher
Schlüssel)`. Der **private Schlüssel bleibt im Modul** — nur der öffentliche Teil
verlässt es (`exportPublic()`).

```html
<script src="sbkim-spore.js"></script>
<script>
  if (!(await SBKIMSpore.isSupported())) {     // ehrlicher Hinweis statt Bruch
    alert("Dieser Browser kann Ed25519 noch nicht."); 
  } else {
    const spore = await SBKIMSpore.create();
    const sig   = await spore.sign("hallo");          // Hex-Signatur
    const ok    = await spore.verify("hallo", sig);   // true
    const pub   = spore.exportPublic();                // {nodeId, alg, publicKey}
    // teilbar; ohne privaten Schlüssel. Fremd prüfen:
    await SBKIMSpore.verify(pub, "hallo", sig);        // true
  }
</script>
```

**WebCrypto-Anforderung (ehrlich):** Ed25519 in WebCrypto ist jung; ältere Browser
(u. a. manche Tablet-Browser) können es noch nicht. `isSupported()` meldet das vorab
**ehrlich** (true/false), `create()` wirft sonst eine **klare Meldung statt still zu
brechen**.

**Ehrlichkeit:** Sign/Verify + Identitäts-Bindung sind durch `test/spore.test.js`
belegt (10/10, gegen Node-WebCrypto); der **Browser-Pfad ist ungeprüft — wartet auf
Klaus' Browser-Lauf**.

## Truhe ↔ `werkzeugkiste.json` (Mapping-Hinweis)

`werkzeugkiste.json` bleibt die **maschinenlesbare Quelle** (id/name/stufe/sage_status/
point_status/was/nutzen/verwendung/einbau/aktiviert_durch, optional `datei`/
`point_hinweis`). Eine evtl. reichere „Truhe"-Ansicht (offener Draft-PR #11) trägt eine
eigene inline Tool-Liste; **wer beide zusammenführt, schreibt zuerst den Mapping-Vertrag
hier fest, dann Code** (Spec vor Code). Tier-Namen nicht stillschweigend mischen
(`basic/pro/profi`).
