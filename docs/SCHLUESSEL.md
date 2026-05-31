# SCHLÜSSEL — Knoten-Identität von SB·KIMTool·Point

Stand: 2026-05-30

## Worum geht's

Unser Knoten unterschreibt seine Spore mit einem **privaten Ed25519-Schlüssel**
(`SBKIM_NODE_KEY`, base64 PKCS8-PEM). Daraus leitet sich die dauerhafte **nodeId**
`CyunQNDRZZ3st8xGDYyK0ymJLNxn_S1UcIJpFKpXXNY` ab. Solange wir denselben Schlüssel
behalten, bleibt die nodeId gleich — Sage muss uns nicht neu registrieren.

## Wo der Schlüssel liegt (zwei Wege, mind. einer muss greifen)

1. **Passwort-Tresor im Repo** — `sbkim/node_key.enc.json`
   - Verschlüsselt mit **AES-256-GCM**, Schlüssel via **PBKDF2 (600k, SHA-256)** aus Klaus'
     Passwort. Ohne Passwort wertlos; das Passwort steht **nirgends** im Repo.
   - Öffnen: `SBKIM_KEY_PW='<Klaus-Passwort>' node scripts/open_node_key.mjs`
   - Direkt re-signieren:
     ```
     SBKIM_NODE_KEY="$(SBKIM_KEY_PW='<Passwort>' node scripts/open_node_key.mjs)" \
       node scripts/generate_spore.mjs
     ```
2. **Umgebungs-Secret `SBKIM_NODE_KEY`** (optional, am bequemsten) — als Secret in der
   Claude-Code-Umgebung hinterlegt. Wenn gesetzt, nutzt `scripts/generate_spore.mjs` es
   automatisch, ohne Tresor/Passwort.

## Tresor ANLEGEN (einmalig, wenn noch keiner existiert)

Gibt es weder Secret noch `sbkim/node_key.enc.json` (z. B. ein **neuer Knoten**), erzeugt
`scripts/make_node_key.mjs` in **einem** Lauf einen frischen Ed25519-Schlüssel, zeigt die
dauerhafte nodeId und legt ihn **verschlüsselt** ab (AES-256-GCM / PBKDF2 600k — dasselbe
Format, das `open_node_key.mjs` öffnet):

```
SBKIM_KEY_PW='<dein-Passwort>' node scripts/make_node_key.mjs
```

- Schreibt `sbkim/node_key.enc.json`, druckt die **nodeId** (merken/abgleichen).
- **Privater Schlüssel und Passwort kommen NIE im Klartext** ins Repo, in Commits oder auf
  stdout. Passwort nur über `SBKIM_KEY_PW` (nicht als Argument → Prozessliste).
- Überschreibt einen **vorhandenen** Tresor NICHT (Identitätsschutz); bewusst neu:
  `SBKIM_KEY_FORCE=1` zusätzlich setzen (alte Identität geht verloren).
- Passwort sicher merken (Passwort-Manager). Danach Spore signieren (Re-Sign-Ablauf unten).

## Re-Sign-Ablauf (wenn Vektor/Kategorien sich ändern)

1. Schlüssel beschaffen (Tresor öffnen ODER Secret gesetzt).
2. `node scripts/generate_spore.mjs` → schreibt `sbkim/spore.json` neu.
3. **Kontrolle:** Ausgabe muss `nodeId: CyunQNDRZZ3st8xGDYyK0ymJLNxn_S1UcIJpFKpXXNY`
   zeigen. Weicht sie ab → falscher/fehlender Schlüssel → **stoppen**, Klaus fragen.
4. `node scripts/verify_foreign_spore.mjs sbkim/spore.json` → ✔ VALID; `npm test` grün.

## Wenn das Passwort verloren geht

Dann ist der Tresor nicht mehr zu öffnen. Lösung: **neue Identität erzeugen** mit
`SBKIM_KEY_FORCE=1 SBKIM_KEY_PW='<neues-Passwort>' node scripts/make_node_key.mjs`
(neuer Schlüssel + neuer Tresor in einem Lauf), dann `generate_spore.mjs` und Sage um
**Neu-Registrierung** bitten. Genau das ist am 2026-05-30 einmal passiert (alter Schlüssel
`eC3jzoo9…` war nie gesichert) — deshalb gibt es jetzt `make_node_key.mjs`.

## Sicherheitsregeln

- Der **private** Schlüssel (Klartext base64/PEM) und das **Passwort** kommen **nie** ins
  Repo, nie in Commits, nie in Chat-Artefakte, die gepusht werden.
- Nur der **öffentliche** Teil (nodeId, publicKey.x) darf nach außen / in `sbkim/spore.json`.
- Der verschlüsselte Tresor `node_key.enc.json` **darf** ins Repo (ohne Passwort wertlos).
