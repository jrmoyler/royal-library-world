# Royal Library World — Aetheria Protocol

A 3D gamified portfolio experience. Explore a cyber-medieval castle library to discover knowledge artifacts.

## Tech Stack
Next.js 16 • React 19 • React Three Fiber • Rapier Physics • Zustand • PostProcessing (Bloom/Vignette)

## Controls
WASD Move | Mouse Look | Click to Lock Cursor | E Interact | ESC Close

## Run Locally
```bash
npm install --legacy-peer-deps
npm run dev
```

## Testing
```bash
# Run unit tests
npm test

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# View E2E test report
npm run test:e2e:report
```

## Build
```bash
npm run build
npm start
```

## Test Coverage
- **Unit Tests:** 75 tests across 6 suites
- **E2E Tests:** Comprehensive game flow and 3D interaction tests
- **Coverage:** 94-100% on critical components

## 3D Character Models

The game features fully 3D character models for each class:

- **Techno-Mage** 🧙‍♂️ - Cyan robed figure with floating orbs and glowing staff
- **Cyber-Knight** ⚔️ - Teal armored warrior with photon blade
- **Shadow Agent** 🗡️ - Purple sleek operative with energy daggers

Currently using procedural models. To use custom GLB models, see `/public/models/README.md`

## Features

✅ Full 3D character models with animations
✅ Class-specific appearances and weapons
✅ Glowing emissive materials
✅ Real-time physics with Rapier
✅ First-person controls with visible character
✅ Shadow casting and lighting effects

*A Hataalii Production*
