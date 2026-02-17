# Home Screens Contract

- `HomeScreen` orchestrates sections sequentially; keep layout vertical and scroll-friendly.
- When adding metrics, prefer declarative `View` compositions; avoid absolute positioning.
- Emit runtime insights (platform, locale) via foundation hooks only.
