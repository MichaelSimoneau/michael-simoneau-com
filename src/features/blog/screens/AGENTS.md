# Blog Screen Guidelines

- Screens may read from hooks and foundation analytics, nothing else.
- Always emit analytics events through `useFoundationAnalytics()` when relevant interactions occur.
- Keep scrollable layouts accessible: use `ScrollView` with `contentContainerStyle` for spacing instead of nested `View` padding.
