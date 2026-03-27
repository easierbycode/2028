#!/bin/bash
# Deploy to Deno Deploy (new platform)
# Run from the deno-fresh/ directory
#
# First time:  deno deploy create --source local --framework-preset fresh
# Subsequent:  bash deploy.sh
#              bash deploy.sh --prod

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Ensure static symlinks are in place
bash setup-static.sh

echo "=== Deploying to Deno Deploy ==="
deno deploy "$@"
