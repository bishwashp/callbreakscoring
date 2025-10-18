import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/store/gameStore';
import { validatePlayerNames } from '@/lib/scoring/validator';
import { Users, ChevronRight, ChevronLeft, User, Home } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';

export function PlayerDetailsForm() {
  const { currentGame, setPlayers, goToNextView, goToPreviousView, setView } = useGameStore();
  const [playerNames, setPlayerNames] = useState<string[]>(
    currentGame?.players.map(p => p.name) || []
  );
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
    setError(null);
  };

  const handleSubmit = () => {
    const validation = validatePlayerNames(playerNames);
    
    if (!validation.valid && !validation.errors[0].startsWith('Warning')) {
      setError(validation.errors[0]);
      return;
    }

    if (currentGame) {
      const updatedPlayers = currentGame.players.map((player, index) => ({
        ...player,
        name: playerNames[index].trim() || `Player ${index + 1}`,
      }));
      setPlayers(updatedPlayers);
      goToNextView();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
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

        {/* Header Card */}
        <AnimatedCard variant="floating" className="text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-xl">
                <Users className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Player Details</h1>
            <p className="text-base text-gray-600 font-semibold">
              Enter names for all players
            </p>
          </motion.div>
        </AnimatedCard>

        {/* Player Names Form */}
        <AnimatedCard variant="elevated">
          <div className="p-6 space-y-5">
            {currentGame?.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-md">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <label className="text-lg font-bold text-gray-700">
                    Player {index + 1}
                  </label>
                </div>
                <Input
                  placeholder={`Enter name for Player ${index + 1}`}
                  value={playerNames[index] || ''}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="h-14 text-lg border-4 border-amber-300 focus:border-green-500 shadow-sm rounded-xl font-semibold"
                />
              </motion.div>
            ))}
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-red-600 font-semibold bg-red-50 p-4 rounded-xl border-2 border-red-200 text-base"
              >
                {error}
              </motion.div>
            )}

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800 font-semibold text-center">
                💡 Leave blank to use default names (Player 1, Player 2, etc.)
              </p>
            </div>

            <AnimatedButton
              onClick={handleSubmit}
              className="w-full h-16 text-xl shadow-xl"
              variant="primary"
              icon={<ChevronRight className="h-6 w-6" />}
            >
              Continue
            </AnimatedButton>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
