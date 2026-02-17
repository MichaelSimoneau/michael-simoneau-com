# Blog Hook Practices

- Hooks must be deterministic and memoized; no side effects beyond analytics.
- Keep selectors pure and ensure arrays are cloned before sorting/mutating.
- If async data sources arrive, expose suspense-friendly hooks returning `{ data, status }` objects.
