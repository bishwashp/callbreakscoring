import type { RoundScore, StakesConfig } from '@/types/game.types';

export interface PlayerPayout {
  playerId: string;
  playerName: string;
  rank: number; // 1 = winner, 2 = 2nd place, etc.
  score: number;
  amountPaid: number; // Negative if paying, positive if receiving
}

/**
 * Calculate money payouts based on final standings and stakes config
 * 
 * @param finalScores - Final scores from last round
 * @param stakes - Stakes configuration
 * @returns Array of payouts for each player
 */
export function calculatePayouts(
  finalScores: RoundScore[],
  stakes: StakesConfig
): PlayerPayout[] {
  // Sort by score (highest to lowest)
  const sorted = [...finalScores].sort((a, b) => b.cumulativeScore - a.cumulativeScore);
  
  const payouts: PlayerPayout[] = [];
  let totalPot = 0;
  
  // Calculate payments (everyone except winner)
  sorted.forEach((score, index) => {
    const rank = index + 1;
    
    if (rank === 1) {
      // Winner - will receive the pot
      payouts.push({
        playerId: score.playerId,
        playerName: score.playerName,
        rank,
        score: score.cumulativeScore,
        amountPaid: 0, // Will be calculated after
      });
    } else {
      // Losers pay based on their rank
      const paymentIndex = sorted.length - rank; // Reverse order: last place pays most
      const amount = stakes.amounts[paymentIndex] || 0;
      totalPot += amount;
      
      payouts.push({
        playerId: score.playerId,
        playerName: score.playerName,
        rank,
        score: score.cumulativeScore,
        amountPaid: -amount, // Negative = paying
      });
    }
  });
  
  // Winner receives the pot
  payouts[0].amountPaid = totalPot;
  
  return payouts;
}

/**
 * Format money amount with currency
 */
export function formatMoney(amount: number, currency: string): string {
  const absAmount = Math.abs(amount);
  const sign = amount >= 0 ? '+' : '-';
  return `${sign}${currency}${absAmount.toFixed(2)}`;
}
