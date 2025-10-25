import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils/cn';
import { useReducedMotion } from '@/lib/utils/performance';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'card' | 'floating';
  animated?: boolean;
}

export const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ 
    className, 
    type = 'text', 
    label,
    error,
    success,
    icon,
    variant = 'default',
    animated = true,
    value: propValue,
    onChange,
    onFocus,
    onBlur,
    onDrag,
    onDragStart,
    onDragEnd,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState(propValue || '');
    const shouldReduceMotion = useReducedMotion();

    const variants = {
      default: "bg-white border-2 border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/20",
      card: "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/20",
      floating: "bg-white/90 backdrop-blur-sm border-2 border-gray-300 focus:border-primary focus:ring-4 focus:ring-primary/20 shadow-lg"
    };
    
    const numberInputProps = type === 'number' ? {
      inputMode: 'numeric' as const,
      pattern: '[0-9]*'
    } : {};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="relative">
        {label && (
          <motion.label
            className={cn(
              "block text-sm font-medium mb-2",
              error ? "text-red-600" : success ? "text-green-600" : "text-gray-700"
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {label}
          </motion.label>
        )}
        
        <div className="relative">
          {icon && (
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
            >
              {icon}
            </motion.div>
          )}
          
          <motion.div
            className="relative"
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <input
              ref={ref}
              type={type}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={cn(
                "flex min-h-[48px] w-full rounded-xl px-4 py-3 text-base font-medium",
                "transition-all duration-300 focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
                icon ? "pl-10" : "",
                error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" :
                success ? "border-green-500 focus:border-green-500 focus:ring-green-500/20" :
                variants[variant],
                className
              )}
              {...props}
              {...numberInputProps}
            />
          </motion.div>
          
          {/* Floating label effect */}
          {variant === 'floating' && label && (
            <motion.label
              className={cn(
                "absolute left-4 transition-all duration-300 pointer-events-none",
                isFocused || value ? "top-1 text-xs text-primary" : "top-1/2 transform -translate-y-1/2 text-base text-gray-500"
              )}
              animate={{
                y: isFocused || value ? -8 : 0,
                scale: isFocused || value ? 0.8 : 1,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {label}
            </motion.label>
          )}
          
          {/* Success/Error indicators */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                ✓
              </motion.div>
            )}
            {error && (
              <motion.div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                ✕
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        
        {/* Particle effect on focus - disabled on low-end devices */}
        {animated && isFocused && !shouldReduceMotion && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full"
                style={{
                  left: `${20 + i * 30}%`,
                  top: '50%',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [-10, -20, -30],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

// Special card-themed input for game scores
export function CardInput({ children, ...props }: AnimatedInputProps) {
  return (
    <AnimatedInput 
      variant="card" 
      {...props}
      className="relative group"
    >
      {/* Card corner decorations */}
      <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-red-400 rounded-tl-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
      <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-red-400 rounded-tr-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-red-400 rounded-bl-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-red-400 rounded-br-sm opacity-0 group-focus-within:opacity-100 transition-opacity" />
    </AnimatedInput>
  );
}
