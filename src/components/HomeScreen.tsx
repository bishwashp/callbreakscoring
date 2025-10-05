import { useState } from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { Play, Plus, Trash2, Trophy, Users, History } from 'lucide-react';
import { formatScore } from '@/lib/scoring/calculator';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { FloatingCardDeck, CardSuits } from '@/components/ui/animated-card';

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
        <div className="text-center space-y-2 relative">
          <div className="absolute -top-4 -left-4 opacity-60">
            <FloatingCardDeck count={4} />
          </div>
          <div className="absolute -top-2 -right-6 opacity-60">
            <FloatingCardDeck count={3} />
          </div>
          <div className="flex justify-center relative z-10">
            <AnimatedCard 
              variant="game-card" 
              className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
            >
              <Trophy className="h-10 w-10 text-red-600" />
            </AnimatedCard>
          </div>
          <h1 className="text-4xl font-bold text-white relative z-10">Call Break</h1>
          <p className="text-white/80 relative z-10">Score Tracker</p>
          <div className="flex justify-center space-x-2 mt-2 relative z-10">
            <CardSuits.Spades />
            <CardSuits.Hearts />
            <CardSuits.Diamonds />
            <CardSuits.Clubs />
          </div>
        </div>

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
