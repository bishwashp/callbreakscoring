import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { Play, Plus, Trash2, Trophy, Users, History } from 'lucide-react';
import { formatScore } from '@/lib/scoring/calculator';

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
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary">Call Break</h1>
          <p className="text-gray-600">Score Tracker</p>
        </div>

        {/* Active Game Card */}
        {hasActiveGame && !showDeleteConfirm && (
          <Card className="border-primary border-2">
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
                <Button 
                  onClick={handleResumeGame} 
                  className="w-full"
                  size="lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Resume Game
                </Button>
                <Button 
                  onClick={handleCancelGame}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Cancel Game
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <Card className="border-red-300 border-2">
            <CardHeader>
              <CardTitle className="text-red-600">Cancel Active Game?</CardTitle>
              <CardDescription>
                This will delete your current game progress. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="outline"
                  className="w-full"
                >
                  Keep Game
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  variant="destructive"
                  className="w-full"
                >
                  Delete Game
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* New Game Button */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={handleNewGame} 
              className="w-full"
              size="lg"
              variant={hasActiveGame ? "outline" : "default"}
            >
              <Plus className="h-5 w-5 mr-2" />
              Start New Game
            </Button>
          </CardContent>
        </Card>

        {/* History Button */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={() => setView('game-history')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <History className="h-5 w-5 mr-2" />
              View Game History
            </Button>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>Traditional Call Break scoring with 4-5 players</p>
          <p>Auto-saves progress • Works offline</p>
        </div>
      </div>
    </div>
  );
}
