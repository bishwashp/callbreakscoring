import { useState } from 'react';
import { motion } from 'framer-motion';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { Play, Plus, Trash2, Users, History } from 'lucide-react';
import { formatScore } from '@/lib/scoring/calculator';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { FloatingCardDeck } from '@/components/ui/animated-card';

export function HomeScreen() {
  const { currentGame, newGame, setView, deleteActiveGame } = useGameStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
          
          {/* Decorative playing card header */}
          <div className="flex justify-center relative z-10">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-32 h-44 bg-gradient-to-br from-amber-100 via-white to-amber-100 rounded-2xl border-4 border-amber-400 shadow-3xl flex flex-col items-center justify-center space-y-2 card-depth">
                <div className="text-6xl">♠</div>
                <div className="text-4xl font-bold text-gray-800">A</div>
                <img 
                  src="/spade.png" 
                  alt="Ace of Spades" 
                  className="h-8 w-8 opacity-50"
                />
              </div>
            </motion.div>
          </div>
          
          <div className="relative z-10 space-y-2">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 drop-shadow-lg">
              Call Break
            </h1>
            <p className="text-amber-100 text-lg font-semibold tracking-wide">Score Tracker</p>
          </div>
          
          <div className="flex justify-center space-x-4 mt-4 relative z-10">
            <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.5 }}>
              <div className="text-3xl">♠</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.5 }}>
              <div className="text-3xl text-red-500">♥</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.5 }}>
              <div className="text-3xl text-red-500">♦</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.5 }}>
              <div className="text-3xl">♣</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Active Game Card */}
        {hasActiveGame && !showDeleteConfirm && (
          <AnimatedCard variant="elevated" className="border-primary border-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Game in Progress</span>
                <span className="text-sm font-normal text-primary">
                  Round {currentGame.currentRound} of 5
                </span>
              </CardTitle>
              <CardDescription>
                Continue your current game
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Players Preview */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{currentGame.players.map(p => p.name).join(', ')}</span>
              </div>

              {/* Current Scores */}
              {currentScores && (
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Current Standings</p>
                  <div className="space-y-1">
                    {currentScores.slice(0, 3).map((score, index) => (
                      <div key={score.playerId} className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-2">
                          <span className="text-gray-400">#{index + 1}</span>
                          <span className="font-medium">{score.playerName}</span>
                        </span>
                        <span className={`font-semibold ${
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
              <div className="grid grid-cols-2 gap-3">
                <AnimatedButton 
                  onClick={handleResumeGame} 
                  className="w-full"
                  size="lg"
                  variant="success"
                  icon={<Play className="h-5 w-5" />}
                >
                  Resume Game
                </AnimatedButton>
                <AnimatedButton 
                  onClick={handleCancelGame}
                  variant="danger"
                  className="w-full"
                  size="lg"
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
