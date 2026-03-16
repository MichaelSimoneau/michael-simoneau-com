# Dotcom Learned Decisions

This document captures recurring user/project decisions inferred from history.

## Stable Decisions

- **Command choice:** use `/gemi` as the primary Gemini guidance command.
- **Guidance maintenance model:** `GEMINI.md` should stay concise, practical, and synchronized with `AGENTS.md`.
- **Execution style:** when a plan is attached, execute that plan as written, do not edit the plan file, and progress existing todos in order.
- **Safety posture:** prefer non-destructive workflows; verify before risky transformations.
- **Rule adherence:** repository rules are not optional context; they are expected preconditions before changes.
- **Output style:** provide distilled decisions/facts for memory requests; avoid low-signal raw dumps unless explicitly requested.

## Repeated Operational Patterns

- Maintain both workspace-history contexts when relevant (`/Users/...` and `/Volumes/External/...`) due migration and continuity.
- Treat verification as part of delivery (typecheck/lint/observable behavior checks), not an optional post-step.
- Preserve architectural direction (Expo/React Native Web/foundation-aware patterns) across edits.

## Explicitly Excluded as Non-Durable

- One-off copy tweaks and transient phrasing changes.
- Ephemeral terminal/session state.
- Narrow bug-specific debug traces that did not recur as a project norm.

## Evidence

- See `docs/learned/dotcom-learned-evidence-index.md` for supporting transcript references.
