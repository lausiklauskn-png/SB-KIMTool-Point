# SBKIM — GENERALPROBE-PLAN (netzweit) — „der große Re-Sync"

Stand: 2026-06-06 · Geschrieben von SB·KIMTool·Point (Knoten A), gilt **für alle Knoten**.
Quelle (raw/main): `…/SB-KIMTool-Point/main/sbkim/GENERALPROBE.md`.

> **Zweck:** Klaus' Plan für die spätere, **systematische** Neu-Synchronisation des ganzen
> SBKIM-Netzes festhalten — damit jeder Knoten **vorab weiß, was auf ihn zukommt**, und der
> große Tag einfacher wird. Diese Datei ist eine **Vorausschau/Absichtserklärung**, kein
> sofortiger Auftrag.

---

## 1. Was wir bis jetzt gemacht haben = Testlauf / Lernphase

Alles, was im Netz bisher passiert ist (Sage-Andock, Jasons-Tresor, Mein-Tresor, die Postfächer,
SIGNAL.json/§11.6, Lampen/Siegel, der Lampen-Ehrlichkeits-Fix, die Verfahrens-Erklärungen), ist
ausdrücklich ein **Testlauf und eine Lernphase**. Hier werden die **grundlegenden Regeln** des
SBKIM-Protokolls erprobt und **kleine Fehler ausgebessert** (z. B. der flaky-Test von
Jasons-Tresor, das Fehl-Grün der Lampen, die vage Schlüssel-Doku). Diese Erkenntnisse fließen in
die Verträge ein, **bevor** der große Re-Sync läuft.

## 2. Der Plan: die Generalprobe — „von links nach rechts", an einem Tag

Sobald die grundlegenden Regeln/Dinge **feststehen**, wird **das ganze Netz neu und sauber über
das Browser-Tool verbunden** — systematisch, Stück für Stück, idealerweise an **einem Tag**:

1. **Sage-Protokoll ist der Anker** („ganz links"). Dort wird alles konzentriert/koordiniert.
2. **Jede einzelne Page / PWA / jedes Tool** bekommt der Reihe nach **eine NEUE Identität +
   eine NEUE Spore + einen NEUEN Knoten** — über die **Browser-Identität** (Weg B, s.
   `docs/SCHLUESSEL.md`).
3. Pro Tool der volle, echte Ablauf **über die Tools**: neue Identität (Modul 02) → neue Spore
   signieren → veröffentlichen → **Embedding** (Modul 03, echter `domainVector`) → **Match**
   (Modul 04) → **Handshake/Anastomose** (Modul 05) → reziproke Verifikation → Registrierung
   (`verified-spore` → `verified-match`) → Briefkasten-Sync (§11.6).
4. So wandert man **von links nach rechts** durch alle Knoten, bis das ganze Netz **frisch und
   einheitlich** verbunden ist.

**Das ist die Generalprobe:** der erste Durchlauf, bei dem **alles über die echten Browser-Tools
läuft** (nicht headless, nicht teil-gestubt) — genau das wollen wir dann live sehen.

## 3. Warum das (relativ) einfach wird

- Die **Andock-Tools sind in den meisten Knoten dann schon vorhanden** (Modul 01/02 eingebettet,
  `make_node_key`/`generate_spore`/`verify_foreign_spore`, Siegel/Lampen, 📬-Briefkasten). Beim
  großen Tag werden sie **nur noch benutzt**, um pro Tool eine neue Spore/Identität/Embedding +
  einen neuen Handshake zu starten — nicht neu gebaut.
- Die **Verfahren stehen dann fest** (kanonische Form, 9 Pflichtfelder, SBKIM-SYNC-VEREINBARUNG
  v1, Embedding `e5-small`/384/Cosine≥0.80). Siehe `sbkim/AUSTAUSCH-MeinTresor.md`.

## 4. Offene Entscheidung (bewusst noch nicht festgelegt)

- **„Alles über den Browser?"** Tendenz: ja — die neuen Identitäten entstehen über die
  **Browser-Identität** (Schlüssel bleibt im Browser, kein Passwort nötig zum Erzeugen). Die
  headless-Tresor-Variante (Weg A) bleibt für Knoten ohne Browser-Umgebung möglich.
- Der genaue Reihenfolge-Fahrplan (welche PWA wann), Namens-/Knoten-Konvention für die „neue
  Generation" und ob alte nodeIds als `previousNodeIds` archiviert werden, wird **vor** dem Tag
  in einer eigenen Spec-Runde festgezurrt (Spec vor Code).

## 5. Was jeder Knoten JETZT schon tun kann (Vorbereitung, kein Muss)

- Diese Datei lesen und wissen: **es kommt noch eine komplette Identitäts-Anpassung.** Was ihr
  heute baut, ist Lernphase — saubere Tools/Verfahren sind wichtiger als „endgültige" Identitäten.
- Sicherstellen, dass eure **Browser-Identitäts-Tools** (Modul 01+02, Spore/Embedding/Match,
  Handshake, Siegel) vorhanden und 1:1 vom jeweiligen `main` aktuell sind.
- Eure Spore/Identität ruhig schon anlegen (für den Testlauf), aber im Hinterkopf behalten: beim
  großen Re-Sync wird **neu** signiert.

---

**Kurz:** Heute = Generalprobe-Vorbereitung + Fehler ausbügeln. Später = ein Tag, an dem von Sage
„nach rechts" jedes Tool über die Browser-Tools eine **neue** Identität/Spore/Handshake bekommt und
das ganze Netz frisch verbunden wird. Jeder weiß jetzt, was kommt.

— Knoten A, SB·KIMTool·Point.
