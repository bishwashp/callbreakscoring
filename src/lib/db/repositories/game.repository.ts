import { db } from '../database';
import type { Game } from '@/types/game.types';

/**
 * Game Repository
 * Handles all database operations for games
 */
export class GameRepository {
  /**
   * Save or update a game
   */
  async save(game: Game): Promise<void> {
    await db.games.put(game);
  }

  /**
   * Find game by ID
   */
  async findById(id: string): Promise<Game | undefined> {
    return await db.games.get(id);
  }

  /**
   * Get the active (in-progress) game
   */
  async getActive(): Promise<Game | undefined> {
    return await db.games
      .where('status')
      .equals('in-progress')
      .first();
  }

  /**
   * Get all completed games
   */
  async getHistory(): Promise<Game[]> {
    return await db.games
      .where('status')
      .equals('completed')
      .reverse()
      .sortBy('completedAt');
  }

  /**
   * Get all games including in-progress (for history view)
   */
  async getAllGames(): Promise<Game[]> {
    const games = await db.games.toArray();
    return games.sort((a, b) => {
      // Sort by completion date (most recent first), or creation date if not completed
      const aDate = a.completedAt || a.createdAt;
      const bDate = b.completedAt || b.createdAt;
      return bDate.getTime() - aDate.getTime();
    });
  }

  /**
   * Get all games
   */
  async getAll(): Promise<Game[]> {
    return await db.games.toArray();
  }

  /**
   * Delete a game
   */
  async delete(id: string): Promise<void> {
    await db.games.delete(id);
  }

  /**
   * Delete all games
   */
  async deleteAll(): Promise<void> {
    await db.games.clear();
  }
}

// Export singleton instance
export const gameRepository = new GameRepository();

