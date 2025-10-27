import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/store/gameStore';
import type { PlayerResult } from '@/types/game.types';
import { Crown, Check, AlertCircle, Trophy, Home, Menu } from 'lucide-react';
import { PageCard } from '@/components/ui/page-card';
import { AnimatedButton } from '@/components/ui/animated-button';

export function ResultEntry() {
  const { currentGame, getCurrentDealer, getCurrentRound, enterResults, error, setHasUnsavedChanges, setView, deleteActiveGame } = useGameStore();
  const dealer = getCurrentDealer();
  const currentRound = getCurrentRound();
  const [results, setResults] = useState<Record<string, number>>({});
  const [showMenu, setShowMenu] = useState(false);

  const handleResultChange = (playerId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(13, numValue));
    const newResults = { ...results, [playerId]: clampedValue };
    setResults(newResults);
    
    // Mark as having unsaved changes if any result is entered
    const hasAnyResult = Object.values(newResults).some(result => result > 0);
    setHasUnsavedChanges(hasAnyResult);
  };

  // Reset unsaved changes when component unmounts
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  const handleSubmit = () => {
    if (!currentGame) return;

    const playerResults: PlayerResult[] = currentGame.players.map(player => ({
      playerId: player.id,
      tricksWon: results[player.id] || 0,
    }));

    enterResults(playerResults);
  };

  // Calculate total
  const total = Object.values(results).reduce((sum, val) => sum + (val || 0), 0);
  const isValidTotal = total === 13;
  const allEntered = currentGame?.players.every(p => results[p.id] !== undefined && results[p.id] >= 0);

  if (!currentGame || !dealer) return null;

  const handleCancelGame = async () => {
    if (confirm('Are you sure you want to cancel this game? All progress will be lost.')) {
      await deleteActiveGame();
      setShowMenu(false);
    }
  };

  return (
    <PageCard
      topLeftButton={{
        icon: <Home className="h-6 w-6" />,
        onClick: () => setView('home'),
        label: 'Go to home',
        showWarning: true,
      }}
      topRightButtons={[{
        icon: <Menu className="h-6 w-6" />,
        onClick: () => setShowMenu(!showMenu),
        label: 'Open menu',
      }]}
      title={`Round ${currentGame.currentRound} of 5`}
      subtitle="Count your tricks"
      titleIcon={<Trophy className="h-8 w-8 text-amber-600 fill-amber-600" />}
      variant="elevated"
      className="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Menu dropdown */}
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-4 top-20 w-48 bg-gradient-to-br from-amber-50 to-white rounded-xl shadow-2xl border-4 border-amber-300 py-1 z-20 card-depth">
              <button
                onClick={() => {
                  setView('home');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 text-base sm:text-sm font-semibold text-gray-800 hover:bg-amber-100 transition-colors touch-active min-h-[48px] flex items-center rounded-lg"
              >
                Go Home
              </button>
              <button
                onClick={handleCancelGame}
                className="w-full text-left px-4 py-3 text-base sm:text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors touch-active min-h-[48px] flex items-center rounded-lg"
              >
                Cancel Game
              </button>
            </div>
          </>
        )}

        <div className="space-y-5">
            {currentGame.players.map((player, index) => {
              const call = currentRound?.calls.find(c => c.playerId === player.id)?.call;
              const isDealer = player.seatingPosition === dealer.seatingPosition;
              const playerResult = results[player.id];
              const hasResult = playerResult !== undefined && playerResult >= 0;
              
              return (
                <motion.div
                  key={player.id}
                  initial={{ x: 300, opacity: 0, rotateY: 45 }}
                  animate={{ x: 0, opacity: 1, rotateY: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    delay: index * 0.1
                  }}
                  className={`p-5 rounded-2xl border-4 shadow-lg card-depth transition-all ${
                    hasResult
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                      : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Player Info */}
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shadow-md border-2 ${
                        isDealer
                          ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white border-amber-700'
                          : 'bg-gradient-to-br from-gray-700 to-gray-900 text-white border-gray-600'
                      }`}>
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-xl font-bold text-gray-800">{player.name}</p>
                          {isDealer && <Crown className="h-5 w-5 fill-amber-600 text-amber-600" />}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="px-3 py-1 bg-blue-100 border-2 border-blue-300 rounded-lg text-sm font-bold text-blue-700">
                            Called: {call}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Result Input */}
                    <div className="flex items-center space-x-3">
                      <div className="w-32">
                        <Input
                          type="number"
                          min="0"
                          max="13"
                          placeholder="0"
                          value={results[player.id] ?? ''}
                          onChange={(e) => handleResultChange(player.id, e.target.value)}
                          className="text-center text-4xl font-bold h-20 border-4 border-amber-400 focus:border-green-500 shadow-inner bg-white rounded-xl"
                        />
                        <p className="text-xs text-center text-gray-500 mt-1 font-semibold">Tricks Won</p>
                      </div>
                      
                      {hasResult && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring" }}
                        >
                          <Check className="h-8 w-8 text-green-600" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Total Validation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isValidTotal ? 'valid' : 'invalid'}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`p-6 rounded-2xl text-center font-bold border-4 shadow-lg ${
                  isValidTotal
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400'
                    : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-400'
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  {isValidTotal ? (
                    <Check className="h-8 w-8 text-green-600" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  )}
                  <div className="text-left">
                    <p className={`text-3xl font-bold ${isValidTotal ? 'text-green-700' : 'text-red-700'}`}>
                      Total: {total} / 13
                    </p>
                    {!isValidTotal && (
                      <p className="text-sm text-red-600 font-semibold mt-1">
                        Total tricks must equal 13
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-red-600 font-semibold bg-red-50 p-4 rounded-xl border-2 border-red-200"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <AnimatedButton
              onClick={handleSubmit}
              className="w-full h-16 text-xl shadow-xl"
              variant="success"
              disabled={!isValidTotal || !allEntered}
              icon={<Check className="h-6 w-6" />}
            >
              Confirm Results
            </AnimatedButton>
        </div>
      </div>
    </PageCard>
  );
}
