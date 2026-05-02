#!/usr/bin/env bash
set -euo pipefail

resolve_q_bin() {
  if [[ -n "${Q_BIN:-}" ]]; then
    if [[ -x "${Q_BIN}" ]]; then
      printf '%s\n' "${Q_BIN}"
      return 0
    fi

    echo "Q_BIN is set but is not executable: ${Q_BIN}" >&2
    return 1
  fi

  if command -v q >/dev/null 2>&1; then
    command -v q
    return 0
  fi

  local candidates=(
    "$HOME/.kx/bin/q"
    "$HOME/q/m64/q"
    "$HOME/q/l64/q"
    "$HOME/Downloads/m64/m64/q"
  )

  local candidate
  for candidate in "${candidates[@]}"; do
    if [[ -x "${candidate}" ]]; then
      printf '%s\n' "${candidate}"
      return 0
    fi
  done

  return 1
}

infer_qhome() {
  local q_bin="$1"
  local arch_dir
  arch_dir="$(dirname "${q_bin}")"

  case "$(basename "${arch_dir}")" in
    l64|l64arm|m64|w64|l32|m32|w32)
      dirname "${arch_dir}"
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

configure_q_env() {
  local q_bin="$1"
  local inferred_qhome=""

  if [[ -z "${QHOME:-}" ]]; then
    if inferred_qhome="$(infer_qhome "${q_bin}")"; then
      export QHOME="${inferred_qhome}"
    fi
  fi

  if [[ -z "${QLIC:-}" && -n "${QHOME:-}" ]]; then
    if [[ -f "${QHOME}/kc.lic" || -f "${QHOME}/k4.lic" ]]; then
      export QLIC="${QHOME}"
    fi
  fi
}

probe_q_runtime() {
  local q_bin="$1"

  if printf '\\\\\n' | "${q_bin}" >/tmp/kdb-dashboard-library-q-probe.log 2>&1; then
    return 0
  fi

  return 1
}

print_q_help() {
  cat >&2 <<'EOF'
Unable to find a usable q runtime.

Supported discovery order:
1. Q_BIN
2. q on PATH
3. ~/.kx/bin/q
4. ~/q/m64/q
5. ~/q/l64/q

You can also point the repo at a specific binary:
Q_BIN=/absolute/path/to/q pnpm dev:gateway

If q is installed but the license has expired, run:
pnpm q:doctor
EOF
}

print_q_probe_failure() {
  local probe_log="/tmp/kdb-dashboard-library-q-probe.log"

  if [[ -f "${probe_log}" ]]; then
    cat "${probe_log}" >&2
  fi

  if [[ -f "${probe_log}" ]] && grep -q "license error: exp" "${probe_log}"; then
    cat >&2 <<'EOF'

Detected an expired q license.
Refresh your `kc.lic` or install KDB-X Community Edition, then try again.
EOF
    return
  fi

  if [[ -f "${probe_log}" ]] && grep -q "couldn't connect to license daemon" "${probe_log}"; then
    cat >&2 <<'EOF'

Detected an on-demand license that could not reach the KX license service.
Confirm this machine has outbound network access for the q runtime, then try again.
EOF
  fi
}
