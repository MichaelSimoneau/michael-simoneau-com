# GEMINI.md

## Project Defaults
- Treat this repository as an Expo-driven React Native Web app using Expo Router + Metro.
- Do not reintroduce Vite, CRA, or other legacy web build assumptions in runtime code.
- Use Yarn for dependency and script workflows; do not add `package-lock.json`.
- Use `yarn start` for local dev, `yarn web` for web preview, and `yarn typecheck` before commit.

## Coding Standards
- Keep TypeScript strict and prefer explicit types, discriminated unions, and descriptive interfaces.
- Use React Native primitives (`View`, `Text`, `ScrollView`) instead of DOM-specific APIs.
- If web-only behavior is required, guard it behind runtime-safe checks and foundation runtime abstractions.
- Keep feature logic in `src/features`; keep shared cross-cutting primitives in `src/foundation`; compose globals in `src/providers`.
- Keep feature boundaries explicit and avoid leaking feature concerns into foundation modules.
- Use barrel exports sparingly; prefer explicit imports when it improves clarity and tree shaking.

## Foundation Rules
- Treat `src/foundation` as kernel-level infrastructure with minimal, composable primitives.
- Keep runtime detection platform-safe; avoid direct `window` or `document` access in shared runtime logic.
- Keep analytics sinks typed and side-effect free by default.

## Documentation & Structure
- Maintain required README coverage in `src`, `src/services`, `functions`, and `functions/src/__tests__`.
- Include required README sections where applicable: Architecture Overview, Implementation Guidelines, Performance Metrics, Security Measures, Testing Requirements, Documentation Requirements.
- Keep guidance durable and concise; remove stale tool references when architecture changes.

## Verification
- Run type checks for changed areas before completing work (`yarn typecheck` minimum).
- Add or update tests for behavior changes, especially for critical navigation and foundation/runtime behavior.
- Favor React Native Testing Library for component tests and include smoke validation for critical flows.

## Safety Rules
- Never run destructive git commands (for example `git reset --hard`) unless explicitly requested.
- Never commit secrets or credentials; avoid adding sensitive files to version control.
- Keep edits scoped to the requested task and avoid reverting unrelated user changes.

## Update Policy
- Keep this file operational and implementation-focused, not historical.
- When `AGENTS.md` and `GEMINI.md` overlap, preserve one canonical phrasing and remove duplicates.
- Prefer repository-specific constraints over generic defaults when conflicts arise.
