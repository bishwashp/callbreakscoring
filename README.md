# Call Break Score Tracker

A modern web application for tracking scores in the traditional Call Break card game.

## Features

- **4-5 Player Support**: Play with 4 or 5 players
- **Automatic Score Calculation**: Handles all scoring rules including decimal overflow
- **Real-time Validation**: Ensures valid calls and results
- **Auto-save**: Never lose your game progress
- **Call Log**: View complete game history
- **Mobile-first Design**: Optimized for use during physical card games
- **Offline Support**: Works without internet connection

## Game Rules

- **5 Rounds**: Each game consists of 5 rounds
- **Calls**: Players call between 1-13 tricks
- **Scoring**:
  - Call met exactly: +call points
  - Call exceeded: +call + 0.1 per extra trick
  - Call failed: -call points
- **Decimal Overflow**: When decimal portion reaches .13, it converts to 1.0 base point
- **Dealer Rotation**: Dealer rotates clockwise each round

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Dexie.js** - IndexedDB wrapper for persistence

## Project Structure

```
src/
├── components/       # React components
│   ├── game-setup/   # Setup flow components
│   ├── gameplay/     # Gameplay components
│   └── ui/          # Reusable UI components
├── lib/             # Business logic
│   ├── scoring/     # Score calculation
│   ├── game-logic/  # Game rules
│   └── db/         # Database layer
├── store/          # Zustand store
└── types/          # TypeScript definitions
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Requirements

See [REQUIREMENTS.md](./REQUIREMENTS.md) for complete requirements specification.

## License

MIT

## Contributing

Contributions welcome! Please read the contributing guidelines first.

