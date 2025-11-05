# .github Automation Charter

All GitHub workflows should reinforce the Vite + React delivery pipeline.

- Workflows must install dependencies with Yarn and run `yarn build`, `yarn lint`, `yarn typecheck`, and `yarn test`.
- Prefer reusable workflow components and limit secrets to GitHub Environments when deployments are added.
- Keep any helper scripts inside `.github/scripts` compatible with Node 20 and document usage inline.
