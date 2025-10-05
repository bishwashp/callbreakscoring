import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils/cn';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'card' | 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'default' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  ripple?: boolean;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    children, 
    icon,
    loading = false,
    ripple = true,
    ...props 
  }, ref) => {
    // Separate motion props from button props
    const { onDrag, onDragStart, onDragEnd, ...buttonProps } = props as any;
    const variants = {
      default: "bg-primary text-white hover:bg-primary-700 shadow-lg hover:shadow-xl",
      card: "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 text-red-800 hover:from-red-100 hover:to-red-200 shadow-lg hover:shadow-xl",
      primary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl",
      secondary: "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 shadow-lg hover:shadow-xl",
      success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl",
      danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl"
    };

    const sizes = {
      sm: "min-h-[44px] px-4 py-2 text-sm",
      default: "min-h-[48px] px-6 py-3 text-base",
      lg: "min-h-[56px] px-8 py-4 text-lg"
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={{ 
          scale: 1.02,
          y: -2,
          transition: { type: "spring", stiffness: 400, damping: 17 }
        }}
        whileTap={{ 
          scale: 0.98,
          y: 0,
          transition: { type: "spring", stiffness: 400, damping: 17 }
        }}
        {...buttonProps}
      >
        {/* Ripple effect */}
        {ripple && (
          <motion.div
            className="absolute inset-0 bg-white opacity-0"
            whileTap={{
              opacity: [0, 0.3, 0],
              scale: [0, 1, 1.2],
              transition: { duration: 0.4 }
            }}
          />
        )}
        
        {/* Loading spinner */}
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        {/* Icon */}
        {icon && !loading && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {icon}
          </motion.div>
        )}
        
        {/* Content */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.span>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

// Special card-themed button
export function CardButton({ children, ...props }: AnimatedButtonProps) {
  return (
    <AnimatedButton 
      variant="card" 
      {...props}
      className="relative group"
    >
      {/* Card corner decorations */}
      <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-red-400 rounded-tl-sm" />
      <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-red-400 rounded-tr-sm" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-red-400 rounded-bl-sm" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-red-400 rounded-br-sm" />
      
      {children}
    </AnimatedButton>
  );
}
