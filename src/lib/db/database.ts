import Dexie, { type EntityTable } from 'dexie';
import type { Game } from '@/types/game.types';

// Database class
class CallBreakDatabase extends Dexie {
  games!: EntityTable<Game, 'id'>;

  constructor() {
    super('CallBreakDB');
    
    this.version(1).stores({
      games: 'id, status, createdAt, completedAt',
    });
  }
}

// Export singleton instance
export const db = new CallBreakDatabase();

