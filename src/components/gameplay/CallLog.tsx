import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { formatScore } from '@/lib/scoring/calculator';
import { ArrowLeft, Trophy, Scroll, Home } from 'lucide-react';
import { PageCard } from '@/components/ui/page-card';
import { AnimatedButton } from '@/components/ui/animated-button';

export function CallLog() {
  const { currentGame, setView } = useGameStore();

  const handleBack = () => {
    const { currentGame } = useGameStore.getState();
    if (currentGame?.status === 'completed') {
      setView('game-complete');
    } else {
      // Intelligently go back based on game state
      const currentRound = currentGame?.rounds[currentGame.currentRound - 1];
      if (currentRound?.status === 'completed') {
        setView('round-summary');
      } else if (currentRound?.status === 'calls-entered') {
        setView('player-results');
      } else {
        setView('player-calls');
      }
    }
  };

  return (
    <PageCard
      topLeftButton={{
        icon: <ArrowLeft className="h-6 w-6" />,
        onClick: handleBack,
        label: 'Go back',
      }}
      topRightButtons={[{
        icon: <Home className="h-6 w-6" />,
        onClick: () => setView('home'),
        label: 'Go to home',
      }]}
      title="Game Ledger"
      subtitle="Complete match history"
      titleIcon={<Scroll className="h-8 w-8 text-amber-600" />}
      variant="elevated"
      className="max-w-5xl"
      contentClassName="overflow-x-auto"
    >
      <div className="space-y-6">
        <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-amber-100 border-b-4 border-amber-300">
                  <th className="text-left p-4 font-bold text-gray-800 sticky left-0 bg-amber-100 z-10">
                    Player
                  </th>
                  {currentGame?.rounds.map((round) => (
                    <th
                      key={round.roundNumber}
                      className="text-center p-4 font-bold text-gray-800 min-w-[100px]"
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center text-lg font-bold shadow-md">
                          {round.roundNumber}
                        </div>
                        <div className="text-xs text-gray-600">Round</div>
                      </div>
                    </th>
                  ))}
                  <th className="text-center p-4 font-bold bg-green-100 border-l-4 border-green-300 min-w-[120px]">
                    <div className="flex flex-col items-center space-y-1">
                      <Trophy className="h-6 w-6 text-green-700 fill-green-700" />
                      <div className="text-gray-800">Final</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentGame?.players.map((player, playerIndex) => {
                  // Get final cumulative score
                  const completedRounds = currentGame.rounds.filter(r => r.scores.length > 0);
                  const lastRound = completedRounds[completedRounds.length - 1];
                  const finalScore = lastRound?.scores.find(s => s.playerId === player.id)?.cumulativeScore || 0;

                  return (
                    <motion.tr
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: playerIndex * 0.1 }}
                      className="border-b-2 border-amber-100 hover:bg-amber-50/50 transition-colors"
                    >
                      <td className="p-4 sticky left-0 bg-white hover:bg-amber-50/50 transition-colors z-10 border-r-2 border-amber-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-gray-600">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-800 text-lg">{player.name}</span>
                        </div>
                      </td>
                      {currentGame.rounds.map((round) => {
                        const score = round.scores.find(s => s.playerId === player.id);
                        if (!score) {
                          return (
                            <td key={round.roundNumber} className="text-center p-4 text-gray-300">
                              <div className="text-2xl">-</div>
                            </td>
                          );
                        }
                        
                        return (
                          <td key={round.roundNumber} className="text-center p-4">
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: playerIndex * 0.1 }}
                              className="space-y-2"
                            >
                              <div className={`text-2xl font-bold ${
                                score.cumulativeScore > 0 ? 'text-green-600' : 
                                score.cumulativeScore < 0 ? 'text-red-600' : 
                                'text-gray-600'
                              }`}>
                                {formatScore(score.cumulativeScore)}
                              </div>
                              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                                score.callMet 
                                  ? 'bg-green-100 text-green-700 border border-green-300'
                                  : 'bg-red-100 text-red-700 border border-red-300'
                              }`}>
                                <span>{score.call}</span>
                                <span className="text-gray-500">/</span>
                                <span>{score.result}</span>
                              </div>
                            </motion.div>
                          </td>
                        );
                      })}
                      <td className="text-center p-4 bg-green-50 border-l-4 border-green-300">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: playerIndex * 0.1 + 0.5, type: "spring" }}
                          className={`text-3xl font-bold ${
                            finalScore > 0 ? 'text-green-700' : 
                            finalScore < 0 ? 'text-red-700' : 
                            'text-gray-700'
                          }`}
                        >
                          {formatScore(finalScore)}
                        </motion.div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Legend */}
          <div className="border-t-4 border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-gray-700 font-semibold">Positive Score</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>
                <span className="text-gray-700 font-semibold">Negative Score</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-2 py-1 bg-green-100 border border-green-300 rounded text-xs font-bold text-green-700">
                  Call/Result
                </div>
                <span className="text-gray-700 font-semibold">Met Call</span>
              </div>
            </div>
        </div>

        <AnimatedButton
          variant="secondary"
          onClick={handleBack}
          className="w-full h-14 text-base"
          icon={<ArrowLeft className="h-5 w-5" />}
        >
          Back
        </AnimatedButton>
      </div>
    </PageCard>
  );
}
