#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../apps/q-gateway"
PORT="${Q_PORT:-5050}"

if ! command -v q >/dev/null 2>&1; then
  echo "q was not found on PATH. Install kdb+/q, then run this command again." >&2
  exit 1
fi

exec q src/main.q -port "$PORT"
