# Source Directory Charter

- Organize code by intent: `foundation`, `providers`, and feature-centric modules only.
- Do not place runtime assets (images, JSON) here—prefer Expo asset system or `public/`.
- Maintain barrel exports sparingly; explicit imports improve tree shaking.
