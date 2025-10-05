import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

export function PlayerCountSelector() {
  const [playerCount, setPlayerCount] = useState(4);
  const { setPlayerCount: setStorePlayerCount, goToNextView } = useGameStore();

  const handleIncrement = () => {
    if (playerCount < 5) {
      setPlayerCount(playerCount + 1);
    }
  };

  const handleDecrement = () => {
    if (playerCount > 4) {
      setPlayerCount(playerCount - 1);
    }
  };

  const handleContinue = () => {
    setStorePlayerCount(playerCount);
    goToNextView();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Call Break</CardTitle>
          <CardDescription className="mt-2">
            You need at least four players to play Call Break
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <label className="text-sm font-medium text-gray-700">Number of Players</label>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={playerCount <= 4}
                className="h-12 w-12"
              >
                <Minus className="h-5 w-5" />
              </Button>
              <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-200">
                <span className="text-5xl font-bold text-primary">{playerCount}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={playerCount >= 5}
                className="h-12 w-12"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <Button onClick={handleContinue} className="w-full" size="lg">
            Enter Player Details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

