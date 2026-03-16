# GEMINI.md

## Project Defaults
- Build and runtime are Expo-first with Expo Router + Metro; do not reintroduce Vite, CRA, or other legacy build systems.
- Use Yarn for dependency and script management; do not add `package-lock.json`.
- Primary development scripts are `yarn start` for local development and `yarn web` for web preview.

## Coding Standards
- Keep TypeScript strict and prefer explicit types, discriminated unions, and descriptive interfaces.
- Use React Native primitives for UI (`View`, `Text`, `ScrollView`, etc.); avoid direct DOM-specific APIs in runtime code.
- If a web-only capability is required, gate it behind runtime checks that respect `useFoundationRuntime()`.
- Build feature logic under `src/features`; promote reusable UI into `src/ui`; keep global provider composition in `src/providers`.
- Use `src/foundation` primitives for config, analytics, and runtime intelligence in cross-cutting concerns.
- Favor serializable content pipelines compatible with Expo/React Native assets; avoid Node-only runtime dependencies.

## Verification
- Run `yarn typecheck` before completion and before commit.
- Add or update tests for changed behavior, favoring React Native Testing Library for component validation.
- Add smoke coverage for critical navigation flows when shipping substantial UX changes.
- For service and function changes, preserve error handling, type safety, and test coverage expectations from repository rules.

## Safety Rules
- Do not run destructive Git commands (for example `git reset --hard`) unless explicitly requested.
- Do not revert unrelated local changes you did not author.
- Never commit secrets, credentials, or environment-sensitive values.
- Keep guidance and changes forward-compatible with the Expo/React Native Web architecture.

## Update Policy
- Keep this file concise and operational; include durable implementation rules, not temporary task notes.
- When `AGENTS.md` and this file overlap, keep repository-specific constraints and remove duplicate wording.
- Update this file when architectural, tooling, or verification expectations materially change.
