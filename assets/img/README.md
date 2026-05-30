# Bild-Plätze (assets/img/) — von Klaus generiert, von der Seite eingebunden

Diese Bilder sind **progressive enhancement**: Die Seite funktioniert und sieht
auch **ohne** sie fertig aus (CSS-Gradient-Fallback). Sobald eine Datei mit dem
genannten Namen hier liegt, erscheint sie automatisch — kein Code-Änderung nötig.

**Regeln (Verfassung):** eigene, neutrale Identität — **keine** fremden Logos,
Marken, Wasserzeichen oder reproduzierten Vorlagen. Dunkler Hintergrund, kühles
Teal (`#36d6c3`) als Akzent. PNG mit transparentem oder sehr dunklem Grund.
Offline — Dateien liegen lokal im Repo, keine externen Links.

| Datei | Wo | Format / Größe | Zweck |
|---|---|---|---|
| `truhe.png` | **Startseite Mitte** (zentraler Blickfang, klickbar → Werkzeuge) | quer/quadr., dunkel | **vorhanden** — die von Klaus gelieferte Werkzeug-Truhe; wächst sanft beim Drüberfahren |
| `ambient.png` | alle Seiten (fixer Hintergrund) | quer, ~2000×1400, dunkel | ruhige Tiefen-Textur hinter allem |
| `hero.png` | Startseite (Hero-Backdrop) | quer, ~1600×900 | optionaler Hintergrund hinter Titel/Truhe (Fallback: nur Glow) |
| `banner-modell.png` | Modell-Kopf + Start-Karte 1 | quer, ~1200×400 | Motiv „Pipeline / Knotenkette" |
| `banner-werkzeuge.png` | Werkzeuge-Kopf + Start-Karte 2 | quer, ~1200×400 | Motiv „Werkbank / Module / Truhe" |
| `banner-markt.png` | Markt-Kopf + Start-Karte 3 | quer, ~1200×400 | Motiv „Schaufenster / Andocken" |
| `icon-192.png` | Favicon / App-Icon (alle Seiten) | quadratisch, 192×192 (+ optional 512×512) | Marke „SB·KIMTool·Point" |

## Generierungs-Prompts (Englisch, für gängige Bild-KIs)

> Gemeinsamer Stil-Anker für alle: *dark UI background art, near-black charcoal
> (#0c0f12), single cool teal accent (#36d6c3), subtle cyan glow, clean modern
> tech aesthetic, soft depth, no text, no logos, no watermark, high detail,
> 16:9 unless noted.*

**ambient.png**
`Abstract dark ambient background texture, near-black charcoal canvas with very
faint teal nebula glow and a barely-visible network of thin connecting lines and
soft light nodes, lots of negative space, calm and unobtrusive, designed to sit
behind UI text at low opacity, no text, no logo, no watermark, 2000x1400.`

**hero.png**
`Wide abstract hero artwork for a dark tech website: a glowing network of
interconnected nodes forming a protective lattice, like a digital immune system,
cool teal light on deep charcoal, soft bloom and depth of field, elegant and
premium, empty space in the upper-center for a headline, no text, no logo, 1600x900.`

**banner-werkzeuge.png**
`Slim horizontal banner, dark charcoal background, an orderly workbench of modular
hexagonal tiles / building blocks with soft teal edge-glow, a few tiles brighter
(ready) and some dim (dormant), clean isometric feel, no text, no logo, 1200x400.`

### Links & rechts der Truhe — Modell (links) + Markt (rechts), Steampunk-Richtung

Beide im **gleichen** Stil, **angelehnt an Steampunk — aber nur in die Richtung**, nicht voll;
passend zum gelieferten Truhe-Bild. Jeder Prompt ist **vollständig/eigenständig** (Stil schon
eingebaut) — einfach **einen** Block kopieren und in die Bild-KI einfügen. Ergebnis ablegen als
`banner-modell.png` bzw. `banner-markt.png` (je **1200×400**) → erscheint automatisch.

**banner-modell.png**  *(linke Karte — „Pipeline / Knotenkette")*

```text
Slim horizontal banner image, 1200x400, in a restrained steampunk style (leaning steampunk but not full — still clean and modern). Dark cosmic charcoal background (#0c0f12) with a faint teal nebula. A left-to-right arcane assembly line / pipeline of glowing teal-cyan (#36d6c3) energy nodes linked by light edges and slim weathered-brass pipes, with small gears and riveted copper plates between the four stages (idea, build, check, observe). One faint red intruder node off to the side. Warm golden inner glow behind the teal accents, soft cyan bloom, cinematic depth. Cohesive with a glowing teal-keyed steampunk treasure chest. No text, no logos, no watermark.
```

**banner-markt.png**  *(rechte Karte — „Schaufenster / Andocken")*

```text
Slim horizontal banner image, 1200x400, in a restrained steampunk style (leaning steampunk but not full — still clean and modern). Dark cosmic charcoal background (#0c0f12) with a faint teal nebula. A marketplace of small brass-framed display cases and glass lanterns floating and docking together via glowing teal-cyan (#36d6c3) cables and copper pipes, each with a warm golden light glowing inside behind the teal accent, conveying live endpoints linking up. A few small gears and rivets. Soft cyan bloom, cinematic depth. Cohesive with a glowing teal-keyed steampunk treasure chest. No text, no logos, no watermark.
```

**icon-192.png**
`App icon on deep charcoal rounded-square background, a single minimalist mark: a
glowing teal hexagon node with three small linked dots forming a tiny network
inside, crisp, centered, premium, no text, no letters, no watermark, 512x512
(also export 192x192).`
