import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { gameRepository } from '@/lib/db/repositories/game.repository';
import type { Game } from '@/types/game.types';
import { formatScore } from '@/lib/scoring/calculator';
import { ArrowLeft, Calendar, Users, Trophy } from 'lucide-react';

export function GameHistory() {
  const { setView } = useGameStore();
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const history = await gameRepository.getHistory();
    setGames(history);
  };

  const handleBack = () => {
    if (selectedGame) {
      setSelectedGame(null);
    } else {
      setView('home');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWinner = (game: Game) => {
    const lastRound = game.rounds[game.rounds.length - 1];
    if (!lastRound?.scores || lastRound.scores.length === 0) return null;
    
    const winner = lastRound.scores.reduce((max, score) => 
      score.cumulativeScore > max.cumulativeScore ? score : max
    );
    
    return winner;
  };

  // Show game details view
  if (selectedGame) {
    const winner = getWinner(selectedGame);
    const lastRound = selectedGame.rounds[selectedGame.rounds.length - 1];
    const standings = lastRound?.scores
      ?.slice()
      .sort((a, b) => b.cumulativeScore - a.cumulativeScore) || [];

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Game Details</h1>
              <p className="text-sm text-gray-500">{formatDate(selectedGame.completedAt || selectedGame.createdAt)}</p>
            </div>
          </div>

          {/* Winner Card */}
          {winner && (
            <Card className="border-yellow-400 border-2 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Winner</p>
                      <p className="text-2xl font-bold text-yellow-700">{winner.playerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">
                      {formatScore(winner.cumulativeScore)}
                    </p>
                    {selectedGame.stakes && (
                      <p className="text-sm text-gray-600">
                        Won {selectedGame.stakes.currency}
                        {selectedGame.stakes.amounts.reduce((sum, amt) => sum + amt, 0).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Standings */}
          <Card>
            <CardHeader>
              <CardTitle>Final Standings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {standings.map((score, index) => (
                <div
                  key={score.playerId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <span className="font-medium">{score.playerName}</span>
                  </div>
                  <span className={`text-lg font-bold ${
                    score.cumulativeScore > 0 ? 'text-green-600' :
                    score.cumulativeScore < 0 ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {formatScore(score.cumulativeScore)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Round by Round */}
          <Card>
            <CardHeader>
              <CardTitle>Round Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Player</th>
                      {selectedGame.rounds.map((round) => (
                        <th key={round.roundNumber} className="text-center p-2">R{round.roundNumber}</th>
                      ))}
                      <th className="text-center p-2 bg-primary-50">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedGame.players.map((player) => {
                      const finalScore = standings.find(s => s.playerId === player.id);
                      return (
                        <tr key={player.id} className="border-b">
                          <td className="p-2 font-medium">{player.name}</td>
                          {selectedGame.rounds.map((round) => {
                            const score = round.scores.find(s => s.playerId === player.id);
                            return (
                              <td key={round.roundNumber} className="text-center p-2">
                                {score ? (
                                  <div>
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
                                ) : '-'}
                              </td>
                            );
                          })}
                          <td className="text-center p-2 bg-primary-50">
                            <span className={`font-bold ${
                              (finalScore?.cumulativeScore || 0) > 0 ? 'text-green-600' :
                              (finalScore?.cumulativeScore || 0) < 0 ? 'text-red-600' :
                              'text-gray-600'
                            }`}>
                              {finalScore ? formatScore(finalScore.cumulativeScore) : '-'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show games list
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Game History</h1>
            <p className="text-sm text-gray-500">{games.length} completed games</p>
          </div>
        </div>

        {games.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-gray-500">
              <Trophy className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No completed games yet</p>
              <p className="text-sm">Finish a game to see it here!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {games.map((game) => {
              const winner = getWinner(game);
              return (
                <Card
                  key={game.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedGame(game)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(game.completedAt || game.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{game.players.map(p => p.name).join(', ')}</span>
                        </div>
                        {winner && (
                          <div className="flex items-center space-x-2">
                            <Trophy className="h-4 w-4 text-yellow-600" />
                            <span className="font-semibold text-yellow-700">{winner.playerName}</span>
                            <span className="text-sm text-gray-500">
                              ({formatScore(winner.cumulativeScore)})
                            </span>
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
