import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { formatScore } from '@/lib/scoring/calculator';
import { ArrowLeft } from 'lucide-react';

export function CallLog() {
  const { currentGame, setView } = useGameStore();

  const handleBack = () => {
    const { currentGame } = useGameStore.getState();
    if (currentGame?.status === 'completed') {
      setView('game-complete');
    } else {
      setView('round-summary');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Call Log</h1>
            <p className="text-gray-500">Complete game history</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Rounds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Player</th>
                    {currentGame?.rounds.map((round) => (
                      <th key={round.roundNumber} className="text-center p-3 font-semibold">
                        R{round.roundNumber}
                      </th>
                    ))}
                    <th className="text-center p-3 font-semibold bg-primary-50">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {currentGame?.players.map((player) => {
                    // Get final cumulative score
                    const completedRounds = currentGame.rounds.filter(r => r.scores.length > 0);
                    const lastRound = completedRounds[completedRounds.length - 1];
                    const finalScore = lastRound?.scores.find(s => s.playerId === player.id)?.cumulativeScore || 0;

                    return (
                      <tr key={player.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-sm">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{player.name}</span>
                          </div>
                        </td>
                        {currentGame.rounds.map((round) => {
                          const score = round.scores.find(s => s.playerId === player.id);
                          if (!score) {
                            return (
                              <td key={round.roundNumber} className="text-center p-3 text-gray-400">
                                -
                              </td>
                            );
                          }
                          
                          return (
                            <td key={round.roundNumber} className="text-center p-3">
                              <div className="space-y-1">
                                <div className={`font-semibold ${
                                  score.roundScore > 0 ? 'text-green-600' : 
                                  score.roundScore < 0 ? 'text-red-600' : 
                                  'text-gray-600'
                                }`}>
                                  {formatScore(score.cumulativeScore)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {score.call}/{score.result}
                                </div>
                              </div>
                            </td>
                          );
                        })}
                        <td className="text-center p-3 bg-primary-50">
                          <div className={`text-lg font-bold ${
                            finalScore > 0 ? 'text-green-600' : 
                            finalScore < 0 ? 'text-red-600' : 
                            'text-gray-600'
                          }`}>
                            {formatScore(finalScore)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p>• Large number: Cumulative score</p>
              <p>• Small number: Call / Result</p>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" onClick={handleBack} className="w-full">
          Back to Round Summary
        </Button>
      </div>
    </div>
  );
}

