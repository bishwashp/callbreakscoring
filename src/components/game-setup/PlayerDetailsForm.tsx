import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/store/gameStore';
import { validatePlayerNames } from '@/lib/scoring/validator';
import { Users, ChevronLeft, Home } from 'lucide-react';
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

        {/* Single Card - Header + Inputs Combined */}
        <AnimatedCard variant="elevated" className="space-y-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-2"
          >
            <motion.div 
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto shadow-xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Users className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800">Who's playing?</h1>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-4"
            >
              <p className="text-base text-red-600 font-semibold text-center">{error}</p>
            </motion.div>
          )}

          <div className="space-y-4">
            {currentGame?.players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <label className="block text-lg font-semibold text-gray-700 ml-1">
                  Player {index + 1}
                </label>
                <Input
                  type="text"
                  value={playerNames[index] || ''}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Enter name for player ${index + 1}`}
                  className="h-14 text-lg border-2 border-amber-300 focus:border-amber-500 rounded-xl shadow-md"
                />
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4"
          >
            <p className="text-base text-blue-900 text-center font-medium">
              Leave blank for default names
            </p>
          </motion.div>

          <AnimatedButton
            onClick={handleSubmit}
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
