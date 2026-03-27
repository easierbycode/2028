# Sync Report: 2019-es7 → 2028 (including PS2 build)
**Date:** 2026-03-25 (auto-updated)
**2019-es7 HEAD:** `4c637d8` (Mar 25 — "Use Orbitron font and all-caps for Special Thanks text")
**2028 HEAD:** `107b547` (Mar 23 — "rename cagage → spgage in level data and Firebase RTDB")
**Commits ahead in 2019-es7:** ~15 since last sync

## Overview

Compared recent changes between the `2019-es7` and `2028` repositories across three areas: Phaser source (`src/phaser/`), shared modules (`src/shared/`), and the PS2 build (`src/ps2/`). Also checked HTML entry points and editor tools.

---

## Shared Modules: FULLY SYNCED

All 9 shared files (constants.js, globals.js, soundManager.js, haptics.js, gameState.js, firebaseScores.js, highScoreUi.js, and both enum files) are byte-identical between repos. The only structural difference is the expected path reorganization (`src/` → `src/shared/`).

---

## Changes in 2019-es7 NOT YET in 2028

### 1. Special Thanks Credit — Phaser StaffRollPanel.js
**Priority: Medium**

2019-es7 added "SPECIAL THANKS / SEAMUS MCNAMARA" text (Orbitron font, all-caps, black stroke, 4x resolution) to the staff roll panel at lines 66–73. This is missing from 2028's `src/phaser/StaffRollPanel.js`.

**Lines to add (before `this.setSize(...)`):**
```js
var thanksLabelStyle = { fontSize: "8px", fontFamily: "Orbitron, Arial", fill: "#ffff00", align: "center", stroke: "#000000", strokeThickness: 2, resolution: 4 };
var thanksNameStyle = { fontSize: "7px", fontFamily: "Orbitron, Arial", fill: "#ffffff", align: "center", stroke: "#000000", strokeThickness: 2, resolution: 4 };
this.thanksLabel = scene.add.text(this.GCX, 393, "SPECIAL THANKS", thanksLabelStyle);
this.thanksLabel.setOrigin(0.5, 0);
this.add(this.thanksLabel);
this.thanksName = scene.add.text(this.GCX, 405, "SEAMUS MCNAMARA", thanksNameStyle);
this.thanksName.setOrigin(0.5, 0);
this.add(this.thanksName);
```

### 2. ContinueScene Score Sync Color Optimization
**Priority: Low**

2019-es7 added a conditional guard to avoid redundant `setColor()` calls:
```js
// 2019-es7 (optimized)
var syncColor = "#" + syncTint.toString(16).padStart(6, "0");
if (this.scoreSyncText.style.color !== syncColor) {
    this.scoreSyncText.setColor(syncColor);
}

// 2028 (current — always calls setColor)
this.scoreSyncText.setColor("#" + syncTint.toString(16).padStart(6, "0"));
```

### 3. PS2 Build: Special Thanks in Ending Scene
**Priority: Medium**

`src/ps2/scene_ending.js` in 2019-es7 includes "SPECIAL THANKS" and "Seamus McNamara" in the credits array. This is missing from 2028's version.

**Lines to add to credits array (before "THANK YOU FOR PLAYING!"):**
```js
"SPECIAL THANKS",
"Seamus McNamara",
"",
```

### 4. PS2 Build: Turbo Mode Activation via SELECT at Title Screen
**Priority: High**

2019-es7's `src/ps2/scene_title.js` includes SELECT button handling to activate turbo mode and a "SELECT = TURBO MODE" label. Both are missing from 2028.

**Missing in scene_title.js:**
- SELECT button check to set `gameState.turboMode = 1` and trigger scene transition
- `fontPrint()` call to display "SELECT = TURBO MODE" hint text

### 5. PS2 Build: Turbo Mode State Reset in scenes.js
**Priority: High (paired with #4)**

2019-es7's `src/ps2/scenes.js` includes `gameState.turboMode = 0;` during scene initialization reset. Missing from 2028.

### 6. Level Editor — Missing Textures Panel & Atlas Upload
**Priority: Low**

2019-es7's `level-editor.html` added significant editor features not in 2028:
- Missing textures panel with CSS classes (`.missing-tex-row`, `.missing-tex-preview`, `.missing-tex-name`, `.missing-tex-upload`)
- Inline texture upload and repack flow
- Atlas upload to missing texture panel
- `title_bg.jpg` upload functionality
- Fix for bottom toolbar clipping when buttons wrap to two rows
- Orbitron font for button styles

These were added in commits `391fe75`, `97d8de8`, `f5e5774`, `19a37e7`, `25b7b2e`, `46c6f7b` (Mar 23).

### 7. GameScene bossDie — Shadow/Balloon Visibility
**Priority: Medium**

2019-es7 commit `79bdc3b` updated the `bossDie` function to manage visibility of shadow and danger balloon during the KO finish sequence. Status in 2028 should be verified.

---

## Changes in 2028 NOT in 2019-es7

These are features that 2028 has added independently — noted for awareness.

### A. Score Text Animation (updateScoreText)
2028's Phaser code added `updateScoreText()` to GameScene.js and HUD.js, with calls from Enemy.js and Boss.js. This tweens score digits (scale 1.2→1, blue→white tint, 200ms, 2 repeats) when score changes. Not present in 2019-es7's Phaser code.

### B. Level Data Rename: cagage → spgage
2028 renamed `cagage` to `spgage` in `level_2028.json` (and Firebase RTDB per commit message). 2019-es7 still uses the old `cagage` key.

---

## PS2 Build Deploy Status

The `src/ps2/deploy/build/main.js` differs between repos, indicating the PS2 build artifact in 2028 does not reflect the latest source changes from 2019-es7. A rebuild will be needed after syncing.

---

## Summary Table

| Feature | Phaser (2028) | PS2 (2028) | Action Needed |
|---|---|---|---|
| Special Thanks credit | MISSING | MISSING | Sync from 2019-es7 |
| ContinueScene color opt | MISSING | N/A | Sync from 2019-es7 |
| Turbo mode (title/game) | N/A (PS2-only) | MISSING | Sync from 2019-es7 |
| Turbo mode state reset | N/A (PS2-only) | MISSING | Sync from 2019-es7 |
| Level editor features | MISSING | N/A | Sync from 2019-es7 |
| bossDie shadow/balloon | Verify | N/A | Verify & sync if needed |
| Score text animation | Present | Not ported | Consider porting to PS2 |
| cagage→spgage rename | Present | Present | Consider back-porting to 2019-es7 |

---

## ⚠️ Sync Warning

Running `copyto2028.sh` will overwrite 2028-specific changes:
- `updateScoreText()` score animation (GameScene, HUD, Enemy, Boss)
- `index.html` consolidation (2028 uses `index.html`, not `phaser-game.html`)
- `spgage` rename (would revert to `cagage`)
- Electron app naming ("game" vs "phaser-game")

**Recommendation:** Either backport 2028-specific changes to 2019-es7 first, then run the script — or manually cherry-pick only the missing features listed above.
