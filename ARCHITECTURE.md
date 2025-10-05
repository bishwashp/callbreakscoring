# Call Break Score Tracker - Architecture Document

## 1. System Overview

**Type**: Frontend-only Progressive Web Application  
**Framework**: React 18 + TypeScript  
**Build Tool**: Vite  
**Deployment**: Static hosting (Vercel/Netlify)

### Design Principles
1. **Frontend-only**: No backend required
2. **Offline-first**: Works without internet
3. **Mobile-first**: Optimized for smartphone use
4. **Type-safe**: Full TypeScript coverage
5. **Testable**: Pure business logic separated from UI

---

## 2. Technology Stack

```yaml
Core:
  - React: ^18.3.1
  - TypeScript: ^5.5.3
  - Vite: ^5.4.1

State Management:
  - Zustand: ^4.5.2

Storage:
  - Dexie.js: ^4.0.8 (IndexedDB wrapper)

UI Framework:
  - Tailwind CSS: ^3.4.1
  - shadcn/ui: Latest (copy-paste components)
  - Lucide React: ^0.436.0 (icons)

Testing:
  - Vitest: ^2.0.5
  - @testing-library/react: ^16.0.1

PWA:
  - vite-plugin-pwa: ^0.20.1
```

---

## 3. Architecture Layers

```
┌─────────────────────────────────────────────────┐
│              Presentation Layer                 │
│  ┌──────────────────────────────────────────┐   │
│  │  React Components                        │   │
│  │  - GameSetup                             │   │
│  │  - CallEntry, ResultEntry                │   │
│  │  - CallLog, RoundSummary                 │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│           Application State Layer               │
│  ┌──────────────────────────────────────────┐   │
│  │  Zustand Store (gameStore.ts)            │   │
│  │  - Game state                            │   │
│  │  - Actions (startGame, enterCalls, etc)  │   │
│  │  - Computed values (dealer, scores)      │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│            Business Logic Layer                 │
│  ┌──────────────────────────────────────────┐   │
│  │  Pure Functions (No React dependencies)  │   │
│  │  - scoreCalculator.ts                    │   │
│  │  - validators.ts                         │   │
│  │  - dealerRotation.ts                     │   │
│  │  - decimalOverflow.ts                    │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│           Data Persistence Layer                │
│  ┌──────────────────────────────────────────┐   │
│  │  Repository Pattern                      │   │
│  │  - GameRepository                        │   │
│  │  - HistoryRepository                     │   │
│  │  Uses: Dexie.js → IndexedDB              │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

---

## 4. Project Structure

```
call-break/
├── public/
│   ├── icons/              # PWA icons
│   └── manifest.json       # PWA manifest
│
├── src/
│   ├── components/         # React components
│   │   ├── game-setup/
│   │   │   ├── GameSetup.tsx
│   │   │   ├── PlayerCountSelector.tsx
│   │   │   ├── PlayerNameInput.tsx
│   │   │   ├── DealerAssignment.tsx
│   │   │   └── SeatingArrangement.tsx
│   │   │
│   │   ├── gameplay/
│   │   │   ├── CallEntry.tsx
│   │   │   ├── ResultEntry.tsx
│   │   │   ├── DealerIndicator.tsx
│   │   │   └── RoundProgress.tsx
│   │   │
│   │   ├── scoreboard/
│   │   │   ├── CallLog.tsx
│   │   │   ├── RoundSummary.tsx
│   │   │   ├── ScoreCard.tsx
│   │   │   └── GameComplete.tsx
│   │   │
│   │   ├── history/
│   │   │   ├── GameHistory.tsx
│   │   │   └── GameHistoryCard.tsx
│   │   │
│   │   └── ui/             # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── table.tsx
│   │       └── ...
│   │
│   ├── lib/                # Business logic & utilities
│   │   ├── scoring/
│   │   │   ├── calculator.ts        # Score calculation
│   │   │   ├── decimal-overflow.ts  # .13 → 1.0 conversion
│   │   │   └── validator.ts         # Input validation
│   │   │
│   │   ├── game-logic/
│   │   │   ├── dealer-rotation.ts   # Dealer rotation logic
│   │   │   └── round-manager.ts     # Round progression
│   │   │
│   │   ├── db/
│   │   │   ├── database.ts          # Dexie schema
│   │   │   └── repositories/
│   │   │       ├── game.repository.ts
│   │   │       └── history.repository.ts
│   │   │
│   │   └── utils/
│   │       ├── cn.ts                # className utility
│   │       └── format.ts            # Date/number formatting
│   │
│   ├── store/
│   │   └── gameStore.ts    # Zustand store
│   │
│   ├── hooks/
│   │   ├── useGame.ts      # Game state hook
│   │   ├── useGameHistory.ts
│   │   └── useAutoSave.ts  # Auto-save hook
│   │
│   ├── types/
│   │   └── game.types.ts   # All TypeScript interfaces
│   │
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles (Tailwind)
│
├── tests/
│   ├── scoring.test.ts     # Business logic tests
│   └── components/         # Component tests
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 5. Data Models

