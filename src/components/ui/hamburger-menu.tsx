import { useState } from 'react';
import { Menu, Home, RefreshCw, X } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/lib/utils/cn';

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentGame, goHome, restartGameWithSamePlayers, deleteActiveGame } = useGameStore();
  
  const hasActivePlayers = currentGame && currentGame.players.length > 0;
  
  const handleGoHome = () => {
    goHome();
    setIsOpen(false);
  };
  
  const handleNewGameSamePlayers = () => {
    restartGameWithSamePlayers();
    setIsOpen(false);
  };
  
  const handleCancelGame = () => {
    deleteActiveGame();
    setIsOpen(false);
  };
  
  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-4 right-4 z-50",
          "min-h-[48px] min-w-[48px] p-3",
          "rounded-lg",
          "bg-gradient-to-br from-amber-500 to-yellow-600",
          "text-white",
          "shadow-lg hover:shadow-xl",
          "transition-all duration-200",
          "hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
        )}
        aria-label="Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div
            className={cn(
              "fixed top-20 right-4 z-50",
              "min-w-[240px]",
              "rounded-lg",
              "bg-white",
              "shadow-2xl border-2 border-amber-200",
              "overflow-hidden",
              "animate-in slide-in-from-top-2 duration-200"
            )}
          >
            <div className="py-2">
              {/* Go Home */}
              <button
                onClick={handleGoHome}
                className={cn(
                  "w-full px-4 py-3",
                  "flex items-center gap-3",
                  "text-left text-base font-medium",
                  "text-gray-700 hover:text-gray-900",
                  "hover:bg-amber-50",
                  "transition-colors duration-150",
                  "focus:outline-none focus:bg-amber-100"
                )}
              >
                <Home size={20} className="text-amber-600" />
                <span>Go Home</span>
              </button>
              
              {/* New Game (Same Players) - Only show if players exist */}
              {hasActivePlayers && (
                <button
                  onClick={handleNewGameSamePlayers}
                  className={cn(
                    "w-full px-4 py-3",
                    "flex items-center gap-3",
                    "text-left text-base font-medium",
                    "text-gray-700 hover:text-gray-900",
                    "hover:bg-amber-50",
                    "transition-colors duration-150",
                    "focus:outline-none focus:bg-amber-100"
                  )}
                >
                  <RefreshCw size={20} className="text-amber-600" />
                  <span>New Game (Same Players)</span>
                </button>
              )}
              
              {/* Cancel Game - Only show if there's an active game */}
              {hasActivePlayers && (
                <>
                  <div className="h-px bg-gray-200 my-2" />
                  <button
                    onClick={handleCancelGame}
                    className={cn(
                      "w-full px-4 py-3",
                      "flex items-center gap-3",
                      "text-left text-base font-medium",
                      "text-red-600 hover:text-red-700",
                      "hover:bg-red-50",
                      "transition-colors duration-150",
                      "focus:outline-none focus:bg-red-100"
                    )}
                  >
                    <X size={20} className="text-red-600" />
                    <span>Cancel Game</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}