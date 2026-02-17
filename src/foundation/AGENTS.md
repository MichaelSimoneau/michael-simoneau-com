# React Foundation Kernel Rules

- Treat this directory as the operating system of the app. Export minimal, composable primitives only.
- Runtime detection logic must remain platform-safe (no direct `window` or `document` access).
- Any analytics sinks added here should expose typed events and remain side-effect free by default.
