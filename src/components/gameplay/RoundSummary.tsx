import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { formatScore } from '@/lib/scoring/calculator';
import { ArrowUp, ArrowDown, Trophy, Eye, ChevronRight } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';

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
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header card */}
        <AnimatedCard variant="floating" className="text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-center space-x-2">
              <Trophy className="h-8 w-8 text-amber-600 fill-amber-600" />
              <h1 className="text-4xl font-bold text-gray-800">Round {currentGame?.currentRound}</h1>
            </div>
            <p className="text-amber-700 font-semibold text-lg">Round Complete!</p>
          </motion.div>
        </AnimatedCard>

        {/* Scores card */}
        <AnimatedCard variant="elevated">
          <div className="space-y-4">
            {currentRound?.scores.map((score, index) => {
              const isPositive = score.roundScore > 0;
              const isNegative = score.roundScore < 0;
              
              return (
                <motion.div
                  key={score.playerId}
                  initial={{ x: 300, opacity: 0, rotateY: 45 }}
                  animate={{ x: 0, opacity: 1, rotateY: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    delay: index * 0.1
                  }}
                  className={`p-5 rounded-2xl border-4 shadow-lg card-depth ${
                    score.callMet 
                      ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50' 
                      : isNegative 
                      ? 'border-red-400 bg-gradient-to-br from-red-50 to-rose-50'
                      : 'border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center font-bold text-xl shadow-md border-2 ${
                        score.callMet 
                          ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white border-green-600' 
                          : isNegative 
                          ? 'bg-gradient-to-br from-red-400 to-rose-600 text-white border-red-600'
                          : 'bg-gradient-to-br from-amber-400 to-yellow-600 text-white border-amber-600'
                      }`}>
                        {score.playerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-gray-800">{score.playerName}</p>
                        <p className="text-sm text-gray-600 font-semibold">
                          Called {score.call} • Got {score.result}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                        className={`text-3xl font-bold ${
                          isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
                        }`}
                      >
                        {isPositive && '+'}{formatScore(score.roundScore)}
                      </motion.div>
                      <div className="text-sm text-gray-600 flex items-center justify-end space-x-1 mt-1 font-semibold">
                        <span>Total:</span>
                        <span className="text-base font-bold">{formatScore(score.cumulativeScore)}</span>
                      </div>
                    </div>
                  </div>
                  {score.callMet && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="mt-3 text-sm font-bold text-green-700 flex items-center space-x-2 bg-green-100 rounded-lg px-3 py-1.5"
                    >
                      <Trophy className="h-4 w-4 fill-green-700" />
                      <span>Call Met!</span>
                    </motion.div>
                  )}
                  {isNegative && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="mt-3 text-sm font-bold text-red-700 flex items-center space-x-2 bg-red-100 rounded-lg px-3 py-1.5"
                    >
                      <ArrowDown className="h-4 w-4" />
                      <span>Failed Call</span>
                    </motion.div>
                  )}
                  {!score.callMet && !isNegative && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="mt-3 text-sm font-bold text-amber-700 flex items-center space-x-2 bg-amber-100 rounded-lg px-3 py-1.5"
                    >
                      <ArrowUp className="h-4 w-4" />
                      <span>+{score.extraTricks} extra trick{score.extraTricks > 1 ? 's' : ''}</span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </AnimatedCard>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-4">
          <AnimatedButton 
            variant="secondary" 
            onClick={handleViewCallLog} 
            className="w-full h-14 text-base"
            icon={<Eye className="h-5 w-5" />}
          >
            View Call Log
          </AnimatedButton>
          <AnimatedButton 
            onClick={handleNextRound} 
            className="w-full h-14 text-base"
            variant="primary"
            icon={<ChevronRight className="h-5 w-5" />}
          >
            {currentGame && currentGame.currentRound >= 5 ? 'Finish Game' : 'Next Round'}
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
