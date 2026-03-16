#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
VENV_DIR="${REPO_ROOT}/.venv-t2v"
PY_BIN="${VENV_DIR}/bin/python"

DISTILLED_MODEL_REPO="${DISTILLED_MODEL_REPO:-dgrauet/ltx-2.3-mlx-distilled-q4}"
UNIFIED_MODEL_REPO="${UNIFIED_MODEL_REPO:-notapalindrome/ltx2-mlx-av}"

DEFAULT_MODEL="${DEFAULT_MODEL:-distilled}"
DEFAULT_WIDTH="${DEFAULT_WIDTH:-576}"
DEFAULT_HEIGHT="${DEFAULT_HEIGHT:-1024}"
DEFAULT_FRAMES="${DEFAULT_FRAMES:-49}"
DEFAULT_FPS="${DEFAULT_FPS:-24}"
DEFAULT_SEED="${DEFAULT_SEED:-42}"
DEFAULT_TILING="${DEFAULT_TILING:-aggressive}"
DEFAULT_OUTPUT_DIR="${DEFAULT_OUTPUT_DIR:-${REPO_ROOT}/.t2v/outputs}"

mkdir -p "${DEFAULT_OUTPUT_DIR}" "${REPO_ROOT}/.t2v"

info() { echo "[INFO] $*"; }
warn() { echo "[WARN] $*"; }
fail() { echo "[ERROR] $*" >&2; exit 1; }

have_cmd() { command -v "$1" >/dev/null 2>&1; }

require_ready_env() {
  [[ -x "${PY_BIN}" ]] || fail "Missing virtualenv python at ${PY_BIN}. Run scripts/setup_t2v.sh first."
}

model_repo_from_name() {
  case "$1" in
    distilled) echo "${DISTILLED_MODEL_REPO}" ;;
    unified) echo "${UNIFIED_MODEL_REPO}" ;;
    *)
      fail "Unknown model '$1'. Use: distilled|unified"
      ;;
  esac
}

run_doctor() {
  local missing=0
  info "Running environment checks"

  if [[ "$(uname -s)" != "Darwin" ]]; then
    warn "Non-macOS host detected."
    missing=1
  fi
  if [[ "$(uname -m)" != "arm64" ]]; then
    warn "Non-arm64 host detected."
    missing=1
  fi
  if ! have_cmd ffmpeg; then
    warn "ffmpeg not found in PATH"
    missing=1
  fi
  if [[ ! -x "${PY_BIN}" ]]; then
    warn "Virtual environment missing at ${VENV_DIR}"
    missing=1
  fi

  if [[ -x "${PY_BIN}" ]]; then
    "${PY_BIN}" - <<PY
import importlib.util
mods = ["mlx", "mlx_video", "huggingface_hub", "transformers", "safetensors"]
missing = [m for m in mods if importlib.util.find_spec(m) is None]
if missing:
    print("[WARN] Missing Python modules:", ", ".join(missing))
else:
    print("[INFO] Python module checks passed")
PY
  fi

  if [[ -x "${PY_BIN}" ]]; then
    "${PY_BIN}" - <<PY
from huggingface_hub import snapshot_download

repos = {
    "distilled": "${DISTILLED_MODEL_REPO}",
    "unified": "${UNIFIED_MODEL_REPO}",
}

for label, repo in repos.items():
    try:
        path = snapshot_download(repo_id=repo, local_files_only=True)
        print(f"[INFO] Model cached ({label}): {path}")
    except Exception:
        print(f"[WARN] Model not cached ({label}): {repo}")
PY
  fi

  local free_kb free_gb
  free_kb="$(df -Pk "${REPO_ROOT}" | awk 'NR==2 {print $4}')"
  free_gb="$((free_kb / 1024 / 1024))"
  info "Free disk on repo volume: ${free_gb} GB"

  if [[ "${missing}" -ne 0 ]]; then
    fail "Doctor found blocking issues."
  fi

  info "Doctor completed."
}

