# Call Break Score Tracker - Requirements Document

## 1. Executive Summary

A digital score tracking application for the traditional Call Break card game. This app manages player setup, call tracking, score calculation, and game history across multiple sessions.

---

## 2. Game Rules & Structure

### 2.1 Core Game Rules
- **Game Type**: Call Break (standard rules)
- **Deck**: Standard 52-card deck
- **Players**: 4-5 players
  - 4 players: 13 cards each
  - 5 players: 10 cards each, 2 cards discarded
- **Rounds per Game**: 5 rounds (standard)
- **Total Tricks per Round**: 13 tricks (always)

### 2.2 Scoring System

#### Base Scoring Rules:
1. **Call Met Exactly**: Player receives points equal to their call
   - Call 3, Get 3 = **3.0 points**

2. **Call Exceeded**: Player receives call points + 0.1 per extra trick
   - Call 3, Get 4 = **3.1 points**
   - Call 3, Get 5 = **3.2 points**

3. **Call Failed**: Player receives negative points equal to their call
   - Call 3, Get 2 = **-3.0 points**

4. **Decimal Overflow Rule**: Extra tricks accumulate after decimal point
   - When decimal tricks reach 13 → Convert to 1 full point
   - Example: Player has 8.13 in cumulative score
   - Next round: +0.1 becomes 8.14 which converts to **9.1**
   - The .13 + .01 = .14 becomes .1 with +1 added to base

5. **Negative Scores**: Allowed
   - Players can have negative cumulative scores
   - Negative scores have real-world implications (double payment)

#### Validation Rules:
- **Minimum Call**: 1 (players cannot call 0)
- **Maximum Call**: 13 (all tricks)
- **Total Calls per Round**: No restriction (can exceed 13)
- **Total Results per Round**: Must equal 13 exactly

### 2.3 Game Flow

#### Phase 1: Game Setup
1. Set number of players (4-5)
2. Enter player names
3. Assign initial dealer
4. Arrange seating order (drag-and-drop)

#### Phase 2: Round Play (×5 rounds)
Each round consists of:
1. **Call Phase**: Each player declares their call (1-13)
2. **Play Phase**: (Physical card game - not tracked by app)
3. **Result Entry**: Enter actual tricks won by each player
4. **Score Calculation**: Automatic calculation and cumulative update
5. **Dealer Rotation**: Dealer moves clockwise

#### Phase 3: Game Completion
1. Display final scores
2. Declare winner (highest score)
3. Option to start new game or view history

---

## 3. Functional Requirements

### 3.1 Player Management
- **FR-1.1**: System shall allow 4-5 players per game
- **FR-1.2**: System shall require unique player names
- **FR-1.3**: System shall validate minimum 4 players before proceeding
- **FR-1.4**: System shall allow drag-and-drop seating arrangement
- **FR-1.5**: System shall designate one player as initial dealer
- **FR-1.6**: System shall visually indicate dealer position

### 3.2 Call Management
- **FR-2.1**: System shall allow each player to enter calls (1-13)
- **FR-2.2**: System shall validate minimum call of 1
- **FR-2.3**: System shall validate maximum call of 13
- **FR-2.4**: System shall display all player calls before proceeding
- **FR-2.5**: System shall allow editing calls before confirmation

### 3.3 Result Entry
- **FR-3.1**: System shall allow result entry for each player (0-13)
- **FR-3.2**: System shall validate total results equal exactly 13
- **FR-3.3**: System shall display validation error if total ≠ 13
- **FR-3.4**: System shall show running total during entry
- **FR-3.5**: System shall allow editing results before confirmation

### 3.4 Score Calculation
- **FR-4.1**: System shall automatically calculate scores based on rules (Section 2.2)
- **FR-4.2**: System shall handle decimal point accumulation
- **FR-4.3**: System shall convert .13 → .0 + 1.0 base point
- **FR-4.4**: System shall maintain cumulative scores across rounds
- **FR-4.5**: System shall support negative scores
- **FR-4.6**: System shall display round score and cumulative score separately

### 3.5 Dealer Rotation
- **FR-5.1**: System shall rotate dealer clockwise after each round
- **FR-5.2**: System shall maintain dealer order based on seating arrangement
- **FR-5.3**: System shall visually indicate current dealer

### 3.6 Game Progression
- **FR-6.1**: System shall track current round (1-5)
- **FR-6.2**: System shall prevent skipping rounds
- **FR-6.3**: System shall lock previous rounds from editing
- **FR-6.4**: System shall declare winner after round 5
- **FR-6.5**: System shall show final standings with winner highlighted

