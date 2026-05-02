#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../apps/q-gateway"

if ! command -v q >/dev/null 2>&1; then
  echo "q was not found on PATH. Skipping q smoke tests." >&2
  exit 1
fi

exec q tests/smoke.q
