# Provider Orchestration Guide

- `AppProviders` is the single entry point for global contexts.
- When adding providers, wrap them in memoized components to avoid unnecessary renders.
- Keep provider files simple—no feature logic or navigation side effects here.
