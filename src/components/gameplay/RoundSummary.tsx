import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { formatScore } from '@/lib/scoring/calculator';
import { ArrowUp, ArrowDown, Trophy } from 'lucide-react';

export function RoundSummary() {
  const { currentGame, getCurrentRound, nextRound, setView } = useGameStore();
  const currentRound = getCurrentRound();

  const handleNextRound = () => {
    if (currentGame && currentGame.currentRound >= 5) {
      // Game complete
      nextRound();
    } else {
      nextRound();
    }
  };

  const handleViewCallLog = () => {
    setView('call-log');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Round {currentGame?.currentRound}</h1>
          <p className="text-gray-500">Results</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Round Scores</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentRound?.scores.map((score) => {
              const isPositive = score.roundScore > 0;
              const isNegative = score.roundScore < 0;
              
              return (
                <div 
                  key={score.playerId}
                  className={`p-4 rounded-lg border-2 ${
                    score.callMet 
                      ? 'border-green-200 bg-green-50' 
                      : isNegative 
                      ? 'border-red-200 bg-red-50'
                      : 'border-orange-200 bg-orange-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center font-bold text-lg">
                        {score.playerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{score.playerName}</p>
                        <p className="text-sm text-gray-600">
                          Called {score.call}, Got {score.result}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {isPositive && '+'}{formatScore(score.roundScore)}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center justify-end space-x-1">
                        <span>Total:</span>
                        <span className="font-semibold">{formatScore(score.cumulativeScore)}</span>
                      </div>
                    </div>
                  </div>
                  {score.callMet && (
                    <div className="mt-2 text-xs font-medium text-green-700 flex items-center space-x-1">
                      <Trophy className="h-3 w-3" />
                      <span>Call Met!</span>
                    </div>
                  )}
                  {isNegative && (
                    <div className="mt-2 text-xs font-medium text-red-700 flex items-center space-x-1">
                      <ArrowDown className="h-3 w-3" />
                      <span>Failed Call</span>
                    </div>
                  )}
                  {!score.callMet && !isNegative && (
                    <div className="mt-2 text-xs font-medium text-orange-700 flex items-center space-x-1">
                      <ArrowUp className="h-3 w-3" />
                      <span>+{score.extraTricks} extra trick{score.extraTricks > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleViewCallLog} className="w-full">
            View Call Log
          </Button>
          <Button onClick={handleNextRound} className="w-full">
            {currentGame && currentGame.currentRound >= 5 ? 'Finish Game' : 'Next Round'}
          </Button>
        </div>
      </div>
    </div>
  );
}
