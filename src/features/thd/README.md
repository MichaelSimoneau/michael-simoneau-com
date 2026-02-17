# THD Feature Module

## Architecture Overview

THD (The Human Dollar) presentation. This feature module introduces and explains The Human Dollar — money that works. THD is your employee: put it to work and earn $655 for every $1 at the $65,535 cap. Stagnation is a firing offense — idle capital enters early retirement. It positions as the Anti-Crypto. The concept is detailed in the audio "Building Web 4 With Money That Lives."

## Implementation Guidelines

- **ThdHero** is a full-viewport hero section with `id="thd"` for scroll-to-section from Labs nav.
- Use amber/gold gradient treatment to distinguish from THTH (purple) and other Labs sections.
- Primary CTA: internal `/thd`; secondary: external https://thehumandollar.com/

## Components

### ThdHero
Hero section component introducing The Human Dollar (THD), displayed on the main page.

**Location:** `components/ThdHero.tsx`

**Usage:**
```typescript
import { ThdHero } from './features/thd';

// In main page
<ThdHero />
```

## Types

Types are defined in `types.ts`:
- `ThdSection` – Section structure for THD content
- `ThdConfig` – Configuration for THD sections

## Dependencies

- **UI Libraries:** Lucide React for icons
- **Animation:** Framer Motion
- **Routing:** React Router (Link)

## Related Modules

- **Profile / Main page:** ThdHero is rendered on the home page after ThthHero.
- **Pages:** Full page at `/thd` (Thd.tsx) consumes Metabolic Money audio and THD copy.
