import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Users, ChevronRight, Home } from 'lucide-react';
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

        {/* Header Card */}
        <AnimatedCard variant="floating" className="text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-xl">
                <Users className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Call Break</h1>
            <p className="text-base text-gray-600 font-semibold">
              Select number of players
            </p>
          </motion.div>
        </AnimatedCard>

        {/* Player Count Selector */}
        <AnimatedCard variant="elevated">
          <div className="p-8 space-y-6">
            <div className="flex flex-col items-center space-y-6">
              <p className="text-lg font-bold text-gray-700 uppercase tracking-wide">Number of Players</p>
              
              <div className="flex items-center space-x-6">
                <AnimatedButton
                  variant="secondary"
                  onClick={handleDecrement}
                  disabled={playerCount <= 4}
                  className="w-16 h-16 rounded-full p-0 shadow-lg disabled:opacity-30"
                >
                  <Minus className="h-8 w-8" />
                </AnimatedButton>
                
                <motion.div
                  key={playerCount}
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-32 h-32 flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 rounded-3xl border-4 border-amber-400 shadow-2xl card-depth"
                >
                  <span className="text-7xl font-bold text-amber-800">{playerCount}</span>
                </motion.div>
                
                <AnimatedButton
                  variant="secondary"
                  onClick={handleIncrement}
                  disabled={playerCount >= 5}
                  className="w-16 h-16 rounded-full p-0 shadow-lg disabled:opacity-30"
                >
                  <Plus className="h-8 w-8" />
                </AnimatedButton>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800 font-semibold text-center">
                📌 Call Break requires 4-5 players
              </p>
            </div>

            <AnimatedButton
              onClick={handleContinue}
              className="w-full h-16 text-xl shadow-xl"
              variant="primary"
              icon={<ChevronRight className="h-6 w-6" />}
            >
              Enter Player Details
            </AnimatedButton>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
