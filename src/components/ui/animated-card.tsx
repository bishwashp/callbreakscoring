import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'floating' | 'game-card';
  onClick?: () => void;
  whileHover?: any;
  whileTap?: any;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
}

export function AnimatedCard({ 
  children, 
  className = '', 
  variant = 'default',
  onClick,
  whileHover,
  whileTap,
  initial,
  animate,
  exit,
  transition,
  ...props 
}: AnimatedCardProps) {
  const variants = {
    default: "bg-gradient-to-br from-white via-amber-50/30 to-white border-4 border-amber-200 shadow-lg hover:shadow-xl",
    elevated: "bg-gradient-to-br from-white via-amber-50/50 to-white border-4 border-amber-300 shadow-2xl hover:shadow-3xl",
    floating: "bg-gradient-to-br from-amber-50 via-white to-amber-50 border-4 border-amber-400 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2",
    'game-card': "bg-gradient-to-br from-red-50 via-white to-amber-50 border-4 border-red-300 shadow-2xl hover:shadow-3xl"
  };

  const defaultWhileHover = variant === 'floating' ? { scale: 1.02, y: -8 } : { scale: 1.01 };
  const defaultWhileTap = { scale: 0.97 };
  const defaultTransition = { type: "spring", stiffness: 260, damping: 22 };

  return (
    <motion.div
      className={`rounded-xl p-6 transition-all duration-300 ${variants[variant]} ${className}`}
      onClick={onClick}
      whileHover={whileHover || defaultWhileHover}
      whileTap={whileTap || defaultWhileTap}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition || defaultTransition}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Card suit icons as React components
export const CardSuits = {
  Spades: () => (
    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  ),
  Hearts: () => (
    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  Diamonds: () => (
    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  ),
  Clubs: () => (
    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  )
};

// Floating card deck component
export function FloatingCardDeck({ count = 52 }: { count?: number }) {
  return (
    <div className="relative">
      {Array.from({ length: Math.min(count, 8) }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-12 h-16 bg-white border-2 border-gray-300 rounded-lg shadow-lg"
          style={{
            left: i * 2,
            top: i * 1,
            zIndex: 8 - i,
          }}
          initial={{ rotate: Math.random() * 10 - 5 }}
          animate={{ 
            rotate: [Math.random() * 10 - 5, Math.random() * 10 - 5],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );
}
