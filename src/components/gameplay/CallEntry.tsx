import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/store/gameStore';
import type { PlayerCall } from '@/types/game.types';
import { Crown, ChevronRight, Check, Home, Menu, Edit2 } from 'lucide-react';
import { getCallingOrder, getCurrentCallerIndex } from '@/lib/game-logic/call-order';
import { PageCard } from '@/components/ui/page-card';
import { AnimatedButton } from '@/components/ui/animated-button';

export function CallEntry() {
  const { currentGame, getCurrentDealer, enterCalls, error, setHasUnsavedChanges, setView, deleteActiveGame, restartGameWithSamePlayers } = useGameStore();
  const dealer = getCurrentDealer();
  const [calls, setCalls] = useState<Record<string, number>>({});
  const [currentCall, setCurrentCall] = useState<string>('');
  const [showMenu, setShowMenu] = useState(false);

  if (!currentGame || !dealer) return null;

  const callsMade = Object.keys(calls).length;
  const callingOrder = getCallingOrder(dealer.seatingPosition, currentGame.players.length);
  const currentCallerIndex = getCurrentCallerIndex(dealer.seatingPosition, currentGame.players.length, callsMade);
  const currentPlayer = currentCallerIndex !== null ? currentGame.players[currentCallerIndex] : null;
  
  const allCallsComplete = callsMade === currentGame.players.length;

  const handleNextCall = () => {
    if (!currentPlayer) return;
    
    const callValue = parseInt(currentCall) || 0;
    if (callValue < 1 || callValue > 13) return;

    // Add call to the record
    setCalls(prev => ({ ...prev, [currentPlayer.id]: callValue }));
    setCurrentCall('');
    setHasUnsavedChanges(true);
  };

  const handleSubmit = () => {
    if (!currentGame) return;

    const playerCalls: PlayerCall[] = currentGame.players.map(player => ({
      playerId: player.id,
      call: calls[player.id],
    }));

    enterCalls(playerCalls);
    setHasUnsavedChanges(false);
  };

  // Reset unsaved changes when component unmounts
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  const isValidCall = currentCall && parseInt(currentCall) >= 1 && parseInt(currentCall) <= 13;

  // Get player cards that slide in from the deck
  const getPlayerCards = () => {
    return callingOrder.map((playerIndex, orderIndex) => {
      const player = currentGame.players[playerIndex];
      const hasCalled = calls[player.id] !== undefined;
      const isCurrentCaller = orderIndex === callsMade && !allCallsComplete;
      const isDealer = player.seatingPosition === dealer.seatingPosition;
      
      return { player, hasCalled, isCurrentCaller, orderIndex, isDealer };
    });
  };

  const handleEditCall = (playerId: string) => {
    const newCalls = { ...calls };
    delete newCalls[playerId];
    setCalls(newCalls);
    setCurrentCall('');
    setHasUnsavedChanges(true);
  };

  const handleCancelGame = async () => {
    if (confirm('Are you sure you want to cancel this game? All progress will be lost.')) {
      await deleteActiveGame();
      setShowMenu(false);
    }
  };

  const handleNewGameSamePlayers = () => {
    if (confirm('Start a new game with the same players? Current game progress will be saved to history.')) {
      restartGameWithSamePlayers();
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
      subtitle={`Dealer: ${dealer.name}`}
      titleIcon={<Crown className="h-6 w-6 text-amber-600 fill-amber-600" />}
      variant="elevated"
      className="max-w-2xl"
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
                onClick={handleNewGameSamePlayers}
                className="w-full text-left px-4 py-3 text-base sm:text-sm font-semibold text-blue-600 hover:bg-blue-100 transition-colors touch-active min-h-[48px] flex items-center rounded-lg"
              >
                New Game (Same Players)
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

        {/* Current player calling */}
            {!allCallsComplete && currentPlayer && (
              <motion.div
                key={currentPlayer.id}
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-red-50 to-amber-50 rounded-2xl p-6 border-4 border-red-300 shadow-lg"
              >
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                      {currentPlayer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-gray-800">{currentPlayer.name}</p>
                      <p className="text-sm text-gray-600">Your turn to call</p>
                    </div>
                  </div>

                  {/* Large input field */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <Input
                        type="number"
                        min="1"
                        max="13"
                        placeholder="Enter call (1-13)"
                        value={currentCall}
                        onChange={(e) => setCurrentCall(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && isValidCall) {
                            handleNextCall();
                          }
                        }}
                        className="text-center text-4xl font-bold h-20 border-4 border-amber-300 focus:border-red-500 shadow-inner bg-white"
                      />
                    </div>
                    <AnimatePresence>
                      {isValidCall && (
                        <motion.div
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                        >
                          <AnimatedButton
                            onClick={handleNextCall}
                            className="h-20 w-20 rounded-full text-2xl shadow-lg"
                            variant="primary"
                          >
                            <ChevronRight className="h-8 w-8" />
                          </AnimatedButton>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Call between 1 and 13 tricks
                  </p>
                </div>
              </motion.div>
            )}

            {/* Completed calls - cards sliding in */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {getPlayerCards().map(({ player, hasCalled, isCurrentCaller, orderIndex, isDealer }) => {
                  if (!hasCalled && !isCurrentCaller) return null;
                  
                  return (
                    <motion.div
                      key={player.id}
                      initial={{ x: 300, opacity: 0, rotateY: 45 }}
                      animate={{ x: 0, opacity: 1, rotateY: 0 }}
                      exit={{ x: -300, opacity: 0, rotateY: -45 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                        delay: orderIndex * 0.1
                      }}
                      className={`rounded-xl p-4 border-2 flex items-center justify-between shadow-md ${
                        hasCalled
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                          : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 opacity-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                          isDealer 
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white' 
                            : 'bg-gradient-to-br from-gray-600 to-gray-800 text-white'
                        }`}>
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 flex items-center space-x-2">
                            <span>{player.name}</span>
                            {isDealer && <Crown className="h-4 w-4 fill-amber-600" />}
                          </p>
                          <p className="text-xs text-gray-500">
                            {isCurrentCaller ? 'Calling...' : `Called: ${calls[player.id]}`}
                          </p>
                        </div>
                      </div>
                      {hasCalled && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center space-x-3"
                        >
                          <div className="text-3xl font-bold text-green-700">
                            {calls[player.id]}
                          </div>
                          <Check className="h-6 w-6 text-green-600" />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditCall(player.id)}
                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                            title="Edit call"
                          >
                            <Edit2 className="h-5 w-5" />
                          </motion.button>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Submit button when all calls are complete */}
            {allCallsComplete && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <AnimatedButton
                  onClick={handleSubmit}
                  className="w-full h-16 text-xl shadow-xl"
                  variant="success"
                  icon={<Check className="h-6 w-6" />}
                >
                  Confirm All Calls
                </AnimatedButton>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-red-600 font-semibold bg-red-50 p-3 rounded-lg border border-red-200"
              >
                {error}
              </motion.div>
            )}
        </div>
      </PageCard>
  );
}

