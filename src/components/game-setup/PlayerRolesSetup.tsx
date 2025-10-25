import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Crown, ChevronLeft, Home } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useReducedMotion, getAnimationConfig } from '@/lib/utils/performance';

export function PlayerRolesSetup() {
  const { currentGame, setInitialDealer, updateSeatingOrder, setView, goToPreviousView } = useGameStore();
  const [selectedDealer, setSelectedDealer] = useState(0);
  const [players, setPlayers] = useState(currentGame?.players || []);
  const [selectedForSwap, setSelectedForSwap] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const animConfig = getAnimationConfig(shouldReduceMotion);

  // Update local players state when currentGame.players changes
  useEffect(() => {
    if (currentGame?.players) {
      setPlayers(currentGame.players);
      setSelectedDealer(0); // Reset dealer selection for new game
    }
  }, [currentGame?.players]);

  const handleSubmit = () => {
    updateSeatingOrder(players);
    setInitialDealer(selectedDealer);
    
    // If restarting a game with existing stakes, skip stakes setup and start game
    if (currentGame?.stakes) {
      // Game will be started by the stakes-setup flow, so navigate there
      // but it will immediately start the game since stakes exist
      setView('stakes-setup');
    } else {
      setView('stakes-setup');
    }
  };

  // Card-themed seating positions
  const getCardSuitForPosition = (index: number) => {
    const suits = ['♠', '♥', '♦', '♣'];
    return suits[index % 4];
  };

  // Define positions OUTSIDE map so all cards can reference them
  const positions = [
    { x: '50%', y: '0%', translateX: '-50%', translateY: '0%' },     // Top
    { x: '100%', y: '50%', translateX: '-100%', translateY: '-50%' }, // Right
    { x: '50%', y: '100%', translateX: '-50%', translateY: '-100%' }, // Bottom
    { x: '0%', y: '50%', translateX: '0%', translateY: '-50%' },     // Left
    { x: '25%', y: '0%', translateX: '-50%', translateY: '0%' },     // Top-left (5th player)
  ];

  // Immediate swap action - no delay
  const handleCardClick = (index: number) => {
    if (selectedForSwap === null) {
      // First tap - select this card for swapping (immediate)
      setSelectedForSwap(index);
    } else if (selectedForSwap === index) {
      // Tapped same card - deselect
      setSelectedForSwap(null);
    } else {
      // Second tap - swap the two cards immediately
      const newPlayers = [...players];
      [newPlayers[selectedForSwap], newPlayers[index]] = [newPlayers[index], newPlayers[selectedForSwap]];
      setPlayers(newPlayers);
      
      // Update dealer index if dealer was involved in swap
      if (selectedDealer === selectedForSwap) {
        setSelectedDealer(index);
      } else if (selectedDealer === index) {
        setSelectedDealer(selectedForSwap);
      }
      
      setSelectedForSwap(null);
    }
  };

  // Separate explicit action to set dealer
  const handleSetDealer = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from firing
    setSelectedDealer(index);
    setSelectedForSwap(null); // Clear any swap selection
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
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

        {/* Single Card with Circular Table */}
        <AnimatedCard variant="elevated" className="space-y-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-2"
          >
            <h1 className="text-4xl font-bold text-gray-800">
              {currentGame?.stakes ? 'Review Seating' : 'Arrange the table'}
            </h1>
            <p className="text-base text-gray-600">
              {currentGame?.stakes
                ? 'Review seating from previous game or make changes'
                : 'Tap cards to swap positions'}
            </p>
            <p className="text-sm text-amber-700">Tap crown button to set dealer</p>
          </motion.div>

          {/* Square/Rectangular table with player cards */}
          <div className="relative mx-auto w-full max-w-3xl py-8">
            {/* Green felt table - rectangular */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
              <motion.div 
                className="w-80 h-64 rounded-3xl bg-gradient-to-br from-blue-800 via-blue-900 to-slate-950 shadow-2xl"
                style={{
                  boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3), 0 20px 40px rgba(0,0,0,0.4)'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: shouldReduceMotion ? 0.1 : 0.2, ...animConfig.spring }}
              />
            </div>

            {/* Player cards arranged around rectangular table */}
            <div className="relative h-[400px] w-full">
              {players.map((player: any, index: number) => {
                const isDealer = selectedDealer === index;
                const suit = getCardSuitForPosition(index);
                const suitColor = ['♥', '♦'].includes(suit) ? 'text-red-600' : 'text-gray-800';
                const pos = positions[index] || positions[0];

                const isSelectedForSwap = selectedForSwap === index;
                
                return (
                  <motion.div
                    key={player.id}
                    className="absolute cursor-pointer"
                    style={{
                      left: pos.x,
                      top: pos.y,
                      zIndex: isSelectedForSwap ? 100 : isDealer ? 50 : 10
                    }}
                    initial={{ scale: 0, opacity: 0, x: pos.translateX, y: pos.translateY }}
                    animate={{
                      scale: isSelectedForSwap ? 1.1 : 1,
                      opacity: 1,
                      x: pos.translateX,
                      y: isSelectedForSwap ? `calc(${pos.translateY} - 10px)` : pos.translateY
                    }}
                    transition={{
                      delay: index * animConfig.staggerDelay,
                      ...animConfig.spring
                    }}
                  >
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCardClick(index)}
                      className="relative"
                    >
                      {/* Set as Dealer button - appears above card */}
                      <motion.button
                        onClick={(e: React.MouseEvent) => handleSetDealer(index, e)}
                        className={`absolute -top-10 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          isDealer
                            ? 'bg-amber-500 text-white shadow-lg'
                            : 'bg-white/90 text-gray-700 border-2 border-gray-300 hover:border-amber-400 hover:bg-amber-50'
                        }`}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * animConfig.staggerDelay + (shouldReduceMotion ? 0.1 : 0.2) }}
                      >
                        <Crown className={`h-3 w-3 inline mr-1 ${isDealer ? 'fill-white' : 'fill-amber-500'}`} />
                        {isDealer ? 'Dealer' : 'Set Dealer'}
                      </motion.button>

                      {/* Playing card with golden glow for dealer, purple halo when selected for swap */}
                      <div className={`w-28 h-36 rounded-xl shadow-2xl flex flex-col items-center justify-center space-y-1 transition-all ${
                        // Background based on dealer status
                        isDealer
                          ? 'bg-gradient-to-br from-yellow-200 via-amber-300 to-yellow-400'
                          : 'bg-gradient-to-br from-white via-gray-50 to-white'
                      } ${
                        // Border and glow based on selection state
                        isSelectedForSwap
                          ? 'border-8 border-purple-500 shadow-purple-500/80 shadow-2xl'
                          : isDealer
                          ? 'border-4 border-amber-600 gold-glow'
                          : 'border-4 border-gray-300'
                      }`}>
                        <div className={`text-5xl font-bold ${suitColor}`}>
                          {suit}
                        </div>
                        <div className="text-xl font-bold text-gray-800">
                          {player.name.split(' ')[0]}
                        </div>
                        <div className="text-xs font-semibold text-gray-600 bg-white/50 px-2 py-1 rounded">
                          Seat {index + 1}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <AnimatedButton
            onClick={handleSubmit}
            variant="primary"
            className="w-full h-16 text-xl shadow-xl"
          >
            Continue
          </AnimatedButton>
        </AnimatedCard>
      </div>
    </div>
  );
}