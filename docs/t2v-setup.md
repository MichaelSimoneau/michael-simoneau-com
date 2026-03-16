# T2V Setup (Apple Silicon M1/M2/M3/M4)

This setup provisions a local MLX-based text-to-video workflow with:
- full environment bootstrap
- optional model prefetch
- a simple CLI for doctor, model download, and generation

## What Gets Created

- `scripts/setup_t2v.sh` - one-shot bootstrap (system deps + venv + packages)
- `scripts/t2v_cli.sh` - CLI interface (`doctor`, `download-models`, `generate`)
- `.venv-t2v/` - isolated Python runtime
- `.t2v/requirements.lock.txt` - installed Python package snapshot
- `.t2v/outputs/` - generated outputs by default

## Quick Start

From repo root:

```bash
chmod +x scripts/setup_t2v.sh scripts/t2v_cli.sh
scripts/setup_t2v.sh
scripts/t2v_cli.sh doctor
scripts/t2v_cli.sh download-models --all
scripts/t2v_cli.sh generate --prompt "A cinematic vertical ocean sunset"
```

## Setup Script Modes

`setup_t2v.sh` accepts an optional first argument:

- `none` (default): install/provision only, skip model downloads
- `distilled`: provision + prefetch distilled model
- `unified`: provision + prefetch unified model
- `all`: provision + prefetch both

Examples:

```bash
scripts/setup_t2v.sh distilled
scripts/setup_t2v.sh all
```

## CLI Commands

### Doctor

```bash
scripts/t2v_cli.sh doctor
```

Checks:
- OS/arch compatibility
- `ffmpeg` availability
- virtualenv readiness
- required Python modules
- local model cache presence
- free disk report

### Download Models

```bash
scripts/t2v_cli.sh download-models --all
```

Modes:
- `--distilled` (smaller/faster default)
- `--unified` (higher quality, larger)
- `--all`

### Generate

```bash
scripts/t2v_cli.sh generate \
  --prompt "A vertical cinematic city timelapse at night" \
  --model distilled \
  --width 576 \
  --height 1024 \
  --frames 49 \
  --fps 24 \
  --tiling aggressive
```

Defaults are tuned for M1 + 8-16GB RAM.

Use image-conditioned generation (I2V) with an optional base image:

```bash
scripts/t2v_cli.sh generate \
  --prompt "A cinematic push-in on this subject with subtle motion" \
  --image /absolute/path/to/reference.jpg \
  --model distilled
```

## Recommended Presets

- 8GB stability mode:
  - `--width 512 --height 896 --frames 49 --tiling aggressive`
- 16GB balanced mode:
  - `--width 576 --height 1024 --frames 65 --tiling aggressive`

## Troubleshooting

- If setup fails on Homebrew install, install Homebrew manually first and rerun setup.
- If Python 3.12 is not found, setup installs `python@3.12` through Homebrew.
- Model downloads are large and can take significant time; reruns resume downloads.
- If generation fails with memory pressure, lower resolution and frame count.
