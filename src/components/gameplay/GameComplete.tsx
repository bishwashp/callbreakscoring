import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { formatScore } from '@/lib/scoring/calculator';
import { calculatePayouts, formatMoney } from '@/lib/game-logic/stakes-calculator';
import { Trophy, Medal, DollarSign } from 'lucide-react';

export function GameComplete() {
  const { currentGame, getWinner, setView } = useGameStore();
  const winner = getWinner();

  // Get final standings
  const lastRound = currentGame?.rounds[currentGame.rounds.length - 1];
  const standings = lastRound?.scores
    .slice()
    .sort((a, b) => b.cumulativeScore - a.cumulativeScore) || [];
  
  // Calculate money payouts if stakes are configured
  const payouts = currentGame?.stakes && lastRound?.scores
    ? calculatePayouts(lastRound.scores, currentGame.stakes)
    : null;

  const handleGoHome = () => {
    setView('home');
  };

  const handleViewCallLog = () => {
    setView('call-log');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary">Game Complete!</h1>
          {winner && (
            <div className="space-y-2">
              <p className="text-xl text-gray-700">🎉 Congratulations! 🎉</p>
              <p className="text-3xl font-bold text-primary">{winner.name}</p>
              {payouts && (
                <div className="mt-4 inline-block bg-green-100 border-2 border-green-300 rounded-lg px-6 py-3">
                  <p className="text-sm text-green-800 font-medium">Wins</p>
                  <p className="text-3xl font-bold text-green-700">
                    {currentGame.stakes!.currency}{payouts[0].amountPaid.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Final Standings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {standings.map((score, index) => {
              const payout = payouts?.find(p => p.playerId === score.playerId);
              return (
                <div
                  key={score.playerId}
                  className={`p-4 rounded-lg border-2 ${
                    index === 0
                      ? 'border-yellow-400 bg-yellow-50'
                      : index === 1
                      ? 'border-gray-300 bg-gray-50'
                      : index === 2
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <div className={`text-2xl font-bold ${
                          index === 0 ? 'text-yellow-600' :
                          index === 1 ? 'text-gray-500' :
                          index === 2 ? 'text-orange-600' :
                          'text-gray-400'
                        }`}>
                          {index === 0 && <Trophy className="h-8 w-8" />}
                          {index === 1 && <Medal className="h-8 w-8" />}
                          {index === 2 && <Medal className="h-7 w-7" />}
                          {index > 2 && `#${index + 1}`}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{score.playerName}</p>
                        <p className="text-sm text-gray-600">
                          {index === 0 ? '🎉 Champion' : 
                           index === 1 ? '🥈 Runner-up' : 
                           index === 2 ? '🥉 Third Place' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className={`text-2xl font-bold ${
                        score.cumulativeScore > 0 ? 'text-green-600' :
                        score.cumulativeScore < 0 ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {formatScore(score.cumulativeScore)}
                      </div>
                      {payout && currentGame?.stakes && (
                        <div className={`flex items-center justify-end space-x-1 text-sm font-semibold ${
                          payout.amountPaid > 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                          <DollarSign className="h-4 w-4" />
                          <span>{formatMoney(payout.amountPaid, currentGame.stakes.currency)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={handleViewCallLog} className="w-full">
            View Call Log
          </Button>
          <Button onClick={handleGoHome} className="w-full">
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

