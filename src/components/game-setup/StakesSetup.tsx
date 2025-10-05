import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { DollarSign } from 'lucide-react';

export function StakesSetup() {
  const { currentGame, setStakes, startGame, goToPreviousView } = useGameStore();
  const playerCount = currentGame?.players.length || 4;
  
  // Default currency and amounts (one less than player count, as winner doesn't pay)
  const [currency, setCurrency] = useState('$');
  const [amounts, setAmounts] = useState<number[]>(
    Array(playerCount - 1).fill(0).map((_, i) => (playerCount - 1 - i) * 5)
  );
  const [skipStakes, setSkipStakes] = useState(false);

  const handleAmountChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newAmounts = [...amounts];
    newAmounts[index] = numValue;
    setAmounts(newAmounts);
  };

  const handleContinue = () => {
    if (!skipStakes) {
      setStakes({
        currency,
        amounts,
      });
    }
    startGame();
  };

  const handleSkip = () => {
    setSkipStakes(true);
    startGame();
  };

  const totalPot = amounts.reduce((sum, amt) => sum + amt, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span>Stakes Setup</span>
          </CardTitle>
          <CardDescription>
            Define how much each rank pays (optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Currency Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Currency Symbol</label>
            <div className="flex space-x-2">
              {['$', '€', '£', 'Rs', '¥'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setCurrency(sym)}
                  className={`px-4 py-2 rounded-md border-2 transition-all ${
                    currency === sym
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Amounts */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Payment by Rank</label>
            {amounts.map((amount, index) => {
              const rank = index + 1; // 1st lowest, 2nd lowest, etc.
              const position = playerCount - index; // 4th place, 3rd place, 2nd place
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">
                      {position === playerCount ? 'Lowest scorer' : 
                       position === playerCount - 1 ? '2nd lowest' :
                       position === playerCount - 2 ? '3rd lowest' : 
                       `${position}th place`}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-gray-600">{currency}</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount || ''}
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                        className="text-lg font-semibold"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Pot */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">Winner receives:</span>
              <span className="text-2xl font-bold text-green-700">
                {currency}{totalPot.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Example */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Example:</strong> At game end, lowest scorer pays {currency}{amounts[0]}, 
              second lowest pays {currency}{amounts[1] || 0}, etc. Winner collects all!
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <Button onClick={handleContinue} className="w-full" size="lg">
              Start Game
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={goToPreviousView} className="flex-1">
                Back
              </Button>
              <Button variant="ghost" onClick={handleSkip} className="flex-1">
                Skip Stakes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
