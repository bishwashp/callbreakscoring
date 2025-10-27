import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard } from './animated-card';
import { AnimatedButton } from './animated-button';
import { useGameStore } from '@/store/gameStore';

export interface PageCardButton {
  icon: ReactNode;
  onClick: () => void;
  label: string; // For aria-label
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  showWarning?: boolean; // Show unsaved changes warning
}

export interface PageCardProps {
  // Navigation Buttons
  topLeftButton?: PageCardButton;
  topRightButtons?: PageCardButton[]; // Array to support multiple buttons
  
  // Header
  title: string;
  subtitle?: string;
  titleIcon?: ReactNode;
  
  // Content
  children: ReactNode;
  
  // Layout Options
  variant?: 'default' | 'elevated' | 'floating';
  contentClassName?: string;
  centerContent?: boolean; // Center the content vertically
  fullHeight?: boolean; // Make card fill viewport height
  
  // Styling
  className?: string;
  
  // Behavior
  showDivider?: boolean; // Show line between header and content
}

export function PageCard({
  topLeftButton,
  topRightButtons = [],
  title,
  subtitle,
  titleIcon,
  children,
  variant = 'elevated',
  contentClassName = '',
  centerContent = false,
  fullHeight = false,
  className = '',
  showDivider = false,
}: PageCardProps) {
  const { hasUnsavedChanges } = useGameStore();
  
  const handleNavigationWithWarning = (onClick: () => void, showWarning?: boolean) => {
    if (showWarning && hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Continue?')) {
        onClick();
      }
    } else {
      onClick();
    }
  };

  return (
    <div className={`min-h-screen p-4 flex items-center justify-center ${fullHeight ? 'h-screen' : ''}`}>
      <div className={`w-full ${className}`}>
        <AnimatedCard 
          variant={variant}
          className="overflow-hidden"
        >
          <div className="p-6 space-y-6">
            {/* Top Navigation Row */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start justify-between"
            >
              {/* Top Left Button */}
              <div className="flex-shrink-0">
                {topLeftButton ? (
                  <AnimatedButton
                    variant={topLeftButton.variant || 'secondary'}
                    onClick={() => handleNavigationWithWarning(
                      topLeftButton.onClick,
                      topLeftButton.showWarning
                    )}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0"
                    aria-label={topLeftButton.label}
                  >
                    {topLeftButton.icon}
                  </AnimatedButton>
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14" /> /* Spacer for alignment */
                )}
              </div>

              {/* Top Right Buttons */}
              <div className="flex-shrink-0 flex items-center space-x-2">
                {topRightButtons.map((button, index) => (
                  <AnimatedButton
                    key={index}
                    variant={button.variant || 'secondary'}
                    onClick={() => handleNavigationWithWarning(
                      button.onClick,
                      button.showWarning
                    )}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0"
                    aria-label={button.label}
                  >
                    {button.icon}
                  </AnimatedButton>
                ))}
                {topRightButtons.length === 0 && (
                  <div className="w-12 h-12 sm:w-14 sm:h-14" /> /* Spacer */
                )}
              </div>
            </motion.div>

            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-center space-y-2"
            >
              {titleIcon && (
                <div className="flex justify-center">
                  {titleIcon}
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-semibold">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* Optional Divider */}
            {showDivider && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="border-t-2 border-amber-200"
              />
            )}

            {/* Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={`${centerContent ? 'flex items-center justify-center' : ''} ${contentClassName}`}
            >
              {children}
            </motion.div>
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}