import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'up' | 'down' | 'fade' | 'scale' | 'card-flip';
}

const variants = {
  left: {
    initial: { x: 400, opacity: 0, rotateY: 15, scale: 0.9 },
    animate: { x: 0, opacity: 1, rotateY: 0, scale: 1 },
    exit: { x: -400, opacity: 0, rotateY: -15, scale: 0.9 }
  },
  right: {
    initial: { x: -400, opacity: 0, rotateY: -15, scale: 0.9 },
    animate: { x: 0, opacity: 1, rotateY: 0, scale: 1 },
    exit: { x: 400, opacity: 0, rotateY: 15, scale: 0.9 }
  },
  up: {
    initial: { y: 400, opacity: 0, rotateX: -15, scale: 0.9 },
    animate: { y: 0, opacity: 1, rotateX: 0, scale: 1 },
    exit: { y: -400, opacity: 0, rotateX: 15, scale: 0.9 }
  },
  down: {
    initial: { y: -400, opacity: 0, rotateX: 15, scale: 0.9 },
    animate: { y: 0, opacity: 1, rotateX: 0, scale: 1 },
    exit: { y: 400, opacity: 0, rotateX: -15, scale: 0.9 }
  },
  fade: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  },
  scale: {
    initial: { scale: 0.7, opacity: 0, rotateZ: 5 },
    animate: { scale: 1, opacity: 1, rotateZ: 0 },
    exit: { scale: 0.7, opacity: 0, rotateZ: -5 }
  },
  'card-flip': {
    initial: { rotateY: 180, opacity: 0, scale: 0.8 },
    animate: { rotateY: 0, opacity: 1, scale: 1 },
    exit: { rotateY: -180, opacity: 0, scale: 0.8 }
  }
};

export function PageTransition({ 
  children, 
  className = '',
  direction = 'fade'
}: PageTransitionProps) {
  const useCard3D = ['left', 'right', 'card-flip'].includes(direction);
  
  return (
    <motion.div
      className={`w-full ${className}`}
      variants={variants[direction]}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 26,
        duration: 0.5,
        mass: 0.8
      }}
      style={{
        transformStyle: useCard3D ? 'preserve-3d' : undefined,
        perspective: useCard3D ? '1200px' : undefined
      }}
    >
      {children}
    </motion.div>
  );
}

// Container for managing page transitions
interface PageTransitionContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransitionContainer({ 
  children, 
  className = '' 
}: PageTransitionContainerProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`min-h-screen ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Card-themed page transition
export function CardPageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="w-full"
      initial={{ 
        rotateY: 90, 
        opacity: 0,
        transformOrigin: "center center"
      }}
      animate={{ 
        rotateY: 0, 
        opacity: 1,
        transformOrigin: "center center"
      }}
      exit={{ 
        rotateY: -90, 
        opacity: 0,
        transformOrigin: "center center"
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.4
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      {children}
    </motion.div>
  );
}

// Staggered children animation
interface StaggeredChildrenProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function StaggeredChildren({ 
  children, 
  delay = 0.1,
  className = ''
}: StaggeredChildrenProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: delay
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { 
              opacity: 0, 
              y: 20,
              scale: 0.95
            },
            visible: { 
              opacity: 1, 
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
              }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Loading spinner with card theme
export function CardLoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full" />
        
        {/* Inner cards */}
        <div className="absolute inset-2">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-4 bg-white border border-gray-300 rounded-sm shadow-sm"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${i * 90}deg) translateX(12px)`
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
