import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import type { PlayerResult } from '@/types/game.types';
import { Crown } from 'lucide-react';

export function ResultEntry() {
  const { currentGame, getCurrentDealer, getCurrentRound, enterResults, error, setHasUnsavedChanges } = useGameStore();
  const dealer = getCurrentDealer();
  const currentRound = getCurrentRound();
  const [results, setResults] = useState<Record<string, number>>({});

  const handleResultChange = (playerId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const newResults = { ...results, [playerId]: numValue };
    setResults(newResults);
    
    // Mark as having unsaved changes if any result is entered
    const hasAnyResult = Object.values(newResults).some(result => result > 0);
    setHasUnsavedChanges(hasAnyResult);
  };

  // Reset unsaved changes when component unmounts
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  const handleSubmit = () => {
    if (!currentGame) return;

    const playerResults: PlayerResult[] = currentGame.players.map(player => ({
      playerId: player.id,
      tricksWon: results[player.id] || 0,
    }));

    enterResults(playerResults);
  };

  // Calculate total
  const total = Object.values(results).reduce((sum, val) => sum + (val || 0), 0);
  const isValidTotal = total === 13;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Round {currentGame?.currentRound}</h2>
            <p className="text-sm text-gray-500">Enter results</p>
          </div>
          {dealer && (
            <div className="flex items-center space-x-2 text-primary">
              <Crown className="h-5 w-5 fill-current" />
              <span className="text-sm font-semibold">{dealer.name} (Dealer)</span>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Player Results</CardTitle>
            <CardDescription>Round {currentGame?.currentRound}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentGame?.players.map((player) => {
              const call = currentRound?.calls.find(c => c.playerId === player.id)?.call;
              return (
                <div key={player.id} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          player.seatingPosition === dealer?.seatingPosition
                            ? 'bg-primary text-white'
                            : 'bg-gray-100'
                        }`}>
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <p className="text-xs text-gray-500">Called: {call}</p>
                        </div>
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          min="0"
                          max="13"
                          placeholder="0"
                          value={results[player.id] ?? ''}
                          onChange={(e) => handleResultChange(player.id, e.target.value)}
                          className="text-center text-lg font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            <div className={`p-4 rounded-lg text-center font-semibold ${
              isValidTotal ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              Total: {total} / 13
              {!isValidTotal && <p className="text-xs mt-1">Total must equal 13</p>}
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              disabled={!isValidTotal}
            >
              Done
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
