# Bild-Plätze (assets/img/) — von Klaus generiert, von der Seite eingebunden

Diese Bilder sind **progressive enhancement**: Die Seite funktioniert und sieht
auch **ohne** sie fertig aus (CSS-Gradient-Fallback). Sobald eine Datei mit dem
genannten Namen hier liegt, erscheint sie automatisch — kein Code-Änderung nötig.

> **⚠ Ausgeliefert wird WebP, nicht PNG (2026-08-06).** Die drei Banner lagen als
> PNG mit rund **1 MB pro Stück** hier — zusammen 3 MB, das waren **90 % der
> ganzen Startseite**, für reine Dekoration. Gemessen kostete das **18,9 s**
> Ladezeit. Wer ein Banner ersetzt, legt es bitte als **`.webp`, höchstens
> 900 px breit** ab (das reicht: dargestellt werden sie nur 180–260 px hoch mit
> `object-fit: contain`). Eine KI liefert meist PNG — dann einmal umrechnen,
> nicht ungeprüft ablegen. Erwartete Größe: **40–70 KiB**, nicht 1000.

**Regeln (Verfassung):** eigene, neutrale Identität — **keine** fremden Logos,
Marken, Wasserzeichen oder reproduzierten Vorlagen. Dunkler Hintergrund, kühles
Teal (`#36d6c3`) als Akzent. PNG mit transparentem oder sehr dunklem Grund.
Offline — Dateien liegen lokal im Repo, keine externen Links.

| Datei | Wo | Format / Größe | Zweck |
|---|---|---|---|
| `ambient.png` | alle Seiten (fixer Hintergrund) | quer, ~2000×1400, dunkel | ruhige Tiefen-Textur hinter allem |
| `hero.png` | Startseite (Hero-Backdrop) | quer, ~1600×900 | optionaler Hintergrund hinter dem Titel (Fallback: nur Glow) |
| `banner-modell.webp` | Modell-Kopf + **Start-Karte 1 (links)** | quer, **900×300**, ≤70 KiB | Motiv „Pipeline / Knotenkette" |
| `banner-werkzeuge.webp` | Werkzeuge-Kopf + **Start-Karte 2 (Mitte) = Werkzeugkiste-Knopf** | quer, **900×600**, ≤70 KiB | Motiv „Werkzeug-Truhe / Werkbank" |
| `banner-markt.webp` | Markt-Kopf + Start-Karte 3 | quer, **900×300**, ≤70 KiB | Motiv „Schaufenster / Andocken" |
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

### Die drei Karten-Banner — Modell (links) · Werkzeugkiste/Truhe (Mitte) · Markt (rechts)

Alle drei im **gleichen** Stil (restrained Steampunk, Teal #36d6c3 + warmes Gold, dunkler
Kosmos), vollständig ausformuliert. Jeder Prompt ist eigenständig (Stil schon eingebaut) —
einfach **einen** Block kopieren. Alle als **Querformat 1200×400** generieren → erscheinen
automatisch oben auf der jeweiligen Start-Karte (und im Seitenkopf).

