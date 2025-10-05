/**
 * Calculate score for a player in a round
 * 
 * Rules:
 * - Call met exactly: +call points
 * - Call exceeded: +call + 0.1 per extra trick
 * - Call failed: -call points
 * 
 * @param call - Player's call (1-13)
 * @param result - Actual tricks won (0-13)
 * @returns Round score (can be negative)
 */
export function calculateRoundScore(call: number, result: number): number {
  if (result < call) {
    return -call; // Failed to meet call
  }
  if (result === call) {
    return call; // Met call exactly
  }
  // Exceeded call: base + 0.1 per extra trick
  return call + (result - call) * 0.1;
}

/**
 * Apply decimal overflow rule
 * 
 * When decimal portion >= 0.13:
 * - Convert 0.13 → 1.0 base point
 * - Carry remaining decimal
 * 
 * Example: 8.13 + 0.02 = 8.15 → 9.02
 * Example: 8.11 + 5.02 = 13.13 → 14.00
 * 
 * @param score - Score with potential overflow
 * @returns Score with overflow applied
 */
export function applyDecimalOverflow(score: number): number {
  // Round to 2 decimal places to avoid floating point issues
  const roundedScore = Math.round(score * 100) / 100;
  
  const base = Math.floor(roundedScore);
  const decimal = Math.round((roundedScore - base) * 100);
  
  if (decimal >= 13) {
    const fullPoints = Math.floor(decimal / 13);
    const remaining = decimal % 13;
    return base + fullPoints + (remaining / 100);
  }
  
  return roundedScore;
}

/**
 * Calculate cumulative score with overflow handling
 * 
 * @param previousCumulative - Previous cumulative score
 * @param roundScore - Score from current round
 * @returns New cumulative score with overflow applied
 */
export function calculateCumulativeScore(
  previousCumulative: number,
  roundScore: number
): number {
  const newScore = previousCumulative + roundScore;
  return applyDecimalOverflow(newScore);
}

/**
 * Format score for display
 * 
 * @param score - Score to format
 * @returns Formatted score string (e.g., "3.0", "-5.0", "4.2")
 */
export function formatScore(score: number): string {
  return score.toFixed(1);
}

