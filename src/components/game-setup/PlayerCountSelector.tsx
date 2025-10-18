import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Users, Home } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';

export function PlayerCountSelector() {
  const [playerCount, setPlayerCount] = useState(4);
  const { setPlayerCount: setStorePlayerCount, goToNextView, setView } = useGameStore();

  const handleIncrement = () => {
    if (playerCount < 5) {
      setPlayerCount(playerCount + 1);
    }
  };

  const handleDecrement = () => {
    if (playerCount > 4) {
      setPlayerCount(playerCount - 1);
    }
  };
  
  const canIncrement = playerCount < 5;
  const canDecrement = playerCount > 4;

  const handleContinue = () => {
    setStorePlayerCount(playerCount);
    goToNextView();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Home button - top left */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex justify-start"
        >
          <AnimatedButton
            variant="secondary"
            onClick={() => setView('home')}
            className="w-14 h-14 rounded-full p-0 shadow-xl"
          >
            <Home className="h-6 w-6" />
          </AnimatedButton>
        </motion.div>

        {/* Single Card - Header + Selector Combined */}
        <AnimatedCard variant="elevated" className="space-y-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-2"
          >
            <motion.div 
              className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto shadow-xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Users className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800">How many players?</h1>
          </motion.div>

          <div className="flex items-center justify-center space-x-6">
            <motion.button
              onClick={handleDecrement}
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl transition-all ${
                canDecrement 
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white hover:shadow-2xl' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-40'
              }`}
              disabled={!canDecrement}
              whileHover={{ scale: canDecrement ? 1.1 : 1 }}
              whileTap={{ scale: canDecrement ? 0.9 : 1 }}
            >
              <Minus className="h-8 w-8" />
            </motion.button>
            
            <motion.div 
              className="w-36 h-36 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-200 to-amber-100 border-4 border-amber-500 flex items-center justify-center shadow-3xl"
              key={playerCount}
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="text-8xl font-bold text-gray-800">{playerCount}</span>
            </motion.div>
            
            <motion.button
              onClick={handleIncrement}
              className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl transition-all ${
                canIncrement 
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white hover:shadow-2xl' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-40'
              }`}
              disabled={!canIncrement}
              whileHover={{ scale: canIncrement ? 1.1 : 1 }}
              whileTap={{ scale: canIncrement ? 0.9 : 1 }}
            >
              <Plus className="h-8 w-8" />
            </motion.button>
          </div>

          <motion.div 
            className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-lg text-blue-900 text-center font-medium">
              4-5 players required
            </p>
          </motion.div>

          <AnimatedButton
            onClick={handleContinue}
            className="w-full h-16 text-xl shadow-xl"
            variant="primary"
          >
            Continue
          </AnimatedButton>
        </AnimatedCard>
      </div>
    </div>
  );
}
