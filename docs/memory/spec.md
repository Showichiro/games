# Memory/Concentration Game Specification

## Overview
A classic card matching game where players flip cards to find matching pairs. Cards are face-down initially, and players must remember card positions to make successful matches.

## Game Rules

### Basic Gameplay
1. Grid of face-down cards (pairs of matching cards)
2. Player clicks to flip cards (maximum 2 at a time)
3. If cards match: they remain face-up and player gets points
4. If cards don't match: they flip back face-down after brief delay
5. Game ends when all pairs are found

### Scoring System
- **Base Points**: 10 points per successful match
- **Time Bonus**: Additional points based on completion time
- **Move Penalty**: -1 point for each failed attempt after 20 moves
- **Perfect Game Bonus**: +50 points if completed with minimum moves

### Difficulty Levels
- **Easy**: 4x3 grid (6 pairs)
- **Medium**: 4x4 grid (8 pairs) 
- **Hard**: 6x4 grid (12 pairs)

## Technical Architecture

### Framework Stack
- Next.js 15 with App Router
- React 19 with TypeScript
- Tailwind CSS v4 for styling
- Motion library for animations

### Route Structure
```
/memory
├── page.tsx           # Main game page
├── components/
│   ├── GameBoard.tsx     # Main game container
│   ├── Card.tsx          # Individual card component
│   ├── ScoreDisplay.tsx  # Score and stats
│   ├── DifficultySelect.tsx # Difficulty selection
│   └── GameControls.tsx  # Reset, pause, hint buttons
├── hooks/
│   ├── useGameState.ts   # Game logic and state
│   └── useLocalStorage.ts # Persistent high scores
└── types/
    └── game.ts          # TypeScript interfaces
```

## Implementation Phases

### Phase 1: Core Game (Priority: HIGH)
- [ ] Basic card flip mechanics
- [ ] Match detection logic
- [ ] Simple scoring system
- [ ] Grid layout (4x3 easy mode)

### Phase 2: Enhanced Features (Priority: MEDIUM)
- [ ] Multiple difficulty levels
- [ ] Timer and move counter
- [ ] High score persistence
- [ ] Game controls (reset, pause)

### Phase 3: Polish & Animations (Priority: LOW)
- [ ] Advanced animations
- [ ] Sound effects integration
- [ ] Hint system
- [ ] Statistics tracking
EOF < /dev/null