run_download_models() {
  require_ready_env

  local mode="${1:-distilled}"
  case "${mode}" in
    --all|all) mode="all" ;;
    --distilled|distilled) mode="distilled" ;;
    --unified|unified) mode="unified" ;;
    *)
      fail "Unknown download mode '${mode}'. Use --all|--distilled|--unified."
      ;;
  esac

  "${PY_BIN}" - <<PY
from huggingface_hub import snapshot_download

distilled = "${DISTILLED_MODEL_REPO}"
unified = "${UNIFIED_MODEL_REPO}"
mode = "${mode}"

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

run_generate() {
  require_ready_env

  local prompt=""
  local image=""
  local model="${DEFAULT_MODEL}"
  local width="${DEFAULT_WIDTH}"
  local height="${DEFAULT_HEIGHT}"
  local frames="${DEFAULT_FRAMES}"
  local fps="${DEFAULT_FPS}"
  local seed="${DEFAULT_SEED}"
  local tiling="${DEFAULT_TILING}"
  local output="${DEFAULT_OUTPUT_DIR}/t2v_$(date +%Y%m%d_%H%M%S).mp4"

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --prompt) prompt="$2"; shift 2 ;;
      --image) image="$2"; shift 2 ;;
      --model) model="$2"; shift 2 ;;
      --width) width="$2"; shift 2 ;;
      --height) height="$2"; shift 2 ;;
      --frames) frames="$2"; shift 2 ;;
      --fps) fps="$2"; shift 2 ;;
      --seed) seed="$2"; shift 2 ;;
      --tiling) tiling="$2"; shift 2 ;;
      --output) output="$2"; shift 2 ;;
      *)
        fail "Unknown generate arg '$1'"
        ;;
    esac
  done

  [[ -n "${prompt}" ]] || fail "Missing --prompt"

  if (( (frames - 1) % 8 != 0 )); then
    fail "--frames must be 1 + 8*k (e.g. 33, 49, 65)."
  fi
  if (( width % 64 != 0 || height % 64 != 0 )); then
    fail "--width and --height must be divisible by 64."
  fi
  if [[ -n "${image}" && ! -f "${image}" ]]; then
    fail "--image file not found: ${image}"
  fi

  local repo
  repo="$(model_repo_from_name "${model}")"

  info "Generating with model=${model} repo=${repo}"
  info "Output: ${output}"
  local cmd=(
    "${PY_BIN}" -m mlx_video.generate_av
    --prompt "${prompt}"
    --height "${height}"
    --width "${width}"
    --num-frames "${frames}"
    --fps "${fps}"
    --seed "${seed}"
    --tiling "${tiling}"
    --model-repo "${repo}"
    --output-path "${output}"
  )
  if [[ -n "${image}" ]]; then
    cmd+=(--image "${image}")
  fi
  "${cmd[@]}"
}

usage() {
  cat <<'EOF'
Usage:
  scripts/t2v_cli.sh doctor
  scripts/t2v_cli.sh download-models [--all|--distilled|--unified]
  scripts/t2v_cli.sh generate --prompt "..." [options]

Generate options:
  --model distilled|unified   (default: distilled)
  --image PATH                optional reference image for I2V mode
  --width N                   (default: 576)
  --height N                  (default: 1024)
  --frames N                  (default: 49; must be 1+8*k)
  --fps N                     (default: 24)
  --seed N                    (default: 42)
  --tiling MODE               (default: aggressive)
  --output FILE.mp4
EOF
}

main() {
  [[ $# -ge 1 ]] || { usage; exit 1; }
  local cmd="$1"; shift
  case "${cmd}" in
    doctor) run_doctor ;;
    download-models) run_download_models "${1:-distilled}" ;;
    generate) run_generate "$@" ;;
    -h|--help|help) usage ;;
    *) fail "Unknown command '${cmd}'" ;;
  esac
}

main "$@"
