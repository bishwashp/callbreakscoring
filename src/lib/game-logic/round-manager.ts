import type { Round, Player, PlayerCall, PlayerResult, RoundScore } from '@/types/game.types';
import { calculateRoundScore, calculateCumulativeScore } from '../scoring/calculator';

/**
 * Create a new round
 * 
 * @param roundNumber - Round number (1-5)
 * @param dealerIndex - Dealer's seating position
 * @returns New round object
 */
export function createRound(roundNumber: number, dealerIndex: number): Round {
  return {
    roundNumber,
    dealerIndex,
    status: 'pending',
    calls: [],
    results: [],
    scores: [],
  };
}

/**
 * Calculate scores for a round
 * 
 * @param players - Array of players
 * @param calls - Player calls for the round
 * @param results - Player results for the round
 * @param previousScores - Cumulative scores from previous rounds
 * @returns Array of round scores
 */
export function calculateRoundScores(
  players: Player[],
  calls: PlayerCall[],
  results: PlayerResult[],
  previousScores: Map<string, number>
): RoundScore[] {
  return players.map(player => {
    const call = calls.find(c => c.playerId === player.id);
    const result = results.find(r => r.playerId === player.id);
    
    if (!call || !result) {
      throw new Error(`Missing call or result for player ${player.name}`);
    }
    
    const roundScore = calculateRoundScore(call.call, result.tricksWon);
    const previousCumulative = previousScores.get(player.id) || 0;
    const cumulativeScore = calculateCumulativeScore(previousCumulative, roundScore);
    
    return {
      playerId: player.id,
      playerName: player.name,
      call: call.call,
      result: result.tricksWon,
      roundScore,
      cumulativeScore,
      callMet: result.tricksWon === call.call,
      extraTricks: Math.max(0, result.tricksWon - call.call),
    };
  });
}

/**
 * Get cumulative scores up to a specific round
 * 
 * @param rounds - Array of completed rounds
 * @returns Map of player ID to cumulative score
 */
export function getCumulativeScores(rounds: Round[]): Map<string, number> {
  const scores = new Map<string, number>();
  
  rounds.forEach(round => {
    round.scores.forEach(score => {
      scores.set(score.playerId, score.cumulativeScore);
    });
  });
  
  return scores;
}