### 3.7 Data Persistence
- **FR-7.1**: System shall save game state after each round
- **FR-7.2**: System shall allow resuming interrupted games
- **FR-7.3**: System shall maintain game history across sessions
- **FR-7.4**: System shall store multiple completed games
- **FR-7.5**: System shall allow viewing past game logs

### 3.8 Call Log & History
- **FR-8.1**: System shall display call log table with all rounds
- **FR-8.2**: System shall show calls, results, and scores per round
- **FR-8.3**: System shall calculate and display total scores
- **FR-8.4**: System shall allow "Show All" to view complete history
- **FR-8.5**: System shall allow exporting game data

---

## 4. UI/UX Requirements

### 4.1 Core UX Principles
- **Mobile-first design**: Optimized for smartphone use during games
- **One-hand operation**: Key actions accessible with thumb
- **Minimal cognitive load**: Clear, step-by-step flow
- **Error prevention**: Validation before confirmation
- **Visual feedback**: Immediate response to all actions

### 4.2 Enhanced UI/UX Considerations

#### Input Optimization
1. **Quick Number Entry**
   - Large, touch-friendly number pad for calls/results
   - Quick-select buttons for common calls (1-5)
   - Keyboard shortcuts for power users
   - Gesture support: swipe up/down to adjust numbers

2. **Smart Validation**
   - Real-time validation with color coding
   - Red highlight when total ≠ 13
   - Green checkmark when valid
   - Helpful error messages (e.g., "Total is 14, need to reduce by 1")
   - Auto-calculate remaining tricks needed

3. **Undo/Edit Functionality**
   - Undo last entry (within round)
   - Edit current round before moving to next
   - Warning before confirming irreversible actions
   - Quick edit from call log view

#### Visual Enhancements
4. **Score Visualization**
   - Color coding:
     - Green: Positive score/call met
     - Red: Negative score/call failed
     - Orange: Call exceeded
   - Progress bars showing score relative to leader
   - Sparkline graphs showing score trends across rounds
   - Visual indicators for score changes (+1.2, -3.0)

5. **Dealer & Turn Indicators**
   - Animated dealer chip icon
   - Highlight active player during entry
   - Visual progression indicator (Round 1/5)
   - Breadcrumb navigation showing current phase

6. **Call Log Improvements**
   - Sticky header for player names
   - Horizontal scroll for many rounds
   - Tap cell to see call vs result details
   - Highlight highest/lowest scores
   - Show delta from leader
   - Filter view: current game only vs all history

#### Interaction Patterns
7. **Gesture Controls**
   - Swipe left/right to navigate between players
   - Long-press to edit entry
   - Pull down to refresh/undo
   - Pinch to zoom call log table

8. **Smart Defaults**
   - Remember player names from previous games
   - Suggest player order from last game
   - Pre-fill common call values
   - Auto-advance after valid entry

#### Accessibility & Modes
9. **Dark Mode**
   - System-aware dark/light theme
   - High contrast mode for outdoor use
   - Large text option for accessibility

10. **Haptic & Audio Feedback**
    - Subtle vibration on button press
    - Success sound on round completion
    - Warning sound on validation error
    - Celebration animation on game win

#### Data Presentation
11. **Statistics & Insights**
    - Player performance metrics:
      - Call accuracy rate (calls met %)
      - Average score per round
      - Win rate across games
      - Favorite call numbers
    - Game statistics:
      - Most/least aggressive player
      - Comeback player (biggest recovery)
      - Consistency rating

12. **Export & Sharing**
    - Export game log as CSV/PDF
    - Share scorecard as image
    - Copy game summary to clipboard
    - Save game with custom name/date

#### Navigation & Flow
13. **Progressive Disclosure**
    - Show only relevant options per phase
    - Collapsible sections for advanced features
    - Tutorial overlay for first-time users
    - Help tooltips (long-press "?" icon)

14. **Quick Actions**
    - Floating action button for primary task
    - Quick restart game option
    - Jump to current round from call log
    - "New Game with Same Players" shortcut

#### Error Handling
15. **Graceful Error States**
    - Offline mode indicator
    - Auto-save draft entries
    - Recover from crashes
    - Clear error messages with solutions
    - Network-independent operation (no cloud required)

#### Performance
16. **Responsive Design**
    - Instant feedback (<100ms)
    - Smooth animations (60fps)
    - Lazy loading for game history
    - Optimized for low-end devices

