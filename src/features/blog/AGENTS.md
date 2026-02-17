# Blog Feature Directives

- Treat content as immutable data sources; avoid fetching in screens.
- Add new articles via structured factories; keep metadata normalized.
- Rendering must pass through `BlogContentRenderer` to guarantee typography consistency.
