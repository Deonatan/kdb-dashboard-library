#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/q-common.sh"

echo "Inspecting q runtime..."

if ! Q_RUNTIME="$(resolve_q_bin)"; then
  print_q_help
  exit 1
fi

configure_q_env "${Q_RUNTIME}"

echo "q binary : ${Q_RUNTIME}"
echo "QHOME    : ${QHOME:-<unset>}"
echo "QLIC     : ${QLIC:-<unset>}"

if probe_q_runtime "${Q_RUNTIME}"; then
  echo "runtime  : ok"
  exit 0
fi

echo "runtime  : failed" >&2
print_q_probe_failure
exit 1
