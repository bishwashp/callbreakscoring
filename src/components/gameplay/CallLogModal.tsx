import { motion } from 'framer-motion';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { useGameStore } from '@/store/gameStore';
import { AnimatedButton } from '@/components/ui/animated-button';
import { formatScore } from '@/lib/scoring/calculator';
import { Trophy, Scroll } from 'lucide-react';

export function CallLogModal() {
  const { currentGame, showCallLogModal, setShowCallLogModal } = useGameStore();
  
  if (!currentGame) return null;
  
  return (
    <AlertDialog open={showCallLogModal} onOpenChange={setShowCallLogModal}>
      <AlertDialogContent className="w-[95vw] sm:w-[90vw] md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        {/* Header with title */}
        <div className="text-center space-y-1 sm:space-y-2 mb-4 sm:mb-6">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <Scroll className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Game Ledger</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">Complete match history</p>
        </div>
        
        {/* Table content */}
        <div className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full">
              <thead>
                <tr className="bg-amber-100 border-b-2 sm:border-b-4 border-amber-300">
                  <th className="text-left p-2 sm:p-4 font-bold text-gray-800 sticky left-0 bg-amber-100 z-10 text-sm sm:text-base">
                    Player
                  </th>
                  {currentGame?.rounds.map((round) => (
                    <th
                      key={round.roundNumber}
                      className="text-center p-2 sm:p-4 font-bold text-gray-800 min-w-[80px] sm:min-w-[100px]"
                    >
                      <div className="flex flex-col items-center space-y-0.5 sm:space-y-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center text-base sm:text-lg font-bold shadow-md">
                          {round.roundNumber}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-600">Round</div>
                      </div>
                    </th>
                  ))}
                  <th className="text-center p-2 sm:p-4 font-bold bg-green-100 border-l-2 sm:border-l-4 border-green-300 min-w-[100px] sm:min-w-[120px] text-sm sm:text-base">
                    <div className="flex flex-col items-center space-y-0.5 sm:space-y-1">
                      <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-green-700 fill-green-700" />
                      <div className="text-gray-800 text-xs sm:text-base">Final</div>
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
                      className="border-b border-amber-100 hover:bg-amber-50/50 transition-colors"
                    >
                      <td className="p-2 sm:p-4 sticky left-0 bg-white hover:bg-amber-50/50 transition-colors z-10 border-r border-amber-200">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center font-bold text-sm sm:text-lg shadow-md border-2 border-gray-600">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-gray-800 text-sm sm:text-lg">{player.name}</span>
                        </div>
                      </td>
                      {currentGame.rounds.map((round) => {
                        const score = round.scores.find(s => s.playerId === player.id);
                        if (!score) {
                          return (
                            <td key={round.roundNumber} className="text-center p-2 sm:p-4 text-gray-300">
                              <div className="text-xl sm:text-2xl">-</div>
                            </td>
                          );
                        }
                        
                        return (
                          <td key={round.roundNumber} className="text-center p-2 sm:p-4">
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: playerIndex * 0.1 }}
                              className="space-y-1 sm:space-y-2"
                            >
                              <div className={`text-lg sm:text-2xl font-bold ${
                                score.cumulativeScore > 0 ? 'text-green-600' : 
                                score.cumulativeScore < 0 ? 'text-red-600' : 
                                'text-gray-600'
                              }`}>
                                {formatScore(score.cumulativeScore)}
                              </div>
                              <div className={`inline-flex items-center space-x-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold ${
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
                      <td className="text-center p-2 sm:p-4 bg-green-50 border-l-2 sm:border-l-4 border-green-300">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: playerIndex * 0.1 + 0.5, type: "spring" }}
                          className={`text-2xl sm:text-3xl font-bold ${
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
          <div className="border-t-2 sm:border-t-4 border-amber-200 bg-amber-50 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-600"></div>
                <span className="text-gray-700 font-semibold">Positive Score</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-600"></div>
                <span className="text-gray-700 font-semibold">Negative Score</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-100 border border-green-300 rounded text-[10px] sm:text-xs font-bold text-green-700">
                  Call/Result
                </div>
                <span className="text-gray-700 font-semibold">Met Call</span>
              </div>
            </div>
          </div>
        </div>

        {/* Continue button at bottom */}
        <div className="mt-4 sm:mt-6">
          <AnimatedButton
            onClick={() => setShowCallLogModal(false)}
            className="w-full"
            variant="primary"
          >
            Continue
          </AnimatedButton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}