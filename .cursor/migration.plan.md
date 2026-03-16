---
name: migrate cursor project history
overview: Move Cursor project-scoped metadata from the old dotcom workspace key to the new external-volume key so prior conversations appear in the current project history.
todos:
  - id: backup-cursor-project-buckets
    content: Create timestamped backups of old and new Cursor project buckets before migration
    status: pending
  - id: merge-old-history-into-new-bucket
    content: Copy/merge old project `agent-transcripts` (and safe metadata) into the new project bucket without overwriting newer destination files
    status: pending
  - id: normalize-safe-path-references
    content: Replace safe absolute path references from old project path to new path in Cursor metadata files where appropriate
    status: pending
  - id: verify-history-migration
    content: Confirm migrated transcript presence and report any remaining old-path references that are intentionally left untouched
    status: pending
isProject: false
---

# Restore Cursor History After Project Move

## Goal

Make the moved project at `/Volumes/External/Projects/MichaelSimoneau.com/dotcom` use the same Cursor conversation history that was previously associated with `/Users/devcoup/Projects/MichaelSimoneau.com/dotcom`.

## What I will change

- Merge old project-scoped history artifacts from `[/Users/devcoup/.cursor/projects/Users-devcoup-Projects -dotcom]( /Users/devcoup/.cursor/projects/Users-devcoup-Projects -dotcom )` into the active project bucket `[/Users/devcoup/.cursor/projects/Volumes-External-Projects -dotcom]( /Users/devcoup/.cursor/projects/Volumes-External-Projects -dotcom )`.
- Prioritize `agent-transcripts` migration so previous chats show in the current project.
- Also merge compatible supporting project-scoped metadata (`agent-tools`, optional non-live artifacts) without overwriting newer files in the destination.
- Apply targeted path normalization for explicit absolute path references from `/Users/devcoup/Projects/MichaelSimoneau.com/dotcom` to `/Volumes/External/Projects/MichaelSimoneau.com/dotcom` where safe (excluding live terminal logs and avoiding destructive rewrites).

## Safety and verification

- Create a timestamped backup copy of both source and destination project buckets before modifying anything.
- Verify post-migration by checking:
  - old transcript IDs now exist under the new project bucket,
  - no missing transcript files from source,
  - no accidental deletion of existing destination history,
  - remaining old absolute-path hits are only historical message content where rewriting is not safe/needed.

## Expected result

When you open this project in Cursor, prior conversations from the old location should be available in the history for the new location.