import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Crown, ChevronLeft, Home } from 'lucide-react';
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

  const handleCardDrag = (fromIndex: number, toIndex: number) => {
    const newPlayers = [...players];
    const [movedPlayer] = newPlayers.splice(fromIndex, 1);
    newPlayers.splice(toIndex, 0, movedPlayer);
    
    setPlayers(newPlayers);
    
    // Update dealer index if the dealer was moved
    if (selectedDealer === fromIndex) {
      setSelectedDealer(toIndex);
    } else if (fromIndex < selectedDealer && toIndex >= selectedDealer) {
      setSelectedDealer(selectedDealer - 1);
    } else if (fromIndex > selectedDealer && toIndex <= selectedDealer) {
      setSelectedDealer(selectedDealer + 1);
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

  const [draggedCard, setDraggedCard] = useState<number | null>(null);

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
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-800">Who deals first?</h1>
            <p className="text-base text-gray-600 mt-2">Tap a card to select dealer</p>
          </motion.div>

          {/* Circular table with player cards */}
          <div className="relative mx-auto w-full max-w-2xl py-4">
            {/* Green felt table */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
              <motion.div 
                className="w-48 h-48 rounded-full bg-gradient-to-br from-green-700 via-green-800 to-green-900 shadow-2xl"
                style={{
                  boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3), 0 20px 40px rgba(0,0,0,0.4)'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              />
            </div>

            {/* Player cards arranged in circle */}
            <div className="relative h-[500px] w-full overflow-visible">
              {players.map((player, index) => {
                const angle = (index / players.length) * 360 - 90; // Start from top
                const radius = 140;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                const isDealer = selectedDealer === index;
                const suit = getCardSuitForPosition(index);
                const suitColor = ['♥', '♦'].includes(suit) ? 'text-red-600' : 'text-gray-800';

                return (
                  <motion.div
                    key={player.id}
                    className="absolute cursor-pointer touch-none"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      zIndex: isDealer ? 50 : draggedCard === index ? 40 : 10
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: draggedCard === index ? 1.1 : 1, 
                      opacity: 1,
                      x: 0,
                      y: 0
                    }}
                    transition={{ delay: index * 0.1 }}
                    drag
                    dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                    dragElastic={0.2}
                    onDragStart={() => setDraggedCard(index)}
                    onDragEnd={(_, info) => {
                      setDraggedCard(null);
                      // Calculate which position the card was dragged to
                      const dragAngle = Math.atan2(info.point.y - window.innerHeight / 2, info.point.x - window.innerWidth / 2) * 180 / Math.PI;
                      const normalizedAngle = (dragAngle + 90 + 360) % 360;
                      const targetIndex = Math.round((normalizedAngle / 360) * players.length) % players.length;
                      
                      if (targetIndex !== index) {
                        handleCardDrag(index, targetIndex);
                      }
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, y: -8 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedDealer(index);
                      }}
                      className="relative"
                    >
                      {/* Playing card with golden glow for dealer */}
                      <div className={`w-24 h-32 rounded-xl shadow-2xl border-4 flex flex-col items-center justify-center space-y-1 transition-all ${
                        isDealer
                          ? 'bg-gradient-to-br from-yellow-200 via-amber-300 to-yellow-400 border-amber-600 gold-glow'
                          : 'bg-gradient-to-br from-white via-gray-50 to-white border-gray-300'
                      }`}>
                        <div className={`text-5xl font-bold ${suitColor}`}>
                          {suit}
                        </div>
                        <div className="text-xl font-bold text-gray-800">
                          {player.name.split(' ')[0]}
                        </div>
                        <div className="text-xs font-semibold text-gray-600 bg-white/50 px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                      
                      {/* Golden crown for dealer */}
                      {isDealer && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute -top-4 left-1/2 -translate-x-1/2"
                        >
                          <Crown className="h-8 w-8 fill-amber-400 text-amber-600 drop-shadow-2xl" />
                        </motion.div>
                      )}
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