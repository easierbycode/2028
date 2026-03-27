#!/bin/bash
# Symlink game assets into Fresh's static/ directory for serving
# Run from the deno-fresh/ directory

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STATIC="$SCRIPT_DIR/static"
ROOT="$SCRIPT_DIR/.."

# Game source and assets (symlinks so they stay in sync)
ln -sfn "$ROOT/src" "$STATIC/src"
ln -sfn "$ROOT/assets" "$STATIC/assets"
ln -sfn "$ROOT/lib" "$STATIC/lib"
ln -sfn "$ROOT/icons" "$STATIC/icons"
ln -sfn "$ROOT/manifest.json" "$STATIC/manifest.json"
ln -sfn "$ROOT/favicon.ico" "$STATIC/favicon.ico"
ln -sfn "$ROOT/level-editor.html" "$STATIC/level-editor.html"
ln -sfn "$ROOT/support.html" "$STATIC/support.html"

echo "Static symlinks created."
