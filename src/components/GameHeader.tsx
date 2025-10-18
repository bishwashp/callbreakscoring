import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/gameStore';
import { Home, Menu, ClipboardList } from 'lucide-react';
import { useState } from 'react';

interface GameHeaderProps {
  showHomeButton?: boolean;
}

export function GameHeader({ showHomeButton = true }: GameHeaderProps) {
  const { currentGame, goHome, deleteActiveGame, hasUnsavedChanges, setHasUnsavedChanges, setView, currentView } = useGameStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleGoHome = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Going home will discard your current entries. Continue?')) {
        setHasUnsavedChanges(false);
        goHome();
      }
    } else {
      goHome();
    }
    setShowMenu(false);
  };

  const handleCancelGame = async () => {
    if (confirm('Are you sure you want to cancel this game? All progress will be lost.')) {
      await deleteActiveGame();
      setShowMenu(false);
    }
  };

  const handleViewGameLog = () => {
    setView('call-log');
    setShowMenu(false);
  };

  // Always show header, but only show game-specific actions for in-progress games
  const isInProgress = currentGame?.status === 'in-progress';
  const hasRoundData = currentGame?.rounds.some(r => r.scores && r.scores.length > 0) ?? false;
  const showGameLog = (isInProgress || currentGame?.status === 'completed') && hasRoundData && currentView !== 'call-log';

  return (
    <div className="bg-gradient-to-r from-amber-100 via-white to-amber-100 shadow-lg border-b-4 border-amber-300 safe-top card-depth">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          {showHomeButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoHome}
              title="Go Home"
              className="flex-shrink-0"
            >
              <Home className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          )}
          <div className="min-w-0 flex-1">
            {isInProgress ? (
              <>
                <h2 className="font-semibold text-gray-900 fluid-text-base truncate">
                  Round {currentGame.currentRound} of 5
                </h2>
                <p className="fluid-text-xs text-gray-500">
                  {currentGame.players.length} players
                </p>
              </>
            ) : (
              <>
                <h2 className="font-semibold text-gray-900 fluid-text-base truncate">
                  Game Setup
                </h2>
                <p className="fluid-text-xs text-gray-500">
                  Configure your game
                </p>
              </>
            )}
          </div>
          {showGameLog && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleViewGameLog}
              title="View Game Log"
              className="flex-shrink-0 ml-2"
            >
              <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          )}
        </div>
        
        <div className="relative flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMenu(!showMenu)}
            title="Menu"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-amber-50 to-white rounded-xl shadow-2xl border-4 border-amber-300 py-1 z-20 card-depth">
                <button
                  onClick={handleGoHome}
                  className="w-full text-left px-4 py-3 text-base sm:text-sm font-semibold text-gray-800 hover:bg-amber-100 transition-colors touch-active min-h-[48px] flex items-center rounded-lg"
                >
                  Go Home
                </button>
                {isInProgress && (
                  <button
                    onClick={handleCancelGame}
                    className="w-full text-left px-4 py-3 text-base sm:text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors touch-active min-h-[48px] flex items-center rounded-lg"
                  >
                    Cancel Game
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
