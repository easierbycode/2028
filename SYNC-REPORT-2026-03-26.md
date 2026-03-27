# Sync Report: 2019-es7 → 2028 (including PS2 build)
**Date:** 2026-03-26 (automated scheduled task)
**2019-es7 HEAD:** `60ee083` — "Add skip button to missing textures panel in level editor"
**2028 HEAD:** `107b547` — "rename cagage → spgage in level data and Firebase RTDB"
**New commits in 2019-es7 since last report:** 5 (since `4c637d8`)

---

## New Changes in 2019-es7 Since Last Report (Mar 25)

### NEW 1. Right-Click to Trigger SP Attack
**Priority: High | Commits:** `1726851`, `cfd3ff9`

Two changes work together:
- `PhaserGame.js`: Added `input.mouse.preventDefaultRight: true` to game config to suppress context menu
- `Player.js` `onScreenDragStart()`: Added `pointer.rightButtonDown()` check to fire SP attack on right-click

**Status in 2028:** MISSING — Player.js has `onSpFire()` via keyboard/gamepad but no right-click trigger. PhaserGame.js lacks the `preventDefaultRight` config.

### NEW 2. Phaser Input Coordinate Sync on Resize
**Priority: High | Commit:** `cfd3ff9`

In `phaser-game.html` (→ `index.html` in 2028), the `fitCanvas()` function now calls `game.scale.refresh()` after CSS-scaling the canvas, so pointer→game-coord transforms stay correct. Skipped when CSS-rotated (handled separately by `patchCanvasInputForRotation`).

**Status in 2028:** MISSING — `index.html` `fitCanvas()` only sets CSS width/height but does not call `scale.refresh()`.

### NEW 3. Level Editor: Skip Button for Missing Textures Panel
**Priority: Low | Commit:** `60ee083`

Added a "Skip — Use Original Bosses" button alongside the "Repack Atlas" button in the missing textures overlay. The `skipMissingTextures()` function clears pending uploads and hides the overlay.

**Status in 2028:** Level editor is not in 2028 scope. No action needed.

---

## Previously Reported Items — Status Update

### 1. Special Thanks Credit — StaffRollPanel.js
**Priority: Medium | Status: Still MISSING in 2028**

2019-es7 has Orbitron-font "SPECIAL THANKS / SEAMUS MCNAMARA" text in StaffRollPanel.js (lines 66–73). Not present in 2028's StaffRollPanel.js.

### 2. ContinueScene Score Sync Color Optimization
**Priority: Low | Status: ✅ SYNCED**

Both repos now have the conditional guard (`if (this.scoreSyncText.style.color !== syncColor)`). This was resolved since the last report.

### 3. PS2: Special Thanks in Ending Scene
**Priority: Medium | Status: Still MISSING in 2028**

2019-es7's `src/ps2/scene_ending.js` has "SPECIAL THANKS" / "Seamus McNamara" in the credits array. 2028's version does not.

### 4. PS2: Turbo Mode Activation via SELECT at Title Screen
**Priority: High | Status: Still MISSING in 2028**

2019-es7's `src/ps2/scene_title.js` has:
- `isSelectPressed()` check to set `gameState.turboMode = 1` and trigger scene transition
- `fontPrint()` call to display "SELECT = TURBO MODE" hint text

2028's title scene only has the confirm (start) button handling.

### 5. PS2: Turbo Mode State Reset in scenes.js
**Priority: High | Status: ✅ SYNCED**

Both repos have `gameState.turboMode = 0;` at line 140 of scenes.js. The turbo effect state variables (`turboEffectActive`, `turboImpacts`, `turboFlashAlpha`, `turboBlackoutAlpha`) and their resets are also present in both.

### 6. Level Editor Features
**Priority: Low | Status: N/A — not in 2028 scope**

### 7. GameScene bossDie — Shadow/Balloon Visibility
**Priority: Medium | Status: Needs verification**

Not re-verified in this run. Should be checked in next sync.

---

## Changes in 2028 NOT in 2019-es7 (unchanged from last report)

### A. Score Text Animation (updateScoreText)
2028-only feature. Tweens score digits on change. Not present in 2019-es7 Phaser code.

### B. Level Data Rename: cagage → spgage
2028 renamed `cagage` to `spgage`. 2019-es7 still uses the old key.

---

## Summary: Outstanding Items to Sync

| # | Feature | Target | Priority | Status |
|---|---------|--------|----------|--------|
| 1 | Right-click SP attack | Phaser (2028) | **High** | NEW — Missing |
| 2 | Input coord sync on resize | Phaser (2028) | **High** | NEW — Missing |
| 3 | Special Thanks credit | Phaser (2028) | Medium | Still missing |
| 4 | PS2: Special Thanks in ending | PS2 (2028) | Medium | Still missing |
| 5 | PS2: Turbo Mode at title screen | PS2 (2028) | **High** | Still missing |
| 6 | ContinueScene color opt | Phaser (2028) | — | ✅ Resolved |
| 7 | PS2: turboMode reset | PS2 (2028) | — | ✅ Resolved |

**3 High-priority items** need attention. Items #1 and #2 are new since yesterday's report.

---

## Recommended Sync Actions

1. **PhaserGame.js** — Add `input: { mouse: { preventDefaultRight: true } }` to game config
2. **Player.js** — Add `rightButtonDown()` check in `onScreenDragStart()` to call `scene.onSpFire()`
3. **index.html** — Add `game.scale.refresh()` call in `fitCanvas()` after CSS sizing (skip if cssRotated)
4. **StaffRollPanel.js** — Add Special Thanks text block (Orbitron font, 4x resolution)
5. **src/ps2/scene_ending.js** — Add "SPECIAL THANKS" / "Seamus McNamara" to credits array
6. **src/ps2/scene_title.js** — Add SELECT button handling for turbo mode + hint text

## ⚠️ Sync Warning (unchanged)

Do NOT run `copyto2028.sh` — it will overwrite 2028-specific changes:
- `updateScoreText()` score animation
- `index.html` consolidation
- `spgage` rename (would revert to `cagage`)

**Manual cherry-pick of the specific changes above is recommended.**
