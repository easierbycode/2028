#!/bin/bash
# Build macOS executables using Deno 2.7 compile
# Run from the deno-fresh/ directory
# Requires: deno >= 2.7

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Ensure static symlinks are in place
bash setup-static.sh

mkdir -p dist

echo "=== Building macOS (Apple Silicon) ==="
deno compile \
  --target aarch64-apple-darwin \
  --allow-net --allow-read --allow-env \
  --include static/ \
  --include routes/ \
  --output dist/2028ai-mac \
  main.ts

echo "=== Building macOS (Intel) ==="
deno compile \
  --target x86_64-apple-darwin \
  --allow-net --allow-read --allow-env \
  --include static/ \
  --include routes/ \
  --output dist/2028ai-mac-intel \
  main.ts

echo ""
echo "Build complete!"
echo "  Apple Silicon: dist/2028ai-mac"
echo "  Intel:         dist/2028ai-mac-intel"
echo ""
echo "Run with: ./dist/2028ai-mac"
echo "Then open http://localhost:8000"
