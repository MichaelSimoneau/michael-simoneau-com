# Crypto Fabric Feature Module

## Purpose

Crypto Fabric conceptual framework presentation. This feature module introduces and explains the Crypto Fabric concept, a profitability-first automation platform.

## Components

### CryptoFabricHero
Hero section component introducing the Crypto Fabric concept, displayed on the main page.

**Location:** `components/CryptoFabricHero.tsx`

**Usage:**
```typescript
import { CryptoFabricHero } from './features/crypto-fabric';

// In main page
<CryptoFabricHero />
```

## Types

Types are defined in `types.ts`:
- `CryptoFabricSection` - Section structure for Crypto Fabric content
- `CryptoFabricConfig` - Configuration for Crypto Fabric sections

## Dependencies

- **UI Libraries:** Uses Lucide React for icons
- **Animation:** Uses Framer Motion for animations
- **Routing:** Uses React Router for navigation

## Related Modules

- **Profile Feature:** CryptoFabricHero is used in the main page (profile feature)

