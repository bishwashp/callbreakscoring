import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import type { PlayerCall } from '@/types/game.types';
import { Crown } from 'lucide-react';

export function CallEntry() {
  const { currentGame, getCurrentDealer, enterCalls, error, setHasUnsavedChanges } = useGameStore();
  const dealer = getCurrentDealer();
  const [calls, setCalls] = useState<Record<string, number>>({});

  const handleCallChange = (playerId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const newCalls = { ...calls, [playerId]: numValue };
    setCalls(newCalls);
    
    // Mark as having unsaved changes if any call is entered
    const hasAnyCall = Object.values(newCalls).some(call => call > 0);
    setHasUnsavedChanges(hasAnyCall);
  };

  // Reset unsaved changes when component unmounts
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  const handleSubmit = () => {
    if (!currentGame) return;

    const playerCalls: PlayerCall[] = currentGame.players.map(player => ({
      playerId: player.id,
      call: calls[player.id] || 1,
    }));

    enterCalls(playerCalls);
  };

  const isValid = currentGame?.players.every(p => {
    const call = calls[p.id];
    return call >= 1 && call <= 13;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Round {currentGame?.currentRound}</h2>
            <p className="text-sm text-gray-500">Enter player calls</p>
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
            <CardTitle>Player Calls</CardTitle>
            <CardDescription>Round {currentGame?.currentRound}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentGame?.players.map((player) => (
              <div key={player.id} className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      player.seatingPosition === dealer?.seatingPosition
                        ? 'bg-primary text-white'
                        : 'bg-gray-100'
                    }`}>
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{player.name}</span>
                  </div>
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    min="1"
                    max="13"
                    placeholder="Call"
                    value={calls[player.id] || ''}
                    onChange={(e) => handleCallChange(player.id, e.target.value)}
                    className="text-center text-lg font-semibold"
                  />
                </div>
              </div>
            ))}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <p className="text-xs text-gray-500 text-center">
              Each player must call between 1 and 13 tricks
            </p>
            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              disabled={!isValid}
            >
              Done
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

