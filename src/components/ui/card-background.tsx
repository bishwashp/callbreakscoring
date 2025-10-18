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
    table: "bg-gradient-to-br from-green-900 via-green-800 to-green-950",
    casino: "bg-gradient-to-br from-red-950 via-red-900 to-black",
    elegant: "bg-gradient-to-br from-gray-900 via-gray-800 to-black",
    minimal: "bg-gradient-to-br from-gray-100 via-gray-50 to-white"
  };

  return (
    <div className={`min-h-screen ${variants[variant]} relative overflow-hidden ${className}`}>
      {/* Card deck stack in background */}
      {variant !== 'minimal' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          {/* Stacked deck effect */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-64 h-96 bg-gradient-to-br from-amber-100 via-white to-amber-50 rounded-2xl shadow-2xl border-4 border-amber-200"
              style={{
                transform: `rotate(${i * 2 - 7}deg) translateY(${i * 3}px) translateX(${i * 2}px)`,
                zIndex: 8 - i,
                boxShadow: `0 ${20 + i * 5}px ${40 + i * 10}px rgba(0,0,0,${0.4 - i * 0.03})`
              }}
            >
              {/* Card back pattern */}
              <div className="absolute inset-4 border-2 border-amber-300 rounded-xl">
                <div 
                  className="w-full h-full rounded-lg opacity-30"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 10px,
                      rgba(217, 119, 6, 0.1) 10px,
                      rgba(217, 119, 6, 0.1) 20px
                    ), repeating-linear-gradient(
                      -45deg,
                      transparent,
                      transparent 10px,
                      rgba(217, 119, 6, 0.1) 10px,
                      rgba(217, 119, 6, 0.1) 20px
                    )`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Animated background elements */}
      {variant !== 'minimal' && (
        <>
          {/* Floating cards */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-8 h-12 bg-white/10 border border-white/20 rounded-lg shadow-lg"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 4
                }}
              />
            ))}
          </div>
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
          
          {/* Light rays */}
          <div className="absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-full bg-gradient-to-b from-white/20 via-white/5 to-transparent"
                style={{
                  left: `${20 + i * 30}%`,
                  transform: `rotate(${15 + i * 10}deg)`,
                  transformOrigin: 'bottom'
                }}
                animate={{
                  opacity: [0, 0.3, 0],
                  scaleY: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 1
                }}
              />
            ))}
          </div>
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
      <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-green-800" />
      
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
