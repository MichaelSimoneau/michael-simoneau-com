# Workflow Design Rules

- Keep workflows modular; prefer composite actions when steps repeat.
- Cache Yarn dependencies using the lockfile hash.
- Workflows should gate on `yarn lint`, `yarn typecheck`, `yarn test`, and `yarn build` to mirror the local pipeline.
