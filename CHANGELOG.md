# Changelog

All notable changes are documented here from the last 100 commits, grouped into adjacent thematic releases.

Versioning policy for this historical backfill:
- Major version is fixed at `1`.
- `minor` bumps (`1.x.0`) represent substantial feature/theme bundles.
- `patch` bumps (`1.x.y`) represent focused refinements, fixes, and incremental updates.

Commit coverage: 100 commits (`12ebf77` through `9162b7a`), each represented once.

## 1.5.1 - 2026-03-15
_AMA rollout and knowledge index refresh_

- Added AMA embedding to `HeroSection` and `MelindaFrancis` with expandable interaction patterns.
- Refreshed `ama-knowledge-index.json` and added a new transcript source ("Agency is Authority, Not Control").
- Tightened Gemini build/runtime behavior with retried API calls and build script separation for AMA index generation + AI enrichment.

Commit range: `0f58a4f` -> `9162b7a` (3 commits)

## 1.5.0 - 2026-03-15
_AI function foundation and transcript ingestion hardening_

- Added new Netlify functions (`gemini-assistant`, `human-gate`) for AI generation and human verification flow.
- Improved large-text handling with normalization/chunking and recursive `.txt` discovery for knowledge indexing.
- Updated build and deploy support (`package.json`, `netlify.toml`, `_redirects`, `.gitignore`) including coverage-management tuning.

Commit range: `35c7846` -> `68d3adc` (3 commits)

## 1.4.1 - 2026-03-15
_Zeroth transcript consistency and player reliability_

- Corrected "Zeroth" -> "Zeroth" terminology across docs/transcripts for consistency.
- Added and refined Zeroth-protocol transcript content across multiple audio text assets.
- Improved transcript loading robustness by detecting/rejecting HTML-like responses and corrected playlist title wording.

Commit range: `c5811c0` -> `caf06e1` (7 commits)

## 1.4.0 - 2026-03-15
_Legal pages, consent flow, and profile orchestration_

- Introduced `Privacy` and `Terms` pages, then unified legal layouts with `LegalPageFrame`.
- Integrated `ProfileFlowProvider` at app level and expanded cookie/session consent handling for media terms.
- Added media reward-eligibility tracking and pre-read acceptance telemetry with celebratory UX updates.
- Removed outdated effective-date display to keep policy copy current.

Commit range: `51d13d9` -> `683ad33` (7 commits)

## 1.3.0 - 2026-03-14
_THD messaging repositioning and blog architecture updates_

- Repositioned THD language across key screens/components to emphasize anti-currency/bartering-chip framing.
- Refactored blog data model and blog rendering surfaces (`BlogArticleView`, `BlogListView`) for clearer separation.
- Improved SEO and indexing support through blog and sitemap/robots workflow updates.
- Performed dependency/codebase hygiene cleanup (unused typings removal, Babel lockfile cleanup).

Commit range: `d4e61e4` -> `59d225a` (6 commits)

## 1.2.1 - 2026-03-14
_Melinda content pipeline and homepage copy refinement_

- Refactored `MelindaFrancis` repeatedly for readability, formatting, SEO alignment, and playlist coherence.
- Added dynamic markdown-driven content loading via `melinda.md`.
- Improved `HeroSection` link display/visibility and added external-link affordances.
- Expanded playlist and media references, including partner/logo and messaging updates tied to homepage sections.
- Updated sitemap/robots behavior to control route indexability (`/melinda` exclusion).

Commit range: `e2d374a` -> `09a9148` (13 commits)

## 1.2.0 - 2026-03-14
_Main page performance pass and audio-navigation alignment_

- Optimized app shell/page loading with layout cleanup and lazy loading of major sections.
- Shifted key navigation targets from `about` to `audio` for MainNav/VideoHero/MainPage consistency.
- Iterated MainPage structure and featured-blog wiring to ensure the right content appears.
- Expanded audio catalog and adjusted playlist ordering while landing related Hero/MainPage structural refinements.
- Added provider integration (`BeforeAndAfterProvider`) and interaction logging consistency updates.

Commit range: `59bbb94` -> `1245e6d` (13 commits)

## 1.1.1 - 2026-03-13 to 2026-03-14
_Audio expansion and Zeroth content/routing enablement_

- Added multiple podcast/music tracks across public assets and playlist definitions.
- Introduced `.txt` asset support in Metro plus `zero`/`zeroth` content files and preview scaffolding.
- Refactored Zeroth routing/layout and dynamic chapter/part path handling.

Commit range: `9770462` -> `7b43ad5` (8 commits)

## 1.1.0 - 2026-03-13
_UX cleanup across interview, routing, and media surfaces_

- Removed deprecated Bolt-era config artifacts and simplified obsolete routing surfaces.
- Improved responsive behavior for `MusicSection` and `VideoHeroSection`.
- Refined interview pages/layout/switcher flow, including transition/navigation behavior changes.
- Updated Dr. Melinda route parameter handling and screen context rendering.
- Added new music/podcast content while keeping page structure clean.

Commit range: `c7f9173` -> `b62eb34` (11 commits)

## 1.0.2 - 2026-03-12
_Playlist model consolidation and route cleanup_

- Consolidated playlist structures and MP3 handling logic for maintainability.
- Added multiple new podcast entries (including "Chardon Rd" and related tracks) with renumbering/title cleanup.
- Continued NotFound/DrMelinda routing simplification and redirected legacy paths more cleanly.
- Tweaked `MusicSection`/`VideoHeroSection` layout behavior alongside playlist updates.

Commit range: `9b0cb85` -> `6cf1037` (9 commits)

## 1.0.1 - 2026-03-12
_Scheduling and redirect refinement cycle_

- Iterated DrMelinda scheduling UX: countdown behavior, timing/date updates, copy cleanup, and time-display logic.
- Improved redirect robustness in `NotFound` with regex/path handling refinements.
- Added external-link row support in `PlaylistAudioPlayer`.
- Adjusted scheduling constants across related components for consistent cutoff behavior.

Commit range: `673cef0` -> `4e5c04c` (10 commits)

## 1.0.0 - 2026-03-12
_Initial DrMelinda playlist/route foundation for this log window_

- Established Dr. Melinda route typing and early redirect support.
- Introduced initial scheduling/countdown mechanics and associated content metadata updates.
- Began playlist normalization with title/date/capitalization fixes and introductory podcast additions.
- Aligned credential labeling updates (PhD -> DSM) and removed outdated welcome copy.

Commit range: `12ebf77` -> `b4591a8` (10 commits)
