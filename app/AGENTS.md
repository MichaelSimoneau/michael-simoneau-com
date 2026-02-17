# Expo Router Surface Guidelines

- Routes must export React components using React Native primitives only.
- Use typed routes via Expo Router (keep file names aligned with route path semantics).
- Wrap screens with providers in `_layout.tsx` only; individual routes should remain provider-free.
- Prefer `Link` with `asChild` and `Pressable`/`View` wrappers for button-like navigation.
