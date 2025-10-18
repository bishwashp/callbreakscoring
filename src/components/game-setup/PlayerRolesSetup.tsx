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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const swapPlayers = (index1: number, index2: number) => {
    const newPlayers = [...players];
    [newPlayers[index1], newPlayers[index2]] = [newPlayers[index2], newPlayers[index1]];
    setPlayers(newPlayers);
    
    // Update dealer index if dealer was involved in swap
    if (selectedDealer === index1) {
      setSelectedDealer(index2);
    } else if (selectedDealer === index2) {
      setSelectedDealer(index1);
    }
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
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-800">Who deals first?</h1>
            <p className="text-base text-gray-600 mt-2">Tap a card to select dealer</p>
          </motion.div>

          {/* Square/Rectangular table with player cards */}
          <div className="relative mx-auto w-full max-w-3xl py-8">
            {/* Green felt table - rectangular */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
              <motion.div 
                className="w-80 h-64 rounded-3xl bg-gradient-to-br from-green-700 via-green-800 to-green-900 shadow-2xl"
                style={{
                  boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3), 0 20px 40px rgba(0,0,0,0.4)'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              />
            </div>

            {/* Player cards arranged around rectangular table */}
            <div className="relative h-[400px] w-full">
              {players.map((player, index) => {
                const isDealer = selectedDealer === index;
                const suit = getCardSuitForPosition(index);
                const suitColor = ['♥', '♦'].includes(suit) ? 'text-red-600' : 'text-gray-800';
                
                // Position cards around the rectangular table
                // Top, Right, Bottom, Left arrangement
                const positions = [
                  { x: '50%', y: '0%', translateX: '-50%', translateY: '0%' },     // Top
                  { x: '100%', y: '50%', translateX: '-100%', translateY: '-50%' }, // Right
                  { x: '50%', y: '100%', translateX: '-50%', translateY: '-100%' }, // Bottom
                  { x: '0%', y: '50%', translateX: '0%', translateY: '-50%' },     // Left
                  { x: '25%', y: '0%', translateX: '-50%', translateY: '0%' },     // Top-left (5th player)
                ];
                
                const pos = positions[index] || positions[0];

                return (
                  <motion.div
                    key={player.id}
                    className="absolute cursor-grab active:cursor-grabbing"
                    style={{
                      left: pos.x,
                      top: pos.y,
                      zIndex: draggedCard === index ? 100 : isDealer ? 50 : hoveredCard === index ? 30 : 10
                    }}
                    initial={{ scale: 0, opacity: 0, x: pos.translateX, y: pos.translateY }}
                    animate={{ 
                      scale: draggedCard === index ? 1.15 : hoveredCard === index ? 1.05 : 1,
                      opacity: 1,
                      x: pos.translateX,
                      y: pos.translateY,
                      rotateZ: draggedCard === index ? 5 : 0
                    }}
                    transition={{ 
                      delay: draggedCard === index ? 0 : index * 0.15, 
                      type: 'spring',
                      stiffness: 300,
                      damping: 20
                    }}
                    drag
                    dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
                    dragElastic={0.1}
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                    onDragStart={() => setDraggedCard(index)}
                    onDrag={(event) => {
                      // Calculate which card we're hovering over based on drag position
                      const cardElement = event.currentTarget as HTMLElement;
                      const rect = cardElement.getBoundingClientRect();
                      const centerX = rect.left + rect.width / 2;
                      const centerY = rect.top + rect.height / 2;
                      
                      // Check each player position to see if we're hovering over them
                      let foundHover = null;
                      players.forEach((_, idx) => {
                        if (idx === index) return; // Skip self
                        
                        const otherPos = positions[idx] || positions[0];
                        const container = cardElement.parentElement;
                        if (!container) return;
                        
                        const containerRect = container.getBoundingClientRect();
                        const otherX = containerRect.left + (containerRect.width * parseFloat(otherPos.x) / 100);
                        const otherY = containerRect.top + (containerRect.height * parseFloat(otherPos.y) / 100);
                        
                        const distance = Math.sqrt(Math.pow(centerX - otherX, 2) + Math.pow(centerY - otherY, 2));
                        
                        if (distance < 80) { // Within 80px = hovering
                          foundHover = idx;
                        }
                      });
                      
                      setHoveredCard(foundHover);
                    }}
                    onDragEnd={() => {
                      if (hoveredCard !== null && draggedCard !== null) {
                        // Swap the two players
                        swapPlayers(draggedCard, hoveredCard);
                      }
                      setDraggedCard(null);
                      setHoveredCard(null);
                    }}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
                      onClick={(e) => {
                        // Only select dealer if not dragging
                        if (draggedCard === null) {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedDealer(index);
                        }
                      }}
                      className="relative"
                    >
                      {/* Playing card with golden glow for dealer, blue glow when hovered during drag */}
                      <div className={`w-28 h-36 rounded-xl shadow-2xl border-4 flex flex-col items-center justify-center space-y-1 transition-all ${
                        isDealer
                          ? 'bg-gradient-to-br from-yellow-200 via-amber-300 to-yellow-400 border-amber-600 gold-glow'
                          : hoveredCard === index
                          ? 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-100 border-blue-400 shadow-blue-500/50 shadow-2xl'
                          : 'bg-gradient-to-br from-white via-gray-50 to-white border-gray-300'
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