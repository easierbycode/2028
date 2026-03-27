# Sync Report: 2019-es7 → 2028 (2026-03-27)

**2019-es7 HEAD:** `e462980` (Rename cyber-liberty.png with cyber_liberty.png)
**2028 HEAD:** `15e0942` (gold - title_bg.jpg update)
**Previous sync baseline:** `60ee083` / `107b547` (2026-03-26)

## New commits in 2019-es7 since last sync (10 commits)

| Commit | Description | PS2 relevant? |
|--------|-------------|---------------|
| `e462980` | Rename cyber-liberty.png → cyber_liberty.png | **Yes** |
| `96a711f` | PS2 game state refactor + pause menu | **Yes (major)** |
| `329fd24` | Mobile fallback for Load Game Directory | No (level-editor only) |
| `f2da8ba` | Save bossData to Firebase | **Yes** (main.js + BootScene.js) |
| `2c5eed2` | Fix File System Access API write permission | No (level-editor only) |
| `5c414f3` | Skip underscore-prefixed anim keys | No (level-editor/viewer only) |

## Missing in 2028 — HIGH priority

### 1. PS2 Pause Menu (from `96a711f`)
**Files:** `game_state.js`, `input.js`, `scene_game.js`, `scenes.js`, `timer.js`, `tween.js`

The old pause was a simple toggle overlay. The new version adds:
- `pauseCursor` state in `game_state.js`
- `isUpPressed()` / `isDownPressed()` functions in `input.js`
- Full pause menu with Resume/Quit options in `scene_game.js` (`updatePauseMenu()`, `drawPauseMenu()`)
- Timer and tween pause support (`timersPaused` in `timer.js`, `tweensPaused` in `tween.js`)
- Proper pause state reset in `initGameScene()` in `scenes.js`

### 2. Cyber-liberty asset rename (from `e462980`)
**Files:** `assets/cyber-liberty.png` → `assets/cyber_liberty.png`, `main.js`, `deploy/build.sh`, `deploy/build/main.js`

2028 still has the old hyphenated filename `cyber-liberty.png`. The loadSpritesheet call and build script need updating.

### 3. Firebase bossData merge in PS2 main.js (from `f2da8ba`)
**File:** `main.js` (lines ~185-203 in 2019-es7)

2019-es7 added a block that merges `data.bossData` from Firebase into the recipe, tagging textures with `level_atlas`. This is absent in 2028's `main.js`.

### 4. Firebase bossData merge in BootScene.js (from `f2da8ba`)
**File:** `src/phaser/BootScene.js`

2019-es7 added ~40 lines of boss data merging logic with atlas frame validation. Missing in 2028.

## Missing in 2028 — MEDIUM priority (from prior sync, still open)

### 5. Input coordinate sync on resize (Phaser HTML)
**File:** `index.html` (2028) / `phaser-game.html` (2019-es7)

2019-es7 has `game.scale.refresh()` in the resize handler for non-rotated mode, plus `fixPhaserTransform()` which overrides `transformX/transformY` for correct hit-testing under CSS scaling. Both are absent in 2028's `index.html`.

The swapCoords function in 2019-es7 also adds `configurable: true` and sets `pageX`/`pageY` in addition to `clientX`/`clientY`.

### 6. PS2 turbo mode at title screen (still missing)
**File:** `deploy/build/main.js`

2028's built PS2 still lacks the SELECT=TURBO MODE functionality at the title screen and the `turboMode = 0` reset in scene init.

### 7. Special Thanks in staff roll (still missing)
**File:** `deploy/build/main.js`

2028's built PS2 ending credits still lack the "SPECIAL THANKS / Seamus McNamara" entry.

## 2028-only changes (not in 2019-es7)

- `updateScoreText()` animation in Phaser HUD
- `spgage` rename (cagage → spgage in level data and Firebase)
- `index.html` consolidation (replaces `phaser-game.html`)
- `15e0942`: updated `title_bg.jpg` asset

## Summary

| Priority | Item | Files affected |
|----------|------|----------------|
| **HIGH** | PS2 pause menu | 6 PS2 files |
| **HIGH** | cyber-liberty → cyber_liberty rename | asset + 3 files |
| **HIGH** | Firebase bossData merge (PS2 main.js) | 1 file |
| **HIGH** | Firebase bossData merge (BootScene.js) | 1 file |
| MEDIUM | Phaser input coord sync + fixPhaserTransform | index.html |
| MEDIUM | PS2 turbo mode at title | deploy/build/main.js |
| MEDIUM | Special Thanks in credits | deploy/build/main.js |

**Recommendation:** The pause menu refactor (#1) is the largest and most impactful change — it touches 6 files and adds a proper Resume/Quit menu with timer/tween pausing. The cyber-liberty rename (#2) is a straightforward find-and-replace but the asset file itself needs renaming. The Firebase bossData merges (#3, #4) are important for custom level support.
