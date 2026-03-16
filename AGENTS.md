# React Foundation Stewardship Guidelines

Welcome to the forward-only branch of `michael-simoneau-com`. This repository is now an Expo-driven React Native Web experience.
Every contribution must reinforce the future-facing product vision.

## Prime Directives

- **Expo first.** All app runtime behavior flows through Expo Router + Metro. Never reintroduce Vite, CRA, or other legacy build
  stacks. Optimizations must integrate with Expo tooling (e.g., `expo prebuild`, `expo-doctor`).
- **React Foundation compliance.** Use the primitives under `src/foundation` for config, analytics, and runtime intelligence.
  When adding features, model them as foundation-aware experiences and register boundaries where appropriate.
- **TypeScript strictness.** Keep TypeScript in strict mode. Prefer explicit types, discriminated unions, and descriptive interfaces.
- **No DOM-specific APIs.** Use React Native primitives (`View`, `Text`, `ScrollView`, etc.). If a web-only capability is needed,
  wrap it behind a runtime guard that respects `useFoundationRuntime()`.
- **Accessible motion + theming.** Honor the runtime color scheme and respect reduced motion preferences when the design system
  introduces animated experiences.

## Architectural Expectations

- **Features live under `src/features`.** Compose screens, hooks, and view models per feature. Keep shared UI under `src/ui` (create
  it if a common component emerges). Avoid leaking feature-specific concerns into the foundation layer.
- **Provider orchestration belongs in `src/providers`.** Any global context should be added there and composed inside `AppProviders`.
- **Content pipelines** (markdown, CMS, config) must be future-compatible with React Native. Use serializable JSON data or Expo's
  asset system; never rely on Node-only modules in runtime code.
- **Testing discipline.** Favor [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/) for
  component validation. Add smoke tests for critical navigation flows before shipping major UX changes.

## Tooling + Scripts

- Use `yarn start` for local development, `yarn web` for web preview, and `yarn typecheck` before commit.
- ESLint config already extends Expo/React Native best practices. Do not disable rules globally; scope overrides locally when
  necessary.
- Manage dependencies with Yarn only; do not introduce `package-lock.json`.

## Documentation

- Update this file or nested `AGENTS.md` files whenever architectural rules evolve. Keep guidance clear, opinionated, and future-proof.

## Learned Information (Dotcom)

- **Memory source model.** Project "learned" state is primarily recovered from Cursor conversation/tool history artifacts (agent transcripts and tool logs), not from a dedicated per-project memory profile file.
- **Workspace context.** This project has appeared under two workspace roots (`/Users/devcoup/.../dotcom` and `/Volumes/External/.../dotcom`), and history has been migrated between them; treat both as valid historical context when reconstructing prior intent.
- **Command preference.** The preferred shorthand command for Gemini guidance tasks is `/gemi` (chosen over multi-command aliases).
- **Gemini workflow intent.** When `/gemi` is invoked, expected behavior is to create/maintain/sync `GEMINI.md` with `AGENTS.md` while keeping guidance concise, durable, and non-duplicative.
- **Repo-rule emphasis.** Sessions repeatedly enforce reading and honoring repository rules (especially `.cursorrules` and `AGENTS.md`) before acting on implementation requests.
- **Output preference for memory requests.** When asked for "learned information," return distilled facts, preferences, and durable behavior patterns; avoid dumping raw file-path inventories unless explicitly requested.
