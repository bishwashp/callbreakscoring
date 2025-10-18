import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useGameStore } from '@/store/gameStore';
import { DollarSign, ChevronLeft, Play, SkipForward, TrendingUp, Home } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';

export function StakesSetup() {
  const { currentGame, setStakes, startGame, goToPreviousView, setView } = useGameStore();
  const playerCount = currentGame?.players.length || 4;
  
  // Default currency and amounts (one less than player count, as winner doesn't pay)
  const [currency, setCurrency] = useState('$');
  const [amounts, setAmounts] = useState<number[]>(
    Array(playerCount - 1).fill(0).map((_, i) => (playerCount - 1 - i) * 5)
  );

  const handleAmountChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newAmounts = [...amounts];
    newAmounts[index] = numValue;
    setAmounts(newAmounts);
  };

  const handleContinue = () => {
    setStakes({
      currency,
      amounts,
    });
    startGame();
  };

  const handleSkip = () => {
    startGame();
  };

  const totalPot = amounts.reduce((sum, amt) => sum + amt, 0);

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

        {/* Single Card - Header + Form Combined */}
        <AnimatedCard variant="elevated" className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-2"
          >
            <motion.div 
              className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto shadow-xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <DollarSign className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800">Stakes Setup</h1>
            <p className="text-base text-gray-600">Define payouts by rank (optional)</p>
          </motion.div>

          {/* Currency Selector */}
          <div className="space-y-3">
            <label className="text-lg font-bold text-gray-700 uppercase tracking-wide">Currency</label>
            <div className="flex space-x-3">
              {['$', '€', '£', 'Rs', '¥'].map((sym) => (
                <motion.button
                  key={sym}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrency(sym)}
                  className={`flex-1 h-14 rounded-xl border-4 font-bold text-xl transition-all shadow-md ${
                    currency === sym
                      ? 'border-green-500 bg-gradient-to-br from-green-400 to-emerald-600 text-white'
                      : 'border-amber-300 bg-white text-gray-700 hover:border-amber-400'
                  }`}
                >
                  {sym}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Payment Amounts */}
          <div className="space-y-4">
            <label className="text-lg font-bold text-gray-700 uppercase tracking-wide">Payment by Rank</label>
            {amounts.map((amount, index) => {
              const position = playerCount - index; // 4th place, 3rd place, 2nd place
              const positionLabels: Record<number, string> = {
                [playerCount]: 'Lowest Scorer',
                [playerCount - 1]: '2nd Lowest',
                [playerCount - 2]: '3rd Lowest',
              };
              
              return (
                <motion.div
                  key={index}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border-2 border-red-200"
                >
                  <p className="text-sm font-bold text-red-700 mb-2 uppercase tracking-wide">
                    {positionLabels[position] || `${position}th Place`}
                  </p>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-gray-800">{currency}</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount || ''}
                      onChange={(e) => handleAmountChange(index, e.target.value)}
                      className="h-16 text-3xl font-bold text-center border-4 border-amber-400 focus:border-green-500 shadow-inner rounded-xl"
                      placeholder="0"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Total Pot */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-400 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-green-700" />
                <span className="text-lg font-bold text-green-800">Winner Receives:</span>
              </div>
              <span className="text-4xl font-bold text-green-700">
                {currency}{totalPot.toFixed(2)}
              </span>
            </div>
          </motion.div>

          {/* Example */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800 font-semibold">
              <strong>📖 How it works:</strong> At game end, lowest scorer pays {currency}{amounts[0]}, 
              second lowest pays {currency}{amounts[1] || 0}, etc. Winner collects all!
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <AnimatedButton
              onClick={handleContinue}
              className="w-full h-16 text-xl shadow-xl"
              variant="success"
              icon={<Play className="h-6 w-6" />}
            >
              Start Game
            </AnimatedButton>
            <AnimatedButton
              variant="secondary"
              onClick={handleSkip}
              className="w-full h-14 text-lg"
              icon={<SkipForward className="h-5 w-5" />}
            >
              Skip Stakes
            </AnimatedButton>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
