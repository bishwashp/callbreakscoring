import { create } from 'zustand';
import type { Game, Player, PlayerCall, PlayerResult, GameView, Round, StakesConfig } from '@/types/game.types';
import { gameRepository } from '@/lib/db/repositories/game.repository';
import { createRound, calculateRoundScores, getCumulativeScores } from '@/lib/game-logic/round-manager';
import { getDealerForRound } from '@/lib/game-logic/dealer-rotation';
import { validateCalls, validateResults } from '@/lib/scoring/validator';

interface GameStore {
  // State
  currentGame: Game | null;
  currentView: GameView;
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
  
  // Setup Actions
  setPlayerCount: (count: number) => void;
  setPlayers: (players: Player[]) => void;
  setInitialDealer: (dealerIndex: number) => void;
  updateSeatingOrder: (players: Player[]) => void;
  setStakes: (stakes: StakesConfig) => void;
  startGame: () => void;
  
  // Gameplay Actions
  enterCalls: (calls: PlayerCall[]) => void;
  enterResults: (results: PlayerResult[]) => void;
  nextRound: () => void;
  
  // Navigation Actions
  setView: (view: GameView) => void;
  goToNextView: () => void;
  goToPreviousView: () => void;
  
  // Game Management
  saveGame: () => Promise<void>;
  loadActiveGame: () => Promise<void>;
  endGame: () => void;
  newGame: () => void;
  restartGameWithSamePlayers: () => void;
  deleteActiveGame: () => void;
  goHome: () => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  
  // Selectors
  getCurrentDealer: () => Player | null;
  getCurrentRound: () => Round | null;
  isGameComplete: () => boolean;
  getWinner: () => Player | null;
}

