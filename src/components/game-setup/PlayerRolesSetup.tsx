import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/gameStore';
import { Crown, Shuffle, Users, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { SimpleTouchDrag } from '@/components/ui/simple-touch-drag';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';

export function PlayerRolesSetup() {
  const { currentGame, setInitialDealer, updateSeatingOrder, setView, goToPreviousView } = useGameStore();
  const [selectedDealer, setSelectedDealer] = useState(0);
  const [players, setPlayers] = useState(currentGame?.players || []);

  // Update local players state when currentGame.players changes
  useEffect(() => {
    if (currentGame?.players) {
      setPlayers(currentGame.players);
      setSelectedDealer(0); // Reset dealer selection for new game
    }
  }, [currentGame?.players]);

  const handleReorder = (newPlayers: typeof players) => {
    setPlayers(newPlayers);
    
    // Update dealer index if the dealer was moved
    const oldDealerId = players[selectedDealer]?.id;
    const newDealerIndex = newPlayers.findIndex(p => p.id === oldDealerId);
    if (newDealerIndex !== -1) {
      setSelectedDealer(newDealerIndex);
    }
  };

  const handleSubmit = () => {
    updateSeatingOrder(players);
    setInitialDealer(selectedDealer);
    setView('stakes-setup');
  };

  // Card-themed seating positions
  const getCardSuitForPosition = (index: number) => {
    const suits = ['♠', '♥', '♦', '♣'];
    return suits[index % 4];
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-4">
        {/* Navigation buttons */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex justify-between"
        >
          <AnimatedButton
            variant="secondary"
            onClick={goToPreviousView}
            className="w-14 h-14 rounded-full p-0 shadow-xl"
          >
            <ChevronLeft className="h-6 w-6" />
          </AnimatedButton>
          <AnimatedButton
            variant="secondary"
            onClick={() => setView('home')}
            className="w-14 h-14 rounded-full p-0 shadow-xl"
          >
            <Home className="h-6 w-6" />
          </AnimatedButton>
        </motion.div>

        {/* Decorative card table */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {/* Main seating card */}
          <AnimatedCard 
            variant="elevated" 
            className="bg-gradient-to-br from-amber-50 via-white to-red-50 border-4 border-amber-300 shadow-2xl"
          >
            <CardHeader className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Shuffle className="h-8 w-8 text-amber-600" />
                </motion.div>
                <CardTitle className="text-3xl text-gray-800">Seating Arrangement</CardTitle>
              </div>
              <CardDescription className="text-base text-gray-600">
                Arrange players clockwise around the table
              </CardDescription>
              <div className="bg-amber-100 border-2 border-amber-400 rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <Crown className="h-5 w-5 fill-amber-600 text-amber-600" />
                  <span className="font-bold text-amber-800">
                    Dealer: {players[selectedDealer]?.name || 'Not selected'}
                  </span>
                </div>
                <p className="text-xs text-amber-700">
                  Player after dealer calls first, dealer calls last
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Circular table visualization */}
              <div className="relative mx-auto w-full max-w-md">
                {/* Table center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-700 to-green-900 border-4 border-amber-600 shadow-xl flex items-center justify-center">
                    <Users className="h-12 w-12 text-amber-200" />
                  </div>
                </div>

                {/* Player cards arranged in circle */}
                <div className="relative h-80">
                  {players.map((player, index) => {
                    const angle = (index / players.length) * 360 - 90; // Start from top
                    const radius = 120;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;
                    const isDealer = selectedDealer === index;
                    const suit = getCardSuitForPosition(index);
                    const suitColor = ['♥', '♦'].includes(suit) ? 'text-red-600' : 'text-gray-800';

                    return (
                      <motion.div
                        key={player.id}
                        className="absolute"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedDealer(index);
                          }}
                          className={`cursor-pointer relative`}
                        >
                          {/* Playing card */}
                          <div className={`w-20 h-28 rounded-lg shadow-xl border-4 flex flex-col items-center justify-center space-y-1 transition-all ${
                            isDealer
                              ? 'bg-gradient-to-br from-amber-200 to-amber-400 border-amber-600'
                              : 'bg-gradient-to-br from-white to-gray-50 border-gray-300'
                          }`}>
                            <div className={`text-4xl font-bold ${suitColor}`}>
                              {suit}
                            </div>
                            <div className="text-2xl font-bold text-gray-800">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-xs font-semibold text-gray-600">
                              Seat {index + 1}
                            </div>
                          </div>
                          
                          {/* Crown for dealer */}
                          {isDealer && (
                            <motion.div
                              initial={{ scale: 0, y: 10 }}
                              animate={{ scale: 1, y: 0 }}
                              className="absolute -top-3 left-1/2 -translate-x-1/2"
                            >
                              <Crown className="h-7 w-7 fill-amber-500 text-amber-600 drop-shadow-lg" />
                            </motion.div>
                          )}
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Drag to reorder list */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-3 text-center flex items-center justify-center space-x-2">
                  <Shuffle className="h-4 w-4" />
                  <span>Drag to Reorder Seats</span>
                </p>
                <SimpleTouchDrag
                  items={players}
                  onReorder={handleReorder}
                >
                  {(player, index) => (
                    <div className="flex items-center justify-between w-full">
                      <div 
                        className="flex items-center space-x-3 cursor-pointer flex-1"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedDealer(index);
                        }}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg border-2 ${
                          selectedDealer === index 
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white border-amber-700' 
                            : 'bg-white text-gray-700 border-gray-300'
                        }`}>
                          {getCardSuitForPosition(index)}
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-semibold text-gray-800">{player.name || `Player ${index + 1}`}</p>
                          <p className="text-xs text-gray-500">Seat {index + 1}</p>
                        </div>
                      </div>
                      {selectedDealer === index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center space-x-1 text-amber-700 bg-amber-100 px-2 py-1 rounded-full"
                        >
                          <Crown className="h-4 w-4 fill-current" />
                          <span className="text-xs font-bold">Dealer</span>
                        </motion.div>
                      )}
                    </div>
                  )}
                </SimpleTouchDrag>
              </div>
              
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-900">
                  <strong>💡 How to use:</strong> Tap a card above or in the list to select dealer. 
                  Use the grip icon (⋮⋮) in the list to drag and reorder seating positions clockwise.
                </p>
              </div>
              
              <AnimatedButton
              onClick={handleSubmit}
              variant="primary"
              className="w-full h-16 text-xl shadow-xl"
              icon={<ChevronRight className="h-6 w-6" />}
            >
              Continue
            </AnimatedButton>
            </CardContent>
          </AnimatedCard>
        </motion.div>
      </div>
    </div>
  );
}