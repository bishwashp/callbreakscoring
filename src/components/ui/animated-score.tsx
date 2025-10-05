import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedScoreProps {
  value: number;
  label?: string;
  variant?: 'default' | 'card' | 'floating' | 'glow';
  size?: 'sm' | 'default' | 'lg' | 'xl';
  animated?: boolean;
  showChange?: boolean;
  previousValue?: number;
}

export function AnimatedScore({ 
  value, 
  label,
  variant = 'default',
  size = 'default',
  animated = true,
  showChange = false,
  previousValue
}: AnimatedScoreProps) {
  const [displayValue, setDisplayValue] = useState(previousValue || value);
  const [change, setChange] = useState(0);

  const variants = {
    default: "bg-white border-2 border-gray-200 shadow-md",
    card: "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 shadow-lg",
    floating: "bg-white/90 backdrop-blur-sm border-2 border-gray-300 shadow-xl",
    glow: "bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 shadow-lg ring-4 ring-blue-200"
  };

  const sizes = {
    sm: "p-3 text-sm",
    default: "p-4 text-base",
    lg: "p-6 text-lg",
    xl: "p-8 text-xl"
  };

  useEffect(() => {
    if (animated) {
      const difference = value - (previousValue || 0);
      setChange(difference);
      
      // Animate the number counting
      const duration = 1000;
      const startTime = Date.now();
      const startValue = displayValue;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (value - startValue) * easeOutCubic;
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setDisplayValue(value);
    }
  }, [value, previousValue, animated, displayValue]);

  return (
    <motion.div
      className={`rounded-xl ${variants[variant]} ${sizes[size]} relative overflow-hidden`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      {/* Label */}
      {label && (
        <motion.div
          className="text-sm font-medium text-gray-600 mb-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {label}
        </motion.div>
      )}
      
      {/* Score value */}
      <div className="relative">
        <motion.span
          className="font-bold text-2xl"
          key={displayValue} // Re-render when value changes
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {displayValue.toFixed(1)}
        </motion.span>
        
        {/* Change indicator */}
        <AnimatePresence>
          {showChange && change !== 0 && (
            <motion.span
              className={`ml-2 text-sm font-medium ${
                change > 0 ? 'text-green-600' : 'text-red-600'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {change > 0 ? '+' : ''}{change.toFixed(1)}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      
      {/* Particle effect on value change */}
      <AnimatePresence>
        {change !== 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full ${
                  change > 0 ? 'bg-green-400' : 'bg-red-400'
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ 
                  scale: 0, 
                  opacity: 1,
                  x: 0,
                  y: 0
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  x: (Math.random() - 0.5) * 100,
                  y: (Math.random() - 0.5) * 100
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
      
      {/* Shimmer effect for glow variant */}
      {variant === 'glow' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        />
      )}
    </motion.div>
  );
}

// Player score card with avatar and animations
interface PlayerScoreCardProps {
  playerName: string;
  score: number;
  previousScore?: number;
  rank?: number;
  isWinner?: boolean;
  avatar?: string;
  animated?: boolean;
}

export function PlayerScoreCard({
  playerName,
  score,
  previousScore,
  rank,
  isWinner = false,
  avatar,
  animated = true
}: PlayerScoreCardProps) {
  const change = previousScore ? score - previousScore : 0;
  
  return (
    <motion.div
      className={`relative rounded-xl p-4 border-2 shadow-lg transition-all duration-300 ${
        isWinner 
          ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400 shadow-yellow-200' 
          : 'bg-white border-gray-200'
      }`}
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: rank ? rank * 0.1 : 0
      }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      {/* Winner crown */}
      {isWinner && (
        <motion.div
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-2xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.5 }}
        >
          👑
        </motion.div>
      )}
      
      {/* Rank badge */}
      {rank && (
        <motion.div
          className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
            rank === 1 ? 'bg-yellow-500' :
            rank === 2 ? 'bg-gray-400' :
            rank === 3 ? 'bg-amber-600' :
            'bg-gray-500'
          }`}
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.3 }}
        >
          {rank}
        </motion.div>
      )}
      
      {/* Player info */}
      <div className="flex items-center space-x-3 mb-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
          {avatar || playerName.charAt(0).toUpperCase()}
        </div>
        
        {/* Name */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{playerName}</h3>
          {change !== 0 && (
            <motion.span
              className={`text-sm ${
                change > 0 ? 'text-green-600' : 'text-red-600'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {change > 0 ? '+' : ''}{change.toFixed(1)}
            </motion.span>
          )}
        </div>
      </div>
      
      {/* Score */}
      <AnimatedScore
        value={score}
        previousValue={previousScore}
        animated={animated}
        showChange={true}
        size="lg"
        variant={isWinner ? 'glow' : 'default'}
      />
      
      {/* Winner celebration particles */}
      {isWinner && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ 
                scale: 0, 
                opacity: 1,
                x: 0,
                y: 0
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
                x: Math.cos(i * 45 * Math.PI / 180) * 60,
                y: Math.sin(i * 45 * Math.PI / 180) * 60
              }}
              transition={{
                duration: 1.5,
                delay: 0.8 + i * 0.1
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
