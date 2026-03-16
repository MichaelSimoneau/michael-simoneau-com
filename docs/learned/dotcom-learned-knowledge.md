# Dotcom Learned Knowledge

This document aggregates durable learned information from Cursor project history for dotcom.

## Coverage Summary

- Source buckets analyzed:
  - `/Users/devcoup/.cursor/projects/Users-devcoup-Projects-MichaelSimoneau-com-dotcom`
  - `/Users/devcoup/.cursor/projects/Volumes-External-Projects-MichaelSimoneau-com-dotcom`
- Full-file pass totals:
  - Users bucket: 215 files (`148` `.jsonl`, `67` `.txt`)
  - External bucket: 212 files (`146` `.jsonl`, `66` `.txt`)
- File classes included: `agent-transcripts`, `agent-tools`, and terminal snapshot text found in the buckets.

## Architecture and Runtime Truths

- Expo-first runtime is treated as canonical; Vite/CRA assumptions are considered stale.
- React Native Web + Expo Router patterns are expected to be preserved during feature work and refactors.
- Foundation primitives are part of the baseline architecture and should remain the default integration path for runtime/analytics concerns.
- Route and navigation contracts (section IDs, route shape, scroll behavior) are treated as stability-sensitive and frequently re-validated after edits.

## Tooling and Verification Expectations

- `yarn typecheck` is used as a regular completion gate.
- Lint/diagnostic checks are expected after substantive edits.
- Route-level changes are expected to be verified with observable outcomes (not assumptions), especially for SEO/meta and navigation behavior.
- Blog/content updates often require synchronized updates in related artifacts (routing/prerender/sitemap or equivalent output surfaces).

## Workflow and Command Preferences

- Preferred shorthand command for Gemini guidance workflows is `/gemi`.
- `/gemi` intent is operational stewardship: create/maintain/sync `GEMINI.md` against `AGENTS.md` while keeping guidance concise and durable.
- Attached-plan execution is a recurring preference:
  - do not edit the plan file
  - use existing todos
  - move todos in order from `in_progress` to `completed`

## Safety and Operational Constraints

- Rule-first behavior is durable: read and apply `.cursorrules`/`AGENTS.md` constraints before implementation.
- Non-destructive operations are preferred when handling history/migration or uncertain state.
- Ask/read-only contexts are expected to avoid direct edits and provide exact actionable guidance instead.

## Communication and Output Preferences

- Preference is for direct, implementation-ready output over abstract discussion.
- For "learned information" requests, preferred output is distilled durable facts and decisions, not raw path dumps.
- The user often expects concrete targets and explicit verification outcomes.

## Evidence

- See `docs/learned/dotcom-learned-evidence-index.md` for claim-to-evidence pointers.
