# PolarCraft - Polarized Light Voxel Puzzle Game

> 偏振光体素解谜游戏 | An Optical Puzzle Experience

A beautifully crafted 3D puzzle game that transforms the invisible geometry of polarized light into elegant, tangible challenges. Manipulate light beams, rotate polarizers, and unlock sensors through clever optical arrangements.

**Inspired by:** Monument Valley, Shadowmatic, The Witness

## Features

- **Elegant 3D Puzzles** - Solve optical challenges using real physics principles
- **Intuitive Light Physics** - Malus's Law, birefringence, and wave interference made playable
- **Multiple Camera Views** - First-person, isometric, and top-down perspectives
- **Polarization Visualization** - Toggle vision modes to see the hidden polarization states
- **Educational Course** - 15 interactive demos across 6 physics units
- **Bilingual Support** - English and Chinese interface

## Tech Stack

- **Frontend**: React 19 + TypeScript (strict mode)
- **3D Rendering**: React Three Fiber + Three.js + drei
- **State Management**: Zustand with subscribeWithSelector
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **i18n**: i18next with language detection
- **Build**: Vite

## Quick Start

```bash
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Game Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with navigation |
| `/game` | Full 3D puzzle experience |
| `/game2d` | 2D puzzle mode with complex levels |
| `/demos` | Interactive physics demonstrations |

## Core Physics

### The Four Axioms

1. **Orthogonality** - Light polarized at 90° difference coexists without interference
2. **Malus's Law** - Intensity through polarizer: I = I₀ × cos²(θ)
3. **Birefringence** - Calcite crystals split light into o-ray and e-ray
4. **Interference** - Same-phase light adds, opposite-phase cancels

### Light Properties

| Property | Values |
|----------|--------|
| Direction | 6 discrete directions (±X, ±Y, ±Z) |
| Intensity | 0-15 levels |
| Polarization | 0°, 45°, 90°, 135° |
| Phase | Positive (+) or Negative (-) |

## Optical Components

| Block | Function |
|-------|----------|
| **Emitter** | Projects polarized light beam |
| **Polarizer** | Filters light by polarization angle |
| **Rotator** | Rotates polarization without intensity loss |
| **Splitter** | Birefringent crystal splits beam |
| **Sensor** | Detects specific polarization and intensity |
| **Mirror** | Reflects light beam |

## Controls

### Movement

| Key | First-Person | Isometric/Top-Down |
|-----|--------------|-------------------|
| WASD | Walk | Pan camera |
| Space | Jump | - |
| Mouse | Look around | Orbit camera |
| Scroll | - | Zoom |
| ESC | Exit pointer lock | - |

### Building

| Key | Action |
|-----|--------|
| Left Click | Place block |
| Right Click | Remove block |
| R | Rotate block / Change polarization |
| 1-7 | Select block type |

### View

| Key | Action |
|-----|--------|
| V | Toggle polarization vision |
| C | Cycle camera mode |
| G | Toggle grid overlay |
| H | Show/hide help panel |

### Polarization Colors

When polarization vision is enabled:

- **Red** - 0° (Horizontal)
- **Orange** - 45° (Diagonal)
- **Green** - 90° (Vertical)
- **Blue** - 135° (Anti-diagonal)

## Tutorial Levels

| Level | Concept |
|-------|---------|
| 0 - Light & Gate | Basic emitter-sensor alignment |
| 1 - Polarizer | Filtering light with polarization |
| 2 - Malus's Law | Intensity reduction through filters |
| 3 - Wave Plate | Lossless polarization rotation |
| 4 - Birefringence | Beam splitting and routing |

## Course Curriculum

The educational platform covers 6 units of polarization optics:

| Unit | Topic |
|------|-------|
| 0 | Optical Fundamentals |
| 1 | Light Polarization |
| 2 | Interface Reflection |
| 3 | Transparent Media |
| 4 | Turbid Media Scattering |
| 5 | Full Polarimetry |

Visit `/demos` to explore interactive visualizations.

## Project Structure

```
polarisation/
├── src/
│   ├── core/           # Physics engine & world logic
│   ├── stores/         # Zustand state management
│   ├── pages/          # Route components
│   ├── components/
│   │   ├── game/       # 3D scene components
│   │   ├── hud/        # UI overlay components
│   │   ├── demos/      # Physics demonstrations
│   │   └── ui/         # Shared UI primitives
│   ├── contexts/       # Theme provider
│   └── i18n/           # Translations
├── server/             # Backend (multiplayer planned)
└── CLAUDE.md           # Development guide
```

## Design Philosophy

> "Making the invisible geometry of light visible and playable"

This game transforms abstract optical physics into spatial puzzles. Each block represents a real optical component, and solutions emerge from understanding how polarized light behaves. The aesthetic draws from low-poly architectural puzzle games, emphasizing clean geometry and soft lighting over photorealism.

## Debugging

```javascript
// Access game state in browser console
import { useGameStore } from '@/stores/gameStore'
const store = useGameStore.getState()
store.world.getAllLightStates()  // View all light beams
store.world.getAllBlocks()       // View all placed blocks
```

Visual debugging:
- Press `V` to see polarization colors
- Press `G` to show grid overlay
- Use isometric view for puzzle overview

## Backend Server (Planned)

```bash
cd server
npm install
npm run start:dev  # Starts on port 3001
```

## License

MIT License
