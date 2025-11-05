# Web Platform Guidelines

This repository hosts the public MetLife-themed marketing experience for MichaelSimoneau.com. The stack is Vite + React with
TypeScript.

## Core Principles

- **Browser-first React.** Author components with DOM primitives and modern CSS. Keep styling co-located or inline for targeted
  customizations.
- **Data modules.** Store narrative copy and structured content inside `src/data` and treat those modules as the single source of
  truth for strings rendered on the site.
- **Composition over inheritance.** Keep UI sections modular under `src/sections` and share smaller building blocks via
  `src/components`.
- **Strict typing.** Leave TypeScript in `strict` mode. Prefer explicit interfaces and avoid `any`.

## Tooling

- Use the Vite dev server via `yarn dev`.
- Validate changes with `yarn test`, `yarn typecheck`, and `yarn lint` before committing.
- Format updates with Prettier (`yarn format` or `npx prettier --write`).

## Testing

- Use Vitest with Testing Library (`@testing-library/react`) for component coverage.
- Co-locate tests under `src/__tests__` or near the component when the suite is tightly scoped.