### Core Interfaces

```typescript
// Game Status
type GameStatus = 'setup' | 'in-progress' | 'completed';
type RoundStatus = 'pending' | 'calls-entered' | 'results-entered' | 'completed';

// Player
interface Player {
  id: string;
  name: string;
  seatingPosition: number;  // 0-4
}

// Game
interface Game {
  id: string;
  createdAt: Date;
  completedAt?: Date;
  status: GameStatus;
  players: Player[];
  rounds: Round[];
  currentRound: number;      // 1-5
  initialDealerIndex: number;
}

// Round
interface Round {
  roundNumber: number;       // 1-5
  dealerIndex: number;
  status: RoundStatus;
  calls: PlayerCall[];
  results: PlayerResult[];
  scores: RoundScore[];
}

// Player Call
interface PlayerCall {
  playerId: string;
  call: number;              // 1-13
}

// Player Result
interface PlayerResult {
  playerId: string;
  tricksWon: number;         // 0-13
}

// Round Score
interface RoundScore {
  playerId: string;
  playerName: string;
  call: number;
  result: number;
  roundScore: number;        // Can be negative
  cumulativeScore: number;
  callMet: boolean;
  extraTricks: number;
}
```

---

## 6. State Management (Zustand)

### Store Structure

```typescript
interface GameStore {
  // State
  currentGame: Game | null;
  isLoading: boolean;
  error: string | null;
  
  // Game Setup Actions
  startNewGame: (players: Player[]) => void;
  setDealerIndex: (index: number) => void;
  updateSeatingOrder: (players: Player[]) => void;
  
  // Gameplay Actions
  enterCalls: (calls: PlayerCall[]) => void;
  enterResults: (results: PlayerResult[]) => void;
  nextRound: () => void;
  
  // Navigation
  goToRound: (roundNumber: number) => void;
  viewCallLog: () => void;
  
  // Game Management
  saveGame: () => Promise<void>;
  loadGame: (gameId: string) => Promise<void>;
  resumeActiveGame: () => Promise<void>;
  endGame: () => void;
  
  // Computed (Selectors)
  getCurrentDealer: () => Player | null;
  getCurrentRound: () => Round | null;
  getRoundScores: (roundNumber: number) => RoundScore[];
  getCumulativeScores: () => RoundScore[];
  getWinner: () => Player | null;
  isGameComplete: () => boolean;
}
```

### Key Features
- **Auto-save**: Automatically saves after each action
- **Persistence**: Loads active game on app start
- **Computed values**: Derived state using selectors
- **Type-safe**: Full TypeScript support

---

## 7. Business Logic

### Scoring Algorithm

```typescript
/**
 * Calculate score for a player in a round
 * 
 * Rules:
 * - Call met exactly: +call points
 * - Call exceeded: +call + 0.1 per extra trick
 * - Call failed: -call points
 */
function calculateRoundScore(call: number, result: number): number {
  if (result < call) {
    return -call;  // Failed
  }
  if (result === call) {
    return call;   // Met exactly
  }
  return call + (result - call) * 0.1;  // Exceeded
}

/**
 * Apply decimal overflow rule
 * 
 * When decimal portion >= 0.13:
 * - Convert 0.13 → 1.0 base point
 * - Carry remaining decimal
 * 
 * Example: 8.13 + 0.02 = 8.15 → 9.02
 */
function applyDecimalOverflow(score: number): number {
  const base = Math.floor(score);
  const decimal = Math.round((score - base) * 100);
  
  if (decimal >= 13) {
    const fullPoints = Math.floor(decimal / 13);
    const remaining = decimal % 13;
    return base + fullPoints + (remaining / 100);
  }
  
  return score;
}
```

