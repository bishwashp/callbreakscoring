/**
 * Get the next dealer index (clockwise rotation)
 * 
 * @param currentDealerIndex - Current dealer's seating position
 * @param playerCount - Total number of players
 * @returns Next dealer's seating position
 */
export function getNextDealerIndex(
  currentDealerIndex: number,
  playerCount: number
): number {
  return (currentDealerIndex + 1) % playerCount;
}

/**
 * Get dealer index for a specific round
 * 
 * @param initialDealerIndex - Dealer index for round 1
 * @param roundNumber - Current round number (1-5)
 * @param playerCount - Total number of players
 * @returns Dealer index for the specified round
 */
export function getDealerForRound(
  initialDealerIndex: number,
  roundNumber: number,
  playerCount: number
): number {
  // Round 1 starts with initial dealer
  // Each subsequent round rotates clockwise
  const rotations = roundNumber - 1;
  return (initialDealerIndex + rotations) % playerCount;
}

