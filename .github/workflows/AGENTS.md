# Workflow Design Rules

- Keep workflows modular; use composite actions where repetition appears.
- Always cache npm dependencies with Expo-specific cache keys (`node_modules` + `app.json` hash).
- Ensure workflows gate on `npm run typecheck` and Expo linting; never resurrect Vite-specific steps.
