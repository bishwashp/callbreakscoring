import { useState } from 'react';
import { motion } from 'framer-motion';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { Play, Plus, Trash2, Users, History, Trophy } from 'lucide-react';
import { formatScore } from '@/lib/scoring/calculator';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { FloatingCardDeck } from '@/components/ui/animated-card';
import { useReducedMotion, getAnimationConfig } from '@/lib/utils/performance';

export function HomeScreen() {
  const { currentGame, newGame, setView, deleteActiveGame } = useGameStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const animConfig = getAnimationConfig(shouldReduceMotion);

  const handleResumeGame = () => {
    if (!currentGame) return;
    
    // Determine which view to show based on current game state
    const currentRound = currentGame.rounds[currentGame.currentRound - 1];
    
    if (currentRound) {
      if (currentRound.status === 'pending') {
        setView('player-calls');
      } else if (currentRound.status === 'calls-entered') {
        setView('player-results');
      } else if (currentRound.status === 'completed') {
        setView('round-summary');
      }
    } else {
      setView('player-calls');
    }
  };

  const handleNewGame = () => {
    if (currentGame && currentGame.status === 'in-progress') {
      setShowDeleteConfirm(true);
    } else {
      newGame();
    }
  };

  const handleConfirmDelete = () => {
    deleteActiveGame();
    setShowDeleteConfirm(false);
    newGame();
  };

  const handleCancelGame = () => {
    setShowDeleteConfirm(true);
  };

  // Get current scores for preview
  const getCurrentScores = () => {
    if (!currentGame || currentGame.rounds.length === 0) return null;
    
    const completedRounds = currentGame.rounds.filter(r => r.scores.length > 0);
    if (completedRounds.length === 0) return null;
    
    const lastRound = completedRounds[completedRounds.length - 1];
    return lastRound.scores.sort((a, b) => b.cumulativeScore - a.cumulativeScore);
  };

  const currentScores = getCurrentScores();
  const hasActiveGame = currentGame && currentGame.status === 'in-progress';

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        {/* Header with floating cards */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center space-y-4 relative"
        >
          <div className="absolute -top-4 -left-4 opacity-60">
            <FloatingCardDeck count={4} />
          </div>
          <div className="absolute -top-2 -right-6 opacity-60">
            <FloatingCardDeck count={3} />
          </div>
          
          {/* Luxurious card spread header */}
          <div className="flex justify-center relative z-10">
            <div className="relative w-80 h-52">
              {/* Fan of cards */}
              {[
                { suit: '♠', color: 'text-gray-800', rank: 'A', rotate: -20, x: -40 },
                { suit: '♥', color: 'text-red-600', rank: 'K', rotate: -10, x: -20 },
                { suit: '♦', color: 'text-red-600', rank: 'Q', rotate: 0, x: 0 },
                { suit: '♣', color: 'text-gray-800', rank: 'J', rotate: 10, x: 20 },
                { suit: '♠', color: 'text-gray-800', rank: '10', rotate: 20, x: 40 }
              ].map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ y: shouldReduceMotion ? -20 : -100, opacity: 0, rotate: shouldReduceMotion ? 0 : card.rotate - 180 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    rotate: card.rotate,
                    x: card.x
                  }}
                  transition={{
                    delay: index * animConfig.staggerDelay,
                    ...animConfig.spring
                  }}
                  whileHover={shouldReduceMotion ? undefined : {
                    y: -20,
                    rotate: 0,
                    scale: 1.1,
                    zIndex: 50,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  className="absolute left-1/2 top-0 -translate-x-1/2 cursor-pointer"
                  style={{ zIndex: index }}
                >
                  <div className="w-28 h-40 bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-2xl border-4 border-amber-400 shadow-2xl card-depth flex flex-col items-center justify-between py-3">
                    <div className={`text-5xl font-bold ${card.color}`}>{card.suit}</div>
                    <div className="text-4xl font-bold text-gray-800">{card.rank}</div>
                    <div className={`text-5xl font-bold ${card.color} transform rotate-180`}>{card.suit}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 space-y-3 mt-6">
            <motion.h1 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 drop-shadow-2xl"
            >
              Call Break
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-2 rounded-full border-2 border-amber-300 shadow-lg"
            >
              <p className="text-white text-lg font-bold tracking-wider">SCORE TRACKER</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Active Game Card */}
        {hasActiveGame && !showDeleteConfirm && (
          <AnimatedCard variant="elevated" className="bg-gradient-to-br from-amber-50 via-white to-amber-50">
            <CardHeader className="border-b-4 border-amber-200">
              <CardTitle className="flex items-center justify-between text-gray-800">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-amber-600 fill-amber-600" />
                  <span>Game in Progress</span>
                </div>
                <div className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-full text-sm font-bold">
                  Round {currentGame.currentRound} of 5
                </div>
              </CardTitle>
              <CardDescription className="text-gray-700 font-semibold">
                Continue your match
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Players Preview */}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border-2 border-blue-200">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-900 uppercase tracking-wide">Players</p>
                  <p className="text-sm font-semibold text-gray-800">{currentGame.players.map(p => p.name).join(', ')}</p>
                </div>
              </div>

              {/* Current Scores */}
              {currentScores && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Trophy className="h-5 w-5 text-green-700 fill-green-700" />
                    <p className="text-sm font-bold text-green-900 uppercase tracking-wide">Current Standings</p>
                  </div>
                  <div className="space-y-2">
                    {currentScores.slice(0, 3).map((score, index) => (
                      <div key={score.playerId} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 shadow-sm">
                        <span className="flex items-center space-x-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-white' :
                            index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                            'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-bold text-gray-800">{score.playerName}</span>
                        </span>
                        <span className={`font-bold text-lg ${
                          score.cumulativeScore > 0 ? 'text-green-600' :
                          score.cumulativeScore < 0 ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {formatScore(score.cumulativeScore)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <AnimatedButton 
                  onClick={handleResumeGame} 
                  className="w-full h-14 text-base shadow-lg"
                  variant="success"
                  icon={<Play className="h-5 w-5" />}
                >
                  Resume Game
                </AnimatedButton>
                <AnimatedButton 
                  onClick={handleCancelGame}
                  variant="danger"
                  className="w-full h-14 text-base shadow-lg"
                  icon={<Trash2 className="h-5 w-5" />}
                >
                  Cancel Game
                </AnimatedButton>
              </div>
            </CardContent>
          </AnimatedCard>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <AnimatedCard variant="floating" className="border-red-300 border-2">
            <CardHeader>
              <CardTitle className="text-red-600">Cancel Active Game?</CardTitle>
              <CardDescription>
                This will delete your current game progress. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <AnimatedButton
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="secondary"
                  className="w-full"
                >
                  Keep Game
                </AnimatedButton>
                <AnimatedButton
                  onClick={handleConfirmDelete}
                  variant="danger"
                  className="w-full"
                >
                  Delete Game
                </AnimatedButton>
              </div>
            </CardContent>
          </AnimatedCard>
        )}

        {/* New Game Button */}
        <AnimatedCard variant="default">
          <CardContent className="pt-6">
            <AnimatedButton 
              onClick={handleNewGame} 
              className="w-full"
              size="lg"
              variant={hasActiveGame ? "secondary" : "primary"}
              icon={<Plus className="h-5 w-5" />}
            >
              Start New Game
            </AnimatedButton>
          </CardContent>
        </AnimatedCard>

        {/* History Button */}
        <AnimatedCard variant="default">
          <CardContent className="pt-6">
            <AnimatedButton
              onClick={() => setView('game-history')}
              variant="secondary"
              className="w-full"
              size="lg"
              icon={<History className="h-5 w-5" />}
            >
              View Game History
            </AnimatedButton>
          </CardContent>
        </AnimatedCard>

        {/* Info Section */}
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>Traditional Call Break scoring with 4-5 players</p>
          <p>Auto-saves progress • Works offline</p>
        </div>
      </div>
    </div>
  );
}
