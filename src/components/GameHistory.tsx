import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { gameRepository } from '@/lib/db/repositories/game.repository';
import type { Game } from '@/types/game.types';
import { formatScore } from '@/lib/scoring/calculator';
import { ArrowLeft, Calendar, Users, Trophy, Trash2, Play, History, Award } from 'lucide-react';
import { PageCard } from '@/components/ui/page-card';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';

export function GameHistory() {
  const { setView, loadActiveGame } = useGameStore();
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const allGames = await gameRepository.getAllGames();
    setGames(allGames);
  };

  const handleDeleteGame = async (gameId: string, gameTitle: string) => {
    if (confirm(`Are you sure you want to delete "${gameTitle}"? This action cannot be undone.`)) {
      await gameRepository.delete(gameId);
      await loadHistory(); // Reload the list
    }
  };

  const handleContinueGame = async (game: Game) => {
    if (game.status === 'in-progress') {
      // Load this game as the active game
      await gameRepository.save(game);
      await loadActiveGame();
      setView('home'); // Go to home where user can resume
    }
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
      <PageCard
        topLeftButton={{
          icon: <ArrowLeft className="h-6 w-6" />,
          onClick: handleBack,
          label: 'Back to list',
        }}
        title="Game Details"
        subtitle={formatDate(selectedGame.completedAt || selectedGame.createdAt)}
        variant="elevated"
        className="max-w-4xl"
      >
        <div className="space-y-6">
          {/* Winner Card */}
          {winner && (
            <AnimatedCard variant="elevated" className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400 border-4">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-xl">
                      <Trophy className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <p className="text-base text-amber-700 font-bold uppercase">Winner</p>
                      <p className="text-3xl font-bold text-gray-800">{winner.playerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-bold text-green-600">
                      {formatScore(winner.cumulativeScore)}
                    </p>
                    {selectedGame.stakes && (
                      <p className="text-base text-gray-600 font-semibold mt-1">
                        Won {selectedGame.stakes.currency}
                        {selectedGame.stakes.amounts.reduce((sum, amt) => sum + amt, 0).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedCard>
          )}

          {/* Standings */}
          <AnimatedCard variant="elevated">
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-2 pb-4 border-b-2 border-amber-200">
                <Award className="h-6 w-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-800">Final Standings</h2>
              </div>
              <div className="space-y-3">
                {standings.map((score, index) => (
                  <motion.div
                    key={score.playerId}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-amber-600">#{index + 1}</span>
                      <span className="text-xl font-bold text-gray-800">{score.playerName}</span>
                    </div>
                    <span className={`text-2xl font-bold ${
                      score.cumulativeScore > 0 ? 'text-green-600' :
                      score.cumulativeScore < 0 ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {formatScore(score.cumulativeScore)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedCard>

          {/* Round by Round - similar to CallLog */}
          <AnimatedCard variant="elevated">
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-2 pb-4 border-b-2 border-amber-200">
                <History className="h-6 w-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-800">Round by Round</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-100 to-amber-50 border-b-4 border-amber-300">
                      <th className="text-left p-4 font-bold text-gray-800 text-lg">Player</th>
                      {selectedGame.rounds.map((round) => (
                        <th key={round.roundNumber} className="text-center p-4 font-bold text-gray-800 text-base">
                          R{round.roundNumber}
                        </th>
                      ))}
                      <th className="text-center p-4 bg-green-100 font-bold text-gray-800 text-lg">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedGame.players.map((player) => {
                      const finalScore = standings.find(s => s.playerId === player.id);
                      return (
                        <tr key={player.id} className="border-b-2 border-amber-100 hover:bg-amber-50/50">
                          <td className="p-4 font-bold text-gray-800 text-lg">{player.name}</td>
                          {selectedGame.rounds.map((round) => {
                            const score = round.scores.find(s => s.playerId === player.id);
                            return (
                              <td key={round.roundNumber} className="text-center p-4">
                                {score ? (
                                  <div>
                                    <div className={`font-bold text-xl ${
                                      score.roundScore > 0 ? 'text-green-600' :
                                      score.roundScore < 0 ? 'text-red-600' :
                                      'text-gray-600'
                                    }`}>
                                      {formatScore(score.cumulativeScore)}
                                    </div>
                                    <div className="text-sm text-gray-500 font-semibold">
                                      {score.call}/{score.result}
                                    </div>
                                  </div>
                                ) : '-'}
                              </td>
                            );
                          })}
                          <td className="text-center p-4 bg-green-50">
                            <span className={`font-bold text-2xl ${
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
            </div>
          </AnimatedCard>
        </div>
      </PageCard>
    );
  }

  // Show games list
  return (
    <PageCard
      topLeftButton={{
        icon: <ArrowLeft className="h-6 w-6" />,
        onClick: handleBack,
        label: 'Go back to home',
      }}
      title="Game History"
      subtitle={`${games.filter(g => g.status === 'completed').length} completed • ${games.filter(g => g.status === 'in-progress').length} in progress`}
      titleIcon={<History className="h-8 w-8 text-amber-600" />}
      variant="elevated"
      className="max-w-3xl"
    >
      <div className="space-y-6">
        {games.length === 0 ? (
          <AnimatedCard variant="elevated">
            <div className="p-12 text-center space-y-4">
              <Trophy className="h-20 w-20 mx-auto text-amber-300" />
              <p className="text-2xl font-bold text-gray-600">No Games Yet</p>
              <p className="text-base text-gray-500">Complete your first game to see it here!</p>
            </div>
          </AnimatedCard>
        ) : (
          <div className="space-y-4">
            {games.map((game, index) => {
              const winner = getWinner(game);
              const isCompleted = game.status === 'completed';
              const gameTitle = `Game ${game.id.slice(-4)}`;
              
              return (
                <motion.div
                  key={game.id}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimatedCard
                    variant="elevated"
                    className={`cursor-pointer ${isCompleted ? '' : 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50'}`}
                    onClick={() => setSelectedGame(game)}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 text-base text-gray-600 font-semibold">
                              <Calendar className="h-5 w-5" />
                              <span>{formatDate(game.completedAt || game.createdAt)}</span>
                            </div>
                            {!isCompleted && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-500 text-white">
                                <Play className="h-4 w-4 mr-1" />
                                In Progress
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-base text-gray-700 font-semibold">
                            <Users className="h-5 w-5" />
                            <span>{game.players.map(p => p.name).join(', ')}</span>
                          </div>
                          {isCompleted && winner && (
                            <div className="flex items-center space-x-2">
                              <Trophy className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                              <span className="font-bold text-yellow-700 text-lg">{winner.playerName}</span>
                              <span className="text-base text-gray-600 font-semibold">
                                ({formatScore(winner.cumulativeScore)})
                              </span>
                            </div>
                          )}
                          {!isCompleted && (
                            <div className="flex items-center space-x-2 text-base text-blue-600 font-bold">
                              <span>Round {game.currentRound} of 5</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <AnimatedButton
                            variant={isCompleted ? "primary" : "success"}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isCompleted) {
                                setSelectedGame(game);
                              } else {
                                handleContinueGame(game);
                              }
                            }}
                            className="px-6 h-12 text-base"
                          >
                            {isCompleted ? 'View Details' : 'Continue'}
                          </AnimatedButton>
                          <AnimatedButton
                            variant="danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGame(game.id, gameTitle);
                            }}
                            className="px-6 h-12 text-base"
                            icon={<Trash2 className="h-4 w-4" />}
                          >
                            Delete
                          </AnimatedButton>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageCard>
  );
}
