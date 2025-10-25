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
 * When accumulated extra tricks reach 13 (decimal >= 1.3):
 * - Convert 1.3 → 1.0 base point
 * - Carry remaining decimal
 *
 * Example: 8.13 → 9.03 (13 extra tricks = 1 base point + 3 extra remaining)
 *
 * @param score - Score with potential overflow
 * @returns Score with overflow applied
 */
export function applyDecimalOverflow(score: number): number {
  // Round to 2 decimal places to avoid floating point issues
  const roundedScore = Math.round(score * 100) / 100;
  
  const base = Math.floor(roundedScore);
  const decimal = Math.round((roundedScore - base) * 100);
  
  // Check if decimal portion represents >= 13 extra tricks (>= 1.30)
  // Since decimal can only be 0-99, we check if it would be >= 130 after adding to base
  // This happens when the integer score would naturally overflow (e.g., 4.9 + 0.4 = 5.3)
  if (decimal >= 130) {
    const fullPoints = Math.floor(decimal / 130);
    const remaining = decimal % 130;
    return base + fullPoints + (remaining / 100);
  }
  
  return roundedScore;
}

/**
 * Calculate cumulative score
 *
 * @param previousCumulative - Previous cumulative score
 * @param roundScore - Score from current round
 * @returns New cumulative score
 */
export function calculateCumulativeScore(
  previousCumulative: number,
  roundScore: number
): number {
  // Simply add scores - no artificial overflow
  const newScore = previousCumulative + roundScore;
  // Round to avoid floating point precision issues
  return Math.round(newScore * 100) / 100;
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

