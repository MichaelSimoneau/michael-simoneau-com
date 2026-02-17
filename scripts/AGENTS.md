# Script Lab Protocols

- Scripts must be ESM (`type": "module"` aware) and run on Node 20.
- Design them as pure utilities; no runtime side effects when imported.
- For CLI utilities, surface `--help` output and exit with non-zero status on validation failures.
