#!/usr/bin/env bash
set -euo pipefail

# End-to-end bootstrap for Apple Silicon text-to-video workflow.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
VENV_DIR="${REPO_ROOT}/.venv-t2v"
STATE_DIR="${REPO_ROOT}/.t2v"
LOCK_FILE="${STATE_DIR}/requirements.lock.txt"
LOG_FILE="${STATE_DIR}/setup.log"

MIN_DISK_GB="${MIN_DISK_GB:-80}"
MIN_MEM_GB="${MIN_MEM_GB:-8}"
PYTHON_FALLBACK_MIN="3.11"

DISTILLED_MODEL_REPO="${DISTILLED_MODEL_REPO:-dgrauet/ltx-2.3-mlx-distilled-q4}"
UNIFIED_MODEL_REPO="${UNIFIED_MODEL_REPO:-notapalindrome/ltx2-mlx-av}"

info() { echo "[INFO] $*"; }
warn() { echo "[WARN] $*"; }
fail() { echo "[ERROR] $*" >&2; exit 1; }
have_cmd() { command -v "$1" >/dev/null 2>&1; }

setup_logging() {
  mkdir -p "${STATE_DIR}"
  exec > >(tee -a "${LOG_FILE}") 2>&1
}

version_ge() {
  # Compare dotted versions using sort -V
  [ "$(printf '%s\n' "$1" "$2" | sort -V | head -n1)" = "$2" ]
}

require_macos_arm64() {
  info "Running platform checks"
  [[ "$(uname -s)" = "Darwin" ]] || fail "This script supports macOS only."
  [[ "$(uname -m)" = "arm64" ]] || fail "This script requires Apple Silicon (arm64)."
}

check_resources() {
  local free_kb free_gb mem_bytes mem_gb
  free_kb="$(df -Pk "${REPO_ROOT}" | awk 'NR==2 {print $4}')"
  free_gb="$((free_kb / 1024 / 1024))"
  mem_bytes="$(sysctl -n hw.memsize)"
  mem_gb="$((mem_bytes / 1024 / 1024 / 1024))"

  info "Free disk in repo volume: ${free_gb} GB"
  info "System memory: ${mem_gb} GB"

  if (( free_gb < MIN_DISK_GB )); then
    warn "Recommended free disk is >= ${MIN_DISK_GB} GB for dual-model setup."
  fi
  if (( mem_gb < MIN_MEM_GB )); then
    warn "Recommended memory is >= ${MIN_MEM_GB} GB."
  fi
}

install_homebrew_if_missing() {
  if have_cmd brew; then
    info "Homebrew already installed"
    return
  fi

  info "Installing Homebrew (may prompt for password)"
  NONINTERACTIVE=1 /bin/bash -c \
    "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

  if [[ -x /opt/homebrew/bin/brew ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi

  have_cmd brew || fail "Homebrew installation failed."
}

brew_install_if_missing() {
  local cmd_name="$1"
  local formula="$2"
  if have_cmd "${cmd_name}"; then
    info "${cmd_name} already installed"
    return
  fi
  info "Installing ${formula} via Homebrew"
  brew install "${formula}"
}

resolve_python_bin() {
  local py_bin=""

  if have_cmd python3.12; then
    py_bin="$(command -v python3.12)"
  elif have_cmd python3; then
    local py_ver
    py_ver="$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')"
    if version_ge "${py_ver}" "${PYTHON_FALLBACK_MIN}"; then
      py_bin="$(command -v python3)"
    fi
  fi

  if [[ -z "${py_bin}" ]]; then
    fail "No suitable Python found. Expected python3.12 or python3 >= ${PYTHON_FALLBACK_MIN}."
  fi
  echo "${py_bin}"
}

setup_virtualenv() {
  local py_bin="$1"
  if [[ ! -d "${VENV_DIR}" ]]; then
    info "Creating virtual environment at ${VENV_DIR}"
    "${py_bin}" -m venv "${VENV_DIR}"
  else
    info "Virtual environment already exists at ${VENV_DIR}"
  fi
}

venv_python() {
  echo "${VENV_DIR}/bin/python"
}

venv_pip() {
  echo "${VENV_DIR}/bin/pip"
}

install_python_packages() {
  local pip_bin
  pip_bin="$(venv_pip)"
  info "Upgrading pip tooling"
  "${pip_bin}" install --upgrade pip setuptools wheel
  info "Installing runtime packages"
  "${pip_bin}" install \
    mlx \
    mlx-video-with-audio \
    huggingface_hub \
    safetensors \
    transformers \
    numpy \
    tqdm \
    opencv-python \
    soundfile
  "${pip_bin}" freeze > "${LOCK_FILE}"
  info "Wrote lock file: ${LOCK_FILE}"
}

prefetch_models() {
  local py_bin model_mode="$1"
  py_bin="$(venv_python)"

  info "Prefetching models (mode: ${model_mode})"
  "${py_bin}" - <<PY
from huggingface_hub import snapshot_download

distilled = "${DISTILLED_MODEL_REPO}"
unified = "${UNIFIED_MODEL_REPO}"
mode = "${model_mode}"

targets = []
if mode in ("distilled", "all"):
    targets.append(distilled)
if mode in ("unified", "all"):
    targets.append(unified)

for repo in targets:
    print(f"[INFO] Downloading {repo} (resume enabled)")
    path = snapshot_download(repo_id=repo, resume_download=True)
    print(f"[INFO] Cached at: {path}")
PY
}

run_smoke_test() {
  info "Running CLI doctor smoke test"
  "${REPO_ROOT}/scripts/t2v_cli.sh" doctor
}

print_next_steps() {
  cat <<EOF

[DONE] Setup complete.

Next steps:
  1) Download both model sets (large downloads):
     ${REPO_ROOT}/scripts/t2v_cli.sh download-models --all

  2) Generate a quick vertical test clip:
     ${REPO_ROOT}/scripts/t2v_cli.sh generate --prompt "A cinematic vertical ocean sunset"

Recommended presets:
  - 8GB mode: 512x896, 49 frames, tiling aggressive
  - 16GB mode: 576x1024, 65 frames, tiling aggressive
EOF
}

main() {
  local prefetch_mode="${1:-none}"
  setup_logging

  require_macos_arm64
  check_resources

  install_homebrew_if_missing
  brew_install_if_missing ffmpeg ffmpeg
  brew_install_if_missing python3.12 python@3.12
  brew_install_if_missing uv uv

  local py_bin
  py_bin="$(resolve_python_bin)"
  info "Using Python interpreter: ${py_bin}"
  setup_virtualenv "${py_bin}"
  install_python_packages

  if [[ "${prefetch_mode}" != "none" ]]; then
    prefetch_models "${prefetch_mode}"
  else
    info "Skipping model prefetch (pass: distilled|unified|all)"
  fi

  run_smoke_test
  print_next_steps
}

if [[ "${1:-}" = "-h" || "${1:-}" = "--help" ]]; then
  cat <<'EOF'
Usage: scripts/setup_t2v.sh [none|distilled|unified|all]

Arguments:
  none       Provision dependencies and environment only (default)
  distilled  Also prefetch distilled model
  unified    Also prefetch unified model
  all        Prefetch both model variants
EOF
  exit 0
fi

main "${1:-none}"