### Validation Rules

```typescript
// Validate calls
function validateCalls(calls: PlayerCall[]): ValidationResult {
  - Each call: 1 ≤ call ≤ 13
  - All players must have calls
  - No duplicate player IDs
}

// Validate results
function validateResults(results: PlayerResult[]): ValidationResult {
  - Each result: 0 ≤ result ≤ 13
  - Sum of results must equal 13 exactly
  - All players must have results
  - No duplicate player IDs
}
```

### Dealer Rotation

```typescript
function getNextDealerIndex(
  currentDealerIndex: number,
  playerCount: number
): number {
  return (currentDealerIndex + 1) % playerCount;
}
```

---

## 8. Data Persistence (IndexedDB)

### Dexie Schema

```typescript
class CallBreakDatabase extends Dexie {
  games!: Table<Game>;
  
  constructor() {
    super('CallBreakDB');
    this.version(1).stores({
      games: 'id, status, createdAt, completedAt'
    });
  }
}

const db = new CallBreakDatabase();
```

### Repository Pattern

```typescript
class GameRepository {
  // Save/update game
  async save(game: Game): Promise<void>
  
  // Load specific game
  async findById(id: string): Promise<Game | null>
  
  // Get active game (in-progress)
  async getActive(): Promise<Game | null>
  
  // Get completed games
  async getHistory(): Promise<Game[]>
  
  // Delete game
  async delete(id: string): Promise<void>
}
```

### Auto-save Strategy
- **Trigger**: After every state change
- **Debounce**: 500ms (avoid excessive writes)
- **Optimistic UI**: Update UI immediately, save in background
- **Error handling**: Show toast on save failure

---

## 9. UI/UX Architecture

### Design System

**Colors**:
```css
Primary: Purple (#7c3aed)
Success: Green (#22c55e)
Error: Red (#ef4444)
Warning: Orange (#f59e0b)
Background: Light gray (#f9fafb)
Text: Dark gray (#1f2937)
```

**Typography**:
```css
Font Family: Inter (system-ui fallback)
Sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
Weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
```

**Spacing**: Tailwind's 4px scale (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, ...)

**Breakpoints**:
```css
sm: 640px   (mobile landscape)
md: 768px   (tablet)
lg: 1024px  (desktop)
```

### Component Patterns

1. **Container-Presenter Pattern**
   - Container: Logic, state, data fetching
   - Presenter: Pure UI, receives props

2. **Composition over Configuration**
   - Small, reusable components
   - Compose complex UIs from simple parts

3. **Controlled Components**
   - All form inputs controlled by React state
   - Single source of truth

### Responsive Strategy

- **Mobile-first**: Design for 375px, scale up
- **Touch targets**: Minimum 44x44px
- **Font scaling**: Responsive text sizes
- **Flexible layouts**: Flexbox/Grid for adaptability

---

## 10. State Flow Examples

### Example 1: Starting a New Game

```
User clicks "Enter Player Details"
    ↓
GameSetup.tsx → onSubmit()
    ↓
gameStore.startNewGame(players)
    ↓
Store creates new Game object
    ↓
gameRepository.save(game)
    ↓
IndexedDB stores game
    ↓
Store updates currentGame state
    ↓
React re-renders → Shows CallEntry
```

### Example 2: Entering Results

```
User enters tricks won for each player
    ↓
ResultEntry.tsx validates (sum === 13)
    ↓
gameStore.enterResults(results)
    ↓
Store calls calculateRoundScore()
    ↓
Store applies applyDecimalOverflow()
    ↓
Store updates cumulative scores
    ↓
Store rotates dealer
    ↓
gameRepository.save(game)
    ↓
React re-renders → Shows RoundSummary
```

---

## 11. Performance Considerations

### Optimization Strategies

1. **Memoization**
   ```typescript
   const scoreboard = useMemo(() => 
     calculateScoreboard(rounds),
     [rounds]
   );
   ```

2. **Code Splitting**
   ```typescript
   const GameHistory = lazy(() => import('./GameHistory'));
   ```

3. **Virtual Lists**
   - Use for large game history (100+ games)
   - Render only visible items

4. **Debouncing**
   - Auto-save debounced (500ms)
   - Search/filter debounced (300ms)

### Performance Targets

- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3.5s
- **Interaction Latency**: <100ms
- **Bundle Size**: <200KB gzipped

