import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { formatScore } from '@/lib/scoring/calculator';
import { calculatePayouts, formatMoney } from '@/lib/game-logic/stakes-calculator';
import { Trophy, Medal, Award, Eye, Home, Sparkles } from 'lucide-react';
import { PageCard } from '@/components/ui/page-card';
import { AnimatedButton } from '@/components/ui/animated-button';

export function GameComplete() {
  const { currentGame, getWinner, setView, restartGameWithSamePlayers } = useGameStore();
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

  const handlePlayAgain = () => {
    restartGameWithSamePlayers();
  };

  return (
    <PageCard
      topRightButtons={[{
        icon: <Home className="h-6 w-6" />,
        onClick: handleGoHome,
        label: 'Go to home',
      }]}
      title="Victory!"
      subtitle={winner ? `👑 Champion: ${winner.name} 👑` : undefined}
      titleIcon={
        <motion.div
          className="relative"
          animate={{
            rotate: [0, -10, 10, -10, 10, 0],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 2,
            times: [0, 0.2, 0.4, 0.6, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-600 gold-glow">
            <Trophy className="h-20 w-20 text-white drop-shadow-lg" />
          </div>
          {/* Sparkles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
              }}
              animate={{
                x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
                opacity: [1, 0],
                scale: [0, 1.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                repeatDelay: 1
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </motion.div>
          ))}
        </motion.div>
      }
      variant="elevated"
      className="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Winner payout display */}
        {winner && payouts && currentGame?.stakes && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-block bg-gradient-to-br from-green-400 to-emerald-600 border-4 border-green-300 rounded-2xl px-8 py-4 shadow-2xl mx-auto"
          >
            <p className="text-sm text-green-50 font-bold uppercase tracking-wide text-center">Takes Home</p>
            <p className="text-5xl font-bold text-white drop-shadow-lg text-center">
              {currentGame.stakes.currency}{payouts[0].amountPaid.toFixed(2)}
            </p>
          </motion.div>
        )}

        {/* Podium Display */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6 border-b-4 border-amber-300">
            <div className="flex items-center justify-center space-x-2">
              <Award className="h-6 w-6 text-amber-700" />
              <h2 className="text-2xl font-bold text-gray-800">Final Standings</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {standings.map((score, index) => {
              const payout = payouts?.find(p => p.playerId === score.playerId);
              const medals = [
                { icon: Trophy, bg: 'from-yellow-400 to-amber-500', border: 'border-yellow-600', text: 'text-yellow-600' },
                { icon: Medal, bg: 'from-gray-300 to-gray-400', border: 'border-gray-500', text: 'text-gray-500' },
                { icon: Medal, bg: 'from-orange-400 to-orange-500', border: 'border-orange-600', text: 'text-orange-600' }
              ];
              const medal = medals[index];
              const MedalIcon = medal?.icon || Award;

              return (
                <motion.div
                  key={score.playerId}
                  initial={{ x: -100, opacity: 0, rotateY: -90 }}
                  animate={{ x: 0, opacity: 1, rotateY: 0 }}
                  transition={{ 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  className={`relative p-6 rounded-2xl border-4 shadow-xl transition-all hover:scale-102 ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-400'
                      : index === 2
                      ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-400'
                      : 'bg-gradient-to-r from-white to-gray-50 border-gray-300'
                  }`}
                >
                  {/* Rank badge */}
                  <div className="absolute -left-4 -top-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${medal?.bg || 'from-gray-400 to-gray-500'} border-4 ${medal?.border || 'border-gray-600'} flex items-center justify-center shadow-xl`}>
                      {medal ? (
                        <MedalIcon className="h-8 w-8 text-white" />
                      ) : (
                        <span className="text-2xl font-bold text-white">#{index + 1}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between ml-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center text-3xl font-bold shadow-lg border-2 border-gray-600">
                        {score.playerName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-800">{score.playerName}</p>
                        <p className="text-sm font-semibold text-gray-600">
                          {index === 0 ? '🎉 Champion' : 
                           index === 1 ? '🥈 Runner-up' : 
                           index === 2 ? '🥉 Third Place' : 
                           `Position ${index + 1}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className={`text-4xl font-bold ${
                        score.cumulativeScore > 0 ? 'text-green-600' :
                        score.cumulativeScore < 0 ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {formatScore(score.cumulativeScore)}
                      </div>
                      {payout && currentGame?.stakes && (
                        <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-lg font-bold ${
                          payout.amountPaid > 0 
                            ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                            : 'bg-red-100 text-red-700 border-2 border-red-300'
                        }`}>
                          <span className="text-lg">{payout.amountPaid > 0 ? '+' : ''}{formatMoney(payout.amountPaid, currentGame.stakes.currency)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-4">
          {/* Primary action - Play Again */}
          <AnimatedButton
            onClick={handlePlayAgain}
            className="w-full h-20 text-xl font-bold"
            variant="default"
            icon={<Sparkles className="h-7 w-7" />}
          >
            🎮 New Game - Review Seating & Start
          </AnimatedButton>
          
          {/* Secondary actions */}
          <div className="grid grid-cols-2 gap-4">
            <AnimatedButton
              variant="secondary"
              onClick={handleViewCallLog}
              className="w-full h-16 text-lg"
              icon={<Eye className="h-6 w-6" />}
            >
              View Full Ledger
            </AnimatedButton>
            <AnimatedButton
              onClick={handleGoHome}
              className="w-full h-16 text-lg"
              variant="success"
              icon={<Home className="h-6 w-6" />}
            >
              Return Home
            </AnimatedButton>
          </div>
        </div>
      </div>
    </PageCard>
  );
}
