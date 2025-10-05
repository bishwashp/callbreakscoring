// Game Status Types
export type GameStatus = 'setup' | 'in-progress' | 'completed';
export type RoundStatus = 'pending' | 'calls-entered' | 'results-entered' | 'completed';

// Player Interface
export interface Player {
  id: string;
  name: string;
  seatingPosition: number; // 0-4
}

// Stakes/Money Configuration
export interface StakesConfig {
  currency: string; // e.g., "$", "Rs", "€"
  amounts: number[]; // Array of amounts each rank pays (lowest to highest rank)
}

// Game Interface
export interface Game {
  id: string;
  createdAt: Date;
  completedAt?: Date;
  status: GameStatus;
  players: Player[];
  rounds: Round[];
  currentRound: number; // 1-5
  initialDealerIndex: number;
  stakes?: StakesConfig; // Optional money configuration
}

// Round Interface
export interface Round {
  roundNumber: number; // 1-5
  dealerIndex: number;
  status: RoundStatus;
  calls: PlayerCall[];
  results: PlayerResult[];
  scores: RoundScore[];
}

// Player Call Interface
export interface PlayerCall {
  playerId: string;
  call: number; // 1-13
}

// Player Result Interface
export interface PlayerResult {
  playerId: string;
  tricksWon: number; // 0-13
}

// Round Score Interface
export interface RoundScore {
  playerId: string;
  playerName: string;
  call: number;
  result: number;
  roundScore: number; // Can be negative
  cumulativeScore: number;
  callMet: boolean;
  extraTricks: number;
}

// Validation Result
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Game View State
export type GameView = 
  | 'home'
  | 'player-count'
  | 'player-details'
  | 'player-roles'
  | 'stakes-setup'
  | 'player-calls'
  | 'player-results'
  | 'round-summary'
  | 'call-log'
  | 'game-complete'
  | 'game-history';

