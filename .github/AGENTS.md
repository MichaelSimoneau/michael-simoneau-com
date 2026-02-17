# .github Automation Charter

All GitHub workflows and bots must accelerate the Expo-first delivery pipeline.

- Author CI steps that understand Expo projects (use `expo-doctor`, `expo export --platform web`, etc.).
- Prefer reusable workflow components; keep environment secrets referenced via GitHub Environments.
- Never introduce legacy deployment steps (Firebase Hosting CLI, Vite builds) into workflows going forward.
- When adding new scripts inside `.github/scripts`, document usage inline and ensure Node 18+ compatibility.