---

## 12. Error Handling

### Error Boundaries

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

### Error Types

1. **Validation Errors**: Show inline, prevent submission
2. **Storage Errors**: Show toast, retry option
3. **Unexpected Errors**: Error boundary, reload option

### User Feedback

- **Success**: Toast notification (auto-dismiss)
- **Error**: Toast notification (manual dismiss)
- **Loading**: Skeleton screens, spinners
- **Empty states**: Helpful messages with actions

---

## 13. Testing Strategy

### Unit Tests (Business Logic)
```typescript
// lib/scoring/*.test.ts
describe('calculateRoundScore', () => {
  test('call met exactly', () => {...});
  test('call exceeded', () => {...});
  test('call failed', () => {...});
});

describe('applyDecimalOverflow', () => {
  test('converts .13 to 1.0', () => {...});
  test('handles multiple overflows', () => {...});
});
```

### Integration Tests (Store)
```typescript
// store/gameStore.test.ts
describe('gameStore', () => {
  test('startNewGame creates game', () => {...});
  test('enterResults calculates scores', () => {...});
  test('nextRound rotates dealer', () => {...});
});
```

### Component Tests
```typescript
// components/*.test.tsx
describe('CallEntry', () => {
  test('validates minimum call', () => {...});
  test('submits valid calls', () => {...});
});
```

### Test Coverage Target
- **Business Logic**: 90%+
- **Store**: 80%+
- **Components**: 70%+

---

## 14. Deployment

### Build Process

```bash
npm run build
```

**Output**: `/dist` directory (static files)

### Hosting Options

1. **Vercel** (Recommended)
   - Zero-config deployment
   - Automatic HTTPS
   - Global CDN
   - Free tier

2. **Netlify**
   - Drag-and-drop deploy
   - Form handling
   - Split testing

3. **GitHub Pages**
   - Free for public repos
   - Custom domain support

### Environment Variables

```env
# None required for MVP (frontend-only)
```

### PWA Configuration

```typescript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'robots.txt'],
  manifest: {
    name: 'Call Break Score Tracker',
    short_name: 'Call Break',
    description: 'Track scores for Call Break card games',
    theme_color: '#7c3aed',
    background_color: '#ffffff',
    display: 'standalone',
    icons: [...]
  }
})
```

---

## 15. Security Considerations

### Data Privacy
- **Local-only**: All data stored locally (IndexedDB)
- **No tracking**: No analytics/telemetry
- **No cookies**: No user tracking

### Content Security
- **CSP headers**: Restrict script sources (via hosting provider)
- **Input sanitization**: Validate all user inputs
- **XSS prevention**: React escapes by default

---

## 16. Future Enhancements (Post-MVP)

### Phase 2: Enhanced Features
- Export game log (CSV/PDF)
- Dark mode
- Player statistics dashboard
- Game search/filter

### Phase 3: Social Features
- Share game results (image)
- Leaderboards (optional cloud sync)
- Multi-device sync

### Phase 4: Advanced
- AI call suggestions
- Tournament mode
- Custom game variants
- Voice input

---

## 17. Development Workflow

### Setup
```bash
npm create vite@latest call-break -- --template react-ts
cd call-break
npm install
```

### Development
```bash
npm run dev     # Start dev server
npm run test    # Run tests
npm run lint    # Lint code
```

### Build & Deploy
```bash
npm run build   # Production build
npm run preview # Preview build locally
```

---

## 18. Key Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| **Frontend-only** | No backend needs, simpler deployment, works offline |
| **Zustand over Redux** | Less boilerplate, simpler API, sufficient for this app |
| **Dexie over raw IndexedDB** | Better DX, TypeScript support, easier queries |
| **shadcn/ui** | Copy-paste components, full control, no runtime overhead |
| **Vite over CRA** | Faster builds, better DX, modern tooling |
| **Mobile-first** | Primary use case during physical card games |

---

## 19. Success Metrics

### Technical Metrics
- ✅ <3s load time
- ✅ <100ms interaction latency
- ✅ 100% score calculation accuracy
- ✅ 0 data loss incidents

### User Metrics
- ✅ Users complete games without confusion
- ✅ Prefer app over paper scoring
- ✅ Use app multiple times

---

**Document Version**: 1.0  
**Last Updated**: October 5, 2025  
**Status**: Final - Implementation Ready
