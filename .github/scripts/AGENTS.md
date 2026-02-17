#!/usr/bin/env bash
cat <<'DOC'
# GitHub Script Protocols

Scripts in this folder execute within GitHub Actions runners.

- Target Node.js 20. Guard against missing optional native deps.
- Expose clear CLI flags; scripts must fail fast with descriptive exit codes.
- Prefer ESM syntax and avoid CommonJS legacy patterns.
DOC
