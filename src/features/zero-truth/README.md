# Zero Truth Feature Module

## Purpose

Philosophical treatise presentation system. This feature module provides an interactive interface for exploring the Zero Truth philosophical content, with complex navigation for chapters and principles.

## Components

### ZeroTruth
Main Zero Truth presentation component that displays chapters and principles with navigation controls.

**Location:** `components/ZeroTruth.tsx`

**Usage:**
```typescript
import { ZeroTruth } from './features/zero-truth';

// In route configuration
{
  path: "zero",
  element: <ZeroTruth />
}
```

### ZeroNavigation
Navigation controls component for moving between chapters and principles in the Zero Truth content.

**Location:** `components/ZeroNavigation.tsx`

**Usage:**
```typescript
import { ZeroNavigation } from './features/zero-truth';

// Used internally by ZeroTruth component
```

## Types

Types are defined in `types.ts`:
- `ZeroContent` - Complete zero content structure (re-exported from utils)
- `Chapter` - Chapter structure (re-exported from utils)
- `Principle` - Principle structure (re-exported from utils)
- `ZeroNavigationState` - Navigation state management
- `ZeroViewMode` - Mobile vs desktop view mode

## Dependencies

- **Utils:** Uses `src/utils/zeroParser.ts` for parsing zero.txt content
- **Data:** Uses `public/zeroth.txt` as content source
- **Layout:** Uses `MainNav` from `../layout/`
- **Foundation:** Uses `Seo` from `../foundation/seo/`
- **Backgrounds:** Uses `NebulaStormBackground` from `../backgrounds/`

## Content Structure

The Zero Truth content is organized as:
- **Chapters** - Major sections of the treatise
- **Principles** - Individual principles within chapters
- **Content** - Detailed explanations for each principle

## Navigation Patterns

- **Desktop:** Side-by-side chapter and principle navigation
- **Mobile:** Sequential navigation through all principles
- **Keyboard:** Arrow key navigation support

## Related Modules

- **Backgrounds:** Uses NebulaStormBackground for dramatic visual presentation
- **Layout:** Uses MainNav for site navigation

