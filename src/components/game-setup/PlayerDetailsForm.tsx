import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { validatePlayerNames } from '@/lib/scoring/validator';

export function PlayerDetailsForm() {
  const { currentGame, setPlayers, goToNextView, goToPreviousView } = useGameStore();
  const [playerNames, setPlayerNames] = useState<string[]>(
    currentGame?.players.map(p => p.name) || []
  );
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
    setError(null);
  };

  const handleSubmit = () => {
    const validation = validatePlayerNames(playerNames);
    
    if (!validation.valid && !validation.errors[0].startsWith('Warning')) {
      setError(validation.errors[0]);
      return;
    }

    if (currentGame) {
      const updatedPlayers = currentGame.players.map((player, index) => ({
        ...player,
        name: playerNames[index].trim() || `Player ${index + 1}`,
      }));
      setPlayers(updatedPlayers);
      goToNextView();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Player Details</CardTitle>
          <CardDescription>Enter the names of all players</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentGame?.players.map((player, index) => (
            <div key={player.id} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Player {index + 1}
              </label>
              <Input
                placeholder={`Enter name for Player ${index + 1}`}
                value={playerNames[index] || ''}
                onChange={(e) => handleNameChange(index, e.target.value)}
              />
            </div>
          ))}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={goToPreviousView} className="flex-1">
              Back
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

