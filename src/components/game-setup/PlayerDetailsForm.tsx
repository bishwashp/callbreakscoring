import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/store/gameStore';
import { validatePlayerNames } from '@/lib/scoring/validator';
import { Users, ChevronRight, ChevronLeft, User } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';

export function PlayerDetailsForm() {
  const { currentGame, setPlayers, goToNextView, goToPreviousView } = useGameStore();
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

            <div className="flex space-x-4 pt-4">
              <AnimatedButton
                variant="secondary"
                onClick={goToPreviousView}
                className="flex-1 h-14 text-lg"
                icon={<ChevronLeft className="h-5 w-5" />}
              >
                Back
              </AnimatedButton>
              <AnimatedButton
                onClick={handleSubmit}
                className="flex-1 h-14 text-lg"
                variant="primary"
                icon={<ChevronRight className="h-5 w-5" />}
              >
                Continue
              </AnimatedButton>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
