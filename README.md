# Michael Simoneau | MetLife Digital Platform Experience

This repository powers the MetLife-themed public site for MichaelSimoneau.com. It presents the cloud modernization strategy,
program wins, and partnership principles that Michael brings to large-scale insurance transformations.

## Stack

- **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) in strict mode
- **Styling:** Modern CSS (global baseline plus inline component styles)
- **Testing:** [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/)

## Getting started

```bash
yarn install
yarn dev
```

The app runs at `http://localhost:5173` by default.

## Quality checks

Run the full suite before opening a PR:

```bash
yarn lint
yarn typecheck
yarn test
yarn build
```

Use Prettier to format any touched files:

```bash
yarn format
```

## Project structure

```
src/
  components/   # Reusable UI primitives (buttons, section headers, metrics)
  data/         # Structured copy blocks for the MetLife narrative
  sections/     # Page-level sections composed from data + components
  styles/       # Global CSS baseline and theme tokens
```

Tests live under `src/__tests__` and exercise the key marketing surfaces rendered on the homepage.