---

## 5. Technical Requirements

### 5.1 Platform
- **Primary**: Web application (responsive)
- **Target Devices**: Mobile (320px+), Tablet, Desktop
- **Browsers**: Modern browsers (Chrome, Safari, Firefox, Edge)
- **Offline Support**: Progressive Web App (PWA)

### 5.2 Technology Stack (Recommendations)
- **Frontend**: React/Vue/Svelte + TypeScript
- **State Management**: Redux/Zustand/Pinia
- **Storage**: IndexedDB (via Dexie.js) or LocalStorage
- **Styling**: Tailwind CSS + shadcn/ui components
- **Testing**: Jest + React Testing Library
- **Build**: Vite

### 5.3 Performance
- **Load Time**: <2 seconds on 3G
- **Interaction Response**: <100ms
- **Storage**: <10MB for 100 games
- **Battery**: Minimal impact (no background processes)

### 5.4 Data Storage
- **Local Storage**: All game data stored locally
- **No Cloud**: No server dependency (optional future enhancement)
- **Backup**: Export/import functionality for data portability

---

## 6. Data Models

### 6.1 Game Model
```typescript
interface Game {
  id: string;
  createdAt: Date;
  completedAt?: Date;
  status: 'setup' | 'in-progress' | 'completed';
  players: Player[];
  rounds: Round[];
  currentRound: number;
  dealerIndex: number;
}
```

### 6.2 Player Model
```typescript
interface Player {
  id: string;
  name: string;
  seatingPosition: number;
  totalScore: number;
  roundScores: RoundScore[];
}
```

### 6.3 Round Model
```typescript
interface Round {
  roundNumber: number;
  dealerIndex: number;
  calls: PlayerCall[];
  results: PlayerResult[];
  scores: RoundScore[];
  status: 'pending' | 'calls-entered' | 'completed';
}
```

### 6.4 Player Call/Result Model
```typescript
interface PlayerCall {
  playerId: string;
  call: number; // 1-13
}

interface PlayerResult {
  playerId: string;
  tricksWon: number; // 0-13
}
```

### 6.5 Score Model
```typescript
interface RoundScore {
  playerId: string;
  call: number;
  result: number;
  roundScore: number; // Can be negative
  cumulativeScore: number;
  callMet: boolean;
  extraTricks: number;
}
```

### 6.6 Game History Model
```typescript
interface GameHistory {
  games: Game[];
  playerStats: PlayerStatistics[];
}

interface PlayerStatistics {
  playerName: string;
  gamesPlayed: number;
  gamesWon: number;
  averageScore: number;
  callAccuracy: number; // % of calls met exactly
  totalPoints: number;
}
```

---

## 7. User Stories

### 7.1 Game Setup
- **US-1.1**: As a user, I want to select 4-5 players so I can start a new game
- **US-1.2**: As a user, I want to enter player names so I can track individual scores
- **US-1.3**: As a user, I want to arrange seating order so it matches physical seating
- **US-1.4**: As a user, I want to assign the initial dealer so rotation is accurate

### 7.2 Playing Rounds
- **US-2.1**: As a user, I want to enter calls for each player quickly and accurately
- **US-2.2**: As a user, I want to enter results with validation so I don't make mistakes
- **US-2.3**: As a user, I want to see real-time score calculations so I know standings
- **US-2.4**: As a user, I want clear visual feedback on who the dealer is

### 7.3 Tracking Progress
- **US-3.1**: As a user, I want to view the call log to see all rounds at a glance
- **US-3.2**: As a user, I want to see cumulative scores to know who's winning
- **US-3.3**: As a user, I want to see negative scores highlighted so I know who's losing
- **US-3.4**: As a user, I want to export game data to share with friends

### 7.4 Game Management
- **US-4.1**: As a user, I want games to auto-save so I don't lose progress
- **US-4.2**: As a user, I want to resume interrupted games from where I left off
- **US-4.3**: As a user, I want to view past game history to compare performances
- **US-4.4**: As a user, I want to start a new game with the same players quickly

### 7.5 UX Enhancements
- **US-5.1**: As a user, I want undo functionality so I can correct mistakes
- **US-5.2**: As a user, I want dark mode for playing at night
- **US-5.3**: As a user, I want score trends to see momentum shifts
- **US-5.4**: As a user, I want one-hand operation for mobile convenience

---

## 8. Non-Functional Requirements