**banner-werkzeuge.webp**  *(mittlere Karte — „Werkzeugkiste", die Truhe)*

```text
Ultra-detailed wide cinematic banner illustration, 1200x400 pixels, 3:1 panoramic aspect ratio, in a refined and restrained steampunk style — leaning toward steampunk but not fully, kept clean, modern and elegant. Subject: a single ornate steampunk treasure chest as the centerpiece, made of dark weathered oak bound with aged brass and oxidized copper fittings, riveted corner braces, a domed lid and a large ornate central lock; a single glowing teal-cyan key (primary accent color #36d6c3) sits in the keyhole casting bright cyan light, while a warm golden glow seeps from the seams of the lid as if treasure inside is shining out; a few slim brass pipes and small gears flank it subtly. Materials and surfaces: rich grain on aged wood, brass and copper with realistic patina, brushed and hammered metal, tiny rivets, fine scratches and honest wear, all rendered with physically based materials and micro-detail. Lighting: a cool teal-cyan glow as the primary living energy light radiating from the key and lock, plus a secondary warm golden inner glow from the chest seams; crisp specular highlights and mirror-like reflections across metal, bright rim lighting along the edges, subtle ray-traced reflections, soft volumetric light rays and god-rays drifting through faint mist, gentle lens bloom, glints and light caustics on the brass. Depth and dimensionality: a strong three-dimensional effect, the chest in sharp focus with shallow depth of field and soft bokeh, realistic soft cast shadow grounding it, gentle ambient occlusion, atmospheric haze for added depth. Background: deep dark cosmic charcoal (#0c0f12) with a faint teal nebula and a sparse scatter of tiny glowing particles and dust motes, generous negative space. Mood: premium, mysterious, inviting, like a vault of tools waiting to be opened. Render quality: hyper-detailed, 8k, octane and unreal-engine style cinematic render, high dynamic range, crisp, photoreal-stylized. Negative: no text, no letters, no numbers, no logos, no watermark, no signature, no people, no faces, no frame, no border.
```

**banner-modell.webp**  *(linke Karte — „Pipeline / Knotenkette")*

```text
Ultra-detailed wide cinematic banner illustration, 1200x400 pixels, 3:1 panoramic aspect ratio, in a refined and restrained steampunk style — leaning toward steampunk but not fully, kept clean, modern and elegant. Subject: a horizontal left-to-right arcane assembly line and processing pipeline that visualises four stages — idea, build, check, observe — as glowing teal-cyan energy nodes (primary accent color #36d6c3) connected by luminous flowing light edges and slim weathered-brass and copper pipes, with small intricate gears, cogwheels, valves and riveted metal plates between the stages; one faint, ominous, dim red intruder node sits slightly off to the side, out of place. Materials and surfaces: aged brass and oxidized copper with realistic patina, brushed and hammered metal, tiny rivets, fine scratches and honest wear, polished glass tubes carrying glowing liquid light, all rendered with physically based materials and micro-detail. Lighting: a cool teal-cyan glow as the primary living energy light, plus a secondary warm golden inner glow radiating from within the nodes and pipes, echoing a glowing teal-keyed steampunk treasure chest; crisp specular highlights and mirror-like reflections across metal and glass, bright rim lighting along the edges, subtle ray-traced reflections and refractions, soft volumetric light rays and god-rays drifting through faint mist, gentle lens bloom, glints and light caustics. Depth and dimensionality: a strong three-dimensional effect, foreground elements in sharp focus with shallow depth of field and soft bokeh falling off into the background, layered parallax, realistic soft cast shadows and ambient occlusion grounding every object, atmospheric haze for added depth. Background: deep dark cosmic charcoal (#0c0f12) with a faint teal nebula and a sparse scatter of tiny glowing particles and dust motes, generous negative space, uncluttered. Mood: premium, mysterious, high-tech-meets-antique, calm yet powerful. Render quality: hyper-detailed, 8k, octane and unreal-engine style cinematic render, high dynamic range, crisp, photoreal-stylized. Negative: no text, no letters, no numbers, no logos, no watermark, no signature, no people, no faces, no frame, no border.
```

**banner-markt.webp**  *(rechte Karte — „Schaufenster / Andocken")*

```text
Ultra-detailed wide cinematic banner illustration, 1200x400 pixels, 3:1 panoramic aspect ratio, in a refined and restrained steampunk style — leaning toward steampunk but not fully, kept clean, modern and elegant. Subject: an arcane marketplace of small brass-framed display cases, glass showcase domes and ornate hanging lanterns floating and docking together, connected via glowing teal-cyan cables and copper pipes (primary accent color #36d6c3), conveying live endpoints linking up and trading; each case holds a warm golden light glowing softly inside behind the teal accent, like little treasures on offer. Materials and surfaces: aged brass and oxidized copper with realistic patina, brushed and hammered metal, tiny rivets, fine scratches and honest wear, beveled polished glass with subtle reflections and refractions, a few small gears, cogwheels and valves, all rendered with physically based materials and micro-detail. Lighting: a cool teal-cyan glow as the primary living energy light, plus a secondary warm golden inner glow radiating from inside the cases, echoing a glowing teal-keyed steampunk treasure chest; crisp specular highlights and mirror-like reflections across metal and glass, bright rim lighting along the edges, subtle ray-traced reflections, soft volumetric light rays and god-rays drifting through faint mist, gentle lens bloom, glints and light caustics on the glass. Depth and dimensionality: a strong three-dimensional effect, foreground cases in sharp focus with shallow depth of field and soft bokeh falling off into the background, layered floating parallax, realistic soft cast shadows and ambient occlusion grounding every object, atmospheric haze for added depth. Background: deep dark cosmic charcoal (#0c0f12) with a faint teal nebula and a sparse scatter of tiny glowing particles and dust motes, generous negative space, uncluttered. Mood: premium, inviting, high-tech-meets-antique bazaar, calm and wondrous. Render quality: hyper-detailed, 8k, octane and unreal-engine style cinematic render, high dynamic range, crisp, photoreal-stylized. Negative: no text, no letters, no numbers, no logos, no watermark, no signature, no people, no faces, no frame, no border.
```

**icon-192.png**
`App icon on deep charcoal rounded-square background, a single minimalist mark: a
glowing teal hexagon node with three small linked dots forming a tiny network
inside, crisp, centered, premium, no text, no letters, no watermark, 512x512
(also export 192x192).`
