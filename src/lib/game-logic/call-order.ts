/**
 * Get the calling order for players in a round
 * Player after dealer calls first, then counter-clockwise until dealer calls last
 * 
 * @param dealerIndex - The dealer's seating position
 * @param playerCount - Total number of players
 * @returns Array of player indices in calling order
 */
export function getCallingOrder(dealerIndex: number, playerCount: number): number[] {
  const order: number[] = [];
  
  // Start from player after dealer (clockwise, which is +1)
  let currentIndex = (dealerIndex + 1) % playerCount;
  
  // Go counter-clockwise from that position
  // In an array, counter-clockwise means going backwards (-1), but we started at +1
  // So we need to collect players: dealer+1, dealer, dealer-1, ..., dealer+2
  
  // Actually, let me reconsider: 
  // If dealer is at position 2, and we have 4 players (0,1,2,3)
  // Player after dealer (clockwise) = 3
  // Counter-clockwise from player 3: 3 -> 2 -> 1 -> 0
  // But dealer (2) should call last
  // So order is: 3 -> 0 -> 1 -> 2
  
  // Start from next player after dealer
  for (let i = 0; i < playerCount; i++) {
    const playerIndex = (dealerIndex + 1 + i) % playerCount;
    order.push(playerIndex);
  }
  
  return order;
}

/**
 * Get the index of the current caller based on how many calls have been made
 * 
 * @param dealerIndex - The dealer's seating position
 * @param playerCount - Total number of players
 * @param callsMade - Number of calls already made
 * @returns Index of player who should call next, or null if all calls are made
 */
export function getCurrentCallerIndex(
  dealerIndex: number,
  playerCount: number,
  callsMade: number
): number | null {
  if (callsMade >= playerCount) return null;
  
  const order = getCallingOrder(dealerIndex, playerCount);
  return order[callsMade];
}

/**
 * Check if a specific player can currently make their call
 * 
 * @param playerId - The player's ID
 * @param dealerIndex - The dealer's seating position
 * @param players - Array of all players
 * @param callsMade - Number of calls already made
 * @returns true if this player should call now
 */
export function canPlayerCall(
  playerSeatingPosition: number,
  dealerIndex: number,
  playerCount: number,
  callsMade: number
): boolean {
  const currentCallerIndex = getCurrentCallerIndex(dealerIndex, playerCount, callsMade);
  return currentCallerIndex === playerSeatingPosition;
}