### 8.1 Usability
- **NFR-1.1**: App shall be usable without training/tutorial
- **NFR-1.2**: Common tasks shall require ≤3 taps/clicks
- **NFR-1.3**: All text shall be readable at arm's length on mobile

### 8.2 Reliability
- **NFR-2.1**: App shall not lose data on crash/refresh
- **NFR-2.2**: App shall work offline (no internet required)
- **NFR-2.3**: App shall recover from invalid states gracefully

### 8.3 Performance
- **NFR-3.1**: All interactions shall respond within 100ms
- **NFR-3.2**: App shall load within 2 seconds on 3G
- **NFR-3.3**: App shall support 1000+ games in history without lag

### 8.4 Maintainability
- **NFR-4.1**: Code shall be modular and well-documented
- **NFR-4.2**: Scoring logic shall be unit tested
- **NFR-4.3**: UI components shall be reusable

### 8.5 Accessibility
- **NFR-5.1**: App shall meet WCAG 2.1 Level AA standards
- **NFR-5.2**: App shall support screen readers
- **NFR-5.3**: App shall work with keyboard navigation

---

## 9. Future Enhancements (Out of Scope for MVP)

1. **Multiplayer Sync**: Real-time score sync across devices
2. **AI Suggestions**: Predict optimal calls based on history
3. **Tournaments**: Multi-game tournament tracking
4. **Social Features**: Leaderboards, achievements, badges
5. **Variants**: Support for regional Call Break variations
6. **Voice Input**: Voice-controlled score entry
7. **Camera Integration**: Scan cards to auto-detect results
8. **Themes**: Custom color themes and card designs
9. **Localization**: Multi-language support
10. **Cloud Backup**: Optional cloud sync for data backup

---

## 10. Validation Rules Summary

| Field | Min | Max | Special Rules |
|-------|-----|-----|---------------|
| Players | 4 | 5 | Unique names required |
| Calls | 1 | 13 | Per player |
| Results | 0 | 13 | Total must = 13 |
| Rounds | 5 | 5 | Fixed for standard game |
| Score | -∞ | +∞ | Negative allowed |
| Decimal | .0 | .12 | .13 converts to 1.0 + rollover |

---

## 11. Calculation Examples

### Example 1: Standard Round
```
Round 1:
- Player A: Call 4, Result 4 → +4.0 (Total: 4.0)
- Player B: Call 3, Result 5 → +3.2 (Total: 3.2)
- Player C: Call 5, Result 3 → -5.0 (Total: -5.0)
- Player D: Call 1, Result 1 → +1.0 (Total: 1.0)
Total tricks: 4+5+3+1 = 13 ✓
```

### Example 2: Decimal Overflow
```
Player cumulative score: 8.11

Round 5:
- Call 5, Result 7 → +5.2
- New score: 8.11 + 5.2 = 13.13
- After overflow: 14.0 (the .13 becomes .0, adding 1 to base)
```

### Example 3: Negative Score Recovery
```
Round 1: Call 5, Result 3 → -5.0 (Total: -5.0)
Round 2: Call 3, Result 3 → +3.0 (Total: -2.0)
Round 3: Call 4, Result 4 → +4.0 (Total: 2.0)
```

---

## 12. Success Criteria

The app is considered successful if:
1. ✅ Users can complete a 5-round game without confusion
2. ✅ Score calculations are 100% accurate
3. ✅ No data loss occurs during normal operation
4. ✅ Users prefer this over paper score tracking
5. ✅ App loads and runs smoothly on mid-range smartphones

---

## 13. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex decimal logic confuses users | High | Clear visual examples in UI |
| Data loss on browser clear | High | Export functionality, clear warnings |
| Calculation errors | Critical | Comprehensive unit tests |
| Poor mobile performance | High | Performance budgets, optimization |
| Users don't understand flow | Medium | Onboarding tutorial, tooltips |

---

## 14. Glossary

- **Call**: Player's prediction of tricks they'll win (1-13)
- **Trick**: One round of cards played (13 per game round)
- **Dealer**: Player who deals cards (rotates clockwise)
- **Round**: One complete deal and play (5 per game)
- **Call Met**: Player wins exactly their called number of tricks
- **Call Failed**: Player wins fewer tricks than called
- **Extra Tricks**: Tricks won beyond called amount
- **Decimal Overflow**: When decimal portion reaches .13, converts to 1.0

---

**Document Version**: 1.0  
**Last Updated**: October 5, 2025  
**Status**: Final - Ready for Development
