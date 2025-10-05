import type { ValidationResult, PlayerCall, PlayerResult } from '@/types/game.types';

/**
 * Validate player calls
 * 
 * Rules:
 * - Each call must be between 1 and 13
 * - All players must have calls
 * - No duplicate player IDs
 * 
 * @param calls - Array of player calls
 * @param playerCount - Expected number of players
 * @returns Validation result
 */
export function validateCalls(
  calls: PlayerCall[],
  playerCount: number
): ValidationResult {
  const errors: string[] = [];
  
  // Check player count
  if (calls.length !== playerCount) {
    errors.push(`Expected ${playerCount} calls, got ${calls.length}`);
  }
  
  // Check for duplicate players
  const playerIds = new Set(calls.map(c => c.playerId));
  if (playerIds.size !== calls.length) {
    errors.push('Duplicate player IDs found');
  }
  
  // Validate each call
  calls.forEach((call, index) => {
    if (call.call < 1 || call.call > 13) {
      errors.push(`Player ${index + 1}: Call must be between 1 and 13`);
    }
    if (!Number.isInteger(call.call)) {
      errors.push(`Player ${index + 1}: Call must be a whole number`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate player results
 * 
 * Rules:
 * - Each result must be between 0 and 13
 * - Sum of all results must equal 13 exactly
 * - All players must have results
 * - No duplicate player IDs
 * 
 * @param results - Array of player results
 * @param playerCount - Expected number of players
 * @returns Validation result
 */
export function validateResults(
  results: PlayerResult[],
  playerCount: number
): ValidationResult {
  const errors: string[] = [];
  
  // Check player count
  if (results.length !== playerCount) {
    errors.push(`Expected ${playerCount} results, got ${results.length}`);
  }
  
  // Check for duplicate players
  const playerIds = new Set(results.map(r => r.playerId));
  if (playerIds.size !== results.length) {
    errors.push('Duplicate player IDs found');
  }
  
  // Validate each result
  let total = 0;
  results.forEach((result, index) => {
    if (result.tricksWon < 0 || result.tricksWon > 13) {
      errors.push(`Player ${index + 1}: Result must be between 0 and 13`);
    }
    if (!Number.isInteger(result.tricksWon)) {
      errors.push(`Player ${index + 1}: Result must be a whole number`);
    }
    total += result.tricksWon;
  });
  
  // Check total equals 13
  if (results.length > 0 && total !== 13) {
    errors.push(`Total tricks must equal 13 (current: ${total})`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate player names
 * 
 * Rules:
 * - Names must not be empty
 * - Names should be unique (warning, not error)
 * 
 * @param names - Array of player names
 * @returns Validation result
 */
export function validatePlayerNames(names: string[]): ValidationResult {
  const errors: string[] = [];
  
  // Check for empty names
  names.forEach((name, index) => {
    if (!name || name.trim() === '') {
      errors.push(`Player ${index + 1}: Name cannot be empty`);
    }
  });
  
  // Check for duplicate names (warning)
  const uniqueNames = new Set(names.map(n => n.trim().toLowerCase()));
  if (uniqueNames.size !== names.length) {
    errors.push('Warning: Some players have the same name');
  }
  
  return {
    valid: errors.length === 0 || errors[0].startsWith('Warning'),
    errors,
  };
}

