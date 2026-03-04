---
name: blog voice quality upgrade
overview: Improve blog narration quality immediately with a tuned browser-TTS pipeline, while structuring the player so Gemini on-demand cached audio can be added cleanly later if needed.
todos:
  - id: refine-text-extraction
    content: Implement sentence-aware chunking and spoken-text normalization for list/table/math in src/utils/blogTextExtractor.ts
    status: pending
  - id: upgrade-voice-selection
    content: Improve neural/natural voice ranking and fallback behavior in src/utils/voiceSelector.ts
    status: pending
  - id: harden-playback
    content: Add playback session guards and tune speech defaults in src/features/blog/hooks/useBlogSpeech.ts
    status: pending
  - id: add-user-presets
    content: Expose and persist voice presets in src/ui/players/BlogSpeechPlayer.tsx
    status: pending
  - id: prep-gemini-seam
    content: Introduce provider interface and cache key design for future Gemini on-demand audio
    status: pending
  - id: verify-quality
    content: Run build and perform manual listening QA across long and math-heavy posts
    status: pending
isProject: false
---

# Upgrade Blog Voice Quality

## Goal

Ship a much more natural blog listening experience without changing site design, using browser TTS as the primary engine and preparing clean extension points for optional Gemini on-demand cached audio.

## Current Findings

- Narration currently uses browser `speechSynthesis` with fixed global settings in `[/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/features/blog/hooks/useBlogSpeech.ts](/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/features/blog/hooks/useBlogSpeech.ts)`.
- Text extraction is block-based and coarse, with unnatural joining for lists/tables in `[/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/utils/blogTextExtractor.ts](/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/utils/blogTextExtractor.ts)`.
- Voice ranking is simple and name-based in `[/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/utils/voiceSelector.ts](/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/utils/voiceSelector.ts)`.
- Player UI already supports playback state and progress in `[/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/ui/players/BlogSpeechPlayer.tsx](/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/ui/players/BlogSpeechPlayer.tsx)`.

## Implementation Plan

- Improve extraction + pacing in `[/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/utils/blogTextExtractor.ts](/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/utils/blogTextExtractor.ts)`:
  - Add sentence-aware chunking for long paragraphs/callouts (shorter, breath-like segments).
  - Normalize punctuation joins for lists (avoid robotic stop/start cadence).
  - Convert table separators to spoken-friendly text and include captions.
  - Add lightweight math normalization (common symbols -> readable spoken form).
- Improve voice quality selection in `[/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/utils/voiceSelector.ts](/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/utils/voiceSelector.ts)`:
  - Prefer neural/natural voices by keyword scoring (not only exact names).
  - Keep safe fallback chain by locale and stability.
- Harden playback orchestration in `[/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/features/blog/hooks/useBlogSpeech.ts](/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/features/blog/hooks/useBlogSpeech.ts)`:
  - Session token guard to prevent stale `onend` callbacks after cancel/replay.
  - Tune default `rate/pitch/volume` for naturalness and expose controlled presets.
  - Improve progress accuracy by sentence chunk index rather than raw block index.
- Add small user-facing controls in `[/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/ui/players/BlogSpeechPlayer.tsx](/Users/devcoup/Projects/MichaelSimoneau.com/dotcom/src/ui/players/BlogSpeechPlayer.tsx)`:
  - Voice mode preset selector (e.g., Natural / Clear / Fast).
  - Persist preference locally so playback feels consistent.
- Prepare Gemini on-demand cache seam (no full rollout yet):
  - Define provider interface (`browser` now, `gemini` later) and cache key strategy (`postId + contentHash + voicePreset`) to avoid rework when enabling Gemini.

## Validation

- Manual QA on at least 2 long articles and 1 math-heavy article for cadence, clarity, and non-robotic transitions.
- Verify pause/resume/replay reliability and no duplicate/stale playback.
- Run `yarn build` and smoke-test blog playback in dev.
- Confirm no regressions to existing blog rendering styles.