const viewFlow: GameView[] = [
  'player-count',
  'player-details',
  'player-roles',
  'stakes-setup',
  'player-calls',
  'player-results',
  'round-summary',
];

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial State
  currentGame: null,
  currentView: 'home',
  isLoading: false,
  error: null,
  hasUnsavedChanges: false,
  
  // Setup Actions
  setPlayerCount: (count: number) => {
    const players: Player[] = Array.from({ length: count }, (_, i) => ({
      id: `player-${i}`,
      name: '',
      seatingPosition: i,
    }));
    
    set({
      currentGame: {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        status: 'setup',
        players,
        rounds: [],
        currentRound: 1,
        initialDealerIndex: 0,
      },
    });
  },
  
  setPlayers: (players: Player[]) => {
    const { currentGame } = get();
    if (!currentGame) return;
    
    set({
      currentGame: {
        ...currentGame,
        players,
      },
    });
  },
  
  setInitialDealer: (dealerIndex: number) => {
    const { currentGame } = get();
    if (!currentGame) return;
    
    set({
      currentGame: {
        ...currentGame,
        initialDealerIndex: dealerIndex,
      },
    });
  },
  
  updateSeatingOrder: (players: Player[]) => {
    const { currentGame } = get();
    if (!currentGame) return;
    
    const updatedPlayers = players.map((p, index) => ({
      ...p,
      seatingPosition: index,
    }));
    
    set({
      currentGame: {
        ...currentGame,
        players: updatedPlayers,
      },
    });
  },
  
  setStakes: (stakes: StakesConfig) => {
    const { currentGame } = get();
    if (!currentGame) return;
    
    set({
      currentGame: {
        ...currentGame,
        stakes,
      },
    });
  },
  
  startGame: () => {
    const { currentGame, saveGame } = get();
    if (!currentGame) return;
    
    // Create first round
    const round1 = createRound(1, currentGame.initialDealerIndex);
    
    set({
      currentGame: {
        ...currentGame,
        status: 'in-progress',
        rounds: [round1],
      },
      currentView: 'player-calls',
    });
    
    saveGame();
  },
  
  // Gameplay Actions
  enterCalls: (calls: PlayerCall[]) => {
    const { currentGame, saveGame } = get();
    if (!currentGame) return;
    
    // Validate calls
    const validation = validateCalls(calls, currentGame.players.length);
    if (!validation.valid) {
      set({ error: validation.errors.join(', ') });
      return;
    }
    
    // Update current round with calls
    const updatedRounds = [...currentGame.rounds];
    const currentRoundIndex = currentGame.currentRound - 1;
    updatedRounds[currentRoundIndex] = {
      ...updatedRounds[currentRoundIndex],
      calls,
      status: 'calls-entered',
    };
    
    set({
      currentGame: {
        ...currentGame,
        rounds: updatedRounds,
      },
      currentView: 'player-results',
      error: null,
      hasUnsavedChanges: false,
    });
    
    saveGame();
  },
  
  enterResults: (results: PlayerResult[]) => {
    const { currentGame, saveGame } = get();
    if (!currentGame) return;
    
    // Validate results
    const validation = validateResults(results, currentGame.players.length);
    if (!validation.valid) {
      set({ error: validation.errors.join(', ') });
      return;
    }
    
    // Calculate scores
    const currentRoundIndex = currentGame.currentRound - 1;
    const currentRound = currentGame.rounds[currentRoundIndex];
    const previousScores = currentRoundIndex > 0 
      ? getCumulativeScores(currentGame.rounds.slice(0, currentRoundIndex))
      : new Map();
    
    const scores = calculateRoundScores(
      currentGame.players,
      currentRound.calls,
      results,
      previousScores
    );
    
    // Update round
    const updatedRounds = [...currentGame.rounds];
    updatedRounds[currentRoundIndex] = {
      ...currentRound,
      results,
      scores,
      status: 'completed',
    };
    
    set({
      currentGame: {
        ...currentGame,
        rounds: updatedRounds,
      },
      currentView: 'round-summary',
      error: null,
      hasUnsavedChanges: false,
    });
    
    saveGame();
  },
  
  nextRound: () => {
    const { currentGame, saveGame } = get();
    if (!currentGame) return;
    
    const nextRoundNumber = currentGame.currentRound + 1;
    
    // Check if game is complete
    if (nextRoundNumber > 5) {
      set({
        currentGame: {
          ...currentGame,
          status: 'completed',
          completedAt: new Date(),
        },
        currentView: 'game-complete',
      });
      saveGame();
      return;
    }
    
    // Create next round
    const nextDealerIndex = getDealerForRound(
      currentGame.initialDealerIndex,
      nextRoundNumber,
      currentGame.players.length
    );
    
    const newRound = createRound(nextRoundNumber, nextDealerIndex);
    
    set({
      currentGame: {
        ...currentGame,
        currentRound: nextRoundNumber,
        rounds: [...currentGame.rounds, newRound],
      },
      currentView: 'player-calls',
    });
    
    saveGame();
  },
  
  // Navigation Actions
  setView: (view: GameView) => {
    set({ currentView: view });
  },
  
  goToNextView: () => {
    const { currentView } = get();
    const currentIndex = viewFlow.indexOf(currentView);
    if (currentIndex < viewFlow.length - 1) {
      set({ currentView: viewFlow[currentIndex + 1] });
    }
  },
  
  goToPreviousView: () => {
    const { currentView } = get();
    const currentIndex = viewFlow.indexOf(currentView);
    if (currentIndex > 0) {
      set({ currentView: viewFlow[currentIndex - 1] });
    }
  },
  
  // Game Management
  saveGame: async () => {
    const { currentGame } = get();
    if (!currentGame) return;
    
    try {
      await gameRepository.save(currentGame);
    } catch (error) {
      console.error('Failed to save game:', error);
      set({ error: 'Failed to save game' });
    }
  },
  
  loadActiveGame: async () => {
    set({ isLoading: true });
    
    try {
      const game = await gameRepository.getActive();
      if (game) {
        set({ currentGame: game, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      set({ error: 'Failed to load game', isLoading: false });
    }
  },
  
  endGame: () => {
    const { currentGame, saveGame } = get();
    if (!currentGame) return;
    
    set({
      currentGame: {
        ...currentGame,
        status: 'completed',
        completedAt: new Date(),
      },
      currentView: 'game-complete',
    });
    
    saveGame();
  },
  
  newGame: () => {
    set({
      currentGame: null,
      currentView: 'player-count',
      error: null,
    });
  },
  
  restartGameWithSamePlayers: () => {
    const { currentGame, saveGame } = get();
    if (!currentGame) return;
    
    // Create a new game with the same players and settings
    const newGameId = crypto.randomUUID();
    const round1 = createRound(1, currentGame.initialDealerIndex);
    
    set({
      currentGame: {
        id: newGameId,
        createdAt: new Date(),
        status: 'in-progress',
        players: currentGame.players, // Keep same players
        rounds: [round1],
        currentRound: 1,
        initialDealerIndex: currentGame.initialDealerIndex, // Keep same dealer
        stakes: currentGame.stakes, // Keep same stakes if they exist
      },
      currentView: 'player-calls',
      error: null,
      hasUnsavedChanges: false,
    });
    
    saveGame();
  },
  
  deleteActiveGame: async () => {
    const { currentGame } = get();
    if (!currentGame) return;
    
    try {
      await gameRepository.delete(currentGame.id);
      set({ currentGame: null, currentView: 'home', error: null });
    } catch (error) {
      console.error('Failed to delete game:', error);
      set({ error: 'Failed to delete game' });
    }
  },
  
  goHome: () => {
    set({ currentView: 'home', hasUnsavedChanges: false });
  },
  
  setHasUnsavedChanges: (hasChanges: boolean) => {
    set({ hasUnsavedChanges: hasChanges });
  },
  
  // Selectors
  getCurrentDealer: () => {
    const { currentGame } = get();
    if (!currentGame) return null;
    
    const currentRound = currentGame.rounds[currentGame.currentRound - 1];
    if (!currentRound) return null;
    
    return currentGame.players[currentRound.dealerIndex] || null;
  },
  
  getCurrentRound: () => {
    const { currentGame } = get();
    if (!currentGame) return null;
    
    return currentGame.rounds[currentGame.currentRound - 1] || null;
  },
  
  isGameComplete: () => {
    const { currentGame } = get();
    return currentGame?.status === 'completed';
  },
  
  getWinner: () => {
    const { currentGame } = get();
    if (!currentGame || currentGame.status !== 'completed') return null;
    
    const lastRound = currentGame.rounds[currentGame.rounds.length - 1];
    if (!lastRound || lastRound.scores.length === 0) return null;
    
    // Find player with highest cumulative score
    const winnerScore = lastRound.scores.reduce((max, score) => 
      score.cumulativeScore > max.cumulativeScore ? score : max
    );
    
    return currentGame.players.find(p => p.id === winnerScore.playerId) || null;
  },
}));
