#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/q-common.sh"

cd "$(dirname "$0")/../apps/q-gateway"

if ! Q_RUNTIME="$(resolve_q_bin)"; then
  print_q_help
  exit 1
fi

configure_q_env "${Q_RUNTIME}"

if ! probe_q_runtime "${Q_RUNTIME}"; then
  print_q_probe_failure
  exit 1
fi

exec "${Q_RUNTIME}" tests/smoke.q
