import React from 'react';
import { motion } from 'framer-motion';

interface CardBackgroundProps {
  children: React.ReactNode;
  variant?: 'table' | 'casino' | 'elegant' | 'minimal';
  className?: string;
}

export function CardBackground({ 
  children, 
  variant = 'table',
  className = ''
}: CardBackgroundProps) {
  const variants = {
    table: "bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950",
    casino: "bg-gradient-to-br from-red-950 via-red-900 to-black",
    elegant: "bg-gradient-to-br from-indigo-900 via-blue-950 to-slate-950",
    minimal: "bg-gradient-to-br from-gray-100 via-gray-50 to-white"
  };

  // Card suit symbols with colors
  const suits = [
    { symbol: '♠', color: 'text-white/30' },
    { symbol: '♥', color: 'text-red-400/30' },
    { symbol: '♦', color: 'text-red-400/30' },
    { symbol: '♣', color: 'text-white/30' }
  ];

  return (
    <div className={`min-h-screen ${variants[variant]} relative overflow-hidden ${className}`}>
      {/* Poker felt texture */}
      {variant !== 'minimal' && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      )}
      
      {/* Animated falling suits */}
      {variant !== 'minimal' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => {
            const suit = suits[i % 4];
            const randomDelay = Math.random() * 5;
            const randomX = Math.random() * 100;
            const randomDuration = 8 + Math.random() * 6;
            const randomSize = 2 + Math.random() * 2; // rem units
            
            return (
              <motion.div
                key={i}
                className={`absolute ${suit.color} pointer-events-none`}
                style={{
                  left: `${randomX}%`,
                  top: '-10%',
                  fontSize: `${randomSize}rem`,
                  fontWeight: 'bold'
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  rotate: [0, 360],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: randomDuration,
                  repeat: Infinity,
                  delay: randomDelay,
                  ease: "linear",
                  opacity: {
                    times: [0, 0.1, 0.9, 1]
                  }
                }}
              >
                {suit.symbol}
              </motion.div>
            );
          })}
        </div>
      )}
      {/* Animated background elements */}
      {variant !== 'minimal' && (
        <>

        </>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Card table felt texture
export function CardTableFelt({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Felt texture background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900" />
      
      {/* Felt texture pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Subtle leather border */}
      <div className="absolute inset-0 border-8 border-gradient-to-r from-amber-800 via-amber-700 to-amber-800 rounded-3xl shadow-2xl" />
      
      {/* Content */}
      <div className="relative z-10 p-8">
        {children}
      </div>
    </div>
  );
}

// Floating particles effect
export function FloatingParticles({ count = 20 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3
          }}
        />
      ))}
    </div>
  );
}

// Card suit decorative elements
export function CardSuitDecorations({ 
  suits = ['♠', '♥', '♦', '♣'] 
}: { 
  suits?: string[] 
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {suits.map((suit, i) => (
        <motion.div
          key={suit}
          className="absolute text-6xl text-white/10 font-bold select-none"
          style={{
            left: `${10 + i * 20}%`,
            top: `${20 + (i % 2) * 60}%`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            delay: i * 2
          }}
        >
          {suit}
        </motion.div>
      ))}
    </div>
  );
}

// Shimmer effect for premium feel
export function ShimmerEffect({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      />
    </div>
  );
}
